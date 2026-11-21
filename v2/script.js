(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  /* ---------- WhatsApp links ---------- */
  const NUM = '6285710050458';
  $$('[data-wa]').forEach(a => {
    const item = a.dataset.wa;
    const num = a.dataset.num || NUM;
    const msg = item
      ? `Halo Studio Musim Semi, saya mau tanya/pesan: ${item}`
      : 'Halo Studio Musim Semi, saya mau tanya-tanya dulu ya.';
    a.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  });

  /* ---------- nav ---------- */
  const nav = $('#nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 60);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- reveal ---------- */
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  }), { threshold: .12 });
  $$('.reveal').forEach(el => io.observe(el));

  /* ---------- simple 3D CSS flower (19 elements, zero rAF loop) ---------- */
  const stage = $('#stage');
  const rig = $('#flowerRig');
  const flower = $('#flower');

  const core = document.createElement('div');
  core.className = 'core';
  flower.appendChild(core);

  const rings = [
    { cls: 'r0', n: 5, w: 54, h: 82, r: 14, z: 8, open: -58, shut: -82, off: 0 },
    { cls: 'r1', n: 6, w: 74, h: 112, r: 17, z: 2, open: -42, shut: -74, off: 30 },
    { cls: 'r2', n: 7, w: 94, h: 142, r: 20, z: -6, open: -22, shut: -62, off: 14 }
  ];

  rings.forEach(ring => {
    for (let k = 0; k < ring.n; k++) {
      const p = document.createElement('div');
      p.className = `petal ${ring.cls}`;
      const az = k * (360 / ring.n) + ring.off;
      const z = ring.z + k * .4;
      p.style.cssText = `--w:${ring.w}px;--h:${ring.h}px;--r:${ring.r}px;--z:${z.toFixed(1)}px;--az:${az.toFixed(1)}deg;--open:${ring.open}deg;--shut:${ring.shut}deg;`;
      flower.appendChild(p);
    }
  });

  // Bloom open once on load
  if (reduce) {
    flower.classList.remove('bud');
  } else {
    setTimeout(() => flower.classList.remove('bud'), 120);
  }

  // Lightweight drag-to-rotate + click-to-toggle-bloom (no continuous rAF loop)
  let rx = 28, ry = -14;
  let dragging = false, moved = 0, lx = 0, ly = 0;

  const getScale = () => innerWidth < 520 ? .62 : innerWidth < 860 ? .8 : 1;
  const setRig = (ox = 0, oy = 0) => {
    const s = getScale();
    rig.style.transform = `scale3d(${s},${s},${s}) rotateX(${(rx + ox).toFixed(1)}deg) rotateY(${(ry + oy).toFixed(1)}deg)`;
  };
  setRig();
  addEventListener('resize', () => setRig(), { passive: true });

  stage.addEventListener('pointerdown', e => {
    dragging = true; moved = 0; lx = e.clientX; ly = e.clientY;
    stage.classList.add('drag');
    stage.setPointerCapture(e.pointerId);
  });

  stage.addEventListener('pointermove', e => {
    if (dragging) {
      const dx = e.clientX - lx, dy = e.clientY - ly;
      moved += Math.hypot(dx, dy);
      lx = e.clientX; ly = e.clientY;
      ry += dx * .45;
      rx = Math.max(-70, Math.min(70, rx - dy * .38));
      setRig();
    } else if (!reduce && e.pointerType === 'mouse') {
      const r = stage.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - .5;
      const ny = (e.clientY - r.top) / r.height - .5;
      setRig(-ny * 18, nx * 24);
    }
  });

  const end = () => {
    if (!dragging) return;
    dragging = false;
    stage.classList.remove('drag');
    if (moved < 8) flower.classList.toggle('bud');
  };
  stage.addEventListener('pointerup', end);
  stage.addEventListener('pointercancel', end);
  stage.addEventListener('pointerleave', () => { if (!dragging) setRig(); });

  /* ---------- subtle tilt on catalog cards ---------- */
  if (matchMedia('(hover:hover)').matches && !reduce) {
    $$('[data-tilt]').forEach(el => {
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(.5 - py) * 9}deg) rotateY(${(px - .5) * 11}deg) translateY(-4px)`;
      });
      el.addEventListener('pointerleave', () => { el.style.transform = ''; });
    });
  }
})();
