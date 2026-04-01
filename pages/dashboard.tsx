import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const CSS = `
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
const HTML = `

<!-- ADMIN SIDEBAR -->
<div class="sb-overlay" id="sb-overlay"></div>
<div class="sb" id="admin-sb">
  <div class="logo" id="logo-btn">
    <img src="data:image/png;base64,/9j/4AAQSkZJRgABAQAASABIAAD/4QBMRXhpZgAATU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAA6ABAAMAAAABAAEAAKACAAQAAAABAAAH0KADAAQAAAABAAAH0AAAAAD/7QA4UGhvdG9zaG9wIDMuMAA4QklNBAQAAAAAAAA4QklNBCUAAAAAABDUHYzZjwCyBOmACZjs+EJ+/8AAEQgH0AfQAwEiAAIRAQMRAf/EAB8AAAEFAQEBAQEBAAAAAAAAAAABAgMEBQYHCAkKC//EALUQAAIBAwMCBAMFBQQEAAABfQECAwAEEQUSITFBBhNRYQcicRQygZGhCCNCscEVUtHwJDNicoIJChYXGBkaJSYnKCkqNDU2Nzg5OkNERUZHSElKU1RVVldYWVpjZGVmZ2hpanN0dXZ3eHl6g4SFhoeIiYqSk5SVlpeYmZqio6Slpqeoqaqys7S1tre4ubrCw8TFxsfIycrS09TV1tfY2drh4uPk5ebn6Onq8fLz9PX29/j5+v/EAB8BAAMBAQEBAQEBAQEAAAAAAAABAgMEBQYHCAkKC//EALURAAIBAgQEAwQHBQQEAAECdwABAgMRBAUhMQYSQVEHYXETIjKBCBRCkaGxwQkjM1LwFWJy0QoWJDThJfEXGBkaJicoKSo1Njc4OTpDREVGR0hJSlNUVVZXWFlaY2RlZmdoaWpzdHV2d3h5eoKDhIWGh4iJipKTlJWWl5iZmqKjpKWmp6ipqrKztLW2t7i5usLDxMXGx8jJytLT1NXW19jZ2uLj5OXm5+jp6vLz9PX29/j5+v/bAEMAAQEBAQEBAgEBAgMCAgIDBAMDAwMEBgQEBAQEBgcGBgYGBgYHBwcHBwcHBwgICAgICAkJCQkJCwsLCwsLCwsLC//bAEMBAgICAwMDBQMDBQsIBggLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLCwsLC//dAAQAff/aAAwDAQACEQMRAD8A/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/V/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/X/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/R/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKRmVRljignAzXwt+0j+1CPCnjfR/2fvhaF1Pxz4k5jhQ5WwtskG5nxjCblKcZOSOMUAfckNxFOCYyDjg4qauJ8A+G/8AhF/DVrpcs73UyIPNnk+9I56sf5V21ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopCcDJoAWivFdZ+L+lW3xV0/4UaWv2nUp4PtdwikHybfcU3t6fNgfjXs6NvUNjGaAH0UUUAFISAMmhmCjJr8rv8AgqZ/wU/+DH/BNn4DXnxG8eXSXOuXSNFo+ko3768uD91VGRxwTyR0oAT/AIKXf8FI/Cn7E/gO28PeF4B4h+I3il/sXhzQYDma5uXzhiMrhAAx6g5FL/wTd/Yy8SfBnwje/G79oO+fXviv47cX+vXsvIhLgAW0WQMRgKrcjO7PNfj5/wAER/2PPjz+1T8Vr3/grP8At7Rvd+IPEbGXwjpdyMx6baEjDxqRwchxyT1r+tKNBGgRRgCgBwAUYHSloooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK+a/2sf2j/h/+yl8CPEXx0+Jt0lppGgWjXEpc4LnIVVX1JZhX0Te3cFlbvcXDBUQEknpgcmv4nf2+/2kNR/4LBf8FSfCH/BNb4KXhuvhv4I1JbzxfcwkmO4KBhg442ZZOo6igD97P+CT/hb4gfET4can+2d8aovK8SfFWc6lDaS536fp/CLbr6AtH5nU/e61+wAGBgVzHhDw7pvhTw5ZeHNHjWG1soEhiRRgKiDGBXUUAFBOKCcc18Xfty/tx/BD9g34Fav8b/jPqcdpa2ETG3tywE11MOkcY9e/OBgHmgDh/wDgo3/wUP8Agd/wTo/Z91P40fF++jWaONl07TgwE99cY4jjH0yeSBgHmv4fv+CdH7Pn7Qv/AAcP/t9X37Zv7WLzr8M/CF6JbfT5M/ZGAwVtIgckj5/MJJ6557V+cXjH4p/tff8ABxt/wUb0/wAKR/aItAe72wWyZNpo+nZPzHqeTkdW+9X+nj+xb+yJ8KP2K/gB4f8AgP8ACWyS107RbZIi6qA00gyTI/qcnH0oA+lvC/hzS/CehWnh7RIUt7SziWKGKMYREUYAA9K6CiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkJwMmlr52/al/aM+Hv7K3wO8RfHP4n3cdno/h+0e5md2xuxgBR6nJFAH4jf8HFP/BWGz/4J+/suz/D74fXiN4/8cwvaaesbfvLSJs5nI9MoU78npXwr/wax/sk2n7P37NusftvfHW4W0174oT/AOh3V3wxs32t1POTIhr+SPxF8Q/jd/wXZ/4KxaZBevcva+J9YEFrbr80Wn6euWwBzgFlJ7/er+hD/g52/bOsf2Rvhx8Jv+Cf/wCzxfDTH8Oxw6heC1baY0i3oYmx6tg/jQB/fZFe28gHlsCDyMe9W8jGa/jC1n/gst8etO/YR+F//BS74LbPEOjaXBHpXxA8OElhCyb288YIIfb5a8vjB6V+8n/BOz/grj+yh/wUd8Axaz8Hdchg1+OINe6LdOFu7Zj2YD5TyR0Y9aAPrD9r79rj4PfsafBXWfjZ8ZtVh0vStJgaQmRsNKw6Ig7sc/lX+Tz/AMFNP+ClX7Rv/BYn9qa30nRorn+xWvPsnh3QYSWCqxOCRk5flj97GK/Vv/g6dv8A/gpH4y/aHFh8XdDu7D4TafMU8PyWQZrKbIP7yXkt5nLL2XGO9fof/wAGtf8AwRXk8K2Nr/wUA/aJ0nde3Sh/C9pdJ/qk4/0nH97O9OvTtQB+53/BBj/gkp4W/wCCbf7M9rc+KLWO5+IPieJLnWbsr80RYD9whwPl+VW55zX77gADApkUYiQIvAFSUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/9X+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopCcDJoArXl1FZ27zzHaqgkk+g61/mmf8HTn/BXKT9oP4sH9if4GaoX8MeFLhl1maF/lu7zBGz3TYynoORX9Rn/Bw/8A8FYNP/4J6/ssXXg7wFeo3j/xrC9ppkaN+8to2yTORxgfKyd+vSv8tH4HfDLx7+1t+0fofw20JG1HXfF+qLCC2Wd5HJdmP/AQaAP7S/8Ag1P/AGSvD/wJ+CvxC/4KY/GmBbS0s7N7fS5bkYCwqEkEyn/fytfyFf8ABR/9rTxR+2l+2H43+P3iKeV01rUZHtYnORFAoChV68ZXPXvX9vn/AAX6+NXhb/gmH/wSl8B/8E4/g5KtrqXiPT0srtYjtcWZ3uzn/touK/znLiXzZS/qc0Af05f8G6/7U3gmbxn4v/4J0/HeVZPBXxptGsIopDlI787WVuenyxYr8nPj54S/aG/4JgftqeIPA3hjVb3w34h8G6oy2t1btsYpw6sARtIw2ORXxH8NfHXiD4a+OdK8deF7iS11DSrlLmCWM4ZXQ9j7jIr+r3/gsz4N8M/8FEv2CPhh/wAFWPhPbRHWrSyXR/GdtbAl4pl8x/Nl6848sde9AH6O/wDBNL/g5l+CH7TXhSy/ZU/4Kj6NYyJeKlqNeuVLWtxggg3OSXDZH/LNQOnvX9yHwj1n4Z6r4E0y4+E01pNoHkKLI2TAw+UegX0H1r/BlEk1rKWQkMPSv3D/AOCXH/Bdn9rb/gm94jt9J0jUpfEngl3X7RoV65aIKMZaPBVt2BjlsUAf7FWQelFfkZ/wTY/4LH/skf8ABSPwRDqXww1qLT/EiRq15oV24W7gJxnplSMkdGJ5r9bo5UlUMpzmgCWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9b+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigArwH9pv9oLwF+y/wDBHxF8cfiXdJZ6N4es3uriRzjgYAA9ySK99OMc1+MP/Baz4R+DP2rf2LPHX7MVnqIi8Yapo76ho9qrYkldHAOB3GFagD/LD/4Ke/t8/EP/AIKIftV+Ifjp4xnkWzuZ3j0uyJylrag8Ioyepy3U9a/pA/4NHP2FtN8W/FTxN+3R8SLUf2N4FiMWmSyr8ovFCyFwT/0zZhX8evhn4c+JPF3xMtPhxokEtzqt7eiyjhjHzmXdtIwfYE1/o7/tu+LfC/8AwQ5/4IO6L+z34TkjtfHPjLTl00TJ8szXcgMplPT+BdvSgD+NX/guv+3Tfft1/t+eLvHVnc+f4f0W4fTNGG4kLbKQxx/wMtX4v1papfTajeS3dw+95GZmY9yxyT+dZtACg4Oa/qJ/4N3f2mfBfifVfG3/AATM+O8wk8H/ABls2tLSJyNseo/IykbunyxYr+XUDPFfVf7GHgj43+PP2k/CGhfs72l1eeLW1GJtPW0GXEg6nPQDbnPNAEf7ZX7NnjH9k39pHxZ8BPG1u1ve+Hb+S3O4Y3IcOrD2wwr5aAbqK/0FP+C6n7EH7EXxV8YeA/GH7T3xd0X4UfFbUdCjg1aCTzDb3EoZv3su2KV88BT06dK/nru/+CEfjnxbpkmrfs1/FTwb8UI3y0UekyTpMw7D9+kQzQB+J/wo+MnxJ+CnjKy8f/C/WLnRdY0+QS29zavtdGH5g/iDX95P/BIv/g6/sNU/sr4Hf8FBittN8ltB4pQ/K3+1dZJOe3yJ6V/Ib8Tf+CSv/BQT4PwT33jz4Xaxb2sROJ4jBLGwHcbJGOPwr4Wv/h/418PXMsOtafdWEsDYZZoHUgj3xigD/d3+HPxP8C/FbwpZ+Nfh9qlvq2l38Ylt7m2fcjoehHcfiK9ABB5Ff42X/BMj/gtR+2D/AME2/GMKeCdSm13wi8q/a9BvHJtnAxkryHDYH94Cv9K//gmT/wAFtP2R/wDgpF4Ut4/BurRaF4vRFN1oF64W5QnGSuMqVyf7xNAH7P0VDFMkoyhB+lTUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB/9f+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCGeRY42Y9hX8Mf/Bar/goZb/s9f8Fwfgbbrcsvh7w1afZtbhVvlkSaSZNrD/topr+5LUbmG2tXkn+6ASfoozX+PF/wW1+Meu/tD/8ABXL4k3nhvdcLHrqWGmhOegiYBf8AgWaAP6UP2Ef+CLtlYf8ABd3xp8V9Z00xfDvwdIPE2itKv7i4aRUXYCOuPMZu3Svxa/4OhP2+/wDhrD9uy8+FHhK7Mnhr4bA6XbiJswyzjL+YPcLIV/Cv9Ev9mD4YfHmL/gnV4X8F65fw6d8R5/Cy2ct/Opwlw7EguVBbhCOxr+L74nf8Gc37Y/jfxDf+Lx8V/DV9f6jM9xM8wuSzu5JySIfTigD+IEjJ45o2NX9dms/8GdH/AAUM0XcbPxL4b1ADp5YuMn80FeLeIf8Ag1K/4Ka6Hn7JpNjqGP8AngH5/wC+sUAfzffC/wCFvjb4weN9N+Hvw/0+bU9W1Wdbe2toF3PI7dh+HPNf3lfBH4Tfs3f8G0n7GT/Hv41JaeI/2hPG1ljTtPfl7MsMhB90hBsJznO4+lfoP/wQ3/4ID3n7A/gC/wD2h/jNp9lqvxbu7c/2Va3Ckw6Y3GM8A78gnqRg1+Sf7fv/AAbsf8Ff/wBtr47az8dPi34v0LWbm+mZra1jNwYraE9IowUHHfnJyTQB/Hd+1J+1D8Wv2sfjJrfxp+LuqzaprGtTtNK8jZCg9FXpgDArxSw8X+IdKiCaZdTW7Do0Urqf0Ir+kXxH/wAGrP8AwU90XcLLQbTUSOnkb+f++iK8H8Q/8G1//BW3SN32T4VX16F7wbOfzcUAfnp8Jv8AgpL+238DbNbf4X/ErWtJVMAKrRyrx2/eI9ff/hT/AIL5ftMXWijSv2gvD3hz4pQ7drpr0Lqzjvk25irwjxF/wQg/4K0eGJD/AGh8Edf2qeqLCf8A2rXkus/8EnP+CiPhsMNe+EXiG329cxxH+TmgD78X9vn/AIJR/GDTXf43fsz2/hW7n5lu/B5O/J6kfa7hh+ldf8JPhf8A8EidV8S2nxJ/Z7+PXib4Ra/ayCa1bxE0CpA/bH2WGQkD3zX4567+w1+1f4cyNZ+H+uW+3ruhB/kTXlur/Bf416Ahh1Lw3qkAHUNbt/QUAf6o3/BK39vrxveafYfDb43/ABl8FfFfTIYxHa+I9JluUu2x0+0+ekSZx/cT0r+iHTvF/h7WCh0i8gulk5UxSowP5Emv8IKx0/4kaRD5Nta6hZsO6pMhH5ACv6R/+DcCT9sv41f8FBPCfgfTfGOu2vhXQmGpazb5Jja2GY9reYp43Fe9AH+q7RVSzUrCoJJ4HX24q3QAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAf/Q/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoopCcDNAHjH7QPj7S/hn8GvE3jzVmCQaTps9wzE4A+UqP1Nf5hf8AwQR/Y+1b/gol/wAFVNQ+NvjuE3Ph3whqMuvagZBuimcP5QiJ9cOrfhX94H/Be34zj4P/APBL/wCKN5YELqOq6b/Z9oM4ZpXkjOB74zX55f8ABIH4AeDP+CQ//BIXV/2nPipElhrmtaa/iLV2cbZI2fESxHPuFagD89/+Din/AILq/Hf9kP8AaO0P9m79jfxKdEm8P23ma49uRgzqWUQnIPGwo1fg14e/4Omf+CoeiBRe+JrfUNvXzy3P12gV+FP7V/x68V/tNftB+K/jr40nNxqPiXUJLuRySeOFA/75UV8672oA/rQ0T/g77/4KM6KoF3pegajj/nsZ+fyYV9NfBj/g8c/bG8TeO9F8K+M/h74Xltr+8it5ZUa53qrnGRmXGa/iVLE8V2Hw+nks/G2kXsZwYbyB/wAnFAH+9L4V1OPXvDNhrKqqreW8c21eg3qDj9a12tYn+8oNfjV4m/bim/Z9uP2cdP8AFNykGhfEx4NFkmkOESfyZZQT+EYFfsrZTrcW6yBg+QDke/I/SgBn2C2znYPzNTxwRR/dUCpqKAKk1nFN94A/gKypfDunTf6yND9UU/0roKKAOTbwX4dkP76zgf8A3oYz/SqV98M/h7qUXlX+h2Ew6fNbp/hXc0UAfOmtfsq/s8a+GXVfBmkThuu6DH8qt/Cv9mP4EfBnX7rxL8MfCunaFfXkflzTWcZV3TIODknjIr6AooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKRiAOaWigD8Nv+Cr3wEvf2zfiP8ABv8AZkEUjaHN4iXWPEO0fKdPSKVAD7eaEr8EP+Duf9ui2+GPwj8KfsHfDm7+zz6xGt5q0cbYK2aB4hEwH+2qtiv7VPivrfgf4YaBq3xp8VmG2XRtOkaa5l42QKdwGe3zYr/F2/4Kfftg+JP23P2zfG/x41qeRrbVNQkFjCxysNsuF2r14LKT+NAH58yyGRix781FRRQAV1HhJxFrdtMf4JYm/JxXL1raRP5F2knoyn8mBoA/0Pv+C5ev6k3/AARY/Zy+N+i3Dw32hahb31vPGfmR0ilXIP0yK/qM/wCCWn7YPh79tr9irwP8ctJuEe71DT40vo1OWiuUyu1uvJUA/jX8s/8AwUajh+JH/Br/APCvxN/rDp+lrcFuuDukX+tfOv8AwZ7ft3xeG/Hni79ibxZfeXaasV1PR1lbj7R+7i8tB/uhmoA/0OqKjikEihh35qSgAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9L+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACkY4FLVS8aRYGMSljg8DrxQB/Jz/wAHXX/BQSb9m79jmP8AZx8F3hj174lbradY2AeOwwzb/pvjx+Nf5cFzMZpWkOeSTzX9k3/Bev8AYG/4K6ft1/tv+JPinonwg1zUvCGjyNYaDJEYSps+H3Aeb3YtX88Pib/glT/wUJ8FBv8AhKfhL4gs9nXdHGcfk5oA/O+ivozxH+yn+0T4VLJrvgvV7Yr13wE4/LNeS3Hw+8b2Upiv9IvICvUPbyD+lAHG1LDu8wbPWtyXw3qsA/fwSJj+9G4/mKpwWskV0iOCOfQj+dAH+hP4ikl+IX/BpFZ3BXzJNH8N59cH7Qf8a/iF/Yd/aX8Tfsl/tV+Df2gfCTvFc+HdTjuWCnG5CChB/wC+s1/c9+wxol98ZP8Ag1s8eeCNMha7ubTRWgjiQbmJEiNgD6V/nd6lZT6ZqDQ3CFGjZgytwQQSKAP93T9n74v+Gfjv8HfDvxd8IXIutN1+xju4JFOQQeD/AOPA17RX8d//AAaPft3yfG39lPUv2WfGF4ZNX+HrAWMZbLHTyF55/wCmkhr+w8cigBaKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//T/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBCQBk0tfE3/BQ/42+Lv2cP2OPHvxz8CDzNT8LacL+GM/dfEqKVPf7rGn/sFftnfDr9ub9mzw38fPh7co8er2ytc2wYF7acEgxv1weM9ehoA+1qKAc80UAFFFFABRTd60pPGaAFooJx1ooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACuI+IniC38K+CtV8S3MwgjsLSadmPYKpx+tdvX5g/8ABYr4yQ/AT/gm/wDFr4mC5EE9loTrDzgl2kQYH4GgD/Mw+L3/AAX9/wCCn2mfHLxTqnw5+L+tWGkTapMba0UxGJIl+UKMxk449a6Lwz/wcp/8FR9GZW1nx1/a+Oou0Q5+u1BX4F61qH9o6hLefxSO7n6sxP8AWsje1AH9Tvhf/g6+/bt8PBf7a8OeGNcx1+1QuSf++SK9ei/4OvPGni2EQfEz4A+B9S3ffZIZwzf+RRX8gZYnrQDigD+wGP8A4OB/2C/GZz8W/wBlLQbvf9/7MrjPr1uRWvD/AMFZv+DeLxoFg+If7IktnKes1ptyCfTddV/HRuP+f/10m45zQB/pq/8ABMj/AILkf8Ea/CMOm/slfA3w9efD/RPEF3sWLUjGbVZHUrhtryHBAxX4/f8ABxp/wQiT4NX99+3H+x7pxvPBequbrWdOs13Lp5YZ81P+mRG0dSdzV/F/YaxfaZcpd2cjI8bBlIOCCOnNf3x/8G+H/Bczw18YvC1t/wAE8v2476K7F5B9g0TUNQO5LqNv+XeX/a+8wwB0HNAH81n/AAQq/bdv/wBhf/goL4Q8Z31z9m0HWLlNL1kZIDWzZbn/AIGFr/Y58P6nbazpNvqlk2+G4jWRGByGVwCD+tf5cH/BfH/ghz4h/YY+JEv7UP7N1rJc/DjWrn7S0cK5XSZeWCnA/wBX8oPVjlq/tP8A+DeX9uyD9tf/AIJ8+GZ9YuRceJPB8S6Pq53ZYzLmQMf+AsooA/eqikByM0tABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/Pz/AIKgaEfFH7BfxV8P4z9p0CRcD2kU/wBK/wA6r/g3U/4K1z/sD/tSn4EfE29kbwD46u2tpjM37qwuS/Ew9BtQJ369K/06/wBoT4a3nxb+DXib4cWLIk2tafJaI0mdoZzwTjJxX8WPwV/4Nx/2A/2Gol+PX/BS74nWN3JZu9w2niTFiDvLgEeWJs/jQB/dPpWq2mrabBqdm6yQzosiOhypVhkEfhWN4o8beF/B2ly614nv4LC0hQu807hEVR1Jzz+VfxLfth/8Haf7PH7P3h//AIU/+wX4W/4SNtIh+y2uo3bf6AqLwNm2RZPzFfxzftof8Fd/26P269ZuD8ZfHN8+kzOTDpVvJstYVP8ACuAHx9SaAP8AVV8C/wDBXn9kj4z/ALUmm/sq/ALWP+E31yfJv5tMO6309QSN0xcKcZAHy56ivQP2kf8AgrF/wT7/AGSvE114F+P3xP0jw7rlqu6WwnMnnKB67UYfrX8tX/Brh+zppH7Kf7GfxI/4KR/GWNbP+0rV/sU8v/PgoRgwLc/61SK/h+/bv/ad8UftcftUeNvj34okkabxHqclwqs2dkYAQKOvHy5oA/04PiH/AMHR/wDwS18GF20TxbJ4g2dBYkc/TeFrxn4Pf8HWX7Kv7Rv7QPhX9nL4KeBPEWp6x4pvxYW8rmAxhirNuOJAcYU9q/yyo725UbVc1/Wl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Jc2GjzSuJdTUdGkGSBF16MrZHpQB/pAaRq2n65psOraXMlxbzruSSM5Vh6itKvwq/ay/4LJ/sP8A/BOTx94F/ZTS6jvNS1G7j0z7BYSBhpkGGxJMXP3dwC8EnLCv3A0XVoNb02HVLQhoriNJEYHIKuAQf1oA1aKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/9b+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5w/aw+Fx+MX7PHjH4aK+x9a0qa2X/e+8PX0r6PqGeJJoyj9CKAP8Gj42+BvEfwz+KOu+AfFNu9rf6RezW00bjBDbiw4+hFeTbj1r+1f/AIOw/wDglhJ8IPi9F+3H8JNLP9heLZWXXBEnEF7gnzDjouxVH1NfxUujIxDDFAGpY61qOnXAubOZ45B0ZGKsPxUiv1F/ZG/4LN/8FBf2OL21g+FPxD1L+yIMb9MunD20gHY/KXx9Gr8o6UEjpQB/fZ+yl/webXkS2mmftbfDsSBcRve6E3zH1ZvPl/kK/oQ/Z+/4OSP+CWHxs8q31H4h23he8uANttqpIfJ7fu1YfrX+QIrFcYq2L6cSLJuJK/h/KgD/AHYfhd+1X+z18YtPXVPhr4x0nWYXGVa3nAyD7PtNe52Gs2OojfbSK49VZWH6E1/gyeHPit8QvCOox6j4X1q906WM5VoJ3GPwJxX6E/B//gs//wAFLPgZcwL8O/i7rlrbxY/cO8bIQOxyhNAH+0+l3C77AwJqwXAOK/yr/hT/AMHav/BSb4bpEPEzaX4sCY3HUDLubHr5ZSv0u+Gn/B6N4xlSN/i38KLVyPvtpjNz9PMmoA/0I88ZpN61/Gt8M/8Ag8u/Yj8RItj448D+ItFl4Bk3W+wf+RGN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HwB8YXgj0H4lqLKNZGxHHe5Db/rsjxQB/qdg5GaWq9tOs8SuMHIzx71YoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9f+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAoIzxRRQB8/wD7TX7Ofw1/ao+DGu/A/wCLOnx6lomvWzW88Ui5wGwQw6YIIFf5Qn/BYH/ghN+0R/wTc+IN54h0WxuPEfw5vZXaw1iBN3kqckRz4C4cYJ+VcYxzmv8AX7IzxXFeOvh94P8AiP4duvCnjbToNU068jMc9vcIGR1PUH/62KAP8ESa2lgO2QEH3FQEEcGv9Nj/AIKM/wDBpd+zr8fNQvviD+yJqCfD7W7jcw01l/4lzueeyySfqK/ik/bK/wCCIv8AwUG/Yt1O6k+IvgO+vdFt8hNXsED20gHcAtv/APHaAPyBora1DQdV0qQW+oQSQyZwUkQowP4gVkvE6NtcYNAEdFO2k02gApdzDvSUUAFFFFAE8dzcw/6mRl+hIq/Fr2uw/wCpvZ0/3ZGH9ayaKAOkTxl4vj/1eq3i/Sdx/WrcfxB8ewkNFrd+uPS5k/8Aiq5CigD02L4yfFWGQSR+JNSBXkEXL/41buvjl8X7xBHceJ9TcDnBuH/xryeigDt7n4lfEO6kMs+vagzHqTcyf/FVRfxx41l/1msXzfW4kP8A7NXLUUAbknifxJL/AK3ULlvrMx/rVCXUtRn/ANfPI/8AvOT/ADqntJGaUKSM0AISScmkqwltK8fmKpIHeuk0XwV4m8RzxW2gWNxeyyttVIImdifwGKAOVBboDRtY1+u/7Nf/AAQ+/wCCk37Tt5b3HgL4YarFpc+M392iLAoPc4fdj8K/pO/ZT/4MzPGGpi11X9rL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/bx1K5ltPE3xO8QSSKxVleRAQRwc4Ud6AP7c/Cn/AAZ6fsi+GNQi1e6+NutW9xC4dZIJ7RGVh0IPljkV/Sj8Evg78GPgb+ziv7OHxo+JSfEbSreH7KLjxFNA8zwY+4/lKgxn0Ga/xztb/a3/AGkPEBLat421ict13T4/livKtS+K3xK1eQvqOv6hNnruuH/xoA/0cP2k/wBon/gkb/wQVufEvi79k/RdM8Q/FTxm/m2VpAd6WCMyjDHcMRZUngltx9K/qZ/Yo+Nms/tEfsueB/jVrqRR3XiTS1vZVizsDM7LgZyccV/hsnxBqV/eLdajcSTONo3SOXPBz1Ymv9nT/gh14hi8Vf8ABKb4Jayrb2fw8qsfcTSUAfrBRRRQAUUUUAFY2vaHpniLSbjRdYgS5tbmNo5YpBlHVuoI9K2aKAP893/gqV/wSq8d/wDBJv8AbV8Of8FQ/wBi/T55PBlhrC3+r6baLxpocMjYHH7rkHqTuPpX93vwC+Lnhv45/CDw98WfCdwLnT9eso7uFwcgg8H/AMeBrrPiF8PPCvxN8J33gvxlZx32m6jC0FxBKu5JEbsf518ufsV/ss3P7IXgm++DPh/UpLzwnY3bPoUEnW0tWAPk9BxvLN369aAPtyiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEKg8007U5NEkiRIXc4Ar+bH/gtF/wAHBfwc/wCCbulTfDL4bpB4s+JFzGypZK+YrE84e4wynt/CT1FAH9AXxK+MXw3+EXhu58XfEjWrTRdOtEMktxdSBUVR3xyx/AV+B3x0/wCDn/8A4Jf/AAf8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pd6VxHd2hPDqeOjZXoOlf1Jf8GgviXWIfC3xw8PaHMYriGxa+ix2ZPJ5/IYr+jj/AIL+/wDBJ7RP+CjP7LN5qXg2yRPiB4Tie70edV+ebaDmBjz8vzM3rnvX8x3/AAaJx614A/af+N3wl8V2r2V9D4dnjmgkGGWRZI1IIoA/t5/4Jv8A7X+jftl/sxaH8VLW4WXUhvtdSjByYrlHb5W9DtAP41+gNfwif8G3H7Ztj8KP26fjP+wb4ouvs9tq2sy6jpSOcD7UfLTYo/3Axr+7aKQSKGHfmgCWiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//U/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigCnetGsDeYcAj+XNf5A3/ByF8fpPjX/AMFUfiNZRymaz8M3R0u2bOQE2pJx+LGv9dbx1dx6b4U1HVZXEaWttNKSe21DX+HB+2n8R3+K/wC1L48+IE7+a+qazNKX652gJ/SgD5WJyc0lFKpAOTQB9dfsJ/BWf9of9rf4f/BqyQySa/rENvtAzkKDIf8A0Gv9wb4d+HrHwn4M0vwxp8KwQ6faxW6IowAFUf1r/K2/4NT/ANnyL4zf8FMtK8aSQeYngS0GrliMgNv8r+T1/q8WwkEKiXrjmgCxRRRQAUUUUAFFFFABRRRQAUUUUAFFFRyyCNCxGaAMLxN4o0Hwhotz4h8SXcVlY2kZlmnlbaiIvUk+lfxVf8FP/wDg7X8DfBTxRqHwn/Yg0m28W39mzQza3dFvsYYf88djq+Qf7y4618k/8HVP/BY3X77xfP8A8E//AIBau9lZaeCPFFxbPh5pef8ARyf7uCj9jnvX8Hlz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BV78KvixYRrfojPpepqo8+ynxw6H8SOQetAH2/8ACf4keFvi18PNH+Ivgy7ivdM1i1S6tpojlWR/f2ORXo9fzNf8EPfFfx6/Y/17xB/wS6/a2Ei6n4MYzeEtRb/U6npOVUGInk/vGfggH5TxX9MaOHUMO9ADqKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqlf2UN/bPbTruVwQQfQ9au0UAfh98K/2Zbr9g39vnWvF3wytpo/h38Z5fMvLOMARWGs8fOBxhDDCB3OWr9ureQyRBiME9RVLU9G07V1RdQiWURtvUMOh9RWkqKgwoxQA6iiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP/9f+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAP5Ff+DxOdrf/gnl4bQHHm+JCD/4DvX+X1c/61vrX+nd/wAHlcxj/wCCf/gyPH3/ABOf/SaSv8w+blifegCCv0W/4JQ+CYviZ/wUO+EngN13jUPEEakY7LG7f0r86lGTiv3i/wCDcPwAnjD/AIK1/Ca8mj3x6ZqIu246DZIv9aAP9fbw9aGy02K2PRERR/wFQK36gt3R4lZBwRU9ABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRSEgcmgBScc0gYGvnT9pT9qf4IfsnfDTUPit8dPENpoGj6fG0jzXD4zjsoAJJP0r8Xf8AgmR/wXQm/wCCmH7Vviz4X/Cj4eXsfgPQYi0PiB9vLblH7wiQjBDZ+Vc9KAP6LqKYjF1DEY+tPoAKKKKAKV+M2zj2/rX+VH/wdf6I2j/8FMb+6dcfbtOMw9/3mP6V/qxzR+ZGV9RX+Y5/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+On7N/gLwZ8QPi1pMmkWvjmy+36Yky7ZJINzpuI57oa+SSMV/f3/AMHl3w30/QfC3wf8T6fbR29vak6bGsY2qqqszhR7V/AK/WgB8UjRuGHbmv8ATF/4M0fiYfEX7E3jnwPfNmTRfES+WCeiG3j/AKmv8zdOtf31f8GXXjzdq3xY+GUb/wDLJdRC/jDHmgD/AECxjtS01OlOoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigBrEAZNfw4/8Hdv/BSf4o/BTSfDX7F3ws1KTSovFVk1/rE9s22SW33vH5JPpuVW4H41/cc6hlINf55X/B5t+y14yufib8PP2o9MspX0T+z20i7mVcrHN5ksvzEdPlxQB/Cbe6hcXsrzTOWLncSTk5+tU/Mb/Jp0kTRttPWoypHWgCSKZ4m3IcVI91O7BmYnH4VWooA1J9Wu57b7K7sUznG5iPyPFZdFFAADiv1o/wCCdH/BYH9qX/gmtomt6D8BZ7VbTXZxcXMdzuwzhVX+H2UV+S9OBYDIoA/r48M/8Hjv/BQLQGVNU8K+G9TUdTIbjJ/JxXsEf/B6f+2KI1DfDPwwTjn5rn/49X8U4BalIZaAP7RtU/4PSv20pkC2Hw38MRHHUm5/+O14zr3/AAeG/wDBQ/XQ62Ph/wAO6bu6GI3GR+bmv5J1tJ5F3KpIq1Y6VeXzlLdGZumApY/oKAP6PvGf/B0h/wAFSfEwf+yvFsWj7un2Qnj6bga+QvHn/Bfj/grR49Yw6j8aNcihbqkJiAx+Mdfm98Ov2cvjj8VdVXRvh94W1PV53OFW3gIyT7sAP1r9a/2fv+DdP/gqb8dHjuW+Gt74esJyNt3qgUR4Pf8Adux/SgD89/HH/BQz9s34kKw8bfEnXdQMn3vMlUZz/uqK+bp/GPj/AMQ3xbVNQvb2WY5/eSyOSfoDX9v37Nf/AAZh+Obxba8/ae+JNvZwy4aS20VW81R3B86IjP41/ST+yR/wbpf8E0f2VvJ1GDwTB4r1i1A8vUdYXMoYdwI2Vf8Ax2gD/MT/AGUv+CXP7dP7bGuQw/A/wFqmpWsrhZL5k2wRKf4m3sGx9Aa/sd/YE/4M+fC3hy40/wAdftxeKBrVxFtm/sTTV/cH1SbzEVv++Wr+4rwz4G8K+D9Ni0jwvp9vp9rCgRIreMIoA7cDNdYqKo2gYFAHzl+zz+yb+z9+yx4Mt/APwG8K2HhrS7YALDaR4zgd2Ys3619HKoRdqjpTqgnk8uMvjOBmgD8PP+C/P7fEP7B/7AviXxJo10LbxN4lifStG5wfPYbyw7/cDCv8evxBq97rur3OrajJ5s9xI0kjkklmc5JP51/YD/wd7ftg3HxU/a70X9m7w9cZ0zwJan7XEGyPtpZ+SM9djiv45WznmgC7YRTS3CrCMnIx+PFf7CH/AAbrfs72nwF/4Ja/DbdGsOoeIrIapegDBMpZ4+fwUV/kI+A4GvvF+maai7jc3UEePq4r/cv/AGQ/AVv8N/2bPBHguzQRx6fo8ESqOMZ+b+tAH0wBgYpaKKACiiigAooooAKxtc0/+09NmsmPyyo6H6MpH9a2ahnjEsZU9xQB/imf8FiPgdcfs8f8FG/iv8MPs5htrLW3a3OMBo2jQ5H4k1+YFf2K/wDB4P8As3H4dftqeHPjRokKiz8Z6WXuZAOt0JXGCfXYgr+Ots55oAFzniv7C/8Agz2+NuleCf23vE3wx8QxxEeKtHCWjOBuE4mQ/KT/ALKmv486/U7/AII0fHyT9nD/AIKQfCn4mz3HkWVrrKR3WTgGJkcYP/AiKAP9qK3kWSNXXoRVisfRL9NS02G9ixslRHUj0ZQf61sUAFFFFABRRRQAUUUUAFMdwilicYp9fPX7VHx68J/syfAHxV8c/G03kab4asJLuViQOmFA/wC+iKAP5L/+Drr/AIKuX/wQ+GEH7EXwa1QRa54tgZ9dkibDQWWWHl8dG3qp+hr/ADZbm4e5maWU8sST+NfWf7cX7U3jj9sX9prxb8f/AB5ctPd+Ib+SdVY5EcfChR7fKDXyTEjSuFXqaAP3O/4N8v2IF/bY/wCCh3hTQtZtjdeHvDEyatq6bcqYFygB/wCBMpr/AGDtG0+20vT4bG0Ty44kVFUDAAUYA/Sv4o/+DNv9ltfCn7P3jf8AaY1yBYr7xFfLp9m+OTabI5OD6b1Nf24qMCgBaKKKACiiigApjyJGpZzgCn1+eP8AwU1/bp8D/wDBP79k3xP8fPFU0Ru7C2ddOtGbD3V0cYReRyAS3UdKAPw7/wCDin/guJqf7Fnhy3/Zg/Ze1IL8SNeC/aL2BgZNMiL4BHbzNwA5BG1q/fX/AIJz+MPjF45/Yq+HXiz4/XBu/F2o6Qk+pTHq8rO3J464x2r/ACDPhz4o+IH/AAUI/wCCiuha58TLmTUdZ8c+JEe4aQ7ieNwUe21BX+018PdHs/D3g7TPD9jCsMNlawwoq9AFQf1oA7aiiigAooooAK8P/aJh8/4HeLIsZ3aVcD/x017hXk/xxt/tHwh8TQ9d2mXA/wDHTQB/hF+PAV8bavGf4b24H/kRq5Ou4+JcXlfEPXE6Yv7gf+PmuHoAcvWv7p/+DPHX9B8EXfxr8deIpUgtNO0ppZZH4VVQwnn8a/hZT71f0Nf8E8/2nNN/Zh/4Jm/tGXFhdeRrnjKH+w9PdWw6ufs8pYfgpFAHxp/wUE+P/jH/AIKO/wDBR7xP410dpb0+Jdc+yaXbr82yH5V2r7ZVjX+sp/wS7/Y38K/sPfsZ+CvgXoUEa3Wn2EbX86jDTXLZbc3TnaQPwr/No/4Nk/2RP+GoP+CmWjeLNbtPtmmeAca1dbxlGJPl4P4yA1/rPWcKQwKiIEwBwPbj+VAFuiiigAooooAKzNVs4L6zkt7hd6OpUqe4YYI/KtOmt04oA/x+f+DjD9jW2/ZC/wCCkXi200aE2ui+LpG1nTYguFWI4jIX/gSk1+CBxniv7/f+D0j4Q2yR/Cr47TRDzSzaO8mOo/fTYzX8AbEE8UAWrJA9wgPc1/re/wDBsT4pudd/4JT+AtOnfI01BbKPQZZv61/khWTBLhGPr/Sv9bb/AINhfDc+i/8ABKrwJfyoVGoAXCk9x8y5/SgD+jRThcmvzH/4K6/te237Fn7BnxB+NUNwI9Ts9Nki05M4L3DlRge+0mv02/gr+HT/AIPMv2hrzRfgn8O/2etMnMEmsXzaldKp5eHZLHg+24CgD/PC8a+KNV8Y+J77xPrcjzXl/O880jnLM7knJP04rk6kkZncsxyTTFGTigD6N/ZO+FF98bP2ivBvwt03LS65qsNsFHJIHzn9Fr/cZ+DfgzRvh78M9C8E6FCILXSrGG2jQDAACgn9Sa/yIf8Ag3e+FMHxK/4Kw/CVb+PzbbTdTF5IpHGBHIv8zX+xJZiIQr5IwMDH4cUAW6KKCQOtABWPrurWeh6ZPqmoSrDBAjSO7HCqqjJJNWNR1G1020kvLuRY441LMzHAAHfJ4r+Fr/g45/4OBPD3hXwzq37FH7H+tJe6zfo1rr+sWj/LaJ3hjPHz5CnkEYJ5oA/nJ/4OL/8AgopB+3l+3bqieELoz+FPBG/SNKdDmOZVYyGQfi7L07V/Pmat319dahcvdXbF5JGLMTySTyagjheRgqjJPagBIonlYKgJJ4GK/vN/4NFP+CaGsXfinU/28/ijp7w2dogtPDqzrjfJlX89PbBZf6V+E/8AwRW/4Io/Gb/gpV8YbPXNbtJ9G+G2jzo+qapImBMowfJhyDljkHkYxnnNf60nwP8Ag14C+APwu0T4R/DTTotM0XQbZbW1giXaFRefzJJP40AerRRiNAo7CpaKKAPLfjVph1T4TeJNPUZ83Tbhf/HCa/wl/inYSab8SNespBgxahcKR/wM1/vG+OP3nhTUbf8A56Ws6/nGa/wyv2t9BPhv9pDxtozDabfWJ1x9ef60AfNNW7SISShfcfzqpWrpS7rlfqv/AKEKAP8AZw/4IQ6LFov/AASV+B9oi7f+KfDf+Rpa/XOvy2/4IsJ5H/BLb4JxHjb4dXp/12kr9SaAGOwVck4r+JT/AIO3P+CmUnws+E9h+w78M9RCat4sjM+ueW3Mdlll8s4770U/jX9iPxx+K3hj4KfCvXvip4xuUtNM0Kzku7iRzgBV4HP+8RX+Kf8A8FEv2tfF37bX7X3jP4++J55GGu6hI9rE5ysMC4UIvXglc/jQB5z+yD+zR8QP2v8A9onwz8B/hxam51PxFepbrgEhFOWZj7YBr/aB/YK/Y7+Hf7EP7M3hf4AfD6zSCDRLNI55gMNPNyTI2Op5x+Ffya/8GjH/AATRXwX8P9S/bt+J2mr9u19Ra+HvOTlLb5W85ffcrLX9y4ULHhRgCgD+M/8A4POfAS6x+xL4A8WWwy+meJWDH0X7PL/U1/mgSRmNiD2r/WZ/4OmPht/wnP8AwS58Ua68e/8A4Ryc34OPu8BM/wDj1f5Nt6ytcOV6ZoAqjJOBX9fP/Bnb8TX8Fft++JPClxKFj8ReHxAik4y/no38lr+QZTg5r93f+Dcv4tx/DX/grD8Kra6l8q31nUBYynoCNjvg/iKAP9hO3l86JX9RU9VbQRiFRGcgD+fNWqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAK8G/aN/Zx+Ef7U3wr1T4OfGrRoNc0LVoWimt7hcjnuMEEEYr3mgjPFAH+e1+2l/wZveMP7fvvE/7HHja2k04u0qaXrAbzUB6Inkx4x6Zavwt+I//AAbWf8FZfBdxJFpPwwvNcjjJAksQu1gO43upr/XzeJHXawyPSmRW0MQIRQM0Af4u+of8EK/+Cs+mzmC4+B/iEt7LD/8AHaof8OPf+CsH/RDvEX/fMP8A8dr/AGkXsYHOWA/IU3+z7f0H/fI/woA/xVfiX/wRl/4KZ/Bz4aav8Xvid8Ita0bw9oUH2m+vJxFshiyBubEhOMkdBX5hvG8Z2uMGv9tb/gq94UXxj/wTw+LnhRE3G78PyLgDqRIh/pX+KN4ig+zajLD/AHXcfkxFAGABk4r9sP8AgmT/AMENv2pP+Co3w/1j4ifBK+0zT9N0a9FjPJfiTPmFFfjYD2avxQTlgK/0u/8Agy8tAP2IfiJNIv3vFC4/8BoqAPy38D/8GW/7ULxR3Hjj4n6Bag43LbrPuH/fURFfZfw6/wCDLj4VzSR/8LT+Kuoy4xuXTljwf+/kNf3bbRjAoCKOlAH8rHwy/wCDSj/gm18PZIz4hGreKNmNwvhFtb67AtfqN8I/+CJP/BMT4KWsL+BvhBocV1Hg+fKsjSEjufnIr9YioPWloA8p8IfBX4W+BNNT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a3+z7+xBe/G3xpaPDqPxGulvrYuuGWz2KmPpvjJoA/rJgjMcaqxyQKnpAMUtABRRRQAU1lDDBp1FAH8cP/B1f/wStv8A9pP4KWv7YHwh0s3XifwRCw1NI1y9xYZY546ne4/AV/mYXtpNZ3DwTLtZCQR7iv8AfS8RaDpvibRbrQtYhS4tbuNopYpBlXRhggj0r/MT/wCDhH/ggP4y/ZL8ear+1N+zJpU2o/D3V53ub2ztkydJc9eP+eXA7sdzelAH8h1fd/8AwTy/bu+LX/BPv9pHQ/j18Lrt1+wzKL2z3Yiu7bvE+McZ+bgjkda+GLi2lt3McqlSOxGKg5U0Af7Zf/BPP/gp3+zL/wAFCfg3p/xG+D+vWzag0CnUNKkkAubOY9UcHg9jwT1r9HTfwCLzSRjGeo/xr/B2+Evx2+LPwP8AEUXiv4T+IL3QNRhO5Z7OTawI9jlf0r9AZP8AguN/wVcuNKGhSfG3xCbYLt27oc7f+/VAH+wz8Yv2nPgV8BPCs/jP4weKdP8AD+m2wLSTXco4A9k3H9K/jS/4Knf8HaPgXw7puqfB/wDYGtxrOoSq8DeJZT/o8YP8VvtYNu/30x1r+DT4rftL/Hr476udX+K3inUvEFy33mu5e59l2j9K/UD/AIJK/wDBF79o/wD4KXfFC2axsZ9G8DWUqnUdcnQiIJwSkfBJc5HVSMUAe/f8Ehv+Cen7Qn/BZj9tKX4rfHe9vdR8L6feLfeIdXvPm885H7lOMbuVPQDA65r/AFfvhx8P/Cvww8Gab4E8GWaWGmaVAtvbQRjCxovYD6818+fsX/sY/Bb9iH4JaR8E/gvpUWn6fpsSq8iriSeQdZJD3Y9PTFfXoGOKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA/9f+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKAEYEjAr+cn/g59+DDfFD/glj408Q+V5z+FM6omBkj7sef/Hq/o3r4u/4KEfCA/Hv9jL4j/CKRPNXW9Elh2kZyVZX/wDZaAP8OK7cNOxUYBNf2S/8GYXiw6b+3F8QNCkbAvfDAwPU/aYv8K/j88Y6bJovie90aZDHJaTywsp4IKuRX9Ov/Bph4tHhj/gpVDpwbb/bGlC29M/vQ39KAP8AVTjcOoPrUlUrE7rdD7f1q7QAUUUUAFFFFABRRRQAUUUUAFFFFABRgHrRRQBxvjLwH4T8faHceG/GGnwalY3SFJYLhA6Op6g9/wAq/mp/ba/4NXv+Cf37Tl/d+KfhnbT/AA21aZmlLaSF8iSQ92EgkOPpiv6iKTAoA/zYPjP/AMGZv7V2j3cmo/CD4gaJrFkpPlxXSzeeR77Ygua+MdT/AODUX/gplp8/kW+m6ddDON8Ykx+uK/1aXiR12sARVb+z7b+4PzNAH+XH4H/4NCv+CivjC5SPW9S0PQYywDNcibgf8BVq/Vn9nz/gy/8AC1rfQS/tKfE6W7WIhng0RRtb1B86Hp+Nf3jx2kMZyqgVZ2gHNAH5J/sb/wDBFT/gn3+xZDbah8LfANhLrcGN2q3iF7lyO5G7Z/47X6u2Wm2lhCsFqixogwoUBQB7AcVoAAdKKACiiigAooooAKKKKAKV9p9pqNs9rdxrJG4wysAQQexB4r+ev/gor/wbh/sK/t2XN34z03Tf+EE8WXG6STU9IRV8+Q95Q4cf98qOlf0Q0hANAH+Y1+0D/wAGe/7bXgLUptQ+EXiPSPFuntkxRgSi4x23fIq5+lfDc3/BsX/wVZivTbp4Ad0DY8wY2/X71f64ctvFNjeoP1qL7Fb/ANwfrQB/ln/Cv/g0d/4KM/EK8ii8UT6R4ViJG970S5A/4ArV+7f7IX/BnZ+z58P9UtfFP7Ufi658XXVqVLadZhfsUmOobfGj4+hr+1aOzgjbcqAGrQUCgD5v/Z3/AGS/2fv2VvBkHgH4C+FrDw1pduAqw2iYzj1ZiW/Wvo9VCjAp1FABRRRQBUu7O3vIWguEDqwwQwyCPoa/GX9ub/ghJ/wT+/bra41vx94Rg0fxFck7tZ0xAtzz6hiU6/7NftLRQB/BJ8U/+DLzwyb+UfBv4qzxW5YlE1RRkD0/dQ141pX/AAZc/FdLzdrnxY0wW+f+WKyb8fjDiv8AQ+KjOaNooA/jJ/Z3/wCDOj9kTwRqEXiL40+MNW8VyxEFrNViFs2Ox/do2Pxr+mH9lz/gnx+yN+xzoCaB+z14G0zw4gQK8sEZaVyO5LlsH6Yr7WCgDFLQBFHEiDCgD6VLRRQAhAIwa/Pr9v7/AIJtfsz/APBRP4UzfDP49aJHdSKp+w6iij7TZSH+OMnjPJHzAjmv0GpCAeDQB/mIftp/8GjX7Ynwi1i71z9mW/t/iBorsxtrVQwvlXsH+WOPP0Nfin4g/wCCIn/BVDwvqUmmat8FPEKyIxX5VhIP/kSv9pV7eKRgzgEiqk2mW8z72Uf98igD/HF+E/8Awb7/APBWD4nagsEHwf1fT7csA094Iwij1O2Qn9K/d79kr/gzc+NHie5ttd/as8bWug6dKyl7HSw32sDuD5sbJ+tf6McdnDHGYwowe2MfyqaKGOJdqAAUAflR+wl/wRy/Ye/YD0aBfg54QtZNbVQs2s3abryUjuednbsor9VILeKBAiAAD2qwAB0ooAKY5CoSafVW7bbA30oA/wAeb/g410pdP/4K7/GJ04Euq7//ACFGK/Cxhg4r+gn/AIOW7E2v/BWf4nykY866L/8AjqCv59n+9QAgGa/tN/4Ms7MN+2d8Sbo/w+GFH/kzFX8Wa9a/tm/4MrYUb9rj4nynqPDS4/8AAiGgD/SPUYGKWiigBMDOaaUU8Hmn0UAMVFXoMUu0U6igAooooAKKKKACiiigAooooAKCM8UUUAVLqygu4zFMoZWGCCM8fjxX5iftj/8ABH/9gz9tq3nuvjR4B0+51d1Kx6nBGUuYye4wwTP1FfqNQQD1oA/gz/aS/wCDMPwjfXV3efswfEmayacl47XW1Hlp6KPJiJx+Nfij8Yf+DUr/AIKb/DFnh8LaTZeMQhOG0wPlh/202V/q87QTmq32OAv5hQZoA/xk/GP/AAQX/wCCs/g69NtqHwS151H8cQhIP/kWuCT/AIIwf8FQZZPs8fwV8RFx1GyH/wCOV/tUzWkM33gD+ANUxpFqG3bR/wB8r/hQB/j3/Cr/AIN0v+Cs/wARJ4hc/CbUtIt5T/rr0R7FHqdshP6V+yP7OH/Bm3+0r4nkh1n9oLxzpnh6xkI32tksn2oDv9+Nlz+Nf6Rn2WLy/KIBHp0/lUkcKRLtQYFAH8637F3/AAbO/wDBOH9k54NX13w+fH2s2wV473W1BKSDuoi2D8xX9APhfwT4X8G6VFonhiwgsLSFAkcMCBEUDpjHP511gAHIpaAEAA6UtFFABTWUMMHvTqKAP4jP+Ds//glt40+OPhPRP20/gzo76hqHhqBrPW4bZd0jWmXfziO/zMq/0r/OiuPCur210bKe3kSRSQVMbBs/TFf74Gp6ZY6xZSafqMSzQygq6OoZWB7EHivg3Xf+CXv7A/iXxUfG2ufCrQLnVS/m/aGjkDb/AFwHA/SgD/NF/wCCIP8AwQ2+Nf8AwUF+MOmePPH+lXGifDLSJ0mv7+4j2i7C4PkxAgnPIPzADAPNf6wnw68A+F/hj4M03wH4NtEsdM0q3S3toIxhURR0A+vNXfCPgvwx4H0aHQPCdjBp1lbqFigt0CIoHoB/WurAxxQAUUUUAFFFFABRRRQAVznifwroHjDRrnw/4ktIr6yu0Mc0MyhkdD1BB7V0dFAH8U//AAU9/wCDTD4YfHbxHqXxZ/Ys1WDwZqt4Wlk0WdT9gZj/AM89qPJk+7Yr+Q748/8ABv8Af8FSvgZrctpffCvVNXsYyQt7p6oYXA7je4b9K/2R2QMCD3qjPp1tPD5LKMemAf50Af4klv8A8Es/2/rqf7Lb/CfxA0vTb5cfX/vuvsf4Bf8ABuz/AMFUfjZqccU3wwv/AA9YysB9s1MIIlB7ny3Y/pX+wCvhnTFbcIkz/wBc0/wrVSwgSLytowO2MfyoA/iN/wCCe/8AwaCfC34Z6vYeP/21/ECeLry1Kyf2NYqfsLEfwy70R/8Avlq/sx+FPwf+HPwV8G2PgD4YaPbaJo+nRiK3tbVNqIo/Mn8Sa9NCqvA6U6gAAxxRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKxPEFg2qaTcaf1WeOSMj2dSP61t1BcRmSJlU4JFAH+JX/wAFYPgrL+z3/wAFCfir8KDbmCLS9ckEXGAUZEbI9stX3B/wbXeMV8O/8FafhbYNJsXUr37Kc9/kdsfpX3b/AMHeP7Nn/Cqv28tL+Lmkwg2vjrTDdTSqODcCRlwT67Ur8V/+CM3itvAv/BTr4M+LBIY1tfEKbj7GKQf1oA/2r7eLyolX0FT1k6Rdfa7RJc5yqn81BrWoAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqne/8e7/AE/rVyqOof8AHs/0/rQB/kp/8HQFh9l/4KpeN5sf68F//QR/Sv5w3+9X9N3/AAdSWYtv+CnmvygY860L/wDjwFfzIv8AeoAF61/bj/wZVQt/w1f8UZuy+G1/9KIa/iOXrX9w3/BlbDt/aX+Ktxjp4eVc/wDbxDQB/o4UUDkZooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKRsY5paKAP44f+Dwr9mwfEL9jPwz8a9DgJvPB2qMbmQDpamJ+p9N7iv8879jzxZ/wr/9p/wN4mEmw2OtQPu9M8f1r/ZC/wCCpv7OVr+1T+wb8TPgrJbLNPq+jSC3JGSsqMrZHvha/wAWiy0248IfE2Kym3Q3Gl6giuDwVaOUD+VAH+7t4GkFz4V0+9U5Wa2hcH1ygrrq+Yf2PPHK/EP9mbwN4wjfeL/R4JN3XOPl/pX09QAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABVK/GbZx7f1q7VO9/1D/SgD/Ki/4OvrcW//AAUx1Bsf6zTS3/kTFfy5P96v6qP+DteDyP8AgpOz/wDPTSC3/kU1/Ku/3qABetf3Q/8ABltZsnxw+LGodhoyp/5GhNfwvpycV/en/wAGXmngeMvizquP+XRYs/8AAoTQB/oQL0p1NTpTqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//S/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAydZsoL+wltLgZSRGVh6hhtP86/xz/wDgux+yfdfsf/8ABSrx54ctIDbaPql+dT0vC4DQHaDj/gYav9kVhkYr+Hr/AIPEP2L38WfCnwd+2H4as/tN34clbTdUZF5WzxJJvY+m9lFAH9EX/BD/AOIFp8TP+CWnwZ8UpL5ksmgrHIc8hhLJ/QV+slfzCf8ABqZ8UW+If/BMbSPD6Pv/AOEWvRp5H90bPMx/49X9PSjAxQAtFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAVTvf8AUP8ASrlU73/UP9KAP8tT/g7qXH/BR61OMZ0M/wDo5q/lAf71f1l/8Hef/KRnT/8AsAn/ANHtX8mj/eoAVODmv9Bf/gy90gt4Z+LOuhf+XhYc/wDAYWr/AD5hnPFf6Of/AAZY6FI/7NHxT8QsnEniBYgf+2EJoA/uBThcU+mqMCnUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB/9P+/iiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAr5U/bS/Zg8Nfth/s0eLv2ePFgj+y+JrBrXe4yI3LBg3Q9MV9V0UAfjP8A8EW/+CWEn/BK39n/AFb4TXXiZvEV1reonULgoMQRPtCBY8orY2qOvfNfsxSAYpaACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKp3v+of6Vcqne/wCof6UAf5c//B33Gsf/AAUW0ph/F4fJP/f9q/ktf71f1r/8Hf8A/wApFdI/7F4/+j2r+Sh/vUATW6b5FX1Nf6e3/BnF4Xj8P/8ABP7xVq7JhtU8SCQH1H2dB/Sv8w6xIFwhPr/Sv9Yj/g1i8HP4a/4JeeGtU2bBrFwLrP8AeG0rn9KAP6YgcjNLTU+7TqACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqne/6h/pVyqd7/qH+lAH+XZ/wd/8A/KRXSP8AsXj/AOj2r+Sh/vV/Wv8A8Hf/APykV0j/ALF4/wDo9q/kof71AE9tC8soWPrkfqcV/so/8G//AIBTwN/wSV+C9nIu2afRRO49zLIK/wAcvwpAt1rdtat/y1liQf8AAnAr/br/AOCcPghvhv8AsSfDLwRs8safoMSbfTLs39aAPuYDAxS0UUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqne/6h/pVyqd7/qH+lAH+XZ/wd/8A/KRXSP8AsXj/AOj2r+Sh/vV/Wv8A8Hf/APykV0j/ALF4/wDo9q/kob71AHt37Ongi4+IPxw8KeD7VSz6hqkEQA74Ib+lf7o3wr0ez8P/AA80TQbNdqWdjBEB9EBr/Gg/4IpfDS7+Ln/BTz4O+Ckh82GfXleUYyAixSdfxFf7Ruk2QsbRIB0VVH/fIAoA1KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooA//W/v4ooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACqd7/qH+lXKp3v+of6UAf5dn/B3/wD8pFdI/wCxeP8A6Pav5KicPmv61f8Ag7//AOUiukf9i8f/AEe1fyVfx80Af1L/APBpn8IP+Fm/8FKbfxV5O9fB+mjUd+M7W8wR/wDs9f6qdojpCofriv4DP+DLb4QMG+Kvx3hi4wujJIR/1xmxmv7+16c0AOooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD//1/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqne/6h/pVyqd7/qH+lAH+XZ/wd/8A/KRXSP8AsXj/AOj2r+TGAxidRJ0zzX9Z3/B3/wD8pFdI/wCxeP8A6Pav5YPh74evvFnjXTPDGmwNcT6hdRW6IoySWYf0oA/1U/8Ag1Z+Ac3wd/4Jj6J4uaDyn8cXI1ZiRgsu3yv/AGSv6alJIya+Rv2FPgvD+z3+yR8P/g5aII49A0eK32AYwWJc/wDoVfXVABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqne/6h/pVyqd7/qH+lAH+XZ/wd/8A/KRXSP8AsXj/AOj2r82P+CA/7Lt1+1B/wUv+HWgXMH2jSdHvl1LURjIEKqyc+24iv0o/4O/iP+Hi+jg9/Dx/9HtX6Y/8GZP7JzRWfxD/AGuNWstvmldDsXkHVf3U25f1FAH97WlW0FpZxwW4wiqoA9lGP6Vp01VCjGKdQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQB//0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAqpeAmBwPSrdFAH+ZP/wAHY3wp8dfED/gpBoMfhjSru8EmhrGrwRM6hmuWHUDHev7f/wDgjP8Ash2n7Gf/AAT9+HvwluLYw6sunJc6kxGGe5YtyffaQK/TjU/CPhbWbkXmr6bbXMyjAeWJXYD6kE1vRxpFGIowAqjAA4FADwMDFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFABRRRQAUUUUAFFFFAH//0v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/1/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0P7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0f7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0v7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/0/7+KKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigAooooAKKKKACiiigD/2Q==" alt="Filapen">
    <div class="logo-sep"></div>
    <span class="logo-lbl">Creator Hub</span>
  </div>
  <div class="nav-s">
    <div class="nav-l">Navigation</div>
    <div class="ni on" id="ni-dashboard"><span class="ni-ico">⊞</span>Dashboard</div>
    <div class="ni" id="ni-creators"><span class="ni-ico">★</span>Creator<span class="ni-bdg" id="bdg-c">5</span></div>
    <div class="ni" id="ni-produkte"><span class="ni-ico">◈</span>Produkte</div>
    <div class="ni" id="ni-projekte"><span class="ni-ico">▤</span>Projekte<span class="ni-bdg" id="bdg-p">1</span></div>
    <div class="ni" id="ni-kategorien"><span class="ni-ico">◫</span>Kategorien</div>
  </div>
  <div class="nav-s">
    <div class="nav-l">Verwaltung</div>
    <div class="ni" id="ni-team"><span class="ni-ico">👥</span>Team</div>
    <div class="ni" id="ni-content-hub"><span class="ni-ico">📚</span>Content Hub</div>
    <div class="ni" id="ni-c-invite"><span class="ni-ico">✉️</span>Creator einladen</div>
    <div class="ni" id="ni-einst"><span class="ni-ico">⚙</span>Einstellungen</div>
  </div>
  <div class="sb-foot">
    <div class="user-r" id="user-btn">
      <div class="av" id="sb-av">AD</div>
      <div><div style="font-size:11px;font-weight:500" id="sb-name">Admin</div><div style="font-size:9px;color:#aaa">Administrator</div></div>
    </div>
    <button id="logout-btn" style="width:calc(100% - 24px);margin:6px 12px 12px;background:transparent;border:1px solid var(--bdr);border-radius:8px;padding:7px 0;font-size:12px;color:var(--muted);cursor:pointer;font-family:inherit">⏻ Abmelden</button>
  </div>
