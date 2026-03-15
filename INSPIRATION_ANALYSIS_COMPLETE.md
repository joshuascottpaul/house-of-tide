# 🎮 House of Tide — Comprehensive Inspiration Analysis

**Last Updated:** March 14, 2026
**Project Status:** 58% complete (73/126 tasks)
**Design Philosophy:** "The AI is the Dungeon Master. The code is the campaign notes."

---

## 📜 Executive Summary

This document provides **two complementary analyses** of House of Tide against its three primary inspirations:

1. **Letter Analysis** — Feature-by-feature comparison (what the games HAVE)
2. **Spirit Analysis** — Emotional/experiential comparison (what the games FEEL like)

**Key Insight:** The Letter analysis suggests adding ports, buildings, and mortality events. The Spirit analysis reveals the deeper gaps: named relationships, tangible safety markers, and legacy you can point to.

**Recommendation:** Implement BOTH sets of features — Letter features provide strategic depth, Spirit features provide emotional resonance.

---

# PART I: LETTER ANALYSIS (Feature Comparison)

## What Each Game HAS — Feature by Feature

---

## 🏆 Taipan! (1982)

### Core Features

| Feature | Taipan! | House of Tide | Gap | Priority |
|---------|---------|---------------|-----|----------|
| Multiple ports with different prices | ✅ 4-5 ports | ❌ Single "market" | 🔴 Critical | HIGH |
| Commodities with supply/demand | ✅ 5 goods | ✅ 4 goods | ✅ OK | — |
| Fleet expansion (buy ships) | ✅ Buy ships | ✅ Ship market | ✅ Done | — |
| Combat/pirates | ✅ Fight/flee | ❌ Events only | 🟡 Medium | MEDIUM |
| Loan/shark mechanics | ✅ Money lender | ✅ Bank + Shadow | ✅ Done | — |
| Warehouse system | ✅ Buy/sell storage | ❌ No buildings | 🟡 Medium | MEDIUM |
| Cannons/defense | ✅ 0-48 cannons | ❌ No defense | 🟡 Medium | MEDIUM |
| Clear profit/loss tracking | ✅ Ledger | ✅ Cost basis | ✅ Done | — |
| Rank progression | ✅ Coolie → Taipan | ⚠️ Rep tiers only | 🟡 Medium | LOW |

**Letter Alignment: 40%** (4/10 features)

### What Taipan! HAS that House of Tide Doesn't

1. **Geographic Strategy** — Ports have different prices, risks, opportunities
2. **Defense System** — Cannons = tangible safety meter
3. **Warehouse Economy** — Buy low, store, sell high (time arbitrage)
4. **Combat Mechanics** — Fight pirates, flee, or lose cargo
5. **Rank System** — Visible progression toward "Taipan" status

---

## 🏰 Santa Paravia en Fiumaccio (1978)

### Core Features

| Feature | Paravia | House of Tide | Gap | Priority |
|---------|---------|---------------|-----|----------|
| Generational succession | ✅ Heir inherits | ✅ Full handoff | ✅ Done | — |
| Heir traits affecting gameplay | ⚠️ Basic | ✅ 8 traits | ✅ Exceeds | — |
| Building/infrastructure | ✅ Palace, walls, etc. | ❌ No buildings | 🔴 Critical | HIGH |
| Multiple resource types | ✅ Gold, grain, land | ⚠️ Marks + cargo | 🟡 Medium | MEDIUM |
| Political marriages/alliances | ✅ Marriage system | ❌ Not implemented | 🟡 Medium | MEDIUM |
| Tax/tribute systems | ✅ Set tax rates | ❌ Passive income only | 🟡 Medium | LOW |
| Multiple victory conditions | ✅ King/Queen title | ❌ Only "most marks" | 🟡 Medium | MEDIUM |
| City grows visibly | ✅ Population, buildings | ❌ Abstract | 🟡 Medium | MEDIUM |

**Letter Alignment: 60%** (5/10 features)

### What Paravia HAS that House of Tide Doesn't

1. **Tangible Buildings** — Palace, walls, cathedral — you can POINT to what you built
2. **Marriage/Alliance System** — Heir marries into rival families
3. **Multiple Resources** — Gold, grain, land, population
4. **Victory Conditions** — Become King/Queen vs. just "rich"
5. **Visible City Growth** — Population counter, building list

---

## 🐂 Oregon Trail (1971/1985)

### Core Features

