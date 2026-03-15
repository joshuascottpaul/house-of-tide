# 🎯 House of Tide — Remaining Tasks & Strategic Roadmap

**Last Updated:** March 14, 2026 (POST v1.1)
**Total Tasks:** 44 remaining
**Project Completion:** 77% (104/134 tasks)
**v1.1 Status:** ✅ **COMPLETE**
**Next Milestone:** v1.2 — Victory Conditions + Polish (2-3 weeks)
**Test Coverage:** 90% v1.1 features, 100% core loops

---

## 📜 Design Philosophy Reminder

> "The AI is the Dungeon Master. The code is the campaign notes."
> — house-of-tide-design.md

**Every task must serve ONE of these inspirations:**

| Game | Core Spirit | What We're Chasing |
|------|-------------|-------------------|
| **Taipan!** | "I became untouchable" | Geographic strategy, combat, safety meter |
| **Paravia** | "I built something lasting" | Marriage, victory conditions, tangible legacy |
| **Oregon Trail** | "I loved then lost" | Skills, named deaths, survival tension |

---

## ✅ v1.1 COMPLETED (All Inspirations)

| Feature | Inspiration | Status | Tests |
|---------|-------------|--------|-------|
| Named NPCs (Casso, Pell, Tucci) | Oregon Trail | ✅ Done | 8 |
| Mortality Events (AI-generated) | Oregon Trail | ✅ Done | 10 |
| Building System (6 buildings) | Paravia | ✅ Done | 10 |
| Port System (4 ports) | Taipan! | ✅ Done | 10 |
| AI Market Shocks (0.3x-3.0x) | Taipan! | ✅ Done | Included |
| Background Changes | All | ✅ Fixed | Existing |

**Alignment After v1.1:**
- Taipan!: 40% → 80% (+40%)
- Paravia: 60% → 85% (+25%)
- Oregon Trail: 40% → 85% (+45%)
- **Overall: 47% → 83% (+36%)**

---

## 🔴 CRITICAL (Pre-Launch) — 2 hours

### Oregon Trail — Tension & Survival

| # | Task | Time | Why It Matters | Status |
|---|------|------|----------------|--------|
| 1 | **Manual Testing Documentation** | 2 hrs | Quality gate before players experience mortality tension | ⏳ TODO |

**Action:** Complete manual testing, then LAUNCH.

---

## 🟡 HIGH (Post-Launch v1.2) — 16-21 hours

### Taipan! — Geographic Strategy & Combat

| # | Task | Time | Why It Matters | Alignment Gain |
|---|------|------|----------------|----------------|
| T1 | **Port-Specific AI Events** | 2-3 hrs | Ports feel alive, not just price modifiers | 80% → 85% |
| T2 | **Port Events Tests** | 2-3 hrs | Verify events feel location-specific | — |
| T3 | **Combat/Pirate System** | 6-8 hrs | Fight or flee — direct conflict, not just events | 80% → 90% |

**Total Taipan!:** 10-14 hours → **90% alignment**

---

### Paravia — Legacy & Victory

| # | Task | Time | Why It Matters | Alignment Gain |
|---|------|------|----------------|----------------|
| P1 | **Victory Conditions System** | 4-6 hrs | Multiple paths to win (political, economic, dynastic) | 85% → 90% |
| P2 | **Victory Conditions Tests** | 2-3 hrs | Verify each victory type triggers correctly | — |
| P3 | **Heir Marriage/Alliance System** | 3-4 hrs | Marry into rivals, change relationships | 85% → 90% |
| P4 | **Marriage Tests** | 2-3 hrs | Verify marriage affects rival relationships | — |

**Total Paravia:** 11-16 hours → **90% alignment**

---

### Oregon Trail — Skills & Survival

| # | Task | Time | Why It Matters | Alignment Gain |
|---|------|------|----------------|----------------|
| O1 | **Skill System** | 6-8 hrs | Founder develops unique strengths (Negotiation, Seamanship, Politics) | 85% → 90% |
| O2 | **Skill System Tests** | 3-4 hrs | Verify skills affect events, prices, survival | — |

**Total Oregon Trail:** 9-12 hours → **90% alignment**

---

### All Games — Polish & UX

| # | Task | Time | Why It Matters | Status |
|---|------|------|----------------|--------|
| U1 | **CSS Naming Standardization** | 1 hr | Code maintainability (`.leg` → `.legendary`) | ⏳ TODO |
| U2 | **Streaming Responses for Claude** | 4 hrs | Players see text as it generates (OpenAI has this) | ⏳ TODO |
| U3 | **Ollama Setup Wizard** | 1 hr | Reduce friction for local AI users | ⏳ TODO |

