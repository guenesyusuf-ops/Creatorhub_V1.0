import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function ChangePasswordPage() {
  const router = useRouter()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: any) {
    e.preventDefault()
    if (pw !== pw2) { setError('Passwörter stimmen nicht überein'); return }
    if (pw.length < 8) { setError('Mindestens 8 Zeichen'); return }
    setLoading(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/auth/change-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ newPassword: pw })
    })
    if (res.ok) {
      const user = JSON.parse(localStorage.getItem('user') || '{}')
      user.must_change_password = false
      localStorage.setItem('user', JSON.stringify(user))
      router.push('/dashboard')
    } else {
      setError('Fehler beim Speichern')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Passwort ändern – CreatorHub</title></Head>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.logo}>CREATOR<span style={{ color: '#f0f0f5' }}>HUB</span></div>
          <div style={styles.badge}>🔐 Erster Login</div>
          <h1 style={styles.title}>Passwort festlegen</h1>
          <p style={styles.sub}>Bitte wähle ein neues Passwort für deinen Account. Du wirst danach automatisch weitergeleitet.</p>
          <form onSubmit={handleSubmit}>
            <div style={styles.group}>
              <label style={styles.label}>Neues Passwort</label>
              <input style={styles.input} type="password" value={pw} onChange={e => setPw(e.target.value)} placeholder="Mindestens 8 Zeichen" required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Passwort bestätigen</label>
              <input style={styles.input} type="password" value={pw2} onChange={e => setPw2(e.target.value)} placeholder="Passwort wiederholen" required />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Speichern...' : 'Passwort speichern →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )
}

const styles: any = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 24 },
  card: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420 },
  logo: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#c8f035', marginBottom: 20, letterSpacing: -0.5 },
  badge: { display: 'inline-block', background: 'rgba(200,240,53,0.1)', border: '1px solid rgba(200,240,53,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#c8f035', marginBottom: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 24, marginBottom: 8, letterSpacing: -0.5 },
  sub: { fontSize: 13, color: '#6b6b80', marginBottom: 24, lineHeight: 1.6 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#6b6b80', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 },
  input: { width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '11px 14px', color: '#f0f0f5', fontSize: 14, outline: 'none' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 16 },
  btn: { width: '100%', background: '#c8f035', color: '#0a0a0f', fontWeight: 700, fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', marginTop: 8, cursor: 'pointer' },
}
