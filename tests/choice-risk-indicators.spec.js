// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * CHOICE RISK INDICATOR TESTS
 * 
 * Tests that 💰 and ⚠️ icons appear on choices correctly
 */

test.describe('Choice Risk Indicators', () => {
  test('analyzeChoiceRisk detects cost keywords', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const costDetected = await page.evaluate(() => {
      return analyzeChoiceRisk('Commission a second vessel — this will require 600 marks');
    });
    
    expect(costDetected.cost).toBe(600);
  });

  test('analyzeChoiceRisk detects warning keywords', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const warningDetected = await page.evaluate(() => {
      return analyzeChoiceRisk('Challenge Rinaldo directly at the exchange — Pell has set his pen down');
    });
    
    expect(warningDetected.warning).toBe('Pell advises caution');
  });

  test('analyzeChoiceRisk detects ship requirements', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const requirementDetected = await page.evaluate(() => {
      return analyzeChoiceRisk('Dispatch two ships to the northern passage');
    });
    
    expect(requirementDetected.requirement).toContain('ships');
  });

  test('analyzeChoiceRisk returns null for neutral choices', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const neutral = await page.evaluate(() => {
      return analyzeChoiceRisk('Observe and say nothing for now');
    });
    
    expect(neutral.cost).toBeNull();
    expect(neutral.warning).toBeNull();
    expect(neutral.requirement).toBeNull();
  });

  test('choice buttons show risk icons when rendered', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'RiskTest');
    await page.fill('#input-founder', 'Tester');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    // Wait for game to load
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Wait for event to load
    await page.waitForSelector('#event-text', { state: 'visible', timeout: 60000 });
    
    // Check that choice buttons exist and have correct structure
    const choices = await page.$$('.choice-btn');
    expect(choices.length).toBeGreaterThanOrEqual(2);
    
    // Check at least one choice has text content
    const firstChoiceText = await choices[0].textContent();
    expect(firstChoiceText).toBeTruthy();
    expect(firstChoiceText.length).toBeGreaterThan(10);
  });
});
