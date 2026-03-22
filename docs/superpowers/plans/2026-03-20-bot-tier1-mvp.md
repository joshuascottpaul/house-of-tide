# Bot Tier 1 MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement autonomous bot players that can play House of Tide games for testing, balance analysis, and gameplay simulation.

**Architecture:** 3-layer hybrid system: (1) Bot personality engine with weighted decision traits, (2) Choice analyzer for scoring decisions, (3) Game loop runner that integrates with existing game functions. Bots score choices based on personality weights (bold/cautious/political/mercantile/patient) and select highest-scoring options.

**Tech Stack:** Vanilla JavaScript (browser), Playwright for testing, localStorage for stats persistence

**Spec Reference:** `RESUME_HERE.md`, `GAMEPLAY_TESTING.md`

---

## File Structure

### Files to Create
| File | Responsibility |
|------|----------------|
| `hot-bots-core.js` | Bot personality configs, decision weights, core scoring logic |
| `hot-bots-analyzer.js` | Choice text analysis, risk detection, trait scoring |
| `hot-bots-loop.js` | Autonomous game loop, turn execution, game state detection |
| `hot-bots.js` | Global API (`window.HotBots`), console commands |
| `hot-bots-stats.js` | Stats tracking, localStorage persistence |
| `bots/leaderboard.js` | Console leaderboard display, balance reports |
| `tests/bot-personalities.spec.js` | Unit tests for bot decision logic |
| `tests/bot-game-loop.spec.js` | Integration tests for autonomous play |

### Files to Modify
| File | Changes |
|------|---------|
| `package.json` | Add bot npm scripts |
| `tests/helpers.js` | Add bot-specific helpers (`playBotTurn`, `getAvailableChoices`) |

### Existing Helpers to Reuse
- `startNewGame()` - Start fresh game session
- `waitForEvent()` - Wait for game screen
- `getGameState()` - Access `gs` global
- `resetGameState()` - Clean state between tests

---

## Prerequisites

Before starting, verify these exist in the codebase:
- `tests/helpers.js` - Test utilities
- `hot-engine.js` - Contains `makeChoice()` function
- `hot-events.js` - Event generation system
- `hot-ui.js` - UI rendering, choice buttons in `#choices-container`

**Key Integration Points:**
- Bots call `makeChoice(choiceIndex, isHuman)` from `hot-engine.js`
- Choices rendered in `#choices-container button` elements
- Game state accessible via global `gs` object
- Game over detection via `gs.phase === 'gameover'` or `gs.alive === false`

---

## Tasks

### Task 1: Bot Personality Engine

**Files:**
- Create: `hot-bots-core.js`
- Test: `tests/bot-personalities.spec.js`

- [ ] **Step 1: Write test for bot configuration**

```javascript
// tests/bot-personalities.spec.js
const { test, expect } = require('@playwright/test');

test.describe('Bot Personalities', () => {
  test('should have 6 default bots with unique weights', async () => {
    // Arrange & Act
    const { BOTS } = await loadBotSystem();
    
    // Assert
    expect(Object.keys(BOTS)).toHaveLength(6);
    expect(BOTS.rabbit).toBeDefined();
    expect(BOTS.lion).toBeDefined();
    expect(BOTS.wolf).toBeDefined();
    expect(BOTS.owl).toBeDefined();
    expect(BOTS.dragon).toBeDefined();
    expect(BOTS.fox).toBeDefined();
  });

  test('should have valid weight distributions (sum to 1.0)', async () => {
    const { BOTS } = await loadBotSystem();
    
    for (const [name, bot] of Object.entries(BOTS)) {
      const weightSum = Object.values(bot.weights).reduce((a, b) => a + b, 0);
      expect(weightSum).toBeCloseTo(1.0, 1); // Allow small floating point error
    }
  });

  test('rabbit should prioritize cautious choices', async () => {
    const { BOTS } = await loadBotSystem();
    expect(BOTS.rabbit.weights.cautious).toBeGreaterThan(0.4);
    expect(BOTS.rabbit.weights.bold).toBeLessThan(0.2);
  });

  test('lion should prioritize bold choices', async () => {
    const { BOTS } = await loadBotSystem();
    expect(BOTS.lion.weights.bold).toBeGreaterThan(0.4);
    expect(BOTS.lion.weights.cautious).toBeLessThan(0.2);
  });
});

async function loadBotSystem() {
  // Helper to load bot system in test context
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/../house-of-tide.html');
  await page.addScriptTag({ path: __dirname + '/../hot-bots-core.js' });
  const BOTS = await page.evaluate(() => window.BOTS);
  await page.close();
  return { BOTS };
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/bot-personalities.spec.js -v
```
Expected: FAIL with "Cannot find module 'hot-bots-core.js'"

- [ ] **Step 3: Create bot personality engine**

