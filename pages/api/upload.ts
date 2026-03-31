import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3'
import jwt from 'jsonwebtoken'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'
import { supabaseAdmin } from '@/lib/supabase'

export const config = { api: { bodyParser: false } }

const R2 = new S3Client({
  region: 'auto',
  endpoint: `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com`,
  credentials: {
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
  },
})

const BUCKET = 'creatorhub-media'
const PUBLIC_URL = process.env.R2_PUBLIC_URL || `https://f1722b37e4364e5ab611384fce036e3f.r2.cloudflarestorage.com`

function getFileType(mime: string, name: string): string {
  if (mime.startsWith('image/')) return 'image'
  if (mime.startsWith('video/')) return 'video'
  if (mime === 'application/pdf') return 'pdf'
  const ext = path.extname(name).toLowerCase()
  if (['.jpg','.jpeg','.png','.gif','.webp','.svg'].includes(ext)) return 'image'
  if (['.mp4','.mov','.avi','.webm','.mkv'].includes(ext)) return 'video'
  if (ext === '.pdf') return 'pdf'
  return 'file'
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // DELETE: Datei löschen
  if (req.method === 'DELETE') {
    const auth = req.headers.authorization?.split(' ')[1]
    if (!auth) return res.status(401).json({ error: 'Unauthorized' })
    try { jwt.verify(auth, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Invalid token' }) }

    const { uploadId, r2Key } = req.body as any
    if (!uploadId) return res.status(400).json({ error: 'uploadId required' })

    // Delete from R2 if key exists
    if (r2Key) {
      try {
        await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: r2Key }))
      } catch (e: any) {
        console.warn('[UPLOAD] R2 delete failed (non-fatal):', e.message)
      }
    }

    // Delete from Supabase
    const { error } = await supabaseAdmin.from('uploads').delete().eq('id', uploadId)
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ success: true })
  }

  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // AUTH — accept both admin and creator tokens
  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  let decoded: any
  try { decoded = jwt.verify(auth, process.env.JWT_SECRET!) } catch { return res.status(401).json({ error: 'Invalid token' }) }

  const form = formidable({ maxFileSize: 500 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error: ' + err.message })

    const creatorId = Array.isArray(fields.creatorId) ? fields.creatorId[0] : fields.creatorId
    const tab = (Array.isArray(fields.tab) ? fields.tab[0] : fields.tab) || 'bilder'
    const linkUrl = Array.isArray(fields.linkUrl) ? fields.linkUrl[0] : fields.linkUrl
    const linkName = Array.isArray(fields.linkName) ? fields.linkName[0] : fields.linkName

    if (!creatorId) return res.status(400).json({ error: 'creatorId required' })

    // LINK UPLOAD (YouTube, Google Drive etc.)
    if (linkUrl) {
      const { data, error } = await supabaseAdmin.from('uploads').insert({
        creator_id: creatorId,
        file_name: linkName || linkUrl,
        file_url: linkUrl,
        file_type: 'link',
        mime_type: 'text/uri-list',
        file_size: 0,
        tab,
        r2_key: null,
        seen_by_admin: false,
      }).select().single()

      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json({ success: true, upload: data })
    }

    // FILE UPLOAD
    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ error: 'No file provided' })

    const safeName = (file.originalFilename || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `creators/${creatorId}/${tab}/${Date.now()}_${safeName}`
    const fileType = getFileType(file.mimetype || '', file.originalFilename || '')

    try {
      const fileBuffer = fs.readFileSync(file.filepath)

      await R2.send(new PutObjectCommand({
        Bucket: BUCKET,
        Key: key,
        Body: fileBuffer,
        ContentType: file.mimetype || 'application/octet-stream',
        ContentLength: file.size,
      }))

      fs.unlinkSync(file.filepath)

      const fileUrl = `${PUBLIC_URL}/${BUCKET}/${key}`

      // Save to Supabase — persistent, survives reload/logout
      const { data, error } = await supabaseAdmin.from('uploads').insert({
        creator_id: creatorId,
        file_name: file.originalFilename || safeName,
        file_url: fileUrl,
        file_type: fileType,
        mime_type: file.mimetype,
        file_size: file.size,
        tab,
        r2_key: key,
        seen_by_admin: false,
      }).select().single()

      if (error) {
        console.error('[UPLOAD] Supabase insert failed:', error.message)
        return res.status(500).json({ error: 'DB insert failed: ' + error.message })
      }

      return res.status(200).json({ success: true, upload: data, url: fileUrl })
    } catch (uploadErr: any) {
      console.error('R2 upload error:', uploadErr)
      return res.status(500).json({ error: 'R2 upload failed: ' + uploadErr.message })
    }
  })
}
