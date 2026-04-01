import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import jwt from 'jsonwebtoken'

function verifyToken(req: NextApiRequest): any {
  const auth = req.headers.authorization?.split(' ')[1]
  if (!auth) return null
  try { return jwt.verify(auth, process.env.JWT_SECRET!) } catch { return null }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const decoded = verifyToken(req)
  if (!decoded) return res.status(401).json({ error: 'Unauthorized' })

  // GET - load undismissed notifications (admins only)
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('dismissed', false)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data)
  }

  // PATCH - dismiss a notification
  if (req.method === 'PATCH') {
    const { id } = req.body
    if (!id) return res.status(400).json({ error: 'id required' })

    const { error } = await supabase.from('notifications').update({ dismissed: true }).eq('id', id)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  // DELETE - dismiss all
  if (req.method === 'DELETE') {
    const { error } = await supabase.from('notifications').update({ dismissed: true }).eq('dismissed', false)
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
