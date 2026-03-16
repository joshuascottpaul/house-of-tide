// ══════════════════════════════════════════════════════════
//  SEASON HELPER
// ══════════════════════════════════════════════════════════

function getSeason(turn) {
  // 4-season cycle: Spring→Summer→Autumn→Winter repeating
  return ['Spring','Summer','Autumn','Winter'][((turn - 1) % 4)];
}

// ══════════════════════════════════════════════════════════
//  SEED SELECTION
// ══════════════════════════════════════════════════════════

function pickSeed(phase) {
  const highRepGate = (gs.heirTrait && gs.heirTrait.key === 'diplomatic') ? 6 : 7;
  const seeds = SITUATION_SEEDS[phase];
  if (!seeds) return null;

  let pool = [...seeds.standard];
  if (gs.reputation >= highRepGate && seeds.high_rep) pool.push(...seeds.high_rep);
  if (gs.reputation <= 3 && seeds.low_rep)  pool.push(...seeds.low_rep);

  // Remove debt/creditor seeds if no loans active
  const hasDebt = !!(gs.bankLoan || gs.shadowLoan);
  if (!hasDebt) pool = pool.filter(s => s.type !== 'creditor_pressure' && s.type !== 'financial_pressure');

  const used = phase === 'house' ? gs.usedHouse : gs.usedRoutes;
  let avail = pool.filter(s => !used.has(s.id));
  if (avail.length === 0) { used.clear(); avail = pool; }

  const chosen = rand(avail);
  used.add(chosen.id);
  return chosen;
}

// ══════════════════════════════════════════════════════════
//  AI EVENT GENERATION
// ══════════════════════════════════════════════════════════

