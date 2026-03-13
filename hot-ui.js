// ══════════════════════════════════════════════════════════
//  SCREEN & PANEL MANAGEMENT
// ══════════════════════════════════════════════════════════
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

const PANELS = ['panel-event','panel-venture','loading-panel','panel-result','panel-yearend'];
function showPanel(id) {
  PANELS.forEach(p=>{ const el=document.getElementById(p); if(el) el.style.display='none'; });
  const t = document.getElementById(id);
  if (!t) return;
  t.style.display = 'block';
  t.className = id === 'panel-venture' ? 'venture-in' : 'fade-in';
}

function rotateEpigram() {
  const e = rand(EPIGRAMS);
  const el = document.getElementById('title-epigram');
  const at = document.getElementById('title-attr');
  if (el) el.textContent = e.t;
  if (at) at.textContent = e.a;
}

// ══════════════════════════════════════════════════════════
//  CHOICE RISK ANALYSIS
// ══════════════════════════════════════════════════════════
function analyzeChoiceRisk(choiceText) {
  const lower = choiceText.toLowerCase();
  const risk = { cost: null, requirement: null, warning: null };

  // Detect costs - try to extract exact number first
  const markMatch = choiceText.match(/(\d+)\s*(?:marks?|mk)/i);
  if (markMatch) {
    risk.cost = parseInt(markMatch[1]);
  } else if (/\b(commission|buy|purchase)\b/.test(lower)) {
    // Estimate based on keywords
    if (/vessel|ship/i.test(choiceText)) risk.cost = 600;
    else risk.cost = 100;
  } else if (/\b(hire|bribe|pay|send.*pell.*archive|investigation|notary)\b/.test(lower)) {
    risk.cost = 50;
  }

  // Detect ship requirements
  if (/\b(dispatch|send.*ship|fleet|voyage|sail)\b/.test(lower)) {
    const shipMatch = choiceText.match(/(\d+)\s*ships?/i);
    if (shipMatch) {
      const num = parseInt(shipMatch[1]);
      risk.requirement = `requires ${num} ship${num > 1 ? 's' : ''}`;
    } else if (/fleet|multiple|several/i.test(lower)) {
      risk.requirement = 'requires 2+ ships';
    } else {
      risk.requirement = 'requires 1+ ships';
    }
  }

  // Detect warnings
  if (/\b(challenge|confront|publicly|accuse|dismiss|refuse.*directly)\b/.test(lower)) {
    risk.warning = 'Pell advises caution';
  } else if (/pell.*set.*pen|pell.*watching|pell.*caution/i.test(choiceText)) {
    risk.warning = 'Pell advises caution';
  }

  return risk;
}

function renderChoices(containerId, choices, isVenture) {
  const container = document.getElementById(containerId);
  container.innerHTML = '';
  choices.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'choice-btn' + (isVenture ? ' choice-btn-v' : '');

    // Analyze risk and append hints
    const risk = analyzeChoiceRisk(c);
    
    // Add visual risk indicators at the start of the choice
    let choiceHtml = c;
    const icons = [];
    if (risk.cost) icons.push('💰');
    if (risk.warning) icons.push('⚠️');
    if (icons.length > 0) {
      choiceHtml = `<span class="choice-risk-icons">${icons.join(' ')}</span> ${c}`;
    }
    
    btn.innerHTML = choiceHtml;

    if (risk.cost) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint cost';
      hint.textContent = `requires ${risk.cost} mk`;
      btn.appendChild(hint);
    }
    if (risk.requirement) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint requirement';
      hint.textContent = risk.requirement;
      btn.appendChild(hint);
    }
    if (risk.warning) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint warning';
      hint.textContent = risk.warning;
      btn.appendChild(hint);
    }

    btn.onclick = () => makeChoice(c, isVenture);
    container.appendChild(btn);
  });
  // Kick off pre-fetch for local backends (hot-engine.js)
  if (typeof prefetchOutcomes === 'function') prefetchOutcomes(choices, isVenture);
  // Legendary 4th choice — only at rep 9+, only if event defines one
  if (!isVenture && gs.reputation >= 9 && gs.currentEvent && gs.currentEvent.repChoice) {
    const sep = document.createElement('div');
    sep.style.cssText = 'border-top:1px solid #5a4420;margin:.8rem 0 .4rem;font-size:.6rem;letter-spacing:.18em;color:#a87c28;text-transform:uppercase;';
    sep.style.fontFamily = "'IM Fell English SC', serif";
    sep.textContent = '✦  The Name Moves Alone';
    container.appendChild(sep);
    const btn = document.createElement('button');
    btn.className = 'choice-btn choice-btn-rep';

    // Analyze rep choice risk too
    const risk = analyzeChoiceRisk(gs.currentEvent.repChoice);
    
    // Add visual risk indicators
    let choiceHtml = gs.currentEvent.repChoice;
    const icons = [];
    if (risk.cost) icons.push('💰');
    if (risk.warning) icons.push('⚠️');
    if (icons.length > 0) {
      choiceHtml = `<span class="choice-risk-icons">${icons.join(' ')}</span> ${gs.currentEvent.repChoice}`;
    }
    
    btn.innerHTML = choiceHtml;

    if (risk.cost) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint cost';
      hint.textContent = `requires ${risk.cost} mk`;
      btn.appendChild(hint);
    }
    if (risk.requirement) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint requirement';
      hint.textContent = risk.requirement;
      btn.appendChild(hint);
    }
    if (risk.warning) {
      const hint = document.createElement('span');
      hint.className = 'choice-hint warning';
      hint.textContent = risk.warning;
      btn.appendChild(hint);
    }

    btn.onclick = () => makeChoice(gs.currentEvent.repChoice, false);
    container.appendChild(btn);
  }
}

