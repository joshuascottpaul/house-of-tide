# 🎯 House of Tide — Prioritized Task List by Version

**Last Updated:** March 20, 2026
**Current Version:** v1.4 (30% complete - 15/50 tasks)
**Next Milestone:** v1.4 Launch (35 tasks remaining)

---

## 📋 **RESUME HERE — Bot Tier 1 MVP** ⭐

**Priority:** HIGH — Start with this when resuming work

**Why:** Bots give you game balance data and automated testing. 8-9 hours to first results.

**Status:** 4/8 tasks complete (50%) — In Progress in worktree `.worktrees/bot-tier1-mvp/`

### **v1.7.1 — Tier 1: MVP** (8 tasks, 8-9 hours)

| # | Task | Time | Files | Status | Tests |
|---|------|------|-------|--------|-------|
| 1 | **Bot Personality Engine** | 2 hrs | `hot-bots-core.js` | ✅ Complete | 6 passing |
| 2 | **Six Default Bots** | 30 min | `hot-bots-core.js` | ✅ Complete | (included) |
| 3 | **Choice Analyzer** | 1 hr | `hot-bots-analyzer.js` | ✅ Complete | 8 passing |
| 4 | **Bot Game Loop** | 2 hrs | `hot-bots-loop.js` | ✅ Complete | 8 passing |
| 5 | **Console Commands** | 30 min | `hot-bots.js` | ⏳ In Progress | - |
| 6 | **Stats Tracking (Simple)** | 1 hr | `hot-bots-stats.js` | ✅ Complete | 16 passing |
| 7 | **Leaderboard (Console)** | 1 hr | `bots/leaderboard.js` | ⏳ TODO | - |
| 8 | **Balance Report (Basic)** | 1 hr | `bots/balance-report.js` | ⏳ TODO | - |

**Total Tests Passing:** 38 tests across 4 modules

**Deliverable:**
```javascript
await HotBots.simulate('rabbit', 50); // 50 games in 2 minutes
HotBots.leaderboard(); // See win rates
```

**Files Created (in worktree):**
- `hot-bots-core.js` — ✅ Personality engine, 6 bot configs with weights
- `hot-bots-analyzer.js` — ✅ Parse choice text for bold/cautious/political/mercantile/patient signals
- `hot-bots-loop.js` — ✅ Autonomous game loop with makeChoice integration
- `hot-bots-stats.js` — ✅ Track game outcomes in localStorage
- `hot-bots.js` — ⏳ Global API, console commands (IN PROGRESS)
- `bots/leaderboard.js` — ⏳ Console display, balance report (TODO)

**Test Files Created:**
- `tests/bot-personalities.spec.js` — 14 tests (personality + analyzer)
- `tests/bot-game-loop.spec.js` — 8 tests (game loop integration)
- `tests/bot-stats.spec.js` — 16 tests (stats persistence)

**Implementation Notes:**
- Bots score choices using weighted personality traits
- Rabbit: cautious 0.5, bold 0.1 | Lion: bold 0.5, cautious 0.1 | Wolf: balanced 0.2 each
- Game loop: wait for choices → bot selects → call `makeChoice()` → repeat
- Stats: track marks, rep, generations, cause of death, win/loss

**To Resume:**
```bash
cd .worktrees/bot-tier1-mvp
git status  # Should be on feature/bot-tier1-mvp branch
# Continue with Task 5: Create hot-bots.js
```

---

## Full Task List Below

---

# 🚀 **v1.4 — Feature Completion (CURRENT)**

**Progress:** 15/50 tasks complete (30%)
**Remaining:** 35 tasks, 8-11 hours

**Goal:** Reach 100% feature completion for launch

---

## **v1.4.6 — Quality of Life (4 tasks, 6-8 hours)**

