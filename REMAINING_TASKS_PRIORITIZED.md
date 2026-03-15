# 🎯 House of Tide — Remaining Tasks & Strategic Roadmap

**Last Updated:** March 14, 2026
**Total Tasks:** 52 (8 new strategic additions)
**Project Completion:** 58% (73/126 tasks)
**Next Milestone:** v1.1 — Port System (2-3 weeks)

---

## 📜 Design Philosophy Reminder

> "The AI is the Dungeon Master. The code is the campaign notes."
> — house-of-tide-design.md

**Every task below must serve this principle.** If a feature doesn't give the AI better "campaign notes" to work with, it doesn't belong in this game.

---

## 🔴 CRITICAL (Must Do Before v1.1 Launch) — 22-26 hours

| # | Task | Time | Rationale | Goal | Dependencies |
|---|------|------|-----------|------|--------------|
| 1 | **Manual Testing Documentation** | 2 hrs | Quality assurance before players see the game | Complete testing checklist, verify all core loops work | None |
| 2 | **Port System Implementation** | 12-16 hrs | **Taipan! core mechanic** — without ports, trading is shopping, not strategy | Player chooses destination each turn; different prices, events, risks per port | AI event generation ✅ |
| 3 | **Mortality Events System** | 6-8 hrs | **Oregon Trail core tension** — death at 65 is scripted, not tense | Founder can die from events (fever, assassination, shipwreck); creates urgency | Death screen ✅, Generational handoff ✅ |
| 4 | **Building/Purchase System** | 4-6 hrs | **Paravia core legacy** — buildings make dynasty tangible, not abstract | Buy warehouses, guild halls, shipyards at year-end; persist across generations | Ship market ✅ |

**Total: 24-32 hours**

**Why These Are Critical:**
- **Port System** = Makes trading a **game of strategy**, not a spreadsheet
- **Mortality Events** = Makes death **tense**, not a countdown timer
- **Buildings** = Makes legacy **visible**, not just a number

**Action:** Complete manual testing first, then implement Port System as v1.1 flagship feature.

---

## 🟡 HIGH (Should Do Post-Launch v1.1) — 10-14 hours

| # | Task | Time | Rationale | Goal | Dependencies |
|---|------|------|-----------|------|--------------|
| 5 | **CSS Naming Standardization** | 1 hr | Code maintainability — `.leg` → `.legendary`, `.hi` → `.high` | Easier onboarding, cleaner codebase | None |
| 6 | **Streaming Responses for Claude** | 4 hrs | UX improvement — players see text as it generates (currently OpenAI only) | Better perceived performance for slow AI responses | OpenAI streaming ✅ |
| 7 | **Ollama Setup Wizard** | 1 hr | Reduce friction — Ollama users struggle with setup | In-app setup guide with copy/paste commands | MLX setup UI ✅ |
| 8 | **Victory Conditions System** | 4-6 hrs | Replayability — multiple paths to "win" (political, economic, dynastic) | Different epilogues per victory type; leaderboards by category | Buildings ✅, Generational play ✅ |
| 9 | **Port-Specific AI Events** | 2-3 hrs | Integration — ports need unique event pools, not reskins | AI receives port context; generates location-specific narratives | Port System ✅, AI events ✅ |

**Total: 12-15 hours**

**Why These Are High Priority:**
- **Streaming** = Quality of life for cloud API users
- **Victory Conditions** = Gives players long-term goals beyond "more marks"
- **Port Events** = Makes ports feel **alive**, not just price modifiers

**Action:** Implement after v1.1 launch based on player feedback.

---

## 🟢 MEDIUM (Nice to Have v1.2) — 12-16 hours

| # | Task | Time | Rationale | Goal | Dependencies |
|---|------|------|-----------|------|--------------|
| 10 | **Achievement System** | 3 hrs | Player retention — milestones encourage continued play | 20-30 achievements; visible progress tracking | Statistics Dashboard ✅ |
| 11 | **Custom Sound Files** | 2 hrs | Polish — current SFX system uses silent placeholders | Ambient harbour sounds, click feedback, event stingers | SFX system ✅ |
| 12 | **Skill System** | 6-8 hrs | RPG progression — founder develops unique strengths over time | Skills: Negotiation, Seamanship, Politics, Intrigue; affect events | AI event generation ✅ |
| 13 | **Heir Marriage/Alliance System** | 3-4 hrs | Paravia inspiration — marriages create political bonds | Heir can marry into rival families; changes relationships | Heir traits ✅, Rival system ✅ |
| 14 | **Regional Commodity Specialization** | 2-3 hrs | Economic depth — some ports produce/consume specific goods | Verantia: alum market; Northern: salt fish; Caldera: wine | Port System ✅ |

**Total: 16-20 hours**

