# 🚀 Resume Work Here

**Last Updated:** March 20, 2026
**Current Session:** Bot Tier 1 MVP — 4/8 tasks complete (50%)
**Worktree:** `.worktrees/bot-tier1-mvp/` (branch: `feature/bot-tier1-mvp`)

---

## ⭐ **START HERE: Bot Tier 1 MVP** (8-9 hours)

**Priority:** HIGH — This is the highest-leverage work you can do

**Why First:**
- Bots find game balance issues in minutes, not weeks
- Automated testing = faster iteration
- Watching Rabbit vs Lion is instant fun
- Foundation for all future bot features

---

## 📊 **Progress Summary**

| Task | File | Status | Tests |
|------|------|--------|-------|
| 1. Bot Personality Engine | `hot-bots-core.js` | ✅ Complete | 6 passing |
| 2. Choice Analyzer | `hot-bots-analyzer.js` | ✅ Complete | 8 passing |
| 3. Bot Game Loop | `hot-bots-loop.js` | ✅ Complete | 8 passing |
| 4. Stats Tracking | `hot-bots-stats.js` | ✅ Complete | 16 passing |
| 5. Global Bot API | `hot-bots.js` | ⏳ In Progress | - |
| 6. Console Leaderboard | `bots/leaderboard.js` | ⏳ TODO | - |
| 7. Package.json Scripts | `package.json` | ⏳ TODO | - |
| 8. Integration Test | `tests/bot-integration.spec.js` | ⏳ TODO | - |

**Total:** 38 tests passing across 4 modules

---

## 📋 **Remaining Tasks (4)**

| # | Task | Time | File | Done |
|---|------|------|------|------|
| 5 | Global Bot API | 30 min | `hot-bots.js` | ☐ |
| 6 | Console Leaderboard | 1 hr | `bots/leaderboard.js` | ☐ |
| 7 | Package.json Scripts | 15 min | `package.json` | ☐ |
| 8 | Integration Test | 1 hr | `tests/bot-integration.spec.js` | ☐ |

---

## 🎯 **End Goal**

```javascript
// In browser console:
await HotBots.simulate('rabbit', 50); // Play 50 games as Rabbit
await HotBots.simulate('lion', 50);   // Play 50 games as Lion
HotBots.leaderboard();                 // See win rates
```

**Expected Output:**
```
╔════════════════════════════════════════╗
║     BOT       ║  GAMES  ║  WIN RATE    ║
╠═══════════════╬═════════╬══════════════╣
║ 🦁 Lion       ║    50   ║     8%       ║
║ 🐰 Rabbit     ║    50   ║    24%       ║
║ 🐺 Wolf       ║    50   ║    18%       ║
╚════════════════════════════════════════╝
```

---

## 📁 **Files to Create**

### 1. `hot-bots-core.js` (2.5 hrs)
```javascript
// Bot personality configs
const BOTS = {
  rabbit: { name: 'Rebecca', weights: { bold: 0.1, cautious: 0.5, political: 0.2, mercantile: 0.1, patient: 0.1 } },
  lion:   { name: 'Lucy',    weights: { bold: 0.5, cautious: 0.1, political: 0.1, mercantile: 0.2, patient: 0.1 } },
  wolf:   { name: 'Winnie',  weights: { bold: 0.2, cautious: 0.2, political: 0.2, mercantile: 0.2, patient: 0.2 } },
  owl:    { name: 'Sage',    weights: { bold: 0.1, cautious: 0.2, political: 0.4, mercantile: 0.1, patient: 0.2 } },
  dragon: { name: 'Midas',   weights: { bold: 0.1, cautious: 0.3, political: 0.1, mercantile: 0.4, patient: 0.1 } },
  fox:    { name: 'Gambler', weights: { bold: 0.4, cautious: 0.05, political: 0.1, mercantile: 0.15, patient: 0.3 } }
};

// Score a choice based on bot personality
function scoreChoice(bot, choiceText) {
  // Analyze choice for bold/cautious/political/mercantile/patient signals
  // Return score based on bot's weights
}
```

### 2. `hot-bots-analyzer.js` (1 hr)
```javascript
// Parse choice text for personality signals
function analyzeChoice(choiceText) {
  const lower = choiceText.toLowerCase();
  return {
    isBold: /\b(commission|dispatch|accept|send|buy|challenge)\b/.test(lower),
    isCautious: /\b(wait|decline|nothing|later|find out|observe)\b/.test(lower),
    isPolitical: /\b(negotiate|write|letter|council|alliance)\b/.test(lower),
    isMercantile: /\b(fee|rate|price|marks|profit|contract)\b/.test(lower),
    isPatient: /\b(another season|not yet|hold|watch)\b/.test(lower)
  };
}
```

