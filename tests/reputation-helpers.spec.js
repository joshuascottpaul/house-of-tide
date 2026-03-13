// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * REPUTATION HELPERS TESTS
 * 
 * Tests for getRepTier(), getRepLabel(), and REP_THRESHOLDS
 */

test.describe('Reputation Helpers', () => {
  test('REP_THRESHOLDS constants are correct', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const thresholds = await page.evaluate(() => REP_THRESHOLDS);
    
    expect(thresholds.LEGENDARY).toBe(9);
    expect(thresholds.RENOWNED).toBe(7);
    expect(thresholds.ESTABLISHED).toBe(5);
    expect(thresholds.PRECARIOUS).toBe(3);
  });

  test('getRepTier() returns correct tier for each threshold', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const tiers = await page.evaluate(() => {
      return {
        legendary: getRepTier(10),
        legendary9: getRepTier(9),
        renowned: getRepTier(8),
        renowned7: getRepTier(7),
        established: getRepTier(6),
        established5: getRepTier(5),
        precarious: getRepTier(4),
        precarious3: getRepTier(3),
        disgraced2: getRepTier(2),
        disgraced1: getRepTier(1),
        disgraced0: getRepTier(0),
      };
    });
    
    expect(tiers.legendary).toBe('Legendary');
    expect(tiers.legendary9).toBe('Legendary');
    expect(tiers.renowned).toBe('Renowned');
    expect(tiers.renowned7).toBe('Renowned');
    expect(tiers.established).toBe('Established');
    expect(tiers.established5).toBe('Established');
    expect(tiers.precarious).toBe('Precarious');
    expect(tiers.precarious3).toBe('Precarious');
    expect(tiers.disgraced2).toBe('Disgraced');
    expect(tiers.disgraced1).toBe('Disgraced');
    expect(tiers.disgraced0).toBe('Disgraced');
  });

  test('getRepLabel() returns correct label for each tier', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const labels = await page.evaluate(() => {
      return {
        legendary: getRepLabel(9),
        renowned: getRepLabel(7),
        established: getRepLabel(5),
        precarious: getRepLabel(3),
        disgraced: getRepLabel(1),
      };
    });
    
    expect(labels.legendary).toBe('the name sets the terms');
    expect(labels.renowned).toBe('favourable terms');
    expect(labels.established).toBe('standard terms');
    expect(labels.precarious).toBe('reduced terms');
    expect(labels.disgraced).toBe('hostile terms');
  });

  test('UI uses getRepTier() for reputation display', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'RepTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Starting rep is 5 (Established)
    const repTier = await page.locator('#stat-rep-tier').textContent();
    expect(repTier).toBe('Established');
  });
});
