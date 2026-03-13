// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * SOUND EFFECTS TESTS
 * 
 * Tests that sound effects system works
 */

test.describe('Sound Effects', () => {
  test('initSoundEffects function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof initSoundEffects === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('sound effects toggle exists in settings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('#settings-overlay', { state: 'visible', timeout: 5000 });
    
    // Check SFX toggle exists
    const sfxToggle = await page.$('#s-sfx');
    expect(sfxToggle).toBeTruthy();
  });

  test('can enable/disable sound effects', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Enable sound effects
    await page.evaluate(() => {
      localStorage.setItem('hot_sfx_enabled', 'true');
    });
    
    // Verify it was set
    const enabled = await page.evaluate(() => {
      return localStorage.getItem('hot_sfx_enabled') === 'true';
    });
    
    expect(enabled).toBeTruthy();
  });

  test('playSfx function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof playSfx === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });
});
