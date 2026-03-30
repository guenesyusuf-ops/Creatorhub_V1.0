import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

// This page is for creators only - accessed via /creator?code=XXXX
export default function CreatorPortalPage() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const ready = useRef(false)

  useEffect(() => {
    // Check creator token - NOT admin token
    const creatorToken = localStorage.getItem('creator_token')
    if (!creatorToken) {
      router.push('/creator')
      return
    }

    // Make sure admin is NOT logged in here
    // Creator portal is isolated from admin dashboard
    if (ready.current) return
    ready.current = true

    // Get creator data
    const creatorData = localStorage.getItem('creator')
    const creator = creatorData ? JSON.parse(creatorData) : null
    const creatorName = creator?.name || 'Creator'

    // Build simple creator portal UI
    const el = ref.current
    if (!el) return

    el.innerHTML = `
      <div style="min-height:100vh;background:#f0f0f5;font-family:system-ui,sans-serif">
        <div style="background:#fff;border-bottom:1px solid #e8e8ec;padding:14px 24px;display:flex;align-items:center;justify-content:space-between">
          <div style="display:flex;align-items:center;gap:10px">
            <div style="font-size:10px;color:#aaa;letter-spacing:2px;font-weight:600">FILAPEN CREATOR HUB</div>
          </div>
          <div style="display:flex;align-items:center;gap:12px">
            <div style="font-size:13px;color:#666">👋 Hallo, <strong>${creatorName}</strong></div>
            <button id="creator-logout" style="background:#f9f9fb;border:1px solid #e8e8ec;color:#555;font-size:12px;padding:6px 12px;border-radius:8px;cursor:pointer">⏻ Abmelden</button>
          </div>
        </div>
        <div style="max-width:800px;margin:40px auto;padding:0 24px">
          <h2 style="font-size:22px;font-weight:700;color:#111;margin:0 0 8px">Willkommen, ${creatorName}! 👋</h2>
          <p style="font-size:14px;color:#888;margin:0 0 32px">Schön dass du da bist. Hier kannst du deine Inhalte verwalten.</p>
          <div style="background:#fff;border:1px solid #e8e8ec;border-radius:16px;padding:32px;text-align:center">
            <div style="font-size:40px;margin-bottom:16px">🚀</div>
            <div style="font-size:16px;font-weight:600;color:#111;margin-bottom:8px">Creator Portal</div>
            <div style="font-size:14px;color:#888">Dein persönlicher Bereich wird gerade eingerichtet.<br>Weitere Funktionen folgen in Kürze.</div>
          </div>
        </div>
      </div>
    `

    document.getElementById('creator-logout')?.addEventListener('click', () => {
      localStorage.removeItem('creator_token')
      localStorage.removeItem('creator')
      router.push('/creator')
    })
  }, [])

  return (
    <>
      <Head>
        <title>Creator Portal – Filapen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div ref={ref} />
    </>
  )
}
