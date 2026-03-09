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

