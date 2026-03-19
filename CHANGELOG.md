# Changelog

All notable changes to House of Tide are documented here.

---

## [Unreleased — v1.5 in progress]

### ✨ Added
- **Export/Import Saves** — Download any save slot as `.json`; import single-slot or full bundle files
- **Tooltips** — CSS hover tooltips on all stat elements (Phase, Year, Age, Treasury, Ships, Cannons, Reputation)
- **ARIA audit** — `aria-live` regions on test result, loading message, error banner; `role="dialog"` on overlays; `aria-label` on all form inputs and stat containers

---

## [v1.4.6] - 2026-03-18

### ✨ Added
- **Achievement Notifications** — Toast popups when achievements unlock during play
- **Dynasty History Viewer** — Full-page timeline of all generations, founders, heirs, and key events
- **Ollama Setup Wizard** (`hot-ollama-wizard.js`) — Multi-step interactive guide: checks if Ollama is running, guides through install, model pull, and CORS fix; accessible via "? Setup Guide" on title screen
- **Color Blind Mode** — Deuteranopia, Protanopia, Tritanopia palettes; live preview in Settings → Accessibility; persists between sessions

---

## [v1.4.1–v1.4.5] - 2026-02

### ✨ Added
- **Skill Checks** — Negotiation, Seamanship, Politics, Intrigue affect event outcomes
- **Building Upgrades** — Warehouse, Guild Seat, Shipyard, Palazzo Wing, Counting House, Safehouse
- **Combat Improvements** — Visual tactic display, cargo damage from pirates, pirate reputation system
- **Port Depth** — Regional commodity specialization, port reputation/favor system
- **Heir Education Mini-Game** — Focus areas that shape heir traits over time
- **Tax Decisions** — Low/medium/high tax rate with reputation consequences
- **Grand Venture System** — High-stakes events unlocking every few years

---

## [v1.3] - 2026-01

### ✨ Added
- **Thread System** — Unresolved events tracked and returned with consequences
- **Rival Memory** — Relationship scores with Borracchi, Spinetta, Calmari, Li Yuen persist across turns
- **Heir Marriage** — Political alliances via marriage system
- **Named NPCs** — Casso, Pell, Tucci with bond system; NPCs can die
- **Mortality Events** — AI-generated death events at any age with survival choices

---

## [v1.2] - 2025-12

### ✨ Added
- **Trading Layer** — Buy/sell Salt Fish, Wine, Alum, Tin; seasonal pricing; cargo carries between years
- **Port System** — Verantia, Masso, Caldera, Northern Isles with geographic price arbitrage
- **Loan System** — Bank loans and shadow loans with interest and consequences
- **Ship Market** — Buy/sell vessels; fleet size affects income
- **Cannon System** — Defense rating for pirate encounters

---

## [v1.1] - 2025-11

### ✨ Added
- **Statistics Dashboard** — Dynasty history, decision profiles, outcome tracking
- **Achievement System** — Unlockable milestones tracked across sessions
- **Screenshot Sharing** — Live share gameplay via File System Access API (🔴 Live Share)
- **Dynamic Backgrounds** — Change based on reputation, wealth, and phase
- **Appearance Settings** — Opacity, grayscale, tint, text brightness sliders
- **Sound Effects** — Toggle-able SFX system
- **Keyboard Shortcuts** — 1/2/3 choices, S save, P settings, Enter advance, Escape close

---

## [v1.0] - 2025-10

### Foundation
- Core game loop: House phase → Routes phase → Year-End phase
- AI-generated narrative events via 4 backends (Ollama, MLX, OpenAI, Claude)
- Generational play — heir inherits wealth, ships, reputation, and ledger history
- 3 save slots + auto-save
- 8 heir personality traits
- Onboarding tutorial

---

**The ledger is open. The sea is waiting.** ⚓
