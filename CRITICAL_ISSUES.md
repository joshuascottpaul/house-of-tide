# 🐛 Critical Issues — Action Plan

**Date:** March 13, 2026  
**Status:** 🔴 CRITICAL  
**Priority:** P0 - Blocking Deployment

---

## 📋 REPORTED ISSUES

### 1. Background Image Not Changing ❌
**Reported:** Background stays the same across game sessions  
**Expected:** New random background on each new game  
**Status:** 🔴 NOT WORKING

### 2. Text Illegible ❌
**Reported:** Font color too light, hard to read  
**Expected:** Clear, readable text on all backgrounds  
**Status:** 🔴 NOT WORKING

### 3. CI/CD Deploy Failed ❌
**Reported:** Deploy job failed in 4 seconds  
**Expected:** Successful deployment to gh-pages  
**Status:** 🔴 NOT WORKING

### 4. Background Not Visible ❌
**Reported:** Background image not showing at all  
**Expected:** Visible but subtle background  
**Status:** 🔴 NOT WORKING

---

## 🔍 ROOT CAUSE ANALYSIS

### Issue 1: Background Not Changing
**Cause:** Browser caching the image URLs  
**Current code uses:**
```javascript
const url = `https://loremflickr.com/1600/900/${keyword}~cats?lock=${keyword}${randomSeed}&v=${version}`;
```

**Problem:** The `lock=` parameter is meant to keep the same image, but we want different images per session.

### Issue 2: Text Illegible
**Cause:** CSS overlay not applied correctly  
**Current CSS:**
```css
#screen-game {
  background: rgba(9, 7, 5, 0.85);
}
```

**Problem:** The overlay might not be rendering, or text color contrast is insufficient.

### Issue 3: CI/CD Failed
**Cause:** Unknown — need to check GitHub Actions logs  
**Likely:** Permission issue with gh-pages branch or workflow configuration error

### Issue 4: Background Not Visible
**Cause:** Either:
- Old code still cached in browser
- CSS filter making background too transparent
- Image URLs not loading

---

## ✅ ACTION PLAN

### Phase 1: Fix Background Images (30 min)

#### Task 1.1: Remove lock= parameter
```javascript
// Change from:
const url = `...?lock=${keyword}${randomSeed}&v=${version}`;

// To (no lock, truly random):
const url = `https://loremflickr.com/1600/900/${keyword}~cats?random=${randomSeed}&v=${version}`;
```

#### Task 1.2: Force cache busting
```javascript
// Add timestamp to force new image
const url = `...&t=${Date.now()}`;
```

#### Task 1.3: Test in browser
- Open game
- Start new game
- Note background
- Refresh page
- Should see different background

---

### Phase 2: Fix Text Legibility (30 min)

#### Task 2.1: Increase overlay opacity
```css
/* Change from 0.85 to 0.92 */
#screen-game {
  background: rgba(9, 7, 5, 0.92);
}
```

#### Task 2.2: Increase text color contrast
```css
/* Make text brighter */
#game-content, .event-text, .choice-btn {
  color: #f0e8d0; /* Was #c8a878 */
}
```

#### Task 2.3: Add text shadow for readability
```css
.event-text, .choice-btn {
  text-shadow: 0 2px 4px rgba(0,0,0,0.8);
}
```

#### Task 2.4: Test readability
- Open game
- Verify all text is readable
- Check on mobile/desktop

---

### Phase 3: Fix CI/CD (30 min)

#### Task 3.1: Check GitHub Actions logs
- Go to: https://github.com/joshuascottpaul/house-of-tide/actions
- Click failed run
- Read error message

#### Task 3.2: Common fixes
```yaml
# If permission error, add:
permissions:
  contents: write
  pages: write
  id-token: write
```

#### Task 3.3: Test deploy
- Push small change
- Watch Actions tab
- Verify success

---

### Phase 4: Deploy & Verify (15 min)

#### Task 4.1: Deploy to GitHub Pages
- Wait for CI/CD to complete
- Visit: https://joshuascottpaul.github.io/house-of-tide/

#### Task 4.2: Clear cache & test
- Hard refresh (Cmd+Shift+R)
- Start new game
- Verify background changes
- Verify text is readable

#### Task 4.3: Test on multiple browsers
- Chrome
- Firefox
- Safari

---

## 📊 SUCCESS CRITERIA

| Criterion | Status | Target |
|-----------|--------|--------|
| Background changes per session | ❌ | ✅ |
| Text clearly readable | ❌ | ✅ |
| CI/CD deploys successfully | ❌ | ✅ |
| Background visible (not too dark) | ❌ | ✅ |
| No cats in backgrounds | ✅ | ✅ |

---

## ⏱️ TIMELINE

| Phase | Duration | ETA |
|-------|----------|-----|
| Phase 1: Background Fix | 30 min | Immediate |
| Phase 2: Text Fix | 30 min | +30 min |
| Phase 3: CI/CD Fix | 30 min | +60 min |
| Phase 4: Deploy & Verify | 15 min | +90 min |

**Total: ~1.5 hours to full resolution**

---

## 🚨 IMMEDIATE ACTIONS (Do Now)

1. **Open GitHub Actions** → Check deploy error logs
2. **Fix CSS locally** → Increase overlay opacity
3. **Fix background URL** → Remove lock= parameter
4. **Test locally** → Verify fixes work
5. **Commit & push** → Trigger CI/CD
6. **Monitor deployment** → Watch Actions tab
7. **Verify live site** → Test on GitHub Pages

---

## 📝 NOTES

- User is running from `file://` locally — some features may not work correctly
- GitHub Pages deployment is the priority
- Background images should be subtle, not distracting
- Text must be readable on ALL backgrounds (light and dark)

---

**Status:** 🔴 IN PROGRESS  
**Next Update:** After Phase 1 complete
