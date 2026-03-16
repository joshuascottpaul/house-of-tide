/**
 * LOGGER SYSTEM TESTS
 * 
 * Tests the centralized logging system for proper categorization,
 * levels, and error capture.
 */

import { test, expect } from '@playwright/test';

test.describe('Logger System', () => {
  
  test('Logger is available globally', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Check Logger exists
    const loggerExists = await page.evaluate(() => typeof window.Logger !== 'undefined');
    expect(loggerExists).toBe(true);
    
    // Check ErrorCapture exists
    const errorCaptureExists = await page.evaluate(() => typeof window.ErrorCapture !== 'undefined');
    expect(errorCaptureExists).toBe(true);
  });
  
  test('Logger has all required methods', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const methods = await page.evaluate(() => {
      return {
        debug: typeof window.Logger.debug === 'function',
        info: typeof window.Logger.info === 'function',
        warn: typeof window.Logger.warn === 'function',
        error: typeof window.Logger.error === 'function',
        exportLogs: typeof window.Logger.exportLogs === 'function',
        clear: typeof window.Logger.clear === 'function',
        setLevel: typeof window.Logger.setLevel === 'function'
      };
    });
    
    expect(methods.debug).toBe(true);
    expect(methods.info).toBe(true);
    expect(methods.warn).toBe(true);
    expect(methods.error).toBe(true);
    expect(methods.exportLogs).toBe(true);
    expect(methods.clear).toBe(true);
    expect(methods.setLevel).toBe(true);
  });
  
  test('Logger respects log levels', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    // Set to error level only
    await page.evaluate(() => window.Logger.setLevel('error'));
    
    // Clear existing logs
    await page.evaluate(() => window.Logger.clear());
    
    // Try to log at different levels
    const result = await page.evaluate(() => {
      window.Logger.debug('test', 'This should not appear');
      window.Logger.info('test', 'This should not appear');
      window.Logger.warn('test', 'This should not appear');
      window.Logger.error('test', 'This should appear', null, { testData: true });
      
      const logs = window.Logger.logBuffer;
      return {
        totalLogs: logs.length,
        lastLogLevel: logs[logs.length - 1]?.level,
        lastLogMessage: logs[logs.length - 1]?.message
      };
    });
    
    expect(result.totalLogs).toBe(1); // Only error should be logged
    expect(result.lastLogLevel).toBe('ERROR');
    expect(result.lastLogMessage).toBe('This should appear');
  });
  
  test('ErrorCapture captures errors', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const result = await page.evaluate(() => {
      // Capture a test error
      const testError = new Error('Test error message');
      window.ErrorCapture.capture(testError, 'Test Context', { extra: 'data' });
      
      return {
        errorCount: window.ErrorCapture.errors.length,
        lastError: window.ErrorCapture.errors[window.ErrorCapture.errors.length - 1]
      };
    });
    
    expect(result.errorCount).toBe(1);
    expect(result.lastError.context).toBe('Test Context');
    expect(result.lastError.message).toBe('Test error message');
    expect(result.lastError.data.extra).toBe('data');
  });
  
  test('Logger export includes game state', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.click('text=Begin the Founding');
    await page.fill('#input-dynasty', 'TestHouse');
    await page.fill('#input-founder', 'Founder');
    await page.click('text=Open the Ledger');
    await page.click('text=Skip →');
    
    const logs = await page.evaluate(() => {
      // Log something
      window.Logger.info('test', 'Test log message', { testData: true });
      
      // Export logs
      return JSON.parse(window.Logger.exportLogs());
    });
    
    expect(logs.gameState).toBeDefined();
    expect(logs.gameState.turn).toBe(1);
    expect(logs.logs).toBeDefined();
    expect(logs.logs.length).toBeGreaterThan(0);
  });
  
  test('ErrorCapture export includes error details', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const report = await page.evaluate(() => {
      const testError = new Error('Export test error');
      window.ErrorCapture.capture(testError, 'Export Test', { test: true });
      return JSON.parse(window.ErrorCapture.exportReport());
    });
    
    expect(report.totalErrors).toBe(1);
    expect(report.errors[0].context).toBe('Export Test');
    expect(report.errors[0].message).toBe('Export test error');
  });
  
  test('Logger buffer has max size', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const bufferSize = await page.evaluate(() => {
      // Log 150 messages (more than maxBufferSize of 100)
      for (let i = 0; i < 150; i++) {
        window.Logger.info('test', `Message ${i}`);
      }
      return window.Logger.logBuffer.length;
    });
    
    expect(bufferSize).toBe(100); // Should be capped at maxBufferSize
  });
  
  test('Logger categories are defined', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const categories = await page.evaluate(() => window.Logger.CATEGORIES);
    
    expect(categories.STATE).toBe('state');
    expect(categories.UI).toBe('ui');
    expect(categories.AI).toBe('ai');
    expect(categories.TRADING).toBe('trading');
    expect(categories.COMBAT).toBe('combat');
    expect(categories.TUTORIAL).toBe('tutorial');
    expect(categories.ERROR).toBe('error');
    expect(categories.PERF).toBe('perf');
  });
});
