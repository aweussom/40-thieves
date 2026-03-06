# Thieves and Kings — Card Games Specification

## Project Overview

HTML5 recreation of Paul DeWolf's "Thieves and Kings" (1993-1997) card game collection. Three solitaire games: Forty Thieves, Kings Corners, and Fortitude.

**Original:** DOS shareware, available at Internet Archive (THINGS13)
**Target:** Modern web browsers, mobile-responsive, GitHub Pages deployment
**Tech Stack:** HTML/CSS/JavaScript — no frameworks, no libraries, single-file per game

---

## Game 1: Forty Thieves — DONE

### Layout
- **7 columns** of 5 cards each (35 cards total), all face-up
- **Discard pile** (left) — face-up stack; top card is the active reference
- **Draw pile** (right) — 16 cards face-down; click to draw one onto discard

### Rules
1. Click a column top card if its rank is **±1** from the top of the discard pile
2. That card slides onto the discard pile and becomes the new reference — chain as long as you can
3. No Ace↔King wrap
4. When stuck: click the draw pile to add one card to the discard pile
5. Win: all 7 columns cleared. Lose: draw pile empty and no column card matches

### Deal
- Shuffle 52 cards; deal 35 to columns (left-to-right, top-to-bottom filling 7 columns of 5)
- Card 36 → discard pile (starting reference)
- Cards 37–52 → draw pile (16 cards)

---

## Game 2: Kings Corners

### Layout
- **4×4 grid** (16 spaces)
- Full 52-card deck to be placed one at a time
- Grid zones:
  ```
  [Corner] [Top]    [Top]    [Corner]
  [Side]   [Inner]  [Inner]  [Side]
  [Side]   [Inner]  [Inner]  [Side]
  [Corner] [Bottom] [Bottom] [Corner]
  ```

### Placement Rules
- **Kings** → corner positions only (4 spaces)
- **Queens** → side/edge positions only (8 non-corner edges)
- **Jacks** → top/bottom positions (verify against DOS original)
- **A–10** → any remaining empty space

### Elimination Rules
After grid is completely filled:
- Click two cards that **sum to 10** to remove them
- Valid pairs: A+9, 2+8, 3+7, 4+6, 5+5
- Face cards (K, Q, J) cannot be eliminated

### Win / Lose
- **Win:** fill all 16 spaces
- **Lose:** no valid position for the current card

### Open Questions (verify against DOS original)
- Jack placement: same 8 edge positions as Queens, or separate top/bottom only?
- Do eliminated pairs re-open spaces for further placement?
- Is the deck drawn in a fixed order or can you choose?

---

## Game 3: Fortitude

### Description
"Works a bit like Klondike Solitaire in the Vegas mode with FreeCell mechanics and no kings or queens."

### Layout (inferred)
- **Six card columns** (Klondike-style tableau)
- **Two empty spaces** (FreeCell-style temporary holds)
- **Draw pile** ("Fortitude cards")
- **Foundation piles** — 4 piles, build A→J per suit

### Deck
- Standard deck **minus all Kings and Queens** — 40 cards (A–J, 4 suits)

### Rules (partial — needs verification)
1. Build tableau in descending rank, alternating colours
2. Free spaces hold any single card temporarily
3. Drawing from the Fortitude pile has a cost or risk — mechanic unclear
4. Move Aces to foundation; build up A→J in suit

### Win / Lose
- **Win:** all cards on foundation piles
- **Lose:** stuck with no valid moves and draw pile exhausted

### Open Questions (verify before implementing)
- What exactly are "Fortitude cards"? A penalty deck?
- Initial deal: how many cards per column, how many face-up?
- Vegas mode: limited passes through deck?

---

## General Guidelines

### Cards
```javascript
{ suit, rank, el, faceUp, x, y }
// rank: 1–13 (1=Ace, 13=King)
// el: <div class="card"> DOM element
```

Utilities in each game file (inline until all three games work):
- `createDeck(excludeRanks=[])` — builds card elements
- `shuffle(deck)` — Fisher-Yates
- `moveCard(card, x, y, ms)` — CSS transition
- `setFace(card, faceUp)` — class toggle

### UI/UX
- Dark felt background, card backs dark blue with crosshatch
- Card fronts: rank + suit in corners, large suit centre; red/black colouring
- Valid moves highlighted with red glow; draw pile top has pointer cursor
- Animations: CSS `transition: transform`
- Mobile-first, touch-friendly

### Common Features
- **Undo:** stack-based (50 states), saves full game state arrays
- **New Game:** full reset and re-deal
- **Statistics:** played / won / % via `localStorage`
- **Auto-complete:** detect forced wins (post-MVP)

### Animation Pattern
- Mutate game state **before** `moveCard()`
- Use `setTimeout(fn, ms + margin)` for post-animation refresh
- Single delegated `click` listener on `#container` — never set onclick on card elements

---

## Development Priority

1. **Forty Thieves** — done
2. **Kings Corners** — next
3. **Fortitude** — last; verify ruleset against DOS original first

---

## Testing

Validate each game against the DOS original: https://archive.org/details/THINGS13

### Known discrepancies to verify
- Kings Corners: Jack placement rules
- Fortitude: complete ruleset, initial deal, Fortitude cards mechanic

---

## Deployment

**Target:** GitHub Pages
**Structure:**
```
index.html              Game selector
forty-thieves.html
kings-corners.html
fortitude.html
common/                 (extracted after all three games work)
styles/
README.md
```

**References:**
- Internet Archive: https://archive.org/details/THINGS13
- MobyGames: https://www.mobygames.com/game/223419/thieves-and-kings/
- Original author: Paul DeWolf (1993-1997)
