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

The codebase is organized into focused JavaScript modules:

- **hot-engine.js** - Main game loop, keyboard shortcuts, event flow
- **hot-state.js** - Game state management, save/load system
- **hot-ui.js** - UI rendering and DOM manipulation
- **hot-events.js** - Event generation, heir influence system
- **hot-llm.js** - AI backend abstraction (MLX, Ollama, OpenAI, Claude)
- **hot-economy.js** - Economic systems, loans, ships
- **hot-trading.js** - Trading system with seasonal pricing
- **hot-data.js** - Game data, constants, event templates
- **hot-prompts.js** - AI prompts for narrative generation

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

- 53 Playwright tests covering UI, gameplay, backends, and edge cases
- Tests use page object pattern via helpers.js
- Critical paths: generational handoff, save/load, AI integration
- Visual regression tests for screenshots

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