| Feature | Oregon Trail | House of Tide | Gap | Priority |
|---------|--------------|---------------|-----|----------|
| Random events with consequences | ✅ Many events | ✅ AI events | ✅ Done | — |
| Resource scarcity decisions | ✅ Food, ammo, parts | ⚠️ Only cargo capacity | 🟡 Medium | MEDIUM |
| Party member deaths/sickness | ✅ 5 named people | ❌ Only founder @ 65 | 🔴 Critical | HIGH |
| Skill checks (hunt, ford, etc.) | ✅ Multiple skills | ❌ No skills | 🟡 Medium | MEDIUM |
| Landmark/milestone progression | ✅ Landmarks = progress | ⚠️ Years = progress | ✅ OK | — |
| Multiple failure states | ✅ Many ways to die | ⚠️ 3 ways (bankrupt, 0 rep, 0 ships) | ✅ OK | — |
| "You have died of dysentery" | ✅ Iconic death messages | ⚠️ Generic death screen | 🟡 Medium | LOW |
| Named party members | ✅ Name 4 people | ❌ NPCs have no names | 🔴 Critical | HIGH |

**Letter Alignment: 50%** (4/8 features)

### What Oregon Trail HAS that House of Tide Doesn't

1. **Named Party Members** — You NAME people before they can die
2. **Mortality Tension** — Death can happen anytime, not at 65
3. **Skill System** — Hunting, fording, mechanics
4. **Resource Management** — Food, ammunition, spare parts

---

## 📊 Letter Analysis Summary

| Game | Alignment | Missing Features | Priority Fixes |
|------|-----------|------------------|----------------|
| **Taipan!** | 40% | Ports, cannons, warehouses, combat | Port System, Defense |
| **Paravia** | 60% | Buildings, marriage, victory conditions | Buildings, Marriage |
| **Oregon Trail** | 50% | Named party, mortality tension, skills | Named NPCs, Mortality |
| **OVERALL** | **50%** | 10 major features | 5 priority fixes |

---

## 🎯 Letter-Based Recommendations

### 🔴 CRITICAL (v1.1 — 24-32 hours)

| Task | Time | Features Added | Inspiration Served |
|------|------|----------------|-------------------|
| **Port System** | 12-16 hrs | 4 ports, different prices, travel risks | Taipan! #1 gap |
| **Mortality Events** | 6-8 hrs | Early death, named NPC death | Oregon Trail #1 gap |
| **Building System** | 4-6 hrs | Warehouse, guild hall, shipyard | Paravia #1 gap |
| **Port AI Events** | 2-3 hrs | Location-specific narratives | Integration |

### 🟡 HIGH (v1.2 — 12-15 hours)

| Task | Time | Features Added | Inspiration Served |
|------|------|----------------|-------------------|
| Combat/Pirate System | 4-6 hrs | Fight/flee, cargo loss | Taipan! combat |
| Heir Marriage | 3-4 hrs | Political alliances | Paravia marriage |
| Skill System | 4-6 hrs | Negotiation, seamanship | Oregon Trail skills |
| Victory Conditions | 4-6 hrs | Political, economic, dynastic wins | Paravia victory |

---

# PART II: SPIRIT ANALYSIS (Emotional Comparison)

## What Each Game FEELS LIKE — Experience by Experience

---

## 🏆 Taipan! (1982) — The Spirit

### Core Emotional Loop

```
VULNERABLE → LESS VULNERABLE → UNTOUCHABLE
```

**Starting State:**
- $400 cash, $5000 debt, 0 cannons
- Every decision is life-or-death
- Pirates can destroy you
- Li Yuen can extort you
- You are **prey**

**Progression:**
- Buy cannons (6 → 12 → 24 → 48)
- Buy warehouses (storage = market control)
- Pay off debt
- Become **predator**

**End State:**
- 48 cannons = immune to pirates
- 10 warehouses = control markets
- Li Yuen leaves you alone
- You are **untouchable**

### The Feeling

> "I started as prey. I became a predator. I survived."

### What Makes It Work

| Element | Emotional Function |
|---------|-------------------|
| **Cannons** | Tangible safety meter — you can SEE you're safe |
| **Warehouses** | Time arbitrage — buy now, sell later |
| **Li Yuen** | Persistent antagonist — personal, not abstract |
| **Money Lender** | Desperation mechanic — 50% interest = hope with teeth |
| **Rank** | Social proof — "Taipan" means something |

### House of Tide Spirit Alignment

**Current: 40%**

**Why:**
- ✅ You start vulnerable (800 mk, 1 ship)
- ✅ You can become powerful (10,000+ mk, 10 ships)
- ❌ No TANGIBLE safety meter (reputation is abstract)
- ❌ No persistent antagonist (Borracchi are events, not characters)
- ❌ No "I am safe now" moment

