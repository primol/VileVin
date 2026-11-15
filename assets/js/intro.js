/* =========================================================================
   Ville du Vin — Abertura animada (scroll-driven)
   Uma garrafa realista inclina, derrama vinho e o vinho enche as letras
   do logo "VILLE DU VIN". Tudo é desenhado em <canvas>, de forma
   determinística em função do progresso do scroll (dá pra voltar o scroll
   e a animação "desfaz"), com movimento ambiente baseado em tempo.
   ========================================================================= */
(() => {
  'use strict';

  const section = document.getElementById('intro');
  if (!section) return;

  const sticky = section.querySelector('.intro__sticky');
  const canvas = section.querySelector('.intro__canvas');
  const ctx = canvas.getContext('2d');
  const elHint = section.querySelector('.intro__hint');
  const elCapA = section.querySelector('.intro__caption--a');
  const elCapB = section.querySelector('.intro__caption--b');
  const elFinal = section.querySelector('.intro__final');
  const elBar = section.querySelector('.intro__progress span');
  const elSkip = section.querySelector('.intro__skip');

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduceMotion) section.classList.add('intro--static');

  /* ---------- helpers ---------- */
  const clamp = (v, a = 0, b = 1) => Math.min(b, Math.max(a, v));
  const lerp = (a, b, t) => a + (b - a) * t;
  const smooth = (t) => { t = clamp(t); return t * t * (3 - 2 * t); };
  const easeInOut = (t) => { t = clamp(t); return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
  const easeIn = (t) => { t = clamp(t); return t * t * t; };
  const range = (p, a, b) => clamp((p - a) / (b - a));
  const hash = (n) => { const s = Math.sin(n * 127.1 + 311.7) * 43758.5453; return s - Math.floor(s); };

  /* ---------- logo geometry (viewBox 0 0 199.51 43.33) ---------- */
  const LOGO = {"V": "M40.58,0,22.92,43.33H17.66L0,0H4.69A2,2,0,0,1,6,.39a2.5,2.5,0,0,1,.72,1L18.9,32c.26.69.52,1.43.77,2.24s.48,1.65.68,2.54c.2-.89.41-1.73.64-2.54s.46-1.55.72-2.24L33.9,1.39a2.22,2.22,0,0,1,.71-.95A2,2,0,0,1,35.89,0Z", "I": "M52.16,43.33H46.3V0h5.86Z", "L1": "M87.81,38.4v4.93H63.23V0h5.84V38.4Z", "L2": "M118.87,38.4v4.93H94.28V0h5.84V38.4Z", "E": "M152.07,38.55l0,4.78h-26.7V0H152V4.78H131.21V19.17h16.87v4.6H131.21V38.55Z", "i": "M179,39.85h-1.81V24.74H179Z", "n": "M193.21,24.74V39.85h-.91a.69.69,0,0,1-.36-.09.92.92,0,0,1-.28-.28l-7.74-11.39c0,.18,0,.35,0,.52s0,.33,0,.47V39.85h-1.58V24.74h.93l.21,0a.34.34,0,0,1,.14,0,.61.61,0,0,1,.14.1l.14.18,7.74,11.37c0-.18,0-.36,0-.53s0-.33,0-.49V24.74Z", "D": "M177.61,9.21A10.31,10.31,0,0,1,177,13a8.29,8.29,0,0,1-1.85,2.9,8.16,8.16,0,0,1-2.87,1.87,10,10,0,0,1-3.7.66h-6.87V0h6.87a10,10,0,0,1,3.7.66,8.18,8.18,0,0,1,2.87,1.88A8.29,8.29,0,0,1,177,5.44,10.33,10.33,0,0,1,177.61,9.21Zm-2.55,0a9.45,9.45,0,0,0-.46-3,6.44,6.44,0,0,0-1.31-2.26,5.63,5.63,0,0,0-2.06-1.42A7.2,7.2,0,0,0,168.54,2h-4.38V16.38h4.38a7.2,7.2,0,0,0,2.69-.48,5.73,5.73,0,0,0,2.06-1.41,6.39,6.39,0,0,0,1.31-2.25A9.45,9.45,0,0,0,175.06,9.21Z", "U": "M188.3,16.42a5.26,5.26,0,0,0,2-.38A4.39,4.39,0,0,0,191.86,15a4.68,4.68,0,0,0,.95-1.66,6.5,6.5,0,0,0,.33-2.12V0h2.48V11.18a8.36,8.36,0,0,1-.51,3,6.89,6.89,0,0,1-1.45,2.35,6.46,6.46,0,0,1-2.31,1.56,7.79,7.79,0,0,1-3,.57,7.87,7.87,0,0,1-3.06-.57,6.46,6.46,0,0,1-2.31-1.56,6.91,6.91,0,0,1-1.46-2.35,8.36,8.36,0,0,1-.51-3V0h2.48V11.17a6.5,6.5,0,0,0,.33,2.12,4.93,4.93,0,0,0,.95,1.66A4.42,4.42,0,0,0,186.25,16,5.1,5.1,0,0,0,188.3,16.42Z", "v": "M175.81,24.75l-6.16,15.1h-1.83l-6.15-15.1h1.63a.68.68,0,0,1,.44.13.81.81,0,0,1,.25.35l4.26,10.66q.13.34.27.78c.09.28.17.57.24.88.07-.31.14-.6.22-.88a8,8,0,0,1,.25-.78l4.25-10.66a.69.69,0,0,1,.25-.33.68.68,0,0,1,.45-.15Z"};
  const LW = 199.51, LH = 43.33;

  // glyphs that get filled with wine. The stream lands inside one letter
  // (2º "L" no desktop, "E" no celular) and a "river" of wine runs along the
  // base filling the other letters, ordered by distance from the impact.
  let IMPACT_X = 97.2;
  const glyphs = [
    { id: 'V',  d: LOGO.V,  x0: 0,      x1: 40.58,  y0: 0,     y1: 43.33, white: true },
    { id: 'I',  d: LOGO.I,  x0: 46.3,   x1: 52.16,  y0: 0,     y1: 43.33, white: true },
    { id: 'L1', d: LOGO.L1, x0: 63.23,  x1: 87.81,  y0: 0,     y1: 43.33, white: true },
    { id: 'L2', d: LOGO.L2, x0: 94.28,  x1: 118.87, y0: 0,     y1: 43.33, white: true, stem: 97.2 },
    { id: 'E',  d: LOGO.E,  x0: 125.37, x1: 152.07, y0: 0,     y1: 43.33, white: true, stem: 128.3 },
    { id: 'D',  d: LOGO.D,  x0: 162.16, x1: 177.61, y0: 0,     y1: 18.43, white: true, top: true },
    { id: 'U',  d: LOGO.U,  x0: 180.82, x1: 195.62, y0: 0,     y1: 18.59, white: true, top: true },
    { id: 'BOX', rect: [157.09, 21.26, 42.41, 22.08], x0: 157.09, x1: 199.5, y0: 21.26, y1: 43.33, box: true }
  ];
  glyphs.forEach((g, i) => {
    if (g.rect) { g.path = new Path2D(); g.path.rect(...g.rect); }
    else g.path = new Path2D(g.d);
    g.seed = i * 1.7;
  });
  const vinPaths = [LOGO.v, LOGO.i, LOGO.n].map((d) => new Path2D(d));

  /* ---------- timeline (progress 0..1) ---------- */
  const TL = {
    tiltA: 0.05, tiltB: 0.15,     // garrafa sai do repouso e inclina
    pourA: 0.15, pourB: 0.74,     // vinho escorre
    riverA: 0.165, riverB: 0.46,  // vinho corre pela base das letras
    backA: 0.77, backB: 0.88,     // garrafa volta e sai de cena
    sweepA: 0.84, sweepB: 0.94,   // brilho que revela o logo
    finalA: 0.9, finalB: 0.97
  };
  let MAXDIST = 103, IMPACT_G = glyphs[3];
  function schedule(impactId) {
    IMPACT_G = glyphs.find((g) => g.id === impactId);
    IMPACT_X = IMPACT_G.stem;
    MAXDIST = Math.max(IMPACT_X, LW - IMPACT_X) + 1.5;
    glyphs.forEach((g) => {
      g.impact = g === IMPACT_G;
      const dist = g.impact ? 0 : Math.max(0, g.x1 < IMPACT_X ? IMPACT_X - g.x1 : g.x0 - IMPACT_X);
      if (g.impact) { g.fillA = TL.pourA + 0.025; g.fillB = 0.47; }
      else if (g.top) { g.fillA = 0.6; g.fillB = 0.715; }
      else {
        g.fillA = TL.riverA + (dist / MAXDIST) * (TL.riverB - TL.riverA) + 0.012;
        g.fillB = Math.min(0.6, g.fillA + 0.26);
      }
    });
  }

  /* ---------- bottle geometry (units of bottle height; mouth at 0,0) ---------- */
  function bottleProfile() {
    // [y, half-width]
    const pts = [[0, 0.029], [0.004, 0.035], [0.034, 0.036], [0.040, 0.031], [0.30, 0.034]];
    // shoulder (cubic bezier)
    const s0 = [0.30, 0.034], c1 = [0.36, 0.035], c2 = [0.375, 0.128], s1 = [0.445, 0.13];
    for (let i = 1; i <= 14; i++) {
      const t = i / 14, mt = 1 - t;
      pts.push([
        mt * mt * mt * s0[0] + 3 * mt * mt * t * c1[0] + 3 * mt * t * t * c2[0] + t * t * t * s1[0],
        mt * mt * mt * s0[1] + 3 * mt * mt * t * c1[1] + 3 * mt * t * t * c2[1] + t * t * t * s1[1]
      ]);
    }
    pts.push([0.975, 0.13], [0.992, 0.127], [1, 0.118]);
    return pts;
  }
  const PROFILE = bottleProfile();
  function hwAt(y) {
    for (let i = 1; i < PROFILE.length; i++) {
      if (y <= PROFILE[i][0]) {
        const [ya, wa] = PROFILE[i - 1], [yb, wb] = PROFILE[i];
        return lerp(wa, wb, (y - ya) / Math.max(1e-6, yb - ya));
      }
    }
    return PROFILE[PROFILE.length - 1][1];
  }
  function profilePath(inset = 0, yStart = 0, yEnd = 1) {
    const p = new Path2D();
    const pts = [[yStart, hwAt(yStart)], ...PROFILE.filter(([y]) => y > yStart && y < yEnd), [yEnd, hwAt(yEnd)]];
    const right = pts.map(([y, w]) => [Math.max(0.004, w - inset), y]);
    p.moveTo(-right[0][0], right[0][1]);
    right.forEach(([x, y]) => p.lineTo(x, y));
    for (let i = right.length - 1; i >= 0; i--) p.lineTo(-right[i][0], right[i][1]);
    p.closePath();
    return p;
  }
  const BOTTLE_PATH = profilePath(0, 0, 1);
  const BOTTLE_INNER = profilePath(0.011, 0.012, 0.985);
  // samples used to compute where the wine sits inside the tilted bottle
  const SAMPLES = [];
  for (let y = 0.015; y < 0.985; y += 0.008) {
    const hw = Math.max(0.002, hwAt(y) - 0.011);
    for (let k = 0; k < 6; k++) SAMPLES.push({ x: -hw + (k + 0.5) * (2 * hw / 6), y, w: (2 * hw / 6) * 0.008 });
  }
  const SAMPLE_TOTAL = SAMPLES.reduce((a, s) => a + s.w, 0);
  const shoulderLeft = (() => {
    const p = new Path2D();
    const pts = PROFILE.filter(([y]) => y >= 0.3 && y <= 0.47);
    pts.forEach(([y, w], i) => (i ? p.lineTo(-(w - 0.018), y + 0.006) : p.moveTo(-(w - 0.012), y)));
    return p;
  })();
  const rightRim = (() => {
    const p = new Path2D();
    const pts = PROFILE.filter(([y]) => y >= 0.05 && y <= 0.99);
    pts.forEach(([y, w], i) => (i ? p.lineTo(w - 0.004, y) : p.moveTo(w - 0.004, y)));
    return p;
  })();

  const logoImg = new Image();
  logoImg.src = 'assets/img/logo.svg';

  /* ---------- layout ---------- */
  let W = 0, H = 0, DPR = 1, L = {};
  const glyphLayer = document.createElement('canvas');
  const gctx = glyphLayer.getContext('2d');
  const dust = Array.from({ length: 46 }, (_, i) => ({ x: hash(i), y: hash(i + 50), s: 0.5 + hash(i + 99) * 1.5, v: 0.004 + hash(i + 7) * 0.012, a: 0.05 + hash(i + 3) * 0.22 }));

  function layout() {
    const r = sticky.getBoundingClientRect();
    W = Math.max(1, r.width); H = Math.max(1, r.height);
    DPR = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = Math.round(W * DPR); canvas.height = Math.round(H * DPR);
    canvas.style.width = W + 'px'; canvas.style.height = H + 'px';

    const portrait = W / H < 0.9;
    const logoW = Math.min(W * (portrait ? 0.88 : 0.74), 900, H * 1.25);
    const s = logoW / LW;
    const logoH = LH * s;
    const k = H / 900;
    L = {
      s, logoW, logoH, k, portrait,
      logoX: (W - logoW) / 2,
      cyPour: H * (portrait ? 0.58 : 0.63),
      cyFinal: H * (portrait ? 0.4 : 0.42),
      bottleH: Math.min(H * 0.4, W * (portrait ? 0.56 : 0.36), 440),
      v0: (portrait ? 170 : 230) * k, g: 2600 * k,
      th0: portrait ? 112 : 106, th1: portrait ? 136 : 128
    };
    schedule(portrait ? 'E' : 'L2');
    L.drop = clamp(H * 0.2, 80, 210);
    // glyph offscreen layer (with margins)
    L.gPad = 8; // units
    glyphLayer.width = Math.round((LW + L.gPad * 2) * s * DPR);
    glyphLayer.height = Math.round((LH + L.gPad * 2) * s * DPR);
  }

  /* ---------- scene state from progress ---------- */
  function logoY(p) { return lerp(L.cyPour, L.cyFinal, easeInOut(range(p, 0.86, 0.97))) - L.logoH / 2; }
  const toWorldX = (u) => L.logoX + u * L.s;
  const toWorldY = (u, p) => logoY(p) + u * L.s;

  function glyphFill(g, p) { return easeInOut(range(p, g.fillA, g.fillB)); }
  function glyphSurfaceUnits(g, f) { return g.y1 - f * (g.y1 - g.y0) - (f >= 0.999 ? 1.2 : 0); }

  function pourAngle(p) { return lerp(L.th0, L.th1, smooth(range(p, TL.pourA, TL.pourB))) * Math.PI / 180; }

  function mouthForLanding(theta, landX, landY, myOverride) {
    const My = myOverride ?? (logoY(0.5) - L.drop);
    const vx = L.v0 * Math.sin(theta), vy = -L.v0 * Math.cos(theta);
    const D = Math.max(1, landY - My);
    const tau = (-vy + Math.sqrt(vy * vy + 2 * L.g * D)) / L.g;
    return { x: landX - vx * tau, y: My, vx, vy, tau };
  }
  function centerFromMouth(mx, my, theta) {
    const h = L.bottleH * 0.5;
    return { x: mx - h * Math.sin(theta), y: my + h * Math.cos(theta) };
  }
  function mouthFromCenter(cx, cy, theta) {
    const h = L.bottleH * 0.5;
    return { x: cx + h * Math.sin(theta), y: cy - h * Math.cos(theta) };
  }

  function bottleState(p, t) {
    const impact = IMPACT_G;
    const landX = toWorldX(IMPACT_X);
    const idleC = { x: W / 2 + (L.portrait ? 0 : -L.logoW * 0.02), y: logoY(p) - 26 - L.bottleH * 0.5 };
    const bob = Math.sin(t * 1.3) * 4;
    const sway = Math.sin(t * 0.9) * 0.02;

    if (p <= TL.tiltB) {
      // idle → pour pose (interpolate the bottle center + angle)
      const th1 = pourAngle(TL.pourA);
      const landY1 = toWorldY(impact.y1, p);
      const m1 = mouthForLanding(th1, landX, landY1);
      const c1 = centerFromMouth(m1.x, m1.y, th1);
      const u = easeInOut(range(p, TL.tiltA, TL.tiltB));
      const th = lerp(sway, th1, u);
      const c = { x: lerp(idleC.x, c1.x, u), y: lerp(idleC.y + bob, c1.y, u) - Math.sin(u * Math.PI) * L.bottleH * 0.12 };
      const m = mouthFromCenter(c.x, c.y, th);
      return { theta: th, mouth: m, alpha: 1 };
    }
    if (p <= TL.backA) {
      const th = pourAngle(Math.min(p, TL.pourB));
      const f = glyphFill(impact, p);
      const landY = toWorldY(glyphSurfaceUnits(impact, f), p);
      const m = mouthForLanding(th, landX, landY);
      // tiny natural hand tremor
      m.x += Math.sin(t * 2.1) * 0.8; m.y += Math.sin(t * 1.7) * 0.8;
      return { theta: th, mouth: m, landY, alpha: 1 };
    }
    // return upright and leave the frame
    const th0 = pourAngle(TL.pourB);
    const landY0 = toWorldY(glyphSurfaceUnits(impact, 1), TL.backA);
    const m0 = mouthForLanding(th0, landX, landY0);
    const c0 = centerFromMouth(m0.x, m0.y, th0);
    const u = range(p, TL.backA, TL.backB);
    const th = lerp(th0, -0.18, easeInOut(u));
    const c = { x: lerp(c0.x, W * 0.62, easeInOut(u)), y: lerp(c0.y, -L.bottleH * 0.75, easeIn(u)) };
    return { theta: th, mouth: mouthFromCenter(c.x, c.y, th), alpha: 1 - smooth(range(u, 0.6, 1)) };
  }

  /* ---------- drawing: bottle ---------- */
  function drawBottle(st, volume, t) {
    if (st.alpha <= 0.001) return;
    const Hb = L.bottleH;
    const { theta } = st, { x: mx, y: my } = st.mouth;
    ctx.save();
    ctx.globalAlpha = st.alpha;
    ctx.translate(mx, my);
    ctx.rotate(theta);
    ctx.scale(Hb, Hb);

    // soft drop shadow / separation glow
    ctx.save();
    ctx.shadowColor = 'rgba(0,0,0,0.65)';
    ctx.shadowBlur = 40 * DPR;
    ctx.fillStyle = '#060a08';
    ctx.fill(BOTTLE_PATH);
    ctx.restore();

    // glass body
    const glass = ctx.createLinearGradient(-0.13, 0, 0.13, 0);
    glass.addColorStop(0, '#020403');
    glass.addColorStop(0.1, '#0d1812');
    glass.addColorStop(0.24, '#22342a');
    glass.addColorStop(0.34, '#122019');
    glass.addColorStop(0.6, '#0a130e');
    glass.addColorStop(0.86, '#060b08');
    glass.addColorStop(0.95, '#1c1013');
    glass.addColorStop(1, '#020202');
    ctx.fillStyle = glass;
    ctx.fill(BOTTLE_PATH);

    // wine inside (surface always horizontal in world space)
    if (volume > 0.002) {
      const sinT = Math.sin(theta), cosT = Math.cos(theta);
      const arr = SAMPLES.map((s) => ({ h: s.x * sinT + s.y * cosT, w: s.w }));
      arr.sort((a, b) => b.h - a.h);
      let acc = 0, level = arr[arr.length - 1].h;
      const target = volume * SAMPLE_TOTAL;
      for (const s of arr) { acc += s.w; if (acc >= target) { level = s.h; break; } }
      const slosh = Math.sin(t * 3.2) * 0.004;
      ctx.save();
      ctx.clip(BOTTLE_INNER);
      ctx.rotate(-theta); // back to world-aligned (still in bottle units, origin at mouth)
      const yL = level + slosh;
      const wine = ctx.createLinearGradient(0, yL, 0, yL + 0.9);
      wine.addColorStop(0, 'rgba(120,14,40,0.34)');
      wine.addColorStop(0.1, 'rgba(70,6,22,0.38)');
      wine.addColorStop(1, 'rgba(25,1,8,0.5)');
      ctx.fillStyle = wine;
      ctx.fillRect(-2, yL, 4, 3);
      ctx.strokeStyle = 'rgba(255,110,140,0.3)';
      ctx.lineWidth = 0.004;
      ctx.beginPath(); ctx.moveTo(-2, yL); ctx.lineTo(2, yL); ctx.stroke();
      ctx.restore();
    }

    // label
    const ly0 = 0.565, ly1 = 0.845, lhw = 0.13;
    ctx.save();
    ctx.clip(BOTTLE_PATH);
    ctx.fillStyle = '#0d0c0c';
    ctx.fillRect(-lhw, ly0, lhw * 2, ly1 - ly0);
    ctx.strokeStyle = 'rgba(205,172,112,0.6)';
    ctx.lineWidth = 0.0035;
    ctx.strokeRect(-lhw + 0.016, ly0 + 0.014, (lhw - 0.016) * 2, ly1 - ly0 - 0.028);
    ctx.lineWidth = 0.0018;
    ctx.strokeRect(-lhw + 0.022, ly0 + 0.02, (lhw - 0.022) * 2, ly1 - ly0 - 0.04);
    if (logoImg.complete && logoImg.naturalWidth) {
      const lw = 0.17, lh = lw * (LH / LW);
      ctx.drawImage(logoImg, -lw / 2, 0.66 - lh / 2, lw, lh);
    }
    ctx.fillStyle = 'rgba(205,172,112,0.75)';
    ctx.fillRect(-0.03, 0.715, 0.06, 0.0025);
    ctx.beginPath(); ctx.arc(0, 0.75, 0.006, 0, Math.PI * 2); ctx.fill();
    ctx.restore();

    // foil capsule (cut below the lip — the bottle is open)
    const capPath = profilePath(-0.003, 0.05, 0.2);
    const cap = ctx.createLinearGradient(-0.04, 0, 0.04, 0);
    cap.addColorStop(0, '#24030a');
    cap.addColorStop(0.18, '#6e1027');
    cap.addColorStop(0.3, '#c2445f');
    cap.addColorStop(0.36, '#f08aa0');
    cap.addColorStop(0.44, '#a42d46');
    cap.addColorStop(0.75, '#4a0816');
    cap.addColorStop(1, '#16020a');
    ctx.fillStyle = cap;
    ctx.fill(capPath);
    ctx.strokeStyle = 'rgba(0,0,0,0.35)';
    ctx.lineWidth = 0.002;
    for (let i = 0; i < 3; i++) { const yy = 0.06 + i * 0.008; ctx.beginPath(); ctx.moveTo(-0.04, yy); ctx.lineTo(0.04, yy); ctx.stroke(); }
    ctx.strokeStyle = 'rgba(255,200,210,0.35)';
    ctx.beginPath(); ctx.moveTo(-0.037, 0.0505); ctx.lineTo(0.037, 0.0505); ctx.stroke();

    // cylindrical shading over everything
    ctx.save();
    ctx.clip(BOTTLE_PATH);
    const shade = ctx.createLinearGradient(-0.13, 0, 0.13, 0);
    shade.addColorStop(0, 'rgba(0,0,0,0.72)');
    shade.addColorStop(0.18, 'rgba(0,0,0,0.25)');
    shade.addColorStop(0.42, 'rgba(0,0,0,0)');
    shade.addColorStop(0.7, 'rgba(0,0,0,0.18)');
    shade.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = shade;
    ctx.fillRect(-0.2, 0, 0.4, 1);
    // neck shading uses its own narrower gradient
    const shadeN = ctx.createLinearGradient(-0.036, 0, 0.036, 0);
    shadeN.addColorStop(0, 'rgba(0,0,0,0.6)');
    shadeN.addColorStop(0.35, 'rgba(0,0,0,0)');
    shadeN.addColorStop(1, 'rgba(0,0,0,0.65)');
    ctx.fillStyle = shadeN;
    ctx.fillRect(-0.05, 0, 0.1, 0.31);

    // specular highlights
    const spec = ctx.createLinearGradient(-0.1, 0, -0.07, 0);
    spec.addColorStop(0, 'rgba(255,255,255,0)');
    spec.addColorStop(0.45, 'rgba(255,255,255,0.55)');
    spec.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec;
    roundRect(ctx, -0.1, 0.47, 0.03, 0.49, 0.015); ctx.fill();
    const spec2 = ctx.createLinearGradient(-0.06, 0, 0.0, 0);
    spec2.addColorStop(0, 'rgba(255,255,255,0)');
    spec2.addColorStop(0.5, 'rgba(255,255,255,0.07)');
    spec2.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec2;
    ctx.fillRect(-0.06, 0.46, 0.06, 0.52);
    const spec3 = ctx.createLinearGradient(0.07, 0, 0.11, 0);
    spec3.addColorStop(0, 'rgba(255,255,255,0)');
    spec3.addColorStop(0.5, 'rgba(255,255,255,0.12)');
    spec3.addColorStop(1, 'rgba(255,255,255,0)');
    ctx.fillStyle = spec3;
    ctx.fillRect(0.07, 0.48, 0.04, 0.48);
    ctx.lineCap = 'round';
    ctx.strokeStyle = 'rgba(255,255,255,0.38)';
    ctx.lineWidth = 0.011;
    ctx.stroke(shoulderLeft);
    ctx.strokeStyle = 'rgba(255,255,255,0.4)';
    ctx.lineWidth = 0.006;
    ctx.beginPath(); ctx.moveTo(-0.019, 0.21); ctx.lineTo(-0.021, 0.3); ctx.stroke();
    ctx.strokeStyle = 'rgba(255,230,235,0.55)';
    ctx.lineWidth = 0.004;
    ctx.beginPath(); ctx.moveTo(-0.017, 0.07); ctx.lineTo(-0.017, 0.19); ctx.stroke();
    ctx.restore();

    // wine-coloured rim light (bounce from the scene)
    ctx.strokeStyle = 'rgba(239,19,81,0.32)';
    ctx.lineWidth = 0.004;
    ctx.stroke(rightRim);
    // lip
    ctx.strokeStyle = 'rgba(255,255,255,0.28)';
    ctx.lineWidth = 0.003;
    ctx.beginPath(); ctx.moveTo(-0.028, 0.002); ctx.lineTo(0.028, 0.002); ctx.stroke();

    ctx.restore();
  }

  function roundRect(c, x, y, w, h, r) {
    c.beginPath();
    c.moveTo(x + r, y); c.lineTo(x + w - r, y); c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r); c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h); c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r); c.quadraticCurveTo(x, y, x + r, y); c.closePath();
  }

  /* ---------- drawing: wine stream ---------- */
  function drawStream(st, p, t) {
    const front = smooth(range(p, TL.pourA, TL.pourA + 0.028));
    const tail = smooth(range(p, TL.pourB, TL.pourB + 0.028));
    if (front <= 0 || tail >= 1) return null;
    const { x: mx, y: my } = st.mouth;
    const vx = L.v0 * Math.sin(st.theta), vy = -L.v0 * Math.cos(st.theta);
    const D = Math.max(1, st.landY - my);
    const tauL = (-vy + Math.sqrt(vy * vy + 2 * L.g * D)) / L.g;
    const ta = tauL * tail, tb = tauL * front;
    const w0 = L.bottleH * 0.058 * (1 - 0.45 * smooth(range(p, 0.6, TL.pourB)));
    const N = 54;
    const left = [], right = [], mid = [];
    for (let i = 0; i <= N; i++) {
      const tau = lerp(ta, tb, i / N);
      const x = mx + vx * tau, y = my + vy * tau + 0.5 * L.g * tau * tau;
      const dvx = vx, dvy = vy + L.g * tau;
      const sp = Math.hypot(dvx, dvy);
      const nx = -dvy / sp, ny = dvx / sp;
      const thin = Math.pow(L.v0 / sp, 0.36);
      const wob = 1 + 0.07 * Math.sin(tau * 38 - t * 21) + 0.045 * Math.sin(tau * 91 + t * 27);
      const w = Math.max(1.2, w0 * thin * wob) / 2;
      left.push([x + nx * w, y + ny * w]);
      right.push([x - nx * w, y - ny * w]);
      mid.push([x, y, nx, ny, w]);
    }
    ctx.save();
    // body
    ctx.shadowColor = 'rgba(160,20,55,0.28)';
    ctx.shadowBlur = 8 * DPR;
    ctx.beginPath();
    ctx.moveTo(left[0][0], left[0][1]);
    left.forEach(([x, y]) => ctx.lineTo(x, y));
    for (let i = right.length - 1; i >= 0; i--) ctx.lineTo(right[i][0], right[i][1]);
    ctx.closePath();
    ctx.fillStyle = '#4d0615';
    ctx.fill();
    ctx.shadowBlur = 0;
    // rounded ends
    const head = mid[mid.length - 1];
    ctx.beginPath(); ctx.arc(head[0], head[1], head[4] * 1.12, 0, Math.PI * 2); ctx.fill();
    if (tail > 0) { const tl = mid[0]; ctx.beginPath(); ctx.arc(tl[0], tl[1], tl[4] * 1.05, 0, Math.PI * 2); ctx.fill(); }
    // dark side
    strokeOffset(mid, 0.42, 0.34, 'rgba(18,0,5,0.55)');
    // body colour band
    strokeOffset(mid, -0.12, 0.5, 'rgba(122,14,38,0.8)');
    // highlight band
    strokeOffset(mid, -0.3, 0.22, 'rgba(230,90,120,0.55)');
    // flowing glints
    ctx.setLineDash([10, 16]);
    ctx.lineDashOffset = -t * 520;
    strokeOffset(mid, -0.36, 0.08, 'rgba(255,225,232,0.85)', 1);
    ctx.setLineDash([]);
    ctx.restore();
    if (front >= 1 && tail <= 0.02) return { x: head[0], y: head[1], w: head[4] * 2 };
    return null;
  }
  function strokeOffset(mid, off, width, color, minW = 0.8) {
    ctx.beginPath();
    mid.forEach(([x, y, nx, ny, w], i) => {
      const px = x + nx * w * off * 2, py = y + ny * w * off * 2;
      i ? ctx.lineTo(px, py) : ctx.moveTo(px, py);
    });
    const avgW = mid.reduce((a, m) => a + m[4], 0) / mid.length;
    ctx.lineWidth = Math.max(minW, avgW * 2 * width);
    ctx.strokeStyle = color;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.stroke();
  }

  /* ---------- drawing: glyphs (offscreen layer, in logo units) ---------- */
  function renderGlyphLayer(p, t, impactInfo) {
    const s = L.s, pad = L.gPad;
    gctx.setTransform(1, 0, 0, 1, 0, 0);
    gctx.clearRect(0, 0, glyphLayer.width, glyphLayer.height);
    gctx.setTransform(s * DPR, 0, 0, s * DPR, pad * s * DPR, pad * s * DPR);
    const px = 1 / s; // one CSS pixel in units
    const sweep = range(p, TL.sweepA, TL.sweepB);
    const sweepX = lerp(-30, LW + 30, easeInOut(sweep));
    const awake = section.classList.contains('is-awake') ? 1 : 0.6;

    // river of wine running along the base
    const rv = range(p, TL.riverA, TL.riverB);
    const riverAlpha = 1 - smooth(range(p, 0.8, 0.9));
    if (rv > 0 && riverAlpha > 0) {
      const rl = Math.max(-1.5, IMPACT_X - rv * MAXDIST), rr = Math.min(LW + 1.5, IMPACT_X + rv * MAXDIST);
      const y = LH + 1.1, th = 1.25;
      gctx.save();
      gctx.globalAlpha = riverAlpha;
      const rg = gctx.createLinearGradient(0, y - th / 2, 0, y + th / 2);
      rg.addColorStop(0, '#b02a49'); rg.addColorStop(0.35, '#6e0d24'); rg.addColorStop(1, '#2a020b');
      gctx.fillStyle = rg;
      roundRect(gctx, rl, y - th / 2, rr - rl, th, th / 2); gctx.fill();
      gctx.fillStyle = 'rgba(255,170,190,0.55)';
      gctx.fillRect(rl + 0.6, y - th / 2 + 0.15, Math.max(0, rr - rl - 1.2), Math.max(px * 0.9, 0.18));
      gctx.restore();
    }

    for (const g of glyphs) {
      const f = glyphFill(g, p);
      // empty "glass" letter
      gctx.fillStyle = `rgba(255,255,255,${0.035 * awake})`;
      gctx.fill(g.path, 'evenodd');
      gctx.lineWidth = px * 1.1;
      gctx.strokeStyle = `rgba(255,255,255,${0.26 * awake})`;
      gctx.stroke(g.path);

      if (f > 0) {
        const top = glyphSurfaceUnits(g, f);
        const filling = f > 0 && f < 1;
        const doneAt = g.fillB;
        const agit = filling ? 1 : Math.exp(-Math.max(0, p - doneAt) * 40);
        const amp = 0.18 + agit * (g.top ? 0.45 : 1.0);
        gctx.save();
        gctx.clip(g.path, 'evenodd');
        const step = 0.6;
        gctx.beginPath();
        gctx.moveTo(g.x0 - 2, g.y1 + 2);
        const surf = [];
        for (let x = g.x0 - 2; x <= g.x1 + 2; x += step) {
          let y = top + amp * (Math.sin(x * 0.42 + t * 3.1 + g.seed) * 0.62 + Math.sin(x * 1.05 - t * 4.6 + g.seed) * 0.38);
          if (g.impact && impactInfo) {
            const dx = x - IMPACT_X;
            y += Math.exp(-(dx * dx) / 6) * Math.sin(t * 22 + x * 2.2) * 0.9;
          }
          surf.push([x, y]);
          gctx.lineTo(x, y);
        }
        gctx.lineTo(g.x1 + 2, g.y1 + 2);
        gctx.closePath();
        const wg = gctx.createLinearGradient(0, top - amp, 0, g.y1);
        wg.addColorStop(0, '#b3294a');
        wg.addColorStop(Math.min(0.5, 2.2 / Math.max(2.3, g.y1 - top)), '#7a0f29');
        wg.addColorStop(0.55, '#4c0718');
        wg.addColorStop(1, '#25020a');
        gctx.fillStyle = wg;
        gctx.fill();
        // glossy vertical reflection inside the letter
        gctx.fillStyle = 'rgba(255,255,255,0.05)';
        gctx.fillRect(g.x0 + (g.x1 - g.x0) * 0.12, top, (g.x1 - g.x0) * 0.08, g.y1 - top);
        // meniscus
        gctx.beginPath();
        surf.forEach(([x, y], i) => (i ? gctx.lineTo(x, y) : gctx.moveTo(x, y)));
        gctx.lineWidth = Math.max(px, 0.3);
        gctx.strokeStyle = 'rgba(255,150,172,0.65)';
        gctx.stroke();
        // bubbles & foam where the stream hits
        if (g.impact && impactInfo) {
          for (let i = 0; i < 16; i++) {
            const ph = (t * (0.55 + hash(i) * 0.6) + hash(i + 20)) % 1;
            const bx = IMPACT_X + (hash(i + 40) - 0.5) * 4.6 + Math.sin(t * 3 + i) * 0.3;
            const by = top + 0.6 + (1 - ph) * Math.min(14, g.y1 - top);
            gctx.beginPath();
            gctx.arc(bx, by, 0.18 + hash(i + 60) * 0.35, 0, Math.PI * 2);
            gctx.fillStyle = `rgba(255,170,190,${0.35 * (1 - ph)})`;
            gctx.fill();
          }
          gctx.fillStyle = 'rgba(240,140,160,0.35)';
          gctx.beginPath(); gctx.ellipse(IMPACT_X, top + 0.2, 2.2, 0.55, 0, 0, Math.PI * 2); gctx.fill();
        }
        gctx.restore();
      }

      // reveal: VILLE + DU turn white, the box turns brand burgundy
      if (sweep > 0) {
        const grad = gctx.createLinearGradient(sweepX - 26, 0, sweepX, 0);
        if (g.box) {
          grad.addColorStop(0, 'rgba(164,45,70,1)'); grad.addColorStop(1, 'rgba(164,45,70,0)');
        } else {
          grad.addColorStop(0, 'rgba(255,255,255,1)'); grad.addColorStop(1, 'rgba(255,255,255,0)');
        }
        gctx.fillStyle = grad;
        gctx.fill(g.path, 'evenodd');
      }
    }

    // white "VIN" knocked out of the box
    const box = glyphs[7];
    const vinA = smooth(range(glyphFill(box, p), 0.55, 1));
    gctx.fillStyle = `rgba(255,255,255,${0.18 * awake + vinA * 0.82})`;
    vinPaths.forEach((vp) => gctx.fill(vp));

    // light sweep band
    if (sweep > 0 && sweep < 1) {
      gctx.save();
      gctx.globalCompositeOperation = 'source-atop';
      const band = gctx.createLinearGradient(sweepX - 22, 0, sweepX + 4, 0);
      band.addColorStop(0, 'rgba(255,255,255,0)');
      band.addColorStop(0.7, 'rgba(255,240,244,0.9)');
      band.addColorStop(1, 'rgba(255,255,255,0)');
      gctx.fillStyle = band;
      gctx.fillRect(-10, -10, LW + 20, LH + 20);
      gctx.restore();
    }
  }

  /* ---------- background dust ---------- */
  function drawDust(t, a) {
    ctx.save();
    for (const d of dust) {
      const y = ((d.y - t * d.v) % 1 + 1) % 1;
      const x = d.x + Math.sin(t * 0.3 + d.y * 10) * 0.01;
      const cx = W * (0.2 + x * 0.6), cy = H * y;
      const fall = 1 - Math.abs(cx - W / 2) / (W * 0.45);
      ctx.globalAlpha = d.a * a * Math.max(0, fall);
      ctx.fillStyle = '#f3c9d3';
      ctx.beginPath(); ctx.arc(cx, cy, d.s, 0, Math.PI * 2); ctx.fill();
    }
    ctx.restore();
  }

  /* ---------- main render ---------- */
  function render(p, t) {
    if (!glyphLayer.width || !glyphLayer.height || !canvas.width) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);

    const awake = section.classList.contains('is-awake');
    drawDust(t, awake ? 1 : 0.4);

    const st = bottleState(p, t);
    const volume = lerp(0.78, 0.12, smooth(range(p, TL.pourA, TL.pourB)));

    // stream first (it needs the mouth position) — drawn after glyphs though
    const gx = L.logoX - L.gPad * L.s, gy = logoY(p) - L.gPad * L.s;
    const gw = glyphLayer.width / DPR, gh = glyphLayer.height / DPR;

    // we need the impact info for the glyph layer; compute stream geometry lazily
    let impactInfo = null;
    const streamOn = p > TL.pourA + 0.028 && p < TL.pourB;
    if (streamOn) impactInfo = true;
    renderGlyphLayer(p, t, impactInfo);

    // reflection on the "floor"
    const baseY = logoY(p) + L.logoH;
    ctx.save();
    ctx.globalAlpha = 0.16;
    ctx.translate(0, baseY * 2 + L.s * 2.6);
    ctx.scale(1, -1);
    ctx.drawImage(glyphLayer, gx, gy, gw, gh);
    ctx.restore();
    ctx.save();
    ctx.globalCompositeOperation = 'destination-out';
    const fade = ctx.createLinearGradient(0, baseY + L.s * 2.2, 0, baseY + L.logoH * 0.75);
    fade.addColorStop(0, 'rgba(0,0,0,0.15)');
    fade.addColorStop(1, 'rgba(0,0,0,1)');
    ctx.fillStyle = fade;
    ctx.fillRect(0, baseY + L.s * 2.2, W, L.logoH * 1.2);
    ctx.restore();

    ctx.drawImage(glyphLayer, gx, gy, gw, gh);

    if (st.landY !== undefined) drawStream(st, p, t);
    drawBottle(st, volume, t);

    // DOM overlays
    const hint = (1 - smooth(range(p, 0.005, 0.045))) * (awake ? 1 : 0);
    elHint.style.opacity = hint.toFixed(3);
    const capA = smooth(range(p, 0.17, 0.22)) * (1 - smooth(range(p, 0.42, 0.47)));
    const capB = smooth(range(p, 0.48, 0.53)) * (1 - smooth(range(p, 0.72, 0.77)));
    elCapA.style.opacity = capA.toFixed(3);
    elCapA.style.transform = `translate(-50%, ${(1 - capA) * 12}px)`;
    elCapB.style.opacity = capB.toFixed(3);
    elCapB.style.transform = `translate(-50%, ${(1 - capB) * 12}px)`;
    const fin = smooth(range(p, TL.finalA, TL.finalB));
    elFinal.style.opacity = fin.toFixed(3);
    elFinal.style.transform = `translate(-50%, ${(1 - fin) * 18}px)`;
    elFinal.style.top = (logoY(p) + L.logoH + Math.max(28, L.logoH * 0.35)) + 'px';
    elFinal.style.pointerEvents = fin > 0.6 ? 'auto' : 'none';
    elBar.style.transform = `scaleY(${p.toFixed(4)})`;
    elSkip.style.opacity = (awake ? 1 - smooth(range(p, 0.88, 0.94)) : 0).toFixed(3);
    elSkip.style.pointerEvents = p < 0.9 && awake ? 'auto' : 'none';
  }

  /* ---------- scroll + loop ---------- */
  let shown = 0, target = 0, last = performance.now(), visible = true, raf = 0;
  function readTarget() {
    if (reduceMotion) return 1;
    const r = section.getBoundingClientRect();
    const total = section.offsetHeight - sticky.offsetHeight;
    return total > 0 ? clamp(-r.top / total) : 1;
  }
  function frame(now) {
    raf = 0;
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    target = readTarget();
    const k = 1 - Math.exp(-dt * 5.5);
    shown += (target - shown) * k;
    if (Math.abs(target - shown) < 0.0004) shown = target;
    render(shown, now / 1000);
    if (visible) raf = requestAnimationFrame(frame);
  }
  function start() { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } }

  const io = new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }, { rootMargin: '100px' });
  io.observe(section);

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { layout(); start(); }, 80);
  });

  elSkip.addEventListener('click', () => {
    const next = section.nextElementSibling;
    window.scrollTo({ top: next ? next.offsetTop - 10 : section.offsetTop + section.offsetHeight, behavior: 'smooth' });
  });

  // awaken after the age gate
  function awake() { section.classList.add('is-awake'); start(); }
  if (document.documentElement.classList.contains('age-ok')) awake();
  document.addEventListener('vdv:age-ok', awake);

  layout();
  shown = target = readTarget();
  start();
})();
