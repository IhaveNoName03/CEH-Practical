/* CEH Study Portal — shared app logic */
(function () {
  'use strict';

  const MODULES = [
    { id: '02', title: 'Footprinting and Reconnaissance', file: 'module_02.html' },
    { id: '03', title: 'Scanning Networks', file: 'module_03.html' },
    { id: '04', title: 'Enumeration', file: 'module_04.html' },
    { id: '05', title: 'Vulnerability Analysis', file: 'module_05.html' },
    { id: '06', title: 'System Hacking', file: 'module_06.html' },
    { id: '07', title: 'Malware Threats', file: 'module_07.html' },
    { id: '08', title: 'Sniffing', file: 'module_08.html' },
    { id: '09', title: 'Social Engineering', file: 'module_09.html' },
    { id: '10', title: 'Denial-of-Service', file: 'module_10.html' },
    { id: '11', title: 'Session Hijacking', file: 'module_11.html' },
    { id: '12', title: 'Evading IDS, Firewalls, and Honeypots', file: 'module_12.html' },
    { id: '13', title: 'Hacking Web Servers', file: 'module_13.html' },
    { id: '14', title: 'Hacking Web Applications', file: 'module_14.html' },
    { id: '15', title: 'SQL Injection', file: 'module_15.html' },
    { id: '16', title: 'Hacking Wireless Networks', file: 'module_16.html' },
    { id: '17', title: 'Hacking Mobile Platforms', file: 'module_17.html' },
    { id: '18', title: 'IoT and OT Hacking', file: 'module_18.html' },
    { id: '19', title: 'Cloud Computing', file: 'module_19.html' },
    { id: '20', title: 'Cryptography', file: 'module_20.html' }
    ];

  const visited = JSON.parse(localStorage.getItem('ceh_visited') || '[]');
  function markVisited() {
    const page = location.pathname.split('/').pop();
    const mod = MODULES.find(m => m.file === page);
    if (mod && !visited.includes(mod.id)) {
      visited.push(mod.id);
      localStorage.setItem('ceh_visited', JSON.stringify(visited));
    }
  }
  markVisited();

  // Module navigation dropdown (replaces crowded module list)
  const navEl2 = document.querySelector('nav');
  if (navEl2 && !document.getElementById('moduleSelect')) {
    const sel = document.createElement('select');
    sel.id = 'moduleSelect';
    sel.className = 'module-select';
    sel.setAttribute('aria-label', 'Navigate to module');
    const opts = [{ value: 'index.html', label: 'Home' }];
    MODULES.forEach(m => opts.push({ value: m.file, label: m.id + ' ' + m.title }));
    opts.push({ value: 'cheat_sheet.html', label: 'Cheat Sheet' });
    opts.forEach(o => {
      const opt = document.createElement('option');
      opt.value = o.value;
      opt.textContent = o.label;
      sel.appendChild(opt);
    });
    const page = location.pathname.split('/').pop() || 'index.html';
    sel.value = page;
    sel.addEventListener('change', () => {
      const t = (typeof currentTheme === 'function') ? currentTheme() : (localStorage.getItem('theme') || 'light');
      const url = sel.value + (t ? ('?theme=' + t) : '');
      window.location.href = url;
    });
    // insert before theme toggle
    const themeBtn = document.getElementById('themeToggle');
    if (themeBtn) navEl2.insertBefore(sel, themeBtn);
    else navEl2.appendChild(sel);
  }
  const navEl = document.querySelector('nav');
  const navToggle = document.getElementById('navToggle');

  // Build modern sidebar navigation
  if (!document.querySelector('.sidebar')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    document.body.appendChild(overlay);

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    const title = document.createElement('div');
    title.className = 'sidebar-title';
    title.textContent = 'MODULES';
    sidebar.appendChild(title);

    const homeLink = document.createElement('a');
    homeLink.href = 'index.html';
    homeLink.innerHTML = '<span class="mod-num">HM</span><span class="mod-title">Home</span>';
    if ((location.pathname.split('/').pop() || 'index.html') === 'index.html') homeLink.classList.add('active');
    sidebar.appendChild(homeLink);

    MODULES.forEach(m => {
      const a = document.createElement('a');
      a.href = m.file;
      a.innerHTML = `<span class="mod-num">${m.id}</span><span class="mod-title">${m.title}</span>`;
      const page = location.pathname.split('/').pop() || 'index.html';
      if (page === m.file) a.classList.add('active');
      sidebar.appendChild(a);
    });

    const cheatLink = document.createElement('a');
    cheatLink.href = 'cheat_sheet.html';
    cheatLink.innerHTML = '<span class="mod-num">CS</span><span class="mod-title">Cheat Sheet</span>';
    if ((location.pathname.split('/').pop() || '') === 'cheat_sheet.html') cheatLink.classList.add('active');
    sidebar.appendChild(cheatLink);

    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) document.body.classList.remove('sidebar-open');
    });

    document.body.appendChild(sidebar);
  }

  // Hamburger toggles sidebar drawer (mobile)
  if (navToggle && navEl) {
    navToggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('sidebar-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? '✕' : '☰';
    });
  }

  // Theme propagation across pages (URL param)
  function currentTheme() {
    try {
      const p = new URLSearchParams(location.search);
      const u = p.get('theme');
      if (u === 'dark' || u === 'light') return u;
    } catch (e) {}
    try { return localStorage.getItem('theme') || 'light'; } catch (e) { return 'light'; }
  }
  function withTheme(href) {
    try {
      const url = new URL(href, location.href);
      url.searchParams.set('theme', currentTheme());
      return url.pathname.split('/').pop() + '?' + url.searchParams.toString();
    } catch (e) { return href; }
  }
  // Compact view toggle
  const viewToggle = document.getElementById('viewToggle');
  if (viewToggle) {
    const applyView = (compact) => {
      document.body.classList.toggle('compact', compact);
      viewToggle.classList.toggle('active', compact);
      viewToggle.textContent = compact ? 'FULL VIEW' : 'COMPACT';
      try { localStorage.setItem('ceh_compact', compact ? '1' : '0'); } catch (e) {}
    };
    let compact = true;
    try { const stored = localStorage.getItem('ceh_compact'); if (stored !== null) compact = stored === '1'; } catch (e) {}
    const isCheatSheet = (location.pathname.split('/').pop() || '') === 'cheat_sheet.html';
    if (isCheatSheet) compact = false;
    applyView(compact);
    viewToggle.addEventListener('click', () => {
      applyView(!document.body.classList.contains('compact'));
    });
  }

  document.querySelectorAll('pre').forEach(pre => {
    const btn = document.createElement('button');
    btn.className = 'copy-btn';
    btn.textContent = 'Copy';
    btn.addEventListener('click', () => {
      const code = pre.querySelector('code') ? pre.querySelector('code').innerText : pre.innerText;
      navigator.clipboard.writeText(code).then(() => {
        btn.textContent = 'Copied!';
        setTimeout(() => (btn.textContent = 'Copy'), 1400);
      }).catch(() => {
        btn.textContent = 'Failed';
        setTimeout(() => (btn.textContent = 'Copy'), 1400);
      });
    });
    pre.style.position = 'relative';
    pre.appendChild(btn);
  });

  // Table of contents
  const main = document.querySelector('main.content-body, main');
  const headings = main ? Array.from(main.querySelectorAll('h3')) : [];
  if (headings.length > 2) {
    const toc = document.createElement('aside');
    toc.className = 'toc';
    toc.innerHTML = '<details open><summary class="toc-title">On this page</summary><ul>' +
      headings.map(h => {
        if (!h.id) h.id = 'h-' + h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<li><a href="#${h.id}">${h.textContent.trim()}</a></li>`;
      }).join('') + '</ul></details>';
    // Insert as first child of main (contents block)
    if (main && main.firstChild) main.insertBefore(toc, main.firstChild);
    else if (main) main.appendChild(toc);
  }

  // Prev / Next navigation
  if (main) {
    const page = location.pathname.split('/').pop();
    const idx = MODULES.findIndex(m => m.file === page);
    if (idx >= 0) {
      const nav = document.createElement('div');
      nav.className = 'mod-nav';
      const prev = idx > 0 ? `<a class="mod-nav-btn" href="${withTheme(MODULES[idx-1].file)}">← Module ${MODULES[idx-1].id}</a>` : '<span></span>';
      const next = idx < MODULES.length - 1 ? `<a class="mod-nav-btn" href="${withTheme(MODULES[idx+1].file)}">Module ${MODULES[idx+1].id} →</a>` : '<span></span>';
      nav.innerHTML = prev + next;
      main.appendChild(nav);
    }
  }

  // Reveal on scroll
  const revealTargets = document.querySelectorAll('.section-card, .lab-task, .tool-card');
  revealTargets.forEach(el => el.classList.add('reveal'));
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); revealObs.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -5% 0px', threshold: 0 });
  revealTargets.forEach(el => revealObs.observe(el));
  // Fallback: ensure nothing stays invisible if observer doesn't fire
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 800);

  // Active TOC highlighting
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    const headingEls = headings;
    const activeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.toc a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    headingEls.forEach(h => activeObs.observe(h));
  }

  // Back to top
  const btt = document.createElement('button');
  btt.className = 'back-to-top';
  btt.textContent = '↑';
  btt.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  document.body.appendChild(btt);
  window.addEventListener('scroll', () => {
    btt.classList.toggle('visible', window.scrollY > 400);
  });

  const isCheat = (location.pathname.split('/').pop() || '') === 'cheat_sheet.html';

  // Search
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (isCheat) {
        // Filter code blocks on the cheat sheet
        const sections = document.querySelectorAll('main .lab-task');
        sections.forEach(sec => {
          const blocks = sec.querySelectorAll('pre');
          let any = false;
          blocks.forEach(pre => {
            const p = pre.previousElementSibling;
            const hay = ((p ? p.textContent : '') + ' ' + pre.textContent).toLowerCase();
            const match = !q || hay.includes(q);
            pre.style.display = match ? '' : 'none';
            if (p && p.tagName === 'P') p.style.display = match ? '' : 'none';
            if (match) any = true;
          });
          sec.style.display = (q && !any) ? 'none' : '';
        });
        return;
      }
      const overlay = document.getElementById('searchResults');
      if (!overlay) return;
      if (!q) { overlay.innerHTML = ''; overlay.classList.remove('open'); return; }
      const hits = MODULES.filter(m => m.title.toLowerCase().includes(q) || m.id.includes(q));
      overlay.innerHTML = hits.length
        ? hits.map(m => `<a href="${withTheme(m.file)}"><span class="sr-id">${m.id}</span> ${m.title}</a>`).join('')
        : '<div class="sr-empty">No modules match.</div>';
      overlay.classList.add('open');
    });
    if (!isCheat) {
      document.addEventListener('click', (e) => {
        if (!e.target.closest('.search-wrap')) {
          const overlay = document.getElementById('searchResults');
          if (overlay) overlay.classList.remove('open');
        }
      });
    }
  }

  // Cheat-sheet exam mode: phase filter pills + print
  if (isCheat) {
    const mainEl = document.querySelector('main.content-body, main');
    const firstSec = mainEl ? mainEl.querySelector('.lab-task') : null;
    if (mainEl && firstSec) {
      const bar = document.createElement('div');
      bar.className = 'cs-filter-bar';
      const phases = [
        { label: 'All', ids: null },
        { label: 'Recon', ids: ['02','03','04'] },
        { label: 'Vuln', ids: ['05'] },
        { label: 'Attacks', ids: ['06','07','08','09','10'] },
        { label: 'Advanced', ids: ['11','12','13','14','15','16','17','18','19','20'] },
      ];
      phases.forEach((ph, i) => {
        const b = document.createElement('button');
        b.className = 'cs-pill' + (i === 0 ? ' active' : '');
        b.textContent = ph.label;
        b.addEventListener('click', () => {
          bar.querySelectorAll('.cs-pill').forEach(x => x.classList.remove('active'));
          b.classList.add('active');
          document.querySelectorAll('main .lab-task').forEach(sec => {
            const h = sec.querySelector('h3');
            const m = h ? h.textContent.match(/Module\s+(\d+)/) : null;
            const id = m ? m[1].padStart(2,'0') : '';
            const show = !ph.ids || ph.ids.includes(id);
            sec.style.display = show ? '' : 'none';
          });
        });
        bar.appendChild(b);
      });
      const printBtn = document.createElement('button');
      printBtn.className = 'cs-pill';
      printBtn.textContent = 'Print';
      printBtn.addEventListener('click', () => window.print());
      bar.appendChild(printBtn);
      firstSec.parentNode.insertBefore(bar, firstSec);
    }
  }

  // Progress on index
  const progressEl = document.getElementById('progressFill');
  if (progressEl) {
    const pct = Math.round((visited.length / MODULES.length) * 100);
    progressEl.style.width = pct + '%';
    const label = document.getElementById('progressLabel');
    if (label) label.textContent = `${visited.length} / ${MODULES.length} modules visited (${pct}%)`;
  }
})();
