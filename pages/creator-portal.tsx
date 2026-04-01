import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CSS, HTML, JS } from '@/lib/app-shell'

type AuthState = 'checking' | 'auth_ready' | 'portal_ready' | 'error' | 'portal_error'

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#f4f5f7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, fontFamily: 'system-ui, sans-serif',
      zIndex: 99999
    }}>
      <div style={{ fontSize: 28 }}>⏳</div>
      <div style={{ fontSize: 14, color: '#888' }}>Creator Portal wird geladen...</div>
    </div>
  )
}

function ErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div style={{
      minHeight: '100vh', background: '#f0f0f5', display: 'flex',
      alignItems: 'center', justifyContent: 'center', padding: 24,
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        background: '#fff', border: '1px solid #e8e8ec', borderRadius: 20,
        padding: '44px 40px', width: '100%', maxWidth: 400, textAlign: 'center'
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
          Link ungültig oder abgelaufen
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, margin: '0 0 28px' }}>
          Bitte fordere einen neuen Link bei deinem Filapen-Team an.
        </p>
        <button onClick={onRetry} style={{
          width: '100%', background: '#111', color: '#fff', fontWeight: 600,
          fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer'
        }}>
          Neuen Link anfordern
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}

export default function CreatorPortalPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [creatorData, setCreatorData] = useState<any>(null)
  const jsInitialized = useRef(false)
  const authInitialized = useRef(false)

  // ── Step 1: Auth check ───────────────────────────────────────────────────
  useEffect(() => {
    function runAuth() {
      if (authInitialized.current) return
      authInitialized.current = true

      const urlParams = new URLSearchParams(window.location.search)
      const urlCode = urlParams.get('code') || (router.query.code as string) || ''
      const storedToken = localStorage.getItem('creator_token')
      const storedCreator = localStorage.getItem('creator')

      if (urlCode) {
        verifyCode(urlCode)
      } else if (storedToken && storedCreator) {
        try {
          const creator = JSON.parse(storedCreator)
          setCreatorData(creator)
          setAuthState('auth_ready')
        } catch {
          clearSession()
          setAuthState('error')
        }
      } else {
        setAuthState('error')
      }
    }

    if (router.isReady) { runAuth() }
    else { const t = setTimeout(runAuth, 300); return () => clearTimeout(t) }
  }, [])

  async function verifyCode(code: string) {
    try {
      const res = await fetch('/api/auth/creator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() })
      })
      const data = await res.json()
      if (!res.ok || !data.creator) { setAuthState('error'); return }
      localStorage.setItem('creator_token', data.token)
      localStorage.setItem('creator', JSON.stringify(data.creator))
      setCreatorData(data.creator)
      setAuthState('auth_ready')
      router.replace('/creator-portal', undefined, { shallow: true })
    } catch {
      setAuthState('error')
    }
  }

  function clearSession() {
    localStorage.removeItem('creator_token')
    localStorage.removeItem('creator')
  }

  // ── Step 2: Mount portal – EXAKT wie dashboard.tsx ───────────────────────
  useEffect(() => {
    if (authState !== 'auth_ready') return
    if (!creatorData) return
    if (jsInitialized.current) return
    if (!containerRef.current) return
    jsInitialized.current = true

    const el = containerRef.current

    // 1. Inject the COMPLETE app HTML (same as dashboard.tsx)
    el.innerHTML = HTML

    // 2. Inject the COMPLETE CSS (same as dashboard.tsx)
    const st = document.createElement('style')
    st.textContent = CSS
    document.head.appendChild(st)
    styleRef.current = st

    // 3. Execute the COMPLETE JS (same as dashboard.tsx)
    try {
      const fn = new Function(JS)
      fn()
    } catch (e) {
      console.error('[CreatorPortal] JS init error:', e)
      setAuthState('portal_error')
      return
    }

    // 4. Hide admin UI – NOT remove, just hide
    const adminSb = document.getElementById('admin-sb')
    const adminMain = document.querySelector('.main') as HTMLElement | null
    if (adminSb) adminSb.style.display = 'none'
    if (adminMain) adminMain.style.display = 'none'

    // 5. Inject creator into S.creators so openPortal(id) can find it
    const w = window as any
    if (w.S && Array.isArray(w.S.creators)) {
      const exists = w.S.creators.find((c: any) => String(c.id) === String(creatorData.id))
      if (!exists) {
        w.S.creators.push({
          id: creatorData.id,
          name: creatorData.name,
          ini: creatorData.initials || creatorData.name?.slice(0, 2).toUpperCase() || 'CR',
          color: creatorData.color_from || '#6366f1',
          email: creatorData.email || '',
          status: creatorData.status || 'aktiv',
          flds: { bilder: [], videos: [], roh: [], auswertung: [] },
          notizenCreator: creatorData.notizen_creator || '',
        })
      }
    }

    // 6. openPortal(cid) – THE SAME CALL the admin uses
    if (typeof w.openPortal !== 'function') {
      console.error('[CreatorPortal] openPortal not found after JS init')
      setAuthState('portal_error')
      return
    }
    try {
      w.openPortal(creatorData.id)
    } catch (e) {
      console.error('[CreatorPortal] openPortal() failed:', e)
      setAuthState('portal_error')
      return
    }

    // 7. Load folders + uploads from API (mirrors dashboard.tsx data loading)
    const token = localStorage.getItem('creator_token') || ''
    const cid = creatorData.id

    fetch('/api/folders?creatorId=' + String(cid), {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then((folders: any[]) => {
        if (!Array.isArray(folders) || !w.S) return
        const cr = w.S.creators.find((x: any) => String(x.id) === String(cid))
        if (!cr) return
        folders.forEach((f: any) => {
          const tab = f.tab || 'bilder'
          if (!cr.flds[tab]) cr.flds[tab] = []
          if (!cr.flds[tab].find((x: any) => String(x.id) === String(f.id))) {
            cr.flds[tab].push({
              id: f.id, name: f.name, batch: f.batch || '',
              date: f.date || new Date().toISOString().slice(0, 10),
              deadline: f.deadline || '', prods: f.prods || [],
              tags: f.tags || [], files: []
            })
          }
        })
        if (typeof w.renderPortalPage === 'function') {
          try { w.renderPortalPage('home') } catch (_) {}
        }
        return fetch('/api/uploads?creatorId=' + String(cid), {
          headers: { 'Authorization': 'Bearer ' + token }
        })
      })
      .then(r => r ? r.json() : null)
      .then((uploads: any[]) => {
        if (!Array.isArray(uploads) || !w.S) return
        const cr = w.S.creators.find((x: any) => String(x.id) === String(cid))
        if (!cr) return
        const tabMap: any = { bilder:'bilder', videos:'videos', roh:'roh', auswertung:'auswertung', pdf:'bilder', link:'bilder', file:'bilder' }
        uploads.forEach((u: any) => {
          const tab = tabMap[u.tab] || 'bilder'
          if (!cr.flds[tab]) cr.flds[tab] = []
          let fld = cr.flds[tab].find((f: any) => f.id === '__db_uploads__')
          if (!fld) {
            fld = { id: '__db_uploads__', name: 'Meine Uploads', batch: 'Upload',
              date: new Date().toISOString().slice(0, 10), deadline: null, prods: [], tags: [], files: [] }
            cr.flds[tab].unshift(fld)
          }
          if (!fld.files.find((f: any) => f.id === u.id)) {
            fld.files.push({
              id: u.id, name: u.file_name, type: u.file_type,
              url: u.file_url, size: u.file_size ? (u.file_size/1024/1024).toFixed(1)+' MB' : '',
              uploadedAt: null, comments: [], r2Key: u.r2_key
            })
          }
        })
        if (typeof w.renderPortalPage === 'function') {
          try { w.renderPortalPage('home') } catch (_) {}
        }
      })
      .catch((e: any) => console.warn('[CreatorPortal] Data load error:', e.message))

    setAuthState('portal_ready')

    return () => {
      if (styleRef.current) {
        try { document.head.removeChild(styleRef.current) } catch {}
        styleRef.current = null
      }
    }
  }, [authState, creatorData])

  return (
    <>
      <Head>
        <title>Creator Portal – Filapen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      {(authState === 'checking' || authState === 'auth_ready') && <LoadingScreen />}

      {authState === 'error' && (
        <ErrorScreen onRetry={() => { window.location.href = '/creator' }} />
      )}

      {authState === 'portal_error' && (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', padding:24 }}>
          <div style={{ textAlign:'center', maxWidth:400 }}>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
            <h2 style={{ fontSize:20, marginBottom:8 }}>Portal konnte nicht geladen werden</h2>
            <p style={{ color:'#888', marginBottom:20 }}>Bitte versuche es erneut oder wende dich an das Team.</p>
            <button onClick={() => window.location.reload()} style={{ padding:'12px 24px', background:'#111', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>
              Neu laden
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100vw', height: '100vh', overflow: 'hidden',
          visibility: authState === 'portal_ready' ? 'visible' : 'hidden',
          pointerEvents: authState === 'portal_ready' ? 'auto' : 'none'
        }}
      />
    </>
  )
}