</div>

<!-- MAIN -->
<div class="main">
<div class="topbar">
  <button class="menu-toggle" id="menu-toggle">☰</button>
  <div class="tb-t" id="tb-t">Dashboard</div>
  <div class="sw"><span class="s-ico">🔍</span><input type="text" id="search-inp" placeholder="Dateien, Creator suchen..." readonly onclick="openSearch()"></div>
  <div class="tb-r">
    <div style="position:relative">
      <button class="btn" id="fp-btn">⚙ Filter</button>
      <div class="fp" id="fp-panel">
        <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:8px"><strong style="font-size:11px">Filter</strong><span style="font-size:10px;color:var(--blue);cursor:pointer" id="fp-reset">Reset</span></div>
        <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin-bottom:3px">Produkt</div><div id="fp-prods"></div>
        <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin:6px 0 3px">Tags</div><div id="fp-tags"></div>
        <div style="font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;margin:6px 0 3px">Creator</div>
        <input class="fi" id="fp-cs" placeholder="Name..." style="margin-bottom:3px;font-size:11px">
        <div id="fp-cr" style="max-height:80px;overflow-y:auto"></div>
        <div style="display:flex;gap:5px;margin-top:8px;padding-top:7px;border-top:1px solid var(--bdr);justify-content:flex-end">
          <button class="btn" id="fp-close">Schließen</button>
          <button class="btn btn-p" id="fp-apply">Anwenden</button>
        </div>
      </div>
    </div>
    <div id="tb-action"></div>
  </div>
