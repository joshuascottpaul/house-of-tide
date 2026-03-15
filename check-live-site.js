const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Testing live site: https://joshuascottpaul.github.io/house-of-tide/');
  
  await page.goto('https://joshuascottpaul.github.io/house-of-tide/');
  await page.waitForTimeout(3000);
  
  // Check if Live Share button exists (new feature)
  const liveShareBtn = await page.$('button:has-text("🔴 Live Share")');
  if (liveShareBtn) {
    console.log('✅ DEPLOYED: Live Share button found - site has latest changes');
  } else {
    console.log('❌ NOT DEPLOYED: Live Share button missing - site is old version');
  }
  
  // Check if help section exists in settings
  await page.click('button:has-text("Settings")');
  await page.waitForTimeout(1000);
  
  const helpSection = await page.$('text="Keyboard Shortcuts & Help"');
  if (helpSection) {
    console.log('✅ DEPLOYED: Help section found in settings');
  } else {
    console.log('❌ NOT DEPLOYED: Help section missing from settings');
  }
  
  await browser.close();
})();