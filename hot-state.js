// ══════════════════════════════════════════════════════════
//  GAME STATE
// ══════════════════════════════════════════════════════════
let gs = {
  dynastyName:'', founderName:'', heirName:'', heirFemale:true,
  hp:{ sub:'they', obj:'them', pos:'their', cap:'They' },
  heirTrait:null,
  marks:800, reputation:5, ships:1,
  turn:1, age:28, heirAge:7, generation:1,
  phase:'house',
  ventureAvailable:false, ventureUsed:false,
  usedHouse:new Set(), usedRoutes:new Set(), usedVentures:new Set(),
  ledger:[], currentEvent:null,
  _romanticSaved:false, _cautiousSaved:false,
  decisions:{ bold:0, cautious:0, political:0, mercantile:0, patient:0 },
  history:[],
  bankLoan:null, shadowLoan:null, creditScore:0, shipMarket:null,
  threads:[],
  cargo: { saltfish:0, wine:0, alum:0, tin:0 },
  marketPrices: null,
  rivals:{
    borracchi:{ relationship:0, lastInteraction:0, notes:[] },
    spinetta: { relationship:0, lastInteraction:0, notes:[] },
    calmari:  { relationship:0, lastInteraction:0, notes:[] },
    liyuen:   { relationship:0, lastInteraction:0, notes:[] },
  },
};

// ══════════════════════════════════════════════════════════
//  SAVE / LOAD SYSTEM
// ══════════════════════════════════════════════════════════
const SAVE_KEY_PREFIX = 'house_of_tide_save_';
const AUTOSAVE_KEY    = 'house_of_tide_autosave';
const NUM_SLOTS       = 3;

// ── Serialise / deserialise gs (Sets don't JSON-serialise natively) ──
function serialiseState() {
  return JSON.stringify({
    ...gs,
    usedHouse:    [...gs.usedHouse],
    usedRoutes:   [...gs.usedRoutes],
    usedVentures: [...gs.usedVentures],
  });
}

function deserialiseState(raw) {
  const obj = JSON.parse(raw);
  obj.usedHouse    = new Set(obj.usedHouse    || []);
  obj.usedRoutes   = new Set(obj.usedRoutes   || []);
  obj.usedVentures = new Set(obj.usedVentures || []);
  obj.hp = obj.heirFemale
    ? { sub:'she', obj:'her', pos:'her', cap:'She' }
    : { sub:'he',  obj:'him', pos:'his', cap:'He'  };
  obj.generation      = obj.generation      || 1;
  obj._romanticSaved  = obj._romanticSaved  || false;
  obj._cautiousSaved  = obj._cautiousSaved  || false;
  obj.decisions       = obj.decisions       || { bold:0, cautious:0, political:0, mercantile:0, patient:0 };
  obj.history         = obj.history         || [];
  obj.bankLoan        = obj.bankLoan        || null;
  obj.shadowLoan      = obj.shadowLoan      || null;
  obj.creditScore     = obj.creditScore     || 0;
  obj.shipMarket      = obj.shipMarket      || null;
  obj.threads         = obj.threads         || [];
  obj.cargo           = obj.cargo           || { saltfish:0, wine:0, alum:0, tin:0 };
  obj.marketPrices    = obj.marketPrices    || null;
  obj.rivals          = obj.rivals          || {
    borracchi:{ relationship:0, lastInteraction:0, notes:[] },
    spinetta: { relationship:0, lastInteraction:0, notes:[] },
    calmari:  { relationship:0, lastInteraction:0, notes:[] },
    liyuen:   { relationship:0, lastInteraction:0, notes:[] },
  };
  // Ensure all four families exist (for saves predating rival memory)
  for (const fam of ['borracchi','spinetta','calmari','liyuen']) {
    if (!obj.rivals[fam]) obj.rivals[fam] = { relationship:0, lastInteraction:0, notes:[] };
  }
  return obj;
}

// ── Auto-save after every turn result ──
function autoSave() {
  if (!gs.dynastyName) return;
  try {
    localStorage.setItem(AUTOSAVE_KEY, serialiseState());
    // Show subtle save notification
    showNotification('✓ Auto-saved');
  } catch(e) { /* storage full or unavailable */ }
}

// ── Named slot save ──
function saveToSlot(slot) {
  if (!gs.dynastyName) return;
  const data = {
    state:    serialiseState(),
    savedAt:  new Date().toISOString(),
    label:    `House ${gs.dynastyName} — ${gs.founderName}`,
    detail:   `Year ${gs.turn}, Age ${gs.age} · ${gs.marks} mk · Rep ${gs.reputation}/10`,
  };
  localStorage.setItem(SAVE_KEY_PREFIX + slot, JSON.stringify(data));
  renderSaveOverlay();
  flashSaveSlot(slot);
}

