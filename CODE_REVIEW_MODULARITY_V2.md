# 🔍 House of Tide — Modularity & Debugging Code Review

**Review Date:** March 14, 2026  
**Focus:** Playwright Testing, Live Screenshot Integration, Modularity  
**v2.0 Phase:** Testing Infrastructure Enhancement

---

## 📊 **CURRENT STATE ANALYSIS**

### **File Structure (15 JavaScript modules, ~17,000 lines)**

```
house-of-tide/
├── hot-config.js       (481 lines)   — Settings, appearance
├── hot-data.js         (390 lines)   — Constants, event seeds
├── hot-state.js        (396 lines)   — Game state, save/load
├── hot-ui.js           (776 lines)   — UI rendering
├── hot-economy.js      (447 lines)   — Marks, ships, loans
├── hot-trading.js      (670 lines)   — Trading, ports
├── hot-events.js       (490 lines)   — Event generation
├── hot-engine.js       (1,703 lines) — ⚠️ GOD FILE
├── hot-llm.js          (455 lines)   — AI backends
├── hot-prompts.js      (430 lines)   — AI prompts
├── hot-logger.js       (250 lines)   — ✅ NEW: Logging
├── hot-debug.js        (200 lines)   — ✅ NEW: Snapshots
├── hot-performance.js  (250 lines)   — ✅ NEW: Perf monitoring
├── hot-screenshot.js   (120 lines)   — Screenshot capture
├── hot-screenshot-live.js (180 lines) — Live screenshots
├── hot-sfx.js          (65 lines)    — Sound effects
├── hot-stats.js        (165 lines)   — Statistics
├── hot-achievements.js (180 lines)   — Achievements
└── tests/              (36 test files) — Playwright tests
```

---

## 🔴 **CRITICAL MODULARITY ISSUES**

### **1. hot-engine.js is a 1,703-Line God File**

**Current Responsibilities:**
- Background updates (50 lines)
- Game initialization (100 lines)
- Phase management (200 lines)
- Combat system (300 lines)
- Tutorial system (200 lines)
- Prefetch caching (200 lines)
- Thread resolution (200 lines)
- AI prompt building (300 lines)
- Victory conditions (100 lines)
- Utility functions (153 lines)

**Impact:**
- ❌ Impossible to test individual features
- ❌ Merge conflicts guaranteed
- ❌ New contributors overwhelmed
- ❌ Can't reuse combat logic elsewhere
- ❌ Can't test tutorials independently

**Recommended Split:**
```
hot-engine.js (400 lines) — Core game loop only
├── hot-background.js (200 lines) — Dynamic backgrounds
├── hot-combat.js (300 lines) — Pirate combat, tactics
├── hot-tutorials.js (200 lines) — Tutorial modals, triggers
├── hot-prefetch.js (200 lines) — AI outcome prefetching
├── hot-threads.js (200 lines) — Thread system, resolution
└── hot-victory.js (150 lines) — Victory condition checks
```

**Effort:** 6-8 hours  
**Benefit:** 10x maintainability, testable modules

---

### **2. Live Screenshot System: Not Integrated with Testing**

**Current State:**
```javascript
// hot-screenshot-live.js exists (180 lines)
// Captures screenshots every 3-5 seconds
// Saves to file system with metadata
// BUT: Tests don't use it at all
```

**Problem:**
- ❌ Manual visual testing (slow, error-prone)
- ❌ No automated visual regression
- ❌ Bug reports lack visual evidence
- ❌ Can't verify UI state programmatically

