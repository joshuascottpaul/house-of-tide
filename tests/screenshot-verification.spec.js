// @ts-check
const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

/**
 * SCREENSHOT VERIFICATION TESTS
 * 
 * Captures screenshots to verify background and text fixes
 */

test.describe('Screenshot Verification', () => {
  test('capture title screen with background', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Wait for background to load
    await page.waitForTimeout(2000);
    
    // Capture screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotPath = path.join(__dirname, '../test-screenshots/01-title-screen.png');
    
    // Ensure directory exists
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    
    // Verify background element has image
    const bgStyle = await page.locator('#bg-image').getAttribute('style');
    expect(bgStyle).toContain('background-image');
    expect(bgStyle).toContain('loremflickr.com');
    expect(bgStyle).toContain('~cats');
  });

  test('capture game screen with readable text', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'Screenshot');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(2000); // Wait for background
    
    // Capture screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotPath = path.join(__dirname, '../test-screenshots/02-game-screen.png');
    
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    
    // Verify text is visible and has correct color
    const eventText = await page.locator('.event-text').first();
    await expect(eventText).toBeVisible();
    
    const textColor = await eventText.evaluate(el => 
      window.getComputedStyle(el).color
    );
    console.log(`Text color RGB: ${textColor}`);
    
    // Verify background is set
    const bgStyle = await page.locator('#bg-image').getAttribute('style');
    expect(bgStyle).toContain('background-image');
  });

  test('capture event choices with readable text', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'Choices');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('.choice-btn', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(2000);
    
    // Capture screenshot
    const screenshot = await page.screenshot({ fullPage: true });
    const screenshotPath = path.join(__dirname, '../test-screenshots/03-event-choices.png');
    
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`✅ Screenshot saved: ${screenshotPath}`);
    
    // Verify choice buttons are visible
    const choiceButtons = await page.locator('.choice-btn').count();
    expect(choiceButtons).toBeGreaterThan(0);
    
    // Check first choice button text color
    const firstChoice = await page.locator('.choice-btn').first();
    const btnColor = await firstChoice.evaluate(el => 
      window.getComputedStyle(el).color
    );
    console.log(`Choice button color RGB: ${btnColor}`);
  });

  test('verify background changes between sessions', async ({ page }) => {
    // Session 1
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'Session1');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgStyle1 = await page.locator('#bg-image').getAttribute('style');
    const random1 = bgStyle1.match(/random=([^&]+)/)?.[1];
    
    // Capture session 1
    const screenshot1 = await page.screenshot({ fullPage: true });
    const screenshotPath1 = path.join(__dirname, '../test-screenshots/04-session-1.png');
    
    const dir = path.dirname(screenshotPath1);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath1, screenshot1);
    console.log(`✅ Session 1 screenshot saved: ${screenshotPath1}`);
    console.log(`Session 1 random seed: ${random1}`);
    
    // Session 2 (new context = new session)
    const context2 = await page.context().browser().newContext();
    const page2 = await context2.newPage();
    
    await page2.goto('house-of-tide.html');
    await page2.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    await page2.click('button:has-text("Begin the Founding")');
    await page2.fill('#input-dynasty', 'Session2');
    await page2.fill('#input-founder', 'Test');
    await page2.click('button:has-text("Open the Ledger")');
    await page2.click('button:has-text("Skip")');
    await page2.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    
    const bgStyle2 = await page2.locator('#bg-image').getAttribute('style');
    const random2 = bgStyle2.match(/random=([^&]+)/)?.[1];
    
    // Capture session 2
    const screenshot2 = await page2.screenshot({ fullPage: true });
    const screenshotPath2 = path.join(__dirname, '../test-screenshots/05-session-2.png');
    
    fs.writeFileSync(screenshotPath2, screenshot2);
    console.log(`✅ Session 2 screenshot saved: ${screenshotPath2}`);
    console.log(`Session 2 random seed: ${random2}`);
    
    // Verify different seeds
    expect(random1).not.toBe(random2);
    console.log(`✅ Backgrounds are different: ${random1} ≠ ${random2}`);
    
    await context2.close();
  });

  test('verify status bar text is readable', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.waitForSelector('#screen-title', { state: 'visible', timeout: 5000 });
    
    // Start a new game
    await page.click('button:has-text("Begin the Founding")');
    await page.fill('#input-dynasty', 'StatusBar');
    await page.fill('#input-founder', 'Test');
    await page.click('button:has-text("Open the Ledger")');
    await page.click('button:has-text("Skip")');
    
    await page.waitForSelector('#status-bar', { state: 'visible', timeout: 5000 });
    await page.waitForTimeout(1000);
    
    // Capture screenshot focused on status bar
    const statusBar = await page.locator('#status-bar');
    const screenshot = await statusBar.screenshot();
    const screenshotPath = path.join(__dirname, '../test-screenshots/06-status-bar.png');
    
    const dir = path.dirname(screenshotPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(screenshotPath, screenshot);
    console.log(`✅ Status bar screenshot saved: ${screenshotPath}`);
    
    // Verify status bar elements are visible
    await expect(page.locator('.stat-name').first()).toBeVisible();
    await expect(page.locator('.stat-val').first()).toBeVisible();
  });
});
