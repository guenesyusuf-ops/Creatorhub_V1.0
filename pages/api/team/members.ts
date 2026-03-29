import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  if (req.method === 'GET') {
    const { data } = await supabase.from('users').select('id,name,email,role,status,created_at').order('created_at')
    return res.status(200).json(data || [])
  }

  if (req.method === 'PATCH') {
    const { id, role } = req.body
    await supabase.from('users').update({ role }).eq('id', id)
    return res.status(200).json({ success: true })
  }

  if (req.method === 'DELETE') {
    const { id } = req.body
    await supabase.from('users').delete().eq('id', id)
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