// ══════════════════════════════════════════════════════════
//  STATUS BAR
// ══════════════════════════════════════════════════════════
function renderThreadTracker() {
  const tracker = document.getElementById('thread-tracker');
  const countEl = document.getElementById('thread-count');
  const list    = document.getElementById('thread-tracker-list');
  if (!tracker) return;

  const alive = (gs.threads || []).filter(t => t.year <= gs.turn);
  if (alive.length === 0) {
    tracker.style.display = 'none';
    return;
  }

  tracker.style.display = 'block';
  countEl.textContent = alive.length;

  list.innerHTML = alive.map(t => {
    const age     = gs.turn - (t.year || gs.turn);
    const ageStr  = age === 0 ? 'this year' : age === 1 ? '1 year' : `${age} years`;
    const urgency = age >= 4 ? 'urgent' : age >= 2 ? 'warning' : '';
    const short   = t.label.length > 38 ? t.label.slice(0, 38) + '…' : t.label;
    return `<div class="thread-item ${urgency}" title="${t.label}">⟳ ${short} — ${ageStr}</div>`;
  }).join('');
}

function renderChoiceStatus() {
  // Find all choice buttons and add status indicators
  if (typeof window._prefetchStatus !== 'undefined') {
    document.querySelectorAll('.choice-btn').forEach(btn => {
      // Get choice text (first line, trimmed)
      const choiceText = btn.childNodes[0]?.textContent?.trim() || btn.textContent?.split('\n')[0]?.trim();
      if (!choiceText) return;
      
      const status = window._prefetchStatus[choiceText];
      
      // Remove existing status classes
      btn.classList.remove('choice-cached', 'choice-loading', 'choice-failed');
      
      // Add status class and tooltip
      if (status === 'pending') {
        btn.classList.add('choice-loading');
        btn.title = 'Loading outcome...';
      } else if (status === 'complete') {
        btn.classList.add('choice-cached');
        btn.title = 'Outcome ready - instant response';
      } else if (status === 'failed') {
        btn.classList.add('choice-failed');
        btn.title = 'Will load when selected';
      }
    });
  }
}

function toggleThreads() {
  const list = document.getElementById('thread-tracker-list');
  if (list) list.style.display = list.style.display === 'none' ? 'block' : 'none';
}

