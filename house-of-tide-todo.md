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

### Tier 1: Core Fixes (Fix What's Broken)
**#3 Consequence Preview** ✅ COMPLETE
- Easiest to implement (just append text to choices)
- Immediate quality-of-life improvement
- No new systems required

**#4 Thread Followup System** 🔄 IN PROGRESS
- Medium complexity (probability changes, AI prompt updates)
- Fixes broken promise: "deferred matters return"
- Restores player trust in narrative continuity

**#5 Reputation Stagnation**
- Low complexity (AI prompt calibration)
- Fixes dead stat that gates content
- Makes political choices matter

### Tier 2: Foundation (Clean Before Building)
**#7 Code Review/Refactor**
- High complexity (split monolith, add tests)
- Prevents compounding tech debt
- Makes Tier 3 features easier to implement safely
- Do this BEFORE major features

### Tier 3: Major Features (High Impact)
**#1 Rival Memory**
- Medium-high complexity (state tracking, AI context)
- Highest narrative payoff
- Transforms game from "react to events" to "navigate relationships"
- Makes the world coherent and choices meaningful

**#2 Trading Layer**
- Highest complexity (new UI, economy system, balancing)
- Adds entire new game loop
- Most player agency
- Requires clean codebase (do after #7)

### Tier 4: Polish & Optimization (Nice to Have)
**#6 Pre-fetch Outcomes**
- Low complexity (~30 lines)
- UX improvement for slow local models
- Makes game feel snappier
- Optional setting (on for Ollama, off for OpenAI)

**#8 Dynamic Backgrounds**
- Low complexity (~60 lines)
- Pure visual polish
- Lowest priority
- Implement last after all gameplay improvements

---

## Recommended Implementation Order

1. ✅ #3 Consequence Preview (DONE — commit a64ced9 era)
2. ✅ #5 Reputation Stagnation (DONE — SYSTEM_PROMPT calibration in hot-prompts.js)
3. ✅ #7 Code Review/Refactor (DONE — Strangler Fig, commits 7.1–7.12)
4. ✅ #10 Passive Income Rebalance (DONE — commit 58fd37e)
5. ✅ #11 Thread Resolution (DONE — SYSTEM_PROMPT + makeChoice engagement/deferral logic)
6. ✅ #12 Visual Thread Tracker (DONE — renderThreadTracker in hot-ui.js)
7. ✅ #1 Rival Memory (DONE — commit c50d621)
8. ✅ #6 Pre-fetch Outcomes (DONE — commit ce2a69d)
9. ✅ #8 Dynamic Backgrounds (DONE — commit c10b263)
10. ✅ #2 Trading Layer (DONE — commit 772fe32)
11. 🔄 #4 Thread Followup (IN PROGRESS - needs manual testing)
12. ⬜ #9 Visual Thread Tracker extended (covered by #12 above)

**Rationale:**
- Fix broken systems first (threads, reputation)
- Clean up tech debt before adding complexity
- Build major features on solid foundation
- Polish and optimize last

---

## Why These Eight

Each addresses a different aspect of the game:

**Core Fixes:**
- #3 Consequence Preview → information design (risks are legible)
- #4 Thread Followup → narrative continuity (the world remembers)
- #5 Reputation Stagnation → stat dynamics (choices have consequences)

**Foundation:**
- #7 Code Review → maintainability (sustainable development)

**Major Features:**
- #1 Rival Memory → relationship depth (choices gain weight)
- #2 Trading Layer → player agency (active economy)

**Polish:**
- #6 Pre-fetch Outcomes → performance (instant response)
- #8 Dynamic Backgrounds → atmosphere (visual flair)

Together, they transform the game from "read beautiful prose, pick blind choices, hope for the best" to "navigate a living world with persistent relationships, make informed gambles, actively manage an economy, with instant feedback and atmospheric visuals." The prose stays. The gothic tone stays. But the *game* underneath becomes something you play, not just something you read.



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

---

## 6. Pre-fetch Outcomes for Instant Response

### The Problem
With slow local models (Ollama), there's a 5-15 second wait after clicking a choice while the AI generates the outcome. This breaks immersion and makes the game feel sluggish, especially during long play sessions where you're making 20+ choices.

### Why This Matters
**Perceived performance:** The game feels faster than it is. Players tolerate loading screens at transitions, but waiting after every choice makes the game feel unresponsive.

**Local model viability:** Ollama is free and private, but slow. Pre-fetching makes local models feel as snappy as cloud APIs.

**Testing efficiency:** During development and playtesting, faster iteration means more testing gets done.

### What It Fixes
- **Parallel generation:** When choices are displayed, immediately generate all 3 outcomes in parallel
- **Instant response:** When player clicks, the outcome is already cached — display is instant
- **Smart caching:** Cache is cleared after use to prevent stale data
- **Graceful fallback:** If cache miss (shouldn't happen), fall back to current behavior

### How It Improves Gameplay
- **Feels like a local game:** No waiting between choice and outcome — instant feedback
- **Better flow:** Players stay immersed in the narrative instead of watching loading indicators
- **3x parallelization:** Three parallel requests often finish faster than one sequential request
- **Makes Ollama viable:** Local models become competitive with cloud APIs for UX

### Trade-offs
**Pros:**
- Instant response on choice selection
- Better UX with slow models
- Parallel requests may finish faster

**Cons:**
- 3x API cost for cloud providers (OpenAI)
- 3x token usage
- Heavier load on local Ollama
- Wasted computation for unchosen options

**Recommendation:** Make it a setting (`prefetchOutcomes: true/false`). Default to `true` for Ollama, `false` for OpenAI/Claude.

### Implementation Complexity
**Low:** ~30 lines of code. Add outcome cache, trigger parallel fetches in `renderChoices()`, check cache in choice handler before calling AI.

---

## 7. Code Review for Tech Debt and Refactoring

### The Problem
The game is a single 3000+ line HTML file with embedded JavaScript and CSS. As features accumulate (6 phases planned), the codebase will become harder to maintain, test, and debug. No module boundaries, global state everywhere, and mixing concerns (UI, game logic, AI calls, storage).

### Why This Matters
**Maintainability:** Adding new features requires navigating a massive file. Finding where threads are created requires searching for "expiresYear" across 3000 lines.

**Testing:** Playwright tests can only test through the UI. Can't unit test game logic (e.g., "does analyzeChoiceRisk() correctly parse '600 marks'?") without browser automation.

**Collaboration:** Single-file format makes git diffs noisy and merge conflicts likely if multiple features are developed in parallel.

**Performance:** All code loads at once. No code splitting or lazy loading possible.

### What It Fixes
- **Module structure:** Split into logical files (game-state.js, ai-integration.js, ui-rendering.js, storage.js)
- **Testability:** Pure functions can be unit tested without browser (e.g., risk detection, thread matching, ledger formatting)
- **Separation of concerns:** Game logic separate from rendering, AI calls separate from state management
- **Build process:** Add simple build step (esbuild/rollup) to bundle for distribution while keeping source modular
- **Type safety:** Consider adding JSDoc types or migrating to TypeScript for better IDE support

### Specific Tech Debt Items
1. **Global state:** `gs` object is global and mutated everywhere. Wrap in state manager with getters/setters.
2. **Mixed concerns:** `renderChoices()` does rendering AND game logic. Split into `buildChoiceData()` and `renderChoiceButtons()`.
3. **Callback hell:** Nested async calls in event generation. Use async/await consistently.
4. **Magic numbers:** `expiresYear: gs.turn+12` appears 3 times. Define `THREAD_EXPIRY_YEARS = 12` constant.
5. **Duplicate code:** Thread creation logic repeated 3 times. Extract `createThread(label, type)` helper.
6. **No error boundaries:** AI call failures crash the game. Add try/catch with user-friendly error messages.
7. **localStorage direct access:** Wrap in storage abstraction for easier testing and migration to IndexedDB later.

### How It Improves Development
- **Faster feature development:** Clear module boundaries mean less time searching for code
- **Safer refactoring:** Unit tests catch regressions when changing game logic
- **Better debugging:** Smaller files with clear responsibilities are easier to debug
- **Onboarding:** New contributors can understand one module at a time instead of 3000-line monolith
- **Performance profiling:** Can measure and optimize individual modules

### Implementation Complexity
**Medium-High:** This is a refactor, not a feature. Requires:
- Splitting file into modules (~8-10 files)
- Adding build process (esbuild config)
- Writing unit tests for extracted logic
- Updating Playwright tests to work with bundled output
- Documenting module boundaries and APIs

**Estimated effort:** 1-2 days of focused work

**Risk:** High chance of introducing bugs during refactor. Requires comprehensive testing after.

### Recommendation
Do this AFTER Phase 5 (Reputation), BEFORE Phase 6 (Pre-fetch). Rationale:
- Phases 1-5 fix core gameplay issues (higher priority)
- Pre-fetch and beyond will be easier to implement with clean architecture
- Refactoring now prevents compounding tech debt as features accumulate

---

## 8. Dynamic AI-Generated Background Images

### The Problem
The game has a strong visual identity (parchment colors, gothic typography) but no ambient visual flair. A subtle background image could reinforce the Renaissance merchant atmosphere without distracting from the text-focused gameplay.

### Why This Matters
**Atmosphere:** A faint engraving of a palazzo or harbor scene reinforces the setting without overwhelming the prose.

**Dynamic storytelling:** Background reflects current game state — prosperous houses get grand architecture, struggling houses get weathered docks.

**Polish:** Small visual touches make the game feel more complete and professional.

### What It Fixes
- **AI-generated search prompts:** At year-end, AI analyzes game state (reputation, marks, ships, recent events) and generates a 2-3 word search term
- **CSS filtering:** Grayscale + 20% opacity keeps it subtle and non-distracting behind text
- **Yearly refresh:** Changes once per year, not every event (performance + thematic consistency)
- **Contextual themes:** High rep = palazzo, low rep = weathered dock, many ships = harbor fleet

### Image Source Options (selectable in settings)

**Option A — Pollinations.ai**
- ⚠️ Pricing unclear — needs verification before implementing (may no longer be free)
- AI image generation: `https://image.pollinations.ai/prompt/{prompt}`
- Would generate contextually accurate Renaissance/merchant imagery directly from prompt
- If free tier still exists: ideal default (no API key, no account)
- **Action needed:** Check current pricing/free tier before building around this

**Option B — Unsplash (existing, photo-based)**
- Free tier, no API key for Source API
- Photo search: `https://source.unsplash.com/1600x900/?{query}`
- Real photography — may not always match gothic/Renaissance aesthetic
- No rate limit on Source API (unofficial, may change)

**Option C — Google Imagen / Flow API**
- Requires Google Cloud API key (stored in settings like OpenAI key)
- Limited to ~500 images/month on free tier before charges apply
- Higher quality AI generation but adds auth complexity
- Lower priority — Pollinations.ai covers the same use case free

**Fallback chain:** Unsplash Source → Lorem Picsum (generic) — extend if a confirmed-free AI source is found

### Implementation Notes
- Settings: add "Background Images" toggle + source selector (Pollinations / Unsplash / Google)
- Google option: add API key field (same pattern as OpenAI key field)
- CSS: `filter: grayscale(100%); opacity: 0.20;` applied to background element behind all content
- The background element sits below the parchment overlay — image shows through the texture

### Implementation Complexity
**Low:** ~60 lines of code. AI generates search term, fetch from selected source, apply via CSS.

**Cost:** 1 extra LLM call per year (~20 tokens) + free image fetches (Pollinations/Unsplash) or Google API cost

### Recommendation
**Lowest priority** — pure polish feature. Implement after all core gameplay improvements (Phases 1-7).

---

## 9. Visual Thread Tracker in Status Bar

### The Problem
Open threads are only visible at year-end in a text list. During gameplay, players can't see what unresolved matters they're carrying. The "⟳ 1 open thread" pip in the status bar is minimal and doesn't convey what the threads are or how old they are.

### Why This Matters
**Player awareness:** Threads are active quests, but they're hidden. Players should see "Borracchi marriage offer — 3 years open" as a persistent reminder, not discover it only at year-end.

**Quest-like feel:** Threads are the game's equivalent of quest logs. They should be visible, trackable, and feel like active objectives.

**Strategic planning:** Knowing you have 2 threads at 2+ years old helps you decide whether to defer another matter or resolve existing ones first.

### What It Fixes
- **Collapsible thread section in status bar:** Shows active threads as quest-like items with ⟳ icon, thread name, and age
- **Visual aging indicators:** Threads 2+ years old get warning color (old threads demand resolution)
- **Expand/collapse:** Section collapses to save space but shows count when collapsed
- **Live updates:** Refreshes when threads are created, resolved, or aged

### How It Improves Gameplay
- **Threads feel like quests:** Visible, trackable objectives separate from the ledger
- **Better strategic planning:** See all open threads at a glance, prioritize which to resolve
- **Narrative weight:** Old threads visually demand attention, reinforcing that deferred matters don't disappear
- **Trophy room feel:** Threads are achievements/challenges, not just ledger entries

### Implementation Complexity
**Low-Medium:** ~80 lines of code. Add collapsible UI section, style as quest items, update on state changes.

### Tasks
1. Design thread display UI in status bar
2. Style thread items to look like quests (⟳ icon, age indicators, warning colors for 2+ years)
3. Add expand/collapse functionality
4. Update thread display on state changes (create/resolve/age)
5. Test with multiple threads

### Recommendation
**Medium priority** — quality-of-life improvement. Implement after thread followup system is working reliably (#4).

---

## 10. Passive Income Too Low vs Event Costs

### The Problem
Passive fleet income is too small compared to event costs and ship prices. With 2 ships, year-end settlement shows only +37mk net income, but:
- Sending Pell to archive costs 50mk
- Commissioning a new ship costs 700mk
- Most event choices with costs are 100-300mk

This creates an economy where passive income is irrelevant and the only way to grow is through lucky event outcomes.

### Why This Matters
**Economic balance:** Players can't save toward goals through normal operations. A ship costs 700mk but generates ~18mk/year net — that's a 39-year payback period, which is longer than most playthroughs.

**Fleet growth feels impossible:** You need lucky events (+200-400mk) to afford ships. Passive income doesn't contribute meaningfully to fleet expansion.

**Event costs feel arbitrary:** If your fleet generates 37mk/year but investigating something costs 50mk, the economy doesn't make internal sense.

### What It Fixes
**Option A: Increase passive income**
- Current: ~15mk net per ship per year
- Proposed: ~50-80mk net per ship per year
- Makes fleet size matter more
- Allows saving toward ship purchases over 8-10 years

**Option B: Reduce event costs**
- Pell investigations: 50mk → 20mk
- Ship commissions: 700mk → 400-500mk
- Event choice costs: scale down proportionally

**Option C: Hybrid approach**
- Increase passive income to ~30-40mk per ship
- Reduce ship prices to 500mk
- Keep event costs as-is (they're the main economy)

### How It Improves Gameplay
- **Fleet growth is achievable:** Players can work toward 3-4 ships through careful play, not just luck
- **Passive income matters:** Having 3 ships vs 1 ship is a meaningful economic difference
- **Strategic choices:** "Should I spend 50mk investigating?" becomes a real trade-off, not "this costs more than I earn in a year"
- **Economic coherence:** The numbers feel internally consistent

### Implementation Complexity
**Low:** Adjust constants in `beginYear()` function. Test balance over 10-year playthrough.

### Recommendation
**High priority** — core economy issue. Fix after thread followup (#4), before or alongside reputation stagnation (#5).

---

## 10. Passive Income Too Low vs Event Costs

### The Problem
Passive fleet income is too small compared to event costs and ship prices. With 2 ships, year-end settlement shows only +37mk net income, but:
- Sending Pell to archive costs 50mk
- Commissioning a new ship costs 700mk
- Most event choices with costs are 100-300mk

This creates an economy where passive income is irrelevant and the only way to grow is through lucky event outcomes.

### Why This Matters
**Economic balance:** Players can't save toward goals through normal operations. A ship costs 700mk but generates ~18mk/year net — that's a 39-year payback period, which is longer than most playthroughs.

**Fleet growth feels impossible:** You need lucky events (+200-400mk) to afford ships. Passive income doesn't contribute meaningfully to fleet expansion.

**Event costs feel arbitrary:** If your fleet generates 37mk/year but investigating something costs 50mk, the economy doesn't make internal sense.

### What It Fixes
**Option A: Increase passive income**
- Current: ~15mk net per ship per year
- Proposed: ~50-80mk net per ship per year
- Makes fleet size matter more
- Allows saving toward ship purchases over 8-10 years

**Option B: Reduce event costs**
- Pell investigations: 50mk → 20mk
- Ship commissions: 700mk → 400-500mk
- Event choice costs: scale down proportionally

**Option C: Hybrid approach**
- Increase passive income to ~30-40mk per ship
- Reduce ship prices to 500mk
- Keep event costs as-is (they're the main economy)

### How It Improves Gameplay
- **Fleet growth is achievable:** Players can work toward 3-4 ships through careful play, not just luck
- **Passive income matters:** Having 3 ships vs 1 ship is a meaningful economic difference
- **Strategic choices:** "Should I spend 50mk investigating?" becomes a real trade-off, not "this costs more than I earn in a year"
- **Economic coherence:** The numbers feel internally consistent

### Implementation Complexity
**Low:** Adjust constants in `beginYear()` function. Test balance over 10-year playthrough.

### Recommendation
**High priority** — core economy issue. Fix after thread followup (#4), before or alongside reputation stagnation (#5).



---

## 11. Thread Resolution Not Working

### The Problem
Thread followups are triggering correctly (forced at 2+ years), but threads aren't closing when players engage with them. 

**Observed behavior from testing:**
- Year 1: Created "Borracchi negotiation — unresolved" thread (deferred a Borracchi event)
- Year 3: Got Borracchi followup event (forced at 2 years) ✅ **This works!**
- Year 3: Player chose "Send Pell to the archive for documents pertaining to Borracchi negotiations (costs 50mk)" — an active investigation choice, not a defer
- Year 5: Original thread still open (4 years old) + new thread created (2 years old) ❌ **This is broken**

**What's happening:** 
1. The forced followup system works — Borracchi events are appearing at 2+ years
2. But when player engages (investigates, not defers), the AI doesn't return `"resolve_thread": "Borracchi"` in its JSON response
3. Without `resolve_thread`, the code can't close the old thread
4. Next followup creates a new thread instead of continuing the old one
5. Result: Thread accumulation (2, 3, 4+ threads of the same type)

### Why This Matters
**Thread accumulation:** Players end up with 5+ threads of the same type because each followup creates a new thread instead of resolving the old one.

**No closure feedback:** Players take action (investigate, confront, accept) but never see "⟳ Thread resolved" notification. The world doesn't acknowledge their choice.

**Narrative incoherence:** The AI writes "you investigate the Borracchi matter" but the thread stays open as if nothing happened.

**The DM principle:** A good DM closes plot threads when players resolve them. "You investigated the warehouse — here's what you found. That matter is settled." The AI needs to do the same.

### Root Causes

**Cause 1: AI prompt not explicit enough**
Current SYSTEM_PROMPT says:
```
resolve_thread: a fragment matching an OPEN THREAD label that this outcome closes or settles
```

This is too vague. The AI doesn't know WHEN to return it. It needs:
- "If the player's choice was active engagement (investigate/accept/confront), return resolve_thread"
- "If the player deferred again (wait/nothing/later), do NOT return resolve_thread"
- Examples of what counts as resolution vs deferral

**Cause 2: No choice analysis**
The code doesn't analyze whether the player's choice was a "defer" or "engage" action. It relies entirely on the AI to decide. But the AI doesn't have clear guidance.

**Cause 3: No debug visibility**
When testing, we can't see what the AI returned for `resolve_thread`. Was it null? Was it a non-matching string? We're debugging blind.

### What It Fixes

**Fix 1: Strengthen SYSTEM_PROMPT**
Add explicit section:
```
THREAD RESOLUTION:
When the player's choice actively engages with an open thread (investigates, accepts offer, confronts person, takes action), return resolve_thread with a matching fragment.

Examples of ENGAGEMENT (should resolve):
- "Send Pell to investigate" → resolve_thread: "investigation"
- "Accept the Borracchi offer" → resolve_thread: "Borracchi"
- "Confront the navigator" → resolve_thread: "navigator"

Examples of DEFERRAL (should NOT resolve):
- "Wait and see what develops"
- "Say nothing for now"
- "Defer until next season"

If player deferred again, return resolve_thread: null.
```

**Fix 2: Client-side choice analysis**
Before calling AI, analyze the choice text:
```javascript
const isDeferral = /\b(wait|nothing|see|later|defer|another|next|hold)\b/i.test(choice);
// Pass this to AI in userMsg: "Player chose to [engage/defer]"
```

**Fix 3: Debug logging**
Add to `makeChoice()` after AI response:
```javascript
if (CFG.debugMode) {
  console.log('AI resolve_thread:', parsed.resolve_thread);
  console.log('Current threads:', gs.threads.map(t => t.label));
}
```

**Fix 4: Better matching**
Current code:
```javascript
gs.threads = gs.threads.filter(t => !t.label.toLowerCase().includes(frag));
```

This should work, but add fallback:
- Try exact type match first: `t.type === threadType`
- Then try label includes
- Log which threads were removed

**Fix 5: Visual feedback**
Already implemented but not triggering:
```javascript
showNotification(`⟳ Thread resolved: ${parsed.resolve_thread}`);
```

This needs to actually show on screen (toast notification or status bar flash).

### How It Improves Gameplay
- **Threads close when resolved:** Player investigates → thread closes → "⟳ Thread resolved" notification
- **No accumulation:** One Borracchi thread, not five
- **Clear feedback:** Player knows their action had consequence
- **Narrative coherence:** The world acknowledges resolution

### Implementation Steps
1. Update SYSTEM_PROMPT with explicit thread resolution guidance (5 lines)
2. Add choice analysis in `makeChoice()` before AI call (3 lines)
3. Add debug logging for resolve_thread (2 lines)
4. Implement `showNotification()` function if it doesn't exist (10 lines)
5. Test: Create thread → wait 2 years → get followup → engage → verify thread closes

### Implementation Complexity
**Low:** ~20 lines of code changes. Mostly prompt engineering + debug visibility.

### Recommendation
**High priority** — thread system is half-working. Fix this before implementing visual thread tracker (#12), since the tracker will be more useful when threads actually close.


---

## 12. Visual Thread Tracker in Status Bar

### The Problem
Open threads are only visible at year-end in a text list buried below the finance section. During active gameplay (House/Routes phases), players have no visibility into what unresolved matters they're carrying.

**Current state:**
- Threads exist in `gs.threads` array
- A tiny pip shows "⟳ 1 open thread" in status bar (easy to miss)
- Full thread details only appear at year-end
- No indication of thread age or urgency during gameplay

**What players can't see:**
- Which threads are open right now
- How old each thread is
- Which threads are 2+ years old (urgent)
- What the threads are about without waiting for year-end

### Why This Matters
**Player awareness:** Threads are the game's quest system, but they're invisible during gameplay. Players forget what they deferred 3 years ago.

**Strategic planning:** "Should I defer this Spinetta matter?" depends on knowing you already have 2 threads at 2+ years old. Currently, you can't see that.

**Quest-like feel:** RPGs show active quests in a persistent UI. Threads should feel like objectives you're tracking, not hidden state.

**Urgency visibility:** A thread at 4 years old should visually demand attention. Currently, all threads look the same (or invisible).

### What It Fixes

**Add collapsible "Open Threads" section in status bar:**
```
┌─ Status Bar ─────────────────────────────┐
│ House Solvi — Maren · Gen I              │
│ Heir: Sera, 11 — Diplomatic              │
│                                           │
│ ⟳ Open Threads (2) [click to expand]    │ ← New section
│   ⟳ Borracchi negotiation — 4 years     │ ← Quest item (red/warning)
│   ⟳ Navigator logs — 2 years            │ ← Quest item (yellow)
│                                           │
│ Phase: The House  Year: 5  Age: 32      │
│ Treasury: 1240 mk  Ships: 2  Rep: 6/10  │
└───────────────────────────────────────────┘
```

**Visual design:**
- Collapsible section (click to expand/collapse)
- When collapsed: "⟳ Open Threads (2)" with count
- When expanded: List of threads with ⟳ icon, name, age
- Color coding:
  - 0-1 years: normal gold (#9a8848)
  - 2-3 years: warning yellow (#c8922a)
  - 4+ years: urgent red (#c84030)
- Quest-like styling: slightly indented, trophy/quest icon, age badge

**Interaction:**
- Click section header to expand/collapse
- Hover over thread shows full label (if truncated)
- Threads update live when created/resolved/aged
- Persists across phases (always visible in status bar)

### How It Improves Gameplay
- **Threads feel like active quests:** Visible objectives you're tracking, not hidden state
- **Strategic awareness:** See all open threads at a glance, plan which to prioritize
- **Urgency is visual:** Old threads demand attention through color coding
- **Better than year-end list:** Don't wait for year-end to remember what you deferred
- **Trophy room aesthetic:** Threads as achievements/challenges, fitting the game's tone

### Implementation Details

**HTML structure (add to status bar):**
```html
<div id="thread-tracker" style="display:none;">
  <div id="thread-header" onclick="toggleThreads()">
    ⟳ Open Threads (<span id="thread-count">0</span>)
  </div>
  <div id="thread-list" style="display:none;">
    <!-- Populated by renderThreadTracker() -->
  </div>
</div>
```

**CSS styling:**
```css
#thread-tracker {
  font-family: 'IM Fell English SC', serif;
  font-size: .62rem;
  letter-spacing: .1em;
  margin-top: .4rem;
  border-top: 1px solid #2a1e0e;
  padding-top: .4rem;
}
#thread-header {
  color: #7a6040;
  cursor: pointer;
  text-transform: uppercase;
}
#thread-header:hover { color: #a08848; }
.thread-item {
  font-size: .58rem;
  padding: .2rem 0 .2rem .6rem;
  color: #9a8848;
}
.thread-item.warning { color: #c8922a; }
.thread-item.urgent { color: #c84030; }
```

**JavaScript functions:**
```javascript
function renderThreadTracker() {
  const tracker = document.getElementById('thread-tracker');
  const count = document.getElementById('thread-count');
  const list = document.getElementById('thread-list');
  
  const alive = (gs.threads || []).filter(t => t.year <= gs.turn);
  
  if (alive.length === 0) {
    tracker.style.display = 'none';
    return;
  }
  
  tracker.style.display = 'block';
  count.textContent = alive.length;
  
  list.innerHTML = alive.map(t => {
    const age = gs.turn - t.year;
    const ageStr = age === 0 ? 'this year' : age === 1 ? '1 year' : `${age} years`;
    const urgency = age >= 4 ? 'urgent' : age >= 2 ? 'warning' : '';
    const shortLabel = t.label.length > 35 ? t.label.slice(0, 35) + '…' : t.label;
    return `<div class="thread-item ${urgency}" title="${t.label}">⟳ ${shortLabel} — ${ageStr}</div>`;
  }).join('');
}

function toggleThreads() {
  const list = document.getElementById('thread-list');
  list.style.display = list.style.display === 'none' ? 'block' : 'none';
}
```

**Update calls:**
- Call `renderThreadTracker()` in `updateStatusBar()`
- Call after thread creation in `makeChoice()`
- Call after thread resolution in `makeChoice()`
- Call in `beginYear()` (threads age)

### Current Code Location
- Status bar HTML: line ~200-250
- `updateStatusBar()`: line ~1900
- Thread creation: line ~2950
- Thread resolution: line ~2972

### Testing Plan
1. Start new game, defer a Borracchi event (creates thread)
2. Verify thread appears in status bar with "this year" age
3. Advance to Year 2, verify thread shows "1 year" in normal color
4. Advance to Year 3, verify thread shows "2 years" in warning yellow
5. Advance to Year 5, verify thread shows "4 years" in urgent red
6. Resolve thread, verify it disappears from tracker
7. Test collapse/expand functionality
8. Test with 3+ threads simultaneously

### Implementation Complexity
**Low-Medium:** ~80 lines total (30 lines HTML/CSS, 50 lines JS). Straightforward UI addition with state-driven rendering.

### Recommendation
**Medium priority** — quality-of-life improvement. Implement AFTER thread resolution is fixed (#11), since the tracker is more useful when threads actually close.
