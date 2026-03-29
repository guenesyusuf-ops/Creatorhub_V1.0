import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { generateInviteCode, verifyToken } from '@/lib/auth'
import { sendCreatorInvite } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  const { creatorId, email } = req.body
  if (!creatorId || !email) return res.status(400).json({ error: 'Fehlende Felder' })

  const { data: creator } = await supabase.from('creators').select('*').eq('id', creatorId).single()
  if (!creator) return res.status(404).json({ error: 'Creator nicht gefunden' })

  const code = generateInviteCode()
  await supabase.from('creators').update({ invite_code: code }).eq('id', creatorId)

  await sendCreatorInvite(email, creator.name, code)

  return res.status(200).json({ success: true, code })
}
