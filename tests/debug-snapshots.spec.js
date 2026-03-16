/**
 * DEBUG SNAPSHOTS TESTS
 * 
 * Tests the state snapshot system for debugging.
 */

import { test, expect } from '@playwright/test';

test.describe('Debug Snapshots', () => {
  
  test('DebugSnapshots is available globally', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const exists = await page.evaluate(() => typeof window.DebugSnapshots !== 'undefined');
    expect(exists).toBe(true);
  });
  
  test('Take and list snapshots', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const result = await page.evaluate(() => {
      // Take 3 snapshots
      window.DebugSnapshots.takeSnapshot('Test-1');
      window.DebugSnapshots.takeSnapshot('Test-2');
      window.DebugSnapshots.takeSnapshot('Test-3');
      
      // List them
      const list = window.DebugSnapshots.listSnapshots();
      
      return {
        count: list.length,
        labels: list.map(s => s.label)
      };
    });
    
    expect(result.count).toBe(3);
    expect(result.labels).toContain('Test-1');
    expect(result.labels).toContain('Test-2');
    expect(result.labels).toContain('Test-3');
  });
  
  test('Snapshot max buffer works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const count = await page.evaluate(() => {
      // Take 15 snapshots (more than max of 10)
      for (let i = 0; i < 15; i++) {
        window.DebugSnapshots.takeSnapshot(`Test-${i}`);
      }
      return window.DebugSnapshots.snapshots.length;
    });
    
    expect(count).toBe(10); // Should be capped at maxSnapshots
  });
  
  test('Export and import snapshots', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const result = await page.evaluate(() => {
      // Take a snapshot
      window.DebugSnapshots.takeSnapshot('Export-Test');
      
      // Export
      const exported = window.DebugSnapshots.exportSnapshots();
      
      // Clear
      window.DebugSnapshots.clear();
      
      // Import
      window.DebugSnapshots.importSnapshots(exported);
      
      // Verify
      const list = window.DebugSnapshots.listSnapshots();
      return {
        count: list.length,
        firstLabel: list[0]?.label
      };
    });
    
    expect(result.count).toBe(1);
    expect(result.firstLabel).toBe('Export-Test');
  });
  
  test('Get snapshot by label', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const result = await page.evaluate(() => {
      window.DebugSnapshots.takeSnapshot('Find-Me');
      window.DebugSnapshots.takeSnapshot('Other-Label');
      
      const snapshot = window.DebugSnapshots.getSnapshotByLabel('Find-Me');
      return {
        found: snapshot !== null,
        label: snapshot?.label
      };
    });
    
    expect(result.found).toBe(true);
    expect(result.label).toBe('Find-Me');
  });
  
  test('Snapshot includes game state', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.click('text=Begin the Founding');
    await page.fill('#input-dynasty', 'SnapshotTest');
    await page.fill('#input-founder', 'Founder');
    await page.click('text=Open the Ledger');
    await page.click('text=Skip →');
    
    const snapshot = await page.evaluate(() => {
      window.DebugSnapshots.takeSnapshot('After-Start');
      const snapshots = window.DebugSnapshots.listSnapshots();
      return snapshots[snapshots.length - 1];
    });
    
    expect(snapshot.turn).toBe(1);
    expect(snapshot.phase).toBe('house');
  });
  
  test('Clear snapshots works', async ({ page }) => {
    await page.goto('house-of-tide.html');
    
    const count = await page.evaluate(() => {
      window.DebugSnapshots.takeSnapshot('Test-1');
      window.DebugSnapshots.takeSnapshot('Test-2');
      window.DebugSnapshots.clear();
      return window.DebugSnapshots.snapshots.length;
    });
    
    expect(count).toBe(0);
  });
  
  test('Auto-snapshot on beginPhase', async ({ page }) => {
    await page.goto('house-of-tide.html');
    await page.click('text=Begin the Founding');
    await page.fill('#input-dynasty', 'AutoSnap');
    await page.fill('#input-founder', 'Founder');
    await page.click('text=Open the Ledger');
    await page.click('text=Skip →');
    
    // Complete first turn to trigger beginPhase
    await page.click('text=Continue →');
    
    const snapshots = await page.evaluate(() => {
      return window.DebugSnapshots.listSnapshots();
    });
    
    // Should have at least one auto-snapshot from beginPhase
    expect(snapshots.length).toBeGreaterThan(0);
  });
});
