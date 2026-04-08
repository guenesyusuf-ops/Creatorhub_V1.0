import { useState } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: any) {
    e.preventDefault()
    setLoading(true); setError('')
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error); setLoading(false); return }
      localStorage.setItem('token', data.token)
      localStorage.setItem('user', JSON.stringify(data.user))
      router.push(data.user.must_change_password ? '/change-password' : '/dashboard')
    } catch { setError('Verbindungsfehler'); setLoading(false) }
  }

  return (
    <>
      <Head>
        <title>Login – Filapen Creator Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500;1,600;1,700&family=DM+Sans:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'DM Sans',system-ui,sans-serif;background:#0d0f1a;color:#f0f2ff;min-height:100vh;}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
        @keyframes orb{0%,100%{transform:translate(0,0)}50%{transform:translate(30px,-20px)}}
        .inp{width:100%;background:rgba(255,255,255,.04);border:1px solid rgba(255,255,255,.1);border-radius:10px;padding:11px 14px;font-family:'DM Sans',sans-serif;font-size:13px;color:#f0f2ff;outline:none;transition:all .2s;}
        .inp:focus{border-color:rgba(129,140,248,.5);background:rgba(129,140,248,.05);box-shadow:0 0 0 3px rgba(129,140,248,.1);}
        .inp::placeholder{color:rgba(107,114,128,.7);}
      `}</style>

      <div style={{minHeight:'100vh',display:'flex',background:'#0d0f1a',position:'relative',overflow:'hidden'}}>
        {/* Ambient orbs */}
        <div style={{position:'absolute',top:'-150px',left:'30%',width:'500px',height:'500px',borderRadius:'50%',background:'radial-gradient(circle,rgba(129,140,248,.08),transparent 65%)',pointerEvents:'none',animation:'orb 12s ease-in-out infinite'}} />
        <div style={{position:'absolute',bottom:'-100px',right:'20%',width:'400px',height:'400px',borderRadius:'50%',background:'radial-gradient(circle,rgba(244,114,182,.06),transparent 65%)',pointerEvents:'none'}} />

        {/* Left Panel */}
        <div style={{width:'460px',minWidth:'460px',display:'flex',flexDirection:'column',padding:'52px 48px',position:'relative',zIndex:1,borderRight:'1px solid rgba(255,255,255,.06)'}}>
          {/* Logo */}
          <div style={{display:'flex',alignItems:'center',gap:11,marginBottom:64}}>
            <div style={{width:38,height:38,borderRadius:10,background:'linear-gradient(135deg,#818cf8,#a78bfa,#f472b6)',display:'flex',alignItems:'center',justifyContent:'center',fontFamily:"'Cormorant Garamond',serif",fontSize:21,fontWeight:600,fontStyle:'italic',color:'#fff',boxShadow:'0 0 20px rgba(129,140,248,.4)',flexShrink:0}}>f</div>
            <div>
              <div style={{fontFamily:"'Cormorant Garamond',serif",fontSize:19,fontWeight:600,fontStyle:'italic',color:'#f0f2ff',letterSpacing:'-.2px'}}>filapen</div>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'rgba(129,140,248,.6)',letterSpacing:'1.2px',textTransform:'uppercase'}}>Creator Hub</div>
            </div>
          </div>

          {/* Headline */}
          <div style={{flex:1}}>
            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:16}}>
              <div style={{width:5,height:5,borderRadius:'50%',background:'#a78bfa',animation:'pulse 1.5s infinite'}} />
              <span style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(167,139,250,.8)',textTransform:'uppercase',letterSpacing:'2px'}}>Admin Login</span>
            </div>
            <h1 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:600,fontStyle:'italic',color:'#f0f2ff',lineHeight:1.05,letterSpacing:'-1.5px',marginBottom:24}}>
              Willkommen<br />zurück.
            </h1>
            <div style={{width:2,height:48,background:'linear-gradient(180deg,#818cf8,#f472b6)',borderRadius:2,opacity:.6,marginBottom:24}} />
            <p style={{fontSize:13,color:'rgba(156,163,175,.8)',lineHeight:1.8,maxWidth:300}}>
              Manage deine Creator, verfolge Uploads und steuere deinen Content-Hub von einem Ort aus.
            </p>
          </div>

          <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'rgba(107,114,128,.5)',letterSpacing:'1px',textTransform:'uppercase'}}>
            Filapen GmbH · {new Date().getFullYear()}
          </div>
        </div>

        {/* Right Panel – Form */}
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:48,position:'relative',zIndex:1}}>
          <div style={{width:'100%',maxWidth:400}}>
            <h2 style={{fontFamily:"'Cormorant Garamond',serif",fontSize:32,fontWeight:600,fontStyle:'italic',color:'#f0f2ff',marginBottom:6,letterSpacing:'-.5px'}}>Anmelden</h2>
            <p style={{fontSize:13,color:'rgba(107,114,128,.8)',marginBottom:36}}>Gib deine Zugangsdaten ein.</p>

            <form onSubmit={handleLogin}>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,color:'rgba(107,114,128,.8)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:8}}>E-Mail</label>
                <input className="inp" type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="deine@email.com" required />
              </div>
              <div style={{marginBottom:28}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:8,fontWeight:700,color:'rgba(107,114,128,.8)',textTransform:'uppercase',letterSpacing:'2px',marginBottom:8}}>Passwort</label>
                <input className="inp" type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••••" required />
              </div>

              {error && (
                <div style={{background:'rgba(248,113,113,.1)',border:'1px solid rgba(248,113,113,.3)',borderRadius:10,padding:'10px 14px',fontSize:12,color:'#f87171',marginBottom:20}}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%',background:'linear-gradient(135deg,#818cf8,#a78bfa)',
                color:'#fff',fontWeight:600,fontSize:13,padding:'13px 0',
                borderRadius:10,border:'none',cursor:'pointer',
                fontFamily:"'DM Sans',sans-serif",
                boxShadow:'0 4px 20px rgba(129,140,248,.3)',
                opacity:loading ? .6 : 1,transition:'all .2s',
              }}>
                {loading ? 'Anmelden…' : 'Anmelden →'}
              </button>
            </form>

            <div style={{height:1,background:'rgba(255,255,255,.06)',margin:'28px 0'}} />

            <button onClick={()=>router.push('/creator')} style={{
              width:'100%',background:'rgba(255,255,255,.03)',
              border:'1px solid rgba(255,255,255,.08)',
              color:'rgba(156,163,175,.7)',fontWeight:500,fontSize:13,
              padding:'11px 0',borderRadius:10,cursor:'pointer',
              fontFamily:"'DM Sans',sans-serif",transition:'all .2s',
            }}>
              Creator-Portal →
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