</div>

<div class="content">

<!-- DASHBOARD -->
<div class="pg on" id="pg-dashboard">
  <div class="ph"><div><div class="ph-t">Dashboard</div><div style="font-size:11px;color:var(--muted);margin-top:2px">Übersicht aller Aktivitäten</div></div></div>
  <div class="stat-row" style="grid-template-columns:repeat(4,1fr)" id="d-stats"></div>
  <div id="af-row"></div>
  <div style="font-size:11px;font-weight:600;color:var(--muted);margin-bottom:8px">Neueste Creator</div>
  <div class="cl" id="d-creators"></div>
</div>

<!-- CREATORS -->
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

<!-- PRODUKTE -->
<div class="pg" id="pg-produkte">
  <div class="ph"><div class="ph-t">Produkte</div><button class="btn btn-p" id="btn-add-p">+ Produkt</button></div>
  <div class="pg-grid" id="p-grid"></div>
</div>

<!-- PROJEKTE -->
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

<!-- KATEGORIEN -->
<div class="pg" id="pg-kategorien">
  <div id="k-lv">
    <div class="ph"><div class="ph-t">Kategorien</div><button class="btn btn-p" id="btn-add-k">+ Kategorie</button></div>
    <div class="fg-grid" id="k-grid"></div>
  </div>
  <div id="k-dv" style="display:none">
    <button class="bk" id="bk-k">← Zurück</button>
    <div class="ph" id="k-dhdr"></div>
    <div style="display:flex;gap:5px;margin-bottom:10px;flex-wrap:wrap;align-items:center">
      <input class="fi" style="max-width:180px;font-size:11px" placeholder="Suche..." id="k-si">
      <div id="k-chips"></div>
    </div>
    <div class="fg-grid" id="k-fg"></div>
  </div>