async function generateEvent(phase) {
  // 1. Pick seed (or thread followup)
  let seed = null;
  let isThreadFollowup = false;

  // Thread followup check (house phase only, 80% chance, forced if 2+ years old)
  if (phase === 'house' && gs.threads && gs.threads.length > 0) {
    const openTypes = new Set(gs.threads.map(t => t.type));
    const threadSeeds = THREAD_SEEDS.filter(ts =>
      openTypes.has(ts.thread) && !gs.usedHouse.has(ts.id)
    );
    if (threadSeeds.length > 0) {
      const oldest = [...gs.threads].sort((a,b) => a.year - b.year);
      const oldestAge = gs.turn - oldest[0].year;
      const forceFollowup = oldestAge >= 2;
      if (forceFollowup || Math.random() < 0.80) {
        for (const t of oldest) {
          const match = threadSeeds.find(ts => ts.thread === t.type && !gs.usedHouse.has(ts.id));
          if (match) { seed = match; isThreadFollowup = true; break; }
        }
      }
    }
  }

  if (!seed) seed = pickSeed(phase);
  if (!seed) return null;

  // 2. Build context
  const recentHistory = gs.ledger.slice(0, 6)
    .map(l => `[Year ${l.year} · ${l.phase}] ${l.entry}`).join('\n') || 'No entries yet.';

  const activeThreads = (gs.threads || []).filter(t => t.year <= gs.turn);
  const threadContext = activeThreads.length > 0
    ? activeThreads.map(t => `— ${t.label} (Year ${t.year})`).join('\n')
    : 'None.';

  const repLabel = getRepTier(gs.reputation);

  const hasDebt = !!(gs.bankLoan || gs.shadowLoan);
  const debtCtx = hasDebt
    ? (gs.bankLoan ? `Exchange loan: ${gs.bankLoan.balance}mk outstanding. ` : '') +
      (gs.shadowLoan ? `Masso arrangement: ${gs.shadowLoan.balance}mk${(gs.shadowLoan.overdue||0)>0?' (OVERDUE)':''}.` : '')
    : 'No active debts.';

  const season = getSeason(gs.turn);
  const seasonNotes = {
    'Winter': 'northern passage closed; politics in rooms; debts called in; the house is cold.',
    'Spring': 'routes opening; urgency; contracts being made; the city briefly optimistic.',
    'Summer': 'peak trade; harbour full; grudges ripening; last year\'s contracts meeting consequences.',
    'Autumn': 'settlement season; accounts presented; ships returning; conversations polite with precision.'
  };

  const userMsg =
`GENERATE A SITUATION for: Phase=${phase==='house'?'The House':'The Routes'}

HOUSE: ${gs.dynastyName} · ${gs.founderName} · Gen ${gs.generation||1} · Year ${gs.turn} · Age ${gs.age}
Treasury: ${gs.marks} mk · Reputation: ${gs.reputation}/10 (${repLabel}) · Ships: ${gs.ships}
Heir: ${gs.heirName} (${gs.heirAge}, ${gs.heirTrait.label})
Debt: ${debtCtx}
SEASON: ${season} — ${seasonNotes[season]}

LEDGER (last 6 entries — the world's recent memory):
${recentHistory}

OPEN THREADS (unresolved — PRIORITY: continue oldest thread if possible):
${threadContext}

SITUATION TYPE: ${seed.type}
SITUATION HINT: ${seed.hint}
${isThreadFollowup ? `NOTE: Thread followup — situation must visibly connect to the open thread.` : ''}
${gs.reputation >= 9 ? `NOTE: Legendary standing (${gs.reputation}/10). Include a repChoice — a ✦ declaration that exists only because of this name.` : ''}

Generate the situation and 3 choices. Present tense. Second person. Junior gothic register. Use named figures from the world: Tucci, Pell, Casso, Rinaldo, Vanzetti, Greve, Albinosi. The situation should feel like the opening of a chapter already in progress.`;

  const parsed = await callLLM(EVENT_GEN_PROMPT, userMsg, {
    json: true, temperature: 0.92, maxTokens: 650, noThink: true
  });

  // 3. Validate and normalize choices
  const situation = (parsed.situation || '').trim();
  let choices = Array.isArray(parsed.choices) ? parsed.choices.filter(ch => ch && ch.trim()) : [];
  
  // Handle case where model returns JSON objects inside choices instead of plain strings
  choices = choices.map(c => {
    if (typeof c === 'object' && c.choice) {
      // Model returned {"choice": "...", "cost": "..."} instead of plain string
      return c.choice;
    }
    return c;
  });
  
  if (choices.length < 2) throw new Error('AI returned too few choices');
  while (choices.length < 3) choices.push('Observe, and say nothing for now.');
  choices = choices.slice(0, 3);
  
  // Apply heir influence (heir personality may modify one choice)
  choices = applyHeirInfluence(choices, seed.id);

  return {
    id: seed.id,
    text: situation,
    choices,
    repChoice: (gs.reputation >= REP_THRESHOLDS.LEGENDARY && parsed.repChoice && parsed.repChoice.trim()) ? parsed.repChoice.trim() : null,
    thread_hint: parsed.thread_hint || null,
    _generated: true,
  };
}

// ══════════════════════════════════════════════════════════
//  FALLBACK EVENT GENERATION (Junior Gothic Register)
// ══════════════════════════════════════════════════════════
function createFallbackEvent(phase) {
  if (phase === 'house') {
    return {
      id: 'fallback_house',
      text: 'The palazzo holds its breath. Pell's pen scratches across the ledger — a sound like rain on slate. The Borracchi sent no word this morning. The Spinetta sent too much. Between these silences, the house waits for your hand on the tiller.',
      choices: [
        'Open the Spinetta correspondence — generosity often has a price, and you intend to count it before paying.',
        'Walk the Ripa with Pell — the harbour speaks truths the council chamber never will.',
        'Send for Casso — if the sea has news, he will have heard it first.'
      ],
      repChoice: null
    };
  } else if (phase === 'routes') {
    return {
      id: 'fallback_routes',
      text: 'The northern passage is closed — winter has teeth this year. Casso's last letter mentioned ice where there should be water. The fleet sits in harbour like hounds on a leash. They do not understand patience. You do.',
      choices: [
        'Hold the current route — patience costs less than lost ships, and the ice will break when it chooses.',
        'Dispatch a fast messenger to the Caldera — Li Yuen's network knows which passages remain open, and what they charge for that knowledge.',
        'Review the manifest — there is cargo to move even in port, and the Masso Arrangement does not sleep for weather.'
      ],
      repChoice: null
    };
  } else if (phase === 'venture') {
    return {
      id: 'fallback_venture',
      text: 'The horizon offers something — a sail where there should be none, or perhaps a trick of the light. The ledger is not yet sure what to call it. Casso has his glass to his eye. He has not lowered it.',
      choices: [
        'Press on — the sea rewards those who do not ask permission, and you have never been good at asking.',
        'Consolidate — bring the fleet closer, tighten the formation. If this is a trap, it will spring on all of you together.',
        'Turn back — there will be other ventures, other horizons. The house endures by knowing when to retreat.'
      ],
      repChoice: null
    };
  }
  // Default fallback
  return {
    id: 'fallback_generic',
    text: 'The ledger waits. The sea does not.',
    choices: ['Consider your options.', 'Consult the archive.', 'Wait for clearer signs.'],
    repChoice: null
  };
}

