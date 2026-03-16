# 🎯 House of Tide — Future Versions Feature List

**Last Updated:** March 14, 2026  
**Current Status:** v2.0 ✅ COMPLETE (97% alignment)  
**Next:** v1.4 (24-32 hours to 100% alignment)

---

## 📋 **VERSION ROADMAP**

| Version | Focus | Tasks | Time | Status |
|---------|-------|-------|------|--------|
| **v1.4** | Feature Completion | 50 | 24-32 hrs | ⏳ TODO |
| **v1.5** | Quality of Life | 20 | 10-15 hrs | ⏳ FUTURE |
| **v1.6** | Endgame Content | 15 | 8-12 hrs | ⏳ FUTURE |

---

# 🚀 **v1.4 — Feature Completion (24-32 hours)**

**Goal:** Reach 100% inspiration alignment by completing all core gameplay features.

**Inspiration Sources:**
- Taipan! (geographic strategy, combat depth)
- Paravia (governance, legacy building)
- Oregon Trail (skill checks, survival tension)

---

## **📍 v1.4.1 — Quick Wins (2-3 hours)**

### **Cannon Display in Status Bar** (15 min)
**Inspiration:** Taipan! (defense meter)

**Feature:**
- Show cannon count next to ships in status bar
- Visual indicator: 🔫 3 cannons
- Tooltip: "Defense rating: Reduces pirate encounter chance by 6%"

**UI Location:** Status bar, next to ships count

**Code Impact:**
- `hot-ui.js` — Add cannon display to `updateStatusBar()`
- `hot-combat.js` — Already tracks `gs.cannons`

---

### **Travel Time Consequence** (1 hr)
**Inspiration:** Taipan! (port choice has cost)

**Feature:**
- Each port choice advances turn by 1
- Different travel times per port:
  - Verantia: 0 turns (home port)
  - Masso: 1 turn
  - Caldera: 1 turn
  - Northern: 2 turns (dangerous route)
- Time pressure: Events can trigger during travel

**UI Location:** Routes phase panel

**Code Impact:**
- `hot-trading.js` — Add travel time to port selection
- `hot-engine.js` — Increment turn on travel

---

### **NPC Memorial in Ledger** (30 min)
**Inspiration:** Oregon Trail (grief is legible)

**Feature:**
- When named NPC dies, special ledger entry:
  - "In Memoriam: Casso, Senior Captain. Served Gen I-II. Faithful to the end."
- Death screen lists deceased allies by name
- Optional: Memorial plaque in palazzo (visual)

**UI Location:** Ledger history, death screen

**Code Impact:**
- `hot-combat.js` — Add memorial entry on NPC death
- `hot-ui.js` — Show deceased allies on death screen

---

### **Tax Decisions at Year-End** (1 hr)
**Inspiration:** Paravia (player governs, not just collects)

**Feature:**
- Choose tax rate at year-end:
  - **Low Tax:** -1 rep/year, +10% passive income
  - **Medium Tax:** No change (default)
  - **High Tax:** +1 rep/year, -10% passive income, -1 rival relationship
- Visual feedback on choice impact

**UI Location:** Year-end panel, after settlement

**Code Impact:**
- `hot-yearend.js` — Add tax choice UI
- `hot-economy.js` — Apply tax modifiers to income

---

## **📍 v1.4.2 — Skill Integration (6-8 hours)**

### **Skill Checks in Events** (2-3 hrs)
**Inspiration:** Oregon Trail (skills matter in gameplay)

**Feature:**
- Events reference skills in choices:
  - "Use Negotiation to get better terms (DC 12)"
  - "Use Seamanship to escape pirates (DC 15)"
  - "Use Politics to call in favors (DC 10)"
  - "Use Intrigue to manipulate rivals (DC 14)"
- Success/failure affects outcome
- Visual indicator of skill bonus: "+3 Seamanship bonus"

**UI Location:** Event choices, combat panel

**Code Impact:**
- `hot-events.js` — Add skill check prompts to AI
- `hot-combat.js` — Already shows skill feedback
- `hot-constants.js` — Add skill check DCs