### **HIGH PRIORITY (Launch Blockers)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 1 | **Achievement Notifications** | 1 hr | 🔴 HIGH | ⏳ TODO | Toast popups when achievements unlock |
| 2 | **Dynasty History Viewer** | 2-3 hrs | 🔴 HIGH | ⏳ TODO | Timeline of all generations |
| 3 | **Ollama Setup Wizard** | 1 hr | 🔴 HIGH | ⏳ TODO | Interactive setup for new users |
| 4 | **Color Blind Mode** | 2 hrs | 🟡 MEDIUM | ⏳ TODO | Alternative color schemes |

**v1.4.6 Total:** 6-8 hours

---

## **v1.4 Remaining Summary**

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| v1.4.1 Quick Wins | 4 ✅ | 2.75 hrs | ✅ Complete |
| v1.4.2 Skill Integration | 4 ✅ | 4 hrs | ✅ Complete |
| v1.4.3 Combat Improvements | 3 ✅ | 4-6 hrs | ✅ Complete |
| v1.4.4 Port Depth | 2 ✅ | 4-6 hrs | ✅ Complete |
| v1.4.5 Governance | 2 ✅ | 4-6 hrs | ✅ Complete |
| v1.4.6 Quality of Life | 4 ⏳ | 6-8 hrs | ⏳ TODO |

**v1.4 Total:** 50 tasks, 24-32 hours (15 done, 35 remaining)

---

# 🤖 **v1.7 — Bot Dynasty League (OPTIMIZED)**

**Progress:** 4/24 tasks (17%)
**Remaining:** 20 tasks, 29-33 hours

**Goal:** AI-driven bots for testing, content creation, and gameplay

**Inspiration:** Civ AI leaders, Championship leagues

**Status:** Tier 1 MVP 50% complete — In worktree `.worktrees/bot-tier1-mvp/`

---

## **v1.7.1 — Tier 1: MVP** (8 tasks, 8-9 hours) ⭐ **IN PROGRESS**

**Goal:** Bots can play, you can see who wins

| # | Task | Time | Priority | Status | Files | Tests |
|---|------|------|----------|--------|-------|-------|
| 1 | **Bot Personality Engine** | 2 hrs | 🔴 HIGH | ✅ Complete | `hot-bots-core.js` | 6 |
| 2 | **Six Default Bots** | 30 min | 🔴 HIGH | ✅ Complete | `hot-bots-core.js` | - |
| 3 | **Choice Analyzer** | 1 hr | 🔴 HIGH | ✅ Complete | `hot-bots-analyzer.js` | 8 |
| 4 | **Bot Game Loop** | 2 hrs | 🔴 HIGH | ✅ Complete | `hot-bots-loop.js` | 8 |
| 5 | **Console Commands** | 30 min | 🟡 MEDIUM | ⏳ In Progress | `hot-bots.js` | - |
| 6 | **Stats Tracking (Simple)** | 1 hr | 🟡 MEDIUM | ✅ Complete | `hot-bots-stats.js` | 16 |
| 7 | **Leaderboard (Console)** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/leaderboard.js` | - |
| 8 | **Balance Report (Basic)** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/balance-report.js` | - |

**Tier 1 Total:** 8-9 hours (4 complete, 4 remaining)
**Tests Passing:** 38 tests

**Deliverable:**
```javascript
await HotBots.simulate('rabbit', 50); // 50 games in 2 minutes
HotBots.leaderboard(); // See win rates
```

**Value:** Know if "bold" play is OP in under 10 hours.

**Worktree:** `.worktrees/bot-tier1-mvp/` (branch: `feature/bot-tier1-mvp`)

---

## **v1.7.2 — Tier 2: Watch Mode** (6 tasks, 6-7 hours)

**Goal:** Watch bots play in browser, capture evidence

