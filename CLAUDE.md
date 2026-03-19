# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Running Tests
```bash
# Run all tests
npx playwright test

# Run specific test file
npx playwright test tests/keyboard-shortcuts.spec.js

# Run tests in headed mode (see browser)
npx playwright test --headed

# Generate test report
npx playwright show-report
```

### Running the Game
```bash
# Local development (no build required)
open house-of-tide.html

# Or serve with any static server
python3 -m http.server 8000
# Visit http://localhost:8000
```

## High-Level Architecture

House of Tide is a narrative merchant dynasty game built as a single-page web application with no backend dependencies. The game uses AI to generate dynamic narrative events based on player choices and game state.

### Core Game Loop
1. Player makes choices in narrative events
2. Choices affect game state (reputation, wealth, ships)
3. AI generates new events based on current state and history
4. Game continues across generations through heir system

### Module Structure

The codebase is organized into focused JavaScript modules loaded in this order:

**Data & Config (loaded first)**
- **hot-data.js** - Game data, event templates, heir traits, epigrams
- **hot-prompts.js** - AI prompts for narrative generation
- **hot-config.js** - Settings persistence, appearance system, debug mode
- **hot-logger.js** - Structured logging system
- **hot-debug.js** - Debug overlay, monkey-patches for beginPhase
- **hot-constants.js** - Numeric constants (TUTORIAL_TRIGGERS, thresholds, etc.)
- **hot-errors.js** - Error capture and reporting
- **hot-ui-selectors.js** - Centralized DOM selector constants

**Systems (mid-load)**
- **hot-performance.js** - Frame timing, performance monitoring
- **hot-background.js** - Dynamic background image system
- **hot-combat.js** - Combat/pirate system (COMBAT_TACTICS, buyCannons)
- **hot-tutorials.js** - Tutorial modal system (TUTORIALS content, showTutorial)
- **hot-victory.js** - Victory conditions (VICTORY_THRESHOLDS, checkVictoryConditions)
- **hot-threads.js** - Narrative thread system
- **hot-yearend.js** - Year-end notes and summaries (YEAR_END_NOTES)
- **hot-llm.js** - AI backend abstraction (MLX, Ollama, OpenAI, Claude)
- **hot-state.js** - Game state (`gs`), save/load system

**UI & Gameplay (core)**
- **hot-ui.js** - UI rendering, showScreen, DOM manipulation
- **hot-economy.js** - Economic systems, loans, ships
- **hot-trading.js** - Trading system with seasonal pricing (PORTS)
- **hot-events.js** - Event generation, heir influence system
- **hot-engine.js** - Main game loop, keyboard shortcuts, event flow

**Features (loaded last)**
- **hot-sfx.js** - Sound effects
- **hot-stats.js** - Statistics dashboard
- **hot-achievements.js** - Achievement system
- **hot-screenshot.js** - Screenshot capture
- **hot-screenshot-live.js** - Live screenshot sharing (File System Access API)

> **IMPORTANT — Duplicate `const` rule**: All module files share the same global script scope in the browser. A `const` or `let` declared at the top level in any file conflicts with identically-named declarations in other files, causing a **parse-time SyntaxError that silently skips the entire file**. Each constant must be declared in exactly one file. When extracting code to a new module, always remove the original declaration.

### AI Integration

The game supports 4 AI backends through a unified interface in hot-llm.js:
- MLX (local Apple Silicon)
- Ollama (local cross-platform)
- OpenAI API (cloud)
- Claude API (cloud)

The AI receives:
- Current game state (reputation, wealth, ships)
- Recent ledger entries for narrative continuity
- Event context and player choice
- Heir personality trait

### Key Design Principles

1. **The AI is the Dungeon Master** - The code provides campaign notes, not rigid rules. The AI should interpret and adapt based on game state.

2. **Narrative Continuity** - The ledger system tracks all events and choices, allowing the AI to reference past events and create narrative threads.

3. **Generational Gameplay** - When a character dies, their heir inherits wealth, ships, reputation, and the full ledger history.

4. **Player Agency** - Choices must visibly affect outcomes, even if the final result is predetermined by circumstances.

### Testing Strategy

- Playwright tests covering UI, gameplay, backends, and edge cases
- Tests use shared helpers via `tests/helpers.js`
- Critical paths: generational handoff, save/load, AI integration
- Visual regression tests for screenshots

**Testing Patterns — always follow these:**

1. **Register `pageerror` BEFORE `page.goto()`**
   ```js
   const errors = [];
   page.on('pageerror', e => errors.push(e.message)); // BEFORE goto
   await page.goto('house-of-tide.html');
   ```
   A duplicate `const` or parse error silently kills entire scripts. The `pageerror` event catches these; `console.error` does not.

