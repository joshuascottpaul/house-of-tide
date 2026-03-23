// ══════════════════════════════════════════════════════════
//  CONFIG — persisted to localStorage
// ══════════════════════════════════════════════════════════
const CFG_KEY = 'hot_config';
const CFG_DEFAULTS = {
  backend:     'ollama',       // 'ollama' | 'claude' | 'openai' | 'mlx' | 'openrouter'
  ollamaModel: 'mistral:latest',
  mlxModel:    'mlx-community/Qwen2.5-7B-Instruct-4bit',  // Fast, quantized
  mlxHfToken:  '',
  claudeModel: 'claude-haiku-4-5-20251001',
  claudeApiKey:'',
  openaiModel: 'gpt-4o-mini',
  openaiApiKey:'',
  openrouterModel: 'meta-llama/llama-3.1-8b-instruct:free',
  openrouterApiKey:'',
  debugMode:      false,
  colorBlindMode: 'none', // 'none' | 'deuteranopia' | 'protanopia' | 'tritanopia'
  easyMode:       false   // Start with more marks, lower mortality, higher income
};

// Alternative MLX models (copy/paste into Settings if needed):
// - mlx-community/Qwen2.5-3B-Instruct-4bit (faster, reliable JSON)
// - mlx-community/Qwen2.5-7B-Instruct-4bit (default - balanced)
// - mlx-community/Llama-3.1-8B-Instruct (better JSON compliance)
// - mlx-community/Meta-Llama-3-8B-Instruct (excellent JSON)
// - mlx-community/Qwen2.5-14B-Instruct (larger, better reasoning)
let CFG = { ...CFG_DEFAULTS };

function loadCFG() {
  try {
    const saved = localStorage.getItem(CFG_KEY);
    if (saved) CFG = { ...CFG_DEFAULTS, ...JSON.parse(saved) };
  } catch(_) {}
  updateEngineLabel();
  document.getElementById('debug-toggle').style.display = CFG.debugMode ? 'block' : 'none';
  applyColorBlindMode(CFG.colorBlindMode);
}
function applyColorBlindMode(mode) {
  document.body.classList.remove('cb-deuteranopia', 'cb-protanopia', 'cb-tritanopia');
  if (mode && mode !== 'none') document.body.classList.add('cb-' + mode);
}
function previewColorBlindMode(mode) {
  // Live preview — not saved until Save & Close
  applyColorBlindMode(mode);
}
function saveCFG() {
  try { localStorage.setItem(CFG_KEY, JSON.stringify(CFG)); } catch(_) {}
}
function updateEngineLabel() {
  const el = document.getElementById('engine-label');
  if (!el) return;
  if (CFG.backend === 'mlx') {
    const short = CFG.mlxModel.split('/').pop();
    el.textContent = '⊞ MLX · ' + short;
  } else if (CFG.backend === 'claude') {
    const short = CFG.claudeModel.includes('haiku') ? 'claude haiku' : 'claude sonnet';
    el.textContent = '⊞ Claude API · ' + short;
  } else if (CFG.backend === 'openai') {
    const short = CFG.openaiModel.includes('mini') ? 'gpt-4o-mini' : CFG.openaiModel;
    el.textContent = '⊞ OpenAI API · ' + short;
  } else if (CFG.backend === 'openrouter') {
    const short = CFG.openrouterModel.split('/').pop().replace(':free', '');
    el.textContent = '⊞ OpenRouter · ' + short;
  } else {
    el.textContent = '⊞ Ollama · ' + (CFG.ollamaModel === 'custom' ? 'custom' : CFG.ollamaModel);
  }
}

// ══════════════════════════════════════════════════════════
//  NOTIFICATION TOAST
// ══════════════════════════════════════════════════════════
function showNotification(msg) {
  let el = document.getElementById('toast-notification');
  if (!el) {
    el = document.createElement('div');
    el.id = 'toast-notification';
    el.style.cssText = 'position:fixed;bottom:1.5rem;left:50%;transform:translateX(-50%);' +
      'background:#0e0b06;border:1px solid #5a4020;color:#c8a870;' +
      'font-family:"IM Fell English SC",serif;font-size:.75rem;letter-spacing:.1em;' +
      'padding:.5rem 1.2rem;pointer-events:none;opacity:0;transition:opacity .3s;z-index:999;';
    document.body.appendChild(el);
  }
  el.textContent = msg;
  el.style.opacity = '1';
  clearTimeout(el._timer);
  el._timer = setTimeout(() => { el.style.opacity = '0'; }, 3000);
}

