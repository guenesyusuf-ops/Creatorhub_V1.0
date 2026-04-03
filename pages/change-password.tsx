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
      <Head>
        <title>Passwort ändern – Filapen Creator Hub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        * { box-sizing: border-box; margin: 0; padding: 0; }
        body { font-family: 'Plus Jakarta Sans', system-ui, sans-serif; }
        .inp:focus { border-color: #4f6ef7 !important; box-shadow: 0 0 0 3px rgba(79,110,247,0.1); outline: none; }
        .btn-main:hover { opacity: 0.9; }
        .btn-main:disabled { opacity: 0.6; cursor: not-allowed; }
      `}</style>
      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: '#f0f0f8', padding: 24, fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif"
      }}>
        <div style={{
          background: '#fff', border: '1.5px solid #e8e8f0', borderRadius: 20,
          padding: '40px 36px', width: '100%', maxWidth: 420,
          boxShadow: '0 4px 32px rgba(79,110,247,0.08)'
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 28 }}>
            <div style={{
              width: 36, height: 36, borderRadius: 10,
              background: 'linear-gradient(135deg,#4f6ef7,#6c63ff)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, fontWeight: 800, color: '#fff',
              boxShadow: '0 4px 12px rgba(79,110,247,0.35)'
            }}>F</div>
            <div>
              <div style={{ fontSize: 15, fontWeight: 800, color: '#1a1a2e', letterSpacing: '-0.3px' }}>filapen</div>
              <div style={{ fontSize: 10, color: '#8888aa', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Creator Hub</div>
            </div>
          </div>

          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'rgba(79,110,247,0.08)', border: '1px solid rgba(79,110,247,0.2)',
            borderRadius: 20, padding: '4px 12px', fontSize: 11, fontWeight: 600,
            color: '#4f6ef7', marginBottom: 16
          }}>
            🔐 Erster Login
          </div>

          <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a2e', marginBottom: 8, letterSpacing: '-0.4px' }}>
            Passwort festlegen
          </h1>
          <p style={{ fontSize: 13, color: '#8888aa', marginBottom: 28, lineHeight: 1.6 }}>
            Bitte wähle ein neues Passwort für deinen Account. Du wirst danach automatisch weitergeleitet.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{
                display: 'block', fontSize: 10, fontWeight: 700, color: '#8888aa',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6
              }}>Neues Passwort</label>
              <input
                className="inp"
                type="password"
                value={pw}
                onChange={e => setPw(e.target.value)}
                placeholder="Mindestens 8 Zeichen"
                required
                style={{
                  width: '100%', border: '1.5px solid #e8e8f0', borderRadius: 10,
                  padding: '10px 14px', fontFamily: 'inherit', fontSize: 13,
                  color: '#1a1a2e', background: '#fff', transition: 'border-color 0.15s'
                }}
              />
            </div>

            <div style={{ marginBottom: 20 }}>
              <label style={{
                display: 'block', fontSize: 10, fontWeight: 700, color: '#8888aa',
                textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 6
              }}>Passwort bestätigen</label>
              <input
                className="inp"
                type="password"
                value={pw2}
                onChange={e => setPw2(e.target.value)}
                placeholder="Passwort wiederholen"
                required
                style={{
                  width: '100%', border: '1.5px solid #e8e8f0', borderRadius: 10,
                  padding: '10px 14px', fontFamily: 'inherit', fontSize: 13,
                  color: '#1a1a2e', background: '#fff', transition: 'border-color 0.15s'
                }}
              />
            </div>

            {error && (
              <div style={{
                background: '#fff5f5', border: '1.5px solid #fecaca',
                borderRadius: 10, padding: '10px 14px', fontSize: 12,
                color: '#dc2626', marginBottom: 16, fontWeight: 500
              }}>{error}</div>
            )}

            <button
              className="btn-main"
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                background: 'linear-gradient(135deg,#4f6ef7,#6c63ff)',
                color: '#fff', fontWeight: 700, fontSize: 14,
                padding: '12px 0', borderRadius: 10, border: 'none',
                cursor: 'pointer', fontFamily: 'inherit',
                boxShadow: '0 4px 16px rgba(79,110,247,0.35)',
                transition: 'opacity 0.15s'
              }}
            >
              {loading ? 'Speichern...' : 'Passwort speichern →'}
            </button>
          </form>

          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#bbbbd0' }}>
            Filapen GmbH · Creator Hub
          </div>
        </div>
      </div>
    </>
  )
}