### 3. `hot-bots-loop.js` (2 hrs)
```javascript
// Autonomous game loop
async function playTurn(bot) {
  const choices = getAvailableChoices(); // From #choices-container
  const scores = choices.map(c => ({ choice: c, score: scoreChoice(bot, c) }));
  const best = scores.reduce((a, b) => a.score > b.score ? a : b);
  await makeChoice(best.choice, false); // Call existing game function
}

async function playGame(bot, maxTurns = Infinity) {
  await startNewGame(); // Existing test helper
  let turn = 0;
  while (turn < maxTurns && !gameOver) {
    await playTurn(bot);
    turn++;
  }
  return getGameResult(); // { marks, rep, generations, causeOfDeath }
}
```

### 4. `hot-bots.js` (30 min)
```javascript
// Global API
window.HotBots = {
  async simulate(botName, numGames) {
    const bot = BOTS[botName];
    const results = [];
    for (let i = 0; i < numGames; i++) {
      results.push(await playGame(bot));
    }
    return analyzeResults(results);
  },
  
  leaderboard() {
    // Display stats from localStorage
  }
};
```

### 5. `hot-bots-stats.js` (1 hr)
```javascript
// Track game outcomes
function recordResult(botName, result) {
  const stats = JSON.parse(localStorage.getItem('bot-stats') || '{}');
  if (!stats[botName]) stats[botName] = { games: 0, wins: 0, totalMarks: 0, totalRep: 0 };
  stats[botName].games++;
  stats[botName].totalMarks += result.marks;
  stats[botName].totalRep += result.rep;
  if (result.victory) stats[botName].wins++;
  localStorage.setItem('bot-stats', JSON.stringify(stats));
}
```

### 6. `bots/leaderboard.js` (2 hrs)
```javascript
// Console leaderboard + balance report
function showLeaderboard() {
  const stats = JSON.parse(localStorage.getItem('bot-stats') || '{}');
  // Format as ASCII table
}

function balanceReport() {
  // Detect OP strategies, difficulty issues
}
```

---

## 🧪 **Testing**

After implementing:
```bash
# In browser console:
await HotBots.simulate('rabbit', 10);
await HotBots.simulate('lion', 10);
HotBots.leaderboard();
```

---

## 📝 **Implementation Order**

1. **Day 1:** Personality Engine + 6 Bots (2.5 hrs)
2. **Day 2:** Choice Analyzer + Game Loop (3 hrs)
3. **Day 3:** Stats + Leaderboard + Balance (3.5 hrs)

**Total:** 8-9 hours over 3 days

---

## 🔗 **Related Docs**

- `GAMEPLAY_TESTING.md` — Full bot system documentation
- `TASK_LIST_BY_VERSION.md` — Complete task list
- `FUTURE_VERSIONS.md` — Long-term roadmap
- `tests/helpers.js` — Existing test helpers (reuse `startNewGame()`, etc.)

---

## ✅ **After Completion**

You'll be able to:
- Run 100 games in minutes
- See which bot strategies win most
- Detect if "bold" play is overpowered
- Find difficulty spikes
- Generate gameplay screenshots automatically

**Next Steps:**
- Tier 2: Watch Mode (watch bots play in browser)
- Tier 3: Tournament (championships)
- Tier 4: Bot Houses (AI rivals in single-player)

---

## 🔧 **Session Handoff Notes**

**Worktree Location:** `/Users/jpaul/Desktop/house-of-tide/.worktrees/bot-tier1-mvp/`

**Branch:** `feature/bot-tier1-mvp`

**Completed Files (in worktree):**
- `hot-bots-core.js` - 6 bot personalities, scoring logic
- `hot-bots-analyzer.js` - Choice trait detection with regex
- `hot-bots-loop.js` - Autonomous game loop
- `hot-bots-stats.js` - localStorage persistence

**Test Files:**
- `tests/bot-personalities.spec.js` - 14 tests (personality + analyzer)
- `tests/bot-game-loop.spec.js` - 8 tests
- `tests/bot-stats.spec.js` - 16 tests

**To Resume:**
```bash
cd .worktrees/bot-tier1-mvp
git checkout feature/bot-tier1-mvp
# Continue with Task 5: hot-bots.js
```

**Next Command to Run:**
```bash
# Implement Task 5: Global Bot API
# Create hot-bots.js with window.HotBots global
```

---

**Good luck! Start with `hot-bots-core.js`.** 🐰🦁🐺
