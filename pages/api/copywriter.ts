import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyToken } from '@/lib/auth'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).end()

  const token = req.headers.authorization?.replace('Bearer ', '')
  const decoded = verifyToken(token || '')
  if (!decoded) return res.status(401).json({ error: 'Nicht autorisiert' })

  const d = req.body

  const prompt = `Du bist ein mehrfach ausgezeichneter Performance Copywriter & Creative Strategist, spezialisiert auf Conversion-optimierte Meta Ads für anspruchsvolle Märkte.

Du erhältst jetzt eine vollständige Marktanalyse zu einem Produkt. Nutze diese Analyse, um die Pain Points, Wünsche, Sprache, Kaufauslöser und psychologischen Hebel der Zielgruppe tief zu verstehen.

Erstelle darauf basierend ${d.variantenAnzahl || 3} Meta Ads Copy-Varianten, die präzise auf die Zielgruppe und den Funnel-Level abgestimmt sind.

Dein Ziel:
- Hohe Aufmerksamkeit im Feed generieren (Hook-orientiert denken)
- Emotionale Verbindung aufbauen (Empathie, Kundenverständnis)
- Klarer USP des Produkts herausstellen (Nutzen vor Funktion)
- Den Leser zur Aktion führen (starker CTA, passend zur Funnel-Stufe)
- Den Kunden klar machen, dass wir das Original sind und die einzig funktionierende Lösung

--- PRODUKT-INFORMATIONEN ---
${d.produkt || ''}

--- ZIELGRUPPE ---
Geschlecht: ${d.geschlecht || 'Beides'}
Alter: ${d.alterVon || ''}–${d.alterBis || ''}
Interessen: ${d.interessen || ''}

--- MARKTPSYCHOLOGIE ---
Market Awareness: ${d.awareness || ''}
Market Sophistication: ${d.sophistication || ''}

--- ENDERGEBNISSE ---
${[d.ergebnis1, d.ergebnis2, d.ergebnis3].filter(Boolean).map((e,i) => `${i+1}. ${e}`).join('\n')}

--- MARKET DESIRES ---
${(d.desires || []).filter(Boolean).join('\n')}

--- FEATURES ---
${(d.features || []).filter(Boolean).join('\n')}

--- BENEFITS ---
${(d.benefits || []).filter(Boolean).join('\n')}

--- HOOK-MECHANIK (gewählte Stile) ---
${(d.hooks || []).join(', ')}

--- UNIQUE MECHANISM ---
${d.mechanismus || ''}
Art: ${d.mechanismusArt || ''}
${d.mechanismusBeschreibung ? 'Details: ' + d.mechanismusBeschreibung : ''}

--- DESIRED IDENTITY ---
${(d.identities || []).filter(Boolean).join('\n')}

--- KAMPAGNEN-EINSTELLUNGEN ---
Anzeige-Art: ${d.anzeigeArt || ''}
Funnel-Level: ${d.funnelLevel || ''}
Werbeziel 1: ${d.werbeziel1 || ''}
Werbeziel 2: ${d.werbeziel2 || ''}
Tonalität: ${d.tonalitaet || ''}

--- KONKURRENZ-ADS (Referenz & Analyse) ---
${[d.konkurrenz1, d.konkurrenz2, d.konkurrenz3].filter(Boolean).join('\n\n---\n\n')}

--- MARKTANALYSE ---
${d.marktanalyse || ''}

--- KUNDENUMFRAGE ---
${d.kundenumfrage || ''}

--- ANFORDERUNGEN ---
Headline: ${d.reqHeadline || '1 Headline, max. 110 Zeichen, starke Hook'}
Primärtext: ${d.reqPrimaer || 'max. 32-40 Zeichen pro Absatz, Emoji vor jedem Absatz'}
Linkbeschreibung: ${d.reqLink || 'optional, max. 30 Zeichen'}
CTA: ${d.reqCta || 'zielgerichtet, keine generischen'}

--- OUTPUT FORMAT ---
Erstelle exakt ${d.variantenAnzahl || 3} Varianten. Für jede Variante:

**VARIANTE [N] – [Hook-Stil]**

📌 HEADLINE:
[Headline hier]

📝 PRIMÄRTEXT:
[Primärtext hier mit Emojis vor jedem Absatz]

🔗 LINKBESCHREIBUNG:
[Linkbeschreibung hier]

⚡ CTA:
[CTA hier]

---

Trenne jede Variante klar mit --- ab. Keine zusätzlichen Erklärungen oder Kommentare, nur die fertigen Ad-Texte.`

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-opus-4-5',
        max_tokens: 4000,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      const err = await response.json()
      return res.status(500).json({ error: err.error?.message || 'API Fehler' })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''
    return res.status(200).json({ result: text })
  } catch (e: any) {
    return res.status(500).json({ error: e.message })
  }
}
