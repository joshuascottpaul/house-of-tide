# Gameplay Testing & Automation

This guide covers how to automate House of Tide gameplay using Chrome DevTools Protocol (CDP) for testing, debugging, and automated play sessions.

**Last Updated:** March 20, 2026
**Bot Tier 1 MVP Status:** 4/8 tasks complete (50%) — In Progress

---

## 📊 Current Implementation Status

**Worktree:** `.worktrees/bot-tier1-mvp/` (branch: `feature/bot-tier1-mvp`)

### ✅ Completed Modules (4/8)

| Module | File | Tests | Purpose |
|--------|------|-------|---------|
| Personality Engine | `hot-bots-core.js` | 6 | 6 bot personalities with weighted traits |
| Choice Analyzer | `hot-bots-analyzer.js` | 8 | Regex-based trait detection |
| Game Loop | `hot-bots-loop.js` | 8 | Autonomous gameplay execution |
| Stats Tracking | `hot-bots-stats.js` | 16 | localStorage persistence |

**Total:** 38 tests passing

### ⏳ In Progress / TODO (4/8)

| Module | File | Status |
|--------|------|--------|
| Global API | `hot-bots.js` | In Progress |
| Leaderboard | `bots/leaderboard.js` | TODO |
| CDP Runner | `bots/cdp-runner.js` | TODO |
| Balance Report | `bots/balance-report.js` | TODO |

### To Resume Implementation

```bash
cd .worktrees/bot-tier1-mvp
git checkout feature/bot-tier1-mvp
# Task 5: Create hot-bots.js with window.HotBots global API
```

---