```javascript
// hot-bots-core.js
/**
 * Bot Personality Engine
 * Defines bot personalities with weighted decision traits
 */

// Bot personality configurations
// Weights must sum to 1.0 for each bot
const BOTS = {
  rabbit: {
    name: 'Rebecca',
    animal: '🐰',
    riskTolerance: 0.2,
    weights: {
      bold: 0.1,
      cautious: 0.5,
      political: 0.2,
      mercantile: 0.1,
      patient: 0.1
    }
  },
  lion: {
    name: 'Lucy',
    animal: '🦁',
    riskTolerance: 0.8,
    weights: {
      bold: 0.5,
      cautious: 0.1,
      political: 0.1,
      mercantile: 0.2,
      patient: 0.1
    }
  },
  wolf: {
    name: 'Winnie',
    animal: '🐺',
    riskTolerance: 0.5,
    weights: {
      bold: 0.2,
      cautious: 0.2,
      political: 0.2,
      mercantile: 0.2,
      patient: 0.2
    }
  },
  owl: {
    name: 'Sage',
    animal: '🦉',
    riskTolerance: 0.3,
    weights: {
      bold: 0.1,
      cautious: 0.2,
      political: 0.4,
      mercantile: 0.1,
      patient: 0.2
    }
  },
  dragon: {
    name: 'Midas',
    animal: '🐉',
    riskTolerance: 0.4,
    weights: {
      bold: 0.1,
      cautious: 0.3,
      political: 0.1,
      mercantile: 0.4,
      patient: 0.1
    }
  },
  fox: {
    name: 'Gambler',
    animal: '🦊',
    riskTolerance: 0.9,
    weights: {
      bold: 0.4,
      cautious: 0.05,
      political: 0.1,
      mercantile: 0.15,
      patient: 0.3
    }
  }
};

/**
 * Score a choice based on bot personality
 * @param {Object} bot - Bot configuration
 * @param {Object} choiceAnalysis - Analyzed choice traits
 * @returns {number} Score (0-1)
 */
function scoreChoice(bot, choiceAnalysis) {
  let score = 0;
  
  if (choiceAnalysis.isBold) score += bot.weights.bold;
  if (choiceAnalysis.isCautious) score += bot.weights.cautious;
  if (choiceAnalysis.isPolitical) score += bot.weights.political;
  if (choiceAnalysis.isMercantile) score += bot.weights.mercantile;
  if (choiceAnalysis.isPatient) score += bot.weights.patient;
  
  // Risk tolerance modifier
  if (choiceAnalysis.risk === 'high' && bot.riskTolerance < 0.3) {
    score *= 0.5; // Penalize risky choices for cautious bots
  }
  if (choiceAnalysis.risk === 'low' && bot.riskTolerance > 0.7) {
    score *= 0.7; // Penalize safe choices for bold bots
  }
  
  return score;
}

/**
 * Get bot by name
 * @param {string} name - Bot name (rabbit, lion, etc.)
 * @returns {Object} Bot configuration
 */
function getBot(name) {
  if (!BOTS[name]) {
    throw new Error(`Unknown bot: ${name}. Available: ${Object.keys(BOTS).join(', ')}`);
  }
  return BOTS[name];
}

// Export for browser global
window.BOTS = BOTS;
window.scoreChoice = scoreChoice;
window.getBot = getBot;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx playwright test tests/bot-personalities.spec.js -v
```
Expected: PASS all 4 tests

- [ ] **Step 5: Commit**

```bash
git add hot-bots-core.js tests/bot-personalities.spec.js
git commit -m "feat(bots): add personality engine with 6 default bots"
```

---

### Task 2: Choice Analyzer

**Files:**
- Create: `hot-bots-analyzer.js`
- Test: `tests/bot-personalities.spec.js` (add tests)

- [ ] **Step 1: Write tests for choice analysis**

```javascript
// Add to tests/bot-personalities.spec.js

test.describe('Choice Analyzer', () => {
  test('should detect bold choices', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Commission a ship').isBold).toBe(true);
    expect(analyzeChoice('Dispatch mercenaries').isBold).toBe(true);
    expect(analyzeChoice('Accept the challenge').isBold).toBe(true);
  });

  test('should detect cautious choices', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Wait and observe').isCautious).toBe(true);
    expect(analyzeChoice('Decline the offer').isCautious).toBe(true);
    expect(analyzeChoice('Do nothing this season').isCautious).toBe(true);
  });

  test('should detect political choices', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Negotiate an alliance').isPolitical).toBe(true);
    expect(analyzeChoice('Write a letter to the council').isPolitical).toBe(true);
  });

  test('should detect mercantile choices', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Invest in trade routes').isMercantile).toBe(true);
    expect(analyzeChoice('Negotiate better rates').isMercantile).toBe(true);
    expect(analyzeChoice('Buy additional warehouses').isMercantile).toBe(true);
  });

  test('should detect patient choices', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Wait another season').isPatient).toBe(true);
    expect(analyzeChoice('Hold your position').isPatient).toBe(true);
  });

  test('should detect risk level', async () => {
    const { analyzeChoice } = await loadAnalyzer();
    
    expect(analyzeChoice('Risk everything on one venture').risk).toBe('high');
    expect(analyzeChoice('Make a small investment').risk).toBe('low');
  });
});

async function loadAnalyzer() {
  const page = await browser.newPage();
  await page.goto('file://' + __dirname + '/../house-of-tide.html');
  await page.addScriptTag({ path: __dirname + '/../hot-bots-core.js' });
  await page.addScriptTag({ path: __dirname + '/../hot-bots-analyzer.js' });
  const analyzeChoice = await page.evaluate(() => window.analyzeChoice);
  await page.close();
  return { analyzeChoice };
}
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/bot-personalities.spec.js -v
```
Expected: FAIL - `analyzeChoice` not defined

