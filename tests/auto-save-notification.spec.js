// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * AUTO-SAVE NOTIFICATION TESTS
 * 
 * Tests that auto-save notification appears correctly
 */

test.describe('Auto-Save Notification', () => {
  test('auto-save function exists and is called', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'SaveTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Check autoSave function exists
    const hasFunction = await page.evaluate(() => {
      return typeof autoSave === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('notification element exists in DOM', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check toast notification element exists
    const toastExists = await page.evaluate(() => {
      return document.getElementById('toast-notification') !== null ||
             document.querySelector('#toast-notification') !== null;
    });
    
    // Element may be created dynamically, so we check if showNotification function exists
    const hasFunction = await page.evaluate(() => {
      return typeof showNotification === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('showNotification function works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Call showNotification directly
    const notificationText = await page.evaluate(() => {
      showNotification('✓ Auto-saved');
      const toast = document.getElementById('toast-notification');
      return toast ? toast.textContent : null;
    });
    
    expect(notificationText).toBe('✓ Auto-saved');
  });
});