2. **Assert screen changes immediately after button clicks**
   ```js
   await page.click('button:has-text("Begin the Founding")');
   await expect(page.locator('#screen-name')).toBeVisible({ timeout: 3000 });
   ```
   `page.click()` succeeds even if the handler is broken. Assert the *effect*.

3. **Access `gs` as a global, not `window.gs`**
   ```js
   // WRONG — gs is `let`, not a window property
   await page.evaluate(() => window.gs);
   // CORRECT
   await page.evaluate(() => gs);
   ```
   Top-level `let`/`const` in non-module scripts are global but not on `window`.

4. **`waitForEvent` waits for `#screen-game.active`, not AI panels**
   `page.waitForSelector('#a, #b, #c')` picks the FIRST element in DOM order, not the
   first to become visible. Since `#error-banner` is always present in the DOM (even
   when empty) and comes before the event panels, it was always selected — and an empty
   div is never "visible". `waitForEvent` now waits for `#screen-game.active` instead,
   which is set immediately when onboarding is skipped, before any AI call.

### State Management

Game state persists via localStorage:
- 3 manual save slots
- Auto-save functionality
- Full state includes: marks, ships, reputation, ledger, heir details, rival relationships

### UI/UX Patterns

- Keyboard shortcuts for all major actions (1/2/3 for choices, S for save, P for settings)
- Dynamic backgrounds based on game state
- Risk indicators on choices (💰 for cost, ⚠️ for danger)
- Backend status badges
- Accessibility via ARIA labels and keyboard navigation

### Screenshot Sharing System

The game includes a live screenshot sharing feature for gameplay observation:
- **hot-screenshot-live.js** - Uses File System Access API to save screenshots to user-chosen location
- Updates every 3 seconds to the same file for live viewing
- Includes game state metadata (year, marks, ships, reputation, current event)
- Activated via "🔴 Live Share" button or Ctrl+Shift+L
- Works on both file:// and GitHub Pages deployments (Chrome/Edge recommended)

## Deployment Workflow

**IMPORTANT**: This project has both local (`file://`) and live (`https://joshuascottpaul.github.io/house-of-tide/`) versions. Changes must be committed and pushed to appear on the live site.

### Testing Both Versions
```bash
# Test locally first
open house-of-tide.html

# Then check live version
open https://joshuascottpaul.github.io/house-of-tide/
```

### Deployment Routine
```bash
# After making changes:
git add .
git commit -m "describe changes"
git push origin main
# Wait 2-5 minutes for deployment
```

### Development Workflow
1. Make changes locally
2. Test locally first (`file://`)
3. Commit & push when satisfied
4. Verify on live site (`https://`)

### Deployment Checklist
Always verify before considering work complete:
- [ ] Test locally (`file://`)
- [ ] Commit and push changes
- [ ] Verify on GitHub Pages
- [ ] Check that features work on both versions

## CI/CD Pipeline

The repository uses GitHub Actions for automated testing and deployment:

### Workflow Configuration
- **File**: `.github/workflows/ci-cd.yml`
- **Triggers**: Push to `main` branch
- **Steps**: 
  1. Run Playwright tests (53 tests)
  2. Deploy to `gh-pages` branch (if tests pass)
  3. GitHub Pages builds from `gh-pages` branch

### Manual Deployment (If CI/CD Fails)
If automated deployment is stuck or failing:

```bash
# Force-deploy to gh-pages branch
git checkout main
git branch -D gh-pages
git checkout -b gh-pages
git push origin gh-pages --force
```

### Troubleshooting Deployment
1. **Check workflow status**: `gh run list --repo joshuascottpaul/house-of-tide`
2. **View workflow logs**: `gh run view [RUN_ID] --log`
3. **Check GitHub Pages config**: Ensure it's set to deploy from `gh-pages` branch
4. **Wait for deployment**: GitHub Pages can take 2-10 minutes to update after push

### Common Deployment Issues

**Issue**: Changes deployed but site shows old version
**Diagnosis Steps**:
```bash
# 1. Verify gh-pages has latest content
git checkout gh-pages
grep "your-new-feature" your-main-file.html

# 2. Check if GitHub Pages built from correct commit
gh api repos/joshuascottpaul/house-of-tide/pages/builds --jq '.[0] | {status, commit, created_at}'
git log --oneline -1  # Compare with latest commit

# 3. Test specific files vs root URL
curl -s "https://joshuascottpaul.github.io/house-of-tide/house-of-tide.html" | grep "your-feature"
curl -s "https://joshuascottpaul.github.io/house-of-tide/" | grep "your-feature"
```

**Root Cause**: `index.html` vs main game file mismatch
- GitHub Pages serves `index.html` by default
- If main content is in `house-of-tide.html`, users see outdated `index.html`
- **Solution**: `index.html` redirects to `house-of-tide.html` (see current implementation)