// ══════════════════════════════════════════════════════════
//  DEBUG LOG
// ══════════════════════════════════════════════════════════
let debugEntries = [];

function debugLog(meta, raw, parseResult, isError) {
  if (!CFG.debugMode) return;
  const ts = new Date().toLocaleTimeString();
  // Include model info for debugging
  const modelInfo = CFG.backend === 'mlx' ? CFG.mlxModel : 
                    CFG.backend === 'ollama' ? CFG.ollamaModel :
                    CFG.backend === 'claude' ? CFG.claudeModel :
                    CFG.backend === 'openai' ? CFG.openaiModel : 'unknown';
  debugEntries.unshift({ ts, meta, model: modelInfo, raw, parseResult, isError });
  if (debugEntries.length > 20) debugEntries.pop();
  renderDebugLog();
}

function renderDebugLog() {
  const el = document.getElementById('debug-log');
  if (!el) return;
  if (debugEntries.length === 0) {
    el.innerHTML = '<span style="color:#3a2c18;font-style:italic;">No entries yet.</span>';
    return;
  }
  el.innerHTML = debugEntries.map(e => `
    <div class="debug-entry">
      <div class="debug-ts">${e.ts}</div>
      <div class="debug-meta">${e.meta} <span style="color:#5a4828;font-size:.75rem;">[${e.model}]</span></div>
      <div class="debug-raw">${escHtml(e.raw || '(empty)')}</div>
      <div class="${e.isError ? 'debug-err' : 'debug-ok'}">${escHtml(e.parseResult)}</div>
    </div>`).join('');
}

function escHtml(s) {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
}

function toggleDebug() {
  const p = document.getElementById('debug-panel');
  p.classList.toggle('open');
}

function debugClear() {
  debugEntries = [];
  renderDebugLog();
}

function debugCopyLast() {
  if (!debugEntries.length) return;
  const e = debugEntries[0];
  navigator.clipboard.writeText(
    `[${e.ts}] ${e.meta}\nRAW:\n${e.raw}\nPARSE: ${e.parseResult}`
  ).catch(()=>{});
}

// keyboard shortcut: Cmd/Ctrl+Shift+D for debug
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    if (!CFG.debugMode) { CFG.debugMode = true; saveCFG(); }
    document.getElementById('debug-toggle').style.display = 'block';
    toggleDebug();
  }
});

// keyboard shortcut: P for settings
document.addEventListener('keydown', e => {
  if (e.key === 'p' || e.key === 'P') {
    e.preventDefault();
    openSettings();
  }
});

