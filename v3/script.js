(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];

  // Pre-filled WhatsApp inquiry links
  const WA_DEFAULT = '6285710050458';
  $$('[data-wa]').forEach(a => {
    const num = a.dataset.num || WA_DEFAULT;
    const msg = `Halo Studio Musim Semi, saya tertarik dengan layanan ${a.dataset.wa}.`;
    a.href = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`;
  });

  // Scroll reveal
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .1 });
  $$('.reveal').forEach(el => io.observe(el));

  // Hero editorial photo switcher
  const slides = $$('.slide');
  const tabs = $$('[data-slide]');
  const slideCap = $('#slideCap');
  const captions = [
    'Signature Tulip Box',
    'Pearl Calla Bridal Bouquet',
    'Pink Gingham Gerbera',
    'Sunlit Calla & Garden Roses'
  ];
  let cur = 0, timer = null;

  const setSlide = (idx) => {
    cur = (idx + slides.length) % slides.length;
    slides.forEach((s, i) => s.classList.toggle('active', i === cur));
    tabs.forEach((t, i) => {
      t.classList.toggle('active', i === cur);
      t.setAttribute('aria-selected', String(i === cur));
    });
    if (slideCap) slideCap.textContent = captions[cur];
  };

  const resetTimer = () => {
    if (reduce) return;
    clearInterval(timer);
    timer = setInterval(() => setSlide(cur + 1), 4600);
  };
  tabs.forEach(t => t.addEventListener('click', () => { setSlide(+t.dataset.slide); resetTimer(); }));
  resetTimer();

  // Filterable editorial gallery
  const filterBtns = $$('[data-filter]');
  const cards = $$('.gal-card');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const f = btn.dataset.filter;
      filterBtns.forEach(b => {
        b.classList.toggle('active', b === btn);
        b.setAttribute('aria-selected', String(b === btn));
      });
      cards.forEach(c => {
        const show = f === 'all' || c.dataset.cat === f;
        c.classList.toggle('hidden', !show);
        if (show) c.classList.add('in');
      });
    });
  });

  // Interactive Services preview switcher
  const svcRows = $$('.svc-row');
  const svcImg = $('#svcImg');
  const activateSvc = (row) => {
    svcRows.forEach(r => r.classList.toggle('active', r === row));
    if (svcImg && svcImg.getAttribute('src') !== row.dataset.img) {
      svcImg.style.opacity = '.25';
      setTimeout(() => {
        svcImg.src = row.dataset.img;
        svcImg.style.opacity = '1';
      }, 140);
    }
  };
  svcRows.forEach(row => {
    row.addEventListener('mouseenter', () => activateSvc(row));
    row.addEventListener('click', (e) => {
      if (e.target.closest('a')) return;
      activateSvc(row);
    });
  });

  // Autoplay/pause Instagram Reels on scroll visibility
  const reelVids = $$('.reel video');
  if (reelVids.length) {
    const vio = new IntersectionObserver(es => {
      es.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting && !reduce) v.play().catch(() => {});
        else v.pause();
      });
    }, { threshold: .25 });
    reelVids.forEach(v => vio.observe(v));
  }

  // Minimal Gallery & Reels Lightbox
  const lb = $('#lightbox');
  const lbStage = $('#lbStage');
  const lbClose = $('#lbClose');
  const lbPrev = $('#lbPrev');
  const lbNext = $('#lbNext');
  const lbIg = $('#lbIg');
  let activeImgs = [], idx = -1;

  const openPhoto = (card) => {
    activeImgs = cards.filter(c => !c.classList.contains('hidden'));
    idx = activeImgs.indexOf(card);
    renderPhoto();
  };

  const renderPhoto = () => {
    idx = (idx + activeImgs.length) % activeImgs.length;
    const card = activeImgs[idx];
    const img = document.createElement('img');
    img.src = card.dataset.lb;
    img.alt = card.querySelector('img')?.alt || '';
    lbStage.innerHTML = '';
    lbStage.appendChild(img);
    lbPrev.classList.remove('hide');
    lbNext.classList.remove('hide');
    lbIg.classList.add('hide');
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const openVideo = (src, igUrl) => {
    idx = -1;
    const vid = document.createElement('video');
    vid.src = src;
    vid.controls = true;
    vid.autoplay = true;
    vid.loop = true;
    vid.playsInline = true;
    lbStage.innerHTML = '';
    lbStage.appendChild(vid);
    lbPrev.classList.add('hide');
    lbNext.classList.add('hide');
    if (igUrl) { lbIg.href = igUrl; lbIg.classList.remove('hide'); }
    else lbIg.classList.add('hide');
    lb.classList.add('open');
    lb.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLb = () => {
    const v = lbStage.querySelector('video');
    if (v) v.pause();
    lb.classList.remove('open');
    lb.setAttribute('aria-hidden', 'true');
    lbStage.innerHTML = '';
    document.body.style.overflow = '';
  };

  cards.forEach(c => c.addEventListener('click', () => openPhoto(c)));
  $$('.reel').forEach(r => r.addEventListener('click', () => openVideo(r.dataset.video, r.dataset.ig)));
  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => { if (idx >= 0) { idx--; renderPhoto(); } });
  lbNext.addEventListener('click', () => { if (idx >= 0) { idx++; renderPhoto(); } });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (idx >= 0 && e.key === 'ArrowLeft') { idx--; renderPhoto(); }
    if (idx >= 0 && e.key === 'ArrowRight') { idx++; renderPhoto(); }
  });
})();
