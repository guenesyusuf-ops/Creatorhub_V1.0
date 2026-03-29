import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CreatorPortal() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'portal'>('login')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [creator, setCreator] = useState<any>(null)
  const [dates, setDates] = useState<any[]>([])
  const [activeDate, setActiveDate] = useState<any>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState('')

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true); setError('')
    const res = await fetch('/api/auth/creator-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code })
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    localStorage.setItem('token', data.token)
    localStorage.setItem('creator', JSON.stringify(data.creator))
    setCreator(data.creator)
    await loadDates(data.creator.id, data.token)
    setView('portal')
    setLoading(false)
  }

  async function loadDates(creatorId: string, token: string) {
    const res = await fetch(`/api/dates?creator_id=${creatorId}`, {
      headers: { Authorization: `Bearer ${token}` }
    })
    const data = await res.json()
    setDates(data)
    if (data.length > 0) setActiveDate(data[0])
  }

  async function addLink(e: any) {
    e.preventDefault()
    if (!activeDate) return
    setAdding(true)
    const token = localStorage.getItem('token')
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date_id: activeDate.id, creator_id: creator.id, title: newTitle, url: newUrl })
    })
    if (res.ok) {
      setNewTitle(''); setNewUrl('')
      showToast('Link hinzugefügt! Admins wurden benachrichtigt ✓')
      await loadDates(creator.id, token!)
    }
    setAdding(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('creator')
    setView('login'); setCreator(null); setDates([])
  }

  if (view === 'login') return (
    <>
      <Head><title>Creator Portal – CreatorHub</title></Head>
      <div style={s.wrap}>
        <div style={s.card}>
          <div style={s.logo}>CREATOR<span style={{ color: '#f0f0f5' }}>HUB</span></div>
          <div style={s.badge}>⭐ Creator Portal</div>
          <h1 style={s.title}>Dein persönlicher<br />Bereich</h1>
          <p style={s.sub}>Gib deinen Einladungscode ein um fortzufahren.</p>
          <form onSubmit={handleLogin}>
            <div style={s.group}>
              <label style={s.label}>Einladungscode</label>
              <input style={{ ...s.input, textAlign: 'center', fontSize: 22, fontWeight: 700, letterSpacing: 6, textTransform: 'uppercase' as const }}
                value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX" maxLength={8} required />
            </div>
            {error && <div style={s.error}>{error}</div>}
            <button style={s.btn} type="submit" disabled={loading}>
              {loading ? 'Prüfe Code...' : 'Einloggen →'}
            </button>
          </form>
          <button style={{ ...s.btnGhost, marginTop: 16 }} onClick={() => router.push('/login')}>← Admin Login</button>
        </div>
      </div>
    </>
  )

  return (
    <>
      <Head><title>{creator?.name} – CreatorHub</title></Head>
      <div style={{ minHeight: '100vh', background: '#0a0a0f', color: '#f0f0f5' }}>
        {/* Header */}
        <div style={s.header}>
          <div style={s.logo}>CREATOR<span style={{ color: '#f0f0f5' }}>HUB</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginLeft: 'auto' }}>
            <div style={{ fontSize: 14, color: '#6b6b80' }}>Eingeloggt als</div>
            <div style={{ background: 'linear-gradient(135deg,#7c3aed,#c8f035)', borderRadius: '50%', width: 34, height: 34, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: 13, fontFamily: 'Syne, sans-serif' }}>
              {creator?.initials}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600 }}>{creator?.name}</div>
            <button style={s.btnSmall} onClick={logout}>Logout</button>
          </div>
        </div>

        <div style={s.content}>
          <h1 style={s.pageTitle}>Deine <span style={{ color: '#c8f035' }}>Videos</span></h1>
          <p style={s.pageSub}>Trage hier deine neuen Video-Links ein. Die Admins werden automatisch benachrichtigt.</p>

          {/* Date selector */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 28, flexWrap: 'wrap' as const, alignItems: 'center' }}>
            {dates.map((d: any) => {
              const label = new Date(d.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
              const active = activeDate?.id === d.id
              return (
                <button key={d.id} onClick={() => setActiveDate(d)}
                  style={{ padding: '9px 18px', borderRadius: 30, border: active ? '1px solid #c8f035' : '1px solid rgba(255,255,255,0.07)', background: active ? '#c8f035' : '#111118', color: active ? '#0a0a0f' : '#a0a0b8', fontWeight: active ? 700 : 400, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s' }}>
                  📅 {label}
                </button>
              )
            })}
          </div>

          {/* Add link form */}
          <div style={s.addCard}>
            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 16, color: '#c8f035' }}>
              + Neuen Link eintragen
            </div>
            {!activeDate ? (
              <p style={{ color: '#6b6b80', fontSize: 14 }}>Kein Datum ausgewählt. Bitte wende dich an den Admin um ein Datum anzulegen.</p>
            ) : (
              <form onSubmit={addLink} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 12 }}>
                <div>
                  <label style={s.label}>Bezeichnung</label>
                  <input style={s.input} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="z.B. Brand Video März" required />
                </div>
                <div>
                  <label style={s.label}>Link / URL</label>
                  <input style={s.input} value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://drive.google.com/..." required />
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                  <button style={s.btn} type="submit" disabled={adding}>{adding ? '...' : 'Eintragen'}</button>
                </div>
              </form>
            )}
          </div>

          {/* Links list */}
          {activeDate && (
            <div>
              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 16, fontWeight: 700, marginBottom: 16 }}>
                Eingetragene Links — {new Date(activeDate.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
              </div>
              {(activeDate.links || []).length === 0 ? (
                <div style={{ color: '#6b6b80', fontSize: 14, padding: '20px 0' }}>Noch keine Links für diesen Monat.</div>
              ) : (activeDate.links || []).map((link: any) => (
                <div key={link.id} style={s.linkItem}>
                  <div style={s.linkIcon}>🔗</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600 }}>{link.title}</div>
                    <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{link.url}</div>
                  </div>
                  <a href={link.url} target="_blank" rel="noreferrer" style={s.openBtn}>Öffnen ↗</a>
                </div>
              ))}
            </div>
          )}
        </div>

        {toast && (
          <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #c8f035', borderRadius: 10, padding: '12px 18px', fontSize: 14, zIndex: 999 }}>
            {toast}
          </div>
        )}
      </div>
    </>
  )
}

