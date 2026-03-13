// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * BACKGROUND IMAGE TESTS
 * 
 * Tests that background images change correctly
 */

test.describe('Background Images', () => {
  test('background element exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const bgElement = await page.$('#bg-image');
    expect(bgElement).toBeTruthy();
  });

  test('background image is set on game start', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'BgTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Check background image is set
    const bgImage = await page.locator('#bg-image').getAttribute('style');
    expect(bgImage).toContain('background-image');
    expect(bgImage).toContain('loremflickr.com');
  });

  test('background excludes cats', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'NoCats');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Check background URL contains ~cats filter
    const bgImage = await page.locator('#bg-image').getAttribute('style');
    expect(bgImage).toContain('~cats');
  });

  test('background changes on new game session', async ({ page }) => {
    // Game 1
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'Game1');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgImage1 = await page.locator('#bg-image').getAttribute('style');
    
    // New game (new browser context = new session)
    const context2 = await page.context().browser().newContext();
    const page2 = await context2.newPage();
    
    await page2.goto('house-of-tide.html');
    await page2.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    await page2.click('button:has-text("Begin the Founding")');
    await page2.fill('#input-dynasty', 'Game2');
    await page2.fill('#input-founder', 'Tester');
    await page2.click('button:has-text("Open the Ledger")');
    await page2.click('button:has-text("Skip")');
    await page2.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgImage2 = await page2.locator('#bg-image').getAttribute('style');
    
    // Extract random seed from URLs
    const seed1 = bgImage1.match(/lock=.*?([a-z0-9]+)/)?.[1];
    const seed2 = bgImage2.match(/lock=.*?([a-z0-9]+)/)?.[1];
    
    // Seeds should be different (different random images)
    expect(seed1).not.toBe(seed2);
    
    await context2.close();
  });

  test('background stays consistent during same session', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'Consistent');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgImage1 = await page.locator('#bg-image').getAttribute('style');
    
    // Refresh page (same session)
    await page.reload();
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgImage2 = await page.locator('#bg-image').getAttribute('style');
    
    // Should be same seed (consistent background)
    expect(bgImage1).toBe(bgImage2);
  });
});
