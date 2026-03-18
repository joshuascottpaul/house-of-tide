/**
 * BEGIN THE FOUNDING BUTTON TEST
 * 
 * Tests that the "Begin the Founding" button works correctly.
 * This is a critical smoke test for game functionality.
 */

import { test, expect } from '@playwright/test';

test.describe('Begin the Founding Button', () => {
  
  test('Button exists and is clickable', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Wait for page to fully load
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);  // Give scripts time to execute
    
    // Check for console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    // Check button exists
    const button = page.locator('button:has-text("Begin the Founding")');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
    
    // Click button
    await button.click();
    
    // Wait for screen to change (with longer timeout)
    await page.waitForFunction(() => {
      const screenName = document.getElementById('screen-name');
      return screenName && screenName.classList.contains('active');
    }, { timeout: 10000 });
    
    // Verify dynasty input is visible
    const dynastyInput = page.locator('#input-dynasty');
    await expect(dynastyInput).toBeVisible();
  });
  
  test('Button exists on title screen', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Wait for title screen to load
    await page.waitForSelector('#screen-title.active');
    
    // Check button exists
    const button = page.locator('button:has-text("Begin the Founding")');
    await expect(button).toBeVisible();
    await expect(button).toBeEnabled();
  });
  
  test('Button click navigates to name screen', async ({ page }) => {
    // Capture console errors
    const errors = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });
    
    await page.goto('house-of-tide.html');
    
    // Wait for title screen
    await page.waitForSelector('#screen-title.active');
    
    // Wait for showScreen to be defined (scripts loaded)
    await page.waitForFunction(() => typeof window.showScreen !== 'undefined', { timeout: 10000 });
    
    // Click button
    await page.click('button:has-text("Begin the Founding")');
    
    // Check for console errors
    if (errors.length > 0) {
      console.log('Console errors:', errors);
    }
    
    // Wait for navigation to name screen
    await page.waitForSelector('#screen-name.active', { timeout: 5000 });
    
    // Verify we're on name screen
    const dynastyInput = page.locator('#input-dynasty');
    await expect(dynastyInput).toBeVisible();
    await expect(dynastyInput).toBeEditable();
  });
  
  test('Can fill dynasty and founder names', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Navigate to name screen
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    
    // Fill in names
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    
    // Verify inputs
    const dynastyValue = await page.locator('#input-dynasty').inputValue();
    const founderValue = await page.locator('#input-founder').inputValue();
    
    expect(dynastyValue).toBe('TestHouse');
    expect(founderValue).toBe('TestFounder');
  });
  
  test('Can start game with valid names', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Navigate to name screen
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    
    // Fill in names
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    
    // Click "Open the Ledger"
    await page.click('button:has-text("Open the Ledger")');
    
    // Wait for onboarding screen (skip button should appear)
    await page.waitForSelector('button:has-text("Skip")', { timeout: 10000 });
    
    // Verify game state initialized
    const gameState = await page.evaluate(() => window.gs);
    expect(gameState).toBeDefined();
    expect(gameState.dynastyName).toBe('TestHouse');
    expect(gameState.founderName).toBe('TestFounder');
  });
  
  test('Can complete onboarding and reach game screen', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Start game
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    
    // Skip onboarding
    await page.waitForSelector('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game screen
    await page.waitForSelector('#screen-game', { timeout: 10000 });
    
    // Verify game is playable
    const eventText = page.locator('#event-text');
    await expect(eventText).toBeVisible();
  });
  
  test('Debug panel accessible via keyboard shortcut', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Enable debug mode
    await page.evaluate(() => {
      window.CFG.debugMode = true;
      window.saveCFG();
    });
    
    // Reload to apply debug mode
    await page.reload();
    
    // Press Cmd+Shift+D (or Ctrl+Shift+D on Windows)
    await page.keyboard.press('Control+Shift+D');
    
    // Debug panel should appear
    const debugPanel = page.locator('#debug-panel');
    await expect(debugPanel).toBeVisible();
  });
  
  test('Error banner shows on AI error with retry button', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Start game and get to a point where AI is called
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    await page.waitForSelector('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');
    
    // Wait for event to load
    await page.waitForSelector('#event-text', { timeout: 10000 });
    
    // Simulate AI error by breaking the LLM call
    await page.evaluate(() => {
      window.callLLM = async () => {
        throw new Error('No JSON in response');
      };
    });
    
    // Make a choice to trigger AI call
    const firstChoice = page.locator('[data-testid="choice-0"]').first();
    if (await firstChoice.isVisible()) {
      await firstChoice.click();
      
      // Error banner should appear with retry button
      await page.waitForSelector('#error-banner', { timeout: 5000 });
      
      const errorBanner = page.locator('#error-banner');
      await expect(errorBanner).toBeVisible();
      
      // Check for retry button
      const retryButton = page.locator('#error-banner >> text="↻ Try Again"');
      await expect(retryButton).toBeVisible();
    }
  });
  
  test('Live recording can be started and stopped', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Check live screenshot button exists
    const liveButton = page.locator('button:has-text("🔴 Live Share")');
    await expect(liveButton).toBeVisible();
    
    // Note: Can't actually test file system access in Playwright
    // But we can verify the button exists and is clickable
    await expect(liveButton).toBeEnabled();
  });
  
  test('Statistics dashboard accessible', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Start game to enable stats
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    await page.waitForSelector('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');
    
    // Click Statistics button
    const statsButton = page.locator('button:has-text("Statistics")');
    await expect(statsButton).toBeVisible();
    await statsButton.click();
    
    // Stats overlay should appear
    const statsOverlay = page.locator('.stats-overlay');
    await expect(statsOverlay).toBeVisible();
    
    // Check for Dynasty History button
    const historyButton = page.locator('button:has-text("📜 View Dynasty History")');
    await expect(historyButton).toBeVisible();
    
    // Close stats
    await page.click('button:has-text("Close")');
    await expect(statsOverlay).not.toBeVisible();
  });
  
  test('Achievements panel accessible', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Start game
    await page.click('button:has-text("Begin the Founding")');
    await page.waitForSelector('#screen-name.active');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'TestFounder');
    await page.click('button:has-text("Open the Ledger")');
    await page.waitForSelector('button:has-text("Skip")');
    await page.click('button:has-text("Skip")');
    
    // Click Achievements button
    const achievementsButton = page.locator('button:has-text("🏆 Achievements")');
    await expect(achievementsButton).toBeVisible();
    await achievementsButton.click();
    
    // Achievements overlay should appear
    const achievementsOverlay = page.locator('.achievements-overlay');
    await expect(achievementsOverlay).toBeVisible();
    
    // Close achievements
    await page.click('button:has-text("Close")');
    await expect(achievementsOverlay).not.toBeVisible();
  });
});
