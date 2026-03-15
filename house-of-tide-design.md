# House of Tide — Design Philosophy

## The AI is the Dungeon Master. The code is the campaign notes.

In Dungeons & Dragons, the rulebook exists so the DM can break it intelligently. Hit points are a framework for drama, not a simulation of anatomy. The DM fudges a roll when a character dying to a goblin on turn one would be dull. The DM invents a detail the module never mentioned because the player asked a good question. The rules earn their keep by giving the DM something to deviate from.

House of Tide works the same way. The event texts, the income calibration table, the reputation gates, the marks thresholds — these are the campaign notes. They exist to give the AI something to narrate from, not something to execute literally. The AI's job is not to return accurate JSON. The AI's job is to run a good session.

---

## What this means in practice

**The income calibration table is a suggested difficulty setting, not a contract.** When the system prompt says "good routes outcome: +80 to +200 marks," that's the DM's rough sense of what a productive voyage earns. But a DM running a session where the player just lost their best captain and is clearly overextended might soft-land the next event — not because the rules say to, but because two consecutive catastrophes is bad pacing, and good pacing is the DM's actual job. The AI should be doing this naturally: reading the ledger, reading the current treasury, reading the trajectory, and calibrating the *session* rather than the individual roll.

**The event texts are prompts, not scripts.** The event says the Borracchi bought the Spinetta warehouse. The player investigates. A human DM wouldn't just say "you find nothing" — they'd invent something interesting, something that pays off the earlier Borracchi tension, something that makes the player feel the world is alive and has memory. The AI has the ledger. It has five years of entries. It should be using them. If the player dismissed a captain three turns ago and now faces a ship crisis, the good AI response mentions the dismissed captain — not because any event text says to, but because that's what a DM does. Threads.

**Reputation is a social temperature, not a number.** The gates (≥7 for high-rep, ≤3 for low-rep) are guidelines for which event pool to draw from. But the AI narrating the *consequences* of a choice should be using reputation as a living thing — the way a DM tracks how the tavern-keeper feels about the party. At reputation 8, NPCs in the narrative should behave like people who've heard of the house and respect it. At reputation 3, they should behave like people who've heard the rumours. This doesn't require code changes. It requires the AI to be briefed that reputation is *social reality in Verantia*, not a score.

**The heir trait is a character sheet, not a modifier table.** In D&D, a character's Charisma score affects dice rolls — but what makes Charisma *matter* is that the DM plays the world's reaction to it. A *reckless* heir shouldn't just have different mechanical outcomes; the AI should voice that recklessness in how it describes the heir's presence in the narrative, in Pell's observations, in what the Borracchi think of the succession. The trait is the DM's note on who this character is. Let the AI act on it.

The trait also now affects the game mechanically in small, legible ways:
- **Reckless** — ventures open one year earlier (year 4 instead of 5)
- **Cautious** — one bad reputation event per generation is softened by 1
- **Diplomatic** — high-rep events unlock at reputation 6 instead of 7
- **Greedy** — passive fleet income runs 15% higher
- **Proud** — reputation cannot fall below 1 from any event
- **Romantic** — if ships would be lost entirely, one is saved (once per generation)
- **Scholarly** — Pell's advisor notes include an heir observation
- **Suspicious** — Pell warns at reputation 4 before the house tips into precarious standing

These are not balancing mechanisms. They are the DM acknowledging that who the heir *is* has consequences in the world.

**The ledger is the session log. The AI should read it.** Every choice the player has made is in the ledger. A human DM reads their notes before each session. The AI receives the last four ledger entries in every prompt. Those entries are not just context — they're the DM's reminder of what threads are open, what debts are unpaid, what the player did last time. An AI that ignores the ledger is a DM who didn't prep. The current setup provides this; the AI just needs to be explicitly told: *these entries are your session notes. Use them.*

---

## The three rules a good DM never breaks

