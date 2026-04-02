// v2.1 – Lightbox für Bild/Video, Google Drive öffnet neues Fenster, kein "Öffnen" Button
import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type Tab = 'bilder' | 'videos' | 'roh' | 'auswertung'
type NavPage = 'home' | 'upload' | 'tips' | 'briefings' | 'skripte' | 'lernvideos'

interface Upload {
  id: string
  file_name: string
  file_url: string
  file_type: string
  mime_type: string | null
  file_size: number | null
  tab: Tab
  created_at: string
  seen_by_admin: boolean
  r2_key: string | null
}

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'bilder', label: 'Bilder', icon: '🖼️' },
  { key: 'videos', label: 'Videos', icon: '🎬' },
  { key: 'roh', label: 'Rohmaterial', icon: '📹' },
  { key: 'auswertung', label: 'Auswertungen', icon: '📊' },
]

export default function CreatorPortal() {
  const router = useRouter()
  const [view, setView] = useState<'login' | 'portal'>('login')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [creator, setCreator] = useState<any>(null)
  const [uploads, setUploads] = useState<Upload[]>([])
  const [page, setPage] = useState<NavPage>('home')
  const [activeTab, setActiveTab] = useState<Tab>('bilder')
  const [toast, setToast] = useState('')
  const [lightbox, setLightbox] = useState<Upload | null>(null)

  // Upload form state
  const [uCategory, setUCategory] = useState<Tab>('bilder')
  const [uLabel, setULabel] = useState('')
  const [uBatch, setUBatch] = useState('')
  const [uProduct, setUProduct] = useState('')
  const [uLink, setULink] = useState('')
  const [uFile, setUFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  // Auto-login from URL code
  useEffect(() => {
    if (!router.isReady) return
    const urlCode = router.query.code as string
    if (!urlCode) {
      const saved = localStorage.getItem('creator_token')
      const savedCreator = localStorage.getItem('creator')
      if (saved && savedCreator) {
        setCreator(JSON.parse(savedCreator))
        loadUploads(JSON.parse(savedCreator).id, saved)
        setView('portal')
      }
      return
    }
    loginWithCode(urlCode.toUpperCase())
  }, [router.isReady])

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
      localStorage.setItem('creator_token', data.token)
      localStorage.setItem('creator', JSON.stringify(data.creator))
      setCreator(data.creator)
      await loadUploads(data.creator.id, data.token)
      setView('portal')
    } catch {
      setError('Verbindungsfehler. Bitte versuche es erneut.')
    }
    setLoading(false)
  }

  async function loadUploads(creatorId: string, token: string) {
    try {
      const res = await fetch(`/api/uploads?creatorId=${creatorId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) setUploads(data)
    } catch {}
  }

  async function handleUpload() {
    if (!uLabel.trim()) { showToast('Bitte eine Bezeichnung eingeben'); return }
    if (!uFile && !uLink.trim()) { showToast('Bitte eine Datei auswählen oder einen Link eintragen'); return }

    const token = localStorage.getItem('creator_token') || ''
    setUploading(true); setUploadPct(0)

    // ── Link-only Upload ──────────────────────────────────────────────────
    if (uLink.trim() && !uFile) {
      try {
        const fd = new FormData()
        fd.append('linkUrl', uLink.trim())
        fd.append('linkName', uLabel.trim())
        fd.append('creatorId', String(creator.id))
        fd.append('tab', uCategory)
        if (uBatch.trim()) fd.append('batch', uBatch.trim())
        if (uProduct.trim()) fd.append('product', uProduct.trim())

        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
          body: fd
        })
        const data = await res.json()
        if (!res.ok) { showToast('Fehler: ' + (data.error || 'Unbekannt')); setUploading(false); return }
        showToast(`"${uLabel}" wurde gespeichert ✓`)
        resetForm()
        await loadUploads(creator.id, token)
      } catch { showToast('Fehler beim Speichern') }
      setUploading(false)
      return
    }

    // ── Datei Upload via Presigned URL (direkt zu R2) ─────────────────────
    try {
      // Schritt 1: Presigned URL von der API holen
      setUploadPct(5)
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          fileName: uFile!.name,
          fileType: uFile!.type,
          creatorId: String(creator.id),
          tab: uCategory
        })
      })

      if (!urlRes.ok) {
        const err = await urlRes.json()
        showToast('Fehler beim Vorbereiten: ' + (err.error || 'Unbekannt'))
        setUploading(false)
        return
      }

      const { signedUrl, key, publicUrl } = await urlRes.json()
      setUploadPct(10)

      // Schritt 2: Datei direkt zu R2 hochladen via XHR (für Progress)
      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', uFile!.type)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) {
            // Progress von 10% bis 90%
            setUploadPct(10 + Math.round(e.loaded / e.total * 80))
          }
        }
        xhr.onload = () => {
          if (xhr.status === 200 || xhr.status === 204) resolve()
          else reject(new Error('R2 Upload fehlgeschlagen: ' + xhr.status))
        }
        xhr.onerror = () => reject(new Error('Netzwerkfehler'))
        xhr.send(uFile)
      })

      setUploadPct(90)

      // Schritt 3: Supabase-Eintrag via API erstellen
      const fd = new FormData()
      fd.append('creatorId', String(creator.id))
      fd.append('tab', uCategory)
      fd.append('linkName', uLabel.trim())
      fd.append('r2Key', key)
      fd.append('publicUrl', publicUrl)
      fd.append('fileSize', String(uFile!.size))
      fd.append('mimeType', uFile!.type)
      if (uBatch.trim()) fd.append('batch', uBatch.trim())
      if (uProduct.trim()) fd.append('product', uProduct.trim())
      if (uLink.trim()) fd.append('linkUrl', uLink.trim())

      const saveRes = await fetch('/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })

      const saveData = await saveRes.json()
      if (!saveRes.ok) {
        showToast('Datei hochgeladen aber Fehler beim Speichern: ' + (saveData.error || 'Unbekannt'))
        setUploading(false)
        return
      }

      setUploadPct(100)
      showToast(`"${uLabel}" erfolgreich hochgeladen ✓`)
      resetForm()
      await loadUploads(creator.id, token)

    } catch (err: any) {
      showToast('Fehler: ' + (err.message || 'Unbekannt'))
    }

    setUploading(false)
  }

  function resetForm() {
    setULabel(''); setUBatch(''); setUProduct(''); setULink(''); setUFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setUploadPct(0)
  }

  function handleCardClick(u: Upload) {
    if (u.file_type === 'link') {
      window.open(u.file_url, '_blank')
      return
    }
    setLightbox(u)
  }

  function closeLightbox() { setLightbox(null) }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3500)
  }

  function logout() {
    localStorage.removeItem('creator_token')
    localStorage.removeItem('creator')
    setView('login'); setCreator(null); setUploads([]); setCode('')
    router.push('/creator')
  }

  function fmtSize(bytes: number | null) {
    if (!bytes) return ''
    return bytes > 1024 * 1024
      ? `${(bytes / 1024 / 1024).toFixed(1)} MB`
      : `${(bytes / 1024).toFixed(0)} KB`
  }

  function fmtDate(str: string) {
    return new Date(str).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })
  }

  const tabUploads = uploads.filter(u => u.tab === activeTab)
  const totalUploads = uploads.length

  // ── LOGIN ─────────────────────────────────────────────────────────────────
  if (view === 'login') return (
    <>
      <Head><title>Creator Portal – Filapen</title></Head>
      <style>{css}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f4f5f7', padding: 24 }}>
        <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#111' }}>Creator Portal</div>
          <div style={{ fontSize: 12, color: '#888', marginBottom: 28 }}>Gib deinen Einladungscode ein um fortzufahren.</div>
          <form onSubmit={e => { e.preventDefault(); loginWithCode(code) }}>
            <div style={{ marginBottom: 14 }}>
              <label style={s.fl}>Einladungscode</label>
              <input
                style={{ ...s.fi, fontSize: 22, fontWeight: 700, letterSpacing: 6, textAlign: 'center', textTransform: 'uppercase' }}
                value={code}
                onChange={e => setCode(e.target.value.toUpperCase())}
                placeholder="XXXXXXXX"
                maxLength={8}
                required
              />
            </div>
            {error && <div style={s.errBox}>{error}</div>}
            <button style={{ ...s.btnP, marginTop: 8 }} type="submit" disabled={loading}>
              {loading ? 'Wird geprüft...' : 'Einloggen →'}
            </button>
          </form>
          <div style={{ textAlign: 'center', marginTop: 20, fontSize: 11, color: '#bbb' }}>Filapen GmbH · Creator Hub</div>
        </div>
      </div>
    </>
  )

  // ── PORTAL ────────────────────────────────────────────────────────────────
  return (
    <>
      <Head><title>{creator?.name} – Creator Portal</title></Head>
      <style>{css}</style>

      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

        {/* TOPBAR */}
        <div style={{ background: '#fff', borderBottom: '1px solid #e8e8ec', height: 50, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ fontWeight: 700, fontSize: 14, color: '#111' }}>Creator Portal</div>
          <div style={{ fontSize: 11, color: '#aaa' }}>Ansicht als Creator</div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#888' }}>Angemeldet als: <strong style={{ color: '#111' }}>{creator?.name}</strong></span>
            <button onClick={logout} style={s.btnGhost}>Abmelden</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* SIDEBAR */}
          <div style={{ width: 200, background: '#fff', borderRight: '1px solid #e8e8ec', flexShrink: 0, padding: '12px 7px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={s.navLabel}>Mein Bereich</div>
            {([
              { id: 'home', label: 'Mein Dashboard', icon: '⊞' },
              { id: 'upload', label: 'Inhalte hochladen', icon: '⬆' },
              { id: 'tips', label: 'Tipps & Tricks', icon: '💡' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center', fontSize: 12 }}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{ ...s.navLabel, marginTop: 10 }}>Tipps & Tricks</div>
            {([
              { id: 'briefings', label: 'Briefings', icon: '📋' },
              { id: 'skripte', label: 'Skripte', icon: '📝' },
              { id: 'lernvideos', label: 'Lernvideos', icon: '🎬' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} style={{ paddingLeft: 20 }} onClick={() => setPage(n.id)}>
                <span style={{ width: 15, textAlign: 'center', fontSize: 12 }}>{n.icon}</span>{n.label}
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 14, borderTop: '1px solid #e8e8ec' }}>
              <div style={{ fontSize: 10, color: '#aaa', padding: '0 6px' }}>
                {totalUploads} Datei{totalUploads !== 1 ? 'en' : ''} hochgeladen
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#f4f5f7' }}>

            {/* ── HOME ── */}
            {page === 'home' && (
              <>
                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>Willkommen zurück 👋</div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>Hallo {creator?.name?.split(' ')[0]}, schön dass du da bist!</div>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
                  <div style={s.sc}>
                    <div style={s.sl}>Kategorien</div>
                    <div style={s.sv}>{TABS.filter(t => uploads.some(u => u.tab === t.key)).length}</div>
                  </div>
                  <div style={s.sc}>
                    <div style={s.sl}>Dateien gesamt</div>
                    <div style={s.sv}>{totalUploads}</div>
                  </div>
                  <div style={s.sc}>
                    <div style={s.sl}>Hochgeladen</div>
                    <div style={{ ...s.sv, color: '#16a34a' }}>{totalUploads}</div>
                  </div>
                </div>

                {/* CATEGORY TABS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8ec', marginBottom: 0, background: '#fff', borderRadius: '8px 8px 0 0', padding: '0 4px' }}>
                  {TABS.map(t => (
                    <button key={t.key} className={`tab-btn${activeTab === t.key ? ' on' : ''}`} onClick={() => setActiveTab(t.key)}>
                      {t.icon} {t.label}
                      {uploads.filter(u => u.tab === t.key).length > 0 && (
                        <span style={{ marginLeft: 4, fontSize: 10, background: '#f0f0f3', borderRadius: 8, padding: '1px 5px', color: '#666' }}>
                          {uploads.filter(u => u.tab === t.key).length}
                        </span>
                      )}
                    </button>
                  ))}
                </div>

                {/* FILE GRID */}
                {tabUploads.length === 0 ? (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 32, textAlign: 'center', color: '#aaa' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{TABS.find(t => t.key === activeTab)?.icon}</div>
                    <div style={{ fontSize: 13, marginBottom: 12, color: '#888' }}>Noch keine Inhalte in dieser Kategorie</div>
                    <button style={s.btnP} onClick={() => { setUCategory(activeTab); setPage('upload') }}>+ Hochladen</button>
                  </div>
                ) : (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                      {tabUploads.map(u => (
                        <div
                          key={u.id}
                          onClick={() => handleCardClick(u)}
                          style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 9, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8ec')}
                        >
                          <div style={{ height: 100, background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, overflow: 'hidden', position: 'relative' }}>
                            {u.mime_type?.startsWith('image/') && u.file_url
                              ? <img src={u.file_url} alt={u.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                              : u.file_type === 'video' ? '🎬'
                              : u.file_type === 'link' ? '🔗'
                              : '📄'}
                            {u.file_type === 'video' && (
                              <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</div>
                              </div>
                            )}
                          </div>
                          <div style={{ padding: '8px 10px' }}>
                            <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#111' }}>{u.file_name}</div>
                            {(u as any).batch && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>📦 {(u as any).batch}</div>}
                            {(u as any).product && <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>🏷️ {(u as any).product}</div>}
                            <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{fmtDate(u.created_at)}{u.file_size ? ` · ${fmtSize(u.file_size)}` : ''}</div>
                            {u.file_type === 'link' && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 3 }}>↗ Link öffnen</div>}
                          </div>
                        </div>
                      ))}
                      <div
                        style={{ border: '1.5px dashed #e8e8ec', borderRadius: 9, minHeight: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', color: '#aaa' }}
                        onClick={() => { setUCategory(activeTab); setPage('upload') }}
                      >
                        <div style={{ fontSize: 18 }}>+</div>
                        <span style={{ fontSize: 10, fontWeight: 500 }}>Hochladen</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* ── UPLOAD ── */}
            {page === 'upload' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 16 }}>Inhalte hochladen</div>
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 4 }}>Datei hochladen</div>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>
                    Lade Bilder oder Videos hoch oder trage einen Google Drive Link ein. Alles bleibt dauerhaft gespeichert.
                  </div>

                  {/* Row 1: Kategorie + Bezeichnung */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={s.fl}>Kategorie</label>
                      <select style={s.fi} value={uCategory} onChange={e => setUCategory(e.target.value as Tab)}>
                        <option value="bilder">🖼️ Bilder</option>
                        <option value="videos">🎬 Videos</option>
                        <option value="roh">📹 Rohmaterial</option>
                        <option value="auswertung">📊 Auswertungen</option>
                      </select>
                    </div>
                    <div>
                      <label style={s.fl}>Bezeichnung *</label>
                      <input style={s.fi} value={uLabel} onChange={e => setULabel(e.target.value)} placeholder="z.B. Lookbook Shot 01" />
                    </div>
                  </div>

                  {/* Row 2: Batch + Produkt */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                    <div>
                      <label style={s.fl}>Batch (optional)</label>
                      <input style={s.fi} value={uBatch} onChange={e => setUBatch(e.target.value)} placeholder="z.B. 01.04.26 / Osteraktion" />
                    </div>
                    <div>
                      <label style={s.fl}>Produkt (optional)</label>
                      <input style={s.fi} value={uProduct} onChange={e => setUProduct(e.target.value)} placeholder="z.B. 3D Stift" />
                    </div>
                  </div>

                  {/* Row 3: Google Drive Link */}
                  <div style={{ marginBottom: 14 }}>
                    <label style={s.fl}>Google Drive Link (optional)</label>
                    <input style={s.fi} value={uLink} onChange={e => setULink(e.target.value)} placeholder="https://drive.google.com/..." />
                  </div>

                  {/* Dropzone */}
                  <div
                    style={{ border: '1.5px dashed #e8e8ec', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#f9f9fb', marginBottom: 14 }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setUFile(f) }}
                  >
                    {uFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                        <span style={{ fontSize: 22 }}>{uFile.type.startsWith('image/') ? '🖼️' : '🎬'}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#111' }}>{uFile.name}</div>
                          <div style={{ fontSize: 10, color: '#888' }}>{fmtSize(uFile.size)}</div>
                        </div>
                        <span style={{ marginLeft: 8, color: '#16a34a', fontSize: 18 }}>✓</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>📂</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Klicken oder Datei hierher ziehen</div>
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Bilder & Videos bis 500 MB · optional wenn Link angegeben</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }}
                    onChange={e => setUFile(e.target.files?.[0] || null)} />

                  {/* Progress */}
                  {uploading && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Upload: {uploadPct}%</div>
                      <div style={{ height: 5, background: '#e8e8ec', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#4f6ef7', borderRadius: 3, width: `${uploadPct}%`, transition: 'width .1s' }} />
                      </div>
                    </div>
                  )}

                  <button style={{ ...s.btnP, width: '100%' }} onClick={handleUpload} disabled={uploading}>
                    {uploading ? `Wird hochgeladen... ${uploadPct}%` : 'Hochladen →'}
                  </button>
                </div>

                {/* Uploaded files overview */}
                {uploads.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 14 }}>
                      Deine hochgeladenen Dateien ({uploads.length})
                    </div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {TABS.map(t => (
                        <button key={t.key}
                          style={{ padding: '4px 10px', borderRadius: 6, border: `1px solid ${uCategory === t.key ? '#111' : '#e8e8ec'}`, background: uCategory === t.key ? '#111' : '#fff', color: uCategory === t.key ? '#fff' : '#888', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
                          onClick={() => setUCategory(t.key)}>
                          {t.icon} {t.label} ({uploads.filter(u => u.tab === t.key).length})
                        </button>
                      ))}
                    </div>
                    {uploads.filter(u => u.tab === uCategory).length === 0 ? (
                      <div style={{ color: '#aaa', fontSize: 12 }}>Noch keine Dateien in dieser Kategorie.</div>
                    ) : (
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                        {uploads.filter(u => u.tab === uCategory).map(u => (
                          <div
                            key={u.id}
                            onClick={() => handleCardClick(u)}
                            style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 9, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8ec')}
                          >
                            <div style={{ height: 80, background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden' }}>
                              {u.mime_type?.startsWith('image/') && u.file_url
                                ? <img src={u.file_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : u.file_type === 'video' ? '🎬'
                                : u.file_type === 'link' ? '🔗'
                                : '📄'}
                            </div>
                            <div style={{ padding: '7px 9px' }}>
                              <div style={{ fontSize: 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#111' }}>{u.file_name}</div>
                              <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{fmtDate(u.created_at)}</div>
                              {u.file_type === 'link' && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>↗ Link öffnen</div>}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* ── TIPS ── */}
            {page === 'tips' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#111', marginBottom: 6 }}>Tipps & Tricks</div>
                <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>Klicke auf eine Kategorie.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                  {[
                    { id: 'briefings', icon: '📋', label: 'Briefings' },
                    { id: 'skripte', icon: '📝', label: 'Skripte' },
                    { id: 'lernvideos', icon: '🎬', label: 'Lernvideos' },
                  ].map(c => (
                    <div key={c.id}
                      style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 20, cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setPage(c.id as NavPage)}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>{c.label}</div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {/* ── SUB-PAGES ── */}
            {(page === 'briefings' || page === 'skripte' || page === 'lernvideos') && (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                  <button onClick={() => setPage('tips')} style={s.btnGhost}>← Zurück</button>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111' }}>
                    {page === 'briefings' ? '📋 Briefings' : page === 'skripte' ? '📝 Skripte' : '🎬 Lernvideos'}
                  </div>
                </div>
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 28, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                  Noch keine Inhalte vorhanden. Der Admin fügt diese hier ein.
                </div>
              </>
            )}

          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: '#fff', border: '1px solid #e8e8ec', borderLeft: '3px solid #16a34a', borderRadius: 8, padding: '10px 16px', fontSize: 13, zIndex: 9999, boxShadow: '0 2px 12px rgba(0,0,0,.1)', color: '#111' }}>
          {toast}
        </div>
      )}

      {/* LIGHTBOX */}
      {lightbox && (
        <div
          onClick={closeLightbox}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}
        >
          <button
            onClick={closeLightbox}
            style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >✕</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {lightbox.mime_type?.startsWith('image/') ? (
              <img src={lightbox.file_url} alt={lightbox.file_name} style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: 8, objectFit: 'contain' }} />
            ) : lightbox.file_type === 'video' ? (
              <video src={lightbox.file_url} controls autoPlay style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: 8 }} />
            ) : (
              <div style={{ color: '#fff', fontSize: 48 }}>📄</div>
            )}
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{lightbox.file_name}</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 3 }}>
                {fmtDate(lightbox.created_at)}{lightbox.file_size ? ` · ${fmtSize(lightbox.file_size)}` : ''}
              </div>
            </div>
            <button
              onClick={async () => {
                try {
                  const res = await fetch(lightbox.file_url)
                  const blob = await res.blob()
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = lightbox.file_name
                  a.click()
                  URL.revokeObjectURL(url)
                } catch { window.open(lightbox.file_url, '_blank') }
              }}
              style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 7, padding: '7px 16px', fontSize: 12, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              ⬇ Herunterladen
            </button>
          </div>
        </div>
      )}
    </>
  )
}

const css = `
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:system-ui,sans-serif;font-size:13px;color:#111;}
  .ni{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:#777;margin-bottom:1px;user-select:none;}
  .ni:hover,.ni.on{background:#f0f0f3;color:#111;}
  .ni.on{font-weight:500;}
  .tab-btn{padding:8px 14px;border:none;background:none;cursor:pointer;font-size:12px;color:#777;border-bottom:2px solid transparent;font-family:inherit;white-space:nowrap;}
  .tab-btn.on{color:#111;font-weight:600;border-bottom-color:#111;}
  .tab-btn:hover:not(.on){color:#444;}
`

const s: Record<string, React.CSSProperties> = {
  fl: { display: 'block', fontSize: 9, fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '.4px', marginBottom: 5 },
  fi: { width: '100%', border: '1px solid #e8e8ec', borderRadius: 7, padding: '8px 10px', fontFamily: 'inherit', fontSize: 12, outline: 'none', background: '#fff', color: '#111' },
  btnP: { background: '#111', color: '#fff', border: '1px solid #111', borderRadius: 8, padding: '10px 16px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit' },
  btnGhost: { background: '#fff', border: '1px solid #e8e8ec', borderRadius: 7, padding: '5px 12px', fontSize: 12, cursor: 'pointer', color: '#666', fontFamily: 'inherit' },
  sc: { background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: '10px 14px' },
  sl: { fontSize: 9, color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '.5px', marginBottom: 4 },
  sv: { fontSize: 22, fontWeight: 700, color: '#111' },
  navLabel: { fontSize: 9, fontWeight: 600, color: '#bbb', textTransform: 'uppercase', letterSpacing: 1, padding: '0 6px', marginBottom: 5 },
  errBox: { background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 7, padding: '8px 12px', fontSize: 12, color: '#dc2626', marginBottom: 14 },
}
