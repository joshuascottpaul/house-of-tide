// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * BACKGROUND IMAGE TESTS
 * 
 * Tests that background images change correctly
 * Works for both file:// and https:// protocols
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
    
    // Extract random parameter from URLs
    const random1 = bgImage1.match(/random=([^&]+)/)?.[1];
    const random2 = bgImage2.match(/random=([^&]+)/)?.[1];
    
    // Random parameters should be different (different random seeds)
    expect(random1).not.toBe(random2);
    
    await context2.close();
  });

  test('background stays consistent during page navigation', async ({ page }) => {
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
    const lock1 = bgImage1.match(/random=([^&]+)/)?.[1];
    
    // Navigate to another screen and back (simulates phase change)
    await page.click('button:has-text("Save / Load")');
    await page.waitForSelector('#save-overlay', { state: 'visible', timeout: 5000 });
    await page.click('button:has-text("Return")');
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgImage2 = await page.locator('#bg-image').getAttribute('style');
    const lock2 = bgImage2.match(/random=([^&]+)/)?.[1];
    
    // Should be same random parameter (consistent background during session)
    expect(lock1).toBe(lock2);
  });
});
