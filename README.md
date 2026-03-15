# 🏴‍☠️ House of Tide

**A narrative merchant dynasty game set in the archipelago of Verantia.**

You are the founder of a merchant house. You will trade, govern, and scheme. You will age. When you die, your heir continues. The sea does not care either way.

**v1.1 Features:** Named NPCs, Mortality Events, Building System, Port Trading, AI-Generated Market Shocks

---

## 🎮 How to Play

### Online (Recommended)
1. Visit [your-deployment-url.com]
2. Click "Begin the Founding"
3. Name your dynasty and founder
4. Make choices that shape your house's legacy
5. Survive, thrive, and pass your legacy to your heir

### Local Development
```bash
# Clone the repository
git clone https://github.com/joshuascottpaul/house-of-tide.git
cd house-of-tide

# Open in browser (no build step required!)
open house-of-tide.html

# Or serve with any static server
python3 -m http.server 8000
# Visit http://localhost:8000
```

---

## 🎯 v1.1 Features

### Named NPCs (Oregon Trail Emotional Investment)
- **Casso** (Senior Captain) - Records your losses without comment
- **Pell** (Archivist) - Watches documents that require a second witness
- **Tucci** (Harbourmaster) - Remembers every unpaid gratuity
- Bond system (0-10) - High bond unlocks special dialogue
- NPCs can die - you'll feel it because you knew the name

### Mortality Events (Oregon Trail Tension)
- Death can happen anytime, not just at 65
- 5% base chance per turn, modified by reputation, rivals, age
- AI-generated events: fever, assassination, shipwreck, poison, accident
- 3 choices per event with different survival chances (30%-95%)
- Strong allies protect you (high bond = lower mortality risk)

### Building System (Paravia Tangible Legacy)
- **Warehouse** (400 mk) — +20% cargo capacity
- **Guild Seat** (800 mk) — +1 rep/year, bank rates -2%
- **Shipyard** (1200 mk) — ships cost -10%
- **Palazzo Wing** (600 mk) — heir education +2 years
- **Counting House** (500 mk) — passive income +10%
- **Safehouse** (350 mk) — mortality risk -20%
- Buildings persist across generations
- "The warehouse your founder built still stands."

### Port System (Taipan! Geographic Strategy)
- **Verantia** — The old city (balanced prices)
- **Masso** — Port town south (wine cheap, saltfish expensive)
- **Caldera Strait** — Li Yuen's tolls (wine expensive, tin cheap)
- **Northern Isles** — Salt fish capital (saltfish cheap, wine expensive)
- Choose destination each turn
- Different prices per port = geographic arbitrage
- **Profit loop:** Buy low in Northern Isles, sell high in Caldera