// ══════════════════════════════════════════════════════════
//  HEIR INFLUENCE — heir personality affects choices
// ══════════════════════════════════════════════════════════
function applyHeirInfluence(choices, eventSeed) {
  if (!gs.heirTrait || !gs.heirName) return choices;
  
  const trait = gs.heirTrait.key;
  const heirAge = gs.heirAge || 7;
  
  // Heir influence scales with age (more influence as they mature)
  const influenceChance = Math.max(0, (heirAge - 10) * 0.15); // 0% at 10, 75% at 15, 100% at 17+
  
  if (Math.random() > influenceChance) return choices;
  
  // Add heir-specific choice modifier based on trait
  let heirChoice = null;
  
  switch(trait) {
    case 'diplomatic':
      if (Math.random() < 0.4) {
        heirChoice = `Send ${gs.heirName} to negotiate — ${gs.hp.sub} has a gift for finding common ground.`;
      }
      break;
    case 'reckless':
      if (Math.random() < 0.4) {
        heirChoice = `Let ${gs.heirName} take the risk — ${gs.hp.cap} learns best from consequences.`;
      }
      break;
    case 'cautious':
      if (Math.random() < 0.4) {
        heirChoice = `Have ${gs.heirName} review the matter first — ${gs.hp.sub} sees risks you might miss.`;
      }
      break;
    case 'greedy':
      if (Math.random() < 0.4) {
        heirChoice = `Ask ${gs.heirName} to find the profit angle — ${gs.hp.sub} has an eye for opportunity.`;
      }
      break;
    case 'scholarly':
      if (Math.random() < 0.4) {
        heirChoice = `Task ${gs.heirName} with research — ${gs.hp.sub} will find the pattern in the details.`;
      }
      break;
    case 'proud':
      if (Math.random() < 0.4) {
        heirChoice = `Let ${gs.heirName} handle this — the name ${gs.hp.sub} carries demands respect.`;
      }
      break;
    case 'suspicious':
      if (Math.random() < 0.4) {
        heirChoice = `Have ${gs.heirName} investigate — ${gs.hp.sub} trusts nothing, which means ${gs.hp.sub} sees everything.`;
      }
      break;
    case 'romantic':
      if (Math.random() < 0.4) {
        heirChoice = `Send ${gs.heirName} — ${gs.hp.cap} believes in people, and people respond to that.`;
      }
      break;
  }
  
  // Add heir choice if generated (replace last choice to maintain 3 choices)
  if (heirChoice && choices.length > 0) {
    choices = [...choices.slice(0, -1), heirChoice];
  }
  
  return choices;
}


function checkAndShowRoutes() {
  // Venture triggers at year 5, then every 7 years, if not yet used this generation
  const ventureStartYear = (gs.heirTrait && gs.heirTrait.key === 'reckless') ? 4 : 5;
  if (!gs.ventureUsed && gs.turn >= ventureStartYear && (gs.turn - ventureStartYear) % 7 === 0) {
    gs.ventureAvailable = true;
    updateStatusBar();
    showVenture();
  } else {
    showRoutesEvent();
  }
}

