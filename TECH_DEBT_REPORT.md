# 🔧 Technical Debt & Refactoring Report

**Generated:** Before Trading Layer implementation
**Purpose:** Address tech debt before adding major new features

---

## 📊 Code Health Summary

| Metric | Status | Notes |
|--------|--------|-------|
| **Total Lines** | ~3,800 | Well-modularized across 11 files |
| **Largest Files** | hot-engine.js (598), hot-ui.js (583), hot-prompts.js (421) | Acceptable for game logic |
| **Test Coverage** | 16 passing Playwright tests | Good for critical paths |
| **Code Smells** | Low | Clean architecture overall |

---

## 🔴 HIGH PRIORITY (Fix Before Trading Layer)

### 1. Reputation Tier Logic — Duplicated in 6+ Places

**Problem:** Reputation tier calculation repeated across files:
```javascript
// This pattern appears in: hot-events.js, hot-ui.js, hot-engine.js, hot-economy.js
gs.reputation >= 9 ? 'Legendary'
  : gs.reputation >= 7 ? 'Renowned'
  : gs.reputation >= 5 ? 'Established'
  : gs.reputation >= 3 ? 'Precarious'
  : 'Disgraced'
```

**Impact:** If we change reputation tiers, must update 6+ locations

**Solution:** Create helper function
```javascript
// hot-state.js
function getRepTier(rep) {
  return rep >= 9 ? 'Legendary'
    : rep >= 7 ? 'Renowned'
    : rep >= 5 ? 'Established'
    : rep >= 3 ? 'Precarious'
    : 'Disgraced';
}

function getRepLabel(rep) {
  return rep >= 9 ? 'the name sets the terms'
    : rep >= 7 ? 'favourable terms'
    : rep >= 5 ? 'standard terms'
    : rep >= 3 ? 'reduced terms'
    : 'hostile terms';
}
```

**Estimate:** 30 min
**Risk:** Low

---

### 2. Magic Numbers for Reputation Thresholds

**Problem:** Hard-coded values scattered throughout:
```javascript
gs.reputation >= 9  // 15 occurrences
gs.reputation >= 7  // 8 occurrences
gs.reputation >= 5  // 7 occurrences
gs.reputation >= 3  // 4 occurrences
```

**Solution:** Add constants
```javascript
// hot-data.js
const REP_THRESHOLDS = {
  LEGENDARY: 9,
  RENOWNED: 7,
  ESTABLISHED: 5,
  PRECARIOUS: 3,
};
```

**Estimate:** 30 min
**Risk:** Low

---

### 3. getSeason() Function Location

**Problem:** `getSeason()` defined in `hot-events.js` but used in `hot-trading.js`

**Current:**
```javascript
// hot-events.js line 5
function getSeason(turn) {
  return ['Spring','Summer','Autumn','Winter'][((turn - 1) % 4)];
}
```

**Better:** Move to `hot-data.js` (shared utilities)

**Estimate:** 15 min
**Risk:** Low

---

## 🟡 MEDIUM PRIORITY (Fix Before Release)

### 4. Global State Access Pattern

**Problem:** 410+ direct `gs.` references across codebase

**Current Pattern:**
```javascript
function someFunction() {
  if (gs.reputation >= 9) { ... }
  gs.marks -= 100;
  gs.ledger.unshift({...});
}
```

**Better Pattern:** Helper functions for common operations
```javascript
function addMarks(amount) {
  gs.marks += amount;
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Income',
    entry: `Gained ${amount} marks`
  });
}

function spendMarks(amount, reason) {
  if (gs.marks < amount) return false;
  gs.marks -= amount;
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Expense',
    entry: `Spent ${amount} marks on ${reason}`
  });
  return true;
}
```

**Impact:** Would make Trading Layer cleaner

**Estimate:** 2-3 hours
**Risk:** Medium (requires careful testing)

---

### 5. Fallback Event Generation

**Problem:** Duplicate fallback logic in `showHouseEvent()` and `showRoutesEvent()`:
```javascript
// hot-events.js line 182 & 205
gs.currentEvent = {
  id:'fallback',
  text:'The house awaits your direction. Pell is at his desk.',
  choices:['Attend to correspondence.','Review the ledger.','Walk the dock.'],
  repChoice:null
};
```

