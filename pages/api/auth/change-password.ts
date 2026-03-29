import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { hashPassword, verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  if (!token) return res.status(401).json({ error: 'Nicht autorisiert' })

  const decoded = verifyToken(token)
  if (!decoded) return res.status(401).json({ error: 'Token ungültig' })

  const { newPassword } = req.body
  if (!newPassword || newPassword.length < 8)
    return res.status(400).json({ error: 'Passwort muss mindestens 8 Zeichen haben' })

  const hash = await hashPassword(newPassword)
  await supabase.from('users').update({ password_hash: hash, must_change_password: false }).eq('id', decoded.id)

  return res.status(200).json({ success: true })
}