**Total Polish:** 6 hours

---

## 🟢 MEDIUM (v1.3) — 23-31 hours

### Taipan! — Economic Depth

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| T4 | **Regional Commodity Specialization** | 2-3 hrs | Verantia: alum market, Northern: salt fish, Caldera: wine |

---

### Paravia — Dynasty Tracking

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| P5 | **Dynasty History Viewer** | 2-3 hrs | Timeline view: Gen I → Gen II → Gen III |

---

### Oregon Trail — Retention

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| O3 | **Achievement System** | 3 hrs | 20-30 achievements; milestones encourage continued play |
| O4 | **Achievement Tests** | 2 hrs | Verify unlock conditions, UI display |
| O5 | **Custom Sound Files** | 2 hrs | Ambient harbour sounds, click feedback, event stingers |

---

### All Games — Accessibility

| # | Task | Time | Why It Matters |
|---|------|------|----------------|
| A1 | **ARIA Label Audit** | 1 hr | Screen reader compatibility |
| A2 | **Color Blind Mode** | 2 hrs | Alternative indicators (shapes, patterns) |
| A3 | **Mobile Touch Optimization** | 3 hrs | Larger buttons, swipe navigation |

---

## ⚪ LOW (Community-Driven) — 19-21 hours

### Code Quality (All Games)

| # | Task | Time | Why |
|---|------|------|-----|
| C1 | Event ID Constants | 45 min | Replace `'h01'`, `'r10'` with `EVENT_IDS.HOUSE_01` |
| C2 | State Manager Wrapper | 2 hrs | Wrap `gs.` access in getters/setters |
| C3 | Unit Test Expansion | 3 hrs | Test pure functions: `getSeason()`, `getCargoSummary()` |

---

### Additional Features (All Games)

| # | Task | Time | Why |
|---|------|------|-----|
| F1 | Easy Mode Features | 5+ hrs | Lower loan rates, higher starting marks |
| F2 | Export/Import Save Files | 1 hr | Share saves, backup progress |

---

## 📋 RECOMMENDED ORDER — By Inspiration

---

### **Phase 1: Pre-Launch (2 hours)** — DO THIS WEEK ✅

**Oregon Trail — Quality Gate**
```
□ Manual Testing Documentation (2 hrs)
```

**Goal:** Ensure mortality tension, named NPCs, and buildings work before players experience them.

---

### **Phase 2: v1.2 — Victory & Polish (16-21 hours)** — 2-3 WEEKS POST-LAUNCH

**Paravia — Multiple Win Conditions**
```
□ Victory Conditions System (4-6 hrs)
□ Victory Conditions Tests (2-3 hrs)
```

**Taipan! — Port Polish**
```
□ Port-Specific AI Events (2-3 hrs)
□ Port Events Tests (2-3 hrs)
```

**Polish — UX Improvements**
```
□ CSS Naming Standardization (1 hr)
□ Streaming for Claude (4 hrs)
□ Ollama Wizard (1 hr)
```

**Marketing Hook:** *"Multiple paths to legacy. Ports that feel alive. AI that streams."*

---

### **Phase 3: v1.3 — Depth (23-31 hours)** — 2-3 MONTHS POST-LAUNCH

**Taipan! — Combat & Specialization**
```
□ Combat/Pirate System (6-8 hrs)
□ Regional Specialization (2-3 hrs)
```

**Paravia — Marriage & Dynasty**
```
□ Heir Marriage System (3-4 hrs)
□ Marriage Tests (2-3 hrs)
□ Dynasty History Viewer (2-3 hrs)
```

**Oregon Trail — Skills & Retention**
```
□ Skill System (6-8 hrs)
□ Skill Tests (3-4 hrs)
□ Achievement System (5 hrs)
```

**Polish**
```
□ Custom Sounds (2 hrs)
□ Accessibility (6 hrs)
```

**Marketing Hook:** *"Fight pirates. Marry strategically. Build skills. Your dynasty, your way."*

---

## 🎯 ALIGNMENT PROJECTIONS

### After v1.2 (Victory + Port Events + Polish)

| Game | Current | After v1.2 | Change |
|------|---------|------------|--------|
| **Taipan!** | 80% | 85% | +5% (port events) |
| **Paravia** | 85% | 90% | +5% (victory conditions) |
| **Oregon Trail** | 85% | 85% | — (skills in v1.3) |
| **OVERALL** | **83%** | **87%** | **+4%** |

