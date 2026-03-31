import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { generateInviteCode, verifyToken } from '@/lib/auth'
import { sendCreatorInvite } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  const { email, name, action } = req.body
  const ts = new Date().toISOString()

  // ── Revoke ────────────────────────────────────────────────────────────────
  if (action === 'revoke') {
    const { error } = await supabaseAdmin
      .from('creators')
      .update({ invite_code: null })
      .eq('email', email?.toLowerCase() || '')
    if (error) console.error(`[REVOKE] ${ts} | Failed:`, JSON.stringify(error))
    return res.status(200).json({ success: !error })
  }

  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' })

  const creatorName = name || 'Creator'
  const ini = creatorName.slice(0, 2).toUpperCase()
  const code = generateInviteCode()

  console.log(`[INVITE] ${ts} | Start | email=${email} | code=${code}`)

  // ── Step 1: Find existing creator by email ────────────────────────────────
  const { data: existing, error: findError } = await supabaseAdmin
    .from('creators')
    .select('id, invite_code')
    .eq('email', email.toLowerCase())
    .maybeSingle()

  if (findError) {
    // email column may not exist yet (migration not run)
    console.warn(`[INVITE] ${ts} | Find error (non-fatal, likely missing email column):`, findError.message)
  }

  // ── Step 2: Update or Insert ──────────────────────────────────────────────
  let savedCode: string | null = null

  if (existing?.id) {
    console.log(`[INVITE] ${ts} | Updating existing id=${existing.id}`)
    const { data, error } = await supabaseAdmin
      .from('creators')
      .update({ invite_code: code })
      .eq('id', existing.id)
      .select('invite_code')
      .single()

    if (error) {
      console.error(`[INVITE] ${ts} | UPDATE FAILED:`, JSON.stringify(error))
      return res.status(500).json({ error: `DB Update fehlgeschlagen: ${error.message}`, detail: error })
    }
    savedCode = data?.invite_code ?? null

  } else {
    console.log(`[INVITE] ${ts} | Inserting new creator: ${creatorName}`)
    // Try with email first, fall back to without if column missing
    const insertPayload: any = { name: creatorName, initials: ini, invite_code: code }
    try { insertPayload.email = email.toLowerCase() } catch {}

    const { data, error } = await supabaseAdmin
      .from('creators')
      .insert(insertPayload)
      .select('id, invite_code')
      .single()

    if (error) {
      console.error(`[INVITE] ${ts} | INSERT FAILED:`, JSON.stringify(error))
      console.error(`[INVITE] ${ts} | Payload:`, JSON.stringify(insertPayload))
      // If error is about email column, retry without it
      if (error.message?.includes('email') || error.code === '42703') {
        console.log(`[INVITE] ${ts} | Retrying without email field...`)
        const { data: data2, error: error2 } = await supabaseAdmin
          .from('creators')
          .insert({ name: creatorName, initials: ini, invite_code: code })
          .select('id, invite_code')
          .single()
        if (error2) {
          console.error(`[INVITE] ${ts} | RETRY ALSO FAILED:`, JSON.stringify(error2))
          return res.status(500).json({ error: `DB Insert fehlgeschlagen: ${error2.message}`, detail: error2 })
        }
        savedCode = data2?.invite_code ?? null
        console.log(`[INVITE] ${ts} | Retry succeeded, id=${data2?.id}`)
      } else {
        return res.status(500).json({ error: `DB Insert fehlgeschlagen: ${error.message}`, detail: error })
      }
    } else {
      savedCode = data?.invite_code ?? null
      console.log(`[INVITE] ${ts} | Insert succeeded, id=${data?.id}`)
    }
  }

  // ── Step 3: Sanity check ──────────────────────────────────────────────────
  console.log(`[INVITE] ${ts} | Sanity check | savedCode=${savedCode} | expected=${code} | match=${savedCode === code}`)
  if (!savedCode || savedCode !== code) {
    console.error(`[INVITE] ${ts} | CODE MISMATCH — aborting email`)
    return res.status(500).json({ error: 'Code wurde nicht korrekt gespeichert. E-Mail wurde NICHT gesendet.' })
  }

  // ── Step 4: Send email ────────────────────────────────────────────────────
  try {
    await sendCreatorInvite(email, creatorName, code)
    console.log(`[INVITE] ${ts} | Email sent to ${email}`)
    return res.status(200).json({ success: true, code })
  } catch (err: any) {
    console.error(`[INVITE] ${ts} | Email failed:`, err?.message)
    return res.status(500).json({ error: `E-Mail fehlgeschlagen: ${err?.message}` })
  }
}
