# 🔍 House of Tide — Code Review for v2.0

**Review Date:** March 14, 2026  
**Current State:** 97% complete, launch-ready  
**v2.0 Focus:** Modularity, Debugging, Testing Infrastructure

---

## 📊 **Current Architecture Overview**

### **File Structure (12 JavaScript modules, ~15,000 lines)**

```
house-of-tide/
├── hot-config.js       (481 lines)   — Settings, appearance, localStorage
├── hot-data.js         (390 lines)   — Constants, event seeds, epigrams
├── hot-state.js        (396 lines)   — Game state (gs), save/load
├── hot-ui.js           (776 lines)   — UI rendering, choices, death screen
├── hot-economy.js      (447 lines)   — Marks, ships, loans, year-end finance
├── hot-trading.js      (670 lines)   — Trading, ports, commodities
├── hot-events.js       (490 lines)   — Event generation, AI prompts
├── hot-engine.js       (1,703 lines) — Game loop, phase management, combat
├── hot-llm.js          (455 lines)   — AI backends (MLX, OpenAI, Claude, Ollama)
├── hot-prompts.js      (430 lines)   — AI system prompts
├── hot-screenshot.js   (120 lines)   — Screenshot capture
├── hot-screenshot-live.js (180 lines) — Live screenshot sharing
├── hot-sfx.js          (65 lines)    — Sound effects
├── hot-stats.js        (165 lines)   — Statistics dashboard
├── hot-achievements.js (180 lines)   — Achievement system
└── tests/              (33 test files) — Playwright tests
```

---

## 🔴 **CRITICAL ISSUES (v2.0 Priority)**

### **1. God File: hot-engine.js (1,703 lines)**

**Problem:** Single file handles:
- Background updates
- Pirate combat
- Tutorial system
- Phase management
- Prefetch caching
- Thread resolution
- AI prompt building

**Impact:**
- Hard to test individual features
- Merge conflicts likely
- New contributors overwhelmed

**Fix:**
```javascript
// Split into:
├── hot-engine.js       (400 lines) — Core game loop, phase transitions
├── hot-background.js   (200 lines) — Dynamic background system
├── hot-combat.js       (300 lines) — Pirate combat, tactics
├── hot-tutorials.js    (200 lines) — Tutorial modals, triggers
├── hot-prefetch.js     (200 lines) — AI outcome prefetching
├── hot-threads.js      (200 lines) — Thread system, resolution
```

**Effort:** 6-8 hours  
**Benefit:** 10x easier to maintain, test, extend

---

### **2. Global State Everywhere (gs.)**

**Problem:** 410+ direct `gs.` references throughout codebase

**Example:**
```javascript
// hot-trading.js
function getCargoCapacity() {
  return gs.ships * 100;  // Direct global access
}

// hot-economy.js  
function buyShip() {
  if (gs.marks < price) return;  // Direct global access
  gs.marks -= price;  // Direct mutation
  gs.ships++;  // Direct mutation
}
```

**Impact:**
- No validation on state changes
- Hard to track when/where state changes
- Can't add logging/telemetry easily
- Race conditions possible

**Fix:**
```javascript
// State manager wrapper
const GameState = {
  get Ships() { return gs.ships; },
  set Ships(value) {
    console.log(`[State] Ships: ${gs.ships} → ${value}`);
    gs.ships = value;
    triggerAchievementChecks();
    updateUI();
  },
  
  buyShip(price) {
    if (gs.marks < price) return false;
    gs.marks -= price;
    gs.ships++;
    logTransaction('ship_purchase', price);
    return true;
  }
};
```

**Effort:** 8-10 hours  
**Benefit:** Full state visibility, debugging, validation

---

### **3. No Centralized Logging System**

**Problem:** Logging is ad-hoc:
```javascript
console.log('Market event AI failed:', e);  // hot-trading.js
debugLog(metaStr, raw, parseResult, false); // hot-config.js
```

**Impact:**
- Can't filter logs by category
- No log levels (info/warn/error)
- Can't export logs for bug reports
- Production logging = debugging blind

