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
    if (err === 'invalid') setError('Ungültiger oder abgelaufener Code.')
    if (err === 'connection') setError('Verbindungsfehler. Bitte erneut versuchen.')
    const urlCode = router.query.code as string
    if (urlCode) { router.replace(`/creator-portal?code=${urlCode}`); return }
    const t = localStorage.getItem('creator_token')
    const c = localStorage.getItem('creator')
    if (t && c) router.replace('/creator-portal')
  }, [router.isReady])

  async function handleLogin(e: any) {
    e.preventDefault()
    if (!code.trim()) return
    setLoading(true)
    router.push(`/creator-portal?code=${code.trim().toUpperCase()}`)
  }

  if (!ready) return (
    <>
      <Head><title>Creator Portal – Filapen</title></Head>
      <div style={{minHeight:'100vh',background:'#0d0f1a',display:'flex',alignItems:'center',justifyContent:'center'}}>
        <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:12,color:'rgba(107,114,128,.6)'}}>Laden…</div>
      </div>
    </>
  )

  return (
    <>
      <Head>
        <title>Creator Portal – Filapen</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',system-ui,sans-serif;background:#0d0f1a;color:#f0f2ff;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(20px,-15px)}}
        .code-inp{
          width:100%;background:rgba(129,140,248,.05);
          border:1.5px solid rgba(129,140,248,.2);
          border-radius:14px;padding:20px 24px;
          font-family:'JetBrains Mono',monospace;
          font-size:32px;font-weight:700;letter-spacing:12px;
          text-align:center;text-transform:uppercase;
          outline:none;color:#f0f2ff;transition:all .2s;
        }
        .code-inp:focus{
          border-color:rgba(129,140,248,.6);
          background:rgba(129,140,248,.08);
          box-shadow:0 0 0 4px rgba(129,140,248,.1);
        }
        .code-inp::placeholder{color:rgba(107,114,128,.4);letter-spacing:8px;font-size:24px;}
      `}</style>

      <div style={{minHeight:'100vh',display:'flex',alignItems:'center',justifyContent:'center',background:'#0d0f1a',padding:24,position:'relative',overflow:'hidden'}}>
        {/* Orbs */}
        <div style={{position:'absolute',top:'-100px',left:'20%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,.08),transparent 65%)',pointerEvents:'none',animation:'orb 10s ease-in-out infinite'}} />
        <div style={{position:'absolute',bottom:'-80px',right:'15%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(167,139,250,.06),transparent 65%)',pointerEvents:'none'}} />

        <div style={{width:'100%',maxWidth:460,position:'relative',zIndex:1}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:48,justifyContent:'center'}}>
            <div style={{width:36,height:36,borderRadius:9,background:'linear-gradient(135deg,#818cf8,#a78bfa,#f472b6)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:20,fontWeight:600,fontStyle:'italic',color:'#fff',boxShadow:'0 0 20px rgba(129,140,248,.4)'}}>f</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,fontStyle:'italic',color:'#f0f2ff'}}>filapen</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'rgba(129,140,248,.6)',letterSpacing:'1.2px',textTransform:'uppercase'}}>Creator Hub</div>
            </div>
          </div>

          {/* Card */}
          <div style={{background:'rgba(19,22,38,.95)',border:'1px solid rgba(129,140,248,.15)',borderRadius:20,padding:'40px 44px',backdropFilter:'blur(20px)',boxShadow:'0 20px 60px rgba(0,0,0,.4)'}}>
            <div style={{textAlign:'center',marginBottom:36}}>
              <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(129,140,248,.1)',border:'1px solid rgba(129,140,248,.2)',borderRadius:20,padding:'4px 12px',marginBottom:16}}>
                <div style={{width:5,height:5,borderRadius:'50%',background:'#a78bfa',animation:'pulse 1.5s infinite'}} />
                <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(167,139,250,.8)',textTransform:'uppercase',letterSpacing:'2px'}}>Creator Portal</span>
              </div>
              <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,fontStyle:'italic',color:'#f0f2ff',letterSpacing:'-.5px',marginBottom:10}}>Dein Portal</h1>
              <p style={{fontSize:13,color:'rgba(107,114,128,.8)',lineHeight:1.7}}>Gib deinen Einladungscode ein<br/>oder nutze den Link aus deiner E-Mail.</p>
            </div>

            <form onSubmit={handleLogin}>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,color:'rgba(107,114,128,.7)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:12,textAlign:'center'}}>Einladungscode</label>
                <input
                  className="code-inp"
                  value={code}
                  onChange={e=>setCode(e.target.value.toUpperCase())}
                  placeholder="XXXXXXXX"
                  maxLength={8}
                  autoFocus
                  required
                />
              </div>

              {error && (
                <div style={{background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.25)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#f87171',marginBottom:20,textAlign:'center'}}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%',background:'linear-gradient(135deg,#818cf8,#a78bfa)',
                color:'#fff',fontWeight:600,fontSize:13,padding:'14px 0',
                borderRadius:10,border:'none',cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif",
                boxShadow:'0 4px 20px rgba(129,140,248,.3)',
                opacity:loading ? .6 : 1,transition:'all .2s',
              }}>
                {loading ? 'Weiterleiten…' : 'Einloggen →'}
              </button>
            </form>

            <div style={{height:1,background:'rgba(255,255,255,.06)',margin:'24px 0'}} />

            <button onClick={()=>router.push('/login')} style={{
              width:'100%',background:'transparent',
              border:'1px solid rgba(255,255,255,.08)',
              color:'rgba(156,163,175,.6)',fontWeight:500,fontSize:13,
              padding:'11px 0',borderRadius:10,cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif",transition:'all .2s',
              display:'flex',alignItems:'center',justifyContent:'center',gap:6,
            }}>
              🔐 Admin Login
            </button>
          </div>

          <div style={{textAlign:'center',marginTop:24,fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'rgba(107,114,128,.4)',letterSpacing:'1px',textTransform:'uppercase'}}>
            Filapen GmbH · Creator Hub
          </div>
        </div>
      </div>
    </>
  )
}
