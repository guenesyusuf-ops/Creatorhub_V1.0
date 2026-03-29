import type { NextApiRequest, NextApiResponse } from 'next'
import { generateInviteCode, verifyToken } from '@/lib/auth'
import { sendCreatorInvite } from '@/lib/email'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded || decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  const { creatorId, email, name } = req.body
  if (!email) return res.status(400).json({ error: 'E-Mail erforderlich' })

  const code = generateInviteCode()
  const creatorName = name || 'Creator'

  try {
    await sendCreatorInvite(email, creatorName, code)
    return res.status(200).json({ success: true, code })
  } catch (err) {
    console.error('Email error:', err)
    return res.status(500).json({ error: 'E-Mail konnte nicht gesendet werden' })
  }
}
