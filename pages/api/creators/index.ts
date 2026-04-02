// v2.0 – PATCH erlaubt Creator sein eigenes Foto zu updaten
import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  // GET: Load all creators
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('creators')
      .select('*')
      .order('created_at')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  // POST: Create new creator – nur Admin
  if (req.method === 'POST') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

    const { name, initials, color_from, color_to, email, age, gender, country,
            tags, description, instagram, verguetung, provision, fixbetrag,
            notizen, notizen_creator, kids, kids_ages, kids_on_vid } = req.body
    if (!name) return res.status(400).json({ error: 'Name erforderlich' })

    const { data, error } = await supabaseAdmin
      .from('creators')
      .insert({
        name, initials: initials || name.slice(0,2).toUpperCase(),
        color_from: color_from || '#7c3aed',
        color_to: color_to || '#c8f035',
        email, age, gender, country, tags, description,
        instagram, verguetung, provision, fixbetrag,
        notizen, notizen_creator, kids, kids_ages, kids_on_vid
      })
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // PATCH: Update creator
  if (req.method === 'PATCH') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'ID fehlt' })

    // Creator darf nur sein eigenes Foto updaten
    if (decoded.role !== 'admin') {
      const creatorId = decoded.creator_id || decoded.id
      if (String(creatorId) !== String(id)) {
        return res.status(403).json({ error: 'Kein Zugriff' })
      }
      const allowedFields = ['photo']
      const filteredFields: any = {}
      for (const key of allowedFields) {
        if (fields[key] !== undefined) filteredFields[key] = fields[key]
      }
      if (Object.keys(filteredFields).length === 0) {
        return res.status(400).json({ error: 'Keine erlaubten Felder' })
      }
      const { data, error } = await supabaseAdmin
        .from('creators')
        .update(filteredFields)
        .eq('id', id)
        .select().single()
      if (error) return res.status(500).json({ error: error.message })
      return res.status(200).json(data)
    }

    // Admin darf alles updaten
    delete fields.invite_code
    delete fields.created_at
    const { data, error } = await supabaseAdmin
      .from('creators')
      .update(fields)
      .eq('id', id)
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // DELETE: nur Admin
  if (req.method === 'DELETE') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'ID fehlt' })
    await supabaseAdmin.from('uploads').delete().eq('creator_id', id)
    await supabaseAdmin.from('folders').delete().eq('creator_id', id)
    const { error } = await supabaseAdmin.from('creators').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
