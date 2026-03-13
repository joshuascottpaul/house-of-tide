# 🚀 Deployment Guide

## Quick Start (5 minutes)

### Step 1: Enable GitHub Pages

1. Go to your repository on GitHub:
   ```
   https://github.com/joshuascottpaul/house-of-tide/settings/pages
   ```

2. Under **Build and deployment**:
   - **Source:** Deploy from a branch
   - **Branch:** Select `gh-pages` → `/(root)`
   - Click **Save**

### Step 2: Wait for Deployment

The CI/CD pipeline will automatically:
1. ✅ Run all 62 tests
2. ✅ Deploy to GitHub Pages (if tests pass)
3. ✅ Create your live URL

### Step 3: Access Your Game

Your game will be live at:
```
https://joshuascottpaul.github.io/house-of-tide/
```

---

## Manual Deployment (Alternative)

If auto-deployment doesn't work:

### Option A: Use gh-pages Branch

```bash
# 1. Create gh-pages branch
git checkout --orphan gh-pages
git reset --hard

# 2. Copy all game files
git checkout main -- .

# 3. Deploy
git add .
git commit -m "Deploy House of Tide"
git push origin gh-pages --force
```

### Option B: Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com)
2. Drag & drop the `house-of-tide` folder
3. Done! You get a URL like: `house-of-tide.netlify.app`

### Option C: Vercel

1. Go to [vercel.com](https://vercel.com)
2. Import your GitHub repo
3. Done! You get a URL like: `house-of-tide.vercel.app`

---

## Troubleshooting

### GitHub Pages Not Deploying?

1. **Check Actions Tab:**
   ```
   https://github.com/joshuascottpaul/house-of-tide/actions
   ```
   
2. **Look for failed workflows**
   - Click on the failed run
   - See what error occurred

3. **Common Issues:**
   - Tests failing → Fix code and push again
   - Permissions issue → Enable GitHub Pages in settings
   - Wrong branch → Make sure gh-pages branch exists

### Game Loads But Doesn't Work?

1. **Open Browser Console** (F12)
2. **Look for errors**
3. **Common fixes:**
   - Clear browser cache
   - Check file paths (should be relative)
   - Verify all JS files loaded

### CI/CD Pipeline Failing?

```bash
# Run tests locally first
cd house-of-tide
npm install
npx playwright test

# Fix any failing tests
# Then push again
git push origin main
```

---

## Share Your Game

### With Playtesters

Send them this URL:
```
https://joshuascottpaul.github.io/house-of-tide/
```

### Feedback Form Template

```
House of Tide Playtest Feedback

1. What backend did you use?
   [ ] MLX (local)
   [ ] OpenAI (cloud)
   [ ] Claude (cloud)
   [ ] Ollama (local)

2. How was the performance?
   [ ] Fast
   [ ] Acceptable
   [ ] Slow

3. Did you encounter any bugs?
   [ ] Yes (describe below)
   [ ] No

4. What did you enjoy most?

5. What needs improvement?

6. How many years did you survive?

7. What was your highest reputation?
```

---

## Post-Launch Updates

### Pushing Updates

```bash
# Make your changes
git add .
git commit -m "feat: Added new feature"
git push origin main

# CI/CD will auto-deploy!
```

### Version History

Update `CHANGELOG.md` with each release:

```markdown
## [1.0.1] - 2026-03-13
### Fixed
- Bug fixes from playtester feedback

### Added
- New features based on requests
```

---

## Analytics (Optional)

### Add Google Analytics

Add to `house-of-tide.html` before `</head>`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### GitHub Traffic

Check repo traffic:
```
https://github.com/joshuascottpaul/house-of-tide/graphs/traffic
```

---

## Success Metrics

Track these after launch:

- **Unique Players** — GitHub Pages views
- **Completion Rate** — How many reach year 5+
- **Favorite Backend** — Which backend most used
- **Bug Reports** — Issues opened on GitHub
- **Feature Requests** — What players want next

---

## 🏴‍☠️ The Ledger Awaits

**Your game is ready. Deploy it. Share it. Watch dynasties rise and fall.**

**Good luck, Founder.** ⚓
