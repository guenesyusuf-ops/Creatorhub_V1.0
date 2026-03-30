import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CreatorLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    setReady(true)

    // If ?error= param exists show message
    const err = router.query.error as string
    if (err === 'invalid') setError('Ungültiger oder abgelaufener Link. Bitte Code manuell eingeben.')
    if (err === 'connection') setError('Verbindungsfehler. Bitte versuche es erneut.')

    // If code in URL → forward directly to creator-portal which handles auth
    const urlCode = router.query.code as string
    if (urlCode) {
      router.replace(`/creator-portal?code=${urlCode}`)
      return
    }

    // If already logged in → go to portal
    const existingToken = localStorage.getItem('creator_token')
    const existingCreator = localStorage.getItem('creator')
    if (existingToken && existingCreator) {
      router.replace('/creator-portal')
    }
  }, [router.isReady])

  async function handleLogin(e: any) {
    e.preventDefault()
    if (!code.trim()) return
    // Forward to creator-portal with code
    router.push(`/creator-portal?code=${code.trim().toUpperCase()}`)
  }

  if (!ready) return (
    <>
      <Head><title>Creator Portal – Filapen</title></Head>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.logoSub}>CREATOR HUB</div>
          <div style={{ textAlign: 'center', marginTop: 24, color: '#888', fontSize: 14 }}>⏳ Einen Moment...</div>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Head><title>Creator Portal – Filapen</title></Head>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={s.logoSub}>CREATOR HUB</div>
          </div>
          <h2 style={s.title}>Dein Creator Portal</h2>
          <p style={s.sub}>Nutze den Link aus deiner Einladungs-E-Mail oder gib deinen Code ein.</p>
          <form onSubmit={handleLogin}>
            <div style={s.group}>
              <label style={s.label}>Einladungscode</label>
              <input
                style={s.codeInput}
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
                maxLength={8}
                autoFocus
                required
              />
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Weiterleiten...' : 'Einloggen →'}
            </button>
          </form>
          <div style={s.divider}>oder</div>
          <button style={s.btnGhost} onClick={() => router.push('/login')}>
            🔐 Admin Login
          </button>
          <div style={s.footer}>Filapen GmbH · Business Hub</div>
        </div>
      </div>
    </>
  )
}

const s: any = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f0f0f5', padding: 24 },
  card: { background: '#fff', border: '1px solid #e8e8ec', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 400, boxShadow: '0 2px 20px rgba(0,0,0,0.06)' },
  logoSub: { fontSize: 10, color: '#aaa', letterSpacing: '3px', fontWeight: 600, textAlign: 'center' as const },
  title: { fontSize: 22, fontWeight: 700, color: '#111', margin: '0 0 6px', textAlign: 'center' as const },
  sub: { fontSize: 13, color: '#888', margin: '0 0 24px', textAlign: 'center' as const, lineHeight: 1.6 },
  group: { marginBottom: 20 },
  label: { display: 'block', fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 6 },
  codeInput: { width: '100%', background: '#f9f9fb', border: '1px solid #e8e8ec', borderRadius: 10, padding: '12px 14px', fontSize: 22, fontWeight: 700, letterSpacing: 6, textAlign: 'center' as const, textTransform: 'uppercase' as const, boxSizing: 'border-box' as const, outline: 'none', color: '#111' },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 },
  btn: { width: '100%', background: '#111', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer' },
  divider: { textAlign: 'center' as const, color: '#ccc', fontSize: 13, margin: '18px 0', borderTop: '1px solid #f0f0f0', paddingTop: 18 },
  btnGhost: { width: '100%', background: '#f9f9fb', border: '1px solid #e8e8ec', color: '#555', fontWeight: 500, fontSize: 14, padding: '12px 0', borderRadius: 10, cursor: 'pointer' },
  footer: { textAlign: 'center' as const, color: '#ccc', fontSize: 12, marginTop: 24 }
}
