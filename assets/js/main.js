/* =========================================================
   TECH MONK — Motion & interactivity (vanilla JS, no deps)
   ========================================================= */
(function () {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const isTouch = window.matchMedia('(hover: none)').matches;
  const $  = (s, c) => (c || document).querySelector(s);
  const $$ = (s, c) => Array.from((c || document).querySelectorAll(s));

  /* ---------- Year ---------- */
  const year = $('#year'); if (year) year.textContent = new Date().getFullYear();

  /* ---------- Preloader boot sequence ---------- */
  (function boot() {
    const pre = $('#preloader');
    const linesEl = $('#bootLines');
    const barEl = $('#bootBar');
    const pctEl = $('#bootPct');
    if (!pre) return;

    const finish = () => {
      pre.classList.add('done');
      document.body.style.overflow = '';
      setTimeout(() => pre.remove(), 700);
      startReveals();
    };

    if (reduceMotion) { barEl.style.width = '100%'; pctEl.textContent = '100%'; setTimeout(finish, 200); return; }

    document.body.style.overflow = 'hidden';
    const lines = [
      'booting tech_monk.exe ...',
      'loading content_engine ....... <span class="ok">OK</span>',
      'mounting community_core ...... <span class="ok">OK</span>',
      'arming bot_arsenal [10] ...... <span class="ok">OK</span>',
      'sync social_channels ........ <span class="ok">OK</span>',
      'ready. welcome, operator.'
    ];
    let li = 0;
    const addLine = () => {
      if (li >= lines.length) return;
      const d = document.createElement('div');
      d.className = 'l'; d.innerHTML = lines[li];
      linesEl.appendChild(d);
      requestAnimationFrame(() => { d.style.transition = 'opacity .2s'; d.style.opacity = '1'; });
      li++;
      setTimeout(addLine, 230);
    };
    addLine();

    let p = 0;
    const tick = () => {
      p += Math.random() * 16 + 4;
      if (p >= 100) p = 100;
      barEl.style.width = p + '%';
      pctEl.textContent = Math.floor(p) + '%';
      if (p < 100) setTimeout(tick, 120);
      else setTimeout(finish, 450);
    };
    setTimeout(tick, 300);
  })();

  /* ---------- Custom cursor ---------- */
  (function cursor() {
    if (isTouch) return;
    const dot = $('#cursorDot'), ring = $('#cursorRing');
    if (!dot || !ring) return;
    let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my;
    window.addEventListener('mousemove', (e) => {
      mx = e.clientX; my = e.clientY;
      dot.style.transform = `translate(${mx}px, ${my}px) translate(-50%,-50%)`;
    });
    const loop = () => {
      rx += (mx - rx) * 0.18; ry += (my - ry) * 0.18;
      ring.style.transform = `translate(${rx}px, ${ry}px) translate(-50%,-50%)`;
      requestAnimationFrame(loop);
    };
    loop();
    const hoverSel = 'a, button, [data-magnetic], [data-tilt], .bot, .stat, .clink';
    document.addEventListener('mouseover', (e) => { if (e.target.closest(hoverSel)) ring.classList.add('hover'); });
    document.addEventListener('mouseout', (e) => { if (e.target.closest(hoverSel)) ring.classList.remove('hover'); });
    window.addEventListener('mouseleave', () => { dot.style.opacity = '0'; ring.style.opacity = '0'; });
    window.addEventListener('mouseenter', () => { dot.style.opacity = '1'; ring.style.opacity = '1'; });
  })();

  /* ---------- Nav: scroll state, burger, active links ---------- */
  (function nav() {
    const nav = $('#nav'), burger = $('#burger');
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    burger && burger.addEventListener('click', () => nav.classList.toggle('open'));
    $$('.nav__links a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

    // active section highlight
    const links = $$('[data-nav]');
    const map = {};
    links.forEach(l => { const id = l.getAttribute('href').slice(1); const sec = document.getElementById(id); if (sec) map[id] = l; });
    const secObserver = new IntersectionObserver((entries) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          const l = map[en.target.id]; if (l) l.classList.add('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(map).forEach(id => secObserver.observe(document.getElementById(id)));
  })();

  /* ---------- Typed role text ---------- */
  (function typed() {
    const el = $('#typed'); if (!el) return;
    const words = ['Social Media Manager', 'Community Manager', 'Content Engineer', 'Moderator & Growth Lead'];
    if (reduceMotion) { el.textContent = words[0]; return; }
    let w = 0, c = 0, deleting = false;
    const type = () => {
      const word = words[w];
      el.textContent = deleting ? word.slice(0, c--) : word.slice(0, c++);
      let delay = deleting ? 45 : 85;
      if (!deleting && c > word.length) { deleting = true; delay = 1600; }
      else if (deleting && c < 0) { deleting = false; c = 0; w = (w + 1) % words.length; delay = 320; }
      setTimeout(type, delay);
    };
    type();
  })();

  /* ---------- Scroll reveals (staggered) ---------- */
  function startReveals() {
    const items = $$('.reveal, .reveal-up');
    if (reduceMotion) { items.forEach(i => i.classList.add('in')); return; }
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        // stagger siblings within a group
        const parent = el.parentElement;
        const group = $$('.reveal-up', parent).filter(x => x === el || x.parentElement === parent);
        const idx = group.indexOf(el);
        el.style.setProperty('--d', (idx > 0 ? Math.min(idx * 0.07, 0.42) : 0) + 's');
        el.classList.add('in');
        obs.unobserve(el);
      });
    }, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(i => io.observe(i));
  }
  // Fallback in case preloader is removed instantly
  window.addEventListener('load', () => setTimeout(() => { if (!$('#preloader')) startReveals(); }, 50));

  /* ---------- Count-up stats ---------- */
  (function counters() {
    const nums = $$('.stat__num');
    if (!nums.length) return;
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        if (reduceMotion) { el.textContent = target + suffix; obs.unobserve(el); return; }
        const dur = 1400; const t0 = performance.now();
        const step = (t) => {
          const p = Math.min((t - t0) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.floor(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(step); else el.textContent = target + suffix;
        };
        requestAnimationFrame(step);
        obs.unobserve(el);
      });
    }, { threshold: 0.5 });
    nums.forEach(n => io.observe(n));
  })();

  /* ---------- Magnetic buttons ---------- */
  (function magnetic() {
    if (isTouch || reduceMotion) return;
    $$('[data-magnetic]').forEach(el => {
      const strength = 0.35;
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left - r.width / 2) * strength;
        const y = (e.clientY - r.top - r.height / 2) * strength;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  })();

  /* ---------- 3D tilt ---------- */
  (function tilt() {
    if (isTouch || reduceMotion) return;
    $$('[data-tilt]').forEach(el => {
      const max = 10;
      el.style.transition = 'transform .15s ease-out';
      el.addEventListener('mousemove', (e) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5;
        const py = (e.clientY - r.top) / r.height - 0.5;
        el.style.transform = `perspective(800px) rotateY(${px * max}deg) rotateX(${-py * max}deg)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = 'perspective(800px) rotateY(0) rotateX(0)'; });
    });
  })();

  /* ---------- Hero parallax on scroll ---------- */
  (function parallax() {
    if (isTouch || reduceMotion) return;
    const avatar = $('#avatar'), grid = $('.hero__grid');
    let raf = null;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        if (avatar) avatar.style.translate = `0 ${y * 0.08}px`;
        if (grid) grid.style.translate = `0 ${y * 0.15}px`;
        raf = null;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---------- Copy-to-clipboard (Discord) ---------- */
  (function copy() {
    $$('[data-copy]').forEach(el => {
      el.addEventListener('click', (e) => {
        e.preventDefault();
        const val = el.dataset.copy;
        navigator.clipboard && navigator.clipboard.writeText(val);
        const arrow = $('.clink__arrow', el);
        const handle = $('.clink__handle', el);
        if (handle) { const old = handle.textContent; handle.textContent = 'copied ✓'; setTimeout(() => handle.textContent = old, 1400); }
      });
    });
  })();

})();