**The Gap:** Taipan! has **cannons** — you can count them. House of Tide has **reputation** — you can't touch it.

---

## 🏰 Santa Paravia (1978) — The Spirit

### Core Emotional Loop

```
BUILD → DIE → HEIR INHERITS → BUILD MORE → DIE AGAIN
```

**Starting State:**
- Small city-state, modest treasury
- You have 40 years to build
- Every decision affects the city

**Progression:**
- Build palace, walls, cathedral
- City grows (population counter ticks up)
- You age (40 → 50 → 60 → 65)

**Death:**
- You die at 65 (always)
- Heir inherits EVERYTHING
- The CITY persists — buildings, debt, alliances

**Next Generation:**
- Heir continues building
- Your palace is still there
- Your debt is still there
- Your legacy is **tangible**

### The Feeling

> "I built something. It will outlast me. Or it won't."

### What Makes It Work

| Element | Emotional Function |
|---------|-------------------|
| **Buildings** | You can POINT to what you built |
| **Population** | Visible growth — your work matters |
| **Death at 65** | Finite time = urgency |
| **Heir** | Your work continues (or collapses) |
| **City Screen** | Visual proof of legacy |

### House of Tide Spirit Alignment

**Current: 60%**

**Why:**
- ✅ Generational handoff works perfectly
- ✅ Heir inherits everything (ships, debts, rep, enemies)
- ✅ Death at 65 creates arc
- ❌ No BUILDINGS — no "I built that" moment
- ❌ No VISUAL legacy — just numbers in ledger
- ❌ No CITY — no persistent place

**The Gap:** Paravia has a **city** — you can see what you built. House of Tide has a **ledger** — you can read what you did.

---

## 🐂 Oregon Trail (1971/1985) — The Spirit

### Core Emotional Loop

```
NAME → LOVE → LOSE → GRIEVE
```

**Starting State:**
- Name 4 party members (John, Mary, Sam, Beth)
- Buy supplies
- Begin journey

**Progression:**
- John gets sick (cholera)
- Mary drowns (river crossing)
- Sam breaks leg (accident)
- You make choices (rest? push on? doctor?)

**Loss:**
- "John died of cholera."
- You NAMED him.
- You FEEL it.

**End:**
- Some survive, some don't
- 2,000 miles later, you count the living
- You remember the dead **by name**

### The Feeling

> "I cared about them. I couldn't save them all."

### What Makes It Work

| Element | Emotional Function |
|---------|-------------------|
| **Naming** | You invest before you lose |
| **Random Death** | Tension — anyone can die anytime |
| **Specific Causes** | "Drowned at Snake River" — not "died" |
| **Party Roles** | Hunter, mechanic — people, not stats |
| **Memorial** | "Here lies Mary. 1848." — closure |

### House of Tide Spirit Alignment

**Current: 40%**

**Why:**
- ❌ No named party members (Casso, Pell are functions, not people)
- ❌ Death is SCRIPTED at 65 — no tension
- ❌ No grief — founder dies, heir continues, no one cries
- ❌ No "I failed them" moment

**The Gap:** Oregon Trail makes you **love before you lose**. House of Tide makes you **lose before you love**.

---

## 📊 Spirit Analysis Summary

| Game | Core Feeling | Current Alignment | Primary Gap |
|------|--------------|-------------------|-------------|
| **Taipan!** | "I became untouchable" | 40% | No tangible safety meter |
| **Paravia** | "I built something lasting" | 60% | No tangible buildings |
| **Oregon Trail** | "I loved then lost" | 40% | No named relationships |
| **OVERALL** | **47%** | 3 emotional gaps | Need names, buildings, safety |

---

## 🎯 Spirit-Based Recommendations

### 🔴 CRITICAL (v1.1 — 14-20 hours)

| Task | Time | Emotional Function | Inspiration Served |
|------|------|-------------------|-------------------|
| **Named NPCs** | 6-8 hrs | Make player CARE before losing | Oregon Trail |
| **Security Markers** | 4-6 hrs | Make safety VISIBLE | Taipan! |
| **House Improvements** | 4-6 hrs | Make legacy TANGIBLE | Paravia |

### 🟡 HIGH (v1.2 — 10-14 hours)

| Task | Time | Emotional Function | Inspiration Served |
|------|------|-------------------|-------------------|
| **Mortality Tension** | 3-4 hrs | Death can happen anytime | Oregon Trail |
| **Persistent Rivals** | 4-6 hrs | Personal antagonist | Taipan! (Li Yuen) |
| **Dynasty Visuals** | 3-4 hrs | See your legacy grow | Paravia |

