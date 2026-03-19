/**
 * BEGIN THE FOUNDING BUTTON TESTS
 *
 * Smoke tests for the title screen → name screen → onboarding flow.
 *
 * Key patterns used here (see CLAUDE.md Testing Patterns):
 *  - page.on('pageerror') registered BEFORE page.goto()
 *  - Screen change asserted immediately after button click
 *  - gs accessed as global `gs`, not `window.gs` (it's a top-level `let`)
 */

import { test, expect } from '@playwright/test';

test.describe('Begin the Founding Button', () => {

  // Helper: navigate and assert no script errors on load
  async function gotoClean(page) {
    const errors = [];
    page.on('pageerror', e => errors.push(e.message));
    await page.goto('house-of-tide.html');
    await page.waitForLoadState('networkidle');
    if (errors.length > 0) {
      throw new Error(`Script errors on load: ${errors.join('; ')}`);
    }
    return errors;
  }

  test('Page loads with no script errors', async ({ page }) => {
    await gotoClean(page);
    // If gotoClean didn't throw, all scripts parsed and executed successfully
  });

  test('Button exists and is visible on title screen', async ({ page }) => {
    await gotoClean(page);
    await page.waitForSelector('#screen-title.active');
    const button = page.locator('button:has-text("Begin the Founding")');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });

  test('Button click navigates to name screen', async ({ page }) => {
    await gotoClean(page);
    await page.waitForSelector('#screen-title.active');

    await page.click('button:has-text("Begin the Founding")');

    // Assert immediately — if showScreen is broken this fails fast
    await expect(page.locator('#screen-name')).toBeVisible({ timeout: 3000 });
    await expect(page.locator('#input-dynasty')).toBeVisible();
    await expect(page.locator('#input-founder')).toBeVisible();
  });

  test('showScreen function is defined before button click', async ({ page }) => {
    await gotoClean(page);
    const defined = await page.evaluate(() => typeof showScreen === 'function');
    expect(defined).toBe(true);
  });

  test('Can fill dynasty and founder names', async ({ page }) => {
    await gotoClean(page);
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');

    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');

    await expect(page.locator('#input-dynasty')).toHaveValue('TestHouse');
    await expect(page.locator('#input-founder')).toHaveValue('TestFounder');
  });

  test('Can start game — onboarding screen appears after Open the Ledger', async ({ page }) => {
    await gotoClean(page);
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');

    // Onboarding screen or Skip button should appear
    await page.waitForSelector('button:has-text("Skip")', { timeout: 10000 });
    const skipBtn = page.locator('button:has-text("Skip")');
    await expect(skipBtn).toBeVisible();
  });

  test('Game state is initialised after starting game', async ({ page }) => {
    await gotoClean(page);
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    await page.waitForSelector('button:has-text("Skip")', { timeout: 10000 });

    // gs is a top-level `let`, not a window property — use `gs` not `window.gs`
    const gameState = await page.evaluate(() => gs);
    expect(gameState).toBeDefined();
    expect(gameState.dynastyName).toBe('TestHouse');
    expect(gameState.founderName).toBe('TestFounder');
  });

  test('Can complete onboarding and reach game screen', async ({ page }) => {
    await gotoClean(page);
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    await page.waitForSelector('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');

    // Game screen should be active — event-text content requires an AI backend
    await page.waitForSelector('#screen-game.active', { timeout: 10000 });
    await expect(page.locator('#screen-game')).toBeVisible();
  });

  test('Debug panel accessible via keyboard shortcut', async ({ page }) => {
    await gotoClean(page);
    await page.waitForSelector('#screen-title.active');

    await page.keyboard.press('Control+Shift+D');
    const debugPanel = page.locator('#debug-panel.open');
    await expect(debugPanel).toBeVisible({ timeout: 3000 });
  });

  test('Live Share button is visible on title screen', async ({ page }) => {
    await gotoClean(page);
    const liveButton = page.locator('button:has-text("Live Share")');
    await expect(liveButton).toBeVisible();
    await expect(liveButton).toBeEnabled();
  });

  test('Statistics button is visible on title screen', async ({ page }) => {
    await gotoClean(page);
    const statsButton = page.locator('button:has-text("Statistics")');
    await expect(statsButton).toBeVisible();
    await expect(statsButton).toBeEnabled();
  });

  test('Achievements button is visible on title screen', async ({ page }) => {
    await gotoClean(page);
    const achievementsButton = page.locator('button:has-text("Achievements")');
    await expect(achievementsButton).toBeVisible();
    await expect(achievementsButton).toBeEnabled();
  });

});
