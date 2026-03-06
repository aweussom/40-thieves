// ── Responsive scaling ────────────────────────────────────────────────────────
// Sets html font-size so the board fills the viewport.
//
// Parameters (all in rem unless noted):
//   remsW  — total rem width of the playfield  (e.g. 7*3.875 + 6*0.45)
//   remsH  — rem-only portion of total height  (e.g. 2.5*5.5 + 4*1.45)
//   fixedH — pixel-fixed vertical overhead     (header + padding constants)
//   cap    — maximum font-size in px            (default 32, prevents giant cards on desktop)
export function scaleToFit({ remsW, remsH, fixedH, cap = 32 }) {
  const vw     = window.innerWidth;
  const vh     = window.innerHeight;
  const margin = 8;
  const fsW = (vw - 2 * margin) / remsW;
  const fsH = (vh - fixedH - margin) / remsH;
  const fs  = Math.min(fsW, fsH, cap);
  document.documentElement.style.fontSize = Math.max(fs, 9) + 'px';
}

// ── Resize / orientation ──────────────────────────────────────────────────────
// Calls cb() after resize or orientation change (debounced).
export function initResize(cb) {
  let timer;
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(cb, 150);
  });
  window.addEventListener('orientationchange', () => setTimeout(cb, 250));
}

// ── Overlay ───────────────────────────────────────────────────────────────────
export function showOverlay(won, title, message) {
  document.getElementById('ovBox').className    = won ? 'win' : 'lose';
  document.getElementById('ovTitle').textContent = title;
  document.getElementById('ovMsg').textContent   = message;
  document.getElementById('overlay').classList.add('on');
}

export function closeOverlay() {
  document.getElementById('overlay').classList.remove('on');
}

// ── Win animation (MS Solitaire bouncing cards) ───────────────────────────────
// cards — array of card objects with { el, x, y }
// cw/ch — card width/height in px (from layout())
let winAnimId = null;

export function startWinAnimation(cards, cw, ch) {
  const floor   = window.innerHeight - ch;
  const physics = [];

  cards.forEach((card, i) => {
    setTimeout(() => {
      card.el.classList.remove('face-down');   // show face
      card.el.style.transition = 'none';
      card.el.style.zIndex     = 200 + i;
      card.el.classList.remove('discard-top', 'valid-move', 'pile-top');
      physics.push({
        el: card.el,
        x:  card.x,
        y:  card.y,
        vx: (Math.random() - 0.5) * 16,
        vy: -(10 + Math.random() * 10)
      });
    }, i * 55);
  });

  function tick() {
    for (let i = physics.length - 1; i >= 0; i--) {
      const c = physics[i];
      c.vy += 0.55;
      c.x  += c.vx;
      c.y  += c.vy;
      if (c.y >= floor) {
        c.y  = floor;
        c.vy = -Math.abs(c.vy) * 0.62;
        if (Math.abs(c.vy) < 2) c.vy = -(6 + Math.random() * 6);
      }
      c.el.style.transform = `translate(${c.x}px,${c.y}px)`;
      if (c.x < -cw * 2 || c.x > window.innerWidth + cw * 2) physics.splice(i, 1);
    }
    winAnimId = requestAnimationFrame(tick);
  }

  winAnimId = requestAnimationFrame(tick);
}

export function stopWinAnimation() {
  if (winAnimId) { cancelAnimationFrame(winAnimId); winAnimId = null; }
}

// ── Stats ─────────────────────────────────────────────────────────────────────
// Returns { load, update, render } bound to a per-game localStorage key.
//   update(won, currentScore) — call on game end
//   render()                  — writes W/P/% to #statsRow
export function initStats(storageKey) {
  function load() {
    return JSON.parse(localStorage.getItem(storageKey) || '{"played":0,"won":0}');
  }
  function update(won, currentScore) {
    const s = load();
    s.played++;
    if (won) { s.won++; s.highScore = Math.max(s.highScore || 0, currentScore); }
    localStorage.setItem(storageKey, JSON.stringify(s));
  }
  function render() {
    const s   = load();
    const pct = s.played ? Math.round(s.won / s.played * 100) : 0;
    document.getElementById('statsRow').textContent =
      `W: ${s.won}  ·  P: ${s.played}  ·  ${pct}%`;
  }
  return { load, update, render };
}
