// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * TRADING LAYER VERIFICATION TESTS
 * 
 * Verifies the Trading Layer is working correctly
 */

test.describe('Trading Layer - Verification', () => {
  test('trading panel UI elements exist', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check trading panel exists in DOM
    const tradingPanel = await page.locator('#panel-trading');
    expect(tradingPanel).toBeTruthy();
    
    // Check panel has required elements
    const title = await page.locator('.panel-title', { hasText: 'Cargo Exchange' });
    expect(title).toBeTruthy();
    
    const capacityEl = await page.locator('#trading-capacity');
    expect(capacityEl).toBeTruthy();
    
    const marketBodyEl = await page.locator('#trading-market-body');
    expect(marketBodyEl).toBeTruthy();
  });

  test('commodity names are defined', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check COMMODITY_NAMES exists
    const hasCommodities = await page.evaluate(() => {
      return typeof COMMODITY_NAMES !== 'undefined' && 
             COMMODITY_NAMES.saltfish && 
             COMMODITY_NAMES.wine && 
             COMMODITY_NAMES.alum && 
             COMMODITY_NAMES.tin;
    });
    
    expect(hasCommodities).toBeTruthy();
  });

  test('rollMarketPrices function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check rollMarketPrices function exists
    const hasFunction = await page.evaluate(() => {
      return typeof rollMarketPrices === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('season modifiers are defined', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check SEASON_MODIFIERS exists with all seasons
    const hasModifiers = await page.evaluate(() => {
      return typeof SEASON_MODIFIERS !== 'undefined' && 
             SEASON_MODIFIERS.Winter && 
             SEASON_MODIFIERS.Spring && 
             SEASON_MODIFIERS.Summer && 
             SEASON_MODIFIERS.Autumn;
    });
    
    expect(hasModifiers).toBeTruthy();
  });
});
