import type { NextApiRequest, NextApiResponse } from 'next'
import { supabase } from '@/lib/supabase'
import { generateInviteCode, verifyToken } from '@/lib/auth'
import { sendCreatorInvite } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  const { creatorId, email, name, action } = req.body

  // Action: revoke → Zugang entziehen
  if (action === 'revoke') {
    if (email) {
      await supabase.from('creators').update({ invite_code: null }).eq('email', email.toLowerCase())
    }
    return res.status(200).json({ success: true })
  }

  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' })

  const code = generateInviteCode()
  const creatorName = name || 'Creator'
  const ini = creatorName.slice(0, 2).toUpperCase()

  // Try find existing by email
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  let dbOk = false

  if (existing?.id) {
    // Update existing creator with new code
    const { error } = await supabase
      .from('creators')
      .update({ invite_code: code })
      .eq('id', existing.id)
    dbOk = !error
    if (error) console.error('Update error:', error)
  } else {
    // Insert new — only required fields
    const { error } = await supabase.from('creators').insert({
      name: creatorName,
      initials: ini,
      invite_code: code,
    })
    dbOk = !error
    if (error) {
      console.error('Insert error:', error)
      // Try minimal insert without optional fields
      const { error: e2 } = await supabase.from('creators').insert({
        name: creatorName,
        initials: ini,
        invite_code: code,
      })
      dbOk = !e2
      if (e2) console.error('Minimal insert also failed:', e2)
    }
  }

  // Only send email if code was saved to DB
  if (!dbOk) {
    return res.status(500).json({ error: 'Creator konnte nicht in der Datenbank gespeichert werden. Bitte prüfe die Supabase-Verbindung.' })
  }

  try {
    await sendCreatorInvite(email, creatorName, code)
    return res.status(200).json({ success: true, code })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' })
  }
}
