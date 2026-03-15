# Trading System AI Design

## Core Principle: AI is Dungeon Master

> "The event texts, the income calibration, the reputation gates — these are the campaign notes. They exist to give the AI something to narrate from, not something to execute literally."
> — house-of-tide-design.md

## Problem with Hardcoded Events

The previous implementation had **8 hardcoded market events**:
- Bumper Harvest 🍇
- Pirate Activity ☠️
- Guild Embargo 📜
- Festival Demand 🎉
- Shipwreck Series ⛈️
- Mining Discovery ⛏️
- Harbour Fire 🔥
- Diplomatic Gift 🎁

**Why this violates the design:**
1. ❌ Fixed narratives — AI doesn't tell the story
2. ❌ No continuity — events don't build on threads
3. ❌ Predictable — players will memorize the 8 events
4. ❌ No nuance — every "Pirate Activity" is identical

## Solution: AI-Generated Market Events

### Data Flow

```
┌─────────────────┐
│ Game State      │
│ - Season        │
│ - Reputation    │
│ - Rivals        │
│ - Open Threads  │
│ - Cargo         │
│ - Treasury      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Prompt       │
│ "Generate a     │
│ market event    │
│ for this house" │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ AI Response     │
│ - Event Name    │
│ - Price Mods    │
│ - Narrative     │
│ - Thread Hook   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply to Market │
│ - Modify prices │
│ - Store for     │
│   ledger        │
└─────────────────┘
```

### AI Prompt Structure

```
You are the dungeon master of HOUSE OF TIDE.

CURRENT STATE:
- Season: {season}
- Reputation: {reputation}/10 ({tier})
- Treasury: {marks} mk
- Ships: {ships}
- Cargo: {cargo_summary}
- Rivals: {rival_summary}
- Open Threads: {threads_summary}

Generate a market event that could affect this house's trading this turn.

RULES:
1. 30% chance of event — otherwise return null
2. Event should reflect the season, house state, or open threads
3. Price modifiers should be realistic (0.5x to 2.0x range)
4. Narrative should be 1-3 sentences in Junior Gothic register
5. Optionally create or resolve a thread

RESPONSE FORMAT (JSON):
{
  "event": null | {
    "name": "Short event name",
    "icon": "🍇☠️📜🎉⛈️⛏️🔥🎁⚓🏛️💀🌾",
    "mods": { "saltfish": 1.0, "wine": 0.6, "alum": 1.0, "tin": 1.0 },
    "narrative": "The harbourmaster's report arrives. Three words: 'Wine. Too much wine.' The southern vineyards have flooded the market.",
    "thread": null | { "label": "Wine surplus", "expiresYear": 3 }
  }
}
```

### Thread Integration

**Example 1: Event Creates Thread**
```
AI generates: "Pirate Activity"
- Salt fish prices surge 60%
- Creates thread: "Northern route unsafe"
- Thread returns in 2-3 turns
- AI resolves: "The pirates were... negotiated with. Routes open. The cost was not recorded."
```

**Example 2: Event Resolves Thread**
```
Player has open thread: "Guild embargo on alum"
AI generates: "Factors Guild reaches accord"
- Alum prices normalize
- Resolves thread
- Narrative references the original decision
```

**Example 3: Event Builds on Rival Memory**
```
Borracchi relationship: -3 (hostile)
AI generates: "Borracchi corner the wine market"
- Wine buy price +80%
- Narrative: "Rinaldo smiles. 'Terrible luck about the vineyards.' You did not ask about vineyards."
```

### Implementation Plan

1. **Remove hardcoded MARKET_EVENTS array**
2. **Add `generateMarketEvent()` function** — calls AI
3. **Integrate with `rollMarketPrices()`** — 30% chance to call AI
4. **Store event in game state** — for ledger and thread tracking
5. **Add prefetch caching** — AI event generated during choice phase
6. **Create Playwright tests** — verify AI integration works

### Caching Strategy

```javascript
// During House/Routes phase, prefetch market event
function prefetchMarketEvent() {
  if (Math.random() < 0.30) {
    callLLM(MARKET_EVENT_PROMPT, buildMarketPrompt(), { json: true })
      .then(event => { gs._prefetchedEvent = event; });
  }
}

// During Trading phase, use prefetched event
function rollMarketPrices() {
  if (gs._prefetchedEvent) {
    applyMarketEvent(gs._prefetchedEvent);
    gs._prefetchedEvent = null;
  }
  // ... rest of price rolling
}
```

### Benefits

✅ **Infinite variety** — AI generates unique events
✅ **Continuity** — events reference threads, rivals, history
✅ **Player agency** — decisions affect future events
✅ **Junior Gothic register** — AI maintains narrative voice
✅ **Unpredictable** — even designer doesn't know all possible events
✅ **Emergent storytelling** — each house has unique market history

### Testing Strategy

```javascript
test('AI generates market event with valid structure', async ({ page }) => {
  // Start game, advance to trading phase
  // Verify event has: name, icon, mods, narrative
  // Verify mods are in valid range (0.5-2.0)
  // Verify narrative is 1-3 sentences
});

test('Market event creates thread', async ({ page }) => {
  // Trigger event that creates thread
  // Verify thread appears in tracker
  // Advance turns, verify thread returns
});

test('Market event resolves existing thread', async ({ page }) => {
  // Create thread
  // Trigger event that resolves it
  // Verify thread removed, narrative references it
});

test('No event 70% of time', async ({ page }) => {
  // Run 100 trading phases
  // Verify ~30 events, ~70 no-events
});
```

---

## Summary

**The market is not a spreadsheet. It is a story.**

The AI doesn't just generate prices — it generates **reasons**. The player doesn't just see "Wine: 8 mk" — they read:

> "The Doge announces a week of celebration. Every house in Verantia will serve wine, regardless of cost."

And next year, when wine is cheap:

> "The festival is forgotten. The cellars are still full. The harbourmaster counts casks with the expression of a man who has seen this before."

**This is the ledger. This is the game.**
