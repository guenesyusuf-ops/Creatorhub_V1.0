import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'GET') {
    let query = supabase.from('creators').select('*, categories(name,icon), dates(id,month, links(id,title,url,created_at))')
    // Creators only see their own folder
    if (decoded.role === 'creator') {
      query = query.eq('user_id', decoded.id)
    }
    const { data } = await query.order('created_at')
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })
    const { name, initials, color_from, color_to, category_id } = req.body
    const { data } = await supabase.from('creators').insert({ name, initials, color_from, color_to, category_id }).select().single()
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
