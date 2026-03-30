import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { signToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const { code } = req.body
  const ts = new Date().toISOString()

  if (!code) {
    console.error(`[LOGIN] ${ts} | No code in request body`)
    return res.status(400).json({ error: 'Code fehlt' })
  }

  const normalizedCode = code.trim().toUpperCase()
  console.log(`[LOGIN] ${ts} | Looking up code: ${normalizedCode}`)

  const { data: creator, error } = await supabaseAdmin
    .from('creators')
    .select('*')
    .eq('invite_code', normalizedCode)
    .maybeSingle()

  if (error) {
    console.error(`[LOGIN] ${ts} | DB error:`, JSON.stringify(error))
    return res.status(500).json({ error: 'Datenbankfehler' })
  }

  if (!creator) {
    // Log how many active codes exist to help debug
    const { count } = await supabaseAdmin
      .from('creators')
      .select('*', { count: 'exact', head: true })
      .not('invite_code', 'is', null)
    console.error(`[LOGIN] ${ts} | Code not found: ${normalizedCode} | Active codes in DB: ${count}`)
    return res.status(401).json({ error: 'Ungültiger Code. Bitte fordere einen neuen Link an.' })
  }

  console.log(`[LOGIN] ${ts} | Found creator: ${creator.name} (id=${creator.id})`)

  // Update last_login if column exists
  const { error: updateError } = await supabaseAdmin
    .from('creators')
    .update({ last_login: ts })
    .eq('id', creator.id)
  if (updateError) {
    // Non-fatal — last_login column may not exist
    console.warn(`[LOGIN] ${ts} | last_login update failed (non-fatal):`, updateError.message)
  }

  const token = signToken({ id: creator.id, role: 'creator', name: creator.name, creator_id: creator.id })
  console.log(`[LOGIN] ${ts} | Token issued for ${creator.name}`)

  return res.status(200).json({ token, creator })
}