</div>

<!-- TEAM -->
<div class="pg" id="pg-team">
  <div class="ph"><div class="ph-t">Team</div><button class="btn btn-p" id="btn-invite">+ Einladen</button></div>
  <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
    <div class="sc"><div class="sl">Gesamt</div><div class="sv" id="t-tot">4</div></div>
    <div class="sc"><div class="sl">Admins</div><div class="sv" id="t-adm">2</div></div>
    <div class="sc"><div class="sl">Ausstehend</div><div class="sv" id="t-pen">1</div></div>
  </div>
  <div style="background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden">
    <div class="th" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px"><div>Mitglied</div><div>E-Mail</div><div>Rolle</div><div>Status</div><div></div></div>
    <div id="t-rows"></div>
  </div>
</div>

<!-- CREATOR EINLADEN -->
<div class="pg" id="pg-c-invite">
  <div class="ph"><div class="ph-t">Creator einladen</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="sc" style="padding:18px">
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">✉️ Einladung senden</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:14px">Wähle einen Creator aus der Liste und sende eine Einladungs-E-Mail.</div>
      <div class="fg"><label class="fl">Creator auswählen *</label><select class="fi" id="ci-sel"><option value="">– Creator wählen –</option></select></div>
      <div class="fg" id="ci-email-wrap" style="display:none"><label class="fl">E-Mail (bitte eingeben)</label><input class="fi" id="ci-email" type="email" placeholder="creator@email.com"></div>
      <div id="ci-preview" style="display:none;background:var(--lt);border:1px solid var(--bdr);border-radius:8px;padding:10px;font-size:12px;color:var(--muted);margin-bottom:10px;line-height:1.6"></div>
      <div class="fg"><label class="fl">Produkt zuweisen (optional)</label><select class="fi" id="ci-prod"><option value="">– Kein Produkt –</option></select></div>
      <button class="btn btn-p" style="width:100%" id="ci-send">Einladung senden →</button>
    </div>
    <div class="sc" style="padding:18px">
      <div style="font-size:13px;font-weight:600;margin-bottom:10px">👤 Eingeladene Creator</div>
      <div id="ci-list"></div>
    </div>
  </div>
  <div style="margin-top:14px;background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:18px">
    <div style="font-size:13px;font-weight:600;margin-bottom:10px">🔍 Creator-Portal Vorschau</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:12px">So sieht das Dashboard eines Creators aus:</div>
    <button class="btn btn-p" id="open-portal-preview">Creator-Portal öffnen →</button>
  </div>
