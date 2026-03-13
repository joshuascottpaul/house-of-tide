// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * UNIT TESTS - Core Game Functions
 * 
 * Tests pure functions that don't require full game state
 */

test.describe('Unit Tests - Core Functions', () => {
  test('getSeason returns correct 4-season cycle', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const seasons = await page.evaluate(() => {
      return [
        getSeason(1),   // Spring
        getSeason(2),   // Summer
        getSeason(3),   // Autumn
        getSeason(4),   // Winter
        getSeason(5),   // Spring again
        getSeason(8),   // Winter (8 % 4 === 0, index 3)
      ];
    });
    
    expect(seasons).toEqual(['Spring', 'Summer', 'Autumn', 'Winter', 'Spring', 'Winter']);
  });

  test('getRepTier returns correct tier for reputation values', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const tiers = await page.evaluate(() => {
      return {
        10: getRepTier(10),
        9: getRepTier(9),
        8: getRepTier(8),
        7: getRepTier(7),
        6: getRepTier(6),
        5: getRepTier(5),
        4: getRepTier(4),
        3: getRepTier(3),
        2: getRepTier(2),
        1: getRepTier(1),
        0: getRepTier(0),
      };
    });
    
    expect(tiers[10]).toBe('Legendary');
    expect(tiers[9]).toBe('Legendary');
    expect(tiers[8]).toBe('Renowned');
    expect(tiers[7]).toBe('Renowned');
    expect(tiers[6]).toBe('Established');
    expect(tiers[5]).toBe('Established');
    expect(tiers[4]).toBe('Precarious');
    expect(tiers[3]).toBe('Precarious');
    expect(tiers[2]).toBe('Disgraced');
    expect(tiers[1]).toBe('Disgraced');
    expect(tiers[0]).toBe('Disgraced');
  });

  test('getRepLabel returns correct label for reputation values', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const labels = await page.evaluate(() => {
      return {
        9: getRepLabel(9),
        7: getRepLabel(7),
        5: getRepLabel(5),
        3: getRepLabel(3),
        1: getRepLabel(1),
      };
    });
    
    expect(labels[9]).toBe('the name sets the terms');
    expect(labels[7]).toBe('favourable terms');
    expect(labels[5]).toBe('standard terms');
    expect(labels[3]).toBe('reduced terms');
    expect(labels[1]).toBe('hostile terms');
  });

  test('REP_THRESHOLDS constants are correct', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const thresholds = await page.evaluate(() => REP_THRESHOLDS);
    
    expect(thresholds.LEGENDARY).toBe(9);
    expect(thresholds.RENOWNED).toBe(7);
    expect(thresholds.ESTABLISHED).toBe(5);
    expect(thresholds.PRECARIOUS).toBe(3);
  });

  test('formatHeirText replaces pronouns correctly', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const result = await page.evaluate(() => {
      const pronouns = { sub: 'he', pos: 'his', cap: 'He' };
      const template = 'They said their choice was bold. There is no going back.';
      return formatHeirText(template, pronouns);
    });
    
    expect(result).toBe('he said his choice was bold. He is no going back.');
  });

  test('analyzeChoiceRisk detects costs', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const result = await page.evaluate(() => {
      return analyzeChoiceRisk('Commission a second vessel — this will require 600 marks');
    });
    
    expect(result.cost).toBe(600);
  });

  test('analyzeChoiceRisk detects warnings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const result = await page.evaluate(() => {
      return analyzeChoiceRisk('Challenge Rinaldo directly at the exchange — Pell has set his pen down');
    });
    
    expect(result.warning).toBe('Pell advises caution');
  });

  test('analyzeChoiceRisk detects ship requirements', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const result = await page.evaluate(() => {
      return analyzeChoiceRisk('Dispatch two ships to the northern passage');
    });
    
    expect(result.requirement).toContain('ships');
  });

  test('analyzeChoiceRisk returns null for neutral choices', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const result = await page.evaluate(() => {
      return analyzeChoiceRisk('Observe and say nothing for now');
    });
    
    expect(result.cost).toBeNull();
    expect(result.warning).toBeNull();
    expect(result.requirement).toBeNull();
  });
});
