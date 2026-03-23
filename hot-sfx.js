// ══════════════════════════════════════════════════════════
//  SOUND EFFECTS - Web Audio API Generated Sounds
// ══════════════════════════════════════════════════════════

let sfxEnabled = false;
let audioCtx = null;

// Sound effect presets (frequency, duration, type)
const SFX_PRESETS = {
  click: { freq: 800, duration: 0.05, type: 'sine', decay: 0.03 },
  save: { freq: 1200, duration: 0.15, type: 'sine', decay: 0.1, harmonics: [1800, 2400] },
  notification: { freq: 880, duration: 0.2, type: 'triangle', decay: 0.15, harmonics: [1320] },
  turn: { freq: 660, duration: 0.25, type: 'sine', decay: 0.2, harmonics: [990, 1320] }
};

function initSoundEffects() {
  sfxEnabled = localStorage.getItem('hot_sfx_enabled') === 'true';
}

function getAudioContext() {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  }
  return audioCtx;
}

function playTone(freq, duration, type = 'sine', volume = 0.1) {
  const ctx = getAudioContext();
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime);
  
  gain.gain.setValueAtTime(volume, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  osc.connect(gain);
  gain.connect(ctx.destination);
  
  osc.start(ctx.currentTime);
  osc.stop(ctx.currentTime + duration);
}

function playChord(freq, duration, type = 'sine', harmonics = [], volume = 0.08) {
  const ctx = getAudioContext();
  
  // Play root frequency
  playTone(freq, duration, type, volume);
  
  // Play harmonics
  harmonics.forEach(harmonicFreq => {
    playTone(harmonicFreq, duration * 0.8, type, volume * 0.5);
  });
}

function playSfx(name) {
  if (!sfxEnabled) return;
  
  const preset = SFX_PRESETS[name];
  if (!preset) return;
  
  try {
    const ctx = getAudioContext();
    if (ctx.state === 'suspended') {
      ctx.resume();
    }
    
    if (preset.harmonics && preset.harmonics.length > 0) {
      playChord(preset.freq, preset.duration, preset.type, preset.harmonics);
    } else {
      playTone(preset.freq, preset.duration, preset.type);
    }
  } catch (e) {
    // Audio not available (iOS requires user interaction first)
  }
}

function playClickSfx() { playSfx('click'); }
function playSaveSfx() { playSfx('save'); }
function playNotificationSfx() { playSfx('notification'); }
function playTurnSfx() { playSfx('turn'); }

function enableSoundEffects(enabled) {
  sfxEnabled = enabled;
  localStorage.setItem('hot_sfx_enabled', enabled ? 'true' : 'false');
  
  // Initialize audio context on user interaction
  if (enabled && !audioCtx) {
    getAudioContext();
  }
}

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
    
    // Add click sound to buttons (subtle feedback)
    document.addEventListener('click', (e) => {
      if (e.target.tagName === 'BUTTON' || e.target.classList.contains('btn')) {
        playClickSfx();
      }
    });
  });
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { playClickSfx, playSaveSfx, playNotificationSfx, playTurnSfx, enableSoundEffects };
}
