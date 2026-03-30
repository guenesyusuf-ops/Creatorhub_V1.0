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
    // Try to revoke in Supabase by email
    if (email) {
      await supabase.from('creators')
        .update({ invite_code: null })
        .eq('email', email.toLowerCase())
    }
    return res.status(200).json({ success: true, message: 'Zugang entzogen' })
  }

  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' })

  const code = generateInviteCode()
  const creatorName = name || 'Creator'
  const ini = creatorName.slice(0, 2).toUpperCase()

  // Try to find existing creator by email first
  const { data: existing } = await supabase
    .from('creators')
    .select('id')
    .eq('email', email.toLowerCase())
    .single()

  if (existing) {
    // Update existing creator
    await supabase.from('creators')
      .update({ invite_code: code })
      .eq('id', existing.id)
  } else {
    // Insert new creator
    const { error: insertError } = await supabase.from('creators').insert({
      name: creatorName,
      initials: ini,
      email: email.toLowerCase(),
      invite_code: code,
    })
    if (insertError) {
      console.error('Supabase insert error:', insertError)
      // Still send email even if DB insert fails
    }
  }

  // Send email
  try {
    await sendCreatorInvite(email, creatorName, code)
    return res.status(200).json({ success: true, code })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' })
  }
}
