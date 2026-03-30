import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  if (!code) return res.status(400).json({ error: 'Code fehlt' })

  // First try: find in creators table by invite_code
  const { data: creator } = await supabase
    .from('creators')
    .select('*')
    .eq('invite_code', code.trim().toUpperCase())
    .single()

  if (!creator) return res.status(401).json({ error: 'Ungültiger Code. Bitte prüfe deinen Einladungscode.' })

  // Update last login
  await supabase.from('creators').update({ last_login: new Date().toISOString() }).eq('id', creator.id)

  const token = signToken({ 
    id: creator.id, 
    role: 'creator', 
    name: creator.name, 
    creator_id: creator.id 
  })

  return res.status(200).json({ token, creator })
}
