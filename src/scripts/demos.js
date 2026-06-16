// CrossCoders — interactive demos. Vanilla, on-view, reduced-motion aware.
// Every block guards on its root element, so this one script is safe on every page.
const reduce = matchMedia('(prefers-reduced-motion:reduce)').matches;
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

// helpers ------------------------------------------------------------------
function onView(el, cb, th) {
  if (!el) return;
  const o = new IntersectionObserver((es) => { if (es[0].isIntersecting) { cb(); o.disconnect(); } }, { threshold: th || 0.3 });
  o.observe(el);
}
function visFlag(el, th) {
  const s = { v: false };
  if (el) { const o = new IntersectionObserver((es) => { s.v = es[0].isIntersecting; }, { threshold: th || 0.2 }); o.observe(el); }
  return s;
}
function typeInto(el, txt, sp) {
  return new Promise(async (r) => { if (!el) return r(); el.textContent = ''; for (let i = 1; i <= txt.length; i++) { el.textContent = txt.slice(0, i); await wait(sp || 40); } r(); });
}
function countUp(el, to, o) {
  o = o || {}; const dur = o.duration || 1400, pre = o.prefix || '', suf = o.suffix || '';
  const fmt = (v) => pre + Math.round(v).toLocaleString() + suf;
  if (reduce) { el.textContent = fmt(to); return; }
  let start = null;
  function step(t) { if (start == null) start = t; const p = Math.min((t - start) / dur, 1), e = 1 - Math.pow(1 - p, 3); el.textContent = fmt(to * e); if (p < 1) requestAnimationFrame(step); }
  requestAnimationFrame(step);
}
function drawPath(p, ms) {
  if (!p || reduce) return; const len = p.getTotalLength();
  p.style.strokeDasharray = len; p.style.strokeDashoffset = len; p.getBoundingClientRect();
  p.style.transition = 'stroke-dashoffset ' + (ms || 1200) + 'ms cubic-bezier(.22,1,.36,1)'; p.style.strokeDashoffset = '0';
}

// header frosted-on-scroll -------------------------------------------------
const hdr = document.querySelector('header');
if (hdr) addEventListener('scroll', () => hdr.classList.toggle('scrolled', scrollY > 10), { passive: true });

// mobile menu sheet --------------------------------------------------------
(function () {
  const burger = document.querySelector('.burger');
  const sheet = document.getElementById('msheet');
  if (!burger || !sheet) return;
  const setOpen = (open) => { document.body.classList.toggle('menu-open', open); burger.setAttribute('aria-expanded', open ? 'true' : 'false'); };
  burger.addEventListener('click', () => setOpen(!document.body.classList.contains('menu-open')));
  sheet.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setOpen(false)));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  addEventListener('resize', () => { if (innerWidth > 980) setOpen(false); });
})();

// reveal on scroll ---------------------------------------------------------
const rio = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); } }), { threshold: 0.14 });
document.querySelectorAll('.rev').forEach((el) => rio.observe(el));

