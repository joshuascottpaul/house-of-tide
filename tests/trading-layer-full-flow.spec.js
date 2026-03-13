// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * TRADING LAYER FULL FLOW TESTS
 * 
 * Tests the complete trading layer functionality
 */

test.describe('Trading Layer Full Flow', () => {
  test('rollMarketPrices function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof rollMarketPrices === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('COMMODITY_NAMES defined', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasCommodities = await page.evaluate(() => {
      return typeof COMMODITY_NAMES !== 'undefined' &&
             COMMODITY_NAMES.saltfish &&
             COMMODITY_NAMES.wine &&
             COMMODITY_NAMES.alum &&
             COMMODITY_NAMES.tin;
    });
    
    expect(hasCommodities).toBeTruthy();
  });

  test('SEASON_MODIFIERS defined for all seasons', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasModifiers = await page.evaluate(() => {
      return typeof SEASON_MODIFIERS !== 'undefined' &&
             SEASON_MODIFIERS.Winter &&
             SEASON_MODIFIERS.Spring &&
             SEASON_MODIFIERS.Summer &&
             SEASON_MODIFIERS.Autumn;
    });
    
    expect(hasModifiers).toBeTruthy();
  });

  test('trading panel UI elements exist', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasElements = await page.evaluate(() => {
      return document.getElementById('panel-trading') !== null &&
             document.getElementById('trading-capacity') !== null &&
             document.getElementById('trading-market-body') !== null;
    });
    
    expect(hasElements).toBeTruthy();
  });

  test('getCargoCapacity function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof getCargoCapacity === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });
});
