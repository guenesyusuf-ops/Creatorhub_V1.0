// v2.0 – Unterstützt drei Upload-Modi:
// 1. Datei-Upload (direkt durch Vercel, für kleine Dateien)
// 2. Presigned URL Flow (Datei bereits in R2, nur Supabase-Eintrag)
// 3. Link-Upload (Google Drive o.ä.)

import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'
import formidable from 'formidable'

export const config = { api: { bodyParser: false } }

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })

  try { jwt.verify(auth, process.env.JWT_SECRET!) } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  const form = formidable({ maxFileSize: 500 * 1024 * 1024 })

  form.parse(req, async (err, fields, files) => {
    if (err) return res.status(500).json({ error: 'Parse error: ' + err.message })

    const get = (f: any) => Array.isArray(f) ? f[0] : f

    const creatorId  = get(fields.creatorId)
    const tab        = get(fields.tab) || 'bilder'
    const name       = get(fields.name) || get(fields.linkName) || 'Datei'
    const batch      = get(fields.batch) || null
    const product    = get(fields.product) || null
    const linkUrl    = get(fields.linkUrl) || null
    const publicUrl  = get(fields.publicUrl) || null
    const r2Key      = get(fields.r2Key) || null
    const fileSize   = get(fields.fileSize) ? parseInt(get(fields.fileSize)) : null
    const mimeType   = get(fields.mimeType) || null

    if (!creatorId) return res.status(400).json({ error: 'creatorId fehlt' })

    const file = Array.isArray(files.file) ? files.file[0] : files.file

    // ── Modus bestimmen ────────────────────────────────────────────────────
    // Modus A: Presigned URL Flow – Datei ist bereits in R2
    if (publicUrl && r2Key && !file) {
      try {
        const { data: uploadRecord, error: uploadError } = await supabase
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

    // ── Modus B: Link-Upload (Google Drive etc.) ───────────────────────────
    if (linkUrl && !file) {
      try {
        const { data: uploadRecord, error: uploadError } = await supabase
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

    // ── Modus C: Direkter Datei-Upload durch Vercel (kleine Dateien) ───────
    if (!file) return res.status(400).json({ error: 'No file provided' })

    // Dieser Modus bleibt für kleine Dateien als Fallback
    return res.status(400).json({ error: 'Direkter Datei-Upload nicht mehr unterstützt. Bitte Presigned URL verwenden.' })
  })
}

async function saveNotification(creatorId: string, name: string, tab: string, uploadId: string | null) {
  try {
    const { data: creator } = await supabase
      .from('creators')
      .select('name')
      .eq('id', creatorId)
      .single()

    const creatorName = creator?.name || 'Ein Creator'
    const categoryLabels: any = { bilder: 'Bilder', videos: 'Video', roh: 'Rohmaterial', auswertung: 'Auswertung' }
    const catLabel = categoryLabels[tab] || tab

    await supabase.from('notifications').insert({
      type: 'upload',
      creator_id: creatorId,
      creator_name: creatorName,
      message: `${creatorName} hat ${catLabel} hochgeladen: "${name}"`,
      upload_id: uploadId,
      dismissed: false,
    })
  } catch (e) {
    console.warn('Notification error (non-fatal):', e)
  }
}
