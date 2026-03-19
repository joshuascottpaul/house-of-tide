// ══════════════════════════════════════════════════════════
//  GAME CONSTANTS
// ══════════════════════════════════════════════════════════
// All magic numbers replaced with named constants
// ══════════════════════════════════════════════════════════

/**
 * Starting game state values
 */
const STARTING = {
  MARKS: 800,
  REPUTATION: 5,
  SHIPS: 1,
  TURN: 1,
  AGE: 28,
  HEIR_AGE: 7,
  GENERATION: 1
};

/**
 * Starting age and death age
 */
const AGES = {
  START: 28,
  DEATH: 65,
  HEIR_START: 7,
  HEIR_MARRIAGE: 14,
  HEIR_INFLUENCE: 10  // Age when heir starts influencing choices
};

/**
 * Victory condition thresholds
 */
const VICTORY = {
  ECONOMIC: {
    MARKS: 10000,
    SHIPS: 8,
    BUILDINGS: 4
  },
  POLITICAL: {
    REPUTATION: 10,
    BUILDINGS: 3,
    RIVAL_ALLIANCES: 2
  },
  DYNASTIC: {
    GENERATIONS: 5,
    REPUTATION: 7,
    BUILDINGS: 2
  }
};

/**
 * Reputation tiers and thresholds
 */
const REPUTATION = {
  LEGENDARY: 9,
  RENOWNED: 7,
  ESTABLISHED: 5,
  PRECARIOUS: 3,
  DISGRACED: 0
};

/**
 * Economic constants
 */
const ECONOMY = {
  // Fleet income
  BASE_RATE_PER_SHIP: 85,  // marks per ship per year
  UPKEEP_PER_SHIP: 20,     // marks per ship per year
  INCOME_VARIANCE: 0.30,   // ±30% variance
  
  // Building costs
  BUILDING_MAINTENANCE: 25,  // marks per building per year
  
  // Lifestyle costs
  LIFESTYLE_PER_REP: 15,  // marks per reputation point
  
  // Cannon costs
  CANNON_COST: 50,  // marks per cannon
  
  // Skill training
  SKILL_TRAINING_COST: 200,  // marks per level
  SKILL_MAX_LEVEL: 5
};

/**
 * Combat constants
 */
const COMBAT = {
  // Pirate encounter
  BASE_CHANCE: 0.10,        // 10% base chance
  NORTHERN_BONUS: 0.15,     // +15% in Northern port
  CALDERA_BONUS: 0.05,      // +5% in Caldera port
  CANNON_REDUCTION: 0.02,   // -2% per cannon
  SEAMANSHIP_REDUCTION: 0.01,  // -1% per seamanship level
  MIN_CHANCE: 0.02,         // Minimum 2% chance
  MAX_CHANCE: 0.50,         // Maximum 50% chance
  
  // Combat tactics
  TACTICS: {
    AGGRESSIVE_BONUS: 3,
    DEFENSIVE_BONUS: 0,
    EVASIVE_BONUS: -2
  },
  
  // Flee check
  FLEE_DC: 12,  // Difficulty class for successful escape
  FLEE_SEAMANSHIP_MULTIPLIER: 2
};

/**
 * Thread system constants
 */
const THREADS = {
  MIN_AGE: 2,           // Minimum years before thread returns
  NORMAL_CHANCE: 0.30,  // 30% chance for normal threads
  WARNING_CHANCE: 0.50, // 50% chance for warning threads
  URGENT_CHANCE: 1.00,  // 100% chance for urgent threads
  
  // Urgency levels
  URGENCY: {
    NORMAL: 'normal',
    WARNING: 'warning',
    URGENT: 'urgent'
  },
  
  // Urgency thresholds
  WARNING_AGE: 3,       // Become warning after 3 years
  URGENT_TIME_LEFT: 1   // Become urgent with 1 year left
};

/**
 * Tutorial triggers
 */
const TUTORIAL_TRIGGERS = {
  BUILDINGS_YEAR: 2,
  SKILLS_YEAR: 3,
  MARRIAGE_YEAR: 4,
  VENTURE_YEAR: 5,
  MARRIAGE_HEIR_AGE: 14
};

/**
 * AI backend defaults
 */