**1. Consequences must be legible.** When something bad happens, the player should understand why, even if they couldn't have predicted it. "The Borracchi moved on the warehouse" is legible. "Random misfortune struck your fleet" is not. The AI should always be able to trace the narrative logic of what it returns — even if that logic is improvised, it should hold.

**2. Player agency must feel real.** The player's choice must visibly matter to the outcome. Not always to the final result — sometimes the bad thing happens regardless of what you choose, because that's how the sea works — but the *path* to the outcome should differ based on the choice made. A DM who gives identical outcomes regardless of choice is a DM running a railroad. The choice texts in House of Tide are now specific enough that the AI can generate genuinely different narrative paths for each. It should.

**3. The session must be survivable by a competent player.** A DM who kills the party in session two hasn't run a hard game. They've run a short one. The AI income calibration, the passive fleet income, the settlement mechanic — these exist to make sure the game lasts long enough to have an arc. The DM's job is to create tension, not to guarantee death. When the player is clearly building something — growing fleet, improving reputation, threading events carefully — the AI should feel that momentum and honour it. The ledger shows the DM what kind of player they're running for.

---

## What the code changes should have been framed as

Every mechanical change to this game — the income calibration, the profitable events, the settlement display, the heir pronouns — is not a rules fix. It's better campaign notes. The AI plays better with clearer notes. The income calibration table doesn't *force* the AI to return +80 on a good outcome; it gives the AI a sense of scale that a human DM develops over years at the table. The profitable events don't mechanically guarantee income; they give the AI narrative situations where good play *earns* something, which is what makes the DM's table worth returning to.

The same logic applies to every item on the priority list below. Each fix is not correcting a broken rule; it's clarifying a campaign note so the DM can play it properly.

---

## The DM's brief — what every AI call should remember

You are running a session of House of Tide. The player is a merchant in Verantia. The ledger is your session notes. The event is the situation you've placed them in. The income table is your rough sense of the economy. The reputation tier is how the city sees them today.

Your job is not to return accurate numbers. Your job is to run a session worth playing. Make consequences legible. Make choices matter. Keep the house alive long enough to have an arc. And when the founder finally dies — make it feel like the end of a chapter, not the end of a game.

The heir is waiting. The ledger is still open. Turn the page.

---

## Priority list — what was implemented and why

### 1. Generational handoff ✓ *implemented*
The game's core promise — the campaign does not end when a character dies — was broken. `resetGame()` cleared everything and sent you back to an empty name screen. The heir whose name was on the death screen inherited nothing.

Fixed: "TURN THE PAGE →" now calls `generationalHandoff()`, which transfers marks, ships, reputation, and the full ledger to the heir. A new heir is generated. The dynasty counter increments (Gen II, Gen III…). The old founder is entered in the ledger as a succession record. "Begin a New House" remains as a secondary option for when the player genuinely wants to start fresh.

This is the DM equivalent of: *the campaign doesn't end when a character dies. The campaign is the world.*

### 2. Venture choice rewrites ✓ *implemented*
The five Grand Venture choices were still in the old labelled style ("Commission the Grand Voyage — Casso leads it"). Every house and routes choice had been rewritten in junior gothic register; the ventures — the highest-stakes moments — had not.

Fixed: all fifteen venture choices rewritten as actions the character would take, written without announcing their intent. The DM note is the same for choices as for any other text: show the decision, not the disposition.

### 3. Phase indicator bug ✓ *implemented*
`showHouseEvent()` and `showRoutesEvent()` were not calling `updateStatusBar()`. The status bar showed "The House" throughout the Routes phase. The DM's equivalent of having the wrong map on the table.

Fixed: one line added to each function.

### 4. Epitaph threshold recalibration ✓ *implemented*
The death screen epitaphs were calibrated for the old economy where marks only ever decreased. With passive fleet income now running correctly, a competent player over 37 years accumulates ~4,000 marks from fleet income alone. "Wealthy" at 1,400 would have fired for nearly everyone.

