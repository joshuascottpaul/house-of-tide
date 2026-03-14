// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * ACHIEVEMENTS BUTTON TEST
 *
 * Verifies the achievements button works when clicked
 */

test.describe('Achievements Button', () => {
  test('achievements button exists on title screen', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });

    // Check button exists
    const achievementsButton = page.locator('button:has-text("🏆 Achievements")');
    await expect(achievementsButton).toBeVisible();
  });

  test('achievements button opens panel when clicked', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });

    // Click achievements button
    await page.click('button:has-text("🏆 Achievements")');

    // Wait for overlay to appear
    await page.waitForSelector('.achievements-overlay', { timeout: 5000 });

    // Check overlay is visible
    const overlay = page.locator('.achievements-overlay');
    await expect(overlay).toBeVisible();

    // Check panel contains expected content - use exact match selectors
    await expect(page.locator('h2:has-text("Achievements")')).toBeVisible();
    await expect(page.locator('text=Unlocked:').first()).toBeVisible();
    await expect(page.locator('h3', { hasText: /^LOCKED$/ })).toBeVisible();
  });

  test('achievements panel can be closed', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });

    // Open achievements
    await page.click('button:has-text("🏆 Achievements")');
    await page.waitForSelector('.achievements-overlay', { timeout: 5000 });

    // Click close button inside the overlay
    await page.locator('.achievements-overlay button:has-text("Close")').click();

    // Wait for overlay to be removed from DOM
    await page.waitForSelector('.achievements-overlay', { state: 'detached', timeout: 5000 });
  });

  test('showAchievementsPanel function is available globally', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });

    // Check function exists on window
    const functionExists = await page.evaluate(() => {
      return typeof window.showAchievementsPanel === 'function';
    });

    expect(functionExists).toBe(true);
  });

  test('achievements panel shows correct structure', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });

    // Open achievements
    await page.click('button:has-text("🏆 Achievements")');
    await page.waitForSelector('.achievements-overlay', { timeout: 5000 });

    // Check for UNLOCKED and LOCKED sections - use exact match
    await expect(page.locator('h3', { hasText: /^UNLOCKED$/ })).toBeVisible();
    await expect(page.locator('h3', { hasText: /^LOCKED$/ })).toBeVisible();

    // Check for close button inside overlay
    await expect(page.locator('.achievements-overlay button:has-text("Close")')).toBeVisible();
  });
});
