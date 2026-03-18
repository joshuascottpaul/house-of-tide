// ══════════════════════════════════════════════════════════
//  UI SELECTOR CONSTANTS
// ══════════════════════════════════════════════════════════
// All DOM selectors in one place for maintainability
// ══════════════════════════════════════════════════════════

/**
 * Element IDs
 */
const ELEMENTS = {
  // Status Bar
  STATUS_BAR: '#status-bar',
  STAT_MARKS: '#stat-marks',
  STAT_REPUTATION: '#stat-rep',
  STAT_REP_TIER: '#stat-rep-tier',
  STAT_SHIPS: '#stat-ships',
  STAT_TURN: '#stat-turn',
  STAT_AGE: '#stat-age',
  STAT_PHASE: '#stat-phase',
  
  // Game Panels
  PANEL_EVENT: '#panel-event',
  PANEL_VENTURE: '#panel-venture',
  PANEL_TRADING: '#panel-trading',
  PANEL_YEAREND: '#panel-yearend',
  PANEL_RESULT: '#panel-result',
  PANEL_COMBAT: '#panel-combat',
  PANEL_MORTALITY: '#panel-mortality',
  
  // Event Content
  EVENT_TEXT: '#event-text',
  CHOICES_CONTAINER: '#choices-container',
  VENTURE_TEXT: '#venture-text',
  VENTURE_CHOICES: '#venture-choices',
  
  // Trading
  TRADING_CAPACITY: '#trading-capacity',
  TRADING_MARKET_BODY: '#trading-market-body',
  TRADING_SEASON_NOTE: '#trading-season-note',
  PORT_SELECTOR: '#port-selector',
  
  // Year-End
  YE_NOTE: '#ye-note',
  YE_HEIR: '#ye-heir',
  YE_FINANCE: '#ye-finance',
  
  // Ledger
  LEDGER_HISTORY: '#ledger-history',
  LEDGER_LINES: '#ledger-lines',
  
  // Allies
  ALLIES_DISPLAY: '#allies-display',
  
  // Threads
  THREAD_TRACKER: '#thread-tracker',
  THREAD_COUNT: '#thread-count',
  THREAD_TRACKER_LIST: '#thread-tracker-list',
  
  // Tutorial
  TUTORIAL_OVERLAY: '#tutorial-overlay',
  TUTORIAL_ICON: '#tutorial-icon',
  TUTORIAL_TITLE: '#tutorial-title',
  TUTORIAL_CONTENT: '#tutorial-content',
  
  // Advisor
  ADVISOR_TOGGLE: '#advisor-toggle',
  ADVISOR_PANEL: '#advisor-panel',
  ADVISOR_TEXT: '#advisor-text',
  
  // Buttons
  CONTINUE_BTN: '#continue-btn',
  YEAREND_BTN: '#yearend-btn',
  DEATH_HANDOFF_BTN: '#death-handoff-btn',
  
  // Overlays
  SAVE_OVERLAY: '#save-overlay',
  SETTINGS_OVERLAY: '#settings-overlay',
  
  // Debug
  DEBUG_PANEL: '#debug-panel',
  DEBUG_LOG: '#debug-log',
  DEBUG_TOGGLE: '#debug-toggle',
  
  // Error
  ERROR_BANNER: '#error-banner',
  
  // Loading
  LOADING_PANEL: '#loading-panel',
  LOADING_MSG: '#loading-msg',
  
  // Combat
  COMBAT_NARRATIVE: '#combat-narrative',
  COMBAT_ENEMY: '#combat-enemy',
  COMBAT_PLAYER: '#combat-player',
  COMBAT_TACTICS: '#combat-tactics',
  COMBAT_SELECTION: '#combat-selection',
  COMBAT_RESOLVE_BTN: '#combat-resolve-btn'
};

/**
 * CSS Classes
 */
