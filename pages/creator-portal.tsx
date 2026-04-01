import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/router'
import Head from 'next/head'

type AuthState = 'checking' | 'auth_ready' | 'portal_ready' | 'error' | 'portal_error'

// ─── Minimal CSS (only portal-related) ───────────────────────────────────────
const PORTAL_CSS = `
*{box-sizing:border-box;margin:0;padding:0;}
:root{--bdr:#e8e8ec;--bg:#f4f5f7;--surf:#fff;--lt:#f4f5f7;--act:#f0f0f3;--muted:#777;--blue:#4f6ef7;--grn:#16a34a;--red:#dc2626;--org:#ea580c;}
html,body{height:100%;overflow:hidden;}
body{font-family:system-ui,sans-serif;font-size:13px;background:var(--bg);color:#111;display:flex;width:100vw;height:100vh;overflow:hidden;margin:0;padding:0;}
body.dark{--bdr:#2d2d2d;--bg:#0d0d0d;--surf:#161616;--lt:#1e1e1e;--act:#252525;--muted:#888;color:#f0f0f0;}
.btn{display:inline-flex;align-items:center;gap:4px;padding:5px 11px;border-radius:7px;font-size:12px;font-weight:500;cursor:pointer;border:1px solid var(--bdr);background:var(--surf);color:#111;font-family:inherit;white-space:nowrap;}
body.dark .btn{color:#f0f0f0;}
.btn:hover{background:var(--lt);}
.btn-p{background:#111;color:#fff;border-color:#111;}
.btn-p:hover{opacity:.85;}
.btn-sm{padding:3px 8px;font-size:11px;}
.btn-red{background:var(--red);color:#fff;border-color:var(--red);}
.btn-grn{background:var(--grn);color:#fff;border-color:var(--grn);}
.ni{display:flex;align-items:center;gap:7px;padding:6px 8px;border-radius:6px;cursor:pointer;font-size:12px;color:var(--muted);margin-bottom:1px;user-select:none;}
.ni:hover,.ni.on{background:var(--act);color:#111;}
body.dark .ni:hover,body.dark .ni.on{color:#f0f0f0;}
.ni.on{font-weight:500;}
.ni-ico{width:15px;text-align:center;font-size:12px;flex-shrink:0;}
.nav-s{padding:10px 7px 3px;}
.nav-l{font-size:9px;font-weight:600;color:#bbb;text-transform:uppercase;letter-spacing:1px;padding:0 6px;margin-bottom:3px;}
.sc{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:10px 13px;}
.sl{font-size:9px;color:#aaa;font-weight:600;text-transform:uppercase;letter-spacing:.5px;margin-bottom:2px;}
.sv{font-size:20px;font-weight:700;}
.stat-row{display:grid;gap:8px;margin-bottom:13px;}
.ph{display:flex;align-items:center;justify-content:space-between;margin-bottom:13px;}
.ph-t{font-size:18px;font-weight:700;}
.fg{margin-bottom:9px;}
.fl{display:block;font-size:9px;font-weight:600;color:var(--muted);margin-bottom:3px;text-transform:uppercase;letter-spacing:.4px;}
.fi{width:100%;border:1px solid var(--bdr);border-radius:7px;padding:7px 9px;font-family:inherit;font-size:12px;color:#111;outline:none;background:var(--surf);}
body.dark .fi{color:#f0f0f0;}
.fi:focus{border-color:#999;}
.tag{padding:1px 6px;border-radius:8px;background:#eff2ff;color:#4f6ef7;font-size:10px;border:1px solid #d0d8ff;}
.fcard{background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:11px;position:relative;cursor:pointer;}
.fcard:hover{border-color:#bbb;}
.fg-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px;}
.add-fcard{background:var(--surf);border:1.5px dashed var(--bdr);border-radius:9px;min-height:100px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;color:var(--muted);}
.add-fcard:hover{border-color:#aaa;}
.file-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(130px,1fr));gap:8px;}
.ficard{background:var(--surf);border:1px solid var(--bdr);border-radius:8px;overflow:hidden;}
.fi-thumb{height:88px;background:var(--lt);display:flex;align-items:center;justify-content:center;font-size:26px;cursor:pointer;overflow:hidden;position:relative;}
.fi-thumb img,.fi-thumb video{width:100%;height:100%;object-fit:cover;}
.play-ov{position:absolute;inset:0;background:rgba(0,0,0,.3);display:flex;align-items:center;justify-content:center;opacity:0;transition:opacity .15s;}
.fi-thumb:hover .play-ov{opacity:1;}
.play-btn{width:26px;height:26px;border-radius:50%;background:rgba(255,255,255,.9);display:flex;align-items:center;justify-content:center;font-size:9px;}
.fi-info{padding:6px 8px;}
.fi-name{font-size:10px;font-weight:500;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.fi-meta{font-size:9px;color:var(--muted);margin-bottom:4px;}
.fi-acts{display:flex;gap:2px;}
.fi-btn{flex:1;padding:2px 0;border-radius:4px;border:1px solid var(--bdr);font-size:10px;cursor:pointer;text-align:center;text-decoration:none;display:inline-block;color:#111;background:transparent;font-family:inherit;}
body.dark .fi-btn{color:#f0f0f0;}
.fi-btn:hover{background:var(--lt);}
.fi-comment-badge{position:absolute;bottom:4px;right:4px;background:var(--blue);color:#fff;border-radius:9px;font-size:9px;padding:1px 5px;font-weight:600;}
.tabs{display:flex;border-bottom:1px solid var(--bdr);margin-bottom:13px;overflow-x:auto;}
.tab{padding:7px 12px;font-size:12px;font-weight:500;color:var(--muted);cursor:pointer;border-bottom:2px solid transparent;margin-bottom:-1px;white-space:nowrap;flex-shrink:0;}
.tab:hover,.tab.on{color:var(--blue);}
.tab.on{border-bottom-color:var(--blue);}
.bk{display:inline-flex;align-items:center;gap:4px;color:var(--muted);font-size:12px;cursor:pointer;margin-bottom:10px;background:none;border:none;padding:0;font-family:inherit;}
.bk:hover{color:var(--blue);}
.empty{text-align:center;padding:32px 14px;color:var(--muted);}
.toast{position:fixed;bottom:16px;right:16px;background:#111;color:#fff;border-radius:8px;padding:8px 13px;font-size:12px;opacity:0;transform:translateY(6px);transition:all .2s;z-index:9999;pointer-events:none;}
.toast.show{opacity:1;transform:translateY(0);}
.dz{border:1.5px dashed var(--bdr);border-radius:8px;padding:13px;text-align:center;cursor:pointer;background:var(--lt);}
.dz:hover{border-color:var(--blue);}
.dz.done{border-color:var(--grn);}
.prog-track{height:4px;background:var(--lt);border-radius:2px;margin-top:4px;overflow:hidden;}
.prog-fill{height:4px;background:var(--blue);border-radius:2px;width:0;transition:width .12s;}
/* PORTAL LAYOUT */
.portal{display:flex;position:fixed;inset:0;background:var(--bg);z-index:500;flex-direction:column;}
.portal-topbar{background:var(--surf);border-bottom:1px solid var(--bdr);padding:0 20px;height:52px;display:flex;align-items:center;gap:12px;flex-shrink:0;}
.portal-sb{width:200px;background:var(--surf);border-right:1px solid var(--bdr);display:flex;flex-direction:column;flex-shrink:0;overflow-y:auto;}
.portal-main{flex:1;overflow-y:auto;padding:20px;}
.portal-content{display:flex;flex:1;overflow:hidden;}
.tip-card{background:var(--surf);border:1px solid var(--bdr);border-radius:10px;padding:16px;cursor:pointer;text-align:center;}
.tip-card:hover{border-color:var(--blue);}
/* MODAL */
.modal-bg{position:fixed;inset:0;background:rgba(0,0,0,.35);backdrop-filter:blur(4px);z-index:600;display:none;align-items:center;justify-content:center;}
.modal-bg.open{display:flex;}
.modal{background:var(--surf);border-radius:12px;padding:18px;width:460px;max-width:94vw;max-height:88vh;overflow-y:auto;border:1px solid var(--bdr);color:#111;}
body.dark .modal{color:#f0f0f0;}
.modal-t{font-size:14px;font-weight:700;margin-bottom:13px;}
.modal-acts{display:flex;gap:6px;justify-content:flex-end;margin-top:12px;}
/* LIGHTBOX */
.lb{position:fixed;inset:0;background:rgba(0,0,0,.93);z-index:800;display:none;flex-direction:column;align-items:center;justify-content:center;}
.lb.open{display:flex;}
.lb-x{position:absolute;top:14px;right:14px;color:#fff;font-size:18px;cursor:pointer;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.12);display:flex;align-items:center;justify-content:center;}
.lb img,.lb video{max-width:80vw;max-height:62vh;border-radius:7px;}
.lb-btn{padding:6px 12px;border-radius:6px;border:1px solid rgba(255,255,255,.25);background:transparent;color:#fff;cursor:pointer;font-size:12px;text-decoration:none;display:inline-flex;align-items:center;font-family:inherit;}
.lb-comment-box{background:rgba(0,0,0,.6);border-radius:9px;padding:12px;width:min(400px,86vw);margin-top:10px;}
.lb-comment-input{width:100%;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.2);border-radius:6px;padding:7px 9px;color:#fff;font-size:12px;outline:none;font-family:inherit;resize:none;}
.lb-comment-item{background:rgba(255,255,255,.08);border-radius:6px;padding:7px 9px;margin-bottom:5px;font-size:11px;color:#e0e0e0;}
@media(max-width:700px){
  .portal-sb{display:none;}
}
`