// ══════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ══════════════════════════════════════════════════════════
function openSettings() {
  const ov = document.getElementById('settings-overlay');
  if (!ov) return;
  
  // populate from CFG
  const ollamaRadio = document.getElementById('s-ollama');
  if (ollamaRadio) ollamaRadio.checked = (CFG.backend === 'ollama');
  const claudeRadio = document.getElementById('s-claude');
  if (claudeRadio) claudeRadio.checked = (CFG.backend === 'claude');
  const openaiRadio = document.getElementById('s-openai');
  if (openaiRadio) openaiRadio.checked = (CFG.backend === 'openai');
  const openrouterRadio = document.getElementById('s-openrouter');
  if (openrouterRadio) openrouterRadio.checked = (CFG.backend === 'openrouter');
  const mlxRadio = document.getElementById('s-mlx');
  if (mlxRadio) mlxRadio.checked = (CFG.backend === 'mlx');
  
  // ollama model
  const oSel = document.getElementById('s-ollama-model');
  const known = ['qwen3.5:4b','qwen2.5:7b','mistral:latest','llama3.1:8b'];
  if (oSel) {
    if (known.includes(CFG.ollamaModel)) {
      oSel.value = CFG.ollamaModel;
      document.getElementById('s-ollama-custom').style.display = 'none';
    } else {
      oSel.value = 'custom';
      document.getElementById('s-ollama-custom').style.display = 'block';
      const customInput = document.getElementById('s-ollama-custom');
      if (customInput) customInput.value = CFG.ollamaModel;
    }
  }
  
  // mlx model
  const mlxModelInput = document.getElementById('s-mlx-model');
  if (mlxModelInput) mlxModelInput.value = CFG.mlxModel;
  const mlxTokenInput = document.getElementById('s-mlx-token');
  if (mlxTokenInput) mlxTokenInput.value = CFG.mlxHfToken;
  
  // claude model
  const claudeModelSel = document.getElementById('s-claude-model');
  if (claudeModelSel) claudeModelSel.value = CFG.claudeModel;
  const apiKeyInput = document.getElementById('s-api-key');
  if (apiKeyInput) apiKeyInput.value = CFG.claudeApiKey;
  
  // openai model
  const openaiModelSel = document.getElementById('s-openai-model');
  if (openaiModelSel) openaiModelSel.value = CFG.openaiModel;
  const openaiKeyInput = document.getElementById('s-openai-key');
  if (openaiKeyInput) openaiKeyInput.value = CFG.openaiApiKey;

  // openrouter model + key
  const openrouterModelSel = document.getElementById('s-openrouter-model');
  if (openrouterModelSel) openrouterModelSel.value = CFG.openrouterModel;
  const openrouterKeyInput = document.getElementById('s-openrouter-key');
  if (openrouterKeyInput) openrouterKeyInput.value = CFG.openrouterApiKey;

  const debugCheckbox = document.getElementById('s-debug');
  if (debugCheckbox) debugCheckbox.checked = CFG.debugMode;

  const cbSel = document.getElementById('s-colorblind');
  if (cbSel) cbSel.value = CFG.colorBlindMode || 'none';

  const easyCheck = document.getElementById('s-easy-mode');
  if (easyCheck) easyCheck.checked = !!CFG.easyMode;

  // Appearance settings (optional - may not exist in older versions)
  const appearanceInputs = [
    { id: 's-bg-opacity', value: appearance?.bgOpacity },
    { id: 's-bg-grayscale', value: appearance?.bgGrayscale },
    { id: 's-overlay-opacity', value: appearance?.overlayOpacity },
    { id: 's-bg-tint-color', value: appearance?.tintColor },
    { id: 's-bg-tint-opacity', value: appearance?.tintOpacity },
    { id: 's-text-brightness', value: appearance?.textBrightness }
  ];
  
  appearanceInputs.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.value = value;
  });

  // Update value displays
  const displayUpdates = [
    { id: 'bg-opacity-val', value: appearance?.bgOpacity },
    { id: 'bg-grayscale-val', value: appearance?.bgGrayscale },
    { id: 'overlay-opacity-val', value: appearance?.overlayOpacity },
    { id: 'tint-opacity-val', value: appearance?.tintOpacity }
  ];
  
  displayUpdates.forEach(({ id, value }) => {
    const el = document.getElementById(id);
    if (el && value !== undefined) el.textContent = value;
  });

  settingsBackendChange();
  updateMlxLaunchCmd();
  ov.classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
}

// Accordion toggle for mobile-friendly settings
function toggleAccordion(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;
  
  // Toggle this section
  const isExpanded = section.classList.contains('expanded');
  
  // Optional: close all other sections (uncomment for accordion behavior)
  // document.querySelectorAll('.settings-accordion-section').forEach(sec => {
  //   sec.classList.remove('expanded');
  // });
  
  // Toggle current section
  if (isExpanded) {
    section.classList.remove('expanded');
  } else {
    section.classList.add('expanded');
  }
}

