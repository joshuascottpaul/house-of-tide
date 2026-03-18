# 📝 House of Tide — JSDoc Type Hints Guide

**Last Updated:** March 14, 2026  
**v2.0 Task:** 13/20 (Code Quality Phase)

---

## 🎯 **PURPOSE**

Add JSDoc type hints to all public functions for:
- IDE autocomplete
- Type safety
- Better documentation
- Easier onboarding

---

## 📋 **TYPE HINT STANDARDS**

### **Basic Types:**
```javascript
/**
 * @param {string} name - Parameter description
 * @param {number} count - Parameter description
 * @param {boolean} enabled - Parameter description
 * @param {object} options - Parameter description
 * @param {array} items - Parameter description
 * @returns {boolean} Return description
 */
```

### **Custom Types:**
```javascript
/**
 * @typedef {Object} GameState
 * @property {string} dynastyName - Dynasty name
 * @property {number} marks - Current marks
 * @property {number} reputation - Current reputation (0-10)
 * @property {number} ships - Number of ships
 * @property {number} turn - Current turn/year
 */

/**
 * @param {GameState} state - Game state object
 * @returns {GameState} Updated game state
 */
```

### **Optional Parameters:**
```javascript
/**
 * @param {string} name - Required parameter
 * @param {number} [age] - Optional parameter
 * @param {string} [title='Default'] - Optional with default
 */
```

### **Multiple Types:**
```javascript
/**
 * @param {string|number} id - Can be string or number
 * @returns {boolean|null} Returns boolean or null on error
 */
```

---

## 📁 **FILES TO UPDATE**

### **Priority 1: Core Systems (4-5 hours)**

| File | Lines | Priority |
|------|-------|----------|
| hot-state.js | 396 | HIGH |
| hot-economy.js | 447 | HIGH |
| hot-trading.js | 670 | HIGH |
| hot-events.js | 490 | HIGH |

### **Priority 2: Infrastructure (2-3 hours)**

| File | Lines | Priority |
|------|-------|----------|
| hot-logger.js | 250 | MEDIUM |
| hot-debug.js | 200 | MEDIUM |
| hot-performance.js | 250 | MEDIUM |
| hot-constants.js | 300 | MEDIUM |

### **Priority 3: Modules (2-3 hours)**

| File | Lines | Priority |
|------|-------|----------|
| hot-background.js | 77 | LOW |
| hot-combat.js | 284 | LOW |
| hot-tutorials.js | 151 | LOW |
| hot-victory.js | 105 | LOW |
| hot-threads.js | 198 | LOW |
| hot-yearend.js | 227 | LOW |

---

## ✨ **EXAMPLES**

### **Before:**
```javascript
function buyCargo(commodity, qty) {
  qty = parseInt(qty, 10);
  // ... implementation
}
```

### **After:**
```javascript
/**
 * Buy cargo of specified commodity
 * @param {string} commodity - Commodity ID (saltfish, wine, alum, tin)
 * @param {number} qty - Quantity to buy (must be positive integer)
 * @returns {boolean} True if purchase successful, false otherwise
 */
function buyCargo(commodity, qty) {
  qty = parseInt(qty, 10);
  // ... implementation
}
```

---

### **Before:**
```javascript
function checkVictoryConditions() {
  // ... implementation
  return 'economic';
}
```

### **After:**
```javascript
/**
 * Check if any victory condition is met
 * @returns {string|null} Victory type ('economic', 'political', 'dynastic') or null
 */
function checkVictoryConditions() {
  // ... implementation
}
```

---

### **Before:**
```javascript
function addThread(label, type, expiresYear, urgency) {
  // ... implementation
}
```

### **After:**
```javascript
/**
 * Add a new thread (unfinished business)
 * @param {string} label - Thread label (e.g., "Borracchi debt")
 * @param {string} type - Thread type for matching events
 * @param {number} expiresYear - Year when thread expires
 * @param {string} [urgency='normal'] - Urgency level (normal, warning, urgent)
 * @returns {object} Thread object
 */
function addThread(label, type, expiresYear, urgency = 'normal') {
  // ... implementation
}
```

---

## 🎯 **IMPLEMENTATION ORDER**

### **Phase 1: Core Systems (4-5 hours)**
```
□ hot-state.js - GameState, save/load functions
□ hot-economy.js - Economic functions
□ hot-trading.js - Trading functions
□ hot-events.js - Event generation functions
```

### **Phase 2: Infrastructure (2-3 hours)**
```
□ hot-logger.js - Logging functions
□ hot-debug.js - Debug functions
□ hot-performance.js - Performance functions
□ hot-constants.js - Constant definitions
```

### **Phase 3: Modules (2-3 hours)**
```
□ hot-background.js - Background functions
□ hot-combat.js - Combat functions
□ hot-tutorials.js - Tutorial functions
□ hot-victory.js - Victory functions
□ hot-threads.js - Thread functions
□ hot-yearend.js - Year-end functions
```

---

## 📊 **BENEFITS**

| Benefit | Impact |
|---------|--------|
| **IDE Autocomplete** | Faster development |
| **Type Safety** | Fewer bugs |
| **Documentation** | Easier onboarding |
| **Refactoring** | Safer code changes |
| **Testing** | Clearer function contracts |

---

## ✅ **COMPLETION CRITERIA**

- [ ] All public functions have JSDoc comments
- [ ] All parameters have type hints
- [ ] All return values documented
- [ ] Custom types defined for complex objects
- [ ] Optional parameters marked with []
- [ ] Default values documented

---

**The ledger is open. The types are clear. Code with confidence.** ⚓