---

# PART III: COMBINED RECOMMENDATIONS

## Unified Priority List (Letter + Spirit)

### 🔴 CRITICAL (v1.1 Launch — 24-32 hours)

| # | Task | Time | Letter | Spirit | Why |
|---|------|------|--------|--------|-----|
| 1 | **Port System** | 12-16 hrs | ✅ Taipan! #1 | ⚠️ Partial | Trading becomes STRATEGY |
| 2 | **Named NPCs** | 6-8 hrs | ✅ Oregon Trail #1 | ✅ Oregon Trail | Player FEELS loss |
| 3 | **Mortality Events** | 6-8 hrs | ✅ Oregon Trail #2 | ✅ Oregon Trail | Death has TENSION |
| 4 | **Building System** | 4-6 hrs | ✅ Paravia #1 | ✅ Paravia | Legacy is TANGIBLE |

**Total: 28-38 hours**

---

### 🟡 HIGH (v1.2 Post-Launch — 14-20 hours)

| # | Task | Time | Letter | Spirit | Why |
|---|------|------|--------|--------|-----|
| 5 | **Security Markers** | 4-6 hrs | ✅ Taipan! #2 | ✅ Taipan! | Safety is VISIBLE |
| 6 | **Persistent Rivals** | 4-6 hrs | ✅ Taipan! #3 | ✅ Taipan! | Antagonist is PERSONAL |
| 7 | **Heir Marriage** | 3-4 hrs | ✅ Paravia #2 | ⚠️ Partial | Alliances matter |
| 8 | **Victory Conditions** | 4-6 hrs | ✅ Paravia #3 | ⚠️ Partial | Multiple paths to win |

**Total: 15-22 hours**

---

### 🟢 MEDIUM (v1.3 Expansion — 16-20 hours)

| # | Task | Time | Letter | Spirit | Why |
|---|------|------|--------|--------|-----|
| 9 | **Skill System** | 6-8 hrs | ✅ Oregon Trail #3 | ⚠️ Partial | RPG progression |
| 10 | **Combat/Pirates** | 4-6 hrs | ✅ Taipan! #4 | ⚠️ Partial | Direct conflict |
| 11 | **Commodity Specialization** | 2-3 hrs | ✅ Taipan! #5 | ⚠️ Partial | Ports more distinct |
| 12 | **Dynasty History Viewer** | 2-3 hrs | ⚠️ Partial | ✅ Paravia | Track all generations |
| 13 | **Custom Sound Files** | 2 hrs | ⚠️ Polish | ⚠️ Polish | Immersion |

**Total: 16-22 hours**

---

## 📈 Alignment Projections

### After v1.1 (Port System + Named NPCs + Mortality + Buildings)

| Game | Current | After v1.1 | Change |
|------|---------|------------|--------|
| Taipan! (Letter) | 40% | 70% | +30% |
| Taipan! (Spirit) | 40% | 65% | +25% |
| Paravia (Letter) | 60% | 80% | +20% |
| Paravia (Spirit) | 60% | 80% | +20% |
| Oregon Trail (Letter) | 50% | 85% | +35% |
| Oregon Trail (Spirit) | 40% | 80% | +40% |
| **OVERALL** | **48%** | **77%** | **+29%** |

### After v1.2 (Security + Rivals + Marriage + Victory)

| Game | After v1.1 | After v1.2 | Change |
|------|------------|------------|--------|
| Taipan! (Letter) | 70% | 90% | +20% |
| Taipan! (Spirit) | 65% | 90% | +25% |
| Paravia (Letter) | 80% | 90% | +10% |
| Paravia (Spirit) | 80% | 85% | +5% |
| Oregon Trail (Letter) | 85% | 85% | — |
| Oregon Trail (Spirit) | 80% | 85% | +5% |
| **OVERALL** | **77%** | **88%** | **+11%** |

### After v1.3 (Skills + Combat + Specialization)

| Game | After v1.2 | After v1.3 | Change |
|------|------------|------------|--------|
| Taipan! (Letter) | 90% | 95% | +5% |
| Taipan! (Spirit) | 90% | 90% | — |
| Paravia (Letter) | 90% | 90% | — |
| Paravia (Spirit) | 85% | 90% | +5% |
| Oregon Trail (Letter) | 85% | 95% | +10% |
| Oregon Trail (Spirit) | 85% | 90% | +5% |
| **OVERALL** | **88%** | **92%** | **+4%** |

