import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { comparePassword, signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { email, password } = req.body
  if (!email || !password) return res.status(400).json({ error: 'Fehlende Felder' })

  const { data: user, error } = await supabase
    .from('users')
    .select('*')
    .eq('email', email.toLowerCase())
    .single()

  if (error || !user) return res.status(401).json({ error: 'E-Mail oder Passwort falsch' })

  const valid = await comparePassword(password, user.password_hash)
  if (!valid) return res.status(401).json({ error: 'E-Mail oder Passwort falsch' })

  if (user.status === 'pending') {
    await supabase.from('users').update({ status: 'active' }).eq('id', user.id)
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role, name: user.name })

  return res.status(200).json({
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role, must_change_password: user.must_change_password }
  })
}