function settingsBackendChange() {
  const isClaude = document.getElementById('s-claude').checked;
  const isOpenAI = document.getElementById('s-openai').checked;
  const isOpenRouter = document.getElementById('s-openrouter').checked;
  const isMLX    = document.getElementById('s-mlx').checked;
  const isOllama = !(isClaude || isOpenAI || isOpenRouter || isMLX);
  
  // Helper to show/hide accordion sections
  function setAccordionVisible(sectionId, visible) {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.style.display = visible ? 'block' : 'none';
    // Also expand the accordion if showing
    if (visible) {
      section.classList.add('expanded');
    }
  }
  
  setAccordionVisible('s-ollama-section', isOllama);
  setAccordionVisible('s-claude-section', isClaude);
  setAccordionVisible('s-openai-section', isOpenAI);
  setAccordionVisible('s-openrouter-section', isOpenRouter);
  setAccordionVisible('s-mlx-section', isMLX);
  
  const note = document.getElementById('settings-backend-note');
  if (isClaude) {
    note.textContent = 'Calls go directly from your browser to api.anthropic.com. Excellent prose quality and reliable JSON. Requires a paid API key.';
  } else if (isOpenAI) {
    note.textContent = 'Calls go directly from your browser to api.openai.com. Fast, reliable JSON, good prose. Requires a paid API key.';
  } else if (isOpenRouter) {
    note.textContent = 'OpenRouter provides access to many models (free + paid). Calls go to openrouter.ai. Great for trying different models without multiple API keys.';
  } else if (isMLX) {
    note.textContent = 'MLX runs Apple Silicon models locally via mlx-openai-server — no API key, no cost. Start with: mlx-openai-server launch --model-path <model> --model-type lm';
  } else {
    note.textContent = 'Ollama runs locally on your machine — no API key, no cost, but requires the Ollama app and a downloaded model.';
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const oSel = document.getElementById('s-ollama-model');
  if (oSel) oSel.addEventListener('change', () => {
    const custom = document.getElementById('s-ollama-custom');
    custom.style.display = oSel.value === 'custom' ? 'block' : 'none';
  });
});

function saveSettings() {
  const isClaude = document.getElementById('s-claude').checked;
  const isOpenAI = document.getElementById('s-openai').checked;
  const isOpenRouter = document.getElementById('s-openrouter').checked;
  const isMLX    = document.getElementById('s-mlx').checked;
  CFG.backend     = isClaude ? 'claude' : isOpenAI ? 'openai' : isOpenRouter ? 'openrouter' : isMLX ? 'mlx' : 'ollama';
  CFG.mlxModel    = document.getElementById('s-mlx-model').value.trim() || 'mlx-community/Qwen2.5-3B-Instruct-4bit';
  CFG.mlxHfToken  = document.getElementById('s-mlx-token').value.trim();
  CFG.claudeModel = document.getElementById('s-claude-model').value;
  CFG.claudeApiKey= document.getElementById('s-api-key').value.trim();
  CFG.openaiModel = document.getElementById('s-openai-model').value;
  CFG.openaiApiKey= document.getElementById('s-openai-key').value.trim();
  CFG.openrouterModel = document.getElementById('s-openrouter-model').value;
  CFG.openrouterApiKey = document.getElementById('s-openrouter-key').value.trim();
  CFG.debugMode       = document.getElementById('s-debug').checked;
  const cbSel2 = document.getElementById('s-colorblind');
  if (cbSel2) { CFG.colorBlindMode = cbSel2.value; applyColorBlindMode(CFG.colorBlindMode); }
  const easyCheck2 = document.getElementById('s-easy-mode');
  if (easyCheck2) CFG.easyMode = easyCheck2.checked;
  const oSel = document.getElementById('s-ollama-model');
  CFG.ollamaModel = oSel.value === 'custom'
    ? (document.getElementById('s-ollama-custom').value.trim() || 'mistral:latest')
    : oSel.value;
  saveCFG();
  updateEngineLabel();
  document.getElementById('debug-toggle').style.display = CFG.debugMode ? 'block' : 'none';
  closeSettings();
}

// ══════════════════════════════════════════════════════════
//  BACKGROUND SETTINGS
// ══════════════════════════════════════════════════════════
function backgroundSelectChange() {
  const select = document.getElementById('s-bg-select');
  const customInput = document.getElementById('s-bg-custom');
  if (!select || !customInput) return;
  
  if (select.value === 'custom') {
    customInput.style.display = 'block';
    customInput.value = localStorage.getItem('hot_custom_bg') || '';
  } else {
    customInput.style.display = 'none';
    setCustomBackground('');
  }
}