function updateStatusBar() {
  document.getElementById('stat-turn').textContent  = gs.turn;
  document.getElementById('stat-age').textContent   = gs.age;
  document.getElementById('stat-ships').textContent = gs.ships;

  const mk = document.getElementById('stat-marks');
  mk.textContent = `${gs.marks} mk`;
  mk.className   = 'stat-val' + (gs.marks < 300 ? ' danger' : gs.marks < 700 ? ' stat-warning' : '');

  const rp = document.getElementById('stat-rep');
  rp.textContent = `${gs.reputation}/10`;
  rp.className   = 'stat-val' + (gs.reputation <= 2 ? ' danger' : '');

  const tier = document.getElementById('stat-rep-tier');
  const repTier = getRepTier(gs.reputation);
  if      (gs.reputation >= REP_THRESHOLDS.LEGENDARY) { tier.textContent='Legendary';   tier.className='rep-tier legendary'; }
  else if (gs.reputation >= REP_THRESHOLDS.RENOWNED)  { tier.textContent='Renowned';    tier.className='rep-tier high'; }
  else if (gs.reputation >= REP_THRESHOLDS.ESTABLISHED) { tier.textContent='Established'; tier.className='rep-tier medium'; }
  else if (gs.reputation >= REP_THRESHOLDS.PRECARIOUS) { tier.textContent='Precarious';  tier.className='rep-tier low'; }
  else                          { tier.textContent='Disgraced';   tier.className='rep-tier low'; }

  const ph = document.getElementById('stat-phase');
  if (gs.ventureAvailable && gs.phase === 'routes') {
    ph.textContent='🌊 The Horizon'; ph.className='phase-pip venture';
  } else if (gs.phase === 'house') {
    ph.textContent='🏛 The House'; ph.className='phase-pip';
  } else if (gs.phase === 'routes') {
    ph.textContent='⚓ The Routes'; ph.className='phase-pip routes';
  } else {
    ph.textContent='— Year End —'; ph.className='phase-pip';
  }

  const hb = document.getElementById('heir-badge');
  if (gs.heirTrait) {
    hb.innerHTML = `Heir: ${gs.heirName}, ${gs.heirAge}&thinsp;—&thinsp;<span class="ht">${gs.heirTrait.label}</span>`;
  }

  // ── Player character epithet ──────────────────────────────
  const ptEl = document.getElementById('player-trait');
  if (ptEl && gs.decisions) {
    const d = gs.decisions;
    const total = (d.bold||0)+(d.cautious||0)+(d.political||0)+(d.mercantile||0)+(d.patient||0);
    if (total >= 4) {
      const scores = [
        { label:'the Audacious',  key:'bold',       val: d.bold||0 },
        { label:'the Careful',    key:'cautious',   val: d.cautious||0 },
        { label:'the Schemer',    key:'political',  val: d.political||0 },
        { label:'the Merchant',   key:'mercantile', val: d.mercantile||0 },
        { label:'the Patient',    key:'patient',    val: d.patient||0 },
      ];
      const top  = scores.reduce((a,b) => b.val > a.val ? b : a);
      const sec  = [...scores].sort((a,b) => b.val-a.val)[1];
      // Mixed epithet if top two are close
      const mixed = sec.val > 0 && top.val < sec.val * 2.2;
      const combos = {
        'bold+political':'the Ambitious',    'political+bold':'the Ambitious',
        'cautious+patient':'the Deliberate', 'patient+cautious':'the Deliberate',
        'mercantile+bold':'the Opportunist', 'bold+mercantile':'the Opportunist',
        'political+cautious':'the Strategist','cautious+political':'the Strategist',
        'mercantile+political':'the Pragmatist','political+mercantile':'the Pragmatist',
        'bold+patient':'the Measured',       'patient+bold':'the Measured',
      };
      const comboKey = mixed ? top.key+'+'+sec.key : null;
      const epithet  = mixed && combos[comboKey] ? combos[comboKey] : top.label;
      ptEl.textContent = epithet;
      ptEl.title = `Bold: ${d.bold||0} · Cautious: ${d.cautious||0} · Political: ${d.political||0} · Mercantile: ${d.mercantile||0} · Patient: ${d.patient||0}`;
    } else {
      ptEl.textContent = '';
    }
  }
  // ────────────────────────────────────────────────────────

  // ── Debt indicator ───────────────────────────────────────
  const debtEl = document.getElementById('stat-debt');
  if (debtEl) {
    const parts = [];
    if (gs.bankLoan) {
      const ov = (gs.bankLoan.overdue||0) > 0;
      parts.push(`${ov ? '⚠ ' : ''}Exchange: ${gs.bankLoan.balance} mk @ ${Math.round(gs.bankLoan.rate*100)}%${ov ? ' OVERDUE' : ''}`);
    }
    if (gs.shadowLoan) {
      const ov = (gs.shadowLoan.overdue||0);
      const warn = ov >= 2 ? '⚠⚠ ' : ov >= 1 ? '⚠ ' : '';
      parts.push(`${warn}Masso: ${gs.shadowLoan.balance} mk @ 40%${ov >= 1 ? ' PAST DUE' : ''}`);
    }
    if (parts.length) {
      debtEl.textContent = parts.join('  ·  ');
      debtEl.style.display = 'block';
      debtEl.style.color = (gs.shadowLoan && (gs.shadowLoan.overdue||0) >= 1) ||
                            (gs.bankLoan   && (gs.bankLoan.overdue||0)   >= 1) ? '#c03020' : '#c8922a';
    } else {
      debtEl.style.display = 'none';
    }
  }
  // ────────────────────────────────────────────────────────

  // ── Thread tracker ───────────────────────────────────────
  renderThreadTracker();
  // ────────────────────────────────────────────────────────

  // Dynasty label with generation
  const genRoman = ['I','II','III','IV','V','VI','VII','VIII','IX','X'];
  const genLabel = gs.generation && gs.generation > 1
    ? ` &thinsp;·&thinsp; Gen ${genRoman[gs.generation-1] || gs.generation}`
    : '';
  const dl = document.getElementById('dynasty-label');
  if (dl && gs.dynastyName) {
    dl.innerHTML = `House ${gs.dynastyName} — ${gs.founderName}${genLabel}`;
    dl.title = getRivalContext ? getRivalContext() : '';
  }
}

