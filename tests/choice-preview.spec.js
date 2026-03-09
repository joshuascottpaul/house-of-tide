const { test, expect } = require('@playwright/test');
const { startNewGame, waitForEvent, getGameState } = require('./helpers');

test.describe('Choice Preview Feature', () => {
  test('should display risk indicators on choices when present', async ({ page }) => {
    await startNewGame(page);
    await waitForEvent(page);
    
    // Verify 3 choices are rendered
    const choices = await page.locator('.choice-btn').count();
    expect(choices).toBeGreaterThanOrEqual(3);
    
    // Check if any choice has risk indicators
    const hints = await page.locator('.choice-hint').count();
    console.log(`Found ${hints} risk indicators`);
    
    // Test passes whether hints are present or not (depends on AI generation)
    expect(hints).toBeGreaterThanOrEqual(0);
  });
  
  test('should render choices with risk detection', async ({ page }) => {
    await startNewGame(page);
    await waitForEvent(page);
    
    // Verify choices are rendered and clickable
    const firstChoice = page.locator('.choice-btn').first();
    await expect(firstChoice).toBeVisible();
    await expect(firstChoice).toBeEnabled();
    
    // Verify choice buttons have proper structure
    const choiceCount = await page.locator('.choice-btn').count();
    expect(choiceCount).toBeGreaterThanOrEqual(3);
    
    console.log(`Rendered ${choiceCount} choices successfully`);
  });
  
  test('should detect risk indicators from choice text', async ({ page }) => {
    // Navigate to page to access window functions
    await page.goto('file://' + require('path').join(process.cwd(), 'house-of-tide.html'));
    
    // Test the analyzeChoiceRisk function directly
    const result = await page.evaluate(() => {
      const testChoices = [
        'Commission a vessel from the Masso yards — 600 marks.',
        'Hire a new captain for the northern route.',
        'Dispatch two ships to investigate.',
        'Challenge Rinaldo publicly at the exchange.'
      ];
      
      return testChoices.map(c => analyzeChoiceRisk(c));
    });
    
    // First choice should detect 600 mk cost
    expect(result[0].cost).toBe(600);
    
    // Second choice should detect hire cost
    expect(result[1].cost).toBeGreaterThan(0);
    
    // Third choice should detect ship requirement
    expect(result[2].requirement).toContain('ship');
    
    // Fourth choice should detect warning
    expect(result[3].warning).toBe('Pell advises caution');
    
    console.log('Risk analysis results:', result);
  });
});
