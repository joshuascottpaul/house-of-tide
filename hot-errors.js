// ══════════════════════════════════════════════════════════
//  GAME ERROR SYSTEM
// ══════════════════════════════════════════════════════════
// Consistent error format with codes and context
// ══════════════════════════════════════════════════════════

/**
 * Error codes for consistent error handling
 */
const ERROR_CODES = {
  // Game State Errors
  GAME_STATE_NOT_INITIALIZED: 'GAME_STATE_NOT_INITIALIZED',
  GAME_STATE_CORRUPTED: 'GAME_STATE_CORRUPTED',
  SAVE_FAILED: 'SAVE_FAILED',
  LOAD_FAILED: 'LOAD_FAILED',
  
  // AI Errors
  AI_RESPONSE_INVALID: 'AI_RESPONSE_INVALID',
  AI_RESPONSE_TIMEOUT: 'AI_RESPONSE_TIMEOUT',
  AI_JSON_PARSE_FAILED: 'AI_JSON_PARSE_FAILED',
  AI_BACKEND_UNAVAILABLE: 'AI_BACKEND_UNAVAILABLE',
  
  // Trading Errors
  INSUFFICIENT_FUNDS: 'INSUFFICIENT_FUNDS',
  INSUFFICIENT_CAPACITY: 'INSUFFICIENT_CAPACITY',
  INVALID_COMMODITY: 'INVALID_COMMODITY',
  INVALID_QUANTITY: 'INVALID_QUANTITY',
  
  // Combat Errors
  COMBAT_CALCULATION_FAILED: 'COMBAT_CALCULATION_FAILED',
  NO_ACTIVE_ENCOUNTER: 'NO_ACTIVE_ENCOUNTER',
  
  // Thread Errors
  THREAD_NOT_FOUND: 'THREAD_NOT_FOUND',
  THREAD_ALREADY_RESOLVED: 'THREAD_ALREADY_RESOLVED',
  
  // Victory Errors
  VICTORY_CHECK_FAILED: 'VICTORY_CHECK_FAILED',
  
  // UI Errors
  ELEMENT_NOT_FOUND: 'ELEMENT_NOT_FOUND',
  RENDER_FAILED: 'RENDER_FAILED',
  
  // Validation Errors
  VALIDATION_FAILED: 'VALIDATION_FAILED',
  INVALID_PARAMETER: 'INVALID_PARAMETER'
};

/**
 * GameError class for consistent error handling
 */
class GameError extends Error {
  /**
   * Create a GameError
   * @param {string} code - Error code from ERROR_CODES
   * @param {string} message - Human-readable error message
   * @param {object} [context] - Additional context data
   * @param {Error} [cause] - Original error if this is a wrapper
   */
  constructor(code, message, context = {}, cause = null) {
    super(message);
    this.name = 'GameError';
    this.code = code;
    this.context = context;
    this.cause = cause;
    this.timestamp = new Date().toISOString();
    
    // Capture stack trace
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, GameError);
    }
  }
  
  /**
   * Convert error to plain object for logging/export
   * @returns {object} Plain error object
   */
  toJSON() {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      context: this.context,
      timestamp: this.timestamp,
      stack: this.stack
    };
  }
  
  /**
   * Log error using Logger system
   */
  log() {
    if (window.Logger) {
      Logger.error(Logger.CATEGORIES.ERROR, this.message, this, this.context);
    } else {
      console.error('[GameError]', this.code, this.message, this.context);
    }
  }
  
  /**
   * Capture error for bug reports
   */
  capture() {
    if (window.ErrorCapture) {
      ErrorCapture.capture(this, 'GameError', this.context);
    }
  }
}

/**
 * Create specific error types
 */