// ══════════════════════════════════════════════════════════
//  SHOW EVENTS
// ══════════════════════════════════════════════════════════
async function showHouseEvent() {
  gs.phase = 'house';
  updateStatusBar();
  // Show loading while AI generates the situation
  document.getElementById('loading-msg').textContent = rand(EVENT_GEN_MSGS);
  showPanel('loading-panel');
  try {
    const ev = await generateEvent('house');
    if (!ev) throw new Error('No event generated');
    gs.currentEvent = ev;
    document.getElementById('event-phase-lbl').innerHTML = '<span class="glyph glyph-sword" style="font-size:.9em;">⚔</span> &nbsp; From the House &nbsp; <span class="glyph glyph-sword" style="font-size:.9em;">⚔</span>';
    document.getElementById('event-text').textContent = ev.text;
    renderChoices('choices-container', ev.choices, false);
    showPanel('panel-event');
    window.scrollTo({ top:0, behavior:'smooth' });
  } catch(err) {
    showError(err);
    // Fallback: generate minimal placeholder event
    gs.currentEvent = createFallbackEvent('house');
    document.getElementById('event-text').textContent = gs.currentEvent.text;
    renderChoices('choices-container', gs.currentEvent.choices, false);
    showPanel('panel-event');
  }
}

async function showRoutesEvent() {
  gs.phase = 'routes';
  updateStatusBar();
  document.getElementById('loading-msg').textContent = rand(EVENT_GEN_MSGS);
  showPanel('loading-panel');
  try {
    const ev = await generateEvent('routes');
    if (!ev) throw new Error('No event generated');
    gs.currentEvent = ev;
    document.getElementById('event-phase-lbl').innerHTML = '<span class="glyph glyph-anchor" style="font-size:.9em;">⚓</span> &nbsp; From the Routes &nbsp; <span class="glyph glyph-anchor" style="font-size:.9em;">⚓</span>';
    document.getElementById('event-text').textContent = ev.text;
    renderChoices('choices-container', ev.choices, false);
    
    // Add port selector after choices
    const portContainer = document.createElement('div');
    portContainer.id = 'routes-port-selector';
    portContainer.style.cssText = 'margin-top:1.5rem;padding:1rem;border:1px solid #3a2c18;border-radius:3px;background:rgba(26,20,8,.3);';
    portContainer.innerHTML = `
      <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.1em;color:#a08848;text-transform:uppercase;margin-bottom:.5rem;">Where does your ship sail this turn?</div>
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
        ${Object.keys(PORTS).map(port => `
          <button 
            class="port-btn ${gs.currentPort === port ? 'active' : ''}" 
            onclick="selectPort('${port}')"
            data-testid="routes-port-${port.toLowerCase()}"
          >
            ${port}
          </button>
        `).join('')}
      </div>
      <p style="font-family:'IM Fell English',serif;font-style:italic;font-size:.75rem;color:#7a6840;margin-top:.5rem;">
        ${PORTS[gs.currentPort || 'Verantia'].description}
      </p>
    `;
    
    const choicesContainer = document.getElementById('choices-container');
    if (choicesContainer && !document.getElementById('routes-port-selector')) {
      choicesContainer.parentNode.insertBefore(portContainer, choicesContainer.nextSibling);
    }
    
    showPanel('panel-event');
    window.scrollTo({ top:0, behavior:'smooth' });
  } catch(err) {
    showError(err);
    gs.currentEvent = createFallbackEvent('routes');
    document.getElementById('event-text').textContent = gs.currentEvent.text;
    renderChoices('choices-container', gs.currentEvent.choices, false);
    showPanel('panel-event');
  }
}

function pickVentureSeed() {
  const seeds = SITUATION_SEEDS.ventures;
  const avail = seeds.filter(s => !gs.usedVentures.has(s.id));
  const pool  = avail.length > 0 ? avail : seeds;
  const chosen = rand(pool);
  gs.usedVentures.add(chosen.id);
  return chosen;
}

