# GitHub Pages Deployment Troubleshooting

**Date**: 2026-03-14  
**Issue**: Changes deployed successfully but live site showed old version  
**Resolution**: Systematic troubleshooting revealed `index.html` vs `house-of-tide.html` mismatch

## Problem Summary

- Committed and pushed new features to `main` branch ✅
- CI/CD deployed to `gh-pages` branch successfully ✅  
- `gh-pages` branch contained latest content ✅
- Live site at https://joshuascottpaul.github.io/house-of-tide/ showed old version ❌

## Root Cause Analysis

### Systematic Investigation Steps

1. **Verified `gh-pages` content** ✅
   ```bash
   git checkout gh-pages
   grep "🔴 Live Share" house-of-tide.html  # FOUND
   ```

2. **Checked GitHub Pages build status** ❌
   ```bash
   gh api repos/joshuascottpaul/house-of-tide/pages/builds --jq '.[0]'
   # Build used old commit SHA, not latest
   ```

3. **Forced new build** ✅
   ```bash
   git commit --allow-empty -m "Force rebuild"
   git push origin gh-pages
   ```

4. **Tested specific vs root URLs** 🎯
   ```bash
   curl "https://joshuascottpaul.github.io/house-of-tide/house-of-tide.html" | grep "Live Share"  # FOUND
   curl "https://joshuascottpaul.github.io/house-of-tide/" | grep "Live Share"  # NOT FOUND
   ```

### Root Cause Identified

**GitHub Pages serves `index.html` by default**, but our updates were only in `house-of-tide.html`

- Main game content: `house-of-tide.html` (updated)
- Default page: `index.html` (outdated)
- Users visiting root URL got outdated content

## Solution Implemented

**Option 1**: Copy content to `index.html` (creates duplication)  
**Option 2**: Redirect `index.html` to `house-of-tide.html` ✅

### Final Implementation
```html
<!-- index.html -->
<!DOCTYPE html>
<html>
<head>
<meta http-equiv="refresh" content="0; url=house-of-tide.html">
<title>House of Tide</title>
</head>
<body>
<h1>House of Tide</h1>
<p>Redirecting to game...</p>
<p><a href="house-of-tide.html">Click here if not redirected automatically</a></p>
</body>
</html>
```

## Prevention for Future

### Pre-deployment Checklist
- [ ] Test both `index.html` and main file contain updates
- [ ] Verify GitHub Pages build uses latest commit SHA
- [ ] Test root URL and specific file URLs separately

### Troubleshooting Commands
```bash
# Quick verification commands
gh api repos/joshuascottpaul/house-of-tide/pages/builds --jq '.[0] | {status, commit, created_at}'
curl -s "https://joshuascottpaul.github.io/house-of-tide/" | grep "your-feature"
curl -s "https://joshuascottpaul.github.io/house-of-tide/house-of-tide.html" | grep "your-feature"
```

## Lessons Learned

1. **Always test both root URL and specific files** when troubleshooting deployment issues
2. **GitHub Pages defaults to `index.html`** - ensure it's current or redirects properly  
3. **Systematic step-by-step troubleshooting** is more effective than assuming causes
4. **Commit SHA verification** helps identify stale builds vs content issues

## Time to Resolution
- **Total time**: ~45 minutes
- **Issue identification**: ~30 minutes (systematic steps)
- **Solution implementation**: ~15 minutes (redirect setup)

## Impact
- ✅ Live site now shows latest features
- ✅ Clean redirect solution (no content duplication)
- ✅ Future deployments will work correctly
- ✅ Troubleshooting documented for future reference