**Why These Are Medium Priority:**
- **Skills** = Adds RPG depth, but may overcomplicate current design
- **Marriage** = Strong Paravia mechanic, but requires heir UI overhaul
- **Specialization** = Makes ports more distinct, but needs balance testing

**Action:** Implement if v1.1 receives positive player feedback.

---

## ⚪ LOW (Optional / Future Consideration) — 8-10 hours

### Code Quality Improvements

| # | Task | Time | Rationale | Goal |
|---|------|------|-----------|------|
| 15 | Event ID Constants | 45 min | Code clarity — replace magic strings `'h01'`, `'r10'` with constants | `EVENT_IDS.HOUSE_01` instead of `'h01'` |
| 16 | State Manager Wrapper | 2 hrs | Encapsulation — wrap direct `gs.` access in getters/setters | Better debugging, change tracking |
| 17 | Unit Test Expansion | 3 hrs | Test coverage — Playwright tests at 100%, but no unit tests for pure functions | Test helpers: `getSeason()`, `getCargoSummary()`, etc. |

### Accessibility & UX

| # | Task | Time | Rationale | Goal |
|---|------|------|-----------|------|
| 18 | ARIA Label Audit | 1 hr | Accessibility — verify all buttons have descriptive labels | Screen reader compatibility |
| 19 | Color Blind Mode | 2 hrs | Accessibility — current red/green profit indicators | Alternative indicators (shapes, patterns) |
| 20 | Mobile Touch Optimization | 3 hrs | Mobile UX — current design is desktop-first | Larger buttons, swipe navigation |

### Additional Features

| # | Task | Time | Rationale | Goal |
|---|------|------|-----------|------|
| 21 | Additional Easy Mode Features | 5+ hrs | Accessibility — easier difficulty for new players | Optional: lower loan rates, higher starting marks |
| 22 | Dynasty History Viewer | 2-3 hrs | Legacy tracking — view all past generations in one screen | Timeline view: Gen I → Gen II → Gen III |
| 23 | Export/Import Save Files | 1 hr | Quality of life — share saves, backup progress | JSON export/import functionality |

**Total: 19-21 hours**

**Action:** Implement based on community requests or contributor interest.

---

## 📋 RECOMMENDED ORDER — Phased Rollout

---

### **Phase 1: Pre-Launch Testing (2 hours)** — DO THIS WEEK ✅

```
□ Manual Testing Documentation (2 hrs)
```

**Goal:** Ensure quality before players see the game.

**Deliverable:** Testing checklist document with pass/fail criteria.

---

### **Phase 2: v1.1 — Port System Update (24-32 hours)** — 2-3 WEEKS

```
□ Port System Implementation (12-16 hrs)
□ Mortality Events System (6-8 hrs)
□ Building/Purchase System (4-6 hrs)
□ Port-Specific AI Events (2-3 hrs)
```

**Goal:** Transform trading from spreadsheet to **strategic adventure**.

**Deliverable:** v1.1 release with ports, mortality, buildings.

**Marketing Hook:** *"The map is no longer abstract. Choose your destination. Build your legacy. Survive the journey."*

---

### **Phase 3: v1.2 — Polish & Engagement (12-15 hours)** — 1 MONTH POST-LAUNCH

```
□ CSS Naming Standardization (1 hr)
□ Streaming Responses for Claude (4 hrs)
□ Ollama Setup Wizard (1 hr)
□ Victory Conditions System (4-6 hrs)
□ Achievement System (3 hrs)
```

**Goal:** Improve UX and player retention based on feedback.

**Deliverable:** v1.2 release with achievements, victory types, streaming.

---

### **Phase 4: v1.3 — Depth & Expansion (16-20 hours)** — 2-3 MONTHS POST-LAUNCH

```
□ Skill System (6-8 hrs)
□ Heir Marriage/Alliance System (3-4 hrs)
□ Regional Commodity Specialization (2-3 hrs)
□ Custom Sound Files (2 hrs)
□ Dynasty History Viewer (2-3 hrs)
```

**Goal:** Add RPG depth and dynasty tracking for long-term players.

**Deliverable:** v1.3 release with skills, marriage, specialization.

---

### **Phase 5: Community & Accessibility (19-21 hours)** — ONGOING

```
□ Event ID Constants (45 min)
□ State Manager Wrapper (2 hrs)
□ Unit Test Expansion (3 hrs)
□ ARIA Label Audit (1 hr)
□ Color Blind Mode (2 hrs)
□ Mobile Touch Optimization (3 hrs)
□ Additional Easy Mode Features (5+ hrs)
□ Export/Import Save Files (1 hr)
```

**Goal:** Community-driven improvements and accessibility.

**Deliverable:** Ongoing patches based on feedback.

---

## 🎯 STRATEGIC RATIONALE

### Why Port System Is #1 Priority

**Current State:**
```
Player: "I want to trade wine."
Game: "You traded wine. +50 mk."
```

