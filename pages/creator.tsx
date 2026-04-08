import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function CreatorLoginPage() {
  const router = useRouter()
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!router.isReady) return
    setReady(true)
    const err = router.query.error as string
    if (err === 'invalid') setError('Ungültiger oder abgelaufener Link.')
    if (err === 'connection') setError('Verbindungsfehler. Bitte erneut versuchen.')
    const urlCode = router.query.code as string
    if (urlCode) { router.replace(`/creator-portal?code=${urlCode}`); return }
    const existingToken = localStorage.getItem('creator_token')
    const existingCreator = localStorage.getItem('creator')
    if (existingToken && existingCreator) router.replace('/creator-portal')
  }, [router.isReady])

  async function handleLogin(e: any) {
    e.preventDefault()
    if (!code.trim()) return
    router.push(`/creator-portal?code=${code.trim().toUpperCase()}`)
  }

  if (!ready) return (
    <>
      <Head><title>Creator Portal – Filapen</title></Head>
      <div style={{minHeight:'100vh',background:'#f8f7f4',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'#9a9890'}}>Laden…</div>
      </div>
    </>
  )

  return (
    <>
      <Head>
        <title>Creator Portal – Filapen</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Instrument Sans',system-ui,sans-serif;background:#f8f7f4;color:#0f0e0c;}
        .code-inp{width:100%;background:#fff;border:2px solid #e4e3df;border-radius:12px;padding:18px 20px;font-family:'JetBrains Mono',monospace;font-size:28px;font-weight:700;letter-spacing:8px;text-align:center;text-transform:uppercase;outline:none;color:#0f0e0c;transition:border-color .15s;}
        .code-inp:focus{border-color:#0f0e0c;box-shadow:0 0 0 3px rgba(15,14,12,.08);}
        .code-inp::placeholder{color:#c4c3be;letter-spacing:4px;font-size:20px;}
      `}</style>
      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#f8f7f4',padding:24}}>
        <div style={{width:'100%',maxWidth:480}}>

          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:48,justifyContent:'center'}}>
            <div style={{width:36,height:36,borderRadius:9,background:'#0f0e0c',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Fraunces',serif",fontSize:18,fontWeight:900,color:'#c8933a'}}>F</div>
            <div>
              <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'#0f0e0c',letterSpacing:'-.3px'}}>filapen</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'#9a9890',letterSpacing:'1px',textTransform:'uppercase'}}>Creator Hub</div>
            </div>
          </div>

          {/* Card */}
          <div style={{background:'#fff',border:'1.5px solid #e4e3df',borderRadius:20,padding:'40px 44px',boxShadow:'0 4px 32px rgba(0,0,0,.05)'}}>
            <div style={{textAlign:'center',marginBottom:32}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#c8933a',letterSpacing:'2px',textTransform:'uppercase',marginBottom:10}}>Creator Portal</div>
              <h1 style={{fontFamily:"'Fraunces',serif",fontSize:30,fontWeight:900,fontStyle:'italic',color:'#0f0e0c',letterSpacing:'-.6px',marginBottom:10}}>Dein Portal</h1>
              <p style={{fontSize:13,color:'#9a9890',lineHeight:1.6}}>Gib deinen Einladungscode ein oder nutze den Link aus deiner E-Mail.</p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{marginBottom:20}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:'#9a9890',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:10,textAlign:'center'}}>Einladungscode</label>
                <input
                  className="code-inp"
                  value={code}
                  onChange={e => setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div style={{background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:9,padding:'10px 14px',fontSize:12,color:'#c0392b',marginBottom:16,textAlign:'center',fontWeight:500}}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%',background:'#0f0e0c',color:'#fff',
                fontWeight:600,fontSize:13,padding:'14px 0',
                borderRadius:10,border:'none',cursor:'pointer',
                fontFamily:"'Instrument Sans',sans-serif",
                transition:'opacity .15s',marginTop:4,
              }}>
                {loading ? 'Weiterleiten…' : 'Einloggen →'}
              </button>
            </form>

            <div style={{height:1,background:'#e4e3df',margin:'24px 0'}} />

            <button onClick={() => router.push('/login')} style={{
              width:'100%',background:'transparent',
              border:'1.5px solid #e4e3df',color:'#9a9890',
              fontWeight:500,fontSize:13,padding:'11px 0',
              borderRadius:10,cursor:'pointer',
              fontFamily:"'Instrument Sans',sans-serif",
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            }}>
              🔐 Admin Login
            </button>
          </div>

          <div style={{textAlign:'center',marginTop:24,fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'#c4c3be',letterSpacing:'1px'}}>
            FILAPEN GMBH · CREATOR HUB
          </div>
        </div>
      </div>
    </>
  )
}