| # | Task | Time | Priority | Status | Files |
|---|------|------|----------|--------|-------|
| 1 | **CDP Runner** | 2 hrs | 🔴 HIGH | ⏳ TODO | `bots/cdp-runner.js` |
| 2 | **Screenshot Capture** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/screenshot.js` |
| 3 | **CLI Commands** | 30 min | 🟡 MEDIUM | ⏳ TODO | `package.json` |
| 4 | **Log Files (JSON)** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/logger.js` |
| 5 | **Compare Mode** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/compare.js` |
| 6 | **Export (CSV)** | 30 min | 🟡 MEDIUM | ⏳ TODO | `bots/export.js` |

**Tier 2 Total:** 6-7 hours

**Cumulative:** 14-16 hours

**Deliverable:**
```bash
npm run bot:watch -- --bot=rabbit --turns=20
```

---

## **v1.7.3 — Tier 3: Tournament** (5 tasks, 6-7 hours)

**Goal:** Run championships, seasons

| # | Task | Time | Priority | Status | Files |
|---|------|------|----------|--------|-------|
| 1 | **Tournament Runner** | 2 hrs | 🔴 HIGH | ⏳ TODO | `bots/tournament.js` |
| 2 | **Scoring System** | 1 hr | 🔴 HIGH | ⏳ TODO | `bots/scoring.js` |
| 3 | **Season Tracking** | 30 min | 🟡 MEDIUM | ⏳ TODO | `bots/seasons.js` |
| 4 | **Championship UI** | 2 hrs | 🟡 MEDIUM | ⏳ TODO | `bots/championship.html` |
| 5 | **Replay System** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `bots/replay.js` |

**Tier 3 Total:** 6-7 hours

**Cumulative:** 20-23 hours

**Deliverable:**
```bash
npm run bot:tournament -- --bots=6 --games=10 --season=1
```

---

## **v1.7.4 — Tier 4: Bot Houses** (5 tasks, 9-10 hours)

**Goal:** AI houses in your single-player game

| # | Task | Time | Priority | Status | Files |
|---|------|------|----------|--------|-------|
| 1 | **AI House System** | 3 hrs | 🔴 HIGH | ⏳ TODO | `hot-houses.js` |
| 2 | **Parallel Simulation** | 2 hrs | 🔴 HIGH | ⏳ TODO | `hot-houses.js` |
| 3 | **House Status Display** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `hot-ui-houses.js` |
| 4 | **Interaction Events** | 2 hrs | 🟡 MEDIUM | ⏳ TODO | `hot-events-houses.js` |
| 5 | **Victory Conditions** | 1 hr | 🟡 MEDIUM | ⏳ TODO | `hot-victory-houses.js` |

**Tier 4 Total:** 9-10 hours

**Cumulative:** 29-33 hours

**Deliverable:** 6 AI houses compete in your single-player game

---

## **❌ Cut Features (Deferred Indefinitely)**

| Feature | Time | Why Cut |
|---------|------|---------|
| Narration Generator | 3 hrs | YouTube can wait |
| Highlight Reels | 2 hrs | Manual is fine |
| Episode Export | 2 hrs | Nice-to-have |
| Bot Profiles | 1 hr | Fluff |
| Season Finales | 3 hrs | Over-engineering |
| Bot Config Editor | 3 hrs | JSON files work |
| Bot Sharing | 2 hrs | Copy/paste configs |
| Online Leaderboard | 4 hrs | Local is enough |
| Monthly Tournaments | 2 hrs | Manual is fine |
| Bot Workshop | 3 hrs | Way too early |

**Cut Total:** ~26 hours

---

## **v1.7 Summary (Optimized)**

| Tier | Tasks | Time | Status |
|------|-------|------|--------|
| Tier 1: MVP | 8 | 8-9 hrs | ⏳ TODO |
| Tier 2: Watch | 6 | 6-7 hrs | ⏳ TODO |
| Tier 3: Tournament | 5 | 6-7 hrs | ⏳ TODO |
| Tier 4: Houses | 5 | 9-10 hrs | ⏳ TODO |
| ~~Cut~~ | ~~10~~ | ~~18-26 hrs~~ | ❌ DEFERRED |

**v1.7 Total:** 24 tasks, 29-33 hours (was 48 tasks, 56-78 hrs)

**Time Saved:** 27-45 hours

---

## **Recommended Rollout**

**Week 1: MVP (8-9 hrs)**
- Bots play autonomously
- See win rates, tune balance

**Week 2: Watch Mode (6-7 hrs)**
- Browser automation
- Export data

**Week 3: Tournament (6-7 hrs)**
- Championships
- Seasons

**Week 4: Houses (9-10 hrs)**
- Single-player integration

---

# 🎮 **v1.5 — Quality of Life & Polish**

**Progress:** 0/20 tasks complete (0%)
**Remaining:** 20 tasks, 10-15 hours

**Goal:** Polish, accessibility, and quality of life improvements

---

## **v1.5.1 — Accessibility (3 tasks, 4-5 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 1 | **ARIA Label Audit** | 1 hr | 🟡 MEDIUM | ⏳ TODO | Screen reader compatibility |
| 2 | **Easy Mode Features** | 2+ hrs | 🟢 LOW | ⏳ TODO | Lower difficulty option |
| 3 | **Export/Import Save Files** | 1 hr | 🟡 MEDIUM | ⏳ TODO | Share saves, backup progress |

**v1.5.1 Total:** 4-5 hours

---

## **v1.5.2 — UI Polish (2 tasks, 3-4 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 4 | **Tooltips Everywhere** | 2 hrs | 🟢 LOW | ⏳ TODO | Hover explanations for all stats |
| 5 | **Quick Save/Load** | 1-2 hrs | 🟢 LOW | ⏳ TODO | F5/F9 quick slots, 10 manual slots |

**v1.5.2 Total:** 3-4 hours

---

## **v1.5.3 — Performance (2 tasks, 3-4 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 6 | **Lazy Loading** | 2 hrs | 🟢 LOW | ⏳ TODO | Load modules on demand |
| 7 | **Asset Optimization** | 1-2 hrs | 🟢 LOW | ⏳ TODO | Compress images, minify CSS/JS |

**v1.5.3 Total:** 3-4 hours

---

## **v1.5 Remaining Summary**

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| v1.5.1 Accessibility | 3 ⏳ | 4-5 hrs | ⏳ TODO |
| v1.5.2 UI Polish | 2 ⏳ | 3-4 hrs | ⏳ TODO |
| v1.5.3 Performance | 2 ⏳ | 3-4 hrs | ⏳ TODO |

**v1.5 Total:** 20 tasks, 10-15 hours (0 done, 20 remaining)

---

# 🏆 **v1.6 — Endgame Content**

**Progress:** 0/15 tasks complete (0%)
**Remaining:** 15 tasks, 8-12 hours

**Goal:** Add depth for long-term players and multiple playthroughs

---

## **v1.6.1 — Multi-Heir System (1 task, 4 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 1 | **Multiple Heirs** | 4 hrs | 🟢 LOW | ⏳ TODO | 2-4 children, succession choices |

**Features:**
- Multiple children (2-4)
- Choose successor (eldest/merit/favorite)
- Sibling rivalry events
- Disinherited children become rivals

**v1.6.1 Total:** 4 hours

---

## **v1.6.2 — Rival House Campaigns (1 task, 6 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 2 | **Play as Rival Houses** | 6 hrs | 🟢 LOW | ⏳ TODO | Borracchi, Spinetta, Calmari campaigns |

**Features:**
- Play as Borracchi (start with 2000 mk, -2 rep, +2 ships)
- Play as Spinetta (start with 500 mk, +3 rep, special events)
- Play as Calmari (start with 1000 mk, +1 all skills, mysterious events)
- Each house has unique mechanics
- Different victory conditions per house
- 5-10 hour campaigns

**v1.6.2 Total:** 6 hours

---

## **v1.6.3 — War & Conflict (1 task, 4 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 3 | **War/Conflict System** | 4 hrs | 🟢 LOW | ⏳ TODO | Naval battles, capture ships |

**Features:**
- Declare war on rival houses
- Naval battles (tactical minigame)
- Capture enemy ships
- Seize trade routes
- Peace treaties and alliances
- War weariness mechanic

**v1.6.3 Total:** 4 hours

---

## **v1.6.4 — Religion System (1 task, 3 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 4 | **Religion/Cult System** | 3 hrs | 🟢 LOW | ⏳ TODO | Temples, divine favor |

**Features:**
- Build temples (new building type)
- Gain divine favor through offerings
- Divine favor bonuses (+10% all skills, -20% mortality)
- Religious quests and pilgrimages

**v1.6.4 Total:** 3 hours

---

## **v1.6.5 — Exploration (1 task, 3 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 5 | **Exploration/Discovery** | 3 hrs | 🟢 LOW | ⏳ TODO | New trade routes |

**Features:**
- Fund exploration expeditions
- Discover new trade routes (Western, Eastern, Southern)
- Map exploration progress
- First-to-discover bonuses

**v1.6.5 Total:** 3 hours

---

## **v1.6.6 — Multiplayer (1 task, 4 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 6 | **Co-op/Multiplayer** | 4 hrs | 🟢 LOW | ⏳ TODO | 2-4 player local co-op |

**Features:**
- 2-4 player local co-op
- Each player controls one aspect (Trading, Diplomacy, Combat, Governance)
- Shared dynasty, shared victory/defeat
- Turn-based between players

**v1.6.6 Total:** 4 hours

---

## **v1.6 Remaining Summary**

| Phase | Tasks | Time | Status |
|-------|-------|------|--------|
| v1.6.1 Multi-Heir | 1 ⏳ | 4 hrs | ⏳ TODO |
| v1.6.2 Rival Campaigns | 1 ⏳ | 6 hrs | ⏳ TODO |
| v1.6.3 War/Conflict | 1 ⏳ | 4 hrs | ⏳ TODO |
| v1.6.4 Religion | 1 ⏳ | 3 hrs | ⏳ TODO |
| v1.6.5 Exploration | 1 ⏳ | 3 hrs | ⏳ TODO |
| v1.6.6 Multiplayer | 1 ⏳ | 4 hrs | ⏳ TODO |

**v1.6 Total:** 15 tasks, 8-12 hours (0 done, 15 remaining)

---

# 🔧 **v2.0 — Code Quality & Dev Experience**

**Progress:** 18/20 tasks complete (90%)
**Remaining:** 2 tasks, 4-6 hours

**Goal:** Production-grade code quality and developer experience

---

## **v2.0 Remaining (2 tasks, 4-6 hours)**

| # | Task | Time | Priority | Status | Notes |
|---|------|------|----------|--------|-------|
| 1 | **Hot Module Reloading** | 3-4 hrs | 🟢 LOW | ⏳ TODO | Webpack HMR for faster dev |
| 2 | **Bundle Size Monitoring** | 1-2 hrs | 🟢 LOW | ⏳ TODO | Size budgets, analyzer |

**v2.0 Completed (18/20):**
- ✅ Centralized Logging
- ✅ State Snapshots
- ✅ Performance Monitoring
- ✅ Enhanced Test Helpers
- ✅ Test Fixtures
- ✅ Test Isolation/Reset
- ✅ Visual Regression Tests
- ✅ Debug Mode Integration
- ✅ Split hot-engine.js (6 modules)
- ✅ Magic Number Constants
- ✅ JSDoc Guide Created
- ✅ Consistent Error Format
- ✅ Selector Constants
- ✅ Coverage Reporting
- ✅ Combat Visual Improvements
- ✅ Cargo Damage from Pirates
- ✅ Pirate Reputation System
- ✅ Regional Commodity Specialization
- ✅ Port Reputation/Favor System
- ✅ Heir Education Mini-Game
- ✅ Building Upgrades

**v2.0 Total:** 20 tasks, 45-61 hours (18 done, 2 remaining)

---

# 📊 **COMPLETE TASK SUMMARY**

## **By Version**

| Version | Tasks | Complete | Remaining | Time Remaining | Status |
|---------|-------|----------|-----------|----------------|--------|
| **v1.1-v1.3** | 49 | 49 ✅ | 0 | 0 hrs | ✅ Complete |
| **v1.4** | 50 | 15 ✅ | 35 | 8-11 hrs | 🔄 In Progress |
| **v1.5** | 20 | 0 | 20 | 10-15 hrs | ⏳ TODO |
| **v1.6** | 15 | 0 | 15 | 8-12 hrs | ⏳ TODO |
| **v2.0** | 20 | 18 ✅ | 2 | 4-6 hrs | 🔄 In Progress |
| **v1.5+** | 6 | 0 | 6 | 20-30 hrs | ⏳ FUTURE |

**Grand Total:** 160 tasks, 82 done, 78 remaining, 50-74 hours remaining

---

## **By Priority**

### **🔴 HIGH (Launch Blockers)**
- Achievement Notifications (v1.4.6)
- Dynasty History Viewer (v1.4.6)
- Ollama Setup Wizard (v1.4.6)

### **🟡 MEDIUM (Post-Launch)**
- Color Blind Mode (v1.4.6)
- ARIA Label Audit (v1.5.1)
- Export/Import Saves (v1.5.1)

### **🟢 LOW (Future)**
- All v1.5 tasks (accessibility, UI polish, performance)
- All v1.6 tasks (endgame content)
- v2.0 remaining tasks (HMR, bundle monitoring)

---

# 🎯 **RECOMMENDED ROADMAP**

## **Phase 1: v1.4 Launch (8-11 hours)**
```
□ Achievement Notifications (1 hr)
□ Dynasty History Viewer (2-3 hrs)
□ Ollama Setup Wizard (1 hr)
□ Color Blind Mode (2 hrs)
□ Testing & Bug Fixes (2-3 hrs)
```

**Launch at 100% v1.4**

---

## **Phase 2: v1.5 Polish (10-15 hours)**
```
□ ARIA Label Audit (1 hr)
□ Easy Mode Features (2 hrs)
□ Export/Import Saves (1 hr)
□ Tooltips Everywhere (2 hrs)
□ Quick Save/Load (1-2 hrs)
□ Lazy Loading (2 hrs)
□ Asset Optimization (1-2 hrs)
```

**Release v1.5**

---

## **Phase 3: v1.6 Endgame (8-12 hours)**
```
□ Multi-Heir System (4 hrs)
□ Rival House Campaigns (6 hrs)
□ War/Conflict System (4 hrs)
□ Religion System (3 hrs)
□ Exploration (3 hrs)
□ Multiplayer (4 hrs)
```

**Release v1.6**

---

## **Phase 4: v2.0 Completion (4-6 hours)**
```
□ Hot Module Reloading (3-4 hrs)
□ Bundle Size Monitoring (1-2 hrs)
```

**Release v2.0 (Production-Grade)**

---

# 📈 **CI/CD IMPROVEMENTS**

## **Recommended Additions to `.github/workflows/ci-cd.yml`:**

```yaml
# Add to test job:
- name: Set test timeout
  run: echo "PLAYWRIGHT_TEST_TIMEOUT=1800000" >> $GITHUB_ENV  # 30 minutes

- name: Run tests with coverage
  run: npx playwright test --reporter=json --output=playwright-report

- name: Upload coverage report
  uses: actions/upload-artifact@v4
  with:
    name: coverage-report
    path: playwright-report/
    retention-days: 90

# Add notification job:
- name: Notify on failure
  if: failure()
  run: |
    # Add Slack/email notification here
    echo "Tests failed on ${{ github.ref }}"
```

---

# 🏁 **IMMEDIATE NEXT STEPS**

1. **Complete v1.4.6** (6-8 hours)
   - Achievement Notifications
   - Dynasty History Viewer
   - Ollama Setup Wizard
   - Color Blind Mode

2. **Test & Bug Fix** (2-3 hours)
   - Manual testing
   - Bug fixes
   - Balance adjustments

3. **Launch v1.4** at 100% completion

4. **Gather player feedback**

5. **Plan v1.5** based on feedback

---

**The ledger is open. The roadmap is clear. Choose your next task.** ⚓