// magnetic buttons ---------------------------------------------------------
if (!reduce) document.querySelectorAll('.magnetic').forEach((b) => {
  b.addEventListener('mousemove', (e) => { const r = b.getBoundingClientRect(); b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.25}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`; });
  b.addEventListener('mouseleave', () => { b.style.transform = ''; });
});

// tilt + spotlight ---------------------------------------------------------
if (!reduce) document.querySelectorAll('.tilt').forEach((c) => {
  c.addEventListener('mousemove', (e) => { const r = c.getBoundingClientRect(); const px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height; c.style.setProperty('--mx', px * 100 + '%'); c.style.setProperty('--my', py * 100 + '%'); c.style.transform = `perspective(900px) rotateX(${(0.5 - py) * 5}deg) rotateY(${(px - 0.5) * 5}deg) translateY(-4px)`; });
  c.addEventListener('mouseleave', () => { c.style.transform = ''; });
});

// cursor spotlight ---------------------------------------------------------
if (!reduce) { const cg = document.createElement('div'); cg.className = 'cglow'; document.body.prepend(cg); addEventListener('mousemove', (e) => { cg.style.setProperty('--cx', e.clientX + 'px'); cg.style.setProperty('--cy', e.clientY + 'px'); }, { passive: true }); }

// LIVE BUILD WINDOW --------------------------------------------------------
(function () {
  const win = document.querySelector('.buildwin'); if (!win) return;
  const ptr = win.querySelector('.bw-pointer'), h = win.querySelector('.bw-h'), pill = win.querySelector('.bw-pill'), pillt = win.querySelector('.bw-pill .txt'), st = win.querySelector('.bw-status .mono');
  const ba = [...win.querySelectorAll('.ba')];
  const at = (x, y) => { if (ptr) ptr.style.transform = `translate(${x}px,${y}px)`; };
  if (reduce) { ba.forEach((b) => b.classList.add('show')); if (h) h.textContent = 'Welcome home'; if (pillt) pillt.textContent = 'live'; if (st) st.textContent = 'shipped ✓'; return; }
  async function build() {
    while (true) {
      ba.forEach((b) => b.classList.remove('show')); if (h) h.textContent = '';
      pill.classList.remove('done'); pillt.textContent = 'building'; at(150, 12); st.textContent = 'initialising…'; await wait(700);
      at(60, 30); st.textContent = 'scaffolding layout…'; ba[0] && ba[0].classList.add('show'); await wait(650);
      at(120, 96); st.textContent = 'writing copy…'; await typeInto(h, 'Welcome home', 58); await wait(250);
      ba[1] && ba[1].classList.add('show'); ba[2] && ba[2].classList.add('show'); await wait(450);
      at(110, 150); st.textContent = 'styling components…'; ba[3] && ba[3].classList.add('show'); await wait(650);
      at(230, 210); st.textContent = 'wiring the AI agent…'; ba[4] && ba[4].classList.add('show'); await wait(220); ba[5] && ba[5].classList.add('show'); await wait(220); ba[6] && ba[6].classList.add('show'); await wait(550);
      at(150, 280); st.textContent = 'deploying…'; ba[7] && ba[7].classList.add('show'); await wait(950);
      pill.classList.add('done'); pillt.textContent = 'live'; st.textContent = 'shipped in 4 minutes ✓'; at(330, 12); await wait(2800);
    }
  }
  onView(win, build, 0.25);
})();

// AGENT CHAT reveal --------------------------------------------------------
(function () {
  const chat = document.querySelector('.panel .chat'); if (!chat) return;
  const bubs = [...chat.children];
  if (reduce) { bubs.forEach((b) => b.classList.add('in')); return; }
  onView(chat, () => { bubs.forEach((el, i) => setTimeout(() => el.classList.add('in'), 300 + i * 900)); }, 0.4);
})();

// TWO-PHONE DUO ------------------------------------------------------------
(function () {
  const duo = document.querySelector('[data-demo="phones"]'); if (!duo) return;
  const scrs = [...duo.querySelectorAll('.appscr')], tabs = [...duo.querySelectorAll('.ptabs button')], ind = duo.querySelector('.ptabs .ind'), hd = duo.querySelector('.back .apphd');
  const titles = ['Home', 'Events', 'Give', 'Check-in'];
  const give = duo.querySelector('.givewrap'), ptr = give.querySelector('.gptr'), gbtn = give.querySelector('.gbtn'), succ = give.querySelector('.gsuccess'), c50 = give.querySelector('[data-amt="50"]'), chips = [...give.querySelectorAll('.gchip')];
  if (reduce) { scrs.forEach((s, k) => s.classList.toggle('on', k === 0)); if (hd) hd.textContent = 'Home'; c50 && c50.classList.add('sel'); succ && succ.classList.add('on'); return; }
  const vis = visFlag(duo, 0.18);
  async function setScreen(i) { scrs.forEach((s, k) => s.classList.toggle('on', k === i)); tabs.forEach((t, k) => t.classList.toggle('active', k === i)); ind.style.transform = 'translateX(' + (i * 100) + '%)'; await typeInto(hd, titles[i], 36); }
  async function cycle() { await setScreen(0); let i = 0; while (true) { await wait(3000); if (!vis.v) { await wait(500); continue; } i = (i + 1) % 4; await setScreen(i); } }
  function mv(t) { const g = give.getBoundingClientRect(), r = t.getBoundingClientRect(); ptr.style.transform = 'translate(' + (r.left - g.left + r.width / 2 - 6) + 'px,' + (r.top - g.top + r.height / 2 - 4) + 'px)'; }
  async function giveLoop() { while (true) { chips.forEach((c) => c.classList.remove('sel')); succ.classList.remove('on'); gbtn.classList.remove('loading'); ptr.style.transform = 'translate(118px,168px)'; await wait(1000); if (!vis.v) { await wait(500); continue; } mv(c50); await wait(950); c50.classList.add('sel'); await wait(560); mv(gbtn); await wait(850); gbtn.style.transform = 'scale(.96)'; await wait(150); gbtn.style.transform = ''; gbtn.classList.add('loading'); await wait(1250); succ.classList.add('on'); await wait(2800); } }
  onView(duo, () => { cycle(); giveLoop(); }, 0.18);
})();

// ANALYTICS DASHBOARD ------------------------------------------------------
(function () {
  const root = document.querySelector('[data-demo="dash"]'); if (!root) return;
  onView(root, () => {
    root.querySelectorAll('.kv').forEach((el) => countUp(el, +el.dataset.to, { prefix: el.dataset.pre || '', suffix: el.dataset.suf || '' }));
    drawPath(root.querySelector('.dline'), 1300);
    const area = root.querySelector('.darea'); if (area) { if (reduce) area.style.opacity = '1'; else requestAnimationFrame(() => { area.style.opacity = '1'; }); }
    root.querySelectorAll('.pt').forEach((p, i) => setTimeout(() => p.classList.add('show'), 1000 + i * 180));
    root.querySelectorAll('.actrow').forEach((r, i) => setTimeout(() => r.classList.add('show'), 500 + i * 430));
    if (!reduce) { const gv = root.querySelectorAll('.kpi .kv')[1]; if (gv) { const adds = [50, 25, 100, 75]; let ai = 0, given = 18420; setInterval(() => { if (document.hidden) return; given += adds[ai++ % adds.length]; gv.textContent = 'R' + given.toLocaleString(); gv.style.color = 'var(--forest-deep)'; setTimeout(() => { gv.style.color = ''; }, 420); }, 5000); } }
  }, 0.3);
})();
