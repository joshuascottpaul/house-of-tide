# House of Tide — Highest Impact Changes

## 1. Rival Family Memory

### The Problem
The Borracchi, Spinetta, and Calmari are mentioned constantly in events, but they have no memory. You can snub the Borracchi in Year 3, ally with them in Year 5, and betray them in Year 7 — and in Year 9 they appear as though none of that happened. They're narrative wallpaper, not characters.

### Why This Matters
**Gameplay:** Without persistent relationships, player choices feel disposable. "Should I help the Spinetta?" has no weight if the Spinetta forget by next year.

**Narrative:** The game's prose style is built on political interiority — reading the room, tracking grudges, understanding what silence means. But the world doesn't track grudges back. The AI writes beautiful sentences about rivals who have no memory.

**The DM Principle:** A good DM tracks NPC relationships on their campaign notes. When the party returns to the tavern, the innkeeper remembers they paid for everyone's drinks last time. This is basic session continuity.

### What It Fixes
- **Choices gain weight:** Snubbing the Borracchi in Year 3 means they're hostile in Year 9. The player made that bed.
- **Alliances feel real:** If you've helped the Spinetta three times, they should help you back. Currently they might, randomly. That's not an alliance — it's luck.
- **The AI can write better:** "The Borracchi have not forgotten you declined their marriage offer" is a line the AI *wants* to write. It can't, because the game doesn't track whether that happened.

### How It Improves Gameplay
Transforms the game from "react to random events" to "navigate a web of relationships you built." Your past matters. Enemies are enemies because you made them. Allies are allies because you earned them. This is the difference between a game and a story.

---

## 2. Mid-Year Trading Layer

### The Problem
You have marks. You have ships. But between events, you do nothing. The game is: read event → pick choice → wait for next event. There's no economic *play* — no buying low, selling high, timing the market, managing cargo.

The ship count matters mechanically (passive income scales with it), but it doesn't *feel* like you're running a merchant fleet. Ships are an abstract number that occasionally goes up or down.

### Why This Matters
**Gameplay:** Players need something to do with their marks beyond "save for emergencies." Right now, having 2,000 marks vs. 800 marks doesn't change how you play — it just changes how scared you are of the next event.

**Engagement:** The game has long gaps between decisions. You make one choice, read the result, make another choice, then year-end. A trading layer fills that gap with active play.

**Fleet tangibility:** "You have 3 ships" should mean something beyond "+45 marks/year passive income." It should mean "I can run 300 units of cargo this season."

### What It Fixes
- **Active economy:** Players can speculate. Buy salt fish in autumn (cheap), sell in spring (expensive). This is what merchants *do*.
- **Fleet size matters viscerally:** 1 ship = 100 units capacity. 3 ships = 300 units. You feel the difference when you're trying to move a 250-unit alum contract.
- **Events integrate with trade:** AI mentions "alum shortage in the north" → alum price spikes → players who stockpiled profit. The narrative and economy talk to each other.
- **Marks have purpose:** Instead of hoarding, you invest in cargo. Risk/reward becomes player-driven, not just AI-driven.

### How It Improves Gameplay
Adds a Taipan-style economic minigame between narrative beats. You're not just *reading* about being a merchant — you're *trading*. The game becomes: navigate politics (House phase) → manage fleet (Routes phase) → trade cargo (new Trading phase) → settle accounts (year-end). Four beats instead of two. More decisions, more agency, more ways to succeed or fail by your own hand.

---

## 3. Consequence Preview on Choices

### The Problem
Choices currently look like this:
- "Send Pell to the archive before answering."
- "Accept the terms as stated."
- "Acknowledge the approach and say nothing."

All three sound reasonable. You pick one. It costs 300 marks you didn't know you had to spend. Or it requires 2 ships and you only have 1, so the AI narrates you failing to do the thing you chose. This isn't difficulty — it's hidden information that feels like a trap.

### Why This Matters
**Player frustration:** "How was I supposed to know that would cost 300 marks?" is a question that breaks immersion. The player isn't mad at the *outcome* — they're mad they couldn't see the *risk*.

**Choice paralysis:** Without risk indicators, every choice feels equally dangerous. Players default to the safest-sounding option (usually choice C) because they have no framework for evaluating the others.

**The DM principle:** A good DM says "that'll be expensive" or "you don't have enough crew for that" *before* the player commits. They don't let you declare an action, then say "actually you can't do that." That's bad DMing.

### What It Fixes
Choices become:
- "Send Pell to the archive before answering. (costs 50mk for bribes)"
- "Accept the terms as stated. (requires 2+ ships)"
- "Acknowledge the approach and say nothing. (Pell advises caution)"