- [ ] **Step 3: Create choice analyzer**

```javascript
// hot-bots-analyzer.js
/**
 * Choice Analyzer
 * Parses choice text for personality trait signals
 */

/**
 * Analyze a choice for personality traits
 * @param {string} choiceText - The choice text to analyze
 * @returns {Object} Analysis result with trait flags
 */
function analyzeChoice(choiceText) {
  const lower = choiceText.toLowerCase();
  
  const analysis = {
    isBold: /\b(commission|dispatch|accept|send|buy|challenge|attack|venture|spend|invest|build)\b/.test(lower),
    isCautious: /\b(wait|decline|nothing|later|find out|observe|retreat|avoid|preserve|save)\b/.test(lower),
    isPolitical: /\b(negotiate|write|letter|council|alliance|petition|appeal|diplomat|envoy)\b/.test(lower),
    isMercantile: /\b(fee|rate|price|marks|profit|contract|trade|merchant|warehouse|goods)\b/.test(lower),
    isPatient: /\b(another season|not yet|hold|watch|bide|time|slow)\b/.test(lower)
  };
  
  // Detect risk level
  analysis.risk = detectRisk(choiceText);
  
  return analysis;
}

/**
 * Detect risk level from choice text
 * @param {string} choiceText - The choice text
 * @returns {string} 'high', 'medium', or 'low'
 */
function detectRisk(choiceText) {
  const lower = choiceText.toLowerCase();
  
  // High risk indicators
  if (/\b(all|everything|risk|gamble|desperate|last|final)\b/.test(lower)) {
    return 'high';
  }
  
  // Low risk indicators
  if (/\b(safe|careful|cautious|small|modest|conservative)\b/.test(lower)) {
    return 'low';
  }
  
  // Medium risk by default
  return 'medium';
}

// Export for browser global
window.analyzeChoice = analyzeChoice;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx playwright test tests/bot-personalities.spec.js -v
```
Expected: PASS all tests

- [ ] **Step 5: Commit**

```bash
git add hot-bots-analyzer.js tests/bot-personalities.spec.js
git commit -m "feat(bots): add choice analyzer with trait detection"
```

---

### Task 3: Bot Game Loop

**Files:**
- Create: `hot-bots-loop.js`
- Test: `tests/bot-game-loop.spec.js`

- [ ] **Step 1: Write test for single bot turn**

```javascript
// tests/bot-game-loop.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Bot Game Loop', () => {
  test('should make a choice as rabbit bot', async () => {
    const page = await browser.newPage();
    
    // Load game and bot system
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    
    // Start new game
    await page.evaluate(() => {
      window.startTestGame(); // Will use helper from helpers.js
    });
    
    // Wait for event and choices
    await page.waitForSelector('#choices-container button', { timeout: 10000 });
    
    // Get available choices
    const choices = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('#choices-container button'))
        .map(btn => btn.textContent);
    });
    
    // Bot should select a choice
    const selectedChoice = await page.evaluate((choices) => {
      const bot = window.getBot('rabbit');
      return window.selectBestChoice(bot, choices);
    }, choices);
    
    expect(selectedChoice).toBeDefined();
    expect(typeof selectedChoice).toBe('number');
    expect(selectedChoice).toBeGreaterThanOrEqual(0);
    expect(selectedChoice).toBeLessThan(choices.length);
    
    await page.close();
  });

  test('should play multiple turns as lion', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    
    // Play 3 turns
    const turnsPlayed = await page.evaluate(async () => {
      const bot = window.getBot('lion');
      let turns = 0;
      
      // This will be implemented in hot-bots-loop.js
      while (turns < 3 && !window.isGameOver()) {
        await window.playBotTurn(bot);
        turns++;
      }
      
      return turns;
    });
    
    expect(turnsPlayed).toBe(3);
    
    await page.close();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/bot-game-loop.spec.js -v
```
Expected: FAIL - functions not defined

- [ ] **Step 3: Create game loop**

