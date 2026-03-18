// ══════════════════════════════════════════════════════════
//  VICTORY CONDITIONS SYSTEM (Paravia — Multiple Endings)
// ══════════════════════════════════════════════════════════
// Checks for victory conditions and provides epilogues
// ══════════════════════════════════════════════════════════

/**
 * Victory condition thresholds
 */
const VICTORY_THRESHOLDS = {
  ECONOMIC: { marks: 10000, ships: 8, buildings: 4 },
  POLITICAL: { reputation: 10, buildings: 3, rivalAlliances: 2 },
  DYNASTIC: { generations: 5, reputation: 7, buildings: 2 }
};

/**
 * Check if any victory condition is met
 * @returns {string|null} Victory type or null
 */
function checkVictoryConditions() {
  // Economic Victory — Master of Trade
  if (gs.marks >= VICTORY_THRESHOLDS.ECONOMIC.marks &&
      gs.ships >= VICTORY_THRESHOLDS.ECONOMIC.ships &&
      Object.keys(gs.buildings).length >= VICTORY_THRESHOLDS.ECONOMIC.buildings) {
    gs.victoryType = 'economic';
    return 'economic';
  }

  // Political Victory — Master of Verantia
  if (gs.reputation >= VICTORY_THRESHOLDS.POLITICAL.reputation &&
      Object.keys(gs.buildings).length >= VICTORY_THRESHOLDS.POLITICAL.buildings) {
    // Count rival alliances (relationship >= 3)
    const alliances = Object.values(gs.rivals).filter(r => r.relationship >= 3).length;
    if (alliances >= VICTORY_THRESHOLDS.POLITICAL.rivalAlliances) {
      gs.victoryType = 'political';
      return 'political';
    }
  }

  // Dynastic Victory — Legacy Endures
  if (gs.generation >= VICTORY_THRESHOLDS.DYNASTIC.generations &&
      gs.reputation >= VICTORY_THRESHOLDS.DYNASTIC.reputation &&
      Object.keys(gs.buildings).length >= VICTORY_THRESHOLDS.DYNASTIC.buildings) {
    gs.victoryType = 'dynastic';
    return 'dynastic';
  }

  return null;
}

/**
 * Get victory epilogue text
 * @returns {string} Victory epilogue
 */
function getVictoryEpilogue() {
  switch(gs.victoryType) {
    case 'economic':
      return `House ${gs.dynastyName} dominates the archipelago. Your fleet commands the seas. The ledger records: ${gs.marks} marks, ${gs.ships} ships. The Borracchi send gifts. The Spinetta seek alliances. The Calmari — for the first time in living memory — request an audience. You have become what you set out to build. The sea acknowledges your mastery.`;
    case 'political':
      return `House ${gs.dynastyName} is Verantia. Your seat in the Guild shapes policy. Your name opens doors that were locked to your founder. The harbourmaster bows. The notary seeks your approval. The ledger records not just wealth, but influence. You have not just survived the city — you have become it.`;
    case 'dynastic':
      return `Five generations. The palazzo remembers each founder. The warehouse your great-grandfather built still stands. The guild seat bears your name. The sea has taken some of your blood — the ledger does not forget — but the house endures. Your heir will continue. The ledger is still open.`;
    default:
      return `House ${gs.dynastyName} continues. The ledger records your deeds. The sea waits.`;
  }
}

/**
 * Show victory screen
 * @param {string} victoryType - Type of victory achieved
 */
function showVictoryScreen(victoryType) {
  // Set victory type if not already set
  if (!gs.victoryType) {
    gs.victoryType = victoryType;
  }

  // Log victory
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Victory achieved: ${victoryType}`, {
      marks: gs.marks,
      ships: gs.ships,
      reputation: gs.reputation,
      generation: gs.generation,
      buildings: Object.keys(gs.buildings).length
    });
  }

  // Show victory UI (reuse death screen structure for now)
  showDeathScreen();
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.VICTORY_THRESHOLDS = VICTORY_THRESHOLDS;
window.checkVictoryConditions = checkVictoryConditions;
window.getVictoryEpilogue = getVictoryEpilogue;
window.showVictoryScreen = showVictoryScreen;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.STATE, 'Victory system initialized');
}
