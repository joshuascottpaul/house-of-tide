// ══════════════════════════════════════════════════════════
//  OLLAMA SETUP WIZARD
//  Interactive step-by-step guide for first-time Ollama setup
// ══════════════════════════════════════════════════════════

const WIZARD_STEPS = ['check', 'install', 'model', 'cors', 'done'];

let _wizardStep = 'check';

function openOllamaWizard() {
  const el = document.getElementById('ollama-wizard');
  if (!el) return;
  _wizardStep = 'check';
  // Update pull command to reflect current model selection
  const model = (typeof CFG !== 'undefined' ? CFG.ollamaModel : null) || 'mistral:latest';
  const pullCmd = document.getElementById('wizard-pull-cmd');
  if (pullCmd) pullCmd.textContent = 'ollama pull ' + model;
  el.classList.add('open');
  _wizardRender('check');
  _wizardAutoCheck();
}

function closeOllamaWizard() {
  const el = document.getElementById('ollama-wizard');
  if (el) el.classList.remove('open');
}

function _wizardGo(step) {
  _wizardStep = step;
  _wizardRender(step);
}

function _wizardRender(step) {
  // Update progress pips
  const pips = document.querySelectorAll('.wizard-pip');
  const stepIdx = WIZARD_STEPS.indexOf(step);
  pips.forEach((pip, i) => {
    pip.classList.remove('done', 'current');
    if (i < stepIdx) pip.classList.add('done');
    else if (i === stepIdx) pip.classList.add('current');
  });

  // Show correct step panel
  document.querySelectorAll('.wizard-step').forEach(s => s.classList.remove('active'));
  const panel = document.getElementById('wizard-step-' + step);
  if (panel) panel.classList.add('active');
}

async function _wizardAutoCheck() {
  const statusEl = document.getElementById('wizard-check-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<span style="color:#a08848">Checking Ollama…</span>';

  try {
    const resp = await fetch('http://localhost:11434/api/tags', {
      method: 'GET',
      signal: AbortSignal.timeout(4000)
    });

    if (resp.ok) {
      const data = await resp.json();
      const models = (data.models || []).map(m => m.name);
      const targetModel = (typeof CFG !== 'undefined' ? CFG.ollamaModel : null) || 'mistral:latest';
      const hasModel = models.some(m => m === targetModel || m.startsWith(targetModel.split(':')[0]));

      if (!hasModel) {
        statusEl.innerHTML = '<span class="wizard-ok">✓ Ollama is running</span> — but model <code>' + targetModel + '</code> is not pulled yet.';
        _wizardGo('model');
        return;
      }

      // Model exists — try a quick chat to check CORS
      try {
        const chatResp = await fetch('http://localhost:11434/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            model: targetModel,
            stream: false,
            options: { num_predict: 1 },
            messages: [{ role: 'user', content: 'hi' }]
          }),
          signal: AbortSignal.timeout(8000)
        });
        if (chatResp.ok) {
          statusEl.innerHTML = '<span class="wizard-ok">✓ Ollama is running and ' + targetModel + ' is ready.</span>';
          _wizardGo('done');
        } else {
          statusEl.innerHTML = '<span class="wizard-fail">✗ Chat request failed (' + chatResp.status + '). Likely a CORS issue.</span>';
          _wizardGo('cors');
        }
      } catch (_) {
        statusEl.innerHTML = '<span class="wizard-fail">✗ CORS blocked the request.</span>';
        _wizardGo('cors');
      }
    } else {
      statusEl.innerHTML = '<span class="wizard-fail">✗ Ollama returned an error (' + resp.status + ').</span>';
      _wizardGo('install');
    }
  } catch (_) {
    statusEl.innerHTML = '<span class="wizard-fail">✗ Cannot reach Ollama at localhost:11434.</span>';
    _wizardGo('install');
  }
}

async function wizardCheckAgain() {
  _wizardGo('check');
  await _wizardAutoCheck();
}

async function wizardCheckModel() {
  const statusEl = document.getElementById('wizard-model-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<span style="color:#a08848">Checking…</span>';

  const targetModel = (typeof CFG !== 'undefined' ? CFG.ollamaModel : null) || 'mistral:latest';

  try {
    const resp = await fetch('http://localhost:11434/api/tags', {
      signal: AbortSignal.timeout(4000)
    });
    if (resp.ok) {
      const data = await resp.json();
      const models = (data.models || []).map(m => m.name);
      const hasModel = models.some(m => m === targetModel || m.startsWith(targetModel.split(':')[0]));
      if (hasModel) {
        statusEl.innerHTML = '<span class="wizard-ok">✓ Model ' + targetModel + ' is ready.</span>';
        setTimeout(() => _wizardGo('cors'), 800);
      } else {
        statusEl.innerHTML = '<span class="wizard-fail">Model not found yet. Still pulling?</span>';
      }
    } else {
      statusEl.innerHTML = '<span class="wizard-fail">Ollama not reachable.</span>';
    }
  } catch (_) {
    statusEl.innerHTML = '<span class="wizard-fail">Cannot reach Ollama.</span>';
  }
}

async function wizardCheckCors() {
  const statusEl = document.getElementById('wizard-cors-status');
  if (!statusEl) return;
  statusEl.innerHTML = '<span style="color:#a08848">Testing CORS…</span>';

  const targetModel = (typeof CFG !== 'undefined' ? CFG.ollamaModel : null) || 'mistral:latest';

  try {
    const resp = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: targetModel,
        stream: false,
        options: { num_predict: 1 },
        messages: [{ role: 'user', content: 'hi' }]
      }),
      signal: AbortSignal.timeout(10000)
    });
    if (resp.ok) {
      statusEl.innerHTML = '<span class="wizard-ok">✓ CORS is configured correctly.</span>';
      setTimeout(() => _wizardGo('done'), 800);
    } else {
      statusEl.innerHTML = '<span class="wizard-fail">Request failed (' + resp.status + '). Try restarting Ollama after running the command.</span>';
    }
  } catch (_) {
    statusEl.innerHTML = '<span class="wizard-fail">CORS still blocking. Restart Ollama after running the command above.</span>';
  }
}

// Export globals
window.openOllamaWizard  = openOllamaWizard;
window.closeOllamaWizard = closeOllamaWizard;
window.wizardCheckAgain  = wizardCheckAgain;
window.wizardCheckModel  = wizardCheckModel;
window.wizardCheckCors   = wizardCheckCors;
window._wizardGo         = _wizardGo;