```javascript
// hot-bots-loop.js
/**
 * Bot Game Loop
 * Autonomous gameplay execution
 */

/**
 * Get available choices from DOM
 * @returns {string[]} Array of choice texts
 */
function getAvailableChoices() {
  const container = document.getElementById('choices-container');
  if (!container) return [];
  
  return Array.from(container.querySelectorAll('button'))
    .map(btn => btn.textContent.trim());
}

/**
 * Select best choice for bot
 * @param {Object} bot - Bot configuration
 * @param {string[]} choices - Available choice texts
 * @returns {number} Index of best choice
 */
function selectBestChoice(bot, choices) {
  if (!choices || choices.length === 0) return -1;
  
  const scored = choices.map((text, index) => {
    const analysis = window.analyzeChoice ? window.analyzeChoice(text) : {};
    const score = window.scoreChoice ? window.scoreChoice(bot, analysis) : Math.random();
    return { index, score, text };
  });
  
  // Sort by score descending
  scored.sort((a, b) => b.score - a.score);
  
  // Add some randomness - occasionally pick 2nd best for variety
  if (Math.random() < 0.1 && scored.length > 1) {
    return scored[1].index;
  }
  
  return scored[0].index;
}

/**
 * Play one turn as bot
 * @param {Object} bot - Bot configuration
 * @returns {Promise<Object>} Turn result
 */
async function playBotTurn(bot) {
  const choices = getAvailableChoices();
  
  if (choices.length === 0) {
    console.log(`[${bot.name}] No choices available`);
    return { madeChoice: false };
  }
  
  const choiceIndex = selectBestChoice(bot, choices);
  
  if (choiceIndex === -1) {
    console.log(`[${bot.name}] Could not select choice`);
    return { madeChoice: false };
  }
  
  console.log(`[${bot.name}] Choosing: ${choices[choiceIndex]}`);
  
  // Call game's makeChoice function (from hot-engine.js)
  if (typeof makeChoice === 'function') {
    makeChoice(choiceIndex, false); // false = not human choice
    return { madeChoice: true, choiceIndex, choiceText: choices[choiceIndex] };
  } else {
    console.error('makeChoice function not found');
    return { madeChoice: false, error: 'makeChoice not available' };
  }
}

/**
 * Check if game is over
 * @returns {boolean}
 */
function isGameOver() {
  if (typeof gs === 'undefined') return true;
  return !gs.alive || gs.phase === 'gameover';
}

/**
 * Get current game result
 * @returns {Object} Game result stats
 */
function getGameResult() {
  if (typeof gs === 'undefined') {
    return { victory: false, marks: 0, rep: 0, generations: 0 };
  }
  
  return {
    victory: gs.victory || false,
    marks: gs.marks || 0,
    rep: gs.reputation || 0,
    generations: gs.generations || 1,
    causeOfDeath: gs.causeOfDeath || null,
    year: gs.year || 0
  };
}

/**
 * Play a full game as bot
 * @param {Object} bot - Bot configuration
 * @param {number} maxTurns - Maximum turns (Infinity for full game)
 * @returns {Promise<Object>} Game result
 */
async function playGame(bot, maxTurns = Infinity) {
  console.log(`[${bot.name}] Starting new game...`);
  
  let turn = 0;
  while (turn < maxTurns && !isGameOver()) {
    const result = await playBotTurn(bot);
    
    if (!result.madeChoice) {
      console.log(`[${bot.name}] Turn ${turn + 1}: No choice made`);
      break;
    }
    
    turn++;
    
    // Small delay to let UI update
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  const gameResult = getGameResult();
  console.log(`[${bot.name}] Game over after ${turn} turns:`, gameResult);
  
  return { turns: turn, ...gameResult };
}

// Export for browser global
window.getAvailableChoices = getAvailableChoices;
window.selectBestChoice = selectBestChoice;
window.playBotTurn = playBotTurn;
window.isGameOver = isGameOver;
window.getGameResult = getGameResult;
window.playGame = playGame;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx playwright test tests/bot-game-loop.spec.js -v
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add hot-bots-loop.js tests/bot-game-loop.spec.js
git commit -m "feat(bots): add autonomous game loop"
```

---

### Task 4: Stats Tracking

**Files:**
- Create: `hot-bots-stats.js`
- Test: `tests/bot-stats.spec.js`

- [ ] **Step 1: Write test for stats persistence**

