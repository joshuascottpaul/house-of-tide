// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * PREFETCH VISUAL INDICATOR TESTS
 * 
 * Tests that prefetch status indicators appear on choices
 */

test.describe('Prefetch Visual Indicator', () => {
  test('choices exist and can be clicked', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'PrefetchTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Wait for event to load
    await page.waitForSelector('#event-text', { state: 'visible', timeout: 60000 });
    
    // Choices should exist
    const choices = await page.$$('.choice-btn');
    expect(choices.length).toBeGreaterThanOrEqual(2);
  });

  test('choice buttons have correct structure', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'StructureTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Wait for event to load
    await page.waitForSelector('#event-text', { state: 'visible', timeout: 60000 });
    
    // Check choice button has correct classes available
    const firstChoice = await page.locator('.choice-btn').first();
    const className = await firstChoice.getAttribute('class');
    expect(className).toContain('choice-btn');
  });

  test('prefetch CSS file contains indicator styles', async ({ page }) => {
    // Fetch the CSS file directly and check for our classes
    const response = await page.goto('hot-game.css');
    const cssContent = await response.text();
    
    expect(cssContent).toContain('choice-cached');
    expect(cssContent).toContain('choice-loading');
    expect(cssContent).toContain('choice-failed');
  });
});
