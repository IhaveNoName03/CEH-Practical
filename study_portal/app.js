/* CEH Study Portal — shared app logic */
(function () {
  'use strict';

  const PAGES = [
    { id: 'HM', title: 'Home', file: 'index.html' },
    { id: 'DG', title: 'Domain Guide', file: 'domain_guide.html' },
    { id: 'CS', title: 'Cheat Sheet', file: 'cheat_sheet.html' },
    { id: 'PL', title: 'Practice Lab', file: 'practice.html' },
    { id: 'EC', title: 'Exam Checklist', file: 'exam_checklist.html' }
  ];

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

  // Inject favicon + theme-color meta
  (function() {
    const mk = (name, content, attr='name') => {
      if (document.querySelector(`meta[${attr}="${name}"]`)) return;
      const m = document.createElement('meta'); m.setAttribute(attr, name); m.content = content; document.head.appendChild(m);
    };
    mk('theme-color', '#2563eb');
    mk('description', 'CEH v12 technical study portal: domain guide, cheat sheet, labs, exam checklist.');
    if (!document.querySelector('link[rel="manifest"]')) {
      const ml = document.createElement('link'); ml.rel = 'manifest'; ml.href = 'manifest.json'; document.head.appendChild(ml);
    }
    if (!document.querySelector('link[rel="icon"]')) {
      const l = document.createElement('link'); l.rel = 'icon';
      l.href = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" rx="6" fill="#2563eb"/><text x="16" y="22" font-size="18" text-anchor="middle" fill="#fff" font-family="monospace" font-weight="bold">C</text></svg>');
      document.head.appendChild(l);
    }
  })();

  // Skip-to-content link
  const skip = document.createElement('a');
  skip.href = '#main-content';
  skip.className = 'skip-link';
  skip.textContent = 'Skip to content';
  document.body.insertBefore(skip, document.body.firstChild);
  const mainEl = document.querySelector('main.content-body, main');
  if (mainEl && !mainEl.id) mainEl.id = 'main-content';

  const navEl = document.querySelector('nav');
  const navToggle = document.getElementById('navToggle');

  // Build sidebar navigation
  if (!document.querySelector('.sidebar')) {
    const overlay = document.createElement('div');
    overlay.className = 'sidebar-overlay';
    overlay.addEventListener('click', () => document.body.classList.remove('sidebar-open'));
    document.body.appendChild(overlay);

    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar';
    const title = document.createElement('div');
    title.className = 'sidebar-title';
    title.textContent = 'PAGES';
    sidebar.appendChild(title);

    PAGES.forEach(p => {
      const a = document.createElement('a');
      a.href = p.file;
      a.innerHTML = `<span class="mod-num">${p.id}</span><span class="mod-title">${p.title}</span>`;
      const page = location.pathname.split('/').pop() || 'index.html';
      if (page === p.file) a.classList.add('active');
      sidebar.appendChild(a);
    });

    sidebar.addEventListener('click', (e) => {
      if (e.target.closest('a')) {
        document.body.classList.remove('sidebar-open');
        document.body.style.overflow = '';
        if (navToggle) { navToggle.setAttribute('aria-expanded','false'); navToggle.textContent = '☰'; }
      }
    });

    if (window.innerWidth <= 900) {
      const sw = document.querySelector('.search-wrap');
      if (sw) {
        const wrap = document.createElement('div');
        wrap.className = 'sidebar-search';
        wrap.appendChild(sw);
        sidebar.insertBefore(wrap, sidebar.firstChild);
      }
    }
    document.body.appendChild(sidebar);
  }

  // Hamburger toggles sidebar drawer
  if (navToggle && navEl) {
    navToggle.addEventListener('click', () => {
      const open = document.body.classList.toggle('sidebar-open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
      navToggle.textContent = open ? '✕' : '☰';
      document.body.style.overflow = open ? 'hidden' : '';
    });
  }
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.classList.contains('sidebar-open')) {
      document.body.classList.remove('sidebar-open');
      if (navToggle) { navToggle.setAttribute('aria-expanded','false'); navToggle.textContent = '☰'; }
      document.body.style.overflow = '';
    }
  });

  // Keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    const tag = (e.target && e.target.tagName) || '';
    const typing = tag === 'INPUT' || tag === 'TEXTAREA' || e.target.isContentEditable;
    if (e.key === '/' && !typing) {
      e.preventDefault();
      const si = document.getElementById('globalSearch');
      if (si) { si.focus(); si.select(); }
    }
    if (e.key === 't' && !typing) {
      const tt = document.getElementById('themeToggle');
      if (tt) tt.click();
    }
  });

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
        btn.classList.add('copied');
        setTimeout(() => { btn.textContent = 'Copy'; btn.classList.remove('copied'); }, 1400);
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
    toc.innerHTML = '<details><summary class="toc-title">On this page</summary><ul>' +
      headings.map(h => {
        if (!h.id) h.id = 'h-' + h.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
        return `<li><a href="#${h.id}">${h.textContent.trim()}</a></li>`;
      }).join('') + '</ul></details>';
    if (main && main.firstChild) main.insertBefore(toc, main.firstChild);
    else if (main) main.appendChild(toc);
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
  setTimeout(() => {
    document.querySelectorAll('.reveal:not(.visible)').forEach(el => el.classList.add('visible'));
  }, 800);

  // Active TOC highlighting
  const tocLinks = document.querySelectorAll('.toc a');
  if (tocLinks.length) {
    const activeObs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          tocLinks.forEach(l => l.classList.remove('active'));
          const link = document.querySelector(`.toc a[href="#${e.target.id}"]`);
          if (link) link.classList.add('active');
        }
      });
    }, { rootMargin: '-20% 0px -70% 0px', threshold: 0 });
    headings.forEach(h => activeObs.observe(h));
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
  if (isCheat) document.body.classList.add('cs-page');

  // Dim comment lines inside cheat-sheet code blocks
  if (isCheat) {
    document.querySelectorAll('main .section-card pre').forEach(pre => {
      const lines = pre.innerHTML.split('\n');
      pre.innerHTML = lines.map(line => {
        const stripped = line.replace(/<[^>]*>/g, '').trim();
        if (stripped.startsWith('#')) {
          return '<span class="cs-comment">' + line + '</span>';
        }
        return line;
      }).join('\n');
    });
  }

  // Search
  const searchInput = document.getElementById('globalSearch');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.trim().toLowerCase();
      if (isCheat) {
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
      const hits = PAGES.filter(p => p.title.toLowerCase().includes(q) || p.id.toLowerCase().includes(q));
      overlay.innerHTML = hits.length
        ? hits.map(p => `<a href="${withTheme(p.file)}"><span class="sr-id">${p.id}</span> ${p.title}</a>`).join('')
        : '<div class="sr-empty">No pages match.</div>';
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

  // Reading time
  const mainRT = document.querySelector('main, .content, .module-content');
  if (mainRT) {
    const words = mainRT.textContent.trim().split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    const header = document.querySelector('.module-header h2, h1, .page-title');
    if (header) {
      const badge = document.createElement('span');
      badge.style.cssText = 'font-size:0.75rem;color:var(--muted);font-weight:400;margin-left:12px;';
      badge.textContent = `~${mins} min read`;
      header.appendChild(badge);
    }
  }
})();

// Register service worker for offline use (PWA)
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').then(reg => {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        window.location.reload();
      });
      reg.update().catch(() => {});
    }).catch(() => {});
  });
}
