# House of Tide — Implementation Plan

## Overview

This plan implements the three highest-impact changes with testing at each stage. Each feature gets: implementation → Playwright tests → manual playthrough → git commit.

## ⚠️ CRITICAL: Sequential Implementation Only

**Implement ONE task at a time.**

After completing each task:
1. Run Playwright tests
2. Complete manual playthrough
3. Git commit
4. Mark task as ✅ COMPLETE in this document
5. Say: "Ready for Task [X]" where X is the next task number

**Do not start Task 2 until Task 1 is marked complete.**
**Do not start Task 3 until Task 2 is marked complete.**

---

## Phase 1: Consequence Preview on Choices ✅ COMPLETE

### Implementation Steps

**1.1 Add risk detection logic**
- Create `analyzeChoiceRisk()` function that examines choice text for keywords
- Returns risk object: `{ cost: number|null, requirement: string|null, warning: string|null }`
- Keywords to detect:
  - Cost: "commission", "buy", "hire", "bribe" → estimate marks cost
  - Requirements: "dispatch", "send ships", "fleet" → check ship count
  - Warnings: "challenge", "confront", "publicly" → Pell caution

**1.2 Modify choice rendering**
- Update `renderChoices()` to append risk indicators
- Format: choice text + `<span class="choice-hint">(requires 200mk)</span>`
- Style: subtle, italic, slightly darker color

**1.3 Update AI prompt**
- Add instruction: when generating choices, include cost/requirement hints in the choice text itself
- Example: "Commission a second vessel from the Masso yards — this will require approximately 600 marks."

### Testing

**Playwright test (`tests/choice-preview.spec.js`):**
```javascript
- Start new game
- Advance to first house event
- Verify 3 choices rendered
- Check for risk indicators (if present)
- Select choice with cost indicator
- Verify marks deducted appropriately
```

**Manual playthrough:**
- Play through 3 full years
- Verify risk indicators appear on expensive/risky choices
- Confirm indicators are helpful, not spoilers
- Check that choices without risks don't show false indicators

**Git commit:**
```
feat: add consequence preview to choices

- Add risk detection for costs, requirements, warnings
- Update choice rendering with subtle hints
- Modify AI prompt to include cost estimates
- Tested: Playwright + 3-year manual playthrough
```

---

## Phase 2: Rival Family Memory ⬜ NOT STARTED

### Implementation Steps

**2.1 Add rival state to game state**
```javascript
rivals: {
  borracchi: { relationship: 0, lastInteraction: 0, notes: [] },
  spinetta:  { relationship: 0, lastInteraction: 0, notes: [] },
  calmari:   { relationship: 0, lastInteraction: 0, notes: [] }
}
```

**2.2 Create rival tracking functions**
- `updateRivalRelationship(family, delta, reason)` — adjusts relationship score
- `getRivalContext()` — formats rival state for AI prompt
- `detectRivalInChoice()` — scans choice text for rival family names

**2.3 Update AI prompts**
- Add rival state to every `callLLM()` that generates events or outcomes
- Format: "RIVAL RELATIONSHIPS: Borracchi +2 (alliance Year 3), Spinetta -1 (snubbed Year 5)"
- Instruct AI: "Reference past interactions when a rival appears"

**2.4 Auto-track relationships**
- After each choice, scan for rival names
- Positive keywords ("alliance", "help", "accept offer") → +1
- Negative keywords ("decline", "challenge", "dismiss") → -1
- Add note to rival.notes array: "Year 7: declined marriage arrangement"

**2.5 Add rival summary to status bar**
- Hover tooltip on dynasty label shows rival standings
- Format: "Borracchi: Allied (+2) · Spinetta: Hostile (-1) · Calmari: Neutral (0)"

### Testing

**Playwright test (`tests/rival-memory.spec.js`):**
```javascript
- Start game, advance to Borracchi event
- Choose alliance option
- Verify gs.rivals.borracchi.relationship increased
- Advance 3 years
- Trigger another Borracchi event
- Verify AI narrative references past alliance
```