Fixed: thresholds tripled (4,000 / 2,000 / 800). The epitaphs now distinguish between a genuinely thriving house and a merely solvent one.

### 5. Ship commissioning ✓ *implemented*
Fleet size was the most important economic variable, but the only way to grow it was to receive `ships_delta: 1` from the AI. No deliberate agency.

Fixed: a "Commission a vessel — 600 mk" option appears in the year-end panel whenever the treasury can support it. The Masso shipwrights. A ledger entry. The DM equivalent of adding a meaningful player decision to the inter-session downtime.

### 6. Heir trait mechanical hooks ✓ *implemented*
The trait appeared in the status bar and was passed to the AI, but affected nothing deterministically. A reckless heir and a cautious one played identical games.

Fixed: eight small mechanical hooks, one per trait (see full list above). These are not balancing levers. They are the DM noting that who the heir is has consequences in the world — and then making sure the world reflects that.

### 7. High/low rep pool expansion ✓ *implemented*
Two events per reputation gate. After two years at high or low reputation, both events had been seen and the pool reset immediately. The DM equivalent of having only two maps for a campaign that might run for ten sessions.

Fixed: each gate expanded to four events (h19–h22, r19–r22). The new events follow the same register and tone as the existing pool.

### 8. Settlement ledger text ✓ *implemented*
The settlement entry read: *"Route settlement: 220 marks. 2 ships."* Correct information, wrong voice. It read like system output.

Fixed: four rotating settlement variants, all in the junior gothic register. *"The routes settled at 220 marks. Two ships home. Casso recorded the accounts without comment, which with Casso is a form of praise."* The DM narrates everything, including the accounting.

### 9. "Name" label fix ✓ *implemented*
The status bar showed "Name" as the label for the reputation score. A labelling error from an earlier design pass. The stat is reputation. The label now says so.

### 10. Venture warning text ✓ *implemented*
*"THIS IS NOT AN ORDINARY DECISION. WHAT GOES WRONG AT SEA STAYS WRONG."* was the only line in the game that addressed the player directly about mechanics, in capital letters. Every other warning is dramatised.

Fixed: *"Pell has set his pen down. He is watching you the way he watches documents that require a second witness. He has not said anything. He will not say anything. The ledger is still open."* The DM never breaks character to deliver a system notice.

---

## What remains

The campaign is now correctly framed — the AI is briefed as a DM, the generational loop closes properly, the economy sustains, the heir has a character that matters. What follows is the table the DM is working from, not a flaw list:

- **Trading Board** — a Taipan layer between Routes and year-end. Goods with fluctuating prices, ship capacity, event-driven shocks. Gives commercial agency beyond the event pool.
- **District improvements** — warehouse, dockyard, counting house, palazzo wing. Permanent investments that modify how the game plays in subsequent generations.
- **Rival family memory** — the Borracchi, Spinetta, and Calmari currently exist only in event text. If they had persistent state (grudges, debts, alliances that carry forward), the DM's narration of them would be grounded in actual history.
- **Atmospheric year-end notes tied to state** — the fourteen rotating notes are currently blind to whether the house is thriving or failing. Two or three conditional notes (marks < 300, reputation ≤ 2, generation > 2) would make the year-end feel reactive rather than wallpaper.

These are the next sessions. The ledger is still open.

---

## 🧪 Playwright Testing Requirements

### Test Philosophy

Tests verify **player experience**, not just code paths. Every test should answer: "Does this feel like House of Tide?"

### Core Loop Tests (ALWAYS TEST)

```javascript
// 1. Game Start → First Turn → Death → Heir → Continue
// Verifies: Generational handoff works, ledger persists

// 2. Buy Cargo → Sell Cargo → Profit/Loss Displayed
// Verifies: Trading system, cost basis tracking

// 3. House Event → Routes Event → Trading → Year-End
// Verifies: Phase progression, UI updates

// 4. Take Loan → Repay Loan → Credit Score Changes
// Verifies: Loan system, UI feedback

// 5. Commission Ship → Fleet Grows → Passive Income Increases
// Verifies: Ship market, fleet income calculation
```

