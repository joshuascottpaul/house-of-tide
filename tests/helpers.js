const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// ══════════════════════════════════════════════════════════
//  GAME SETUP HELPERS
// ══════════════════════════════════════════════════════════

/**
 * Start a new game with optional custom settings
 * @param {Page} page - Playwright page
 * @param {object} options - Game options
 */
async function startNewGame(page, options = {}) {
  const {
    dynasty = 'TestHouse',
    founder = 'Tester',
    skipOnboarding = true
  } = options;

  // Register pageerror BEFORE goto so parse-time script errors are captured
  const pageErrors = [];
  page.on('pageerror', e => pageErrors.push(e.message));

  const filePath = 'file://' + path.join(process.cwd(), 'house-of-tide.html');
  await page.goto(filePath);
  await page.waitForLoadState('networkidle');

  // Fail fast if any script failed to parse/execute
  if (pageErrors.length > 0) {
    throw new Error(`Page errors on load: ${pageErrors.join('; ')}`);
  }

  // Click button and assert screen actually changed
  await page.click('button:has-text("Begin the Founding")');
  await page.waitForSelector('#screen-name.active', { timeout: 5000 });

  await page.fill('#input-dynasty', dynasty);
  await page.fill('#input-founder', founder);
  await page.click('button:has-text("Open the Ledger")');
  await page.waitForSelector('#screen-onboard.active, button:has-text("Skip")', { timeout: 5000 });

  if (skipOnboarding) {
    await page.click('button:has-text("Skip")');
  }

  await waitForEvent(page);
}

/**
 * Reset game state completely
 * @param {Page} page - Playwright page
 */
async function resetGameState(page) {
  await page.evaluate(() => {
    // Clear all localStorage
    localStorage.clear();
    // gs is a top-level `let` — can't nullify it, but startNewGame will reinitialise it
    // Clear logger
    if (window.Logger) window.Logger.clear();
    // Clear snapshots
    if (window.DebugSnapshots) window.DebugSnapshots.clear();
    // Clear performance metrics
    if (window.Performance) window.Performance.clear();
  });
  
  // Reload page for clean state
  await page.reload({ waitUntil: 'networkidle' });
}

/**
 * Wait for the game to reach the game screen after beginPhase().
 * Waits for #screen-game.active (set immediately when onboarding is skipped,
 * before any AI call completes). Does NOT require a live AI backend.
 * @param {Page} page - Playwright page
 */
async function waitForEvent(page) {
  // #screen-game.active is set as soon as the game screen shows — no AI needed.
  // waitForSelector's comma-selector picks the first DOM match, so avoid mixing
  // always-empty elements (#error-banner) with content-filled ones in one selector.
  await page.waitForSelector('#screen-game.active', {
    state: 'visible',
    timeout: 30000
  });
}

/**
 * Get current game state
 * @param {Page} page - Playwright page
 * @returns {Promise<object>} Game state object
 */
async function getGameState(page) {
  // gs is a top-level `let` — not a window property, but accessible as a global
  return await page.evaluate(() => gs);
}

// ══════════════════════════════════════════════════════════
//  PHASE ADVANCEMENT HELPERS
// ══════════════════════════════════════════════════════════

/**
 * Complete current turn and advance to next phase
 * @param {Page} page - Playwright page
 */
async function completeTurn(page) {
  const continueBtn = page.locator('#continue-btn');
  if (await continueBtn.isVisible()) {
    await continueBtn.click();
    await page.waitForTimeout(500); // Wait for phase transition
  }
}

/**
 * Advance to specific phase
 * @param {Page} page - Playwright page
 * @param {string} phase - Target phase (house, routes, trading, yearend)
 */
async function advanceToPhase(page, phase) {
  const maxLoops = 10;
  for (let i = 0; i < maxLoops; i++) {
    const state = await getGameState(page);
    if (state.phase === phase) return;
    await completeTurn(page);
  }
  throw new Error(`Failed to reach phase: ${phase}`);
}

/**
 * Advance to year-end phase
 * @param {Page} page - Playwright page
 */
async function advanceToYearEnd(page) {
  await advanceToPhase(page, 'yearend');
}

/**
 * Advance to trading phase
 * @param {Page} page - Playwright page
 */
async function advanceToTradingPhase(page) {
  await advanceToPhase(page, 'trading');
}