```javascript
// tests/bot-stats.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Bot Stats', () => {
  test('should record game results', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    
    // Record a result
    await page.evaluate(() => {
      window.recordBotResult('rabbit', {
        victory: false,
        marks: 500,
        rep: 4,
        generations: 2
      });
    });
    
    // Verify stored in localStorage
    const stats = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('bot-stats') || '{}');
    });
    
    expect(stats.rabbit).toBeDefined();
    expect(stats.rabbit.games).toBe(1);
    expect(stats.rabbit.totalMarks).toBe(500);
    expect(stats.rabbit.totalRep).toBe(4);
    
    await page.close();
  });

  test('should accumulate stats over multiple games', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    
    // Record multiple results
    await page.evaluate(() => {
      window.recordBotResult('lion', { victory: true, marks: 1000, rep: 8, generations: 3 });
      window.recordBotResult('lion', { victory: false, marks: 200, rep: 3, generations: 1 });
    });
    
    const stats = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('bot-stats') || '{}');
    });
    
    expect(stats.lion.games).toBe(2);
    expect(stats.lion.wins).toBe(1);
    expect(stats.lion.totalMarks).toBe(1200);
    expect(stats.lion.winRate).toBeCloseTo(0.5);
    
    await page.close();
  });

  test('should calculate win rate', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    
    await page.evaluate(() => {
      window.recordBotResult('wolf', { victory: true, marks: 800, rep: 6, generations: 2 });
      window.recordBotResult('wolf', { victory: true, marks: 900, rep: 7, generations: 3 });
      window.recordBotResult('wolf', { victory: false, marks: 100, rep: 2, generations: 1 });
    });
    
    const stats = await page.evaluate(() => {
      return JSON.parse(localStorage.getItem('bot-stats') || '{}');
    });
    
    expect(stats.wolf.winRate).toBeCloseTo(0.67, 2);
    
    await page.close();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

```bash
npx playwright test tests/bot-stats.spec.js -v
```
Expected: FAIL

- [ ] **Step 3: Create stats tracker**

```javascript
// hot-bots-stats.js
/**
 * Bot Stats Tracking
 * Persists bot performance data to localStorage
 */

const STATS_KEY = 'bot-stats';

/**
 * Record a bot game result
 * @param {string} botName - Bot name (rabbit, lion, etc.)
 * @param {Object} result - Game result
 */
function recordBotResult(botName, result) {
  const stats = getStats();
  
  if (!stats[botName]) {
    stats[botName] = {
      games: 0,
      wins: 0,
      totalMarks: 0,
      totalRep: 0,
      totalGenerations: 0,
      winRate: 0
    };
  }
  
  stats[botName].games++;
  stats[botName].totalMarks += result.marks || 0;
  stats[botName].totalRep += result.rep || 0;
  stats[botName].totalGenerations += result.generations || 1;
  
  if (result.victory) {
    stats[botName].wins++;
  }
  
  // Recalculate win rate
  stats[botName].winRate = stats[botName].games > 0
    ? stats[botName].wins / stats[botName].games
    : 0;
  
  saveStats(stats);
}

/**
 * Get all stats
 * @returns {Object} Stats object
 */
function getStats() {
  try {
    return JSON.parse(localStorage.getItem(STATS_KEY) || '{}');
  } catch (e) {
    console.error('Error loading bot stats:', e);
    return {};
  }
}

/**
 * Get stats for specific bot
 * @param {string} botName - Bot name
 * @returns {Object|null} Bot stats or null
 */
function getBotStats(botName) {
  const stats = getStats();
  return stats[botName] || null;
}

/**
 * Clear all stats
 */
function clearStats() {
  localStorage.removeItem(STATS_KEY);
  console.log('Bot stats cleared');
}

/**
 * Save stats to localStorage
 * @param {Object} stats - Stats object
 */
function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {
    console.error('Error saving bot stats:', e);
  }
}

// Export for browser global
window.recordBotResult = recordBotResult;
window.getStats = getStats;
window.getBotStats = getBotStats;
window.clearStats = clearStats;
```

- [ ] **Step 4: Run test to verify it passes**

```bash
npx playwright test tests/bot-stats.spec.js -v
```
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add hot-bots-stats.js tests/bot-stats.spec.js
git commit -m "feat(bots): add stats tracking with localStorage persistence"
```

---

### Task 5: Global Bot API

**Files:**
- Create: `hot-bots.js`
- Modify: `tests/helpers.js` (add bot helpers)

- [ ] **Step 1: Write test for global API**

```javascript
// tests/bot-api.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('HotBots Global API', () => {
  test('should expose HotBots global', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots.js') });
    
    const hasHotBots = await page.evaluate(() => {
      return typeof window.HotBots !== 'undefined';
    });
    
    expect(hasHotBots).toBe(true);
    
    await page.close();
  });

  test('should simulate games via HotBots.simulate', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots.js') });
    
    // Clear stats first
    await page.evaluate(() => window.clearStats());
    
    // Simulate 2 games (use small number for test speed)
    const result = await page.evaluate(async () => {
      return await window.HotBots.simulate('rabbit', 2);
    });
    
    expect(result).toBeDefined();
    expect(result.games).toBe(2);
    expect(result.results).toHaveLength(2);
    
    await page.close();
  });
});
```

- [ ] **Step 2: Create global API**

