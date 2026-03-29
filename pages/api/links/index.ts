import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'
import { notifyAdminsNewLink } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'POST') {
    const { date_id, creator_id, title, url } = req.body
    if (!date_id || !creator_id || !title || !url)
      return res.status(400).json({ error: 'Fehlende Felder' })

    // Creators can only add to their own folder
    if (decoded.role === 'creator') {
      const { data: creator } = await supabase.from('creators').select('user_id, name').eq('id', creator_id).single()
      if (!creator || creator.user_id !== decoded.id)
        return res.status(403).json({ error: 'Kein Zugriff' })
    }

    const { data: link } = await supabase.from('links').insert({
      date_id, creator_id, title, url, created_by: decoded.id
    }).select().single()

    // Get creator name for notification
    const { data: creator } = await supabase.from('creators').select('name').eq('id', creator_id).single()
    if (creator) {
      await notifyAdminsNewLink(creator.name, title, url)
    }

    return res.status(200).json(link)
  }

  if (req.method === 'GET') {
    const { date_id } = req.query
    const { data } = await supabase.from('links').select('*').eq('date_id', date_id as string).order('created_at')
    return res.status(200).json(data || [])
  }

  return res.status(405).end()
}
