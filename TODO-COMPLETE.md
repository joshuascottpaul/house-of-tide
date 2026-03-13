# House of Tide — Complete To-Do List

## 🔥 CRITICAL BUGS (Fix First)

### Background Images Broken
- [ ] **Fix Unsplash Source API** — `source.unsplash.com` was shut down in 2023
  - Current code: `https://source.unsplash.com/1600x900/?keyword`
  - **Solution options:**
    1. Use Unsplash API with access key (requires signup)
    2. Use Picsum Photos (`https://picsum.photos/1600/900?random`)
    3. Use Lorem Picsum with keywords (`https://loremflickr.com/1600/900/venice,renaissance`)
    4. Remove dynamic backgrounds, use static CSS gradients
  - File: `hot-engine.js` line 22

---

## ⚠️ TODAY'S FIXES (Just Completed)

### MLX Backend Fixes ✅
- [x] Fixed `testConnection()` to route to MLX backend (not hardcoded Ollama)
- [x] Added MLX debugging info to settings panel
- [x] Fixed JSON parsing bug (choices rendering as raw JSON)
- [x] Set up Playwright test infrastructure (17 passing, 8 skipped)

---

## ⬜ PHASE 2: Rival Family Memory (5 tasks)

- [ ] **2.1** Add rival state to game state (`gs.rivals` with borracchi, spinetta, calmari, liyuen)
  - ✅ Already exists in `hot-engine.js` line 59-64!
  - [ ] Need to persist through save/load
  - [ ] Need to display in UI
  
- [ ] **2.2** Create rival tracking functions:
  - [ ] `updateRivalRelationship(family, delta, reason)`
  - [ ] `getRivalContext()` — already exists (line 268)
  - [ ] `detectRivalInChoice()` — scan choice text for family names
  
- [ ] **2.3** Update AI prompts to include rival state in all event generation
  - [ ] Already included in `SYSTEM_PROMPT` (line 268)
  - [ ] Need to auto-update relationships after choices
  
- [ ] **2.4** Auto-track relationships from choices (keyword detection)
  - [ ] Positive keywords ("alliance", "help", "accept") → +1
  - [ ] Negative keywords ("decline", "challenge", "dismiss") → -1
  - [ ] Add to `rival.notes` array
  
- [ ] **2.5** Add rival summary tooltip to status bar
  - [ ] Hover on dynasty label shows: "Borracchi: Allied (+2) · Spinetta: Hostile (-1)"

**Testing:**
- [ ] Playwright tests (`tests/rival-memory.spec.js`)
- [ ] Manual 10-year playthrough
- [ ] Git commit

---

## ⬜ PHASE 3: Mid-Year Trading Layer (6 tasks)

- [ ] **3.1** Add trading state
  - ✅ `gs.cargo` exists (line 57): `{ saltfish:0, wine:0, alum:0, tin:0 }`
  - ✅ `gs.marketPrices` exists (line 58)
  - [ ] Need to initialize with actual prices
  
- [ ] **3.2** Create market price generator (`rollMarketPrices()`)
  - [ ] Seasonal pricing (Winter: saltfish expensive, wine cheap)
  - [ ] Random variance (±20%)
  - [ ] Event modifiers ("alum shortage" → +40%)
  
- [ ] **3.3** Build trading UI panel (`panel-trading`)
  - [ ] 4 commodities with buy/sell prices
  - [ ] Input fields for quantity
  - [ ] Buy/sell buttons with validation
  - [ ] Capacity display: "Cargo hold: 120/300 units (3 ships)"
  
- [ ] **3.4** Add trading phase to game loop
  - [ ] After Routes phase → show trading panel
  - [ ] "Finish Trading →" advances to year-end
  - [ ] Auto-advance if 0 ships
  
- [ ] **3.5** Integrate with AI events
  - [ ] AI mentions commodity situations
  - [ ] Hints affect next trading phase prices
  
- [ ] **3.6** Add cargo to save/load
  - [ ] Serialize `gs.cargo` and `gs.marketPrices`
  - [ ] Display in save slot: "180 units cargo"

**Testing:**
- [ ] Playwright tests (`tests/trading-layer.spec.js`)
- [ ] Manual 5-year trading playthrough
- [ ] Git commit

---

## 📋 MANUAL PLAYTHROUGH CHECKLIST

### Core Gameplay
- [ ] Start new game, complete onboarding
- [ ] Play through 5 complete years
- [ ] Make varied choices (not always option A)
- [ ] Trigger at least one Grand Venture
- [ ] Die and verify generational handoff works
- [ ] Play 3 years as heir

### Economic Systems
- [ ] Take a bank loan, verify interest compounds
- [ ] Repay loan, verify credit score improves
- [ ] Take shadow loan, let it go overdue, verify enforcement
- [ ] Commission a ship, verify fleet grows
- [ ] Sell a ship, verify marks increase

### Narrative Continuity
- [ ] Defer a Borracchi event, verify thread opens
- [ ] Wait 3 years, verify thread returns
- [ ] Resolve thread, verify it closes
- [ ] Check that ledger entries reference past events

### Edge Cases
- [ ] Reach 0 marks → death screen
- [ ] Reach 0 ships → death screen
- [ ] Reach reputation 10 → verify Legendary effects
- [ ] Reach reputation 1 → verify Disgraced effects
- [ ] Save/load mid-game, verify state persists

---

## 🔧 PREFETCH OPTIMIZATION (Already Implemented)

### Current Status ✅
- `prefetchOutcomes()` exists in `hot-engine.js` (line 210)
- Caches outcomes for local backends (MLX/Ollama)
- Silent fail on prefetch errors
- Used in `hot-ui.js` line 102

### Potential Improvements
- [ ] Add visual indicator when prefetch is running
- [ ] Show "cached" badge on choices that are pre-loaded
- [ ] Add cache size limit (max 10 outcomes)
- [ ] Clear cache on phase change

---

## 📊 SUMMARY

| Category | Total | Done | Remaining |
|----------|-------|------|-----------|
| **Critical Bugs** | 1 | 0 | 1 🔥 |
| **Today's Fixes** | 4 | 4 ✅ | 0 |
| **Phase 1 (Choice Preview)** | 3 | 3 ✅ | 0 |
| **Phase 2 (Rival Memory)** | 5 | 1 ⚠️ | 4 ⬜ |
| **Phase 3 (Trading Layer)** | 6 | 1 ⚠️ | 5 ⬜ |
| **Phase 7 (Refactor)** | 12 | 12 ✅ | 0 |
| **Manual Playthrough** | 19 | 0 | 19 ⬜ |
| **TOTAL** | 50 | 20 | **30** |

---

## 🎯 NEXT RECOMMENDED TASKS

1. **Fix Unsplash background** (5 min) — Switch to Picsum or LoremFlickr
2. **Phase 2.4** — Auto-track rival relationships from choices
3. **Phase 2.5** — Add rival tooltip to status bar
4. **Manual playthrough** — Test current state before adding more features

---

## 📝 NOTES

### Rival Memory — Partially Implemented
- `gs.rivals` object exists with 4 families (borracchi, spinetta, calmari, liyuen)
- `getRivalContext()` function exists and is called in prompts
- **Missing:** Auto-tracking, UI display, persistence

### Trading Layer — Partially Implemented  
- `gs.cargo` and `gs.marketPrices` exist in state
- **Missing:** Price generation, UI panel, trading phase integration

### Prefetch — Fully Implemented
- Works for MLX and Ollama backends
- Caches outcomes silently in background
- No UI needed (performance optimization only)
