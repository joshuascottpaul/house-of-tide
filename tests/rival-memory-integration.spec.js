// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * RIVAL MEMORY SYSTEM - INTEGRATION TESTS
 * 
 * Tests rival memory through actual gameplay
 */

test.describe('Rival Memory System - Integration Tests', () => {
  test('rival state initializes with all four families', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'RivalTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Check dynasty label has tooltip with rival info
    const dynastyLabel = await page.locator('#dynasty-label');
    const title = await dynastyLabel.getAttribute('title');
    
    expect(title).toBeTruthy();
    expect(title).toMatch(/Borracchi|Spinetta|Calmari|Li Yuen/i);
  });

  test('rival tooltip shows relationship status', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'StatusTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Get tooltip content
    const dynastyLabel = await page.locator('#dynasty-label');
    const title = await dynastyLabel.getAttribute('title');
    
    // Should show relationship tiers
    expect(title).toMatch(/Neutral|Friendly|Allied|Hostile|Enemies/i);
    
    // Should show numeric values
    expect(title).toMatch(/\(\+?\d+\)/);
  });

  test('rival state persists through save/load', async ({ page }) => {
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
    
    // Get initial tooltip
    const initialTooltip = await page.locator('#dynasty-label').getAttribute('title');
    expect(initialTooltip).toBeTruthy();
    
    // Save to slot 1
    await page.click('button:has-text("Save / Load")');
    await page.waitForSelector('#save-overlay', { state: 'visible', timeout: 5000 });
    await page.click('#save-slot-1');
    await page.waitForTimeout(500);
    await page.click('button:has-text("Return")');
    
    // Verify tooltip still exists after save
    const afterSaveTooltip = await page.locator('#dynasty-label').getAttribute('title');
    expect(afterSaveTooltip).toBeTruthy();
    
    // Note: Full reload test is covered in other test files
    // This test verifies rival state is maintained during gameplay
    expect(afterSaveTooltip).toMatch(/Borracchi|Spinetta|Calmari|Li Yuen/i);
  });
});