</div>

<!-- CONTENT HUB -->
<div class="pg" id="pg-content-hub">
  <div class="ph">
    <div class="ph-t">Content Hub</div>
    <div style="display:flex;gap:8px">
      <input class="fi" id="ch-search" placeholder="🔍 Suchen..." style="width:180px;padding:6px 10px;font-size:12px">
      <button class="btn btn-p" id="ch-add-btn">+ Inhalt hinzufügen</button>
      <button class="btn" id="ch-add-cat-btn">+ Kategorie</button>
    </div>
  </div>
  <!-- Category tabs -->
  <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap" id="ch-cats"></div>
  <!-- Content grid -->
  <div id="ch-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px"></div>
</div>

<!-- EINSTELLUNGEN -->
<div class="pg" id="pg-einst">
  <div class="ph"><div class="ph-t">Einstellungen</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px">
    <div class="sc" style="padding:15px">
      <div style="font-size:12px;font-weight:600;margin-bottom:11px">👤 Profil</div>
      <div class="fg"><label class="fl">Name</label><input class="fi" id="s-name" value="Admin User"></div>
      <div class="fg"><label class="fl">E-Mail</label><input class="fi" value="admin@filapen.de" disabled style="opacity:.5"></div>
      <button class="btn btn-p" style="width:100%" id="s-save">Speichern</button>
    </div>
    <div class="sc" style="padding:15px">
      <div style="font-size:12px;font-weight:600;margin-bottom:11px">🔐 Passwort</div>
      <div class="fg"><label class="fl">Aktuell</label><input class="fi" type="password" id="pw-c" placeholder="••••••••"></div>
      <div class="fg"><label class="fl">Neu (min. 8)</label><input class="fi" type="password" id="pw-n" placeholder="••••••••"></div>
      <div class="fg"><label class="fl">Bestätigen</label><input class="fi" type="password" id="pw-k" placeholder="••••••••"></div>
      <button class="btn btn-p" style="width:100%" id="pw-save">Ändern</button>
    </div>
    <div class="sc" style="padding:15px">
      <div style="font-size:12px;font-weight:600;margin-bottom:11px">🎨 Darstellung</div>
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px">
        <div style="font-size:12px;font-weight:500">Dark Mode</div>
        <div class="tgl" id="dark-tgl"><div class="tgl-d"></div></div>
      </div>
      <div style="font-size:9px;font-weight:600;color:var(--muted);text-transform:uppercase;margin-bottom:5px">Sprache</div>
      <div style="display:flex;gap:6px">
        <button class="btn btn-p btn-sm" id="lang-de" style="flex:1">🇩🇪 Deutsch</button>
        <button class="btn btn-sm" id="lang-en" style="flex:1">🇬🇧 English</button>
      </div>
    </div>
    <div class="sc" style="padding:15px">
      <div style="font-size:12px;font-weight:600;margin-bottom:4px">🏷️ Tags</div>
      <div style="font-size:10px;color:var(--muted);margin-bottom:8px">Für Creator und Filter</div>
      <div style="display:flex;flex-wrap:wrap;gap:4px;margin-bottom:8px" id="tags-list"></div>
      <div style="display:flex;gap:5px"><input class="fi" id="new-tag" placeholder="Neuer Tag..." style="flex:1;font-size:11px"><button class="btn btn-p" id="btn-add-tag">+</button></div>
    </div>
  </div>