// ══════════════════════════════════════════════════════════
//  SHOW RESULT
// ══════════════════════════════════════════════════════════
function showResult(parsed, isVenture) {
  const block = document.getElementById('narrative-block');
  block.innerHTML = '';
  (parsed.narrative||'').split('\n\n').forEach(para => {
    if (!para.trim()) return;
    const p = document.createElement('p');
    p.className = 'narrative-para' + (isVenture ? ' venture-color' : '');
    p.textContent = para.trim();
    block.appendChild(p);
  });

  document.getElementById('ledger-entry').textContent = parsed.ledger_entry || '—';

  const deltasEl = document.getElementById('deltas');
  deltasEl.innerHTML = '';
  const addDelta = (label, val, unit) => {
    if (!val) return;
    const d = document.createElement('div');
    d.className = `delta ${val > 0 ? 'pos' : 'neg'}`;
    d.innerHTML = `<span class="dl">${label} </span><span class="dv">${val>0?'+':''}${val}${unit}</span>`;
    deltasEl.appendChild(d);
  };
  addDelta('Treasury',   parsed.marks_delta,      ' mk');
  addDelta('Reputation', parsed.reputation_delta, '');
  addDelta('Ships',      parsed.ships_delta,      '');

  const btn = document.getElementById('continue-btn');
  btn.textContent = gs.phase === 'house' ? 'To the Routes →' : 'To Year\'s End →';
  btn.className   = isVenture ? 'btn btn-venture' : 'btn';

  showPanel('panel-result');
  window.scrollTo({ top:0, behavior:'smooth' });
}

// ══════════════════════════════════════════════════════════
//  LEDGER HISTORY
// ══════════════════════════════════════════════════════════
function updateLedgerHistory() {
  const hist  = document.getElementById('ledger-history');
  const lines = document.getElementById('ledger-lines');
  if (!gs.ledger.length) { hist.style.display='none'; return; }
  hist.style.display = 'block';
  lines.innerHTML = '';
  gs.ledger.forEach(l => {
    const div = document.createElement('div');
    div.className = 'ledger-line';
    div.innerHTML = `<span class="ledger-phase">${l.phase} ${l.year}</span>${l.entry}`;
    lines.appendChild(div);
  });
}

// ══════════════════════════════════════════════════════════
//  DEATH SCREEN
// ══════════════════════════════════════════════════════════
function formatHeirText(template, pronouns) {
  return template
    .replace(/\bthey\b/g, pronouns.sub)
    .replace(/\btheir\b/g, pronouns.pos)
    .replace(/\bThere\b/g, pronouns.cap);
}

