/* =========================================================================
   Ville du Vin — Catálogo interativo (235 rótulos)
   Filtros por tipo, país, premium, busca e ordenação; sincroniza com a URL
   (?tipo=tinto&pais=chile&q=malbec), igual aos links do site atual.
   ========================================================================= */
(() => {
  'use strict';
  const ALL = window.VDV_PRODUTOS || [];
  const V = window.VDV;
  const $ = (s, el = document) => el.querySelector(s);
  const grid = $('[data-wine-grid]');
  if (!grid || !V) return;

  const norm = (s) => String(s).normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const slug = (s) => norm(s).replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const count = (key, val) => ALL.filter((p) => p[key].includes(val)).length;

  const TIPOS = ['Tinto', 'Branco', 'Rosé', 'Espumante', 'Laranja'].filter((t) => count('t', t));
  const PAISES = Array.from(new Set(ALL.flatMap((p) => p.p))).sort((a, b) => a.localeCompare(b, 'pt'));

  const state = { tipo: 'todos', pais: 'todos', q: '', prem: false, sort: 'destaques', shown: 24 };

  // read URL
  const qs = new URLSearchParams(location.search);
  if (qs.get('tipo')) state.tipo = qs.get('tipo');
  if (qs.get('pais')) state.pais = qs.get('pais');
  if (qs.get('q') || qs.get('search')) state.q = qs.get('q') || qs.get('search');
  if (qs.get('premium')) state.prem = true;

  const elTipos = $('[data-f-tipo]'), elPaises = $('[data-f-pais]');
  const elQ = $('[data-f-q]'), elPrem = $('[data-f-prem]'), elSort = $('[data-f-sort]');
  const elCount = $('[data-count-result]'), elMore = $('[data-more]'), elEmpty = $('[data-empty]');

  elTipos.innerHTML = [`<button class="pill" type="button" data-v="todos">Todos <small>${ALL.length}</small></button>`]
    .concat(TIPOS.map((t) => `<button class="pill" type="button" data-v="${slug(t)}"><i class="type-dot" style="background:${V.TYPE_COLOR[t]};margin:0"></i>${t} <small>${count('t', t)}</small></button>`)).join('');
  elPaises.innerHTML = [`<button class="pill" type="button" data-v="todos">Todos os países</button>`]
    .concat(PAISES.map((c) => `<button class="pill" type="button" data-v="${slug(c)}">${V.FLAGS[c] || ''}${c} <small>${count('p', c)}</small></button>`)).join('');
  elQ.value = state.q;
  elPrem.setAttribute('aria-pressed', String(state.prem));

  function filtered() {
    const q = norm(state.q.trim());
    let list = ALL.filter((p) =>
      (state.tipo === 'todos' || p.t.some((t) => slug(t) === state.tipo)) &&
      (state.pais === 'todos' || p.p.some((c) => slug(c) === state.pais)) &&
      (!state.prem || p.prem) &&
      (!q || norm([p.n, p.t.join(' '), p.p.join(' '), p.u.join(' ')].join(' ')).includes(q))
    );
    if (state.sort === 'az') list = list.slice().sort((a, b) => a.n.localeCompare(b.n, 'pt'));
    if (state.sort === 'za') list = list.slice().sort((a, b) => b.n.localeCompare(a.n, 'pt'));
    return list;
  }

  function syncUrl() {
    const p = new URLSearchParams();
    if (state.tipo !== 'todos') p.set('tipo', state.tipo);
    if (state.pais !== 'todos') p.set('pais', state.pais);
    if (state.q) p.set('q', state.q);
    if (state.prem) p.set('premium', '1');
    const s = p.toString();
    history.replaceState(null, '', location.pathname + (s ? '?' + s : '') + location.hash);
  }

  function render(reset = true) {
    if (reset) state.shown = 24;
    const list = filtered();
    elTipos.querySelectorAll('.pill').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === state.tipo)));
    elPaises.querySelectorAll('.pill').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.v === state.pais)));
    elCount.innerHTML = `<strong>${list.length}</strong> ${list.length === 1 ? 'rótulo encontrado' : 'rótulos encontrados'}`;
    const slice = list.slice(0, state.shown);
    if (reset) grid.innerHTML = slice.map(V.wineCard).join('');
    else grid.insertAdjacentHTML('beforeend', list.slice(grid.children.length, state.shown).map(V.wineCard).join(''));
    Array.from(grid.children).forEach((c, i) => { c.style.animationDelay = reset ? Math.min(i, 12) * 0.03 + 's' : '0s'; });
    V.enableTilt(grid);
    elEmpty.hidden = list.length > 0;
    elMore.hidden = state.shown >= list.length;
    syncUrl();
  }

  elTipos.addEventListener('click', (e) => { const b = e.target.closest('.pill'); if (!b) return; state.tipo = b.dataset.v; render(); });
  elPaises.addEventListener('click', (e) => { const b = e.target.closest('.pill'); if (!b) return; state.pais = b.dataset.v; render(); });
  elPrem.addEventListener('click', () => { state.prem = !state.prem; elPrem.setAttribute('aria-pressed', String(state.prem)); render(); });
  elSort.addEventListener('change', () => { state.sort = elSort.value; render(); });
  let t;
  elQ.addEventListener('input', () => { clearTimeout(t); t = setTimeout(() => { state.q = elQ.value; render(); }, 160); });
  $('[data-clear]').addEventListener('click', () => {
    Object.assign(state, { tipo: 'todos', pais: 'todos', q: '', prem: false });
    elQ.value = ''; elPrem.setAttribute('aria-pressed', 'false'); render();
  });
  const btnMore = elMore.querySelector('button');
  btnMore.addEventListener('click', () => { state.shown += 24; render(false); });
  // carrega mais automaticamente ao chegar no fim
  new IntersectionObserver((en) => { if (en[0].isIntersecting && !elMore.hidden) { state.shown += 24; render(false); } }, { rootMargin: '400px' }).observe(elMore);

  render();
})();
