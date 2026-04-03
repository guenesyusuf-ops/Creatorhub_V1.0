// v2.6 – Kommentar-Funktion für Creator hinzugefügt
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
  unread_comments?: number
  comments_total?: number
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

  // Kommentar-State
  const [commentFile, setCommentFile] = useState<Upload | null>(null)
  const [comments, setComments] = useState<any[]>([])
  const [commentText, setCommentText] = useState('')
  const [commentLoading, setCommentLoading] = useState(false)

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
      if (!Array.isArray(data)) return
      // Ungelesene Kommentare für jede Datei laden
      const withComments = await Promise.all(data.map(async (u: Upload) => {
        try {
          const cr = await fetch(`/api/comments?upload_id=${u.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const cms = await cr.json()
          if (Array.isArray(cms)) {
            u.unread_comments = cms.filter((c: any) => !c.read_by_creator).length
            u.comments_total = cms.length
          }
        } catch {}
        return u
      }))
      setUploads(withComments)
    } catch {}
  }

  async function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const token = localStorage.getItem('creator_token') || ''
    showToast('Profilbild wird hochgeladen...')
    try {
      const urlRes = await fetch('/api/upload-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ fileName: file.name, fileType: file.type, creatorId: String(creator.id), tab: 'profile' })
      })
      if (!urlRes.ok) { showToast('Fehler beim Vorbereiten'); return }
      const { signedUrl, publicUrl } = await urlRes.json()

      const putRes = await fetch(signedUrl, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file
      })
      if (!putRes.ok) { showToast('Upload fehlgeschlagen'); return }

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
    if (isVideo || isImage) { setLightbox(u); return }
    window.open(u.file_url, '_blank')
  }

  function closeLightbox() { setLightbox(null) }

  async function openComments(u: Upload) {
    setCommentFile(u)
    setComments([])
    setCommentText('')
    const token = localStorage.getItem('creator_token') || ''
    try {
      const res = await fetch(`/api/comments?upload_id=${u.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (Array.isArray(data)) setComments(data)
      // Als gelesen markieren
      fetch('/api/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ upload_id: u.id, role: 'creator' })
      })
      // Badge zurücksetzen
      setUploads(prev => prev.map(x => x.id === u.id ? { ...x, unread_comments: 0 } : x))
    } catch {}
  }

  async function sendComment() {
    if (!commentFile || !commentText.trim()) return
    setCommentLoading(true)
    const token = localStorage.getItem('creator_token') || ''
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          upload_id: commentFile.id,
          creator_id: creator.id,
          author_role: 'creator',
          author_name: creator.name,
          message: commentText.trim()
        })
      })
      if (res.ok) {
        setCommentText('')
        const cr = await fetch(`/api/comments?upload_id=${commentFile.id}`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        const data = await cr.json()
        if (Array.isArray(data)) setComments(data)
        showToast('Kommentar gesendet ✓')
      } else {
        showToast('Fehler beim Senden')
      }
    } catch { showToast('Fehler') }
    setCommentLoading(false)
  }

  async function handleUpload() {
    if (!uLabel.trim()) { showToast('Bitte eine Bezeichnung eingeben'); return }
    if (!uFile && !uLink.trim()) { showToast('Bitte eine Datei auswählen oder einen Link eintragen'); return }

    const token = localStorage.getItem('creator_token') || ''
    setUploading(true); setUploadPct(0)

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

                {/* CREATOR PROFIL KARTE */}
                <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: '14px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 14 }}>
                  <div style={{ position: 'relative', flexShrink: 0, cursor: 'pointer' }} onClick={() => photoRef.current?.click()} title="Profilbild ändern">
                    {creator?.photo
                      ? <img src={creator.photo} alt={creator.name} style={{ width: 54, height: 54, borderRadius: '50%', objectFit: 'cover' }} />
                      : <div style={{ width: 54, height: 54, borderRadius: '50%', background: creator?.color_from || '#7c3aed', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700, color: '#fff' }}>
                          {creator?.initials || creator?.name?.slice(0, 2).toUpperCase()}
                        </div>
                    }
                    <div style={{ position: 'absolute', bottom: 0, right: 0, width: 18, height: 18, borderRadius: '50%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#fff', border: '2px solid #fff' }}>✏️</div>
                  </div>
                  <input ref={photoRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoChange} />

                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 15, fontWeight: 700, color: '#111', marginBottom: 2 }}>{creator?.name}</div>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>
                      {creator?.email}{creator?.age > 0 ? ` · ${creator.age}J` : ''}{creator?.country ? ` · ${FLAG[creator.country] || creator.country}` : ''}
                    </div>
                    <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', alignItems: 'center' }}>
                      {(creator?.tags || []).map((t: string) => (
                        <span key={t} style={{ background: '#eff2ff', color: '#4f6ef7', border: '1px solid #d0d8ff', borderRadius: 8, fontSize: 10, padding: '1px 7px' }}>{t}</span>
                      ))}
                      {creator?.verguetung === 'provision' && creator?.provision && (
                        <span style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0', borderRadius: 8, fontSize: 10, padding: '1px 7px' }}>📊 {creator.provision}% Provision</span>
                      )}
                      {creator?.verguetung === 'fix' && creator?.fixbetrag && (
                        <span style={{ background: '#fffbeb', color: '#92400e', border: '1px solid #fde68a', borderRadius: 8, fontSize: 10, padding: '1px 7px' }}>💶 {creator.fixbetrag}€ Fix</span>
                      )}
                      {creator?.verguetung === 'beides' && (
                        <span style={{ background: '#faf5ff', color: '#7c3aed', border: '1px solid #e9d5ff', borderRadius: 8, fontSize: 10, padding: '1px 7px' }}>📊 {creator.provision}% + 💶 {creator.fixbetrag}€</span>
                      )}
                      {creator?.kids && (creator?.kids_ages || []).map((a: string) => (
                        <span key={a} style={{ background: '#f4f5f7', border: '1px solid #e8e8ec', borderRadius: 8, fontSize: 10, padding: '1px 7px' }}>👶 {a}J</span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* STATS */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8, marginBottom: 18 }}>
                  <div style={s.sc}><div style={s.sl}>Kategorien</div><div style={s.sv}>{TABS.filter(t => uploads.some(u => u.tab === t.key)).length}</div></div>
                  <div style={s.sc}><div style={s.sl}>Dateien gesamt</div><div style={s.sv}>{totalUploads}</div></div>
                  <div style={s.sc}><div style={s.sl}>Hochgeladen</div><div style={{ ...s.sv, color: '#16a34a' }}>{totalUploads}</div></div>
                </div>

                {/* TABS */}
                <div style={{ display: 'flex', borderBottom: '1px solid #e8e8ec', background: '#fff', borderRadius: '8px 8px 0 0', padding: '0 4px' }}>
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
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 32, textAlign: 'center' }}>
                    <div style={{ fontSize: 28, marginBottom: 8 }}>{TABS.find(t => t.key === activeTab)?.icon}</div>
                    <div style={{ fontSize: 13, marginBottom: 12, color: '#888' }}>Noch keine Inhalte in dieser Kategorie</div>
                    <button style={s.btnP} onClick={() => { setUCategory(activeTab); setPage('upload') }}>+ Hochladen</button>
                  </div>
                ) : (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderTop: 'none', borderRadius: '0 0 8px 8px', padding: 14 }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(150px,1fr))', gap: 10 }}>
                      {tabUploads.map(u => (
                        <div key={u.id}
                          style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 9, overflow: 'hidden', transition: 'border-color .15s' }}
                          onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
                          onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8ec')}>
                          {/* Thumbnail – klickbar für Lightbox */}
                          <div onClick={() => handleCardClick(u)} style={{ cursor: 'pointer' }}>
                            <div style={{ height: 100, background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28, overflow: 'hidden', position: 'relative' }}>
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
                            <div style={{ padding: '8px 10px 4px' }}>
                              <div style={{ fontSize: 11, fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#111' }}>{u.file_name}</div>
                              {(u as any).batch && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 2 }}>📦 {(u as any).batch}</div>}
                              {(u as any).product && <div style={{ fontSize: 10, color: '#888', marginTop: 1 }}>🏷️ {(u as any).product}</div>}
                              <div style={{ fontSize: 10, color: '#aaa', marginTop: 2 }}>{fmtDate(u.created_at)}{u.file_size ? ` · ${fmtSize(u.file_size)}` : ''}</div>
                              {u.file_type === 'link' && <div style={{ fontSize: 10, color: '#4f6ef7', marginTop: 3 }}>↗ Link öffnen</div>}
                            </div>
                          </div>
                          {/* Kommentar-Button */}
                          <div style={{ padding: '0 10px 10px' }}>
                            <button
                              onClick={e => { e.stopPropagation(); openComments(u) }}
                              style={{
                                width: '100%',
                                background: (u.unread_comments ?? 0) > 0 ? '#4f6ef7' : '#f0f0f3',
                                color: (u.unread_comments ?? 0) > 0 ? '#fff' : '#666',
                                border: 'none', borderRadius: 6, padding: '5px 8px',
                                fontSize: 10, cursor: 'pointer', fontFamily: 'inherit'
                              }}>
                              {(u.unread_comments ?? 0) > 0
                                ? `💬 ${u.unread_comments} neue${u.unread_comments !== 1 ? '' : 'r'} Kommentar${u.unread_comments !== 1 ? 'e' : ''}`
                                : (u.comments_total ?? 0) > 0
                                  ? `💬 ${u.comments_total} Kommentar${(u.comments_total ?? 0) !== 1 ? 'e' : ''}`
                                  : '💬 Kommentare'}
                            </button>
                          </div>
                        </div>
                      ))}
                      <div style={{ border: '1.5px dashed #e8e8ec', borderRadius: 9, minHeight: 130, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 4, cursor: 'pointer', color: '#aaa' }}
                        onClick={() => { setUCategory(activeTab); setPage('upload') }}>
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
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 18 }}>Lade Bilder oder Videos hoch oder trage einen Google Drive Link ein. Alles bleibt dauerhaft gespeichert.</div>

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

                  <div style={{ border: '1.5px dashed #e8e8ec', borderRadius: 8, padding: 24, textAlign: 'center', cursor: 'pointer', background: '#f9f9fb', marginBottom: 14 }}
                    onClick={() => fileRef.current?.click()}
                    onDragOver={e => e.preventDefault()}
                    onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) setUFile(f) }}>
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
                        <div style={{ fontSize: 11, color: '#aaa', marginTop: 3 }}>Bilder & Videos · optional wenn Link angegeben</div>
                      </>
                    )}
                  </div>
                  <input ref={fileRef} type="file" accept="image/*,video/*" style={{ display: 'none' }} onChange={e => setUFile(e.target.files?.[0] || null)} />

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

                {uploads.length > 0 && (
                  <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 18, marginTop: 14 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#111', marginBottom: 14 }}>Deine hochgeladenen Dateien ({uploads.length})</div>
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
                          <div key={u.id} onClick={() => handleCardClick(u)}
                            style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 9, overflow: 'hidden', cursor: 'pointer', transition: 'border-color .15s' }}
                            onMouseEnter={e => (e.currentTarget.style.borderColor = '#bbb')}
                            onMouseLeave={e => (e.currentTarget.style.borderColor = '#e8e8ec')}>
                            <div style={{ height: 80, background: '#f4f5f7', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22, overflow: 'hidden' }}>
                              {u.mime_type?.startsWith('image/') && u.file_url
                                ? <img src={u.file_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                : (u.file_type === 'video' || u.mime_type?.startsWith('video/')) ? '🎬'
                                : u.file_type === 'link' ? '🔗' : '📄'}
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
                  {[{ id: 'briefings', icon: '📋', label: 'Briefings' }, { id: 'skripte', icon: '📝', label: 'Skripte' }, { id: 'lernvideos', icon: '🎬', label: 'Lernvideos' }].map(c => (
                    <div key={c.id} style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 10, padding: 20, cursor: 'pointer', textAlign: 'center' }}
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
        <div onClick={closeLightbox} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.85)', zIndex: 9998, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <button onClick={closeLightbox} style={{ position: 'absolute', top: 16, right: 16, background: 'rgba(255,255,255,.15)', border: 'none', borderRadius: '50%', width: 36, height: 36, color: '#fff', fontSize: 18, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>✕</button>
          <div onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
            {(() => {
              const isVideo = lightbox.file_type === 'video' || lightbox.mime_type?.startsWith('video/')
              const isImage = lightbox.file_type === 'image' || lightbox.mime_type?.startsWith('image/')
              if (isImage) return <img src={lightbox.file_url} alt={lightbox.file_name} style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: 8, objectFit: 'contain' }} />
              if (isVideo) return <video src={lightbox.file_url} controls autoPlay style={{ maxWidth: '85vw', maxHeight: '75vh', borderRadius: 8 }} />
              return <div style={{ color: '#fff', fontSize: 48 }}>📄</div>
            })()}
            <div style={{ textAlign: 'center' }}>
              <div style={{ color: '#fff', fontSize: 13, fontWeight: 600 }}>{lightbox.file_name}</div>
              <div style={{ color: 'rgba(255,255,255,.5)', fontSize: 11, marginTop: 3 }}>
                {fmtDate(lightbox.created_at)}{lightbox.file_size ? ` · ${fmtSize(lightbox.file_size)}` : ''}
              </div>
            </div>
            <button onClick={async () => {
              try {
                const res = await fetch(lightbox.file_url)
                const blob = await res.blob()
                const url = URL.createObjectURL(blob)
                const a = document.createElement('a')
                a.href = url; a.download = lightbox.file_name; a.click()
                URL.revokeObjectURL(url)
              } catch { window.open(lightbox.file_url, '_blank') }
            }} style={{ background: 'rgba(255,255,255,.15)', border: '1px solid rgba(255,255,255,.25)', borderRadius: 7, padding: '7px 16px', fontSize: 12, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>
              ⬇ Herunterladen
            </button>
          </div>
        </div>
      )}

      {/* KOMMENTAR MODAL */}
      {commentFile && (
        <div onClick={() => setCommentFile(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,.5)', zIndex: 9997, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#fff', borderRadius: 12, padding: 20, width: '100%', maxWidth: 420, maxHeight: '80vh', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 32px rgba(0,0,0,.2)' }}>
            <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#111' }}>💬 Kommentare – {commentFile.file_name}</div>
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 12, minHeight: 60 }}>
              {comments.length === 0
                ? <div style={{ fontSize: 12, color: '#aaa', padding: '8px 0' }}>Noch keine Kommentare.</div>
                : comments.map((c, i) => (
                  <div key={i} style={{ background: c.author_role === 'admin' ? '#eff2ff' : '#f4f5f7', borderRadius: 8, padding: '8px 10px', marginBottom: 8 }}>
                    <div style={{ fontSize: 10, color: '#888', marginBottom: 3 }}>{c.author_name} · {new Date(c.created_at).toLocaleString('de-DE')}</div>
                    <div style={{ fontSize: 12, color: c.author_role === 'admin' ? '#4f6ef7' : '#111' }}>{c.message}</div>
                  </div>
                ))
              }
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <textarea
                value={commentText}
                onChange={e => setCommentText(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment() } }}
                placeholder="Antwort schreiben..."
                rows={2}
                style={{ flex: 1, border: '1px solid #e8e8ec', borderRadius: 7, padding: '8px 10px', fontFamily: 'inherit', fontSize: 12, resize: 'none', outline: 'none' }} />
              <button onClick={sendComment} disabled={commentLoading} style={{ ...s.btnP, alignSelf: 'flex-end', padding: '8px 14px' }}>
                {commentLoading ? '...' : 'Senden'}
              </button>
            </div>
            <button onClick={() => setCommentFile(null)} style={{ ...s.btnGhost, marginTop: 8, width: '100%' }}>Schließen</button>
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
