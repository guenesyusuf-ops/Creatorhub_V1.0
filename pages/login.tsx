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
    setLoading(true)
    setError('')
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
      if (data.user.must_change_password) {
        router.push('/change-password')
      } else {
        router.push('/dashboard')
      }
    } catch {
      setError('Verbindungsfehler')
      setLoading(false)
    }
  }

  return (
    <>
      <Head>
        <title>Login – Filapen Creator Hub</title>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,700;0,9..144,900;1,9..144,700;1,9..144,900&family=JetBrains+Mono:wght@400;500;700&family=Instrument+Sans:wght@400;500;600&display=swap" rel="stylesheet" />
      </Head>
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0;}
        body{font-family:'Instrument Sans',system-ui,sans-serif;background:#f8f7f4;color:#0f0e0c;min-height:100vh;}
        .inp:focus{border-color:#0f0e0c!important;outline:none;box-shadow:0 0 0 3px rgba(15,14,12,.08);}
      `}</style>
      <div style={{
        minHeight:'100vh',display:'flex',
        background:'#f8f7f4',
      }}>
        {/* Left Panel */}
        <div style={{
          width:'420px',minWidth:'420px',
          background:'#0f0e0c',
          display:'flex',flexDirection:'column',
          padding:'48px 44px',
          position:'relative',overflow:'hidden',
        }}>
          {/* Gold glow */}
          <div style={{position:'absolute',top:'-80px',right:'-80px',width:'300px',height:'300px',borderRadius:'50%',background:'radial-gradient(circle,rgba(200,147,58,.2),transparent 70%)',pointerEvents:'none'}} />
          
          <div style={{position:'relative',zIndex:1,flex:1,display:'flex',flexDirection:'column'}}>
            {/* Logo */}
            <div style={{display:'flex',alignItems:'center',gap:10,marginBottom:60}}>
              <div style={{
                width:38,height:38,borderRadius:9,
                border:'1.5px solid #c8933a',
                display:'flex',alignItems:'center',justifyContent:'center',
                fontFamily:"'Fraunces',serif",fontSize:19,fontWeight:900,color:'#c8933a',
              }}>F</div>
              <div>
                <div style={{fontFamily:"'Fraunces',serif",fontSize:16,fontWeight:700,color:'#f0ede8',letterSpacing:'-.3px'}}>filapen</div>
                <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:8,color:'rgba(200,147,58,.6)',letterSpacing:'1px',textTransform:'uppercase'}}>Creator Hub</div>
              </div>
            </div>

            {/* Headline */}
            <div style={{flex:1}}>
              <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(200,147,58,.7)',letterSpacing:'2px',textTransform:'uppercase',marginBottom:12}}>Admin Login</div>
              <h1 style={{fontFamily:"'Fraunces',serif",fontSize:42,fontWeight:900,fontStyle:'italic',color:'#fff',lineHeight:1.05,letterSpacing:'-1px',marginBottom:20}}>
                Willkommen zurück
              </h1>
              <div style={{width:2,height:40,background:'#c8933a',borderRadius:2,opacity:.6,marginBottom:20}} />
              <p style={{fontStyle:'italic',fontSize:13,color:'rgba(255,255,255,.35)',lineHeight:1.7,maxWidth:280}}>
                Manage deine Creator, verfolge Uploads und steuere deinen Content-Hub.
              </p>
            </div>

            {/* Bottom */}
            <div style={{fontFamily:"'JetBrains Mono',monospace",fontSize:9,color:'rgba(255,255,255,.2)',letterSpacing:'1px'}}>
              FILAPEN GMBH · {new Date().getFullYear()}
            </div>
          </div>
        </div>

        {/* Right Panel - Form */}
        <div style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',padding:40}}>
          <div style={{width:'100%',maxWidth:400}}>
            <h2 style={{fontFamily:"'Fraunces',serif",fontSize:26,fontWeight:700,fontStyle:'italic',color:'#0f0e0c',marginBottom:6,letterSpacing:'-.4px'}}>Anmelden</h2>
            <p style={{fontSize:13,color:'#9a9890',marginBottom:32}}>Gib deine Zugangsdaten ein um fortzufahren.</p>

            <form onSubmit={handleLogin}>
              <div style={{marginBottom:16}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:'#9a9890',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:7}}>E-Mail</label>
                <input
                  className="inp"
                  type="email" value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="deine@email.com" required
                  style={{width:'100%',border:'1.5px solid #e4e3df',borderRadius:9,padding:'11px 14px',fontFamily:"'Instrument Sans',sans-serif",fontSize:13,color:'#0f0e0c',background:'#fff',transition:'border-color .15s'}}
                />
              </div>
              <div style={{marginBottom:24}}>
                <label style={{display:'block',fontFamily:"'JetBrains Mono',monospace",fontSize:9,fontWeight:700,color:'#9a9890',textTransform:'uppercase',letterSpacing:'1.5px',marginBottom:7}}>Passwort</label>
                <input
                  className="inp"
                  type="password" value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••" required
                  style={{width:'100%',border:'1.5px solid #e4e3df',borderRadius:9,padding:'11px 14px',fontFamily:"'Instrument Sans',sans-serif",fontSize:13,color:'#0f0e0c',background:'#fff',transition:'border-color .15s'}}
                />
              </div>

              {error && (
                <div style={{background:'#fef2f2',border:'1.5px solid #fecaca',borderRadius:9,padding:'10px 14px',fontSize:12,color:'#c0392b',marginBottom:20,fontWeight:500}}>{error}</div>
              )}

              <button type="submit" disabled={loading} style={{
                width:'100%',background:'#0f0e0c',color:'#fff',
                fontWeight:600,fontSize:13,padding:'13px 0',
                borderRadius:9,border:'none',cursor:'pointer',
                fontFamily:"'Instrument Sans',sans-serif",
                transition:'opacity .15s',opacity:loading ? .6 : 1,
              }}>
                {loading ? 'Anmelden…' : 'Anmelden →'}
              </button>
            </form>

            <div style={{textAlign:'center',marginTop:24}}>
              <div style={{height:1,background:'#e4e3df',marginBottom:20}} />
              <button onClick={() => router.push('/creator')} style={{
                background:'transparent',border:'1.5px solid #e4e3df',
                color:'#9a9890',fontWeight:500,fontSize:13,
                padding:'11px 0',borderRadius:9,cursor:'pointer',
                fontFamily:"'Instrument Sans',sans-serif",width:'100%',
                transition:'all .15s',
              }}>
                Creator-Portal →
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