**With Ports:**
```
Player: "Do I risk the Northern route for cheap salt fish, or play it safe in Verantia?"
Game: "The Northern passage is closed until Spring. Li Yuen's agents watch Caldera. 
       The Borracchi control Verantia's warehouses. Where does your ship sail?"
```

**Impact:**
- ✅ **Geographic strategy** — player has **where**, not just **what**
- ✅ **Rival territory** — Borracchi in Verantia, Li Yuen in Caldera
- ✅ **Seasonal locks** — Northern passage closes in Winter
- ✅ **AI narrative hooks** — "You chose Caldera. Li Yuen remembers."

**This is the difference between a **trading game** and a **world**.**

---

### Why Mortality Events Beat "Death at 65"

**Current:**
```
Age 28 → 29 → 30 → ... → 64 → 65 → "You died of old age."
```

**With Mortality Events:**
```
Age 34 → Fever event → "Pay 200 mk for treatment or risk death?"
Age 37 → Assassination → "Hire guards or investigate?"
Age 41 → Shipwreck → "Your flagship never arrived."
Age 45 → "You died at 45. The ledger passes to your heir, age 24."
```

**Impact:**
- ✅ **Tension** — death is possible, not guaranteed
- ✅ **Meaningful choices** — "Do I spend marks on safety or growth?"
- ✅ **Early handoffs** — some dynasties last 4 gens, some last 1
- ✅ **AI narrative gold** — "The fever took you. The ledger notes: he was 45. Too young."

**This is the difference between a **countdown** and a **risk**.**

---

### Why Buildings Beat "More Marks"

**Current:**
```
Year 1: 800 mk
Year 10: 3,000 mk
Year 20: 8,000 mk
Death: "You left 8,000 mk."
```

**With Buildings:**
```
Year 1: 800 mk, no buildings
Year 5: 1,200 mk, bought Warehouse (+20% cargo)
Year 10: 2,500 mk, bought Guild Hall (+1 rep/year)
Year 15: 4,000 mk, bought Shipyard (-10% ship cost)
Death: "You left the House of Tide: Warehouse, Guild Hall, Shipyard. 
        The palazzo's west wing still leaks. The ledger is full."
```

**Impact:**
- ✅ **Tangible legacy** — buildings persist across generations
- ✅ **Visual progression** — status bar shows "Warehouse, Guild Hall"
- ✅ **Strategic choices** — "Do I buy a ship or a warehouse?"
- ✅ **AI narrative hooks** — "The Guild Hall remembers who built it."

**This is the difference between a **score** and a **legacy**.**

---

## 📊 Success Metrics

| Metric | Current | Target (v1.1) | Target (v1.3) |
|--------|---------|---------------|---------------|
| Avg. Session Length | 15 min | 25 min | 35 min |
| Sessions Per Player | 3-5 | 8-12 | 15-20 |
| Generations Per House | 2-3 | 3-5 | 5-8 |
| Player Retention (7-day) | ~20% | ~40% | ~60% |
| Port Usage Variety | N/A | All 4 ports used | Strategic port specialization |

---

## 🎮 Inspiration Alignment Check

| Inspiration | Current Alignment | After v1.1 | After v1.3 |
|-------------|-------------------|------------|------------|
| **Taipan!** | 40% (trading exists) | 80% (ports + strategy) | 90% (specialization) |
| **Paravia** | 60% (generations) | 75% (buildings) | 90% (marriage, victory) |
| **Oregon Trail** | 50% (events) | 85% (mortality) | 85% (skills would help) |
| **Overall** | 50% | 80% | 88% |

---

## 📝 Notes from Development Session

**Key Decisions Made:**
1. ✅ AI-generated market events (not hardcoded)
2. ✅ Max Buy / Sell All buttons added
3. ✅ Cost basis tracking for profit/loss
4. ✅ Price trend arrows (↑↓→)
5. ✅ Tutorial hints for first-time traders
6. ✅ Background visible (40% opacity, grayscale)
7. ✅ Status bar fixed to top (no gap)

**Design Principles Confirmed:**
- AI is Dungeon Master, not JSON generator
- Events must build on threads, rivals, history
- Hardcoded stories violate the design
- Player agency must feel real
- Consequences must be legible

**Files Created:**
- `TRADING_AI_DESIGN.md` — AI market event rationale
- `tests/ai-market-events.spec.js` — 11 Playwright tests

---

## 🚀 Next Actions

**This Week:**
1. Run manual testing checklist
2. Document any bugs found
3. Fix critical issues

**Next 2-3 Weeks:**
1. Implement Port System (12-16 hrs)
2. Implement Mortality Events (6-8 hrs)
3. Implement Building System (4-6 hrs)
4. Test and deploy v1.1

**Post-Launch:**
1. Gather player feedback
2. Prioritize v1.2 features
3. Community engagement

---

**The ledger is open. The sea is waiting. The map is drawn.**

**Turn the page.** ⚓