**Fix:**
```javascript
// hot-logger.js
const Logger = {
  level: 'info', // debug, info, warn, error
  
  debug(category, msg, data) {
    if (this.level === 'debug') {
      console.log(`[DEBUG][${category}] ${msg}`, data);
    }
  },
  
  info(category, msg, data) {
    console.log(`[INFO][${category}] ${msg}`, data);
  },
  
  warn(category, msg, data) {
    console.warn(`[WARN][${category}] ${msg}`, data);
  },
  
  error(category, msg, error, data) {
    console.error(`[ERROR][${category}] ${msg}`, error, data);
    // Auto-capture for bug reports
    captureErrorForReport(category, msg, error, data);
  },
  
  exportLogs() {
    return JSON.stringify(logBuffer);
  }
};
```

**Effort:** 2-3 hours  
**Benefit:** Production debugging, bug reports, telemetry

---

### **4. Playwright Tests: 90% Coverage but Fragile**

**Problem:** Tests rely on specific text content:
```javascript
// Fragile test
expect(await page.locator('#stat-marks').textContent()).toBe('850 mk');

// Breaks if text format changes to '850 marks'
```

**Impact:**
- Tests break on UI changes
- False negatives waste time
- Developers skip tests

**Fix:**
```javascript
// Robust test with data-testid
expect(await page.locator('[data-testid="stat-marks"]').textContent())
  .toMatch(/\d+\s*(mk|marks)/);

// Even better: test game state, not UI
const gameState = await page.evaluate(() => window.gs);
expect(gameState.marks).toBe(850);
```

**Effort:** 4-6 hours  
**Benefit:** Stable tests, faster CI/CD

---

### **5. Live Screenshot System: Underutilized**

**Problem:** Live screenshot exists but isn't integrated with testing:
```javascript
// hot-screenshot-live.js exists
// But tests don't use it for visual regression
```

**Impact:**
- Manual visual testing (slow, error-prone)
- UI regressions slip through
- No screenshot evidence in bug reports

**Fix:**
```javascript
// tests/helpers.js
async function captureTestEvidence(page, testName) {
  await page.screenshot({
    path: `test-results/${testName}-${Date.now()}.png`,
    fullPage: true
  });
  
  // Also save game state
  const gameState = await page.evaluate(() => window.gs);
  await fs.writeFile(
    `test-results/${testName}-state.json`,
    JSON.stringify(gameState, null, 2)
  );
}

// Use in every test
test('Building purchase works', async ({ page }) => {
  // ... test steps ...
  await captureTestEvidence(page, 'building-purchase');
});
```

**Effort:** 3-4 hours  
**Benefit:** Visual regression, bug evidence, faster debugging

---

### **6. No Error Boundary / Recovery System**

**Problem:** When AI fails or state corrupts:
```javascript
catch(err) {
  showError(err);  // Shows banner
  // Game is now broken until refresh
}
```

**Impact:**
- One error = game over
- No graceful degradation
- Players lose progress

**Fix:**
```javascript
// Error boundary system
const ErrorBoundary = {
  lastError: null,
  errorCount: 0,
  
  handleError(error, context, recoveryAction) {
    this.lastError = { error, context, time: Date.now() };
    this.errorCount++;
    
    // Log error
    Logger.error(context, error.message, error, { gameState: gs });
    
    // Try recovery
    if (recoveryAction) {
      try {
        recoveryAction();
        return true;
      } catch (recoveryError) {
        Logger.error('recovery', 'Recovery failed', recoveryError);
      }
    }
    
    // If too many errors, suggest refresh
    if (this.errorCount >= 3) {
      showCriticalError('Multiple errors detected. Please refresh.');
    }
    
    return false;
  },
  
  exportErrorReport() {
    return {
      errors: this.lastError,
      gameState: gs,
      timestamp: Date.now()
    };
  }
};
```

**Effort:** 4-5 hours  
**Benefit:** Graceful degradation, player retention

---

### **7. No Performance Monitoring**

**Problem:** No visibility into:
- AI response times
- Frame rate drops
- Memory leaks
- Slow tests

