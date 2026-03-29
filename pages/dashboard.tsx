import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type View = 'main' | 'dates' | 'links'
type Page = 'dashboard' | 'team'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [page, setPage] = useState<Page>('dashboard')
  const [view, setView] = useState<View>('main')
  const [categories, setCategories] = useState<any[]>([])
  const [creators, setCreators] = useState<any[]>([])
  const [teamMembers, setTeamMembers] = useState<any[]>([])
  const [activeCat, setActiveCat] = useState<string>('')
  const [activeCreator, setActiveCreator] = useState<any>(null)
  const [activeDate, setActiveDate] = useState<any>(null)
  const [links, setLinks] = useState<any[]>([])
  const [dates, setDates] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState('')
  const [modal, setModal] = useState<string>('')
  // form state
  const [form, setForm] = useState<any>({})
  const [selectedRole, setSelectedRole] = useState('read')

  useEffect(() => {
    const token = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (!token || !u) { router.push('/login'); return }
    setUser(JSON.parse(u))
    loadCategories(token)
    loadCreators(token)
  }, [])

  const token = () => localStorage.getItem('token') || ''
  const authHeader = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token()}` })

  async function loadCategories(t: string) {
    const res = await fetch('/api/categories', { headers: { Authorization: `Bearer ${t}` } })
    const data = await res.json()
    setCategories(data)
    if (data.length > 0) setActiveCat(data[0].id)
  }

  async function loadCreators(t: string) {
    const res = await fetch('/api/creators', { headers: { Authorization: `Bearer ${t}` } })
    const data = await res.json()
    setCreators(data)
  }

  async function loadTeam() {
    const res = await fetch('/api/team/members', { headers: { Authorization: `Bearer ${token()}` } })
    const data = await res.json()
    setTeamMembers(data)
  }

  async function loadDates(creatorId: string) {
    const res = await fetch(`/api/dates?creator_id=${creatorId}`, { headers: { Authorization: `Bearer ${token()}` } })
    const data = await res.json()
    setDates(data)
  }

  async function loadLinks(dateId: string) {
    const res = await fetch(`/api/links?date_id=${dateId}`, { headers: { Authorization: `Bearer ${token()}` } })
    const data = await res.json()
    setLinks(data)
  }

  function navigate(p: Page) {
    setPage(p)
    setView('main')
    setSearch('')
    if (p === 'team') loadTeam()
  }

  function openCreator(c: any) {
    setActiveCreator(c)
    loadDates(c.id)
    setView('dates')
  }

  function openDate(d: any) {
    setActiveDate(d)
    loadLinks(d.id)
    setView('links')
  }

  function goBack(to: View) {
    setView(to)
    if (to === 'main') setActiveCreator(null)
  }

  function logout() {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    router.push('/login')
  }

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  async function confirmModal() {
    if (modal === 'addCat') {
      const res = await fetch('/api/categories', { method: 'POST', headers: authHeader(), body: JSON.stringify({ name: form.catName, icon: form.catIcon || '📁' }) })
      const d = await res.json()
      setCategories(prev => [...prev, d])
      setActiveCat(d.id)
      showToast(`Kategorie "${form.catName}" erstellt ✓`)
    } else if (modal === 'addCreator') {
      const colors = [['#7c3aed', '#c8f035'], ['#e11d48', '#fbbf24'], ['#0891b2', '#34d399'], ['#d97706', '#f472b6'], ['#059669', '#6366f1']]
      const [cf, ct] = colors[Math.floor(Math.random() * colors.length)]
      const res = await fetch('/api/creators', { method: 'POST', headers: authHeader(), body: JSON.stringify({ name: form.creatorName, initials: (form.creatorInitials || form.creatorName.slice(0, 2)).toUpperCase(), color_from: cf, color_to: ct, category_id: form.creatorCat || activeCat }) })
      const d = await res.json()
      setCreators(prev => [...prev, d])
      showToast(`Creator "${form.creatorName}" hinzugefügt ✓`)
    } else if (modal === 'addDate') {
      const res = await fetch('/api/dates', { method: 'POST', headers: authHeader(), body: JSON.stringify({ creator_id: activeCreator.id, month: form.month }) })
      const d = await res.json()
      await loadDates(activeCreator.id)
      showToast('Datum hinzugefügt ✓')
    } else if (modal === 'addLink') {
      const res = await fetch('/api/links', { method: 'POST', headers: authHeader(), body: JSON.stringify({ date_id: activeDate.id, creator_id: activeCreator.id, title: form.linkTitle, url: form.linkUrl }) })
      await loadLinks(activeDate.id)
      showToast('Link hinzugefügt ✓')
    } else if (modal === 'invite') {
      const res = await fetch('/api/team/invite', { method: 'POST', headers: authHeader(), body: JSON.stringify({ name: form.invName, email: form.invEmail, role: selectedRole }) })
      if (res.ok) { await loadTeam(); showToast(`Einladung an ${form.invEmail} gesendet ✓`) }
      else { const e = await res.json(); showToast('Fehler: ' + e.error) }
    } else if (modal === 'inviteCreator') {
      const res = await fetch('/api/creators/invite', { method: 'POST', headers: authHeader(), body: JSON.stringify({ creatorId: form.invCreatorId, email: form.invCreatorEmail }) })
      if (res.ok) { showToast(`Einladung an Creator gesendet ✓`) }
    }
    setModal(''); setForm({})
  }

  async function changeRole(id: string, role: string) {
    await fetch('/api/team/members', { method: 'PATCH', headers: authHeader(), body: JSON.stringify({ id, role }) })
    setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, role } : m))
    showToast('Rolle geändert ✓')
  }

  async function removeMember(id: string, name: string) {
    await fetch('/api/team/members', { method: 'DELETE', headers: authHeader(), body: JSON.stringify({ id }) })
    setTeamMembers(prev => prev.filter(m => m.id !== id))
    showToast(`${name} entfernt`)
  }

  const filteredCreators = creators.filter(c => c.category_id === activeCat && (!search || c.name.toLowerCase().includes(search.toLowerCase())))
  const catName = categories.find(c => c.id === activeCat)?.name || ''
  const allCreators = creators.length
  const allDates = creators.reduce((s: number, c: any) => s + (c.dates?.length || 0), 0)
  const allLinks = creators.reduce((s: number, c: any) => s + (c.dates?.reduce((ss: number, d: any) => ss + (d.links?.length || 0), 0) || 0), 0)

  return (
    <>
      <Head><title>CreatorHub Dashboard</title></Head>
      <div style={st.layout}>
        {/* SIDEBAR */}
        <div style={st.sidebar}>
          <div style={st.logo}>CREATOR<span style={{ color: '#f0f0f5' }}>HUB</span></div>
          <div style={st.logoSub}>Content Manager</div>
          <div style={st.navLabel}>Navigation</div>
          {[
            { id: 'dashboard', icon: '⬡', label: 'Dashboard' },
            { id: 'overview', icon: '◎', label: 'Übersicht', page: 'dashboard' },
          ].map(item => (
            <div key={item.id} style={{ ...st.navItem, ...(page === (item.page || item.id) && item.id !== 'overview' ? st.navActive : {}) }}
              onClick={() => navigate((item.page || item.id) as Page)}>
              <span>{item.icon}</span>{item.label}
            </div>
          ))}
          <div style={{ ...st.navLabel, marginTop: 20 }}>Einstellungen</div>
          <div style={{ ...st.navItem, ...(page === 'team' ? st.navActive : {}) }} onClick={() => navigate('team')}>
            <span>✦</span> Team
          </div>
          <div style={st.navItem} onClick={() => navigate('dashboard')}><span>⚙</span> Konfiguration</div>
          <div style={st.sidebarFooter}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={st.avatarSm}>{user?.name?.slice(0, 2).toUpperCase()}</div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 500 }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: '#6b6b80' }}>{user?.role === 'admin' ? 'Admin' : 'Leser'}</div>
              </div>
              <button style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#6b6b80', cursor: 'pointer', fontSize: 16 }} onClick={logout} title="Logout">⏻</button>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div style={st.main}>
          {/* TOPBAR */}
          <div style={st.topbar}>
            <div style={st.searchWrap}>
              <span style={st.searchIcon}>🔍</span>
              <input style={st.searchInput} placeholder={page === 'team' ? 'Suche nach Teammitgliedern...' : 'Suche nach Creatorn...'} value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 10 }}>
              {page === 'dashboard' && user?.role === 'admin' && (
                <button style={st.btnPrimary} onClick={() => setModal('addCreator')}>+ Creator hinzufügen</button>
              )}
              {page === 'team' && user?.role === 'admin' && (
                <button style={st.btnPrimary} onClick={() => setModal('invite')}>+ Mitglied einladen</button>
              )}
            </div>
          </div>

          <div style={st.content}>
            {/* ══ DASHBOARD ══ */}
            {page === 'dashboard' && (
              <>
                {/* MAIN VIEW */}
                {view === 'main' && (
                  <>
                    <div style={st.breadcrumb}><span>CreatorHub</span><span style={st.sep}>›</span><span style={st.bcCurrent}>{catName || 'Dashboard'}</span></div>
                    <div style={st.pageHeader}>
                      <div>
                        <div style={st.pageTitle}>Content <span style={{ color: '#c8f035' }}>Dashboard</span></div>
                        <div style={st.pageSub}>Verwalte alle Creator-Inhalte an einem Ort</div>
                      </div>
                    </div>
                    <div style={st.statsGrid}>
                      {[{ label: 'Kategorien', val: categories.length }, { label: 'Creator', val: allCreators }, { label: 'Dates', val: allDates }, { label: 'Links', val: allLinks }].map(s => (
                        <div key={s.label} style={st.statCard}>
                          <div style={st.statLabel}>{s.label}</div>
                          <div style={st.statVal}>{s.val}</div>
                        </div>
                      ))}
                    </div>
                    {/* CAT TABS */}
                    <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' as const }}>
                      {categories.map(cat => (
                        <button key={cat.id} onClick={() => setActiveCat(cat.id)} style={{ padding: '10px 20px', borderRadius: 40, border: activeCat === cat.id ? '1px solid #c8f035' : '1px solid rgba(255,255,255,0.07)', background: activeCat === cat.id ? '#c8f035' : '#111118', color: activeCat === cat.id ? '#0a0a0f' : '#6b6b80', fontWeight: activeCat === cat.id ? 700 : 400, fontSize: 14, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                          {cat.icon} {cat.name} <span style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 20, padding: '1px 8px', fontSize: 11 }}>{creators.filter(c => c.category_id === cat.id).length}</span>
                        </button>
                      ))}
                      {user?.role === 'admin' && (
                        <button onClick={() => setModal('addCat')} style={{ padding: '10px 16px', borderRadius: 40, border: '1px dashed rgba(200,240,53,0.3)', background: 'transparent', color: '#c8f035', fontSize: 13, cursor: 'pointer' }}>+ Kategorie</button>
                      )}
                    </div>
                    {/* CREATOR GRID */}
                    <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 18, fontWeight: 700, marginBottom: 20 }}>{catName} – Creator</div>
                    <div style={st.creatorGrid}>
                      {filteredCreators.map(c => {
                        const totalDates = c.dates?.length || 0
                        const totalLinks = c.dates?.reduce((s: number, d: any) => s + (d.links?.length || 0), 0) || 0
                        return (
                          <div key={c.id} style={st.creatorCard} onClick={() => openCreator(c)}>
                            <div style={{ width: 72, height: 72, borderRadius: '50%', background: `linear-gradient(135deg,${c.color_from},${c.color_to})`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, fontWeight: 800, fontFamily: 'Syne, sans-serif', margin: '0 auto 12px' }}>{c.initials}</div>
                            <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700, marginBottom: 4 }}>{c.name}</div>
                            <div style={{ fontSize: 12, color: '#6b6b80', marginBottom: 12 }}>{catName}</div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 11, color: '#6b6b80', borderTop: '1px solid rgba(255,255,255,0.07)', paddingTop: 10 }}>
                              <div><strong style={{ display: 'block', fontSize: 14, color: '#f0f0f5' }}>{totalDates}</strong>Dates</div>
                              <div><strong style={{ display: 'block', fontSize: 14, color: '#f0f0f5' }}>{totalLinks}</strong>Links</div>
                            </div>
                            {user?.role === 'admin' && (
                              <button onClick={e => { e.stopPropagation(); setForm({ invCreatorId: c.id }); setModal('inviteCreator') }} style={{ marginTop: 10, width: '100%', background: 'rgba(200,240,53,0.08)', border: '1px solid rgba(200,240,53,0.2)', borderRadius: 8, padding: '6px 0', fontSize: 11, color: '#c8f035', cursor: 'pointer' }}>
                                📧 Als Creator einladen
                              </button>
                            )}
                          </div>
                        )
                      })}
                      {!filteredCreators.length && search && <div style={{ color: '#6b6b80', fontSize: 14 }}>Keine Ergebnisse für "{search}"</div>}
                      {user?.role === 'admin' && (
                        <div style={st.addCard} onClick={() => setModal('addCreator')}>
                          <div style={{ fontSize: 28 }}>＋</div>
                          <span style={{ fontSize: 13 }}>Creator hinzufügen</span>
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* DATES VIEW */}
                {view === 'dates' && activeCreator && (
                  <>
                    <button style={st.backBtn} onClick={() => goBack('main')}>← Zurück zur Übersicht</button>
                    <div style={st.breadcrumb}><span>Dashboard</span><span style={st.sep}>›</span><span>{catName}</span><span style={st.sep}>›</span><span style={st.bcCurrent}>{activeCreator.name}</span></div>
                    <div style={st.pageHeader}>
                      <div><div style={st.pageTitle}>{activeCreator.name} <span style={{ color: '#c8f035' }}>Dates</span></div></div>
                      {user?.role === 'admin' && <button style={st.btnPrimary} onClick={() => setModal('addDate')}>+ Datum hinzufügen</button>}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(200px,1fr))', gap: 12 }}>
                      {dates.map(d => {
                        const label = new Date(d.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })
                        return (
                          <div key={d.id} style={st.dateCard} onClick={() => openDate(d)}>
                            <div>
                              <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 15, fontWeight: 700 }}>📅 {label}</div>
                              <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2 }}>{d.links?.length || 0} Links</div>
                            </div>
                            <div style={{ color: '#6b6b80', fontSize: 18 }}>›</div>
                          </div>
                        )
                      })}
                      {!dates.length && <div style={{ color: '#6b6b80', fontSize: 14 }}>Noch keine Dates vorhanden.</div>}
                    </div>
                  </>
                )}

                {/* LINKS VIEW */}
                {view === 'links' && activeDate && (
                  <>
                    <button style={st.backBtn} onClick={() => goBack('dates')}>← Zurück zu den Dates</button>
                    <div style={st.breadcrumb}><span>Dashboard</span><span style={st.sep}>›</span><span>{activeCreator?.name}</span><span style={st.sep}>›</span><span style={st.bcCurrent}>{new Date(activeDate.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span></div>
                    <div style={st.pageHeader}>
                      <div><div style={st.pageTitle}>Links <span style={{ color: '#c8f035' }}>{new Date(activeDate.month + '-01').toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}</span></div></div>
                      {user?.role === 'admin' && <button style={st.btnPrimary} onClick={() => setModal('addLink')}>+ Link hinzufügen</button>}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {links.map(link => (
                        <div key={link.id} style={st.linkItem}>
                          <div style={st.linkIcon}>🔗</div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: 14, fontWeight: 500 }}>{link.title}</div>
                            <div style={{ fontSize: 12, color: '#6b6b80', marginTop: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' as const }}>{link.url}</div>
                          </div>
                          <a href={link.url} target="_blank" rel="noreferrer" style={st.openBtn}>Öffnen ↗</a>
                        </div>
                      ))}
                      {!links.length && <div style={{ color: '#6b6b80', fontSize: 14 }}>Keine Links vorhanden.</div>}
                    </div>
                  </>
                )}
              </>
            )}

            {/* ══ TEAM ══ */}
            {page === 'team' && (
              <>
                <div style={st.breadcrumb}><span>CreatorHub</span><span style={st.sep}>›</span><span style={st.bcCurrent}>Team</span></div>
                <div style={st.pageHeader}>
                  <div>
                    <div style={st.pageTitle}>Team <span style={{ color: '#c8f035' }}>Verwaltung</span></div>
                    <div style={st.pageSub}>Mitglieder einladen, Rollen & Zugriffsrechte verwalten</div>
                  </div>
                  {user?.role === 'admin' && <button style={st.btnPrimary} onClick={() => setModal('invite')}>+ Mitglied einladen</button>}
                </div>
                <div style={st.statsGrid}>
                  {[{ label: 'Gesamt', val: teamMembers.length }, { label: 'Admins', val: teamMembers.filter(m => m.role === 'admin').length }, { label: 'Ausstehend', val: teamMembers.filter(m => m.status === 'pending').length }].map(s => (
                    <div key={s.label} style={st.statCard}><div style={st.statLabel}>{s.label}</div><div style={st.statVal}>{s.val}</div></div>
                  ))}
                  <div style={st.statCard}><div style={st.statLabel}>Leser</div><div style={st.statVal}>{teamMembers.filter(m => m.role === 'read').length}</div></div>
                </div>
                <div style={st.tableWrap}>
                  <div style={st.tableHead}>
                    <div>Mitglied</div><div>E-Mail</div><div>Rolle</div><div>Status</div><div style={{ textAlign: 'right' as const }}>Aktionen</div>
                  </div>
                  {teamMembers.filter(m => !search || m.name.toLowerCase().includes(search) || m.email.toLowerCase().includes(search)).map(m => (
                    <div key={m.id} style={st.tableRow}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 36, height: 36, borderRadius: '50%', background: `linear-gradient(135deg,#7c3aed,#c8f035)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', flexShrink: 0 }}>{m.name.slice(0, 2).toUpperCase()}</div>
                        <div style={{ fontSize: 14, fontWeight: 500 }}>{m.name}{m.email === user?.email ? ' (Du)' : ''}</div>
                      </div>
                      <div style={{ fontSize: 13, color: '#6b6b80' }}>{m.email}</div>
                      <div>
                        {m.email === user?.email ? <span style={{ fontSize: 12, color: '#6b6b80' }}>Du</span> : (
                          <select value={m.role} onChange={e => changeRole(m.id, e.target.value)} style={st.roleSelect}>
                            <option value="admin">Admin</option>
                            <option value="read">Lesen</option>
                          </select>
                        )}
                      </div>
                      <div style={{ fontSize: 13, color: m.status === 'active' ? '#22c55e' : '#f59e0b' }}>
                        {m.status === 'active' ? '● Aktiv' : '◌ Ausstehend'}
                      </div>
                      <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                        {m.email !== user?.email && user?.role === 'admin' && (
                          <button style={st.iconBtn} onClick={() => removeMember(m.id, m.name)} title="Entfernen">🗑</button>
                        )}
                      </div>
                    </div>
                  ))}
                  {!teamMembers.length && <div style={{ padding: 24, color: '#6b6b80', fontSize: 14 }}>Noch keine Teammitglieder.</div>}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* ══ MODAL ══ */}
      {modal && (
        <div style={st.overlay} onClick={e => { if (e.target === e.currentTarget) setModal('') }}>
          <div style={st.modal}>
            <div style={st.modalTitle}>
              {modal === 'addCat' && <>Kategorie <span style={{ color: '#c8f035' }}>hinzufügen</span></>}
              {modal === 'addCreator' && <>Creator <span style={{ color: '#c8f035' }}>hinzufügen</span></>}
              {modal === 'addDate' && <>Datum <span style={{ color: '#c8f035' }}>hinzufügen</span></>}
              {modal === 'addLink' && <>Link <span style={{ color: '#c8f035' }}>hinzufügen</span></>}
              {modal === 'invite' && <>Mitglied <span style={{ color: '#c8f035' }}>einladen</span></>}
              {modal === 'inviteCreator' && <>Creator <span style={{ color: '#c8f035' }}>einladen</span></>}
            </div>

            {modal === 'addCat' && (
              <>
                <MField label="Name" value={form.catName} onChange={v => setForm({ ...form, catName: v })} placeholder="z.B. Reels, Storys..." />
                <MField label="Emoji" value={form.catIcon} onChange={v => setForm({ ...form, catIcon: v })} placeholder="🎥" />
              </>
            )}
            {modal === 'addCreator' && (
              <>
                <MField label="Name" value={form.creatorName} onChange={v => setForm({ ...form, creatorName: v })} placeholder="z.B. Anna M." />
                <MField label="Kürzel (2-3 Buchst.)" value={form.creatorInitials} onChange={v => setForm({ ...form, creatorInitials: v })} placeholder="AM" />
                <div style={st.fGroup}>
                  <label style={st.fLabel}>Kategorie</label>
                  <select style={st.fInput} value={form.creatorCat || activeCat} onChange={e => setForm({ ...form, creatorCat: e.target.value })}>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
                  </select>
                </div>
              </>
            )}
            {modal === 'addDate' && (
              <MField label="Monat & Jahr" type="month" value={form.month} onChange={v => setForm({ ...form, month: v })} />
            )}
            {modal === 'addLink' && (
              <>
                <MField label="Bezeichnung" value={form.linkTitle} onChange={v => setForm({ ...form, linkTitle: v })} placeholder="z.B. Brand Video März" />
                <MField label="URL" value={form.linkUrl} onChange={v => setForm({ ...form, linkUrl: v })} placeholder="https://..." />
              </>
            )}
            {modal === 'invite' && (
              <>
                <MField label="Name" value={form.invName} onChange={v => setForm({ ...form, invName: v })} placeholder="Max Mustermann" />
                <MField label="E-Mail" type="email" value={form.invEmail} onChange={v => setForm({ ...form, invEmail: v })} placeholder="max@company.com" />
                <div style={st.fGroup}>
                  <label style={st.fLabel}>Zugriffsrecht</label>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 6 }}>
                    {[{ val: 'read', icon: '👁', label: 'Lesen', desc: 'Kann Inhalte nur ansehen' }, { val: 'admin', icon: '⚡', label: 'Admin', desc: 'Vollzugriff & Verwaltung' }].map(r => (
                      <div key={r.val} onClick={() => setSelectedRole(r.val)} style={{ padding: 14, borderRadius: 12, border: selectedRole === r.val ? '2px solid #c8f035' : '2px solid rgba(255,255,255,0.07)', background: selectedRole === r.val ? 'rgba(200,240,53,0.06)' : 'transparent', cursor: 'pointer' }}>
                        <div style={{ fontFamily: 'Syne, sans-serif', fontSize: 14, fontWeight: 700, marginBottom: 4 }}>{r.icon} {r.label}</div>
                        <div style={{ fontSize: 12, color: '#6b6b80' }}>{r.desc}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
            {modal === 'inviteCreator' && (
              <MField label="E-Mail der Creatorin" type="email" value={form.invCreatorEmail} onChange={v => setForm({ ...form, invCreatorEmail: v })} placeholder="creator@email.com" />
            )}

            <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
              <button style={st.btnCancel} onClick={() => setModal('')}>Abbrechen</button>
              <button style={st.btnPrimary} onClick={confirmModal}>
                {modal === 'invite' || modal === 'inviteCreator' ? 'Einladung senden' : 'Speichern'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div style={{ position: 'fixed', bottom: 24, right: 24, background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderLeft: '3px solid #c8f035', borderRadius: 10, padding: '12px 18px', fontSize: 14, zIndex: 999 }}>
          {toast}
        </div>
      )}
    </>
  )
}

function MField({ label, value, onChange, placeholder, type = 'text' }: any) {
  return (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: 12, color: '#6b6b80', textTransform: 'uppercase' as const, letterSpacing: 1, marginBottom: 6 }}>{label}</label>
      <input type={type} value={value || ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        style={{ width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f0f0f5', fontSize: 14, outline: 'none' }} />
    </div>
  )
}

const st: any = {
  layout: { display: 'flex', minHeight: '100vh' },
  sidebar: { position: 'fixed', left: 0, top: 0, bottom: 0, width: 240, background: '#111118', borderRight: '1px solid rgba(255,255,255,0.07)', display: 'flex', flexDirection: 'column', padding: '24px 16px', zIndex: 100 },
  logo: { fontFamily: 'Syne, sans-serif', fontWeight: 800, fontSize: 20, color: '#c8f035', letterSpacing: -0.5, marginBottom: 8, padding: '0 8px' },
  logoSub: { fontSize: 11, color: '#6b6b80', padding: '0 8px', marginBottom: 32, textTransform: 'uppercase', letterSpacing: 1 },
  navLabel: { fontSize: 10, textTransform: 'uppercase', letterSpacing: 1.5, color: '#6b6b80', padding: '0 8px', marginBottom: 8 },
  navItem: { display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, cursor: 'pointer', fontSize: 14, color: '#6b6b80', marginBottom: 2, border: '1px solid transparent', transition: 'all 0.2s' },
  navActive: { background: 'rgba(200,240,53,0.1)', color: '#c8f035', borderColor: 'rgba(200,240,53,0.2)' },
  sidebarFooter: { marginTop: 'auto', padding: 12, background: '#1a1a24', borderRadius: 12, border: '1px solid rgba(255,255,255,0.07)' },
  avatarSm: { width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg,#7c3aed,#c8f035)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, fontFamily: 'Syne, sans-serif', flexShrink: 0 },
  main: { marginLeft: 240, flex: 1, display: 'flex', flexDirection: 'column', minHeight: '100vh' },
  topbar: { position: 'sticky', top: 0, background: 'rgba(10,10,15,0.85)', backdropFilter: 'blur(20px)', borderBottom: '1px solid rgba(255,255,255,0.07)', padding: '16px 32px', display: 'flex', alignItems: 'center', gap: 16, zIndex: 50 },
  searchWrap: { flex: 1, maxWidth: 480, position: 'relative' },
  searchIcon: { position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#6b6b80', fontSize: 15 },
  searchInput: { width: '100%', background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px 10px 40px', color: '#f0f0f5', fontSize: 14, outline: 'none' },
  content: { padding: 32, flex: 1 },
  breadcrumb: { display: 'flex', alignItems: 'center', gap: 8, marginBottom: 24, fontSize: 13, color: '#6b6b80' },
  sep: { color: 'rgba(255,255,255,0.15)' },
  bcCurrent: { color: '#f0f0f5', fontWeight: 500 },
  pageHeader: { display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 32 },
  pageTitle: { fontFamily: 'Syne, sans-serif', fontSize: 32, fontWeight: 800, letterSpacing: -1, lineHeight: 1 },
  pageSub: { fontSize: 14, color: '#6b6b80', marginTop: 6 },
  statsGrid: { display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 32 },
  statCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: 20, borderTop: '2px solid #7c3aed' },
  statLabel: { fontSize: 12, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 },
  statVal: { fontFamily: 'Syne, sans-serif', fontSize: 28, fontWeight: 800 },
  creatorGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(180px,1fr))', gap: 16 },
  creatorCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.25s' },
  addCard: { background: 'transparent', border: '2px dashed rgba(200,240,53,0.2)', borderRadius: 16, padding: '20px 16px', textAlign: 'center', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 190, gap: 8, color: 'rgba(200,240,53,0.5)' },
  backBtn: { display: 'inline-flex', alignItems: 'center', gap: 8, color: '#6b6b80', fontSize: 14, cursor: 'pointer', marginBottom: 24, background: 'none', border: 'none' },
  dateCard: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '16px 18px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', transition: 'all 0.2s' },
  linkItem: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 12, padding: '14px 18px', display: 'flex', alignItems: 'center', gap: 14 },
  linkIcon: { width: 36, height: 36, borderRadius: 10, background: 'linear-gradient(135deg,#7c3aed,#9f67fa)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 },
  openBtn: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '6px 12px', fontSize: 12, color: '#a0a0b8', cursor: 'pointer', whiteSpace: 'nowrap', textDecoration: 'none' },
  tableWrap: { background: '#13131c', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 16, overflow: 'hidden' },
  tableHead: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px', gap: 0, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 1, color: '#6b6b80' },
  tableRow: { display: 'grid', gridTemplateColumns: '2fr 1.5fr 1fr 1fr 100px', gap: 0, padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.07)', alignItems: 'center' },
  roleSelect: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 8, padding: '4px 8px', color: '#f0f0f5', fontSize: 12, outline: 'none', cursor: 'pointer' },
  iconBtn: { width: 30, height: 30, borderRadius: 8, border: '1px solid rgba(255,255,255,0.07)', background: '#111118', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13 },
  btnPrimary: { background: '#c8f035', color: '#0a0a0f', fontWeight: 700, fontSize: 13, padding: '9px 16px', borderRadius: 10, border: 'none', cursor: 'pointer' },
  overlay: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center' },
  modal: { background: '#111118', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 20, padding: 28, width: '100%', maxWidth: 460 },
  modalTitle: { fontFamily: 'Syne, sans-serif', fontSize: 22, fontWeight: 800, marginBottom: 20 },
  fGroup: { marginBottom: 16 },
  fLabel: { display: 'block', fontSize: 12, color: '#6b6b80', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 6 },
  fInput: { width: '100%', background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 10, padding: '10px 14px', color: '#f0f0f5', fontSize: 14, outline: 'none' },
  btnCancel: { background: '#1a1a24', border: '1px solid rgba(255,255,255,0.07)', color: '#6b6b80', fontSize: 13, padding: '9px 16px', borderRadius: 10, cursor: 'pointer' },
}
