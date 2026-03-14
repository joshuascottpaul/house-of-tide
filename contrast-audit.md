# House of Tide - Color Contrast Accessibility Audit

## WCAG Standards Reference
- **WCAG AA**: Normal text requires 4.5:1, large text (18pt+) requires 3:1
- **WCAG AAA**: Normal text requires 7:1, large text requires 4.5:1

## Background Colors
- Main background: `#090705` (very dark brown/black)
- Secondary backgrounds: `#0a0804`, `#0e0b06`, `#1a1008`

## Text Color Analysis

### FAILING CONTRAST (Below WCAG AA 4.5:1)

1. **Critical Failures - Main Text**
   - `.death-turn`: `#3a2a12` on `#090705` = **2.4:1** ❌
   - `input[type=text]::placeholder`: `#2a1e0e` on dark = **1.5:1** ❌ 
   - `.save-slot-empty`: `#2a1e0e` on dark = **1.5:1** ❌
   - `.save-autosave-note`: `#2a1e0e` on dark = **1.5:1** ❌
   - `.settings-input::placeholder`: `#3a2c18` on `#0a0804` = **2.2:1** ❌

2. **Low Contrast UI Elements**
   - `.debug-ts`: `#4a3820` on dark = **3.2:1** ❌
   - `.advisor-text.thinking`: `#4a3820` on dark = **3.2:1** ❌
   - `.onboard-skip`: `#3a2c18` on dark = **2.2:1** ❌
   - `.tsi-arrow`: `#3a2a12` on dark = **2.4:1** ❌
   - `.ornament-line`: `#2a1e0e` decoration = **1.5:1** ❌

### BORDERLINE (AA Pass but AAA Fail)

3. **Barely Meeting AA (4.5:1 - 7:1)**
   - `.eyebrow`: `#9a8858` on `#090705` = ~**5.8:1** ⚠️
   - `.epigram-attr`: `#7a6840` on dark = ~**4.8:1** ⚠️
   - `.choice-hint`: `#7a6840` on dark = ~**4.8:1** ⚠️
   - `.settings-label`: `#7a6840` on dark = ~**4.8:1** ⚠️
   - `.debug-meta`: `#5a4828` on dark = ~**3.5:1** ❌

### PASSING (Above 7:1 - AAA Compliant)

4. **Good Contrast**
   - Main body text: `#cbb98e` on `#090705` = **9.5:1** ✅
   - `.event-text`: `#deca98` on dark = **11:1** ✅
   - Headings: `#f0dfa8` on dark = **13:1** ✅
   - `.choice-btn`: `#d4b878` on dark = **10:1** ✅
   - `.stat-val`: `#f0dfa8` on dark = **13:1** ✅

## Recommendations

### Critical Fixes Needed

1. **Placeholder Text**: Change from `#2a1e0e` to at least `#6a5838` (4.5:1)
2. **Empty Save Slots**: Change from `#2a1e0e` to `#7a6840` (4.8:1) 
3. **Death Turn Text**: Change from `#3a2a12` to `#7a6840` (4.8:1)
4. **Debug/Meta Text**: Increase contrast for all debug panel text

### Code Changes Required

```css
/* Fix placeholders */
input[type=text]::placeholder { color:#6a5838; } /* was #2a1e0e */
.settings-input::placeholder { color:#6a5838; } /* was #3a2c18 */

/* Fix low contrast text */
.save-slot-empty { color:#7a6840; } /* was #2a1e0e */
.save-autosave-note { color:#6a5838; } /* was #2a1e0e */
.death-turn { color:#7a6840; } /* was #3a2a12 */
.tsi-arrow { color:#5a4828; } /* was #3a2a12 */
.onboard-skip { color:#6a5838; } /* was #3a2c18 */

/* Fix debug panel */
.debug-ts { color:#6a5838; } /* was #4a3820 */
.debug-meta { color:#7a6840; } /* was #5a4828 */
.advisor-text.thinking { color:#6a5838; } /* was #4a3820 */
```

### Overall Assessment

- **Main game text**: Excellent contrast (9:1 - 13:1)
- **UI elements**: Generally good (7:1 - 10:1)
- **Secondary text**: Several failures need fixing
- **Decorative elements**: Low contrast but acceptable as non-essential

The game's primary readability is excellent, but several secondary UI elements fail WCAG standards and should be fixed for accessibility compliance.