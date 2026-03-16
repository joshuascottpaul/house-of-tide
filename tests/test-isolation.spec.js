/**
 * TEST ISOLATION TESTS
 * 
 * Verifies that tests are properly isolated.
 */

import { test, expect } from '@playwright/test';
import { startNewGame, getGameState, resetGameState } from './helpers';

test.describe('Test Isolation', () => {
  
  test('Test 1: First test should have clean state', async ({ page }) => {
    await startNewGame(page, { dynasty: 'Test1House' });
    
    const state = await getGameState(page);
    expect(state.dynastyName).toBe('Test1House');
    expect(state.turn).toBe(1);
  });
  
  test('Test 2: Second test should NOT see Test 1 state', async ({ page }) => {
    await startNewGame(page, { dynasty: 'Test2House' });
    
    const state = await getGameState(page);
    expect(state.dynastyName).toBe('Test2House');
    // Should NOT be 'Test1House' from previous test
  });
  
  test('Test 3: resetGameState works correctly', async ({ page }) => {
    // Start game
    await startNewGame(page, { dynasty: 'BeforeReset' });
    const state1 = await getGameState(page);
    expect(state1.dynastyName).toBe('BeforeReset');
    
    // Reset
    await resetGameState(page);
    
    // Start new game
    await startNewGame(page, { dynasty: 'AfterReset' });
    const state2 = await getGameState(page);
    expect(state2.dynastyName).toBe('AfterReset');
    // Should NOT be 'BeforeReset'
  });
  
  test('Test 4: localStorage is cleared between tests', async ({ page }) => {
    // Set some data
    await page.evaluate(() => {
      localStorage.setItem('testKey', 'testValue');
    });
    
    const hasData = await page.evaluate(() => {
      return localStorage.getItem('testKey') === 'testValue';
    });
    expect(hasData).toBe(true);
    
    // Reset
    await resetGameState(page);
    
    // Data should be gone
    const hasDataAfter = await page.evaluate(() => {
      return localStorage.getItem('testKey') === null;
    });
    expect(hasDataAfter).toBe(true);
  });
  
  test('Test 5: Global state is cleared', async ({ page }) => {
    // Set global state
    await page.evaluate(() => {
      window.gs = { marks: 9999, custom: true };
    });
    
    const state = await getGameState(page);
    expect(state.marks).toBe(9999);
    
    // Reset
    await resetGameState(page);
    await startNewGame(page);
    
    // Should have default marks, not 9999
    const stateAfter = await getGameState(page);
    expect(stateAfter.marks).toBe(800); // Default starting marks
  });
});