**Table of Contents:**
1. [Quick Start (CDP)](#quick-start)
2. [Virtual Players (Bots)](#virtual-players-bots)
3. [Bot Architecture](#bot-architecture)
4. [Bot Personas](#bot-personas)
5. [Running Bots](#running-bots)
6. [Leaderboard & Analytics](#leaderboard--analytics)
7. [Basic CDP Commands](#basic-commands)
8. [Automation Scripts](#automation-scripts)

---

## Why Use CDP?

- **No MCP server needed** - Direct Chrome control via HTTP/WebSocket
- **Scriptable** - Automate full game sessions
- **Debug-friendly** - Capture console errors, screenshots, game state
- **Fast iteration** - Test changes without manual clicking

---

## Virtual Players (Bots)

Virtual players are AI-driven bots that play the game autonomously with distinct personalities. They serve four purposes:

| Purpose | How Bots Help |
|---------|---------------|
| **Testing Automation** | Run automated sessions to find bugs, verify AI responses, test edge cases |
| **Gameplay Simulation** | Watch different personalities generate emergent stories |
| **Strategy Exploration** | Discover which approaches win most often |
| **Game Balance Tuning** | Detect if game is too hard/easy, if strategies are overpowered |

### Two Play Modes

**1. Watch Mode (CDP)** — Bot plays in real browser, you watch:
```bash
npm run bot:watch -- --bot=rabbit
```
- Opens Chrome Beta
- Bot clicks real buttons
- You see the game unfold
- Captures screenshots each turn

**2. Simulate Mode (Direct JS)** — Fast batch simulation:
```bash
npm run bot:simulate -- --bot=lion --games=50
```
- No browser, direct function calls
- 100+ games in minutes
- Statistical output only

---

## Bot Architecture

### 3-Layer Hybrid System

```
┌─────────────────────────────────────────────────────────┐
│  LAYER 1: Bot Personalities (decision logic)            │
│  - Rebecca the Rabbit, Lucy the Lion, Winnie the Wolf   │
│  - Pure JS - no browser dependency                       │
└─────────────────────────────────────────────────────────┘
                          │
          ┌───────────────┴───────────────┐
          ▼                               ▼
┌─────────────────────┐         ┌─────────────────────┐
│  LAYER 2A: CDP      │         │  LAYER 2B: Direct   │
│  Browser Control    │         │  JS Injection       │
│  - Real clicks      │         │  - Call makeChoice()│
│  - Screenshots      │         │  - Fast simulation  │
│  - Visual testing   │         │  - Batch runs       │
└─────────────────────┘         └─────────────────────┘
          │                               │
          └───────────────┬───────────────┘
                          ▼
┌─────────────────────────────────────────────────────────┐
│  LAYER 3: Game (house-of-tide.html)                     │
│  - hot-engine.js (makeChoice)                           │
│  - hot-events.js (event generation)                     │
│  - hot-ui.js (rendering)                                │
└─────────────────────────────────────────────────────────┘
```

### Why Hybrid?

| Task | Use Layer | Why |
|------|-----------|-----|
| Find UI bugs | CDP | Catches real browser issues |
| Test game balance | Direct JS | Run 1000 games in minutes |
| Generate stories | CDP | Screenshots + real rendering |
| Tune difficulty | Direct JS | Statistical analysis |

---

## Bot Personas

### Recommended Archetypes

| Bot | Animal | Strategy | Personality | Win Condition |
|-----|--------|----------|-------------|---------------|
| **Rebecca** | 🐰 Rabbit | Cautious Observer | Waits, investigates, defers. Avoids risks. | Survive 3+ generations |
| **Lucy** | 🦁 Lion | Aggressive Actor | Commits fast, spends boldly, challenges rivals | Maximize treasury |
| **Winnie** | 🐺 Wolf | Strategic Opportunist | Political, mercantile, patient, calculates odds | Balance rep + wealth |
| **Sage** | 🦉 Owl | Reputation Builder | Networks, alliances, public actions | Reach Rep 10 |
| **Midas** | 🐉 Dragon | Wealth Accumulator | Mercantile focus, frugal, profit-driven | Maximize marks |
| **Gambler** | 🦊 Fox | High-Risk Speculator | Ventures, ships, big swings | High variance wins |

### Decision Weights

Each bot scores choices using weighted personality traits:

```javascript
// Rebecca (Rabbit) - Cautious
weights: { bold: 0.1, cautious: 0.5, political: 0.2, mercantile: 0.1, patient: 0.1 }

// Lucy (Lion) - Aggressive  
weights: { bold: 0.5, cautious: 0.1, political: 0.1, mercantile: 0.2, patient: 0.1 }

// Winnie (Wolf) - Balanced
weights: { bold: 0.2, cautious: 0.2, political: 0.2, mercantile: 0.2, patient: 0.2 }

// Sage (Owl) - Political
weights: { bold: 0.1, cautious: 0.2, political: 0.4, mercantile: 0.1, patient: 0.2 }

// Midas (Dragon) - Mercantile
weights: { bold: 0.1, cautious: 0.3, political: 0.1, mercantile: 0.4, patient: 0.1 }

// Gambler (Fox) - High Risk
weights: { bold: 0.4, cautious: 0.05, political: 0.1, mercantile: 0.15, patient: 0.3 }
```

### Choice Scoring Algorithm

```javascript
function scoreChoice(bot, choiceText, choiceRisk) {
  const analysis = analyzeChoiceRisk(choiceText);
  
  // Score based on bot's personality weights
  let score = 0;
  if (analysis.isBold) score += bot.weights.bold;
  if (analysis.isCautious) score += bot.weights.cautious;
  if (analysis.isPolitical) score += bot.weights.political;
  if (analysis.isMercantile) score += bot.weights.mercantile;
  if (analysis.isPatient) score += bot.weights.patient;
  
  // Risk tolerance modifier
  if (analysis.risk === 'high' && bot.riskTolerance < 0.3) score *= 0.5;
  if (analysis.risk === 'low' && bot.riskTolerance > 0.7) score *= 0.7;
  
  return score;
}
```

---

## Running Bots

### Quick Start Commands

```bash
# Watch mode - see bot play in real browser
npm run bot:watch -- --bot=rabbit --turns=20

# Simulate mode - fast batch games
npm run bot:simulate -- --bot=lion --games=50

# Run all bots for comparison
npm run bot:tournament -- --games=10

# View leaderboard
npm run bot:leaderboard
```

### Manual Bot Invocation (In Browser Console)

```javascript
// Load bot system
await HotBots.load();

// Play as Rebecca (Rabbit) for 10 turns
HotBots.playAs('rabbit', 10);

// Play as Lucy (Lion) until game over
HotBots.playAs('lion', Infinity);

// Simulate 100 games as Winnie (Wolf)
const results = await HotBots.simulate('wolf', 100);
console.log(results.summary);
```

### Bot Configuration

```javascript
const botConfig = {
  bot: 'rabbit',      // rabbit, lion, wolf, owl, dragon, fox
  mode: 'watch',      // 'watch' (CDP) or 'simulate' (direct JS)
  turns: 20,          // Number of turns to play (Infinity = game over)
  screenshot: true,   // Capture screenshots each turn
  logFile: true,      // Save detailed log
  speed: 'normal'     // 'fast' (no delays) or 'normal' (human-like)
};
```

---

## Leaderboard & Analytics

### Stats Tracked

| Metric | Description |
|--------|-------------|
| **Games Played** | Total sessions completed |
| **Win Rate** | % of games reaching victory |
| **Avg Generations** | How long dynasty survives |
| **Avg Final Marks** | Typical ending treasury |
| **Avg Final Rep** | Typical ending reputation |
| **Peak Marks** | Highest wealth achieved |
| **Peak Rep** | Highest reputation achieved |
| **Bold/Cautious Ratio** | Decision pattern |
| **Bankruptcies** | Games ended by ruin |
| **Legendary Finishes** | Games ending at Rep 10 |

### Leaderboard Format

```
╔══════════════════════════════════════════════════════════════════════════════╗
║                         HOUSE OF TIDE - BOT LEADERBOARD                      ║
╠═══════════════╦══════════╦══════════╦════════════╦════════════╦══════════════╣
║     BOT       ║  GAMES   ║  WINS    ║ AVG MARKS  ║ AVG REP    ║  GENERATIONS ║
═══════════════╬══════════╬══════════╬════════════╬════════════╬══════════════╣
║ 🦁 Lion       ║    50    ║   12%    ║   1,240    ║   6.2      ║     2.1      ║
║ 🐺 Wolf           50    ║   18%    ║     980    ║   7.4      ║     2.8      ║
║ 🐰 Rabbit         50    ║   22%    ║     650    ║   5.8      ║     3.2      ║
║ 🦉 Owl        ║    50    ║   25%    ║     720    ║   8.1      ║     2.9      ║
║ 🐉 Dragon     ║    50    ║   15%    ║   1,580    ║   4.9      ║     2.3      ║
║ 🦊 Fox        ║    50    ║    8%    ║   1,100    ║   5.2      ║     1.8      ║
╚═══════════════╩══════════╩══════════╩════════════╩════════════╩══════════════╝

TOP PERFORMERS:
  🏆 Highest Win Rate:    Owl (25%) - Political play survives longest
  💰 Highest Wealth:      Dragon (1,580 mk) - Mercantile focus pays off
  👑 Highest Reputation:  Owl (8.1) - Networking builds standing
  👵 Longest Dynasty:     Rabbit (3.2 gen) - Caution extends survival
```

### Analytics Commands

```bash
# Compare all bots
npm run bot:compare -- --bots=rabbit,lion,wolf --games=20

# Generate balance report
npm run bot:balance-report

# Export stats to CSV
npm run bot:export -- --format=csv --output=bot-stats.csv

# Visualize results (opens browser)
npm run bot:viz
```

### Game Balance Insights

The leaderboard reveals balance issues:

| Pattern | Indicates | Fix |
|---------|-----------|-----|
| One bot wins >50% more | Dominant strategy | Nerf that playstyle |
| All bots lose early | Too hard | Reduce early difficulty |
| All bots coast forever | Too easy | Increase reputation decay |
| High variance same bot | RNG too strong | Reduce outcome randomness |
| No bot reaches Rep 10 | Endgame inaccessible | Add legendary events |

---

## Basic Commands

### 1. Launch Chrome Beta with Remote Debugging

```bash
"/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-beta-dev-profile \
  --no-first-launch \
  --no-default-browser-check
```

### 2. Open the Game

```bash
curl -s -X PUT "http://localhost:9222/json/new?file:///Users/jpaul/Desktop/house-of-tide/house-of-tide.html"
```

### 3. Verify Connection

```bash
curl -s "http://localhost:9222/json/list" | python3 -m json.tool
```

Look for the page with `"title": "House of Tide"`.

---

## Basic Commands

### Check Running Pages

```bash
curl -s "http://localhost:9222/json/list"
```

### Take a Screenshot

```bash
PAGE_ID=$(curl -s "http://localhost:9222/json/list" | python3 -c "
  import sys,json
  pages = json.load(sys.stdin)
  for p in pages:
      if 'house-of-tide' in p.get('url',''):
          print(p['id'])
          break
")
curl -s -X POST "http://localhost:9222/json/screenshot/$PAGE_ID" -o screenshot.png
open screenshot.png
```

### Reload Page (Ignore Cache)

```bash
curl -s "http://localhost:9222/json/reload/$PAGE_ID"
```

### Close Tab

```bash
curl -s -X PUT "http://localhost:9222/json/close/$PAGE_ID"
```

### Stop Debugging Session

```bash
pkill -f "Google Chrome Beta.*remote-debugging-port=9222"
rm -rf /tmp/chrome-beta-dev-profile
```

---

## Play the Game (CDP Commands)

### Start a New Game

```bash
# 1. Click "Begin the Founding"
curl -s -X POST "http://localhost:9222/json/activate/$PAGE_ID"
# Use DevTools Runtime.evaluate to click:
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{"expression": "document.querySelector(\"button:has-text(\\\"Begin the Founding\\\")\").click()"}'

# 2. Wait for name screen, fill inputs
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.getElementById(\"input-dynasty\").value = \"TestHouse\""
  }'

curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.getElementById(\"input-founder\").value = \"Tester\""
  }'

# 3. Click "Open the Ledger"
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.querySelector(\"button:has-text(\\\"Open the Ledger\\\")\").click()"
  }'

# 4. Click "Skip" onboarding
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.querySelector(\"button:has-text(\\\"Skip\\\")\").click()"
  }'
```

### Check Game State

```bash
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "JSON.stringify({marks: gs.marks, reputation: gs.reputation, ships: gs.ships, phase: gs.phase})"
  }'
```

### Make a Choice

```bash
# Click first choice button
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.querySelector(\"#choices-container button\").click()"
  }'
```

### Advance Phase

```bash
# Click Continue button
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.getElementById(\"continue-btn\").click()"
  }'
```

---

## Debug Commands

### Check Console Errors

```bash
# Via DevTools Protocol WebSocket (requires ws module)
node -e "
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:9222/devtools/page/$PAGE_ID');
ws.on('open', () => {
  ws.send(JSON.stringify({id:1,method:'Runtime.enable'}));
  ws.send(JSON.stringify({id:2,method:'Log.enable'}));
});
ws.on('message', (data) => {
  const msg = JSON.parse(data);
  if (msg.method === 'Log.entryAdded') {
    console.log('Console:', msg.params.entry);
  }
});
setTimeout(() => ws.close(), 3000);
"
```

### Get Page Title

```bash
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{"expression": "document.title"}'
```

### Check Element Visibility

```bash
curl -s -X POST "http://localhost:9222/json/execute/$PAGE_ID" \
  -H "Content-Type: application/json" \
  -d '{
    "expression": "document.querySelector(\"#screen-game.active\") !== null"
  }'
```

---

## Automation Scripts

### Full Game Flow Script

```bash
#!/bin/bash
# gameplay-test.sh - Automated full game session

set -e

CHROME="/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta"
GAME_URL="file:///Users/jpaul/Desktop/house-of-tide/house-of-tide.html"

echo "🚀 Launching Chrome Beta..."
"$CHROME" --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-beta-dev-profile &
sleep 3

echo " Opening game..."
PAGE_ID=$(curl -s -X PUT "http://localhost:9222/json/new?$GAME_URL" | python3 -c "import sys,json; print(json.load(sys.stdin)['id'])")
sleep 2

echo "📸 Taking initial screenshot..."
curl -s -X POST "http://localhost:9222/json/screenshot/$PAGE_ID" -o title-screen.png

echo "👆 Clicking 'Begin the Founding'..."
# (Add CDP execute commands here)

echo "🧪 Running gameplay tests..."
# (Add your test flow here)

echo "📸 Taking final screenshot..."
curl -s -X POST "http://localhost:9222/json/screenshot/$PAGE_ID" -o final-state.png

echo "🛑 Cleaning up..."
curl -s -X PUT "http://localhost:9222/json/close/$PAGE_ID"
pkill -f "Google Chrome Beta.*9222"

echo "✅ Done! Check title-screen.png and final-state.png"
```

### Test Isolation Script

```bash
#!/bin/bash
# clean-test.sh - Start fresh game session

# Kill any existing Chrome debugging sessions
pkill -f "Google Chrome Beta.*9222" 2>/dev/null || true
rm -rf /tmp/chrome-beta-dev-profile

# Launch fresh instance
"/Applications/Google Chrome Beta.app/Contents/MacOS/Google Chrome Beta" \
  --remote-debugging-port=9222 \
  --user-data-dir=/tmp/chrome-beta-dev-profile \
  --no-first-launch &
sleep 3

echo "✅ Clean test environment ready"
```

---

## Key Selectors Reference

| Element | Selector |
|---------|----------|
| Title screen | `#screen-title.active` |
| Begin button | `button:has-text("Begin the Founding")` |
| Dynasty input | `#input-dynasty` |
| Founder input | `#input-founder` |
| Open Ledger button | `button:has-text("Open the Ledger")` |
| Skip button | `button:has-text("Skip")` |
| Game screen | `#screen-game.active` |
| Event text | `#event-text` |
| Choice buttons | `#choices-container button` |
| Continue button | `#continue-btn` |
| Treasury | `#stat-marks` |
| Reputation | `#stat-rep` |
| Ships | `#stat-ships` |
| Phase | `#stat-phase` |

---

## Common Issues

### Port 9222 Already in Use

```bash
lsof -ti:9222 | xargs kill -9
```

### Chrome Won't Launch

```bash
# Remove old profile
rm -rf /tmp/chrome-beta-dev-profile

# Check Chrome Beta path
ls -la "/Applications/Google Chrome Beta.app/Contents/MacOS/"
```

### Page Not Responding

```bash
# Force close and reopen
curl -s -X PUT "http://localhost:9222/json/close/$PAGE_ID"
curl -s -X PUT "http://localhost:9222/json/new?file:///Users/jpaul/Desktop/house-of-tide/house-of-tide.html"
```

### CDP Commands Fail

- Ensure Chrome is fully loaded before sending commands (`sleep 2-3` after navigation)
- Check page ID is correct: `curl -s "http://localhost:9222/json/list"`
- Some commands require WebSocket, not HTTP (use `ws` module for Runtime/Log)

---

## Alternative: Playwright (Recommended for Complex Tests)

For more complex automation, use Playwright (see `tests/helpers.js`):

```bash
npm install -D @playwright/test
npx playwright test
```

Playwright provides:
- Better wait handling
- Richer assertions
- Built-in screenshot/video
- Parallel test execution

---

## Implementation Files

### Core Bot System

| File | Purpose | Status | Tests |
|------|---------|--------|-------|
| `hot-bots-core.js` | Bot personalities, decision weights | ✅ Created | 6 passing |
| `hot-bots-analyzer.js` | Choice text analysis, trait detection | ✅ Created | 8 passing |
| `hot-bots-loop.js` | Autonomous game loop | ✅ Created | 8 passing |
| `hot-bots-stats.js` | Stats tracking, localStorage | ✅ Created | 16 passing |
| `hot-bots.js` | Global API, console commands | ⏳ In Progress | - |
| `bots/leaderboard.js` | Console leaderboard, balance report | ⏳ TODO | - |
| `bots/cdp-runner.js` | Chrome automation, click handling | ⏳ TODO | - |
| `bots/simulate-runner.js` | Direct JS simulation | ⏳ TODO | - |
| `bots/logs/` | Game logs, screenshots | ⏳ TODO | - |

**Total Tests Passing:** 38 tests

### Test Files

| File | Purpose | Tests |
|------|---------|-------|
| `tests/bot-personalities.spec.js` | Bot configs + choice analyzer | 14 |
| `tests/bot-game-loop.spec.js` | Game loop integration | 8 |
| `tests/bot-stats.spec.js` | Stats persistence | 16 |

### Package.json Scripts (To be added)

```json
{
  "scripts": {
    "bot:watch": "node bots/cdp-runner.js --mode=watch",
    "bot:simulate": "node bots/simulate-runner.js",
    "bot:tournament": "node bots/tournament.js --all-bots",
    "bot:leaderboard": "node bots/leaderboard.js --view",
    "bot:compare": "node bots/compare.js",
    "bot:balance-report": "node bots/balance-report.js",
    "bot:export": "node bots/export.js",
    "bot:viz": "node bots/visualize.js"
  }
}
```

### Example Bot Usage

```javascript
// In browser console or via CDP
const HotBots = {
  // Load bot system
  async load() { /* loads hot-bots.js */ },
  
  // Play one game as specified bot
  async playAs(botName, maxTurns) {
    const bot = HotBots.getBot(botName);
    await HotBots.startNewGame();
    
    let turn = 0;
    while (turn < maxTurns && !gameOver) {
      const choices = HotBots.getAvailableChoices();
      const bestChoice = bot.choose(choices);
      await HotBots.makeChoice(bestChoice);
      turn++;
    }
    
    return HotBots.getGameResult();
  },
  
  // Simulate many games quickly
  async simulate(botName, numGames) {
    const results = [];
    for (let i = 0; i < numGames; i++) {
      results.push(await HotBots.playAs(botName, Infinity));
    }
    return HotBots.analyzeResults(results);
  }
};
```

---

## Related Files

- `tests/helpers.js` - Reusable test helpers
- `tests/begin-founding.spec.js` - Example test flow
- `check-live-site.js` - Live site verification script
- `CLAUDE.md` - MCP server and deployment info
- `hot-bots.js` - Bot personalities (to be created)
- `hot-bots-core.js` - Decision engine (to be created)
- `bots/` - Bot runners and analytics (to be created)

---

## Appendix: Game Balance Tuning Guide

### Using Bots to Detect Balance Issues

#### 1. Difficulty Spikes

```bash
npm run bot:simulate -- --bot=rabbit --games=100
```

**Look for:**
- All bots die before Year 10 → Early game too hard
- All bots reach Year 50+ easily → Late game too easy
- Sudden death spike at specific year → Check that year's events

#### 2. Dominant Strategies

```bash
npm run bot:tournament -- --games=100
```

**Look for:**
- One bot wins 2x more than others → That playstyle is OP
- One bot wins <5% → That playstyle is underpowered
- All bots similar win rates → Good balance!

#### 3. Reputation System

```bash
npm run bot:compare -- --bots=owl,rabbit --games=50
```

**Look for:**
- Owl (political) never reaches Rep 10 → Political play unrewarded
- Rabbit coasts forever at low rep → Reputation decay too weak
- Rep never drops below 3 → Not enough punishment for failures

#### 4. Economic Balance

```bash
npm run bot:export -- --format=csv | grep "marks"
```

**Look for:**
- All bots end with >2000 mk → Too easy to accumulate
- All bots go bankrupt → Economy too harsh
- Marks irrelevant to winning → Economy disconnected from victory

#### 5. Risk/Reward Ratio

```bash
npm run bot:compare -- --bots=lion,fox,rabbit --games=50
```

**Look for:**
- Lion (bold) always beats Rabbit (cautious) → Bold is OP
- Rabbit always beats Lion → Cautious is OP
- Fox (gambler) has 50%+ win rate → High risk = high reward (good!)
- Fox has <10% win rate → High risk = low reward (broken!)

### Recommended Tuning Process

1. **Baseline:** Run 100 games as each bot, record stats
2. **Identify outliers:** Which bots win too much/too little?
3. **Hypothesize:** Why is this strategy dominant/weak?
4. **Adjust:** Modify weights, costs, or outcomes in game code
5. **Re-test:** Run another 100 games, compare to baseline
6. **Iterate:** Repeat until win rates are within 10-25% range

### Target Balance (Ideal)

| Bot | Target Win Rate | Tolerance |
|-----|-----------------|-----------|
| Rabbit (Cautious) | 15-20% | ±5% |
| Lion (Aggressive) | 15-20% | ±5% |
| Wolf (Balanced) | 18-22% | ±5% |
| Owl (Political) | 20-25% | ±5% |
| Dragon (Mercantile) | 15-20% | ±5% |
| Fox (Gambler) | 10-15% | ±5% |

**Note:** Some variance is expected and healthy. Perfect balance is impossible — aim for "no dominant strategy" rather than "all strategies equal."

---

**Last Updated:** March 2026
**Version:** 2.0 (with Virtual Players)