**Manual playthrough:**
- Play 10 years, deliberately ally with Borracchi
- Snub Spinetta twice
- Verify later events reflect these relationships
- Check that rival context appears in AI-generated text
- Test rival tooltip in status bar

**Git commit:**
```
feat: add persistent rival family memory

- Track relationship scores for Borracchi, Spinetta, Calmari
- Auto-detect rival interactions in player choices
- Pass rival history to AI in all event generation
- Add rival standings tooltip to status bar
- Tested: Playwright + 10-year playthrough
```

---

## Phase 3: Mid-Year Trading Layer ⬜ NOT STARTED

### Implementation Steps

**3.1 Add trading state**
```javascript
cargo: {
  saltfish: 0,
  wine: 0,
  alum: 0,
  tin: 0
},
market: {
  saltfish: { buy: 3, sell: 2 },
  wine:     { buy: 6, sell: 4 },
  alum:     { buy: 5, sell: 3 },
  tin:      { buy: 2, sell: 1 }
}
```

**3.2 Create market price generator**
- `rollMarketPrices()` — generates prices based on season + random variance
- Winter: salt fish expensive, wine cheap
- Summer: wine expensive, salt fish cheap
- Spring/Autumn: balanced
- Events can set price modifiers: "alum shortage" → alum +40%

**3.3 Build trading UI panel**
- New panel: `panel-trading` (appears after Routes, before year-end)
- Shows 4 commodities with buy/sell prices
- Input fields for quantity
- Buy/sell buttons with validation (marks available, ship capacity)
- Capacity display: "Cargo hold: 120/300 units (3 ships)"

