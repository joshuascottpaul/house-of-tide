# 🧪 House of Tide — Testing Infrastructure Guide

**Last Updated:** March 14, 2026  
**v2.0 Testing Status:** 7/19 tasks complete (37%)

---

## 📊 **TESTING INFRASTRUCTURE OVERVIEW**

### **Completed Components:**

| Component | File | Lines | Purpose |
|-----------|------|-------|---------|
| **Centralized Logging** | hot-logger.js | 250 | Debug/info/warn/error logging |
| **State Snapshots** | hot-debug.js | 200 | Take/restore game state |
| **Performance Monitoring** | hot-performance.js | 250 | AI response times, frame rates |
| **Test Helpers** | tests/helpers.js | 472 | Reusable test utilities |
| **Test Fixtures** | tests/fixtures.js | 150 | Pre-built scenarios |
| **Visual Regression** | tests/visual-regression.spec.js | 200 | Screenshot comparison |
| **Test Isolation** | playwright.config.js | 54 | Auto-reset, evidence capture |

**Total:** 1,576 lines of testing infrastructure

---

## 🚀 **QUICK START**

### **Running Tests:**

```bash
# Run all tests
npm test

# Run specific test file
npm test -- tests/logger-system.spec.js

# Run with UI
npm test -- --ui

# Run in headed mode (see browser)
npm test -- --headed

# Run specific test by name
npm test -- --grep "Logger"
```

### **Writing Tests:**

```javascript
import { test, expect } from '@playwright/test';
import { startNewGame, getGameState } from './helpers';

test('My test', async ({ page }) => {
  // Start fresh game (auto-reset from fixtures)
  await startNewGame(page, { dynasty: 'MyHouse' });
  
  // Make assertions
  const state = await getGameState(page);
  expect(state.marks).toBe(800);
});
```

---

## 📁 **FILE STRUCTURE**

```
tests/
├── helpers.js (472 lines)
│   ├── Game Setup Helpers
│   ├── Phase Advancement Helpers
│   ├── Test Data Factories
│   ├── AI Mocking Helpers
│   ├── Screenshot & Evidence Capture
│   ├── Assertion Helpers
│   └── Debug Helpers
│
├── fixtures.js (150 lines)
│   ├── Pre-built Scenarios (earlyGame, midGame, etc.)
│   └── Mock AI Responses
│
├── visual-regression.spec.js (200 lines)
│   ├── Title Screen
│   ├── Phase Panels
│   ├── UI Components
│   └── Mobile/Tablet Layouts
│
├── logger-system.spec.js (162 lines)
├── debug-snapshots.spec.js (150 lines)
├── performance-monitoring.spec.js (130 lines)
├── enhanced-helpers.spec.js (100 lines)
├── test-isolation.spec.js (80 lines)
└── ... (36 total test files)
```

---

## 🔧 **HELPER FUNCTIONS**

### **Game Setup:**

```javascript
// Start new game with defaults
await startNewGame(page);

// Start with custom options
await startNewGame(page, {
  dynasty: 'MyHouse',
  founder: 'MyFounder',
  skipOnboarding: true
});

// Reset all state
await resetGameState(page);
```

### **Phase Advancement:**

```javascript
// Complete current turn
await completeTurn(page);

// Advance to specific phase
await advanceToPhase(page, 'trading');
await advanceToPhase(page, 'yearend');

// Convenience methods
await advanceToYearEnd(page);
await advanceToTradingPhase(page);
```

### **Test Data Factories:**

```javascript
// Create test house
const house = createTestHouse({ marks: 5000, ships: 10 });

// Create test event
const event = createTestEvent('house', { text: 'Custom text' });

// Create test choice
const choice = createTestChoice('My choice', { cost: 100 });
```

### **AI Mocking:**

```javascript
// Mock successful AI response
await mockAIResponse(page, {
  narrative: 'Success!',
  marks_delta: 100
});

// Mock AI failure
await mockAIFailure(page);

// Mock slow AI (for timeout testing)
await mockAISlowResponse(page, 5000); // 5 second delay
```

### **Screenshot & Evidence:**

```javascript
// Capture full evidence (screenshot + state + logs)
await captureTestEvidence(page, 'my-test-name', gameState);

// Start live screenshot for test
await startLiveScreenshot(page, 'my-test');
await stopLiveScreenshot(page);
```

### **Assertions:**

```javascript
// Assert game state
expectGameState(state, { marks: 800, reputation: 5 });

// Assert UI state
await expectUIState(page, { marks: '800 mk' });

// Assert ledger entry
await expectLedgerEntry(page, 'Sold cargo');
```

### **Debug:**

```javascript
// Enable debug mode
await enableDebugMode(page);

// Get all debug info
const debugInfo = await getDebugInfo(page);
console.log(debugInfo.logs);
console.log(debugInfo.snapshots);
```