function flashSaveSlot(slot) {
  const el = document.getElementById('save-slot-' + slot);
  if (!el) return;
  el.style.borderColor = '#5a8030';
  setTimeout(() => { el.style.borderColor = ''; }, 800);
}

// ── Load from slot ──
function loadFromSlot(slot) {
  const raw = localStorage.getItem(SAVE_KEY_PREFIX + slot);
  if (!raw) return;
  try {
    const data = JSON.parse(raw);
    gs = deserialiseState(data.state);
    closeSaveOverlay();
    updateStatusBar();
    document.getElementById('dynasty-label').textContent = `House ${gs.dynastyName} — ${gs.founderName}`;
    document.getElementById('advisor-toggle').style.display = 'block';
    showScreen('screen-game');
    // Restore correct panel state
    updateLedgerHistory();
    if (gs.phase === 'yearend') {
      showYearEnd();
    } else if (gs.currentEvent) {
      // ── Exact event restore — don't call pickEvent() ──
      const houseGlyph = '<span class="glyph glyph-sword" style="font-size:.9em;">⚔</span>';
      const routeGlyph = '<span class="glyph glyph-anchor" style="font-size:.9em;">⚓</span>';
      if (gs.ventureAvailable && gs.phase === 'routes') {
        showVenture();
      } else if (gs.phase === 'house') {
        document.getElementById('event-phase-lbl').innerHTML = `${houseGlyph} &nbsp; From the House &nbsp; ${houseGlyph}`;
        document.getElementById('event-text').textContent = gs.currentEvent.text;
        renderChoices('choices-container', gs.currentEvent.choices, false);
        showPanel('panel-event');
      } else {
        document.getElementById('event-phase-lbl').innerHTML = `${routeGlyph} &nbsp; From the Routes &nbsp; ${routeGlyph}`;
        document.getElementById('event-text').textContent = gs.currentEvent.text;
        renderChoices('choices-container', gs.currentEvent.choices, false);
        showPanel('panel-event');
      }
    } else {
      beginPhase();
    }
  } catch(e) {
    alert('The ledger could not be read. The save may be corrupt.');
  }
}

// ── Load autosave ──
function loadAutosave() {
  const raw = localStorage.getItem(AUTOSAVE_KEY);
  if (!raw) return;
  try {
    gs = deserialiseState(raw);
    updateStatusBar();
    document.getElementById('dynasty-label').textContent = `House ${gs.dynastyName} — ${gs.founderName}`;
    document.getElementById('advisor-toggle').style.display = 'block';
    showScreen('screen-game');
    updateLedgerHistory();
    if (gs.phase === 'yearend') showYearEnd();
    else beginPhase();
  } catch(e) {}
}

// ── Delete slot ──
function deleteSlot(slot) {
  const el = document.getElementById('save-slot-' + slot);
  const confirm = el.querySelector('.save-confirm');
  if (confirm.style.display === 'block') {
    localStorage.removeItem(SAVE_KEY_PREFIX + slot);
    renderSaveOverlay();
  } else {
    confirm.style.display = 'block';
    setTimeout(() => { confirm.style.display = 'none'; }, 3000);
  }
}

// ── Render save overlay ──
function renderSaveOverlay() {
  for (let s = 1; s <= NUM_SLOTS; s++) {
    const el  = document.getElementById('save-slot-' + s);
    const raw = localStorage.getItem(SAVE_KEY_PREFIX + s);

    if (!raw) {
      el.innerHTML = `
        <div class="save-slot-num">Record ${s}</div>
        <div class="save-slot-empty" style="margin:.5rem 0;">Empty — no record kept here.</div>
        <div class="save-slot-actions">
          ${gs.dynastyName ? `<button class="save-btn" onclick="saveToSlot(${s})">Write here</button>` : ''}
        </div>`;
    } else {
      let data, label = '—', detail = '—', dateStr = '—';
      try {
        data    = JSON.parse(raw);
        label   = data.label   || '—';
        detail  = data.detail  || '—';
        dateStr = data.savedAt ? new Date(data.savedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short', year:'numeric' }) : '—';
      } catch(e) {}

      el.innerHTML = `
        <div class="save-slot-header">
          <span class="save-slot-num">Record ${s}</span>
          <span class="save-slot-date">${dateStr}</span>
        </div>
        <div class="save-slot-name">${label}</div>
        <div class="save-slot-detail">${detail}</div>
        <div class="save-slot-actions">
          <button class="save-btn load" onclick="loadFromSlot(${s})">Continue</button>
          ${gs.dynastyName ? `<button class="save-btn" onclick="saveToSlot(${s})">Overwrite</button>` : ''}
          <button class="save-btn del" onclick="deleteSlot(${s})">Destroy</button>
        </div>
        <div class="save-confirm">Click Destroy again to confirm. This cannot be recovered.</div>`;
    }
  }
}

// ── Open / close overlay ──
function openSaveOverlay() {
  renderSaveOverlay();
  document.getElementById('save-overlay').style.display = 'block';
}

function closeSaveOverlay() {
  document.getElementById('save-overlay').style.display = 'none';
}

// Close overlay on Escape
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeSaveOverlay();
});

