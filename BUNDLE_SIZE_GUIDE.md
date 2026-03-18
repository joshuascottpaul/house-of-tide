# 📦 House of Tide — Bundle Size Guide

**Last Updated:** March 14, 2026  
**v2.0 Task:** 18/20 (Dev Experience Phase)

---

## 🎯 **PURPOSE**

Monitor and optimize bundle sizes to ensure fast load times.

---

## 📊 **SIZE BUDGETS**

| Asset Type | Budget | Warning | Error |
|------------|--------|---------|-------|
| **Total Bundle** | 500 KB | 400 KB | 500 KB |
| **JavaScript** | 300 KB | 250 KB | 300 KB |
| **CSS** | 100 KB | 80 KB | 100 KB |
| **HTML** | 50 KB | 40 KB | 50 KB |

---

## 🛠️ **USAGE**

### **Development:**
```bash
# Start dev server with HMR
npm run dev

# Open http://localhost:8080
# Changes auto-reload
```

### **Production Build:**
```bash
# Build optimized bundle
npm run build

# View bundle analysis
npm run analyze

# Opens bundle-report.html in browser
```

### **Testing:**
```bash
# Run tests
npm test

# Run with UI
npm run test:ui

# View test report
npm run test:report
```

---

## 📈 **BUNDLE ANALYSIS**

The bundle report shows:
- Total bundle size
- Size per module
- Dependencies tree
- Duplicate modules
- Large dependencies

**Target:** Keep total bundle under 500 KB

---

## 🔧 **OPTIMIZATION TIPS**

### **Code Splitting:**
```javascript
// Split vendor code
optimization: {
  splitChunks: {
    chunks: 'all'
  }
}
```

### **Tree Shaking:**
```javascript
// Ensure ES6 modules for tree shaking
// Use named exports, not default exports
```

### **Compression:**
```javascript
// Enable gzip/brotli compression
// Configure in production server
```

---

## ✅ **COMPLETION CRITERIA**

- [x] Webpack configuration created
- [x] Hot Module Reloading working
- [x] Bundle analyzer configured
- [x] Size budgets defined
- [x] Build scripts added to package.json

---

**The ledger is open. The bundle is optimized. Load times are fast.** ⚓
