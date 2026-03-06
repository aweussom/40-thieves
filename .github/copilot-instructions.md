# Copilot Instructions — Thieves and Kings

## Project Overview

HTML5 recreation of Paul DeWolf's 1993 DOS shareware card game collection ("Thieves and Kings" / THINGS13). Three solitaire games: **Forty Thieves**, **Kings Corners**, and **Fortitude**.

**Tech stack:** Pure HTML/CSS/JavaScript — no frameworks, no build tools, no npm.  
**Target:** GitHub Pages deployment; mobile-responsive, touch-friendly.  
**Reference:** https://archive.org/details/THINGS13 (playable in browser via DOSBox)

---

## Architecture

Each game starts as a **self-contained single HTML file**. Common code is extracted to modules only after all three games are working. Do not prematurely refactor into shared modules.

Planned final structure (not yet created):
```
index.html              Game selector/menu
forty-thieves.html
kings-corners.html
fortitude.html
common/
  cards.js              Deck creation, shuffle, deal
  ui.js                 Drag-and-drop, animations
  storage.js            localStorage persistence
styles/
  common.css            Shared card/felt styles
```

---

## Card Representation

All games use this card object shape:

```javascript
{
  suit: 'hearts' | 'diamonds' | 'clubs' | 'spades',
  rank: 'A' | '2' | ... | '10' | 'J' | 'Q' | 'K',
  value: 1-13,   // numeric, used for rank comparisons
  color: 'red' | 'black'
}
```

Core deck utilities (implement in `common/cards.js` or inline per-game initially):

```javascript
function createDeck(excludeRanks = []) { ... }  // excludeRanks used by Fortitude to drop K, Q
function shuffle(deck) { ... }                   // Fisher-Yates
function deal(deck, count) { ... }               // Draw N cards from top
```

---

## Visual Style

- **Dark felt background**, glossy card faces (radial gradients, drop shadows) — same aesthetic as the block puzzle companion project
- **Candy Crush-inspired** card art: saturated colors, rounded corners, gloss overlay
- Highlight valid moves; gray out invalid cards
- Animations: card flip, slide, deal, particle effects on win

---

## Game Rules Summary

### Forty Thieves
- 7 columns × 5 cards (35 cards face-up) + draw pile of remaining cards
- Eliminate a column card if its rank is ±1 from the current draw card (no Ace↔King wrap)
- Eliminating a card advances the draw pile to the next card
- **Win:** all columns cleared; **Lose:** draw pile exhausted with cards remaining
- ⚠️ Draw pile size (52−35=17, not 20 as described) — verify against DOS original before coding

### Kings Corners
- 4×4 grid; Kings → corners, Queens → edges (non-corner), Jacks → top/bottom (verify vs. original), A–10 → any remaining space
- After grid is filled: eliminate pairs summing to 10 (face cards stay)
- **Win:** grid filled without getting stuck; **Lose:** no valid position for current card
- ⚠️ Jack placement rule and whether elimination creates new placements are unverified

### Fortitude
- 40-card deck (standard minus all Kings and Queens)
- Klondike-style tableau (6 columns) + 2 FreeCell-style temp spaces + foundation piles (A→J per suit)
- "Fortitude cards" mechanic is unclear — **do not implement until verified against DOS original**
- Implement last; it is the most complex and least specified game

---

## Common Features (All Games)

- **Undo:** stack-based, minimum 10 moves
- **New Game:** restart current game
- **Statistics:** games played, won, win % via `localStorage`
- **Auto-complete:** detect forced wins and finish automatically
- **Timer:** optional display

---

## Implementation Order

1. **Forty Thieves** — implement first; simplest and best-defined rules
2. **Kings Corners** — second; moderate complexity
3. **Fortitude** — last; requires ruleset verification against DOS original

---

## Key Constraints

- No build tools, no npm, no frameworks — plain `.html`/`.css`/`.js` files only
- Prioritize **playability over polish** in first iterations
- Validate each game against the DOS original at https://archive.org/details/THINGS13 before considering it done
