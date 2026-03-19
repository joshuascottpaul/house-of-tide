# 🏴‍☠️ House of Tide

**A narrative merchant dynasty game set in the archipelago of Verantia.**

You are the founder of a merchant house. You will trade, govern, and scheme. You will age. When you die, your heir continues. The sea does not care either way.

**Play now:** [joshuascottpaul.github.io/house-of-tide](https://joshuascottpaul.github.io/house-of-tide/)

---

## 🎮 How to Play

### Online (Recommended)
1. Visit the link above — no install required
2. Choose an AI backend in **⊞ Settings** (Ollama is free and local; OpenAI/Claude need an API key)
3. Click **Begin the Founding**
4. Name your dynasty and founder
5. Make choices that shape your house's legacy across generations

### Game Flow

**House Phase** — Political situations, rival maneuvers, Pell's observations
**Routes Phase** — Choose your port, sail, encounter travel events
**Trading Phase** — Buy low, sell high; cargo carries between years
**Year-End Phase** — Investments, buildings, skills, heir education, marriages

### Local Development
```bash
git clone https://github.com/joshuascottpaul/house-of-tide.git
cd house-of-tide

# Option 1: Direct file access
open house-of-tide.html

# Option 2: Static server
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Running Tests
```bash
npm install
npx playwright test
npx playwright show-report
```

---

## 🤖 AI Backends

| Backend | Speed | Cost | Setup |
|---------|-------|------|-------|
| **Ollama** (local) | Medium | Free | Install Ollama — use **? Setup Guide** on title screen |
| **MLX** (local, Apple Silicon) | Medium | Free | `mlx-openai-server launch --model-path <model> --model-type lm` |
| **OpenAI** (cloud) | Fast | Paid | API key from platform.openai.com |
| **Claude** (cloud) | Fast | Paid | API key from console.anthropic.com |

**New to Ollama?** Click **? Setup Guide** on the title screen for a step-by-step wizard.

---

## 🎯 Features

### Core Gameplay
- **Procedural narrative** — AI-generated events shaped by your decisions and history
- **Rival families** — Borracchi, Spinetta, Calmari, Li Yuen with persistent relationship tracking
- **Trading system** — 4 commodities (Salt Fish, Wine, Alum, Tin) with seasonal and port pricing
- **Thread system** — Unresolved events return with consequences years later
- **Heir system** — 8 personality traits (reckless, diplomatic, greedy…) affect available choices
- **Mortality** — Death can come at any age; named allies reduce risk
- **Buildings** — Warehouse, Guild Seat, Shipyard, Palazzo Wing, and more; persist across generations
- **Combat** — Pirate encounters with tactical choices; cannons improve your odds
- **Grand Ventures** — High-risk, high-reward events every few years

### Save System
- **3 manual save slots** + auto-save after every turn
- **Export saves** — download any slot as a `.json` file for backup or sharing
- **Import saves** — restore from a file into any slot; supports both single-slot and full-bundle format

### UI/UX
- **Tooltips** — Hover any stat to learn what it means
- **Dynamic backgrounds** — Change based on reputation, wealth, and phase
- **Risk indicators** — 💰 for cost, ⚠️ for danger on choices
- **Backend status badge** — Shows active AI engine at a glance
- **Keyboard shortcuts** — Full keyboard navigation
- **Statistics dashboard** — Track dynasty history across generations
- **Achievement notifications** — Toast popups when achievements unlock
- **Dynasty History Viewer** — Timeline of all generations in one place
- **Live Share** — Screenshot updates to a local file every 3s for spectators

### Accessibility
- **Color Blind Mode** — Deuteranopia, Protanopia, Tritanopia palettes (Settings → Accessibility)
- **ARIA labels** — Screen reader support on all interactive elements and live stat regions
- **Keyboard navigation** — Every action reachable without a mouse

---

## ⌨️ Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `1`, `2`, `3` | Select choice |
| `S` | Save / Load menu |
| `P` | Settings |
| `Enter` | Continue / advance |
| `Escape` | Close overlays |
| `⌘⇧D` | Toggle debug log |
| `Ctrl+Shift+L` | Toggle live screenshot sharing |

---

## 📁 Project Structure

```
house-of-tide/
├── house-of-tide.html        # Main HTML
├── hot-game.css              # All styles
├── hot-data.js               # Game data, event templates, epigrams
├── hot-prompts.js            # AI prompts
├── hot-config.js             # Settings, appearance, color blind mode
├── hot-logger.js             # Structured logging
├── hot-debug.js              # Debug overlay
├── hot-constants.js          # Numeric constants
├── hot-errors.js             # Error capture
├── hot-ui-selectors.js       # Centralized DOM selectors
├── hot-performance.js        # Frame timing
├── hot-background.js         # Dynamic backgrounds
├── hot-combat.js             # Pirate / combat system
├── hot-tutorials.js          # Tutorial modals
├── hot-victory.js            # Victory conditions
├── hot-threads.js            # Narrative thread system
├── hot-yearend.js            # Year-end notes
├── hot-llm.js                # AI backend abstraction
├── hot-state.js              # Game state, save/load, export/import
├── hot-ui.js                 # UI rendering
├── hot-economy.js            # Loans, ships, economy
├── hot-trading.js            # Trading with seasonal pricing
├── hot-events.js             # Event generation, heir influence
├── hot-engine.js             # Main game loop, keyboard shortcuts
├── hot-sfx.js                # Sound effects
├── hot-stats.js              # Statistics dashboard
├── hot-achievements.js       # Achievement system
├── hot-screenshot.js         # Screenshot capture
├── hot-screenshot-live.js    # Live screenshot sharing
├── hot-ollama-wizard.js      # Ollama setup wizard
├── tests/
│   ├── *.spec.js             # Playwright test files
│   └── helpers.js            # Test utilities
└── .github/workflows/
    └── ci-cd.yml             # Test + deploy pipeline
```

---

## 📊 Project Status

| Version | Focus | Status |
|---------|-------|--------|
| **v1.1–v1.3** | Core gameplay, rivals, trading, combat | ✅ Complete |
| **v1.4** | Skill checks, buildings, ports, governance, QoL | ✅ Complete |
| **v1.5** | Accessibility, export/import, tooltips, performance | 🔄 In Progress |
| **v1.6** | Endgame — multi-heir, rival campaigns, war, exploration | ⏳ Planned |

---

## 🧪 Testing

```bash
# Run all tests
npx playwright test

# Run a specific file
npx playwright test tests/keyboard-shortcuts.spec.js

# Headed mode (see browser)
npx playwright test --headed

# View HTML report
npx playwright show-report
```

CI runs on every push to `main` via GitHub Actions. Tests must pass before deployment.

---

## 🚀 Deployment

The game is a static site — no build step required for deployment.

```bash
# After any change:
git add .
git commit -m "describe changes"
git push origin main
# GitHub Actions tests → deploys to gh-pages automatically
```

---

## 🏆 Credits

**Inspirations:**
- Taipan! (1982) — Geographic trading strategy
- Santa Paravia en Fiumaccio (1978) — Generational legacy
- Oregon Trail (1971) — Named mortality and survival tension

**Design Philosophy:**
> "The AI is the Dungeon Master. The code is the campaign notes."

---

**The ledger is open. The sea is waiting. Turn the page.** ⚓
