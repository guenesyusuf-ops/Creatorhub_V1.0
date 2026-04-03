import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{
  --bdr:#e8e8f0;--bg:#f0f0f8;--surf:#ffffff;--lt:#f5f5fc;--act:#ededf8;--muted:#8888aa;
  --blue:#4f6ef7;--blue2:#6c63ff;--grn:#16a34a;--red:#dc2626;--org:#ea580c;
  --hero1:#4f6ef7;--hero2:#6c63ff;--shadow:0 2px 12px rgba(79,110,247,.08);--shadow-md:0 4px 24px rgba(79,110,247,.13);
}
html{height:100%;overflow:hidden;}
body{font-family:'Plus Jakarta Sans',system-ui,sans-serif;font-size:13px;background:var(--bg);color:#1a1a2e;display:flex;width:100vw;height:100vh;overflow:hidden;margin:0;padding:0;}
body.dark{--bdr:#2a2a3a;--bg:#0f0f1a;--surf:#1a1a2e;--lt:#22223a;--act:#2a2a40;--muted:#7070a0;color:#e8e8ff;}

/* ── SIDEBAR ── */
.sb{width:240px;min-width:240px;background:var(--surf);border-right:1px solid var(--bdr);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100vh;z-index:100;overflow-y:auto;box-shadow:2px 0 20px rgba(79,110,247,.06);}
.logo{padding:20px 18px 16px;display:flex;align-items:center;gap:10px;cursor:pointer;border-bottom:1px solid var(--bdr);}
.logo-mark{width:36px;height:36px;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:800;color:#fff;flex-shrink:0;box-shadow:0 4px 12px rgba(79,110,247,.35);}
.logo-text{display:flex;flex-direction:column;}
.logo-name{font-size:15px;font-weight:800;color:#1a1a2e;letter-spacing:-.3px;}
body.dark .logo-name{color:#e8e8ff;}
.logo-sub{font-size:10px;color:var(--muted);font-weight:500;letter-spacing:.3px;text-transform:uppercase;}
.nav-s{padding:14px 10px 4px;}
.nav-l{font-size:9px;font-weight:700;color:#bbbbd0;text-transform:uppercase;letter-spacing:1.2px;padding:0 8px;margin-bottom:4px;}
.ni{display:flex;align-items:center;gap:9px;padding:9px 10px;border-radius:10px;cursor:pointer;font-size:12.5px;font-weight:500;color:var(--muted);margin-bottom:2px;user-select:none;transition:all .18s;}
.ni:hover{background:var(--lt);color:#1a1a2e;}
body.dark .ni:hover{color:#e8e8ff;}
.ni.on{background:linear-gradient(135deg,rgba(79,110,247,.12),rgba(108,99,255,.08));color:var(--blue);font-weight:600;}
.ni-ico{width:32px;height:32px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:14px;flex-shrink:0;background:transparent;transition:all .18s;}
.ni.on .ni-ico{background:linear-gradient(135deg,var(--blue),var(--blue2));box-shadow:0 3px 10px rgba(79,110,247,.35);color:#fff;}
.ni-bdg{margin-left:auto;background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;font-size:9px;border-radius:20px;padding:2px 7px;font-weight:700;}
.sb-foot{margin-top:auto;border-top:1px solid var(--bdr);padding:12px 10px;}
.user-r{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;cursor:pointer;transition:background .15s;}
.user-r:hover{background:var(--lt);}
.av{width:34px;height:34px;border-radius:10px;background:linear-gradient(135deg,var(--blue),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;box-shadow:0 3px 10px rgba(79,110,247,.3);overflow:hidden;}
.av img{width:100%;height:100%;object-fit:cover;}
.user-info{flex:1;min-width:0;}
.user-name{font-size:12px;font-weight:600;color:#1a1a2e;}
body.dark .user-name{color:#e8e8ff;}
.user-role{font-size:10px;color:var(--muted);}
.logout-btn-sb{margin-top:6px;width:100%;background:transparent;border:1.5px solid var(--bdr);border-radius:10px;padding:8px 0;font-size:11.5px;color:var(--muted);cursor:pointer;font-family:inherit;font-weight:500;transition:all .15s;display:flex;align-items:center;justify-content:center;gap:6px;}
.logout-btn-sb:hover{border-color:var(--red);color:var(--red);background:#fff5f5;}

/* ── LAYOUT ── */
.app-body{display:flex;flex:1;margin-left:240px;height:100vh;overflow:hidden;}
.main{flex:1;display:flex;flex-direction:column;min-width:0;overflow:hidden;}
.right-sb{width:300px;min-width:300px;background:var(--surf);border-left:1px solid var(--bdr);overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:16px;box-shadow:-2px 0 20px rgba(79,110,247,.04);}

/* ── TOPBAR ── */
.topbar{background:var(--surf);border-bottom:1px solid var(--bdr);height:58px;padding:0 20px;display:flex;align-items:center;gap:10px;flex-shrink:0;position:sticky;top:0;z-index:50;}
.tb-t{font-size:16px;font-weight:700;color:#1a1a2e;letter-spacing:-.3px;}
body.dark .tb-t{color:#e8e8ff;}
.sw{flex:1;max-width:340px;position:relative;margin-left:10px;}
.sw input{width:100%;background:var(--lt);border:1.5px solid var(--bdr);border-radius:12px;padding:9px 12px 9px 36px;font-size:12px;color:#1a1a2e;outline:none;font-family:inherit;font-weight:500;transition:border-color .15s;}
body.dark .sw input{color:#e8e8ff;}
.sw input:focus{border-color:var(--blue);background:#fff;box-shadow:0 0 0 3px rgba(79,110,247,.1);}
.s-ico{position:absolute;left:11px;top:50%;transform:translateY(-50%);color:#bbbbd0;font-size:13px;}
.tb-r{margin-left:auto;display:flex;gap:8px;align-items:center;position:relative;}

/* ── BUTTONS ── */
.btn{display:inline-flex;align-items:center;gap:5px;padding:7px 14px;border-radius:10px;font-size:12px;font-weight:600;cursor:pointer;border:1.5px solid var(--bdr);background:var(--surf);color:#1a1a2e;font-family:inherit;white-space:nowrap;transition:all .15s;}
body.dark .btn{color:#e8e8ff;}
.btn:hover{background:var(--lt);border-color:#cccce0;}
.btn-p{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;border-color:transparent;box-shadow:0 3px 12px rgba(79,110,247,.35);}
.btn-p:hover{opacity:.9;box-shadow:0 5px 18px rgba(79,110,247,.45);}
.btn-sm{padding:5px 10px;font-size:11px;border-radius:8px;}
.btn-red{background:var(--red);color:#fff;border-color:transparent;}
.btn-grn{background:var(--grn);color:#fff;border-color:transparent;}

/* ── CONTENT ── */
.content{padding:20px;flex:1;overflow-y:auto;overflow-x:hidden;min-width:0;}
.pg{display:none;}
.pg.on{display:block;}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;}
.ph-t{font-size:20px;font-weight:800;color:#1a1a2e;letter-spacing:-.4px;}
body.dark .ph-t{color:#e8e8ff;}

/* ── HERO CARD ── */
.hero-card{background:linear-gradient(135deg,var(--hero1) 0%,var(--hero2) 100%);border-radius:20px;padding:28px 32px;margin-bottom:22px;position:relative;overflow:hidden;box-shadow:0 8px 32px rgba(79,110,247,.35);}
.hero-card::before{content:'';position:absolute;top:-40px;right:-40px;width:200px;height:200px;border-radius:50%;background:rgba(255,255,255,.07);}
.hero-card::after{content:'';position:absolute;bottom:-60px;right:80px;width:150px;height:150px;border-radius:50%;background:rgba(255,255,255,.05);}
.hero-greeting{font-size:24px;font-weight:800;color:#fff;margin-bottom:6px;letter-spacing:-.5px;}
.hero-quote{font-size:12.5px;color:rgba(255,255,255,.8);max-width:380px;line-height:1.6;font-weight:400;}
.hero-sub{font-size:11px;color:rgba(255,255,255,.6);margin-top:14px;font-weight:500;}
.hero-ill{position:absolute;right:32px;bottom:0;font-size:72px;opacity:.15;user-select:none;}

/* ── STATS ── */
.stat-row{display:grid;gap:10px;margin-bottom:20px;}
.sc{background:var(--surf);border:1.5px solid var(--bdr);border-radius:14px;padding:14px 16px;cursor:pointer;transition:all .18s;box-shadow:var(--shadow);}
.sc:hover{border-color:var(--blue);box-shadow:var(--shadow-md);transform:translateY(-1px);}
.sl{font-size:10px;color:var(--muted);font-weight:600;text-transform:uppercase;letter-spacing:.6px;margin-bottom:4px;}
.sv{font-size:26px;font-weight:800;color:#1a1a2e;letter-spacing:-.5px;}
body.dark .sv{color:#e8e8ff;}
.sc-icon{width:38px;height:38px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:18px;margin-bottom:10px;}

/* ── ANALYTICS TABLE ── */
.analytics-card{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);margin-bottom:20px;}
.analytics-hdr{padding:16px 20px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.analytics-title{font-size:14px;font-weight:700;color:#1a1a2e;}
body.dark .analytics-title{color:#e8e8ff;}
.an-th{display:grid;padding:10px 20px;background:var(--lt);font-size:10px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.7px;}
.an-tr{display:grid;padding:12px 20px;border-bottom:1px solid var(--bdr);align-items:center;cursor:pointer;transition:background .12s;}
.an-tr:last-child{border-bottom:none;}
.an-tr:hover{background:var(--lt);}
.status-dot{display:inline-flex;align-items:center;gap:5px;font-size:11px;font-weight:600;}
.status-on{color:#16a34a;}
.status-off{color:#9999bb;}
.status-dot .dot{width:7px;height:7px;border-radius:50%;}
.dot-on{background:#16a34a;}
.dot-off{background:#cccce0;}

/* ── CREATOR LIST ── */
.cl{display:flex;flex-direction:column;gap:2px;}
.cr{display:flex;align-items:center;gap:12px;padding:12px 14px;background:var(--surf);border:1.5px solid var(--bdr);border-radius:12px;transition:all .15s;margin-bottom:4px;}
.cr:hover{border-color:var(--blue);box-shadow:var(--shadow);background:var(--lt);}
.cr-av{width:44px;height:44px;border-radius:12px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:15px;font-weight:700;color:#fff;overflow:hidden;}
.cr-av img{width:100%;height:100%;object-fit:cover;}

/* ── TAGS & BADGES ── */
.tag{padding:2px 8px;border-radius:20px;background:rgba(79,110,247,.1);color:var(--blue);font-size:10px;border:1px solid rgba(79,110,247,.2);font-weight:600;}
body.dark .tag{background:rgba(79,110,247,.2);border-color:rgba(79,110,247,.3);}
.kb{padding:2px 7px;border-radius:20px;font-size:10px;background:var(--lt);border:1px solid var(--bdr);font-weight:500;}
.social-badge{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;background:#fdf2f8;color:#9d174d;border:1px solid #fbcfe8;text-decoration:none;font-weight:500;}
.social-badge:hover{opacity:.8;}
.badge-prov{padding:2px 8px;border-radius:20px;font-size:10px;background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;font-weight:600;}
.badge-fix{padding:2px 8px;border-radius:20px;font-size:10px;background:#fffbeb;color:#92400e;border:1px solid #fde68a;font-weight:600;}
.badge-both{padding:2px 8px;border-radius:20px;font-size:10px;background:#faf5ff;color:#7c3aed;border:1px solid #e9d5ff;font-weight:600;}
.deadline-ok{color:var(--grn);font-size:10px;font-weight:600;}
.deadline-warn{color:var(--org);font-size:10px;font-weight:700;}
.deadline-late{color:var(--red);font-size:10px;font-weight:700;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.4;}}

/* ── CREATOR DETAIL ── */
.cdh{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;padding:16px 18px;margin-bottom:0;display:flex;align-items:center;gap:14px;position:sticky;top:58px;z-index:40;box-shadow:var(--shadow);}
.cd-av{width:56px;height:56px;border-radius:14px;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:20px;font-weight:700;color:#fff;overflow:hidden;}
.cd-av img{width:100%;height:100%;object-fit:cover;}
.tabs{display:flex;border-bottom:1.5px solid var(--bdr);margin-bottom:16px;overflow-x:auto;gap:2px;position:sticky;top:calc(58px + 90px);z-index:39;background:var(--surf);padding-top:8px;}
.tab{padding:9px 14px;font-size:12px;font-weight:600;color:var(--muted);cursor:pointer;border-bottom:2.5px solid transparent;margin-bottom:-1.5px;white-space:nowrap;flex-shrink:0;border-radius:8px 8px 0 0;transition:all .15s;}
.tab:hover{color:var(--blue);background:rgba(79,110,247,.05);}
.tab.on{color:var(--blue);border-bottom-color:var(--blue);background:rgba(79,110,247,.06);}
.fg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(152px,1fr));gap:10px;}
.fcard{background:var(--surf);border:1.5px solid var(--bdr);border-radius:14px;padding:14px;position:relative;cursor:pointer;transition:all .18s;box-shadow:var(--shadow);}
.fcard:hover{border-color:var(--blue);box-shadow:var(--shadow-md);transform:translateY(-2px);}
.fcard.deadline-red{border-color:var(--red)!important;background:#fff8f8;}
.add-fcard{background:var(--surf);border:2px dashed var(--bdr);border-radius:14px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:5px;cursor:pointer;color:var(--muted);transition:all .15s;}
.add-fcard:hover{border-color:var(--blue);color:var(--blue);background:rgba(79,110,247,.04);}
.file-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(132px,1fr));gap:10px;}
.ficard{background:var(--surf);border:1.5px solid var(--bdr);border-radius:12px;overflow:hidden;transition:all .15s;box-shadow:var(--shadow);}
.ficard:hover{border-color:var(--blue);box-shadow:var(--shadow-md);}
.ficard.selected{border-color:var(--blue);box-shadow:0 0 0 3px rgba(79,110,247,.2);}
.fi-thumb{height:90px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;overflow:hidden;position:relative;}
.fi-thumb img,.fi-thumb video{width:100%;height:100%;object-fit:cover;}
.play-ov{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;}
.fi-thumb:hover .play-ov{opacity:1;}
.play-btn{width:28px;height:28px;border-radius:50%;background:rgba(255,255,255,.92);display:flex;align-items:center;justify-content:center;font-size:10px;}
.fi-sel-cb{position:absolute;top:6px;left:6px;width:18px;height:18px;border-radius:5px;border:2px solid #fff;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;cursor:pointer;}
.ficard.selected .fi-sel-cb{background:var(--blue);border-color:var(--blue);}
.fi-info{padding:8px 10px;}
.fi-name{font-size:10.5px;font-weight:600;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;color:#1a1a2e;}
body.dark .fi-name{color:#e8e8ff;}
.fi-meta{font-size:9px;color:var(--muted);margin-bottom:5px;}
.fi-acts{display:flex;gap:3px;}
.fi-btn{flex:1;padding:3px 0;border-radius:6px;border:1.5px solid var(--bdr);font-size:10px;cursor:pointer;text-align:center;text-decoration:none;display:inline-block;color:#1a1a2e;background:transparent;font-family:inherit;font-weight:500;transition:all .12s;}
body.dark .fi-btn{color:#e8e8ff;}
.fi-btn:hover{background:var(--lt);border-color:#bbbbd0;}
.fi-btn.del{color:var(--red);border-color:#fecaca;}
.fi-done{color:var(--grn)!important;border-color:#86efac!important;background:#f0fdf4!important;font-weight:700;}
.fi-undone{color:#cccce0!important;border-color:#e8e8f0!important;}
.fi-comment-badge{position:absolute;bottom:5px;right:5px;background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;border-radius:20px;font-size:9px;padding:2px 6px;font-weight:700;box-shadow:0 2px 6px rgba(79,110,247,.4);}

/* ── PRODUCTS/PROJECTS ── */
.pg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(168px,1fr));gap:12px;}
.pcard{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;overflow:hidden;position:relative;transition:all .18s;box-shadow:var(--shadow);}
.pcard:hover{border-color:var(--blue);box-shadow:var(--shadow-md);transform:translateY(-2px);}
.p-img{height:110px;background:linear-gradient(135deg,var(--lt),#e8e8ff);display:flex;align-items:center;justify-content:center;font-size:36px;overflow:hidden;}
.p-img img{width:100%;height:100%;object-fit:cover;}
.pj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(235px,1fr));gap:12px;}
.pjcard{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;padding:16px;cursor:pointer;position:relative;transition:all .18s;box-shadow:var(--shadow);}
.pjcard:hover{border-color:var(--blue);box-shadow:var(--shadow-md);transform:translateY(-2px);}
.pill{display:inline-flex;align-items:center;gap:4px;padding:3px 9px;border-radius:20px;font-size:10px;font-weight:700;margin-bottom:8px;}
.s-a{background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;}
.s-p{background:#eff2ff;color:var(--blue);border:1px solid #d0d8ff;}
.prog-w{height:4px;background:var(--lt);border-radius:4px;margin-top:6px;overflow:hidden;}
.prog-b{height:4px;background:linear-gradient(90deg,var(--blue),var(--blue2));border-radius:4px;}
.pj-dhdr{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;padding:14px 18px;margin-bottom:16px;position:sticky;top:58px;z-index:40;box-shadow:var(--shadow);}

/* ── MISC ── */
.c-chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px 4px 4px;border-radius:24px;border:1.5px solid var(--bdr);background:var(--lt);cursor:pointer;margin:2px;font-size:11px;font-weight:600;}
.c-chip:hover{border-color:var(--blue);}
.chip-av{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;color:#fff;flex-shrink:0;overflow:hidden;}
.dot-btn{width:26px;height:26px;border-radius:8px;border:none;background:transparent;font-size:15px;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;padding:0;font-family:inherit;transition:background .12s;}
.dot-btn:hover{background:var(--lt);}
.drop-menu{position:fixed;background:var(--surf);border:1.5px solid var(--bdr);border-radius:12px;padding:4px;min-width:148px;z-index:2000;box-shadow:0 8px 32px rgba(0,0,0,.12);display:none;}
.drop-menu.open{display:block;}
.dm-i{display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:8px;cursor:pointer;font-size:12px;color:#1a1a2e;font-family:inherit;border:none;background:transparent;width:100%;text-align:left;font-weight:500;transition:background .1s;}
body.dark .dm-i{color:#e8e8ff;}
.dm-i:hover{background:var(--lt);}
.dm-i.red{color:var(--red)!important;}
.th{display:grid;padding:8px 14px;border-bottom:1px solid var(--bdr);font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;letter-spacing:.9px;background:var(--lt);}
.tr{display:grid;padding:10px 14px;border-bottom:1px solid var(--bdr);align-items:center;transition:background .1s;}
.tr:last-child{border-bottom:none;}
.tr:hover{background:var(--lt);}

/* ── LIGHTBOX ── */
.lb{position:fixed;inset:0;background:rgba(10,10,30,.96);z-index:800;display:none;flex-direction:column;align-items:center;justify-content:center;}
.lb.open{display:flex;}
.lb-x{position:absolute;top:16px;right:16px;color:#fff;font-size:18px;cursor:pointer;width:36px;height:36px;border-radius:10px;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;transition:background .15s;}
.lb-x:hover{background:rgba(255,255,255,.2);}
.lb img,.lb video{max-width:80vw;max-height:62vh;border-radius:12px;}
.lb-btn{padding:8px 16px;border-radius:10px;border:1.5px solid rgba(255,255,255,.2);background:rgba(255,255,255,.08);color:#fff;cursor:pointer;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;font-family:inherit;font-weight:500;transition:all .15s;}
.lb-btn:hover{background:rgba(255,255,255,.15);}
.lb-comment-box{background:rgba(255,255,255,.06);backdrop-filter:blur(12px);border:1px solid rgba(255,255,255,.1);border-radius:14px;padding:14px;width:min(420px,88vw);margin-top:12px;}
.lb-comment-input{width:100%;background:rgba(255,255,255,.08);border:1px solid rgba(255,255,255,.15);border-radius:9px;padding:8px 11px;color:#fff;font-size:12px;outline:none;font-family:inherit;resize:none;}
.lb-comment-item{border-radius:8px;padding:8px 10px;margin-bottom:6px;font-size:11px;}

/* ── MODAL ── */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);z-index:600;display:none;align-items:center;justify-content:center;}
.modal-bg.open{display:flex;}
.modal{background:var(--surf);border-radius:18px;padding:22px;width:480px;max-width:94vw;max-height:88vh;overflow-y:auto;border:1.5px solid var(--bdr);box-shadow:0 20px 60px rgba(0,0,0,.15);color:#1a1a2e;}
body.dark .modal{color:#e8e8ff;}
.modal-t{font-size:16px;font-weight:800;margin-bottom:16px;color:#1a1a2e;letter-spacing:-.3px;}
body.dark .modal-t{color:#e8e8ff;}
.fg{margin-bottom:10px;}
.fl{display:block;font-size:9.5px;font-weight:700;color:var(--muted);margin-bottom:4px;text-transform:uppercase;letter-spacing:.5px;}
.fi{width:100%;border:1.5px solid var(--bdr);border-radius:10px;padding:8px 11px;font-family:inherit;font-size:12px;color:#1a1a2e;outline:none;background:var(--surf);transition:border-color .15s;font-weight:500;}
body.dark .fi{color:#e8e8ff;}
.fi:focus{border-color:var(--blue);box-shadow:0 0 0 3px rgba(79,110,247,.1);}
.modal-acts{display:flex;gap:8px;justify-content:flex-end;margin-top:16px;}
.dz{border:2px dashed var(--bdr);border-radius:12px;padding:16px;text-align:center;cursor:pointer;background:var(--lt);transition:all .15s;}
.dz:hover{border-color:var(--blue);background:rgba(79,110,247,.04);}
.dz.done{border-color:var(--grn);background:#f0fdf4;}
.prog-track{height:5px;background:var(--lt);border-radius:5px;margin-top:5px;overflow:hidden;}
.prog-fill{height:5px;background:linear-gradient(90deg,var(--blue),var(--blue2));border-radius:5px;width:0;transition:width .12s;}
.tgl{width:34px;height:18px;border-radius:9px;background:var(--bdr);position:relative;cursor:pointer;flex-shrink:0;display:inline-block;transition:background .18s;}
.tgl.on{background:linear-gradient(135deg,var(--blue),var(--blue2));}
.tgl-d{width:14px;height:14px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .18s;box-shadow:0 1px 4px rgba(0,0,0,.2);}
.tgl.on .tgl-d{transform:translateX(16px);}
.c-sel-i{display:flex;align-items:center;gap:9px;padding:8px 11px;border-radius:10px;border:1.5px solid var(--bdr);cursor:pointer;margin-bottom:4px;transition:all .12s;}
.c-sel-i:hover{background:var(--lt);}
.c-sel-i.sel{border-color:var(--blue);background:rgba(79,110,247,.06);}
.chk{margin-left:auto;width:16px;height:16px;border-radius:50%;border:2px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:8px;flex-shrink:0;transition:all .12s;}
.c-sel-i.sel .chk{background:var(--blue);border-color:var(--blue);color:#fff;}
.bk{display:inline-flex;align-items:center;gap:5px;color:var(--muted);font-size:12px;cursor:pointer;margin-bottom:12px;background:none;border:none;padding:0;font-family:inherit;font-weight:600;transition:color .12s;}
.bk:hover{color:var(--blue);}
.empty{text-align:center;padding:36px 16px;color:var(--muted);}
.toast{position:fixed;bottom:20px;left:50%;transform:translateX(-50%) translateY(8px);background:linear-gradient(135deg,#1a1a2e,#2a2a4a);color:#fff;border-radius:12px;padding:10px 18px;font-size:12.5px;font-weight:600;opacity:0;transition:all .22s;z-index:900;pointer-events:none;box-shadow:0 4px 20px rgba(0,0,0,.25);}
.toast.show{opacity:1;transform:translateX(-50%) translateY(0);}
.fp{position:absolute;top:calc(100% + 6px);right:0;background:var(--surf);border:1.5px solid var(--bdr);border-radius:14px;padding:14px;width:270px;z-index:200;box-shadow:0 8px 32px rgba(0,0,0,.1);display:none;}
.fp.open{display:block;}
.fp-chip{padding:3px 9px;border-radius:20px;border:1.5px solid var(--bdr);background:var(--surf);font-size:10px;cursor:pointer;margin:2px;display:inline-flex;color:var(--muted);font-weight:600;transition:all .12s;}
.fp-chip:hover{border-color:#bbbbd0;}
.fp-chip.sel{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;border-color:transparent;}
.af-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;background:rgba(79,110,247,.1);color:var(--blue);font-size:10px;border:1px solid rgba(79,110,247,.2);margin:2px;font-weight:600;}
.up-menu{position:fixed;background:var(--surf);border:1.5px solid var(--bdr);border-radius:14px;padding:14px;width:210px;z-index:1500;box-shadow:0 8px 32px rgba(0,0,0,.12);display:none;}
.up-menu.open{display:block;}
.bulk-bar{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;border-radius:12px;padding:10px 16px;display:none;align-items:center;gap:12px;margin-bottom:14px;font-size:12px;box-shadow:0 4px 16px rgba(79,110,247,.35);}
.bulk-bar.on{display:flex;}

/* ── PORTAL ── */
.portal{display:none;position:fixed;inset:0;background:var(--bg);z-index:500;flex-direction:column;}
.portal.open{display:flex;}
.portal-topbar{background:var(--surf);border-bottom:1.5px solid var(--bdr);padding:0 22px;height:56px;display:flex;align-items:center;gap:14px;box-shadow:var(--shadow);}
.portal-sb{width:210px;background:var(--surf);border-right:1.5px solid var(--bdr);display:flex;flex-direction:column;flex-shrink:0;}
.portal-main{flex:1;overflow-y:auto;padding:22px;}
.portal-content{display:flex;flex:1;overflow:hidden;}

/* ── RIGHT SIDEBAR ── */
.rsb-block{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;padding:16px;box-shadow:var(--shadow);}
.rsb-title{font-size:12px;font-weight:700;color:#1a1a2e;margin-bottom:12px;letter-spacing:-.2px;}
body.dark .rsb-title{color:#e8e8ff;}
.cal-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:3px;margin-top:8px;}
.cal-day-name{text-align:center;font-size:9px;font-weight:700;color:var(--muted);padding:2px 0;text-transform:uppercase;}
.cal-day{text-align:center;font-size:11px;padding:5px 2px;border-radius:8px;cursor:pointer;font-weight:500;color:#1a1a2e;transition:all .12s;}
body.dark .cal-day{color:#e8e8ff;}
.cal-day:hover{background:var(--lt);}
.cal-day.today{background:linear-gradient(135deg,var(--blue),var(--blue2));color:#fff;font-weight:700;box-shadow:0 2px 8px rgba(79,110,247,.35);}
.cal-day.empty{color:transparent;cursor:default;}
.cal-nav{display:flex;align-items:center;justify-content:space-between;margin-bottom:4px;}
.cal-month{font-size:12px;font-weight:700;color:#1a1a2e;}
body.dark .cal-month{color:#e8e8ff;}
.cal-btn{background:none;border:none;cursor:pointer;color:var(--muted);font-size:14px;padding:2px 6px;border-radius:6px;transition:all .12s;font-family:inherit;}
.cal-btn:hover{background:var(--lt);color:var(--blue);}
.rsb-creator{display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid var(--bdr);cursor:pointer;transition:background .1s;}
.rsb-creator:last-child{border-bottom:none;}
.rsb-creator:hover{opacity:.75;}
.rsb-cav{width:30px;height:30px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;flex-shrink:0;overflow:hidden;}
.rsb-cav img{width:100%;height:100%;object-fit:cover;}
.tool-card{display:flex;align-items:center;gap:10px;padding:10px 12px;border:1.5px solid var(--bdr);border-radius:12px;cursor:pointer;transition:all .15s;margin-bottom:6px;}
.tool-card:last-child{margin-bottom:0;}
.tool-card:hover{border-color:var(--blue);background:rgba(79,110,247,.04);box-shadow:var(--shadow);}
.tool-icon{width:36px;height:36px;border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;flex-shrink:0;}
.tool-name{font-size:12px;font-weight:600;color:#1a1a2e;}
body.dark .tool-name{color:#e8e8ff;}
.tool-desc{font-size:10px;color:var(--muted);}

/* ── SEARCH OVERLAY ── */
.search-overlay{position:fixed;inset:0;background:rgba(10,10,30,.6);backdrop-filter:blur(8px);z-index:400;display:none;flex-direction:column;align-items:center;padding-top:80px;}
.search-overlay.open{display:flex;}
.search-box{background:var(--surf);border-radius:18px;width:min(600px,94vw);padding:20px;border:1.5px solid var(--bdr);box-shadow:0 20px 60px rgba(0,0,0,.2);max-height:80vh;display:flex;flex-direction:column;}
.search-inp{width:100%;font-size:15px;border:none;outline:none;background:transparent;color:#1a1a2e;font-family:inherit;padding:4px 0 12px;border-bottom:1.5px solid var(--bdr);margin-bottom:12px;font-weight:600;}
body.dark .search-inp{color:#e8e8ff;}
#search-results{overflow-y:auto;max-height:50vh;}
.search-result{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:10px;cursor:pointer;transition:background .12s;}
.search-result:hover{background:var(--lt);}

/* ── CONFIRM ── */
.confirm-box{background:var(--surf);border-radius:18px;padding:24px;width:330px;border:1.5px solid var(--bdr);box-shadow:0 20px 60px rgba(0,0,0,.15);}

/* ── TEAM TABLE ── */
.team-table{background:var(--surf);border:1.5px solid var(--bdr);border-radius:16px;overflow:hidden;box-shadow:var(--shadow);}

/* ── RESPONSIVE ── */
@media(max-width:1200px){.right-sb{width:260px;min-width:260px;}}
@media(max-width:1024px){.right-sb{display:none;}}
@media(max-width:900px){
  /* Sidebar als Drawer - überlagert Content vollständig */
  .sb{
    transform:translateX(-100%);
    z-index:300;
    transition:transform 0.26s cubic-bezier(.4,0,.2,1);
    box-shadow:none;
    width:260px;
    min-width:260px;
  }
  .sb.open{
    transform:translateX(0);
    box-shadow:6px 0 40px rgba(10,10,30,.22);
  }
  /* App-body braucht kein margin-left auf Mobile */
  .app-body{margin-left:0;}
  /* Overlay aktiv und klickbar */
  .sb-overlay{display:block;}
  /* Rechte Sidebar ausblenden */
  .right-sb{display:none;}
  /* Topbar kompakter */
  .topbar{padding:0 12px;height:50px;}
  .tb-t{font-size:13px;}
  /* Suchfeld auf Mobile ausblenden - spart Platz */
  .sw{display:none;}
}
@media(max-width:600px){
  .content{padding:10px;}
  .ph{flex-direction:column;align-items:flex-start;gap:6px;}
  .stat-row{grid-template-columns:1fr 1fr!important;}
  /* Hero kompakter */
  .hero-card{padding:18px 16px;border-radius:14px;}
  .hero-greeting{font-size:17px;}
  .hero-quote{font-size:11px;max-width:100%;}
  .hero-sub{font-size:10px;margin-top:8px;}
  /* Analytics Tabelle: nur 3 Spalten zeigen */
  .an-th,.an-tr{grid-template-columns:1.8fr 1fr 1fr!important;}
  .an-th>div:nth-child(2),.an-tr>div:nth-child(2){display:none;}
  .an-th>div:nth-child(3),.an-tr>div:nth-child(3){display:none;}
  /* Ordner und Datei-Grid */
  .fg-grid{grid-template-columns:repeat(auto-fill,minmax(120px,1fr));gap:6px;}
  .file-grid{grid-template-columns:repeat(auto-fill,minmax(100px,1fr));gap:6px;}
  /* Cards kompakter */
  .fcard{padding:9px;}
  .pcard,.pjcard{border-radius:12px;}
  /* Modal volle Breite */
  .modal{padding:14px;border-radius:14px;width:calc(100vw - 24px);}
  /* Tabs scrollbar */
  .tabs{gap:0;}
  .tab{padding:7px 10px;font-size:11px;}
  /* Creator Header kompakter */
  .cdh{padding:10px 12px;gap:10px;}
  .cd-av{width:44px;height:44px;font-size:16px;}
  /* Stats kompakter */
  .sc{padding:10px 12px;}
  .sv{font-size:20px;}
  /* Buttons */
  .btn{padding:5px 10px;font-size:11px;}
  .btn-p{padding:6px 12px;}
  /* Topbar Abstand */
  .topbar{padding:0 10px;height:48px;}
  /* Einstellungen Grid */
  .pg-einst-grid{grid-template-columns:1fr!important;}
}
/* Overlay immer korrekt positioniert */
.sb-overlay{
  display:none;
  position:fixed;
  inset:0;
  background:rgba(10,10,30,.5);
  z-index:299;
  /* Wichtig: touch-events funktionieren */
  -webkit-tap-highlight-color:transparent;
}
.menu-toggle{display:none;background:none;border:none;font-size:20px;cursor:pointer;padding:4px 8px;color:var(--muted);}
@media(max-width:900px){.menu-toggle{display:flex;align-items:center;}}
.ch-card{transition:all .18s;}
.ch-card:hover{box-shadow:var(--shadow-md);transform:translateY(-1px);}
`;

const HTML = `
<div class="sb-overlay" id="sb-overlay"></div>

<!-- LEFT SIDEBAR -->
<div class="sb" id="admin-sb">
  <div class="logo" id="logo-btn">
    <div class="logo-mark">F</div>
    <div class="logo-text">
      <div class="logo-name">Filapen</div>
      <div class="logo-sub">Creator Hub</div>
    </div>
  </div>
    <div class="nav-s">
    <div class="nav-l">Hauptbereich</div>
    <div class="ni on" id="ni-dashboard"><div class="ni-ico">⊞</div>Dashboard</div>
    <div class="ni" id="ni-creators"><div class="ni-ico">★</div>Creator<span class="ni-bdg" id="bdg-c">0</span></div>
    <div class="ni" id="ni-produkte"><div class="ni-ico">◈</div>Produkte</div>
    <div class="ni" id="ni-projekte"><div class="ni-ico">▤</div>Projekte<span class="ni-bdg" id="bdg-p">0</span></div>
    <div class="ni" id="ni-kategorien"><div class="ni-ico">◫</div>Kategorien</div>
  </div>
  <div class="nav-s">
    <div class="nav-l">Verwaltung</div>
    <div class="ni" id="ni-team"><div class="ni-ico">👥</div>Team</div>
    <div class="ni" id="ni-content-hub"><div class="ni-ico">📚</div>Content Hub</div>
    <div class="ni" id="ni-c-invite"><div class="ni-ico">✉️</div>Creator einladen</div>
    <div class="ni" id="ni-einst"><div class="ni-ico">⚙</div>Einstellungen</div>
  </div>
  <div class="sb-foot">
    <div class="user-r" id="user-btn">
      <div class="av" id="sb-av">AD</div>
      <div class="user-info">
        <div class="user-name" id="sb-name">Admin</div>
        <div class="user-role">Administrator</div>
      </div>
    </div>
    <button id="logout-btn" class="logout-btn-sb">⏻ Abmelden</button>
  </div>
</div>

<!-- APP BODY -->
<div class="app-body">

<!-- MAIN -->
<div class="main">
<div class="topbar">
  <button class="menu-toggle" id="menu-toggle">☰</button>
  <div class="tb-t" id="tb-t">Dashboard</div>
  <div class="sw"><span class="s-ico">🔍</span><input type="text" id="search-inp" placeholder="Suchen..." readonly onclick="openSearch()"></div>
  <div class="tb-r">
    <div style="position:relative">
      <button class="btn" id="fp-btn">⚙ Filter</button>
      <div class="fp" id="fp-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong style="font-size:11px">Filter</strong><span style="font-size:10px;color:var(--blue);cursor:pointer" id="fp-reset">Reset</span></div>
        <div style="font-size:9px;font-weight:700;color:#aaa;text-transform:uppercase;margin-bottom:3px">Produkt</div><div id="fp-prods"></div>
        <div style="font-size:9px;font-weight:700;color:#aaa;text-transform:uppercase;margin:6px 0 3px">Tags</div><div id="fp-tags"></div>
        <div style="font-size:9px;font-weight:700;color:#aaa;text-transform:uppercase;margin:6px 0 3px">Creator</div>
        <input class="fi" id="fp-cs" placeholder="Name..." style="margin-bottom:3px;font-size:11px">
        <div id="fp-cr" style="max-height:80px;overflow-y:auto"></div>
        <div style="display:flex;gap:6px;margin-top:10px;padding-top:9px;border-top:1px solid var(--bdr);justify-content:flex-end">
          <button class="btn" id="fp-close">Schließen</button>
          <button class="btn btn-p" id="fp-apply">Anwenden</button>
        </div>
      </div>
    </div>
    <div id="tb-action"></div>
  </div>
</div>

<div class="content">
<!-- DASHBOARD PAGE -->
<div class="pg on" id="pg-dashboard">
  <div id="hero-section"></div>
  <div id="af-row"></div>
  <div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:12px;letter-spacing:-.2px">Content in Zahlen</div>
  <div class="stat-row" style="grid-template-columns:repeat(4,1fr)" id="d-stats"></div>
  <div id="analytics-section"></div>
</div>

<!-- CREATORS PAGE -->
<div class="pg" id="pg-creators">
  <div id="c-lv">
    <div class="ph"><div class="ph-t">Creator</div><button class="btn btn-p" id="btn-add-c">+ Creator</button></div>
    <div class="cl" id="c-list"></div>
  </div>
  <div id="c-dv" style="display:none">
    <button class="bk" id="bk-c">← Zurück</button>
    <div class="cdh" id="c-hdr"></div>
    <div class="tabs" id="c-tabs">
      <div class="tab on" data-t="bilder">🖼 Bilder</div>
      <div class="tab" data-t="videos">🎬 Videos</div>
      <div class="tab" data-t="roh">📹 Rohmaterial</div>
      <div class="tab" data-t="auswertung">📊 Auswertungen</div>
      <div class="tab" data-t="notizen">📝 Notizen & Vertrag</div>
    </div>
    <div id="c-tc"></div>
  </div>
</div>

<!-- PRODUKTE PAGE -->
<div class="pg" id="pg-produkte">
  <div class="ph"><div class="ph-t">Produkte</div><button class="btn btn-p" id="btn-add-p">+ Produkt</button></div>
  <div class="pg-grid" id="p-grid"></div>
</div>

<!-- PROJEKTE PAGE -->
<div class="pg" id="pg-projekte">
  <div id="pj-lv">
    <div class="ph"><div class="ph-t">Projekte</div><button class="btn btn-p" id="btn-add-pj">+ Projekt</button></div>
    <div class="pj-grid" id="pj-grid"></div>
  </div>
  <div id="pj-dv" style="display:none">
    <button class="bk" id="bk-pj">← Zurück</button>
    <div class="pj-dhdr" id="pj-hdr"></div>
    <div class="tabs" id="pj-tabs">
      <div class="tab on" data-t="bilder">🖼 Bilder</div>
      <div class="tab" data-t="videos">🎬 Videos</div>
    </div>
    <div id="pj-tc"></div>
  </div>
</div>

<!-- KATEGORIEN PAGE -->
<div class="pg" id="pg-kategorien">
  <div id="k-lv">
    <div class="ph"><div class="ph-t">Kategorien</div><button class="btn btn-p" id="btn-add-k">+ Kategorie</button></div>
    <div class="fg-grid" id="k-grid"></div>
  </div>
  <div id="k-dv" style="display:none">
    <button class="bk" id="bk-k">← Zurück</button>
    <div class="ph" id="k-dhdr"></div>
    <div style="display:flex;gap:5px;margin-bottom:12px;flex-wrap:wrap;align-items:center">
      <input class="fi" style="max-width:200px;font-size:11px" placeholder="Suche..." id="k-si">
      <div id="k-chips"></div>
    </div>
    <div class="fg-grid" id="k-fg"></div>
  </div>
</div>

<!-- TEAM PAGE -->
<div class="pg" id="pg-team">
  <div class="ph"><div class="ph-t">Team</div><button class="btn btn-p" id="btn-invite">+ Einladen</button></div>
  <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
    <div class="sc"><div class="sl">Gesamt</div><div class="sv" id="t-tot">0</div></div>
    <div class="sc"><div class="sl">Admins</div><div class="sv" id="t-adm">0</div></div>
    <div class="sc"><div class="sl">Ausstehend</div><div class="sv" id="t-pen">0</div></div>
  </div>
  <div class="team-table">
    <div class="th" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px"><div>Mitglied</div><div>E-Mail</div><div>Rolle</div><div>Status</div><div></div></div>
    <div id="t-rows"></div>
  </div>
</div>

<!-- CREATOR EINLADEN PAGE -->
<div class="pg" id="pg-c-invite">
  <div class="ph"><div class="ph-t">Creator einladen</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px">
    <div class="rsb-block">
      <div style="font-size:13px;font-weight:700;margin-bottom:5px;color:#1a1a2e">✉️ Einladung senden</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:16px">Wähle einen Creator aus der Liste und sende eine Einladungs-E-Mail.</div>
      <div class="fg"><label class="fl">Creator auswählen *</label><select class="fi" id="ci-sel"><option value="">– Creator wählen –</option></select></div>
      <div class="fg" id="ci-email-wrap" style="display:none"><label class="fl">E-Mail</label><input class="fi" id="ci-email" type="email" placeholder="creator@email.com"></div>
      <div id="ci-preview" style="display:none;background:var(--lt);border:1.5px solid var(--bdr);border-radius:10px;padding:12px;font-size:12px;color:var(--muted);margin-bottom:12px;line-height:1.6"></div>
      <div class="fg"><label class="fl">Produkt zuweisen (optional)</label><select class="fi" id="ci-prod"><option value="">– Kein Produkt –</option></select></div>
      <button class="btn btn-p" style="width:100%" id="ci-send">Einladung senden →</button>
    </div>
    <div class="rsb-block">
      <div style="font-size:13px;font-weight:700;margin-bottom:12px;color:#1a1a2e">👤 Eingeladene Creator</div>
      <div id="ci-list"></div>
    </div>
  </div>
  <div style="margin-top:16px" class="rsb-block">
    <div style="font-size:13px;font-weight:700;margin-bottom:10px;color:#1a1a2e">🔍 Creator-Portal Vorschau</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:14px">So sieht das Dashboard eines Creators aus:</div>
    <button class="btn btn-p" id="open-portal-preview">Creator-Portal öffnen →</button>
  </div>
</div>

<!-- CONTENT HUB PAGE -->
<div class="pg" id="pg-content-hub">
  <div class="ph">
    <div class="ph-t">Content Hub</div>
    <div style="display:flex;gap:8px">
      <input class="fi" id="ch-search" placeholder="🔍 Suchen..." style="width:180px;padding:7px 12px;font-size:12px">
      <button class="btn btn-p" id="ch-add-btn">+ Inhalt hinzufügen</button>
      <button class="btn" id="ch-add-cat-btn">+ Kategorie</button>
    </div>
  </div>
  <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap" id="ch-cats"></div>
  <div id="ch-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px"></div>
</div>

<!-- EINSTELLUNGEN PAGE -->
<div class="pg" id="pg-einst">
  <div class="ph"><div class="ph-t">Einstellungen</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="rsb-block">
      <div style="font-size:12px;font-weight:700;margin-bottom:13px;color:#1a1a2e">👤 Profil</div>
      <div class="fg"><label class="fl">Name</label><input class="fi" id="s-name" value="Admin User"></div>
      <div class="fg"><label class="fl">E-Mail</label><input class="fi" value="admin@filapen.de" disabled style="opacity:.5"></div>
      <div class="fg"><label class="fl">Profilbild</label>
        <div style="display:flex;align-items:center;gap:10px;margin-top:4px">
          <div id="s-photo-prev" style="width:48px;height:48px;border-radius:12px;background:linear-gradient(135deg,var(--blue),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:16px;font-weight:700;color:#fff;overflow:hidden;flex-shrink:0">AD</div>
          <label style="cursor:pointer;flex:1">
            <div class="btn" style="width:100%;justify-content:center;font-size:11px">📷 Foto ändern</div>
            <input type="file" accept="image/*" id="s-photo-inp" style="display:none">
          </label>
        </div>
      </div>
      <button class="btn btn-p" style="width:100%" id="s-save">Speichern</button>
    </div>
    <div class="rsb-block">
      <div style="font-size:12px;font-weight:700;margin-bottom:13px;color:#1a1a2e">🔐 Passwort</div>
      <div class="fg"><label class="fl">Aktuell</label><input class="fi" type="password" id="pw-c" placeholder="••••••••"></div>
      <div class="fg"><label class="fl">Neu (min. 8)</label><input class="fi" type="password" id="pw-n" placeholder="••••••••"></div>
      <div class="fg"><label class="fl">Bestätigen</label><input class="fi" type="password" id="pw-k" placeholder="••••••••"></div>
      <button class="btn btn-p" style="width:100%" id="pw-save">Ändern</button>
    </div>
    <div class="rsb-block">
      <div style="font-size:12px;font-weight:700;margin-bottom:13px;color:#1a1a2e">🎨 Darstellung</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
        <div style="font-size:12px;font-weight:600">Dark Mode</div>
        <div class="tgl" id="dark-tgl"><div class="tgl-d"></div></div>
      </div>
      <div style="font-size:9px;font-weight:700;color:var(--muted);text-transform:uppercase;margin-bottom:6px">Sprache</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-p btn-sm" id="lang-de" style="flex:1">🇩🇪 Deutsch</button>
        <button class="btn btn-sm" id="lang-en" style="flex:1">🇬🇧 English</button>
      </div>
    </div>
    <div class="rsb-block">
      <div style="font-size:12px;font-weight:700;margin-bottom:5px;color:#1a1a2e">🏷️ Tags</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:10px">Für Creator und Filter</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:10px" id="tags-list"></div>
      <div style="display:flex;gap:6px"><input class="fi" id="new-tag" placeholder="Neuer Tag..." style="flex:1;font-size:11px"><button class="btn btn-p" id="btn-add-tag">+</button></div>
    </div>
  </div>
</div>
</div>
</div>

<!-- RIGHT SIDEBAR -->
<div class="right-sb" id="right-sb">
  <!-- Admin Info -->
  <div class="rsb-block">
    <div style="display:flex;align-items:center;gap:10px">
      <div id="rsb-av-wrap" style="width:40px;height:40px;border-radius:12px;overflow:hidden;flex-shrink:0;background:linear-gradient(135deg,var(--blue),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:700;color:#fff;box-shadow:0 3px 10px rgba(79,110,247,.3)">AD</div>
      <div>
        <div style="font-size:13px;font-weight:700;color:#1a1a2e" id="rsb-name">Admin</div>
        <div style="font-size:10px;color:var(--muted)">Administrator · Filapen</div>
      </div>
    </div>
  </div>

  <!-- Calendar -->
  <div class="rsb-block">
    <div class="cal-nav">
      <button class="cal-btn" id="cal-prev">‹</button>
      <div class="cal-month" id="cal-month-label">April 2026</div>
      <button class="cal-btn" id="cal-next">›</button>
    </div>
    <div class="cal-grid" id="cal-day-names"></div>
    <div class="cal-grid" id="cal-days"></div>
  </div>

  <!-- Neueste Creator -->
  <div class="rsb-block">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:10px">
      <div class="rsb-title" style="margin-bottom:0">Neueste Creator</div>
      <span style="font-size:10px;color:var(--blue);cursor:pointer;font-weight:600" id="rsb-view-all">Alle →</span>
    </div>
    <div id="rsb-creators"></div>
  </div>

  <!-- Tools -->
  <div class="rsb-block">
    <div class="rsb-title">Tools</div>
    <div class="tool-card" id="tool-headline">
      <div class="tool-icon" style="background:linear-gradient(135deg,#eff2ff,#e0e7ff)">✍️</div>
      <div><div class="tool-name">Headline Generator</div><div class="tool-desc">Starke Titel erstellen</div></div>
    </div>
    <div class="tool-card" id="tool-skript">
      <div class="tool-icon" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7)">📝</div>
      <div><div class="tool-name">Skript Generator</div><div class="tool-desc">Video-Skripte schreiben</div></div>
    </div>
    <div class="tool-card" id="tool-konkurrenz">
      <div class="tool-icon" style="background:linear-gradient(135deg,#fff7ed,#ffedd5)">🔍</div>
      <div><div class="tool-name">Konkurrenz Analyse</div><div class="tool-desc">Wettbewerb analysieren</div></div>
    </div>
  </div>
</div>

</div><!-- end app-body -->

<!-- PORTAL -->
<div class="portal" id="creator-portal">
  <div class="portal-topbar">
    <div style="font-size:14px;font-weight:700;color:#1a1a2e">🎨 Creator Portal</div>
    <div style="font-size:11px;color:var(--muted);margin-left:8px">Ansicht als Creator</div>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <div style="font-size:11px;color:var(--muted)" id="portal-user-label">Angemeldet als: <strong>–</strong></div>
      <button class="btn btn-sm" id="portal-logout-btn" style="font-size:11px">⏻ Abmelden</button>
      <button class="btn btn-sm" id="close-portal">✕ Portal schließen</button>
    </div>
  </div>
  <div class="portal-content">
    <div class="portal-sb">
      <div class="nav-s">
        <div class="nav-l">Mein Bereich</div>
        <div class="ni on" id="pni-home"><div class="ni-ico">⊞</div>Mein Dashboard</div>
        <div class="ni" id="pni-upload"><div class="ni-ico">⬆</div>Inhalte hochladen</div>
        <div class="ni" id="pni-tips"><div class="ni-ico">💡</div>Tipps & Tricks</div>
      </div>
    </div>
    <div class="portal-main" id="portal-main"></div>
  </div>
</div>

<!-- SEARCH -->
<div class="search-overlay" id="search-overlay">
  <div class="search-box">
    <input class="search-inp" id="search-real" placeholder="Creator, Produkt, Batch suchen..." autofocus>
    <div id="search-results"><div style="color:var(--muted);font-size:12px;padding:4px 0">Tippe um zu suchen…</div></div>
    <div style="font-size:10px;color:var(--muted);margin-top:10px;padding-top:10px;border-top:1px solid var(--bdr);display:flex;gap:12px">
      <span>👤 Creator</span><span>🏷️ Produkt</span><span>📦 Batch</span><span>📄 Datei</span><span style="margin-left:auto">ESC zum Schließen</span>
    </div>
  </div>
</div>

<!-- DROP MENU -->
<div class="drop-menu" id="drop-menu">
  <button class="dm-i" id="dm-edit">✏️ Bearbeiten</button>
  <button class="dm-i" id="dm-portal">👤 Portal öffnen</button>
  <button class="dm-i red" id="dm-del">🗑 Löschen</button>
</div>

<!-- LIGHTBOX -->
<div class="lb" id="lb">
  <div class="lb-x" id="lb-x">✕</div>
  <img id="lb-img" style="display:none">
  <video id="lb-vid" controls style="display:none"></video>
  <div style="color:#fff;margin-top:10px;text-align:center">
    <div style="font-size:13px;font-weight:700;margin-bottom:2px" id="lb-name"></div>
    <div style="font-size:10px;opacity:.6" id="lb-meta"></div>
  </div>
  <div style="display:flex;gap:8px;margin-top:10px">
    <button id="lb-dl" class="lb-btn" style="cursor:pointer;font-family:inherit">⬇ Download</button>
    <button class="lb-btn" id="lb-close">✕ Schließen</button>
  </div>
  <div class="lb-comment-box" id="lb-comments-box">
    <div style="font-size:11px;font-weight:700;color:#fff;margin-bottom:8px">💬 Kommentare</div>
    <div id="lb-comments-list" style="max-height:110px;overflow-y:auto;margin-bottom:8px"></div>
    <div style="display:flex;gap:7px">
      <textarea class="lb-comment-input" id="lb-comment-inp" rows="1" placeholder="Kommentar schreiben..."></textarea>
      <button class="lb-btn" id="lb-comment-send" style="flex-shrink:0;font-size:11px">Senden</button>
    </div>
  </div>
</div>

<!-- UP MENU -->
<div class="up-menu" id="up-menu">
  <div style="font-size:11px;font-weight:700;margin-bottom:10px;color:var(--muted)">Upload-Datum wählen</div>
  <div class="fg"><label class="fl">Datum</label><input class="fi" type="date" id="up-date" style="font-size:11px;padding:5px 8px"></div>
  <div style="display:flex;gap:5px;margin-top:8px">
    <button class="btn btn-sm" id="up-cancel">Abbrechen</button>
    <button class="btn btn-p btn-sm" id="up-ok">Speichern</button>
  </div>
</div>

<!-- CONFIRM -->
<div id="confirm-bg" style="position:fixed;inset:0;background:rgba(0,0,0,.4);backdrop-filter:blur(6px);z-index:700;display:none;align-items:center;justify-content:center;">
  <div class="confirm-box">
    <div style="font-size:15px;font-weight:800;margin-bottom:8px;color:#1a1a2e" id="confirm-title">Löschen?</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:20px">Diese Aktion kann nicht rückgängig gemacht werden.</div>
    <div style="display:flex;gap:8px;justify-content:flex-end">
      <button class="btn" id="confirm-cancel">Abbrechen</button>
      <button class="btn btn-red" id="confirm-ok">Löschen</button>
    </div>
  </div>
</div>

<!-- MODAL -->
<div class="modal-bg" id="modal-bg">
  <div class="modal">
    <div class="modal-t" id="modal-title"></div>
    <div id="modal-body"></div>
    <div class="modal-acts">
      <button class="btn" id="modal-cancel">Abbrechen</button>
      <button class="btn btn-p" id="modal-ok">Speichern</button>
    </div>
  </div>
</div>

<div class="toast" id="toast"></div>
`;

const JS = `
const G=id=>document.getElementById(id);
const CL=['#6366f1','#ec4899','#06b6d4','#f97316','#84cc16','#f43f5e','#8b5cf6','#10b981'];
const FL={DE:'🇩🇪',AT:'🇦🇹',CH:'🇨🇭',US:'🇺🇸',GB:'🇬🇧'};
let _id=1000;const uid=()=>++_id;
function showT(m,dur=2600){const t=G('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}

const S={
  page:'dashboard',dark:false,adminPhoto:null,adminName:'Admin',allUploads:[],
  modal:null,form:{},selRole:'read',selC:[],
  aC:null,aCT:'bilder',aF:null,aPJ:null,aPT:'bilder',aK:null,
  flt:{prods:[],tags:[],cid:null},search:'',
  tags:['Fashion','Beauty','Lifestyle','Tech','Sport','Food','Brand'],
  bulkSel:[],bulkMode:false,
  activeLbFile:null,activeLbFld:null,
  creators:[],
  produkte:[
    {id:1,name:'Serum XY',cat:'Skincare',icon:'💄',url:null,tags:['Beauty'],briefings:[],skripte:[],lernvideos:[]},
    {id:2,name:'Protein Shake',cat:'Fitness',icon:'💪',url:null,tags:['Sport'],briefings:[],skripte:[],lernvideos:[]}
  ],
  projekte:[{id:1,name:'Winter Kampagne',pids:[1],aktion:'20% WINTER24',start:'2024-01-01',count:3,cids:[],status:'active',url:null}],
  kat:[{id:1,name:'Bilder',icon:'🖼️',type:'bilder'},{id:2,name:'Videos',icon:'🎬',type:'videos'},{id:3,name:'Rohmaterial',icon:'📹',type:'roh'},{id:4,name:'Auswertungen',icon:'📊',type:'auswertung'}],
  team:[],
  contentHub:{cats:['Briefings','Skripte','Lernvideos'],items:[]},
  chFilter:'Alle',
};

let _confirmCB=null;
function askConfirm(msg,cb){_confirmCB=cb;G('confirm-title').textContent=msg;G('confirm-bg').style.display='flex';}
G('confirm-ok').addEventListener('click',()=>{G('confirm-bg').style.display='none';if(_confirmCB){_confirmCB();_confirmCB=null;}});
G('confirm-cancel').addEventListener('click',()=>{G('confirm-bg').style.display='none';_confirmCB=null;});
G('confirm-bg').addEventListener('click',e=>{if(e.target===G('confirm-bg')){G('confirm-bg').style.display='none';_confirmCB=null;}});

let _eC=null,_dC=null,_pC=null;
function showDot(btn,eC,dC,pC){
  _eC=eC;_dC=dC;_pC=pC;
  G('dm-edit').style.display=eC?'flex':'none';
  G('dm-portal').style.display=pC?'flex':'none';
  G('drop-menu').classList.add('open');
  const r=btn.getBoundingClientRect();
  G('drop-menu').style.top=(r.bottom+3)+'px';
  G('drop-menu').style.left=Math.max(4,r.right-140)+'px';
}
function hideDot(){G('drop-menu').classList.remove('open');_eC=null;_dC=null;_pC=null;}
G('dm-edit').addEventListener('click',()=>{if(_eC)_eC();hideDot();});
G('dm-del').addEventListener('click',()=>{if(_dC)_dC();hideDot();});
G('dm-portal').addEventListener('click',()=>{if(_pC)_pC();hideDot();});

function go(p){
  S.page=p;
  document.querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
  G('ni-'+p)?.classList.add('on');
  document.querySelectorAll('.pg').forEach(x=>x.classList.remove('on'));
  G('pg-'+p)?.classList.add('on');
  const tt={dashboard:'Dashboard',creators:'Creator',produkte:'Produkte',projekte:'Projekte',kategorien:'Kategorien',team:'Team','c-invite':'Creator einladen',einst:'Einstellungen'};
  G('tb-t').textContent=tt[p]||p;
  G('tb-action').innerHTML='';
  G('fp-panel').classList.remove('open');hideDot();
  if(p==='dashboard')rDash();
  else if(p==='creators'){showCL();rCreators();}
  else if(p==='produkte')rProdukte();
  else if(p==='projekte'){showPJL();rProjekte();}
  else if(p==='kategorien'){showKL();rKat();}
  else if(p==='team')rTeam();
  else if(p==='c-invite')rCInvite();
  else if(p==='content-hub')rContentHub();
  else if(p==='einst'){rTags();G('dark-tgl').classList.toggle('on',S.dark);}
  uBdg();
}

function kidsBadges(c){
  if(!c.kids||!c.kidsAges||!c.kidsAges.length)return'';
  const ages=c.kidsAges.map(a=>\`<span class="kb">👶 \${a}J</span>\`).join('');
  return\`<div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:3px">\${ages}</div>\`;
}
function socialBadge(c){if(!c.instagram)return'';return\`<a class="social-badge" href="\${c.instagram}" target="_blank">📸 Instagram</a>\`;}
function verguetungBadge(c){
  const v=c.verguetung;
  if(v==='provision')return\`<span class="badge-prov">📊 \${c.provision}% Provision</span>\`;
  if(v==='fix')return\`<span class="badge-fix">💶 \${c.fixbetrag}€ Fix</span>\`;
  if(v==='beides')return\`<span class="badge-both">📊 \${c.provision}% + 💶 \${c.fixbetrag}€</span>\`;
  return'';
}
function deadlineStatus(deadline){
  if(!deadline)return'';
  const d=new Date(deadline),now=new Date();
  const diff=Math.ceil((d-now)/(1000*60*60*24));
  if(diff<0)return\`<span class="deadline-late">⚠️ Überfällig seit \${Math.abs(diff)}T</span>\`;
  if(diff<=7)return\`<span class="deadline-warn">⏰ \${diff}T verbleibend</span>\`;
  return\`<span class="deadline-ok">📅 \${d.toLocaleDateString('de-DE',{day:'2-digit',month:'short'})}</span>\`;
}
function lastUploadDays(c){
  let last=null;
  Object.values(c.flds).flat().forEach(fld=>fld.files.forEach(f=>{if(!last||new Date(f.uploadedAt||0)>last)last=new Date(f.uploadedAt||0);}));
  if(!last||last.getFullYear()<2000)return null;
  return Math.ceil((new Date()-last)/(1000*60*60*24));
}

function rDash(){
  const tf=S.creators.reduce((s,c)=>s+Object.values(c.flds).flat().reduce((ss,f)=>ss+f.files.length,0),0);

  // ── HERO CARD
  // Name aus localStorage 'user' laden (enthält echten Namen des eingeloggten Admins)
  var _storedUser=localStorage.getItem('user');
  var _parsedUser=_storedUser?JSON.parse(_storedUser):{};
  var adminName=S.adminName||(_parsedUser.name?_parsedUser.name.split(' ')[0]:null)||G('sb-name')?.textContent||'Admin';
  // Auch Sidebar und RSB aktualisieren
  if(_parsedUser.name&&G('sb-name'))G('sb-name').textContent=_parsedUser.name.split(' ')[0];
  if(_parsedUser.name&&G('rsb-name'))G('rsb-name').textContent=_parsedUser.name;
  var myQuotes=[
    'Ich habe Menschen gesehen die haben keine Klamotten, ich habe Klamotten gesehen da drin sind keine Menschen. — Aristoteles',
    'Der Wolf geht bei den Bergen und kommt wieder bei sein gleichen Platz. — Nietzsche',
    'Du sollst nicht der Hund von Geld sein, der Hund soll dein Hund sein. — Goethe',
    'Wenn der Wasser sich zurück zieht, die Fische sterben und die Ameisen essen die Fische. Und wenn das Wasser zurück kommt die Fische essen die Ameisen. — Immanuel Kant',
    'Wenn ein Mensch der 1 Cent Wert ist wenn wir ihn 4 Cent geben versuchen die uns für 3 Cent zu verkaufen. — Sokrates',
    'Ein Mann will mit seine Axt ein Baum schneiden, der Baum weint und sagt: was du in der Hand hast kommt von mir. — Platon',
    'Das Pferd was schnell läuft, kackt schief. — Karl Marx',
    'Für die Welt bist du irgendjemand, aber für irgendjemand bist du die Welt. — Dante'
  ];
  var heroEl=G('hero-section');
  if(heroEl){
    var myQ=myQuotes[Math.floor(Math.random()*myQuotes.length)];
    var photoHtml=S.adminPhoto
      ?'<img src="'+S.adminPhoto+'" style="width:72px;height:72px;border-radius:50%;object-fit:cover;border:3px solid rgba(255,255,255,.4);box-shadow:0 4px 16px rgba(0,0,0,.2)">'
      :'<div style="width:72px;height:72px;border-radius:50%;background:rgba(255,255,255,.2);display:flex;align-items:center;justify-content:center;font-size:26px;font-weight:800;color:#fff;border:3px solid rgba(255,255,255,.3)">'+adminName.slice(0,2).toUpperCase()+'</div>';
    heroEl.innerHTML='<div class="hero-card" style="display:flex;align-items:center;justify-content:space-between;gap:20px">'
      +'<div style="flex:1">'
      +'<div class="hero-greeting">Hallo, '+adminName+' 👋</div>'
      +'<div class="hero-quote" id="hero-quote-txt">'+myQ+'</div>'
      +'<div class="hero-sub">Hier ist dein Überblick für heute.</div>'
      +'</div>'
      +'<div style="flex-shrink:0;display:flex;flex-direction:column;align-items:center;gap:8px">'+photoHtml+'</div>'
      +'</div>';
    // API-Zitat als zweites (jedes zweite Mal)
    if(Math.random()>0.5){
      fetch('https://api.quotable.io/quotes/random?limit=1&maxLength=100')
        .then(function(r){return r.json();})
        .then(function(d){if(d&&d[0]&&d[0].content&&G('hero-quote-txt'))G('hero-quote-txt').textContent=d[0].content+' — '+d[0].author;})
        .catch(function(){});
    }
  }

  // ── STATS
  G('d-stats').innerHTML=\`
    <div class="sc" id="ds-c">
      <div class="sc-icon" style="background:linear-gradient(135deg,#eff2ff,#e0e7ff)">👥</div>
      <div class="sl">Creator</div><div class="sv">\${S.creators.length}</div>
    </div>
    <div class="sc" id="ds-p">
      <div class="sc-icon" style="background:linear-gradient(135deg,#f0fdf4,#dcfce7)">◈</div>
      <div class="sl">Produkte</div><div class="sv">\${S.produkte.length}</div>
    </div>
    <div class="sc" id="ds-pj">
      <div class="sc-icon" style="background:linear-gradient(135deg,#fff7ed,#ffedd5)">▤</div>
      <div class="sl">Projekte</div><div class="sv">\${S.projekte.length}</div>
    </div>
    <div class="sc">
      <div class="sc-icon" style="background:linear-gradient(135deg,#fdf2f8,#fce7f3)">⬆</div>
      <div class="sl">Uploads</div><div class="sv">\${tf}</div>
    </div>\`;
  G('ds-c')?.addEventListener('click',()=>go('creators'));
  G('ds-p')?.addEventListener('click',()=>go('produkte'));
  G('ds-pj')?.addEventListener('click',()=>go('projekte'));

  // ── LATE CONTENT WARNING
  const late=S.creators.filter(c=>{const d=lastUploadDays(c);return d!==null&&d>=14;});
  let warnHtml='';
  if(late.length&&!S._warnDismissed){
    warnHtml=\`<div style="background:#fff7ed;border:1.5px solid #fed7aa;border-radius:14px;padding:12px 16px;margin-bottom:16px;font-size:12px;color:#92400e;display:flex;align-items:flex-start;justify-content:space-between;gap:10px" id="warn-14d">
      <div>⚠️ <strong>\${late.length} Creator</strong> \${late.length===1?'hat':'haben'} seit 14+ Tagen keinen Content geliefert: 
      \${late.map(c=>\`<strong>\${c.name}</strong>\`).join(', ')}</div>
      <button id="warn-dismiss" style="background:none;border:none;cursor:pointer;font-size:16px;color:#92400e;line-height:1;padding:0;flex-shrink:0">✕</button>
    </div>\`;
  }
  G('af-row').innerHTML=warnHtml;
  if(warnHtml){setTimeout(()=>{G('warn-dismiss')?.addEventListener('click',()=>{S._warnDismissed=true;G('warn-14d')?.remove();});},0);}

  // ── ANALYTICS TABLE – direkt aus S.creators + S.allUploads
  rAnalytics();

  // ── RIGHT SIDEBAR – CREATOR LIST
  rRightSidebar();
}

var _anPage=0; // aktuelle Seite (0-basiert)

function rAnalytics(){
  var anEl=G('analytics-section');
  if(!anEl)return;

  // Nur Creator MIT mindestens einem Upload anzeigen
  var creatorsWithUploads=S.creators.filter(function(c){
    return S.allUploads.some(function(u){return String(u.creator_id)===String(c.id);});
  });

  // Header immer rendern
  var header='<div class="analytics-card">'
    +'<div class="analytics-hdr"><div class="analytics-title">📊 Analytics</div>'
    +'<span style="font-size:10px;color:var(--blue);cursor:pointer;font-weight:600" id="an-view-all">Alle Creator →</span></div>'
    +'<div class="an-th" style="grid-template-columns:2fr 1.5fr 1.5fr 1fr 1fr">'
    +'<div>Full Name</div><div>Produkt</div><div>Batch</div><div>Status</div><div>Online seit</div></div>';

  if(!creatorsWithUploads.length){
    anEl.innerHTML=header
      +'<div style="padding:20px;text-align:center;color:var(--muted);font-size:12px">Noch keine Uploads vorhanden</div></div>';
    G('an-view-all')?.addEventListener('click',function(){go('creators');});
    return;
  }

  var rows=creatorsWithUploads.map(function(c){
    var uploads=S.allUploads.filter(function(u){return String(u.creator_id)===String(c.id);});
    var onlineUpload=uploads.find(function(u){return u.uploaded_at;});
    var latest=onlineUpload||uploads[0];
    var product=latest.product||null;
    var batch=latest.batch||null;
    var online=!!onlineUpload;
    var uploadedAt=onlineUpload?onlineUpload.uploaded_at:null;
    var dateStr=uploadedAt
      ?new Date(uploadedAt).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit'})
      :null;
    return {cid:c.id,cname:c.name,ccolor:c.color,cini:c.ini,cphoto:c.photo,
      product:product,batch:batch,online:online,dateStr:dateStr,count:uploads.length};
  });

  // Online oben, dann alphabetisch
  rows.sort(function(a,b){
    if(b.online!==a.online)return (b.online?1:0)-(a.online?1:0);
    return a.cname.localeCompare(b.cname);
  });

  // Pagination
  var perPage=5;
  var totalPages=Math.ceil(rows.length/perPage);
  if(_anPage>=totalPages)_anPage=0;
  var pageRows=rows.slice(_anPage*perPage,(_anPage+1)*perPage);

  var tableRows=pageRows.map(function(r){
    var av=r.cphoto
      ?'<img src="'+r.cphoto+'" style="width:28px;height:28px;border-radius:8px;object-fit:cover">'
      :'<div style="width:28px;height:28px;border-radius:8px;background:'+r.ccolor
        +';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">'+r.cini+'</div>';
    return '<div class="an-tr" style="grid-template-columns:2fr 1.5fr 1.5fr 1fr 1fr" data-an-cid="'+r.cid+'">'
      +'<div style="display:flex;align-items:center;gap:8px">'+av
      +'<div><div style="font-size:12px;font-weight:600;color:#1a1a2e">'+r.cname+'</div>'
      +'<div style="font-size:10px;color:var(--muted)">'+r.count+' Upload'+(r.count!==1?'s':'')+'</div>'
      +'</div></div>'
      +'<div style="font-size:12px;color:#1a1a2e">'+(r.product||'<span style="color:var(--muted)">–</span>')+'</div>'
      +'<div style="font-size:12px;color:#1a1a2e">'+(r.batch||'<span style="color:var(--muted)">–</span>')+'</div>'
      +'<div><span class="status-dot '+(r.online?'status-on':'status-off')+'">'
      +'<span class="dot '+(r.online?'dot-on':'dot-off')+'"></span>'
      +(r.online?'Online':'Offline')+'</span></div>'
      +'<div style="font-size:11px;color:#1a1a2e">'+(r.dateStr||'<span style="color:var(--muted)">–</span>')+'</div>'
      +'</div>';
  }).join('');

  // Pagination Footer – nur wenn mehr als 5 Creator
  var paginationHtml='';
  if(totalPages>1){
    paginationHtml='<div style="display:flex;align-items:center;justify-content:space-between;padding:10px 4px 2px;border-top:1px solid var(--bdr);margin-top:4px">'
      +'<button id="an-prev" style="background:none;border:1.5px solid var(--bdr);border-radius:8px;padding:4px 12px;font-size:12px;cursor:pointer;color:var(--muted);font-family:inherit;transition:all .15s"'+((_anPage===0)?'disabled style="opacity:.35;cursor:default;background:none;border:1.5px solid var(--bdr);border-radius:8px;padding:4px 12px;font-size:12px;font-family:inherit"':'')+'> ← </button>'
      +'<span style="font-size:11px;color:var(--muted);font-weight:500">'+(_anPage+1)+' / '+totalPages+'</span>'
      +'<button id="an-next" style="background:none;border:1.5px solid var(--bdr);border-radius:8px;padding:4px 12px;font-size:12px;cursor:pointer;color:var(--blue);font-family:inherit;font-weight:600;transition:all .15s"'+((_anPage>=totalPages-1)?'disabled style="opacity:.35;cursor:default;background:none;border:1.5px solid var(--bdr);border-radius:8px;padding:4px 12px;font-size:12px;font-family:inherit"':'')+'> → </button>'
      +'</div>';
  }

  anEl.innerHTML=header+tableRows+paginationHtml+'</div>';

  anEl.querySelectorAll('[data-an-cid]').forEach(function(row){
    row.addEventListener('click',function(){
      go('creators');
      setTimeout(function(){openC(row.dataset.anCid);},80);
    });
  });
  G('an-view-all')?.addEventListener('click',function(){go('creators');});

  // Pagination Buttons
  G('an-prev')?.addEventListener('click',function(){if(_anPage>0){_anPage--;rAnalytics();}});
  G('an-next')?.addEventListener('click',function(){if(_anPage<totalPages-1){_anPage++;rAnalytics();}});
}

function rRightSidebar(){
  // Neueste Creator (max 5)
  var rsb=G('rsb-creators');
  if(rsb){
    var latest=[...S.creators].slice(0,5);
    if(!latest.length){rsb.innerHTML='<div style="font-size:11px;color:var(--muted)">Noch keine Creator</div>';return;}
    rsb.innerHTML=latest.map(function(c){
      var av=c.photo?'<img src="'+c.photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:8px">'
        :'<div style="width:30px;height:30px;border-radius:8px;background:'+c.color+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff">'+c.ini+'</div>';
      return '<div class="rsb-creator" data-rsb-cid="'+c.id+'">'
        +'<div class="rsb-cav">'+av+'</div>'
        +'<div style="flex:1;min-width:0"><div style="font-size:12px;font-weight:600;color:#1a1a2e;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">'+c.name+'</div>'
        +'<div style="font-size:10px;color:var(--muted)">'+((c.tags||[])[0]||'Creator')+'</div></div>'
        +'</div>';
    }).join('');
    rsb.querySelectorAll('[data-rsb-cid]').forEach(function(el){
      el.addEventListener('click',function(){
        var cid=el.dataset.rsbCid;
        go('creators');
        setTimeout(function(){openC(cid);},80);
      });
    });
  }
  G('rsb-view-all')?.addEventListener('click',function(){go('creators');});
}

function cRowsHTML(list){
  if(!list.length)return'<div class="empty">Keine Creator gefunden</div>';
  return list.map(c=>{
    const tf=Object.values(c.flds).flat().reduce((s,f)=>s+f.files.length,0);
    const tags=c.tags.map(t=>\`<span class="tag">\${t}</span>\`).join('');
    const av=c.photo?\`<div class="cr-av"><img src="\${c.photo}"></div>\`:\`<div class="cr-av" style="background:\${c.color}">\${c.ini}</div>\`;
    const days=lastUploadDays(c);
    const daysBadge=days!==null?(days>=14?\`<span style="color:var(--red);font-size:10px;font-weight:600">⚠️ \${days}T kein Upload</span>\`:days>=7?\`<span style="color:var(--org);font-size:10px">\${days}T her</span>\`:''):'';
    return\`<div class="cr" data-cid="\${c.id}">
      <div style="cursor:pointer;display:flex;align-items:center;gap:10px;flex:1;min-width:0" data-open-c="\${c.id}">
        \${av}
        <div style="flex:1;min-width:0">
          <div style="font-size:13px;font-weight:600;margin-bottom:1px">\${c.name}\${c.invited?' <span style="font-size:9px;background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;border-radius:5px;padding:1px 5px">Portal ✓</span>':''}</div>
          <div style="font-size:10px;color:var(--muted)">\${c.desc||''} · \${c.age||''}J</div>
          <div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:3px">\${tags}\${socialBadge(c)}\${verguetungBadge(c)}</div>
          \${kidsBadges(c)}
          \${daysBadge?\`<div style="margin-top:2px">\${daysBadge}</div>\`:''}
        </div>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:2px;flex-shrink:0;margin-left:8px">
        <div style="font-size:15px;font-weight:700">\${tf}</div>
        <div style="font-size:9px;color:var(--muted)">Uploads</div>
        <div style="display:flex;align-items:center;gap:2px;margin-top:1px">
          <span style="padding:1px 5px;border-radius:7px;border:1px solid var(--bdr);font-size:9px">\${c.gender==='female'?'♀ F':'♂ M'}</span>
          <span style="font-size:12px">\${FL[c.country]||''}</span>
        </div>
        <button class="dot-btn" data-dot-c="\${c.id}" title="Optionen">···</button>
      </div>
    </div>\`;
  }).join('');
}

function attachCR(container){
  container.querySelectorAll('.cr[data-cid]').forEach(row=>{
    row.style.cursor='pointer';
    row.addEventListener('click',e=>{
      if(e.target.closest('.dot-btn')||e.target.closest('[data-dot-c]')||e.target.closest('.social-badge'))return;
      const cid=row.dataset.cid;
      if(S.page!=='creators'){go('creators');setTimeout(()=>openC(cid),80);}
      else openC(cid);
    });
  });
  container.querySelectorAll('[data-open-c]').forEach(el=>el.addEventListener('click',e=>{
    e.stopPropagation();
    const cid=el.dataset.openC;
    if(S.page!=='creators'){go('creators');setTimeout(()=>openC(cid),80);}
    else openC(cid);
  }));
  container.querySelectorAll('[data-dot-c]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();
    const c=S.creators.find(x=>String(x.id)===String(btn.dataset.dotC));
    if(c)showDot(btn,()=>openM('editC',c.id),()=>delC(c.id,c.name),()=>openPortal(c.id));
  }));
}

function showCL(){G('c-lv').style.display='block';G('c-dv').style.display='none';G('tb-action').innerHTML='';}
function rCreators(){const list=S.creators.filter(c=>!S.search||c.name.toLowerCase().includes(S.search.toLowerCase()));G('c-list').innerHTML=cRowsHTML(list);attachCR(G('c-list'));}

function openC(id){
  const c=S.creators.find(x=>String(x.id)===String(id));if(!c)return;
  S.aC=c;S.aCT='bilder';
  G('c-lv').style.display='none';G('c-dv').style.display='block';
  G('tb-t').textContent=c.name;
  rCHdr();
  G('c-tabs').querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('on',i===0));
  rCT('bilder');
  const token=localStorage.getItem('token')||'';
  if(!token)return;
  fetch('/api/uploads?creatorId='+String(id),{headers:{'Authorization':'Bearer '+token}})
    .then(r=>r.json()).then(uploads=>{
      if(!Array.isArray(uploads))return;
      const tabMap={'bilder':'bilder','videos':'videos','roh':'roh','auswertung':'auswertung','pdf':'bilder','link':'bilder','file':'bilder'};
      uploads.forEach(u=>{
        const tab=tabMap[u.tab]||'bilder';
        if(!c.flds[tab])c.flds[tab]=[];
        let fld=c.flds[tab].find(f=>f.id==='__db_uploads__');
        if(!fld){fld={id:'__db_uploads__',name:'Uploads',batch:'Creator Upload',date:new Date().toISOString().slice(0,10),deadline:null,prods:[],tags:[],files:[]};c.flds[tab].unshift(fld);}
        if(!fld.files.find(f=>f.id===u.id)){
          fld.files.push({id:u.id,name:u.file_name,type:(u.mime_type||'').startsWith('image/')?'image':(u.mime_type||'').startsWith('video/')?'video':'file',url:u.file_url,size:u.file_size?(u.file_size/1024/1024).toFixed(1)+' MB':'',uploadedAt:u.uploaded_at||null,comments:[],r2Key:u.r2_key,mime_type:u.mime_type,batch:u.batch,product:u.product,label:u.name,creator_id:u.creator_id});
        }
      });
      rCHdr();rCT(S.aCT);
    }).catch(()=>{});
}

function rCHdr(){
  const c=S.aC;if(!c)return;
  const tf=Object.values(c.flds).flat().reduce((s,f)=>s+f.files.length,0);
  const tags=c.tags.map(t=>\`<span class="tag">\${t}</span>\`).join('');
  const av=c.photo?\`<div class="cd-av"><img src="\${c.photo}"></div>\`:\`<div class="cd-av" style="background:\${c.color}">\${c.ini}</div>\`;
  G('c-hdr').innerHTML=\`\${av}
    <div style="flex:1">
      <div style="font-size:16px;font-weight:700;margin-bottom:2px">\${c.name}</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">\${c.email||''} · \${c.age||''}J · \${FL[c.country]||''}</div>
      <div style="display:flex;gap:3px;flex-wrap:wrap">\${tags}\${socialBadge(c)}\${verguetungBadge(c)}</div>
      \${kidsBadges(c)?\`<div style="margin-top:4px">\${kidsBadges(c)}</div>\`:''}
    </div>
    <div style="display:flex;gap:10px;flex-shrink:0">
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${(c.flds.bilder||[]).length}</strong><span style="font-size:9px;color:#aaa">Bilder</span></div>
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${(c.flds.videos||[]).length}</strong><span style="font-size:9px;color:#aaa">Videos</span></div>
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${tf}</strong><span style="font-size:9px;color:#aaa">Dateien</span></div>
    </div>
    <button class="dot-btn" id="chdr-dot">···</button>\`;
  G('chdr-dot').addEventListener('click',e=>{e.stopPropagation();showDot(e.currentTarget,()=>openM('editC',c.id),()=>delC(c.id,c.name),()=>openPortal(c.id));});
}

function rCT(tab){
  const c=S.aC;if(!c)return;
  S.bulkSel=[];S.bulkMode=false;

  if(tab==='notizen'){
    G('c-tc').innerHTML=\`
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px">
        <div class="sc" style="padding:16px">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">🔒 Interne Notizen</div>
          <textarea class="fi" id="notiz-inp" rows="4" placeholder="Interne Anmerkungen..." style="resize:vertical">\${c.notizen||''}</textarea>
          <div style="font-size:13px;font-weight:600;margin-top:14px;margin-bottom:4px">💬 Hinweis für Creator</div>
          <textarea class="fi" id="notiz-creator-inp" rows="4" placeholder="z.B. Bitte immer Story-Format verwenden." style="resize:vertical">\${c.notizenCreator||''}</textarea>
          <button class="btn btn-p" style="width:100%;margin-top:8px" id="notiz-save">Notizen speichern</button>
        </div>
        <div class="sc" style="padding:16px">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">💶 Vergütungsmodell</div>
          <div class="fg"><label class="fl">Modell</label>
            <select class="fi" id="verg-model">
              <option value="provision" \${c.verguetung==='provision'?'selected':''}>Provision (%)</option>
              <option value="fix" \${c.verguetung==='fix'?'selected':''}>Fixbetrag (€)</option>
              <option value="beides" \${c.verguetung==='beides'?'selected':''}>Beides</option>
            </select>
          </div>
          <div class="fg" id="verg-prov-wrap"><label class="fl">Provision %</label><input class="fi" id="verg-prov" type="number" value="\${c.provision||''}"></div>
          <div class="fg" id="verg-fix-wrap"><label class="fl">Fixbetrag €</label><input class="fi" id="verg-fix" type="number" value="\${c.fixbetrag||''}"></div>
          <button class="btn btn-p" style="width:100%" id="verg-save">Vergütung speichern</button>
        </div>
        <div class="sc" style="padding:16px">
          <div style="font-size:13px;font-weight:600;margin-bottom:12px">📄 Vertrag</div>
          <div id="vertrag-preview">
            \${c.vertragUrl?'<div style="display:flex;align-items:center;gap:8px;background:#f0f4ff;border:1.5px solid #c7d7ff;border-radius:10px;padding:10px 12px"><span style="font-size:20px">📄</span><div><div style="font-size:12px;font-weight:600;color:#1a1a2e">'+c.vertragName+'</div><div style="font-size:10px;color:var(--muted)">Gespeichert in Supabase</div></div><a href="'+c.vertragUrl+'" target=\"_blank\" style="margin-left:auto;font-size:10px;color:var(--blue);font-weight:600;text-decoration:none">↓ Öffnen</a></div>':'<div style="font-size:12px;color:var(--muted);padding:8px 0">Noch kein Vertrag hochgeladen</div>'}
          </div>
          <label style="display:block;margin-top:12px;cursor:pointer">
            <div class="btn" style="width:100%;justify-content:center;font-size:12px">📎 PDF hochladen</div>
            <input type="file" accept="application/pdf" id="vertrag-inp" style="display:none">
          </label>
          <div style="font-size:10px;color:var(--muted);margin-top:6px;text-align:center">Nur PDF · Max. 5 MB</div>
        </div>
      </div>\\`;
    G('notiz-save').addEventListener('click',function(){
      var token=localStorage.getItem('token')||'';
      c.notizen=G('notiz-inp').value;c.notizenCreator=G('notiz-creator-inp').value;
      fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({id:String(c.id),notizen:c.notizen,notizen_creator:c.notizenCreator})}).catch(function(){});
      showT('Notizen gespeichert ✓');
    });
    G('verg-save').addEventListener('click',function(){
      var token=localStorage.getItem('token')||'';
      c.verguetung=G('verg-model').value;c.provision=G('verg-prov')?.value||'';c.fixbetrag=G('verg-fix')?.value||'';
      fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({id:String(c.id),verguetung:c.verguetung,provision:c.provision,fixbetrag:c.fixbetrag})}).catch(function(){});
      rCHdr();showT('Vergütung gespeichert ✓');
    });
    // Vertrag Upload Handler – zu R2 + Supabase
    G('vertrag-inp')?.addEventListener('change',function(){
      var file=this.files[0];if(!file)return;
      if(file.type!=='application/pdf'){showT('Nur PDF-Dateien erlaubt');return;}
      if(file.size>5*1024*1024){showT('PDF max. 5 MB');return;}
      var token=localStorage.getItem('token')||'';
      showT('⏳ Vertrag wird hochgeladen...');
      // 1. Signed URL von R2 holen
      fetch('/api/upload-url',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({fileName:file.name,fileType:'application/pdf',creatorId:String(c.id),tab:'vertrag'})})
        .then(function(r){return r.json();})
        .then(function(d){
          if(!d.signedUrl){showT('Fehler beim Upload');return;}
          // 2. Datei direkt zu R2 hochladen
          return fetch(d.signedUrl,{method:'PUT',headers:{'Content-Type':'application/pdf'},body:file})
            .then(function(){
              // 3. URL in Supabase speichern
              return fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
                body:JSON.stringify({id:String(c.id),vertrag_url:d.publicUrl,vertrag_name:file.name})});
            })
            .then(function(){
              c.vertragUrl=d.publicUrl;c.vertragName=file.name;
              var prev=G('vertrag-preview');
              if(prev)prev.innerHTML='<div style="display:flex;align-items:center;gap:8px;background:#f0f4ff;border:1.5px solid #c7d7ff;border-radius:10px;padding:10px 12px">'
                +'<span style="font-size:20px">📄</span>'
                +'<div><div style="font-size:12px;font-weight:600;color:#1a1a2e">'+file.name+'</div>'
                +'<div style="font-size:10px;color:var(--muted)">In Supabase gespeichert</div></div>'
                +'<a href="'+d.publicUrl+'" target="_blank" style="margin-left:auto;font-size:10px;color:var(--blue);font-weight:600;text-decoration:none">↓ Öffnen</a>'
                +'</div>';
              showT('Vertrag gespeichert ✓');
            });
        }).catch(function(){showT('Netzwerkfehler beim Vertrag-Upload');});
    });
    return;
  }

  const flds=[...(c.flds[tab]||[])].sort((a,b)=>new Date(b.date)-new Date(a.date));
  const ico={bilder:'🖼️',videos:'🎬',roh:'📹',auswertung:'📊'};

  if(!flds.length){
    G('c-tc').innerHTML=\`<div class="empty"><div style="font-size:22px">\${ico[tab]}</div><div style="margin:4px 0 8px">Keine Ordner</div><button class="btn btn-p" id="ct-add">+ Ordner anlegen</button></div>\`;
    G('ct-add')?.addEventListener('click',()=>openM('addFld',tab));return;
  }

  let html='<div class="fg-grid">';
  flds.forEach(f=>{
    const d=new Date(f.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});
    const tg=f.tags.map(t=>\`<span class="tag" style="background:#f0fdf4;color:#166634;border-color:#bbf7d0;font-size:9px">\${t}</span>\`).join('');
    const dl=deadlineStatus(f.deadline);
    const isLate=f.deadline&&new Date(f.deadline)<new Date();
    html+=\`<div class="fcard\${isLate?' deadline-red':''}" data-fld="\${f.id}" data-tab="\${tab}">
      <button class="dot-btn" data-fld-dot="\${f.id}" style="position:absolute;top:7px;right:7px">···</button>
      <div style="font-size:19px;margin-bottom:5px">\${ico[tab]}</div>
      <div style="font-size:11px;font-weight:600;margin-bottom:2px">\${f.name}</div>
      <div style="font-size:10px;color:var(--muted);line-height:1.5">📅 \${d}<br>📝 \${f.batch}<br>📁 \${f.files.length} Dateien</div>
      \${dl?\`<div style="margin-top:4px">\${dl}</div>\`:''}
      \${tg?\`<div style="display:flex;gap:2px;flex-wrap:wrap;margin-top:3px">\${tg}</div>\`:''}
    </div>\`;
  });
  html+=\`<div class="add-fcard" id="ct-add-fc"><div style="font-size:16px">📁</div><span style="font-size:10px;font-weight:500">Ordner anlegen</span></div></div>\`;
  G('c-tc').innerHTML=html;
  G('ct-add-fc')?.addEventListener('click',()=>openM('addFld',tab));
  G('c-tc').querySelectorAll('[data-fld]').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openFld(card.dataset.fld,card.dataset.tab);}));
  G('c-tc').querySelectorAll('[data-fld-dot]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();
    const fid=btn.dataset.fldDot;const t2=btn.closest('[data-tab]')?.dataset.tab||S.aCT;
    const folder=S.aC?.flds[t2]?.find(f=>String(f.id)===String(fid));
    if(folder)showDot(btn,()=>openM('editFld',{id:fid,tab:t2}),()=>delFld(fid,t2,folder.name));
  }));
}

function openFld(fid,tab){
  const c=S.aC;if(!c)return;
  const fld=c.flds[tab]?.find(f=>String(f.id)===String(fid));if(!fld)return;
  S.aF={fld,tab};S.bulkSel=[];S.bulkMode=false;
  const d=new Date(fld.date).toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'});
  const dl=deadlineStatus(fld.deadline);
  G('c-tc').innerHTML=\`
    <button class="bk" id="bk-fld">← Ordner</button>
    <div style="background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:11px 13px;margin-bottom:11px;display:flex;align-items:flex-start;gap:9px">
      <div style="font-size:24px;flex-shrink:0">📁</div>
      <div style="flex:1">
        <div style="font-size:12px;font-weight:700;margin-bottom:2px">\${fld.name}</div>
        <div style="font-size:10px;color:var(--muted);margin-bottom:4px">📅 \${d} · 📝 \${fld.batch} · \${fld.files.length} Dateien \${dl?'· '+dl.replace(/<[^>]*>/g,''):''}</div>
        <div style="display:flex;gap:3px;flex-wrap:wrap">\${fld.prods.map(p=>\`<span class="tag">\${p}</span>\`).join('')}\${fld.tags.map(t=>\`<span class="tag" style="background:#f0fdf4;color:#166634;border-color:#bbf7d0">\${t}</span>\`).join('')}</div>
      </div>
      <div style="display:flex;gap:5px;align-items:center">
        <button class="btn btn-sm" id="bulk-toggle">☐ Auswahl</button>
        <button class="dot-btn" id="fhdr-dot">···</button>
      </div>
    </div>
    <div class="bulk-bar" id="bulk-bar">
      <span id="bulk-count">0 ausgewählt</span>
      <button class="btn btn-sm" style="background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.3)" id="bulk-upload">✓ Als hochgeladen markieren</button>
      <button class="btn btn-sm" style="background:rgba(255,0,0,.3);color:#fff;border-color:rgba(255,0,0,.3)" id="bulk-del">🗑 Löschen</button>
      <button class="btn btn-sm" style="margin-left:auto;background:rgba(255,255,255,.2);color:#fff;border-color:rgba(255,255,255,.3)" id="bulk-cancel">Abbrechen</button>
    </div>
    <div class="file-grid" id="ff-grid"></div>\`;
  G('bk-fld').addEventListener('click',()=>{S.aF=null;rCT(S.aCT);});
  G('fhdr-dot').addEventListener('click',e=>{e.stopPropagation();showDot(e.currentTarget,()=>openM('editFld',{id:fid,tab}),()=>delFld(fid,tab,fld.name));});
  G('bulk-toggle').addEventListener('click',()=>{S.bulkMode=!S.bulkMode;S.bulkSel=[];G('bulk-bar').classList.toggle('on',S.bulkMode);G('bulk-toggle').textContent=S.bulkMode?'☑ Auswahl':'☐ Auswahl';rFiles(fld);});
  G('bulk-cancel').addEventListener('click',()=>{S.bulkMode=false;S.bulkSel=[];G('bulk-bar').classList.remove('on');G('bulk-toggle').textContent='☐ Auswahl';rFiles(fld);});
  G('bulk-upload').addEventListener('click',()=>{const today=new Date().toISOString().slice(0,10);S.bulkSel.forEach(id=>{const f=fld.files.find(x=>x.id===id);if(f)f.uploadedAt=today;});S.bulkSel=[];rFiles(fld);showT('✓ Als hochgeladen markiert');});
  G('bulk-del').addEventListener('click',()=>{askConfirm(\`\${S.bulkSel.length} Dateien löschen?\`,()=>{fld.files=fld.files.filter(f=>!S.bulkSel.includes(f.id));S.bulkSel=[];rFiles(fld);rCHdr();showT('Gelöscht');});});
  rFiles(fld);
  // Ungelesene Kommentare für jede Datei laden (read_by_admin=false)
  var _adminToken=localStorage.getItem('token')||'';
  fld.files.forEach(function(f){
    if(!f.id||f.type==='link')return;
    fetch('/api/comments?upload_id='+f.id,{headers:{'Authorization':'Bearer '+_adminToken}})
      .then(function(r){return r.json();})
      .then(function(cms){
        if(!Array.isArray(cms))return;
        f.unread_comments=cms.filter(function(c){return !c.read_by_admin;}).length;
        if(f.unread_comments>0)rFiles(fld);
      }).catch(function(){});
  });
}

function rFiles(fld){
  const el=G('ff-grid');if(!el)return;
  if(!fld.files.length){
    el.innerHTML=\`<div class="empty" style="grid-column:1/-1"><div>📂</div><div style="margin:4px 0 8px">Keine Dateien</div><button class="btn btn-p" id="no-f-btn">+ Upload</button></div>\`;
    G('no-f-btn')?.addEventListener('click',()=>openM('upload'));return;
  }
  el.innerHTML=fld.files.map(f=>{
    const isI=f.type==='image'||(f.mime_type||'').startsWith('image/'),isV=f.type==='video'||(f.mime_type||'').startsWith('video/');
    const th=f.url?(isI?\`<img src="\${f.url}">\`:\`<video src="\${f.url}" preload="metadata"></video>\`):\`<span>\${isI?'🖼️':isV?'🎬':'📄'}</span>\`;
    const pov=isV?\`<div class="play-ov"><div class="play-btn">▶</div></div>\`:'';
    const isSel=S.bulkSel.includes(f.id);
    const cbHtml=S.bulkMode?\`<div class="fi-sel-cb">\${isSel?'✓':''}</div>\`:'';
    const commBadge=f.unread_comments>0?\`<div class="fi-comment-badge">\${f.unread_comments}</div>\`:(f.comments&&f.comments.length?\`<div class="fi-comment-badge" style="background:#888">\${f.comments.length}</div>\`:'');
    const upClass=f.uploadedAt?'fi-done':'fi-undone';
    const upTitle=f.uploadedAt?\`Hochgeladen: \${new Date(f.uploadedAt).toLocaleDateString('de-DE')}\`:'Als hochgeladen markieren';
    return\`<div class="ficard\${isSel?' selected':''}" data-fcid="\${f.id}">
      <div class="fi-thumb" data-lb="\${f.id}" data-lb-fld="\${fld.id}">\${th}\${pov}\${cbHtml}\${commBadge}</div>
      <div class="fi-info">
        <div class="fi-name" title="\${f.name}">\${f.name}</div>
        <div class="fi-meta">\${f.batch?'<div>📦 '+f.batch+'</div>':''}\${f.product?'<div>🏷️ '+f.product+'</div>':''}\${f.size?'<div>'+f.size+'</div>':''}</div>
        <div class="fi-acts">
          <button class="fi-btn" data-dl="\${f.id}" data-dl-url="\${f.url}" data-dl-name="\${f.name}">⬇</button>
          <button class="fi-btn \${upClass}" data-up="\${f.id}" data-ufl="\${fld.id}" title="\${upTitle}">\${f.uploadedAt?'✓':'○'}</button>
          <button class="fi-btn del" data-df="\${f.id}" data-dfl="\${fld.id}">🗑</button>
        </div>
      </div>
    </div>\`;
  }).join('')+\`<div class="add-fcard" style="min-height:110px" id="add-fi-btn"><div>+</div><span style="font-size:10px">Upload</span></div>\`;

  el.querySelectorAll('[data-dl]').forEach(btn=>btn.addEventListener('click',(e)=>{
    e.stopPropagation();
    const url=btn.dataset.dlUrl,name=btn.dataset.dlName;
    const a=document.createElement('a');a.href='/api/download?url='+encodeURIComponent(url)+'&name='+encodeURIComponent(name);a.download=name;document.body.appendChild(a);a.click();document.body.removeChild(a);
  }));
  el.querySelectorAll('[data-lb]').forEach(t=>t.addEventListener('click',()=>{
    if(S.bulkMode){
      const fid=t.dataset.lb;
      if(S.bulkSel.includes(fid))S.bulkSel=S.bulkSel.filter(x=>x!==fid);else S.bulkSel.push(fid);
      G('bulk-count').textContent=S.bulkSel.length+' ausgewählt';
      rFiles(fld);return;
    }
    openLB(t.dataset.lb,t.dataset.lbFld);
  }));
  el.querySelectorAll('[data-df]').forEach(btn=>btn.addEventListener('click',()=>delFile(btn.dataset.df,btn.dataset.dfl)));
  G('add-fi-btn')?.addEventListener('click',()=>openM('upload'));
}

function findFld(fldId){if(!S.aC)return null;for(const tab of Object.keys(S.aC.flds)){const f=S.aC.flds[tab].find(x=>String(x.id)===String(fldId));if(f)return f;}return null;}

// ── LIGHTBOX ── ORIGINAL VERSION (vor Kommentar-API-Änderungen)
function openLB(fid,fldId){
  const c=S.aC;if(!c)return;let fld=null,file=null;
  for(const tab of Object.keys(c.flds)){const f=c.flds[tab].find(x=>String(x.id)===String(fldId));if(f){fld=f;file=f.files.find(x=>x.id===fid);break;}}
  if(!file)return;
  S.activeLbFile=file;S.activeLbFld=fld;
  G('lb-name').textContent=file.name;G('lb-meta').textContent=\`\${file.size||''} · \${fld?.name||''}\`;
  G('lb-dl').onclick=()=>{const a=document.createElement('a');a.href='/api/download?url='+encodeURIComponent(file.url)+'&name='+encodeURIComponent(file.name);a.download=file.name;document.body.appendChild(a);a.click();document.body.removeChild(a);};
  const li=G('lb-img'),lv=G('lb-vid');
  if(file.type==='image'&&file.url){li.src=file.url;li.style.display='block';lv.style.display='none';}
  else if(file.type==='video'&&file.url){lv.src=file.url;lv.style.display='block';li.style.display='none';}
  else{li.style.display='none';lv.style.display='none';}
  rLbComments([]);
  var _lbToken=localStorage.getItem('token')||'';
  fetch('/api/comments?upload_id='+file.id,{headers:{'Authorization':'Bearer '+_lbToken}})
    .then(function(r){return r.json();})
    .then(function(comments){
      S.activeLbComments=comments||[];
      rLbComments(S.activeLbComments);
      fetch('/api/comments',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+_lbToken},body:JSON.stringify({upload_id:file.id,role:'admin'})});
    }).catch(function(){});
  G('lb').classList.add('open');
}

function rLbComments(comments){
  if(!comments||!comments.length){G('lb-comments-list').innerHTML='<div style="font-size:10px;color:#6b7280">Noch keine Kommentare</div>';return;}
  var html='';
  for(var i=0;i<comments.length;i++){
    var cm=comments[i];
    var bg=cm.author_role==='admin'?'#eff2ff':'rgba(255,255,255,0.12)';
    var dt=new Date(cm.created_at).toLocaleString('de-DE');
    html+='<div class="lb-comment-item" style="background:'+bg+';border-radius:6px;padding:6px 8px;margin-bottom:4px">'
      +'<div style="font-size:9px;opacity:.6;margin-bottom:2px">'+cm.author_name+' · '+dt+'</div>'
      +'<div style="font-size:11px;color:'+(cm.author_role==='admin'?'#4f6ef7':'#e0e0e0')+'">'+cm.message+'</div>'
      +'</div>';
  }
  G('lb-comments-list').innerHTML=html;
}

function closeLB(){G('lb').classList.remove('open');const v=G('lb-vid');v.pause();v.removeAttribute('src');}

// ── UPLOAD STATUS
let _upFid=null,_upFldId=null;
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-up]');
  if(btn){
    e.stopPropagation();
    _upFid=btn.dataset.up;_upFldId=btn.dataset.ufl;
    const fld=findFld(_upFldId);const file=fld?.files.find(x=>String(x.id)===String(_upFid));if(!file)return;
    G('up-date').value=file.uploadedAt?new Date(file.uploadedAt).toISOString().slice(0,10):new Date().toISOString().slice(0,10);
    const m=G('up-menu');m.classList.add('open');
    const r=btn.getBoundingClientRect();m.style.top=(r.bottom+4)+'px';m.style.left=Math.max(4,r.left-50)+'px';
    return;
  }
  if(!e.target.closest('#up-menu'))G('up-menu').classList.remove('open');
});
G('up-ok').addEventListener('click',function(){
  var dateVal=G('up-date').value;if(!dateVal)return;
  var fld=findFld(_upFldId);var file=fld?.files.find(function(x){return String(x.id)===String(_upFid);});
  if(file){
    file.uploadedAt=dateVal;
    rFiles(fld);
    showT('Upload-Datum gesetzt ✓');
    // In DB speichern
    var _token=localStorage.getItem('token')||'';
    fetch('/api/uploads',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+_token},
      body:JSON.stringify({uploadId:String(file.id),uploaded_at:dateVal})})
      .catch(function(){});
    // S.allUploads aktualisieren
    var uIdx=S.allUploads.findIndex(function(u){return String(u.id)===String(file.id);});
    if(uIdx>=0)S.allUploads[uIdx].uploaded_at=dateVal;
    rAnalytics();
  }
  G('up-menu').classList.remove('open');
});
G('up-cancel').addEventListener('click',()=>G('up-menu').classList.remove('open'));

// ── COMMENT SEND ── ORIGINAL VERSION
G('lb-comment-send').addEventListener('click',function(){
  var txt=G('lb-comment-inp').value.trim();if(!txt)return;
  if(!S.activeLbFile)return;
  var _lbToken=localStorage.getItem('token')||'';
  fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+_lbToken},
    body:JSON.stringify({upload_id:S.activeLbFile.id,creator_id:S.activeLbFile.creator_id,author_role:'admin',author_name:'Admin',message:txt})})
    .then(function(res){
      if(!res.ok){showT('Fehler beim Senden');return;}
      G('lb-comment-inp').value='';
      fetch('/api/comments?upload_id='+S.activeLbFile.id,{headers:{'Authorization':'Bearer '+_lbToken}})
        .then(function(r){return r.json();})
        .then(function(comments){S.activeLbComments=comments||[];rLbComments(S.activeLbComments);});
      showT('Kommentar gespeichert \u2713');
    }).catch(function(){showT('Fehler beim Senden');});
});
G('lb-comment-inp').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();G('lb-comment-send').click();}});

function delFile(fid,fldId){
  const fileObj=(()=>{for(const t of Object.keys(S.aC?.flds||{})){const f=S.aC.flds[t].find(x=>String(x.id)===String(fldId));if(f){return f.files.find(x=>x.id===fid)||null;}}return null;})();
  askConfirm('Datei löschen?',async()=>{
    const token=localStorage.getItem('token')||localStorage.getItem('creator_token')||'';
    try{await fetch('/api/delete-upload',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({uploadId:String(fid),r2Key:fileObj?.r2Key||null})});}catch(e){}
    for(const t of Object.keys(S.aC.flds)){const f=S.aC.flds[t].find(x=>String(x.id)===String(fldId));if(f){f.files=f.files.filter(x=>x.id!==fid);rFiles(f);rCHdr();showT('Datei gelöscht ✓');return;}}
  });
}
function delFld(fid,tab,name){askConfirm(\`Ordner "\${name}" löschen?\`,async()=>{
  const token=localStorage.getItem('token')||'';
  try{await fetch('/api/folders',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(fid)})});}catch(e){}
  S.aC.flds[tab]=S.aC.flds[tab].filter(f=>String(f.id)!==String(fid));rCT(tab);rCHdr();showT('Ordner gelöscht ✓');
});}
function delC(id,name){askConfirm(\`Creator "\${name}" wirklich löschen?\`,async()=>{
  const token=localStorage.getItem('token')||'';
  try{
    const r=await fetch('/api/creators',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(id)})});
    if(!r.ok){const d=await r.json();showT('Fehler: '+(d.error||''));return;}
  }catch(e){showT('Netzwerkfehler');return;}
  S.creators=S.creators.filter(c=>String(c.id)!==String(id));
  if(String(S.aC?.id)===String(id))showCL();
  rCreators();uBdg();rDash();showT(\`"\${name}" gelöscht ✓\`);
});}
function backC(){S.aC=null;showCL();G('tb-t').textContent='Creator';rCreators();}

function openSearch(){G('search-overlay').classList.add('open');setTimeout(()=>G('search-real').focus(),50);}
function closeSearch(){G('search-overlay').classList.remove('open');G('search-real').value='';}
G('search-real').addEventListener('input',function(e){
  var q=e.target.value.toLowerCase().trim();
  if(!q){G('search-results').innerHTML='<div style="color:var(--muted);font-size:12px;padding:8px 0">Tippe um zu suchen…</div>';return;}
  var results=[];
  var seen={};
  function add(r){var k=r.type+':'+r.label;if(!seen[k]){seen[k]=1;results.push(r);}}

  // Creator nach Name
  S.creators.forEach(function(c){
    if(c.name.toLowerCase().includes(q))
      add({type:'creator',icon:'👤',label:c.name,sub:'Creator'+(c.tags&&c.tags.length?' · '+c.tags.join(', '):''),action:function(){closeSearch();go('creators');setTimeout(function(){openC(c.id);},50);}});
  });

  // Produkte
  S.produkte.forEach(function(p){
    if(p.name.toLowerCase().includes(q))
      add({type:'produkt',icon:'🏷️',label:p.name,sub:'Produkt',action:function(){closeSearch();go('produkte');}});
  });

  // Projekte
  S.projekte.forEach(function(p){
    if(p.name.toLowerCase().includes(q))
      add({type:'projekt',icon:'📋',label:p.name,sub:'Projekt',action:function(){closeSearch();go('projekte');}});
  });

  // Uploads aus S.allUploads: Dateiname, Batch, Produkt
  S.allUploads.forEach(function(u){
    var cr=S.creators.find(function(c){return String(c.id)===String(u.creator_id);});
    var crName=cr?cr.name:'';
    // nach Dateiname / name
    if((u.name||u.file_name||'').toLowerCase().includes(q))
      add({type:'file',icon:'📄',label:u.name||u.file_name,sub:crName+(u.batch?' · '+u.batch:''),action:function(){closeSearch();go('creators');setTimeout(function(){if(cr)openC(cr.id);},50);}});
    // nach Batch
    if(u.batch&&u.batch.toLowerCase().includes(q))
      add({type:'batch',icon:'📦',label:u.batch,sub:'Batch'+(crName?' · '+crName:''),action:function(){closeSearch();go('creators');setTimeout(function(){if(cr)openC(cr.id);},50);}});
    // nach Produkt
    if(u.product&&u.product.toLowerCase().includes(q))
      add({type:'produkt-upload',icon:'🏷️',label:u.product,sub:'Produkt'+(crName?' · '+crName:''),action:function(){closeSearch();go('creators');setTimeout(function(){if(cr)openC(cr.id);},50);}});
  });

  var typeOrder={creator:0,produkt:1,batch:2,'produkt-upload':3,projekt:4,file:5};
  results.sort(function(a,b){return (typeOrder[a.type]||9)-(typeOrder[b.type]||9);});

  var html=results.slice(0,10).map(function(r,i){
    return '<div class="search-result" data-si="'+i+'">'
      +'<div style="width:28px;height:28px;border-radius:8px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:13px;flex-shrink:0">'+r.icon+'</div>'
      +'<div style="flex:1;min-width:0">'
      +'<div style="font-size:12px;font-weight:600;color:#1a1a2e;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+r.label+'</div>'
      +'<div style="font-size:10px;color:var(--muted)">'+r.sub+'</div>'
      +'</div>'
      +'</div>';
  }).join('');
  G('search-results').innerHTML=html||'<div style="color:var(--muted);font-size:12px;padding:8px 0">Keine Ergebnisse für "'+q+'"</div>';
  G('search-results').querySelectorAll('[data-si]').forEach(function(el,i){
    el.addEventListener('click',function(){results[i].action();});
  });
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});
G('search-overlay').addEventListener('click',e=>{if(e.target===G('search-overlay'))closeSearch();});

function rProdukte(){
  let h=S.produkte.map(p=>\`<div class="pcard">
    <button class="dot-btn" data-pd="\${p.id}" style="position:absolute;top:7px;right:7px;z-index:5">···</button>
    <div class="p-img">\${p.url?\`<img src="\${p.url}">\`:\`<span>\${p.icon||'📦'}</span>\`}</div>
    <div style="padding:9px 11px"><div style="font-size:12px;font-weight:600;margin-bottom:1px">\${p.name}</div><div style="font-size:10px;color:var(--muted);margin-bottom:4px">\${p.cat||'–'}</div>
    <div style="display:flex;gap:2px;flex-wrap:wrap">\${(p.tags||[]).map(t=>\`<span class="tag">\${t}</span>\`).join('')}</div>
    </div></div>\`).join('');
  h+=\`<div class="add-fcard" style="min-height:165px" id="add-p-fc"><div style="font-size:20px">+</div><span style="font-size:10px;font-weight:500">Produkt</span></div>\`;
  G('p-grid').innerHTML=h;
  G('add-p-fc')?.addEventListener('click',()=>openM('addP'));
  G('p-grid').querySelectorAll('[data-pd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const pid=+btn.dataset.pd;const p=S.produkte.find(x=>x.id===pid);if(p)showDot(btn,()=>openM('editP',pid),()=>delP(pid,p.name));}));
}
function delP(id,name){askConfirm(\`Produkt "\${name}" löschen?\`,()=>{S.produkte=S.produkte.filter(p=>p.id!==id);rProdukte();uBdg();showT(\`"\${name}" gelöscht ✓\`);saveAppData('produkte',S.produkte);});}

function showPJL(){G('pj-lv').style.display='block';G('pj-dv').style.display='none';}
function rProjekte(){
  let h=S.projekte.map(p=>{
    const pr=S.produkte.filter(x=>(p.pids||[]).includes(x.id));
    const asgn=(p.cids||[]).length;const pct=p.count>0?Math.min(100,Math.round(asgn/p.count*100)):0;
    const sd=p.start?new Date(p.start).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'}):'–';
    return\`<div class="pjcard" data-pjid="\${p.id}">
      <button class="dot-btn" data-pjd="\${p.id}" style="position:absolute;top:9px;right:9px">···</button>
      <span class="pill \${p.status==='active'?'s-a':'s-p'}">\${p.status==='active'?'● Aktiv':'○ Geplant'}</span>
      <div style="font-size:13px;font-weight:600;margin-bottom:4px;padding-right:24px">\${p.name}</div>
      <div style="font-size:11px;color:var(--muted);line-height:1.6">\${pr.length?\`📦 \${pr.map(x=>x.name).join(', ')}<br>\`:''}\${p.aktion?\`🏷️ \${p.aktion}<br>\`:''}📅 \${sd}</div>
      <div class="prog-w"><div class="prog-b" style="width:\${pct}%"></div></div>
      <div style="font-size:10px;color:var(--muted);margin-top:3px">👥 \${asgn}/\${p.count} Creator</div>
    </div>\`;
  }).join('');
  h+=\`<div class="add-fcard" style="min-height:140px" id="add-pj-fc"><div style="font-size:20px">+</div><span style="font-size:10px;font-weight:500">Projekt anlegen</span></div>\`;
  G('pj-grid').innerHTML=h;
  G('add-pj-fc')?.addEventListener('click',()=>openM('addPJ'));
  G('pj-grid').querySelectorAll('[data-pjid]').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openPJ(+card.dataset.pjid);}));
  G('pj-grid').querySelectorAll('[data-pjd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const pid=+btn.dataset.pjd;const p=S.projekte.find(x=>x.id===pid);if(p)showDot(btn,()=>openM('editPJ',pid),()=>delPJ(pid,p.name));}));
}
function openPJ(id){const p=S.projekte.find(x=>x.id===id);if(!p)return;S.aPJ=p;S.aPT='bilder';G('pj-lv').style.display='none';G('pj-dv').style.display='block';G('tb-t').textContent=p.name;rPJHdr();G('pj-tabs').querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('on',i===0));rPJT('bilder');}
function rPJHdr(){
  const p=S.aPJ;if(!p)return;
  const pr=S.produkte.filter(x=>(p.pids||[]).includes(x.id));
  const sd=p.start?new Date(p.start).toLocaleDateString('de-DE',{day:'2-digit',month:'long',year:'numeric'}):'–';
  G('pj-hdr').innerHTML=\`
    <div style="display:flex;align-items:flex-start;gap:11px;margin-bottom:10px">
      <div style="width:48px;height:48px;border-radius:8px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📁</div>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;margin-bottom:2px">\${p.name}</div>
        <div style="font-size:11px;color:var(--muted)">\${pr.map(x=>x.name).join(', ')||'–'} · \${sd}</div>
      </div>
      <button class="dot-btn" id="pjhdr-dot">···</button>
    </div>\`;
  G('pjhdr-dot')?.addEventListener('click',e=>{e.stopPropagation();showDot(e.currentTarget,()=>openM('editPJ',p.id),()=>delPJ(p.id,p.name));});
}
function rPJT(tab){G('pj-tc').innerHTML=\`<div class="empty">Keine Inhalte</div>\`;}
function backPJ(){S.aPJ=null;showPJL();G('tb-t').textContent='Projekte';rProjekte();}
function delPJ(id,name){askConfirm(\`Projekt "\${name}" löschen?\`,()=>{S.projekte=S.projekte.filter(p=>p.id!==id);if(S.aPJ?.id===id)backPJ();else rProjekte();uBdg();showT(\`"\${name}" gelöscht ✓\`);saveAppData('projekte',S.projekte);});}

function showKL(){G('k-lv').style.display='block';G('k-dv').style.display='none';}
function rKat(){
  let h=S.kat.map(k=>{const af=S.creators.flatMap(c=>c.flds[k.type]||[]);return\`<div class="fcard" data-kid="\${k.id}">
    <button class="dot-btn" data-kd="\${k.id}" style="position:absolute;top:7px;right:7px">···</button>
    <div style="font-size:22px;margin-bottom:6px">\${k.icon}</div>
    <div style="font-size:11px;font-weight:600;margin-bottom:2px">\${k.name}</div>
    <div style="font-size:10px;color:var(--muted)">\${af.length} Ordner</div>
  </div>\`;}).join('');
  h+=\`<div class="add-fcard" id="add-k-fc"><div style="font-size:18px">+</div><span style="font-size:10px;font-weight:500">Kategorie</span></div>\`;
  G('k-grid').innerHTML=h;
  G('add-k-fc')?.addEventListener('click',()=>openM('addK'));
  G('k-grid').querySelectorAll('[data-kid]').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openK(+card.dataset.kid);}));
  G('k-grid').querySelectorAll('[data-kd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const k=S.kat.find(x=>x.id===+btn.dataset.kd);if(k)showDot(btn,()=>openM('editK',k.id),()=>delK(k.id,k.name));}));
}
function openK(id){const k=S.kat.find(x=>x.id===id);if(!k)return;S.aK=k;G('k-lv').style.display='none';G('k-dv').style.display='block';G('tb-t').textContent=k.name;G('k-dhdr').innerHTML=\`<div class="ph-t">\${k.icon} \${k.name}</div>\`;G('k-fg').innerHTML=\`<div class="empty">Keine Inhalte</div>\`;}
function backK(){S.aK=null;showKL();G('tb-t').textContent='Kategorien';rKat();}
function delK(id,name){askConfirm(\`"\${name}" löschen?\`,()=>{S.kat=S.kat.filter(k=>k.id!==id);rKat();showT(\`"\${name}" gelöscht ✓\`);saveAppData('kat',S.kat);});}

function rTeam(){
  G('t-tot').textContent=S.team.length;
  G('t-adm').textContent=S.team.filter(function(m){return m.role==='admin';}).length;
  G('t-pen').textContent=S.team.filter(function(m){return m.status==='pending';}).length;
  G('t-rows').innerHTML=S.team.map(function(m){
    var av=m.name.split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();
    var roleSelect=m.you
      ?'<span style="font-size:10px;color:var(--muted)">Du</span>'
      :'<select style="background:var(--lt);border:1px solid var(--bdr);border-radius:5px;padding:2px 6px;font-size:11px;outline:none;font-family:inherit" data-ri="'+m.id+'">'
        +'<option value="admin" '+(m.role==='admin'?'selected':'')+'>Admin</option>'
        +'<option value="read" '+(m.role==='read'?'selected':'')+'>Lesen</option>'
        +'</select>';
    var statusBadge=m.status==='active'
      ?'<span style="color:var(--grn);font-size:10px;font-weight:600">● Aktiv</span>'
      :'<span style="color:var(--org);font-size:10px;font-weight:600">◌ Ausstehend</span>';
    var dotBtn=!m.you?'<button class="dot-btn" data-tm-id="'+m.id+'" data-tm-email="'+(m.email||'')+'" data-tm-name="'+m.name+'">···</button>':'';
    return '<div class="tr" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px">'
      +'<div style="display:flex;align-items:center;gap:6px">'
      +'<div style="width:28px;height:28px;border-radius:8px;background:linear-gradient(135deg,var(--blue),var(--blue2));display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:700;color:#fff">'+av+'</div>'
      +'<span style="font-size:12px;font-weight:500">'+m.name+(m.you?' (Du)':'')+'</span></div>'
      +'<div style="font-size:11px;color:var(--muted)">'+m.email+'</div>'
      +'<div>'+roleSelect+'</div>'
      +'<div>'+statusBadge+'</div>'
      +'<div>'+dotBtn+'</div>'
      +'</div>';
  }).join('');
  // 3-Punkte-Menü Handler
  G('t-rows').querySelectorAll('[data-tm-id]').forEach(function(btn){
    btn.addEventListener('click',function(e){
      e.stopPropagation();
      var mid=btn.dataset.tmId;
      var memail=btn.dataset.tmEmail;
      var mname=btn.dataset.tmName;
      showDot(btn,
        // Erneut einladen
        function(){
          if(!memail){showT('Keine E-Mail hinterlegt');return;}
          var token=localStorage.getItem('token')||'';
          showT('⏳ Einladung wird gesendet...');
          fetch('/api/team/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
            body:JSON.stringify({name:mname,email:memail,role:'read'})})
            .then(function(r){return r.json();})
            .then(function(d){
              if(d.success||d.error==='E-Mail bereits registriert'){showT('✓ Einladung erneut gesendet an '+memail);}
              else{showT('Fehler: '+(d.error||''));}
            }).catch(function(){showT('Netzwerkfehler');});
        },
        // Löschen
        function(){
          askConfirm('Mitglied "'+mname+'" entfernen?',function(){
            var token=localStorage.getItem('token')||'';
            fetch('/api/team/members',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
              body:JSON.stringify({id:mid})})
              .then(function(){
                S.team=S.team.filter(function(x){return String(x.id)!==String(mid);});
                rTeam();showT('"'+mname+'" entfernt ✓');
              }).catch(function(){showT('Fehler beim Löschen');});
          });
        },
        null
      );
    });
  });
}

function rCInvite(){
  const notInvited=S.creators.filter(c=>!c.invited);
  G('ci-sel').innerHTML='<option value="">– Creator wählen –</option>'+notInvited.map(c=>'<option value="'+c.id+'">'+c.name+(c.email?' ('+c.email+')':'')+'</option>').join('');
  G('ci-sel').onchange=function(){
    const cid=this.value;const c=S.creators.find(x=>String(x.id)===String(cid));
    if(c){
      if(c.email){G('ci-email-wrap').style.display='none';G('ci-email').value=c.email;}
      else{G('ci-email-wrap').style.display='block';G('ci-email').value='';}
      G('ci-preview').style.display='block';
      G('ci-preview').innerHTML='<strong>'+c.name+'</strong>'+(c.email?'<br>📧 '+c.email:'')+'<br>🏷️ '+(c.tags.join(', ')||'Keine Tags');
    }else{G('ci-email-wrap').style.display='none';G('ci-preview').style.display='none';}
  };
  G('ci-prod').innerHTML=\`<option value="">– Kein Produkt –</option>\`+S.produkte.map(p=>\`<option value="\${p.id}">\${p.name}</option>\`).join('');
  const invited=S.creators.filter(c=>c.invited);
  if(!invited.length){
    G('ci-list').innerHTML='<div style="color:var(--muted);font-size:12px">Noch keine Creator eingeladen</div>';
    return;
  }
  G('ci-list').innerHTML=invited.map(function(c){
    var isAktiv=c.status==='aktiv';
    var statusBadge=isAktiv
      ?'<span style="display:inline-flex;align-items:center;gap:3px;background:#f0fdf4;color:#16a34a;border:1px solid #bbf7d0;border-radius:20px;font-size:10px;font-weight:600;padding:2px 8px">● Aktiv</span>'
      :'<span style="display:inline-flex;align-items:center;gap:3px;background:#f4f5f7;color:#9999bb;border:1px solid #e8e8f0;border-radius:20px;font-size:10px;font-weight:600;padding:2px 8px">○ Nicht aktiv</span>';
    return '<div style="padding:10px 0;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;gap:8px">'
      +'<div style="display:flex;align-items:center;gap:8px;flex:1;min-width:0">'
      +(c.photo?'<img src="'+c.photo+'" style="width:28px;height:28px;border-radius:8px;object-fit:cover;flex-shrink:0">'
        :'<div style="width:28px;height:28px;border-radius:8px;background:'+c.color+';display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;color:#fff;flex-shrink:0">'+c.ini+'</div>')
      +'<div><div style="font-size:12px;font-weight:600;color:#1a1a2e">'+c.name+'</div>'
      +(c.email?'<div style="font-size:10px;color:var(--muted)">'+c.email+'</div>':'')
      +'</div></div>'
      +'<div style="display:flex;align-items:center;gap:6px;flex-shrink:0">'
      +statusBadge
      +'<button class="btn btn-sm" data-resend-id="'+c.id+'" style="font-size:10px;padding:3px 8px" title="Link erneut senden">↗ Erneut</button>'
      +'</div>'
      +'</div>';
  }).join('');
  // Resend-Button Handler
  G('ci-list').querySelectorAll('[data-resend-id]').forEach(function(btn){
    btn.addEventListener('click',function(){
      var c=S.creators.find(function(x){return String(x.id)===String(btn.dataset.resendId);});
      if(!c)return;
      var email=c.email;
      if(!email){showT('Keine E-Mail für diesen Creator hinterlegt');return;}
      btn.textContent='⏳';btn.disabled=true;
      var token=localStorage.getItem('token')||'';
      fetch('/api/creators/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({creatorId:c.id,email:email,name:c.name})})
        .then(function(r){return r.json();})
        .then(function(data){
          if(data.success){showT('✓ Einladung erneut gesendet an '+email);}
          else{showT('Fehler: '+(data.error||''));}
          btn.textContent='↗ Erneut';btn.disabled=false;
        }).catch(function(){showT('Netzwerkfehler');btn.textContent='↗ Erneut';btn.disabled=false;});
    });
  });
}

let _portalCreator=null;
function openPortal(cid){
  const c=S.creators.find(x=>String(x.id)===String(cid))||S.creators[0];
  if(!c)return;
  _portalCreator=c;
  G('creator-portal').querySelector('#portal-user-label').innerHTML=\`Angemeldet als: <strong>\${c.name}</strong>\`;
  G('creator-portal').classList.add('open');
  renderPortalPage('home');
}
function renderPortalPage(page){
  G('creator-portal').querySelectorAll('.ni').forEach(n=>n.classList.remove('on'));
  G('pni-'+page)?.classList.add('on');
  const c=_portalCreator;if(!c)return;
  const main=G('portal-main');
  if(page==='home'){
    const tf=Object.values(c.flds).flat().reduce((s,f)=>s+f.files.length,0);
    main.innerHTML=\`
      <div class="ph"><div><div class="ph-t">Hallo \${c.name.split(' ')[0]}! 👋</div></div></div>
      <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="sc"><div class="sl">Ordner</div><div class="sv">\${Object.values(c.flds).flat().length}</div></div>
        <div class="sc"><div class="sl">Dateien</div><div class="sv">\${tf}</div></div>
        <div class="sc"><div class="sl">Hochgeladen</div><div class="sv" style="color:var(--grn)">\${Object.values(c.flds).flat().reduce((s,f)=>s+f.files.filter(x=>x.uploadedAt).length,0)}</div></div>
      </div>
      \${c.notizenCreator?\`<div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:9px;padding:12px 14px;margin-bottom:13px;font-size:12px;color:#1e40af"><strong>💬 Hinweis vom Team:</strong><br>\${c.notizenCreator}</div>\`:''}
      <div style="font-size:12px;font-weight:600;margin-bottom:8px">Meine Ordner</div>
      <div class="fg-grid" id="portal-fld-grid"></div>\`;

    // Ordner rendern mit Klick-Handler
    const pGrid=G('portal-fld-grid');
    const allFlds=Object.entries(c.flds).flatMap(([tab,flds])=>flds.map(f=>Object.assign({},f,{_tab:tab})));
    if(!allFlds.length){pGrid.innerHTML='<div class="empty">Noch keine Ordner vorhanden</div>';return;}

    function renderPortalFolders(){
      const icoMap={bilder:'🖼️',videos:'🎬',roh:'📹',auswertung:'📊'};
      pGrid.innerHTML=allFlds.map(function(f,fi){
        return '<div class="fcard" data-pfi="'+fi+'" style="cursor:pointer">'
          +'<div style="font-size:18px;margin-bottom:5px">'+(icoMap[f._tab]||'📁')+'</div>'
          +'<div style="font-size:11px;font-weight:600">'+f.name+'</div>'
          +'<div style="font-size:10px;color:var(--muted)">'+f.files.length+' Dateien</div>'
          +'</div>';
      }).join('');
      pGrid.querySelectorAll('[data-pfi]').forEach(function(card){
        card.addEventListener('click',function(){
          var fi=+card.dataset.pfi;
          var fld=allFlds[fi];
          openPortalFolderFiles(fld,c);
        });
      });
    }
    renderPortalFolders();

  }else if(page==='upload'){
    main.innerHTML=\`<div class="ph"><div class="ph-t">Hochladen</div></div><div class="empty">Upload-Funktion im Creator Portal</div>\`;
  }else if(page==='tips'){
    main.innerHTML=\`<div class="ph"><div class="ph-t">💡 Tipps & Tricks</div></div><div class="empty">Inhalte vom Team erscheinen hier</div>\`;
  }
}

function openPortalFolderFiles(fld,creator){
  var token=localStorage.getItem('creator_token')||localStorage.getItem('token')||'';
  var main=G('portal-main');
  var icoMap={bilder:'🖼️',videos:'🎬',roh:'📹',auswertung:'📊'};

  function renderFiles(){
    var html='<button class="bk" id="portal-bk-fld">\u2190 Zurück</button>'
      +'<div style="font-size:13px;font-weight:600;margin-bottom:12px">'+(icoMap[fld._tab]||'📁')+' '+fld.name+'</div>'
      +'<div class="file-grid">';
    if(!fld.files.length){
      html+='<div class="empty" style="grid-column:1/-1">Noch keine Dateien</div>';
    } else {
      for(var i=0;i<fld.files.length;i++){
        var f=fld.files[i];
        var isI=f.type==='image'||(f.mime_type||'').startsWith('image/');
        var isV=f.type==='video'||(f.mime_type||'').startsWith('video/');
        var th=f.url?(isI?'<img src="'+f.url+'">':(isV?'<video src="'+f.url+'" preload="metadata"></video>':'<span>📄</span>')):'<span>'+(isI?'🖼️':isV?'🎬':'📄')+'</span>';
        var pov=isV?'<div class="play-ov"><div class="play-btn">▶</div></div>':'';
        var unread=f.unread_comments||0;
        var badge=unread>0?'<div class="fi-comment-badge" data-pcidx="'+i+'">'+unread+'</div>':'';
        html+='<div class="ficard">'
          +'<div class="fi-thumb">'+th+pov+badge+'</div>'
          +'<div class="fi-info">'
          +'<div class="fi-name">'+f.name+'</div>'
          +'<div class="fi-meta">'+(f.size||'')+'</div>'
          +'<button class="btn btn-sm" data-pcomm-idx="'+i+'" style="margin-top:4px;font-size:10px;width:100%">💬 Kommentare</button>'
          +'</div>'
          +'</div>';
      }
    }
    html+='</div>';
    main.innerHTML=html;

    G('portal-bk-fld').addEventListener('click',function(){renderPortalPage('home');});
    main.querySelectorAll('[data-pcomm-idx]').forEach(function(btn){
      btn.addEventListener('click',function(){
        var idx=+btn.dataset.pcommIdx;
        openPortalComments(fld.files[idx],creator,function(){renderFiles();});
      });
    });
    main.querySelectorAll('.fi-comment-badge[data-pcidx]').forEach(function(badge){
      badge.style.cursor='pointer';
      badge.addEventListener('click',function(e){
        e.stopPropagation();
        var idx=+badge.dataset.pcidx;
        openPortalComments(fld.files[idx],creator,function(){renderFiles();});
      });
    });
  }

  // Ungelesene Kommentare laden
  var pending=fld.files.length;
  if(!pending){renderFiles();return;}
  fld.files.forEach(function(f){
    if(!f.id||f.type==='link'){pending--;if(!pending)renderFiles();return;}
    fetch('/api/comments?upload_id='+f.id,{headers:{'Authorization':'Bearer '+token}})
      .then(function(r){return r.json();})
      .then(function(comments){
        f.unread_comments=Array.isArray(comments)?comments.filter(function(cm){return !cm.read_by_creator;}).length:0;
        pending--;if(!pending)renderFiles();
      }).catch(function(){pending--;if(!pending)renderFiles();});
  });
}

function openPortalComments(file,creator,onRefresh){
  var token=localStorage.getItem('creator_token')||localStorage.getItem('token')||'';
  var wrap=document.createElement('div');
  wrap.style.cssText='position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:600;display:flex;align-items:center;justify-content:center;';
  wrap.innerHTML='<div style="background:var(--surf);border-radius:12px;padding:20px;width:min(420px,94vw);max-height:80vh;display:flex;flex-direction:column;border:1px solid var(--bdr)">'
    +'<div style="font-size:13px;font-weight:600;margin-bottom:12px">💬 Kommentare</div>'
    +'<div id="portal-comm-list" style="flex:1;overflow-y:auto;margin-bottom:12px;min-height:60px"><div style="font-size:11px;color:var(--muted)">Lädt...</div></div>'
    +'<div style="display:flex;gap:6px">'
    +'<textarea id="portal-comm-inp" rows="2" placeholder="Antwort schreiben..." style="flex:1;border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;font-family:inherit;font-size:12px;resize:none;outline:none"></textarea>'
    +'<button id="portal-comm-send" class="btn btn-p" style="align-self:flex-end">Senden</button>'
    +'</div>'
    +'<button id="portal-comm-close" class="btn" style="margin-top:8px">Schließen</button>'
    +'</div>';
  document.body.appendChild(wrap);

  function renderPComments(comments){
    var list=wrap.querySelector('#portal-comm-list');
    if(!list)return;
    if(!comments||!comments.length){list.innerHTML='<div style="font-size:11px;color:var(--muted)">Noch keine Kommentare</div>';return;}
    var html='';
    for(var i=0;i<comments.length;i++){
      var cm=comments[i];
      var bg=cm.author_role==='admin'?'#eff2ff':'#f4f5f7';
      var col=cm.author_role==='admin'?'#4f6ef7':'#111';
      var dt=new Date(cm.created_at).toLocaleString('de-DE');
      html+='<div style="background:'+bg+';border-radius:7px;padding:8px 10px;margin-bottom:6px">'
        +'<div style="font-size:9px;color:#888;margin-bottom:2px">'+cm.author_name+' · '+dt+'</div>'
        +'<div style="font-size:12px;color:'+col+'">'+cm.message+'</div>'
        +'</div>';
    }
    list.innerHTML=html;
    list.scrollTop=list.scrollHeight;
  }

  fetch('/api/comments?upload_id='+file.id,{headers:{'Authorization':'Bearer '+token}})
    .then(function(r){return r.json();})
    .then(function(comments){
      renderPComments(comments);
      fetch('/api/comments',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({upload_id:file.id,role:'creator'})});
      file.unread_comments=0;
      if(onRefresh)onRefresh();
    }).catch(function(){});

  wrap.querySelector('#portal-comm-send').addEventListener('click',function(){
    var inp=wrap.querySelector('#portal-comm-inp');
    var txt=inp.value.trim();if(!txt)return;
    fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({upload_id:file.id,creator_id:creator.id,author_role:'creator',author_name:creator.name,message:txt})})
      .then(function(res){
        if(!res.ok){showT('Fehler beim Senden');return;}
        inp.value='';
        fetch('/api/comments?upload_id='+file.id,{headers:{'Authorization':'Bearer '+token}})
          .then(function(r){return r.json();}).then(renderPComments);
        showT('Kommentar gesendet \u2713');
      }).catch(function(){showT('Fehler');});
  });

  wrap.querySelector('#portal-comm-inp').addEventListener('keydown',function(e){
    if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();wrap.querySelector('#portal-comm-send').click();}
  });
  wrap.querySelector('#portal-comm-close').addEventListener('click',function(){wrap.remove();});
  wrap.addEventListener('click',function(e){if(e.target===wrap)wrap.remove();});
}

function rTags(){G('tags-list').innerHTML=S.tags.map(t=>\`<span class="tag" style="display:inline-flex;align-items:center;gap:3px">\${t}<span data-dt="\${t}" style="cursor:pointer;font-size:9px;color:var(--blue);opacity:.7">✕</span></span>\`).join('');G('tags-list').querySelectorAll('[data-dt]').forEach(x=>x.addEventListener('click',()=>{S.tags=S.tags.filter(t=>t!==x.dataset.dt);rTags();}));}

function rFP(){
  G('fp-prods').innerHTML=S.produkte.map(p=>\`<span class="fp-chip \${S.flt.prods.includes(p.id)?'sel':''}" data-fpp="\${p.id}">\${p.name}</span>\`).join('');
  G('fp-tags').innerHTML=S.tags.map(t=>\`<span class="fp-chip \${S.flt.tags.includes(t)?'sel':''}" data-fpt="\${t}">\${t}</span>\`).join('');
  G('fp-prods').querySelectorAll('[data-fpp]').forEach(c=>c.addEventListener('click',()=>{const id=+c.dataset.fpp;S.flt.prods=S.flt.prods.includes(id)?S.flt.prods.filter(x=>x!==id):[...S.flt.prods,id];rFP();}));
  G('fp-tags').querySelectorAll('[data-fpt]').forEach(c=>c.addEventListener('click',()=>{const t=c.dataset.fpt;S.flt.tags=S.flt.tags.includes(t)?S.flt.tags.filter(x=>x!==t):[...S.flt.tags,t];rFP();}));
  rFpC('');
}
function rFpC(s){
  const list=s?S.creators.filter(c=>c.name.toLowerCase().includes(s.toLowerCase())):S.creators;
  G('fp-cr').innerHTML=list.map(c=>\`<div style="display:flex;align-items:center;gap:5px;padding:3px 6px;border-radius:5px;cursor:pointer;background:\${S.flt.cid===c.id?'#eff2ff':'transparent'};margin-bottom:2px" data-fpc="\${c.id}"><div style="width:15px;height:15px;border-radius:50%;background:\${c.color};flex-shrink:0"></div><span style="font-size:10px">\${c.name}</span></div>\`).join('');
  G('fp-cr').querySelectorAll('[data-fpc]').forEach(el=>el.addEventListener('click',()=>{const id=el.dataset.fpc;S.flt.cid=S.flt.cid===id?null:id;rFpC(s);}));
}

function openM(type,extra){
  S.modal=type;S.form={extra};
  const body=G('modal-body'),title=G('modal-title'),ok=G('modal-ok');
  ok.disabled=false;ok.textContent='Speichern';ok.onclick=confirmM;

  if(type==='addC'||type==='editC'){
    const isE=type==='editC';const c=isE?S.creators.find(x=>String(x.id)===String(extra)):null;if(isE)S.form.cid=extra;
    title.textContent=isE?'Creator bearbeiten':'Creator hinzufügen';
    const to=S.tags.map(t=>\`<option value="\${t}" \${c?.tags?.includes(t)?'selected':''}>\${t}</option>\`).join('');
    var kidsChecked=c?.kids?'checked':'';
    var kidsOnVidChecked=c?.kidsOnVid?'checked':'';
    var kidsAgesVal=(c?.kidsAges||[]).join(', ');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-cn" value="\${c?.name||''}" placeholder="Mira Hartley"></div>
      <div class="fg"><label class="fl">Kürzel</label><input class="fi" id="m-ci" value="\${c?.ini||''}" placeholder="MH" maxlength="3"></div>
      <div class="fg"><label class="fl">E-Mail</label><input class="fi" id="m-ce" type="email" value="\${c?.email||''}" placeholder="creator@email.com"></div>
      <div class="fg"><label class="fl">Instagram</label><input class="fi" id="m-ig" value="\${c?.instagram||''}" placeholder="https://instagram.com/username"></div>
      <div class="fg"><label class="fl">Profilbild</label><input type="file" accept="image/*" id="m-ph" class="fi" style="padding:5px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="fg"><label class="fl">Alter</label><input class="fi" id="m-ca" type="number" value="\${c?.age||''}" placeholder="25"></div>
        <div class="fg"><label class="fl">Beschreibung</label><input class="fi" id="m-cd" value="\${c?.desc||''}" placeholder="Lifestyle Creator"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="fg"><label class="fl">Geschlecht</label><select class="fi" id="m-cg"><option value="female" \${c?.gender==='female'?'selected':''}>♀ Female</option><option value="male" \${c?.gender==='male'?'selected':''}>♂ Male</option></select></div>
        <div class="fg"><label class="fl">Land</label><select class="fi" id="m-cc"><option value="DE" \${c?.country==='DE'?'selected':''}>🇩🇪 DE</option><option value="AT" \${c?.country==='AT'?'selected':''}>🇦🇹 AT</option><option value="CH" \${c?.country==='CH'?'selected':''}>🇨🇭 CH</option><option value="US" \${c?.country==='US'?'selected':''}>🇺🇸 US</option></select></div>
      </div>
      <div class="fg"><label class="fl">Tags</label><select class="fi" id="m-ct" multiple style="height:62px">\${to}</select></div>
      <div class="fg" style="background:var(--lt);border-radius:10px;padding:12px;border:1.5px solid var(--bdr)">
        <label class="fl" style="margin-bottom:8px">👶 Kinder</label>
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px">
          <input type="checkbox" id="m-kids" \${kidsChecked} style="width:16px;height:16px;cursor:pointer">
          <label for="m-kids" style="font-size:12px;font-weight:500;cursor:pointer">Hat Kinder</label>
        </div>
        <div id="m-kids-extra" style="display:\${c?.kids?'block':'none'}">
          <div class="fg"><label class="fl">Alter der Kinder (kommagetrennt, z.B. 3, 7)</label>
            <input class="fi" id="m-kids-ages" value="\${kidsAgesVal}" placeholder="3, 7, 12"></div>
          <div style="display:flex;align-items:center;gap:8px;margin-top:4px">
            <input type="checkbox" id="m-kids-vid" \${kidsOnVidChecked} style="width:16px;height:16px;cursor:pointer">
            <label for="m-kids-vid" style="font-size:12px;font-weight:500;cursor:pointer">Kinder erscheinen in Videos</label>
          </div>
        </div>
      </div>
      <div class="fg"><label class="fl">🔒 Interne Notizen (nur Admins)</label>
        <textarea class="fi" id="m-notizen" rows="3" placeholder="Interne Anmerkungen..." style="resize:vertical">\${c?.notizen||''}</textarea></div>
      <div class="fg"><label class="fl">💬 Hinweis für Creator (sieht der Creator)</label>
        <textarea class="fi" id="m-notizen-creator" rows="3" placeholder="z.B. Bitte immer Story-Format verwenden." style="resize:vertical">\${c?.notizenCreator||\'\'}</textarea></div>
      <div class="fg" style="background:var(--lt);border-radius:10px;padding:12px;border:1.5px solid var(--bdr)">
        <label class="fl" style="margin-bottom:8px">💶 Vergütung</label>
        <select class="fi" id="m-verg" style="margin-bottom:8px">
          <option value="provision" \${!c?.verguetung||c?.verguetung===\'provision\'?\'selected\':\'\'}>📊 Provision (%)</option>
          <option value="fix" \${c?.verguetung===\'fix\'?\'selected\':\'\'}>💶 Fixbetrag (€)</option>
          <option value="beides" \${c?.verguetung===\'beides\'?\'selected\':\'\'}>📊 + 💶 Beides</option>
        </select>
        <div id="m-verg-prov-wrap" style="display:\${!c?.verguetung||c?.verguetung===\'provision\'||c?.verguetung===\'beides\'?\'block\':\'none\'}">
          <label class="fl">Provision %</label>
          <input class="fi" id="m-verg-prov" type="number" value="\${c?.provision||\'\'}" placeholder="z.B. 10">
        </div>
        <div id="m-verg-fix-wrap" style="margin-top:8px;display:\${c?.verguetung===\'fix\'||c?.verguetung===\'beides\'?\'block\':\'none\'}">
          <label class="fl">Fixbetrag €</label>
          <input class="fi" id="m-verg-fix" type="number" value="\${c?.fixbetrag||\'\'}" placeholder="z.B. 500">
        </div>
      </div>\`;
    setTimeout(function(){
      var kidsChk=G('m-kids');var kidsExtra=G('m-kids-extra');
      if(kidsChk&&kidsExtra){kidsChk.addEventListener('change',function(){kidsExtra.style.display=this.checked?'block':'none';});}
      var verg=G('m-verg');
      if(verg){verg.addEventListener('change',function(){
        var v=this.value;
        G('m-verg-prov-wrap').style.display=(v==='provision'||v==='beides')?'block':'none';
        G('m-verg-fix-wrap').style.display=(v==='fix'||v==='beides')?'block':'none';
      });}
    },0);
  }
  else if(type==='addFld'||type==='editFld'){
    const isE=type==='editFld';const tab=isE?extra.tab:(typeof extra==='string'?extra:S.aCT);S.form.tab=tab;
    const fld=isE?S.aC?.flds[tab]?.find(f=>String(f.id)===String(extra.id)):null;if(isE)S.form.fid=extra.id;
    title.textContent=isE?'Ordner bearbeiten':'Ordner anlegen';
    const po=S.produkte.map(p=>\`<option value="\${p.name}" \${fld?.prods?.includes(p.name)?'selected':''}>\${p.name}</option>\`).join('');
    const to=[...S.tags,...S.projekte.map(p=>p.name)].map(x=>\`<option value="\${x}" \${fld?.tags?.includes(x)?'selected':''}>\${x}</option>\`).join('');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-fn" value="\${fld?.name||''}" placeholder="Winter Lookbook 2024"></div>
      <div class="fg"><label class="fl">Batch-Name</label><input class="fi" id="m-fb" value="\${fld?.batch||''}" placeholder="Januar Batch"></div>
      <div class="fg"><label class="fl">Datum</label><input class="fi" id="m-fd" type="date" value="\${fld?.date||new Date().toISOString().slice(0,10)}"></div>
      <div class="fg"><label class="fl">Deadline</label><input class="fi" id="m-fdl" type="date" value="\${fld?.deadline||''}"></div>
      <div class="fg"><label class="fl">Produkte</label><select class="fi" id="m-fp" multiple style="height:62px">\${po}</select></div>
      <div class="fg"><label class="fl">Tags</label><select class="fi" id="m-ft" multiple style="height:62px">\${to}</select></div>\`;
  }
  else if(type==='upload'){
    title.textContent='Datei hochladen';ok.textContent='Hochladen';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Bezeichnung *</label><input class="fi" id="m-un" placeholder="Lookbook Shot 01"></div>
      <div class="dz" id="m-dz"><div id="m-dzi"><div style="font-size:20px;margin-bottom:3px">📂</div><div style="font-size:11px;font-weight:500">Klicken oder Datei hierher ziehen</div></div></div>
      <input type="file" id="m-uf" accept="*/*" style="display:none">
      <div id="m-prog" style="display:none"><div id="m-ps" style="font-size:10px;margin-bottom:3px">Upload...</div><div class="prog-track"><div class="prog-fill" id="m-pb"></div></div></div>
      <div class="fg" style="margin-top:9px"><label class="fl">Oder Link</label><input class="fi" id="m-ul" placeholder="https://drive.google.com/..."></div>\`;
    G('m-dz').addEventListener('click',()=>G('m-uf').click());
    G('m-uf').addEventListener('change',()=>{if(G('m-uf').files[0])hFP(G('m-uf').files[0]);});
  }
  else if(type==='addP'||type==='editP'){
    const isE=type==='editP';const prod=isE?S.produkte.find(p=>p.id===extra):null;if(isE)S.form.pid=extra;
    title.textContent=isE?'Produkt bearbeiten':'Produkt hinzufügen';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-pn" value="\${prod?.name||''}" placeholder="Vitamin Serum XY"></div>
      <div class="fg"><label class="fl">Kategorie</label><input class="fi" id="m-pc" value="\${prod?.cat||''}" placeholder="Skincare"></div>
      <div class="fg"><label class="fl">Bild</label><input type="file" accept="image/*" id="m-pi" class="fi" style="padding:5px"></div>
      <div class="fg"><label class="fl">Emoji</label><input class="fi" id="m-pe" value="\${prod?.icon||''}" placeholder="💄" maxlength="4"></div>\`;
  }
  else if(type==='addPJ'||type==='editPJ'){
    const isE=type==='editPJ';const pj=isE?S.projekte.find(p=>p.id===extra):null;if(isE)S.form.pjid=extra;
    title.textContent=isE?'Projekt bearbeiten':'Projekt anlegen';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Projektname *</label><input class="fi" id="m-pjn" value="\${pj?.name||''}" placeholder="Winter Kampagne"></div>
      <div class="fg"><label class="fl">Aktion</label><input class="fi" id="m-pja" value="\${pj?.aktion||''}" placeholder="20% Code WINTER24"></div>
      <div class="fg"><label class="fl">Startdatum</label><input class="fi" id="m-pjs" type="date" value="\${pj?.start||''}"></div>
      <div class="fg"><label class="fl">Anzahl Creator</label><input class="fi" id="m-pjc" type="number" value="\${pj?.count||''}" placeholder="5" min="1"></div>\`;
  }
  else if(type==='addK'||type==='editK'){
    const isE=type==='editK';const k=isE?S.kat.find(x=>x.id===extra):null;if(isE)S.form.kid=extra;
    title.textContent=isE?'Kategorie bearbeiten':'Kategorie hinzufügen';
    body.innerHTML=\`<div class="fg"><label class="fl">Name *</label><input class="fi" id="m-kn" value="\${k?.name||''}" placeholder="Stories"></div><div class="fg"><label class="fl">Icon</label><input class="fi" id="m-ki" value="\${k?.icon||''}" placeholder="🎬" maxlength="4"></div><div class="fg"><label class="fl">Typ</label><select class="fi" id="m-kt"><option value="bilder">Bilder</option><option value="videos">Videos</option><option value="roh">Rohmaterial</option><option value="auswertung">Auswertungen</option></select></div>\`;
  }
  else if(type==='invite'){
    title.textContent='Team-Mitglied einladen';ok.textContent='Einladen';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-in" placeholder="Max Mustermann"></div>
      <div class="fg"><label class="fl">E-Mail *</label><input class="fi" id="m-ie" type="email" placeholder="max@company.com"></div>\`;
  }
  G('modal-bg').classList.add('open');
}

function hFP(f){G('m-dzi').innerHTML=\`<div style="font-size:11px;font-weight:500">\${f.name}</div><div style="font-size:9px;color:var(--muted)">\${(f.size/1024/1024).toFixed(1)} MB</div>\`;G('m-dz').classList.add('done');}
function closeM(){G('modal-bg').classList.remove('open');}

function confirmM(){
  const type=S.modal;
  if(type==='addC'||type==='editC'){
    const isE=type==='editC';const name=G('m-cn').value.trim();if(!name){showT('Name erforderlich');return;}
    const ini=(G('m-ci').value.trim()||name.slice(0,2)).toUpperCase();const email=G('m-ce').value.trim();
    const instagram=G('m-ig').value.trim();const age=+G('m-ca').value||25;const desc=G('m-cd').value.trim()||'Creator';
    const gender=G('m-cg').value;const country=G('m-cc').value;const tags=[...G('m-ct').selectedOptions].map(o=>o.value);
    const kids=G('m-kids')?.checked||false;
    const kidsOnVid=G('m-kids-vid')?.checked||false;
    const kidsAgesRaw=G('m-kids-ages')?.value||'';
    const kidsAges=kidsAgesRaw.split(',').map(x=>x.trim()).filter(x=>x.length>0);
    const notizen=G('m-notizen')?.value||'';
    const notizenCreator=G('m-notizen-creator')?.value||'';
    const verguetung=G('m-verg')?.value||'provision';
    const provision=G('m-verg-prov')?.value||'';
    const fixbetrag=G('m-verg-fix')?.value||'';
    const pf=G('m-ph').files[0];const color=CL[S.creators.length%CL.length];
    const apply=async(photo)=>{
      const token=localStorage.getItem('token')||'';
      const payload={name,initials:ini,email,instagram,age,gender,country,tags,description:desc,
        kids,kids_on_vid:kidsOnVid,kids_ages:kidsAges,notizen,notizen_creator:notizenCreator,
        verguetung,provision,fixbetrag,
        ...(photo?{photo}:{})};
      if(isE){
        const c=S.creators.find(x=>String(x.id)===String(S.form.cid));if(!c)return;
        try{await fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(c.id),...payload})});}catch(e){}
        Object.assign(c,{name,ini,email,instagram,age,desc,gender,country,tags,
          kids,kidsOnVid,kidsAges,notizen,notizenCreator,verguetung,provision,fixbetrag});
        if(photo)c.photo=photo;if(S.aC?.id===c.id)rCHdr();showT(\`"\${name}" gespeichert ✓\`);
      }else{
        try{
          const r=await fetch('/api/creators',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({...payload,color_from:color})});
          const d=await r.json();if(!r.ok){showT('Fehler: '+(d.error||''));return;}
          S.creators.push({id:d.id,name,ini,color,age,email,instagram,gender,country,tags,desc,up:new Date(),
            photo:photo||null,verguetung,provision,fixbetrag,
            notizen,notizenCreator,kids,kidsAges,kidsOnVid,
            invited:false,status:'ausstehend',flds:{bilder:[],videos:[],roh:[],auswertung:[]}});
          showT(\`"\${name}" angelegt ✓\`);
        }catch(e){showT('Netzwerkfehler');return;}
      }
      rCreators();uBdg();rDash();closeM();
    };
    // Foto nur beim Bearbeiten mitschicken (POST hat 4.5MB Limit)
    if(isE&&pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addFld'||type==='editFld'){
    const isE=type==='editFld';const tab=S.form.tab||S.aCT;const name=G('m-fn').value.trim();if(!name){showT('Name erforderlich');return;}
    const batch=G('m-fb').value.trim()||name;const date=G('m-fd').value||new Date().toISOString().slice(0,10);
    const deadline=G('m-fdl').value||'';
    const prods=[...G('m-fp').selectedOptions].map(o=>o.value);const tags=[...G('m-ft').selectedOptions].map(o=>o.value);
    const token=localStorage.getItem('token')||'';
    if(isE){
      const fld=S.aC?.flds[tab]?.find(f=>String(f.id)===String(S.form.fid));if(!fld)return;
      fetch('/api/folders',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(fld.id),name,batch,date,deadline,prods,tags})}).catch(()=>{});
      Object.assign(fld,{name,batch,date,deadline,prods,tags});showT('Aktualisiert ✓');
    }else{
      if(!S.aC)return;
      const newId=uid();
      fetch('/api/folders',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({creator_id:String(S.aC.id),tab,name,batch,date,deadline,prods,tags})})
        .then(r=>r.json()).then(d=>{const fld=S.aC?.flds[tab]?.find(f=>f.id===newId);if(fld&&d.id)fld.id=d.id;}).catch(()=>{});
      S.aC.flds[tab].push({id:newId,name,batch,date,deadline,prods,tags,files:[]});
      showT(\`"\${name}" angelegt ✓\`);
    }
    closeM();rCT(tab);rCHdr();return;
  }
  if(type==='upload'){
    const name=G('m-un').value.trim();if(!name){showT('Bezeichnung erforderlich');return;}
    const link=G('m-ul').value.trim();const file=G('m-uf').files[0];if(!file&&!link){showT('Datei oder Link erforderlich');return;}
    const fld=S.aF?.fld;if(!fld){showT('Kein Ordner');return;}
    const cid=S.aC?.id;if(!cid){showT('Kein Creator');return;}
    const tab=S.aCT||'bilder';
    const token=localStorage.getItem('token')||'';
    G('modal-ok').disabled=true;
    if(link){
      fetch('/api/upload',{method:'POST',headers:{'Authorization':'Bearer '+token},body:(()=>{const fd=new FormData();fd.append('linkUrl',link);fd.append('linkName',name);fd.append('creatorId',String(cid));fd.append('tab',tab);return fd;})()})
        .then(r=>r.json()).then(d=>{
          fld.files.push({id:d.upload?.id||uid(),name,type:'link',url:link,size:'Link',uploadedAt:null,comments:[],r2Key:null});
          rFiles(fld);rCHdr();closeM();showT('"'+name+'" hinzugefügt ✓');
        }).catch(()=>{showT('Fehler');G('modal-ok').disabled=false;});
      return;
    }
    G('m-prog').style.display='block';G('m-ps').textContent='Wird hochgeladen...';
    const fd=new FormData();fd.append('file',file);fd.append('creatorId',String(cid));fd.append('tab',tab);
    const xhr=new XMLHttpRequest();xhr.open('POST','/api/upload');xhr.setRequestHeader('Authorization','Bearer '+token);
    xhr.upload.onprogress=e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);G('m-pb').style.width=p+'%';G('m-ps').textContent='R2: '+p+'%';}};
    xhr.onload=()=>{
      const d=JSON.parse(xhr.responseText);
      if(xhr.status!==200){showT('Fehler: '+(d.error||''));G('modal-ok').disabled=false;return;}
      G('m-pb').style.background='var(--grn)';G('m-ps').textContent='✓ Gespeichert';
      const ft=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':'file';
      setTimeout(()=>{fld.files.push({id:d.upload?.id||uid(),name,type:ft,url:d.upload?.file_url||d.url,size:(file.size/1024/1024).toFixed(1)+' MB',uploadedAt:null,comments:[],r2Key:d.upload?.r2_key||null});rFiles(fld);rCHdr();closeM();showT('"'+name+'" hochgeladen ✓');},400);
    };
    xhr.onerror=()=>{showT('Netzwerkfehler');G('modal-ok').disabled=false;};
    xhr.send(fd);
    return;
  }
  if(type==='addP'||type==='editP'){
    const isE=type==='editP';const name=G('m-pn').value.trim();if(!name){showT('Name erforderlich');return;}
    const cat=G('m-pc').value.trim();const icon=G('m-pe').value.trim()||'📦';const pf=G('m-pi').files[0];
    const apply=(url)=>{if(isE){const i=S.produkte.findIndex(p=>p.id===S.form.pid);if(i>=0)S.produkte[i]={...S.produkte[i],name,cat,icon,...(url?{url}:{})};showT('Aktualisiert ✓');}else{S.produkte.push({id:uid(),name,cat,icon,tags:[],url:url||null,briefings:[],skripte:[],lernvideos:[]});showT(\`"\${name}" hinzugefügt ✓\`);}rProdukte();uBdg();closeM();saveAppData('produkte',S.produkte);};
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addPJ'||type==='editPJ'){
    const isE=type==='editPJ';const name=G('m-pjn').value.trim();if(!name){showT('Name erforderlich');return;}
    const aktion=G('m-pja').value.trim();const start=G('m-pjs').value;const count=+G('m-pjc').value||1;
    if(isE){const i=S.projekte.findIndex(p=>p.id===S.form.pjid);if(i>=0)S.projekte[i]={...S.projekte[i],name,aktion,start,count};showT('Aktualisiert ✓');}
    else{S.projekte.push({id:uid(),name,pids:[],aktion,start,count,cids:[],status:'planned',url:null});showT(\`"\${name}" erstellt ✓\`);}
    rProjekte();uBdg();closeM();saveAppData('projekte',S.projekte);return;
  }
  if(type==='addK'||type==='editK'){
    const isE=type==='editK';const name=G('m-kn').value.trim();if(!name)return;const icon=G('m-ki').value.trim()||'📁';const ktype=G('m-kt').value;
    if(isE){const i=S.kat.findIndex(k=>k.id===S.form.kid);if(i>=0)S.kat[i]={...S.kat[i],name,icon,type:ktype};showT('Aktualisiert ✓');}else{S.kat.push({id:uid(),name,icon,type:ktype});showT(\`"\${name}" erstellt ✓\`);}rKat();closeM();saveAppData('kat',S.kat);return;
  }
  if(type==='invite'){
    const name=G('m-in').value.trim();if(!name)return;const email=G('m-ie').value.trim();if(!email)return;
    const token=localStorage.getItem('token')||'';
    G('modal-ok').disabled=true;
    fetch('/api/team/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
      body:JSON.stringify({name,email,role:'read'})})
      .then(function(r){return r.json();})
      .then(function(d){
        G('modal-ok').disabled=false;
        if(d.success){
          S.team.push({id:d.user?.id||uid(),name,email,role:'read',status:'pending'});
          rTeam();closeM();showT('✓ Einladung gesendet an '+email);
        } else {showT('Fehler: '+(d.error||''));}
      }).catch(function(){G('modal-ok').disabled=false;showT('Netzwerkfehler');});
    return;
  }
}

function rContentHub(){
  const hub=S.contentHub;
  G('ch-cats').innerHTML=['Alle',...hub.cats].map(c=>\`<button class="fp-chip\${S.chFilter===c?' sel':''}" data-chcat="\${c}">\${c}</button>\`).join('');
  G('ch-cats').querySelectorAll('[data-chcat]').forEach(btn=>btn.addEventListener('click',()=>{S.chFilter=btn.dataset.chcat;rContentHub();}));
  const items=hub.items.filter(x=>S.chFilter==='Alle'||x.cat===S.chFilter);
  G('ch-grid').innerHTML=items.length?items.map(item=>\`<div class="sc ch-card" style="padding:18px"><div style="font-size:14px;font-weight:600;margin-bottom:5px">\${item.title}</div><div style="font-size:12px;color:var(--muted)">\${item.desc||''}</div></div>\`).join(''):'<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted)">Noch keine Inhalte</div>';
  G('ch-search').oninput=()=>rContentHub();
}

function uBdg(){G('bdg-c').textContent=S.creators.length;G('bdg-p').textContent=S.projekte.length;}

function saveAppData(key,value){
  const token=localStorage.getItem('token')||'';
  fetch('/api/app-data',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({key,value})}).catch(()=>{});
}

// ── STATIC LISTENERS
G('logo-btn').addEventListener('click',()=>go('dashboard'));
G('user-btn').addEventListener('click',()=>go('einst'));
['dashboard','creators','produkte','projekte','kategorien','team','einst'].forEach(p=>G('ni-'+p)?.addEventListener('click',()=>go(p)));
G('ni-c-invite').addEventListener('click',()=>go('c-invite'));
G('ni-content-hub').addEventListener('click',()=>go('content-hub'));
G('btn-add-c').addEventListener('click',()=>openM('addC'));
G('btn-add-p').addEventListener('click',()=>openM('addP'));
G('btn-add-pj').addEventListener('click',()=>openM('addPJ'));
G('btn-add-k').addEventListener('click',()=>openM('addK'));
G('btn-invite').addEventListener('click',()=>openM('invite'));
G('btn-add-tag').addEventListener('click',()=>{const v=G('new-tag').value.trim();if(!v||S.tags.includes(v))return;S.tags.push(v);G('new-tag').value='';rTags();showT(\`"\${v}" hinzugefügt\`);});
G('s-save').addEventListener('click',()=>{
  var n=G('s-name').value.trim()||'Admin';
  S.adminName=n;
  localStorage.setItem('admin_name',n);
  G('sb-name').textContent=n.split(' ')[0];
  if(G('rsb-name'))G('rsb-name').textContent=n;
  showT('Gespeichert ✓');
});
G('s-photo-inp')?.addEventListener('change',function(){
  var file=this.files[0];if(!file)return;
  var reader=new FileReader();
  reader.onload=function(e){
    S.adminPhoto=e.target.result;
    localStorage.setItem('admin_photo',S.adminPhoto);
    applyAdminPhoto(S.adminPhoto);
    showT('Profilbild aktualisiert ✓');
  };
  reader.readAsDataURL(file);
});
function applyAdminPhoto(photo){
  if(!photo)return;
  var imgHtml='<img src="'+photo+'" style="width:100%;height:100%;object-fit:cover">';
  var prev=G('s-photo-prev');if(prev)prev.innerHTML=imgHtml;
  var rsbWrap=G('rsb-av-wrap');if(rsbWrap)rsbWrap.innerHTML=imgHtml;
  var sbAv=G('sb-av');if(sbAv)sbAv.innerHTML='<img src="'+photo+'" style="width:100%;height:100%;object-fit:cover;border-radius:10px">';
  S.adminPhoto=photo;
}
// Beim Start: Admin-Foto + Name aus localStorage laden
(function(){
  var saved=localStorage.getItem('admin_photo');
  if(saved){setTimeout(function(){applyAdminPhoto(saved);},100);}
  var savedName=localStorage.getItem('admin_name');
  if(savedName){S.adminName=savedName;if(G('sb-name'))G('sb-name').textContent=savedName.split(' ')[0];if(G('rsb-name'))G('rsb-name').textContent=savedName;}
})();
G('pw-save').addEventListener('click',()=>{const c=G('pw-c').value,n=G('pw-n').value,k=G('pw-k').value;if(!c||!n||!k)return showT('Alle Felder ausfüllen');if(n.length<8)return showT('Min. 8 Zeichen');if(n!==k)return showT('Stimmen nicht überein');['pw-c','pw-n','pw-k'].forEach(id=>G(id).value='');showT('Passwort geändert ✓');});
G('dark-tgl').addEventListener('click',()=>{S.dark=!S.dark;document.body.classList.toggle('dark',S.dark);G('dark-tgl').classList.toggle('on',S.dark);});
G('modal-cancel').addEventListener('click',closeM);
G('modal-bg').addEventListener('click',e=>{if(e.target===G('modal-bg'))closeM();});
G('lb-x').addEventListener('click',closeLB);
G('lb-close').addEventListener('click',closeLB);
G('lb').addEventListener('click',e=>{if(e.target===G('lb'))closeLB();});
G('bk-c').addEventListener('click',backC);
G('bk-pj').addEventListener('click',backPJ);
G('bk-k').addEventListener('click',backK);
G('c-tabs').querySelectorAll('.tab').forEach(tab=>{tab.addEventListener('click',()=>{G('c-tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));tab.classList.add('on');S.aCT=tab.dataset.t;rCT(tab.dataset.t);});});
G('pj-tabs').querySelectorAll('.tab').forEach(tab=>{tab.addEventListener('click',()=>{G('pj-tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));tab.classList.add('on');S.aPT=tab.dataset.t;rPJT(tab.dataset.t);});});
G('fp-btn').addEventListener('click',()=>{G('fp-panel').classList.toggle('open');if(G('fp-panel').classList.contains('open'))rFP();});
G('fp-close').addEventListener('click',()=>G('fp-panel').classList.remove('open'));
G('fp-apply').addEventListener('click',()=>{rDash();G('fp-panel').classList.remove('open');});
G('fp-reset').addEventListener('click',()=>{S.flt={prods:[],tags:[],cid:null};rFP();rDash();G('fp-panel').classList.remove('open');});
G('fp-cs').addEventListener('input',e=>rFpC(e.target.value));
G('close-portal').addEventListener('click',()=>G('creator-portal').classList.remove('open'));
G('open-portal-preview').addEventListener('click',()=>{if(S.creators.length)openPortal(S.creators[0].id);else showT('Kein Creator vorhanden');});
G('creator-portal').querySelectorAll('.ni[id^="pni-"]').forEach(n=>{n.addEventListener('click',()=>renderPortalPage(n.id.replace('pni-','')));});
G('ci-send').addEventListener('click',async()=>{
  const cid=G('ci-sel').value;if(!cid)return showT('Bitte Creator wählen');
  const c=S.creators.find(x=>String(x.id)===String(cid));if(!c)return;
  const email=c.email||G('ci-email').value.trim();if(!email||!email.includes('@'))return showT('E-Mail erforderlich');
  if(!c.email)c.email=email;
  showT('⏳ Einladung wird gesendet...');
  try{
    const token=localStorage.getItem('token')||'';
    const res=await fetch('/api/creators/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({creatorId:c.id,email,name:c.name})});
    const data=await res.json();
    if(res.ok){c.invited=true;c.invitedAt=new Date().toISOString();rCInvite();showT('✓ Einladung gesendet an '+email);}
    else showT('Fehler: '+(data.error||''));
  }catch(e){showT('Netzwerkfehler');}
});
G('ch-add-btn')?.addEventListener('click',()=>{showT('Content Hub: Funktion in Entwicklung');});
G('ch-add-cat-btn')?.addEventListener('click',()=>{const name=prompt('Neue Kategorie:');if(name&&name.trim()){S.contentHub.cats.push(name.trim());rContentHub();showT('Kategorie hinzugefügt ✓');}});
G('logout-btn')?.addEventListener('click',()=>{if(confirm('Wirklich abmelden?')){localStorage.removeItem('token');localStorage.removeItem('user');window.location.href='/login';}});
G('portal-logout-btn')?.addEventListener('click',()=>{localStorage.removeItem('creator_token');G('creator-portal').classList.remove('open');});
document.addEventListener('click',e=>{if(!e.target.closest('#drop-menu')&&!e.target.closest('.dot-btn'))hideDot();if(!e.target.closest('#fp-panel')&&!e.target.closest('#fp-btn'))G('fp-panel').classList.remove('open');});
G('menu-toggle')?.addEventListener('click',()=>{G('admin-sb').classList.toggle('open');G('sb-overlay').classList.toggle('open');});
// Overlay schließt Sidebar - sowohl click als auch touch
function closeMobileSb(){G('admin-sb').classList.remove('open');G('sb-overlay').classList.remove('open');}
G('sb-overlay')?.addEventListener('click',closeMobileSb);
G('sb-overlay')?.addEventListener('touchend',function(e){e.preventDefault();closeMobileSb();});
// Mobile: Sidebar nach Menüklick automatisch schließen
document.querySelectorAll('.sb .ni').forEach(function(ni){
  ni.addEventListener('click',function(){
    if(window.innerWidth<=900)closeMobileSb();
  });
});
// Logo-Klick auf Mobile schließt auch Sidebar
G('logo-btn')?.addEventListener('click',function(){
  if(window.innerWidth<=900)closeMobileSb();
});

// ── KALENDER
var _calYear=new Date().getFullYear();var _calMonth=new Date().getMonth();
var _calDayNames=['Mo','Di','Mi','Do','Fr','Sa','So'];
var _calMonthNames=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];
function renderCalendar(){
  var el=G('cal-day-names');var elD=G('cal-days');var elM=G('cal-month-label');
  if(!el||!elD||!elM)return;
  elM.textContent=_calMonthNames[_calMonth]+' '+_calYear;
  el.innerHTML=_calDayNames.map(function(d){return'<div class="cal-day-name">'+d+'</div>';}).join('');
  var firstDay=new Date(_calYear,_calMonth,1).getDay();
  var offset=(firstDay===0?6:firstDay-1);
  var daysInMonth=new Date(_calYear,_calMonth+1,0).getDate();
  var today=new Date();
  var html='';
  for(var i=0;i<offset;i++)html+='<div class="cal-day empty">.</div>';
  for(var d2=1;d2<=daysInMonth;d2++){
    var isToday=d2===today.getDate()&&_calMonth===today.getMonth()&&_calYear===today.getFullYear();
    html+='<div class="cal-day'+(isToday?' today':'')+'">'+(isToday?'<strong>'+d2+'</strong>':d2)+'</div>';
  }
  elD.innerHTML=html;
}
G('cal-prev')?.addEventListener('click',function(){_calMonth--;if(_calMonth<0){_calMonth=11;_calYear--;}renderCalendar();});
G('cal-next')?.addEventListener('click',function(){_calMonth++;if(_calMonth>11){_calMonth=0;_calYear++;}renderCalendar();});
renderCalendar();

// ── TOOLS
G('tool-headline')?.addEventListener('click',function(){showT('Headline Generator – kommt bald!');});
G('tool-skript')?.addEventListener('click',function(){showT('Skript Generator – kommt bald!');});
G('tool-konkurrenz')?.addEventListener('click',function(){showT('Konkurrenz Analyse – kommt bald!');});

window.S=S;window.openPortal=openPortal;window.renderPortalPage=renderPortalPage;
window.rDash=rDash;window.rCreators=rCreators;window.rCInvite=rCInvite;
window.openC=openC;window.go=go;window.rProdukte=rProdukte;window.rProjekte=rProjekte;
window.rKat=rKat;window.rCT=rCT;window.rCHdr=rCHdr;
window.rRightSidebar=rRightSidebar;
window.rAnalytics=rAnalytics;
window.openSearch=openSearch;window.closeSearch=closeSearch;

go('dashboard');rFP();
`;

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

    const w = window as any
    fetch('/api/creators', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json())
      .then((realCreators: any[]) => {
        if (!Array.isArray(realCreators) || !w.S) return
        const validCreators = realCreators.filter((rc: any) => rc.name && rc.name.trim().length > 0)
        w.S.creators = validCreators.map((rc: any) => ({
          id: rc.id, name: rc.name,
          ini: rc.initials || rc.name.slice(0,2).toUpperCase(),
          color: rc.color_from || '#6366f1',
          email: rc.email || '', status: rc.status || 'ausstehend',
          invite_code: rc.invite_code, invited: !!rc.invite_code, invitedAt: rc.invited_at,
          tags: rc.tags || [], age: rc.age || 0, gender: rc.gender || 'female',
          country: rc.country || 'DE', desc: rc.description || '',
          photo: rc.photo || null, instagram: rc.instagram || '',
          verguetung: rc.verguetung || 'provision', provision: rc.provision || '',
          fixbetrag: rc.fixbetrag || '', notizen: rc.notizen || '', notizenCreator: rc.notizen_creator || '',
          vertragUrl: rc.vertrag_url || null, vertragName: rc.vertrag_name || null,
          kids: rc.kids || false, kidsAges: rc.kids_ages || [], kidsOnVid: rc.kids_on_vid || false,
          flds: { bilder: [], videos: [], roh: [], auswertung: [] },
          up: new Date(),
        }))
        try { w.rDash() } catch(e) {}
        try { w.rCreators() } catch(e) {}
        try { w.rCInvite() } catch(e) {}
        try { w.rRightSidebar() } catch(e) {}
        // Update right sidebar admin name
        try { const sbn=w.document?.getElementById('rsb-name');if(sbn)sbn.textContent=w.document?.getElementById('sb-name')?.textContent||'Admin'; } catch(e) {}

        validCreators.forEach((c: any) => {
          fetch('/api/folders?creatorId=' + String(c.id), { headers: { 'Authorization': 'Bearer ' + token } })
            .then(r => r.json()).then((folders: any[]) => {
              if (!Array.isArray(folders)) return
              const cr = w.S.creators.find((x: any) => String(x.id) === String(c.id))
              if (!cr) return
              folders.forEach((f: any) => {
                const tab = f.tab || 'bilder'
                if (!cr.flds[tab]) cr.flds[tab] = []
                if (!cr.flds[tab].find((x: any) => String(x.id) === String(f.id))) {
                  cr.flds[tab].push({ id: f.id, name: f.name, batch: f.batch || '', date: f.date || new Date().toISOString().slice(0,10), deadline: f.deadline || '', prods: f.prods || [], tags: f.tags || [], files: [] })
                }
              })
              if (w.S.aC && String(w.S.aC.id) === String(c.id)) {
                try { w.rCT(w.S.aCT) } catch(e) {}
                try { w.rCHdr() } catch(e) {}
              }
              // Analytics neu rendern wenn auf Dashboard
              if (w.S.page === 'dashboard') {
                try { w.rDash() } catch(e) {}
              }
            }).catch(() => {})
        })
      }).catch(() => {})

    fetch('/api/app-data', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then((d: any) => {
        if (!d || !w.S) return
        if (Array.isArray(d.produkte) && d.produkte.length > 0) w.S.produkte = d.produkte
        if (Array.isArray(d.projekte) && d.projekte.length > 0) w.S.projekte = d.projekte
        if (Array.isArray(d.kat) && d.kat.length > 0) w.S.kat = d.kat
        try { w.rDash() } catch(e) {}
      }).catch(() => {})

    // Team aus DB laden
    fetch('/api/team/members', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then((members: any[]) => {
        if (!Array.isArray(members) || !w.S) return
        w.S.team = members.map((m: any) => ({
          id: m.id, name: m.name, email: m.email,
          role: m.role, status: m.status,
          you: false
        }))
        try { w.rTeam() } catch(e) {}
      }).catch(() => {})

    // Alle Uploads laden fuer Analytics – persistent in S.allUploads
    fetch('/api/uploads?creatorId=all', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(r => r.json()).then((allUploads: any[]) => {
        if (!Array.isArray(allUploads) || !w.S) return
        // In S.allUploads speichern (persistent, kein Rebuild nach Reload)
        w.S.allUploads = allUploads
        // Auch in Creator-flds einbauen für Datei-Ansicht
        allUploads.forEach((u: any) => {
          const cr = w.S.creators.find((x: any) => String(x.id) === String(u.creator_id))
          if (!cr) return
          const tab = u.tab || 'bilder'
          if (!cr.flds[tab]) cr.flds[tab] = []
          let fld = cr.flds[tab].find((f: any) => f.id === '__db_uploads__')
          if (!fld) {
            fld = { id: '__db_uploads__', name: 'Uploads', batch: 'Creator Upload', date: new Date().toISOString().slice(0,10), deadline: null, prods: [], tags: [], files: [] }
            cr.flds[tab].unshift(fld)
          }
          if (!fld.files.find((f: any) => f.id === u.id)) {
            fld.files.push({ id: u.id, name: u.file_name,
              type: (u.mime_type||'').startsWith('image/') ? 'image' : (u.mime_type||'').startsWith('video/') ? 'video' : 'file',
              url: u.file_url, size: u.file_size ? (u.file_size/1024/1024).toFixed(1)+' MB' : '',
              uploadedAt: u.uploaded_at || null, comments: [], r2Key: u.r2_key,
              mime_type: u.mime_type, batch: u.batch, product: u.product,
              label: u.name, creator_id: u.creator_id })
          }
        })
        try { w.rAnalytics() } catch(e) {}
        try { w.rDash() } catch(e) {}
      }).catch(() => {})

    return () => { try { document.head.removeChild(st) } catch(e){} }
  }, [])

  return (
    <>
      <Head>
        <title>CreatorHub – Filapen</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
      </Head>
      <div ref={ref} style={{ width: '100vw', height: '100vh', overflow: 'hidden' }} />
    </>
  )
}
