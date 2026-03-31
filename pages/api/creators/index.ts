import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  // GET: Load all creators with full profile
  if (req.method === 'GET') {
    const { data, error } = await supabaseAdmin
      .from('creators')
      .select('*')
      .order('created_at')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  // POST: Create new creator
  if (req.method === 'POST') {
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

  // PATCH: Update creator profile
  if (req.method === 'PATCH') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'ID fehlt' })
    // Remove fields that shouldn't be updated directly
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

  // DELETE: Remove creator + uploads + folders
  if (req.method === 'DELETE') {
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