</div>

</div>
</div>

<!-- ═══ CREATOR PORTAL ═══════════════════════════════════════════════════ -->
<div class="portal" id="creator-portal">
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

<!-- ═══ OVERLAYS ════════════════════════════════════════════════════════ -->

<!-- SEARCH OVERLAY -->
<div class="search-overlay" id="search-overlay">
  <div class="search-box">
    <input class="search-inp" id="search-real" placeholder="Dateien, Creator, Ordner suchen..." autofocus>
    <div id="search-results"></div>
    <div style="font-size:10px;color:var(--muted);margin-top:8px">ESC zum Schließen</div>
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

<!-- UPLOAD DATE MENU -->
<div class="up-menu" id="up-menu">
  <div style="font-size:11px;font-weight:600;margin-bottom:9px;color:var(--muted)">Upload-Datum wählen</div>
  <div class="fg"><label class="fl">Datum</label><input class="fi" type="date" id="up-date" style="font-size:11px;padding:5px 8px"></div>
  <div style="display:flex;gap:5px;margin-top:8px">
    <button class="btn btn-sm" id="up-cancel">Abbrechen</button>
    <button class="btn btn-p btn-sm" id="up-ok">Speichern</button>
  </div>
</div>

<!-- CONFIRM MODAL -->
<div id="confirm-bg" style="position:fixed;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);z-index:700;display:none;align-items:center;justify-content:center;">
  <div style="background:var(--surf);border-radius:12px;padding:22px;width:320px;border:1px solid var(--bdr);">
    <div style="font-size:14px;font-weight:600;margin-bottom:8px" id="confirm-title">Löschen?</div>
    <div style="font-size:12px;color:var(--muted);margin-bottom:18px">Diese Aktion kann nicht rückgängig gemacht werden.</div>
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

