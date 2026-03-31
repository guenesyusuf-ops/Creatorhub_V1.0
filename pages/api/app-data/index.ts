import type { NextApiRequest, NextApiResponse } from 'next'
import { supabaseAdmin } from '@/lib/supabase'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  if (req.method === 'GET') {
    const { key } = req.query
    if (!key) {
      const { data, error } = await supabaseAdmin.from('app_data').select('*')
      if (error) return res.status(500).json({ error: error.message })
      const result: any = {}
      ;(data || []).forEach((row: any) => { result[row.key] = row.value })
      return res.status(200).json(result)
    }
    const { data, error } = await supabaseAdmin
      .from('app_data').select('value').eq('key', key).maybeSingle()
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json(data?.value || null)
  }

  if (decoded.role !== 'admin') return res.status(403).json({ error: 'Kein Zugriff' })

  if (req.method === 'POST') {
    const { key, value } = req.body
    if (!key) return res.status(400).json({ error: 'key fehlt' })
    const { error } = await supabaseAdmin
      .from('app_data')
      .upsert({ key, value, updated_at: new Date().toISOString() })
    if (error) return res.status(500).json({ error: error.message })
    return res.status(200).json({ success: true })
  }

  return res.status(405).end()
}
