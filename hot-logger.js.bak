// ══════════════════════════════════════════════════════════
//  CENTRALIZED LOGGING SYSTEM
// ══════════════════════════════════════════════════════════
// Categories: state, ui, ai, trading, combat, tutorial, error, perf
// Levels: debug, info, warn, error
// ══════════════════════════════════════════════════════════

const Logger = {
  // Configuration
  level: 'info', // debug, info, warn, error
  enabled: true,
  logBuffer: [],
  maxBufferSize: 100,
  
  // Categories
  CATEGORIES: {
    STATE: 'state',
    UI: 'ui',
    AI: 'ai',
    TRADING: 'trading',
    COMBAT: 'combat',
    TUTORIAL: 'tutorial',
    ERROR: 'error',
    PERF: 'perf'
  },
  
  // Levels
  LEVELS: {
    DEBUG: 0,
    INFO: 1,
    WARN: 2,
    ERROR: 3
  },
  
  /**
   * Log a debug message (only shown in debug mode)
   * @param {string} category - Log category (state, ui, ai, etc.)
   * @param {string} message - Log message
   * @param {any} [data] - Optional data to log
   */
  debug(category, message, data) {
    this._log(this.LEVELS.DEBUG, category, message, data);
  },
  
  /**
   * Log an info message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {any} [data] - Optional data to log
   */
  info(category, message, data) {
    this._log(this.LEVELS.INFO, category, message, data);
  },
  
  /**
   * Log a warning message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {any} [data] - Optional data to log
   */
  warn(category, message, data) {
    this._log(this.LEVELS.WARN, category, message, data);
  },
  
  /**
   * Log an error message
   * @param {string} category - Log category
   * @param {string} message - Log message
   * @param {Error} [error] - Optional error object
   * @param {any} [data] - Optional data to log
   */
  error(category, message, error, data) {
    this._log(this.LEVELS.ERROR, category, message, data, error);
  },
  
  /**
   * Internal log method
   * @private
   */
  _log(level, category, message, data, error) {
    if (!this.enabled || level < this.LEVELS[this.level.toUpperCase()]) {
      return;
    }
    
    const timestamp = new Date().toISOString();
    const levelName = Object.keys(this.LEVELS).find(key => this.LEVELS[key] === level);
    const logEntry = {
      timestamp,
      level: levelName,
      category,
      message,
      data: data || null,
      error: error ? { message: error.message, stack: error.stack } : null
    };
    
    // Add to buffer
    this.logBuffer.push(logEntry);
    if (this.logBuffer.length > this.maxBufferSize) {
      this.logBuffer.shift();
    }
    
    // Console output with color coding
    const prefix = `[${levelName}][${category.toUpperCase()}]`;
    const color = this._getColorForLevel(level);
    
    if (level === this.LEVELS.ERROR) {
      console.error(`${prefix} ${message}`, error || '', data || '');
    } else if (level === this.LEVELS.WARN) {
      console.warn(`${prefix} ${message}`, data || '');
    } else if (level === this.LEVELS.DEBUG) {
      console.log(`%c${prefix} ${message}`, 'color: #888;', data || '');
    } else {
      console.log(`${prefix} ${message}`, data || '');
    }
  },
  
  /**
   * Get color for log level
   * @private
   */
  _getColorForLevel(level) {
    switch(level) {
      case this.LEVELS.DEBUG: return '#888';
      case this.LEVELS.INFO: return '#4a90d9';
      case this.LEVELS.WARN: return '#f5a623';
      case this.LEVELS.ERROR: return '#d0021b';
      default: return '#000';
    }
  },
  
  /**
   * Export logs for bug reports
   * @returns {string} JSON string of logs
   */
  exportLogs() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      gameState: {
        turn: gs.turn,
        generation: gs.generation,
        marks: gs.marks,
        reputation: gs.reputation
      },
      logs: this.logBuffer
    }, null, 2);
  },
  
  /**
   * Clear log buffer
   */
  clear() {
    this.logBuffer = [];
    this.info(Logger.CATEGORIES.STATE, 'Log buffer cleared');
  },
  
  /**
   * Set log level
   * @param {string} level - 'debug', 'info', 'warn', or 'error'
   */
  setLevel(level) {
    this.level = level.toLowerCase();
    this.info(Logger.CATEGORIES.STATE, `Log level set to ${level}`);
  }
};

// ══════════════════════════════════════════════════════════
//  ERROR CAPTURE FOR BUG REPORTS
// ══════════════════════════════════════════════════════════

const ErrorCapture = {
  errors: [],
  maxErrors: 10,
  
  /**
   * Capture an error for later reporting
   * @param {Error} error - The error object
   * @param {string} context - Where the error occurred
   * @param {any} [data] - Additional context data
   */
  capture(error, context, data) {
    const errorRecord = {
      timestamp: new Date().toISOString(),
      message: error.message,
      stack: error.stack,
      context,
      data: data || null,
      gameState: {
        turn: gs.turn,
        phase: gs.phase,
        marks: gs.marks,
        reputation: gs.reputation
      }
    };
    
    this.errors.push(errorRecord);
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }
    
    Logger.error(Logger.CATEGORIES.ERROR, `Error in ${context}`, error, data);
  },
  
  /**
   * Export error report
   * @returns {string} JSON string of errors
   */
  exportReport() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      totalErrors: this.errors.length,
      errors: this.errors
    }, null, 2);
  },
  
  /**
   * Clear captured errors
   */
  clear() {
    this.errors = [];
    Logger.info(Logger.CATEGORIES.ERROR, 'Error capture cleared');
  }
};

// ══════════════════════════════════════════════════════════
//  GLOBAL ERROR HANDLER
// ══════════════════════════════════════════════════════════

window.addEventListener('error', (event) => {
  ErrorCapture.capture(event.error, 'Global Error Handler', {
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno
  });
});

window.addEventListener('unhandledrejection', (event) => {
  ErrorCapture.capture(
    new Error(`Unhandled Promise Rejection: ${event.reason}`),
    'Unhandled Promise Rejection',
    { reason: event.reason }
  );
});

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.Logger = Logger;
window.ErrorCapture = ErrorCapture;

// Initialize with info level
Logger.setLevel('info');
Logger.info(Logger.CATEGORIES.STATE, 'Logger initialized');
