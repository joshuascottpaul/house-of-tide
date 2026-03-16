// ══════════════════════════════════════════════════════════
//  PERFORMANCE MONITORING
// ══════════════════════════════════════════════════════════
// Track AI response times, frame rates, memory usage
// Identify bottlenecks
// Warn on slow operations
// ══════════════════════════════════════════════════════════

const Performance = {
  metrics: {
    aiResponseTimes: [],
    frameTimes: [],
    memoryUsage: [],
    eventGenerationTimes: [],
    renderTimes: []
  },
  
  thresholds: {
    aiResponseSlow: 5000, // 5 seconds
    aiResponseCritical: 10000, // 10 seconds
    frameTimeSlow: 50, // 50ms = 20fps
    memoryWarning: 50 * 1024 * 1024 // 50MB
  },
  
  timers: {},
  frameId: null,
  lastFrameTime: 0,
  enabled: true,
  
  /**
   * Start a timer
   * @param {string} label - Timer label
   */
  startTimer(label) {
    if (!this.enabled) return;
    performance.mark(`${label}-start`);
    this.timers[label] = performance.now();
  },
  
  /**
   * End a timer and record metric
   * @param {string} label - Timer label
   * @param {string} category - Metric category
   */
  endTimer(label, category) {
    if (!this.enabled) return;
    
    performance.mark(`${label}-end`);
    performance.measure(label, `${label}-start`, `${label}-end`);
    
    const measure = performance.getEntriesByName(label)[0];
    if (measure) {
      const duration = measure.duration;
      
      // Record metric
      if (this.metrics[`${category}Times`]) {
        this.metrics[`${category}Times`].push(duration);
        // Keep last 100 measurements
        if (this.metrics[`${category}Times`].length > 100) {
          this.metrics[`${category}Times`].shift();
        }
      }
      
      // Warn if slow
      if (category === 'aiResponse' && duration > this.thresholds.aiResponseSlow) {
        Logger.warn(Logger.CATEGORIES.PERF, `${label} took ${duration.toFixed(0)}ms`, {
          threshold: this.thresholds.aiResponseSlow
        });
      }
      
      if (category === 'aiResponse' && duration > this.thresholds.aiResponseCritical) {
        Logger.error(Logger.CATEGORIES.PERF, `${label} took ${duration.toFixed(0)}ms - CRITICAL`, {
          threshold: this.thresholds.aiResponseCritical
        });
      }
    }
  },
  
  /**
   * Start frame rate monitoring
   */
  startFrameMonitoring() {
    if (!this.enabled) return;
    
    const trackFrame = (timestamp) => {
      if (this.lastFrameTime > 0) {
        const frameTime = timestamp - this.lastFrameTime;
        this.metrics.frameTimes.push(frameTime);
        
        // Keep last 100 frames
        if (this.metrics.frameTimes.length > 100) {
          this.metrics.frameTimes.shift();
        }
        
        // Warn on slow frame
        if (frameTime > this.thresholds.frameTimeSlow) {
          Logger.warn(Logger.CATEGORIES.PERF, `Slow frame: ${frameTime.toFixed(1)}ms (${(1000/frameTime).toFixed(1)} fps)`);
        }
      }
      
      this.lastFrameTime = timestamp;
      this.frameId = requestAnimationFrame(trackFrame);
    };
    
    this.frameId = requestAnimationFrame(trackFrame);
    Logger.info(Logger.CATEGORIES.PERF, 'Frame monitoring started');
  },
  
  /**
   * Stop frame rate monitoring
   */
  stopFrameMonitoring() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
      Logger.info(Logger.CATEGORIES.PERF, 'Frame monitoring stopped');
    }
  },
  
  /**
   * Record memory usage
   */
  recordMemory() {
    if (!this.enabled || !performance.memory) return;
    
    const memory = performance.memory;
    const usedMB = Math.round(memory.usedJSHeapSize / (1024 * 1024));
    
    this.metrics.memoryUsage.push({
      timestamp: Date.now(),
      usedMB,
      totalMB: Math.round(memory.totalJSHeapSize / (1024 * 1024)),
      limitMB: Math.round(memory.jsHeapSizeLimit / (1024 * 1024))
    });
    
    // Keep last 100 measurements
    if (this.metrics.memoryUsage.length > 100) {
      this.metrics.memoryUsage.shift();
    }
    
    // Warn on high memory
    if (usedMB > this.thresholds.memoryWarning / (1024 * 1024)) {
      Logger.warn(Logger.CATEGORIES.PERF, `High memory usage: ${usedMB}MB`);
    }
  },
  
  /**
   * Get average of array
   * @private
   */
  _avg(arr) {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },
  
  /**
   * Get performance summary
   * @returns {object} Performance metrics summary
   */
  getSummary() {
    return {
      aiResponse: {
        avg: Math.round(this._avg(this.metrics.aiResponseTimes)),
        min: Math.round(Math.min(...this.metrics.aiResponseTimes)),
        max: Math.round(Math.max(...this.metrics.aiResponseTimes)),
        count: this.metrics.aiResponseTimes.length
      },
      frameRate: {
        avg: Math.round(1000 / this._avg(this.metrics.frameTimes)),
        min: Math.round(1000 / Math.max(...this.metrics.frameTimes)),
        max: Math.round(1000 / Math.min(...this.metrics.frameTimes))
      },
      memory: this.metrics.memoryUsage.length > 0 ? 
        this.metrics.memoryUsage[this.metrics.memoryUsage.length - 1] : null,
      eventGeneration: {
        avg: Math.round(this._avg(this.metrics.eventGenerationTimes)),
        count: this.metrics.eventGenerationTimes.length
      },
      render: {
        avg: Math.round(this._avg(this.metrics.renderTimes)),
        count: this.metrics.renderTimes.length
      }
    };
  },
  
  /**
   * Export performance metrics
   * @returns {string} JSON string
   */
  exportMetrics() {
    return JSON.stringify({
      exportedAt: new Date().toISOString(),
      summary: this.getSummary(),
      thresholds: this.thresholds,
      rawMetrics: this.metrics
    }, null, 2);
  },
  
  /**
   * Clear all metrics
   */
  clear() {
    Object.keys(this.metrics).forEach(key => {
      this.metrics[key] = [];
    });
    Logger.info(Logger.CATEGORIES.PERF, 'Performance metrics cleared');
  },
  
  /**
   * Enable/disable monitoring
   * @param {boolean} enabled
   */
  setEnabled(enabled) {
    this.enabled = enabled;
    Logger.info(Logger.CATEGORIES.PERF, `Performance monitoring ${enabled ? 'enabled' : 'disabled'}`);
  }
};

// ══════════════════════════════════════════════════════════
//  INTEGRATION WITH EXISTING CODE
// ══════════════════════════════════════════════════════════

// Wrap callLLM to track AI response times
if (window.callLLM) {
  const _origCallLLM = window.callLLM;
  window.callLLM = async function(systemPrompt, userMsg, opts) {
    Performance.startTimer('ai-response');
    try {
      const result = await _origCallLLM(systemPrompt, userMsg, opts);
      Performance.endTimer('ai-response', 'aiResponse');
      return result;
    } catch (error) {
      Performance.endTimer('ai-response', 'aiResponse');
      throw error;
    }
  };
}

// Start frame monitoring on load
window.addEventListener('load', () => {
  Performance.startFrameMonitoring();
  
  // Record memory every 10 seconds
  setInterval(() => Performance.recordMemory(), 10000);
});

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.Performance = Performance;

Logger.info(Logger.CATEGORIES.PERF, 'Performance monitoring initialized');
