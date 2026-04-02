// v2.1 – DELETE wieder hinzugefügt, drei Upload-Modi beibehalten
import type { NextApiRequest, NextApiResponse } from 'next'
import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { supabaseAdmin } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import formidable from 'formidable'

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

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  try { jwt.verify(auth, process.env.JWT_SECRET!) } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // ── DELETE ────────────────────────────────────────────────────────────────
  if (req.method === 'DELETE') {
    // bodyParser ist disabled, also Body manuell lesen
    const buffers: Buffer[] = []
    for await (const chunk of req) buffers.push(chunk)
    const body = JSON.parse(Buffer.concat(buffers).toString())

    const { uploadId, r2Key } = body
    if (!uploadId) return res.status(400).json({ error: 'uploadId erforderlich' })

    // R2 löschen
    if (r2Key) {
      try {
        await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: r2Key }))
      } catch (e: any) {
        console.warn('[DELETE] R2 Fehler (non-fatal):', e.message)
      }
    }

    // Supabase löschen
    const { error } = await supabaseAdmin.from('uploads').delete().eq('id', uploadId)
    if (error) return res.status(500).json({ error: error.message })

    return res.status(200).json({ success: true })
  }

  // ── POST ──────────────────────────────────────────────────────────────────
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const form = formidable({ maxFileSize: 500 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error: ' + err.message })

    const get = (f: any) => Array.isArray(f) ? f[0] : f

    const creatorId = get(fields.creatorId)
    const tab       = get(fields.tab) || 'bilder'
    const name      = get(fields.name) || get(fields.linkName) || 'Datei'
    const batch     = get(fields.batch) || null
    const product   = get(fields.product) || null
    const linkUrl   = get(fields.linkUrl) || null
    const publicUrl = get(fields.publicUrl) || null
    const r2Key     = get(fields.r2Key) || null
    const fileSize  = get(fields.fileSize) ? parseInt(get(fields.fileSize)) : null
    const mimeType  = get(fields.mimeType) || null

    if (!creatorId) return res.status(400).json({ error: 'creatorId fehlt' })

    // ── Modus A: Presigned URL Flow ─────────────────────────────────────────
    if (publicUrl && r2Key) {
      try {
        const { data: uploadRecord, error: uploadError } = await supabaseAdmin
          .from('uploads')
          .insert({
            creator_id: creatorId,
            name,
            batch,
            product,
            category: tab,
            tab,
            file_url: publicUrl,
            file_key: r2Key,
            r2_key: r2Key,
            file_name: name,
            file_size: fileSize,
            mime_type: mimeType,
            seen_by_admin: false,
          })
          .select()
          .single()

        if (uploadError) {
          console.error('DB upload error:', JSON.stringify(uploadError))
          return res.status(500).json({ error: uploadError.message })
        }

        await saveNotification(creatorId, name, tab, uploadRecord?.id)
        return res.status(200).json({ success: true, upload: uploadRecord })
      } catch (e: any) {
        return res.status(500).json({ error: e.message })
      }
    }

    // ── Modus B: Link-Upload ────────────────────────────────────────────────
    if (linkUrl) {
      try {
        const { data: uploadRecord, error: uploadError } = await supabaseAdmin
          .from('uploads')
          .insert({
            creator_id: creatorId,
            name,
            batch,
            product,
            category: tab,
            tab,
            file_url: linkUrl,
            file_type: 'link',
            file_name: name,
            seen_by_admin: false,
          })
          .select()
          .single()

        if (uploadError) {
          console.error('DB upload error:', JSON.stringify(uploadError))
          return res.status(500).json({ error: uploadError.message })
        }

        await saveNotification(creatorId, name, tab, uploadRecord?.id)
        return res.status(200).json({ success: true, upload: uploadRecord })
      } catch (e: any) {
        return res.status(500).json({ error: e.message })
      }
    }

    return res.status(400).json({ error: 'Keine Datei, kein Link und kein publicUrl angegeben' })
  })
}

async function saveNotification(creatorId: string, name: string, tab: string, uploadId: string | null) {
  try {
    const { data: creator } = await supabaseAdmin
      .from('creators')
      .select('name')
      .eq('id', creatorId)
      .single()

    const creatorName = creator?.name || 'Ein Creator'
    const labels: any = { bilder: 'Bilder', videos: 'Video', roh: 'Rohmaterial', auswertung: 'Auswertung' }

    await supabaseAdmin.from('notifications').insert({
      type: 'upload',
      creator_id: creatorId,
      creator_name: creatorName,
      message: `${creatorName} hat ${labels[tab] || tab} hochgeladen: "${name}"`,
      upload_id: uploadId,
      dismissed: false,
    })
  } catch (e) {
    console.warn('Notification error (non-fatal):', e)
  }
}
