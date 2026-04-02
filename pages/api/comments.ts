import type { NextApiRequest, NextApiResponse } from 'next'
import { createClient } from '@supabase/supabase-js'
import jwt from 'jsonwebtoken'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return res.status(401).json({ error: 'Unauthorized' })
  try { jwt.verify(auth, process.env.JWT_SECRET!) } catch {
    return res.status(401).json({ error: 'Invalid token' })
  }

  // GET – Kommentare für ein Upload laden
  if (req.method === 'GET') {
    const { upload_id } = req.query
    if (!upload_id) return res.status(400).json({ error: 'upload_id fehlt' })
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('upload_id', upload_id)
      .order('created_at', { ascending: true })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // POST – neuen Kommentar schreiben
  if (req.method === 'POST') {
    const { upload_id, creator_id, author_role, author_name, message } = req.body
    if (!upload_id || !creator_id || !author_role || !author_name || !message)
      return res.status(400).json({ error: 'Fehlende Felder' })
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        upload_id,
        creator_id,
        author_role,
        author_name,
        message,
        read_by_creator: author_role === 'creator',
        read_by_admin: author_role === 'admin'
      }])
      .select()
      .single()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // PATCH – als gelesen markieren
  if (req.method === 'PATCH') {
    const { upload_id, role } = req.body
    if (!upload_id || !role) return res.status(400).json({ error: 'Fehlende Felder' })
    const field = role === 'creator' ? 'read_by_creator' : 'read_by_admin'
    const { error } = await supabase
      .from('comments')
      .update({ [field]: true })
      .eq('upload_id', upload_id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ ok: true })
  }

  return res.status(405).json({ error: 'Method not allowed' })
}