---

### After v1.3 (Combat + Marriage + Skills)

| Game | After v1.2 | After v1.3 | Change |
|------|------------|------------|--------|
| **Taipan!** | 85% | 95% | +10% (combat) |
| **Paravia** | 90% | 95% | +5% (marriage) |
| **Oregon Trail** | 85% | 95% | +10% (skills) |
| **OVERALL** | **87%** | **95%** | **+8%** |

---

## 📊 FEATURE COMPLETION BY GAME

### Taipan! (1982) — Geographic Trading & Combat

| Feature | Status | Notes |
|---------|--------|-------|
| Multiple ports | ✅ Done | 4 ports with different modifiers |
| Price arbitrage | ✅ Done | Buy low in North, sell high in Caldera |
| Fleet expansion | ✅ Done | Ship market + shipyard building |
| Loan/shark mechanics | ✅ Done | Bank + Masso shadow loans |
| **Combat/pirates** | ❌ TODO | Fight or flee mechanics |
| **Defense meter (cannons)** | ❌ TODO | Safehouse exists, but not visible |
| Warehouse system | ✅ Done | Warehouse building |
| Rank progression | ⚠️ Partial | Reputation tiers, no visual rank |

**Current: 80%** | **After Combat: 90%**

---

### Paravia (1978) — Generational Legacy

| Feature | Status | Notes |
|---------|--------|-------|
| Generational succession | ✅ Done | Full handoff system |
| Heir traits | ✅ Done | 8 traits with mechanical hooks |
| **Buildings/infrastructure** | ✅ Done | 6 buildings, persist across generations |
| **Multiple resource types** | ⚠️ Partial | Marks + cargo, no grain/land |
| **Political marriages/alliances** | ❌ TODO | Heir can marry into rivals |
| Tax/tribute systems | ⚠️ Partial | Passive fleet income only |
| **Victory conditions** | ❌ TODO | Only "die with most marks" |
| City grows visibly | ⚠️ Partial | Buildings shown, no population |

**Current: 85%** | **After Victory + Marriage: 90%**

---

### Oregon Trail (1971) — Named Mortality

| Feature | Status | Notes |
|---------|--------|-------|
| Random events with consequences | ✅ Done | AI-generated events |
| **Resource scarcity decisions** | ⚠️ Partial | Cargo capacity only |
| **Party member deaths/sickness** | ✅ Done | Named NPCs can die |
| **Skill checks (hunt, ford, etc.)** | ❌ TODO | No founder skills |
| Landmark/milestone progression | ✅ Done | Years/turns serve this role |
| Multiple failure states | ✅ Done | Bankrupt, 0 rep, 0 ships, death |
| "You have died of dysentery" | ✅ Done | Mortality events with causes |
| **Named party members** | ✅ Done | Casso, Pell, Tucci |

**Current: 85%** | **After Skills: 90%**

---

## 🚀 LAUNCH RECOMMENDATION

### LAUNCH NOW (83% alignment)

**Why:**
- All v1.1 critical features complete
- 90% test coverage on new features
- Game is playable end-to-end
- Remaining 17% are enhancements, not fixes

**Before Launch (2 hours):**
```
□ Manual Testing Documentation
```

**Post-Launch Priorities:**
1. Victory Conditions (Paravia — replayability)
2. Port-Specific AI Events (Taipan! — polish)
3. Skill System (Oregon Trail — depth)

---

## 📝 INSPIRATION-SPECIFIC NOTES

### Taipan! Players Will Ask:
- "Can I fight pirates?" → Not yet (v1.3)
- "How do I know I'm safe?" → Safehouse reduces risk, but no visible meter
- "Are ports really different?" → Yes, but AI events need port context (v1.2)

### Paravia Players Will Ask:
- "How do I win?" → Die with most marks (victory conditions in v1.2)
- "Can my heir marry?" → Not yet (v1.3)
- "Do my buildings matter?" → Yes, they persist and provide bonuses

### Oregon Trail Players Will Ask:
- "Why did they die?" → AI-generated mortality events explain cause
- "Can I get better at things?" → Not yet (skills in v1.3)
- "Do I care about NPCs?" → You should (Casso, Pell, Tucci are named)

---

**The ledger is open. The sea is waiting. The inspirations are honored.**

**Launch at 83%. Polish to 95%.** ⚓
