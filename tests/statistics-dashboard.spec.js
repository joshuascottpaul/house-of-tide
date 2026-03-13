// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * STATISTICS DASHBOARD TESTS
 * 
 * Tests that statistics dashboard works
 */

test.describe('Statistics Dashboard', () => {
  test('getStats function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof getStats === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('showStatsDashboard function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof showStatsDashboard === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('stats button exists on title screen', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const statsBtn = await page.$('button:has-text("Stats")');
    expect(statsBtn).toBeTruthy();
  });

  test('stats dashboard can be opened', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Click stats button
    await page.click('button:has-text("Stats")');
    await page.waitForTimeout(500);
    
    // Stats overlay should be visible
    const overlay = await page.$('.stats-overlay');
    expect(overlay).toBeTruthy();
  });

  test('stats are initialized with default values', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const stats = await page.evaluate(() => {
      return getStats();
    });
    
    expect(stats.gamesPlayed).toBe(0);
    expect(stats.totalYears).toBe(0);
    expect(stats.totalGenerations).toBe(0);
  });
});
