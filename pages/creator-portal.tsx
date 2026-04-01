import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type NavPage = 'home' | 'upload' | 'tips' | 'briefings' | 'skripte' | 'lernvideos'

interface LinkItem {
  id: string
  title: string
  url: string
  created_at: string
}

interface DateItem {
  id: string
  month: string
  links: LinkItem[]
}

export default function CreatorPortal() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'portal'>('login')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [creator, setCreator] = useState<any>(null)
  const [dates, setDates] = useState<DateItem[]>([])
  const [page, setPage] = useState<NavPage>('home')
  const [activeDate, setActiveDate] = useState<DateItem | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'bilder' | 'videos' | 'roh' | 'auswertung'>('bilder')
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!router.isReady) return
    const urlCode = router.query.code as string
    if (!urlCode) return
    setCode(urlCode.toUpperCase())
    loginWithCode(urlCode.toUpperCase())
  }, [router.isReady, router.query.code])

  async function loginWithCode(c: string) {
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/creator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: c })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error || 'Ungültiger Code'); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('creator', JSON.stringify(data.creator))
      setCreator(data.creator)
      await loadDates(data.creator.id, data.token)
      setView('portal')
    } catch { setError('Verbindungsfehler.') }
    setLoading(false)
  }

  async function handleLogin(e: any) {
    e.preventDefault()
    await loginWithCode(code)
  }

  async function loadDates(creatorId: string, token: string) {
    try {
      const res = await fetch(`/api/dates?creator_id=${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) {
        setDates(data)
        if (data.length > 0) setActiveDate(data[0])
      }
    } catch {}
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
      showToast('✓ Link hinzugefügt!')
      const token2 = localStorage.getItem('token')
      await loadDates(creator.id, token2!)
    }
    setAdding(false)
  }

  async function handleUpload() {
    if (!uploadFile || !uploadName.trim()) { showToast('Bitte Datei und Bezeichnung angeben'); return }
    setUploading(true); setUploadProgress(0)
    const token = localStorage.getItem('token')
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('creatorId', creator.id)
    formData.append('tab', activeTab)
    formData.append('name', uploadName)
    const iv = setInterval(() => setUploadProgress(p => p >= 85 ? p : p + 8), 150)
    try {
      const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
      clearInterval(iv); setUploadProgress(100)
      if (res.ok) {
        showToast(`✓ "${uploadName}" hochgeladen!`)
        setUploadFile(null); setUploadName('')
        if (fileRef.current) fileRef.current.value = ''
        setTimeout(() => setUploadProgress(0), 800)
      } else { showToast('Upload fehlgeschlagen.') }
    } catch { clearInterval(iv); showToast('Upload fehlgeschlagen.') }
    setUploading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3200)
  }

  function logout() {
    localStorage.removeItem('token'); localStorage.removeItem('creator')
    setView('login'); setCreator(null); setDates([]); setCode('')
  }

  // ─── LOGIN ────────────────────────────────────────────────────────────────
  if (view === 'login') return (
    <>
      <Head><title>Creator Portal – CreatorHub</title></Head>
      <style>{`*{box-sizing:border-box;margin:0;padding:0;}body{font-family:system-ui,sans-serif;background:#f4f5f7;}`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 16, padding: 36, width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>🎨 Creator Portal</div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 24 }}>Gib deinen Einladungscode ein um fortzufahren.</div>
          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ display: 'block', fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 }}>Einladungscode</label>
              <input
                style={{ width: '100%', border: '1px solid #e8e8ec', borderRadius: 7, padding: '10px 12px', fontSize: 20, fontWeight: 700, letterSpacing: 5, textAlign: 'center', textTransform: 'uppercase', outline: 'none', fontFamily: 'inherit' }}
                value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX" maxLength={8} required />
            </div>
            {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 14 }}>{error}</div>}
            <button style={{ width: '100%', background: '#111', color: '#fff', border: 'none', borderRadius: 7, padding: '11px', fontSize: 13, fontWeight: 600, cursor: 'pointer' }} type="submit" disabled={loading}>
              {loading ? 'Prüfe Code...' : 'Einloggen →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )

  // ─── PORTAL ───────────────────────────────────────────────────────────────
  const navItems: { id: NavPage; label: string; icon: string; sub?: boolean }[] = [
    { id: 'home', label: 'Mein Dashboard', icon: '⊞' },
    { id: 'upload', label: 'Inhalte hochladen', icon: '⬆' },
    { id: 'tips', label: 'Tipps & Tricks', icon: '💡' },
    { id: 'briefings', label: 'Briefings', icon: '📋', sub: true },
    { id: 'skripte', label: 'Skripte', icon: '📝', sub: true },
    { id: 'lernvideos', label: 'Lernvideos', icon: '🎬', sub: true },
  ]

  const tabs = [
    { key: 'bilder', label: 'Bilder', icon: '🖼️' },
    { key: 'videos', label: 'Videos', icon: '🎬' },
    { key: 'roh', label: 'Rohmaterial', icon: '📹' },
    { key: 'auswertung', label: 'Auswertungen', icon: '📊' },
  ] as const

  return (
    <>
      <Head><title>{creator?.name} – Creator Portal</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:system-ui,sans-serif;background:#f4f5f7;color:#111;font-size:13px;}
        .ni{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:#777;margin-bottom:1px;user-select:none;}
        .ni:hover,.ni.on{background:#f0f0f3;color:#111;}
        .ni.on{font-weight:500;}
        .tab-btn{padding:7px 14px;border:none;background:none;cursor:pointer;font-size:12px;color:#777;border-bottom:2px solid transparent;font-family:inherit;}
        .tab-btn.on{color:#111;font-weight:600;border-bottom-color:#111;}
        .tab-btn:hover:not(.on){color:#444;}
        .fcard{background:#fff;border:1px solid #e8e8ec;border-radius:9px;padding:12px;cursor:pointer;}
        .fcard:hover{border-color:#bbb;}
        .add-fcard{background:#fff;border:1.5px dashed #e8e8ec;border-radius:9px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:#aaa;}
        .add-fcard:hover{border-color:#aaa;}
        .dz{border:1.5px dashed #e8e8ec;border-radius:8px;padding:16px;text-align:center;cursor:pointer;background:#f4f5f7;}
        .dz:hover{border-color:#4f6ef7;}
        .sc{background:#fff;border:1px solid #e8e8ec;border-radius:10px;padding:12px 14px;}
        .sl{font-size:9px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:3px;}
        .sv{font-size:22px;font-weight:700;}
        .fi{width:100%;border:1px solid #e8e8ec;border-radius:7px;padding:7px 9px;font-family:inherit;font-size:12px;outline:none;}
        .fi:focus{border-color:#999;}
        .fl{display:block;font-size:9px;font-weight:600;color:#888;margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px;}
        .btn-p{background:#111;color:#fff;border:1px solid #111;border-radius:7px;padding:7px 14px;font-size:12px;font-weight:500;cursor:pointer;font-family:inherit;}
        .btn-p:hover{opacity:.85;}
        .btn{background:#fff;color:#111;border:1px solid #e8e8ec;border-radius:7px;padding:5px 11px;font-size:12px;cursor:pointer;font-family:inherit;}
        .btn:hover{background:#f4f5f7;}
        .prog-track{height:4px;background:#f0f0f0;border-radius:2px;margin-top:4px;overflow:hidden;}
        .prog-fill{height:100%;background:#4f6ef7;border-radius:2px;transition:width .1s;}
        .link-row{background:#fff;border:1px solid #e8e8ec;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:12px;margin-bottom:7px;}
        .tip-card{background:#fff;border:1px solid #e8e8ec;border-radius:10px;padding:18px;cursor:pointer;text-align:center;}
        .tip-card:hover{border-color:#4f6ef7;}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8ec', height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>🎨 Creator Portal</div>
          <div style={{ fontSize: 11, color: '#888' }}>Ansicht als Creator</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#888' }}>Angemeldet als: <strong>{creator?.name}</strong></div>
            <button className="btn" style={{ fontSize: 11 }} onClick={logout}>⏻ Abmelden</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* SIDEBAR */}
          <div style={{ width: 200, background: '#fff', borderRight: '1px solid #e8e8ec', flexShrink: 0, padding: '12px 8px', overflowY: 'auto' }}>
            <div style={{ fontSize: 9, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, padding: '0 6px', marginBottom: 4 }}>Mein Bereich</div>
            {navItems.slice(0, 3).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center', fontSize: 12 }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
            <div style={{ fontSize: 9, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, padding: '8px 6px 4px', marginTop: 4 }}>Tipps &amp; Tricks</div>
            {navItems.slice(3).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} style={{ paddingLeft: 20 }} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center', fontSize: 12 }}>{n.icon}</span>
                {n.label}
              </div>
            ))}
          </div>

          {/* MAIN CONTENT */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

            {/* ── HOME ── */}
            {page === 'home' && (
              <>
                <div style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Willkommen zurück 👋</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Hallo {creator?.name?.split(' ')[0]}, schön dass du da bist!</div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 14 }}>
                  {[{ label: 'Meine Ordner', val: 0 }, { label: 'Dateien gesamt', val: 0 }, { label: 'Hochgeladen', val: 0, green: true }].map(s => (
                    <div key={s.label} className="sc">
                      <div className="sl">{s.label}</div>
                      <div className="sv" style={s.green ? { color: '#16a34a' } : {}}>{s.val}</div>
                    </div>
                  ))}
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8ec', marginBottom: 12 }}>
                  {tabs.map(t => (
                    <button key={t.key} className={`tab-btn${activeTab === t.key ? ' on' : ''}`} onClick={() => setActiveTab(t.key)}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* FOLDER GRID */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                  {dates.length > 0 && dates.map(d => (
                    <div key={d.id} className="fcard" onClick={() => { setActiveDate(d); setPage('upload') }}>
                      <div style={{ fontSize: 18, marginBottom: 5 }}>{tabs.find(t => t.key === activeTab)?.icon}</div>
                      <div style={{ fontSize: 11, fontWeight: 600 }}>
                        {new Date(d.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                      </div>
                      <div style={{ fontSize: 10, color: '#888', marginTop: 3 }}>📁 {d.links?.length || 0} Links</div>
                    </div>
                  ))}
                  <div className="add-fcard" onClick={() => setPage('upload')}>
                    <div style={{ fontSize: 16 }}>📁</div>
                    <span style={{ fontSize: 10, fontWeight: 500 }}>Neuer Ordner</span>
                  </div>
                </div>
              </>
            )}

            {/* ── UPLOAD / LINKS ── */}
            {page === 'upload' && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Inhalte hochladen</div>
                </div>

                {/* Add link form */}
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🔗 Video-Link eintragen</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>Trage deinen Video-Link ein. Das Team wird automatisch benachrichtigt.</div>

                  {/* Date selector */}
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
                    {dates.map(d => {
                      const label = new Date(d.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
                      const active = activeDate?.id === d.id
                      return (
                        <button key={d.id} onClick={() => setActiveDate(d)}
                          style={{ padding: '6px 14px', borderRadius: 20, border: `1px solid ${active ? '#111' : '#e8e8ec'}`, background: active ? '#111' : '#fff', color: active ? '#fff' : '#888', fontSize: 12, cursor: 'pointer' }}>
                          📅 {label}
                        </button>
                      )
                    })}
                  </div>

                  {!activeDate ? (
                    <div style={{ color: '#888', fontSize: 13 }}>Kein Datum vorhanden. Bitte den Admin kontaktieren.</div>
                  ) : (
                    <form onSubmit={addLink} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 10, alignItems: 'end' }}>
                      <div>
                        <label className="fl">Bezeichnung</label>
                        <input className="fi" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="z.B. Brand Video März" required />
                      </div>
                      <div>
                        <label className="fl">Link / URL</label>
                        <input className="fi" value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://drive.google.com/..." required />
                      </div>
                      <button className="btn-p" type="submit" disabled={adding}>{adding ? '...' : 'Eintragen'}</button>
                    </form>
                  )}
                </div>

                {/* Upload file */}
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📤 Datei hochladen</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>Lade Bilder oder Videos direkt hoch.</div>
                  <div style={{ marginBottom: 10 }}>
                    <label className="fl">Kategorie</label>
                    <select className="fi" value={activeTab} onChange={e => setActiveTab(e.target.value as any)}>
                      {tabs.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
                    </select>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label className="fl">Bezeichnung</label>
                    <input className="fi" value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="z.B. Lookbook Shot 01" />
                  </div>
                  <div className="dz" onClick={() => fileRef.current?.click()}>
                    {uploadFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 22 }}>{uploadFile.type.startsWith('image/') ? '🖼️' : '🎬'}</span>
                        <div>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{uploadFile.name}</div>
                          <div style={{ fontSize: 10, color: '#888' }}>{(uploadFile.size / 1024 / 1024).toFixed(1)} MB</div>
                        </div>
                        <span style={{ marginLeft: 'auto', color: '#16a34a' }}>✓</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, marginBottom: 4 }}>📂</div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>Klicken oder Datei hierher ziehen</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files?.[0] || null)} />
                  {uploading && (
                    <div style={{ marginTop: 8 }}>
                      <div style={{ fontSize: 10, marginBottom: 3 }}>Upload: {uploadProgress}%</div>
                      <div className="prog-track"><div className="prog-fill" style={{ width: `${uploadProgress}%` }} /></div>
                    </div>
                  )}
                  <button className="btn-p" style={{ width: '100%', marginTop: 12 }} onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Wird hochgeladen...' : 'Hochladen →'}
                  </button>
                </div>

                {/* Existing links */}
                {activeDate && (
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12 }}>
                      Eingetragene Links — {new Date(activeDate.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                    </div>
                    {(activeDate.links || []).length === 0 ? (
                      <div style={{ color: '#888', fontSize: 13 }}>Noch keine Links für diesen Monat.</div>
                    ) : (activeDate.links || []).map(link => (
                      <div key={link.id} className="link-row">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, flexShrink: 0 }}>🔗</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{link.title}</div>
                          <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer" className="btn" style={{ fontSize: 11, textDecoration: 'none' }}>Öffnen ↗</a>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* ── TIPPS ── */}
            {page === 'tips' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 6 }}>💡 Tipps &amp; Tricks</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Klicke auf eine Kategorie um die Inhalte zu sehen.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {[
                    { id: 'briefings', icon: '📋', label: 'Briefings' },
                    { id: 'skripte', icon: '📝', label: 'Skripte' },
                    { id: 'lernvideos', icon: '🎬', label: 'Lernvideos' },
                    { id: null, icon: '🤖', label: 'Skript-Generator', soon: true },
                  ].map(c => (
                    <div key={c.label} className={`tip-card${c.soon ? '' : ''}`}
                      style={c.soon ? { opacity: .5, cursor: 'default' } : {}}
                      onClick={() => { if (!c.soon && c.id) setPage(c.id as NavPage) }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                      {c.soon && <div style={{ fontSize: 10, color: '#ea580c', marginTop: 4 }}>Bald verfügbar</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── BRIEFINGS / SKRIPTE / LERNVIDEOS ── */}
            {(page === 'briefings' || page === 'skripte' || page === 'lernvideos') && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <button className="btn" onClick={() => setPage('tips')}>← Zurück</button>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {page === 'briefings' ? '📋 Briefings' : page === 'skripte' ? '📝 Skripte' : '🎬 Lernvideos'}
                  </div>
                </div>
                <div style={{ color: '#888', fontSize: 13 }}>Noch keine Inhalte vorhanden. Der Admin fügt diese hier ein.</div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #e8e8ec', borderLeft: '3px solid #16a34a', borderRadius: 8, padding: '10px 16px', fontSize: 13, zIndex: 999, boxShadow: '0 2px 12px rgba(0,0,0,.08)' }}>
          {toast}
        </div>
      )}
    </>
  )
}
