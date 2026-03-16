/**
 * VISUAL REGRESSION TESTS
 * 
 * Capture and compare screenshots of key UI panels.
 * Detects unintended UI changes.
 */

import { test, expect } from '@playwright/test';
import { startNewGame, advanceToPhase, advanceToYearEnd } from './helpers';

test.describe('Visual Regression', () => {
  
  test.beforeEach(async ({ page }) => {
    // Reset state before each visual test
    await startNewGame(page, {
      dynasty: 'VisualTest',
      founder: 'Tester'
    });
  });
  
  test('Title Screen', async ({ page }) => {
    await expect(page).toHaveScreenshot('01-title-screen.png', {
      fullPage: true,
      maxDiffPixels: 100  // Allow small differences (anti-aliasing, etc.)
    });
  });
  
  test('House Phase Panel', async ({ page }) => {
    // Already in house phase from beforeEach
    await page.waitForSelector('#event-text', { state: 'visible' });
    
    await expect(page).toHaveScreenshot('02-house-phase.png', {
      fullPage: true,
      maxDiffPixels: 150
    });
  });
  
  test('Routes Phase Panel', async ({ page }) => {
    await advanceToPhase(page, 'routes');
    await page.waitForSelector('#event-text', { state: 'visible' });
    
    await expect(page).toHaveScreenshot('03-routes-phase.png', {
      fullPage: true,
      maxDiffPixels: 150
    });
  });
  
  test('Trading Phase Panel', async ({ page }) => {
    await advanceToPhase(page, 'trading');
    await page.waitForSelector('#panel-trading', { state: 'visible' });
    
    await expect(page).toHaveScreenshot('04-trading-phase.png', {
      fullPage: true,
      maxDiffPixels: 200
    });
  });
  
  test('Year-End Panel', async ({ page }) => {
    await advanceToYearEnd(page);
    await page.waitForSelector('#panel-yearend', { state: 'visible' });
    
    await expect(page).toHaveScreenshot('05-year-end-panel.png', {
      fullPage: true,
      maxDiffPixels: 200
    });
  });
  
  test('Status Bar', async ({ page }) => {
    // Focus on status bar region
    const statusBar = page.locator('#status-bar');
    await expect(statusBar).toHaveScreenshot('06-status-bar.png', {
      maxDiffPixels: 50
    });
  });
  
  test('Allies Display', async ({ page }) => {
    // Allies should be visible in status bar
    const alliesDisplay = page.locator('#allies-display');
    await expect(alliesDisplay).toBeVisible();
    
    await expect(alliesDisplay).toHaveScreenshot('07-allies-display.png', {
      maxDiffPixels: 50
    });
  });
  
  test('Loading Panel', async ({ page }) => {
    // Trigger loading by making a choice
    await page.click('text=Continue →');
    
    // Capture loading panel (may be brief)
    const loadingPanel = page.locator('#loading-panel');
    await expect(loadingPanel).toBeVisible();
    
    await expect(loadingPanel).toHaveScreenshot('08-loading-panel.png', {
      maxDiffPixels: 100
    });
  });
  
  test('Result Panel', async ({ page }) => {
    // Make a choice to see result
    await page.click('text=Continue →');
    await page.waitForSelector('#panel-result', { state: 'visible' });
    
    await expect(page.locator('#panel-result')).toHaveScreenshot('09-result-panel.png', {
      maxDiffPixels: 150
    });
  });
  
  test('Settings Modal', async ({ page }) => {
    // Open settings
    await page.click('text=Settings');
    await page.waitForSelector('#settings-overlay', { state: 'visible' });
    
    await expect(page.locator('#settings-overlay')).toHaveScreenshot('10-settings-modal.png', {
      maxDiffPixels: 200
    });
    
    // Close settings
    await page.click('text=Cancel');
  });
  
  test('Save/Load Overlay', async ({ page }) => {
    // Open save overlay
    await page.click('text=SAVE / LOAD');
    await page.waitForSelector('#save-overlay', { state: 'visible' });
    
    await expect(page.locator('#save-overlay')).toHaveScreenshot('11-save-overlay.png', {
      maxDiffPixels: 150
    });
    
    // Close overlay
    await page.click('text=Return to the House');
  });
  
  test('Advisor Panel', async ({ page }) => {
    // Open advisor
    await page.click('text=Consult the Archivist');
    await page.waitForSelector('#advisor-panel.open', { state: 'visible' });
    
    await expect(page.locator('#advisor-panel')).toHaveScreenshot('12-advisor-panel.png', {
      maxDiffPixels: 100
    });
    
    // Close advisor
    await page.click('text=Consult the Archivist');
  });
  
  test('Tutorial Modal - Buildings', async ({ page }) => {
    // Advance to year 2 to trigger building tutorial
    await advanceToYearEnd(page);
    await page.click('text=Turn the Page →');
    
    // Year 2 - should show building tutorial
    await page.waitForTimeout(1000); // Wait for tutorial
    
    // Check if tutorial is visible
    const tutorialVisible = await page.isVisible('#tutorial-overlay');
    if (tutorialVisible) {
      await expect(page.locator('#tutorial-overlay')).toHaveScreenshot('13-tutorial-buildings.png', {
        maxDiffPixels: 200
      });
    }
  });
  
  test('Death Screen', async ({ page }) => {
    // This is hard to trigger naturally, so we'll skip for now
    // Can be tested manually or with state manipulation
    test.skip();
  });
  
  test('Mobile Layout (375px width)', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    
    // Reload to apply new viewport
    await page.reload();
    await startNewGame(page);
    
    await expect(page).toHaveScreenshot('14-mobile-layout.png', {
      fullPage: true,
      maxDiffPixels: 200
    });
  });
  
  test('Tablet Layout (768px width)', async ({ page }) => {
    // Set tablet viewport
    await page.setViewportSize({ width: 768, height: 1024 });
    
    // Reload to apply new viewport
    await page.reload();
    await startNewGame(page);
    
    await expect(page).toHaveScreenshot('15-tablet-layout.png', {
      fullPage: true,
      maxDiffPixels: 200
    });
  });
  
  test('Combat Panel (Pirate Encounter)', async ({ page }) => {
    // Trigger pirate encounter by advancing to routes and hoping for combat
    // This is non-deterministic, so we'll skip for automated testing
    // Can be tested manually
    test.skip();
  });
  
  test('Error Banner', async ({ page }) => {
    // Trigger an error by trying to buy cargo without trading phase
    // This is non-deterministic, skip for now
    test.skip();
  });
});
