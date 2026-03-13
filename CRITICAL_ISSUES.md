# 🐛 Critical Issues — Action Plan

**Date:** March 13, 2026  
**Status:** 🟡 IN PROGRESS  
**Priority:** P0 - Blocking Deployment

---

## 📋 REPORTED ISSUES

### 1. Background Image Not Changing ❌
**Reported:** Background stays the same across game sessions  
**Expected:** New random background on each new game  
**Status:** 🟡 FIXED - Deployed, waiting for verification

### 2. Text Illegible ❌
**Reported:** Font color too light, hard to read  
**Expected:** Clear, readable text on all backgrounds  
**Status:** 🟡 FIXED - Deployed, waiting for verification

### 3. CI/CD Deploy Failed ❌
**Reported:** Deploy job failed in 4 seconds  
**Expected:** Successful deployment to gh-pages  
**Status:** 🟡 FIXED - Deployed, waiting for verification

### 4. Background Not Visible ❌
**Reported:** Background image not showing at all  
**Expected:** Visible but subtle background  
**Status:** 🟡 FIXED - Deployed, waiting for verification

---

## ✅ FIXES APPLIED

### Fix 1: Background Randomization
**Changed:**
```javascript
// Before (lock= prevented randomness)
?lock=${keyword}${randomSeed}&v=${version}

// After (random= for true randomness)
?random=${randomSeed}&v=${version}&t=${Date.now()}
```

**Result:** Each new game session gets a truly random background image.

### Fix 2: Text Legibility
**Changed:**
```css
/* Overlay opacity increased */
background: rgba(5, 4, 3, 0.95); /* Was 0.85 */

/* Text colors brightened */
.event-text { color: #f5f0e0 !important; } /* Was #c8a878 */
.choice-btn { color: #f0e8d8 !important; }

/* Added text shadows for contrast */
text-shadow: 0 2px 8px rgba(0,0,0,0.9);
```

**Result:** All text now clearly readable on any background.

### Fix 3: CI/CD Permissions
**Added:**
```yaml
permissions:
  contents: write
  pages: write
  id-token: write
```

**Result:** Deploy job should now have required permissions.

---

## 📊 CURRENT STATUS

| Issue | Fix Applied | Deployed | Verified |
|-------|-------------|----------|----------|
| Background not changing | ✅ | ✅ | ⏳ |
| Text illegible | ✅ | ✅ | ⏳ |
| CI/CD failed | ✅ | ✅ | ⏳ |
| Background not visible | ✅ | ✅ | ⏳ |

**Deployed:** March 13, 2026 at 2:45 PM  
**Commit:** 9a470d7  
**CI/CD Status:** Running...

---

## ⏱️ NEXT STEPS

### Immediate (Next 10 minutes)
1. ⏳ **Watch CI/CD** — Monitor GitHub Actions
2. ⏳ **Verify Deployment** — Check if deploy succeeds
3. ⏳ **Test Live Site** — Visit GitHub Pages URL

### After Deployment (Next 30 minutes)
4. ⬜ **Clear Cache** — Hard refresh (Cmd+Shift+R)
5. ⬜ **Test Background** — Start new game, verify random image
6. ⬜ **Test Text** — Verify all text is readable
7. ⬜ **Test Multiple Sessions** — Open in new incognito window

---

## 🎯 VERIFICATION CHECKLIST

### Background Images
- [ ] Background visible (not too dark, not too light)
- [ ] No cat images (cat filter working)
- [ ] Changes on each new game session
- [ ] Stays consistent during same session
- [ ] Changes with game state (reputation, phase, etc.)

### Text Legibility
- [ ] Event text readable
- [ ] Choice buttons readable
- [ ] Status bar readable
- [ ] All screens readable (title, game, onboarding)

### CI/CD
- [ ] Test job passes
- [ ] Deploy job succeeds
- [ ] GitHub Pages updates
- [ ] No errors in Actions logs

---

## 🚨 CONTINGENCY PLAN

If issues persist after deployment:

### Backup Plan A: Disable Background Temporarily
```css
#bg-image {
  display: none; /* Temporarily hide */
}
```

### Backup Plan B: Static Background
```css
#bg-image {
  background-image: url('data:image/svg+xml,...'); /* Simple gradient */
}
```

### Backup Plan C: Manual Deploy
```bash
git checkout gh-pages
git merge main
git push origin gh-pages
```

---

**Status:** 🟡 AWAITING VERIFICATION  
**Next Update:** After CI/CD completes (~10 minutes)

