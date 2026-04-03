import { useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

const CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bdr:#e8e8ec;--bg:#f4f5f7;--surf:#fff;--lt:#f4f5f7;--act:#f0f0f3;--muted:#777;--blue:#4f6ef7;--grn:#16a34a;--red:#dc2626;--org:#ea580c;}
html{height:100%;overflow:hidden;}body{font-family:system-ui,sans-serif;font-size:13px;background:var(--bg);color:#111;display:flex;width:100vw;height:100vh;overflow:hidden;margin:0;padding:0;box-sizing:border-box;}
body.dark{--bdr:#2d2d2d;--bg:#0d0d0d;--surf:#161616;--lt:#1e1e1e;--act:#252525;--muted:#888;color:#f0f0f0;}
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
.main{margin-left:210px;flex:1;display:flex;flex-direction:column;min-width:0;height:100vh;overflow:hidden;}
.topbar{background:var(--surf);border-bottom:1px solid var(--bdr);height:46px;padding:0 18px;display:flex;align-items:center;gap:8px;flex-shrink:0;position:sticky;top:0;z-index:50;}
.tb-t{font-size:13px;font-weight:600;}
.sw{flex:1;max-width:280px;position:relative;margin-left:8px;}
.sw input{width:100%;background:var(--lt);border:1px solid transparent;border-radius:7px;padding:5px 9px 5px 26px;font-size:12px;color:#111;outline:none;font-family:inherit;}
body.dark .sw input{color:#f0f0f0;}
.sw input:focus{border-color:var(--bdr);}
.s-ico{position:absolute;left:8px;top:50%;transform:translateY(-50%);color:#bbb;font-size:11px;}
.tb-r{margin-left:auto;display:flex;gap:6px;align-items:center;position:relative;}
.btn{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--surf);color:#111;font-family:inherit;white-space:nowrap;}
body.dark .btn{color:#f0f0f0;}
.btn:hover{background:var(--lt);}
.btn-p{background:#111;color:#fff;border-color:#111;}
body.dark .btn-p{background:#f0f0f0;color:#111;border-color:#f0f0f0;}
.btn-p:hover{opacity:.85;}
.btn-sm{padding:3px 8px;font-size:11px;}
.btn-red{background:var(--red);color:#fff;border-color:var(--red);}
.btn-grn{background:var(--grn);color:#fff;border-color:var(--grn);}
.content{padding:18px;flex:1;overflow-y:auto;overflow-x:hidden;min-width:0;}
.pg{display:none;}
.pg.on{display:block;}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}
.ph-t{font-size:18px;font-weight:700;}
.stat-row{display:grid;gap:8px;margin-bottom:13px;}
.sc{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;cursor:pointer;}
.sc:hover{border-color:#bbb;}
.sl{font-size:9px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
.sv{font-size:20px;font-weight:700;}
.cl{display:flex;flex-direction:column;}
.cr{display:flex;align-items:center;gap:10px;padding:10px 12px;background:var(--surf);border:1px solid var(--bdr);border-bottom:none;}
.cr:first-child{border-radius:9px 9px 0 0;}
.cr:last-child{border-bottom:1px solid var(--bdr);border-radius:0 0 9px 9px;}
.cr:only-child{border-radius:9px;border-bottom:1px solid var(--bdr);}
.cr:hover{background:var(--lt);}
.cr-av{width:42px;height:42px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:14px;font-weight:600;color:#fff;overflow:hidden;}
.cr-av img{width:100%;height:100%;object-fit:cover;}
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
.cdh{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:13px 15px;margin-bottom:13px;display:flex;align-items:center;gap:13px;position:sticky;top:46px;z-index:40;}
.cd-av{width:54px;height:54px;border-radius:50%;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:19px;font-weight:700;color:#fff;overflow:hidden;}
.cd-av img{width:100%;height:100%;object-fit:cover;}
.tabs{display:flex;border-bottom:1px solid var(--bdr);margin-bottom:13px;overflow-x:auto;}
.tab{padding:7px 12px;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;flex-shrink:0;}
.tab:hover,.tab.on{color:var(--blue);}
.tab.on{border-bottom-color:var(--blue);}
.fg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;}
.fcard{background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:11px;position:relative;cursor:pointer;}
.fcard:hover{border-color:#bbb;}
.fcard.deadline-red{border-color:var(--red)!important;background:#fff5f5;}
body.dark .fcard.deadline-red{background:#1a0808;}
.add-fcard{background:var(--surf);border:1.5px dashed var(--bdr);border-radius:9px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:var(--muted);}
.add-fcard:hover{border-color:#aaa;}
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
.fi-comment-badge{position:absolute;bottom:4px;right:4px;background:var(--blue);color:#fff;border-radius:9px;font-size:9px;padding:1px 5px;font-weight:600;}
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
.dot-btn{width:22px;height:22px;border-radius:50%;border:none;background:transparent;font-size:14px;cursor:pointer;color:var(--muted);display:flex;align-items:center;justify-content:center;padding:0;font-family:inherit;line-height:1;}
.dot-btn:hover{background:var(--act);}
.drop-menu{position:fixed;background:var(--surf);border:1px solid var(--bdr);border-radius:8px;padding:3px;min-width:135px;z-index:2000;box-shadow:0 4px 14px rgba(0,0,0,.12);display:none;}
.drop-menu.open{display:block;}
.dm-i{display:flex;align-items:center;gap:7px;padding:6px 10px;border-radius:5px;cursor:pointer;font-size:12px;color:#111;font-family:inherit;border:none;background:transparent;width:100%;text-align:left;}
body.dark .dm-i{color:#f0f0f0;}
.dm-i:hover{background:var(--lt);}
.dm-i.red{color:var(--red)!important;}
.th{display:grid;padding:7px 12px;border-bottom:1px solid var(--bdr);font-size:9px;font-weight:600;color:#aaa;text-transform:uppercase;letter-spacing:.8px;}
.tr{display:grid;padding:8px 12px;border-bottom:1px solid var(--bdr);align-items:center;}
.tr:last-child{border-bottom:none;}
.tr:hover{background:var(--lt);}
.lb{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:800;display:none;flex-direction:column;align-items:center;justify-content:center;}
.lb.open{display:flex;}
.lb-x{position:absolute;top:14px;right:14px;color:#fff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;}
.lb img,.lb video{max-width:80vw;max-height:62vh;border-radius:7px;}
.lb-btn{padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;font-family:inherit;}
.lb-comment-box{background:rgba(0,0,0,.6);border-radius:9px;padding:12px;width:min(400px,86vw);margin-top:10px;}
.lb-comment-input{width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12px;outline:none;font-family:inherit;resize:none;}
.lb-comment-item{background:rgba(255,255,255,.08);border-radius:6px;padding:7px 9px;margin-bottom:5px;font-size:11px;color:#e0e0e0;}
.lb-comment-date{font-size:10px;color:#888;margin-top:2px;}
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
.bulk-bar{background:var(--blue);color:#fff;border-radius:9px;padding:8px 14px;display:none;align-items:center;gap:10px;margin-bottom:12px;font-size:12px;}
.bulk-bar.on{display:flex;}
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
.search-overlay{position:fixed;inset:0;background:rgba(0,0,0,.5);backdrop-filter:blur(6px);z-index:400;display:none;flex-direction:column;align-items:center;padding-top:80px;}
.search-overlay.open{display:flex;}
.search-box{background:var(--surf);border-radius:12px;width:min(580px,94vw);padding:16px;border:1px solid var(--bdr);box-shadow:0 8px 32px rgba(0,0,0,.2);}
.search-inp{width:100%;font-size:16px;border:none;outline:none;background:transparent;color:#111;font-family:inherit;padding:4px 0 12px;border-bottom:1px solid var(--bdr);margin-bottom:12px;}
body.dark .search-inp{color:#f0f0f0;}
.search-result{display:flex;align-items:center;gap:10px;padding:8px;border-radius:7px;cursor:pointer;}
.search-result:hover{background:var(--lt);}
.divider{height:1px;background:var(--bdr);margin:10px 0;}
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
<div class="sb-overlay" id="sb-overlay"></div>
<div class="sb" id="admin-sb">
  <div class="logo" id="logo-btn">
    <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgNTAiPjx0ZXh0IHk9IjM1IiBmb250LXNpemU9IjI4IiBmb250LWZhbWlseT0ic3lzdGVtLXVpLHNhbnMtc2VyaWYiIGZvbnQtd2VpZ2h0PSI3MDAiIGZpbGw9IiMxMTEiPkZpbGFwZW48L3RleHQ+PC9zdmc+" alt="Filapen">
    <div class="logo-sep"></div>
    <span class="logo-lbl">Creator Hub</span>
  </div>
  <div class="nav-s">
    <div class="nav-l">Navigation</div>
    <div class="ni on" id="ni-dashboard"><span class="ni-ico">⊞</span>Dashboard</div>
    <div class="ni" id="ni-creators"><span class="ni-ico">★</span>Creator<span class="ni-bdg" id="bdg-c">0</span></div>
    <div class="ni" id="ni-produkte"><span class="ni-ico">◈</span>Produkte</div>
    <div class="ni" id="ni-projekte"><span class="ni-ico">▤</span>Projekte<span class="ni-bdg" id="bdg-p">0</span></div>
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
<div class="pg on" id="pg-dashboard">
  <div class="ph"><div><div class="ph-t">Dashboard</div><div style="font-size:11px;color:var(--muted);margin-top:2px">Übersicht aller Aktivitäten</div></div></div>
  <div class="stat-row" style="grid-template-columns:repeat(4,1fr)" id="d-stats"></div>
  <div id="af-row"></div>
  <div style="font-size:11px;font-weight:600;color:var(--muted);margin-bottom:8px">Neueste Creator</div>
  <div class="cl" id="d-creators"></div>
</div>

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

<div class="pg" id="pg-produkte">
  <div class="ph"><div class="ph-t">Produkte</div><button class="btn btn-p" id="btn-add-p">+ Produkt</button></div>
  <div class="pg-grid" id="p-grid"></div>
</div>

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

<div class="pg" id="pg-team">
  <div class="ph"><div class="ph-t">Team</div><button class="btn btn-p" id="btn-invite">+ Einladen</button></div>
  <div class="stat-row" style="grid-template-columns:repeat(3,1fr)">
    <div class="sc"><div class="sl">Gesamt</div><div class="sv" id="t-tot">0</div></div>
    <div class="sc"><div class="sl">Admins</div><div class="sv" id="t-adm">0</div></div>
    <div class="sc"><div class="sl">Ausstehend</div><div class="sv" id="t-pen">0</div></div>
  </div>
  <div style="background:var(--surf);border:1px solid var(--bdr);border-radius:10px;overflow:hidden">
    <div class="th" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px"><div>Mitglied</div><div>E-Mail</div><div>Rolle</div><div>Status</div><div></div></div>
    <div id="t-rows"></div>
  </div>
</div>

<div class="pg" id="pg-c-invite">
  <div class="ph"><div class="ph-t">Creator einladen</div></div>
  <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
    <div class="sc" style="padding:18px">
      <div style="font-size:13px;font-weight:600;margin-bottom:4px">✉️ Einladung senden</div>
      <div style="font-size:11px;color:var(--muted);margin-bottom:14px">Wähle einen Creator aus der Liste und sende eine Einladungs-E-Mail.</div>
      <div class="fg"><label class="fl">Creator auswählen *</label><select class="fi" id="ci-sel"><option value="">– Creator wählen –</option></select></div>
      <div class="fg" id="ci-email-wrap" style="display:none"><label class="fl">E-Mail</label><input class="fi" id="ci-email" type="email" placeholder="creator@email.com"></div>
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

<div class="pg" id="pg-content-hub">
  <div class="ph">
    <div class="ph-t">Content Hub</div>
    <div style="display:flex;gap:8px">
      <input class="fi" id="ch-search" placeholder="🔍 Suchen..." style="width:180px;padding:6px 10px;font-size:12px">
      <button class="btn btn-p" id="ch-add-btn">+ Inhalt hinzufügen</button>
      <button class="btn" id="ch-add-cat-btn">+ Kategorie</button>
    </div>
  </div>
  <div style="display:flex;gap:6px;margin-bottom:16px;flex-wrap:wrap" id="ch-cats"></div>
  <div id="ch-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:14px"></div>
</div>

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

<div class="portal" id="creator-portal">
  <div class="portal-topbar">
    <div style="font-size:14px;font-weight:700">🎨 Creator Portal</div>
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
        <div class="ni on" id="pni-home"><span class="ni-ico">⊞</span>Mein Dashboard</div>
        <div class="ni" id="pni-upload"><span class="ni-ico">⬆</span>Inhalte hochladen</div>
        <div class="ni" id="pni-tips"><span class="ni-ico">💡</span>Tipps & Tricks</div>
      </div>
    </div>
    <div class="portal-main" id="portal-main"></div>
  </div>
</div>

<div class="search-overlay" id="search-overlay">
  <div class="search-box">
    <input class="search-inp" id="search-real" placeholder="Dateien, Creator, Ordner suchen..." autofocus>
    <div id="search-results"></div>
    <div style="font-size:10px;color:var(--muted);margin-top:8px">ESC zum Schließen</div>
  </div>
</div>

<div class="drop-menu" id="drop-menu">
  <button class="dm-i" id="dm-edit">✏️ Bearbeiten</button>
  <button class="dm-i" id="dm-portal">👤 Portal öffnen</button>
  <button class="dm-i red" id="dm-del">🗑 Löschen</button>
</div>

<div class="lb" id="lb">
  <div class="lb-x" id="lb-x">✕</div>
  <img id="lb-img" style="display:none">
  <video id="lb-vid" controls style="display:none"></video>
  <div style="color:#fff;margin-top:9px;text-align:center">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px" id="lb-name"></div>
    <div style="font-size:10px;opacity:.6" id="lb-meta"></div>
  </div>
  <div style="display:flex;gap:7px;margin-top:9px">
    <button id="lb-dl" class="lb-btn" style="cursor:pointer;font-family:inherit">⬇ Download</button>
    <button class="lb-btn" id="lb-close">✕ Schließen</button>
  </div>
  <div class="lb-comment-box" id="lb-comments-box">
    <div style="font-size:11px;font-weight:600;color:#fff;margin-bottom:7px">💬 Kommentare</div>
    <div id="lb-comments-list" style="max-height:100px;overflow-y:auto;margin-bottom:7px"></div>
    <div style="display:flex;gap:6px">
      <textarea class="lb-comment-input" id="lb-comment-inp" rows="1" placeholder="Kommentar schreiben..."></textarea>
      <button class="lb-btn" id="lb-comment-send" style="flex-shrink:0;font-size:11px">Senden</button>
    </div>
  </div>
</div>

<div class="up-menu" id="up-menu">
  <div style="font-size:11px;font-weight:600;margin-bottom:9px;color:var(--muted)">Upload-Datum wählen</div>
  <div class="fg"><label class="fl">Datum</label><input class="fi" type="date" id="up-date" style="font-size:11px;padding:5px 8px"></div>
  <div style="display:flex;gap:5px;margin-top:8px">
    <button class="btn btn-sm" id="up-cancel">Abbrechen</button>
    <button class="btn btn-p btn-sm" id="up-ok">Speichern</button>
  </div>
</div>

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
  G('d-stats').innerHTML=\`
    <div class="sc" id="ds-c"><div class="sl">Creator</div><div class="sv">\${S.creators.length}</div></div>
    <div class="sc" id="ds-p"><div class="sl">Produkte</div><div class="sv">\${S.produkte.length}</div></div>
    <div class="sc" id="ds-pj"><div class="sl">Projekte</div><div class="sv">\${S.projekte.length}</div></div>
    <div class="sc"><div class="sl">Uploads</div><div class="sv">\${tf}</div></div>\`;
  G('ds-c')?.addEventListener('click',()=>go('creators'));
  G('ds-p')?.addEventListener('click',()=>go('produkte'));
  G('ds-pj')?.addEventListener('click',()=>go('projekte'));
  const late=S.creators.filter(c=>{const d=lastUploadDays(c);return d!==null&&d>=14;});
  let warnHtml='';
  if(late.length&&!S._warnDismissed){
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
      G('warn-dismiss')?.addEventListener('click',()=>{S._warnDismissed=true;G('warn-14d')?.remove();});
    },0);
  }
  G('d-creators').innerHTML=cRowsHTML(list.slice(0,5));
  attachCR(G('d-creators'));
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
          fld.files.push({id:u.id,name:u.file_name,type:(u.mime_type||'').startsWith('image/')?'image':(u.mime_type||'').startsWith('video/')?'video':'file',url:u.file_url,size:u.file_size?(u.file_size/1024/1024).toFixed(1)+' MB':'',uploadedAt:null,comments:[],r2Key:u.r2_key,mime_type:u.mime_type,batch:u.batch,product:u.product,label:u.name,creator_id:u.creator_id});
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
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px">
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
      </div>\`;
    G('notiz-save').addEventListener('click',()=>{c.notizen=G('notiz-inp').value;c.notizenCreator=G('notiz-creator-inp').value;showT('Notizen gespeichert ✓');});
    G('verg-save').addEventListener('click',()=>{c.verguetung=G('verg-model').value;c.provision=G('verg-prov')?.value||'';c.fixbetrag=G('verg-fix')?.value||'';rCHdr();showT('Vergütung gespeichert ✓');});
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
    var bg=cm.author_role==='admin'?'rgba(79,110,247,0.15)':'rgba(255,255,255,0.08)';
    var dt=new Date(cm.created_at).toLocaleString('de-DE');
    html+='<div class="lb-comment-item" style="background:'+bg+';border-radius:6px;padding:6px 8px;margin-bottom:4px">'
      +'<div style="font-size:9px;opacity:.6;margin-bottom:2px">'+cm.author_name+' · '+dt+'</div>'
      +'<div style="font-size:11px">'+cm.message+'</div>'
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
G('up-ok').addEventListener('click',()=>{
  const dateVal=G('up-date').value;if(!dateVal)return;
  const fld=findFld(_upFldId);const file=fld?.files.find(x=>String(x.id)===String(_upFid));
  if(file){file.uploadedAt=dateVal;rFiles(fld);showT('Upload-Datum gesetzt ✓');}
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
G('search-real').addEventListener('input',e=>{
  const q=e.target.value.toLowerCase().trim();
  if(!q){G('search-results').innerHTML='';return;}
  const results=[];
  S.creators.forEach(c=>{
    if(c.name.toLowerCase().includes(q))results.push({type:'creator',icon:'★',label:c.name,sub:'Creator',action:()=>{closeSearch();go('creators');setTimeout(()=>openC(c.id),50);}});
    Object.values(c.flds).flat().forEach(fld=>{
      fld.files.forEach(f=>{
        if(f.name.toLowerCase().includes(q))results.push({type:'file',icon:'📄',label:f.name,sub:\`\${c.name} · \${fld.name}\`,action:()=>{closeSearch();go('creators');setTimeout(()=>{openC(c.id);},50);}});
      });
    });
  });
  G('search-results').innerHTML=results.slice(0,8).map((r,i)=>\`<div class="search-result" data-si="\${i}"><span style="font-size:14px;width:22px;text-align:center;flex-shrink:0">\${r.icon}</span><div><div style="font-size:13px;font-weight:500">\${r.label}</div><div style="font-size:10px;color:var(--muted)">\${r.sub}</div></div></div>\`).join('')||'<div style="color:var(--muted);font-size:12px;padding:8px">Keine Ergebnisse</div>';
  G('search-results').querySelectorAll('[data-si]').forEach((el,i)=>el.addEventListener('click',()=>results[i].action()));
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
  G('t-adm').textContent=S.team.filter(m=>m.role==='admin').length;
  G('t-pen').textContent=S.team.filter(m=>m.status==='pending').length;
  G('t-rows').innerHTML=S.team.map(m=>{
    const av=m.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase();
    const re=m.you?\`<span style="font-size:10px;color:var(--muted)">Du</span>\`:\`<select style="background:var(--lt);border:1px solid var(--bdr);border-radius:5px;padding:2px 6px;font-size:11px;outline:none;font-family:inherit" data-ri="\${m.id}"><option value="admin" \${m.role==='admin'?'selected':''}>Admin</option><option value="read" \${m.role==='read'?'selected':''}>Lesen</option></select>\`;
    const se=m.status==='active'?\`<span style="color:var(--grn);font-size:10px">● Aktiv</span>\`:\`<span style="color:var(--org);font-size:10px">◌ Ausstehend</span>\`;
    return\`<div class="tr" style="grid-template-columns:2fr 1.5fr 1fr 1fr 32px">
      <div style="display:flex;align-items:center;gap:6px"><div style="width:22px;height:22px;border-radius:50%;background:#6366f1;display:flex;align-items:center;justify-content:center;font-size:8px;font-weight:600;color:#fff">\${av}</div><span style="font-size:12px;font-weight:500">\${m.name}\${m.you?' (Du)':''}</span></div>
      <div style="font-size:10px;color:var(--muted)">\${m.email}</div>
      <div>\${re}</div><div>\${se}</div>
      <div>\${!m.you?\`<button class="dot-btn" data-td="\${m.id}">···</button>\`:''}</div>
    </div>\`;
  }).join('');
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
  G('ci-list').innerHTML=invited.length?invited.map(c=>'<div style="padding:8px 0;border-bottom:1px solid var(--bdr);font-size:12px"><strong>'+c.name+'</strong> <span style="color:var(--grn)">✓ Eingeladen</span></div>').join(''):'<div style="color:var(--muted);font-size:12px">Noch keine Creator eingeladen</div>';
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
      <div class="fg"><label class="fl">Tags</label><select class="fi" id="m-ct" multiple style="height:62px">\${to}</select></div>\`;
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
    const pf=G('m-ph').files[0];const color=CL[S.creators.length%CL.length];
    const apply=async(photo)=>{
      const token=localStorage.getItem('token')||'';
      const payload={name,initials:ini,email,instagram,age,gender,country,tags,description:desc,...(photo?{photo}:{})};
      if(isE){
        const c=S.creators.find(x=>String(x.id)===String(S.form.cid));if(!c)return;
        try{await fetch('/api/creators',{method:'PATCH',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({id:String(c.id),...payload})});}catch(e){}
        Object.assign(c,{name,ini,email,instagram,age,desc,gender,country,tags});
        if(photo)c.photo=photo;if(S.aC?.id===c.id)rCHdr();showT(\`"\${name}" gespeichert ✓\`);
      }else{
        try{
          const r=await fetch('/api/creators',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Bearer '+token},body:JSON.stringify({...payload,color_from:color})});
          const d=await r.json();if(!r.ok){showT('Fehler: '+(d.error||''));return;}
          S.creators.push({id:d.id,name,ini,color,age,email,instagram,gender,country,tags,desc,up:new Date(),photo:photo||null,verguetung:'provision',provision:'',fixbetrag:'',notizen:'',notizenCreator:'',kids:false,kidsAges:[],kidsOnVid:false,invited:false,status:'ausstehend',flds:{bilder:[],videos:[],roh:[],auswertung:[]}});
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
    S.team.push({id:uid(),name,email,role:'read',status:'pending'});rTeam();closeM();showT('Eingeladen ✓');return;
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
G('s-save').addEventListener('click',()=>{G('sb-name').textContent=G('s-name').value.split(' ')[0]||'Admin';showT('Gespeichert ✓');});
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
G('sb-overlay')?.addEventListener('click',()=>{G('admin-sb').classList.remove('open');G('sb-overlay').classList.remove('open');});

window.S=S;window.openPortal=openPortal;window.renderPortalPage=renderPortalPage;
window.rDash=rDash;window.rCreators=rCreators;window.rCInvite=rCInvite;
window.openC=openC;window.go=go;window.rProdukte=rProdukte;window.rProjekte=rProjekte;
window.rKat=rKat;window.rCT=rCT;window.rCHdr=rCHdr;

go('dashboard');rFP();
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
          kids: rc.kids || false, kidsAges: rc.kids_ages || [], kidsOnVid: rc.kids_on_vid || false,
          flds: { bilder: [], videos: [], roh: [], auswertung: [] },
          up: new Date(),
        }))
        try { w.rDash() } catch(e) {}
        try { w.rCreators() } catch(e) {}
        try { w.rCInvite() } catch(e) {}

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