**Recommended Integration:**
```javascript
// tests/helpers.js — Enhanced with screenshot capture
async function captureTestEvidence(page, testName, gameState) {
  // Capture screenshot
  await page.screenshot({
    path: `test-results/${testName}-${Date.now()}.png`,
    fullPage: true
  });
  
  // Capture game state
  await fs.writeFile(
    `test-results/${testName}-state.json`,
    JSON.stringify(gameState, null, 2)
  );
  
  // Capture console logs
  const logs = await page.evaluate(() => window.Logger?.exportLogs());
  await fs.writeFile(
    `test-results/${testName}-logs.json`,
    logs
  );
}

// Use in every test
test('Building purchase works', async ({ page }) => {
  await startNewGame(page);
  await advanceToYearEnd(page);
  await page.click('button:has-text("Commission Warehouse")');
  
  const gameState = await getGameState(page);
  await captureTestEvidence(page, 'building-purchase', gameState);
  
  expect(gameState.buildings.warehouse).toBeDefined();
});
```

**Effort:** 3-4 hours  
**Benefit:** Automated visual regression, bug evidence

---

### **3. Playwright Tests: 36 Files but No Shared Infrastructure**

**Current State:**
```
tests/
├── building-system.spec.js
├── mortality-events.spec.js
├── named-npcs.spec.js
├── port-system.spec.js
├── logger-system.spec.js
├── debug-snapshots.spec.js
├── performance-monitoring.spec.js
└── ... (29 more files)
```

**Problem:**
- ❌ Each test file duplicates setup code
- ❌ No shared test fixtures
- ❌ No test data factories
- ❌ No mock AI responses
- ❌ Tests break on AI slowness

**Current helpers.js (15 lines):**
```javascript
async function startNewGame(page, dynasty = 'TestHouse', founder = 'Tester') {
  // Basic setup only
}
```

**Recommended Infrastructure:**
```javascript
// tests/helpers.js — Enhanced (200 lines)
module.exports = {
  // Game setup
  startNewGame,
  advanceToPhase,
  advanceToYearEnd,
  completeTurn,
  
  // Test data factories
  createTestHouse,
  createTestEvent,
  createTestChoice,
  
  // AI mocking
  mockAIResponse,
  mockAIFailure,
  mockAISlowResponse,
  
  // Screenshot integration
  captureTestEvidence,
  captureOnFailure,
  
  // Assertions
  expectGameState,
  expectUIState,
  expectLedgerEntry
};

// tests/fixtures.js — Reusable fixtures (100 lines)
const fixtures = {
  // Pre-configured game states
  earlyGame: { turn: 1, marks: 800, ships: 1 },
  midGame: { turn: 10, marks: 3000, ships: 4 },
  lateGame: { turn: 30, marks: 10000, ships: 10 },
  
  // Test events
  pirateEvent: { type: 'pirate', strength: 8 },
  tradeEvent: { type: 'trade', profit: 500 },
  
  // Mock AI responses
  successResponse: { narrative: '...', marks_delta: 100 },
  failureResponse: { narrative: '...', marks_delta: -50 }
};
```

**Effort:** 4-6 hours  
**Benefit:** DRY tests, 50% faster test writing

---

### **4. No Visual Regression Testing**

**Current State:**
```javascript
// No visual comparison tests
// UI changes can break layout silently
```

**Recommended:**
```javascript
// tests/visual-regression.spec.js
test.describe('Visual Regression', () => {
  test('Trading panel layout', async ({ page }) => {
    await startNewGame(page);
    await advanceToTradingPhase(page);
    
    await expect(page).toHaveScreenshot('trading-panel.png', {
      fullPage: true,
      maxDiffPixels: 100  // Allow small differences
    });
  });
  
  test('Combat panel layout', async ({ page }) => {
    await startNewGame(page);
    await triggerPirateEncounter(page);
    
    await expect(page).toHaveScreenshot('combat-panel.png', {
      fullPage: true
    });
  });
  
  test('Year-end panel with all sections', async ({ page }) => {
    await startNewGame(page);
    await advanceToYearEnd(page);
    
    await expect(page).toHaveScreenshot('year-end-full.png', {
      fullPage: true
    });
  });
});
```

**Effort:** 2-3 hours  
**Benefit:** Catch UI regressions automatically

---

### **5. No Test Isolation / State Reset**