const GameErrors = {
  /**
   * Create game state error
   * @param {string} message - Error message
   * @param {object} [context] - Context data
   */
  gameState(message, context = {}) {
    return new GameError(ERROR_CODES.GAME_STATE_CORRUPTED, message, context);
  },
  
  /**
   * Create save/load error
   * @param {string} operation - 'save' or 'load'
   * @param {Error} [cause] - Original error
   */
  saveLoad(operation, cause = null) {
    const code = operation === 'save' ? ERROR_CODES.SAVE_FAILED : ERROR_CODES.LOAD_FAILED;
    return new GameError(code, `Failed to ${operation} game state`, { operation }, cause);
  },
  
  /**
   * Create AI error
   * @param {string} type - Error type (invalid, timeout, parse, unavailable)
   * @param {object} [context] - Context data (backend, model, etc.)
   * @param {Error} [cause] - Original error
   */
  ai(type, context = {}, cause = null) {
    const codes = {
      invalid: ERROR_CODES.AI_RESPONSE_INVALID,
      timeout: ERROR_CODES.AI_RESPONSE_TIMEOUT,
      parse: ERROR_CODES.AI_JSON_PARSE_FAILED,
      unavailable: ERROR_CODES.AI_BACKEND_UNAVAILABLE
    };
    return new GameError(codes[type] || codes.invalid, `AI error: ${type}`, context, cause);
  },
  
  /**
   * Create trading error
   * @param {string} type - Error type (funds, capacity, commodity, quantity)
   * @param {object} [context] - Context data (marks, capacity, etc.)
   */
  trading(type, context = {}) {
    const codes = {
      funds: ERROR_CODES.INSUFFICIENT_FUNDS,
      capacity: ERROR_CODES.INSUFFICIENT_CAPACITY,
      commodity: ERROR_CODES.INVALID_COMMODITY,
      quantity: ERROR_CODES.INVALID_QUANTITY
    };
    const messages = {
      funds: `Insufficient marks (have: ${context.have || 0}, need: ${context.need || 0})`,
      capacity: `Insufficient cargo capacity (have: ${context.have || 0}, need: ${context.need || 0})`,
      commodity: `Invalid commodity: ${context.commodity || 'unknown'}`,
      quantity: `Invalid quantity: ${context.quantity || 0}`
    };
    return new GameError(codes[type] || codes.funds, messages[type] || 'Trading error', context);
  },
  
  /**
   * Create validation error
   * @param {string} field - Field that failed validation
   * @param {string} reason - Validation failure reason
   * @param {object} [context] - Context data
   */
  validation(field, reason, context = {}) {
    return new GameError(
      ERROR_CODES.VALIDATION_FAILED,
      `Validation failed for ${field}: ${reason}`,
      { field, reason, ...context }
    );
  }
};

/**
 * Wrap a function with error handling
 * @param {Function} fn - Function to wrap
 * @param {string} errorCode - Error code to use on failure
 * @param {string} defaultMessage - Default error message
 * @returns {Function} Wrapped function
 */
function withErrorHandling(fn, errorCode, defaultMessage) {
  return async function(...args) {
    try {
      return await fn.apply(this, args);
    } catch (error) {
      const gameError = new GameError(errorCode, defaultMessage, { args }, error);
      gameError.log();
      gameError.capture();
      throw gameError;
    }
  };
}

/**
 * Validate required parameters
 * @param {object} params - Parameters to validate
 * @param {array} required - Array of required parameter names
 * @throws {GameError} If validation fails
 */
function validateRequired(params, required) {
  const missing = required.filter(key => params[key] === undefined || params[key] === null);
  if (missing.length > 0) {
    throw GameErrors.validation('parameters', `Missing required parameters: ${missing.join(', ')}`, {
      provided: Object.keys(params),
      required
    });
  }
}

/**
 * Validate number range
 * @param {number} value - Value to validate
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @param {string} name - Parameter name for error message
 * @throws {GameError} If validation fails
 */
function validateRange(value, min, max, name = 'value') {
  if (typeof value !== 'number' || isNaN(value)) {
    throw GameErrors.validation(name, 'Must be a number', { value });
  }
  if (value < min || value > max) {
    throw GameErrors.validation(name, `Must be between ${min} and ${max}`, { value, min, max });
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.ERROR_CODES = ERROR_CODES;
window.GameError = GameError;
window.GameErrors = GameErrors;
window.withErrorHandling = withErrorHandling;
window.validateRequired = validateRequired;
window.validateRange = validateRange;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.ERROR, 'Error system initialized');
}