Now the player knows:
- Choice A costs money but gets information
- Choice B requires fleet capacity they may not have
- Choice C is the safe option (Pell's warning = this is the cautious path)

They still don't know the *outcome* — but they know the *type of risk*. That's the difference between a gamble and a guess.

### How It Improves Gameplay
- **Informed risk-taking:** Players can evaluate "do I have 200mk to spend on this?" before committing. Failure becomes "I took a risk and it didn't pay off" instead of "I didn't know that would happen."
- **Strategic choice:** Knowing choice A is expensive and choice C is safe lets players make decisions based on their current position. Flush with marks? Take the expensive option. Treasury thin? Play it safe.
- **Reduces save-scumming:** Players are less likely to reload saves if they feel they understood the risk going in.
- **Respects player time:** You're not punishing players for not being psychic. You're giving them the information a merchant in Verantia would actually have.

---

## Implementation Priority

**Start with #3 (Consequence Preview):**
- Easiest to implement (just append text to choices)
- Immediate quality-of-life improvement
- No new systems required

**Then #1 (Rival Memory):**
- Medium complexity (add state tracking, update AI prompts)
- High narrative payoff
- Makes the world coherent

**Then #2 (Trading Layer):**
- Most complex (new UI panel, price system, cargo mechanics)
- Adds entire new game loop
- Requires balancing against existing economy

---

## Why These Three

Each addresses a different core weakness:

1. **Rival Memory** → fixes narrative continuity (the world remembers)
2. **Trading Layer** → fixes player agency (you do things, not just react)
3. **Consequence Preview** → fixes information design (risks are legible)

Together, they transform the game from "read beautiful prose, pick blind choices, hope for the best" to "navigate a living world, make informed gambles, actively manage an economy." The prose stays. The gothic tone stays. But the *game* underneath becomes something you play, not just something you read.



---

## 4. Fix Thread Followup System

### The Problem
Threads open when you defer/decline events ("Missing waypoints on northern route - uninvestigated"), but they don't reliably return. The AI generates new events instead of following up on open threads. Players see "⟳ 1 open thread" in the status bar but the thread never resolves.

### Why This Matters
**Narrative continuity:** The game promises that deferred matters return. "The world remembers" is a core design principle. When threads disappear, that promise breaks.

**Player trust:** If you defer investigating the Borracchi in Year 3, you expect it to matter in Year 5. When it doesn't, deferral feels like "skip this content" instead of "I'll deal with this later."

**The DM principle:** A good DM tracks open plot threads. If the party said "we'll investigate the missing cargo later," the DM brings it back — changed by time, but connected to the original thread.

### What It Fixes
- **Thread followup reliability:** When a thread is 2+ years old, force a followup event instead of random generation
- **Better AI context:** Pass open threads more prominently to AI with instruction: "PRIORITY: Generate followup for oldest open thread"
- **Thread resolution feedback:** When a thread closes, show visual indicator: "⟳ Thread resolved: Missing waypoints"
- **Thread expiry grace:** Extend expiry from 8 years to 12 years so they have more chances to return

### How It Improves Gameplay
- **Deferred choices matter:** Choosing "investigate later" creates a real future event, not a dead end
- **World feels alive:** The navigator you didn't confront in Year 3 becomes the Borracchi's factor in Year 6
- **Strategic depth:** Players can deliberately defer low-priority threads to focus on urgent matters, knowing they'll return
- **Narrative payoff:** Threads that span 5+ years feel like long-running storylines, not forgotten loose ends

---

## 5. Fix Reputation Stagnation

### The Problem
During 4-year playthrough, reputation stayed at 5 the entire time. No choices affected reputation positively or negatively. The AI is returning `reputation_delta: 0` for every event, making reputation feel like a dead stat.

### Why This Matters
**Gameplay:** Reputation is supposed to gate content (high-rep events at 7+, low-rep events at 3-). If it never changes, players never see those event pools.

**Consequence weight:** Political choices should risk reputation. Successful ventures should build it. Currently, nothing matters.

**The DM principle:** A good DM tracks how NPC factions view the party. Helping the Borracchi should improve standing. Snubbing them should damage it. The AI needs to be more aggressive with reputation deltas.

### What It Fixes
- **Strengthen AI prompt:** Add explicit instruction: "reputation_delta should be non-zero for 60% of outcomes. Political/social choices especially should affect reputation."
- **Calibration examples:** Show AI what warrants +1 (successful alliance, public victory) and -1 (broken promise, public failure)
- **Audit prompt:** Review SYSTEM_PROMPT reputation guidance to ensure it's not being too conservative

### How It Improves Gameplay
- **Reputation becomes dynamic:** Players see their standing rise and fall based on choices
- **Stakes feel real:** Political gambles have visible consequences
- **Content unlocks:** Players reach Renowned (7+) or fall to Precarious (3-), unlocking different event pools
- **Narrative variety:** The game feels different at different reputation tiers

