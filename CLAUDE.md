# CLAUDE.md — Thieves and Kings

## Project Summary

HTML5 recreation of Paul DeWolf's 1993 DOS shareware card game "Thieves and Kings" (THINGS13). Three solitaire games: **Forty Thieves**, **Kings Corners**, and **Fortitude**. Target: GitHub Pages, mobile-responsive.

**Reference:** https://archive.org/details/THINGS13 (playable via DOSBox in browser)

---

## Tech Stack

- **Pure HTML/CSS/JavaScript** — no frameworks, no build tools, no npm, no external libraries
- Font: Ubuntu Condensed (Google Fonts) — only external dependency
- Storage: `localStorage` for stats/persistence
- Cards: hand-rolled `<div>` elements with rank/suit text; animation via CSS `transition: transform`

---

## Current State

- `index.html` — Forty Thieves, fully implemented and working (single-file)
- `PLAN.md` — full specification for all three games
- `.github/copilot-instructions.md` — architecture and rules reference
- Kings Corners and Fortitude are **not yet implemented**

---

## Architecture Rules

- Each game starts as a **self-contained single HTML file** — no premature extraction to modules
- Extract to `common/` modules only after all three games are working
- Planned final structure:
  ```
  index.html              Game selector/menu
  forty-thieves.html
  kings-corners.html
  fortitude.html
  common/
    cards.js
    ui.js
    storage.js
  styles/
    common.css
  ```

---

## Card System (index.html)

Each card is a plain `<div class="card">` containing `.card-back` and `.card-front` divs.

```javascript
// Card object shape
{ suit, rank, el, faceUp, x, y }
// suit: 'spades'|'hearts'|'diamonds'|'clubs'
// rank: 1–13  (1=Ace, 11=J, 12=Q, 13=K)
// el:   the DOM element
```

Key helpers:
- `createDeck()` — builds all 52 card elements, appends to `#container`
- `moveCard(card, x, y, ms, delayMs)` — sets CSS `transition` + `transform`
- `setFace(card, faceUp)` — toggles `.face-down` class

**Animation pattern:** state mutations happen *before* `moveCard()`. Post-animation board refresh uses `setTimeout(fn, ms + margin)` — never rely on a transition `onComplete`/`transitionend` for correctness.

**Event handling:** one delegated `click` listener on `#container`. Never set `onclick` on individual card elements.

---

## Game Rules

### Forty Thieves (IMPLEMENTED in index.html)
- 7 columns x 5 cards (35 face-up)
- **Left pile = discard pile** (face-up). Top card is the reference.
- **Right pile = draw pile** (face-down, 16 cards). Click to draw one onto the discard pile.
- First of the 17 remaining cards starts on the discard pile; 16 go to the draw pile.
- Click a column top card ranked +-1 from the discard top → it lands on the discard pile and becomes the new reference. Chain as long as you can.
- No Ace<->King wrap.
- When stuck: click the draw pile to add one card to the discard pile.
- Win: all columns cleared. Lose: draw pile empty and no valid column card matches.
- Undo: stack-based, up to 50 states. Saves `cols`, `drawPile`, `discardPile`.
- Stats: wins/played/% stored in `localStorage` key `ft_stats`

### Kings Corners (NOT IMPLEMENTED)
- 4x4 grid (16 spaces), full 52-card deck
- Kings -> corners, Queens -> edges (non-corner), Jacks -> top/bottom (unverified), A-10 -> any remaining
- After grid filled: eliminate pairs summing to 10 (face cards stay)
- Win: grid filled; Lose: no valid position for current card
- Open questions: Jack placement, whether elimination creates new placements

### Fortitude (NOT IMPLEMENTED — implement last)
- 40-card deck (standard minus Kings and Queens)
- Klondike-style tableau (6 columns) + 2 FreeCell temp spaces + foundation piles (A->J per suit)
- "Fortitude cards" mechanic is unclear — **do not implement until verified against DOS original**

---

## Visual Style

- Dark felt background: `radial-gradient(ellipse at 50% 20%, #2d6b34 0%, #0f3a18 100%)`
- Card back: dark blue radial gradient with crosshatch pattern
- Card front: white/light grey gradient, rank + suit in corners, large suit centre
- Valid moves: red glow (`#ef5350`) on card border — only valid top cards highlighted
- Discard top card: gold border (`rgba(240,192,64,.85)`)
- Win: confetti particle animation + overlay
- Header: fixed 50px, semi-transparent black

---

## Common Features (all games)

- **Undo:** stack-based, minimum 10 moves
- **New Game:** restart
- **Statistics:** games played, won, win % via `localStorage`
- **Auto-complete:** detect forced wins (not yet in Forty Thieves)
- **Timer:** optional

---

## Implementation Order

1. Forty Thieves — done
2. Kings Corners — next
3. Fortitude — last (requires ruleset verification)

---

## Key Constraints

- No build tools, no npm, no frameworks, no external JS libraries — plain `.html`/`.css`/`.js` only
- Playability over polish in first iterations
- Validate each game against the DOS original before considering done
- Keep each game as single HTML file until all three are working
