import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import formidable from 'formidable'
import fs from 'fs'
import path from 'path'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })

  let decoded: any
  try { decoded = jwt.verify(auth, process.env.JWT_SECRET!) } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const form = formidable({ maxFileSize: 500 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Upload error: ' + err.message })

    const file = Array.isArray(files.file) ? files.file[0] : files.file
    if (!file) return res.status(400).json({ error: 'No file provided' })

    const creatorId = Array.isArray(fields.creatorId) ? fields.creatorId[0] : fields.creatorId
    const category = Array.isArray(fields.tab) ? fields.tab[0] : fields.tab || 'bilder'
    const name = Array.isArray(fields.name) ? fields.name[0] : fields.name || file.originalFilename || 'Datei'
    const batch = Array.isArray(fields.batch) ? fields.batch[0] : fields.batch || ''
    const product = Array.isArray(fields.product) ? fields.product[0] : fields.product || ''

    const safeName = (file.originalFilename || 'file').replace(/[^a-zA-Z0-9._-]/g, '_')
    const key = `creators/${creatorId}/${category}/${Date.now()}_${safeName}`

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

      const fileUrl = `${PUBLIC_URL}/${key}`

      // Save to uploads table
      const { data: uploadRecord, error: uploadError } = await supabase
        .from('uploads')
        .insert({
          creator_id: creatorId,
          name,
          batch: batch || null,
          product: product || null,
          category,
          file_url: fileUrl,
          file_key: key,
          file_name: file.originalFilename,
          file_size: file.size,
          mime_type: file.mimetype,
        })
        .select()
        .single()

      if (uploadError) {
        console.error('DB upload error:', uploadError)
      }

      // Get creator name for notification
      const { data: creator } = await supabase
        .from('creators')
        .select('name')
        .eq('id', creatorId)
        .single()

      const creatorName = creator?.name || 'Ein Creator'
      const categoryLabels: any = { bilder: 'Bilder', videos: 'Video', roh: 'Rohmaterial', auswertung: 'Auswertung' }
      const catLabel = categoryLabels[category] || category

      // Create notification
      await supabase.from('notifications').insert({
        type: 'upload',
        creator_id: creatorId,
        creator_name: creatorName,
        message: `${creatorName} hat ${catLabel} hochgeladen: "${name}"`,
        upload_id: uploadRecord?.id || null,
        dismissed: false,
      })

      return res.status(200).json({
        success: true,
        key,
        url: fileUrl,
        fileName: file.originalFilename,
        fileSize: file.size,
        mimeType: file.mimetype,
        uploadId: uploadRecord?.id,
      })
    } catch (uploadErr: any) {
      console.error('R2 upload error:', uploadErr)
      return res.status(500).json({ error: 'R2 upload failed: ' + uploadErr.message })
    }
  })
}
