// ══════════════════════════════════════════════════════════
//  STATE SNAPSHOTS FOR DEBUGGING
// ══════════════════════════════════════════════════════════
// Take snapshots of game state at key moments
// Restore snapshots for debugging
// Export snapshots for bug reports
// ══════════════════════════════════════════════════════════

const DebugSnapshots = {
  snapshots: [],
  maxSnapshots: 10,
  autoSnapshotEnabled: true,
  
  /**
   * Take a snapshot of current game state
   * @param {string} label - Descriptive label for this snapshot
   * @returns {object} The snapshot object
   */
  takeSnapshot(label) {
    const snapshot = {
      id: Date.now(),
      label: label || `Turn-${gs.turn}-${gs.phase}`,
      timestamp: new Date().toISOString(),
      turn: gs.turn,
      phase: gs.phase,
      generation: gs.generation,
      state: JSON.parse(serialiseState())
    };
    
    this.snapshots.push(snapshot);
    
    // Keep only last N snapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots.shift();
    }
    
    Logger.info(Logger.CATEGORIES.STATE, `Snapshot taken: ${label}`, {
      turn: gs.turn,
      phase: gs.phase
    });
    
    return snapshot;
  },
  
  /**
   * Restore a snapshot by index
   * @param {number} index - Index in snapshots array
   * @returns {boolean} True if successful
   */
  restoreSnapshot(index) {
    if (index < 0 || index >= this.snapshots.length) {
      Logger.error(Logger.CATEGORIES.STATE, 'Invalid snapshot index', null, { index });
      return false;
    }
    
    const snapshot = this.snapshots[index];
    
    try {
      loadSavedGame(snapshot.state);
      Logger.info(Logger.CATEGORIES.STATE, `Snapshot restored: ${snapshot.label}`, {
        turn: snapshot.turn,
        phase: snapshot.phase
      });
      return true;
    } catch (error) {
      Logger.error(Logger.CATEGORIES.STATE, 'Failed to restore snapshot', error, {
        snapshotId: snapshot.id
      });
      ErrorCapture.capture(error, 'Snapshot Restore', { snapshot });
      return false;
    }
  },
  
  /**
   * Restore most recent snapshot
   * @returns {boolean} True if successful
   */
  restoreLastSnapshot() {
    if (this.snapshots.length === 0) {
      Logger.warn(Logger.CATEGORIES.STATE, 'No snapshots to restore');
      return false;
    }
    return this.restoreSnapshot(this.snapshots.length - 1);
  },
  
  /**
   * Get snapshot by label
   * @param {string} label - Label to search for
   * @returns {object|null} Snapshot or null
   */
  getSnapshotByLabel(label) {
    return this.snapshots.find(s => s.label === label) || null;
  },
  
  /**
   * List all snapshots
   * @returns {array} Array of snapshot summaries
   */
  listSnapshots() {
    return this.snapshots.map(s => ({
      id: s.id,
      label: s.label,
      turn: s.turn,
      phase: s.phase,
      timestamp: s.timestamp
    }));
  },
  
  /**
   * Export snapshots for bug reports
   * @returns {string} JSON string
   */
  exportSnapshots() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      count: this.snapshots.length,
      snapshots: this.snapshots
    }, null, 2);
  },
  
  /**
   * Import snapshots from JSON
   * @param {string} jsonString - JSON string from export
   * @returns {boolean} True if successful
   */
  importSnapshots(jsonString) {
    try {
      const data = JSON.parse(jsonString);
      if (data.snapshots && Array.isArray(data.snapshots)) {
        this.snapshots = data.snapshots;
        Logger.info(Logger.CATEGORIES.STATE, `Imported ${this.snapshots.length} snapshots`);
        return true;
      }
      return false;
    } catch (error) {
      Logger.error(Logger.CATEGORIES.STATE, 'Failed to import snapshots', error);
      return false;
    }
  },
  
  /**
   * Clear all snapshots
   */
  clear() {
    this.snapshots = [];
    Logger.info(Logger.CATEGORIES.STATE, 'All snapshots cleared');
  },
  
  /**
   * Enable/disable auto-snapshots
   * @param {boolean} enabled
   */
  setAutoSnapshot(enabled) {
    this.autoSnapshotEnabled = enabled;
    Logger.info(Logger.CATEGORIES.STATE, `Auto-snapshot ${enabled ? 'enabled' : 'disabled'}`);
  }
};

// ══════════════════════════════════════════════════════════
//  AUTO-SNAPSHOT ON KEY EVENTS
// ══════════════════════════════════════════════════════════

// Snapshot at turn start
const _origBeginPhase = window.beginPhase;
if (_origBeginPhase) {
  window.beginPhase = function() {
    if (DebugSnapshots.autoSnapshotEnabled) {
      DebugSnapshots.takeSnapshot(`Turn-${gs.turn}-${gs.phase}-start`);
    }
    _origBeginPhase.apply(this, arguments);
  };
}

// Snapshot before combat
// (Will be integrated when combat code is refactored)

// Snapshot before AI calls
// (Will be integrated into hot-llm.js)

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.DebugSnapshots = DebugSnapshots;

Logger.info(Logger.CATEGORIES.STATE, 'DebugSnapshots initialized');
