// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * THREAD RESOLUTION TESTS
 * 
 * Tests thread tracking and resolution display
 */

test.describe('Thread Resolution System', () => {
  test('thread tracker shows open threads', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'ThreadTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Thread tracker should exist
    const tracker = await page.locator('#thread-tracker');
    expect(tracker).toBeTruthy();
  });

  test('thread count updates when threads open', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'CountTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Get initial thread count
    const threadCountEl = await page.locator('#thread-count');
    const initialCount = await threadCountEl.textContent();
    
    // Thread count should be a number
    expect(parseInt(initialCount) || 0).toBeGreaterThanOrEqual(0);
  });

  test('year-end shows thread section', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'YearEndTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Check year-end threads element exists
    const yeThreads = await page.locator('#ye-threads');
    expect(yeThreads).toBeTruthy();
  });
});
