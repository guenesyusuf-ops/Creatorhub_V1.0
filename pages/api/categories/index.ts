import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'GET') {
    const { data } = await supabase.from('categories').select('*').order('position')
    return res.status(200).json(data || [])
  }

  if (req.method === 'POST') {
    if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })
    const { name, icon } = req.body
    const { data } = await supabase.from('categories').insert({ name, icon }).select().single()
    return res.status(200).json(data)
  }

  return res.status(405).end()
}
