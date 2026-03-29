import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      if (data.user.must_change_password) {
        router.push('/change-password')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Verbindungsfehler')
      setLoading(false)
    }
  }

  return (
    <>
      <Head><title>Login – CreatorHub</title></Head>
      <div style={styles.wrap}>
        <div style={styles.card}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>🎨</div>
            <div>
              <div style={styles.logoName}>Filapen</div>
              <div style={styles.logoSub}>CREATOR HUB</div>
            </div>
          </div>
          <h1 style={styles.title}>Willkommen zurück</h1>
          <p style={styles.sub}>Melde dich mit deinen Zugangsdaten an</p>
          <form onSubmit={handleLogin}>
            <div style={styles.group}>
              <label style={styles.label}>E-Mail</label>
              <input style={styles.input} type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="deine@email.com" required />
            </div>
            <div style={styles.group}>
              <label style={styles.label}>Passwort</label>
              <input style={styles.input} type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            {error && <div style={styles.error}>{error}</div>}
            <button style={styles.btn} type="submit" disabled={loading}>
              {loading ? 'Anmelden...' : 'Anmelden →'}
            </button>
          </form>
          <div style={styles.divider}>oder</div>
          <button style={styles.btnGhost} onClick={() => router.push('/creator')}>
            🎬 Creator-Portal (mit Code)
          </button>
          <div style={styles.footer}>Filapen GmbH · Creator Hub</div>
        </div>
      </div>
    </>
  )
}

const styles: any = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f7', padding: 24 },
  card: { background: '#ffffff', border: '1px solid #e8e8ec', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' },
  logoWrap: { display: 'flex', alignItems: 'center', gap: 10, marginBottom: 32 },
  logoIcon: { fontSize: 28 },
  logoName: { fontWeight: 700, fontSize: 16, color: '#111', lineHeight: 1.2 },
  logoSub: { fontSize: 10, color: '#999', letterSpacing: 1.5, fontWeight: 500 },
  title: { fontSize: 24, fontWeight: 700, color: '#111', marginBottom: 6 },
  sub: { fontSize: 14, color: '#888', marginBottom: 28 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 12, color: '#666', fontWeight: 500, marginBottom: 6 },
  input: { width: '100%', background: '#f9f9fb', border: '1px solid #e8e8ec', borderRadius: 8, padding: '11px 14px', color: '#111', fontSize: 14, outline: 'none', boxSizing: 'border-box' as const },
  error: { background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#dc2626', marginBottom: 16 },
  btn: { width: '100%', background: '#111', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 0', borderRadius: 8, border: 'none', marginTop: 8, cursor: 'pointer' },
  divider: { textAlign: 'center' as const, color: '#bbb', fontSize: 13, margin: '20px 0', borderTop: '1px solid #f0f0f0', paddingTop: 20 },
  btnGhost: { width: '100%', background: '#f5f5f7', border: '1px solid #e8e8ec', color: '#555', fontWeight: 500, fontSize: 14, padding: '12px 0', borderRadius: 8, cursor: 'pointer' },
  footer: { textAlign: 'center' as const, color: '#bbb', fontSize: 12, marginTop: 24 }
}