**Current State:**
```javascript
// Tests can interfere with each other
// localStorage persists between tests
// Game state can leak
```

**Recommended:**
```javascript
// tests/helpers.js
async function resetGameState(page) {
  await page.evaluate(() => {
    // Clear all localStorage
    localStorage.clear();
    // Reset global state
    window.gs = null;
    // Clear logger
    window.Logger?.clear();
    // Clear snapshots
    window.DebugSnapshots?.clear();
  });
  
  // Reload page for clean state
  await page.reload({ waitUntil: 'networkidle' });
}

// Run before each test
test.beforeEach(async ({ page }) => {
  await resetGameState(page);
});
```

**Effort:** 1-2 hours  
**Benefit:** Reliable, isolated tests

---

### **6. No Live Screenshot Integration for Manual Testing**

**Current State:**
```javascript
// hot-screenshot-live.js captures to file
// But no integration with bug reports
// No way to attach to test results
```

**Recommended:**
```javascript
// tests/helpers.js
async function startLiveScreenshot(page, testName) {
  await page.evaluate((testName) => {
    window.HOT_SCREENSHOT_LIVE.startLiveCapture(3);
    window.HOT_SCREENSHOT_LIVE.setMetadata({
      testName,
      timestamp: Date.now()
    });
  }, testName);
}

async function stopLiveScreenshot(page) {
  await page.evaluate(() => {
    window.HOT_SCREENSHOT_LIVE.stopCapture();
  });
}

// Use in tests
test('Complex trading flow', async ({ page }) => {
  await startLiveScreenshot(page, 'trading-flow');
  
  // ... test steps ...
  
  await stopLiveScreenshot(page);
  // Screenshots automatically saved to test-results/
});
```

**Effort:** 2-3 hours  
**Benefit:** Visual evidence for every test

---

### **7. No Debug Mode for Testing**

**Current State:**
```javascript
// Debug mode exists (CFG.debugMode)
// But not integrated with tests
// Can't enable debug mode programmatically
```

**Recommended:**
```javascript
// tests/helpers.js
async function enableDebugMode(page) {
  await page.evaluate(() => {
    window.CFG.debugMode = true;
    window.saveCFG();
    window.Logger.setLevel('debug');
  });
}

async function getDebugInfo(page) {
  return await page.evaluate(() => ({
    logs: window.Logger?.exportLogs(),
    snapshots: window.DebugSnapshots?.exportSnapshots(),
    performance: window.Performance?.exportMetrics(),
    errors: window.ErrorCapture?.exportReport()
  }));
}

// Use on test failure
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status === 'failed') {
    const debugInfo = await getDebugInfo(page);
    await fs.writeFile(
      `test-results/${testInfo.title}-debug.json`,
      JSON.stringify(debugInfo, null, 2)
    );
  }
});
```

**Effort:** 2-3 hours  
**Benefit:** Full debug info on failures

---

## 🟡 **MODERATE MODULARITY ISSUES**

### **8. Direct DOM Manipulation Everywhere**

**Problem:**
```javascript
// hot-ui.js
document.getElementById('stat-marks').textContent = gs.marks;
document.getElementById('event-text').textContent = event.text;

// hot-trading.js
const container = document.getElementById('trading-market-body');
container.innerHTML = html;
```

**Impact:**
- ❌ Can't test UI logic without DOM
- ❌ No separation of concerns
- ❌ Hard to swap UI frameworks later

**Recommended:**
```javascript
// hot-ui-renderer.js
const UIRenderer = {
  updateStat(elementId, value) {
    const el = document.getElementById(elementId);
    if (el) el.textContent = value;
  },
  
  updateStatusBar(state) {
    this.updateStat('stat-marks', state.marks);
    this.updateStat('stat-reputation', `${state.reputation}/10`);
    // ... etc
  },
  
  renderTradingPanel(data) {
    const container = document.getElementById('trading-market-body');
    if (container) container.innerHTML = this.buildTradingHTML(data);
  },
  
  buildTradingHTML(data) {
    // Pure function, testable without DOM
    return data.commodities.map(c => `...`).join('');
  }
};
```

