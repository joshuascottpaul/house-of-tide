// @ts-check
const { test, expect } = require('@playwright/test');

/**
 * BACKGROUND VISIBILITY TEST
 * Verifies background images are actually loading (not just in DOM)
 */

test.describe('Background Visibility', () => {
  test('background image loads and is visible', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'BgTest');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Wait for background to fully load
    await page.waitForTimeout(3000);
    
    // Get background URL
    const bgStyle = await page.locator('#bg-image').getAttribute('style');
    console.log('Background style:', bgStyle);
    
    // Extract URL from style
    const urlMatch = bgStyle.match(/url\("([^"]+)"\)/);
    expect(urlMatch).toBeTruthy();
    const bgUrl = urlMatch[1];
    console.log('Background URL:', bgUrl);
    
    // Verify URL contains expected parts
    expect(bgUrl).toContain('loremflickr.com');
    expect(bgUrl).toContain('~cats');
    expect(bgUrl).toContain('random=');
    
    // Create an image element to test if URL loads
    const imageLoaded = await page.evaluate(async (url) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
      });
    }, bgUrl);
    
    console.log('Background image loads:', imageLoaded);
    expect(imageLoaded).toBe(true);
    
    // Get computed style of background element
    const bgElement = await page.locator('#bg-image');
    const opacity = await bgElement.evaluate(el => 
      window.getComputedStyle(el).opacity
    );
    const filter = await bgElement.evaluate(el => 
      window.getComputedStyle(el).filter
    );
    
    console.log('Background opacity:', opacity);
    console.log('Background filter:', filter);
    
    // Verify opacity is set (should be 0.15)
    expect(parseFloat(opacity)).toBeGreaterThan(0);
    
    // Take screenshot with background highlighted
    await page.evaluate(() => {
      const bg = document.getElementById('bg-image');
      if (bg) {
        bg.style.filter = 'none';
        bg.style.opacity = '0.5';
      }
    });
    
    await page.waitForTimeout(500);
    
    const screenshot = await page.screenshot({ fullPage: true });
    const fs = require('fs');
    const path = require('path');
    const screenshotPath = path.join(__dirname, '../test-screenshots/07-background-visible.png');
    
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot);
    console.log('✅ Screenshot with visible background saved:', screenshotPath);
  });

  test('text color is bright enough for readability', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'TextColor');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    // Get text color of various elements
    const elements = [
      { selector: '.event-text', name: 'Event text' },
      { selector: '.choice-btn', name: 'Choice button' },
      { selector: '.stat-val', name: 'Status value' },
      { selector: '.stat-name', name: 'Status name' },
    ];
    
    for (const elem of elements) {
      const el = await page.locator(elem.selector).first();
      const isVisible = await el.isVisible();
      
      if (isVisible) {
        const color = await el.evaluate(el => 
          window.getComputedStyle(el).color
        );
        const textShadow = await el.evaluate(el => 
          window.getComputedStyle(el).textShadow
        );
        
        console.log(`${elem.name} color: ${color}`);
        console.log(`${elem.name} text-shadow: ${textShadow}`);
        
        // Parse RGB values
        const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
        if (rgbMatch) {
          const r = parseInt(rgbMatch[1]);
          const g = parseInt(rgbMatch[2]);
          const b = parseInt(rgbMatch[3]);
          
          // Calculate relative luminance
          const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          console.log(`${elem.name} luminance: ${luminance.toFixed(2)}`);
          
          // Text should be bright (luminance > 0.5 for light text on dark bg)
          expect(luminance).toBeGreaterThan(0.5);
        }
      }
    }
  });
});