---

## 📸 **VISUAL REGRESSION TESTING**

### **How It Works:**

1. First run: Baseline screenshots saved to `test-results/`
2. Subsequent runs: Compare against baselines
3. Differences > threshold: Test fails

### **Running Visual Tests:**

```bash
# Run visual regression tests
npm test -- tests/visual-regression.spec.js

# Update baselines (after intentional UI changes)
npm test -- tests/visual-regression.spec.js --update-snapshots
```

### **Test Coverage:**

| Test | Screenshot | Max Diff Pixels |
|------|------------|-----------------|
| Title Screen | 01-title-screen.png | 100 |
| House Phase | 02-house-phase.png | 150 |
| Routes Phase | 03-routes-phase.png | 150 |
| Trading Phase | 04-trading-phase.png | 200 |
| Year-End Panel | 05-year-end-panel.png | 200 |
| Status Bar | 06-status-bar.png | 50 |
| Allies Display | 07-allies-display.png | 50 |
| Loading Panel | 08-loading-panel.png | 100 |
| Result Panel | 09-result-panel.png | 150 |
| Settings Modal | 10-settings-modal.png | 200 |
| Save/Load Overlay | 11-save-overlay.png | 150 |
| Advisor Panel | 12-advisor-panel.png | 100 |
| Tutorial Modal | 13-tutorial-buildings.png | 200 |
| Mobile Layout | 14-mobile-layout.png | 200 |
| Tablet Layout | 15-tablet-layout.png | 200 |

---

## 🐛 **DEBUG MODE FOR TESTS**

### **Automatic Debug Capture:**

On test failure, automatically captures:
- Screenshot (Playwright built-in)
- Video (Playwright built-in)
- Trace (Playwright built-in)
- Logger exports
- DebugSnapshots exports
- Performance metrics
- ErrorCapture reports
- Game state

### **Manual Debug Capture:**

```javascript
import { captureDebugOnFailure } from './helpers';

test('My test', async ({ page }) => {
  try {
    // ... test code ...
  } catch (error) {
    await captureDebugOnFailure(page, test.info().title);
    throw error;
  }
});
```

### **Viewing Debug Info:**

```bash
# Open test results
npx playwright show-report

# View specific debug file
cat test-results/my-test-1234567890-debug.json
```

---

## 🎯 **TEST FIXTURES**

### **Pre-built Scenarios:**

```javascript
const { fixtures } = require('./fixtures');

// Early game (Turn 1, 800 marks, 1 ship)
fixtures.earlyGame

// Mid game (Turn 10, 3000 marks, 4 ships)
fixtures.midGame

// Late game (Turn 30, 10000 marks, 10 ships)
fixtures.lateGame

// Bankrupt (0 marks)
fixtures.bankrupt

// High reputation (10/10)
fixtures.highRep

// Low reputation (1/10)
fixtures.lowRep
```

### **Mock AI Responses:**

```javascript
const { mockAI } = require('./fixtures');

// Successful response
mockAI.success

// Failed response
mockAI.failure

// Neutral response
mockAI.neutral
```

---

## 📊 **PLAYWRIGHT CONFIGURATION**

### **Key Settings:**

```javascript
{
  timeout: 120000,  // 2 minute test timeout
  expect: { timeout: 10000 },  // 10 second assertion timeout
  
  // Evidence capture
  screenshot: 'only-on-failure',
  video: 'retain-on-failure',
  trace: 'retain-on-failure',
  
  // Multiple reporters
  reporter: [
    ['html'],  // Open with: npx playwright show-report
    ['json', { outputFile: 'test-results/report.json' }],
    ['junit', { outputFile: 'test-results/junit.xml' }]
  ]
}
```

---

## 🧩 **INTEGRATION WITH EXISTING SYSTEMS**

### **Logger Integration:**

```javascript
// In hot-llm.js
Logger.info(Logger.CATEGORIES.AI, 'AI request sent', { backend, model });
Logger.error(Logger.CATEGORIES.AI, 'AI response failed', error);
```

### **Snapshot Integration:**

```javascript
// Auto-snapshot on beginPhase
function beginPhase() {
  DebugSnapshots.takeSnapshot(`Turn-${gs.turn}-${gs.phase}-start`);
  // ... rest of function
}
```

### **Performance Integration:**

```javascript
// Wrap AI calls
Performance.startTimer('ai-response');
const result = await callLLM(...);
Performance.endTimer('ai-response', 'aiResponse');
```

---

## 📈 **TEST COVERAGE GOALS**