`
const JS = `
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
  creators:[],
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
  // Banner: neue Creator-Uploads
  if(!S._uploadBannerDismissed){
    const token=localStorage.getItem('token')||'';
    fetch('/api/uploads?creatorId=all',{headers:{'Authorization':'Bearer '+token}})
      .then(r=>r.json()).then(uploads=>{
        if(!Array.isArray(uploads))return;
        const unseen=uploads.filter(u=>!u.seen_by_admin);
        if(!unseen.length)return;
        // Group by creator_id
        const byCreator={};
        unseen.forEach(u=>{if(!byCreator[u.creator_id])byCreator[u.creator_id]=[];byCreator[u.creator_id].push(u);});
        const creatorIds=Object.keys(byCreator);
        const names=creatorIds.map(cid=>{const c=S.creators.find(x=>String(x.id)===String(cid));return c?c.name:cid;});
        const bannerEl=document.getElementById('upload-banner');
        if(bannerEl)bannerEl.remove();
        const banner=document.createElement('div');
        banner.id='upload-banner';
        banner.style.cssText='background:#eff6ff;border:1px solid #bfdbfe;border-radius:9px;padding:10px 14px;margin-bottom:12px;font-size:12px;color:#1e40af;display:flex;align-items:flex-start;justify-content:space-between;gap:10px';
        const msg=names.length===1?\`<strong>\${names[0]}</strong> hat neuen Content hochgeladen — bitte geh auf das Profil.\`:\`<strong>\${names.join(', ')}</strong> haben neuen Content hochgeladen.\`;
        banner.innerHTML=\`<div>📤 \${msg}<br><span style="font-size:10px;opacity:.7">\${unseen.length} neue Datei\${unseen.length>1?'en':''}</span></div><button id="upload-banner-x" style="background:none;border:none;cursor:pointer;font-size:16px;color:#1e40af;padding:0;flex-shrink:0">✕</button>\`;
        const af=G('af-row');if(af)af.insertAdjacentElement('afterend',banner);
        document.getElementById('upload-banner-x')?.addEventListener('click',()=>{S._uploadBannerDismissed=true;banner.remove();});
        // Click on banner goes to first creator profile
        banner.querySelector('div')?.addEventListener('click',()=>{
          const firstId=creatorIds[0];const c=S.creators.find(x=>String(x.id)===String(firstId));
          if(c){go('creators');setTimeout(()=>openC(c.id),100);}
        });
      }).catch(()=>{});
  }
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
  // Uses String comparison to support both integer (demo) and UUID (Supabase) IDs
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
      const newTabs=new Set();
      uploads.forEach(u=>{
        const tab=tabMap[u.tab]||'bilder';
        if(!c.flds[tab])c.flds[tab]=[];
        let fld=c.flds[tab].find(f=>f.id==='__db_uploads__');
        if(!fld){fld={id:'__db_uploads__',name:'Uploads',batch:'Creator Upload',date:new Date().toISOString().slice(0,10),deadline:null,prods:[],tags:[],files:[]};c.flds[tab].unshift(fld);}
        if(!fld.files.find(f=>f.id===u.id)){
          fld.files.push({id:u.id,name:u.file_name,type:u.file_type,url:u.file_url,size:u.file_size?(u.file_size/1024/1024).toFixed(1)+' MB':'',uploadedAt:null,comments:[],r2Key:u.r2_key});
          if(!u.seen_by_admin)newTabs.add(tab);
        }
      });
      if(newTabs.size>0){
        G('c-tabs').querySelectorAll('.tab').forEach(tabEl=>{
          const tLabel=tabEl.textContent?.trim()||'';
          const tKey={'🖼️ Bilder':'bilder','🎬 Videos':'videos','📹 Rohmaterial':'roh','📊 Auswertungen':'auswertung'}[tLabel]||tabEl.dataset?.t||tLabel.toLowerCase();
          if(newTabs.has(tKey)&&!tabEl.querySelector('.new-dot')){
            const dot=document.createElement('span');dot.className='new-dot';
            dot.style.cssText='display:inline-block;width:7px;height:7px;background:#ef4444;border-radius:50%;margin-left:4px;vertical-align:middle;flex-shrink:0;';
            tabEl.appendChild(dot);
          }
        });
        const adminTok=localStorage.getItem('token')||'';if(adminTok){fetch('/api/uploads',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+adminTok},body:JSON.stringify({creatorId:String(id)})}).catch(()=>{});}
      }
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

function delFile(fid,fldId){
  const fileObj=(()=>{for(const t of Object.keys(S.aC?.flds||{})){const f=S.aC.flds[t].find(x=>x.id===fldId);if(f){return f.files.find(x=>x.id===fid)||null;}}return null;})();
  askConfirm('Datei löschen?',async()=>{
    const token=localStorage.getItem('token')||localStorage.getItem('creator_token')||'';
    try{await fetch('/api/upload',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({uploadId:String(fid),r2Key:fileObj?.r2Key||null})});}catch(e){}
    for(const t of Object.keys(S.aC.flds)){const f=S.aC.flds[t].find(x=>x.id===fldId);if(f){f.files=f.files.filter(x=>x.id!==fid);rFiles(f);rCHdr();showT('Datei gelöscht ✓');return;}}
  });
}
function delFld(fid,tab,name){askConfirm(\`Ordner "\${name}" löschen?\`,async()=>{
  const token=localStorage.getItem('token')||localStorage.getItem('creator_token')||'';
  try{await fetch('/api/folders',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(fid)})});}catch(e){}
  S.aC.flds[tab]=S.aC.flds[tab].filter(f=>String(f.id)!==String(fid));rCT(tab);rCHdr();showT('Ordner gelöscht ✓');
});}
function delC(id,name){askConfirm(\`Creator "\${name}" wirklich löschen? Der Zugang wird sofort entzogen.\`,async()=>{
  const token=localStorage.getItem('token')||'';
  try{
    const r=await fetch('/api/creators',{method:'DELETE',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(id)})});
    if(!r.ok){const d=await r.json();showT('Fehler: '+(d.error||'Löschen fehlgeschlagen'));return;}
  }catch(e){showT('Netzwerkfehler');return;}
  S.creators=S.creators.filter(c=>String(c.id)!==String(id));
  if(String(S.aC?.id)===String(id))showCL();
  rCreators();uBdg();rDash();showT(\`"\${name}" gelöscht ✓\`);
});}
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
function delP(id,name){askConfirm(\`Produkt "\${name}" löschen?\`,()=>{S.produkte=S.produkte.filter(p=>p.id!==id);rProdukte();uBdg();showT(\`"\${name}" gelöscht ✓\`);saveAppData('produkte',S.produkte);});}

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
function delPJ(id,name){askConfirm(\`Projekt "\${name}" löschen?\`,()=>{S.projekte=S.projekte.filter(p=>p.id!==id);if(S.aPJ?.id===id)backPJ();else rProjekte();uBdg();showT(\`"\${name}" gelöscht ✓\`);saveAppData('projekte',S.projekte);});}

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
function delK(id,name){askConfirm(\`"\${name}" löschen?\`,()=>{S.kat=S.kat.filter(k=>k.id!==id);rKat();showT(\`"\${name}" gelöscht ✓\`);saveAppData('kat',S.kat);});}

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
  const notInvited=S.creators.filter(c=>!c.invited||!c.invite_code);
  G('ci-sel').innerHTML='<option value="">– Creator wählen –</option>'+notInvited.map(c=>'<option value="'+c.id+'">'+c.name+(c.email?' ('+c.email+')':'')+'</option>').join('');
  G('ci-sel').onchange=function(){
    const cid=this.value;const c=S.creators.find(x=>String(x.id)===String(cid));
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
      const accepted=c.status==='aktiv'||!!c.lastLogin;
      const bb=i<invited.length-1?'border-bottom:1px solid var(--bdr);':'';
      const st=accepted?'background:#f0fdf4;color:#15803d;border:1px solid #bbf7d0':'background:#fffbeb;color:#d97706;border:1px solid #fde68a';
      return '<div style="display:grid;grid-template-columns:2fr 1fr 1.2fr 1fr auto;align-items:center;padding:8px 10px;'+bb+'gap:6px">'
        +'<div style="display:flex;align-items:center;gap:7px"><div style="width:24px;height:24px;border-radius:50%;background:'+c.color+';display:flex;align-items:center;justify-content:center;font-size:9px;font-weight:600;color:#fff">'+c.ini+'</div>'
        +'<div><div style="font-size:12px;font-weight:500">'+c.name+'</div><div style="font-size:10px;color:var(--muted)">'+( c.email||'-')+'</div></div></div>'
        +'<div style="font-size:11px">'+invDate+'</div>'
        +'<span style="font-size:10px;border-radius:5px;padding:1px 7px;'+st+'">'+( accepted?'✓ Aktiv':'⏳ Ausstehend')+'</span>'
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
        const cid=btn.dataset.resend;const c=S.creators.find(x=>String(x.id)===String(cid));if(!c||!c.email)return showT('Keine E-Mail hinterlegt');
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
        const cid=btn.dataset.revoke;const c=S.creators.find(x=>String(x.id)===String(cid));if(!c)return;
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
  const c=S.creators.find(x=>String(x.id)===String(cid))||S.creators[0];
  _portalCreator=c;
  S.aC=c;
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
        const fldToken=localStorage.getItem('creator_token')||localStorage.getItem('token')||'';
        fetch('/api/folders',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+fldToken},
          body:JSON.stringify({creator_id:String(c.id),tab,name:fldName,batch:fldName,date:new Date().toISOString().slice(0,10)})})
          .then(r=>r.json()).then(d=>{if(d.id)newFld.id=d.id;}).catch(()=>{});
        c.flds[tab].push(newFld);fld=newFld;showT(\`Ordner "\${fldName}" erstellt ✓\`);
      } else {
        if(!sel){showT('Bitte Ordner wählen');return;}
        const [fldId,t]=sel.split(':');tab=t;fld=c.flds[tab]?.find(f=>String(f.id)===String(fldId));if(!fld){showT('Ordner nicht gefunden');return;}
      }
      // Real upload to R2 + Supabase
      const token=localStorage.getItem('creator_token')||localStorage.getItem('token')||'';
      if(!file){showT('Bitte Datei auswählen');return;}
      G('portal-prog').style.display='block';
      G('portal-ps').textContent='Wird hochgeladen...';
      G('portal-upload-btn').disabled=true;
      const fd=new FormData();
      fd.append('file',file);
      fd.append('creatorId',String(c.id));
      fd.append('tab',tab);
      const xhr=new XMLHttpRequest();
      xhr.open('POST','/api/upload');
      xhr.setRequestHeader('Authorization','Bearer '+token);
      xhr.upload.onprogress=e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);G('portal-pb').style.width=p+'%';G('portal-ps').textContent='Upload: '+p+'%';}};
      xhr.onload=()=>{
        const d=JSON.parse(xhr.responseText);
        if(xhr.status!==200){showT('Fehler: '+(d.error||'Upload fehlgeschlagen'));G('portal-upload-btn').disabled=false;return;}
        G('portal-pb').style.background='var(--grn)';G('portal-ps').textContent='✓ Gespeichert!';
        const ft=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':'file';
        const nf={id:d.upload?.id||uid(),name,type:ft,url:d.upload?.file_url||d.url,size:(file.size/1024/1024).toFixed(1)+' MB',uploadedAt:null,comments:[],r2Key:d.upload?.r2_key||null};
        setTimeout(()=>{fld.files.push(nf);showT('"'+name+'" hochgeladen ✓');renderPortalPage('upload');G('portal-upload-btn').disabled=false;},500);
      };
      xhr.onerror=()=>{showT('Netzwerkfehler');G('portal-upload-btn').disabled=false;};
      xhr.send(fd);
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
    const apply=async(photo)=>{
      const token=localStorage.getItem('token')||'';
      const payload={name,initials:ini,email,instagram,age,gender,country,tags,description:desc,
        verguetung,provision,fixbetrag,notizen,notizen_creator:notizen,
        kids,kids_ages:kidsAges,kids_on_vid:kidsOnVid,...(photo?{photo}:{})};
      if(isE){
        const c=S.creators.find(x=>String(x.id)===String(S.form.cid));if(!c)return;
        try{
          const r=await fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(c.id),...payload})});
          if(!r.ok){showT('Fehler beim Speichern');return;}
        }catch(e){showT('Netzwerkfehler');return;}
        Object.assign(c,{name,ini,email,instagram,age,desc,gender,country,tags,verguetung,provision,fixbetrag,notizen,kids,kidsAges,kidsOnVid});
        if(photo)c.photo=photo;if(S.aC?.id===c.id)rCHdr();showT(\`"\${name}" gespeichert ✓\`);
      }else{
        try{
          const r=await fetch('/api/creators',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({...payload,color_from:color})});
          const d=await r.json();if(!r.ok){showT('Fehler: '+(d.error||''));return;}
          S.creators.push({id:d.id,name,ini,color,age,email,instagram,gender,country,tags,desc,up:new Date(),photo:photo||null,verguetung,provision,fixbetrag,notizen,kids,kidsAges,kidsOnVid,vertrag:null,vertragsname:'',invited:false,status:'ausstehend',flds:{bilder:[],videos:[],roh:[],auswertung:[]}});
          showT(\`"\${name}" angelegt ✓\`);
        }catch(e){showT('Netzwerkfehler');return;}
      }
      rCreators();uBdg();rDash();closeM();
    };
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addFld'||type==='editFld'){
    const isE=type==='editFld';const tab=S.form.tab||S.aCT;const name=G('m-fn').value.trim();if(!name){showT('Name erforderlich');return;}
    const batch=G('m-fb').value.trim()||name;const date=G('m-fd').value||new Date().toISOString().slice(0,10);
    const deadline=G('m-fdl').value||'';
    const prods=[...G('m-fp').selectedOptions].map(o=>o.value);const tags=[...G('m-ft').selectedOptions].map(o=>o.value);
    const token=localStorage.getItem('token')||localStorage.getItem('creator_token')||'';
    if(isE){
      const fld=S.aC?.flds[tab]?.find(f=>f.id===S.form.fid);if(!fld)return;
      fetch('/api/folders',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({id:String(fld.id),name,batch,date,deadline,prods,tags})}).catch(()=>{});
      Object.assign(fld,{name,batch,date,deadline,prods,tags});showT('Aktualisiert ✓');
    }else{
      if(!S.aC)return;
      fetch('/api/folders',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
        body:JSON.stringify({creator_id:String(S.aC.id),tab,name,batch,date,deadline,prods,tags})})
        .then(r=>r.json()).then(d=>{
          if(d.id){const fld=S.aC?.flds[tab]?.find(f=>f.id==='__tmp__');if(fld)fld.id=d.id;}
        }).catch(()=>{});
      S.aC.flds[tab].push({id:'__tmp__',name,batch,date,deadline,prods,tags,files:[]});
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
    const token=localStorage.getItem('token')||localStorage.getItem('creator_token')||'';
    G('modal-ok').disabled=true;
    if(link){
      fetch('/api/upload',{method:'POST',headers:{'Authorization':'Bearer '+token},body:(()=>{const fd=new FormData();fd.append('linkUrl',link);fd.append('linkName',name);fd.append('creatorId',String(cid));fd.append('tab',tab);return fd;})()})
        .then(r=>r.json()).then(d=>{
          const nf={id:d.upload?.id||uid(),name,type:'link',url:link,size:'Link',uploadedAt:null,comments:[],r2Key:null};
          fld.files.push(nf);rFiles(fld);rCHdr();closeM();showT('"'+name+'" hinzugefügt ✓');
        }).catch(()=>{showT('Fehler');G('modal-ok').disabled=false;});
      return;
    }
    G('m-prog').style.display='block';G('m-ps').textContent='Wird hochgeladen...';
    const fd=new FormData();fd.append('file',file);fd.append('creatorId',String(cid));fd.append('tab',tab);
    const xhr=new XMLHttpRequest();xhr.open('POST','/api/upload');xhr.setRequestHeader('Authorization','Bearer '+token);
    xhr.upload.onprogress=e=>{if(e.lengthComputable){const p=Math.round(e.loaded/e.total*100);G('m-pb').style.width=p+'%';G('m-ps').textContent='R2: '+p+'%';}};
    xhr.onload=()=>{
      const d=JSON.parse(xhr.responseText);
      if(xhr.status!==200){showT('Fehler: '+(d.error||'Upload fehlgeschlagen'));G('modal-ok').disabled=false;return;}
      G('m-pb').style.background='var(--grn)';G('m-ps').textContent='✓ Gespeichert';
      const ft=file.type.startsWith('image/')?'image':file.type.startsWith('video/')?'video':file.type==='application/pdf'?'pdf':'file';
      const nf={id:d.upload?.id||uid(),name,type:ft,url:d.upload?.file_url||d.url,size:(file.size/1024/1024).toFixed(1)+' MB',uploadedAt:null,comments:[],r2Key:d.upload?.r2_key||null};
      setTimeout(()=>{fld.files.push(nf);rFiles(fld);rCHdr();closeM();showT('"'+name+'" hochgeladen ✓');},400);
    };
    xhr.onerror=()=>{showT('Netzwerkfehler');G('modal-ok').disabled=false;};
    xhr.send(fd);
    return;
  }
  if(type==='addP'||type==='editP'){
    const isE=type==='editP';const name=G('m-pn').value.trim();if(!name){showT('Name erforderlich');return;}
    const cat=G('m-pc').value.trim();const icon=G('m-pe').value.trim()||'📦';const tags=[...G('m-pt').selectedOptions].map(o=>o.value);const pf=G('m-pi').files[0];
    const apply=(url)=>{if(isE){const i=S.produkte.findIndex(p=>p.id===S.form.pid);if(i>=0)S.produkte[i]={...S.produkte[i],name,cat,icon,tags,...(url?{url}:{})};showT('Aktualisiert ✓');}else{S.produkte.push({id:uid(),name,cat,icon,tags,url:url||null,briefings:[],skripte:[],lernvideos:[]});showT(\`"\${name}" hinzugefügt ✓\`);}rProdukte();uBdg();closeM();saveAppData('produkte',S.produkte);};
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addPJ'||type==='editPJ'){
    const isE=type==='editPJ';const name=G('m-pjn').value.trim();if(!name){showT('Name erforderlich');return;}
    const pids=[...G('m-pjp').selectedOptions].map(o=>+o.value).filter(Boolean);const aktion=G('m-pja').value.trim();const start=G('m-pjs').value;const count=+G('m-pjc').value||1;const pf=G('m-pji').files[0];
    const apply=(url)=>{if(isE){const i=S.projekte.findIndex(p=>p.id===S.form.pjid);if(i>=0){const old=S.projekte[i];S.projekte[i]={...old,name,pids,aktion,start,count,...(url?{url}:{})};if(S.aPJ?.id===S.form.pjid){S.aPJ=S.projekte[i];rPJHdr();rPJT(S.aPT);}}showT('Aktualisiert ✓');}else{S.projekte.push({id:uid(),name,pids,aktion,start,count,cids:[],status:'planned',url:url||null});showT(\`"\${name}" erstellt ✓\`);}rProjekte();uBdg();closeM();saveAppData('projekte',S.projekte);};
    if(pf){const r=new FileReader();r.onload=e=>apply(e.target.result);r.readAsDataURL(pf);}else apply(null);return;
  }
  if(type==='addK'||type==='editK'){
    const isE=type==='editK';const name=G('m-kn').value.trim();if(!name)return;const icon=G('m-ki').value.trim()||'📁';const ktype=G('m-kt').value;
    if(isE){const i=S.kat.findIndex(k=>k.id===S.form.kid);if(i>=0)S.kat[i]={...S.kat[i],name,icon,type:ktype};showT('Aktualisiert ✓');}else{S.kat.push({id:uid(),name,icon,type:ktype});showT(\`"\${name}" erstellt ✓\`);}rKat();closeM();saveAppData('kat',S.kat);return;
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
  const cid=G('ci-sel').value;
  if(!cid){showT('Bitte einen Creator auswählen');return;}
  const c=S.creators.find(x=>String(x.id)===String(cid));
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

// Expose key functions and state on window for React sync
window.S = S;
window.rDash = rDash;
window.rCreators = rCreators;
window.rCInvite = rCInvite;
window.openC = openC;
window.go = go;
window.rProdukte = rProdukte;
window.rProjekte = rProjekte;
window.rKat = rKat;
window.rCT = rCT;
window.rCHdr = rCHdr;

function saveAppData(key,value){
  const token=localStorage.getItem('token')||'';
  fetch('/api/app-data',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},
    body:JSON.stringify({key,value})}).catch(()=>{});
}

go('dashboard');rFP();
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
