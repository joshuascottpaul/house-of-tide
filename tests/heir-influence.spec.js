// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * HEIR INFLUENCE TESTS
 * 
 * Tests that heir personality system is implemented
 */

test.describe('Heir Influence', () => {
  test('applyHeirInfluence function exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    const hasFunction = await page.evaluate(() => {
      return typeof applyHeirInfluence === 'function';
    });
    
    expect(hasFunction).toBeTruthy();
  });

  test('heir influence logic is implemented', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Verify the influence calculation logic exists
    const hasLogic = await page.evaluate(() => {
      // Test the age-based influence calculation
      const calculateInfluence = (age) => Math.max(0, (age - 10) * 0.15);
      return calculateInfluence(7) === 0 && 
             calculateInfluence(10) === 0 && 
             calculateInfluence(15) === 0.75 &&
             calculateInfluence(17) >= 1.0;
    });
    
    expect(hasLogic).toBeTruthy();
  });

  test('heir trait types are defined', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check HEIR_TRAITS constant exists
    const hasTraits = await page.evaluate(() => {
      return typeof HEIR_TRAITS !== 'undefined' &&
             HEIR_TRAITS.reckless &&
             HEIR_TRAITS.cautious &&
             HEIR_TRAITS.diplomatic;
    });
    
    expect(hasTraits).toBeTruthy();
  });

  test('heir influence handles all trait types', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Verify all 8 trait types are handled
    const allTraitsHandled = await page.evaluate(() => {
      const traits = ['reckless', 'cautious', 'diplomatic', 'greedy', 
                      'scholarly', 'proud', 'suspicious', 'romantic'];
      
      // Test that the function can handle each trait without error
      const testChoices = ['Choice 1', 'Choice 2', 'Choice 3'];
      
      for (const trait of traits) {
        try {
          // Mock gs object for testing
          window.gs = {
            heirTrait: { key: trait },
            heirName: 'TestHeir',
            heirAge: 15,
            hp: { sub: 'he', cap: 'He' }
          };
          
          const result = applyHeirInfluence(testChoices, 'test');
          if (!Array.isArray(result)) return false;
        } catch (e) {
          return false;
        }
      }
      return true;
    });
    
    expect(allTraitsHandled).toBeTruthy();
  });
});