```javascript
// hot-bots.js
/**
 * HotBots Global API
 * Main entry point for bot commands
 */

// Ensure all dependencies are loaded
if (typeof BOTS === 'undefined') {
  console.error('HotBots: hot-bots-core.js not loaded');
}
if (typeof analyzeChoice === 'undefined') {
  console.error('HotBots: hot-bots-analyzer.js not loaded');
}
if (typeof playGame === 'undefined') {
  console.error('HotBots: hot-bots-loop.js not loaded');
}
if (typeof recordBotResult === 'undefined') {
  console.error('HotBots: hot-bots-stats.js not loaded');
}

// Global API
window.HotBots = {
  /**
   * Simulate multiple games as a bot
   * @param {string} botName - Bot name (rabbit, lion, etc.)
   * @param {number} numGames - Number of games to simulate
   * @returns {Promise<Object>} Aggregated results
   */
  async simulate(botName, numGames) {
    const bot = getBot(botName);
    const results = [];
    
    console.log(`🤖 HotBots: Simulating ${numGames} games as ${bot.animal} ${bot.name}...`);
    
    for (let i = 0; i < numGames; i++) {
      console.log(`Game ${i + 1}/${numGames}`);
      
      // Reset game state for each simulation
      if (typeof resetGameState === 'function') {
        await resetGameState();
      }
      
      const result = await playGame(bot, Infinity);
      results.push(result);
      
      // Record stats
      recordBotResult(botName, result);
    }
    
    const summary = analyzeResults(results);
    console.log(`✅ HotBots: Simulation complete. Win rate: ${(summary.winRate * 100).toFixed(1)}%`);
    
    return {
      bot: botName,
      games: numGames,
      results,
      summary
    };
  },

  /**
   * Play a single game and return result
   * @param {string} botName - Bot name
   * @param {number} maxTurns - Maximum turns (default: full game)
   * @returns {Promise<Object>} Game result
   */
  async playOne(botName, maxTurns = Infinity) {
    const bot = getBot(botName);
    const result = await playGame(bot, maxTurns);
    recordBotResult(botName, result);
    return result;
  },

  /**
   * Get leaderboard data
   * @returns {Object} Leaderboard stats
   */
  leaderboard() {
    const stats = getStats();
    return Object.entries(stats).map(([name, data]) => ({
      bot: name,
      ...data
    }));
  },

  /**
   * Clear all bot stats
   */
  clearStats() {
    clearStats();
    console.log('🗑️ HotBots: Stats cleared');
  }
};

/**
 * Analyze simulation results
 * @param {Array} results - Array of game results
 * @returns {Object} Summary statistics
 */
function analyzeResults(results) {
  if (!results || results.length === 0) {
    return { winRate: 0, avgMarks: 0, avgRep: 0, avgGenerations: 0 };
  }
  
  const wins = results.filter(r => r.victory).length;
  const totalMarks = results.reduce((sum, r) => sum + (r.marks || 0), 0);
  const totalRep = results.reduce((sum, r) => sum + (r.rep || 0), 0);
  const totalGenerations = results.reduce((sum, r) => sum + (r.generations || 1), 0);
  
  return {
    winRate: wins / results.length,
    avgMarks: totalMarks / results.length,
    avgRep: totalRep / results.length,
    avgGenerations: totalGenerations / results.length,
    totalWins: wins,
    totalGames: results.length
  };
}

// Export analyzeResults for testing
window.analyzeResults = analyzeResults;
```

- [ ] **Step 3: Add helper to tests/helpers.js**

```javascript
// Add to end of tests/helpers.js, before module.exports

/**
 * Play one turn as a bot (for integration tests)
 * @param {Page} page - Playwright page
 * @param {string} botName - Bot name
 */
async function playBotTurn(page, botName) {
  await page.evaluate((bot) => {
    const botConfig = window.getBot(bot);
    window.playBotTurn(botConfig);
  }, botName);
}

/**
 * Get available choices from game
 * @param {Page} page - Playwright page
 * @returns {Promise<string[]>} Choice texts
 */
async function getAvailableChoices(page) {
  return await page.evaluate(() => {
    return window.getAvailableChoices();
  });
}
```

- [ ] **Step 4: Update module.exports in tests/helpers.js**

```javascript
// Add to the exports object:
module.exports = {
  // ... existing exports ...
  
  // Bot helpers
  playBotTurn,
  getAvailableChoices
};
```

- [ ] **Step 5: Run test to verify it passes**

```bash
npx playwright test tests/bot-api.spec.js -v
```
Expected: PASS

- [ ] **Step 6: Commit**

```bash
git add hot-bots.js tests/bot-api.spec.js tests/helpers.js
git commit -m "feat(bots): add global HotBots API"
```

---

### Task 6: Console Leaderboard

**Files:**
- Create: `bots/leaderboard.js`
- Test: Manual testing in browser console

- [ ] **Step 1: Create leaderboard display**