const s: any = {
  wrap: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0f', padding: 24 },
  card: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 40, width: '100%', maxWidth: 420 },
  logo: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 22, color: '#c8f035', marginBottom: 20, letterSpacing: -0.5 },
  badge: { display: 'inline-block', background: 'rgba(200,240,53,0.1)', border: '1px solid rgba(200,240,53,0.25)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#c8f035', marginBottom: 16 },
  title: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 26, marginBottom: 8, letterSpacing: -0.5, lineHeight: 1.2 },
  sub: { fontSize: 13, color: '#6b6b80', marginBottom: 24, lineHeight: 1.6 },
  group: { marginBottom: 16 },
  label: { display: 'block', fontSize: 11, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  input: { width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '11px 14px', color: '#f0f0f5', fontSize: 14, outline: 'none' },
  error: { background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 10, padding: '10px 14px', fontSize: 13, color: '#f87171', marginBottom: 16 },
  btn: { background: '#c8f035', color: '#0a0a0f', fontWeight: 700, fontSize: 14, padding: '12px 20px', borderRadius: 10, border: 'none', cursor: 'pointer', width: '100%' },
  btnGhost: { width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', color: '#a0a0b8', fontSize: 13, padding: '11px 0', borderRadius: 10, cursor: 'pointer' },
  btnSmall: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', color: '#a0a0b8', fontSize: 12, padding: '7px 14px', borderRadius: 8, cursor: 'pointer' },
  header: { borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16, background: '#111118' },
  content: { padding: 32, maxWidth: 900, margin: '0 auto' },
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: -1, marginBottom: 6 },
  pageSub: { fontSize: 14, color: '#6b6b80', marginBottom: 28 },
  addCard: { background: '#13131c', border: '1px solid rgba(200,240,53,0.15)', borderRadius: 16, padding: 24, marginBottom: 28 },
  linkItem: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14, marginBottom: 10 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#9f67fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  openBtn: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#a0a0b8', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' }
}
