// v1.0 – Proxy-Download: holt Datei von R2 und gibt sie als Download zurück
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url, name } = req.query
  if (!url || typeof url !== 'string') return res.status(400).json({ error: 'URL fehlt' })

  try {
    const response = await fetch(decodeURIComponent(url))
    if (!response.ok) return res.status(500).json({ error: 'Datei nicht gefunden' })

    const contentType = response.headers.get('content-type') || 'application/octet-stream'
    const fileName = typeof name === 'string' ? name : 'download'

    res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(fileName)}"`)
    res.setHeader('Content-Type', contentType)

    const buffer = await response.arrayBuffer()
    res.send(Buffer.from(buffer))
  } catch (e: any) {
    res.status(500).json({ error: e.message })
  }
}