---

## 🎯 Final Recommendation

### Phase 1: v1.1 — Core Experience (28-38 hours)

**Do these 4 tasks FIRST:**

```
□ Port System (12-16 hrs) — Taipan! strategic depth
□ Named NPCs (6-8 hrs) — Oregon Trail emotional depth
□ Mortality Events (6-8 hrs) — Oregon Trail tension
□ Building System (4-6 hrs) — Paravia tangible legacy
```

**Why These 4:**
- Ports = **where** you play (geography)
- Named NPCs = **who** you play with (relationships)
- Mortality = **what** you risk (death)
- Buildings = **what** you leave behind (legacy)

**Together:** A world with places, people, stakes, and meaning.

---

### Phase 2: v1.2 — Depth & Polish (15-22 hours)

```
□ Security Markers (4-6 hrs) — Taipan! safety meter
□ Persistent Rivals (4-6 hrs) — Taipan! antagonist
□ Heir Marriage (3-4 hrs) — Paravia alliances
□ Victory Conditions (4-6 hrs) — Multiple endings
```

**Why These 4:**
- Security = visible progress toward safety
- Rivals = personal antagonist (Li Yuen equivalent)
- Marriage = political depth
- Victory = replayability

---

### Phase 3: v1.3 — Completion (16-22 hours)

```
□ Skill System (6-8 hrs) — Oregon Trail progression
□ Combat/Pirates (4-6 hrs) — Taipan! conflict
□ Specialization (2-3 hrs) — Port distinctiveness
□ Dynasty Viewer (2-3 hrs) — Paravia legacy tracking
□ Custom Sounds (2 hrs) — Polish
```

**Why These:**
- Skills = RPG depth
- Combat = direct conflict
- Specialization = strategic variety
- Viewer = historical perspective
- Sounds = immersion

---

## 📊 Success Metrics

| Metric | Current | Target (v1.1) | Target (v1.3) |
|--------|---------|---------------|---------------|
| Avg. Session Length | 15 min | 30 min | 45 min |
| Sessions Per Player | 3-5 | 10-15 | 20-30 |
| Generations Per House | 2-3 | 4-6 | 6-10 |
| Player Retention (7-day) | ~20% | ~45% | ~65% |
| Emotional Impact* | N/A | "Casso died — I felt it" | "My great-grandfather built this" |

*Qualitative metric from player feedback

---

## 🎮 Design Principle Check

**Every feature must serve:** "The AI is the Dungeon Master. The code is the campaign notes."

| Feature | Does It Give AI Better Notes? | Verdict |
|---------|------------------------------|---------|
| Port System | ✅ "Player chose Caldera. Li Yuen controls it." | INCLUDE |
| Named NPCs | ✅ "Casso (bond 7) died. Player named him." | INCLUDE |
| Mortality | ✅ "Fever took John. He was 34. Too young." | INCLUDE |
| Buildings | ✅ "The warehouse your founder built still stands." | INCLUDE |
| Security | ✅ "4 guards prevented assassination." | INCLUDE |
| Rivals | ✅ "Borracchi remember. They wait." | INCLUDE |
| Skills | ⚠️ "Negotiation +2" — abstract | CONSIDER |
| Combat | ⚠️ "Pirates defeated" — generic | CONSIDER |

---

## 🚀 Next Actions

**This Week:**
1. Manual testing checklist (2 hrs)
2. Bug fixes from testing

**Next 3-4 Weeks (v1.1):**
1. Named NPCs (6-8 hrs) — **START HERE**
2. Port System (12-16 hrs)
3. Mortality Events (6-8 hrs)
4. Building System (4-6 hrs)
5. Testing & deployment

**Post-Launch (v1.2):**
1. Gather player feedback
2. Prioritize security markers vs. rivals
3. Implement based on emotional impact data

---

## 📝 Final Thoughts

**The Letter analysis says:** Add ports, buildings, mortality, combat, skills.

**The Spirit analysis says:** Add names, safety, legacy, relationships, tension.

**The Truth:** You need BOTH.

- Ports without named captains are spreadsheets.
- Names without mortality are rosters.
- Buildings without generations are monuments.
- Mortality without love is mechanics.

**House of Tide at 100%:**
- A world with **places** (ports, buildings)
- Populated by **people** (named NPCs, rivals)
- Where **choices matter** (mortality, security)
- And **legacy persists** (generations, improvements)

**The ledger is open. The sea is waiting. The map is drawn. The people are named.**

**Turn the page.** ⚓
