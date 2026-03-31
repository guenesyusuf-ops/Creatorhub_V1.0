import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'GET') {
    const { creatorId } = req.query
    if (!creatorId) return res.status(400).json({ error: 'creatorId fehlt' })
    const { data, error } = await supabaseAdmin
      .from('folders')
      .select('*')
      .eq('creator_id', creatorId)
      .order('created_at')
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    const { creator_id, tab, name, batch, date, deadline, prods, tags } = req.body
    if (!creator_id || !name) return res.status(400).json({ error: 'creator_id und name erforderlich' })
    const { data, error } = await supabaseAdmin
      .from('folders')
      .insert({ creator_id, tab: tab || 'bilder', name, batch, date, deadline, prods: prods || [], tags: tags || [] })
      .select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'PATCH') {
    const { id, ...fields } = req.body
    if (!id) return res.status(400).json({ error: 'id fehlt' })
    delete fields.creator_id; delete fields.created_at
    const { data, error } = await supabaseAdmin
      .from('folders').update(fields).eq('id', id).select().single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id fehlt' })
    const { error } = await supabaseAdmin.from('folders').delete().eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