### v1.1 Feature Tests (NEW FOR v1.1)

```javascript
// PORT SYSTEM TESTS:
// - Choose port → prices differ from base
// - Travel to 4 ports → each has unique modifier
// - Port event triggers → narrative mentions port name

// NAMED NPC TESTS:
// - Game start → 3 NPCs named in status bar
// - NPC death event → ledger entry includes name
// - Bond system → high bond unlocks special choices

// MORTALITY TESTS:
// - Mortality event → player can die before 65
// - Death screen → shows cause (fever, assassination, shipwreck)
// - Heir inherits → marks, ships, rep, buildings, debts

// BUILDING TESTS:
// - Year-end → building purchase option appears
// - Buy warehouse → cargo capacity increases
// - Next generation → building persists, ledger notes founder
```

### UI Selector Standards (FOR TEST RELIABILITY)

```javascript
// Use data-testid for dynamic content:
// <div data-testid="stat-marks">800 mk</div>
// <button data-testid="choice-0">Choice text</button>
// <span data-testid="cargo-saltfish">45</span>

// Use semantic IDs for static content:
// #stat-marks, #stat-reputation, #stat-ships
// #event-text, #choices-container
// #panel-trading, #panel-yearend

// Use ARIA labels for accessibility:
// aria-label="Buy Salt Fish"
// aria-label="Continue to next phase"
```

### Test Data Requirements

```javascript
// Each test must verify:
// 1. UI state (what player sees)
// 2. Game state (what gs contains)
// 3. Ledger state (what was recorded)
// 4. AI prompt (what context was sent)

// Example assertion structure:
expect(await page.locator('#stat-marks').textContent()).toBe('850 mk');
expect(gs.marks).toBe(850);
expect(gs.ledger[0].entry).toContain('Sold cargo');
```

### Test Coverage Goals

| Feature | Target Coverage | Priority |
|---------|----------------|----------|
| Core game loop | 100% | CRITICAL |
| Trading system | 100% | CRITICAL |
| Generational handoff | 100% | CRITICAL |
| Port System (v1.1) | 90% | HIGH |
| Named NPCs (v1.1) | 90% | HIGH |
| Mortality (v1.1) | 90% | HIGH |
| Buildings (v1.1) | 90% | HIGH |
| AI event generation | 80% | MEDIUM |
| Achievement system | 70% | LOW |

---

## 📋 Feature Specification Template (FOR v1.1 IMPLEMENTATION)

### Port System Specification

```javascript
// STATE STRUCTURE:
gs.currentPort = 'Verantia'; // Current location
gs.availablePorts = ['Verantia', 'Masso', 'Caldera', 'Northern'];

// PORT DATA:
const PORTS = {
  Verantia: {
    name: 'Verantia',
    description: 'The old city. Built on reclaimed marsh.',
    modifiers: { saltfish: 1.0, wine: 1.1, alum: 0.95, tin: 1.0 },
    riskLevel: 'low',
    events: ['guild_politics', 'harbour_fees']
  },
  // ... 3 more ports
};

// UI REQUIREMENTS:
// - Port selector in Routes phase
// - Current port shown in status bar
// - Port description in event text

// AI PROMPT ADDITIONS:
// "Player is currently in {port}. {description}. 
//  Local prices: {modifiers}. Rivals present: {rivals}."

// TEST CASES:
// 1. Player chooses Masso → prices reflect Masso modifiers
// 2. Player travels 4 times → visits all ports
// 3. Port event triggers → narrative mentions port
```

### Named NPCs Specification

