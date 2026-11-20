(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Sticky nav
  const nav = document.getElementById('nav');
  const onScroll = () => nav.classList.toggle('solid', scrollY > 90);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Scroll reveal
  const io = new IntersectionObserver((es) => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { threshold: .12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // Subtle hero parallax
  const par = document.querySelector('[data-parallax] img');
  if (par && !reduce) {
    addEventListener('scroll', () => {
      par.style.transform = `scale(1.12) translateY(${Math.min(scrollY, 900) * .05}px)`;
    }, { passive: true });
  }

  // Collection horizontal rail
  const rail = document.getElementById('rail');
  const step = () => rail.querySelector('.card').offsetWidth + 40;
  document.getElementById('prev').onclick = () => rail.scrollBy({ left: -step(), behavior: 'smooth' });
  document.getElementById('next').onclick = () => rail.scrollBy({ left: step(), behavior: 'smooth' });
  let down = false, sx = 0, sl = 0;
  rail.addEventListener('pointerdown', e => { if (e.pointerType !== 'mouse') return; down = true; sx = e.clientX; sl = rail.scrollLeft; rail.classList.add('drag'); });
  addEventListener('pointerup', () => { down = false; rail.classList.remove('drag'); });
  addEventListener('pointermove', e => { if (down) rail.scrollLeft = sl - (e.clientX - sx); });

  // Auto-play / pause Reels videos based on visibility for smooth performance
  const reelVideos = [...document.querySelectorAll('.reel video')];
  if (reelVideos.length) {
    const vio = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const v = entry.target;
        if (entry.isIntersecting && !reduce) {
          v.play().catch(() => {});
        } else {
          v.pause();
        }
      });
    }, { threshold: .25 });
    reelVideos.forEach(v => vio.observe(v));
  }

  // Lightbox for Gallery photos & Instagram Reels videos
  const lb = document.getElementById('lightbox');
  const lbStage = document.getElementById('lbStage');
  const lbClose = document.getElementById('lbClose');
  const lbPrev = document.getElementById('lbPrev');
  const lbNext = document.getElementById('lbNext');
  const lbIg = document.getElementById('lbIg');

  const galItems = [...document.querySelectorAll('[data-lb]')];
  let galIndex = -1;

  const openPhoto = (idx) => {
    galIndex = (idx + galItems.length) % galItems.length;
    const item = galItems[galIndex];
    const img = document.createElement('img');
    img.src = item.dataset.lb;
    img.alt = item.querySelector('img')?.alt || '';
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
    galIndex = -1;
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
    if (igUrl) {
      lbIg.href = igUrl;
      lbIg.classList.remove('hide');
    } else {
      lbIg.classList.add('hide');
    }
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

  galItems.forEach((el, idx) => el.addEventListener('click', () => openPhoto(idx)));
  document.querySelectorAll('.reel').forEach(el => {
    el.addEventListener('click', () => openVideo(el.dataset.video, el.dataset.ig));
  });

  lbClose.addEventListener('click', closeLb);
  lbPrev.addEventListener('click', () => { if (galIndex >= 0) openPhoto(galIndex - 1); });
  lbNext.addEventListener('click', () => { if (galIndex >= 0) openPhoto(galIndex + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', e => {
    if (!lb.classList.contains('open')) return;
    if (e.key === 'Escape') closeLb();
    if (galIndex >= 0 && e.key === 'ArrowLeft') openPhoto(galIndex - 1);
    if (galIndex >= 0 && e.key === 'ArrowRight') openPhoto(galIndex + 1);
  });
})();