function saveCustomBg() {
  const select = document.getElementById('s-bg-select');
  const customInput = document.getElementById('s-bg-custom');
  if (!customInput) return;
  
  const url = customInput.value.trim();
  setCustomBackground(url || null);
}

// ══════════════════════════════════════════════════════════
//  MLX SETTINGS (Auto-save)
// ══════════════════════════════════════════════════════════
function saveMlxSettings() {
  const modelInput = document.getElementById('s-mlx-model');
  const tokenInput = document.getElementById('s-mlx-token');
  if (!modelInput || !tokenInput) return;
  
  // Save to CFG
  CFG.mlxModel = modelInput.value.trim() || 'mlx-community/Qwen2.5-3B-Instruct-4bit';
  CFG.mlxHfToken = tokenInput.value.trim();
  
  // Save to localStorage
  saveCFG();
  
  // Update launch command display
  updateMlxLaunchCmd();
}

function updateMlxLaunchCmd() {
  const cmdEl = document.getElementById('mlx-launch-cmd');
  if (!cmdEl) return;

  const model = CFG.mlxModel || 'mlx-community/Qwen2.5-3B-Instruct-4bit';
  const token = CFG.mlxHfToken ? `HF_TOKEN=${CFG.mlxHfToken} ` : '';

  cmdEl.textContent = `${token}mlx-openai-server launch --model-path ${model} --model-type lm`;
}

// ══════════════════════════════════════════════════════════
//  APPEARANCE SETTINGS
// ══════════════════════════════════════════════════════════
const APPEARANCE_KEY = 'hot_appearance';
const APPEARANCE_DEFAULTS = {
  bgOpacity: 40,         // 0-40% - visible but not distracting
  bgGrayscale: 100,      // 0-100% - full grayscale
  overlayOpacity: 85,    // 70-100% - balanced readability + background visibility
  tintColor: '#090705',  // hex color
  tintOpacity: 0,        // 0-100%
  textBrightness: 100    // 50-100%
};
let appearance = { ...APPEARANCE_DEFAULTS };

function loadAppearance() {
  try {
    const saved = localStorage.getItem(APPEARANCE_KEY);
    if (saved) appearance = { ...APPEARANCE_DEFAULTS, ...JSON.parse(saved) };
  } catch(_) {}
  applyAppearanceSettings();
}

function saveAppearance() {
  try { localStorage.setItem(APPEARANCE_KEY, JSON.stringify(appearance)); } catch(_) {}
}

function applyAppearanceSettings() {
  const root = document.documentElement;
  if (!root) return;
  
  // Background image filter
  root.style.setProperty('--bg-opacity', appearance.bgOpacity / 100);
  root.style.setProperty('--bg-grayscale', appearance.bgGrayscale + '%');
  
  // Content overlay
  root.style.setProperty('--overlay-opacity', appearance.overlayOpacity / 100);
  
  // Background tint
  const tintAlpha = appearance.tintOpacity / 100;
  root.style.setProperty('--bg-tint-color', hexToRgba(appearance.tintColor, tintAlpha));
  
  // Text brightness
  const brightness = appearance.textBrightness / 100;
  const baseColor = { r: 245, g: 240, b: 224 }; // #f5f0e0
  const dimColor = { r: 160, g: 136, b: 72 };  // #a08848
  const r = Math.round(dimColor.r + (baseColor.r - dimColor.r) * brightness);
  const g = Math.round(dimColor.g + (baseColor.g - dimColor.g) * brightness);
  const b = Math.round(dimColor.b + (baseColor.b - dimColor.b) * brightness);
  root.style.setProperty('--text-color', `rgb(${r},${g},${b})`);
  
  // Text shadow intensity
  const shadowIntensity = 0.5 + (brightness * 0.5);
  root.style.setProperty('--text-shadow', shadowIntensity);
}

