// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * RIVAL TOOLTIP TEST
 * 
 * Verifies that the rival status tooltip appears on the dynasty label
 */

test.describe('Rival Status Tooltip', () => {
  test('dynasty label has tooltip attribute', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'TooltipTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#dynasty-label', { state: 'visible', timeout: 5000 });
    
    // Check dynasty label has title attribute (tooltip)
    const dynastyLabel = await page.locator('#dynasty-label');
    const title = await dynastyLabel.getAttribute('title');
    
    // Title should exist and contain rival info
    expect(title).toBeTruthy();
    expect(title.length).toBeGreaterThan(10);
    
    // Should contain rival family names
    expect(title).toMatch(/Borracchi|Spinetta|Calmari|Li Yuen/i);
  });

  test('dynasty label has help cursor', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'CursorTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#dynasty-label', { state: 'visible', timeout: 5000 });
    
    // Check cursor style is help
    const dynastyLabel = await page.locator('#dynasty-label');
    const cursorStyle = await dynastyLabel.evaluate(el => 
      window.getComputedStyle(el).cursor
    );
    
    expect(cursorStyle).toBe('help');
  });

  test('rival tooltip shows relationship status', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'RivalTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#dynasty-label', { state: 'visible', timeout: 5000 });
    
    // Get tooltip content
    const dynastyLabel = await page.locator('#dynasty-label');
    const title = await dynastyLabel.getAttribute('title');
    
    // Should show relationship tiers (Allied, Friendly, Neutral, Hostile, or Enemies)
    expect(title).toMatch(/Allied|Friendly|Neutral|Hostile|Enemies/i);
    
    // Should show numeric values
    expect(title).toMatch(/\(\+?\d+\)/);
  });
});