```javascript
// bots/leaderboard.js
/**
 * Bot Leaderboard
 * Console display and analytics
 */

/**
 * Display leaderboard in console
 */
function showLeaderboard() {
  const stats = getStats();
  const entries = Object.entries(stats);
  
  if (entries.length === 0) {
    console.log('📊 No bot games played yet. Use HotBots.simulate() to start!');
    return;
  }
  
  // Sort by win rate
  const sorted = entries.sort((a, b) => b[1].winRate - a[1].winRate);
  
  const BOT_EMOJIS = {
    rabbit: '🐰',
    lion: '🦁',
    wolf: '🐺',
    owl: '🦉',
    dragon: '🐉',
    fox: '🦊'
  };
  
  console.log('\n' + '═'.repeat(80));
  console.log('║' + ' HOUSE OF TIDE - BOT LEADERBOARD '.padEnd(78) + '║');
  console.log('═'.repeat(80));
  console.log('║ ' + 'Bot'.padEnd(15) + '│ ' + 
                     'Games'.padStart(6) + ' │ ' + 
                     'Wins'.padStart(5) + ' │ ' + 
                     'Win Rate'.padStart(9) + ' │ ' + 
                     'Avg Marks'.padStart(10) + ' │ ' + 
                     'Avg Rep'.padStart(8) + ' ║');
  console.log('╟' + '─'.repeat(15) + '┼' + '─'.repeat(8) + '┼' + '─'.repeat(7) + '┼' + '─'.repeat(11) + '┼' + '─'.repeat(12) + '┼' + '─'.repeat(9) + '╢');
  
  sorted.forEach(([name, data]) => {
    const emoji = BOT_EMOJIS[name] || '🤖';
    const displayName = `${emoji} ${name.charAt(0).toUpperCase() + name.slice(1)}`;
    
    console.log('║ ' + displayName.padEnd(15) + '│ ' + 
                       String(data.games).padStart(6) + ' │ ' + 
                       String(data.wins).padStart(5) + ' │ ' + 
                       `${(data.winRate * 100).toFixed(1)}%`.padStart(9) + ' │ ' + 
                       Math.round(data.totalMarks / data.games).toString().padStart(10) + ' │ ' + 
                       (data.totalRep / data.games).toFixed(1).padStart(8) + ' ║');
  });
  
  console.log('╚' + '═'.repeat(78) + '╝');
  console.log('\n💡 Tip: Use HotBots.simulate(botName, numGames) to run more games\n');
}

/**
 * Generate balance report
 */
function balanceReport() {
  const stats = getStats();
  const entries = Object.entries(stats);
  
  if (entries.length === 0) {
    console.log('📊 No data for balance report');
    return;
  }
  
  const sortedByWinRate = [...entries].sort((a, b) => b[1].winRate - a[1].winRate);
  const sortedByMarks = [...entries].sort((a, b) => (b[1].totalMarks / b[1].games) - (a[1].totalMarks / a[1].games));
  const sortedByRep = [...entries].sort((a, b) => (b[1].totalRep / b[1].games) - (a[1].totalRep / a[1].games));
  
  console.log('\n📈 BALANCE REPORT\n');
  
  console.log('🏆 Highest Win Rate:');
  const topWin = sortedByWinRate[0];
  console.log(`   ${topWin[0]} (${(topWin[1].winRate * 100).toFixed(1)}%)`);
  
  console.log('\n💰 Highest Average Wealth:');
  const topMarks = sortedByMarks[0];
  console.log(`   ${topMarks[0]} (${Math.round(topMarks[1].totalMarks / topMarks[1].games)} mk)`);
  
  console.log('\n👑 Highest Average Reputation:');
  const topRep = sortedByRep[0];
  console.log(`   ${topRep[0]} (${(topRep[1].totalRep / topRep[1].games).toFixed(1)})`);
  
  // Detect potential balance issues
  console.log('\n⚠️ Potential Balance Issues:');
  
  const winRates = entries.map(e => e[1].winRate);
  const maxWinRate = Math.max(...winRates);
  const minWinRate = Math.min(...winRates);
  
  if (maxWinRate - minWinRate > 0.2) {
    console.log('   - Large win rate gap detected (>20%)');
    console.log(`     Best: ${(maxWinRate * 100).toFixed(1)}%, Worst: ${(minWinRate * 100).toFixed(1)}%`);
  }
  
  if (minWinRate < 0.1) {
    const worstBot = entries.find(e => e[1].winRate === minWinRate);
    console.log(`   - ${worstBot[0]} has very low win rate (${(minWinRate * 100).toFixed(1)}%)`);
  }
  
  if (maxWinRate > 0.5) {
    const bestBot = entries.find(e => e[1].winRate === maxWinRate);
    console.log(`   - ${bestBot[0]} may be overpowered (${(maxWinRate * 100).toFixed(1)}% win rate)`);
  }
  
  console.log('\n💡 Run more games with HotBots.simulate() for better data\n');
}

// Export for browser global
window.showLeaderboard = showLeaderboard;
window.balanceReport = balanceReport;

// Auto-add to HotBots API if it exists
if (window.HotBots) {
  window.HotBots.showLeaderboard = showLeaderboard;
  window.HotBots.balanceReport = balanceReport;
}
```

