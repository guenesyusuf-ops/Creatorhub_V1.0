import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Code fehlt' })

  const { data: creator } = await supabase
    .from('creators')
    .select('*, categories(name)')
    .eq('invite_code', code.trim().toUpperCase())
    .single()

  if (!creator) return res.status(401).json({ error: 'Ungültiger Code' })

  const token = signToken({ id: creator.user_id || creator.id, role: 'creator', name: creator.name, creator_id: creator.id })

  return res.status(200).json({ token, creator })
}
