import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'GET') {
    const { creatorId } = req.query
    if (!creatorId) return res.status(400).json({ error: 'creatorId required' })

    let query = supabaseAdmin
      .from('uploads')
      .select('*')
      .order('created_at', { ascending: false })

    if (creatorId !== 'all') {
      query = query.eq('creator_id', creatorId)
    }

    const { data, error } = await query
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data || [])
  }

  if (req.method === 'PATCH') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })
    const { creatorId } = req.body
    if (!creatorId) return res.status(400).json({ error: 'creatorId required' })

    const { error } = await supabaseAdmin
      .from('uploads')
      .update({ seen_by_admin: true })
      .eq('creator_id', creatorId)
      .eq('seen_by_admin', false)

    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
