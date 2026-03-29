import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { hashPassword, generatePassword, verifyToken } from '@/lib/auth'
import { sendTeamInvite } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  const { name, email, role } = req.body
  if (!name || !email || !role) return res.status(400).json({ error: 'Fehlende Felder' })

  const password = generatePassword()
  const hash = await hashPassword(password)

  const { data, error } = await supabase.from('users').insert({
    name, email: email.toLowerCase(), password_hash: hash, role, status: 'pending', must_change_password: true
  }).select().single()

  if (error) return res.status(400).json({ error: 'E-Mail bereits registriert' })

  await sendTeamInvite(email, name, password)

  return res.status(200).json({ success: true, user: data })
}