**Fix:**
```javascript
// hot-performance.js
const Performance = {
  metrics: {
    aiResponseTimes: [],
    frameTimes: [],
    memoryUsage: []
  },
  
  startTimer(label) {
    performance.mark(`${label}-start`);
  },
  
  endTimer(label) {
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    this.metrics[`${label}Times`].push(measure.duration);
    
    // Warn if slow
    if (measure.duration > 5000) {
      Logger.warn('performance', `${label} took ${measure.duration}ms`);
    }
  },
  
  exportMetrics() {
    return {
      avgAIResponse: avg(this.metrics.aiResponseTimes),
      avgFrameTime: avg(this.metrics.frameTimes),
      memoryTrend: this.metrics.memoryUsage
    };
  }
};
```

**Effort:** 2-3 hours  
**Benefit:** Performance optimization, bottleneck identification

---

### **8. No State Snapshots for Debugging**

**Problem:** Can't reproduce bugs because:
- No way to save/restore game state
- Can't "rewind" to before bug
- Bug reports lack state context

**Fix:**
```javascript
// hot-debug.js
const DebugSnapshots = {
  snapshots: [],
  
  takeSnapshot(label) {
    this.snapshots.push({
      label,
      state: JSON.parse(serialiseState()),
      timestamp: Date.now(),
      turn: gs.turn
    });
    
    // Keep last 10 snapshots
    if (this.snapshots.length > 10) {
      this.snapshots.shift();
    }
  },
  
  restoreSnapshot(index) {
    const snapshot = this.snapshots[index];
    loadSavedGame(snapshot.state);
    Logger.info('debug', `Restored snapshot: ${snapshot.label}`);
  },
  
  exportSnapshots() {
    return JSON.stringify(this.snapshots);
  }
};

// Auto-snapshot on key events
function beginYear() {
  DebugSnapshots.takeSnapshot(`Year-${gs.turn}-start`);
  // ... rest of function
}
```

**Effort:** 3-4 hours  
**Benefit:** Reproducible bugs, faster debugging

---

## 🟡 **MODERATE ISSUES (v2.0 Nice-to-Have)**

### **9. Magic Numbers Throughout**

**Problem:**
```javascript
const variance = 0.85 + Math.random() * 0.30;  // What does this mean?
if (gs.reputation >= 9)  // Why 9?
```

**Fix:**
```javascript
const PRICE_VARIANCE_MIN = 0.85;
const PRICE_VARIANCE_MAX = 0.30;
const REPUTATION_LEGENDARY = 9;

const variance = PRICE_VARIANCE_MIN + Math.random() * PRICE_VARIANCE_MAX;
if (gs.reputation >= REPUTATION_LEGENDARY)
```

**Effort:** 2-3 hours  
**Benefit:** Self-documenting code

---

### **10. No Type Hints (JSDoc)**

**Problem:**
```javascript
function buyCargo(commodity, qty) {
  // What type is commodity? String? Enum?
  // What type is qty? Number? String?
}
```

**Fix:**
```javascript
/**
 * Purchase commodity cargo
 * @param {string} commodity - Commodity ID ('saltfish', 'wine', etc.)
 * @param {number} qty - Quantity to purchase (must be positive integer)
 * @returns {boolean} True if purchase successful
 */
function buyCargo(commodity, qty) {
```

**Effort:** 4-5 hours  
**Benefit:** IDE autocomplete, fewer bugs

---

### **11. Test Fixtures Not Reusable**

**Problem:** Each test sets up game state from scratch:
```javascript
// test1.spec.js
await page.click('text=Begin the Founding');
await page.fill('#input-dynasty', 'TestHouse');
// ... 20 lines of setup ...

// test2.spec.js (same setup copied)
await page.click('text=Begin the Founding');
await page.fill('#input-dynasty', 'TestHouse');
// ... 20 lines of setup ...
```

**Fix:**
```javascript
// tests/fixtures.js
async function startNewGame(page, options = {}) {
  await page.goto('house-of-tide.html');
  await page.click('text=Begin the Founding');
  await page.fill('#input-dynasty', options.dynasty || 'TestHouse');
  await page.fill('#input-founder', options.founder || 'Founder');
  await page.click('text=Open the Ledger');
  await page.click('text=Skip →');
  return page;
}

// test1.spec.js
test('Building purchase works', async ({ page }) => {
  await startNewGame(page);
  // ... test continues ...
});
```

**Effort:** 3-4 hours  
**Benefit:** DRY tests, faster test writing

---

### **12. No Visual Regression Testing**

**Problem:** UI changes can break layout without tests catching it