const CLASSES = {
  // Buttons
  BTN: 'btn',
  BTN_VENTURE: 'btn-venture',
  CHOICE_BTN: 'choice-btn',
  TRADING_BTN: 'trading-btn',
  COMBAT_TACTIC_BTN: 'combat-tactic-btn',
  
  // States
  ACTIVE: 'active',
  SELECTED: 'selected',
  DISABLED: 'disabled',
  HIDDEN: 'hidden',
  
  // Urgency
  URGENT: 'urgent',
  WARNING: 'warning',
  NORMAL: 'normal',
  
  // Combat
  POSITIVE: 'positive',
  NEGATIVE: 'negative',
  
  // Delta values
  DELTA_POS: 'pos',
  DELTA_NEG: 'neg'
};

/**
 * Text Selectors (for page.click())
 */
const TEXT_SELECTORS = {
  // Navigation
  BEGIN_FOUNDING: 'text=Begin the Founding',
  OPEN_LEDGER: 'text=Open the Ledger',
  SKIP: 'text=Skip',
  CONTINUE: 'text=Continue',
  CLOSE_BOOKS: 'text=Close the Books',
  TURN_PAGE: 'text=Turn the Page',
  
  // Actions
  SAVE_LOAD: 'text=SAVE / LOAD',
  SETTINGS: 'text=Settings',
  CONSULT_ARCHIVIST: 'text=Consult the Archivist',
  
  // Trading
  BUY: 'text=BUY',
  SELL: 'text=SELL',
  MAX_BUY: 'text=MAX BUY',
  SELL_ALL: 'text=SELL ALL',
  
  // Combat
  FIGHT: 'text=Fight',
  PAY_TRIBUTE: 'text=Pay Tribute',
  FLEE: 'text=Flee',
  
  // Year-End
  COMMISSION_VESSEL: 'text=Commission a vessel',
  BUY_CANNON: 'text=Buy Cannon'
};

/**
 * Data Test IDs (for reliable testing)
 */
const DATA_TEST_IDS = {
  // Stats
  STAT_MARKS: '[data-testid="stat-marks"]',
  STAT_REPUTATION: '[data-testid="stat-reputation"]',
  STAT_SHIPS: '[data-testid="stat-ships"]',
  
  // Allies
  ALLY_BADGE: '[data-testid="ally-badge"]',
  
  // Trading
  CARGO_SALT_FISH: '[data-testid="cargo-saltfish"]',
  CARGO_WINE: '[data-testid="cargo-wine"]',
  CARGO_ALUM: '[data-testid="cargo-alum"]',
  CARGO_TIN: '[data-testid="cargo-tin"]',
  
  // Choices
  CHOICE_0: '[data-testid="choice-0"]',
  CHOICE_1: '[data-testid="choice-1"]',
  CHOICE_2: '[data-testid="choice-2"]',
  
  // Ports
  PORT_VERANTIA: '[data-testid="port-verantia"]',
  PORT_MASSO: '[data-testid="port-masso"]',
  PORT_CALDERA: '[data-testid="port-caldera"]',
  PORT_NORTHERN: '[data-testid="port-northern"]',
  
  // Combat
  COMBAT_TACTIC_AGGRESSIVE: '[data-testid="tactic-aggressive"]',
  COMBAT_TACTIC_DEFENSIVE: '[data-testid="tactic-defensive"]',
  COMBAT_TACTIC_EVASIVE: '[data-testid="tactic-evasive"]'
};

/**
 * Query selector helper
 * @param {string} id - Element ID from ELEMENTS
 * @returns {HTMLElement|null} Element or null
 */
function getElement(id) {
  return document.querySelector(id);
}

/**
 * Query selector all helper
 * @param {string} selector - CSS selector
 * @returns {NodeList} List of elements
 */
function getAll(selector) {
  return document.querySelectorAll(selector);
}

/**
 * Click by text helper
 * @param {string} text - Text to find
 * @returns {Promise<void>}
 */
async function clickByText(text) {
  const element = await document.evaluate(
    `//*[text()[contains(., '${text}')]]`,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
  
  if (element) {
    element.click();
  } else {
    throw new Error(`Element with text "${text}" not found`);
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.UI_SELECTORS = {
  ELEMENTS,
  CLASSES,
  TEXT_SELECTORS,
  DATA_TEST_IDS,
  getElement,
  getAll,
  clickByText
};

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.UI, 'UI selectors initialized');
}