function showDeathScreen() {
  const age = gs.age;
  const ageDesc = age < 42 ? 'far too young, though the sea does not consider age a mitigating circumstance'
    : age < 55 ? 'not old enough and not young enough, which satisfied neither camp'
    : age < 65 ? 'not young and not old, which satisfied neither camp'
    : 'old enough to have done several things differently, in retrospect';

  const genOrdinal = ['Founder','Second of the House','Third of the House','Fourth of the House',
    'Fifth of the House','Sixth of the House','Seventh of the House','Eighth of the House'];
  const roleLabel = genOrdinal[(gs.generation||1) - 1] || `${gs.generation}th of the House`;
  document.getElementById('death-notice').innerHTML =
    `<strong>${gs.founderName} of House ${gs.dynastyName}.</strong> ${roleLabel}. Dead at ${age}, which is ${ageDesc}.`;

  const repAtDeath = gs.reputation;
  const epitaph = gs.marks > 4000 && repAtDeath >= 9
    ? 'Left the house wealthy and the name at its peak — which is the most dangerous inheritance there is. The heir receives a ceiling, not a floor.'
    : gs.marks > 4000
    ? 'Left the house wealthy. Left the heir comfortable. Comfort, as the ledger has noted before, is its own kind of problem.'
    : gs.marks > 2000
    ? 'Left the house neither ruined nor remarkable. The heir has enough to work with and enough to worry about, which is perhaps the honest inheritance.'
    : gs.marks > 800
    ? 'Left the house with modest means and a name that still opens certain doors. The heir will need to decide quickly which doors matter.'
    : 'Left the house nearly empty. The heir has the name. How much the name is worth is a question the next generation will answer.';

  document.getElementById('death-epitaph').textContent = epitaph;

  const { sub:ds, pos:dp, cap:dc } = gs.hp;
  // Debt note on death screen
  let debtNote = '';
  if (gs.bankLoan || gs.shadowLoan) {
    const parts = [];
    if (gs.bankLoan)   parts.push(`${gs.bankLoan.balance} mk to the Merchant Exchange`);
    if (gs.shadowLoan) parts.push(`${gs.shadowLoan.balance} mk to the Masso arrangement`);
    debtNote = `The heir also inherits the outstanding debt: ${parts.join(' and ')}. The ledger notes this without opinion.`;
  }
  const heirEl = document.getElementById('death-heir-note');
  const baseHeirText = `${gs.heirName} inherits at ${gs.heirAge} — ${formatHeirText(gs.heirTrait.death, gs.hp)}`;
  heirEl.textContent = debtNote ? baseHeirText + ' ' + debtNote : baseHeirText;

  const ledgerEl = document.getElementById('death-ledger');
  ledgerEl.innerHTML = '';
  gs.ledger.slice(0,8).forEach(l => {
    const div = document.createElement('div');
    div.className = 'ledger-line';
    div.innerHTML = `<span class="ledger-phase">${l.phase} ${l.year}</span>${l.entry}`;
    ledgerEl.appendChild(div);
  });

  showScreen('screen-death');
}

// ══════════════════════════════════════════════════════════
//  RESET & ERROR
// ══════════════════════════════════════════════════════════
function generationalHandoff() {
  const generation = (gs.generation || 1) + 1;
  const oldFounderName = gs.founderName;

  // ── Heir takes the helm ──
  const newFounderName = gs.heirName;
  const newFounderAge  = gs.heirAge;

  // ── Generate a new heir ──
  const traitKeys = Object.keys(HEIR_TRAITS);
  const traitKey  = rand(traitKeys);
  const female    = Math.random() > 0.5;
  const heirName  = female ? rand(HEIR_FEMALE) : rand(HEIR_MALE);
  const newHp     = female
    ? { sub:'she', obj:'her', pos:'her', cap:'She' }
    : { sub:'he',  obj:'him', pos:'his', cap:'He'  };
  const newHeirAge = Math.floor(Math.random() * 6) + 5; // 5–10

  // ── Write succession to ledger ──
  gs.ledger.unshift({
    year: gs.turn, phase: 'Succession',
    entry: `The house passes to ${newFounderName}. ${oldFounderName} is entered in the record. Generation ${generation} of House ${gs.dynastyName} begins.`
  });

  // ── Transfer the house ──
  gs.founderName    = newFounderName;
  gs.age            = newFounderAge;
  gs.generation     = generation;

  // ── New heir ──
  gs.heirName       = heirName;
  gs.heirFemale     = female;
  gs.hp             = newHp;
  gs.heirAge        = newHeirAge;
  gs.heirTrait      = { key:traitKey, ...HEIR_TRAITS[traitKey] };

  // ── Reset per-generation flags; keep marks, ships, rep, ledger, turn ──
  gs.usedHouse      = new Set();
  gs.usedRoutes     = new Set();
  gs.usedVentures   = new Set();
  gs.ventureAvailable = false;
  gs.ventureUsed    = false;
  gs._romanticSaved = false;
  gs._cautiousSaved = false;
  gs._yearIncome    = undefined;
  gs.currentEvent   = null;
  gs.phase          = 'house';
  // Debts pass to the heir — the house owes, not the person.
  // Shadow overdue counter resets (heir gets one negotiation window).
  if (gs.shadowLoan) gs.shadowLoan.overdue = 0;
  gs.shipMarket     = null; // reroll at next year-end
  // Threads pass to heir — the house's unfinished business endures.
  // Extend expiry so they don't silently die in the first heir-year.
  gs.threads = (gs.threads||[]).map(t => ({ ...t, expiresYear: t.expiresYear + 5 }));

  showScreen('screen-game');
  updateStatusBar();
  updateLedgerHistory();
  window.scrollTo({ top:0, behavior:'smooth' });
  beginPhase();
}