// ─── Portal HTML (only what the creator needs) ────────────────────────────
const PORTAL_HTML = `
<div class="portal" id="creator-portal">
  <div class="portal-topbar">
    <div style="font-size:14px;font-weight:700">🎨 Creator Portal</div>
    <div style="font-size:11px;color:var(--muted);margin-left:8px" id="portal-user-label">Angemeldet</div>
    <div style="margin-left:auto;display:flex;gap:8px;align-items:center">
      <button class="btn btn-sm" id="portal-logout-btn">⏻ Abmelden</button>
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
        <div class="ni" id="pni-lernvideos" style="padding-left:20px"><span class="ni-ico">🎬</span>Lernvideos</div>
      </div>
    </div>
    <div class="portal-main" id="portal-main">
      <div class="empty">⏳ Wird geladen...</div>
    </div>
  </div>
</div>
<!-- LIGHTBOX -->
<div class="lb" id="lb">
  <div class="lb-x" id="lb-x">✕</div>
  <img id="lb-img" style="display:none" alt="">
  <video id="lb-vid" controls style="display:none"></video>
  <div style="color:#fff;margin-top:9px;text-align:center">
    <div style="font-size:13px;font-weight:600;margin-bottom:2px" id="lb-name"></div>
    <div style="font-size:10px;opacity:.6" id="lb-meta"></div>
  </div>
  <div style="display:flex;gap:7px;margin-top:9px">
    <a id="lb-dl" class="lb-btn" download>⬇ Download</a>
    <button class="lb-btn" id="lb-close">✕ Schließen</button>
  </div>
  <div class="lb-comment-box">
    <div style="font-size:11px;font-weight:600;color:#fff;margin-bottom:7px">💬 Kommentare</div>
    <div id="lb-comments-list" style="max-height:100px;overflow-y:auto;margin-bottom:7px"></div>
    <div style="display:flex;gap:6px">
      <textarea class="lb-comment-input" id="lb-comment-inp" rows="1" placeholder="Kommentar schreiben..."></textarea>
      <button class="lb-btn" id="lb-comment-send" style="flex-shrink:0;font-size:11px">Senden</button>
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

// ─── Isolated Portal JS (NO admin DOM references) ─────────────────────────
const PORTAL_JS = `
(function() {
  // Safe element getter - never throws
  function G(id) {
    return document.getElementById(id) || {
      addEventListener: function(){},
      removeEventListener: function(){},
      querySelector: function(){ return null; },
      querySelectorAll: function(){ return []; },
      classList: { add:function(){}, remove:function(){}, toggle:function(){}, contains:function(){ return false; } },
      style: {},
      innerHTML: '',
      textContent: '',
      value: '',
      disabled: false,
      src: '',
      href: '',
      download: '',
      files: []
    };
  }

  let _id = 2000;
  function uid() { return ++_id; }

  function showT(m, dur) {
    dur = dur || 2600;
    var t = document.getElementById('toast');
    if (!t) return;
    t.textContent = m;
    t.classList.add('show');
    setTimeout(function(){ t.classList.remove('show'); }, dur);
  }

  // ── PORTAL STATE ────────────────────────────────────────────────────────
  var _creator = null;
  var _contentHub = { cats: ['Briefings', 'Skripte', 'Lernvideos'], items: [] };
  var _activeLbFile = null;

  // ── INIT ────────────────────────────────────────────────────────────────
  function initPortal(creator, token) {
    _creator = creator;

    // Set user label
    var label = document.getElementById('portal-user-label');
    if (label) label.innerHTML = 'Angemeldet als: <strong>' + (creator.name || 'Creator') + '</strong>';

    // Load creator data from API
    loadCreatorData(creator.id, token);
    loadContentHub(token);

    // Nav listeners
    var navItems = document.querySelectorAll('.ni[id^="pni-"]');
    navItems.forEach(function(n) {
      n.addEventListener('click', function() {
        renderPortalPage(n.id.replace('pni-', ''));
      });
    });

    // Lightbox listeners
    var lbX = document.getElementById('lb-x');
    var lbClose = document.getElementById('lb-close');
    if (lbX) lbX.addEventListener('click', closeLB);
    if (lbClose) lbClose.addEventListener('click', closeLB);
    var lb = document.getElementById('lb');
    if (lb) lb.addEventListener('click', function(e) { if (e.target === lb) closeLB(); });

    // Comment send
    var commentSend = document.getElementById('lb-comment-send');
    var commentInp = document.getElementById('lb-comment-inp');
    if (commentSend) commentSend.addEventListener('click', sendComment);
    if (commentInp) commentInp.addEventListener('keydown', function(e) {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendComment(); }
    });

    // Modal
    var modalCancel = document.getElementById('modal-cancel');
    var modalBg = document.getElementById('modal-bg');
    if (modalCancel) modalCancel.addEventListener('click', closeModal);
    if (modalBg) modalBg.addEventListener('click', function(e) {
      if (e.target === modalBg) closeModal();
    });

    // Logout
    var logoutBtn = document.getElementById('portal-logout-btn');
    if (logoutBtn) logoutBtn.addEventListener('click', function() {
      if (confirm('Wirklich abmelden?')) {
        localStorage.removeItem('creator_token');
        localStorage.removeItem('creator');
        window.location.href = '/creator';
      }
    });

    // Render home
    renderPortalPage('home');
    
    // Expose on window for React
    window.renderPortalPage = renderPortalPage;
    window.openPortal = function(cid) { renderPortalPage('home'); };
  }

  // ── API CALLS ────────────────────────────────────────────────────────────
  function loadCreatorData(creatorId, token) {
    if (!creatorId || !token) return;
    // Load folders
    fetch('/api/folders?creatorId=' + String(creatorId), {
      headers: { 'Authorization': 'Bearer ' + token }
    }).then(function(r) { return r.json(); }).then(function(folders) {
      if (!Array.isArray(folders)) return;
      if (!_creator.flds) _creator.flds = { bilder: [], videos: [], roh: [], auswertung: [] };
      folders.forEach(function(f) {
        var tab = f.tab || 'bilder';
        if (!_creator.flds[tab]) _creator.flds[tab] = [];
        if (!_creator.flds[tab].find(function(x) { return String(x.id) === String(f.id); })) {
          _creator.flds[tab].push({
            id: f.id, name: f.name, batch: f.batch || '',
            date: f.date || new Date().toISOString().slice(0,10),
            deadline: f.deadline || '', prods: f.prods || [],
            tags: f.tags || [], files: []
          });
        }
      });
      // Then load uploads
      return fetch('/api/uploads?creatorId=' + String(creatorId), {
        headers: { 'Authorization': 'Bearer ' + token }
      });
    }).then(function(r) {
      if (!r) return null;
      return r.json();
    }).then(function(uploads) {
      if (!Array.isArray(uploads)) return;
      var tabMap = { bilder:'bilder', videos:'videos', roh:'roh', auswertung:'auswertung', pdf:'bilder', link:'bilder', file:'bilder' };
      uploads.forEach(function(u) {
        var tab = tabMap[u.tab] || 'bilder';
        if (!_creator.flds[tab]) _creator.flds[tab] = [];
        var fld = _creator.flds[tab].find(function(f) { return f.id === '__db_uploads__'; });
        if (!fld) {
          fld = { id: '__db_uploads__', name: 'Meine Uploads', batch: 'Upload', date: new Date().toISOString().slice(0,10), deadline: null, prods: [], tags: [], files: [] };
          _creator.flds[tab].unshift(fld);
        }
        if (!fld.files.find(function(f) { return f.id === u.id; })) {
          fld.files.push({
            id: u.id, name: u.file_name, type: u.file_type,
            url: u.file_url, size: u.file_size ? (u.file_size/1024/1024).toFixed(1)+' MB' : '',
            uploadedAt: null, comments: [], r2Key: u.r2_key
          });
        }
      });
      // Re-render if on home
      var homeActive = document.querySelector('#pni-home.on');
      if (homeActive) renderPortalPage('home');
    }).catch(function(e) {
      console.warn('[Portal] loadCreatorData error:', e);
    });
  }

  function loadContentHub(token) {
    fetch('/api/app-data', { headers: { 'Authorization': 'Bearer ' + token } })
      .then(function(r) { return r.json(); })
      .then(function(data) {
        if (data && data.contentHub) _contentHub = data.contentHub;
      }).catch(function(){});
  }

  // ── PORTAL PAGES ─────────────────────────────────────────────────────────
  function renderPortalPage(page) {
    // Update nav
    document.querySelectorAll('.ni[id^="pni-"]').forEach(function(n) {
      n.classList.remove('on');
    });
    var activeNav = document.getElementById('pni-' + page);
    if (activeNav) activeNav.classList.add('on');
    // Also handle sub-nav for tips
    if (page === 'briefings' || page === 'skripte' || page === 'lernvideos') {
      var tips = document.getElementById('pni-tips');
      if (tips) tips.classList.add('on');
    }

    var main = document.getElementById('portal-main');
    if (!main) return;
    var c = _creator;
    if (!c) { main.innerHTML = '<div class="empty">Kein Creator gefunden</div>'; return; }
    if (!c.flds) c.flds = { bilder: [], videos: [], roh: [], auswertung: [] };

    if (page === 'home') renderHome(main, c);
    else if (page === 'upload') renderUpload(main, c);
    else if (page === 'tips') renderTips(main);
    else if (page === 'briefings') renderTipCategory(main, 'Briefings');
    else if (page === 'skripte') renderTipCategory(main, 'Skripte');
    else if (page === 'lernvideos') renderTipCategory(main, 'Lernvideos');
  }

  // ── HOME PAGE ────────────────────────────────────────────────────────────
  function renderHome(main, c) {
    var allFlds = Object.values(c.flds).flat();
    var tf = allFlds.reduce(function(s,f){ return s + f.files.length; }, 0);
    var tu = allFlds.reduce(function(s,f){ return s + f.files.filter(function(x){ return x.uploadedAt; }).length; }, 0);
    var note = c.notizenCreator || c.notizen_creator || '';

    main.innerHTML = [
      '<div class="ph"><div>',
      '<div style="font-size:13px;color:var(--muted);margin-bottom:2px">Willkommen zurück 👋</div>',
      '<div class="ph-t">Hallo ' + (c.name || 'Creator').split(' ')[0] + ', schön dass du da bist!</div>',
      '</div></div>',
      '<div class="stat-row" style="grid-template-columns:repeat(3,1fr)">',
      '<div class="sc"><div class="sl">Meine Ordner</div><div class="sv">' + allFlds.length + '</div></div>',
      '<div class="sc"><div class="sl">Dateien gesamt</div><div class="sv">' + tf + '</div></div>',
      '<div class="sc"><div class="sl">Hochgeladen</div><div class="sv" style="color:var(--grn)">' + tu + '</div></div>',
      '</div>',
      note ? '<div style="background:#eff6ff;border:1px solid #93c5fd;border-radius:9px;padding:12px 14px;margin-bottom:13px;font-size:12px;color:#1e40af"><strong>💬 Hinweis vom Team:</strong><br>' + note + '</div>' : '',
      '<div class="tabs" id="portal-tabs" style="margin-bottom:11px">',
      '<div class="tab on" data-pt="bilder">🖼️ Bilder</div>',
      '<div class="tab" data-pt="videos">🎬 Videos</div>',
      '<div class="tab" data-pt="roh">📹 Rohmaterial</div>',
      '<div class="tab" data-pt="auswertung">📊 Auswertungen</div>',
      '</div>',
      '<div class="fg-grid" id="portal-fld-grid"></div>'
    ].join('');

    // Tab listeners
    var tabs = main.querySelectorAll('#portal-tabs .tab');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        tabs.forEach(function(t){ t.classList.remove('on'); });
        tab.classList.add('on');
        renderFolderGrid(c, tab.dataset.pt);
      });
    });
    renderFolderGrid(c, 'bilder');
  }

  function renderFolderGrid(c, tab) {
    var grid = document.getElementById('portal-fld-grid');
    if (!grid) return;
    var ico = { bilder:'🖼️', videos:'🎬', roh:'📹', auswertung:'📊' };
    var flds = (c.flds[tab] || []).map(function(f, i) { return Object.assign({}, f, { tab: tab, _idx: i }); });

    grid.innerHTML = flds.map(function(f, i) {
      var d = new Date(f.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});
      return '<div class="fcard" data-pfi="' + i + '">' +
        '<div style="font-size:18px;margin-bottom:5px">' + (ico[tab]||'📁') + '</div>' +
        '<div style="font-size:11px;font-weight:600">' + f.name + '</div>' +
        '<div style="font-size:10px;color:var(--muted);line-height:1.5">📅 ' + d + '<br>📁 ' + f.files.length + ' Dateien</div>' +
        '</div>';
    }).join('') +
    '<div class="add-fcard" id="portal-new-fld-btn" style="min-height:90px"><div style="font-size:16px">📁</div><span style="font-size:10px;font-weight:500">Neuer Ordner</span></div>';

    grid.querySelectorAll('[data-pfi]').forEach(function(card, i) {
      card.addEventListener('click', function() { openFolderView(flds[i]); });
    });
    var newFldBtn = document.getElementById('portal-new-fld-btn');
    if (newFldBtn) newFldBtn.addEventListener('click', function() {
      renderPortalPage('upload');
      setTimeout(function() {
        var sel = document.getElementById('portal-fld-sel');
        if (sel) { sel.value = 'new'; sel.dispatchEvent(new Event('change')); }
      }, 50);
    });
  }

  function openFolderView(fldWithTab) {
    var c = _creator;
    if (!c) return;
    var tab = fldWithTab.tab;
    var realFld = (c.flds[tab] || []).find(function(f) { return String(f.id) === String(fldWithTab.id); });
    if (!realFld) return;

    var main = document.getElementById('portal-main');
    if (!main) return;
    var ico = { bilder:'🖼️', videos:'🎬', roh:'📹', auswertung:'📊' };
    var d = new Date(realFld.date).toLocaleDateString('de-DE',{day:'2-digit',month:'short',year:'numeric'});

    main.innerHTML = [
      '<button class="bk" id="portal-bk-fld">← Zurück zu Ordnern</button>',
      '<div style="background:var(--surf);border:1px solid var(--bdr);border-radius:9px;padding:12px 15px;margin-bottom:13px;display:flex;align-items:center;gap:10px">',
      '<div style="font-size:26px">' + (ico[tab]||'📁') + '</div>',
      '<div style="flex:1">',
      '<div style="font-size:13px;font-weight:700">' + realFld.name + '</div>',
      '<div style="font-size:10px;color:var(--muted)">📅 ' + d + ' · ' + realFld.files.length + ' Dateien</div>',
      '</div>',
      '<button class="btn btn-p btn-sm" id="portal-upload-here">+ Hochladen</button>',
      '</div>',
      '<div class="file-grid" id="portal-file-grid"></div>'
    ].join('');

    var bk = document.getElementById('portal-bk-fld');
    if (bk) bk.addEventListener('click', function() { renderPortalPage('home'); });

    var uploadHere = document.getElementById('portal-upload-here');
    if (uploadHere) uploadHere.addEventListener('click', function() {
      renderPortalPage('upload');
      setTimeout(function() {
        var sel = document.getElementById('portal-fld-sel');
        if (sel) {
          for (var i = 0; i < sel.options.length; i++) {
            if (sel.options[i].value === String(realFld.id) + ':' + tab) {
              sel.selectedIndex = i;
              break;
            }
          }
        }
      }, 50);
    });

    renderFileGrid(realFld);
  }

  function renderFileGrid(fld) {
    var fg = document.getElementById('portal-file-grid');
    if (!fg) return;
    if (!fld.files.length) {
      fg.innerHTML = '<div class="empty" style="grid-column:1/-1"><div>📂</div><div style="margin:5px 0 10px">Noch keine Dateien</div><button class="btn btn-p" id="portal-upload-empty">+ Hochladen</button></div>';
      var btn = document.getElementById('portal-upload-empty');
      if (btn) btn.addEventListener('click', function() { renderPortalPage('upload'); });
      return;
    }
    fg.innerHTML = fld.files.map(function(f, fi) {
      var isI = f.type === 'image', isV = f.type === 'video';
      var th = f.url ? (isI ? '<img src="' + f.url + '">' : '<video src="' + f.url + '" preload="metadata"></video>') : '<span>' + (isI?'🖼️':isV?'🎬':'📄') + '</span>';
      var pov = isV ? '<div class="play-ov"><div class="play-btn">▶</div></div>' : '';
      var cnt = (f.comments || []).length;
      var cBadge = cnt ? '<div class="fi-comment-badge">' + cnt + '</div>' : '';
      return '<div class="ficard">' +
        '<div class="fi-thumb" data-pf="' + fi + '">' + th + pov + cBadge + '</div>' +
        '<div class="fi-info">' +
        '<div class="fi-name">' + f.name + '</div>' +
        '<div class="fi-meta">' + (f.size||'') + '</div>' +
        (f.uploadedAt ? '<div style="font-size:9px;color:var(--grn)">✓ Hochgeladen</div>' : '') +
        '</div></div>';
    }).join('') +
    '<div class="add-fcard" style="min-height:100px" id="portal-add-file"><div>+</div><span style="font-size:10px">Hochladen</span></div>';

    fg.querySelectorAll('[data-pf]').forEach(function(thumb, fi) {
      thumb.addEventListener('click', function() { openLB(fld.files[fi], fld.name); });
    });
    var addBtn = document.getElementById('portal-add-file');
    if (addBtn) addBtn.addEventListener('click', function() { renderPortalPage('upload'); });
  }

  // ── UPLOAD PAGE ──────────────────────────────────────────────────────────
  function renderUpload(main, c) {
    var fldOptions = Object.entries(c.flds || {}).flatMap(function(entry) {
      var tab = entry[0], flds = entry[1];
      var tabNames = { bilder:'Bilder', videos:'Videos', roh:'Rohmaterial', auswertung:'Auswertungen' };
      return flds.map(function(f) {
        return '<option value="' + f.id + ':' + tab + '">' + f.name + ' (' + (tabNames[tab]||tab) + ')</option>';
      });
    }).join('');

    main.innerHTML = [
      '<div class="ph"><div class="ph-t">Inhalte hochladen</div></div>',
      '<div class="sc" style="padding:18px;margin-bottom:14px">',
      '<div style="font-size:13px;font-weight:600;margin-bottom:4px">📤 Neue Datei hochladen</div>',
      '<div style="font-size:12px;color:var(--muted);margin-bottom:14px">Lade deine Bilder und Videos direkt hier hoch. Das Team sieht sie sofort.</div>',
      '<div class="fg"><label class="fl">Ordner wählen</label>',
      '<select class="fi" id="portal-fld-sel">',
      '<option value="new">+ Neuen Ordner erstellen...</option>',
      fldOptions,
      '</select></div>',
      '<div id="portal-new-fld-wrap" style="display:none;background:var(--lt);border-radius:8px;padding:10px;border:1px solid var(--bdr);margin-bottom:8px">',
      '<div style="font-size:11px;font-weight:600;margin-bottom:8px;color:var(--muted)">Neuer Ordner</div>',
      '<div class="fg"><label class="fl">Ordner-Name *</label><input class="fi" id="portal-new-fld-name" placeholder="z.B. Sommer Lookbook 2025"></div>',
      '<div class="fg"><label class="fl">Kategorie</label><select class="fi" id="portal-new-fld-tab">',
      '<option value="bilder">🖼️ Bilder</option>',
      '<option value="videos">🎬 Videos</option>',
      '<option value="roh">📹 Rohmaterial</option>',
      '<option value="auswertung">📊 Auswertungen</option>',
      '</select></div></div>',
      '<div class="fg"><label class="fl">Bezeichnung der Datei *</label><input class="fi" id="portal-fname" placeholder="z.B. Lookbook Shot 01"></div>',
      '<div class="dz" id="portal-dz">',
      '<div id="portal-dz-inner"><div style="font-size:22px;margin-bottom:4px">📂</div>',
      '<div style="font-size:12px;font-weight:500">Klicken oder Datei hierher ziehen</div></div>',
      '</div>',
      '<input type="file" id="portal-file" accept="image/*,video/*" style="display:none">',
      '<div id="portal-prog" style="display:none;margin-top:8px">',
      '<div id="portal-ps" style="font-size:10px;margin-bottom:3px">Upload...</div>',
      '<div class="prog-track"><div class="prog-fill" id="portal-pb"></div></div></div>',
      '<button class="btn btn-p" style="width:100%;margin-top:12px" id="portal-upload-btn">Hochladen →</button>',
      '</div>'
    ].join('');

    var sel = document.getElementById('portal-fld-sel');
    var wrap = document.getElementById('portal-new-fld-wrap');
    var dz = document.getElementById('portal-dz');
    var fileInput = document.getElementById('portal-file');
    var uploadBtn = document.getElementById('portal-upload-btn');

    if (sel && wrap) sel.addEventListener('change', function() {
      wrap.style.display = sel.value === 'new' ? 'block' : 'none';
    });

    if (dz && fileInput) {
      dz.addEventListener('click', function() { fileInput.click(); });
      dz.addEventListener('dragover', function(e) { e.preventDefault(); dz.classList.add('done'); });
      dz.addEventListener('drop', function(e) {
        e.preventDefault();
        var f = e.dataTransfer.files[0];
        if (f) { var dt = new DataTransfer(); dt.items.add(f); fileInput.files = dt.files; previewFile(f); }
      });
      fileInput.addEventListener('change', function() {
        if (fileInput.files[0]) previewFile(fileInput.files[0]);
      });
    }

    if (uploadBtn) uploadBtn.addEventListener('click', function() { doUpload(c); });
  }

  function previewFile(f) {
    var dzInner = document.getElementById('portal-dz-inner');
    var dz = document.getElementById('portal-dz');
    if (!dzInner) return;
    var sz = (f.size/1024/1024).toFixed(1);
    dzInner.innerHTML = '<div style="display:flex;align-items:center;gap:8px">' +
      '<div style="font-size:22px">' + (f.type.startsWith('image/')? '🖼️':'🎬') + '</div>' +
      '<div><div style="font-size:12px;font-weight:500">' + f.name + '</div>' +
      '<div style="font-size:10px;color:var(--muted)">' + sz + ' MB</div></div>' +
      '<span style="margin-left:auto;color:var(--grn)">✓</span></div>';
    if (dz) dz.classList.add('done');
  }

  function doUpload(c) {
    var sel = document.getElementById('portal-fld-sel');
    var nameInp = document.getElementById('portal-fname');
    var fileInput = document.getElementById('portal-file');
    var prog = document.getElementById('portal-prog');
    var pb = document.getElementById('portal-pb');
    var ps = document.getElementById('portal-ps');
    var uploadBtn = document.getElementById('portal-upload-btn');

    if (!sel || !nameInp) return;
    var name = nameInp.value.trim();
    if (!name) { showT('Bitte Bezeichnung ausfüllen'); return; }
    var file = fileInput && fileInput.files[0];
    if (!file) { showT('Bitte Datei auswählen'); return; }

    var fld = null, tab = 'bilder';
    if (sel.value === 'new') {
      var fldName = (document.getElementById('portal-new-fld-name') || {value:''}).value.trim();
      var fldTab = (document.getElementById('portal-new-fld-tab') || {value:'bilder'}).value || 'bilder';
      if (!fldName) { showT('Bitte Ordner-Namen eingeben'); return; }
      tab = fldTab;
      var newFld = { id: uid(), name: fldName, batch: fldName, date: new Date().toISOString().slice(0,10), deadline: '', prods: [], tags: [], files: [] };
      if (!c.flds[tab]) c.flds[tab] = [];
      c.flds[tab].push(newFld);
      fld = newFld;
      var token = localStorage.getItem('creator_token') || localStorage.getItem('token') || '';
      fetch('/api/folders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
        body: JSON.stringify({ creator_id: String(c.id), tab: tab, name: fldName, batch: fldName, date: new Date().toISOString().slice(0,10) })
      }).then(function(r){ return r.json(); }).then(function(d){ if (d.id) newFld.id = d.id; }).catch(function(){});
      showT('Ordner "' + fldName + '" erstellt ✓');
    } else {
      var parts = sel.value.split(':');
      var fldId = parts[0]; tab = parts[1] || 'bilder';
      fld = (c.flds[tab] || []).find(function(f) { return String(f.id) === String(fldId); });
      if (!fld) { showT('Ordner nicht gefunden'); return; }
    }

    var token = localStorage.getItem('creator_token') || localStorage.getItem('token') || '';
    if (uploadBtn) uploadBtn.disabled = true;
    if (prog) prog.style.display = 'block';
    if (ps) ps.textContent = 'Wird hochgeladen...';

    var fd = new FormData();
    fd.append('file', file);
    fd.append('creatorId', String(c.id));
    fd.append('tab', tab);

    var xhr = new XMLHttpRequest();
    xhr.open('POST', '/api/upload');
    xhr.setRequestHeader('Authorization', 'Bearer ' + token);
    xhr.upload.onprogress = function(e) {
      if (e.lengthComputable && pb && ps) {
        var p = Math.round(e.loaded / e.total * 100);
        pb.style.width = p + '%';
        ps.textContent = 'Upload: ' + p + '%';
      }
    };
    xhr.onload = function() {
      try {
        var d = JSON.parse(xhr.responseText);
        if (xhr.status !== 200) {
          showT('Fehler: ' + (d.error || 'Upload fehlgeschlagen'));
          if (uploadBtn) uploadBtn.disabled = false;
          return;
        }
        if (pb) pb.style.background = 'var(--grn)';
        if (ps) ps.textContent = '✓ Gespeichert!';
        var ft = file.type.startsWith('image/') ? 'image' : file.type.startsWith('video/') ? 'video' : 'file';
        var nf = {
          id: (d.upload && d.upload.id) || uid(),
          name: name, type: ft,
          url: (d.upload && d.upload.file_url) || d.url,
          size: (file.size/1024/1024).toFixed(1) + ' MB',
          uploadedAt: null, comments: [],
          r2Key: (d.upload && d.upload.r2_key) || null
        };
        fld.files.push(nf);
        showT('"' + name + '" hochgeladen ✓');
        setTimeout(function() { renderPortalPage('upload'); if (uploadBtn) uploadBtn.disabled = false; }, 500);
      } catch(e) {
        showT('Fehler beim Verarbeiten der Antwort');
        if (uploadBtn) uploadBtn.disabled = false;
      }
    };
    xhr.onerror = function() {
      showT('Netzwerkfehler');
      if (uploadBtn) uploadBtn.disabled = false;
    };
    xhr.send(fd);
  }

  // ── TIPS PAGES ────────────────────────────────────────────────────────────
  function renderTips(main) {
    var cats = _contentHub.cats || ['Briefings', 'Skripte', 'Lernvideos'];
    var catIcons = { 'Briefings':'📋', 'Skripte':'📝', 'Lernvideos':'🎬' };
    main.innerHTML = '<div class="ph"><div class="ph-t">💡 Tipps & Tricks</div></div>' +
      '<div style="font-size:12px;color:var(--muted);margin-bottom:20px">Alle Inhalte die dein Team für dich bereitgestellt hat.</div>' +
      '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px">' +
      cats.map(function(cat) {
        var count = (_contentHub.items || []).filter(function(x){ return x.cat === cat; }).length;
        return '<div class="tip-card" data-tipcat="' + cat + '">' +
          '<div style="font-size:28px;margin-bottom:10px">' + (catIcons[cat]||'📁') + '</div>' +
          '<div style="font-size:15px;font-weight:600;margin-bottom:4px">' + cat + '</div>' +
          '<div style="font-size:11px;color:var(--muted)">' + count + ' Inhalt' + (count!==1?'e':'') + '</div>' +
          '</div>';
      }).join('') + '</div>';

    main.querySelectorAll('[data-tipcat]').forEach(function(card) {
      card.addEventListener('click', function() { renderTipCategory(main, card.dataset.tipcat); });
    });
  }

  function renderTipCategory(main, cat) {
    var catIcons = { 'Briefings':'📋', 'Skripte':'📝', 'Lernvideos':'🎬' };
    var items = (_contentHub.items || []).filter(function(x){ return x.cat === cat; });
    main.innerHTML = '<button class="bk" id="tips-back">← Zurück zu Tipps</button>' +
      '<div class="ph"><div class="ph-t">' + (catIcons[cat]||'📁') + ' ' + cat + '</div></div>' +
      (items.length ? items.map(function(item) {
        var typeIcon = item.type === 'video' ? '🎬' : item.type === 'pdf' ? '📄' : item.type === 'link' ? '🔗' : '📎';
        return '<div class="sc" style="padding:16px;margin-bottom:10px">' +
          '<div style="display:flex;align-items:center;gap:10px;margin-bottom:8px">' +
          '<span style="font-size:22px">' + typeIcon + '</span>' +
          '<div><div style="font-size:14px;font-weight:600">' + item.title + '</div>' +
          (item.desc ? '<div style="font-size:12px;color:var(--muted);margin-top:2px">' + item.desc + '</div>' : '') +
          '</div></div>' +
          (item.url ? '<a href="' + item.url + '" target="_blank" class="btn btn-p btn-sm">Öffnen ↗</a>' : '') +
          (item.file ? '<a href="' + item.file + '" download class="btn btn-sm" style="margin-left:6px">⬇ Download</a>' : '') +
          '</div>';
      }).join('') : '<div class="empty">Noch keine Inhalte in dieser Kategorie</div>');

    var backBtn = document.getElementById('tips-back');
    if (backBtn) backBtn.addEventListener('click', function() { renderPortalPage('tips'); });
  }

  // ── LIGHTBOX ─────────────────────────────────────────────────────────────
  function openLB(file, fldName) {
    _activeLbFile = file;
    var lb = document.getElementById('lb');
    var li = document.getElementById('lb-img');
    var lv = document.getElementById('lb-vid');
    var lbName = document.getElementById('lb-name');
    var lbMeta = document.getElementById('lb-meta');
    var lbDl = document.getElementById('lb-dl');
    if (!lb) return;
    if (lbName) lbName.textContent = file.name;
    if (lbMeta) lbMeta.textContent = (file.size || '') + ' · ' + (fldName || '');
    if (lbDl) { lbDl.href = file.url || '#'; lbDl.download = file.name; }
    if (li && lv) {
      if (file.type === 'image' && file.url) { li.src = file.url; li.style.display = 'block'; lv.style.display = 'none'; }
      else if (file.type === 'video' && file.url) { lv.src = file.url; lv.style.display = 'block'; li.style.display = 'none'; }
      else { li.style.display = 'none'; lv.style.display = 'none'; }
    }
    renderLbComments();
    lb.classList.add('open');
  }

  function closeLB() {
    var lb = document.getElementById('lb');
    var lv = document.getElementById('lb-vid');
    if (lb) lb.classList.remove('open');
    if (lv) { lv.pause(); lv.removeAttribute('src'); }
    _activeLbFile = null;
  }

  function renderLbComments() {
    var list = document.getElementById('lb-comments-list');
    if (!list || !_activeLbFile) return;
    var comments = _activeLbFile.comments || [];
    list.innerHTML = comments.length
      ? comments.map(function(c) { return '<div class="lb-comment-item">' + c + '</div>'; }).join('')
      : '<div style="font-size:10px;color:#666;text-align:center">Noch keine Kommentare</div>';
  }

  function sendComment() {
    var inp = document.getElementById('lb-comment-inp');
    if (!inp || !_activeLbFile) return;
    var txt = inp.value.trim();
    if (!txt) return;
    if (!_activeLbFile.comments) _activeLbFile.comments = [];
    _activeLbFile.comments.push(txt + ' – ' + new Date().toLocaleDateString('de-DE'));
    inp.value = '';
    renderLbComments();
    // Save comment to API
    var token = localStorage.getItem('creator_token') || localStorage.getItem('token') || '';
    fetch('/api/upload', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ uploadId: String(_activeLbFile.id), comment: txt })
    }).catch(function(){});
    showT('Kommentar gespeichert ✓');
  }

  // ── MODAL ─────────────────────────────────────────────────────────────────
  function closeModal() {
    var bg = document.getElementById('modal-bg');
    if (bg) bg.classList.remove('open');
  }

  // ── EXPOSE ────────────────────────────────────────────────────────────────
  window._portalInitFn = initPortal;

})();
`

function LoadingScreen() {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#f4f5f7',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 12, fontFamily: 'system-ui, sans-serif',
      zIndex: 99999
    }}>
      <div style={{ fontSize: 28 }}>⏳</div>
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
        padding: '44px 40px', width: '100%', maxWidth: 400, textAlign: 'center'
      }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🔗</div>
        <h2 style={{ fontSize: 20, fontWeight: 700, color: '#111', margin: '0 0 10px' }}>
          Link ungültig oder abgelaufen
        </h2>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, margin: '0 0 28px' }}>
          Bitte fordere einen neuen Link bei deinem Filapen-Team an.
        </p>
        <button onClick={onRetry} style={{
          width: '100%', background: '#111', color: '#fff', fontWeight: 600,
          fontSize: 15, padding: '13px 0', borderRadius: 10, border: 'none', cursor: 'pointer'
        }}>
          Neuen Link anfordern
        </button>
      </div>
    </div>
  )
}

export async function getServerSideProps() {
  return { props: {} }
}

export default function CreatorPortalPage() {
  const router = useRouter()
  const containerRef = useRef<HTMLDivElement>(null)
  const styleRef = useRef<HTMLStyleElement | null>(null)
  const [authState, setAuthState] = useState<AuthState>('checking')
  const [creatorData, setCreatorData] = useState<any>(null)
  const jsInitialized = useRef(false)
  const authInitialized = useRef(false)

  // Step 1: Auth check
  useEffect(() => {
    function runAuth() {
      if (authInitialized.current) return
      authInitialized.current = true

      const urlParams = new URLSearchParams(window.location.search)
      const urlCode = urlParams.get('code') || (router.query.code as string) || ''
      const storedToken = localStorage.getItem('creator_token')
      const storedCreator = localStorage.getItem('creator')

      if (urlCode) {
        verifyCode(urlCode)
      } else if (storedToken && storedCreator) {
        try {
          const creator = JSON.parse(storedCreator)
          setCreatorData(creator)
          setAuthState('auth_ready')
        } catch {
          clearSession()
          setAuthState('error')
        }
      } else {
        setAuthState('error')
      }
    }

    if (router.isReady) { runAuth() }
    else { const t = setTimeout(runAuth, 300); return () => clearTimeout(t) }
  }, [])

  async function verifyCode(code: string) {
    try {
      const res = await fetch('/api/auth/creator-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: code.trim().toUpperCase() })
      })
      const data = await res.json()
      if (!res.ok || !data.creator) { setAuthState('error'); return }
      localStorage.setItem('creator_token', data.token)
      localStorage.setItem('creator', JSON.stringify(data.creator))
      setCreatorData(data.creator)
      setAuthState('auth_ready')
      router.replace('/creator-portal', undefined, { shallow: true })
    } catch {
      setAuthState('error')
    }
  }

  function clearSession() {
    localStorage.removeItem('creator_token')
    localStorage.removeItem('creator')
  }

  // Step 2: Mount portal after auth
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

    // Inject HTML
    containerRef.current.innerHTML = PORTAL_HTML

    // Execute isolated portal JS
    try {
      const fn = new Function(PORTAL_JS)
      fn()
    } catch (e) {
      console.error('[CreatorPortal] JS init error:', e)
      setAuthState('portal_error')
      return
    }

    // Call init function with creator data + token
    const w = window as any
    if (typeof w._portalInitFn !== 'function') {
      console.error('[CreatorPortal] _portalInitFn not found')
      setAuthState('portal_error')
      return
    }

    const token = localStorage.getItem('creator_token') || ''
    
    // Ensure creator has flds
    const creator = {
      ...creatorData,
      flds: creatorData.flds || { bilder: [], videos: [], roh: [], auswertung: [] }
    }

    try {
      w._portalInitFn(creator, token)
    } catch (e) {
      console.error('[CreatorPortal] initPortal error:', e)
      setAuthState('portal_error')
      return
    }

    setAuthState('portal_ready')

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

      {authState === 'error' && (
        <ErrorScreen onRetry={() => { window.location.href = '/creator' }} />
      )}

      {authState === 'portal_error' && (
        <div style={{ minHeight:'100vh', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'system-ui', padding:24 }}>
          <div style={{ textAlign:'center', maxWidth:400 }}>
            <div style={{ fontSize:40, marginBottom:16 }}>⚠️</div>
            <h2 style={{ fontSize:20, marginBottom:8 }}>Portal konnte nicht geladen werden</h2>
            <p style={{ color:'#888', marginBottom:20 }}>Bitte versuche es erneut oder wende dich an das Team.</p>
            <button onClick={() => window.location.reload()} style={{ padding:'12px 24px', background:'#111', color:'#fff', border:'none', borderRadius:8, cursor:'pointer' }}>
              Neu laden
            </button>
          </div>
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          width: '100vw', height: '100vh', overflow: 'hidden',
          visibility: authState === 'portal_ready' ? 'visible' : 'hidden',
          pointerEvents: authState === 'portal_ready' ? 'auto' : 'none'
        }}
      />
    </>
  )
}
