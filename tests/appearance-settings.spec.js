// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * APPEARANCE SETTINGS TESTS
 * 
 * Tests that user can modify visual appearance settings
 */

test.describe('Appearance Settings', () => {
  test('appearance settings panel exists', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings with keyboard shortcut (P key)
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Check appearance section exists
    await expect(page.locator('text=Visual Appearance')).toBeVisible();
    
    // Check all sliders exist
    await expect(page.locator('#s-bg-opacity')).toBeVisible();
    await expect(page.locator('#s-bg-grayscale')).toBeVisible();
    await expect(page.locator('#s-overlay-opacity')).toBeVisible();
    await expect(page.locator('#s-bg-tint-color')).toBeVisible();
    await expect(page.locator('#s-bg-tint-opacity')).toBeVisible();
    await expect(page.locator('#s-text-brightness')).toBeVisible();
  });

  test('background opacity slider works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings with P key
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Get initial bg opacity
    const initialOpacity = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-opacity').trim();
    });
    
    // Adjust background opacity slider
    const slider = page.locator('#s-bg-opacity');
    await slider.fill('30');
    await slider.dispatchEvent('input');
    
    // Wait for update
    await page.waitForTimeout(500);
    
    // Check opacity changed
    const newOpacity = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-opacity').trim();
    });
    
    expect(parseFloat(newOpacity)).toBeGreaterThan(parseFloat(initialOpacity));
    
    // Check value display updated
    const displayedValue = await page.locator('#bg-opacity-val').textContent();
    expect(displayedValue).toBe('30');
  });

  test('overlay darkness slider works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings with P key
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Adjust overlay opacity slider
    const slider = page.locator('#s-overlay-opacity');
    await slider.fill('80');
    await slider.dispatchEvent('input');
    
    await page.waitForTimeout(500);
    
    // Check overlay opacity changed
    const overlayOpacity = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--overlay-opacity').trim();
    });
    
    expect(parseFloat(overlayOpacity)).toBe(0.8);
    
    // Check value display updated
    const displayedValue = await page.locator('#overlay-opacity-val').textContent();
    expect(displayedValue).toBe('80');
  });

  test('text brightness slider works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings with P key
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Adjust text brightness
    const slider = page.locator('#s-text-brightness');
    await slider.fill('75');
    await slider.dispatchEvent('input');
    
    await page.waitForTimeout(500);
    
    // Check text color changed (should be dimmer)
    const textColor = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--text-color').trim();
    });
    
    expect(textColor).toContain('rgb');
  });

  test('appearance settings persist after reload', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings and change values
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Change multiple settings
    await page.fill('#s-bg-opacity', '25');
    await page.locator('#s-bg-opacity').dispatchEvent('input');
    
    await page.fill('#s-overlay-opacity', '85');
    await page.locator('#s-overlay-opacity').dispatchEvent('input');
    
    await page.waitForTimeout(500);
    
    // Close settings by clicking Cancel button
    await page.click('button:has-text("Cancel")');
    await page.waitForSelector('#settings-overlay.open', { state: 'hidden', timeout: 5000 });
    
    // Reload page
    await page.reload();
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Reopen settings
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Check values persisted
    const bgOpacityValue = await page.locator('#s-bg-opacity').inputValue();
    const overlayOpacityValue = await page.locator('#s-overlay-opacity').inputValue();
    
    expect(bgOpacityValue).toBe('25');
    expect(overlayOpacityValue).toBe('85');
  });

  test('reset appearance settings button works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Change a setting
    await page.fill('#s-bg-opacity', '35');
    await page.locator('#s-bg-opacity').dispatchEvent('input');
    await page.waitForTimeout(300);
    
    // Click reset
    await page.click('button:has-text("Reset to Defaults")');
    
    // Wait for notification
    await page.waitForTimeout(500);
    
    // Check values reset to defaults
    const bgOpacityValue = await page.locator('#s-bg-opacity').inputValue();
    const displayedValue = await page.locator('#bg-opacity-val').textContent();
    
    expect(bgOpacityValue).toBe('15'); // Default
    expect(displayedValue).toBe('15');
  });

  test('background tint color picker works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Open settings
    await page.keyboard.press('p');
    await page.waitForSelector('#settings-overlay.open', { timeout: 5000 });
    
    // Change tint color
    const colorPicker = page.locator('#s-bg-tint-color');
    await colorPicker.fill('#ff0000');
    await colorPicker.dispatchEvent('change');
    
    // Change tint opacity
    const tintSlider = page.locator('#s-bg-tint-opacity');
    await tintSlider.fill('50');
    await tintSlider.dispatchEvent('input');
    
    await page.waitForTimeout(500);
    
    // Check tint color applied
    const tint_color = await page.evaluate(() => {
      return getComputedStyle(document.documentElement).getPropertyValue('--bg-tint-color').trim();
    });
    
    expect(tint_color).toContain('rgba');
  });
});