---

### **Negotiation Skill Feedback** (1 hr)
**Inspiration:** Oregon Trail (visible skill effects)

**Feature:**
- Show marks saved from Negotiation:
  - "Negotiation saved 50 mk on purchase"
  - Popup animation on successful negotiation
- Track total marks saved in statistics

**UI Location:** Trading panel, statistics dashboard

**Code Impact:**
- `hot-trading.js` — Calculate and show savings
- `hot-stats.js` — Track negotiation savings

---

### **Politics Skill Feedback** (1 hr)
**Inspiration:** Oregon Trail (visible skill effects)

**Feature:**
- Show reputation gains from Politics:
  - "Politics increased reputation gain by +1"
  - Popup animation on reputation increase
- Track total reputation gained in statistics

**UI Location:** Event outcomes, statistics dashboard

**Code Impact:**
- `hot-events.js` — Calculate and show bonus
- `hot-stats.js` — Track politics bonuses

---

### **Intrigue Skill Effects** (2-3 hrs)
**Inspiration:** Oregon Trail (visible skill effects)

**Feature:**
- Intrigue unlocks special options:
  - Sabotage rival ships (cost: 200 mk, risk: rep -2 if caught)
  - Spread rumors (cost: 100 mk, effect: rival relationship -1)
  - Bribe officials (cost: 300 mk, effect: rep +1)
- Success chance based on Intrigue level
- Visual feedback on success/failure

**UI Location:** Special intrigue actions panel

**Code Impact:**
- `hot-events.js` — Add intrigue event types
- `hot-ui.js` — Add intrigue action buttons

---

## **📍 v1.4.3 — Combat Improvements (4-6 hours)**

### **Combat Visual Improvements** (2-3 hrs)
**Inspiration:** Taipan! (tactical depth)

**Feature:**
- Ship icons during combat (🚢 vs 🏴‍☠️)
- Health bars for player and pirates
- Damage numbers on hits
- Tactic selection with preview:
  - "Full Broadside: +3 bonus, -2 defense"
  - "Hold Position: No bonus, +2 defense"
  - "Evasive: -2 offense, +4 defense"

**UI Location:** Combat panel

**Code Impact:**
- `hot-combat.js` — Add visual elements
- `hot-game.css` — Combat-specific styles

---

### **Cargo Damage from Pirates** (30 min)
**Inspiration:** Taipan! (tangible stakes)

**Feature:**
- Losing combat destroys 20-50% of cargo
- Visual feedback: "Pirates destroyed 30 units of salt fish"
- Cargo insurance option (late-game building benefit)

**UI Location:** Combat result panel

**Code Impact:**
- `hot-combat.js` — Calculate cargo loss
- `hot-trading.js` — Apply cargo loss

---

### **Pirate Reputation System** (2-3 hrs)
**Inspiration:** Taipan! (consequences matter)

**Feature:**
- Pirate reputation tracked separately:
  - **Feared:** Pirates avoid you (-50% encounters)
  - **Known:** Normal encounter rate
  - **Prey:** Pirates target you (+50% encounters, +20% strength)
- Actions affect pirate rep:
  - Defeat pirates → more feared
  - Pay tribute → become prey
  - Flee successfully → no change

**UI Location:** Status bar tooltip, combat panel

**Code Impact:**
- `hot-state.js` — Add pirateReputation stat
- `hot-combat.js` — Modify encounters based on rep

---

## **📍 v1.4.4 — Port Depth (4-6 hours)**

### **Regional Commodity Specialization** (2-3 hrs)
**Inspiration:** Taipan! (unique port identities)

**Feature:**
- Each port specializes in certain commodities:
  - **Verantia:** Balanced (all commodities available)
  - **Masso:** Wine production (wine 20% cheaper)
  - **Caldera:** Tin mining (tin 30% cheaper)
  - **Northern:** Salt fish capital (salt fish 40% cheaper)
- Special commodities only available at certain ports:
  - **Spices:** Only in Masso (imported)
  - **Amber:** Only in Northern (luxury item)
  - **Silk:** Only in Caldera (high-end trade)

