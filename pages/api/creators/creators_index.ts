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

async function deleteFromR2(key: string) {
  try {
    await R2.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: key }))
  } catch (e: any) {
    console.warn('[R2 DELETE] Non-fatal:', e.message)
  }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  // ── GET: alle Creators laden
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('creators')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  // ── POST: Creator anlegen
  if (req.method === 'POST') {
    const {
      name, initials, email, instagram, age, gender, country, tags,
      description, kids, kids_on_vid, kids_ages, notizen, notizen_creator,
      verguetung, provision, fixbetrag, color_from, photo, status
    } = req.body

    if (!name || !initials) return res.status(400).json({ error: 'Name und Kürzel erforderlich' })

    const { data, error } = await supabaseAdmin
      .from('creators')
      .insert({
        name, initials, email: email || null, instagram: instagram || null,
        age: age || null, gender: gender || null, country: country || null,
        tags: tags || [], description: description || null,
        kids: kids || false, kids_on_vid: kids_on_vid || false,
        kids_ages: kids_ages || [],
        notizen: notizen || null, notizen_creator: notizen_creator || null,
        verguetung: verguetung || 'provision',
        provision: provision || null, fixbetrag: fixbetrag || null,
        color_from: color_from || '#7c3aed',
        photo: photo || null,
        status: status || 'ausstehend',
      })
      .select()
      .single()

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // ── PATCH: Creator bearbeiten
  if (req.method === 'PATCH') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'ID erforderlich' })

    // Nur erlaubte Felder updaten
    const allowed = [
      'name', 'initials', 'email', 'instagram', 'age', 'gender', 'country',
      'tags', 'description', 'kids', 'kids_on_vid', 'kids_ages',
      'notizen', 'notizen_creator', 'verguetung', 'provision', 'fixbetrag',
      'photo', 'status', 'invite_code', 'last_login',
      'vertrag_url', 'vertrag_name'
    ]
    const update: Record<string, any> = {}
    for (const key of allowed) {
      if (fields[key] !== undefined) update[key] = fields[key]
    }

    const { error } = await supabaseAdmin
      .from('creators')
      .update(update)
      .eq('id', String(id))

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // ── DELETE: Creator + alle Uploads aus R2 + DB löschen
  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'ID erforderlich' })

    // 1. Alle Uploads dieses Creators aus DB holen
    const { data: uploads } = await supabaseAdmin
      .from('uploads')
      .select('id, r2_key, file_key')
      .eq('creator_id', String(id))

    // 2. Alle Dateien aus R2 löschen
    if (uploads && uploads.length > 0) {
      await Promise.all(uploads.map(u => {
        const key = u.r2_key || u.file_key
        return key ? deleteFromR2(key) : Promise.resolve()
      }))
    }

    // 3. Vertrag aus R2 löschen falls vorhanden
    const { data: creator } = await supabaseAdmin
      .from('creators')
      .select('vertrag_url, vertrag_name')
      .eq('id', String(id))
      .single()

    if (creator?.vertrag_url) {
      // R2 key aus URL extrahieren
      const urlParts = creator.vertrag_url.split('/')
      const key = urlParts.slice(3).join('/')
      if (key) await deleteFromR2(key)
    }

    // 4. Uploads aus Supabase löschen
    await supabaseAdmin.from('uploads').delete().eq('creator_id', String(id))

    // 5. Kommentare löschen
    await supabaseAdmin.from('comments').delete().eq('creator_id', String(id))

    // 6. Ordner/Folders löschen falls vorhanden
    await supabaseAdmin.from('folders').delete().eq('creator_id', String(id)).throwOnError().then(() => {}).catch(() => {})

    // 7. Creator selbst löschen
    const { error } = await supabaseAdmin
      .from('creators')
      .delete()
      .eq('id', String(id))

    if (error) return res.status(500).json({ error: error.message })

    console.log(`[DELETE CREATOR] ${id} – ${uploads?.length || 0} Uploads gelöscht`)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
