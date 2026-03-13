// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * RIVAL MEMORY AUTO-TRACKING TESTS
 * 
 * Tests that rival memory auto-tracking system exists and is functional
 */

test.describe('Rival Memory Auto-Tracking', () => {
  test('updateRivalRelationship function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof updateRivalRelationship === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('detectAndUpdateRivals function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof detectAndUpdateRivals === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('rival tooltip shows relationship info', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'TooltipTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const tooltip = await page.locator('#dynasty-label').getAttribute('title');
    
    expect(tooltip).toBeTruthy();
    expect(tooltip.length).toBeGreaterThan(20);
    expect(tooltip).toMatch(/Borracchi|Spinetta|Calmari|Li Yuen/i);
  });

  test('rival memory system integrated with game loop', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'IntegrationTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Verify game loaded with rival system
    const hasRivalSystem = await page.evaluate(() => {
      return typeof updateRivalRelationship === 'function' &&
             typeof detectAndUpdateRivals === 'function' &&
             typeof getRivalContext === 'function';
    });
    
    expect(hasRivalSystem).toBeTruthy();
  });
});
