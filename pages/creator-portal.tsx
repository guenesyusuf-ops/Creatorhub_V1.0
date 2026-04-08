// v2.5 – Profilbild änderbar, "zeigt Kinder" entfernt, Video-Lightbox Fix
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

const FLAG: Record<string, string> = { DE: '🇩🇪', AT: '🇦🇹', CH: '🇨🇭', US: '🇺🇸', GB: '🇬🇧' }

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

  // Comments
  const [lbComments, setLbComments] = useState<any[]>([])
  const [lbCommInput, setLbCommInput] = useState('')
  const [lbCommLoading, setLbCommLoading] = useState(false)

  // Upload form
  const [uCategory, setUCategory] = useState<Tab>('bilder')
  const [uLabel, setULabel] = useState('')
  const [uBatch, setUBatch] = useState('')
  const [uProduct, setUProduct] = useState('')
  const [uLink, setULink] = useState('')
  const [uFile, setUFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [uploadPct, setUploadPct] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)
  const photoRef = useRef<HTMLInputElement>(null)

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
    } catch { setError('Verbindungsfehler.') }
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

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const token = localStorage.getItem('creator_token') || ''
    showToast('Profilbild wird hochgeladen...')
    try {
      // Schritt 1: Presigned URL
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, creatorId: String(creator.id), tab: 'profile' })
      })
      if (!urlRes.ok) { showToast('Fehler beim Vorbereiten'); return }
      const { signedUrl, publicUrl } = await urlRes.json()

      // Schritt 2: Direkt zu R2
      const putRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })
      if (!putRes.ok) { showToast('Upload fehlgeschlagen'); return }

      // Schritt 3: Supabase updaten
      const patchRes = await fetch('/api/creators', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id: creator.id, photo: publicUrl })
      })
      if (!patchRes.ok) { showToast('Fehler beim Speichern'); return }

      const updated = { ...creator, photo: publicUrl }
      setCreator(updated)
      localStorage.setItem('creator', JSON.stringify(updated))
      showToast('Profilbild aktualisiert ✓')
    } catch { showToast('Fehler beim Upload') }
  }

  function handleCardClick(u: Upload) {
    if (u.file_type === 'link') { window.open(u.file_url, '_blank'); return }
    const isVideo = u.file_type === 'video' || u.mime_type?.startsWith('video/')
    const isImage = u.file_type === 'image' || u.mime_type?.startsWith('image/')
    if (isVideo || isImage) {
      setLightbox(u)
      setLbComments([])
      setLbCommInput('')
      loadLbComments(u)
      return
    }
    window.open(u.file_url, '_blank')
  }

  async function loadLbComments(u: Upload) {
    const token = localStorage.getItem('creator_token') || ''
    try {
      const res = await fetch(`/api/comments?upload_id=${u.id}`, { headers: { Authorization: `Bearer ${token}` } })
      if (res.ok) { const data = await res.json(); setLbComments(data || []) }
    } catch {}
  }

  async function sendLbComment() {
    if (!lbCommInput.trim() || !lightbox || !creator) return
    const token = localStorage.getItem('creator_token') || ''
    setLbCommLoading(true)
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ upload_id: lightbox.id, creator_id: creator.id, author_role: 'creator', author_name: creator.name, message: lbCommInput.trim() })
      })
      if (res.ok) {
        setLbCommInput('')
        await loadLbComments(lightbox)
        showToast('Kommentar gesendet ✓')
      } else { showToast('Fehler beim Senden') }
    } catch { showToast('Fehler') }
    setLbCommLoading(false)
  }

  async function handleUpload() {
    if (!uLabel.trim()) { showToast('Bitte eine Bezeichnung eingeben'); return }
    if (!uFile && !uLink.trim()) { showToast('Bitte eine Datei auswählen oder einen Link eintragen'); return }

    const token = localStorage.getItem('creator_token') || ''
    setUploading(true); setUploadPct(0)

    // Link-only
    if (uLink.trim() && !uFile) {
      try {
        const fd = new FormData()
        fd.append('linkUrl', uLink.trim())
        fd.append('name', uLabel.trim())
        fd.append('creatorId', String(creator.id))
        fd.append('tab', uCategory)
        if (uBatch.trim()) fd.append('batch', uBatch.trim())
        if (uProduct.trim()) fd.append('product', uProduct.trim())
        const res = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
        const data = await res.json()
        if (!res.ok) { showToast('Fehler: ' + (data.error || 'Unbekannt')); setUploading(false); return }
        showToast(`"${uLabel}" gespeichert ✓`)
        resetForm()
        await loadUploads(creator.id, token)
      } catch { showToast('Fehler') }
      setUploading(false)
      return
    }

    // Presigned URL Upload
    try {
      setUploadPct(5)
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName: uFile!.name, fileType: uFile!.type, creatorId: String(creator.id), tab: uCategory })
      })
      if (!urlRes.ok) { showToast('Fehler beim Vorbereiten'); setUploading(false); return }
      const { signedUrl, key, publicUrl } = await urlRes.json()
      setUploadPct(10)

      await new Promise<void>((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('PUT', signedUrl)
        xhr.setRequestHeader('Content-Type', uFile!.type)
        xhr.upload.onprogress = (e) => {
          if (e.lengthComputable) setUploadPct(10 + Math.round(e.loaded / e.total * 80))
        }
        xhr.onload = () => (xhr.status === 200 || xhr.status === 204) ? resolve() : reject(new Error('R2 Fehler: ' + xhr.status))
        xhr.onerror = () => reject(new Error('Netzwerkfehler'))
        xhr.send(uFile)
      })

      setUploadPct(90)

      const fd = new FormData()
      fd.append('creatorId', String(creator.id))
      fd.append('tab', uCategory)
      fd.append('name', uLabel.trim())
      fd.append('publicUrl', publicUrl)
      fd.append('r2Key', key)
      fd.append('fileSize', String(uFile!.size))
      fd.append('mimeType', uFile!.type)
      if (uBatch.trim()) fd.append('batch', uBatch.trim())
      if (uProduct.trim()) fd.append('product', uProduct.trim())

      const saveRes = await fetch('/api/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const saveData = await saveRes.json()
      if (!saveRes.ok) { showToast('Fehler beim Speichern: ' + (saveData.error || '')); setUploading(false); return }

      setUploadPct(100)
      showToast(`"${uLabel}" hochgeladen ✓`)
      resetForm()
      await loadUploads(creator.id, token)
    } catch (err: any) { showToast('Fehler: ' + (err.message || 'Unbekannt')) }
    setUploading(false)
  }

  function resetForm() {
    setULabel(''); setUBatch(''); setUProduct(''); setULink(''); setUFile(null)
    if (fileRef.current) fileRef.current.value = ''
    setUploadPct(0)
  }

  function showToast(msg: string) { setToast(msg); setTimeout(() => setToast(''), 3500) }

  function logout() {
    localStorage.removeItem('creator_token'); localStorage.removeItem('creator')
    setView('login'); setCreator(null); setUploads([]); setCode('')
    router.push('/creator')
  }

  function fmtSize(bytes: number | null) {
    if (!bytes) return ''
    return bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${(bytes / 1024).toFixed(0)} KB`
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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0d0f1a', padding: 24 }}>
        <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 16, padding: 40, width: '100%', maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,.06)' }}>
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 6, color: '#f0f2ff' }}>Creator Portal</div>
          <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 28 }}>Gib deinen Einladungscode ein um fortzufahren.</div>
          <form onSubmit={e => { e.preventDefault(); loginWithCode(code) }}>
            <div style={{ marginBottom: 14 }}>
              <label style={s.fl}>Einladungscode</label>
              <input style={{ ...s.fi, fontSize: 22, fontWeight: 700, letterSpacing: 6, textAlign: 'center', textTransform: 'uppercase' }}
                value={code} onChange={e => setCode(e.target.value.toUpperCase())} placeholder="XXXXXXXX" maxLength={8} required />
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
        <div style={{ background: 'var(--cp-surf)', borderBottom: '1px solid var(--cp-bdr)', height: 54, padding: '0 20px', display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 28, height: 28, borderRadius: 8, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 800, color: '#fff' }}>F</div>
            <div style={{ fontWeight: 800, fontSize: 13, color: '#f0f2ff' }}>filapen <span style={{ fontWeight: 500, fontSize: 11, color: '#6b7280' }}>· Creator Hub</span></div>
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
            <span style={{ fontSize: 11, color: '#6b7280' }}>Angemeldet als: <strong style={{ color: '#f0f2ff' }}>{creator?.name}</strong></span>
            <button onClick={logout} style={s.btnGhost}>Abmelden</button>
          </div>
        </div>

        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

          {/* SIDEBAR */}
          <div style={{ width: 210, background: 'var(--cp-surf)', borderRight: '1px solid var(--cp-bdr)', flexShrink: 0, padding: '0 8px 12px', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            <div style={{ padding: '18px 10px 14px', borderBottom: '1px solid var(--cp-bdr)', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 34, height: 34, borderRadius: 10, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 800, color: '#fff', flexShrink: 0 }}>F</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 800, color: '#f0f2ff', letterSpacing: '-0.3px' }}>filapen</div>
                <div style={{ fontSize: 9, color: '#6b7280', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.3px' }}>Creator Hub</div>
              </div>
            </div>
            <div style={s.navLabel}>Mein Bereich</div>
            {([
              { id: 'home', label: 'Mein Dashboard', icon: '⊞' },
              { id: 'upload', label: 'Inhalte hochladen', icon: '⬆' },
              { id: 'tips', label: 'Tipps & Tricks', icon: '💡' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
                <div className="ni-ico">{n.icon}</div>{n.label}
              </div>
            ))}
            <div style={{ ...s.navLabel, marginTop: 10 }}>Tipps & Tricks</div>
            {([
              { id: 'briefings', label: 'Briefings', icon: '📋' },
              { id: 'skripte', label: 'Skripte', icon: '📝' },
              { id: 'lernvideos', label: 'Lernvideos', icon: '🎬' },
            ] as const).map(n => (
              <div key={n.id} className={`ni${page === n.id ? ' on' : ''}`} onClick={() => setPage(n.id)}>
                <div className="ni-ico">{n.icon}</div>{n.label}
              </div>
            ))}
            <div style={{ marginTop: 'auto', paddingTop: 10, borderTop: '1px solid #e8e8f0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 10px', borderRadius: 10, background: 'var(--cp-lt)', marginBottom: 6 }}>
                {creator?.photo
                  ? <img src={creator.photo} alt="" style={{ width: 28, height: 28, borderRadius: 7, objectFit: 'cover', flexShrink: 0 }} />
                  : <div style={{ width: 28, height: 28, borderRadius: 7, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, fontWeight: 700, color: '#fff', flexShrink: 0 }}>
                      {creator?.initials || creator?.name?.slice(0,2).toUpperCase()}
                    </div>
                }
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: '#f0f2ff' }}>{creator?.name}</div>
                  <div style={{ fontSize: 9, color: '#6b7280' }}>Creator</div>
                </div>
              </div>
              <button onClick={logout} style={{ ...s.btnGhost, width: '100%', marginTop: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5 }}>⏻ Abmelden</button>
            </div>
          </div>

          {/* MAIN */}
          <div style={{ flex: 1, overflowY: 'auto', padding: 20, background: '#0d0f1a' }}>

            {/* ── HOME ── */}
            {page === 'home' && (
              <>
                {/* HERO */}
                <div style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', borderRadius: 16, padding: '20px 24px', marginBottom: 18, color: '#fff' }}>
                  <div style={{ fontSize: 11, opacity: .8, marginBottom: 4 }}>Willkommen zurück 👋</div>
                  <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.4px' }}>Hallo {creator?.name?.split(' ')[0]}, schön dass du da bist!</div>
                </div>

                {/* CREATOR PROFIL KARTE */}
                <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 16, padding: '16px 18px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }} onClick={() => photoRef.current?.click()} title="Profilbild ändern">
                    {creator?.photo
                      ? <img src={creator.photo} alt={creator.name} style={{ width: 56, height: 56, borderRadius: 14, objectFit: 'cover' }} />
                      : <div style={{ width: 56, height: 56, borderRadius: 14, background: creator?.color_from || '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, fontWeight: 800, color: '#fff' }}>
                          {creator?.initials || creator?.name?.slice(0, 2).toUpperCase()}
                        </div>
                    }
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#818cf8', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', border: '2px solid var(--cp-surf)' }}>✏</div>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#f0f2ff', marginBottom: 2 }}>{creator?.name}</div>
                    <div style={{ fontSize: 11, color: '#6b7280', marginBottom: 6 }}>
                      {creator?.email}{creator?.age > 0 ? ` · ${creator.age}J` : ''}{creator?.country ? ` · ${FLAG[creator.country] || creator.country}` : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      {(creator?.tags || []).map((t: string) => (
                        <span key={t} style={{ background: '#eff2ff', color: '#4f6ef7', border: '1px solid #d0d8ff', borderRadius: 12, fontSize: 10, padding: '2px 8px', fontWeight: 500 }}>{t}</span>
                      ))}
                      {creator?.verguetung === 'provision' && creator?.provision && (
                        <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 12, fontSize: 10, padding: '2px 8px', fontWeight: 500 }}>📊 {creator.provision}% Provision</span>
                      )}
                      {creator?.verguetung === 'fix' && creator?.fixbetrag && (
                        <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: 12, fontSize: 10, padding: '2px 8px', fontWeight: 500 }}>💶 {creator.fixbetrag}€ Fix</span>
                      )}
                      {creator?.verguetung === 'beides' && (
                        <span style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: 12, fontSize: 10, padding: '2px 8px', fontWeight: 500 }}>📊 {creator.provision}% + 💶 {creator.fixbetrag}€</span>
                      )}
                      {creator?.kids && (creator?.kids_ages || []).map((a: string) => (
                        <span key={a} style={{ background: '#0d0f1a', border: '1px solid var(--cp-bdr)', borderRadius: 12, fontSize: 10, padding: '2px 8px', fontWeight: 500 }}>👶 {a}J</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
                  <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 }}>Kategorien</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff' }}>{TABS.filter(t => uploads.some(u => u.tab === t.key)).length}</div>
                  </div>
                  <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 }}>Dateien gesamt</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#f0f2ff' }}>{totalUploads}</div>
                  </div>
                  <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: '14px 16px' }}>
                    <div style={{ fontSize: 9, fontWeight: 700, color: '#6b7280', textTransform: 'uppercase' as const, letterSpacing: '.5px', marginBottom: 6 }}>Hochgeladen</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: '#16a34a' }}>{totalUploads}</div>
                  </div>
                </div>

                {/* TABS + FILE GRID in gemeinsamer Card */}
                <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 16, overflow: 'hidden' }}>
                  <div style={{ display: 'flex', borderBottom: '1.5px solid #e8e8f0', padding: '0 6px' }}>
                    {TABS.map(t => (
                      <button key={t.key} className={`tab-btn${activeTab === t.key ? ' on' : ''}`} onClick={() => setActiveTab(t.key)}>
                        {t.icon} {t.label}
                        {uploads.filter(u => u.tab === t.key).length > 0 && (
                          <span className="cp-badge">{uploads.filter(u => u.tab === t.key).length}</span>
                        )}
                      </button>
                    ))}
                  </div>
                  <div style={{ padding: 16 }}>
                    {tabUploads.length === 0 ? (
                      <div style={{ textAlign: 'center', padding: 32 }}>
                        <div style={{ fontSize: 28, marginBottom: 8 }}>{TABS.find(t => t.key === activeTab)?.icon}</div>
                        <div style={{ fontSize: 13, marginBottom: 14, color: '#6b7280' }}>Noch keine Inhalte in dieser Kategorie</div>
                    <button style={s.btnP} onClick={() => { setUCategory(activeTab); setPage('upload') }}>+ Hochladen</button>
                  </div>
                ) : (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                    {tabUploads.map(u => (
                      <div key={u.id} onClick={() => handleCardClick(u)}
                        style={{ background: 'var(--cp-lt)', border: '1px solid var(--cp-bdr)', borderRadius: 12, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                        onMouseEnter={e => (e.currentTarget.style.borderColor = '#4f6ef7')}
                        onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8f0')}>
                        <div style={{ height: 100, background: '#e8e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, overflow: 'hidden', position: 'relative' }}>
                          {u.mime_type?.startsWith('image/') && u.file_url
                            ? <img src={u.file_url} alt={u.file_name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                            : (u.file_type === 'video' || u.mime_type?.startsWith('video/')) ? '🎬'
                            : u.file_type === 'link' ? '🔗' : '📄'}
                          {(u.file_type === 'video' || u.mime_type?.startsWith('video/')) && (
                            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10 }}>▶</div>
                            </div>
                          )}
                        </div>
                        <div style={{ padding: '8px 10px' }}>
                          <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#f0f2ff' }}>{u.file_name}</div>
                          {(u as any).batch && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>📦 {(u as any).batch}</div>}
                          {(u as any).product && <div style={{ fontSize: 10, color: '#6b7280', marginTop: 1 }}>🏷️ {(u as any).product}</div>}
                          <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{fmtDate(u.created_at)}{u.file_size ? ` · ${fmtSize(u.file_size)}` : ''}</div>
                          {u.file_type === 'link' && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 3 }}>↗ Link öffnen</div>}
                        </div>
                      </div>
                    ))}
                    <div style={{ border: '1.5px dashed #c7d0ff', borderRadius: 12, minHeight: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 6, cursor: 'pointer', background: '#fafbff' }}
                      onClick={() => { setUCategory(activeTab); setPage('upload') }}>
                      <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg,#818cf8,#a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 18 }}>+</div>
                      <span style={{ fontSize: 11, fontWeight: 500, color: '#6b7280' }}>Hochladen</span>
                    </div>
                  </div>
                )}
                  </div>
                </div>
              </>
            )}

            {/* ── UPLOAD ── */}
            {page === 'upload' && (
              <>
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2ff', marginBottom: 16 }}>Inhalte hochladen</div>
                <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: 20 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f2ff', marginBottom: 4 }}>Datei hochladen</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 18 }}>Lade Bilder oder Videos hoch oder trage einen Google Drive Link ein. Alles bleibt dauerhaft gespeichert.</div>

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

                  <div style={{ marginBottom: 14 }}>
                    <label style={s.fl}>Google Drive Link (optional)</label>
                    <input style={s.fi} value={uLink} onChange={e => setULink(e.target.value)} placeholder="https://drive.google.com/..." />
                  </div>

                  <div style={{ border: '1.5px dashed #e8e8ec', borderRadius: 12, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#f9f9fb', marginBottom: 14 }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setUFile(f) }}>
                    {uFile ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
                        <span style={{ fontSize: 22 }}>{uFile.type.startsWith('image/') ? '🖼️' : '🎬'}</span>
                        <div style={{ textAlign: 'left' }}>
                          <div style={{ fontSize: 12, fontWeight: 500, color: '#f0f2ff' }}>{uFile.name}</div>
                          <div style={{ fontSize: 10, color: '#6b7280' }}>{fmtSize(uFile.size)}</div>
                        </div>
                        <span style={{ marginLeft: 8, color: '#16a34a', fontSize: 18 }}>✓</span>
                      </div>
                    ) : (
                      <>
                        <div style={{ fontSize: 22, marginBottom: 6 }}>📂</div>
                        <div style={{ fontSize: 12, fontWeight: 500, color: '#555' }}>Klicken oder Datei hierher ziehen</div>
                        <div style={{ fontSize: 11, color: '#6b7280', marginTop: 3 }}>Bilder & Videos · optional wenn Link angegeben</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => setUFile(e.target.files?.[0] || null)} />

                  {uploading && (
                    <div style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>Upload: {uploadPct}%</div>
                      <div style={{ height: 5, background: '#e8e8ec', borderRadius: 3, overflow: 'hidden' }}>
                        <div style={{ height: '100%', background: '#818cf8', borderRadius: 3, width: `${uploadPct}%`, transition: 'width .1s' }} />
                      </div>
                    </div>
                  )}

                  <button style={{ ...s.btnP, width: '100%' }} onClick={handleUpload} disabled={uploading}>
                    {uploading ? `Wird hochgeladen... ${uploadPct}%` : 'Hochladen →'}
                  </button>
                </div>

                {uploads.length > 0 && (
                  <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: 18, marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f2ff', marginBottom: 14 }}>Deine hochgeladenen Dateien ({uploads.length})</div>
                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
                      {TABS.map(t => (
                        <button key={t.key}
                          style={{ padding: '4px 10px', borderRadius: 10, border: `1px solid ${uCategory === t.key ? 'var(--cp-accent)' : 'var(--cp-bdr)'}`, background: uCategory === t.key ? 'var(--cp-accent)' : 'var(--cp-surf)', color: uCategory === t.key ? '#fff' : 'var(--cp-muted)', fontSize: 11, cursor: 'pointer', fontFamily: 'inherit' }}
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
                          <div key={u.id} onClick={() => handleCardClick(u)}
                            style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 9, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8ec')}>
                            <div style={{ height: 80, background: '#0d0f1a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden' }}>
                              {u.mime_type?.startsWith('image/') && u.file_url
                                ? <img src={u.file_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : (u.file_type === 'video' || u.mime_type?.startsWith('video/')) ? '🎬'
                                : u.file_type === 'link' ? '🔗' : '📄'}
                            </div>
                            <div style={{ padding: '7px 9px' }}>
                              <div style={{ fontSize: 10, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#f0f2ff' }}>{u.file_name}</div>
                              <div style={{ fontSize: 10, color: '#6b7280', marginTop: 2 }}>{fmtDate(u.created_at)}</div>
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
                <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2ff', marginBottom: 6 }}>Tipps & Tricks</div>
                <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 16 }}>Klicke auf eine Kategorie.</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 12 }}>
                  {[{ id: 'briefings', icon: '📋', label: 'Briefings' }, { id: 'skripte', icon: '📝', label: 'Skripte' }, { id: 'lernvideos', icon: '🎬', label: 'Lernvideos' }].map(c => (
                    <div key={c.id} style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: 20, cursor: 'pointer', textAlign: 'center' }}
                      onClick={() => setPage(c.id as NavPage)}>
                      <div style={{ fontSize: 28, marginBottom: 8 }}>{c.icon}</div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#f0f2ff' }}>{c.label}</div>
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
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#f0f2ff' }}>
                    {page === 'briefings' ? '📋 Briefings' : page === 'skripte' ? '📝 Skripte' : '🎬 Lernvideos'}
                  </div>
                </div>
                <div style={{ background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderRadius: 14, padding: 28, textAlign: 'center', color: '#aaa', fontSize: 13 }}>
                  Noch keine Inhalte vorhanden. Der Admin fügt diese hier ein.
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* TOAST */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 20, right: 20, background: 'var(--cp-surf)', border: '1px solid var(--cp-bdr)', borderLeft: '3px solid #16a34a', borderRadius: 12, padding: '10px 16px', fontSize: 13, zIndex: 9999, boxShadow: '0 2px 12px rgba(0,0,0,.1)', color: '#f0f2ff' }}>
          {toast}
        </div>
      )}

      {/* LIGHTBOX MIT KOMMENTAREN */}
      {lightbox && (
        <div onClick={() => setLightbox(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(5,5,15,.85)', backdropFilter: 'blur(12px)', zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ display: 'flex', gap: 16, maxWidth: '92vw', maxHeight: '90vh', alignItems: 'flex-start' }}>

            {/* MEDIA */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
              {(() => {
                const isVideo = lightbox.file_type === 'video' || lightbox.mime_type?.startsWith('video/')
                const isImage = lightbox.file_type === 'image' || lightbox.mime_type?.startsWith('image/')
                if (isImage) return <img src={lightbox.file_url} alt={lightbox.file_name} style={{ maxWidth: '55vw', maxHeight: '72vh', borderRadius: 14, objectFit: 'contain' }} />
                if (isVideo) return <video src={lightbox.file_url} controls autoPlay style={{ maxWidth: '55vw', maxHeight: '72vh', borderRadius: 14 }} />
                return <div style={{ color: '#fff', fontSize: 48 }}>📄</div>
              })()}
              <div style={{ textAlign: 'center' }}>
                <div style={{ color: '#f0f2ff', fontSize: 14, fontWeight: 600 }}>{lightbox.file_name}</div>
                <div style={{ color: 'rgba(156,163,175,.6)', fontSize: 11, marginTop: 3 }}>
                  {fmtDate(lightbox.created_at)}{lightbox.file_size ? ` · ${fmtSize(lightbox.file_size)}` : ''}
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={async () => {
                  try {
                    const res = await fetch(lightbox.file_url)
                    const blob = await res.blob()
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url; a.download = lightbox.file_name; a.click()
                    URL.revokeObjectURL(url)
                  } catch { window.open(lightbox.file_url, '_blank') }
                }} style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', border: 'none', borderRadius: 9, padding: '9px 18px', fontSize: 12, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
                  ⬇ Download
                </button>
                <button onClick={() => setLightbox(null)} style={{ background: 'rgba(255,255,255,.08)', border: '1px solid rgba(255,255,255,.12)', borderRadius: 9, padding: '9px 18px', fontSize: 12, color: 'rgba(255,255,255,.7)', cursor: 'pointer', fontFamily: 'inherit' }}>
                  × Schließen
                </button>
              </div>
            </div>

            {/* KOMMENTARE */}
            <div style={{ width: 300, minWidth: 280, background: 'rgba(19,22,38,.98)', border: '1px solid rgba(129,140,248,.2)', borderRadius: 18, padding: 18, display: 'flex', flexDirection: 'column', maxHeight: '82vh', boxShadow: '0 20px 60px rgba(0,0,0,.5)' }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 18, fontWeight: 600, fontStyle: 'italic', color: '#f0f2ff', marginBottom: 4 }}>Kommentare</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'rgba(107,114,128,.6)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 14, paddingBottom: 12, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
                {lbComments.length} Nachrichten
              </div>

              {/* Comment list */}
              <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8 }}>
                {lbComments.length === 0 ? (
                  <div style={{ fontSize: 12, color: 'rgba(107,114,128,.6)', padding: '12px 0', textAlign: 'center', fontStyle: 'italic' }}>
                    Noch keine Kommentare.<br/>Schreib die erste Nachricht.
                  </div>
                ) : lbComments.map((cm: any, i: number) => {
                  const isAdmin = cm.author_role === 'admin'
                  const dt = new Date(cm.created_at)
                  const timeStr = dt.toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' }) + ' · ' + dt.toLocaleDateString('de-DE')
                  return (
                    <div key={i} style={{
                      background: isAdmin ? 'rgba(129,140,248,.12)' : 'rgba(255,255,255,.04)',
                      border: isAdmin ? '1px solid rgba(129,140,248,.2)' : '1px solid rgba(255,255,255,.07)',
                      borderRadius: 10, padding: '10px 12px'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, color: isAdmin ? '#818cf8' : 'rgba(156,163,175,.7)', textTransform: 'uppercase', letterSpacing: 1 }}>
                          {isAdmin ? 'Admin' : 'Du'}
                        </span>
                        <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'rgba(107,114,128,.5)' }}>{timeStr}</span>
                      </div>
                      <div style={{ fontSize: 13, color: '#f0f2ff', lineHeight: 1.5 }}>{cm.message}</div>
                    </div>
                  )
                })}
              </div>

              {/* Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <textarea
                  value={lbCommInput}
                  onChange={e => setLbCommInput(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendLbComment() } }}
                  placeholder="Kommentar schreiben…"
                  rows={3}
                  style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', borderRadius: 9, padding: '9px 12px', fontSize: 13, color: '#f0f2ff', fontFamily: 'inherit', resize: 'none', outline: 'none', transition: 'border-color .2s' }}
                />
                <button
                  onClick={sendLbComment}
                  disabled={lbCommLoading || !lbCommInput.trim()}
                  style={{ background: 'linear-gradient(135deg,#818cf8,#a78bfa)', border: 'none', borderRadius: 9, padding: '10px', fontSize: 13, fontWeight: 600, color: '#fff', cursor: 'pointer', fontFamily: 'inherit', opacity: lbCommLoading || !lbCommInput.trim() ? .5 : 1, transition: 'opacity .2s', boxShadow: '0 4px 14px rgba(129,140,248,.3)' }}>
                  {lbCommLoading ? 'Senden…' : 'Senden →'}
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  )
}

const css = `
  :root{
    --cp-bg:#0d0f1a;--cp-surf:rgba(255,255,255,.04);--cp-lt:rgba(255,255,255,.06);
    --cp-bdr:rgba(255,255,255,.08);--cp-text:#f0f2ff;--cp-muted:rgba(156,163,175,.8);
    --cp-accent:#818cf8;
  }
  body.cp-light{
    --cp-bg:#f8f7f4;--cp-surf:#ffffff;--cp-lt:#f2f1ee;
    --cp-bdr:#e4e3df;--cp-text:#0f0e0c;--cp-muted:#9a9890;
    --cp-accent:#818cf8;
  }
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
  *{box-sizing:border-box;margin:0;padding:0;}
  body{font-family:'DM Sans',system-ui,sans-serif;font-size:13px;color:#f0f2ff;background:#0d0f1a;}
  .ni{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:9px;cursor:pointer;font-size:12.5px;font-weight:400;color:#9ca3af;margin-bottom:1px;user-select:none;transition:all .2s;position:relative;}
  .ni:hover{background:rgba(255,255,255,.05);color:#f0f2ff;}
  .ni.on{background:linear-gradient(135deg,rgba(129,140,248,.15),rgba(167,139,250,.08));color:#a78bfa;font-weight:500;border:1px solid rgba(129,140,248,.2);}
  .ni-ico{font-size:14px;flex-shrink:0;width:20px;text-align:center;}
  .tab-btn{padding:9px 14px;border:none;background:none;cursor:pointer;font-size:12.5px;font-weight:400;color:#6b7280;border-bottom:2.5px solid transparent;font-family:'DM Sans',sans-serif;white-space:nowrap;transition:all .2s;}
  .tab-btn.on{color:#a78bfa;font-weight:600;border-bottom-color:#818cf8;}
  .tab-btn:hover:not(.on){color:#f0f2ff;}
  .cp-badge{background:rgba(129,140,248,.15);color:#818cf8;font-family:'JetBrains Mono',monospace;font-size:9px;font-weight:700;border-radius:4px;padding:1px 5px;margin-left:4px;vertical-align:middle;border:1px solid rgba(129,140,248,.2);}
`

const s: Record<string, React.CSSProperties> = {
  fl: { display: 'block', fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, color: 'rgba(107,114,128,.7)', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 7 },
  fi: { width: '100%', border: '1px solid rgba(255,255,255,.08)', borderRadius: 9, padding: '9px 12px', fontFamily: "'DM Sans',sans-serif", fontSize: 12, outline: 'none', background: 'rgba(255,255,255,.04)', color: '#f0f2ff', transition: 'all .2s' },
  btnP: { background: 'linear-gradient(135deg,#818cf8,#a78bfa)', color: '#fff', border: 'none', borderRadius: 9, padding: '11px 18px', fontSize: 12, fontWeight: 600, cursor: 'pointer', fontFamily: "'DM Sans',sans-serif", boxShadow: '0 4px 20px rgba(129,140,248,.3)' },
  btnGhost: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.08)', borderRadius: 8, padding: '7px 14px', fontSize: 12, cursor: 'pointer', color: '#9ca3af', fontFamily: "'DM Sans',sans-serif", fontWeight: 500 },
  sc: { background: 'rgba(255,255,255,.04)', border: '1px solid rgba(255,255,255,.07)', borderRadius: 12, padding: '14px 16px' },
  sl: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, color: 'rgba(107,114,128,.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 8 },
  sv: { fontFamily: "'JetBrains Mono',monospace", fontSize: 28, fontWeight: 700, color: '#f0f2ff' },
  navLabel: { fontFamily: "'JetBrains Mono',monospace", fontSize: 8, fontWeight: 700, color: 'rgba(107,114,128,.5)', textTransform: 'uppercase', letterSpacing: 2, padding: '0 8px', marginBottom: 5, marginTop: 10 },
  errBox: { background: 'rgba(248,113,113,.1)', border: '1px solid rgba(248,113,113,.25)', borderRadius: 9, padding: '9px 14px', fontSize: 12, color: '#f87171', marginBottom: 14 },
}