**3.4 Add trading phase to game loop**
- After Routes phase completes → show trading panel
- Player can buy/sell multiple times
- "Finish Trading →" button advances to year-end
- Auto-advance if player has no ships (can't trade)

**3.5 Integrate with AI events**
- AI can mention commodity situations: "The northern alum mines are flooded"
- These hints affect market prices next trading phase
- Add to AI prompt: "Recent market: alum shortage (price +35%)"

**3.6 Add cargo to save/load**
- Serialize cargo and market state
- Display in save slot details: "180 units cargo"

### Testing

**Playwright test (`tests/trading-layer.spec.js`):**
```javascript
- Start game, advance to trading phase
- Verify 4 commodities displayed with prices
- Buy 50 units salt fish
- Verify marks deducted, cargo increased
- Check capacity limit enforced (can't exceed ship capacity)
- Sell cargo, verify marks increased
- Advance to year-end, verify cargo persists
```

**Manual playthrough:**
- Play 5 years using trading actively
- Test buy low / sell high strategy
- Verify capacity limits work (try to buy 400 units with 3 ships)
- Check that AI event hints (e.g., "wine shortage") affect prices
- Test with 0 ships (should skip trading phase)
- Save/load with cargo in hold

**Git commit:**
```
feat: add mid-year trading layer

- Implement 4-commodity market with seasonal pricing
- Add cargo capacity system (100 units per ship)
- Create trading UI panel between Routes and year-end
- Integrate market events with AI narrative
- Add cargo to save/load system
- Tested: Playwright + 5-year trading playthrough
```

---

## Testing Infrastructure Setup

### Initial Setup (before Phase 1)

**Install Playwright:**
```bash
cd house-of-tide
npm init -y
npm install -D @playwright/test
npx playwright install
```

**Create test structure:**
```
tests/
  ├── choice-preview.spec.js
  ├── rival-memory.spec.js
  ├── trading-layer.spec.js
  └── helpers.js  # shared test utilities
```

**Base test helper (`tests/helpers.js`):**
```javascript
export async function startNewGame(page, dynasty = 'TestHouse', founder = 'Tester') {
  await page.goto('file://' + process.cwd() + '/house-of-tide.html');
  await page.click('button:has-text("Begin the Founding")');
  await page.fill('#input-dynasty', dynasty);
  await page.fill('#input-founder', founder);
  await page.click('button:has-text("Open the Ledger")');
  // Skip onboarding
  await page.click('button:has-text("Skip")');
}

export async function waitForEvent(page) {
  await page.waitForSelector('#event-text', { state: 'visible', timeout: 30000 });
}

export function getGameState(page) {
  return page.evaluate(() => window.gs);
}
```

**Playwright config (`playwright.config.js`):**
```javascript
module.exports = {
  testDir: './tests',
  timeout: 60000,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
  },
};
```

---

## Manual Playthrough Checklist

For each phase, test as a real player:

**Core gameplay:**
- [ ] Start new game, complete onboarding
- [ ] Play through 5 complete years
- [ ] Make varied choices (not always option A)
- [ ] Trigger at least one Grand Venture
- [ ] Die and verify generational handoff works
- [ ] Play 3 years as heir

**Economic systems:**
- [ ] Take a bank loan, verify interest compounds
- [ ] Repay loan, verify credit score improves
- [ ] Take shadow loan, let it go overdue, verify enforcement
- [ ] Commission a ship, verify fleet grows
- [ ] Sell a ship, verify marks increase

**Narrative continuity:**
- [ ] Defer a Borracchi event, verify thread opens
- [ ] Wait 3 years, verify thread returns
- [ ] Resolve thread, verify it closes
- [ ] Check that ledger entries reference past events

**Edge cases:**
- [ ] Reach 0 marks → death screen
- [ ] Reach 0 ships → death screen
- [ ] Reach reputation 10 → verify Legendary effects
- [ ] Reach reputation 1 → verify Disgraced effects
- [ ] Save/load mid-game, verify state persists

---

## Git Workflow

### Branch Strategy
```bash
git checkout -b feat/choice-preview
# implement Phase 1
git commit -m "feat: add consequence preview to choices"
git checkout main
git merge feat/choice-preview

git checkout -b feat/rival-memory
# implement Phase 2
git commit -m "feat: add persistent rival family memory"
git checkout main
git merge feat/rival-memory

git checkout -b feat/trading-layer
# implement Phase 3
git commit -m "feat: add mid-year trading layer"
git checkout main
git merge feat/trading-layer
```

### Commit Message Format
```
<type>: <description>

- Bullet point of what changed
- Another change
- Tested: <test method>
```

Types: `feat`, `fix`, `test`, `docs`, `refactor`

---

## Timeline Estimate

- **Phase 1 (Choice Preview):** 2-3 hours (simple text append + AI prompt update)
- **Phase 2 (Rival Memory):** 4-6 hours (state tracking + AI integration + UI)
- **Phase 3 (Trading Layer):** 8-12 hours (new UI panel + price system + capacity logic)

**Total:** 14-21 hours for all three features with full testing.

---

## Success Criteria

After all three phases:

1. **Choices feel informed** — players know what they're risking before they commit
2. **The world has memory** — rivals react to past interactions, not just current reputation
3. **Players have agency** — can actively trade, not just react to events
4. **Tests pass** — Playwright suite runs green
5. **Manual play feels good** — 20-year playthrough feels coherent and engaging

The ledger is open. The plan is written. Turn the page.

---

## #7 Code Refactor — Subtask Plan

### Principles

1. **Strangler Fig** — extract piece by piece, never rewrite. The monolith keeps working at every step.
2. **One file per step** — each sub-task extracts exactly one logical group. No combining steps.
3. **No behaviour changes** — refactoring only. Zero feature changes per sub-task. If you touch logic, stop.
4. **Green at every step** — game must open in browser and pass Playwright tests after each extraction before committing.
5. **Commit after each green step** — small, reversible commits. If a step breaks something, `git checkout` and try again.
6. **No build step** — plain `<script src>` tags in dependency order. All globals stay global. Browser handles the rest.

### File Map (dependency order = load order)

| Sub-task | File | Contents | Deps | Est. lines |
|----------|------|----------|------|------------|
| 7.1 | `hot-game.css` | All CSS from `<style>` block | none | ~350 |
| 7.2 | `hot-data.js` | EPIGRAMS, LOADING_MSGS, YEAR_END_NOTES, HEIR_TRAITS, HEIR_MALE/FEMALE, SITUATION_SEEDS, THREAD_SEEDS, THREAD_FOLLOWUPS, EVENT_GEN_MSGS, TEST_MODEL, `rand()` | none | ~270 |
| 7.3 | `hot-prompts.js` | SYSTEM_PROMPT, EVENT_GEN_PROMPT, ADVISOR_SYSTEM (currently at line 3431 in advisor block — move it here) | none | ~230 |
| 7.4 | `hot-config.js` | CFG_KEY, CFG_DEFAULTS, CFG, `loadCFG`, `saveCFG`, `updateEngineLabel`, `openSettings`, `closeSettings`, `settingsBackendChange`, `saveSettings` | none | ~100 |
| 7.5 | `hot-llm.js` | `callLLM` only | config | ~190 |
| 7.6 | `hot-state.js` | `gs`, `serialiseState`, `deserialiseState`, `autoSave`, `saveToSlot`, `flashSaveSlot`, `loadFromSlot`, `loadAutosave`, `deleteSlot`, `renderSaveOverlay`, `openSaveOverlay`, `closeSaveOverlay`, `renderTitleSaves` | config, data | ~180 |
| 7.7 | `hot-ui.js` | `showNotification`, `showScreen`, `showPanel`, `showError`, `hideError`, `rotateEpigram`, `updateStatusBar`, `renderThreadTracker`, `toggleThreads`, `updateLedgerHistory`, `debugLog`, `renderDebugLog`, `escHtml`, `toggleDebug`, `debugClear`, `debugCopyLast`, `debugEntries` | state, config | ~180 |
| 7.8 | `hot-economy.js` | `rollShipMarket`, `buyShip`, `sellShip`, `getBankRate`, `applyLoanInterest`, `takeBankLoan`, `takeShadowLoan`, `repayLoan`, `showYearEndFinance` | state, ui | ~220 |
| 7.9 | `hot-events.js` | `getSeason`, `pickSeed`, `generateEvent`, `checkAndShowRoutes`, `showHouseEvent`, `showRoutesEvent`, `pickVentureSeed`, `showVenture`, `analyzeChoiceRisk`, `renderChoices` | state, ui, llm, prompts, data | ~280 |
| 7.10 | `hot-engine.js` | `startGame`, `launchGame`, `beginPhase`, `advancePhase`, `beginYear`, `makeChoice`, `seed_label_from_type`, `showResult`, `showYearEnd`, `showDeathScreen`, `generationalHandoff`, `resetGame`, `renderOnboard`, `onboardNext`, `onboardPrev`, `skipOnboard`, `advisorOpen`, `toggleAdvisor`, `askAdvisor`, `testConnection`, `_origBeginPhase`/`_origShowResult` hooks (these two MUST be last in file, after originals are defined) | everything | ~670 |
| 7.11 | `tests/unit.spec.js` | Unit tests for pure functions: `analyzeChoiceRisk`, `getSeason`, `seed_label_from_type`, `serialiseState`/`deserialiseState` round-trip | — | ~80 |
| 7.12 | `house-of-tide.html` | Final cleanup — HTML shell only. Just structure + `<link>` + `<script>` tags. No inline JS or CSS. | — | ~120 |

### Per-step Protocol — MANDATORY, NO EXCEPTIONS

Every sub-task must complete ALL SIX steps before the next sub-task begins.
Steps 5 and 6 are not optional. Do not skip them. Do not combine steps across sub-tasks.

```
1. Create new file with extracted code (copy-paste only — do not edit logic)
2. Delete the same code from house-of-tide.html
3. Add <script src="hot-xxx.js"> or <link rel="stylesheet"> in correct position
4. Open house-of-tide.html in browser — spot check: start game, make a choice, verify nothing is visually broken
5. npx playwright test — ALL tests must pass before proceeding
6. git add hot-xxx.js house-of-tide.html && git commit
```

**Hard gates:**
- If step 5 fails → fix the error, re-run step 5. Do not proceed to step 6 or the next sub-task until green.
- If step 4 shows visual breakage → fix before running tests.
- A sub-task is only COMPLETE when the commit exists. "Extracted but not committed" = not done.

### Script tag order in HTML (7.12 target state)

```html
<link rel="stylesheet" href="hot-game.css">
<!-- in <head> -->

<script src="hot-data.js"></script>
<script src="hot-prompts.js"></script>
<script src="hot-config.js"></script>
<script src="hot-llm.js"></script>
<script src="hot-state.js"></script>
<script src="hot-ui.js"></script>
<script src="hot-economy.js"></script>
<script src="hot-events.js"></script>
<script src="hot-engine.js"></script>
<!-- before </body> -->
```

### Things to watch for — audited against actual code

**1. Monkey-patches execute at parse time — critical load order issue**

`_origBeginPhase = beginPhase` (line 3496) and `_origShowResult = showResult` (line 3749) are top-level `const` assignments. They execute the moment their script is parsed. `beginPhase` and `showResult` must already be defined at that point.

Fix: both monkey-patches go at the **bottom of `hot-engine.js`**, after their target functions are defined. Do not put them in any earlier-loaded file.

**2. `testConnection` is NOT a clean LLM function — wrong file in plan**

`testConnection` (line 3765) reads DOM elements (`test-btn`, `test-result`), hardcodes Ollama-specific fetch logic, and references `TEST_MODEL` from `hot-data.js`. It belongs in `hot-engine.js`, not `hot-llm.js`. Move accordingly.

**3. `ADVISOR_SYSTEM` is not grouped with other prompts in the current file**

Currently sits at line 3431 sandwiched inside the advisor block between `toggleAdvisor` and `askAdvisor`. When extracting, move it to `hot-prompts.js` with the other prompts. Leave `toggleAdvisor`, `advisorOpen`, and `askAdvisor` in `hot-engine.js`.

**4. Two `DOMContentLoaded` handlers — both safe, different homes**

- Line 1322: registers the ollama model change listener. Lives in `hot-config.js`. Fine.
- Line 3756: calls `loadCFG()`, `renderTitleSaves()`, `rotateEpigram()`. These functions end up across `hot-config.js`, `hot-state.js`, `hot-engine.js`. This handler goes in `hot-state.js`. It's safe because `DOMContentLoaded` fires after ALL scripts at the bottom of `<body>` have run — all functions are available.

**5. `gs` uses `Set` — handled, but verify**

`gs.usedHouse`, `gs.usedRoutes`, `gs.usedVentures` are `Set` objects. `serialiseState` spreads them to arrays; `deserialiseState` reconstructs them. This is already correct — just don't accidentally assign plain arrays to these fields anywhere during the refactor.

**6. `const` re-declaration will throw**

During each extraction step: delete the code from the HTML first, then reload. Never have the same `const` declared in both the HTML and an external file simultaneously. Git staging gives you a safety net.

**7. Inline `onclick=` in HTML calls global functions — safe by design**

All functions stay global (no `export`/`import`). Inline handlers will resolve correctly as long as the scripts are loaded before user interaction, which they are (all scripts at bottom of `<body>`, loaded before any click is possible).

### Commit message format

```
refactor: extract <description> into <filename>

- Moved: list of functions/constants moved
- No logic changes
- Tested: browser spot check + npx playwright test
```

### Status

| Sub-task | Status |
|----------|--------|
| 7.1 CSS | ✅ commit d829143 |
| 7.2 Data/constants | ✅ commit b73bddc |
| 7.3 Prompts | ✅ commit 03f2c08 |
| 7.4 Config/settings | ✅ commit a64ced9 |
| 7.5 LLM layer | ✅ commit 9405048 |
| 7.6 State + save/load | ✅ commit 12699dc |
| 7.7 UI utilities | ✅ commit 4b466a5 |
| 7.8 Economy | ✅ commit be44a35 |
| 7.9 Events | ✅ commit d918b72 |
| 7.10 Engine | ✅ commit dedf71c |
| 7.11 Unit tests | ✅ commit 6f3c14d |
| 7.12 HTML shell cleanup | ✅ complete (HTML was clean after 7.10) |
