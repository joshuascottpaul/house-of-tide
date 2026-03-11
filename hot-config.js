// ══════════════════════════════════════════════════════════
//  CONFIG — persisted to localStorage
// ══════════════════════════════════════════════════════════
const CFG_KEY = 'hot_config';
const CFG_DEFAULTS = {
  backend:     'ollama',       // 'ollama' | 'claude' | 'openai' | 'mlx'
  ollamaModel: 'mistral:latest',
  mlxModel:    'mlx-community/Qwen2.5-3B-Instruct-4bit',
  mlxHfToken:  '',
  claudeModel: 'claude-haiku-4-5-20251001',
  claudeApiKey:'',
  openaiModel: 'gpt-4o-mini',
  openaiApiKey:'',
  debugMode:   false
};
let CFG = { ...CFG_DEFAULTS };

function loadCFG() {
  try {
    const saved = localStorage.getItem(CFG_KEY);
    if (saved) CFG = { ...CFG_DEFAULTS, ...JSON.parse(saved) };
  } catch(_) {}
  updateEngineLabel();
  document.getElementById('debug-toggle').style.display = CFG.debugMode ? 'block' : 'none';
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
  debugEntries.unshift({ ts, meta, raw, parseResult, isError });
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
      <div class="debug-meta">${e.meta}</div>
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

// keyboard shortcut: Cmd/Ctrl+Shift+D
document.addEventListener('keydown', e => {
  if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'D') {
    e.preventDefault();
    if (!CFG.debugMode) { CFG.debugMode = true; saveCFG(); }
    document.getElementById('debug-toggle').style.display = 'block';
    toggleDebug();
  }
});

// ══════════════════════════════════════════════════════════
//  SETTINGS MODAL
// ══════════════════════════════════════════════════════════
function openSettings() {
  const ov = document.getElementById('settings-overlay');
  // populate from CFG
  document.getElementById('s-ollama').checked = (CFG.backend === 'ollama');
  document.getElementById('s-claude').checked = (CFG.backend === 'claude');
  document.getElementById('s-openai').checked = (CFG.backend === 'openai');
  document.getElementById('s-mlx').checked    = (CFG.backend === 'mlx');
  // ollama model
  const oSel = document.getElementById('s-ollama-model');
  const known = ['qwen3.5:4b','qwen2.5:7b','mistral:latest','llama3.1:8b'];
  if (known.includes(CFG.ollamaModel)) {
    oSel.value = CFG.ollamaModel;
    document.getElementById('s-ollama-custom').style.display = 'none';
  } else {
    oSel.value = 'custom';
    document.getElementById('s-ollama-custom').style.display = 'block';
    document.getElementById('s-ollama-custom').value = CFG.ollamaModel;
  }
  // mlx model
  document.getElementById('s-mlx-model').value    = CFG.mlxModel;
  document.getElementById('s-mlx-token').value    = CFG.mlxHfToken;
  // claude model
  document.getElementById('s-claude-model').value = CFG.claudeModel;
  document.getElementById('s-api-key').value     = CFG.claudeApiKey;
  // openai model
  document.getElementById('s-openai-model').value = CFG.openaiModel;
  document.getElementById('s-openai-key').value   = CFG.openaiApiKey;
  document.getElementById('s-debug').checked     = CFG.debugMode;
  settingsBackendChange();
  ov.classList.add('open');
}

function closeSettings() {
  document.getElementById('settings-overlay').classList.remove('open');
}

function settingsBackendChange() {
  const isClaude = document.getElementById('s-claude').checked;
  const isOpenAI = document.getElementById('s-openai').checked;
  const isMLX    = document.getElementById('s-mlx').checked;
  document.getElementById('s-ollama-section').style.display = (isClaude || isOpenAI || isMLX) ? 'none' : 'block';
  document.getElementById('s-claude-section').style.display = isClaude ? 'block' : 'none';
  document.getElementById('s-openai-section').style.display = isOpenAI ? 'block' : 'none';
  document.getElementById('s-mlx-section').style.display   = isMLX    ? 'block' : 'none';
  const note = document.getElementById('settings-backend-note');
  if (isClaude) {
    note.textContent = 'Calls go directly from your browser to api.anthropic.com. Excellent prose quality and reliable JSON. Requires a paid API key.';
  } else if (isOpenAI) {
    note.textContent = 'Calls go directly from your browser to api.openai.com. Fast, reliable JSON, good prose. Requires a paid API key.';
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
  const isMLX    = document.getElementById('s-mlx').checked;
  CFG.backend     = isClaude ? 'claude' : isOpenAI ? 'openai' : isMLX ? 'mlx' : 'ollama';
  CFG.mlxModel    = document.getElementById('s-mlx-model').value.trim() || 'mlx-community/Qwen2.5-3B-Instruct-4bit';
  CFG.mlxHfToken  = document.getElementById('s-mlx-token').value.trim();
  CFG.claudeModel = document.getElementById('s-claude-model').value;
  CFG.claudeApiKey= document.getElementById('s-api-key').value.trim();
  CFG.openaiModel = document.getElementById('s-openai-model').value;
  CFG.openaiApiKey= document.getElementById('s-openai-key').value.trim();
  CFG.debugMode   = document.getElementById('s-debug').checked;
  const oSel = document.getElementById('s-ollama-model');
  CFG.ollamaModel = oSel.value === 'custom'
    ? (document.getElementById('s-ollama-custom').value.trim() || 'mistral:latest')
    : oSel.value;
  saveCFG();
  updateEngineLabel();
  document.getElementById('debug-toggle').style.display = CFG.debugMode ? 'block' : 'none';
  closeSettings();
}
