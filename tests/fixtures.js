/**
 * TEST FIXTURES
 * 
 * Reusable test fixtures with automatic isolation.
 * Each test gets a clean game state.
 */

const { test: base } = require('@playwright/test');
const { resetGameState, captureTestEvidence, getDebugInfo } = require('./helpers');

// Extend base test with our fixtures
const test = base.extend({
  // Auto-reset game state before each test
  page: async ({ page }, use) => {
    // Before test: reset state
    await resetGameState(page);
    
    // Run test
    await use(page);
    
    // After test: capture debug info on failure
    // (Playwright already captures screenshot on failure)
  }
});

// Export the extended test
module.exports = { test };

// ══════════════════════════════════════════════════════════
//  PRE-BUILT TEST SCENARIOS
// ══════════════════════════════════════════════════════════

/**
 * Early game scenario (Turn 1, 800 marks, 1 ship)
 */
const earlyGame = {
  turn: 1,
  marks: 800,
  reputation: 5,
  ships: 1,
  phase: 'house'
};

/**
 * Mid game scenario (Turn 10, 3000 marks, 4 ships)
 */
const midGame = {
  turn: 10,
  marks: 3000,
  reputation: 7,
  ships: 4,
  phase: 'trading'
};

/**
 * Late game scenario (Turn 30, 10000 marks, 10 ships)
 */
const lateGame = {
  turn: 30,
  marks: 10000,
  reputation: 9,
  ships: 10,
  phase: 'yearend'
};

/**
 * Bankrupt scenario (0 marks)
 */
const bankrupt = {
  turn: 5,
  marks: 0,
  reputation: 3,
  ships: 1,
  phase: 'house'
};

/**
 * High reputation scenario (10/10)
 */
const highRep = {
  turn: 15,
  marks: 5000,
  reputation: 10,
  ships: 6,
  phase: 'routes'
};

/**
 * Low reputation scenario (1/10)
 */
const lowRep = {
  turn: 8,
  marks: 200,
  reputation: 1,
  ships: 2,
  phase: 'house'
};

module.exports.fixtures = {
  earlyGame,
  midGame,
  lateGame,
  bankrupt,
  highRep,
  lowRep
};

// ══════════════════════════════════════════════════════════
//  MOCK AI RESPONSES
// ══════════════════════════════════════════════════════════

/**
 * Successful AI response
 */
const aiSuccess = {
  narrative: 'The situation unfolds favorably.',
  marks_delta: 100,
  reputation_delta: 1,
  ships_delta: 0,
  ledger_entry: 'A successful venture.'
};

/**
 * Failed AI response
 */
const aiFailure = {
  narrative: 'Things go wrong.',
  marks_delta: -200,
  reputation_delta: -1,
  ships_delta: 0,
  ledger_entry: 'A costly mistake.'
};

/**
 * Neutral AI response
 */
const aiNeutral = {
  narrative: 'Nothing significant occurs.',
  marks_delta: 0,
  reputation_delta: 0,
  ships_delta: 0,
  ledger_entry: 'Status quo maintained.'
};

module.exports.mockAI = {
  success: aiSuccess,
  failure: aiFailure,
  neutral: aiNeutral
};