### AI-Generated Market Shocks
- Bumper harvest (0.4-0.6x prices - flooded market)
- Locust plague (1.8-2.5x prices - destroyed crops)
- Mine collapse (2.0-3.0x prices - scarce metals)
- Pirate blockade (1.8-2.2x prices - ships can't arrive)
- AI knows your port, allies, rivals, and generates location-specific events

---

## 🤖 AI Backends

House of Tide supports 4 AI backends for narrative generation:

| Backend | Speed | Cost | Setup |
|---------|-------|------|-------|
| **MLX** (local) | Medium | Free | Install `mlx-openai-server` |
| **Ollama** (local) | Slow | Free | Install Ollama app |
| **OpenAI** (cloud) | Fast | Paid | API key required |
| **Claude** (cloud) | Fast | Paid | API key required |

### Setting Up Backends

#### MLX (Apple Silicon, Recommended for Local)
```bash
# Install mlx-openai-server
pipx install mlx-openai-server

# Launch with model
mlx-openai-server launch --model-path mlx-community/Qwen2.5-3B-Instruct-4bit --model-type lm

# In game: Settings → MLX (local)
```

#### Ollama (Cross-platform Local)
```bash
# Install from https://ollama.ai

# Pull a model
ollama pull qwen2.5:7b

# In game: Settings → Ollama → Select model
```

#### OpenAI (Cloud)
```bash
# Get API key from https://platform.openai.com/api-keys

# In game: Settings → OpenAI API → Enter API key
```

#### Claude (Cloud)
```bash
# Get API key from https://console.anthropic.com/settings/keys

# In game: Settings → Claude API → Enter API key
```

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`, `2`, `3` | Select choice 1, 2, or 3 |
| `S` | Open save/load menu |
| `L` | Load game (when save menu open) |
| `P` | Open settings |
| `Enter` | Continue/advance |
| `Escape` | Close overlays |
| `⌘⇧D` | Toggle debug log |
| `Ctrl+Shift+L` | Toggle live screenshot sharing |

---

## 📸 Screenshot Sharing (New!)

Share your gameplay live with others:

1. Click **"🔴 Live Share"** on the title screen
2. Choose where to save the screenshot file
3. Screenshots update to that file every 3 seconds
4. Share the file path to let others see your gameplay

**Note:** Works best in Chrome/Edge. The red recording indicator shows when active.

---

## 🧪 Running Tests

```bash
# Install dependencies
npm install

# Run all tests (takes ~2 minutes)
npx playwright test

# Run specific test file
npx playwright test tests/keyboard-shortcuts.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Generate HTML report
npx playwright show-report
```

### Test Coverage
- **53 Playwright tests** — 100% passing
- Tests cover: UI, gameplay, backends, edge cases

---

## ✅ Manual Testing Checklist

Before each release, run through this checklist:

### Core Gameplay (30 min)
- [ ] Start new game, complete onboarding
- [ ] Play through 5 complete years
- [ ] Make varied choices (not always option A)
- [ ] Trigger at least one Grand Venture
- [ ] Verify rival relationships change based on choices
- [ ] Verify heir personality affects available choices
- [ ] Save game, reload, verify state persists
- [ ] Die and verify generational handoff works
- [ ] Play 3 years as heir

### Economic Systems (15 min)
- [ ] Take a bank loan, verify interest compounds
- [ ] Repay loan, verify credit score improves
- [ ] Take shadow loan, let it go overdue, verify enforcement
- [ ] Buy a ship, verify fleet grows
- [ ] Sell a ship, verify marks increase
- [ ] Trade commodities, verify prices change by season

### Narrative Continuity (15 min)
- [ ] Defer a Borracchi event, verify thread opens
- [ ] Wait 2-3 years, verify thread returns
- [ ] Resolve thread, verify it closes
- [ ] Check that ledger entries reference past events

### Edge Cases (15 min)
- [ ] Reach 0 marks → verify death screen
- [ ] Reach 0 ships → verify death screen
- [ ] Reach reputation 10 → verify Legendary effects
- [ ] Reach reputation 1 → verify Disgraced effects
- [ ] Test all 4 backends (MLX, OpenAI, Claude, Ollama)
- [ ] Test keyboard shortcuts (1,2,3,S,L,P,Enter,Escape)

### UI/UX (10 min)
- [ ] Verify loading spinner appears during AI calls
- [ ] Verify risk indicators (💰⚠️) appear on appropriate choices
- [ ] Verify backend status badge shows correct backend
- [ ] Verify statistics dashboard opens and shows data
- [ ] Verify custom background can be set
- [ ] Verify sound effects toggle works
- [ ] Verify save/load overlay works correctly
- [ ] Test screenshot sharing (🔴 Live Share button)
- [ ] Verify Ctrl+Shift+L toggles live recording

### Accessibility (5 min)
- [ ] Test keyboard-only navigation
- [ ] Test with screen reader (VoiceOver/NVDA)
- [ ] Verify all buttons have ARIA labels
- [ ] Verify high contrast is readable

**Total Time:** ~90 minutes

---

## 📁 Project Structure

```
house-of-tide/
├── house-of-tide.html    # Main HTML file
├── hot-game.css          # All styles
├── hot-data.js           # Game data, constants, events
├── hot-prompts.js        # AI prompts
├── hot-config.js         # Settings, localStorage
├── hot-llm.js            # AI backend abstraction
├── hot-state.js          # Game state, save/load
├── hot-ui.js             # UI rendering
├── hot-economy.js        # Economy, loans, ships
├── hot-trading.js        # Trading system
├── hot-events.js         # Event generation, heir influence
├── hot-engine.js         # Game loop, keyboard shortcuts
├── hot-sfx.js            # Sound effects
├── hot-stats.js          # Statistics dashboard
├── tests/                # Playwright tests
│   ├── *.spec.js         # Test files (53 tests total)
│   └── helpers.js        # Test utilities
└── package.json          # NPM config for tests
```

---

## 🎯 Features

### Core Gameplay
- **Procedural narrative** — AI-generated events and choices
- **Rival families** — Borracchi, Spinetta, Calmari, Li Yuen
- **Trading system** — Buy/sell commodities with seasonal pricing
- **Thread system** — Unresolved events return with consequences
- **Heir system** — 8 personality traits affect available choices
- **Save/load** — 3 save slots + auto-save

### UI/UX
- **Dynamic backgrounds** — Change based on game state (reputation, wealth, phase)
- **Risk indicators** — 💰 for cost, ⚠️ for danger
- **Backend status** — 🟢 MLX, 🔵 OpenAI, 🟠 Ollama, 🟣 Claude
- **Keyboard shortcuts** — Full keyboard navigation
- **Statistics dashboard** — Track your dynasty's history

### Accessibility
- **ARIA labels** — Screen reader support
- **Keyboard navigation** — All actions accessible via keyboard
- **High contrast** — Clear visual design

---

## 🚀 Deployment

### Static Hosting (Recommended)
House of Tide is a static site — deploy anywhere:

```bash
# Netlify
netlify deploy --prod

# Vercel
vercel --prod

# GitHub Pages
# Enable in repo settings → Pages
```

### Requirements
- Any static hosting (Netlify, Vercel, GitHub Pages)
- No backend required
- No database required
- No build step required

---

## 📊 Statistics Tracked

- Games played
- Total years played
- Generations survived
- Average lifespan
- Highest reputation achieved
- Highest marks achieved
- Total choices made
- Threads resolved
- Rival alliances formed
- Ventures completed

---

## 🛠️ Development

### Adding New Events
1. Open `hot-data.js`
2. Add event to `SITUATION_SEEDS.house` or `SITUATION_SEEDS.routes`
3. Test with `npx playwright test`

### Adding New Backends
1. Open `hot-llm.js`
2. Add new backend case in `callLLM()` function
3. Add backend selector in `house-of-tide.html` settings

### Modifying AI Prompts
1. Open `hot-prompts.js`
2. Edit `EVENT_GEN_PROMPT` or `SYSTEM_PROMPT`
3. Test with different AI backends

---

## 📝 Changelog

### v1.0 (Current)
- ✅ All core features implemented
- ✅ 4 AI backends supported
- ✅ 53 passing tests
- ✅ Full keyboard navigation
- ✅ Statistics dashboard
- ✅ Custom backgrounds
- ✅ Sound effects system
- ✅ Streaming responses (OpenAI)

---

## 🎨 Credits

**Game Design & Development:** AI-Assisted Development Session  
**Testing:** 53 Playwright tests  
**Code Quality:** 8.5/10 audit score  

---

## 📄 License

MIT License — See LICENSE file

---

## 🏴‍☠️ The Ledger Awaits

The sea does not care about your plans. It does not care about your legacy. It does not care about your heir.

The ledger, however, records everything.

**Begin the founding.**