**Effort:** 4-5 hours  
**Benefit:** Testable UI logic

---

### **9. No Component System**

**Problem:**
```javascript
// Every panel is hand-coded HTML strings
// No reusable components
// Duplication across files
```

**Recommended:**
```javascript
// hot-components.js
const Components = {
  button(text, onClick, options = {}) {
    return `<button 
      class="btn ${options.className || ''}"
      ${options.disabled ? 'disabled' : ''}
      onclick="${onClick}"
    >${text}</button>`;
  },
  
  panel(id, title, content) {
    return `
      <div id="${id}" class="panel">
        <div class="panel-title">${title}</div>
        <div class="panel-content">${content}</div>
      </div>
    `;
  },
  
  statBox(label, value, options = {}) {
    return `
      <div class="stat ${options.className || ''}">
        <span class="stat-name">${label}</span>
        <span class="stat-val">${value}</span>
      </div>
    `;
  }
};

// Usage in hot-ui.js
const html = Components.panel(
  'panel-trading',
  'The Cargo Exchange',
  tradingContent
);
```

**Effort:** 3-4 hours  
**Benefit:** Reusable, consistent UI

---

### **10. No Event Bus for Cross-Module Communication**

**Problem:**
```javascript
// Modules call each other directly
// Tight coupling
// Hard to test in isolation
```

**Recommended:**
```javascript
// hot-events-bus.js
const EventBus = {
  events: {},
  
  on(event, callback) {
    if (!this.events[event]) this.events[event] = [];
    this.events[event].push(callback);
  },
  
  emit(event, data) {
    if (this.events[event]) {
      this.events[event].forEach(cb => cb(data));
    }
  }
};

// Usage
EventBus.on('game:state:changed', (state) => {
  Logger.info('state', 'Game state changed', state);
});

EventBus.on('ui:render:complete', () => {
  Performance.endTimer('ui-render', 'render');
});

// In hot-state.js
function updateStatusBar() {
  // ... update UI ...
  EventBus.emit('game:state:changed', gs);
}
```

**Effort:** 2-3 hours  
**Benefit:** Loose coupling, testable modules

---

## 🟢 **MINOR MODULARITY ISSUES**

### **11. Magic Strings in Tests**

**Problem:**
```javascript
await page.click('text=Begin the Founding');
await page.click('text=Close the Books →');
```

**Fix:**
```javascript
// tests/selectors.js
const Selectors = {
  BEGIN_FOUNDING: 'text=Begin the Founding',
  CLOSE_BOOKS: 'text=Close the Books →',
  STAT_MARKS: '[data-testid="stat-marks"]',
  EVENT_TEXT: '#event-text'
};

// Usage
await page.click(Selectors.BEGIN_FOUNDING);
```

**Effort:** 1-2 hours  
**Benefit:** Maintainable selectors

---

### **12. No Test Coverage Reporting**

**Problem:**
```javascript
// No visibility into test coverage
// Can't see untested code paths
```

**Recommended:**
```javascript
// playwright.config.js
module.exports = {
  reporter: [['html'], ['json', { outputFile: 'coverage.json' }]],
  
  // Enable coverage
  coverage: {
    enabled: true,
    exclude: ['**/node_modules/**', '**/tests/**']
  }
};
```

**Effort:** 1 hour  
**Benefit:** Coverage visibility

---

## 📋 **NEW v2.0 TASKS FROM REVIEW**

