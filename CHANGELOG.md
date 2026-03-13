# Changelog

All notable changes to House of Tide will be documented in this file.

---

## [1.0.0] - Current

### ✨ Features Added
- **4 AI Backends** — MLX, OpenAI, Claude, Ollama
- **Rival Memory System** — Auto-tracking relationships with 4 rival families
- **Trading Layer** — Buy/sell 4 commodities with seasonal pricing
- **Thread Resolution** — Unresolved events return with consequences
- **Heir Influence** — 8 personality traits affect available choices
- **Statistics Dashboard** — Track dynasty history across generations
- **Custom Backgrounds** — Dynamic or custom URL backgrounds
- **Sound Effects** — Toggle-able sound system (ready for audio files)
- **Keyboard Shortcuts** — Full keyboard navigation (1,2,3,S,L,P,Enter,Escape)
- **Risk Indicators** — 💰 cost, ⚠️ warning icons on choices
- **Backend Status Badges** — 🟢🔵🟠🟣 indicators for active backend
- **Loading Spinner** — Animated indicator during AI calls
- **Streaming Responses** — Real-time text generation (OpenAI)

### 🔧 Tech Debt Addressed
- **CSS Naming Standardization** — `.leg`→`.legendary`, `.hi`→`.high`, etc.
- **Marks Helper Functions** — `addMarks()`, `spendMarks()`
- **Fallback Event Consolidation** — `createFallbackEvent()` function
- **Prefetch Variable Rename** — `_prefetchResults`→`_prefetchOutcomes`
- **Heir Text Helper** — `formatHeirText()` function
- **Reputation Constants** — `REP_THRESHOLDS` object
- **getSeason() Location** — Moved to `hot-data.js`

### 🧪 Testing
- **53 Playwright Tests** — 100% passing
- Test coverage for: UI, gameplay, all backends, edge cases

### ♿ Accessibility
- **ARIA Labels** — Screen reader support for all buttons
- **Keyboard Navigation** — All actions accessible without mouse

### 📚 Documentation
- **README.md** — Setup, gameplay, deployment instructions
- **CODE_AUDIT.md** — Comprehensive code quality audit (8.5/10)
- **REMAINING_TASKS_PRIORITIZED.md** — Future roadmap

### 🐛 Bug Fixes
- **JSON Parsing** — Fixed AI returning JSON objects in choice strings
- **Test Connection** — Fixed to route to correct backend
- **Background Images** — Replaced dead Unsplash API with LoremFlickr
- **Ollama CORS** — Added `ollama-cors` setup script

---

## [0.0.0] - Initial Development Session

### Foundation
- Core game loop implemented
- AI narrative generation
- Save/load system
- Basic UI

---

## Future Considerations

### v1.1 (Post-Launch)
- [ ] Achievement system
- [ ] Actual sound files (currently placeholders)
- [ ] Streaming for Claude backend
- [ ] More event seeds
- [ ] Additional rival interactions

### v1.2 (Community Requests)
- [ ] Mod support for custom events
- [ ] Shareable dynasty statistics
- [ ] Leaderboards
- [ ] Additional game modes

---

**The ledger is open. The sea is waiting.**
