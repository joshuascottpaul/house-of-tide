const { test, expect } = require('@playwright/test');
const path = require('path');

// Helper: start a new game
async function startNewGame(page, dynasty = 'TestHouse', founder = 'Tester') {
  const filePath = 'file://' + path.join(process.cwd(), 'house-of-tide.html');
  await page.goto(filePath);
  await page.click('button:has-text("Begin the Founding")');
  await page.fill('#input-dynasty', dynasty);
  await page.fill('#input-founder', founder);
  await page.click('button:has-text("Open the Ledger")');
  // Skip onboarding
  await page.click('button:has-text("Skip")');
}

// Helper: wait for event to load
async function waitForEvent(page) {
  await page.waitForSelector('#event-text', { state: 'visible', timeout: 30000 });
}

// Helper: get game state
async function getGameState(page) {
  return await page.evaluate(() => window.gs);
}

module.exports = { startNewGame, waitForEvent, getGameState };