async function showVenture() {
  document.getElementById('loading-msg').textContent = rand(EVENT_GEN_MSGS);
  showPanel('loading-panel');
  try {
    const seed = pickVentureSeed();
    const recentHistory = gs.ledger.slice(0, 4)
      .map(l => `[Year ${l.year} · ${l.phase}] ${l.entry}`).join('\n') || 'No entries yet.';

    const userMsg =
`GENERATE A GRAND VENTURE SITUATION.

HOUSE: ${gs.dynastyName} · ${gs.founderName} · Gen ${gs.generation||1} · Year ${gs.turn}
Treasury: ${gs.marks} mk · Reputation: ${gs.reputation}/10 · Ships: ${gs.ships}

LEDGER (last 4 entries):
${recentHistory}

VENTURE TYPE: ${seed.type}
VENTURE HINT: ${seed.hint}

SPECIAL INSTRUCTIONS FOR VENTURES:
— Generational stakes. Something may be permanently lost.
— The Oregon Trail mechanic is visible — things don't all go to plan.
— Darker language. The sea here is specific, not metaphorical.
— 3 choices that represent genuinely different gambles, not just risk levels.
— marks_delta for the outcome AI should be +/- 300-700 mk.
— repChoice: include a venture-specific repChoice for Legendary standing if rep >= ${gs.reputation >= 9 ? '9 (yes, include)' : '9 (no, omit — current rep too low)'}.`;

    const parsed = await callLLM(EVENT_GEN_PROMPT, userMsg, {
      json: true, temperature: 0.95, maxTokens: 600, noThink: true
    });

    const situation = (parsed.situation || '').trim();
    let choices = Array.isArray(parsed.choices) ? parsed.choices.filter(c => c && c.trim()) : [];
    
    // Handle case where model returns JSON objects inside choices
    choices = choices.map(c => {
      if (typeof c === 'object' && c.choice) {
        return c.choice;
      }
      return c;
    });
    
    while (choices.length < 3) choices.push('Wait for better conditions.');
    choices = choices.slice(0, 3);
    
    // Apply heir influence to venture choices too
    choices = applyHeirInfluence(choices, 'venture_' + seed.id);

    const ev = { id: seed.id, text: situation, choices,
      repChoice: (gs.reputation >= REP_THRESHOLDS.LEGENDARY && parsed.repChoice) ? parsed.repChoice : null,
      _generated: true };
    gs.currentEvent = ev;

    document.getElementById('venture-text').textContent = ev.text;
    renderChoices('venture-choices', ev.choices, true);
    showPanel('panel-venture');
    window.scrollTo({ top:0, behavior:'smooth' });
  } catch(err) {
    showError(err);
    gs.currentEvent = createFallbackEvent('venture');
    document.getElementById('venture-text').textContent = gs.currentEvent.text;
    renderChoices('venture-choices', gs.currentEvent.choices, true);
    showPanel('panel-venture');
  }
}