**UI Location:** Trading panel, port description

**Code Impact:**
- `hot-trading.js` — Add port modifiers
- `hot-constants.js` — Define port specialties

---

### **Port Reputation/Favor System** (2-3 hrs)
**Inspiration:** Taipan! (deeper geographic strategy)

**Feature:**
- Build favor with each port:
  - Trade at port → +1 favor
  - Complete port quests → +3 favor
  - Attack pirates near port → +2 favor
- Favor unlocks benefits:
  - **0-2 (Stranger):** Standard prices
  - **3-5 (Known):** 5% discount
  - **6-8 (Trusted):** 10% discount, priority docking
  - **9-10 (Honored):** 15% discount, special commodities
- Favor decays over time (-1 per year)

**UI Location:** Port selector tooltip, trading panel

**Code Impact:**
- `hot-state.js` — Add portFavor object
- `hot-trading.js` — Apply favor discounts

---

## **📍 v1.4.5 — Governance (4-6 hours)**

### **Heir Education Mini-Game** (2-3 hrs)
**Inspiration:** Paravia (engagement, not abstract)

**Feature:**
- When heir reaches age 10, education begins
- Choose focus each year:
  - **Commerce:** +1 Negotiation, +1 Seamanship
  - **Politics:** +1 Politics, +1 Intrigue
  - **Balance:** +1 to all skills
- Education events:
  - "Your heir argues with a merchant. Handle it?"
  - Choices affect skill gains and heir personality
- Final education score affects starting skills when heir takes over

**UI Location:** Year-end panel (ages 10-17)

**Code Impact:**
- `hot-state.js` — Add heirEducation object
- `hot-yearend.js` — Education choice UI
- `hot-events.js` — Education events

---

### **Building Upgrades** (2-3 hrs)
**Inspiration:** Paravia (tangible progression)

**Feature:**
- Upgrade existing buildings:
  - **Warehouse → Grand Warehouse** (800 mk): +40% capacity
  - **Guild Seat → Council Seat** (1500 mk): +2 rep/year
  - **Shipyard → Master Shipyard** (2000 mk): -20% ship cost
  - **Palazzo Wing → Grand Palazzo** (1200 mk): +4 heir education
  - **Counting House → Bank** (1000 mk): +20% passive income
  - **Safehouse → Fortress** (700 mk): -40% mortality risk
- Visual indicator of upgraded buildings
- Upgrade persists across generations

**UI Location:** Year-end building panel

**Code Impact:**
- `hot-state.js` — Track building levels
- `hot-yearend.js` — Upgrade UI
- `hot-economy.js` — Apply upgrade bonuses

---

## **📍 v1.4.6 — Quality of Life (2-3 hours)**

### **Achievement Notifications** (1 hr)
**Inspiration:** Retention (milestone celebration)

**Feature:**
- Toast popup when achievement unlocks:
  - "🏆 Achievement Unlocked: First Blood"
  - "🏆 Achievement Unlocked: Merchant Prince"
- Sound effect (optional)
- Achievement progress tracker in statistics

**UI Location:** Top-center toast notification

**Code Impact:**
- `hot-achievements.js` — Add notification function
- `hot-ui.js` — Toast notification UI

---

### **Dynasty History Viewer** (2-3 hrs)
**Inspiration:** Paravia (timeline view)

**Feature:**
- Visual timeline of all generations:
  - Gen I: Founder Name (Age 28-65) — "The Builder"
  - Gen II: Heir Name (Age 10-52) — "The Diplomat"
  - Gen III: ...
- Click generation to see summary:
  - Major achievements
  - Buildings constructed
  - Rivals defeated
  - Total marks earned
- Export timeline as image/text

**UI Location:** Statistics dashboard, new "History" tab

**Code Impact:**
- `hot-stats.js` — Track generation history
- `hot-ui.js` — Timeline UI component

---

### **Ollama Setup Wizard** (1 hr)
**Inspiration:** Polish (reduce friction)

**Feature:**
- Interactive setup for Ollama users:
  - Step 1: "Do you have Ollama installed?" [Yes] [No]
  - Step 2: "Pull recommended model?" [Pull qwen2.5:7b]
  - Step 3: "Test connection" [Test] [Skip]
