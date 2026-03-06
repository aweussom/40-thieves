// ── Card constants ──────────────────────────────────────────────────────────
export const SUITS      = ['spades','hearts','diamonds','clubs'];
export const RANK_NAMES = ['','A','2','3','4','5','6','7','8','9','10','J','Q','K'];
export const SUIT_SYM   = { spades:'♠', hearts:'♥', diamonds:'♦', clubs:'♣', joker:'🃏' };
export const IS_RED     = { hearts:true, diamonds:true };

// ── Deck factory ────────────────────────────────────────────────────────────
// excludeRanks: numeric ranks to omit  — e.g. [12,13] for Fortitude (no K/Q)
// includeJokers: add 2 wild joker cards — used by Forty Thieves
export function createDeck({ excludeRanks = [], includeJokers = false } = {}) {
  const frag  = document.createDocumentFragment();
  const cards = [];

  SUITS.forEach(suit => {
    for (let rank = 1; rank <= 13; rank++) {
      if (excludeRanks.includes(rank)) continue;
      const el  = document.createElement('div');
      el.className = 'card face-down';
      const sym = SUIT_SYM[suit];
      const r   = RANK_NAMES[rank];
      const col = IS_RED[suit] ? 'red' : 'black';
      el.innerHTML =
        '<div class="card-back"></div>' +
        `<div class="card-front ${col}">` +
          `<span class="tl">${r}<br>${sym}</span>` +
          `<span class="suit-mid">${sym}</span>` +
          `<span class="br">${r}<br>${sym}</span>` +
        '</div>';
      frag.appendChild(el);
      cards.push({ suit, rank, el, faceUp: false, x: 0, y: 0 });
    }
  });

  if (includeJokers) {
    for (let i = 0; i < 2; i++) {
      const el = document.createElement('div');
      el.className = 'card face-down';
      el.innerHTML =
        '<div class="card-back"></div>' +
        '<div class="card-front joker">' +
          '<span class="tl">🃏</span>' +
          '<span class="suit-mid">JOKER</span>' +
          '<span class="br">🃏</span>' +
        '</div>';
      frag.appendChild(el);
      cards.push({ suit: 'joker', rank: 0, el, faceUp: false, x: 0, y: 0 });
    }
  }

  document.getElementById('container').appendChild(frag);
  return cards;
}

// ── Card helpers ─────────────────────────────────────────────────────────────
// Move a card by setting CSS transform. ms=0 is instant (no transition).
export function moveCard(card, x, y, ms, delayMs) {
  card.x = x; card.y = y;
  if (!ms || ms <= 1) {
    card.el.style.transition = 'none';
  } else {
    card.el.style.transition = `transform ${ms}ms ${delayMs || 0}ms ease`;
  }
  card.el.style.transform = `translate(${x}px,${y}px)`;
}

// Flip card face-up or face-down.
export function setFace(card, faceUp) {
  card.faceUp = faceUp;
  card.el.classList.toggle('face-down', !faceUp);
}

// Fisher-Yates shuffle; returns a new array.
export function shuffle(a) {
  const d = [...a];
  for (let i = d.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [d[i], d[j]] = [d[j], d[i]];
  }
  return d;
}

// Current root font-size in px — used to convert rem constants to pixels.
export function rem() {
  return parseFloat(getComputedStyle(document.documentElement).fontSize);
}