const AI = {
  DEFAULT_BACKEND: 'ollama',
  DEFAULT_MLX_MODEL: 'mlx-community/Qwen2.5-7B-Instruct-4bit',
  DEFAULT_OLLAMA_MODEL: 'mistral:latest',
  DEFAULT_CLAUDE_MODEL: 'claude-haiku-4-5-20251001',
  DEFAULT_OPENAI_MODEL: 'gpt-4o-mini',
  
  // Temperature and token limits
  DEFAULT_TEMPERATURE: 0.88,
  DEFAULT_MAX_TOKENS: 900
};

/**
 * UI constants
 */
const UI = {
  // Viewport sizes
  MOBILE_WIDTH: 375,
  TABLET_WIDTH: 768,
  DESKTOP_WIDTH: 1280,
  
  // Status bar
  STATUS_BAR_HEIGHT: 0,  // Calculated dynamically
  
  // Tutorial overlay
  TUTORIAL_DELAY: 500,  // ms before showing tutorial
  TUTORIAL_AUTO_CLOSE: false  // Tutorials don't auto-close
};

/**
 * Save system constants
 */
const SAVE = {
  KEY_PREFIX: 'house_of_tide_save_',
  AUTOSAVE_KEY: 'house_of_tide_autosave',
  NUM_SLOTS: 3,
  APPEARANCE_KEY: 'hot_appearance',
  CUSTOM_BG_KEY: 'hot_custom_bg'
};

/**
 * Phase names
 */
const PHASES = {
  HOUSE: 'house',
  ROUTES: 'routes',
  TRADING: 'trading',
  YEAREND: 'yearend'
};

/**
 * Commodity types
 */
const COMMODITIES = {
  SALT_FISH: 'saltfish',
  WINE: 'wine',
  ALUM: 'alum',
  TIN: 'tin'
};

/**
 * Skill types
 */
const SKILLS = {
  NEGOTIATION: 'negotiation',
  SEAMANSHIP: 'seamanship',
  POLITICS: 'politics',
  INTRIGUE: 'intrigue'
};

/**
 * Skill check difficulty classes
 */
const SKILL_DC = {
  EASY: 8,
  MEDIUM: 12,
  HARD: 15,
  VERY_HARD: 18
};

/**
 * Skill check bonuses per level
 */
const SKILL_BONUS_PER_LEVEL = 1; // +1 per skill level

/**
 * Export all constants for global access
 */
window.CONSTANTS = {
  STARTING,
  AGES,
  VICTORY,
  REPUTATION,
  ECONOMY,
  COMBAT,
  THREADS,
  TUTORIALS: TUTORIAL_TRIGGERS,
  AI,
  UI,
  SAVE,
  PHASES,
  COMMODITIES,
  SKILLS,
  SKILL_DC,
  SKILL_BONUS_PER_LEVEL
};

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.STATE, 'Constants system initialized');
}

// ══════════════════════════════════════════════════════════
//  SKILL CHECK HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════

/**
 * Make a skill check
 * @param {string} skill - Skill name
 * @param {number} dc - Difficulty class
 * @returns {object} Check result { success, roll, total, dc }
 */
function makeSkillCheck(skill, dc) {
  const skillLevel = gs.skills[skill] || 0;
  const roll = Math.floor(Math.random() * 20) + 1; // d20
  const bonus = skillLevel * SKILL_BONUS_PER_LEVEL;
  const total = roll + bonus;
  const success = total >= dc;
  
  const result = {
    skill,
    dc,
    roll,
    bonus,
    total,
    success,
    natural20: roll === 20,
    natural1: roll === 1
  };
  
  // Log skill check
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Skill check: ${skill} vs DC ${dc}`, result);
  }
  
  return result;
}

/**
 * Get skill check DC name
 * @param {number} dc - Difficulty class
 * @returns {string} DC name
 */
function getDCName(dc) {
  if (dc <= SKILL_DC.EASY) return 'Easy';
  if (dc <= SKILL_DC.MEDIUM) return 'Medium';
  if (dc <= SKILL_DC.HARD) return 'Hard';
  return 'Very Hard';
}

// Export skill check functions
window.makeSkillCheck = makeSkillCheck;
window.getDCName = getDCName;
