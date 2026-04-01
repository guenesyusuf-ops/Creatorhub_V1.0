// v1.8 – Creator Portal
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type NavPage = 'home' | 'upload' | 'tips' | 'briefings' | 'skripte' | 'lernvideos'

interface UploadItem {
  id: string
  name: string
  batch: string | null
  product: string | null
  category: string
  file_url: string
  file_name: string | null
  file_size: number | null
  mime_type: string | null
  created_at: string
}

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

const TABS = [
  { key: 'bilder', label: 'Bilder', icon: '🖼️' },
  { key: 'videos', label: 'Videos', icon: '🎬' },
  { key: 'roh', label: 'Rohmaterial', icon: '📹' },
  { key: 'auswertung', label: 'Auswertungen', icon: '📊' },
] as const

export default function CreatorPortal() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'portal'>('login')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [creator, setCreator] = useState<any>(null)
  const [dates, setDates] = useState<DateItem[]>([])
  const [uploads, setUploads] = useState<UploadItem[]>([])
  const [page, setPage] = useState<NavPage>('home')
  const [activeDate, setActiveDate] = useState<DateItem | null>(null)
  const [newTitle, setNewTitle] = useState('')
  const [newUrl, setNewUrl] = useState('')
  const [adding, setAdding] = useState(false)
  const [toast, setToast] = useState('')
  const [activeTab, setActiveTab] = useState<'bilder' | 'videos' | 'roh' | 'auswertung'>('bilder')
  // Upload form
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [uploadName, setUploadName] = useState('')
  const [uploadBatch, setUploadBatch] = useState('')
  const [uploadProduct, setUploadProduct] = useState('')
  const [uploadCategory, setUploadCategory] = useState<'bilder' | 'videos' | 'roh' | 'auswertung'>('bilder')
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-login from URL
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
      await Promise.all([
        loadDates(data.creator.id, data.token),
        loadUploads(data.creator.id, data.token),
      ])
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

  async function loadUploads(creatorId: string, token: string) {
    try {
      const res = await fetch(`/api/uploads?creator_id=${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) setUploads(data)
    } catch {}
  }

  async function addLink(e: any) {
    e.preventDefault()
    if (!activeDate) return
    setAdding(true)
    const token = localStorage.getItem('token')!
    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ date_id: activeDate.id, creator_id: creator.id, title: newTitle, url: newUrl })
    })
    if (res.ok) {
      setNewTitle(''); setNewUrl('')
      showToast('✓ Link hinzugefügt!')
      await loadDates(creator.id, token)
    }
    setAdding(false)
  }

  async function handleUpload() {
    if (!uploadFile || !uploadName.trim()) { showToast('Bitte Datei und Bezeichnung angeben'); return }
    setUploading(true); setUploadProgress(0)
    const token = localStorage.getItem('token')!
    const formData = new FormData()
    formData.append('file', uploadFile)
    formData.append('creatorId', creator.id)
    formData.append('tab', uploadCategory)
    formData.append('name', uploadName)
    formData.append('batch', uploadBatch)
    formData.append('product', uploadProduct)

    const iv = setInterval(() => setUploadProgress(p => p >= 85 ? p : p + 8), 150)
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData
      })
      clearInterval(iv); setUploadProgress(100)
      if (res.ok) {
        showToast(`✓ "${uploadName}" erfolgreich hochgeladen!`)
        setUploadFile(null); setUploadName(''); setUploadBatch(''); setUploadProduct('')
        if (fileRef.current) fileRef.current.value = ''
        setTimeout(() => setUploadProgress(0), 800)
        await loadUploads(creator.id, token)
      } else {
        const err = await res.json()
        showToast('Upload fehlgeschlagen: ' + (err.error || 'Fehler'))
      }
    } catch { clearInterval(iv); showToast('Upload fehlgeschlagen.') }
    setUploading(false)
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  function logout() {
    localStorage.removeItem('token'); localStorage.removeItem('creator')
    setView('login'); setCreator(null); setDates([]); setUploads([]); setCode('')
  }

  function formatSize(bytes: number | null) {
    if (!bytes) return ''
    if (bytes > 1024 * 1024) return `${(bytes / 1024 / 1024).toFixed(1)} MB`
    return `${(bytes / 1024).toFixed(0)} KB`
  }

  function formatDate(str: string) {
    return new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
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
              <label style={st.fl}>Einladungscode</label>
              <input style={{ ...st.fi, fontSize: 20, fontWeight: 700, letterSpacing: 5, textAlign: 'center', textTransform: 'uppercase' }}
                value={code} onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX" maxLength={8} required />
            </div>
            {error && <div style={{ background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 14 }}>{error}</div>}
            <button style={st.btnP} type="submit" disabled={loading}>
              {loading ? 'Prüfe Code...' : 'Einloggen →'}
            </button>
          </form>
        </div>
      </div>
    </>
  )

  // ─── PORTAL ───────────────────────────────────────────────────────────────
  const tabUploads = uploads.filter(u => u.category === activeTab)

  return (
    <>
      <Head><title>{creator?.name} – Creator Portal</title></Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:system-ui,sans-serif;background:#f4f5f7;color:#111;font-size:13px;}
        .ni{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:#777;margin-bottom:1px;user-select:none;}
        .ni:hover,.ni.on{background:#f0f0f3;color:#111;}
        .ni.on{font-weight:500;}
        .tab-btn{padding:7px 14px;border:none;background:none;cursor:pointer;font-size:12px;color:#777;border-bottom:2px solid transparent;font-family:inherit;white-space:nowrap;}
        .tab-btn.on{color:#111;font-weight:600;border-bottom-color:#111;}
        .tab-btn:hover:not(.on){color:#444;}
        .fcard{background:#fff;border:1px solid #e8e8ec;border-radius:9px;padding:12px;cursor:pointer;transition:border-color .15s;}
        .fcard:hover{border-color:#bbb;}
        .add-fcard{background:#fff;border:1.5px dashed #e8e8ec;border-radius:9px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:#aaa;transition:border-color .15s;}
        .add-fcard:hover{border-color:#aaa;color:#777;}
        .dz{border:1.5px dashed #e8e8ec;border-radius:8px;padding:20px;text-align:center;cursor:pointer;background:#f9f9fb;transition:border-color .15s;}
        .dz:hover{border-color:#4f6ef7;background:#f0f2ff;}
        .file-card{background:#fff;border:1px solid #e8e8ec;border-radius:9px;overflow:hidden;}
        .file-thumb{height:120px;background:#f4f5f7;display:flex;align-items:center;justify-content:center;font-size:32px;overflow:hidden;}
        .file-thumb img,.file-thumb video{width:100%;height:100%;object-fit:cover;}
        .tip-card{background:#fff;border:1px solid #e8e8ec;border-radius:10px;padding:18px;cursor:pointer;text-align:center;transition:border-color .15s;}
        .tip-card:hover{border-color:#4f6ef7;}
        .link-row{background:#fff;border:1px solid #e8e8ec;border-radius:8px;padding:10px 14px;display:flex;align-items:center;gap:12px;margin-bottom:7px;}
        .prog-track{height:5px;background:#e8e8ec;border-radius:3px;overflow:hidden;}
        .prog-fill{height:100%;background:#4f6ef7;border-radius:3px;transition:width .1s;}
      `}</style>

      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8ec', height: 52, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 12, position: 'sticky', top: 0, zIndex: 100 }}>
          <div style={{ fontWeight: 700, fontSize: 14 }}>🎨 Creator Portal</div>
          <div style={{ fontSize: 11, color: '#888' }}>Ansicht als Creator</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <div style={{ fontSize: 11, color: '#888' }}>Angemeldet als: <strong>{creator?.name}</strong></div>
            <button onClick={logout} style={{ background: 'none', border: '1px solid #e8e8ec', borderRadius: 6, padding: '5px 10px', fontSize: 11, cursor: 'pointer', color: '#666' }}>⏻ Abmelden</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* SIDEBAR */}
          <div style={{ width: 200, background: '#fff', borderRight: '1px solid #e8e8ec', flexShrink: 0, padding: '12px 8px', overflowY: 'auto' }}>
            <div style={st.navLabel}>Mein Bereich</div>
            {([
              { id: 'home', label: 'Mein Dashboard', icon: '⊞' },
              { id: 'upload', label: 'Inhalte hochladen', icon: '⬆' },
              { id: 'tips', label: 'Tipps & Tricks', icon: '💡' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center' }}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{ ...st.navLabel, marginTop: 8 }}>Tipps &amp; Tricks</div>
            {([
              { id: 'briefings', label: 'Briefings', icon: '📋' },
              { id: 'skripte', label: 'Skripte', icon: '📝' },
              { id: 'lernvideos', label: 'Lernvideos', icon: '🎬' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} style={{ paddingLeft: 20 }} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center' }}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{ marginTop: 20, paddingTop: 16, borderTop: '1px solid #e8e8ec' }}>
              <div style={{ fontSize: 10, color: '#aaa', padding: '0 6px' }}>
                📁 {uploads.length} Dateien hochgeladen
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20 }}>

            {/* ── HOME ── */}
            {page === 'home' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 2 }}>Willkommen zurück 👋</div>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>Hallo {creator?.name?.split(' ')[0]}, schön dass du da bist!</div>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
                  <div style={st.sc}><div style={st.sl}>Meine Ordner</div><div style={st.sv}>0</div></div>
                  <div style={st.sc}><div style={st.sl}>Dateien gesamt</div><div style={st.sv}>{uploads.length}</div></div>
                  <div style={st.sc}><div style={st.sl}>Hochgeladen</div><div style={{ ...st.sv, color: '#16a34a' }}>{uploads.length}</div></div>
                </div>

                {/* CATEGORY TABS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8ec', marginBottom: 14 }}>
                  {TABS.map(t => (
                    <button key={t.key} className={`tab-btn${activeTab === t.key ? ' on' : ''}`} onClick={() => setActiveTab(t.key)}>
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>

                {/* FILE GRID */}
                {tabUploads.length === 0 ? (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 8 }}>
                    <div className="add-fcard" onClick={() => setPage('upload')}>
                      <div style={{ fontSize: 16 }}>📁</div>
                      <span style={{ fontSize: 10, fontWeight: 500 }}>Neuer Ordner</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                    {tabUploads.map(u => (
                      <div key={u.id} className="file-card">
                        <div className="file-thumb">
                          {u.mime_type?.startsWith('image/') ? (
                            <img src={u.file_url} alt={u.name} />
                          ) : u.mime_type?.startsWith('video/') ? (
                            <video src={u.file_url} />
                          ) : (
                            <span>📄</span>
                          )}
                        </div>
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                          {u.batch && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>📦 {u.batch}</div>}
                          {u.product && <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>🏷️ {u.product}</div>}
                          <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{formatDate(u.created_at)}{u.file_size ? ` · ${formatSize(u.file_size)}` : ''}</div>
                        </div>
                      </div>
                    ))}
                    <div className="add-fcard" onClick={() => setPage('upload')}>
                      <div style={{ fontSize: 16 }}>+</div>
                      <span style={{ fontSize: 10, fontWeight: 500 }}>Hochladen</span>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── UPLOAD ── */}
            {page === 'upload' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Inhalte hochladen</div>

                {/* Link eintragen */}
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>🔗 Video-Link eintragen</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 14 }}>Trage deinen Video-Link ein. Das Team wird automatisch benachrichtigt.</div>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 14 }}>
                    {dates.map(d => {
                      const label = new Date(d.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
                      const active = activeDate?.id === d.id
                      return (
                        <button key={d.id} onClick={() => setActiveDate(d)}
                          style={{ padding: '5px 12px', borderRadius: 20, border: `1px solid ${active ? '#111' : '#e8e8ec'}`, background: active ? '#111' : '#fff', color: active ? '#fff' : '#888', fontSize: 12, cursor: 'pointer' }}>
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
                        <label style={st.fl}>Bezeichnung</label>
                        <input style={st.fi} value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="z.B. Brand Video März" required />
                      </div>
                      <div>
                        <label style={st.fl}>Link / URL</label>
                        <input style={st.fi} value={newUrl} onChange={e => setNewUrl(e.target.value)} placeholder="https://drive.google.com/..." required />
                      </div>
                      <button style={{ ...st.btnP, whiteSpace: 'nowrap' as const }} type="submit" disabled={adding}>{adding ? '...' : 'Eintragen'}</button>
                    </form>
                  )}
                </div>

                {/* Datei hochladen */}
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginBottom: 14 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>📤 Datei hochladen</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Lade Bilder oder Videos direkt hoch. Sie bleiben dauerhaft in deinem Portal gespeichert.</div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={st.fl}>Kategorie</label>
                      <select style={st.fi} value={uploadCategory} onChange={e => setUploadCategory(e.target.value as any)}>
                        {TABS.map(t => <option key={t.key} value={t.key}>{t.icon} {t.label}</option>)}
                      </select>
                    </div>
                    <div>
                      <label style={st.fl}>Bezeichnung *</label>
                      <input style={st.fi} value={uploadName} onChange={e => setUploadName(e.target.value)} placeholder="z.B. Lookbook Shot 01" />
                    </div>
                    <div>
                      <label style={st.fl}>Batch (z.B. 01.04.26 / Osteraktion)</label>
                      <input style={st.fi} value={uploadBatch} onChange={e => setUploadBatch(e.target.value)} placeholder="z.B. 01.04.26 / Osteraktion" />
                    </div>
                    <div>
                      <label style={st.fl}>Produkt</label>
                      <input style={st.fi} value={uploadProduct} onChange={e => setUploadProduct(e.target.value)} placeholder="z.B. 3D Stift" />
                    </div>
                  </div>

                  <div className="dz" onClick={() => fileRef.current?.click()} style={{ marginBottom: 12 }}>
                    {uploadFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ fontSize: 24 }}>{uploadFile.type.startsWith('image/') ? '🖼️' : '🎬'}</span>
                        <div style={{ textAlign: 'left' as const }}>
                          <div style={{ fontSize: 12, fontWeight: 500 }}>{uploadFile.name}</div>
                          <div style={{ fontSize: 10, color: '#888' }}>{formatSize(uploadFile.size)}</div>
                        </div>
                        <span style={{ marginLeft: 'auto', color: '#16a34a', fontSize: 18 }}>✓</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>📂</div>
                        <div style={{ fontSize: 12, fontWeight: 500 }}>Klicken oder Datei hierher ziehen</div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Bilder & Videos bis 500 MB</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => setUploadFile(e.target.files?.[0] || null)} />

                  {uploading && (
                    <div style={{ marginBottom: 10 }}>
                      <div style={{ fontSize: 11, marginBottom: 4, color: '#666' }}>Upload: {uploadProgress}%</div>
                      <div className="prog-track"><div className="prog-fill" style={{ width: `${uploadProgress}%` }} /></div>
                    </div>
                  )}
                  <button style={{ ...st.btnP, width: '100%' }} onClick={handleUpload} disabled={uploading}>
                    {uploading ? 'Wird hochgeladen...' : 'Hochladen →'}
                  </button>
                </div>

                {/* Hochgeladene Dateien unterhalb */}
                {uploads.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 14 }}>📁 Deine hochgeladenen Dateien ({uploads.length})</div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' as const, marginBottom: 14 }}>
                      {TABS.map(t => (
                        <button key={t.key} className={`tab-btn${uploadCategory === t.key ? ' on' : ''}`}
                          style={{ padding: '4px 10px', borderBottom: 'none', borderRadius: 6, border: `1px solid ${uploadCategory === t.key ? '#111' : '#e8e8ec'}`, background: uploadCategory === t.key ? '#111' : '#fff', color: uploadCategory === t.key ? '#fff' : '#888' }}
                          onClick={() => setUploadCategory(t.key)}>
                          {t.icon} {t.label} ({uploads.filter(u => u.category === t.key).length})
                        </button>
                      ))}
                    </div>
                    {uploads.filter(u => u.category === uploadCategory).length === 0 ? (
                      <div style={{ color: '#aaa', fontSize: 12 }}>Keine Dateien in dieser Kategorie.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
                        {uploads.filter(u => u.category === uploadCategory).map(u => (
                          <div key={u.id} className="file-card">
                            <div className="file-thumb">
                              {u.mime_type?.startsWith('image/') ? (
                                <img src={u.file_url} alt={u.name} />
                              ) : u.mime_type?.startsWith('video/') ? (
                                <span>🎬</span>
                              ) : (
                                <span>📄</span>
                              )}
                            </div>
                            <div style={{ padding: '8px 10px' }}>
                              <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.name}</div>
                              {u.batch && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>📦 {u.batch}</div>}
                              {u.product && <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>🏷️ {u.product}</div>}
                              <div style={{ fontSize: 10, color: '#aaa', marginTop: 3 }}>{formatDate(u.created_at)}{u.file_size ? ` · ${formatSize(u.file_size)}` : ''}</div>
                              <a href={u.file_url} target="_blank" rel="noreferrer"
                                style={{ display: 'inline-block', marginTop: 6, fontSize: 10, color: '#4f6ef7', textDecoration: 'none', background: '#eff2ff', borderRadius: 4, padding: '2px 7px' }}>
                                Öffnen ↗
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* Existing links */}
                {activeDate && (activeDate.links?.length || 0) > 0 && (
                  <div style={{ marginTop: 14 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 10 }}>
                      Eingetragene Links — {new Date(activeDate.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
                    </div>
                    {(activeDate.links || []).map(link => (
                      <div key={link.id} className="link-row">
                        <div style={{ width: 32, height: 32, borderRadius: 8, background: '#eff2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14 }}>🔗</div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{link.title}</div>
                          <div style={{ fontSize: 11, color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{link.url}</div>
                        </div>
                        <a href={link.url} target="_blank" rel="noreferrer"
                          style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 7, padding: '5px 10px', fontSize: 11, color: '#666', textDecoration: 'none' }}>
                          Öffnen ↗
                        </a>
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
                <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Klicke auf eine Kategorie.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
                  {[
                    { id: 'briefings', icon: '📋', label: 'Briefings' },
                    { id: 'skripte', icon: '📝', label: 'Skripte' },
                    { id: 'lernvideos', icon: '🎬', label: 'Lernvideos' },
                    { id: null, icon: '🤖', label: 'Skript-Generator', soon: true },
                  ].map(c => (
                    <div key={c.label} className="tip-card" style={c.soon ? { opacity: .5, cursor: 'default' } : {}}
                      onClick={() => { if (!c.soon && c.id) setPage(c.id as NavPage) }}>
                      <div style={{ fontSize: 32, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{c.label}</div>
                      {c.soon && <div style={{ fontSize: 10, color: '#ea580c', marginTop: 4 }}>Bald verfügbar</div>}
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── SUB-PAGES ── */}
            {(page === 'briefings' || page === 'skripte' || page === 'lernvideos') && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
                  <button onClick={() => setPage('tips')} style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 6, padding: '5px 10px', fontSize: 12, cursor: 'pointer' }}>← Zurück</button>
                  <div style={{ fontSize: 18, fontWeight: 700 }}>
                    {page === 'briefings' ? '📋 Briefings' : page === 'skripte' ? '📝 Skripte' : '🎬 Lernvideos'}
                  </div>
                </div>
                <div style={{ color: '#888', fontSize: 13, background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 24, textAlign: 'center' as const }}>
                  Noch keine Inhalte vorhanden. Der Admin fügt diese hier ein.
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #e8e8ec', borderLeft: '3px solid #16a34a', borderRadius: 8, padding: '10px 16px', fontSize: 13, zIndex: 9999, boxShadow: '0 2px 12px rgba(0,0,0,.1)' }}>
          {toast}
        </div>
      )}
    </>
  )
}

const st: any = {
  fl: { display: 'block', fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 4 },
  fi: { width: '100%', border: '1px solid #e8e8ec', borderRadius: 7, padding: '7px 9px', fontFamily: 'inherit', fontSize: 12, outline: 'none', background: '#fff', color: '#111' },
  btnP: { background: '#111', color: '#fff', border: '1px solid #111', borderRadius: 7, padding: '9px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', width: '100%' },
  sc: { background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: '10px 14px' },
  sl: { fontSize: 9, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 3 },
  sv: { fontSize: 22, fontWeight: 700 },
  navLabel: { fontSize: 9, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, padding: '0 6px', marginBottom: 4 },
}