// ── Title screen: show existing saves ──
function renderTitleSaves() {
  const container = document.getElementById('title-save-list');
  const titleDiv  = document.getElementById('title-saves');
  if (!container || !titleDiv) return;

  const entries = [];

  // Check autosave
  const auto = localStorage.getItem(AUTOSAVE_KEY);
  if (auto) {
    try {
      const autoState = deserialiseState(auto);
      if (autoState && autoState.dynastyName) {
        entries.push({
          label:  `House ${autoState.dynastyName} — ${autoState.founderName}`,
          detail: `Year ${autoState.turn} · Age ${autoState.age} · ${autoState.marks} mk`,
          action: 'loadAutosave()',
          tag:    'Auto',
        });
      }
    } catch(e) {}
  }

  // Check named slots
  for (let s = 1; s <= NUM_SLOTS; s++) {
    const raw = localStorage.getItem(SAVE_KEY_PREFIX + s);
    if (!raw) continue;
    try {
      const data    = JSON.parse(raw);
      const dateStr = data.savedAt
        ? new Date(data.savedAt).toLocaleDateString('en-GB', { day:'numeric', month:'short' })
        : '';
      entries.push({
        label:  data.label  || '—',
        detail: (data.detail || '—') + (dateStr ? ' · ' + dateStr : ''),
        action: `loadFromSlot(${s})`,
        tag:    `Record ${s}`,
      });
    } catch(e) {}
  }

  if (!entries.length) { titleDiv.style.display = 'none'; return; }

  titleDiv.style.display = 'block';
  container.innerHTML = entries.map(e => `
    <div class="title-save-item" onclick="${e.action}">
      <div class="tsi-info">
        <div class="tsi-name">${e.label}</div>
        <div class="tsi-detail">${e.tag} &nbsp;·&nbsp; ${e.detail}</div>
      </div>
      <div class="tsi-arrow">→</div>
    </div>`).join('');
}

// ══════════════════════════════════════════════════════════
//  RIVAL FAMILY MEMORY
// ══════════════════════════════════════════════════════════

function updateRivalRelationship(family, delta, reason) {
  if (!gs.rivals || !gs.rivals[family]) return;
  const r = gs.rivals[family];
  r.relationship = Math.max(-5, Math.min(5, r.relationship + delta));
  r.lastInteraction = gs.turn;
  if (reason) {
    r.notes.unshift(`Year ${gs.turn}: ${reason}`);
    if (r.notes.length > 8) r.notes.length = 8; // keep last 8
  }
}

function getRivalContext() {
  if (!gs.rivals) return 'No rival history recorded.';
  const labels = {
    borracchi:'The Borracchi', spinetta:'The Spinetta',
    calmari:'The Calmari', liyuen:"Li Yuen's Network",
  };
  const tiers = r => r >=  4 ? 'Allied'
    : r >=  2 ? 'Friendly'
    : r >=  0 ? 'Neutral'
    : r >= -2 ? 'Hostile'
    : 'Enemies';

  return Object.entries(gs.rivals).map(([fam, r]) => {
    const recentNote = r.notes[0] ? ` (${r.notes[0]})` : '';
    return `${labels[fam]}: ${tiers(r.relationship)} (${r.relationship >= 0 ? '+' : ''}${r.relationship})${recentNote}`;
  }).join('\n');
}

function detectAndUpdateRivals(choiceText, narrativeText) {
  const combined = (choiceText + ' ' + (narrativeText || '')).toLowerCase();
  const year = gs.turn;

  const families = [
    { key:'borracchi', names:['borracchi','rinaldo'] },
    { key:'spinetta',  names:['spinetta'] },
    { key:'calmari',   names:['calmari'] },
    { key:'liyuen',    names:['li yuen','liyuen','yuen'] },
  ];

  // Positive keywords: alliance, helping, accepting, agreeing
  const posWords = /\b(alliance|accept|agree|help|honour|contract|offer|assist|partner|deal)\b/;
  // Negative keywords: challenge, refuse, snub, dismiss, betray, expose
  const negWords = /\b(challenge|refuse|dismiss|snub|betray|expose|publicly|confront|against)\b/;

  for (const { key, names } of families) {
    const mentioned = names.some(n => combined.includes(n));
    if (!mentioned) continue;

    if (posWords.test(choiceText.toLowerCase())) {
      updateRivalRelationship(key, +1, `Favourable interaction — "${choiceText.slice(0,60)}"`);
    } else if (negWords.test(choiceText.toLowerCase())) {
      updateRivalRelationship(key, -1, `Hostile action — "${choiceText.slice(0,60)}"`);
    } else {
      // Neutral mention — just record last interaction year
      if (gs.rivals[key]) gs.rivals[key].lastInteraction = year;
    }
  }
}
