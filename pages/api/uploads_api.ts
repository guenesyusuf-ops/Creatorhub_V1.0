import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

function verifyToken(req: NextApiRequest): any {
  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return null
  try { return jwt.verify(auth, process.env.JWT_SECRET!) } catch { return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  // GET - load uploads for a creator
  if (req.method === 'GET') {
    const { creator_id } = req.query
    if (!creator_id) return res.status(400).json({ error: 'creator_id required' })

    const { data, error } = await supabase
      .from('uploads')
      .select('*')
      .eq('creator_id', creator_id)
      .order('created_at', { ascending: false })

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE - only admins
  if (req.method === 'DELETE') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Nur Admins dürfen Dateien löschen' })

    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })

    // Get the file key first
    const { data: upload } = await supabase.from('uploads').select('file_key').eq('id', id).single()

    if (upload?.file_key) {
      try {
        await R2.send(new DeleteObjectCommand({ Bucket: 'creatorhub-media', Key: upload.file_key }))
      } catch (e) {
        console.error('R2 delete error:', e)
      }
    }

    const { error } = await supabase.from('uploads').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
