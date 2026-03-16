// ══════════════════════════════════════════════════════════
//  THREAD RESOLUTION SYSTEM (Unfinished Business)
// ══════════════════════════════════════════════════════════
// Manages open threads that return to haunt the player
// ══════════════════════════════════════════════════════════

/**
 * Thread urgency levels
 */
const THREAD_URGENCY = {
  NORMAL: 'normal',
  WARNING: 'warning',
  URGENT: 'urgent'
};

/**
 * Add a new thread
 * @param {string} label - Thread label
 * @param {string} type - Thread type (for matching events)
 * @param {number} expiresYear - Year when thread expires
 * @param {string} urgency - Urgency level
 * @returns {object} Thread object
 */
function addThread(label, type, expiresYear, urgency = THREAD_URGENCY.NORMAL) {
  const thread = {
    label,
    type,
    year: gs.turn,
    expiresYear,
    urgency
  };

  if (!gs.threads) gs.threads = [];
  gs.threads.push(thread);

  // Log thread created
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Thread opened: ${label}`, {
      type,
      expiresYear,
      urgency
    });
  }

  return thread;
}

/**
 * Resolve a thread
 * @param {string} threadLabel - Label of thread to resolve
 * @returns {boolean} True if thread was found and resolved
 */
function resolveThread(threadLabel) {
  if (!gs.threads) return false;

  const index = gs.threads.findIndex(t => t.label === threadLabel);
  if (index === -1) return false;

  const thread = gs.threads[index];
  gs.threads.splice(index, 1);

  // Log thread resolved
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Thread closed: ${threadLabel}`, {
      type: thread.type,
      age: gs.turn - thread.year
    });
  }

  return true;
}

/**
 * Get thread summary for AI prompts
 * @returns {string} Thread summary text
 */
function getThreadSummary() {
  if (!gs.threads || gs.threads.length === 0) {
    return 'No open threads';
  }

  return gs.threads.map(t => {
    const urgencyIcon = t.urgency === THREAD_URGENCY.URGENT ? '⚠️' : 
                        t.urgency === THREAD_URGENCY.WARNING ? '⚡' : '○';
    return `${urgencyIcon} ${t.label} (Year ${t.year}, expires ${t.expiresYear})`;
  }).join('; ');
}

/**
 * Check for threads that should return this turn
 * @returns {array} Array of threads that should return
 */
function getThreadsDueThisTurn() {
  if (!gs.threads || gs.threads.length === 0) return [];

  return gs.threads.filter(t => {
    // Thread returns if:
    // 1. It's been at least 2 years since it opened
    // 2. It hasn't expired yet
    // 3. Random chance based on urgency
    const age = gs.turn - t.year;
    if (age < 2) return false;
    if (gs.turn > t.expiresYear) return false;

    // Urgent threads always return, normal threads have 30% chance
    if (t.urgency === THREAD_URGENCY.URGENT) return true;
    if (t.urgency === THREAD_URGENCY.WARNING) return Math.random() < 0.5;
    return Math.random() < 0.3;
  });
}

/**
 * Update thread urgency based on age
 */
function updateThreadUrgency() {
  if (!gs.threads) return;

  gs.threads.forEach(t => {
    const age = gs.turn - t.year;
    const timeLeft = t.expiresYear - gs.turn;

    // Increase urgency as thread ages
    if (age >= 3 && t.urgency === THREAD_URGENCY.NORMAL) {
      t.urgency = THREAD_URGENCY.WARNING;
    }
    if (timeLeft <= 1 && t.urgency !== THREAD_URGENCY.URGENT) {
      t.urgency = THREAD_URGENCY.URGENT;
    }
  });
}

/**
 * Get thread count by urgency
 * @returns {object} Count by urgency level
 */
function getThreadCounts() {
  if (!gs.threads) return { normal: 0, warning: 0, urgent: 0 };

  return {
    normal: gs.threads.filter(t => t.urgency === THREAD_URGENCY.NORMAL).length,
    warning: gs.threads.filter(t => t.urgency === THREAD_URGENCY.WARNING).length,
    urgent: gs.threads.filter(t => t.urgency === THREAD_URGENCY.URGENT).length
  };
}

/**
 * Render thread tracker UI
 */
function renderThreadTracker() {
  const tracker = document.getElementById('thread-tracker');
  const countEl = document.getElementById('thread-count');
  const listEl = document.getElementById('thread-tracker-list');

  if (!gs.threads || gs.threads.length === 0) {
    if (tracker) tracker.style.display = 'none';
    return;
  }

  if (tracker) tracker.style.display = 'block';
  if (countEl) countEl.textContent = gs.threads.length;

  if (listEl) {
    listEl.innerHTML = gs.threads.map(t => {
      const urgencyClass = t.urgency === THREAD_URGENCY.URGENT ? 'urgent' :
                          t.urgency === THREAD_URGENCY.WARNING ? 'warning' : 'normal';
      return `<div class="thread-item ${urgencyClass}">${t.label}</div>`;
    }).join('');
  }
}

/**
 * Toggle thread tracker visibility
 */
function toggleThreads() {
  const listEl = document.getElementById('thread-tracker-list');
  if (listEl) {
    listEl.style.display = listEl.style.display === 'none' ? 'block' : 'none';
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.THREAD_URGENCY = THREAD_URGENCY;
window.addThread = addThread;
window.resolveThread = resolveThread;
window.getThreadSummary = getThreadSummary;
window.getThreadsDueThisTurn = getThreadsDueThisTurn;
window.updateThreadUrgency = updateThreadUrgency;
window.getThreadCounts = getThreadCounts;
window.renderThreadTracker = renderThreadTracker;
window.toggleThreads = toggleThreads;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.STATE, 'Thread system initialized');
}