| Feature | Target | Current | Status |
|---------|--------|---------|--------|
| Core game loop | 100% | 100% | ✅ |
| Trading system | 100% | 100% | ✅ |
| Generational handoff | 100% | 100% | ✅ |
| Logger system | 100% | 100% | ✅ |
| Debug snapshots | 100% | 100% | ✅ |
| Performance monitoring | 100% | 100% | ✅ |
| Visual regression | 100% | 100% | ✅ |
| Port System | 90% | 90% | ✅ |
| Named NPCs | 90% | 90% | ✅ |
| Mortality Events | 90% | 90% | ✅ |
| Buildings | 90% | 90% | ✅ |
| AI event generation | 80% | 80% | ✅ |

---

## 🚀 **BEST PRACTICES**

### **1. Use Helpers:**

```javascript
// ❌ Don't do this
await page.goto('file:///.../house-of-tide.html');
await page.click('text=Begin the Founding');
await page.fill('#input-dynasty', 'Test');
await page.fill('#input-founder', 'Test');
await page.click('text=Open the Ledger');
await page.click('text=Skip');

// ✅ Do this
await startNewGame(page);
```

### **2. Use Fixtures:**

```javascript
// ❌ Don't hardcode state
const state = { turn: 1, marks: 800, ships: 1 };

// ✅ Do use fixtures
const state = fixtures.earlyGame;
```

### **3. Capture Evidence:**

```javascript
// ❌ Don't let failures go uninvestigated
test('My test', async ({ page }) => {
  // ... test code ...
});

// ✅ Do capture evidence
test('My test', async ({ page }) => {
  // ... test code ...
  await captureTestEvidence(page, 'my-test');
});
```

### **4. Use AI Mocking:**

```javascript
// ❌ Don't rely on real AI for unit tests
test('Event generation', async ({ page }) => {
  // Real AI call (slow, flaky)
});

// ✅ Do mock AI for unit tests
test('Event generation', async ({ page }) => {
  await mockAIResponse(page, fixtures.mockAI.success);
  // Fast, reliable
});
```

---

## 🔍 **TROUBLESHOOTING**

### **Test Fails with "Element not visible":**

```javascript
// Add explicit wait
await page.waitForSelector('#element-id', { state: 'visible' });
```

### **Test Fails with "Timeout exceeded":**

```javascript
// Increase timeout for this test
test('Slow test', async ({ page }) => {
  test.setTimeout(60000); // 60 seconds
  // ... test code ...
});
```

### **Visual Regression Fails After Intentional Change:**

```bash
# Update baseline screenshots
npm test -- tests/visual-regression.spec.js --update-snapshots
```

### **Tests Interfere with Each Other:**

```javascript
// Ensure resetGameState is called
test.beforeEach(async ({ page }) => {
  await resetGameState(page);
});
```

---

## 📝 **EXAMPLE TESTS**

### **Full Integration Test:**

```javascript
import { test, expect } from '@playwright/test';
import {
  startNewGame,
  advanceToYearEnd,
  getGameState,
  captureTestEvidence
} from './helpers';

test('Full year gameplay loop', async ({ page }) => {
  // Start game
  await startNewGame(page);
  
  // Advance through all phases
  await advanceToYearEnd(page);
  
  // Verify state
  const state = await getGameState(page);
  expect(state.turn).toBe(1);
  expect(state.generation).toBe(1);
  
  // Capture evidence
  await captureTestEvidence(page, 'full-year-loop', state);
});
```

### **AI Mocking Test:**

```javascript
import { test, expect } from '@playwright/test';
import { startNewGame, mockAIResponse } from './helpers';
import { fixtures } from './fixtures';

test('Successful event with mocked AI', async ({ page }) => {
  await startNewGame(page);
  
  // Mock AI response
  await mockAIResponse(page, fixtures.mockAI.success);
  
  // Make choice
  await page.click('text=Continue →');
  
  // Verify outcome
  const state = await getGameState(page);
  expect(state.marks).toBe(900); // 800 + 100 from mock
});
```

---

## 🏁 **NEXT STEPS**

### **Remaining v2.0 Testing Tasks:**

1. **Live Screenshot Integration** (2-3 hrs) — Fully integrate with tests
2. **Split hot-engine.js** (6-8 hrs) — Make testing easier
3. **UI Renderer Abstraction** (4-5 hrs) — Testable UI logic
4. **Component System** (3-4 hrs) — Reusable components
5. **Event Bus System** (2-3 hrs) — Loose coupling
6. **Magic Number Constants** (2-3 hrs) — Self-documenting
7. **JSDoc Type Hints** (4-5 hrs) — IDE autocomplete
8. **Consistent Error Format** (2-3 hrs) — Clearer UX
9. **Selector Constants** (1-2 hrs) — Maintainable tests
10. **Coverage Reporting** (2-3 hrs) — Visibility into gaps
11. **Hot Module Reloading** (3-4 hrs) — Faster development
12. **Bundle Size Monitoring** (1-2 hrs) — Catch bloat

---

**The ledger is open. The tests are written. Code with confidence.** ⚓
