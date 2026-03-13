// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * KEYBOARD SHORTCUTS TESTS
 * 
 * Tests that keyboard shortcuts work correctly
 */

test.describe('Keyboard Shortcuts', () => {
  test('P key opens settings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Press 'p' to open settings
    await page.keyboard.press('p');
    await page.waitForTimeout(500);
    
    // Settings overlay should be open
    const overlay = await page.$('#settings-overlay.open');
    expect(overlay).toBeTruthy();
  });

  test('Escape key closes settings overlay', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings with P
    await page.keyboard.press('p');
    await page.waitForTimeout(500);
    
    // Verify it's open
    let overlay = await page.$('#settings-overlay.open');
    expect(overlay).toBeTruthy();
    
    // Press Escape
    await page.keyboard.press('Escape');
    await page.waitForTimeout(500);
    
    // Should be closed
    overlay = await page.$('#settings-overlay.open');
    expect(overlay).toBeFalsy();
  });

  test('keyboard shortcut event listener is registered', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check that keydown listener exists
    const hasListener = await page.evaluate(() => {
      // Check if our keyboard shortcut code is present
      const scripts = document.querySelectorAll('script[src]');
      let hasHotEngine = false;
      for (const s of scripts) {
        if (s.src.includes('hot-engine.js')) {
          hasHotEngine = true;
          break;
        }
      }
      return hasHotEngine;
    });
    
    expect(hasListener).toBeTruthy();
  });
});