function resetGame() {
  document.getElementById('input-dynasty').value = '';
  document.getElementById('input-founder').value = '';
  rotateEpigram();
  showScreen('screen-name');
}

function showError(err) {
  const b = document.getElementById('error-banner');
  let msg = 'The ledger encountered an error.';
  if (err.message && (err.message.includes('fetch') || err.message.includes('Failed') || err.message.includes('NetworkError'))) {
    if (CFG.backend === 'claude') {
      msg = 'Claude API unreachable. Check your internet connection and API key in ⊞ Settings.';
    } else {
      msg = 'Ollama is not responding. Make sure the Ollama app is running. Then try again — the ledger is patient.';
    }
  } else if (err.message && (err.message.includes('JSON') || err.message.includes('No JSON'))) {
    msg = 'The model returned something the ledger could not parse. Try again — or switch to a larger model in ⊞ Settings (llama3.1:8b or claude-haiku recommended).';
  } else if (err.message && err.message.includes('API key')) {
    msg = err.message;
  } else if (err.message && err.message.includes('Claude API')) {
    msg = err.message;
  } else if (err.message) {
    msg = 'The ledger encountered: ' + err.message;
  }
  const debugHint = CFG.debugMode
    ? ` <button onclick="toggleDebug()" style="background:none;border:none;color:#a08848;font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.1em;cursor:pointer;text-transform:uppercase;text-decoration:underline;">View Debug Log</button>`
    : ` <button onclick="CFG.debugMode=true;saveCFG();document.getElementById('debug-toggle').style.display='block';toggleDebug();" style="background:none;border:none;color:#5a4828;font-family:'IM Fell English SC',serif;font-size:.62rem;letter-spacing:.08em;cursor:pointer;text-transform:uppercase;">Show Raw Output</button>`;
  b.innerHTML = msg + debugHint;
  b.style.display = 'block';
}

function hideError() {
  const b = document.getElementById('error-banner');
  if (b) b.style.display = 'none';
}

// ══════════════════════════════════════════════════════════
//  ONBOARDING
// ══════════════════════════════════════════════════════════
let onboardPage = 0;
const ONBOARD_PAGES = 5;

function renderOnboard() {
  for (let i = 0; i < ONBOARD_PAGES; i++) {
    const page = document.getElementById('op' + i);
    const dot  = document.getElementById('od' + i);
    if (page) page.classList.toggle('active', i === onboardPage);
    if (dot) {
      dot.classList.toggle('active', i === onboardPage);
      dot.classList.toggle('done',   i < onboardPage);
    }
  }
  document.getElementById('onboard-prev').disabled = onboardPage === 0;
  const nextBtn = document.getElementById('onboard-next');
  if (onboardPage === ONBOARD_PAGES - 1) {
    nextBtn.textContent = 'Begin the House →';
    nextBtn.onclick = () => launchGame();
  } else {
    nextBtn.textContent = 'Next →';
    nextBtn.onclick = () => onboardNext();
  }
}

function onboardNext() {
  if (onboardPage < ONBOARD_PAGES - 1) { onboardPage++; renderOnboard(); }
}

function onboardPrev() {
  if (onboardPage > 0) { onboardPage--; renderOnboard(); }
}

function skipOnboard() { launchGame(); }

function launchGame() {
  showScreen('screen-game');
  document.getElementById('advisor-toggle').style.display = 'block';
  beginPhase();
}
