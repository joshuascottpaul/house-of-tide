// ══════════════════════════════════════════════════════════
//  UNIFIED LLM CALLER
// ══════════════════════════════════════════════════════════
async function callLLM(systemPrompt, userMsg, opts = {}) {
  // opts: { json: bool, temperature: float, maxTokens: int, noThink: bool }
  const isJson    = opts.json    !== false;
  const temp      = opts.temperature ?? 0.88;
  const maxTok    = opts.maxTokens   ?? 900;
  const noThink   = opts.noThink     !== false;
  const msgText   = noThink ? userMsg + ' /no_think' : userMsg;

  let raw = '';
  let metaStr = '';

  if (CFG.backend === 'mlx') {
    // ── MLX (mlx-openai-server, OpenAI-compatible) ─────────
    metaStr = `MLX · ${CFG.mlxModel}`;

    const body = {
      model:       CFG.mlxModel,
      max_tokens:  maxTok,
      temperature: temp,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: msgText }
      ]
    };
    if (isJson) body.response_format = { type: 'json_object' };

    const mlxHeaders = { 'Content-Type': 'application/json' };
    if (CFG.mlxHfToken) mlxHeaders['Authorization'] = `Bearer ${CFG.mlxHfToken}`;

    const resp = await fetch('http://localhost:8000/v1/chat/completions', {
      method:  'POST',
      headers: mlxHeaders,
      body:    JSON.stringify(body)
    });

    if (!resp.ok) throw new Error(`MLX server ${resp.status} — is mlx-openai-server running?`);
    const data = await resp.json();
    raw = data.choices?.[0]?.message?.content || '';

  } else if (CFG.backend === 'openai') {
    // ── OpenAI API ─────────────────────────────────────────
    if (!CFG.openaiApiKey) throw new Error('No OpenAI API key set. Open ⊞ Settings to add one.');
    metaStr = `OpenAI API · ${CFG.openaiModel}`;

    const body = {
      model:       CFG.openaiModel,
      max_tokens:  maxTok,
      temperature: temp,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: msgText }
      ]
    };
    if (isJson) {
      body.response_format = { type: 'json_object' };
    }

    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${CFG.openaiApiKey}`
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      const detail  = errBody?.error?.message || resp.statusText;
      throw new Error(`OpenAI API ${resp.status}: ${detail}`);
    }

    const data = await resp.json();
    raw = data.choices?.[0]?.message?.content || '';

  } else if (CFG.backend === 'claude') {
    // ── Claude API ─────────────────────────────────────────
    if (!CFG.claudeApiKey) throw new Error('No Claude API key set. Open ⊞ Settings to add one.');
    metaStr = `Claude API · ${CFG.claudeModel}`;

    const body = {
      model:      CFG.claudeModel,
      max_tokens: maxTok,
      temperature: temp,
      system:     systemPrompt,
      messages:   [{ role: 'user', content: msgText }]
    };
    if (isJson) {
      // Ask Claude to produce only JSON via system prompt amendment
      // (Claude doesn't have a format:json param but follows instructions reliably)
      body.system = 'CRITICAL: respond with valid JSON only. No prose, no markdown fences. Start with { end with }\n\n' + systemPrompt;
    }

    const resp = await fetch('https://api.anthropic.com/v1/messages', {
      method:  'POST',
      headers: {
        'Content-Type':    'application/json',
        'x-api-key':       CFG.claudeApiKey,
        'anthropic-version': '2023-06-01',
        'anthropic-dangerous-direct-browser-access': 'true'
      },
      body: JSON.stringify(body)
    });

    if (!resp.ok) {
      const errBody = await resp.json().catch(() => ({}));
      const detail  = errBody?.error?.message || resp.statusText;
      throw new Error(`Claude API ${resp.status}: ${detail}`);
    }

    const data = await resp.json();
    raw = data.content?.[0]?.text || '';

  } else {
    // ── Ollama ─────────────────────────────────────────────
    metaStr = `Ollama · ${CFG.ollamaModel}`;

    const body = {
      model:   CFG.ollamaModel,
      stream:  false,
      options: { temperature: temp, num_predict: maxTok },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user',   content: msgText }
      ]
    };
    if (isJson) body.format = 'json';

    const resp = await fetch('http://localhost:11434/api/chat', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(body)
    });

    if (!resp.ok) throw new Error(`Ollama ${resp.status}`);
    const data = await resp.json();
    raw = data.message?.content || '';
  }

  // strip <think> blocks (Qwen)
  const clean = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();

  if (!isJson) {
    debugLog(metaStr, raw, 'plain text — no parse needed', false);
    return clean;
  }

  // ── Three-tier JSON parse ───────────────────────────────
  let parsed;
  let parseNote = '';
  try {
    parsed   = JSON.parse(clean);
    parseNote = '✓ direct JSON.parse';
  } catch(_) {
    const block = clean.match(/\{[\s\S]*\}/);
    if (!block) {
      debugLog(metaStr, raw, '✗ No JSON object found in response', true);
      throw new Error('No JSON in response');
    }
    try {
      parsed   = JSON.parse(block[0]);
      parseNote = '✓ extracted {} block';
    } catch(_2) {
      const nar  = clean.match(/"narrative"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      const mk   = clean.match(/"marks_delta"\s*:\s*(-?\d+)/);
      const rep  = clean.match(/"reputation_delta"\s*:\s*(-?\d+)/);
      const sh   = clean.match(/"ships_delta"\s*:\s*(-?\d+)/);
      const led  = clean.match(/"ledger_entry"\s*:\s*"((?:[^"\\]|\\.)*)"/);
      if (!nar) {
        debugLog(metaStr, raw, '✗ Field rescue also failed — no narrative key', true);
        throw new Error('No JSON in response');
      }
      parsed = {
        narrative:        nar[1].replace(/\\n/g,'\n'),
        marks_delta:      mk  ? parseInt(mk[1])  : 0,
        reputation_delta: rep ? parseInt(rep[1]) : 0,
        ships_delta:      sh  ? parseInt(sh[1])  : 0,
        ledger_entry:     led ? led[1] : 'The ledger notes the event without comment.',
        open_thread:      null,
        resolve_thread:   null
      };
      parseNote = '⚠ field-rescue used';
    }
  }

  debugLog(metaStr, raw, parseNote, false);
  return parsed;
}

// ══════════════════════════════════════════════════════════
//  CONNECTION TEST
// ══════════════════════════════════════════════════════════
async function testConnection() {
  const btn = document.getElementById('test-btn');
  const res = document.getElementById('test-result');
  btn.disabled = true;
  btn.textContent = '⊞  Consulting the archive…';
  res.style.color = '#3a2a12';
  res.textContent = '';

  try {
    const resp = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: CFG.ollamaModel === 'custom' ? (document.getElementById('s-ollama-custom')?.value || 'qwen3.5:4b') : CFG.ollamaModel,
        stream: false,
        options: { temperature: 0.5, num_predict: 40 },
        messages: [
          { role: 'system', content: 'You are a laconic harbourmaster. Respond in one short sentence in the style of a ledger note. Dry, precise.' },
          { role: 'user',   content: 'Confirm you are open for business. /no_think' }
        ]
      })
    });

    if (!resp.ok) {
      const err = await resp.json().catch(() => ({}));
      if (resp.status === 404 || (err.error && err.error.includes('not found'))) {
        res.style.color = '#b05040';
        res.textContent = 'Model not found. Run: ollama pull ' + TEST_MODEL;
      } else {
        res.style.color = '#b05040';
        res.textContent = 'Ollama returned an error (' + resp.status + '). Check that it is running.';
      }
      return;
    }

    const data  = await resp.json();
    const raw   = data.message?.content || '';
    const clean = raw.replace(/<think>[\s\S]*?<\/think>/gi, '').trim();
    const reply = clean.length > 0 ? clean : 'Connection established.';

    res.style.color = '#5a8030';
    res.innerHTML = '✓ &nbsp;<em>' + reply + '</em>';

  } catch(e) {
    res.style.color = '#b05040';
    if (e.message && (e.message.includes('fetch') || e.message.includes('Failed') || e.message.includes('NetworkError') || e.message.includes('CORS'))) {
      res.innerHTML =
        '<strong style="color:#c04030">Connection blocked.</strong> Two possible causes:<br><br>' +
        '<strong style="color:#a08848">1. Ollama is not running.</strong> Open the Ollama app from Applications and wait for the llama icon to appear in the menu bar.<br><br>' +
        '<strong style="color:#a08848">2. CORS not set (most likely).</strong> Run this in Terminal, then quit and reopen Ollama:<br>' +
        '<code style="display:block;margin:.5rem 0;padding:.4rem .6rem;background:#0c0a06;border:1px solid #3a2c18;color:#c8a870;font-size:.85rem;font-family:monospace;user-select:all;">launchctl setenv OLLAMA_ORIGINS "*"</code>' +
        'Then click Test Connection again.';
    } else {
      res.innerHTML = 'Error: ' + e.message;
    }
  } finally {
    btn.disabled = false;
    btn.textContent = '⊞  Test Connection';
  }
}
