import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type AuthState = 'checking' | 'auth_ready' | 'portal_ready' | 'error' | 'portal_error'

const PORTAL_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bdr:#e8e8ec;--bg:#f4f5f7;--surf:#fff;--lt:#f4f5f7;--act:#f0f0f3;--muted:#777;--blue:#4f6ef7;--grn:#16a34a;--red:#dc2626;--org:#ea580c;}
html{height:100%;overflow:hidden;}body{font-family:system-ui,sans-serif;font-size:13px;background:var(--bg);color:#111;display:flex;width:100vw;height:100vh;overflow:hidden;margin:0;padding:0;box-sizing:border-box;}
body.dark{--bdr:#2d2d2d;--bg:#0d0d0d;--surf:#161616;--lt:#1e1e1e;--act:#252525;--muted:#888;color:#f0f0f0;}

/* SIDEBAR */
.sb{width:210px;min-width:210px;background:var(--surf);border-right:1px solid var(--bdr);display:flex;flex-direction:column;position:fixed;top:0;left:0;bottom:0;height:100vh;z-index:100;overflow-y:auto;transition:transform 0.25s ease;}
.logo{padding:12px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:8px;cursor:pointer;}
.logo:hover{background:var(--lt);}
.logo img{height:22px;width:auto;}
.logo-sep{width:1px;height:14px;background:var(--bdr);}
.logo-lbl{font-size:10px;color:var(--muted);}
.nav-s{padding:10px 7px 3px;}
.nav-l{font-size:9px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:1px;padding:0 6px;margin-bottom:3px;}
.ni{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--muted);margin-bottom:1px;user-select:none;}
.ni:hover,.ni.on{background:var(--act);color:#111;}
body.dark .ni:hover,body.dark .ni.on{color:#f0f0f0;}
.ni.on{font-weight:500;}
.ni-ico{width:15px;text-align:center;font-size:12px;flex-shrink:0;}
.ni-bdg{margin-left:auto;background:var(--act);color:var(--muted);font-size:9px;border-radius:8px;padding:1px 5px;}
.sb-foot{margin-top:auto;border-top:1px solid var(--bdr);padding:8px 7px;}
.user-r{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;}
.user-r:hover{background:var(--act);}
.av{width:24px;height:24px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff;flex-shrink:0;overflow:hidden;}
.av img{width:100%;height:100%;object-fit:cover;}

/* MAIN */
.main{margin-left:210px;flex:1;display:flex;flex-direction:column;min-width:0;height:100vh;overflow:hidden;}
.topbar{background:var(--surf);border-bottom:1px solid var(--bdr);height:46px;padding:0 18px;display:flex;align-items:center;gap:8px;flex-shrink:0;position:sticky;top:0;z-index:50;}
.tb-t{font-size:13px;font-weight:600;}
.sw{flex:1;max-width:280px;position:relative;margin-left:8px;}
.sw input{width:100%;background:var(--lt);border:1px solid transparent;border-radius:7px;padding:5px 9px 5px 26px;font-size:12px;color:#111;outline:none;font-family:inherit;}
body.dark .sw input{color:#f0f0f0;}
.sw input:focus{border-color:var(--bdr);}
.s-ico{position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#bbb;font-size:11px;}
.tb-r{margin-left:auto;display:flex;gap:6px;align-items:center;position:relative;}

/* BUTTONS */
.btn{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--surf);color:#111;font-family:inherit;white-space:nowrap;}
body.dark .btn{color:#f0f0f0;}
.btn:hover{background:var(--lt);}
.btn-p{background:#111;color:#fff;border-color:#111;}
body.dark .btn-p{background:#f0f0f0;color:#111;border-color:#f0f0f0;}
.btn-p:hover{opacity:.85;}
.btn-sm{padding:3px 8px;font-size:11px;}
.btn-red{background:var(--red);color:#fff;border-color:var(--red);}
.btn-grn{background:var(--grn);color:#fff;border-color:var(--grn);}

/* PAGES */
.content{padding:18px;flex:1;overflow-y:auto;overflow-x:hidden;min-width:0;}
.pg{display:none;}
.pg.on{display:block;}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}
.ph-t{font-size:18px;font-weight:700;}

/* STATS */
.stat-row{display:grid;gap:8px;margin-bottom:13px;}
.sc{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;cursor:pointer;}
.sc:hover{border-color:#bbb;}
.sl{font-size:9px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
.sv{font-size:20px;font-weight:700;}

/* CREATOR ROWS */
.cl{display:flex;flex-direction:column;}
.cr{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surf);border:1px solid var(--bdr);border-bottom:none;}
.cr:first-child{border-radius:9px 9px 0 0;}
.cr:last-child{border-bottom:1px solid var(--bdr);border-radius:0 0 9px 9px;}
.cr:only-child{border-radius:9px;border-bottom:1px solid var(--bdr);}
.cr:hover{background:var(--lt);}
.cr-av{width:42px;height:42px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;overflow:hidden;}
.cr-av img{width:100%;height:100%;object-fit:cover;}

/* TAGS & BADGES */
.tag{padding:1px 6px;border-radius:8px;background:#eff2ff;color:#4f6ef7;font-size:10px;border:1px solid #d0d8ff;}
body.dark .tag{background:#1a2040;color:#7a9fff;border-color:#2a3560;}
.kb{padding:1px 5px;border-radius:6px;font-size:10px;background:var(--lt);border:1px solid var(--bdr);}
.kb-no{padding:1px 5px;border-radius:6px;font-size:10px;background:#fff7ed;color:#c2410c;border:1px solid #fed7aa;}
.social-badge{display:inline-flex;align-items:center;gap:3px;padding:1px 6px;border-radius:6px;font-size:10px;background:#fdf2f8;color:#9d174d;border:1px solid #fbcfe8;text-decoration:none;}
.social-badge:hover{opacity:.8;}
.badge-prov{padding:1px 6px;border-radius:6px;font-size:10px;background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;}
.badge-fix{padding:1px 6px;border-radius:6px;font-size:10px;background:#fffbeb;color:#92400e;border:1px solid #fde68a;}
.badge-both{padding:1px 6px;border-radius:6px;font-size:10px;background:#faf5ff;color:#7c3aed;border:1px solid #e9d5ff;}
.deadline-ok{color:var(--grn);font-size:10px;}
.deadline-warn{color:var(--org);font-size:10px;font-weight:600;}
.deadline-late{color:var(--red);font-size:10px;font-weight:700;animation:pulse 1.5s infinite;}
@keyframes pulse{0%,100%{opacity:1;}50%{opacity:.5;}}

/* CREATOR DETAIL */
.cdh{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:13px 15px;margin-bottom:13px;display:flex;align-items:center;gap:13px;position:sticky;top:46px;z-index:40;}
.cd-av{width:54px;height:54px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:700;color:#fff;overflow:hidden;}
.cd-av img{width:100%;height:100%;object-fit:cover;}

/* TABS */
.tabs{display:flex;border-bottom:1px solid var(--bdr);margin-bottom:13px;overflow-x:auto;}
.tab{padding:7px 12px;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;flex-shrink:0;}
.tab:hover,.tab.on{color:var(--blue);}
.tab.on{border-bottom-color:var(--blue);}

/* FOLDER GRID */
.fg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;}
.fcard{background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:11px;position:relative;cursor:pointer;}
.fcard:hover{border-color:#bbb;}
.fcard.deadline-red{border-color:var(--red)!important;background:#fff5f5;}
body.dark .fcard.deadline-red{background:#1a0808;}
.add-fcard{background:var(--surf);border:1.5px dashed var(--bdr);border-radius:9px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:var(--muted);}
.add-fcard:hover{border-color:#aaa;}

/* FILE GRID */
.file-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;}
.ficard{background:var(--surf);border:1px solid var(--bdr);border-radius:8px;overflow:hidden;}
.ficard.selected{border-color:var(--blue);box-shadow:0 0 0 2px #d0d8ff;}
.fi-thumb{height:88px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;overflow:hidden;position:relative;}
.fi-thumb img,.fi-thumb video{width:100%;height:100%;object-fit:cover;}
.play-ov{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;}
.fi-thumb:hover .play-ov{opacity:1;}
.play-btn{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:9px;}
.fi-sel-cb{position:absolute;top:6px;left:6px;width:18px;height:18px;border-radius:4px;border:2px solid #fff;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;font-size:10px;color:#fff;cursor:pointer;}
.ficard.selected .fi-sel-cb{background:var(--blue);border-color:var(--blue);}
.fi-info{padding:6px 8px;}
.fi-name{font-size:10px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fi-meta{font-size:9px;color:var(--muted);margin-bottom:4px;}
.fi-acts{display:flex;gap:2px;}
.fi-btn{flex:1;padding:2px 0;border-radius:4px;border:1px solid var(--bdr);font-size:10px;cursor:pointer;text-align:center;text-decoration:none;display:inline-block;color:#111;background:transparent;font-family:inherit;}
body.dark .fi-btn{color:#f0f0f0;}
.fi-btn:hover{background:var(--lt);}
.fi-btn.del{color:var(--red);border-color:#fecaca;}
.fi-done{color:var(--grn)!important;border-color:#86efac!important;background:#f0fdf4!important;font-weight:700;}
.fi-undone{color:#bbb!important;border-color:#e8e8ec!important;}

/* COMMENT BADGE */
.fi-comment-badge{position:absolute;bottom:4px;right:4px;background:var(--blue);color:#fff;border-radius:9px;font-size:9px;padding:1px 5px;font-weight:600;}

/* PRODUCT/PROJECT GRIDS */
.pg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(165px,1fr));gap:9px;}
.pcard{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden;position:relative;}
.pcard:hover{border-color:#bbb;}
.p-img{height:110px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:34px;overflow:hidden;}
.p-img img{width:100%;height:100%;object-fit:cover;}
.pj-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(230px,1fr));gap:9px;}
.pjcard{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:12px;cursor:pointer;position:relative;}
.pjcard:hover{border-color:#bbb;}
.pill{display:inline-flex;align-items:center;gap:3px;padding:2px 7px;border-radius:20px;font-size:10px;font-weight:500;margin-bottom:6px;}
.s-a{background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;}
.s-p{background:#eff2ff;color:var(--blue);border:1px solid #d0d8ff;}
.prog-w{height:3px;background:var(--lt);border-radius:2px;margin-top:5px;}
.prog-b{height:3px;background:var(--blue);border-radius:2px;}
.pj-dhdr{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:13px 15px;margin-bottom:13px;position:sticky;top:46px;z-index:40;}
.c-chip{display:inline-flex;align-items:center;gap:4px;padding:3px 9px 3px 3px;border-radius:24px;border:1px solid var(--bdr);background:var(--lt);cursor:pointer;margin:2px;font-size:11px;font-weight:500;}
.c-chip:hover{border-color:#bbb;}
.chip-av{width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:600;color:#fff;flex-shrink:0;overflow:hidden;}

/* THREE DOT */
.dot-btn{width:22px;height:22px;border-radius:50%;border:none;background:transparent;font-size:14px;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;padding:0;font-family:inherit;line-height:1;}
.dot-btn:hover{background:var(--act);}
.drop-menu{position:fixed;background:var(--surf);border:1px solid var(--bdr);border-radius:8px;padding:3px;min-width:135px;z-index:2000;box-shadow:0 4px 14px rgba(0,0,0,.12);display:none;}
.drop-menu.open{display:block;}
.dm-i{display:flex;align-items:center;gap:7px;padding:6px 10px;border-radius:5px;cursor:pointer;font-size:12px;color:#111;font-family:inherit;border:none;background:transparent;width:100%;text-align:left;}
body.dark .dm-i{color:#f0f0f0;}
.dm-i:hover{background:var(--lt);}
.dm-i.red{color:var(--red)!important;}

/* TEAM TABLE */
.th{display:grid;padding:7px 12px;border-bottom:1px solid var(--bdr);font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.8px;}
.tr{display:grid;padding:8px 12px;border-bottom:1px solid var(--bdr);align-items:center;}
.tr:last-child{border-bottom:none;}
.tr:hover{background:var(--lt);}

/* LIGHTBOX */
.lb{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:800;display:none;flex-direction:column;align-items:center;justify-content:center;}
.lb.open{display:flex;}
.lb-x{position:absolute;top:14px;right:14px;color:#fff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;}
.lb img,.lb video{max-width:80vw;max-height:62vh;border-radius:7px;}
.lb-btn{padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;font-family:inherit;}
.lb-comment-box{background:rgba(0,0,0,.6);border-radius:9px;padding:12px;width:min(400px,86vw);margin-top:10px;}
.lb-comment-input{width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12px;outline:none;font-family:inherit;resize:none;}
.lb-comment-item{background:rgba(255,255,255,.08);border-radius:6px;padding:7px 9px;margin-bottom:5px;font-size:11px;color:#e0e0e0;}
.lb-comment-date{font-size:10px;color:#888;margin-top:2px;}

/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);z-index:600;display:none;align-items:center;justify-content:center;}
.modal-bg.open{display:flex;}
.modal{background:var(--surf);border-radius:12px;padding:18px;width:460px;max-width:94vw;max-height:88vh;overflow-y:auto;border:1px solid var(--bdr);color:#111;}
body.dark .modal{color:#f0f0f0;}
.modal-t{font-size:14px;font-weight:700;margin-bottom:13px;}
.fg{margin-bottom:9px;}
.fl{display:block;font-size:9px;font-weight:600;color:var(--muted);margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px;}
.fi{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;font-family:inherit;font-size:12px;color:#111;outline:none;background:var(--surf);}
body.dark .fi{color:#f0f0f0;}
.fi:focus{border-color:#999;}
.modal-acts{display:flex;gap:6px;justify-content:flex-end;margin-top:12px;}
.dz{border:1.5px dashed var(--bdr);border-radius:8px;padding:13px;text-align:center;cursor:pointer;background:var(--lt);}
.dz:hover{border-color:var(--blue);}
.dz.done{border-color:var(--grn);}
.prog-track{height:4px;background:var(--lt);border-radius:2px;margin-top:4px;overflow:hidden;}
.prog-fill{height:4px;background:var(--blue);border-radius:2px;width:0;transition:width .12s;}
.tgl{width:32px;height:17px;border-radius:9px;background:var(--bdr);position:relative;cursor:pointer;flex-shrink:0;display:inline-block;}
.tgl.on{background:var(--blue);}
.tgl-d{width:13px;height:13px;border-radius:50%;background:#fff;position:absolute;top:2px;left:2px;transition:transform .18s;}
.tgl.on .tgl-d{transform:translateX(15px);}
.role-opt{padding:8px 10px;border-radius:7px;border:1px solid var(--bdr);cursor:pointer;}
.role-opt.sel{border-color:var(--blue);background:#eff2ff;}
.c-sel-i{display:flex;align-items:center;gap:8px;padding:7px 9px;border-radius:7px;border:1px solid var(--bdr);cursor:pointer;margin-bottom:3px;}
.c-sel-i:hover{background:var(--lt);}
.c-sel-i.sel{border-color:var(--blue);background:#eff2ff;}
.chk{margin-left:auto;width:14px;height:14px;border-radius:50%;border:1.5px solid var(--bdr);display:flex;align-items:center;justify-content:center;font-size:7px;flex-shrink:0;}
.c-sel-i.sel .chk{background:var(--blue);border-color:var(--blue);color:#fff;}
.bk{display:inline-flex;align-items:center;gap:4px;color:var(--muted);font-size:12px;cursor:pointer;margin-bottom:10px;background:none;border:none;padding:0;font-family:inherit;}
.bk:hover{color:var(--blue);}

/* MISC */
.empty{text-align:center;padding:32px 14px;color:var(--muted);}
.toast{position:fixed;bottom:16px;right:16px;background:#111;color:#fff;border-radius:8px;padding:8px 13px;font-size:12px;opacity:0;transform:translateY(6px);transition:all .2s;z-index:900;pointer-events:none;}
.toast.show{opacity:1;transform:translateY(0);}
.fp{position:absolute;top:calc(100% + 4px);right:0;background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:12px;width:260px;z-index:200;box-shadow:0 4px 16px rgba(0,0,0,.1);display:none;}
.fp.open{display:block;}
.fp-chip{padding:2px 7px;border-radius:20px;border:1px solid var(--bdr);background:var(--surf);font-size:10px;cursor:pointer;margin:2px;display:inline-flex;color:var(--muted);}
.fp-chip:hover{border-color:#aaa;}
.fp-chip.sel{background:#111;color:#fff;border-color:#111;}
.af-chip{display:inline-flex;align-items:center;gap:3px;padding:2px 6px;border-radius:20px;background:#eff2ff;color:var(--blue);font-size:10px;border:1px solid #d0d8ff;margin:2px;}
.up-menu{position:fixed;background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:12px;width:200px;z-index:1500;box-shadow:0 4px 16px rgba(0,0,0,.12);display:none;}
.up-menu.open{display:block;}

/* BULK TOOLBAR */
.bulk-bar{background:var(--blue);color:#fff;border-radius:9px;padding:8px 14px;display:none;align-items:center;gap:10px;margin-bottom:12px;font-size:12px;}
.bulk-bar.on{display:flex;}

/* CREATOR PORTAL */
.portal{display:none;position:fixed;inset:0;background:var(--bg);z-index:500;flex-direction:column;}
.portal.open{display:flex;}
.portal-topbar{background:var(--surf);border-bottom:1px solid var(--bdr);padding:0 20px;height:52px;display:flex;align-items:center;gap:12px;}
.portal-sb{width:200px;background:var(--surf);border-right:1px solid var(--bdr);display:flex;flex-direction:column;flex-shrink:0;}
.portal-main{flex:1;overflow-y:auto;padding:20px;}
.portal-content{display:flex;flex:1;overflow:hidden;}
.tips-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(180px,1fr));gap:12px;margin-top:14px;}
.tip-card{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:16px;cursor:pointer;text-align:center;}
.tip-card:hover{border-color:var(--blue);}
.tip-card-icon{font-size:32px;margin-bottom:8px;}
.tip-card-label{font-size:13px;font-weight:600;}
.tip-card-count{font-size:10px;color:var(--muted);margin-top:3px;}
.prod-tip-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:10px;}
.prod-tip-card{background:var(--surf);border:1px solid var(--bdr);border-radius:9px;overflow:hidden;cursor:pointer;}
.prod-tip-card:hover{border-color:var(--blue);}
.prod-tip-img{height:90px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:28px;}
.prod-tip-name{padding:8px;font-size:12px;font-weight:600;}

/* SEARCH OVERLAY */
.search-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:400;display:none;flex-direction:column;align-items:center;padding-top:80px;}
.search-overlay.open{display:flex;}
.search-box{background:var(--surf);border-radius:12px;width:min(580px,94vw);padding:16px;border:1px solid var(--bdr);box-shadow:0 8px 32px rgba(0,0,0,.2);}
.search-inp{width:100%;font-size:16px;border:none;outline:none;background:transparent;color:#111;font-family:inherit;padding:4px 0 12px;border-bottom:1px solid var(--bdr);margin-bottom:12px;}
body.dark .search-inp{color:#f0f0f0;}
.search-result{display:flex;align-items:center;gap:10px;padding:8px;border-radius:7px;cursor:pointer;}
.search-result:hover{background:var(--lt);}

/* DIVIDER */
.divider{height:1px;background:var(--bdr);margin:10px 0;}

/* ── RESPONSIVE ──────────────────────────────────────────────────────── */
@media(max-width:900px){
  .sb{transform:translateX(-100%);z-index:200;}
  .sb.open{transform:translateX(0);}
  .main{margin-left:0;}
  .sb-overlay{display:block;}
}
@media(max-width:600px){
  .content{padding:12px;}
  .ph{flex-direction:column;align-items:flex-start;gap:8px;}
  .stat-row{grid-template-columns:1fr 1fr!important;}
  .topbar{padding:0 12px;}
}
.sb-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:199;}
.menu-toggle{display:none;background:none;border:none;font-size:18px;cursor:pointer;padding:4px 8px;color:var(--text);}
@media(max-width:900px){.menu-toggle{display:flex;align-items:center;}}

.ch-card{transition:box-shadow 0.15s;}
.ch-card:hover{box-shadow:0 4px 16px rgba(0,0,0,0.08);}
`

const PORTAL_HTML = `<div class="portal" id="creator-portal">
  <div class="portal-topbar">
    <div style="font-size:14px;font-weight:700">🎨 Creator Portal</div>
    <div style="font-size:11px;color:var(--muted);margin-left:8px">Ansicht als Creator</div>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <div style="font-size:11px;color:var(--muted)" id="portal-user-label">Angemeldet als: <strong>Mira Hartley</strong></div>
      <button class="btn btn-sm" id="portal-logout-btn" style="background:transparent;border:1px solid var(--bdr);color:var(--muted);font-size:11px;padding:4px 10px;border-radius:6px;cursor:pointer">⏻ Abmelden</button>
      <button class="btn btn-sm" id="close-portal">✕ Portal schließen</button>
    </div>
  </div>
  <div class="portal-content">
    <div class="portal-sb">
      <div class="nav-s">
        <div class="nav-l">Mein Bereich</div>
        <div class="ni on" id="pni-home"><span class="ni-ico">⊞</span>Mein Dashboard</div>
        <div class="ni" id="pni-upload"><span class="ni-ico">⬆</span>Inhalte hochladen</div>
        <div class="ni" id="pni-tips"><span class="ni-ico">💡</span>Tipps & Tricks</div>
      </div>
      <div class="nav-s">
        <div class="nav-l">Tipps & Tricks</div>
        <div class="ni" id="pni-briefings" style="padding-left:20px"><span class="ni-ico">📋</span>Briefings</div>
        <div class="ni" id="pni-skripte" style="padding-left:20px"><span class="ni-ico">📝</span>Skripte</div>
        <div class="ni" id="pni-videos" style="padding-left:20px"><span class="ni-ico">🎬</span>Lernvideos</div>
      </div>
    </div>
    <div class="portal-main" id="portal-main"></div>
  </div>
</div>
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
<div class="lb" id="lb">
  <div class="lb-x" id="lb-x">✕</div>
  <img id="lb-img" style="display:none">
  <video id="lb-vid" controls style="display:none"></video>
  <div style="color:#fff;margin-top:9px;text-align:center">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px" id="lb-name"></div>
    <div style="font-size:10px;opacity:.6" id="lb-meta"></div>
  </div>
  <div style="display:flex;gap:7px;margin-top:9px">
    <a id="lb-dl" class="lb-btn" download>⬇ Download</a>
    <button class="lb-btn" id="lb-close">✕ Schließen</button>
  </div>
  <!-- KOMMENTARE -->
  <div class="lb-comment-box" id="lb-comments-box">
    <div style="font-size:11px;font-weight:600;color:#fff;margin-bottom:7px">💬 Kommentare</div>
    <div id="lb-comments-list" style="max-height:100px;overflow-y:auto;margin-bottom:7px"></div>
    <div style="display:flex;gap:6px">
      <textarea class="lb-comment-input" id="lb-comment-inp" rows="1" placeholder="Kommentar schreiben..."></textarea>
      <button class="lb-btn" id="lb-comment-send" style="flex-shrink:0;font-size:11px">Senden</button>
    </div>
  </div>
</div>
`

const APP_JS = `
const G=id=>document.getElementById(id);
const CL=['#6366f1','#ec4899','#06b6d4','#f97316','#84cc16','#f43f5e','#8b5cf6','#10b981'];
const FL={DE:'🇩🇪',AT:'🇦🇹',CH:'🇨🇭',US:'🇺🇸',GB:'🇬🇧'};
let _id=1000;const uid=()=>++_id;
function showT(m,dur=2600){const t=G('toast');t.textContent=m;t.classList.add('show');setTimeout(()=>t.classList.remove('show'),dur);}

// ── STATE ──────────────────────────────────────────────────────────────────
const S={
  page:'dashboard',dark:false,
  modal:null,form:{},selRole:'read',selC:[],
  aC:null,aCT:'bilder',aF:null,aPJ:null,aPT:'bilder',aK:null,
  flt:{prods:[],tags:[],cid:null},search:'',
  tags:['Fashion','Beauty','Lifestyle','Tech','Sport','Food','Brand'],
  bulkSel:[],bulkMode:false,
  activeLbFile:null,activeLbFld:null,
  creators:[
    {id:1,name:'Mira Hartley',ini:'MH',color:'#6366f1',age:28,email:'mira@example.com',gender:'female',country:'DE',
     tags:['Fashion','Beauty'],desc:'Family Life Creator',up:new Date('2024-03-22'),photo:null,
     instagram:'https://instagram.com/mirahartley',kids:true,kidsAges:['4','7'],kidsOnVid:true,
     verguetung:'provision',provision:'15',fixbetrag:'',notizen:'Macht keine Produktvergleiche. Bevorzugt Story-Format. Liefert immer pünktlich.',notizenCreator:'Bitte immer Story-Format verwenden. Deadline im Blick behalten!',
     vertrag:null,vertragsname:'',invited:true,
     flds:{bilder:[{id:101,name:'Winter Lookbook',batch:'Winter Batch',date:'2024-01-15',deadline:'2024-12-31',prods:['Serum XY'],tags:['Fashion'],files:[
       {id:1001,name:'lookbook_01.jpg',type:'image',url:null,size:'2.4 MB',uploadedAt:null,comments:[]},
       {id:1002,name:'product_shot.jpg',type:'image',url:null,size:'1.8 MB',uploadedAt:'2024-01-20',comments:['Bitte nochmal ohne Logo – Admin, 20.01.2024']}
     ]},{id:102,name:'Spring Collection',batch:'Spring',date:'2024-03-10',deadline:'',prods:[],tags:[],files:[]}],
     videos:[{id:103,name:'Brand Videos',batch:'Feb',date:'2024-02-20',deadline:'2025-06-01',prods:[],tags:[],files:[{id:1003,name:'brand_video.mp4',type:'video',url:null,size:'45 MB',uploadedAt:null,comments:[]}]}],
     roh:[],auswertung:[]}},
    {id:2,name:'Sophie Klein',ini:'SK',color:'#ec4899',age:24,email:'sophie@example.com',gender:'female',country:'DE',
     tags:['Lifestyle'],desc:'Lifestyle & Travel',up:new Date('2024-03-20'),photo:null,
     instagram:'https://instagram.com/sophieklein_',kids:false,kidsAges:[],kidsOnVid:false,
     verguetung:'fix',provision:'',fixbetrag:'800',notizen:'Bevorzugt Reels. Keine politischen Themen.',notizenCreator:'',
     vertrag:null,vertragsname:'',invited:true,
     flds:{bilder:[{id:201,name:'Summer Vibes',batch:'Summer',date:'2024-06-01',deadline:'',prods:[],tags:['Lifestyle'],files:[{id:2001,name:'summer_01.jpg',type:'image',url:null,size:'3.1 MB',uploadedAt:'2024-06-05',comments:[]}]}],
     videos:[{id:202,name:'Collab',batch:'Collab',date:'2024-07-15',deadline:'',prods:[],tags:[],files:[{id:2002,name:'collab.mp4',type:'video',url:null,size:'88 MB',uploadedAt:null,comments:[]}]}],roh:[],auswertung:[]}},
    {id:3,name:'Lucas Bauer',ini:'LB',color:'#06b6d4',age:31,email:'lucas@example.com',gender:'male',country:'AT',
     tags:['Tech'],desc:'Tech & Gadgets',up:new Date('2024-02-10'),photo:null,instagram:'',kids:false,kidsAges:[],kidsOnVid:false,
     verguetung:'beides',provision:'10',fixbetrag:'500',notizen:'Nur Tech-Produkte. Macht ausführliche Reviews.',
     vertrag:null,vertragsname:'',invited:false,
     flds:{bilder:[],videos:[{id:301,name:'Reviews',batch:'Rev',date:'2024-03-05',deadline:'2025-04-01',prods:[],tags:['Tech'],files:[{id:3001,name:'review.mp4',type:'video',url:null,size:'95 MB',uploadedAt:null,comments:[]}]}],roh:[],auswertung:[]}},
    {id:4,name:'Anna Sommer',ini:'AS',color:'#f97316',age:26,email:'anna@example.com',gender:'female',country:'DE',
     tags:['Food'],desc:'Food & Lifestyle',up:new Date('2024-03-22'),photo:null,instagram:'https://instagram.com/annasommer.food',kids:true,kidsAges:['9'],kidsOnVid:false,
     verguetung:'fix',provision:'',fixbetrag:'600',notizen:'',notizenCreator:'',vertrag:null,vertragsname:'',invited:false,
     flds:{bilder:[{id:401,name:'Recipe Shots',batch:'April',date:'2024-04-10',deadline:'',prods:[],tags:['Food'],files:[{id:4001,name:'recipe_01.jpg',type:'image',url:null,size:'2.1 MB',uploadedAt:null,comments:[]}]}],videos:[],roh:[],auswertung:[]}},
    {id:5,name:'Ben Müller',ini:'BM',color:'#84cc16',age:29,email:'ben@example.com',gender:'male',country:'DE',
     tags:['Sport'],desc:'Sport & Fitness',up:new Date('2024-03-18'),photo:null,instagram:'',kids:false,kidsAges:[],kidsOnVid:false,
     verguetung:'provision',provision:'12',fixbetrag:'',notizen:'',notizenCreator:'',vertrag:null,vertragsname:'',invited:false,
     flds:{bilder:[{id:501,name:'Gym Shots',batch:'Feb',date:'2024-02-15',deadline:'',prods:[],tags:['Sport'],files:[{id:5001,name:'gym_01.jpg',type:'image',url:null,size:'2.8 MB',uploadedAt:null,comments:[]}]}],videos:[],roh:[],auswertung:[]}},
  ],
  team:[{id:1,name:'Admin User',email:'admin@filapen.de',role:'admin',status:'active',you:true},{id:2,name:'Julia Wagner',email:'julia@filapen.de',role:'admin',status:'active'},{id:3,name:'Tom Becker',email:'tom@filapen.de',role:'read',status:'active'},{id:4,name:'Lena Müller',email:'lena@filapen.de',role:'read',status:'pending'}],
  produkte:[
    {id:1,name:'Serum XY',cat:'Skincare',icon:'💄',url:null,tags:['Beauty'],briefings:['Hebe die feuchtigkeitsspendende Wirkung hervor','Zeige Vorher/Nachher wenn möglich'],skripte:['Hook: Meine Haut war noch nie so weich...','CTA: Link in Bio für 20% Rabatt'],lernvideos:[]},
    {id:2,name:'Protein Shake',cat:'Fitness',icon:'💪',url:null,tags:['Sport'],briefings:['Zeige Zubereitung','Erwähne 30g Protein pro Portion'],skripte:['Hook: Der Shake der meinen Gym-Alltag verändert hat'],lernvideos:[]}
  ],
  projekte:[{id:1,name:'Winter Kampagne',pids:[1],aktion:'20% WINTER24',start:'2024-01-01',count:3,cids:[1,2],status:'active',url:null}],
  kat:[{id:1,name:'Bilder',icon:'🖼️',type:'bilder'},{id:2,name:'Videos',icon:'🎬',type:'videos'},{id:3,name:'Rohmaterial',icon:'📹',type:'roh'},{id:4,name:'Auswertungen',icon:'📊',type:'auswertung'}],
};

// ── CUSTOM CONFIRM ──────────────────────────────────────────────────────────
let _confirmCB=null;
function askConfirm(msg,cb){_confirmCB=cb;G('confirm-title').textContent=msg;G('confirm-bg').style.display='flex';}
G('confirm-ok').addEventListener('click',()=>{G('confirm-bg').style.display='none';if(_confirmCB){_confirmCB();_confirmCB=null;}});
G('confirm-cancel').addEventListener('click',()=>{G('confirm-bg').style.display='none';_confirmCB=null;});
G('confirm-bg').addEventListener('click',e=>{if(e.target===G('confirm-bg')){G('confirm-bg').style.display='none';_confirmCB=null;}});

// ── DROP MENU ──────────────────────────────────────────────────────────────
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

// ── NAVIGATE ──────────────────────────────────────────────────────────────
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

// ── HELPERS ────────────────────────────────────────────────────────────────
function kidsBadges(c){
  if(!c.kids||!c.kidsAges||!c.kidsAges.length)return'';
  const ages=c.kidsAges.map(a=>\`<span class="kb">👶 \${a}J</span>\`).join('');
  const cam=c.kidsOnVid?'<span class="kb">📷 zeigt Kinder</span>':'<span class="kb-no">zeigt Kinder nicht</span>';
  return\`<div style="display:flex;gap:3px;flex-wrap:wrap;margin-top:3px">\${ages}\${cam}</div>\`;
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

// ── DASHBOARD ─────────────────────────────────────────────────────────────
function rDash(){
  const tf=S.creators.reduce((s,c)=>s+Object.values(c.flds).flat().reduce((ss,f)=>ss+f.files.length,0),0);
  G('d-stats').innerHTML=\`
    <div class="sc" id="ds-c"><div class="sl">Creator</div><div class="sv">\${S.creators.length}</div></div>
    <div class="sc" id="ds-p"><div class="sl">Produkte</div><div class="sv">\${S.produkte.length}</div></div>
    <div class="sc" id="ds-pj"><div class="sl">Projekte</div><div class="sv">\${S.projekte.length}</div></div>
    <div class="sc"><div class="sl">Uploads</div><div class="sv">\${tf}</div></div>\`;
  G('ds-c')?.addEventListener('click',()=>go('creators'));
  G('ds-p')?.addEventListener('click',()=>go('produkte'));
  G('ds-pj')?.addEventListener('click',()=>go('projekte'));
  // 14-Tage-Warnung
  const late=S.creators.filter(c=>{const d=lastUploadDays(c);return d!==null&&d>=14;});
  let warnHtml='';
  if(late.length && !S._warnDismissed){
    warnHtml=\`<div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:9px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:#92400e;display:flex;align-items:flex-start;justify-content:space-between;gap:10px" id="warn-14d">
      <div>⚠️ <strong>\${late.length} Creator</strong> \${late.length===1?'hat':'haben'} seit 14+ Tagen keinen Content geliefert: 
      \${late.map(c=>\`<strong>\${c.name}</strong>\`).join(', ')}</div>
      <button id="warn-dismiss" style="background:none;border:none;cursor:pointer;font-size:16px;color:#92400e;line-height:1;padding:0;flex-shrink:0">✕</button>
    </div>\`;
  }
  let list=[...S.creators].sort((a,b)=>b.up-a.up);
  if(S.flt.cid)list=list.filter(c=>c.id===S.flt.cid);
  if(S.flt.tags.length)list=list.filter(c=>S.flt.tags.some(t=>c.tags.includes(t)));
  if(S.search)list=list.filter(c=>c.name.toLowerCase().includes(S.search.toLowerCase()));
  G('af-row').innerHTML=warnHtml;
  if(warnHtml){
    setTimeout(()=>{
      G('warn-dismiss')?.addEventListener('click',()=>{
        S._warnDismissed=true;
        G('warn-14d')?.remove();
      });
    },0);
  }
  G('d-creators').innerHTML=cRowsHTML(list.slice(0,5));
  attachCR(G('d-creators'));
}

// ── CREATOR ROWS ──────────────────────────────────────────────────────────
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
          <div style="font-size:13px;font-weight:600;margin-bottom:1px">\${c.name} \${c.invited?'<span style="font-size:9px;background:#f0fdf4;color:var(--grn);border:1px solid #bbf7d0;border-radius:5px;padding:1px 5px">Portal ✓</span>':''}</div>
          <div style="font-size:10px;color:var(--muted)">\${c.desc} · \${c.age}J</div>
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
  // Click on full creator row → open creator profile
  container.querySelectorAll('.cr[data-cid]').forEach(row=>{
    row.style.cursor='pointer';
    row.addEventListener('click',e=>{
      if(e.target.closest('.dot-btn')||e.target.closest('[data-dot-c]')||e.target.closest('.social-badge'))return;
      const cid=+row.dataset.cid;
      if(S.page!=='creators'){go('creators');setTimeout(()=>openC(cid),80);}
      else openC(cid);
    });
  });
  container.querySelectorAll('[data-open-c]').forEach(el=>el.addEventListener('click',e=>{
    e.stopPropagation();
    const cid=+el.dataset.openC;
    if(S.page!=='creators'){go('creators');setTimeout(()=>openC(cid),80);}
    else openC(cid);
  }));
  container.querySelectorAll('[data-dot-c]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();
    const c=S.creators.find(x=>x.id===+btn.dataset.dotC);
    if(c)showDot(btn,()=>openM('editC',c.id),()=>delC(c.id,c.name),()=>openPortal(c.id));
  }));
}

function showCL(){G('c-lv').style.display='block';G('c-dv').style.display='none';G('tb-action').innerHTML='';}
function rCreators(){const list=S.creators.filter(c=>!S.search||c.name.toLowerCase().includes(S.search.toLowerCase()));G('c-list').innerHTML=cRowsHTML(list);attachCR(G('c-list'));}

function openC(id){
  const c=S.creators.find(x=>x.id===id);if(!c)return;
  S.aC=c;S.aCT='bilder';
  G('c-lv').style.display='none';G('c-dv').style.display='block';
  G('tb-t').textContent=c.name;
  rCHdr();
  G('c-tabs').querySelectorAll('.tab').forEach((t,i)=>t.classList.toggle('on',i===0));
  rCT('bilder');
}

function rCHdr(){
  const c=S.aC;if(!c)return;
  const tf=Object.values(c.flds).flat().reduce((s,f)=>s+f.files.length,0);
  const tags=c.tags.map(t=>\`<span class="tag">\${t}</span>\`).join('');
  const av=c.photo?\`<div class="cd-av"><img src="\${c.photo}"></div>\`:\`<div class="cd-av" style="background:\${c.color}">\${c.ini}</div>\`;
  G('c-hdr').innerHTML=\`\${av}
    <div style="flex:1">
      <div style="font-size:16px;font-weight:700;margin-bottom:2px">\${c.name}</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:4px">\${c.email} · \${c.age}J · \${FL[c.country]||''}</div>
      <div style="display:flex;gap:3px;flex-wrap:wrap">\${tags}\${socialBadge(c)}\${verguetungBadge(c)}</div>
      \${kidsBadges(c)?\`<div style="margin-top:4px">\${kidsBadges(c)}</div>\`:''}
    </div>
    <div style="display:flex;gap:10px;flex-shrink:0">
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${c.flds.bilder.length}</strong><span style="font-size:9px;color:#aaa">Bilder</span></div>
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${c.flds.videos.length}</strong><span style="font-size:9px;color:#aaa">Videos</span></div>
      <div style="text-align:center"><strong style="display:block;font-size:14px;font-weight:700">\${tf}</strong><span style="font-size:9px;color:#aaa">Dateien</span></div>
    </div>
    <button class="dot-btn" id="chdr-dot">···</button>\`;
  G('chdr-dot').addEventListener('click',e=>{e.stopPropagation();showDot(e.currentTarget,()=>openM('editC',c.id),()=>delC(c.id,c.name),()=>openPortal(c.id));});
}

function rCT(tab){
  const c=S.aC;if(!c)return;
  S.bulkSel=[];S.bulkMode=false;

  // NOTIZEN & VERTRAG tab
  if(tab==='notizen'){
    G('c-tc').innerHTML=\`
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
        <div class="sc" style="padding:16px">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">🔒 Interne Notizen</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Nur für das Team sichtbar – Creator sieht das nicht</div>
          <textarea class="fi" id="notiz-inp" rows="4" placeholder="Interne Anmerkungen zum Creator..." style="resize:vertical">\${c.notizen||''}</textarea>
          <div style="font-size:13px;font-weight:600;margin-top:14px;margin-bottom:4px">💬 Hinweis für Creator</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:8px">Erscheint im Creator-Portal als persönlicher Hinweis</div>
          <textarea class="fi" id="notiz-creator-inp" rows="4" placeholder="z.B. Bitte immer Story-Format verwenden. Deadline beachten!" style="resize:vertical">\${c.notizenCreator||''}</textarea>
          <button class="btn btn-p" style="width:100%;margin-top:8px" id="notiz-save">Notizen speichern</button>
        </div>
        <div class="sc" style="padding:16px">
          <div style="font-size:13px;font-weight:600;margin-bottom:4px">💶 Vergütungsmodell</div>
          <div style="font-size:11px;color:var(--muted);margin-bottom:12px">\${verguetungBadge(c)||'Noch nicht festgelegt'}</div>
          <div class="fg"><label class="fl">Modell</label>
            <select class="fi" id="verg-model">
              <option value="provision" \${c.verguetung==='provision'?'selected':''}>Provision (%)</option>
              <option value="fix" \${c.verguetung==='fix'?'selected':''}>Fixbetrag (€)</option>
              <option value="beides" \${c.verguetung==='beides'?'selected':''}>Beides</option>
            </select>
          </div>
          <div class="fg" id="verg-prov-wrap" style="display:\${c.verguetung==='provision'||c.verguetung==='beides'?'block':'none'}">
            <label class="fl">Provision %</label><input class="fi" id="verg-prov" type="number" value="\${c.provision||''}" placeholder="z.B. 15">
          </div>
          <div class="fg" id="verg-fix-wrap" style="display:\${c.verguetung==='fix'||c.verguetung==='beides'?'block':'none'}">
            <label class="fl">Fixbetrag €</label><input class="fi" id="verg-fix" type="number" value="\${c.fixbetrag||''}" placeholder="z.B. 800">
          </div>
          <button class="btn btn-p" style="width:100%" id="verg-save">Vergütung speichern</button>
        </div>
        <div class="sc" style="padding:16px;grid-column:1/-1">
          <div style="font-size:13px;font-weight:600;margin-bottom:10px">📄 Vertrag</div>
          \${c.vertragsname?\`
            <div style="display:flex;align-items:center;gap:10px;background:var(--lt);border-radius:8px;padding:10px 12px;margin-bottom:10px">
              <div style="font-size:22px">📄</div>
              <div style="flex:1"><div style="font-size:12px;font-weight:600">\${c.vertragsname}</div><div style="font-size:10px;color:var(--muted)">Hochgeladen</div></div>
              <button class="btn btn-sm" id="vertrag-del">Entfernen</button>
            </div>\`:'<div style="font-size:12px;color:var(--muted);margin-bottom:10px">Noch kein Vertrag hochgeladen.</div>'}
          <div class="dz" id="vertrag-dz"><div style="font-size:18px;margin-bottom:3px">📎</div><div style="font-size:11px;font-weight:500">PDF hierher ziehen oder klicken</div></div>
          <input type="file" id="vertrag-inp" accept=".pdf,.doc,.docx" style="display:none">
        </div>
      </div>\`;

    G('notiz-save').addEventListener('click',()=>{c.notizen=G('notiz-inp').value;c.notizenCreator=G('notiz-creator-inp').value;showT('Notizen gespeichert ✓');});
    G('verg-model').addEventListener('change',e=>{
      G('verg-prov-wrap').style.display=e.target.value==='provision'||e.target.value==='beides'?'block':'none';
      G('verg-fix-wrap').style.display=e.target.value==='fix'||e.target.value==='beides'?'block':'none';
    });
    G('verg-save').addEventListener('click',()=>{
      c.verguetung=G('verg-model').value;
      c.provision=G('verg-prov')?.value||'';
      c.fixbetrag=G('verg-fix')?.value||'';
      rCHdr();showT('Vergütung gespeichert ✓');
    });
    G('vertrag-dz').addEventListener('click',()=>G('vertrag-inp').click());
    G('vertrag-inp').addEventListener('change',()=>{
      const f=G('vertrag-inp').files[0];if(!f)return;
      const r=new FileReader();r.onload=e=>{c.vertrag=e.target.result;c.vertragsname=f.name;rCT('notizen');showT('Vertrag hochgeladen ✓');};r.readAsDataURL(f);
    });
    G('vertrag-del')?.addEventListener('click',()=>{c.vertrag=null;c.vertragsname='';rCT('notizen');showT('Vertrag entfernt');});
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
  G('c-tc').querySelectorAll('[data-fld]').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openFld(+card.dataset.fld,card.dataset.tab);}));
  G('c-tc').querySelectorAll('[data-fld-dot]').forEach(btn=>btn.addEventListener('click',e=>{
    e.stopPropagation();
    const fid=+btn.dataset.fldDot;const t2=btn.closest('[data-tab]')?.dataset.tab||S.aCT;
    const folder=S.aC?.flds[t2]?.find(f=>f.id===fid);
    if(folder)showDot(btn,()=>openM('editFld',{id:fid,tab:t2}),()=>delFld(fid,t2,folder.name));
  }));
}

function openFld(fid,tab){
  const c=S.aC;if(!c)return;
  const fld=c.flds[tab]?.find(f=>f.id===fid);if(!fld)return;
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
  G('bulk-upload').addEventListener('click',()=>{const today=new Date().toISOString().slice(0,10);S.bulkSel.forEach(id=>{const f=fld.files.find(x=>x.id===id);if(f)f.uploadedAt=today;});S.bulkSel=[];rFiles(fld);showT(\`✓ Als hochgeladen markiert\`);});
  G('bulk-del').addEventListener('click',()=>{askConfirm(\`\${S.bulkSel.length} Dateien löschen?\`,()=>{fld.files=fld.files.filter(f=>!S.bulkSel.includes(f.id));S.bulkSel=[];rFiles(fld);rCHdr();showT('Gelöscht');});});
  rFiles(fld);
}

function rFiles(fld){
  const el=G('ff-grid');if(!el)return;
  if(!fld.files.length){
    el.innerHTML=\`<div class="empty" style="grid-column:1/-1"><div>📂</div><div style="margin:4px 0 8px">Keine Dateien</div><button class="btn btn-p" id="no-f-btn">+ Upload</button></div>\`;
    G('no-f-btn')?.addEventListener('click',()=>openM('upload'));return;
  }
  el.innerHTML=fld.files.map(f=>{
    const isI=f.type==='image',isV=f.type==='video';
    const th=f.url?(isI?\`<img src="\${f.url}">\`:\`<video src="\${f.url}" preload="metadata"></video>\`):\`<span>\${isI?'🖼️':isV?'🎬':'📄'}</span>\`;
    const pov=isV?\`<div class="play-ov"><div class="play-btn">▶</div></div>\`:'';
    const isSel=S.bulkSel.includes(f.id);
    const cbHtml=S.bulkMode?\`<div class="fi-sel-cb">\${isSel?'✓':''}</div>\`:'';
    const commBadge=f.comments&&f.comments.length?\`<div class="fi-comment-badge">\${f.comments.length}</div>\`:'';
    const upClass=f.uploadedAt?'fi-done':'fi-undone';
    const upTitle=f.uploadedAt?\`Hochgeladen: \${new Date(f.uploadedAt).toLocaleDateString('de-DE')}\`:'Als hochgeladen markieren';
    return\`<div class="ficard\${isSel?' selected':''}" data-fcid="\${f.id}">
      <div class="fi-thumb" data-lb="\${f.id}" data-lb-fld="\${fld.id}">\${th}\${pov}\${cbHtml}\${commBadge}</div>
      <div class="fi-info">
        <div class="fi-name" title="\${f.name}">\${f.name}</div>
        <div class="fi-meta">\${f.size||''}</div>
        <div class="fi-acts">
          <a class="fi-btn" href="\${f.url||'#'}" download="\${f.name}">⬇</a>
          <button class="fi-btn \${upClass}" data-up="\${f.id}" data-ufl="\${fld.id}" title="\${upTitle}">\${f.uploadedAt?'✓':'○'}</button>
          <button class="fi-btn del" data-df="\${f.id}" data-dfl="\${fld.id}">🗑</button>
        </div>
      </div>
    </div>\`;
  }).join('')+\`<div class="add-fcard" style="min-height:110px" id="add-fi-btn"><div>+</div><span style="font-size:10px">Upload</span></div>\`;

  el.querySelectorAll('[data-lb]').forEach(t=>t.addEventListener('click',()=>{
    if(S.bulkMode){
      const fid=+t.dataset.lb;
      if(S.bulkSel.includes(fid))S.bulkSel=S.bulkSel.filter(x=>x!==fid);else S.bulkSel.push(fid);
      G('bulk-count').textContent=S.bulkSel.length+' ausgewählt';
      rFiles(fld);return;
    }
    openLB(+t.dataset.lb,+t.dataset.lbFld);
  }));
  el.querySelectorAll('[data-df]').forEach(btn=>btn.addEventListener('click',()=>delFile(+btn.dataset.df,+btn.dataset.dfl)));
  G('add-fi-btn')?.addEventListener('click',()=>openM('upload'));
}

function findFld(fldId){if(!S.aC)return null;for(const tab of Object.keys(S.aC.flds)){const f=S.aC.flds[tab].find(x=>x.id===fldId);if(f)return f;}return null;}

// LIGHTBOX WITH COMMENTS
function openLB(fid,fldId){
  const c=S.aC;if(!c)return;let fld=null,file=null;
  for(const tab of Object.keys(c.flds)){const f=c.flds[tab].find(x=>x.id===fldId);if(f){fld=f;file=f.files.find(x=>x.id===fid);break;}}
  if(!file)return;
  S.activeLbFile=file;S.activeLbFld=fld;
  G('lb-name').textContent=file.name;G('lb-meta').textContent=\`\${file.size||''} · \${fld?.name||''}\`;
  G('lb-dl').href=file.url||'#';G('lb-dl').download=file.name;
  const li=G('lb-img'),lv=G('lb-vid');
  if(file.type==='image'&&file.url){li.src=file.url;li.style.display='block';lv.style.display='none';}
  else if(file.type==='video'&&file.url){lv.src=file.url;lv.style.display='block';li.style.display='none';}
  else{li.style.display='none';lv.style.display='none';}
  // Comments
  rLbComments(file);
  G('lb').classList.add('open');
}
function rLbComments(file){
  const list=file.comments||[];
  G('lb-comments-list').innerHTML=list.length?list.map(c=>\`<div class="lb-comment-item">\${c}</div>\`).join(''):'<div style="font-size:10px;color:#666;text-align:center">Noch keine Kommentare</div>';
}
function closeLB(){G('lb').classList.remove('open');const v=G('lb-vid');v.pause();v.removeAttribute('src');}

// UPLOAD STATUS
let _upFid=null,_upFldId=null;
document.addEventListener('click',e=>{
  const btn=e.target.closest('[data-up]');
  if(btn){
    e.stopPropagation();
    _upFid=+btn.dataset.up;_upFldId=+btn.dataset.ufl;
    const fld=findFld(_upFldId);const file=fld?.files.find(x=>x.id===_upFid);if(!file)return;
    G('up-date').value=file.uploadedAt?new Date(file.uploadedAt).toISOString().slice(0,10):new Date().toISOString().slice(0,10);
    const m=G('up-menu');m.classList.add('open');
    const r=btn.getBoundingClientRect();m.style.top=(r.bottom+4)+'px';m.style.left=Math.max(4,r.left-50)+'px';
    return;
  }
  if(!e.target.closest('#up-menu'))G('up-menu').classList.remove('open');
});
G('up-ok').addEventListener('click',()=>{
  const dateVal=G('up-date').value;if(!dateVal)return;
  const fld=findFld(_upFldId);const file=fld?.files.find(x=>x.id===_upFid);
  if(file){file.uploadedAt=dateVal;rFiles(fld);showT('Upload-Datum gesetzt ✓');}
  G('up-menu').classList.remove('open');
});
G('up-cancel').addEventListener('click',()=>G('up-menu').classList.remove('open'));

// COMMENT SEND
G('lb-comment-send').addEventListener('click',()=>{
  const txt=G('lb-comment-inp').value.trim();if(!txt)return;
  if(!S.activeLbFile)return;
  if(!S.activeLbFile.comments)S.activeLbFile.comments=[];
  const now=new Date().toLocaleDateString('de-DE');
  S.activeLbFile.comments.push(\`\${txt} – Admin, \${now}\`);
  G('lb-comment-inp').value='';
  rLbComments(S.activeLbFile);
  if(S.activeLbFld)rFiles(S.activeLbFld);
  showT('Kommentar gespeichert ✓');
});
G('lb-comment-inp').addEventListener('keydown',e=>{if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();G('lb-comment-send').click();}});

function delFile(fid,fldId){askConfirm('Datei löschen?',()=>{for(const tab of Object.keys(S.aC.flds)){const f=S.aC.flds[tab].find(x=>x.id===fldId);if(f){f.files=f.files.filter(x=>x.id!==fid);rFiles(f);rCHdr();showT('Datei gelöscht ✓');return;}}});}
function delFld(fid,tab,name){askConfirm(\`Ordner "\${name}" löschen?\`,()=>{S.aC.flds[tab]=S.aC.flds[tab].filter(f=>f.id!==fid);rCT(tab);rCHdr();showT('Ordner gelöscht ✓');});}
function delC(id,name){askConfirm(\`Creator "\${name}" löschen?\`,()=>{S.creators=S.creators.filter(c=>c.id!==id);if(S.aC?.id===id)showCL();rCreators();uBdg();rDash();showT(\`"\${name}" gelöscht ✓\`);});}
function backC(){S.aC=null;showCL();G('tb-t').textContent='Creator';rCreators();}

// ── SEARCH ────────────────────────────────────────────────────────────────
function openSearch(){G('search-overlay').classList.add('open');setTimeout(()=>G('search-real').focus(),50);}
function closeSearch(){G('search-overlay').classList.remove('open');G('search-real').value='';}
G('search-real').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  if(!q){G('search-results').innerHTML='';return;}
  const results=[];
  S.creators.forEach(c=>{
    if(c.name.toLowerCase().includes(q))results.push({type:'creator',icon:'★',label:c.name,sub:'Creator',action:()=>{closeSearch();go('creators');setTimeout(()=>openC(c.id),50);}});
    Object.values(c.flds).flat().forEach(fld=>{
      fld.files.forEach(f=>{
        if(f.name.toLowerCase().includes(q))results.push({type:'file',icon:'📄',label:f.name,sub:\`\${c.name} · \${fld.name}\`,action:()=>{closeSearch();go('creators');setTimeout(()=>{openC(c.id);setTimeout(()=>openFld(fld.id,Object.keys(c.flds).find(t=>c.flds[t].includes(fld))||'bilder'),100);},50);}});
      });
    });
  });
  S.produkte.forEach(p=>{if(p.name.toLowerCase().includes(q))results.push({type:'produkt',icon:'◈',label:p.name,sub:'Produkt',action:()=>{closeSearch();go('produkte');}});});
  G('search-results').innerHTML=results.slice(0,8).map((r,i)=>\`<div class="search-result" data-si="\${i}"><span style="font-size:14px;width:22px;text-align:center;flex-shrink:0">\${r.icon}</span><div><div style="font-size:13px;font-weight:500">\${r.label}</div><div style="font-size:10px;color:var(--muted)">\${r.sub}</div></div></div>\`).join('')||'<div style="color:var(--muted);font-size:12px;padding:8px">Keine Ergebnisse</div>';
  G('search-results').querySelectorAll('[data-si]').forEach((el,i)=>el.addEventListener('click',()=>results[i].action()));
});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeSearch();});
G('search-overlay').addEventListener('click',e=>{if(e.target===G('search-overlay'))closeSearch();});

// ── PRODUKTE ──────────────────────────────────────────────────────────────
function rProdukte(){
  let h=S.produkte.map(p=>\`<div class="pcard">
    <button class="dot-btn" data-pd="\${p.id}" style="position:absolute;top:7px;right:7px;z-index:5">···</button>
    <div class="p-img">\${p.url?\`<img src="\${p.url}">\`:\`<span>\${p.icon||'📦'}</span>\`}</div>
    <div style="padding:9px 11px"><div style="font-size:12px;font-weight:600;margin-bottom:1px">\${p.name}</div><div style="font-size:10px;color:var(--muted);margin-bottom:4px">\${p.cat||'–'}</div>
    <div style="display:flex;gap:2px;flex-wrap:wrap">\${(p.tags||[]).map(t=>\`<span class="tag">\${t}</span>\`).join('')}</div>
    <div style="font-size:10px;color:var(--muted);margin-top:5px">📋 \${p.briefings?.length||0} Briefings · 📝 \${p.skripte?.length||0} Skripte</div>
    </div></div>\`).join('');
  h+=\`<div class="add-fcard" style="min-height:165px" id="add-p-fc"><div style="font-size:20px">+</div><span style="font-size:10px;font-weight:500">Produkt</span></div>\`;
  G('p-grid').innerHTML=h;
  G('add-p-fc')?.addEventListener('click',()=>openM('addP'));
  G('p-grid').querySelectorAll('[data-pd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const pid=+btn.dataset.pd;const p=S.produkte.find(x=>x.id===pid);if(p)showDot(btn,()=>openM('editP',pid),()=>delP(pid,p.name));}));
}
function delP(id,name){askConfirm(\`Produkt "\${name}" löschen?\`,()=>{S.produkte=S.produkte.filter(p=>p.id!==id);rProdukte();uBdg();showT(\`"\${name}" gelöscht ✓\`);});}

// ── PROJEKTE ──────────────────────────────────────────────────────────────
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
  const chips=(p.cids||[]).map(cid=>{const c=S.creators.find(x=>x.id===cid);if(!c)return'';const av=c.photo?\`<img src="\${c.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">\`:c.ini;return\`<div class="c-chip" data-oc="\${c.id}"><div class="chip-av" style="background:\${c.color}">\${av}</div>\${c.name}</div>\`;}).join('');
  G('pj-hdr').innerHTML=\`
    <div style="display:flex;align-items:flex-start;gap:11px;margin-bottom:10px">
      <div style="width:48px;height:48px;border-radius:8px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0">📁</div>
      <div style="flex:1">
        <div style="font-size:15px;font-weight:700;margin-bottom:2px">\${p.name}</div>
        <div style="font-size:11px;color:var(--muted);line-height:1.6">\${pr.length?\`📦 \${pr.map(x=>x.name).join(', ')}<br>\`:''}\${p.aktion?\`🏷️ \${p.aktion}<br>\`:''}📅 \${sd}</div>
      </div>
      <div style="display:flex;gap:6px;align-items:center">
        <button class="btn btn-sm btn-grn" id="pj-export">⬇ ZIP Export</button>
        <button class="dot-btn" id="pjhdr-dot">···</button>
      </div>
    </div>
    <div style="border-top:1px solid var(--bdr);padding-top:8px;display:flex;gap:2px;flex-wrap:wrap;align-items:center">
      \${chips}
      <div style="display:inline-flex;align-items:center;gap:3px;padding:2px 8px;border-radius:20px;border:1.5px dashed var(--bdr);cursor:pointer;color:var(--muted);font-size:10px;margin:2px" id="add-c-to-pj">+ Creator</div>
    </div>\`;
  G('pjhdr-dot')?.addEventListener('click',e=>{e.stopPropagation();showDot(e.currentTarget,()=>openM('editPJ',p.id),()=>delPJ(p.id,p.name));});
  G('add-c-to-pj')?.addEventListener('click',()=>openM('addCToP'));
  G('pj-hdr').querySelectorAll('[data-oc]').forEach(el=>el.addEventListener('click',()=>openC(+el.dataset.oc)));
  G('pj-export')?.addEventListener('click',()=>showT('ZIP-Export: In der Live-Version werden alle Dateien als ZIP heruntergeladen ✓',3500));
}
function rPJT(tab){
  const p=S.aPJ;if(!p)return;let all=[];
  (p.cids||[]).forEach(cid=>{const c=S.creators.find(x=>x.id===cid);if(!c)return;(c.flds[tab]||[]).forEach(fld=>{if((fld.tags||[]).includes(p.name))fld.files.forEach(f=>all.push({...f,cname:c.name,ccolor:c.color}));});});
  if(!all.length){G('pj-tc').innerHTML=\`<div class="empty"><div style="font-size:22px">\${tab==='bilder'?'🖼️':'🎬'}</div><div style="margin-top:4px">Ordner-Tag <strong>"\${p.name}"</strong> zuweisen um Inhalte hier zu sehen</div></div>\`;return;}
  G('pj-tc').innerHTML=\`<div class="file-grid">\${all.map(f=>\`<div class="ficard"><div class="fi-thumb">\${f.url?(f.type==='image'?\`<img src="\${f.url}">\`:\`<video src="\${f.url}"></video>\`):\`<span>\${f.type==='image'?'🖼️':'🎬'}</span>\`}</div><div class="fi-info"><div class="fi-name">\${f.name}</div><div class="fi-meta" style="display:flex;align-items:center;gap:3px"><div style="width:7px;height:7px;border-radius:50%;background:\${f.ccolor}"></div>\${f.cname}</div></div></div>\`).join('')}</div>\`;}
function backPJ(){S.aPJ=null;showPJL();G('tb-t').textContent='Projekte';G('tb-action').innerHTML='';rProjekte();}
function delPJ(id,name){askConfirm(\`Projekt "\${name}" löschen?\`,()=>{S.projekte=S.projekte.filter(p=>p.id!==id);if(S.aPJ?.id===id)backPJ();else rProjekte();uBdg();showT(\`"\${name}" gelöscht ✓\`);});}

// ── KATEGORIEN ────────────────────────────────────────────────────────────
function showKL(){G('k-lv').style.display='block';G('k-dv').style.display='none';}
function rKat(){
  let h=S.kat.map(k=>{const af=S.creators.flatMap(c=>c.flds[k.type]||[]);return\`<div class="fcard" data-kid="\${k.id}">
    <button class="dot-btn" data-kd="\${k.id}" style="position:absolute;top:7px;right:7px">···</button>
    <div style="font-size:22px;margin-bottom:6px">\${k.icon}</div>
    <div style="font-size:11px;font-weight:600;margin-bottom:2px">\${k.name}</div>
    <div style="font-size:10px;color:var(--muted)">\${af.length} Ordner · \${af.reduce((s,f)=>s+f.files.length,0)} Dateien</div>
  </div>\`;}).join('');
  h+=\`<div class="add-fcard" id="add-k-fc"><div style="font-size:18px">+</div><span style="font-size:10px;font-weight:500">Kategorie</span></div>\`;
  G('k-grid').innerHTML=h;
  G('add-k-fc')?.addEventListener('click',()=>openM('addK'));
  G('k-grid').querySelectorAll('[data-kid]').forEach(card=>card.addEventListener('click',e=>{if(!e.target.closest('button'))openK(+card.dataset.kid);}));
  G('k-grid').querySelectorAll('[data-kd]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const k=S.kat.find(x=>x.id===+btn.dataset.kd);if(k)showDot(btn,()=>openM('editK',k.id),()=>delK(k.id,k.name));}));
}
function openK(id){
  const k=S.kat.find(x=>x.id===id);if(!k)return;S.aK=k;
  G('k-lv').style.display='none';G('k-dv').style.display='block';G('tb-t').textContent=k.name;
  G('k-dhdr').innerHTML=\`<div><div class="ph-t">\${k.icon} \${k.name}</div><div style="font-size:10px;color:var(--muted);margin-top:2px">Neueste zuerst</div></div>\`;
  const af=S.creators.flatMap(c=>(c.flds[k.type]||[]).map(f=>({...f,cname:c.name})));
  const allTags=[...new Set(af.flatMap(f=>f.tags))];
  G('k-chips').innerHTML=\`<span class="fp-chip sel" data-kt="">Alle</span>\`+allTags.map(t=>\`<span class="fp-chip" data-kt="\${t}">\${t}</span>\`).join('');
  G('k-chips').querySelectorAll('[data-kt]').forEach(chip=>{chip.addEventListener('click',()=>{G('k-chips').querySelectorAll('.fp-chip').forEach(c=>c.classList.remove('sel'));chip.classList.add('sel');rKF(af,chip.dataset.kt,G('k-si').value);});});
  rKF(af,'','');
}
function rKF(af,tag,search){
  let r=[...af].sort((a,b)=>new Date(b.date)-new Date(a.date));
  if(tag)r=r.filter(f=>f.tags.includes(tag));
  if(search)r=r.filter(f=>f.name.toLowerCase().includes(search.toLowerCase())||f.cname.toLowerCase().includes(search.toLowerCase()));
  G('k-fg').innerHTML=r.map(f=>{const d=new Date(f.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});const tg=f.tags.map(t=>\`<span class="tag" style="background:#f0fdf4;color:#166634;border-color:#bbf7d0;font-size:9px">\${t}</span>\`).join('');return\`<div class="fcard"><div style="font-size:18px;margin-bottom:5px">\${S.aK?.icon||'📁'}</div><div style="font-size:11px;font-weight:600;margin-bottom:2px">\${f.name}</div><div style="font-size:10px;color:var(--muted);line-height:1.5">📅 \${d}<br>👤 \${f.cname}<br>📁 \${f.files.length} Dateien</div>\${tg?\`<div style="display:flex;gap:2px;flex-wrap:wrap;margin-top:3px">\${tg}</div>\`:''}</div>\`;}).join('')||\`<div class="empty" style="grid-column:1/-1">Keine Ergebnisse</div>\`;}
function backK(){S.aK=null;showKL();G('tb-t').textContent='Kategorien';G('tb-action').innerHTML='';rKat();}
function delK(id,name){askConfirm(\`"\${name}" löschen?\`,()=>{S.kat=S.kat.filter(k=>k.id!==id);rKat();showT(\`"\${name}" gelöscht ✓\`);});}

// ── TEAM ──────────────────────────────────────────────────────────────────
function rTeam(){
  G('t-tot').textContent=S.team.length;G('t-adm').textContent=S.team.filter(m=>m.role==='admin').length;G('t-pen').textContent=S.team.filter(m=>m.status==='pending').length;
  G('t-rows').innerHTML=S.team.map(m=>{
    const av=m.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const re=m.you?\`<span style="font-size:10px;color:var(--muted)">Du</span>\`:\`<select style="background:var(--lt);border:1px solid var(--bdr);border-radius:5px;padding:2px 6px;font-size:11px;outline:none;font-family:inherit" data-ri="\${m.id}"><option value="admin" \${m.role==='admin'?'selected':''}>Admin</option><option value="read" \${m.role==='read'?'selected':''}>Lesen</option></select>\`;
    const se=m.status==='active'?\`<span style="color:var(--grn);font-size:10px">● Aktiv</span>\`:\`<span style="color:var(--org);font-size:10px">◌ Ausstehend</span>\`;
    return\`<div class="tr" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px">
      <div style="display:flex;align-items:center;gap:6px"><div style="width:22px;height:22px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:#fff">\${av}</div><span style="font-size:12px;font-weight:500">\${m.name}\${m.you?' (Du)':''}</span></div>
      <div style="font-size:10px;color:var(--muted)">\${m.email}</div>
      <div>\${re}</div><div>\${se}</div>
      <div style="display:flex;justify-content:flex-end">\${!m.you?\`<button class="dot-btn" data-td="\${m.id}">···</button>\`:''}</div>
    </div>\`;
  }).join('');
  G('t-rows').querySelectorAll('[data-ri]').forEach(sel=>sel.addEventListener('change',()=>{const id=+sel.dataset.ri;S.team=S.team.map(m=>m.id===id?{...m,role:sel.value}:m);showT('Rolle geändert');}));
  G('t-rows').querySelectorAll('[data-td]').forEach(btn=>btn.addEventListener('click',e=>{e.stopPropagation();const mid=+btn.dataset.td;showDot(btn,null,()=>{S.team=S.team.filter(x=>x.id!==mid);rTeam();showT('Entfernt');});}));
}

// ── CREATOR EINLADEN ──────────────────────────────────────────────────────
function rCInvite(){
  const notInvited=S.creators.filter(c=>!c.invited);
  G('ci-sel').innerHTML='<option value="">– Creator wählen –</option>'+notInvited.map(c=>'<option value="'+c.id+'">'+c.name+(c.email?' ('+c.email+')':'')+'</option>').join('');
  G('ci-sel').onchange=function(){
    const cid=+this.value;const c=S.creators.find(x=>x.id===cid);
    if(c){const wrap=G('ci-email-wrap'),prev=G('ci-preview');
      if(c.email){wrap.style.display='none';G('ci-email').value=c.email;}
      else{wrap.style.display='block';G('ci-email').value='';}
      prev.style.display='block';
      prev.innerHTML='<strong>'+c.name+'</strong>'+(c.email?'<br>📧 '+c.email:'')+'<br>🏷️ '+(c.tags.join(', ')||'Keine Tags');
    }else{G('ci-email-wrap').style.display='none';G('ci-preview').style.display='none';}
  };
  // Fill produkte dropdown
  G('ci-prod').innerHTML=\`<option value="">– Kein Produkt –</option>\`+S.produkte.map(p=>\`<option value="\${p.id}">\${p.name}</option>\`).join('');
  // Invited list with date, status, last login, actions
  const invited=S.creators.filter(c=>c.invited);
  if(!invited.length){
    G('ci-list').innerHTML='<div style="color:var(--muted);font-size:12px;text-align:center;padding:20px">Noch keine Creator eingeladen</div>';
  }else{
    const rows=invited.map((c,i)=>{
      const invDate=c.invitedAt?new Date(c.invitedAt).toLocaleDateString('de-DE'):'-';
      const lastLogin=c.lastLogin?new Date(c.lastLogin).toLocaleDateString('de-DE'):'-';
      const accepted=!!c.lastLogin;
      const bb=i<invited.length-1?'border-bottom:1px solid var(--bdr);':'';
      const st=accepted?'background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0':'background:#fffbeb;color:#d97706;border:1px solid #fde68a';
      return '<div style="display:grid;grid-template-columns:2fr 1fr 1.2fr 1fr auto;align-items:center;padding:8px 10px;'+bb+'gap:6px">'
        +'<div style="display:flex;align-items:center;gap:7px"><div style="width:24px;height:24px;border-radius:50%;background:'+c.color+';display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff">'+c.ini+'</div>'
        +'<div><div style="font-size:12px;font-weight:500">'+c.name+'</div><div style="font-size:10px;color:var(--muted)">'+( c.email||'-')+'</div></div></div>'
        +'<div style="font-size:11px">'+invDate+'</div>'
        +'<span style="font-size:10px;border-radius:5px;padding:1px 7px;'+st+'">'+( accepted?'✓ Angenommen':'⏳ Ausstehend')+'</span>'
        +'<div style="font-size:11px;color:'+(accepted?'var(--text)':'var(--muted)')+'">'+lastLogin+'</div>'
        +'<div style="display:flex;gap:4px">'
        +'<button data-resend="'+c.id+'" title="Neuen Link senden" style="background:var(--lt);border:1px solid var(--bdr);border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer">🔄</button>'
        +'<button data-revoke="'+c.id+'" title="Zugang entziehen" style="background:#fef2f2;border:1px solid #fecaca;border-radius:5px;padding:3px 7px;font-size:10px;cursor:pointer;color:#dc2626">🚫</button>'
        +'</div>'
        +'</div>';
    }).join('');
    G('ci-list').innerHTML='<div style="border:1px solid var(--bdr);border-radius:8px;overflow:hidden">'
      +'<div style="display:grid;grid-template-columns:2fr 1fr 1.2fr 1fr auto;padding:6px 10px;background:var(--lt);border-bottom:1px solid var(--bdr);font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;letter-spacing:.7px">'
      +'<div>Creator</div><div>Eingeladen</div><div>Status</div><div>Letzter Login</div><div>Aktionen</div></div>'
      +rows+'</div>';
    // Resend button
    G('ci-list').querySelectorAll('[data-resend]').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const cid=+btn.dataset.resend;const c=S.creators.find(x=>x.id===cid);if(!c||!c.email)return showT('Keine E-Mail hinterlegt');
        showT('⏳ Neuer Link wird gesendet...');
        try{
          const token=localStorage.getItem('token')||'';
          const res=await fetch('/api/creators/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({creatorId:c.id,email:c.email,name:c.name})});
          const data=await res.json();
          if(res.ok){c.invitedAt=new Date().toISOString();rCInvite();showT('✓ Neuer Link gesendet an '+c.email);}
          else showT('Fehler: '+(data.error||'Unbekannt'));
        }catch(e){showT('Fehler beim Senden');}
      });
    });
    // Revoke button
    G('ci-list').querySelectorAll('[data-revoke]').forEach(btn=>{
      btn.addEventListener('click',async()=>{
        const cid=+btn.dataset.revoke;const c=S.creators.find(x=>x.id===cid);if(!c)return;
        if(!confirm('Zugang für '+c.name+' wirklich entziehen? Der Link funktioniert dann nicht mehr.'))return;
        try{
          const token=localStorage.getItem('token')||'';
          await fetch('/api/creators/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({creatorId:c.id,action:'revoke'})});
        }catch(e){}
        c.invited=false;c.invitedAt=null;c.lastLogin=null;rCInvite();showT('✓ Zugang für '+c.name+' entzogen');
      });
    });
  }
}

// ── PORTAL ────────────────────────────────────────────────────────────────
let _portalCreator=null;
function openPortal(cid){
  const c=S.creators.find(x=>x.id===cid)||S.creators[0];
  _portalCreator=c;
  G('creator-portal').querySelector('.portal-topbar div:nth-child(3) div').innerHTML=\`Angemeldet als: <strong>\${c.name}</strong>\`;
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
    const tu=Object.values(c.flds).flat().reduce((s,f)=>s+f.files.filter(x=>x.uploadedAt).length,0);
    main.innerHTML=\`
      <div class="ph"><div>
        <div style="font-size:13px;color:var(--muted);margin-bottom:2px">Willkommen zurück 👋</div>
        <div class="ph-t">Hallo \${c.name.split(' ')[0]}, schön dass du da bist!</div>
      </div></div>
      <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
        <div class="sc"><div class="sl">Meine Ordner</div><div class="sv">\${Object.values(c.flds).flat().length}</div></div>
        <div class="sc"><div class="sl">Dateien gesamt</div><div class="sv">\${tf}</div></div>
        <div class="sc"><div class="sl">Hochgeladen</div><div class="sv" style="color:var(--grn)">\${tu}</div></div>
      </div>
      \${c.notizenCreator?\`<div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:9px;padding:12px 14px;margin-bottom:13px;font-size:12px;color:#1e40af"><strong>💬 Hinweis vom Team:</strong><br>\${c.notizenCreator}</div>\`:''}
      <div class="tabs" id="portal-tabs" style="margin-bottom:11px">
        <div class="tab on" data-pt="bilder">🖼️ Bilder</div>
        <div class="tab" data-pt="videos">🎬 Videos</div>
        <div class="tab" data-pt="roh">📹 Rohmaterial</div>
        <div class="tab" data-pt="auswertung">📊 Auswertungen</div>
      </div>
      <div class="fg-grid" id="portal-fld-grid"></div>\`;
    // Tab + folder logic
    const ico={bilder:'🖼️',videos:'🎬',roh:'📹',auswertung:'📊'};
    let _portalTab='bilder';
    function renderPortalFolders(tab){
      _portalTab=tab;
      const grid=G('portal-fld-grid');if(!grid)return;
      const flds=(c.flds[tab]||[]).map(f=>({...f,tab}));
      grid.innerHTML=flds.map((f,i)=>\`<div class="fcard" data-pfi="\${i}"><div style="font-size:18px;margin-bottom:5px">\${ico[tab]}</div><div style="font-size:11px;font-weight:600">\${f.name}</div><div style="font-size:10px;color:var(--muted);line-height:1.5">📅 \${new Date(f.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'})}<br>📁 \${f.files.length} Dateien</div></div>\`).join('')+
        \`<div class="add-fcard" id="portal-new-fld-home" style="min-height:90px"><div style="font-size:16px">📁</div><span style="font-size:10px;font-weight:500">Neuer Ordner</span></div>\`;
      grid.querySelectorAll('[data-pfi]').forEach((card,i)=>{card.addEventListener('click',()=>portalOpenFld(flds[i]));});
      G('portal-new-fld-home')?.addEventListener('click',()=>portalNewFolder());
    }
    // Attach tab listeners
    setTimeout(()=>{
      G('portal-tabs')?.querySelectorAll('[data-pt]').forEach(tab=>{
        tab.addEventListener('click',()=>{
          G('portal-tabs').querySelectorAll('.tab').forEach(t=>t.classList.remove('on'));
          tab.classList.add('on');
          renderPortalFolders(tab.dataset.pt);
        });
      });
      renderPortalFolders('bilder');
    },0);
  }
  else if(page==='upload'){
    main.innerHTML=\`
      <div class="ph"><div class="ph-t">Inhalte hochladen</div></div>
      <div style="background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:18px;margin-bottom:14px">
        <div style="font-size:13px;font-weight:600;margin-bottom:4px">📤 Neue Datei hochladen</div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:14px">Lade deine Bilder und Videos direkt hier hoch. Das Team sieht sie sofort.</div>
        <div class="fg"><label class="fl">Ordner wählen</label>
          <select class="fi" id="portal-fld-sel">
            <option value="new">+ Neuen Ordner erstellen...</option>
            \${Object.entries(c.flds).flatMap(([tab,flds])=>flds.map(f=>\`<option value="\${f.id}:\${tab}">\${f.name} (\${{bilder:'Bilder',videos:'Videos',roh:'Rohmaterial',auswertung:'Auswertungen'}[tab]||tab})</option>\`)).join('')}
          </select>
        </div>
        <div id="portal-new-fld-wrap" style="display:none;background:var(--lt);border-radius:8px;padding:10px;border:1px solid var(--bdr);margin-bottom:8px">
          <div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--muted)">Neuer Ordner</div>
          <div class="fg"><label class="fl">Ordner-Name *</label><input class="fi" id="portal-new-fld-name" placeholder="z.B. Sommer Lookbook 2025"></div>
          <div class="fg"><label class="fl">Kategorie</label>
            <select class="fi" id="portal-new-fld-tab">
              <option value="bilder">🖼️ Bilder</option>
              <option value="videos">🎬 Videos</option>
              <option value="roh">📹 Rohmaterial</option>
              <option value="auswertung">📊 Auswertungen</option>
            </select>
          </div>
        </div>
        <div class="fg"><label class="fl">Bezeichnung der Datei</label><input class="fi" id="portal-fname" placeholder="z.B. Lookbook Shot 01"></div>
        <div class="dz" id="portal-dz"><div style="font-size:22px;margin-bottom:4px">📂</div><div style="font-size:12px;font-weight:500">Klicken oder Datei hierher ziehen</div></div>
        <input type="file" id="portal-file" accept="image/*,video/*" style="display:none">
        <div id="portal-prog" style="display:none;margin-top:8px"><div id="portal-ps" style="font-size:10px;margin-bottom:3px">Upload...</div><div class="prog-track"><div class="prog-fill" id="portal-pb"></div></div></div>
        <button class="btn btn-p" style="width:100%;margin-top:12px" id="portal-upload-btn">Hochladen →</button>
      </div>\`;
    G('portal-dz').addEventListener('click',()=>G('portal-file').click());
    G('portal-file').addEventListener('change',()=>{const f=G('portal-file').files[0];if(f){const sz=(f.size/1024/1024).toFixed(1);G('portal-dz').innerHTML=\`<div style="display:flex;align-items:center;gap:8px"><div style="font-size:22px">\${f.type.startsWith('image/')?'🖼️':'🎬'}</div><div><div style="font-size:12px;font-weight:500">\${f.name}</div><div style="font-size:10px;color:var(--muted)">\${sz} MB</div></div><span style="margin-left:auto;color:var(--grn)">✓</span></div>\`;}});
    G('portal-fld-sel').addEventListener('change',e=>{
      const newFldWrap=G('portal-new-fld-wrap');
      if(newFldWrap)newFldWrap.style.display=e.target.value==='new'?'block':'none';
    });
    G('portal-upload-btn').addEventListener('click',()=>{
      const sel=G('portal-fld-sel').value;const name=G('portal-fname').value.trim();const file=G('portal-file').files[0];
      if(!name){showT('Bitte Bezeichnung ausfüllen');return;}
      let fld=null,tab='bilder';
      if(sel==='new'){
        // Create new folder
        const fldName=G('portal-new-fld-name')?.value.trim();
        const fldTab=G('portal-new-fld-tab')?.value||'bilder';
        if(!fldName){showT('Bitte Ordner-Namen eingeben');return;}
        tab=fldTab;
        const newFld={id:uid(),name:fldName,batch:fldName,date:new Date().toISOString().slice(0,10),deadline:'',prods:[],tags:[],files:[]};
        c.flds[tab].push(newFld);fld=newFld;showT(\`Ordner "\${fldName}" erstellt ✓\`);
      } else {
        if(!sel){showT('Bitte Ordner wählen');return;}
        const [fldId,t]=sel.split(':');tab=t;fld=c.flds[tab]?.find(f=>f.id===+fldId);if(!fld){showT('Ordner nicht gefunden');return;}
      }
      const nf={id:uid(),name,type:file?(file.type.startsWith('image/')?'image':'video'):'file',url:null,size:file?(file.size/1024/1024).toFixed(1)+' MB':'',uploadedAt:null,comments:[]};
      if(file){
        G('portal-prog').style.display='block';G('portal-upload-btn').disabled=true;
        const r=new FileReader();r.onload=e=>{nf.url=e.target.result;};r.readAsDataURL(file);
        let p=0;const iv=setInterval(()=>{p+=10;G('portal-pb').style.width=Math.min(p,100)+'%';G('portal-ps').textContent=\`Upload: \${Math.min(p,100)}%\`;
          if(p>=100){clearInterval(iv);G('portal-pb').style.background='var(--grn)';G('portal-ps').textContent='✓ Hochgeladen!';
            setTimeout(()=>{fld.files.push(nf);showT(\`"\${name}" hochgeladen ✓\`);renderPortalPage('upload');},500);}},60);
      } else {fld.files.push(nf);showT(\`"\${name}" hinzugefügt ✓\`);}
    });
  }
  else if(page==='tips'||page==='briefings'||page==='skripte'||page==='videos'){
    const tipMap={briefings:'📋 Briefings',skripte:'📝 Skripte',videos:'🎬 Lernvideos'};
    if(page==='tips'){
      const hub=S.contentHub||{cats:['Briefings','Skripte','Lernvideos'],items:[]};
      const allCats=hub.cats;
      const catIcons={'Briefings':'📋','Skripte':'📝','Lernvideos':'🎬'};
      main.innerHTML=\`
        <div class="ph"><div class="ph-t">💡 Tipps & Tricks</div></div>
        <div style="font-size:12px;color:var(--muted);margin-bottom:20px">Alle Inhalte die dein Team für dich bereitgestellt hat.</div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">
          \${allCats.map(cat=>{
            const count=hub.items.filter(x=>x.cat===cat).length;
            const icon=catIcons[cat]||'📁';
            return \`<div class="tip-card" data-ppage="tip-cat-\${cat}" style="padding:20px">\`+
              \`<div style="font-size:28px;margin-bottom:10px">\${icon}</div>\`+
              \`<div style="font-size:15px;font-weight:600;margin-bottom:4px">\${cat}</div>\`+
              \`<div style="font-size:11px;color:var(--muted)">\${count} Inhalt\${count!==1?'e':''}</div>\`+
              \`</div>\`;
          }).join('')}
        </div>\`;
      main.querySelectorAll('[data-ppage]').forEach(card=>{
        card.addEventListener('click',()=>renderPortalPage(card.dataset.ppage));
      });
    }
    }
  }

// ── SETTINGS / TAGS ────────────────────────────────────────────────────────
function rTags(){G('tags-list').innerHTML=S.tags.map(t=>\`<span class="tag" style="display:inline-flex;align-items:center;gap:3px">\${t}<span data-dt="\${t}" style="cursor:pointer;font-size:9px;color:var(--blue);opacity:.7">✕</span></span>\`).join('');G('tags-list').querySelectorAll('[data-dt]').forEach(x=>x.addEventListener('click',()=>{S.tags=S.tags.filter(t=>t!==x.dataset.dt);rTags();}));}

// ── FILTER ────────────────────────────────────────────────────────────────
function rFP(){
  G('fp-prods').innerHTML=S.produkte.map(p=>\`<span class="fp-chip \${S.flt.prods.includes(p.id)?'sel':''}" data-fpp="\${p.id}">\${p.name}</span>\`).join('');
  G('fp-tags').innerHTML=S.tags.map(t=>\`<span class="fp-chip \${S.flt.tags.includes(t)?'sel':''}" data-fpt="\${t}">\${t}</span>\`).join('');
  G('fp-prods').querySelectorAll('[data-fpp]').forEach(c=>c.addEventListener('click',()=>{const id=+c.dataset.fpp;S.flt.prods=S.flt.prods.includes(id)?S.flt.prods.filter(x=>x!==id):[...S.flt.prods,id];rFP();}));
  G('fp-tags').querySelectorAll('[data-fpt]').forEach(c=>c.addEventListener('click',()=>{const t=c.dataset.fpt;S.flt.tags=S.flt.tags.includes(t)?S.flt.tags.filter(x=>x!==t):[...S.flt.tags,t];rFP();}));
  rFpC('');
}
function rFpC(s){
  const list=s?S.creators.filter(c=>c.name.toLowerCase().includes(s.toLowerCase())):S.creators;
  G('fp-cr').innerHTML=list.map(c=>\`<div style="display:flex;align-items:center;gap:5px;padding:3px 6px;border-radius:5px;cursor:pointer;background:\${S.flt.cid===c.id?'#eff2ff':'transparent'};margin-bottom:2px" data-fpc="\${c.id}"><div style="width:15px;height:15px;border-radius:50%;background:\${c.color};display:flex;align-items:center;justify-content:center;font-size:6px;font-weight:600;color:#fff;flex-shrink:0">\${c.ini}</div><span style="font-size:10px">\${c.name}</span>\${S.flt.cid===c.id?'<span style="margin-left:auto;color:var(--blue);font-size:9px">✓</span>':''}</div>\`).join('');
  G('fp-cr').querySelectorAll('[data-fpc]').forEach(el=>el.addEventListener('click',()=>{const id=+el.dataset.fpc;S.flt.cid=S.flt.cid===id?null:id;rFpC(s);}));
}

// ── MODAL ─────────────────────────────────────────────────────────────────
function openM(type,extra){
  S.modal=type;S.form={extra};
  const body=G('modal-body'),title=G('modal-title'),ok=G('modal-ok');
  ok.disabled=false;ok.textContent='Speichern';ok.onclick=confirmM;

  if(type==='addC'||type==='editC'){
    const isE=type==='editC';const c=isE?S.creators.find(x=>x.id===extra):null;if(isE)S.form.cid=extra;
    title.textContent=isE?'Creator bearbeiten':'Creator hinzufügen';
    const to=S.tags.map(t=>\`<option value="\${t}" \${c?.tags?.includes(t)?'selected':''}>\${t}</option>\`).join('');
    const kAO=['3','4','5','6','7','8','9','10','11','12','13+'].map(a=>\`<option value="\${a}" \${(c?.kidsAges||[]).includes(a)?'selected':''}>\${a} Jahre</option>\`).join('');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-cn" value="\${c?.name||''}" placeholder="Mira Hartley"></div>
      <div class="fg"><label class="fl">Kürzel</label><input class="fi" id="m-ci" value="\${c?.ini||''}" placeholder="MH" maxlength="3"></div>
      <div class="fg"><label class="fl">E-Mail</label><input class="fi" id="m-ce" type="email" value="\${c?.email||''}" placeholder="creator@email.com"></div>
      <div class="fg"><label class="fl">📸 Instagram / Social Media</label><input class="fi" id="m-ig" value="\${c?.instagram||''}" placeholder="https://instagram.com/username"></div>
      <div class="fg"><label class="fl">Profilbild</label><input type="file" accept="image/*" id="m-ph" class="fi" style="padding:5px"></div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="fg"><label class="fl">Alter</label><input class="fi" id="m-ca" type="number" value="\${c?.age||''}" placeholder="25"></div>
        <div class="fg"><label class="fl">Beschreibung</label><input class="fi" id="m-cd" value="\${c?.desc||''}" placeholder="Lifestyle Creator"></div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <div class="fg"><label class="fl">Geschlecht</label><select class="fi" id="m-cg"><option value="female" \${c?.gender==='female'?'selected':''}>♀ Female</option><option value="male" \${c?.gender==='male'?'selected':''}>♂ Male</option></select></div>
        <div class="fg"><label class="fl">Land</label><select class="fi" id="m-cc"><option value="DE" \${c?.country==='DE'?'selected':''}>🇩🇪 DE</option><option value="AT" \${c?.country==='AT'?'selected':''}>🇦🇹 AT</option><option value="CH" \${c?.country==='CH'?'selected':''}>🇨🇭 CH</option><option value="US" \${c?.country==='US'?'selected':''}>🇺🇸 US</option></select></div>
      </div>
      <div class="fg"><label class="fl">Tags (Strg+Klick)</label><select class="fi" id="m-ct" multiple style="height:62px">\${to}</select></div>
      <div style="background:var(--lt);border-radius:8px;padding:11px;border:1px solid var(--bdr);margin-bottom:9px">
        <div style="font-size:10px;font-weight:600;margin-bottom:9px">💶 Vergütungsmodell *</div>
        <div class="fg"><label class="fl">Modell</label>
          <select class="fi" id="m-vmodel">
            <option value="provision" \${c?.verguetung==='provision'?'selected':''}>Provision (%)</option>
            <option value="fix" \${c?.verguetung==='fix'?'selected':''}>Fixbetrag (€)</option>
            <option value="beides" \${c?.verguetung==='beides'?'selected':''}>Beides</option>
          </select>
        </div>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
          <div class="fg" id="m-vprov-w"><label class="fl">Provision %</label><input class="fi" id="m-vprov" type="number" value="\${c?.provision||''}" placeholder="z.B. 15"></div>
          <div class="fg" id="m-vfix-w"><label class="fl">Fixbetrag €</label><input class="fi" id="m-vfix" type="number" value="\${c?.fixbetrag||''}" placeholder="z.B. 800"></div>
        </div>
      </div>
      <div class="fg"><label class="fl">📝 Interne Notizen</label><textarea class="fi" id="m-notiz" rows="3" placeholder="Interne Anmerkungen..." style="resize:vertical">\${c?.notizen||''}</textarea></div>
      <div style="background:var(--lt);border-radius:8px;padding:11px;border:1px solid var(--bdr)">
        <div style="font-size:10px;font-weight:600;margin-bottom:8px">👶 Kinder-Informationen</div>
        <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:8px">
          <span style="font-size:11px">Hat Kinder</span>
          <div class="tgl \${c?.kids?'on':''}" id="m-kids"><div class="tgl-d"></div></div>
        </div>
        <div id="m-kx" style="display:\${c?.kids?'block':'none'}">
          <div class="fg"><label class="fl">Alter der Kinder (Strg+Klick)</label><select class="fi" id="m-ka" multiple style="height:62px">\${kAO}</select></div>
          <div style="display:flex;align-items:center;justify-content:space-between;margin-top:5px">
            <span style="font-size:11px">Zeigt Kinder im Video</span>
            <div class="tgl \${c?.kidsOnVid?'on':''}" id="m-kv"><div class="tgl-d"></div></div>
          </div>
        </div>
      </div>\`;
    const updateVerg=()=>{const v=G('m-vmodel').value;G('m-vprov-w').style.display=v==='provision'||v==='beides'?'block':'none';G('m-vfix-w').style.display=v==='fix'||v==='beides'?'block':'none';};
    updateVerg();G('m-vmodel').addEventListener('change',updateVerg);
    G('m-kids').addEventListener('click',()=>{G('m-kids').classList.toggle('on');G('m-kx').style.display=G('m-kids').classList.contains('on')?'block':'none';});
    G('m-kv').addEventListener('click',()=>G('m-kv').classList.toggle('on'));
  }
  else if(type==='addFld'||type==='editFld'){
    const isE=type==='editFld';const tab=isE?extra.tab:(typeof extra==='string'?extra:S.aCT);S.form.tab=tab;
    const fld=isE?S.aC?.flds[tab]?.find(f=>f.id===extra.id):null;if(isE)S.form.fid=extra.id;
    title.textContent=isE?'Ordner bearbeiten':'Ordner anlegen';
    const po=S.produkte.map(p=>\`<option value="\${p.name}" \${fld?.prods?.includes(p.name)?'selected':''}>\${p.name}</option>\`).join('');
    const to=[...S.tags,...S.projekte.map(p=>p.name)].map(x=>\`<option value="\${x}" \${fld?.tags?.includes(x)?'selected':''}>\${x}</option>\`).join('');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-fn" value="\${fld?.name||''}" placeholder="Winter Lookbook 2024"></div>
      <div class="fg"><label class="fl">Batch-Name</label><input class="fi" id="m-fb" value="\${fld?.batch||''}" placeholder="Januar Batch"></div>
      <div class="fg"><label class="fl">Datum</label><input class="fi" id="m-fd" type="date" value="\${fld?.date||new Date().toISOString().slice(0,10)}"></div>
      <div class="fg"><label class="fl">⏰ Deadline (Content bis)</label><input class="fi" id="m-fdl" type="date" value="\${fld?.deadline||''}"></div>
      <div class="fg"><label class="fl">Produkte (Strg+Klick)</label><select class="fi" id="m-fp" multiple style="height:62px">\${po||'<option disabled>Keine Produkte</option>'}</select></div>
      <div class="fg"><label class="fl">Tags (Strg+Klick)</label><select class="fi" id="m-ft" multiple style="height:62px">\${to}</select></div>\`;
  }
  else if(type==='upload'){
    title.textContent='Datei hochladen';ok.textContent='Hochladen';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Bezeichnung *</label><input class="fi" id="m-un" placeholder="Lookbook Shot 01"></div>
      <div class="dz" id="m-dz"><div id="m-dzi"><div style="font-size:20px;margin-bottom:3px">📂</div><div style="font-size:11px;font-weight:500">Klicken oder Datei hierher ziehen</div><div style="font-size:9px;color:var(--muted);margin-top:2px">Bilder, Videos · Cloudflare R2</div></div></div>
      <input type="file" id="m-uf" accept="*/*" style="display:none">
      <div id="m-prog" style="display:none"><div id="m-ps" style="font-size:10px;margin-bottom:3px">Upload...</div><div class="prog-track"><div class="prog-fill" id="m-pb"></div></div></div>
      <div class="fg" style="margin-top:9px"><label class="fl">Oder Link (Google Drive, Dropbox...)</label><input class="fi" id="m-ul" placeholder="https://drive.google.com/..."></div>\`;
    G('m-dz').addEventListener('click',()=>G('m-uf').click());
    G('m-dz').addEventListener('dragover',e=>{e.preventDefault();G('m-dz').classList.add('done');});
    G('m-dz').addEventListener('drop',e=>{e.preventDefault();const f=e.dataTransfer.files[0];if(f){const dt=new DataTransfer();dt.items.add(f);G('m-uf').files=dt.files;hFP(f);}});
    G('m-uf').addEventListener('change',()=>{if(G('m-uf').files[0])hFP(G('m-uf').files[0]);});
  }
  else if(type==='addP'||type==='editP'){
    const isE=type==='editP';const prod=isE?S.produkte.find(p=>p.id===extra):null;if(isE)S.form.pid=extra;
    title.textContent=isE?'Produkt bearbeiten':'Produkt hinzufügen';
    const to=S.tags.map(t=>\`<option value="\${t}" \${prod?.tags?.includes(t)?'selected':''}>\${t}</option>\`).join('');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Produktname *</label><input class="fi" id="m-pn" value="\${prod?.name||''}" placeholder="Vitamin Serum XY"></div>
      <div class="fg"><label class="fl">Kategorie</label><input class="fi" id="m-pc" value="\${prod?.cat||''}" placeholder="Skincare"></div>
      <div class="fg"><label class="fl">Bild hochladen</label><input type="file" accept="image/*" id="m-pi" class="fi" style="padding:5px"></div>
      <div class="fg"><label class="fl">Emoji (Fallback)</label><input class="fi" id="m-pe" value="\${prod?.icon||''}" placeholder="💄" maxlength="4"></div>
      <div class="fg"><label class="fl">Tags (Strg+Klick)</label><select class="fi" id="m-pt" multiple style="height:62px">\${to}</select></div>\`;
  }
  else if(type==='addPJ'||type==='editPJ'){
    const isE=type==='editPJ';const pj=isE?S.projekte.find(p=>p.id===extra):null;if(isE)S.form.pjid=extra;
    title.textContent=isE?'Projekt bearbeiten':'Projekt anlegen';ok.textContent=isE?'Speichern':'Erstellen';
    const po=S.produkte.map(p=>\`<option value="\${p.id}" \${(pj?.pids||[]).includes(p.id)?'selected':''}>\${p.name}</option>\`).join('');
    body.innerHTML=\`
      <div class="fg"><label class="fl">Projektname *</label><input class="fi" id="m-pjn" value="\${pj?.name||''}" placeholder="Winter Kampagne 2024"></div>
      <div class="fg"><label class="fl">Produkte (Strg+Klick)</label><select class="fi" id="m-pjp" multiple style="height:62px">\${po||'<option disabled>Erst Produkte anlegen</option>'}</select></div>
      <div class="fg"><label class="fl">Bild (optional)</label><input type="file" accept="image/*" id="m-pji" class="fi" style="padding:5px"></div>
      <div class="fg"><label class="fl">Aktion / Rabatt</label><input class="fi" id="m-pja" value="\${pj?.aktion||''}" placeholder="20% Code WINTER24"></div>
      <div class="fg"><label class="fl">Startdatum</label><input class="fi" id="m-pjs" type="date" value="\${pj?.start||''}"></div>
      <div class="fg"><label class="fl">Anzahl Creator</label><input class="fi" id="m-pjc" type="number" value="\${pj?.count||''}" placeholder="5" min="1"></div>\`;
  }
  else if(type==='addK'||type==='editK'){
    const isE=type==='editK';const k=isE?S.kat.find(x=>x.id===extra):null;if(isE)S.form.kid=extra;
    title.textContent=isE?'Kategorie bearbeiten':'Kategorie hinzufügen';
    const to=['bilder','videos','roh','auswertung'].map(x=>\`<option value="\${x}" \${k?.type===x?'selected':''}>\${{bilder:'Bilder',videos:'Videos',roh:'Rohmaterial',auswertung:'Auswertungen'}[x]}</option>\`).join('');
    body.innerHTML=\`<div class="fg"><label class="fl">Name *</label><input class="fi" id="m-kn" value="\${k?.name||''}" placeholder="Stories"></div><div class="fg"><label class="fl">Icon</label><input class="fi" id="m-ki" value="\${k?.icon||''}" placeholder="🎬" maxlength="4"></div><div class="fg"><label class="fl">Typ</label><select class="fi" id="m-kt">\${to}</select></div>\`;
  }
  else if(type==='invite'){
    title.textContent='Team-Mitglied einladen';ok.textContent='Einladung senden';S.selRole='read';
    body.innerHTML=\`
      <div class="fg"><label class="fl">Name *</label><input class="fi" id="m-in" placeholder="Max Mustermann"></div>
      <div class="fg"><label class="fl">E-Mail *</label><input class="fi" id="m-ie" type="email" placeholder="max@company.com"></div>
      <div class="fg"><label class="fl">Zugriffsrecht</label>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-top:4px">
          <div class="role-opt sel" id="ro-r"><div style="font-size:11px;font-weight:600;color:var(--blue)">👁 Lesen</div><div style="font-size:9px;color:var(--muted)">Nur ansehen</div></div>
          <div class="role-opt" id="ro-a"><div style="font-size:11px;font-weight:600">⚡ Admin</div><div style="font-size:9px;color:var(--muted)">Vollzugriff</div></div>
        </div>
      </div>\`;
    G('ro-r').addEventListener('click',()=>{S.selRole='read';G('ro-r').classList.add('sel');G('ro-a').classList.remove('sel');});
    G('ro-a').addEventListener('click',()=>{S.selRole='admin';G('ro-a').classList.add('sel');G('ro-r').classList.remove('sel');});
  }
  else if(type==='addCToP'){
    title.textContent='Creator zuweisen';ok.textContent='Zuweisen';
    const p=S.aPJ;if(!p){showT('Kein Projekt');return;}S.selC=[...(p.cids||[])];
    body.innerHTML=\`<div style="display:flex;flex-direction:column;gap:3px;max-height:260px;overflow-y:auto">\${S.creators.map(c=>{
      const sel=S.selC.includes(c.id);const av=c.photo?\`<img src="\${c.photo}" style="width:100%;height:100%;object-fit:cover;border-radius:50%">\`:c.ini;
      return\`<div class="c-sel-i \${sel?'sel':''}" data-csel="\${c.id}"><div style="width:30px;height:30px;border-radius:50%;background:\${c.color};display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:600;color:#fff;flex-shrink:0;overflow:hidden">\${av}</div><div><div style="font-size:12px;font-weight:500">\${c.name}</div><div style="font-size:10px;color:var(--muted)">\${c.desc}</div></div><div class="chk">\${sel?'✓':''}</div></div>\`;
    }).join('')}</div>\`;
    body.querySelectorAll('[data-csel]').forEach(el=>el.addEventListener('click',()=>{const id=+el.dataset.csel;const i=S.selC.indexOf(id);if(i>=0)S.selC.splice(i,1);else S.selC.push(id);const sel=S.selC.includes(id);el.classList.toggle('sel',sel);el.querySelector('.chk').textContent=sel?'✓':'';}))
  }
  G('modal-bg').classList.add('open');
}

function hFP(f){const sz=(f.size/1024/1024).toFixed(1);if(f.type.startsWith('image/')){const r=new FileReader();r.onload=e=>{G('m-dzi').innerHTML=\`<div style="display:flex;align-items:center;gap:8px;text-align:left"><img src="\${e.target.result}" style="width:42px;height:42px;border-radius:5px;object-fit:cover;flex-shrink:0"><div><div style="font-size:11px;font-weight:500">\${f.name}</div><div style="font-size:9px;color:var(--muted)">\${sz} MB</div></div><span style="margin-left:auto;color:var(--grn)">✓</span></div>\`;};r.readAsDataURL(f);}else{G('m-dzi').innerHTML=\`<div style="display:flex;align-items:center;gap:8px"><div style="width:42px;height:42px;border-radius:5px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">🎬</div><div><div style="font-size:11px;font-weight:500">\${f.name}</div><div style="font-size:9px;color:var(--muted)">\${sz} MB</div></div><span style="margin-left:auto;color:var(--grn)">✓</span></div>\`;}G('m-dz').classList.add('done');}
function closeM(){G('modal-bg').classList.remove('open');}

function confirmM(){
  const type=S.modal;
  if(type==='addC'||type==='editC'){
    const isE=type==='editC';const name=G('m-cn').value.trim();if(!name){showT('Name erforderlich');return;}
    const ini=(G('m-ci').value.trim()||name.slice(0,2)).toUpperCase();const email=G('m-ce').value.trim();
    const instagram=G('m-ig').value.trim();const age=+G('m-ca').value||25;const desc=G('m-cd').value.trim()||'Creator';
    const gender=G('m-cg').value;const country=G('m-cc').value;const tags=[...G('m-ct').selectedOptions].map(o=>o.value);
    const verguetung=G('m-vmodel').value;const provision=G('m-vprov')?.value||'';const fixbetrag=G('m-vfix')?.value||'';
    const notizen=G('m-notiz').value;
    const kids=G('m-kids').classList.contains('on');const kidsAges=[...G('m-ka').selectedOptions].map(o=>o.value);const kidsOnVid=G('m-kv').classList.contains('on');
    const pf=G('m-ph').files[0];const color=CL[S.creators.length%CL.length];
    const apply=(photo)=>{
      if(isE){const c=S.creators.find(x=>x.id===S.form.cid);if(!c)return;Object.assign(c,{name,ini,email,instagram,age,desc,gender,country,tags,verguetung,provision,fixbetrag,notizen,kids,kidsAges,kidsOnVid});if(photo)c.photo=photo;if(S.aC?.id===S.form.cid)rCHdr();showT(\`"\${name}" aktualisiert ✓\`);}
      else{S.creators.push({id:uid(),name,ini,color,age,email,instagram,gender,country,tags,desc,up:new Date(),photo:photo||null,verguetung,provision,fixbetrag,notizen,kids,kidsAges,kidsOnVid,vertrag:null,vertragsname:'',invited:false,flds:{bilder:[],videos:[],roh:[],auswertung:[]}});showT(\`"\${name}" hinzugefügt ✓\`);}
      rCreators();uBdg();rDash();closeM();
    };
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addFld'||type==='editFld'){
    const isE=type==='editFld';const tab=S.form.tab||S.aCT;const name=G('m-fn').value.trim();if(!name){showT('Name erforderlich');return;}
    const batch=G('m-fb').value.trim()||name;const date=G('m-fd').value||new Date().toISOString().slice(0,10);
    const deadline=G('m-fdl').value||'';
    const prods=[...G('m-fp').selectedOptions].map(o=>o.value);const tags=[...G('m-ft').selectedOptions].map(o=>o.value);
    if(isE){const fld=S.aC?.flds[tab]?.find(f=>f.id===S.form.fid);if(fld)Object.assign(fld,{name,batch,date,deadline,prods,tags});showT('Aktualisiert ✓');}
    else{if(!S.aC)return;S.aC.flds[tab].push({id:uid(),name,batch,date,deadline,prods,tags,files:[]});showT(\`"\${name}" angelegt ✓\`);}
    closeM();rCT(tab);rCHdr();return;
  }
  if(type==='upload'){
    const name=G('m-un').value.trim();if(!name){showT('Bezeichnung erforderlich');return;}
    const link=G('m-ul').value.trim();const file=G('m-uf').files[0];if(!file&&!link){showT('Datei oder Link erforderlich');return;}
    const fld=S.aF?.fld;if(!fld){showT('Kein Ordner');return;}
    const nf={id:uid(),name,type:file?(file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':'file'):'file',url:link||null,size:file?(file.size/1024/1024).toFixed(1)+' MB':'Link',uploadedAt:null,comments:[]};
    if(file){G('m-prog').style.display='block';G('modal-ok').disabled=true;const r=new FileReader();r.onload=e=>{nf.url=e.target.result;};r.readAsDataURL(file);let p=0;const iv=setInterval(()=>{p+=8;G('m-pb').style.width=Math.min(p,100)+'%';G('m-ps').textContent=\`R2: \${Math.min(p,100)}%\`;if(p>=100){clearInterval(iv);G('m-pb').style.background='var(--grn)';G('m-ps').textContent='✓ R2';setTimeout(()=>{fld.files.push(nf);rFiles(fld);rCHdr();closeM();showT(\`"\${name}" hochgeladen ✓\`);},400);}},50);return;}
    fld.files.push(nf);rFiles(fld);rCHdr();closeM();showT(\`"\${name}" hinzugefügt ✓\`);return;
  }
  if(type==='addP'||type==='editP'){
    const isE=type==='editP';const name=G('m-pn').value.trim();if(!name){showT('Name erforderlich');return;}
    const cat=G('m-pc').value.trim();const icon=G('m-pe').value.trim()||'📦';const tags=[...G('m-pt').selectedOptions].map(o=>o.value);const pf=G('m-pi').files[0];
    const apply=(url)=>{if(isE){const i=S.produkte.findIndex(p=>p.id===S.form.pid);if(i>=0)S.produkte[i]={...S.produkte[i],name,cat,icon,tags,...(url?{url}:{})};showT('Aktualisiert ✓');}else{S.produkte.push({id:uid(),name,cat,icon,tags,url:url||null,briefings:[],skripte:[],lernvideos:[]});showT(\`"\${name}" hinzugefügt ✓\`);}rProdukte();uBdg();closeM();};
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addPJ'||type==='editPJ'){
    const isE=type==='editPJ';const name=G('m-pjn').value.trim();if(!name){showT('Name erforderlich');return;}
    const pids=[...G('m-pjp').selectedOptions].map(o=>+o.value).filter(Boolean);const aktion=G('m-pja').value.trim();const start=G('m-pjs').value;const count=+G('m-pjc').value||1;const pf=G('m-pji').files[0];
    const apply=(url)=>{if(isE){const i=S.projekte.findIndex(p=>p.id===S.form.pjid);if(i>=0){const old=S.projekte[i];S.projekte[i]={...old,name,pids,aktion,start,count,...(url?{url}:{})};if(S.aPJ?.id===S.form.pjid){S.aPJ=S.projekte[i];rPJHdr();rPJT(S.aPT);}}showT('Aktualisiert ✓');}else{S.projekte.push({id:uid(),name,pids,aktion,start,count,cids:[],status:'planned',url:url||null});showT(\`"\${name}" erstellt ✓\`);}rProjekte();uBdg();closeM();};
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addK'||type==='editK'){
    const isE=type==='editK';const name=G('m-kn').value.trim();if(!name)return;const icon=G('m-ki').value.trim()||'📁';const ktype=G('m-kt').value;
    if(isE){const i=S.kat.findIndex(k=>k.id===S.form.kid);if(i>=0)S.kat[i]={...S.kat[i],name,icon,type:ktype};showT('Aktualisiert ✓');}else{S.kat.push({id:uid(),name,icon,type:ktype});showT(\`"\${name}" erstellt ✓\`);}rKat();closeM();return;
  }
  if(type==='invite'){
    const name=G('m-in').value.trim();if(!name){showT('Name erforderlich');return;}const email=G('m-ie').value.trim();if(!email||!email.includes('@')){showT('Gültige E-Mail erforderlich');return;}
    const role=S.selRole||'read';
    closeM();showT('⏳ Einladung wird gesendet...');
    (async()=>{
      try{
        const token=localStorage.getItem('token')||'';
        const res=await fetch('/api/team/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({name,email,role})});
        const data=await res.json();
        if(res.ok){S.team.push({id:data.user&&data.user.id?data.user.id:uid(),name,email,role,status:'pending'});rTeam();showT('✓ Einladungs-E-Mail gesendet an '+email);}
        else showT('Fehler: '+(data.error||'Unbekannt'));
      }catch(e){S.team.push({id:uid(),name,email,role,status:'pending'});rTeam();showT('✓ Mitglied hinzugefügt');}
    })();return;
  }
  if(type==='addCToP'){if(!S.aPJ)return;S.aPJ.cids=[...S.selC];rPJHdr();rPJT(S.aPT);closeM();showT(\`\${S.selC.length} Creator zugewiesen ✓\`);return;}
}

function uBdg(){G('bdg-c').textContent=S.creators.length;G('bdg-p').textContent=S.projekte.length;}

// ── STATIC LISTENERS ──────────────────────────────────────────────────────
G('logo-btn').addEventListener('click',()=>go('dashboard'));
G('user-btn').addEventListener('click',()=>go('einst'));
['dashboard','creators','produkte','projekte','kategorien','team','einst'].forEach(p=>G('ni-'+p)?.addEventListener('click',()=>go(p)));
G('ni-c-invite').addEventListener('click',()=>go('c-invite'));
G('btn-add-c').addEventListener('click',()=>openM('addC'));
G('btn-add-p').addEventListener('click',()=>openM('addP'));
G('btn-add-pj').addEventListener('click',()=>openM('addPJ'));
G('btn-add-k').addEventListener('click',()=>openM('addK'));
G('btn-invite').addEventListener('click',()=>openM('invite'));
G('btn-add-tag').addEventListener('click',()=>{const v=G('new-tag').value.trim();if(!v||S.tags.includes(v))return;S.tags.push(v);G('new-tag').value='';rTags();showT(\`"\${v}" hinzugefügt\`);});
G('new-tag').addEventListener('keydown',e=>{if(e.key==='Enter'){const v=G('new-tag').value.trim();if(!v||S.tags.includes(v))return;S.tags.push(v);G('new-tag').value='';rTags();showT(\`"\${v}" hinzugefügt\`);}});
G('s-save').addEventListener('click',()=>{G('sb-name').textContent=G('s-name').value.split(' ')[0]||'Admin';showT('Gespeichert ✓');});
G('pw-save').addEventListener('click',()=>{const c=G('pw-c').value,n=G('pw-n').value,k=G('pw-k').value;if(!c||!n||!k)return showT('Alle Felder ausfüllen');if(n.length<8)return showT('Min. 8 Zeichen');if(n!==k)return showT('Stimmen nicht überein');['pw-c','pw-n','pw-k'].forEach(id=>G(id).value='');showT('Passwort geändert ✓');});
G('dark-tgl').addEventListener('click',()=>{S.dark=!S.dark;document.body.classList.toggle('dark',S.dark);G('dark-tgl').classList.toggle('on',S.dark);showT(S.dark?'Dark Mode aktiviert':'Light Mode aktiviert');});
G('lang-de').addEventListener('click',()=>{G('lang-de').className='btn btn-p btn-sm';G('lang-en').className='btn btn-sm';showT('Sprache: Deutsch');});
G('lang-en').addEventListener('click',()=>{G('lang-en').className='btn btn-p btn-sm';G('lang-de').className='btn btn-sm';showT('Language: English');});
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
G('search-inp').addEventListener('click',openSearch);
G('fp-btn').addEventListener('click',()=>{G('fp-panel').classList.toggle('open');if(G('fp-panel').classList.contains('open'))rFP();});
G('fp-close').addEventListener('click',()=>G('fp-panel').classList.remove('open'));
G('fp-apply').addEventListener('click',()=>{
  const cnt=S.flt.prods.length+S.flt.tags.length+(S.flt.cid?1:0);
  const btn=G('fp-btn');btn.style.background=cnt>0?'#eff2ff':'';btn.style.color=cnt>0?'var(--blue)':'';btn.textContent=cnt>0?\`⚙ Filter (\${cnt})\`:'⚙ Filter';
  const chips=[];
  S.flt.prods.forEach(id=>{const p=S.produkte.find(x=>x.id===id);if(p)chips.push(\`<span class="af-chip">\${p.name}<span style="cursor:pointer;opacity:.6;margin-left:2px" data-cf="\${id}">✕</span></span>\`);});
  S.flt.tags.forEach(t=>chips.push(\`<span class="af-chip">\${t}<span style="cursor:pointer;opacity:.6;margin-left:2px" data-ct="\${t}">✕</span></span>\`));
  if(S.flt.cid){const c=S.creators.find(x=>x.id===S.flt.cid);if(c)chips.push(\`<span class="af-chip">\${c.name}<span style="cursor:pointer;opacity:.6;margin-left:2px" data-cc>✕</span></span>\`);}
  G('af-row').innerHTML=chips.length?\`<div style="display:flex;gap:3px;flex-wrap:wrap;margin-bottom:10px">\${chips.join('')}</div>\`:'';
  G('af-row').querySelectorAll('[data-cf]').forEach(x=>x.addEventListener('click',()=>{S.flt.prods=S.flt.prods.filter(p=>p!==+x.dataset.cf);G('fp-apply').click();}));
  G('af-row').querySelectorAll('[data-ct]').forEach(x=>x.addEventListener('click',()=>{S.flt.tags=S.flt.tags.filter(t=>t!==x.dataset.ct);G('fp-apply').click();}));
  G('af-row').querySelectorAll('[data-cc]').forEach(x=>x.addEventListener('click',()=>{S.flt.cid=null;G('fp-apply').click();}));
  rDash();G('fp-panel').classList.remove('open');
});
G('fp-reset').addEventListener('click',()=>{S.flt={prods:[],tags:[],cid:null};const btn=G('fp-btn');btn.style.background='';btn.style.color='';btn.textContent='⚙ Filter';G('af-row').innerHTML='';rFP();rDash();G('fp-panel').classList.remove('open');});
G('fp-cs').addEventListener('input',e=>rFpC(e.target.value));
G('close-portal').addEventListener('click',()=>G('creator-portal').classList.remove('open'));
G('open-portal-preview').addEventListener('click',()=>openPortal(S.creators[0].id));
G('ci-send').addEventListener('click',async ()=>{
  const cid=+G('ci-sel').value;
  if(!cid){showT('Bitte einen Creator auswählen');return;}
  const c=S.creators.find(x=>x.id===cid);
  if(!c){showT('Creator nicht gefunden');return;}
  const email=c.email||G('ci-email').value.trim();
  if(!email||!email.includes('@')){showT('Gültige E-Mail erforderlich');return;}
  if(!c.email)c.email=email;
  showT('⏳ E-Mail wird gesendet...');
  try{
    const token=localStorage.getItem('token')||'';
    const res=await fetch('/api/creators/invite',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({creatorId:c.id,email,name:c.name})});
    const data=await res.json();
    if(res.ok){c.invited=true;c.invitedAt=new Date().toISOString();G('ci-sel').value='';G('ci-preview').style.display='none';G('ci-email-wrap').style.display='none';rCInvite();showT('✓ Einladungs-E-Mail gesendet an '+email);}
    else showT('Fehler: '+(data.error||'Unbekannt'));
  }catch(e){c.invited=true;c.invitedAt=new Date().toISOString();rCInvite();showT('✓ Creator eingeladen');}
});
G('creator-portal').querySelectorAll('.ni[id^="pni-"]').forEach(n=>{n.addEventListener('click',()=>renderPortalPage(n.id.replace('pni-','')));});
document.addEventListener('click',e=>{if(!e.target.closest('#drop-menu')&&!e.target.closest('.dot-btn'))hideDot();if(!e.target.closest('#fp-panel')&&!e.target.closest('#fp-btn'))G('fp-panel').classList.remove('open');});


// ── PORTAL FOLDER HELPERS ──────────────────────────────────────────────────
function portalOpenFld(fldWithTab){
  const c=_portalCreator;if(!c)return;
  const {tab,...fld}=fldWithTab;
  const realFld=c.flds[tab]?.find(f=>f.id===fld.id);
  if(!realFld)return;
  const ico={bilder:'🖼️',videos:'🎬',roh:'📹',auswertung:'📊'};
  const main=G('portal-main');
  const d=new Date(realFld.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});
  main.innerHTML=\`
    <button class="bk" id="portal-bk-fld">← Zurück zu Ordnern</button>
    <div style="background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:12px 15px;margin-bottom:13px;display:flex;align-items:center;gap:10px">
      <div style="font-size:26px">\${ico[tab]||'📁'}</div>
      <div style="flex:1">
        <div style="font-size:13px;font-weight:700">\${realFld.name}</div>
        <div style="font-size:10px;color:var(--muted)">📅 \${d} · \${tab} · \${realFld.files.length} Dateien</div>
      </div>
      <button class="btn btn-p btn-sm" id="portal-upload-here">+ Hochladen</button>
    </div>
    <div class="file-grid" id="portal-file-grid"></div>\`;
  G('portal-bk-fld').addEventListener('click',()=>renderPortalPage('home'));
  G('portal-upload-here').addEventListener('click',()=>{
    // Switch to upload tab and pre-select this folder
    renderPortalPage('upload');
    setTimeout(()=>{
      const sel=G('portal-fld-sel');
      if(sel){
        for(let o of sel.options){if(o.value===realFld.id+':'+tab){o.selected=true;break;}}
      }
    },50);
  });
  // Render files
  const fg=G('portal-file-grid');
  if(!realFld.files.length){
    fg.innerHTML=\`<div class="empty" style="grid-column:1/-1"><div>📂</div><div style="margin:5px 0 10px">Noch keine Dateien in diesem Ordner</div><button class="btn btn-p" id="portal-upload-from-empty">+ Datei hochladen</button></div>\`;
    G('portal-upload-from-empty')?.addEventListener('click',()=>{renderPortalPage('upload');setTimeout(()=>{const sel=G('portal-fld-sel');if(sel){for(let o of sel.options){if(o.value===realFld.id+':'+tab){o.selected=true;break;}}}},50);});
    return;
  }
  const renderPortalFiles=()=>{
    fg.innerHTML=realFld.files.map((f,fi)=>{
      const isI=f.type==='image',isV=f.type==='video';
      const th=f.url?(isI?\`<img src="\${f.url}">\`:\`<video src="\${f.url}" preload="metadata"></video>\`):\`<span>\${isI?'🖼️':isV?'🎬':'📄'}</span>\`;
      const pov=isV?\`<div class="play-ov"><div class="play-btn">▶</div></div>\`:'';
      const upBadge=f.uploadedAt?\`<div style="font-size:9px;color:var(--grn);margin-top:2px">✓ Hochgeladen \${new Date(f.uploadedAt).toLocaleDateString('de-DE')}</div>\`:'';
      const cnt=f.comments?.length||0;
      const commBadge=cnt?\`<button class="fi-comment-badge" data-pcomm="\${fi}" style="cursor:pointer;background:var(--blue);color:#fff;border:none;border-radius:9px;font-size:9px;padding:1px 7px;font-family:inherit;margin-top:3px">💬 \${cnt} Kommentar\${cnt>1?'e':''}</button>\`:'';
      return\`<div class="ficard" style="cursor:pointer">
        <div class="fi-thumb" data-pf="\${fi}">\${th}\${pov}</div>
        <div class="fi-info">
          <div class="fi-name">\${f.name}</div>
          <div class="fi-meta">\${f.size||''}</div>
          \${upBadge}
          \${commBadge}
        </div>
      </div>\`;
    }).join('')+\`<div class="add-fcard" style="min-height:100px" id="portal-add-to-fld"><div>+</div><span style="font-size:10px">Hochladen</span></div>\`;
    // File thumb click → portal lightbox
    fg.querySelectorAll('[data-pf]').forEach((thumb,fi)=>{
      thumb.addEventListener('click',()=>openPortalLB(realFld,fi,_portalCreator,renderPortalFiles));
    });
    // Comment badge click → portal comment panel
    fg.querySelectorAll('[data-pcomm]').forEach(btn=>{
      btn.addEventListener('click',e=>{e.stopPropagation();openPortalComments(realFld.files[+btn.dataset.pcomm],_portalCreator,renderPortalFiles);});
    });
    G('portal-add-to-fld')?.addEventListener('click',()=>{renderPortalPage('upload');setTimeout(()=>{const sel=G('portal-fld-sel');if(sel){for(let o of sel.options){if(o.value===realFld.id+':'+tab){o.selected=true;break;}}}},50);});
  };
  renderPortalFiles();
}

function portalNewFolder(){
  renderPortalPage('upload');
  setTimeout(()=>{
    const sel=G('portal-fld-sel');
    if(sel){sel.value='new';sel.dispatchEvent(new Event('change'));}
  },50);
}


// ── CONTENT HUB ──────────────────────────────────────────────────────────
function rContentHub(){
  const hub=S.contentHub;
  const allCats=['Alle',...hub.cats];
  // Category tabs
  G('ch-cats').innerHTML=allCats.map(c=>
    '<button class="fp-chip'+(S.chFilter===c?' sel':'')+'" data-chcat="'+c+'">'+c+'</button>'
  ).join('');
  G('ch-cats').querySelectorAll('[data-chcat]').forEach(btn=>{
    btn.addEventListener('click',()=>{S.chFilter=btn.dataset.chcat;rContentHub();});
  });
  // Filter items
  const search=G('ch-search').value.toLowerCase();
  let items=hub.items;
  if(S.chFilter!=='Alle')items=items.filter(x=>x.cat===S.chFilter);
  if(search)items=items.filter(x=>x.title.toLowerCase().includes(search)||x.desc.toLowerCase().includes(search));
  // Render grid
  if(!items.length){
    G('ch-grid').innerHTML='<div style="grid-column:1/-1;text-align:center;padding:40px;color:var(--muted);font-size:13px">'+
      (hub.items.length?'Keine Ergebnisse':'Noch keine Inhalte. Klicke auf "+ Inhalt hinzufügen" um zu starten.')+'</div>';
  } else {
    G('ch-grid').innerHTML=items.map(item=>{
      const isNew=item.createdAt&&(Date.now()-new Date(item.createdAt).getTime())<7*24*60*60*1000;
      const typeIcon=item.type==='video'?'🎬':item.type==='pdf'?'📄':item.type==='link'?'🔗':'📎';
      const catColor={'Briefings':'#dbeafe;color:#1e40af','Skripte':'#dcfce7;color:#166534','Lernvideos':'#fef3c7;color:#92400e'}[item.cat]||'#f3f4f6;color:#374151';
      return '<div class="sc ch-card" style="padding:18px;cursor:pointer" data-chid="'+item.id+'">'+ 
        '<div style="display:flex;align-items:flex-start;justify-content:space-between;margin-bottom:10px">'+
        '<div style="font-size:22px">'+typeIcon+'</div>'+
        '<div style="display:flex;gap:6px;align-items:center">'+
        (isNew?'<span style="background:#dcfce7;color:#166534;font-size:9px;font-weight:700;padding:2px 6px;border-radius:4px;letter-spacing:.5px">NEU</span>':'')+
        '<span style="font-size:10px;padding:2px 8px;border-radius:5px;background:'+catColor+'">'+item.cat+'</span>'+
        '<button class="dot-btn" data-ch-dot="'+item.id+'">···</button>'+
        '</div></div>'+
        '<div style="font-size:14px;font-weight:600;color:var(--text);margin-bottom:5px;line-height:1.3">'+item.title+'</div>'+
        '<div style="font-size:12px;color:var(--muted);line-height:1.5;margin-bottom:12px">'+( item.desc||'')+'</div>'+
        (item.prod?'<div style="font-size:10px;color:var(--muted);margin-bottom:8px">📦 '+( S.produkte.find(p=>p.id===item.prod)?.name||'')+'</div>':'')+
        '<div style="display:flex;gap:6px;margin-top:auto">'+
        (item.url?'<a href="'+item.url+'" target="_blank" style="font-size:11px;background:var(--lt);border:1px solid var(--bdr);border-radius:6px;padding:4px 10px;text-decoration:none;color:var(--text)">Öffnen ↗</a>':'')+
        (item.file?'<button class="btn" style="font-size:11px;padding:4px 10px" data-chdown="'+item.id+'">⬇ Download</button>':'')+
        '</div>'+
        '</div>';
    }).join('');
    G('ch-grid').querySelectorAll('[data-chid]').forEach(card=>{
      card.addEventListener('click',e=>{
        if(e.target.closest('.dot-btn')||e.target.closest('a')||e.target.closest('button'))return;
      });
    });
    G('ch-grid').querySelectorAll('[data-ch-dot]').forEach(btn=>{
      btn.addEventListener('click',e=>{
        e.stopPropagation();
        const id=btn.dataset.chDot;
        showDot(btn,()=>openChEdit(id),null,()=>{
          S.contentHub.items=S.contentHub.items.filter(x=>x.id!==id);
          rContentHub();showT('Inhalt gelöscht');
        });
      });
    });
    G('ch-grid').querySelectorAll('[data-chdown]').forEach(btn=>{
      btn.addEventListener('click',()=>{
        const item=S.contentHub.items.find(x=>x.id===btn.dataset.chdown);
        if(item&&item.file){const a=document.createElement('a');a.href=item.file;a.download=item.title;a.click();}
      });
    });
  }
  // Search live
  G('ch-search').oninput=()=>rContentHub();
}

function openChEdit(id){
  const item=S.contentHub.items.find(x=>x.id===id);
  openChModal(item);
}

function openChModal(item){
  const isE=!!item;
  const body=G('modal-body'),title=G('modal-title'),ok=G('modal-ok');
  title.textContent=isE?'Inhalt bearbeiten':'Inhalt hinzufügen';
  ok.textContent='Speichern';
  G('modal-cancel').style.display='';
  const catOpts=S.contentHub.cats.map(c=>'<option value="'+c+'"'+(item?.cat===c?' selected':'')+'>'+c+'</option>').join('');
  const prodOpts='<option value="">– Kein Produkt –</option>'+S.produkte.map(p=>'<option value="'+p.id+'"'+(item?.prod===p.id?' selected':'')+'>'+p.name+'</option>').join('');
  body.innerHTML=\`
    <div class="fg"><label class="fl">Titel *</label><input class="fi" id="ch-m-title" value="\${item?.title||''}" placeholder="z.B. Briefing Serum XY"></div>
    <div class="fg"><label class="fl">Beschreibung</label><textarea class="fi" id="ch-m-desc" rows="2" style="resize:none">\${item?.desc||''}</textarea></div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
      <div class="fg"><label class="fl">Kategorie</label><select class="fi" id="ch-m-cat">\${catOpts}</select></div>
      <div class="fg"><label class="fl">Typ</label><select class="fi" id="ch-m-type">
        <option value="link" \${item?.type==='link'?'selected':''}>🔗 Link</option>
        <option value="pdf" \${item?.type==='pdf'?'selected':''}>📄 PDF Upload</option>
        <option value="video" \${item?.type==='video'?'selected':''}>🎬 Video</option>
        <option value="file" \${item?.type==='file'?'selected':''}>📎 Datei</option>
      </select></div>
    </div>
    <div class="fg"><label class="fl">Produkt zuordnen (optional)</label><select class="fi" id="ch-m-prod">\${prodOpts}</select></div>
    <div class="fg" id="ch-m-url-wrap"><label class="fl">Link URL</label><input class="fi" id="ch-m-url" value="\${item?.url||''}" placeholder="https://..."></div>
    <div class="fg" id="ch-m-file-wrap" style="display:none"><label class="fl">Datei hochladen</label><input type="file" class="fi" id="ch-m-file" style="padding:5px"></div>
    <div style="font-size:11px;color:var(--muted);margin-top:4px" id="ch-m-file-cur">\${item?.file?'Aktuelle Datei vorhanden':''}  </div>\`;
  // Toggle URL/File based on type
  G('ch-m-type').onchange=function(){
    const isFile=this.value==='pdf'||this.value==='file';
    G('ch-m-url-wrap').style.display=isFile?'none':'';
    G('ch-m-file-wrap').style.display=isFile?'':'none';
  };
  G('ch-m-type').dispatchEvent(new Event('change'));
  ok.onclick=async()=>{
    const t=G('ch-m-title').value.trim();if(!t){showT('Titel erforderlich');return;}
    const newItem={
      id:item?.id||uid(),
      title:t,
      desc:G('ch-m-desc').value.trim(),
      cat:G('ch-m-cat').value,
      type:G('ch-m-type').value,
      prod:G('ch-m-prod').value||null,
      url:G('ch-m-url').value.trim()||item?.url||null,
      file:item?.file||null,
      createdAt:item?.createdAt||new Date().toISOString()
    };
    // Handle file upload
    const fileInput=G('ch-m-file');
    if(fileInput.files&&fileInput.files[0]){
      const file=fileInput.files[0];
      try{
        const token=localStorage.getItem('token')||'';
        const urlRes=await fetch('/api/upload-url',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({filename:file.name,contentType:file.type})});
        if(urlRes.ok){
          const {uploadUrl,publicUrl}=await urlRes.json();
          await fetch(uploadUrl,{method:'PUT',body:file,headers:{'Content-Type':file.type}});
          newItem.file=publicUrl;
          newItem.url=null;
        }
      }catch(e){showT('Upload fehlgeschlagen');}
    }
    if(isE){const idx=S.contentHub.items.findIndex(x=>x.id===item.id);S.contentHub.items[idx]=newItem;}
    else S.contentHub.items.push(newItem);
    closeM();rContentHub();showT(isE?'Inhalt aktualisiert ✓':'Inhalt hinzugefügt ✓');
  };
  G('modal-bg').classList.add('open');
}

if(document.getElementById('pg-dashboard')){go('dashboard');rFP();}
// Mobile sidebar toggle
G('menu-toggle')?.addEventListener('click',()=>{
  G('admin-sb').classList.toggle('open');
  G('sb-overlay').classList.toggle('open');
});
G('sb-overlay')?.addEventListener('click',()=>{
  G('admin-sb').classList.remove('open');
  G('sb-overlay').classList.remove('open');
});
// Close sidebar on nav click (mobile)
document.querySelectorAll('.ni').forEach(n=>n.addEventListener('click',()=>{
  if(window.innerWidth<=900){
    G('admin-sb').classList.remove('open');
    G('sb-overlay').classList.remove('open');
  }
}));
G('ch-add-btn')?.addEventListener('click',()=>openChModal(null));
G('ch-add-cat-btn')?.addEventListener('click',()=>{
  const name=prompt('Neue Kategorie:');if(!name||!name.trim())return;
  S.contentHub.cats.push(name.trim());rContentHub();showT('Kategorie hinzugefügt ✓');
});
G('logout-btn')?.addEventListener('click',()=>{
  if(confirm('Wirklich abmelden?')){localStorage.removeItem('token');localStorage.removeItem('user');window.location.href='/login';}
});
G('portal-logout-btn')?.addEventListener('click',()=>{
  if(confirm('Vom Creator Portal abmelden?')){localStorage.removeItem('creator_token');localStorage.removeItem('creator');G('creator-portal').classList.remove('open');window.location.href='/creator';}
});
`

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#f0f0f5',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, fontFamily: 'system-ui, sans-serif',
      zIndex: 99999
    }}>
      <div style={{ fontSize: 32 }}>⏳</div>
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
        padding: '44px 40px', width: '100%', maxWidth: 400, textAlign: 'center',
        boxShadow: '0 2px 20px rgba(0,0,0,0.06)'
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
          Link ungültig oder abgelaufen
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, margin: '0 0 28px' }}>
          Dein Zugangslink ist ungültig oder abgelaufen.
          Bitte fordere einen neuen Link bei deinem Filapen-Team an.
        </p>
        <button onClick={onRetry} style={{
          width: '100%', background: '#111', color: '#fff', fontWeight: 600,
          fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer'
        }}>
          Neuen Link anfordern
        </button>
        <div style={{ fontSize: 12, color: '#ccc', marginTop: 24 }}>
          Filapen GmbH · Business Hub
        </div>
      </div>
    </div>
  )
}

export default function CreatorPortalPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [creatorData, setCreatorData] = useState<any>(null)
  const jsInitialized = useRef(false)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const authInitialized = useRef(false)

  // Step 1: Auth check
  useEffect(() => {
    if (!router.isReady) return
    // Guard: auth init runs exactly once per page load
    if (authInitialized.current) return
    authInitialized.current = true

    const urlCode = router.query.code as string
    const storedToken = localStorage.getItem('creator_token')
    const storedCreator = localStorage.getItem('creator')

    console.log('[CreatorPortal] Auth init:', {
      urlCode: urlCode || 'none',
      hasStoredToken: !!storedToken,
      hasStoredCreator: !!storedCreator
    })

    if (urlCode) {
      console.log('[CreatorPortal] Magic link detected, verifying code...')
      verifyCode(urlCode)
    } else if (storedToken && storedCreator) {
      console.log('[CreatorPortal] Existing session found, restoring...')
      try {
        const creator = JSON.parse(storedCreator)
        console.log('[CreatorPortal] Session restored for:', creator.name)
        setCreatorData(creator)
        setAuthState('auth_ready')
      } catch(e) {
        console.error('[CreatorPortal] Session parse failed:', e)
        clearSession()
        setAuthState('error')
      }
    } else {
      console.log('[CreatorPortal] No code, no session → error state')
      setAuthState('error')
    }
  }, [router.isReady])

  async function verifyCode(code: string) {
    try {
      const res = await fetch('/api/auth/creator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() })
      })
      const data = await res.json()
      if (!res.ok || !data.creator) {
        console.error('[CreatorPortal] Code verification failed:', data.error)
        setAuthState('error')
        return
      }
      // Store session FIRST before any state changes or navigation
      localStorage.setItem('creator_token', data.token)
      localStorage.setItem('creator', JSON.stringify(data.creator))
      console.log('[CreatorPortal] Token stored:', !!localStorage.getItem('creator_token'))
      console.log('[CreatorPortal] Creator stored:', !!localStorage.getItem('creator'))
      console.log('[CreatorPortal] Creator name:', data.creator.name)
      // Set state - triggers portal init
      setCreatorData(data.creator)
      setAuthState('auth_ready')
      // Clean URL AFTER session is stored - shallow so no re-render
      router.replace('/creator-portal', undefined, { shallow: true })
    } catch(e) {
      console.error('[CreatorPortal] verifyCode exception:', e)
      setAuthState('error')
    }
  }

  function clearSession() {
    localStorage.removeItem('creator_token')
    localStorage.removeItem('creator')
  }

  // Step 2: Mount portal only after auth confirmed
  useEffect(() => {
    if (authState !== 'auth_ready') return
    if (!creatorData) return
    if (jsInitialized.current) return
    if (!containerRef.current) return

    jsInitialized.current = true

    // Inject CSS
    const styleEl = document.createElement('style')
    styleEl.textContent = PORTAL_CSS
    document.head.appendChild(styleEl)
    styleRef.current = styleEl

    // Inject ONLY portal HTML — no admin elements
    containerRef.current.innerHTML = PORTAL_HTML

    // ── Safe G() replacement ────────────────────────────────────────────
    // Replace G() with a null-safe proxy that never throws on missing elements.
    // This handles ALL 257+ G() calls in the app JS without patching each one.
    // Admin DOM elements simply don't exist here — any access is a no-op.
    const NULL_PROXY: any = new Proxy({}, {
      get: () => NULL_PROXY,
      set: () => true,
      apply: () => NULL_PROXY,
    })

    // Preamble: override G() and admin init calls
    // G() returns NULL_PROXY for missing elements instead of null
    // Admin init functions become no-ops
    // window.__isCreatorRoute prevents admin startup paths from running
    const CREATOR_PREAMBLE = `
var __nullProxy = new Proxy({}, {
  get: function(t,k) {
    if (k === 'addEventListener' || k === 'removeEventListener') return function(){};
    if (k === 'classList') return {add:function(){},remove:function(){},toggle:function(){},contains:function(){return false}};
    if (k === 'style') return new Proxy({},{set:function(){return true},get:function(){return ''}});
    if (k === 'innerHTML' || k === 'textContent' || k === 'value') return '';
    return __nullProxy;
  },
  set: function() { return true; }
});
window.__isCreatorRoute = true;
`

    // Execute APP_JS and explicitly expose required symbols on window
    // Top-level const/function in new Function() scope are NOT on window automatically
    // So we append explicit window assignments to the patched JS string
    const EXPOSE_GLOBALS = `
;window.S = typeof S !== 'undefined' ? S : null;
window.openPortal = typeof openPortal !== 'undefined' ? openPortal : null;
window.openPortalLB = typeof openPortalLB !== 'undefined' ? openPortalLB : null;
window.openPortalComments = typeof openPortalComments !== 'undefined' ? openPortalComments : null;
window.renderPortalPage = typeof renderPortalPage !== 'undefined' ? renderPortalPage : null;
window.showT = typeof showT !== 'undefined' ? showT : null;
`
    const patchedJS = APP_JS + EXPOSE_GLOBALS
    try {
      const appFn = new Function(patchedJS)
      appFn()
    } catch(e) {
      // Non-fatal: admin DOM init errors expected (missing admin elements)
      console.warn('[CreatorPortal] APP_JS non-critical warning:', e instanceof Error ? e.message : String(e))
    }
    console.log('[CreatorPortal] window.S exists:', !!(window as any).S)
    console.log('[CreatorPortal] window.openPortal exists:', typeof (window as any).openPortal === 'function')

    // Step 2: Overwrite window.G with null-safe version AFTER APP_JS ran
    // This replaces the unsafe G() that APP_JS defined
    // All subsequent calls to G() (including openPortal) use this safe version
    const w = window as any
    const __nullProxy: any = new Proxy({}, {
      get: (_t: any, k: string) => {
        if (k === 'addEventListener' || k === 'removeEventListener') return () => {}
        if (k === 'classList') return { add: () => {}, remove: () => {}, toggle: () => {}, contains: () => false }
        if (k === 'style') return new Proxy({}, { set: () => true, get: () => '' })
        if (k === 'innerHTML' || k === 'textContent' || k === 'value') return ''
        if (k === 'querySelector' || k === 'querySelectorAll') return () => null
        return __nullProxy
      },
      set: () => true
    })
    w.G = function(id: string) {
      const el = document.getElementById(id)
      return el !== null ? el : __nullProxy
    }
    console.log('[CreatorPortal] Safe G() installed on window')
    console.log('[CreatorPortal] G() patch verified — G(nonexistent) is proxy:', w.G('__nonexistent__') === __nullProxy)

    // Step 3: Wait until portal DOM is ready, then open it
    function waitForPortalDom(attempts: number) {
      const portalEl = document.getElementById('creator-portal')
      if (!portalEl) {
        if (attempts > 20) {
          console.error('[CreatorPortal] Portal DOM not found after 20 attempts — UI error')
          setAuthState('portal_error')
          return
        }
        requestAnimationFrame(() => waitForPortalDom(attempts + 1))
        return
      }
      initPortalAfterDom()
    }

    function initPortalAfterDom() {
      const w = window as any

      if (!w.S || !w.openPortal) {
        console.error('[CreatorPortal] Portal functions not available — UI error')
        setAuthState('portal_error')
        return
      }

      const cid = creatorData.id

      // Add creator to S.creators if not present
      if (!w.S.creators.find((c: any) => String(c.id) === String(cid))) {
        w.S.creators.push({
          id: cid,
          name: creatorData.name || 'Creator',
          ini: (creatorData.initials || creatorData.name?.slice(0, 2) || 'CR').toUpperCase(),
          color: '#7c3aed',
          email: creatorData.email || '',
          tags: [],
          flds: { bilder: [], videos: [], roh: [], auswertung: [] },
          notizenCreator: '',
          invited: true
        })
      }

      // openPortal — UI failures are NOT auth failures
      console.log('[CreatorPortal] openPortal called, cid:', cid)
      console.log('[CreatorPortal] portal element exists:', !!document.getElementById('creator-portal'))
      try {
        w.openPortal(cid)
        console.log('[CreatorPortal] openPortal completed without exception')
      } catch(e) {
        console.error('[CreatorPortal] openPortal threw (UI error, not auth):', e instanceof Error ? e.message : String(e))
        setAuthState('portal_error')
        return
      }

      // Verify portal opened — UI error if not, NOT auth error
      const portalEl = document.getElementById('creator-portal')
      const hasOpenClass = portalEl ? portalEl.classList.contains('open') : false
      console.log('[CreatorPortal] portal has .open class:', hasOpenClass)
      if (!portalEl || !hasOpenClass) {
        console.error('[CreatorPortal] Portal did not open — UI error not auth error')
        setAuthState('portal_error')
        return
      }

      // Hide admin-only buttons
      const closeBtn = document.getElementById('close-portal')
      if (closeBtn) closeBtn.style.display = 'none'

      // Override logout
      const logoutBtn = document.getElementById('portal-logout-btn')
      if (logoutBtn) {
        logoutBtn.onclick = (e: Event) => {
          e.stopPropagation()
          if (confirm('Wirklich abmelden?')) {
            clearSession()
            window.location.href = '/creator'
          }
        }
      }

      // All verified — show portal
      setAuthState('portal_ready')
    }

    waitForPortalDom(0)

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
      {authState === 'error' && <ErrorScreen onRetry={() => { window.location.href = '/creator' }} />}
      {authState === 'portal_error' && (
        <div style={{ minHeight: '100vh', background: '#f0f0f5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24, fontFamily: 'system-ui, sans-serif' }}>
          <div style={{ background: '#fff', border: '1px solid #e8e8ec', borderRadius: 20, padding: '44px 40px', width: '100%', maxWidth: 400, textAlign: 'center' }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚠️</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>Portal konnte nicht geladen werden</h2>
            <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, margin: '0 0 28px' }}>Dein Login war erfolgreich, aber das Portal konnte nicht gestartet werden. Bitte lade die Seite neu.</p>
            <button onClick={() => window.location.reload()} style={{ width: '100%', background: '#111', color: '#fff', fontWeight: 600, fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer' }}>Seite neu laden</button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          opacity: authState === 'portal_ready' ? 1 : 0,
          pointerEvents: authState === 'portal_ready' ? 'auto' : 'none'
        }}
      />
    </>
  )
}