function showYearEnd() {
  document.getElementById('ye-note').textContent = rand(YEAR_END_NOTES);

  const nextAge = gs.heirAge + 1;
  const { sub:hs, obj:ho, pos:hp2, cap:hc } = gs.hp;
  const heirNotes = [
    `${gs.heirName} is ${gs.heirAge}. ${gs.heirAge < 10 ? `Watching everything. ${hc} has not yet decided what to do with what ${hs} sees.` : gs.heirAge < 16 ? `Old enough to ask questions. Not all of them welcome.` : gs.heirAge < 22 ? `Old enough to act. ${hc} is waiting to see if you will stop ${ho}.` : `Old enough that the house will be ${hp2} before either of you is comfortable with that.`}`,
    `${gs.heirName}, ${gs.heirAge}, has been watching the captains come and go. ${gs.heirTrait.label.toLowerCase()} is the word Pell uses when asked. ${hc} does not know Pell uses it.`,
    `The ledger will belong to ${gs.heirName} in some number of years that neither of you has been comfortable calculating. ${hc} is ${gs.heirAge}. The number is not improving.`,
    `${gs.heirName} asked about the moneylender this week. You did not answer. ${hc} did not ask again, which is either respect or ${hp2} own calculation. With a ${gs.heirTrait.label.toLowerCase()} heir, the difference is not always clear.`,
  ];
  document.getElementById('ye-heir').textContent = rand(heirNotes);

  // ── SUSPICIOUS heir warning ─────────────────────────
  const suspEl = document.getElementById('ye-suspicious');
  if (suspEl) {
    if (gs.heirTrait && gs.heirTrait.key === 'suspicious' && gs.reputation === 4) {
      suspEl.textContent = 'Pell mentions, without being asked, that the house is one difficult season from precarious standing. He mentions it the way he mentions things he would prefer you had noticed yourself.';
      suspEl.style.display = 'block';
    } else {
      suspEl.style.display = 'none';
    }
  }
  // ─────────────────────────────────────────────────────

  // ── Fix E: year-end settlement display ──
  const settleEl = document.getElementById('ye-settlement');
  if (gs._yearIncome !== undefined) {
    const repLabel = getRepLabel(gs.reputation);
    const shipWord = gs.ships === 1 ? 'vessel' : 'ships';
    const net = gs._yearIncome || 0;
    const netStr = net >= 0 ? `+${net} mk net` : `${net} mk net`;
    const season = net >= gs.ships * 15 ? 'a productive season'
      : net >= 0 ? 'a thin season' : 'running at a loss';
    settleEl.textContent = `⚓ ${gs.ships} ${shipWord} · ${netStr} · ${repLabel} · ${season}`;
    settleEl.style.display = 'block';
    const settleVerbs = [
      `The routes settled at ${gs._yearIncome} marks. ${gs.ships} ${gs.ships===1?'vessel':'ships'} home. Casso recorded the accounts without comment, which with Casso is a form of praise.`,
      `End of season: ${gs._yearIncome} marks from ${gs.ships} ${gs.ships===1?'vessel':'ships'}. The ledger accepts this without judgment.`,
      `${gs.ships} ${gs.ships===1?'vessel':'ships'} in harbour. ${gs._yearIncome} marks cleared. The sea gave back what it owed this season.`,
      `Routes closed. ${gs._yearIncome} marks. ${gs.ships} ${gs.ships===1?'ship':'ships'} in. The Caldera had no particular opinion this year.`,
    ];
    gs.ledger.unshift({ year: gs.turn, phase: 'Settlement', entry: rand(settleVerbs) });
    updateLedgerHistory();
  } else {
    settleEl.style.display = 'none';
  }
  // ─────────────────────────────────────────────────────────

  // ── Open threads display ────────────────────────────
  const threadsEl = document.getElementById('ye-threads');
  if (threadsEl) {
    let thtml = '';
    
    // Show resolved threads this year
    if (gs._threadsResolvedThisYear && gs._threadsResolvedThisYear.length > 0) {
      thtml += '<div class="finance-section-title" style="color:#5a8030;">✓ Threads Resolved This Year</div>';
      gs._threadsResolvedThisYear.forEach(r => {
        thtml += `<div style="font-family:'IM Fell English',serif;font-style:italic;font-size:.76rem;color:#6a9838;margin:.2rem 0 .1rem;">— ${r.label}</div>`;
      });
      thtml += '<div style="height:1px;background:#2a1e0e;margin:.8rem 0;"></div>';
      // Clear for next year
      gs._threadsResolvedThisYear = [];
    }
    
    // Show open threads
    const alive = (gs.threads||[]).filter(t => gs.turn >= t.year);
    if (alive.length > 0) {
      thtml += '<div class="finance-section-title" style="color:#7a6040;">⟳ Open Threads — Unfinished Business</div>';
      alive.forEach(t => {
        const age = gs.turn - t.year;
        const ageStr = age === 0 ? 'this year' : age === 1 ? 'one year open' : `${age} years open`;
        thtml += `<div style="font-family:'IM Fell English',serif;font-style:italic;font-size:.76rem;color:#9a8040;margin:.2rem 0 .1rem;">— ${t.label}</div>`
               + `<div style="font-family:'IM Fell English SC',serif;font-size:.56rem;letter-spacing:.1em;color:#5a4820;margin-bottom:.35rem;">${ageStr}</div>`;
      });
    }
    
    if (thtml) {
      threadsEl.innerHTML = thtml;
      threadsEl.style.display = 'block';
    } else {
      threadsEl.style.display = 'none';
    }
  }
  // ────────────────────────────────────────────────────

  // ── Ship market + finance panel ─────────────────────
  rollShipMarket();
  showYearEndFinance();
  // ── Refresh background at year-end ──────────────────
  if (typeof updateBackground === 'function') updateBackground();
  // ─────────────────────────────────────────────────────

  const btn = document.getElementById('yearend-btn');
  btn.textContent = (gs.age + 1) >= 64 ? 'The End Approaches →' : 'Turn the Page →';

  showPanel('panel-yearend');
  window.scrollTo({ top:0, behavior:'smooth' });
}