**Solution:** Single fallback generator function
```javascript
function createFallbackEvent(phase) {
  return {
    id: 'fallback_' + phase,
    text: phase === 'house'
      ? 'The house awaits your direction. Pell is at his desk.'
      : 'The fleet awaits orders. Casso has sent no word yet.',
    choices: phase === 'house'
      ? ['Attend to correspondence.', 'Review the ledger.', 'Walk the dock.']
      : ['Hold the current route.', 'Dispatch a fast messenger.', 'Review the manifest.'],
    repChoice: null
  };
}
```

**Estimate:** 30 min
**Risk:** Low

---

### 6. Prefetch Cache Variable Naming

**Problem:** Three similar variables with unclear distinction:
```javascript
let _prefetchCache = {};      // Legacy, not used
let _prefetchStatus = {};     // { choice: 'pending' | 'complete' | 'failed' }
let _prefetchResults = {};    // { choice: parsedResult }
```

**Solution:** Remove `_prefetchCache` (unused), rename for clarity:
```javascript
let _prefetchStatus = {};     // Status of each choice
let _prefetchOutcomes = {};   // Cached outcomes
```

**Estimate:** 20 min
**Risk:** Low

---

## 🟢 LOW PRIORITY (Nice to Have)

### 7. Event ID Magic Strings

**Problem:** Event IDs like `'h01'`, `'r10'` in autoThreadMap:
```javascript
const autoThreadMap = {
  'h01': { ... },  // What is h01?
  'h04': { ... },
  'r10': { ... },
};
```

**Better:** Use constants or comments
```javascript
const EVENT_IDS = {
  HOUSE_BORRACCHI_MARRIAGE: 'h01',
  HOUSE_WAREHOUSE_BUYER: 'h04',
  ROUTES_NAVIGATOR_LOG: 'r10',
};
```

**Estimate:** 45 min
**Risk:** Low

---

### 8. Heir Trait Death Text Processing

**Problem:** String replacement logic in `showDeathScreen()`:
```javascript
const baseHeirText = `${gs.heirName} inherits at ${gs.heirAge} — ${gs.heirTrait.death
  .replace(/\bthey\b/g, gs.hp.sub)
  .replace(/\btheir\b/g, gs.hp.pos)
  .replace(/\bThere\b/g, gs.hp.cap)}`;
```

**Better:** Helper function with clearer intent
```javascript
function formatHeirText(template, pronouns) {
  return template
    .replace(/\bthey\b/g, pronouns.sub)
    .replace(/\btheir\b/g, pronouns.pos)
    .replace(/\bThere\b/g, pronouns.cap);
}
```

**Estimate:** 20 min
**Risk:** Low

---

### 9. CSS Class Naming Consistency

**Problem:** Mixed naming conventions:
```css
.rep-tier.leg      /* Abbreviated */
.rep-tier.hi       /* Abbreviated */
.choice-btn-v      /* Abbreviated */
.thread-tracker-hdr /* Full word */
```

**Better:** Consistent full-word naming
```css
.rep-tier.legendary
.rep-tier.high
.choice-btn.venture
.thread-tracker.header
```

**Estimate:** 1 hour
**Risk:** Medium (CSS changes affect UI)

---

## 📋 RECOMMENDED REFACTORING ORDER

### Before Trading Layer (1-2 hours)
1. ✅ Reputation tier helper function (30 min)
2. ✅ Reputation threshold constants (30 min)
3. ✅ Move `getSeason()` to `hot-data.js` (15 min)
4. ✅ Remove unused `_prefetchCache` variable (20 min)

### Before Release (2-3 hours)
5. ⬜ Create `addMarks()` / `spendMarks()` helpers
6. ⬜ Consolidate fallback event generation
7. ⬜ Add event ID constants with comments

### Nice to Have (2-3 hours)
8. ⬜ Improve heir text formatting
9. ⬜ Standardize CSS naming

---

## ✅ POST-REFACTORING BENEFITS

**Trading Layer Implementation Will Be:**
- Cleaner economy calculations (reputation helpers)
- Easier season-based pricing (`getSeason()` in right place)
- Consistent mark tracking (helper functions)
- Better error handling (centralized spend logic)

**Long-Term Benefits:**
- Easier to balance reputation thresholds
- Less duplication = fewer bugs
- New developers can understand code faster
- Testing becomes easier (helper functions are testable units)

---

## 🎯 RECOMMENDATION

**Do items 1-4 before Trading Layer** (1.5 hours total):
- Low risk
- High impact on code clarity
- Makes Trading Layer implementation cleaner

**Defer items 5-9 until after Trading Layer:**
- Not blocking
- Can be done incrementally
- Lower priority than new features
