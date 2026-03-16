/**
 * ENHANCED TEST HELPERS VERIFICATION
 * 
 * Tests the new test helper functions.
 */

import { test, expect } from '@playwright/test';
import {
  startNewGame,
  resetGameState,
  getGameState,
  advanceToPhase,
  createTestHouse,
  createTestEvent,
  expectGameState
} from '../tests/helpers';

test.describe('Enhanced Test Helpers', () => {
  
  test('startNewGame works with default options', async ({ page }) => {
    await startNewGame(page);
    
    const state = await getGameState(page);
    expect(state.dynastyName).toBe('TestHouse');
    expect(state.founderName).toBe('Tester');
    expect(state.turn).toBe(1);
  });
  
  test('startNewGame works with custom options', async ({ page }) => {
    await startNewGame(page, {
      dynasty: 'CustomHouse',
      founder: 'CustomFounder',
      skipOnboarding: true
    });
    
    const state = await getGameState(page);
    expect(state.dynastyName).toBe('CustomHouse');
    expect(state.founderName).toBe('CustomFounder');
  });
  
  test('resetGameState clears all state', async ({ page }) => {
    // Start a game
    await startNewGame(page);
    const state1 = await getGameState(page);
    expect(state1.dynastyName).toBe('TestHouse');
    
    // Reset
    await resetGameState(page);
    
    // Start new game
    await startNewGame(page, { dynasty: 'NewHouse' });
    const state2 = await getGameState(page);
    expect(state2.dynastyName).toBe('NewHouse');
  });
  
  test('advanceToPhase works correctly', async ({ page }) => {
    await startNewGame(page);
    
    // Should start in house phase
    const state1 = await getGameState(page);
    expect(state1.phase).toBe('house');
    
    // Advance to routes
    await advanceToPhase(page, 'routes');
    const state2 = await getGameState(page);
    expect(state2.phase).toBe('routes');
  });
  
  test('createTestHouse factory works', async () => {
    const house = createTestHouse();
    expect(house.marks).toBe(800);
    expect(house.reputation).toBe(5);
    expect(house.ships).toBe(1);
    
    const customHouse = createTestHouse({ marks: 5000, ships: 10 });
    expect(customHouse.marks).toBe(5000);
    expect(customHouse.ships).toBe(10);
  });
  
  test('createTestEvent factory works', async () => {
    const event = createTestEvent('house');
    expect(event.type).toBe('house');
    expect(event.choices.length).toBe(3);
    
    const customEvent = createTestEvent('routes', { text: 'Custom text' });
    expect(customEvent.text).toBe('Custom text');
  });
  
  test('expectGameState assertion helper works', async () => {
    const actualState = {
      marks: 800,
      reputation: 5,
      ships: 1,
      phase: 'house'
    };
    
    // Should not throw
    expectGameState(actualState, {
      marks: 800,
      reputation: 5
    });
    
    // Should throw on mismatch
    expect(() => {
      expectGameState(actualState, { marks: 999 });
    }).toThrow();
  });
});