// ══════════════════════════════════════════════════════════
//  TEST DATA FACTORIES
// ══════════════════════════════════════════════════════════

/**
 * Create test house configuration
 * @param {object} overrides - Override default values
 */
function createTestHouse(overrides = {}) {
  return {
    dynastyName: 'TestHouse',
    founderName: 'Tester',
    marks: 800,
    reputation: 5,
    ships: 1,
    turn: 1,
    ...overrides
  };
}

/**
 * Create test event
 * @param {string} type - Event type (house, routes, venture)
 * @param {object} overrides - Override default values
 */
function createTestEvent(type = 'house', overrides = {}) {
  return {
    id: 'test_event',
    text: 'Test event text',
    choices: ['Choice 1', 'Choice 2', 'Choice 3'],
    type,
    ...overrides
  };
}

/**
 * Create test choice
 * @param {string} text - Choice text
 * @param {object} overrides - Override default values
 */
function createTestChoice(text = 'Test choice', overrides = {}) {
  return {
    text,
    cost: null,
    risk: 'low',
    ...overrides
  };
}

// ══════════════════════════════════════════════════════════
//  AI MOCKING HELPERS
// ══════════════════════════════════════════════════════════

/**
 * Mock AI response for testing
 * @param {Page} page - Playwright page
 * @param {object} response - Mock response object
 */
async function mockAIResponse(page, response) {
  await page.evaluate((mockResponse) => {
    window._mockAIResponse = mockResponse;
    const origCallLLM = window.callLLM;
    window.callLLM = async function() {
      if (window._mockAIResponse) {
        return Promise.resolve(window._mockAIResponse);
      }
      return origCallLLM.apply(this, arguments);
    };
  }, response);
}

/**
 * Mock AI failure for error testing
 * @param {Page} page - Playwright page
 */
async function mockAIFailure(page) {
  await mockAIResponse(page, null);
}

/**
 * Mock slow AI response for timeout testing
 * @param {Page} page - Playwright page
 * @param {number} delayMs - Delay in milliseconds
 */
async function mockAISlowResponse(page, delayMs = 5000) {
  await page.evaluate((delay) => {
    const origCallLLM = window.callLLM;
    window.callLLM = async function(...args) {
      await new Promise(resolve => setTimeout(resolve, delay));
      return origCallLLM.apply(this, args);
    };
  }, delayMs);
}

// ══════════════════════════════════════════════════════════
//  SCREENSHOT & EVIDENCE CAPTURE
// ══════════════════════════════════════════════════════════

/**
 * Capture test evidence (screenshot + state + logs)
 * @param {Page} page - Playwright page
 * @param {string} testName - Test name for file naming
 * @param {object} gameState - Current game state
 */
async function captureTestEvidence(page, testName, gameState = null) {
  const timestamp = Date.now();
  const safeName = testName.replace(/[^a-z0-9]/gi, '-');
  
  // Ensure test-results directory exists
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  // Capture screenshot
  const screenshotPath = path.join(resultsDir, `${safeName}-${timestamp}.png`);
  await page.screenshot({
    path: screenshotPath,
    fullPage: true
  });
  
  // Capture game state
  if (!gameState) {
    gameState = await getGameState(page);
  }
  const statePath = path.join(resultsDir, `${safeName}-${timestamp}-state.json`);
  fs.writeFileSync(statePath, JSON.stringify(gameState, null, 2));
  
  // Capture logs if Logger exists
  const logs = await page.evaluate(() => {
    if (window.Logger) {
      return window.Logger.exportLogs();
    }
    return '[]';
  });
  const logsPath = path.join(resultsDir, `${safeName}-${timestamp}-logs.json`);
  fs.writeFileSync(logsPath, logs);
  
  return {
    screenshot: screenshotPath,
    state: statePath,
    logs: logsPath
  };
}

/**
 * Start live screenshot capture for test
 * @param {Page} page - Playwright page
 * @param {string} testName - Test name
 */
async function startLiveScreenshot(page, testName) {
  await page.evaluate((name) => {
    if (window.HOT_SCREENSHOT_LIVE) {
      window.HOT_SCREENSHOT_LIVE.startLiveCapture(3);
      window.HOT_SCREENSHOT_LIVE.setMetadata({
        testName: name,
        timestamp: Date.now()
      });
    }
  }, testName);
}

/**
 * Stop live screenshot capture
 * @param {Page} page - Playwright page
 */
