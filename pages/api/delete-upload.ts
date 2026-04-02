
// v1.0 – Löscht eine Datei aus R2 und Supabase
// Separate Route weil upload.ts bodyParser: false hat
import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = 'creatorhub-media'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'DELETE') return res.status(405).json({ error: 'Method not allowed' })

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  const { uploadId, r2Key } = req.body
  if (!uploadId) return res.status(400).json({ error: 'uploadId erforderlich' })

  // R2 löschen
  if (r2Key) {
    try {
      await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: r2Key }))
      console.log('[DELETE] R2 gelöscht:', r2Key)
    } catch (e: any) {
      console.warn('[DELETE] R2 Fehler (non-fatal):', e.message)
    }
  }

  // Supabase löschen
  const { error } = await supabaseAdmin.from('uploads').delete().eq('id', String(uploadId))
  if (error) {
    console.error('[DELETE] Supabase Fehler:', error.message)
    return res.status(500).json({ error: error.message })
  }

  console.log('[DELETE] Erfolgreich gelöscht:', uploadId)
  return res.status(200).json({ success: true })
}