**Fix:**
```javascript
// tests/visual-regression.spec.js
test('Trading panel layout', async ({ page }) => {
  await startNewGame(page);
  await advanceToTradingPhase(page);
  
  await expect(page).toHaveScreenshot('trading-panel.png', {
    fullPage: true,
    maxDiffPixels: 100  // Allow small differences
  });
});
```

**Effort:** 2-3 hours  
**Benefit:** Catch UI regressions automatically

---

## 🟢 **MINOR ISSUES (v2.0 Polish)**

### **13. Inconsistent Error Messages**

**Problem:**
```javascript
throw new Error('No JSON in response');  // hot-llm.js
throw new Error('No event generated');   // hot-events.js
showError(err);  // What does this show?
```

**Fix:**
```javascript
// Consistent error format
throw new GameError('AI_RESPONSE_INVALID', {
  message: 'AI response was not valid JSON',
  context: { backend: CFG.backend, model: getModelName() },
  recovery: 'Click "Try Again" to regenerate'
});
```

**Effort:** 2-3 hours  
**Benefit:** Clearer errors, better UX

---

### **14. No Hot Module Reloading**

**Problem:** Every code change requires full page refresh

**Fix:**
```javascript
// Add to development build
if (module.hot) {
  module.hot.accept('./hot-trading.js', () => {
    console.log('Trading module updated, reloading...');
    // Preserve game state, reload module
  });
}
```

**Effort:** 3-4 hours  
**Benefit:** Faster development

---

### **15. No Bundle Size Monitoring**

**Problem:** No visibility into file sizes

**Fix:**
```javascript
// package.json
{
  "scripts": {
    "build": "webpack --json > stats.json",
    "analyze": "webpack-bundle-analyzer stats.json"
  }
}
```

**Effort:** 1-2 hours  
**Benefit:** Catch bloat early

---

## 📋 **v2.0 TASK SUMMARY**

| Priority | Task | Time | Benefit |
|----------|------|------|---------|
| **CRITICAL** | Split hot-engine.js | 6-8 hrs | Maintainability |
| **CRITICAL** | State manager wrapper | 8-10 hrs | Debugging, validation |
| **CRITICAL** | Centralized logging | 2-3 hrs | Production debugging |
| **CRITICAL** | Robust Playwright tests | 4-6 hrs | Stable CI/CD |
| **CRITICAL** | Screenshot integration | 3-4 hrs | Visual regression |
| **CRITICAL** | Error boundary system | 4-5 hrs | Graceful degradation |
| **CRITICAL** | Performance monitoring | 2-3 hrs | Bottleneck ID |
| **CRITICAL** | State snapshots | 3-4 hrs | Bug reproduction |
| **MODERATE** | Magic number constants | 2-3 hrs | Self-documenting |
| **MODERATE** | JSDoc type hints | 4-5 hrs | IDE support |
| **MODERATE** | Reusable test fixtures | 3-4 hrs | DRY tests |
| **MODERATE** | Visual regression tests | 2-3 hrs | UI regression catch |
| **MINOR** | Consistent errors | 2-3 hrs | Clearer UX |
| **MINOR** | Hot module reloading | 3-4 hrs | Dev speed |
| **MINOR** | Bundle monitoring | 1-2 hrs | Bloat prevention |

**Total v2.0:** 49-66 hours

---

## 🎯 **RECOMMENDED ORDER**

### **Phase 1: Critical Foundation (25-30 hours)**
1. Split hot-engine.js
2. State manager wrapper
3. Centralized logging
4. Error boundary system

### **Phase 2: Testing Infrastructure (13-17 hours)**
5. Robust Playwright tests
6. Screenshot integration
7. Reusable test fixtures
8. Visual regression tests

### **Phase 3: Debugging Tools (5-7 hours)**
9. Performance monitoring
10. State snapshots

### **Phase 4: Code Quality (6-8 hours)**
11. Magic number constants
12. JSDoc type hints
13. Consistent errors

### **Phase 5: Dev Experience (4-6 hours)**
14. Hot module reloading
15. Bundle monitoring

---

**v2.0 will transform House of Tide from "launch-ready" to "production-grade".**

**The ledger is open. The code awaits refactoring.** ⚓
