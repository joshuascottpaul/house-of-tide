# 📱 House of Tide — Mobile Testing Guide

**Last Updated:** March 21, 2026
**Status:** Active Testing Documentation

---

## 📋 Table of Contents

1. [Quick Start](#quick-start)
2. [iPhone Mode Testing](#iphone-mode-testing)
3. [Mobile UI Issues Checklist](#mobile-ui-issues-checklist)
4. [Chrome DevTools Mobile Emulation](#chrome-devtools-mobile-emulation)
5. [Playwright Mobile Testing](#playwright-mobile-testing)
6. [Responsive Design Verification](#responsive-design-verification)
7. [Touch Target Audit](#touch-target-audit)
8. [Common Mobile Issues](#common-mobile-issues)

---

## 🚀 Quick Start

### Open Game in iPhone Mode (Chrome DevTools)

```bash
# 1. Open the game
open house-of-tide.html

# 2. Open Chrome DevTools (Cmd+Option+C)

# 3. Toggle Device Toolbar (Cmd+Shift+M)

# 4. Select iPhone device from dropdown:
#    - iPhone SE (375x667)
#    - iPhone 12/13/14 (390x844)
#    - iPhone 14 Pro Max (430x932)

# 5. Set device pixel ratio and user agent automatically
```

### Recommended Test Devices

| Device | Viewport | DPR | Use Case |
|--------|----------|-----|----------|
| iPhone SE | 375x667 | 2x | Compact phones, baseline |
| iPhone 12/13/14 | 390x844 | 3x | Modern standard iPhones |
| iPhone 14 Pro Max | 430x932 | 3x | Large phones, phablets |
| iPad Mini | 768x1024 | 2x | Small tablets |
| iPad Pro 12.9" | 1024x1366 | 2x | Large tablets |

---

## 📱 iPhone Mode Testing

### 5-Year Gameplay Test Procedure

**Purpose:** Verify game remains playable and visually correct over extended mobile sessions.

**Steps:**

1. **Open game in iPhone mode** (Cmd+Shift+M, select iPhone 14)

2. **Start new game:**
   - Click "Begin the Founding"
   - Fill dynasty/founder names
   - Click "Open the Ledger"
   - Click "Skip" onboarding

3. **Play 5 years (20 turns):**
   - Make choices each turn (4 phases × 5 years)
   - Advance through Year-End screens
   - Complete generational handoff if triggered

4. **Check for issues each turn:**
   - ✅ All buttons visible and tappable
   - ✅ Text readable without zooming
   - ✅ No horizontal scroll
   - ✅ Status bar not overlapping content
   - ✅ Choice buttons full-width on small screens

5. **Record findings:**
   - Note any UI overflow or clipping
   - Screenshot any broken layouts
   - Log any unresponsive touch targets

### Expected Behavior

| Feature | Desktop | Mobile (iPhone) |
|---------|---------|-----------------|
| Status bar | Horizontal row | Fixed top, vertical stack |
| Choice buttons | Multi-column | Full-width, stacked |
| Event text | Wide container | Narrow, wrapped text |
| Settings modal | Centered, wide | Full-width, 95% width |
| Year-end panel | Multi-column stats | Single column stack |
| Port buttons | Horizontal row | Vertical stack |
| Building badges | Inline display | Wrapped rows |

---

## 🔍 Mobile UI Issues Checklist

### Critical Issues (Block Playability)

- [ ] **Buttons off-screen** — Cannot tap to advance game
- [ ] **Text overflow** — Choice text cuts off, unreadable
- [ ] **Overlapping elements** — Status bar covers game content
- [ ] **Unresponsive touch** — Tap doesn't register on buttons
- [ ] **Horizontal scroll** — Page scrolls sideways unintentionally
- [ ] **Modal off-screen** — Settings/save dialogs extend viewport

### Visual Issues (Degrade Experience)

- [ ] **Tiny text** — Requires zoom to read
- [ ] **Cramped buttons** — Touch targets < 44px height
- [ ] **Broken layout** — Elements stack incorrectly
- [ ] **Missing padding** — Content touches screen edges
- [ ] **Cut-off badges** — Ally/building names truncated
- [ ] **Wrong z-index** — Panels appear behind other UI

### Performance Issues

- [ ] **Slow rendering** — Lag when advancing turns
- [ ] **Janky animations** — Stutter on screen transitions
- [ ] **Memory warnings** — Safari/Chrome low memory alerts
- [ ] **Long tap delay** — 300ms delay on button taps

---

## 🛠 Chrome DevTools Mobile Emulation

### Device Mode Features

**1. Viewport Emulation**
```
- Set custom dimensions
- Preset device profiles
- Orientation toggle (portrait/landscape)
- Device pixel ratio (1x, 2x, 3x)
```

**2. Network Throttling**
```
- Slow 3G (400ms RTT, 384 Kbps)
- Fast 3G (100ms RTT, 1.5 Mbps)
- Slow 4G (150ms RTT, 1.7 Mbps)
- Fast 4G (40ms RTT, 9 Mbps)
```

**3. CPU Throttling**
```
- 4x slowdown (mid-tier mobile)
- 6x slowdown (low-end mobile)
```

**4. Touch Emulation**
```
- Simulates touch events
- Shows tap highlight on click
- Removes hover states (touch has no hover)
```

### Step-by-Step: Test in iPhone Mode

```bash
# 1. Launch Chrome (if not already open)
open house-of-tide.html

# 2. Open DevTools
# Keyboard: Cmd+Option+C (Mac) or Ctrl+Shift+C (Windows)

# 3. Toggle Device Mode
# Keyboard: Cmd+Shift+M (Mac) or Ctrl+Shift+M (Windows)
# Or click device icon in DevTools toolbar

# 4. Select Device
# Dropdown at top: "iPhone 14 Pro" or "Responsive"

# 5. Set Orientation
# Click rotate icon for portrait/landscape

# 6. Test Interactions
# - Click/tap all buttons
# - Scroll through content
# - Open modals (settings, save/load)
# - Advance through all phases
```

### DevTools Console Commands for Mobile Testing

```javascript
// Check viewport dimensions
window.innerWidth + 'x' + window.innerHeight
// Expected: "390x844" for iPhone 14

// Check device pixel ratio
window.devicePixelRatio
// Expected: 3 for modern iPhones

// Check if touch is supported
'ontouchstart' in window
// Expected: true in mobile emulation

// Check hover capability
window.matchMedia('(hover: none)').matches
// Expected: true in mobile emulation

// Check pointer type
window.matchMedia('(pointer: coarse)').matches
// Expected: true in mobile emulation
```

---

## 🧪 Playwright Mobile Testing

### Viewport Configuration

```javascript
import { test, expect } from '@playwright/test';

test('Game works on iPhone viewport', async ({ page }) => {
  // Set iPhone 14 viewport
  await page.setViewportSize({ width: 390, height: 844 });

  // Navigate to game
  await page.goto('file:///Users/jpaul/Desktop/house-of-tide/house-of-tide.html');

  // Verify title screen fits viewport
  const titleScreen = await page.$('#screen-title.active');
  expect(titleScreen).toBeTruthy();

  // Check no horizontal scroll
  const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
  const viewportWidth = await page.evaluate(() => window.innerWidth);
  expect(bodyWidth).toBeLessThanOrEqual(viewportWidth);
});
```

### Touch Target Testing

```javascript
test('Choice buttons are touch-friendly on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await startNewGame(page);

  // Get choice buttons
  const buttons = await page.$$('#choices-container button');

  for (const button of buttons) {
    const box = await button.boundingBox();

    // iOS minimum: 44x44 points
    expect(box.height).toBeGreaterThanOrEqual(44);
    expect(box.width).toBeGreaterThanOrEqual(200); // Reasonable width
  }
});
```

### Mobile Layout Regression Test

```javascript
test('Mobile layout matches baseline screenshot', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await startNewGame(page);

  // Full page screenshot
  await expect(page).toHaveScreenshot('mobile-game-screen.png', {
    fullPage: true,
    maxDiffPixels: 200 // Allow minor differences
  });
});
```

### Test Multiple Devices

```javascript
const mobileDevices = [
  { name: 'iPhone SE', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone 14 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
];

for (const device of mobileDevices) {
  test(`Game works on ${device.name}`, async ({ page }) => {
    await page.setViewportSize({
      width: device.width,
      height: device.height
    });

    await startNewGame(page);

    // Verify core functionality
    const gameScreen = await page.$('#screen-game');
    expect(gameScreen).toBeTruthy();

    // Verify no horizontal scroll
    const hasHorizontalScroll = await page.evaluate(() => {
      return document.body.scrollWidth > window.innerWidth;
    });
    expect(hasHorizontalScroll).toBe(false);
  });
}
```

---

## 📐 Responsive Design Verification

### Breakpoint Testing

The game uses two CSS breakpoints:

| Breakpoint | Trigger | Changes |
|------------|---------|---------|
| **768px** | `@media (max-width: 768px)` | Tablet/small laptop adjustments |
| **480px** | `@media (max-width: 480px)` | Phone-specific styles |

### Test at Each Breakpoint

```bash
# Test responsive behavior
1. Open DevTools → Device Mode
2. Select "Responsive" from device dropdown
3. Manually resize viewport:
   - 1024px (desktop baseline)
   - 768px (tablet breakpoint)
   - 480px (phone breakpoint)
   - 375px (small phone)
4. At each width, verify:
   - Layout adapts correctly
   - No content overflow
   - Buttons remain usable
   - Text remains readable
```

### CSS Mobile Rules (from hot-game.css)

**768px Breakpoint:**
```css
@media (max-width: 768px) {
  /* Status bar becomes fixed at top */
  #status-bar {
    position: fixed;
    top: 0;
    flex-direction: column;
  }

  /* Game content scrolls underneath */
  #game-content {
    padding-top: calc(4.2rem + 1rem);
    overflow-y: auto;
  }

  /* Stats wrap and stack */
  .stats {
    flex-wrap: wrap;
  }

  /* Smaller stat text */
  .stat-name { font-size: 0.6rem; }
  .stat-val { font-size: 0.9rem; }

  /* Cannons & Skills stack */
  #cannons-display, #skills-display {
    font-size: 0.5rem !important;
  }
}
```

**480px Breakpoint:**
```css
@media (max-width: 480px) {
  /* Smaller headings */
  h1 { font-size: 2rem; }

  /* Smaller buttons */
  .btn {
    font-size: 0.65rem;
    padding: 0.5rem 1rem;
  }

  /* Touch-friendly minimum height */
  .btn, .choice-btn, .finance-btn, .port-btn {
    min-height: 44px; /* iOS recommendation */
  }

  /* Stack status bar items */
  .stat { min-width: 80px; }

  /* Smaller badges */
  .ally-badge, .building-badge {
    padding: 0.1rem 0.3rem;
  }
}
```

---

## 👆 Touch Target Audit

### iOS Human Interface Guidelines

Apple recommends **minimum 44x44 points** for all touch targets.

### Audit Procedure

**1. Open DevTools → Device Mode**

**2. For each interactive element, measure:**
```javascript
// Run in browser console
function measureTouchTargets() {
  const selectors = [
    'button',
    '.btn',
    '.choice-btn',
    '.finance-btn',
    '.port-btn',
    '.trading-btn',
    'input[type="button"]',
    'a[href]'
  ];

  const results = [];

  selectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(el => {
      const rect = el.getBoundingClientRect();
      results.push({
        selector: selector,
        text: el.innerText?.slice(0, 30) || el.value?.slice(0, 30),
        width: rect.width,
        height: rect.height,
        passes: rect.height >= 44 && rect.width >= 44
      });
    });
  });

  console.table(results);

  const failed = results.filter(r => !r.passes);
  console.log(`❌ ${failed.length} touch targets below 44x44px`);
  console.log(`✅ ${results.length - failed.length} touch targets pass`);

  return { all: results, failed };
}

measureTouchTargets();
```

**3. Check Results:**

| Element Type | Expected | Actual | Status |
|--------------|----------|--------|--------|
| Choice buttons | ≥44px height | _fill in_ | ⬜ |
| Nav buttons | ≥44px height | _fill in_ | ⬜ |
| Settings buttons | ≥44px height | _fill in_ | ⬜ |
| Port buttons | ≥44px height | _fill in_ | ⬜ |
| Building buttons | ≥44px height | _fill in_ | ⬜ |
| Input fields | ≥44px height | _fill in_ | ⬜ |

### Touch Target Spacing

Buttons should have **at least 8px spacing** between them to prevent accidental taps.

```javascript
// Check button spacing
function checkButtonSpacing() {
  const buttons = Array.from(document.querySelectorAll('.choice-btn'));
  const issues = [];

  for (let i = 0; i < buttons.length - 1; i++) {
    const rect1 = buttons[i].getBoundingClientRect();
    const rect2 = buttons[i + 1].getBoundingClientRect();

    const gap = rect2.top - rect1.bottom;

    if (gap < 8) {
      issues.push({
        button1: buttons[i].innerText.slice(0, 20),
        button2: buttons[i + 1].innerText.slice(0, 20),
        gap: gap.toFixed(1) + 'px'
      });
    }
  }

  console.log(`⚠️ ${issues.length} button pairs with <8px spacing`);
  console.table(issues);

  return issues;
}

checkButtonSpacing();
```

---

## 🐛 Common Mobile Issues

### Issue 1: Status Bar Overlaps Content

**Symptom:** Top of game content hidden behind status bar

**Check:**
```javascript
// Verify status bar is fixed on mobile
const statusBar = document.getElementById('status-bar');
const style = window.getComputedStyle(statusBar);
console.log('Position:', style.position); // Should be 'fixed' on mobile
console.log('Top:', style.top); // Should be '0px'
```

**Fix:** Ensure `#game-content` has `padding-top` to compensate

---

### Issue 2: Horizontal Scroll Appears

**Symptom:** Page scrolls left/right when it shouldn't

**Check:**
```javascript
const hasHorizontalScroll = document.body.scrollWidth > window.innerWidth;
console.log('Horizontal scroll:', hasHorizontalScroll);

// Find culprit
document.querySelectorAll('*').forEach(el => {
  const rect = el.getBoundingClientRect();
  if (rect.right > window.innerWidth) {
    console.log('Overflow:', el);
  }
});
```

**Fix:** Add `overflow-x: hidden` to body or find wide element

---

### Issue 3: Choice Text Overflows

**Symptom:** Long choice text extends beyond button bounds

**Check:**
```javascript
document.querySelectorAll('.choice-btn').forEach(btn => {
  const textOverflow = btn.scrollWidth > btn.clientWidth;
  if (textOverflow) {
    console.log('Overflow:', btn.innerText.slice(0, 50));
  }
});
```

**Fix:** Add `word-wrap: break-word` or reduce font-size

---

### Issue 4: Buttons Too Small to Tap

**Symptom:** Requires precise tapping, accidental misses

**Check:** See [Touch Target Audit](#touch-target-audit)

**Fix:** Increase `min-height` to 44px, add padding

---

### Issue 5: Modal Extends Off-Screen

**Symptom:** Settings/save modal cut off at bottom

**Check:**
```javascript
const modal = document.querySelector('.settings-box');
const rect = modal.getBoundingClientRect();
const visible = rect.bottom <= window.innerHeight;
console.log('Modal fully visible:', visible);
```

**Fix:** Add `max-height: 90vh` and `overflow-y: auto` to modal

---

### Issue 6: Year-End Panel Overflows

**Symptom:** Year-end stats extend beyond viewport

**Check:**
```javascript
const yearEndPanel = document.getElementById('year-end-panel');
const rect = yearEndPanel.getBoundingClientRect();
console.log('Panel height:', rect.height);
console.log('Viewport height:', window.innerHeight);
console.log('Fits:', rect.height <= window.innerHeight);
```

**Fix:** Mobile-specific CSS already exists at line 1486-1520 in `hot-game.css`

---

## 📊 Mobile Test Report Template

```markdown
## Mobile Test Session

**Date:** YYYY-MM-DD
**Device Emulated:** iPhone 14 (390x844)
**Browser:** Chrome DevTools Mobile Emulation
**Test Duration:** 5 years (20 turns)

### Results Summary

| Category | Pass | Fail | Notes |
|----------|------|------|-------|
| Touch Targets | ⬜ | ⬜ | |
| Layout | ⬜ | ⬜ | |
| Text Readability | ⬜ | ⬜ | |
| Button Responsiveness | ⬜ | ⬜ | |
| Modal Display | ⬜ | ⬜ | |
| Status Bar | ⬜ | ⬜ | |
| Year-End Panel | ⬜ | ⬜ | |
| No Horizontal Scroll | ⬜ | ⬜ | |

### Issues Found

1. **Issue Title**
   - Severity: Critical / Major / Minor
   - Location: Screen/phase where found
   - Description: What happens
   - Screenshot: [filename.png]
   - Fix: Suggested solution

### Screenshots Captured

- `mobile-title-screen.png`
- `mobile-game-turn1.png`
- `mobile-year-end-year5.png`

### Recommendations

1. ...
```

---

## 🔗 Related Documentation

- `GAMEPLAY_TESTING.md` — Bot automation and CDP testing
- `TESTING_INFRASTRUCTURE_GUIDE.md` — Playwright test framework
- `tests/visual-regression.spec.js` — Includes mobile layout tests
- `hot-game.css` (lines 1178-1520) — Mobile CSS implementation

---

## 📝 Mobile Testing Checklist (Quick Reference)

```
Pre-Test Setup:
□ Open game in Chrome
□ Enable Device Mode (Cmd+Shift+M)
□ Select iPhone 14 (390x844)
□ Set orientation to portrait

New Game Flow:
□ Title screen fits viewport
□ "Begin the Founding" button visible
□ Name input screen readable
□ "Open the Ledger" button tappable
□ Onboarding modal displays correctly
□ "Skip" button works

Gameplay (Each Turn):
□ Event text fully visible
□ All choice buttons tappable (≥44px)
□ Choice text doesn't overflow
□ Status bar visible, not overlapping
□ No horizontal scroll
□ Phase indicators readable

Year-End:
□ Year-end panel fits viewport
□ All stats visible
□ "Continue" button tappable
□ Ledger entries readable

Settings/Save:
□ Settings modal fully visible
□ All settings options accessible
□ Save/Load overlay fits screen
□ Buttons in overlay tappable

Edge Cases:
□ Rotate to landscape — layout adapts
□ Switch to smaller device (iPhone SE)
□ Switch to larger device (iPad)
□ Long dynasty names don't break UI
□ Many allies/buildings wrap correctly
```

---

**The tide waits for no one. Test on mobile before your players encounter issues.** ⚓
