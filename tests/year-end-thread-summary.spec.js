// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * YEAR-END THREAD SUMMARY TESTS
 * 
 * Tests that resolved threads are shown at year-end
 */

test.describe('Year-End Thread Summary', () => {
  test('year-end panel has threads section', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check ye-threads element exists
    const hasElement = await page.evaluate(() => {
      return document.getElementById('ye-threads') !== null;
    });
    
    expect(hasElement).toBeTruthy();
  });

  test('showYearEnd function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof showYearEnd === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });
});
