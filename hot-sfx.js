// ══════════════════════════════════════════════════════════
//  SOUND EFFECTS
// ══════════════════════════════════════════════════════════

const SFX = {
  click: null,
  save: null,
  notification: null,
  turn: null
};

let sfxEnabled = false;

function initSoundEffects() {
  // Create audio elements for sound effects
  SFX.click = new Audio();
  SFX.save = new Audio();
  SFX.notification = new Audio();
  SFX.turn = new Audio();
  
  // Load sounds (using data URIs for simple beeps - replace with actual sounds)
  // For now, these are silent placeholders
  sfxEnabled = localStorage.getItem('hot_sfx_enabled') === 'true';
}

function enableSoundEffects(enabled) {
  sfxEnabled = enabled;
  localStorage.setItem('hot_sfx_enabled', enabled ? 'true' : 'false');
}

function playSfx(name) {
  if (!sfxEnabled || !SFX[name]) return;
  
  try {
    SFX[name].currentTime = 0;
    SFX[name].play().catch(() => {}); // Ignore play errors
  } catch (e) {
    // Silent fail - sound not available
  }
}

function playClickSfx() { playSfx('click'); }
function playSaveSfx() { playSfx('save'); }
function playNotificationSfx() { playSfx('notification'); }
function playTurnSfx() { playSfx('turn'); }

function toggleSoundEffects() {
  const checkbox = document.getElementById('s-sfx');
  if (checkbox) {
    enableSoundEffects(checkbox.checked);
  }
}

// Initialize on load
if (typeof window !== 'undefined') {
  window.addEventListener('DOMContentLoaded', () => {
    initSoundEffects();
    // Restore checkbox state
    const checkbox = document.getElementById('s-sfx');
    if (checkbox) {
      checkbox.checked = sfxEnabled;
    }
  });
}
