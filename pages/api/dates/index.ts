import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'POST') {
    const { creator_id, month } = req.body
    const { data } = await supabase.from('dates').insert({ creator_id, month }).select().single()
    return res.status(200).json(data)
  }

  if (req.method === 'GET') {
    const { creator_id } = req.query
    const { data } = await supabase.from('dates').select('*, links(*)').eq('creator_id', creator_id as string).order('month', { ascending: false })
    return res.status(200).json(data || [])
  }

  return res.status(405).end()
}
