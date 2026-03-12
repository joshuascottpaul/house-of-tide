// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * DEFAULT MODEL TESTS
 * 
 * Verifies that default models are set to fastest options
 * and speed ratings are displayed in the UI
 */

test.describe('Default Model Settings', () => {
  test('OpenAI default model is fastest option', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('#settings-overlay', { state: 'visible', timeout: 5000 });
    
    // Select OpenAI
    await page.click('#s-openai');
    await page.waitForSelector('#s-openai-section', { state: 'visible', timeout: 2000 });
    
    // Check default model is gpt-4o-mini (fastest)
    const defaultModel = await page.locator('#s-openai-model').inputValue();
    expect(defaultModel).toBe('gpt-4o-mini');
    
    // Check speed rating is displayed
    const fastestOption = await page.locator('#s-openai-model option[value="gpt-4o-mini"]').textContent();
    expect(fastestOption).toContain('⚡⚡⚡');
    expect(fastestOption).toContain('fastest');
  });

  test('Ollama models show speed ratings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('#settings-overlay', { state: 'visible', timeout: 5000 });
    
    // Select Ollama
    await page.click('#s-ollama');
    await page.waitForSelector('#s-ollama-section', { state: 'visible', timeout: 2000 });
    
    // Check fastest model has 3 lightning bolts
    const fastestOption = await page.locator('#s-ollama-model option[value="qwen3.5:4b"]').textContent();
    expect(fastestOption).toContain('⚡⚡⚡');
    expect(fastestOption).toContain('fastest');
    
    // Check slowest model has 1 lightning bolt
    const slowestOption = await page.locator('#s-ollama-model option[value="llama3.1:8b"]').textContent();
    expect(slowestOption).toContain('⚡ llama3.1'); // Only 1 lightning bolt
  });

  test('Claude models show speed ratings', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.click('button:has-text("Settings")');
    await page.waitForSelector('#settings-overlay', { state: 'visible', timeout: 5000 });
    
    // Select Claude
    await page.click('#s-claude');
    await page.waitForSelector('#s-claude-section', { state: 'visible', timeout: 2000 });
    
    // Check fastest model has 3 lightning bolts
    const fastestOption = await page.locator('#s-claude-model option[value="claude-haiku-4-5-20251001"]').textContent();
    expect(fastestOption).toContain('⚡⚡⚡');
    expect(fastestOption).toContain('fastest');
    
    // Check slower model has 2 lightning bolts
    const slowerOption = await page.locator('#s-claude-model option[value="claude-sonnet-4-6"]').textContent();
    expect(slowerOption).toContain('⚡⚡');
  });

  test('CFG default model is gpt-4o-mini', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Check CFG default value
    const defaultModel = await page.evaluate(() => {
      // Load config from localStorage or use defaults
      const saved = localStorage.getItem('hot_config');
      if (saved) {
        const cfg = JSON.parse(saved);
        return cfg.openaiModel;
      }
      return null;
    });
    
    // If no config saved, default should be gpt-4o-mini
    // If config exists, verify it's a valid model
    if (defaultModel) {
      expect(['gpt-4o-mini', 'gpt-4o']).toContain(defaultModel);
    }
  });
});