- Copy/paste commands provided
- Success/failure feedback

**UI Location:** Settings modal, first-time user flow

**Code Impact:**
- `hot-config.js` — Add wizard UI
- `hot-llm.js` — Connection test function

---

### **Color Blind Mode** (2 hrs)
**Inspiration:** Accessibility (inclusive design)

**Feature:**
- Alternative color schemes:
  - **Deuteranopia** (red-green): Blue/orange indicators
  - **Protanopia** (red-green): Purple/yellow indicators
  - **Tritanopia** (blue-yellow): Red/green indicators
- Shape indicators in addition to color:
  - Profit: ▲ (triangle up) + green
  - Loss: ▼ (triangle down) + red
- Toggle in settings

**UI Location:** Settings modal, all profit/loss displays

**Code Impact:**
- `hot-game.css` — Color blind CSS classes
- `hot-config.js` — Color blind mode setting

---

# 🎮 **v1.5 — Quality of Life (10-15 hours)**

**Goal:** Polish and accessibility features for broader appeal.

---

## **📍 v1.5.1 — Accessibility (4-5 hours)**

### **ARIA Label Audit** (1 hr)
- Add ARIA labels to all interactive elements
- Screen reader compatibility testing
- Keyboard navigation improvements

### **Easy Mode Features** (2+ hrs)
- Optional easy mode toggle:
  - Starting marks: 800 → 1500
  - Starting reputation: 5 → 7
  - Mortality chance: -50%
  - Loan rates: -5%
- For players who want story over challenge

### **Export/Import Save Files** (1 hr)
- Export save as JSON file
- Import save from JSON file
- Share saves with other players
- Backup progress

---

## **📍 v1.5.2 — UI Polish (3-4 hours)**

### **Tooltips Everywhere** (2 hrs)
- Hover tooltips on all stats
- Explanation of mechanics on hover
- Example: Hover "Reputation" → "Determines prices, event outcomes, and rival behavior"

### **Quick Save/Load** (1-2 hrs)
- Auto-save every turn (in addition to current auto-save)
- Quick save slot (F5)
- Quick load slot (F9)
- Multiple manual save slots (current 3 → 10)

---

## **📍 v1.5.3 — Performance (3-4 hours)**

### **Lazy Loading** (2 hrs)
- Load modules on demand
- Reduce initial load time
- Cache frequently used data

### **Asset Optimization** (1-2 hrs)
- Compress images
- Minify CSS/JS
- CDN for external resources

---

# 🏆 **v1.6 — Endgame Content (8-12 hours)**

**Goal:** Add depth for long-term players and multiple playthroughs.

---

## **📍 v1.6.1 — Multi-Heir System** (4 hrs)

**Inspiration:** Paravia (dynasty management)

**Feature:**
- Multiple heirs (2-4 children)
- Choose successor when founder dies:
  - Eldest child (traditional)
  - Most skilled child (meritocratic)
  - Favorite child (personal)
- Sibling rivalry events
- Inheritance disputes
- Disinherited children become rivals

**Code Impact:**
- `hot-state.js` — Add children array
- `hot-events.js` — Succession events
- `hot-ui.js` — Heir selection UI

---

## **📍 v1.6.2 — Rival House Management** (6 hrs)

**Inspiration:** Taipan! (play as antagonist)

**Feature:**
- Play as rival houses:
  - **House Borracchi:** Start with 2000 mk, -2 rep, +2 ships
  - **House Spinetta:** Start with 500 mk, +3 rep, special events
  - **House Calmari:** Start with 1000 mk, +1 all skills, mysterious events
- Each house has unique mechanics
- Different victory conditions per house
- Rival house campaigns (5-10 hours each)

**Code Impact:**
- `hot-state.js` — House selection
- `hot-events.js` — House-specific events
- `hot-victory.js` — House-specific victories

---

## **📍 v1.6.3 — War/Conflict System** (4 hrs)

**Inspiration:** Taipan! (naval combat)

