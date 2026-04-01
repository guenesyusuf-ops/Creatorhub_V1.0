import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'
import { CSS, HTML, JS } from '@/lib/app-shell'

export default function DashboardPage() {
  const router = useRouter()
  const ref = useRef<HTMLDivElement>(null)
  const ready = useRef(false)

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) { router.push('/login'); return }
    if (ready.current) return
    ready.current = true
    const el = ref.current
    if (!el) return
    el.innerHTML = HTML
    const st = document.createElement('style')
    st.textContent = CSS
    document.head.appendChild(st)
    try {
      const fn = new Function(JS)
      fn()
    } catch(e) { console.error(e) }

    // Load real creators from Supabase
    // ONLY show creators that exist in Supabase — no demo data
    const w = window as any
    fetch('/api/creators', {
      headers: { 'Authorization': 'Bearer ' + token }
    })
      .then(r => r.json())
      .then((realCreators: any[]) => {
        if (!Array.isArray(realCreators) || !w.S) return

        // Filter: only real creators with a name (skip empty/test entries)
        const validCreators = realCreators.filter((rc: any) =>
          rc.name && rc.name.trim().length > 0
        )

        // Build new S.creators from Supabase data only
        // Preserve existing flds if creator was already in demo data (same name)
        const newCreators = validCreators.map((rc: any) => {
          // Find existing demo entry to preserve flds/notes/etc
          const existing = w.S.creators.find((c: any) =>
            String(c.id) === String(rc.id) || c.name === rc.name
          )
          return {
            // Supabase data is primary source of truth
            id: rc.id,
            name: rc.name,
            ini: rc.initials || rc.name.slice(0,2).toUpperCase(),
            color: rc.color_from || existing?.color || '#6366f1',
            email: rc.email || '',
            status: rc.status || 'ausstehend',
            last_login: rc.last_login,
            lastLogin: rc.last_login,
            invite_code: rc.invite_code,
            invited: !!rc.invite_code,
            invitedAt: rc.invited_at,
            // Profile fields — Supabase first, existing local as fallback
            tags: (rc.tags && rc.tags.length > 0) ? rc.tags : (existing?.tags || []),
            age: rc.age || existing?.age || 0,
            gender: rc.gender || existing?.gender || 'female',
            country: rc.country || existing?.country || 'DE',
            desc: rc.description || existing?.desc || '',
            photo: rc.photo || existing?.photo || null,
            instagram: rc.instagram || existing?.instagram || '',
            verguetung: rc.verguetung || existing?.verguetung || 'provision',
            provision: rc.provision || existing?.provision || '',
            fixbetrag: rc.fixbetrag || existing?.fixbetrag || '',
            notizen: rc.notizen || existing?.notizen || '',
            notizenCreator: rc.notizen_creator || existing?.notizenCreator || '',
            kids: rc.kids != null ? rc.kids : (existing?.kids || false),
            kidsAges: (rc.kids_ages && rc.kids_ages.length > 0) ? rc.kids_ages : (existing?.kidsAges || []),
            kidsOnVid: rc.kids_on_vid != null ? rc.kids_on_vid : (existing?.kidsOnVid || false),
            // Preserve local-only data
            flds: existing?.flds || { bilder: [], videos: [], roh: [], auswertung: [] },
            vertrag: existing?.vertrag || null,
            vertragsname: existing?.vertragsname || '',
            up: existing?.up || new Date(),
          }
        })

        // Replace S.creators entirely with real data
        w.S.creators = newCreators
        console.log('[Dashboard] Loaded', newCreators.length, 'creators from Supabase')

        // Re-render
        if (w.rDash) try { w.rDash() } catch(e) {}
        if (w.rCreators) try { w.rCreators() } catch(e) {}
        if (w.rCInvite) try { w.rCInvite() } catch(e) {}

        // Load folders for each creator
        newCreators.forEach((c: any) => {
          fetch('/api/folders?creatorId=' + String(c.id), {
            headers: { 'Authorization': 'Bearer ' + token }
          })
            .then(r => r.json())
            .then((folders: any[]) => {
              if (!Array.isArray(folders)) return
              const cr = w.S.creators.find((x: any) => String(x.id) === String(c.id))
              if (!cr) return
              folders.forEach((f: any) => {
                const tab = f.tab || 'bilder'
                if (!cr.flds[tab]) cr.flds[tab] = []
                if (!cr.flds[tab].find((x: any) => String(x.id) === String(f.id))) {
                  cr.flds[tab].push({
                    id: f.id,
                    name: f.name,
                    batch: f.batch || '',
                    date: f.date || new Date().toISOString().slice(0,10),
                    deadline: f.deadline || '',
                    prods: f.prods || [],
                    tags: f.tags || [],
                    files: []
                  })
                }
              })
              if (w.S.aC && String(w.S.aC.id) === String(c.id)) {
                try { w.rCT(w.S.aCT) } catch(e) {}
                try { w.rCHdr() } catch(e) {}
              }
            })
            .catch(() => {})
        })
      })
      .catch((e: any) => console.warn('[Dashboard] Creator sync failed:', e.message))

    // Load app data (produkte, projekte, kat)
    fetch('/api/app-data', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then((appData: any) => {
        if (!appData || !w.S) return
        if (Array.isArray(appData.produkte) && appData.produkte.length > 0) {
          w.S.produkte = appData.produkte
        }
        if (Array.isArray(appData.projekte) && appData.projekte.length > 0) {
          w.S.projekte = appData.projekte
        }
        if (Array.isArray(appData.kat) && appData.kat.length > 0) {
          w.S.kat = appData.kat
        }
        try { w.rDash() } catch(e) {}
        try { w.rProdukte && w.rProdukte() } catch(e) {}
        try { w.rProjekte && w.rProjekte() } catch(e) {}
        try { w.rKat && w.rKat() } catch(e) {}
        console.log('[Dashboard] App data loaded')
      })
      .catch(() => {})

    return () => { try { document.head.removeChild(st) } catch(e){} }
  }, [])

  return (
    <>
      <Head>
        <title>CreatorHub – Filapen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <div ref={ref} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />
    </>
  )
}