function updateAppearanceSettings() {
  const bgOpacity = document.getElementById('s-bg-opacity');
  const bgGrayscale = document.getElementById('s-bg-grayscale');
  const overlayOpacity = document.getElementById('s-overlay-opacity');
  const tintColor = document.getElementById('s-bg-tint-color');
  const tintOpacity = document.getElementById('s-bg-tint-opacity');
  const textBrightness = document.getElementById('s-text-brightness');
  
  if (!bgOpacity || !bgGrayscale || !overlayOpacity || !tintColor || !tintOpacity || !textBrightness) return;
  
  appearance.bgOpacity = parseInt(bgOpacity.value);
  appearance.bgGrayscale = parseInt(bgGrayscale.value);
  appearance.overlayOpacity = parseInt(overlayOpacity.value);
  appearance.tintColor = tintColor.value;
  appearance.tintOpacity = parseInt(tintOpacity.value);
  appearance.textBrightness = parseInt(textBrightness.value);
  
  // Update value displays
  document.getElementById('bg-opacity-val').textContent = appearance.bgOpacity;
  document.getElementById('bg-grayscale-val').textContent = appearance.bgGrayscale;
  document.getElementById('overlay-opacity-val').textContent = appearance.overlayOpacity;
  document.getElementById('tint-opacity-val').textContent = appearance.tintOpacity;
  
  applyAppearanceSettings();
  saveAppearance();
}

function resetAppearanceSettings() {
  appearance = { ...APPEARANCE_DEFAULTS };
  
  document.getElementById('s-bg-opacity').value = APPEARANCE_DEFAULTS.bgOpacity;
  document.getElementById('s-bg-grayscale').value = APPEARANCE_DEFAULTS.bgGrayscale;
  document.getElementById('s-overlay-opacity').value = APPEARANCE_DEFAULTS.overlayOpacity;
  document.getElementById('s-bg-tint-color').value = APPEARANCE_DEFAULTS.tintColor;
  document.getElementById('s-bg-tint-opacity').value = APPEARANCE_DEFAULTS.tintOpacity;
  document.getElementById('s-text-brightness').value = APPEARANCE_DEFAULTS.textBrightness;
  
  document.getElementById('bg-opacity-val').textContent = APPEARANCE_DEFAULTS.bgOpacity;
  document.getElementById('bg-grayscale-val').textContent = APPEARANCE_DEFAULTS.bgGrayscale;
  document.getElementById('overlay-opacity-val').textContent = APPEARANCE_DEFAULTS.overlayOpacity;
  document.getElementById('tint-opacity-val').textContent = APPEARANCE_DEFAULTS.tintOpacity;
  
  applyAppearanceSettings();
  saveAppearance();
  showNotification('Appearance settings reset to defaults');
}

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Load appearance settings on page load
document.addEventListener('DOMContentLoaded', loadAppearance);

// Ensure settings functions are available globally - immediate export
window.openSettings = openSettings;
window.closeSettings = closeSettings;
window.saveSettings = saveSettings;
window.settingsBackendChange = settingsBackendChange;
window.backgroundSelectChange = backgroundSelectChange;
window.saveCustomBg = saveCustomBg;
window.saveMlxSettings = saveMlxSettings;
window.updateMlxLaunchCmd = updateMlxLaunchCmd;
window.updateAppearanceSettings = updateAppearanceSettings;
window.resetAppearanceSettings = resetAppearanceSettings;
window.previewColorBlindMode = previewColorBlindMode;
window.applyColorBlindMode = applyColorBlindMode;

// Also export after DOM ready (belt and suspenders)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.openSettings = openSettings;
    window.closeSettings = closeSettings;
    window.saveSettings = saveSettings;
    window.settingsBackendChange = settingsBackendChange;
    window.backgroundSelectChange = backgroundSelectChange;
    window.saveCustomBg = saveCustomBg;
    window.saveMlxSettings = saveMlxSettings;
    window.updateMlxLaunchCmd = updateMlxLaunchCmd;
    window.updateAppearanceSettings = updateAppearanceSettings;
    window.resetAppearanceSettings = resetAppearanceSettings;
    window.previewColorBlindMode = previewColorBlindMode;
    window.applyColorBlindMode = applyColorBlindMode;
  });
}