**Feature:**
- Declare war on rival houses
- Naval battles (tactical combat minigame)
- Capture enemy ships
- Seize trade routes
- Peace treaties and alliances
- War weariness mechanic

**Code Impact:**
- `hot-state.js` — War state tracking
- `hot-combat.js` — Naval battle system
- `hot-events.js` — War events

---

## **📍 v1.6.4 — Religion/Cult System** (3 hrs)

**Inspiration:** Paravia (divine favor)

**Feature:**
- Build temples (new building type)
- Gain divine favor through offerings
- Divine favor bonuses:
  - +10% all skills
  - -20% mortality chance
  - Special divine intervention events
- Religious quests and pilgrimages

**Code Impact:**
- `hot-constants.js` — Temple building
- `hot-events.js` — Religious events
- `hot-economy.js` — Divine favor mechanics

---

## **📍 v1.6.5 — Exploration/Discovery** (3 hrs)

**Inspiration:** Oregon Trail (frontier spirit)

**Feature:**
- Fund exploration expeditions
- Discover new trade routes:
  - **Western Route:** New commodities, high risk
  - **Eastern Route:** Stable trade, moderate profit
  - **Southern Route:** Exotic goods, very high risk
- Map exploration progress
- First-to-discover bonuses

**Code Impact:**
- `hot-state.js` — Exploration tracking
- `hot-trading.js` — New routes
- `hot-events.js` — Exploration events

---

## **📍 v1.6.6 — Co-op/Multiplayer** (4 hrs)

**Inspiration:** All (shared experience)

**Feature:**
- Local co-op (2-4 players)
- Each player controls one aspect:
  - Player 1: Trading
  - Player 2: Diplomacy
  - Player 3: Combat
  - Player 4: Governance
- Shared dynasty, shared victory/defeat
- Turn-based between players

**Code Impact:**
- `hot-state.js` — Multiplayer state
- `hot-ui.js` — Player turn indicator
- All systems — Multiplayer support

---

# 📊 **COMPLETE FEATURE SUMMARY**

| Version | Features | Time | Priority |
|---------|----------|------|----------|
| **v1.4** | 50 features | 24-32 hrs | HIGH |
| **v1.5** | 20 features | 10-15 hrs | MEDIUM |
| **v1.6** | 15 features | 8-12 hrs | LOW |

**Total:** 85 features, 42-59 hours

---

# 🎯 **RECOMMENDED IMPLEMENTATION ORDER**

## **Phase 1: v1.4 Quick Wins (2-3 hrs)**
1. Cannon Display (15 min)
2. NPC Memorial (30 min)
3. Travel Time (1 hr)
4. Tax Decisions (1 hr)

## **Phase 2: v1.4 Core Features (12-16 hrs)**
1. Skill Checks in Events (2-3 hrs)
2. Skill Feedback (3 hrs)
3. Combat Visuals (2-3 hrs)
4. Port Specialization (2-3 hrs)
5. Port Favor (2-3 hrs)
6. Heir Education (2-3 hrs)

## **Phase 3: v1.4 Polish (4-6 hrs)**
1. Building Upgrades (2-3 hrs)
2. Achievement Notifications (1 hr)
3. Dynasty Viewer (2-3 hrs)
4. Ollama Wizard (1 hr)
5. Color Blind Mode (2 hrs)

## **Phase 4: v1.5 Quality of Life (10-15 hrs)**
- Accessibility features
- UI polish
- Performance optimization

## **Phase 5: v1.6 Endgame (8-12 hrs)**
- Multi-heir system
- Rival house campaigns
- War/conflict
- Religion system
- Exploration
- Co-op multiplayer

---

# 🏁 **LAUNCH RECOMMENDATION**

**Launch at v2.0 (97% alignment) — Recommended**
- All core features complete
- Testing infrastructure solid
- Code is modular and maintainable
- 97% inspiration alignment is excellent

**Continue to v1.4 (100% alignment) — Optional**
- 24-32 hours for remaining features
- Diminishing returns after 97%
- Better to launch and iterate based on player feedback

**The ledger is open. The choice is yours.** ⚓