### **CRITICAL Testing Infrastructure (6 tasks, 18-24 hours)**

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| T5 | **Split hot-engine.js** | 6-8 hrs | 1,703 lines is unmaintainable |
| T6 | **Enhanced Test Helpers** | 4-6 hrs | DRY tests, faster writing |
| T7 | **Visual Regression Tests** | 2-3 hrs | Catch UI regressions |
| T8 | **Test Isolation/Reset** | 1-2 hrs | Reliable tests |
| T9 | **Live Screenshot Integration** | 2-3 hrs | Visual evidence |
| T10 | **Debug Mode for Tests** | 2-3 hrs | Full debug on failure |

### **HIGH Modularity (3 tasks, 9-12 hours)**

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| M4 | **UI Renderer Abstraction** | 4-5 hrs | Testable UI logic |
| M5 | **Component System** | 3-4 hrs | Reusable UI components |
| M6 | **Event Bus System** | 2-3 hrs | Loose coupling |

### **MEDIUM Test Quality (2 tasks, 3-5 hours)**

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| MQ4 | **Selector Constants** | 1-2 hrs | Maintainable selectors |
| MQ5 | **Coverage Reporting** | 2-3 hrs | Visibility into gaps |

---

## 🎯 **UPDATED v2.0 ROADMAP**

### **Phase 1: Foundation (Complete ✅)**
- [x] Centralized Logging (Task 1/15)
- [x] State Snapshots (Task 2/15)
- [x] Performance Monitoring (Task 3/15)

### **Phase 2: Testing Infrastructure (NEW — 18-24 hours)**
- [ ] Split hot-engine.js (6-8 hrs)
- [ ] Enhanced Test Helpers (4-6 hrs)
- [ ] Visual Regression Tests (2-3 hrs)
- [ ] Test Isolation/Reset (1-2 hrs)
- [ ] Live Screenshot Integration (2-3 hrs)
- [ ] Debug Mode for Tests (2-3 hrs)

### **Phase 3: Modularity (NEW — 9-12 hours)**
- [ ] UI Renderer Abstraction (4-5 hrs)
- [ ] Component System (3-4 hrs)
- [ ] Event Bus System (2-3 hrs)

### **Phase 4: Code Quality (6-8 hours)**
- [ ] Magic Number Constants (2-3 hrs)
- [ ] JSDoc Type Hints (4-5 hrs)
- [ ] Consistent Error Format (2-3 hrs)
- [ ] Selector Constants (1-2 hrs)
- [ ] Coverage Reporting (2-3 hrs)

### **Phase 5: Dev Experience (4-6 hours)**
- [ ] Hot Module Reloading (3-4 hrs)
- [ ] Bundle Size Monitoring (1-2 hrs)

---

## 📊 **UPDATED v2.0 SUMMARY**

| Category | Tasks | Time | Status |
|----------|-------|------|--------|
| **Foundation** | 3 | 3 hrs | ✅ **DONE** |
| **Testing Infrastructure** | 6 | 18-24 hrs | ⏳ TODO |
| **Modularity** | 3 | 9-12 hrs | ⏳ TODO |
| **Code Quality** | 5 | 11-16 hrs | ⏳ TODO |
| **Dev Experience** | 2 | 4-6 hrs | ⏳ TODO |

**Total v2.0:** 19 tasks, 45-61 hours

---

## 🏁 **RECOMMENDATION**

**Priority Order:**

1. **Enhanced Test Helpers** (4-6 hrs) — Makes all future testing faster
2. **Test Isolation** (1-2 hrs) — Critical for reliable tests
3. **Visual Regression** (2-3 hrs) — Catch UI breaks
4. **Debug Mode for Tests** (2-3 hrs) — Better failure info
5. **Live Screenshot Integration** (2-3 hrs) — Visual evidence
6. **Split hot-engine.js** (6-8 hrs) — Tackle when you have 1 day block

**Then Modularity:**
7. UI Renderer (4-5 hrs)
8. Component System (3-4 hrs)
9. Event Bus (2-3 hrs)

**Finally Polish:**
10. Selector Constants (1-2 hrs)
11. Coverage Reporting (2-3 hrs)

---

**The ledger is open. The code awaits refactoring. Test first, then refactor.** ⚓
