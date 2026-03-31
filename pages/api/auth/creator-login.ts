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
    const { count } = await supabaseAdmin
      .from('creators')
      .select('*', { count: 'exact', head: true })
      .not('invite_code', 'is', null)
    console.error(`[LOGIN] ${ts} | Code not found: ${normalizedCode} | Active codes in DB: ${count}`)
    return res.status(401).json({ error: 'Ungültiger Code. Bitte fordere einen neuen Link an.' })
  }

  console.log(`[LOGIN] ${ts} | Found creator: ${creator.name} (id=${creator.id})`)

  // Punkt 1: Status auf 'aktiv' setzen + last_login aktualisieren
  // Status bleibt dauerhaft 'aktiv' nach erstem Login
  const { error: updateError } = await supabaseAdmin
    .from('creators')
    .update({
      last_login: ts,
      status: 'aktiv'
    })
    .eq('id', creator.id)

  if (updateError) {
    console.warn(`[LOGIN] ${ts} | Update failed (non-fatal):`, updateError.message)
  } else {
    console.log(`[LOGIN] ${ts} | Status set to aktiv for ${creator.name}`)
  }

  const token = signToken({ id: creator.id, role: 'creator', name: creator.name, creator_id: creator.id })
  console.log(`[LOGIN] ${ts} | Token issued for ${creator.name}`)

  // Return updated creator with aktiv status
  return res.status(200).json({ token, creator: { ...creator, status: 'aktiv' } })
}