- [ ] **Step 2: Manual testing**

Open `house-of-tide.html` in browser and run in console:
```javascript
// Load all bot scripts
await loadScript('hot-bots-core.js');
await loadScript('hot-bots-analyzer.js');
await loadScript('hot-bots-loop.js');
await loadScript('hot-bots-stats.js');
await loadScript('hot-bots.js');
await loadScript('bots/leaderboard.js');

// Run simulation
await HotBots.simulate('rabbit', 5);
await HotBots.simulate('lion', 5);

// Show leaderboard
HotBots.showLeaderboard();
HotBots.balanceReport();
```

- [ ] **Step 3: Commit**

```bash
git add bots/leaderboard.js
git commit -m "feat(bots): add console leaderboard and balance report"
```

---

### Task 7: Package.json Scripts

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Add npm scripts**

```json
{
  "scripts": {
    "test": "playwright test",
    "test:ui": "playwright test --ui",
    "test:headed": "playwright test --headed",
    "test:report": "playwright show-report",
    "dev": "npx http-server -p 8080 -c-1",
    "dev:webpack": "webpack serve --config webpack.dev.js",
    "build": "webpack --config webpack.prod.js",
    "analyze": "webpack --config webpack.prod.js --profile --json > stats.json && webpack-bundle-analyzer stats.json",
    "minify": "for f in hot-*.js; do npx terser \"$f\" -o \"$f\" -c 2>/dev/null || true; done",
    "minify:check": "echo 'JS:' && wc -c hot-*.js | tail -1 && echo 'CSS:' && wc -c hot-game.css",
    
    "test:bots": "playwright test tests/bot-*.spec.js",
    "bot:simulate": "echo 'Open house-of-tide.html and run: await HotBots.simulate(\\\"rabbit\\\", 10)'",
    "bot:leaderboard": "echo 'Open house-of-tide.html and run: HotBots.showLeaderboard()'"
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add package.json
git commit -m "chore: add bot testing npm scripts"
```

---

### Task 8: Integration Test

**Files:**
- Create: `tests/bot-integration.spec.js`

- [ ] **Step 1: Write full integration test**

```javascript
// tests/bot-integration.spec.js
const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Bot Integration', () => {
  test('should complete full game flow', async () => {
    const page = await browser.newPage();
    
    // Load all bot scripts
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots.js') });
    
    // Clear stats
    await page.evaluate(() => window.clearStats());
    
    // Play one complete game
    const result = await page.evaluate(async () => {
      return await window.HotBots.playOne('rabbit');
    });
    
    // Verify game completed
    expect(result.turns).toBeGreaterThan(0);
    expect(result.generations).toBeGreaterThanOrEqual(1);
    
    // Verify stats recorded
    const stats = await page.evaluate(() => window.getStats());
    expect(stats.rabbit.games).toBe(1);
    
    await page.close();
  });

  test('should run multiple bot simulations', async () => {
    const page = await browser.newPage();
    
    await page.goto('file://' + path.join(__dirname, '..', 'house-of-tide.html'));
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-core.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-analyzer.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-loop.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots-stats.js') });
    await page.addScriptTag({ path: path.join(__dirname, '..', 'hot-bots.js') });
    
    await page.evaluate(() => window.clearStats());
    
    // Run small simulations for 3 bots
    await page.evaluate(async () => {
      await window.HotBots.simulate('rabbit', 2);
      await window.HotBots.simulate('lion', 2);
      await window.HotBots.simulate('wolf', 2);
    });
    
    // Verify all bots have stats
    const stats = await page.evaluate(() => window.getStats());
    expect(stats.rabbit.games).toBe(2);
    expect(stats.lion.games).toBe(2);
    expect(stats.wolf.games).toBe(2);
    
    await page.close();
  });
});
```

- [ ] **Step 2: Run all bot tests**

```bash
npx playwright test tests/bot-*.spec.js -v
```
Expected: All tests pass

- [ ] **Step 3: Commit**

```bash
git add tests/bot-integration.spec.js
git commit -m "test(bots): add integration tests for full bot flow"
```

---

## Testing Summary

After all tasks complete, run:

```bash
# Run all bot tests
npm run test:bots

# Run full test suite to ensure no regressions
npm test
```

## Usage Examples

Once implemented, users can run:

```javascript
// In browser console:

// Simulate 50 games as Rabbit
await HotBots.simulate('rabbit', 50);

// Simulate 50 games as Lion
await HotBots.simulate('lion', 50);

// Show leaderboard
HotBots.showLeaderboard();

// Generate balance report
HotBots.balanceReport();

// Clear stats
HotBots.clearStats();
```

## Related Documentation

- `RESUME_HERE.md` - Original task specification
- `GAMEPLAY_TESTING.md` - Bot system architecture
- `tests/helpers.js` - Test utilities
