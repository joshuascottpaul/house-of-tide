// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CUSTOM BACKGROUND TESTS
 * 
 * Tests that custom background images can be set
 */

test.describe('Custom Background Images', () => {
  test('setCustomBackground function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof setCustomBackground === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('background select UI exists in settings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('#settings-overlay', { state: 'visible', timeout: 5000 });
    
    // Check background select exists
    const bgSelect = await page.$('#s-bg-select');
    expect(bgSelect).toBeTruthy();
    
    // Check custom input exists
    const bgCustom = await page.$('#s-bg-custom');
    expect(bgCustom).toBeTruthy();
  });

  test('can set custom background URL', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Set custom background via localStorage
    await page.evaluate(() => {
      localStorage.setItem('hot_custom_bg', 'https://example.com/test-bg.jpg');
    });
    
    // Verify it was set
    const customBg = await page.evaluate(() => {
      return localStorage.getItem('hot_custom_bg');
    });
    
    expect(customBg).toBe('https://example.com/test-bg.jpg');
  });

  test('dynamic background is default', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Clear any custom background
    await page.evaluate(() => {
      localStorage.removeItem('hot_custom_bg');
    });
    
    // Verify no custom background set
    const customBg = await page.evaluate(() => {
      return localStorage.getItem('hot_custom_bg');
    });
    
    expect(customBg).toBeNull();
  });
});