async function stopLiveScreenshot(page) {
  await page.evaluate(() => {
    if (window.HOT_SCREENSHOT_LIVE) {
      window.HOT_SCREENSHOT_LIVE.stopCapture();
    }
  });
}

// ══════════════════════════════════════════════════════════
//  ASSERTION HELPERS
// ══════════════════════════════════════════════════════════

/**
 * Assert game state matches expected values
 * @param {object} actual - Actual game state
 * @param {object} expected - Expected values
 */
function expectGameState(actual, expected) {
  if (expected.marks !== undefined) {
    expect(actual.marks).toBe(expected.marks);
  }
  if (expected.reputation !== undefined) {
    expect(actual.reputation).toBe(expected.reputation);
  }
  if (expected.ships !== undefined) {
    expect(actual.ships).toBe(expected.ships);
  }
  if (expected.phase !== undefined) {
    expect(actual.phase).toBe(expected.phase);
  }
}

/**
 * Assert UI state matches expected values
 * @param {Page} page - Playwright page
 * @param {object} expected - Expected UI values
 */
async function expectUIState(page, expected) {
  if (expected.marks !== undefined) {
    const marksEl = page.locator('#stat-marks');
    await expect(marksEl).toContainText(expected.marks.toString());
  }
  if (expected.reputation !== undefined) {
    const repEl = page.locator('#stat-rep');
    await expect(repEl).toContainText(expected.reputation.toString());
  }
}

/**
 * Assert ledger contains expected entry
 * @param {Page} page - Playwright page
 * @param {string} text - Text to search for in ledger
 */
async function expectLedgerEntry(page, text) {
  const ledgerLines = page.locator('#ledger-lines');
  await expect(ledgerLines).toContainText(text);
}

// ══════════════════════════════════════════════════════════
//  DEBUG HELPERS
// ══════════════════════════════════════════════════════════

/**
 * Enable debug mode for testing
 * @param {Page} page - Playwright page
 */
async function enableDebugMode(page) {
  await page.evaluate(() => {
    if (window.CFG) {
      window.CFG.debugMode = true;
      window.saveCFG();
    }
    if (window.Logger) {
      window.Logger.setLevel('debug');
    }
  });
}

/**
 * Get all debug information
 * @param {Page} page - Playwright page
 * @returns {Promise<object>} Debug info object
 */
async function getDebugInfo(page) {
  return await page.evaluate(() => ({
    logs: window.Logger?.exportLogs() || '[]',
    snapshots: window.DebugSnapshots?.exportSnapshots() || '[]',
    performance: window.Performance?.exportMetrics() || '{}',
    errors: window.ErrorCapture?.exportReport() || '[]',
    gameState: (typeof gs !== 'undefined' ? gs : null)
  }));
}

/**
 * Capture debug info on test failure
 * @param {Page} page - Playwright page
 * @param {string} testName - Test name
 */
async function captureDebugOnFailure(page, testName) {
  const debugInfo = await getDebugInfo(page);
  
  const timestamp = Date.now();
  const safeName = testName.replace(/[^a-z0-9]/gi, '-');
  
  const resultsDir = path.join(process.cwd(), 'test-results');
  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir, { recursive: true });
  }
  
  const debugPath = path.join(resultsDir, `${safeName}-${timestamp}-debug.json`);
  fs.writeFileSync(debugPath, JSON.stringify(debugInfo, null, 2));
  
  return debugPath;
}

// ══════════════════════════════════════════════════════════
//  EXPORT ALL HELPERS
// ══════════════════════════════════════════════════════════

module.exports = {
  // Game setup
  startNewGame,
  resetGameState,
  waitForEvent,
  getGameState,
  
  // Phase advancement
  completeTurn,
  advanceToPhase,
  advanceToYearEnd,
  advanceToTradingPhase,
  
  // Test data factories
  createTestHouse,
  createTestEvent,
  createTestChoice,
  
  // AI mocking
  mockAIResponse,
  mockAIFailure,
  mockAISlowResponse,
  
  // Screenshot & evidence
  captureTestEvidence,
  startLiveScreenshot,
  stopLiveScreenshot,
  
  // Assertions
  expectGameState,
  expectUIState,
  expectLedgerEntry,
  
  // Debug
  enableDebugMode,
  getDebugInfo,
  captureDebugOnFailure
};
