/* =========================================================================
   Ville du Vin — scripts compartilhados por todas as páginas
   ========================================================================= */
(() => {
  'use strict';

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- dados das lojas ---------- */
  const STORES = {
    alphaville: { name: 'Shopping Iguatemi (Alphaville)', wa: '5511991178801', q: 'Shopping Iguatemi Alphaville, Alameda Rio Negro, 111 - Alphaville Industrial, Barueri - SP, 06454-000' },
    itaim: { name: 'Itaim Bibi', wa: '5511997049531', q: 'R. Leopoldo Couto de Magalhães Júnior, 490 - Itaim Bibi, São Paulo - SP, 04542-000' },
    recife: { name: 'Recife', q: 'Rua do Espinheiro, 559 - Espinheiro, Recife - PE, 52020-020' },
    teresina: { name: 'Teresina', q: 'Rua Tabelião José Basílio, 1443 - Ininga, Teresina - PI, 64048-504' }
  };
  const waLink = (num, msg) => `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  const mapEmbed = (q) => `https://maps.google.com/maps?q=${encodeURIComponent(q)}&z=16&output=embed`;
  const mapDir = (q) => `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(q)}`;

  /* ---------- ícones (para conteúdo gerado via JS) ---------- */
  const ICON = {
    arrow: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>',
    grape: '<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="9" cy="9" r="2.4"/><circle cx="14.5" cy="9" r="2.4"/><circle cx="11.8" cy="13.4" r="2.4"/><circle cx="7" cy="13.6" r="2.1"/><circle cx="16.6" cy="13.6" r="2.1"/><circle cx="11.8" cy="18.2" r="2.2"/><path d="M12 6.6c0-2 1-3.6 3-4.4" stroke="currentColor" stroke-width="1.4" fill="none"/></svg>',
    glass: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M7 2h10l-.6 6.2a4.4 4.4 0 0 1-8.8 0L7 2Z"/><path d="M12 13v8M8 21h8"/><path d="M7.5 7h9" /></svg>',
    wa: '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M19.05 4.91A9.82 9.82 0 0 0 12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01Zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.26 8.26 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24 2.2 0 4.27.86 5.82 2.42a8.18 8.18 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23Zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81-.23-.08-.39-.12-.56.12-.17.25-.64.81-.78.97-.14.17-.29.19-.54.06-.25-.12-1.05-.39-1.99-1.23-.74-.66-1.23-1.47-1.38-1.72-.14-.25-.02-.38.11-.51.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31-.22.25-.86.85-.86 2.07 0 1.22.89 2.4 1.01 2.56.12.17 1.75 2.67 4.23 3.74.59.26 1.05.41 1.41.52.59.19 1.13.16 1.56.1.48-.07 1.47-.6 1.67-1.18.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg>'
  };
  const FLAGS = {
    'Argentina': '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#74acdf"/><rect y="6.67" width="30" height="6.67" fill="#fff"/><circle cx="15" cy="10" r="2.3" fill="#f6b40e"/></svg>',
    'Chile': '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#fff"/><rect y="10" width="30" height="10" fill="#d52b1e"/><rect width="10" height="10" fill="#0039a6"/><path d="m5 2.4.9 2.8h2.9l-2.4 1.7.9 2.8L5 8l-2.3 1.7.9-2.8-2.4-1.7h2.9Z" fill="#fff"/></svg>',
    'Espanha': '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#aa151b"/><rect y="5" width="30" height="10" fill="#f1bf00"/></svg>',
    'França': '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#002395"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ed2939"/></svg>',
    'Itália': '<svg viewBox="0 0 30 20"><rect width="10" height="20" fill="#009246"/><rect x="10" width="10" height="20" fill="#fff"/><rect x="20" width="10" height="20" fill="#ce2b37"/></svg>',
    'Portugal': '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#f00"/><rect width="12" height="20" fill="#060"/><circle cx="12" cy="10" r="3.6" fill="#ff0" stroke="#000" stroke-width=".3"/><circle cx="12" cy="10" r="2" fill="#f00"/></svg>',
    'Brasil': '<svg viewBox="0 0 30 20"><rect width="30" height="20" fill="#009c3b"/><path d="M15 3 27 10 15 17 3 10Z" fill="#ffdf00"/><circle cx="15" cy="10" r="3.6" fill="#002776"/></svg>'
  };
  const TYPE_COLOR = { Tinto: '#8a1230', Branco: '#e8d38e', 'Rosé': '#f2a0b4', Espumante: '#f4e3a1', Laranja: '#e5893a' };
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  /* ---------- verificação de idade ---------- */
  const AGE_KEY = 'vdv_age_ok';
  function ageValid() {
    try { const v = +localStorage.getItem(AGE_KEY); return v && Date.now() - v < 24 * 3600 * 1000; } catch (e) { return false; }
  }
  const gate = $('.age-gate');
  if (ageValid()) root.classList.add('age-ok');
  if (gate) {
    if (!root.classList.contains('age-ok')) document.body.classList.add('is-locked');
    const yes = $('[data-age-yes]', gate);
    yes && yes.addEventListener('click', () => {
      try { localStorage.setItem(AGE_KEY, String(Date.now())); } catch (e) { /* modo privado */ }
      root.classList.add('age-ok');
      document.body.classList.remove('is-locked');
      document.dispatchEvent(new CustomEvent('vdv:age-ok'));
      setTimeout(() => gate.setAttribute('hidden', ''), 1000);
    });
    if (root.classList.contains('age-ok')) gate.setAttribute('hidden', '');
    else setTimeout(() => yes && yes.focus({ preventScroll: true }), 300);
  }

  /* ---------- header + menu ---------- */
  const header = $('.site-header');
  const intro = $('#intro');
  let lastY = window.scrollY;
  function onScroll() {
    const y = window.scrollY;
    if (header) {
      const introEnd = intro ? intro.offsetTop + intro.offsetHeight - header.offsetHeight : 0;
      const solid = intro ? y > introEnd : y > 30;
      header.classList.toggle('is-solid', solid);
      const goingDown = y > lastY + 4, goingUp = y < lastY - 4;
      if (!document.body.classList.contains('menu-open')) {
        if (goingDown && y > (intro ? introEnd + 300 : 400)) header.classList.add('is-hidden');
        else if (goingUp || y < 100) header.classList.remove('is-hidden');
      }
    }
    if (intro) {
      const inIntro = y < intro.offsetTop + intro.offsetHeight - window.innerHeight * 1.05;
      document.body.classList.toggle('intro-active', inIntro);
    }
    lastY = y;
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('.nav-toggle');
  toggle && toggle.addEventListener('click', () => {
    const open = document.body.classList.toggle('menu-open');
    toggle.setAttribute('aria-expanded', String(open));
    document.body.classList.toggle('is-locked', open);
  });
  $$('.nav a').forEach((a) => a.addEventListener('click', () => {
    document.body.classList.remove('menu-open', 'is-locked');
    toggle && toggle.setAttribute('aria-expanded', 'false');
  }));

  /* ---------- reveal on scroll ---------- */
  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  const observeReveals = (scope = document) => $$('.reveal:not(.is-in)', scope).forEach((el) => io.observe(el));
  observeReveals();

  /* ---------- parallax leve ---------- */
  const parallax = $$('[data-parallax]');
  if (parallax.length && !reduceMotion) {
    const run = () => {
      parallax.forEach((el) => {
        const r = el.parentElement.getBoundingClientRect();
        if (r.bottom < 0 || r.top > window.innerHeight) return;
        const k = parseFloat(el.dataset.parallax) || 0.2;
        el.style.transform = `translate3d(0, ${(r.top * -k).toFixed(1)}px, 0) scale(1.06)`;
      });
    };
    window.addEventListener('scroll', () => requestAnimationFrame(run), { passive: true });
    run();
  }

  /* ---------- contadores ---------- */
  const counters = $$('[data-count]');
  if (counters.length) {
    const cio = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (!e.isIntersecting) return;
        cio.unobserve(e.target);
        const el = e.target, to = +el.dataset.count, pre = el.dataset.prefix || '', suf = el.dataset.suffix || '';
        const t0 = performance.now(), dur = 1800;
        const step = (now) => {
          const k = Math.min(1, (now - t0) / dur), v = Math.round(to * (1 - Math.pow(1 - k, 3)));
          el.textContent = pre + v.toLocaleString('pt-BR') + suf;
          if (k < 1) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
      });
    }, { threshold: 0.4 });
    counters.forEach((c) => cio.observe(c));
  }

  /* ---------- linha do tempo ---------- */
  $$('.timeline').forEach((tl) => {
    const upd = () => {
      const r = tl.getBoundingClientRect();
      const k = Math.min(1, Math.max(0, (window.innerHeight * 0.85 - r.top) / (r.height + window.innerHeight * 0.35)));
      tl.style.setProperty('--tl', k.toFixed(3));
    };
    window.addEventListener('scroll', () => requestAnimationFrame(upd), { passive: true });
    upd();
  });

  /* ---------- slider de banners ---------- */
  $$('.slider').forEach((slider) => {
    const slides = $$('.slide', slider);
    const bars = $$('.slider__bar', slider);
    const count = $('.slider__count', slider);
    const DUR = 6500;
    let i = 0, t0 = performance.now(), paused = false, pausedAt = 0;
    function go(n) {
      slides[i].classList.remove('is-active');
      i = (n + slides.length) % slides.length;
      slides[i].classList.add('is-active');
      bars.forEach((b, k) => { b.classList.toggle('is-done', k < i); $('span', b).style.transform = k < i ? 'scaleX(1)' : 'scaleX(0)'; });
      if (count) count.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(slides.length).padStart(2, '0');
      t0 = performance.now();
    }
    function tick(now) {
      if (!paused && !document.hidden) {
        const k = Math.min(1, (now - t0) / DUR);
        const bar = bars[i] && $('span', bars[i]);
        if (bar) bar.style.transform = `scaleX(${k})`;
        if (k >= 1) go(i + 1);
      }
      requestAnimationFrame(tick);
    }
    bars.forEach((b, k) => b.addEventListener('click', () => go(k)));
    const prev = $('[data-prev]', slider), next = $('[data-next]', slider);
    prev && prev.addEventListener('click', () => go(i - 1));
    next && next.addEventListener('click', () => go(i + 1));
    slider.addEventListener('mouseenter', () => { paused = true; pausedAt = performance.now(); });
    slider.addEventListener('mouseleave', () => { paused = false; t0 += performance.now() - pausedAt; });
    let sx = null;
    slider.addEventListener('touchstart', (e) => { sx = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
      if (sx === null) return;
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 50) go(i + (dx < 0 ? 1 : -1));
      sx = null;
    });
    go(0);
    requestAnimationFrame(tick);
  });

  /* ---------- trilhos com setas ---------- */
  $$('[data-rail]').forEach((wrap) => {
    const rail = $('.rail', wrap);
    $$('[data-rail-prev],[data-rail-next]', wrap).forEach((b) => b.addEventListener('click', () => {
      const dir = b.hasAttribute('data-rail-next') ? 1 : -1;
      rail.scrollBy({ left: dir * rail.clientWidth * 0.8, behavior: 'smooth' });
    }));
  });

  /* ---------- lojas + mapa ---------- */
  $$('[data-stores]').forEach((wrap) => {
    const frame = $('iframe', wrap);
    const tabs = $$('[data-map-tab]', wrap);
    const cards = $$('[data-store]', wrap);
    const dir = $('[data-map-dir]', wrap);
    const wa = $('[data-map-wa]', wrap);
    const title = $('[data-map-title]', wrap);
    const addr = $('[data-map-addr]', wrap);
    let loaded = false, current = null;
    function select(id, load = true) {
      const s = STORES[id]; if (!s) return;
      current = id;
      tabs.forEach((t) => t.setAttribute('aria-selected', String(t.dataset.mapTab === id)));
      cards.forEach((c) => c.classList.toggle('is-active', c.dataset.store === id));
      if (title) title.textContent = s.name;
      if (addr) addr.textContent = s.q.split(' - ').slice(-2).join(' · ');
      if (dir) dir.href = mapDir(s.q);
      if (wa) {
        wa.hidden = !s.wa;
        if (s.wa) wa.href = waLink(s.wa, 'Olá! Vim pelo site da Ville du Vin e gostaria de mais informações.');
      }
      if (frame && (load || loaded)) { frame.src = mapEmbed(s.q); loaded = true; }
    }
    tabs.forEach((t) => t.addEventListener('click', () => select(t.dataset.mapTab)));
    cards.forEach((c) => c.addEventListener('click', (e) => { if (e.target.closest('a')) return; select(c.dataset.store); if (window.innerWidth < 1080) wrap.querySelector('.map-card').scrollIntoView({ behavior: 'smooth', block: 'center' }); }));
    // carrega o mapa só quando a seção aparece
    const first = (tabs[0] && tabs[0].dataset.mapTab) || 'alphaville';
    select(first, false);
    const mio = new IntersectionObserver((en) => { if (en[0].isIntersecting) { select(current || first, true); mio.disconnect(); } }, { rootMargin: '300px' });
    mio.observe(wrap);
  });

  /* ---------- botão flutuante de WhatsApp ---------- */
  const waf = $('.wa-float');
  if (waf) {
    const btn = $('.wa-float__btn', waf);
    btn.addEventListener('click', () => { const o = waf.classList.toggle('is-open'); btn.setAttribute('aria-expanded', String(o)); });
    document.addEventListener('click', (e) => { if (!waf.contains(e.target)) waf.classList.remove('is-open'); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') waf.classList.remove('is-open'); });
  }

  /* ---------- newsletter ---------- */
  $$('.nl-form').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const msg = f.parentElement.querySelector('.nl-msg');
    const email = f.querySelector('input').value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { if (msg) msg.textContent = 'Digite um e-mail válido.'; return; }
    if (msg) msg.textContent = 'Obrigado! Seu e-mail foi registrado para receber nossas novidades.';
    f.reset();
  }));

  /* ---------- formulário de franquia → e-mail ---------- */
  $$('[data-mailto-form]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = new FormData(f);
    const body = Array.from(d.entries()).map(([k, v]) => `${k}: ${v}`).join('\n');
    window.location.href = `mailto:${f.dataset.mailtoForm}?subject=${encodeURIComponent(f.dataset.subject || 'Contato pelo site')}&body=${encodeURIComponent(body)}`;
  }));

  /* ---------- vinhos: cartões + modal (home e catálogo) ---------- */
  const IMG = (p) => `assets/img/vinhos/${p.s}.webp`;
  function wineCard(p) {
    const tipo = p.t[0] || '', pais = p.p[0] || '';
    return `<button class="wine-card" type="button" data-wine="${p.id}" aria-label="${esc(p.n)} — ver detalhes">
      <div class="wine-card__stage">
        ${pais && FLAGS[pais] ? `<span class="wine-card__flag" title="${esc(pais)}">${FLAGS[pais]}</span>` : ''}
        ${p.prem ? '<span class="wine-card__badge">Premium</span>' : ''}
        <img src="${IMG(p)}" alt="Garrafa de ${esc(p.n)}" loading="lazy" decoding="async" width="160" height="300">
      </div>
      <div class="wine-card__info">
        <h3 class="wine-card__name">${esc(p.n)}</h3>
        <div class="wine-card__meta">
          <span><i class="type-dot" style="background:${TYPE_COLOR[tipo] || '#888'}"></i>${esc(tipo)}${pais ? ' · ' + esc(pais) : ''}</span>
          ${p.u.length ? `<span>${ICON.grape}${esc(p.u.join(', '))}</span>` : ''}
        </div>
        <span class="wine-card__cta">Comprar ${ICON.arrow}</span>
      </div>
    </button>`;
  }
  function enableTilt(scope) {
    if (reduceMotion || !window.matchMedia('(hover: hover)').matches) return;
    $$('.wine-card', scope).forEach((c) => {
      if (c._tilt) return; c._tilt = true;
      c.addEventListener('pointermove', (e) => {
        const r = c.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
        c.style.setProperty('--tilt-y', (x * 8).toFixed(2) + 'deg');
        c.style.setProperty('--tilt-x', (-y * 6).toFixed(2) + 'deg');
      });
      c.addEventListener('pointerleave', () => { c.style.setProperty('--tilt-x', '0deg'); c.style.setProperty('--tilt-y', '0deg'); });
    });
  }

  let modal = null;
  function ensureModal() {
    if (modal) return modal;
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.innerHTML = `<div class="modal__card"><button class="modal__close" type="button" aria-label="Fechar">${ICON.close}</button><div class="modal__stage"></div><div class="modal__body"></div></div>`;
    document.body.appendChild(modal);
    modal.addEventListener('click', (e) => { if (e.target === modal || e.target.closest('.modal__close')) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(); });
    return modal;
  }
  let lastFocus = null;
  function openWine(id) {
    const list = window.VDV_PRODUTOS || [];
    const p = list.find((x) => String(x.id) === String(id));
    if (!p) return;
    const m = ensureModal();
    const tipo = p.t[0] || '', pais = p.p[0] || '';
    const msg = `Olá! Vim pelo site da Ville du Vin e tenho interesse no vinho ${p.n}.`;
    $('.modal__stage', m).innerHTML = `<img src="${IMG(p)}" alt="Garrafa de ${esc(p.n)}">`;
    $('.modal__body', m).innerHTML = `
      <span class="eyebrow">${esc(tipo)}</span>
      <h2 class="modal__name">${esc(p.n)}</h2>
      <div class="modal__tags">
        ${pais ? `<span class="tag">${FLAGS[pais] || ''}${esc(pais)}</span>` : ''}
        <span class="tag"><i class="type-dot" style="background:${TYPE_COLOR[tipo] || '#888'};margin:0"></i>${esc(tipo)}</span>
        ${p.prem ? '<span class="tag" style="color:var(--gold)">Especial Vinhos Premium</span>' : ''}
      </div>
      ${p.u.length ? `<div class="modal__grapes"><strong>Uvas</strong>${esc(p.u.join(', '))}</div>` : ''}
      ${p.d ? `<p class="modal__desc">${esc(p.d)}</p>` : ''}
      <div class="modal__buy">
        <p>Compre pelo WhatsApp</p>
        <div class="btns">
          <a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="${waLink(STORES.alphaville.wa, msg)}">${ICON.wa} Alphaville</a>
          <a class="btn btn--wa btn--sm" target="_blank" rel="noopener" href="${waLink(STORES.itaim.wa, msg)}">${ICON.wa} Itaim Bibi</a>
        </div>
      </div>`;
    lastFocus = document.activeElement;
    m.classList.add('is-open');
    document.body.classList.add('is-locked');
    $('.modal__card', m).scrollTop = 0;
    setTimeout(() => $('.modal__close', m).focus(), 50);
    if (history.replaceState) history.replaceState(null, '', '#vinho-' + p.s);
  }
  function closeModal() {
    if (!modal) return;
    modal.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    if (history.replaceState) history.replaceState(null, '', location.pathname + location.search);
    lastFocus && lastFocus.focus && lastFocus.focus({ preventScroll: true });
  }
  document.addEventListener('click', (e) => {
    const c = e.target.closest('[data-wine]');
    if (c) openWine(c.dataset.wine);
  });

  // destaques na home
  const feat = $('[data-featured]');
  if (feat && window.VDV_PRODUTOS) {
    feat.innerHTML = window.VDV_PRODUTOS.filter((p) => p.dest).map(wineCard).join('');
    enableTilt(feat);
  }

  // abre vinho direto pelo link (#vinho-slug)
  function openFromHash() {
    const m = location.hash.match(/^#vinho-(.+)$/);
    if (m && window.VDV_PRODUTOS) {
      const p = window.VDV_PRODUTOS.find((x) => x.s === decodeURIComponent(m[1]));
      if (p) openWine(p.id);
    }
  }

  /* ---------- posts do blog ---------- */
  function postCard(b, i) {
    const img = b.img ? `<img src="assets/img/blog/${b.img}" alt="" loading="lazy" decoding="async">` : '<img class="ph" src="assets/img/logo.svg" alt="">';
    const d = new Date(b.d + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' });
    return `<a class="post reveal" style="--d:${(i % 3) * 0.08}s" href="${esc(b.l)}" target="_blank" rel="noopener">
      <div class="post__img">${img}</div>
      <div class="post__body">
        <span class="post__cat">${esc(b.c || 'Conteúdo')} · ${d}</span>
        <h3 class="post__title">${esc(b.t)}</h3>
        <p class="post__ex">${esc(b.e)}</p>
        <span class="post__more link-arrow">Ler no blog ${ICON.arrow}</span>
      </div>
    </a>`;
  }
  $$('[data-posts]').forEach((el) => {
    const n = +el.dataset.posts || 3;
    const all = (window.VDV_BLOG || []);
    const withImg = n <= 3 ? all.filter((b) => b.img) : all;
    el.innerHTML = withImg.slice(0, n).map(postCard).join('');
    observeReveals(el);
  });
  const blogFilter = $('[data-blog-filter]');
  if (blogFilter) {
    const grid = $('[data-blog-grid]');
    const all = window.VDV_BLOG || [];
    const cats = Array.from(new Set(all.map((b) => b.c).filter(Boolean)));
    blogFilter.innerHTML = ['Todos', ...cats].map((c, k) => `<button class="pill" type="button" aria-pressed="${k === 0}" data-c="${esc(c)}">${esc(c)}</button>`).join('');
    const render = (c) => { grid.innerHTML = all.filter((b) => c === 'Todos' || b.c === c).map(postCard).join(''); observeReveals(grid); };
    blogFilter.addEventListener('click', (e) => {
      const b = e.target.closest('.pill'); if (!b) return;
      $$('.pill', blogFilter).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      render(b.dataset.c);
    });
    render('Todos');
  }

  window.VDV = { wineCard, enableTilt, openWine, FLAGS, TYPE_COLOR, ICON, observeReveals, esc };
  openFromHash();

  /* ---------- ano no rodapé ---------- */
  $$('[data-year]').forEach((el) => { el.textContent = new Date().getFullYear(); });
})();