```javascript
// STATE STRUCTURE:
gs.allies = [
  { 
    name: 'Casso', 
    role: 'Senior Captain', 
    bond: 7, // 0-10
    status: 'active', // active, dead, missing, betrayed
    canDie: true 
  },
  { 
    name: 'Pell', 
    role: 'Archivist', 
    bond: 9, 
    status: 'active',
    canDie: false // Essential NPC
  },
  { 
    name: 'Tucci', 
    role: 'Harbourmaster', 
    bond: 5, 
    status: 'active',
    canDie: true 
  }
];

// UI REQUIREMENTS:
// - Allies shown in status bar (top 3)
// - Bond level visible (■■■□□□□□□□ 3/10)
// - Death screen lists deceased allies by name

// AI PROMPT ADDITIONS:
// "Allies: Casso (bond {bond}, {status}), Pell ({status}), Tucci ({status}).
//  Recent interactions: {ledger entries involving allies}."

// TEST CASES:
// 1. Game start → 3 allies generated with names
// 2. Ally death event → ledger includes name, bond level
// 3. High bond ally → unlocks special dialogue choices
```

### Mortality Events Specification

```javascript
// MORTALITY POOL:
const MORTALITY_EVENTS = [
  {
    id: 'fever',
    weight: 0.4, // 40% chance of mortality event
    text: 'The physician arrives. The diagnosis is not optimistic.',
    choices: [
      { text: 'Pay for treatment', cost: 200, survival: 0.7 },
      { text: 'Rest and pray', cost: 0, survival: 0.5 },
      { text: 'Continue working', reward: 100, survival: 0.3 }
    ]
  },
  // ... more events
];

// TRIGGER CONDITIONS:
// - 5% base chance per turn
// - Increases if: low rep, hostile rivals, dangerous cargo
// - Decreases if: high security, trusted allies

// UI REQUIREMENTS:
// - Mortality event modal (like venture events)
// - Survival chance shown as percentage
// - Death screen shows cause

// TEST CASES:
// 1. Mortality event triggers → player makes choice
// 2. Player dies → generational handoff triggers
// 3. Death screen → shows cause, epitaph, ledger summary
```

### Building System Specification

```javascript
// STATE STRUCTURE:
gs.improvements = {
  warehouse: false,
  guild_seat: false,
  shipyard: false,
  palazzo_wing: false
};

// BUILDING DATA:
const IMPROVEMENTS = {
  warehouse: {
    cost: 400,
    effect: 'cargo_capacity += 20%',
    description: 'Eastern wing storage — your founder built this',
    persists: true
  },
  // ... more buildings
};

// UI REQUIREMENTS:
// - Buildings shown in year-end panel
// - Owned buildings listed in status bar (abbreviated)
// - Building description in ledger when purchased

// AI PROMPT ADDITIONS:
// "House improvements: {list of buildings}.
//  Legacy notes: {who built each building, when}."

// TEST CASES:
// 1. Year-end → building purchase option appears
// 2. Buy warehouse → cargo capacity increases immediately
// 3. Generational handoff → building persists, ledger notes founder
```

---

## ✅ Implementation Checklist (FOR v1.1)

### Pre-Implementation
- [ ] Read this design doc
- [ ] Review INSPIRATION_ANALYSIS_COMPLETE.md
- [ ] Review REMAINING_TASKS_PRIORITIZED.md
- [ ] Set up test environment

### Implementation
- [ ] Implement Port System (12-16 hrs)
- [ ] Implement Named NPCs (6-8 hrs)
- [ ] Implement Mortality Events (6-8 hrs)
- [ ] Implement Building System (4-6 hrs)

### Testing
- [ ] Write Playwright tests for each feature
- [ ] Run full test suite
- [ ] Fix any regressions
- [ ] Manual playthrough (2 hrs)

### Documentation
- [ ] Update CHANGELOG.md
- [ ] Update README.md with new features
- [ ] Add feature screenshots
- [ ] Deploy to GitHub Pages

---

**The ledger is open. The sea is waiting. The tests are written.**

**Turn the page.** ⚓
