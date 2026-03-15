// ══════════════════════════════════════════════════════════
//  DYNAMIC BACKGROUND
// ══════════════════════════════════════════════════════════
function updateBackground() {
  const el = document.getElementById('bg-image');
  if (!el) return;

  // Check for custom background preference
  const customBg = localStorage.getItem('hot_custom_bg');
  if (customBg && customBg !== 'dynamic') {
    el.style.backgroundImage = `url(${customBg})`;
    return;
  }

  // Build a context-appropriate search keyword
  const rep = gs.reputation || 5;
  const marks = gs.marks || 0;
  const ships = gs.ships || 1;

  let keyword;
  if (rep >= 9)          keyword = 'venice,palazzo,grand,renaissance';
  else if (rep >= 7)     keyword = 'venice,merchant,harbor,renaissance';
  else if (marks < 400)  keyword = 'harbor,storm,abandoned,medieval';
  else if (ships >= 3)   keyword = 'harbor,fleet,sailing,ships,renaissance';
  else if (gs.phase === 'house') keyword = 'palazzo,courtyard,archway,medieval';
  else                   keyword = 'port,dock,fishing,boats,renaissance';

  // LoremFlickr — free, no API key required, supports keywords
  // Random image on each game start (no lock= parameter for true randomness)
  // Exclude cats with ~cats operator
  let randomSeed = sessionStorage.getItem('bg_seed');
  if (!randomSeed) {
    randomSeed = Math.random().toString(36).substr(2, 9);
    sessionStorage.setItem('bg_seed', randomSeed);
  }
  // Add version cache-buster and timestamp to force new image on app update and each session
  const version = typeof APP_VERSION !== 'undefined' ? APP_VERSION : 'v1';
  const url = `https://loremflickr.com/1600/900/${encodeURIComponent(keyword)}~cats?random=${randomSeed}&v=${version}&t=${Date.now()}`;
  el.style.backgroundImage = `url(${url})`;
}

function setCustomBackground(url) {
  if (!url) {
    localStorage.removeItem('hot_custom_bg');
  } else {
    localStorage.setItem('hot_custom_bg', url);
  }
  updateBackground();
}

// ══════════════════════════════════════════════════════════
//  START GAME
// ══════════════════════════════════════════════════════════
function startGame() {
  const dynasty = document.getElementById('input-dynasty').value.trim();
  const founder = document.getElementById('input-founder').value.trim();
  if (!dynasty || !founder) return;

  const traitKeys = Object.keys(HEIR_TRAITS);
  const traitKey  = rand(traitKeys);
  const female    = Math.random() > 0.5;
  const heirName  = female ? rand(HEIR_FEMALE) : rand(HEIR_MALE);

  const hp = female
    ? { sub:'she', obj:'her', pos:'her', cap:'She' }
    : { sub:'he',  obj:'him', pos:'his', cap:'He'  };

  gs = {
    dynastyName:dynasty, founderName:founder, heirName, heirFemale:female, hp,
    heirTrait:{key:traitKey,...HEIR_TRAITS[traitKey]},
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
    cargoBasis: { saltfish:0, wine:0, alum:0, tin:0 },
    allies: [],  // Named NPCs generated at game start
    buildings: {},  // Owned buildings
    marketPrices: null,
    rivals:{
      borracchi:{ relationship:0, lastInteraction:0, notes:[] },
      spinetta: { relationship:0, lastInteraction:0, notes:[] },
      calmari:  { relationship:0, lastInteraction:0, notes:[] },
      liyuen:   { relationship:0, lastInteraction:0, notes:[] },
    },
  };

  updateStatusBar();
  updateBackground();
  document.getElementById('dynasty-label').textContent = `House ${gs.dynastyName} — ${gs.founderName}`;
  updateRivalTooltip();
  
  // Generate named allies (Casso, Pell, +1 random)
  generateAllies();
  renderAlliesDisplay();
  
  // Show onboarding first
  onboardPage = 0;
  renderOnboard();
  showScreen('screen-onboard');
}


// ══════════════════════════════════════════════════════════
//  BUILDING SYSTEM — Tangible Legacy (Paravia inspiration)
// ══════════════════════════════════════════════════════════
// Buildings make dynasty tangible, not abstract.
// "The warehouse your founder built still stands."
// ══════════════════════════════════════════════════════════

const BUILDINGS = {
  warehouse: {
    id: 'warehouse',
    name: 'Warehouse',
    cost: 400,
    description: 'Eastern wing storage — +20% cargo capacity',
    effect: 'cargo_capacity_bonus',
    value: 0.20,
    icon: '🏛️'
  },
  guild_seat: {
    id: 'guild_seat',
    name: 'Guild Seat',
    cost: 800,
    description: 'Factors Guild — +1 rep/year, bank rates -2%',
    effect: 'reputation_bonus',
    value: 1,
    icon: '🏛️'
  },
  shipyard: {
    id: 'shipyard',
    name: 'Shipyard',
    cost: 1200,
    description: 'Masso berth — ships cost -10%',
    effect: 'ship_cost_bonus',
    value: 0.10,
    icon: '⚓'
  },
  palazzo_wing: {
    id: 'palazzo_wing',
    name: 'Palazzo Wing',
    cost: 600,
    description: 'West wing — heir education +2 years',
    effect: 'heir_education_bonus',
    value: 2,
    icon: '🏰'
  },
  counting_house: {
    id: 'counting_house',
    name: 'Counting House',
    cost: 500,
    description: 'Ledger offices — passive income +10%',
    effect: 'income_bonus',
    value: 0.10,
    icon: '📊'
  },
  safehouse: {
    id: 'safehouse',
    name: 'Safehouse',
    cost: 350,
    description: 'Secret refuge — mortality risk -20%',
    effect: 'mortality_reduction',
    value: 0.20,
    icon: '🏠'
  }
};

function purchaseBuilding(buildingId) {
  const building = BUILDINGS[buildingId];
  if (!building) return false;
  
  // Check if already owned
  if (gs.buildings && gs.buildings[buildingId]) {
    return false;
  }
  
  // Check affordability
  if (gs.marks < building.cost) {
    return false;
  }
  
  // Purchase
  gs.marks -= building.cost;
  
  if (!gs.buildings) gs.buildings = {};
  gs.buildings[buildingId] = {
    purchased: gs.turn,
    founder: gs.founderName,
    generation: gs.generation
  };
  
  // Record in ledger
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Building',
    entry: `${building.name} commissioned — ${building.cost} marks. ${building.description}. Built by ${gs.founderName}.`
  });
  
  updateStatusBar();
  renderBuildingsDisplay();
  autoSave();
  
  return true;
}

function getBuildingEffect(buildingId) {
  if (!gs.buildings || !gs.buildings[buildingId]) return 0;
  const building = BUILDINGS[buildingId];
  return building ? building.value : 0;
}

function getTotalBuildingEffect(effectType) {
  if (!gs.buildings) return 0;
  
  let total = 0;
  for (const buildingId in gs.buildings) {
    const building = BUILDINGS[buildingId];
    if (building && building.effect === effectType) {
      total += building.value;
    }
  }
  return total;
}

function renderBuildingsDisplay() {
  const display = document.getElementById('buildings-display');
  if (!display) return;
  
  if (!gs.buildings || Object.keys(gs.buildings).length === 0) {
    display.style.display = 'none';
    return;
  }
  
  display.style.display = 'flex';
  display.innerHTML = Object.keys(gs.buildings).map(id => {
    const building = BUILDINGS[id];
    const purchaseInfo = gs.buildings[id];
    return `
      <span class="building-badge" data-testid="building-badge-${id}" title="${building.name} (Gen ${purchaseInfo.generation})">
        <span class="building-icon">${building.icon}</span>
        <span class="building-name">${building.name}</span>
        <span class="building-founder">by ${purchaseInfo.founder}</span>
      </span>
    `;
  }).join('');
}

function getBuildingsSummary() {
  if (!gs.buildings || Object.keys(gs.buildings).length === 0) return 'No buildings';
  return Object.keys(gs.buildings).map(id => {
    const building = BUILDINGS[id];
    const info = gs.buildings[id];
    return `${building.name} (Gen ${info.generation}, by ${info.founder})`;
  }).join('; ');
}

// ══════════════════════════════════════════════════════════
//  MORTALITY EVENTS — AI Generated (Oregon Trail tension)
// ══════════════════════════════════════════════════════════
// The AI is the Dungeon Master. Mortality events are narrated,
// not hardcoded. Events build on allies, rivals, and history.
// ══════════════════════════════════════════════════════════

var MORTALITY_EVENT_PROMPT = `CRITICAL: You are the dungeon master of HOUSE OF TIDE. Generate a mortality event OR return null.

CURRENT STATE:
- Age: {{age}} (dies naturally at 65)
- Reputation: {{reputation}}/10 ({{tier}})
- Treasury: {{marks}} mk
- Ships: {{ships}}
- Allies: {{allies}}
- Rivals: {{rivals}}
- Open Threads: {{threads}}
- Recent Ledger: {{ledger}}

YOUR TASK:
Generate a mortality event that could kill the founder this turn. The event should:
1. Reflect the current state (age, reputation, allies, rivals, threads)
2. Feel like a natural consequence of the world, not random misfortune
3. Use the Junior Gothic register: present tense, second person, cold observation
4. Provide 3 choices with different survival chances, costs, and consequences

MORTALITY TYPE GUIDELINES (suggest, don't mandate):
- Low reputation → assassination, poisoning, "accidents"
- Hostile rivals → targeted attacks, sabotage
- High age → fever, natural causes, "the body fails"
- Many ships → shipwreck, maritime disaster
- No allies → vulnerable, alone
- Strong allies → protection, warning

CHOICE STRUCTURE:
Each choice should have:
- text: What the player does (1 sentence, action-oriented)
- survival: 0.3 to 0.95 (30%-95% survival chance)
- cost: marks spent (0-400)
- repCost: reputation change (-2 to +1)

RESPONSE FORMAT (JSON ONLY — NO MARKDOWN, NO EXPLANATION):
{
  "event": null | {
    "type": "fever|assassination|shipwreck|poison|accident|custom",
    "icon": "🏥🗡️⛈️🍷🏗️💀⚰️🔥",
    "text": "2-4 word event title",
    "narrative": "2-4 sentences in Junior Gothic register. Present tense. Second person. End on a fact.",
    "choices": [
      { "text": "Choice 1", "survival": 0.85, "cost": 200, "repCost": 0 },
      { "text": "Choice 2", "survival": 0.55, "cost": 0, "repCost": -1 },
      { "text": "Choice 3", "survival": 0.30, "cost": 0, "repCost": 0 }
    ]
  }
}`;

function checkMortalityEvent() {
  // Base 5% chance per turn
  let chance = 0.05;
  
  // Increase for low reputation
  if (gs.reputation <= 2) chance += 0.10;
  else if (gs.reputation <= 4) chance += 0.05;
  
  // Increase for hostile rivals
  const hostileRivals = Object.values(gs.rivals).filter(r => r.relationship < -2).length;
  chance += hostileRivals * 0.03;
  
  // Increase for old age
  if (gs.age >= 55) chance += 0.05;
  if (gs.age >= 60) chance += 0.10;
  
  // Decrease for strong allies (they protect you)
  if (gs.allies && gs.allies.length > 0) {
    const strongAllies = gs.allies.filter(a => a.bond >= 8 && a.status === 'active').length;
    chance -= strongAllies * 0.02;
  }
  
  // Ensure chance stays in bounds
  chance = Math.max(0.01, Math.min(0.50, chance));
  
  if (Math.random() > chance) return null;
  
  // Generate event via AI
  return generateMortalityEventAI();
}

function generateMortalityEventAI() {
  try {
    // Build prompt with current game state
    var prompt = MORTALITY_EVENT_PROMPT
      .replace('{{age}}', gs.age)
      .replace('{{reputation}}', gs.reputation)
      .replace('{{tier}}', getRepTier(gs.reputation))
      .replace('{{marks}}', gs.marks)
      .replace('{{ships}}', gs.ships)
      .replace('{{allies}}', getAllySummary())
      .replace('{{rivals}}', getRivalSummary())
      .replace('{{threads}}', getThreadSummary())
      .replace('{{ledger}}', getRecentLedgerSummary());
    
    // Call AI to generate event
    var result = callLLM(MORTALITY_EVENT_PROMPT, prompt, { json: true, noThink: true });
    return result;
  } catch(e) {
    // AI call failed — fallback to simple hardcoded event
    console.log('Mortality event AI failed, using fallback:', e);
    return getFallbackMortalityEvent();
  }
}

function getFallbackMortalityEvent() {
  // Simple fallback if AI fails
  const fallbacks = [
    {
      type: 'fever',
      icon: '🏥',
      text: 'The fever came in the night.',
      narrative: 'Your head burns. The ledger swims before your eyes. The physician speaks of humours. You know only that you are dying.',
      choices: [
        { text: 'Pay for the best treatment', survival: 0.85, cost: 200, repCost: 0 },
        { text: 'Rest and pray', survival: 0.55, cost: 0, repCost: -1 },
        { text: 'Continue working', survival: 0.30, cost: 0, repCost: 0 }
      ]
    }
  ];
  return { event: fallbacks[0] };
}

function getRecentLedgerSummary() {
  if (!gs.ledger || gs.ledger.length === 0) return 'No recent entries.';
  return gs.ledger.slice(0, 3).map(function(e) { return e.entry; }).join('; ');
}

function showMortalityEvent(event) {
  // Hide other panels
  document.getElementById('panel-event').style.display = 'none';
  document.getElementById('panel-venture').style.display = 'none';
  document.getElementById('panel-trading').style.display = 'none';
  document.getElementById('panel-result').style.display = 'none';
  
  // Show mortality event
  const panel = document.getElementById('panel-mortality');
  if (!panel) return;
  
  panel.style.display = 'block';
  panel.className = 'panel fade-in';
  
  // Set event content
  document.getElementById('mortality-icon').textContent = event.icon;
  document.getElementById('mortality-text').textContent = event.text;
  document.getElementById('mortality-narrative').textContent = event.narrative;
  
  // Render choices
  const choicesContainer = document.getElementById('mortality-choices');
  choicesContainer.innerHTML = event.choices.map((choice, i) => `
    <button class="choice-btn" data-testid="mortality-choice-${i}" onclick="resolveMortalityChoice(${i})">
      ${choice.text}
      <span class="choice-hint">
        ${choice.survival * 100}% survival
        ${choice.cost ? ' | -' + choice.cost + ' mk' : ''}
        ${choice.reward ? ' | +' + choice.reward + ' mk' : ''}
      </span>
    </button>
  `).join('');
  
  // Store current event for resolution
  window._currentMortalityEvent = event;
}

function resolveMortalityChoice(choiceIndex) {
  const event = window._currentMortalityEvent;
  if (!event) return;
  
  const choice = event.choices[choiceIndex];
  
  // Apply cost/reward
  if (choice.cost) {
    gs.marks = Math.max(0, gs.marks - choice.cost);
  }
  if (choice.reward) {
    gs.marks += choice.reward;
  }
  
  // Apply reputation change
  if (choice.repCost) {
    gs.reputation = Math.max(0, gs.reputation + choice.repCost);
  }
  
  // Roll for survival
  const survivalRoll = Math.random();
  const survived = survivalRoll <= choice.survival;
  
  if (!survived) {
    // Founder died
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Death',
      entry: `Died at age ${gs.age}. Cause: ${event.id}. The ledger notes: ${gs.generation} generation${gs.generation > 1 ? 's' : ''} of ${gs.dynastyName}.`
    });
    showDeathScreen('mortality');
  } else {
    // Survived
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Survival',
      entry: `Survived ${event.id}. ${choice.survival < 0.7 ? 'Close.' : 'The ledger notes the event without comment.'}`
    });
    
    // Show result panel
    document.getElementById('panel-mortality').style.display = 'none';
    document.getElementById('panel-result').style.display = 'block';
    
    document.getElementById('narrative-block').innerHTML = `
      <p class="narrative-para">You survived. The fever broke, or the assassin failed, or the rocks spared you. The ledger records the event. The ledger does not say whether this was mercy.</p>
    `;
    
    document.getElementById('ledger-entry').textContent = 'Survived: ' + event.text;
    document.getElementById('deltas').innerHTML = `
      <span style="color: ${choice.repCost < 0 ? '#c84030' : choice.repCost > 0 ? '#6a9838' : '#7a6840'}">
        ${choice.repCost < 0 ? 'Reputation -' + Math.abs(choice.repCost) : choice.repCost > 0 ? 'Reputation +' + choice.repCost : 'No reputation change'}
      </span>
      ${choice.cost ? '<span style="color:#c84030"> | -' + choice.cost + ' mk</span>' : ''}
      ${choice.reward ? '<span style="color:#6a9838"> | +' + choice.reward + ' mk</span>' : ''}
    `;
    
    // Update UI
    updateStatusBar();
    renderAlliesDisplay();
  }
  
  // Clear stored event
  window._currentMortalityEvent = null;
}

// ══════════════════════════════════════════════════════════
//  ALLIES SYSTEM — Named NPCs
// ══════════════════════════════════════════════════════════

const ALLY_ROLES = [
  { name: 'Casso', role: 'Senior Captain', canDie: true, baseBond: 7 },
  { name: 'Pell', role: 'Archivist', canDie: false, baseBond: 9 },
  { name: 'Tucci', role: 'Harbourmaster', canDie: true, baseBond: 5 },
  { name: 'Vanzetti', role: 'Guild Secretary', canDie: true, baseBond: 4 },
  { name: 'Greve', role: 'Notary', canDie: false, baseBond: 6 },
  { name: 'Albinosi', role: 'Commissioner', canDie: true, baseBond: 5 },
  { name: 'Li Yuen', role: 'Network Broker', canDie: true, baseBond: 3 },
  { name: 'Rinaldo', role: 'Borracchi Factor', canDie: true, baseBond: 4 },
];

function generateAllies() {
  // Always include Casso, Pell, and one random third ally
  const fixedAllies = ALLY_ROLES.filter(a => a.name === 'Casso' || a.name === 'Pell');
  const randomAllies = ALLY_ROLES.filter(a => a.name !== 'Casso' && a.name !== 'Pell');
  const thirdAlly = randomAllies[Math.floor(Math.random() * randomAllies.length)];
  
  gs.allies = [...fixedAllies, thirdAlly].map(ally => ({
    name: ally.name,
    role: ally.role,
    bond: ally.baseBond + Math.floor(Math.random() * 2), // ±1 variance
    status: 'active', // active, dead, missing, betrayed
    canDie: ally.canDie,
    metYear: gs.turn,
    lastInteraction: null
  }));
}

function renderAlliesDisplay() {
  const display = document.getElementById('allies-display');
  if (!display) return;
  
  if (!gs.allies || gs.allies.length === 0) {
    display.style.display = 'none';
    return;
  }
  
  display.style.display = 'block';
  display.innerHTML = gs.allies.map(ally => `
    <span class="ally-badge" data-testid="ally-badge" title="${ally.role} (Bond: ${ally.bond}/10)">
      <span data-testid="ally-name">${ally.name}</span>
      <span data-testid="ally-role" class="ally-role">${ally.role}</span>
      <span data-testid="ally-bond" class="ally-bond">${'■'.repeat(Math.floor(ally.bond/2))}${'□'.repeat(5 - Math.floor(ally.bond/2))}</span>
      ${ally.status !== 'active' ? `<span data-testid="ally-status" class="ally-status ${ally.status}">${ally.status}</span>` : ''}
    </span>
  `).join('');
}

function updateAllyBond(name, delta) {
  const ally = gs.allies.find(a => a.name === name);
  if (!ally) return;
  
  ally.bond = Math.max(0, Math.min(10, ally.bond + delta));
  ally.lastInteraction = gs.turn;
  
  // Record in ledger
  if (delta > 0) {
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Allies',
      entry: `${name}'s bond strengthens. ${ally.role}: ${ally.bond}/10.`
    });
  } else if (delta < 0) {
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Allies',
      entry: `${name}'s bond weakens. ${ally.role}: ${ally.bond}/10.`
    });
  }
  
  renderAlliesDisplay();
}

function killAlly(name, cause) {
  const ally = gs.allies.find(a => a.name === name);
  if (!ally || !ally.canDie) return false;
  
  ally.status = 'dead';
  ally.deathYear = gs.turn;
  ally.deathCause = cause;
  
  // Record in ledger
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Death',
    entry: `${name} is dead. ${ally.role}. ${cause}. The ledger notes: ${ally.bond}/10 bond.`
  });
  
  renderAlliesDisplay();
  return true;
}

// ══════════════════════════════════════════════════════════
//  PHASE ENGINE
// ══════════════════════════════════════════════════════════
function beginPhase() {
  updateStatusBar();
  updateBackground(); // Update background when phase changes
  hideError();
  
  // Check for mortality event at start of house phase (5% base chance)
  if (gs.phase === 'house') {
    const mortalityEvent = checkMortalityEvent();
    if (mortalityEvent) {
      showMortalityEvent(mortalityEvent);
      return;
    }
  }
  
  if      (gs.phase === 'house')   showHouseEvent();
  else if (gs.phase === 'routes')  checkAndShowRoutes();
  else if (gs.phase === 'trading') showTradingPanel();
  else if (gs.phase === 'yearend') showYearEnd();
}

function advancePhase() {
  document.getElementById('panel-result').style.display = 'none';
  if (gs.phase === 'house') {
    gs.phase = 'routes';
    beginPhase();
  } else if (gs.phase === 'routes') {
    // Prefetch market event during routes phase (AI has time to generate)
    if (typeof prefetchMarketEvent === 'function') {
      prefetchMarketEvent();
    }
    gs.phase = 'trading';
    gs.marketPrices = null; // force fresh roll
    showTradingPanel();
  } else if (gs.phase === 'trading') {
    gs.phase = 'yearend';
    beginPhase();
  }
}

function beginYear() {
  gs.turn++;
  gs.age++;
  gs.heirAge++;
  gs.ventureAvailable = false;
  gs.phase = 'house';

  // ── Fix A: passive fleet income ──────────────────────────
  // Ships run routes year-round. Events are deviations, not the whole economy.
  // Gross trade income minus upkeep. Net is modest by design —
  // events are the primary economy. Passive trickle should not
  // make bankruptcy impossible.
  const repMod = gs.reputation >= REP_THRESHOLDS.LEGENDARY ? 1.65
              : gs.reputation >= REP_THRESHOLDS.RENOWNED ? 1.3
              : gs.reputation >= REP_THRESHOLDS.ESTABLISHED ? 1.0
              : gs.reputation >= REP_THRESHOLDS.PRECARIOUS ? 0.65
              : 0.40;
  const variance = 0.85 + Math.random() * 0.3;  // ±15%
  const baseRate = 85;   // gross per ship per year
  const upkeep   = 20;   // crew, berthing, maintenance per ship
  const greedyBonus = (gs.heirTrait && gs.heirTrait.key === 'greedy') ? 1.2 : 1.0;
  const gross = Math.round(gs.ships * baseRate * repMod * variance * greedyBonus);
  const cost  = gs.ships * upkeep;
  gs._yearGross  = gross;
  gs._upkeep     = cost;
  gs._yearIncome = gross - cost;   // can be negative at low rep
  gs.marks = Math.max(0, gs.marks + gs._yearIncome);
  // ─────────────────────────────────────────────────────────

  // ── Loan interest + shadow enforcement ──────────────
  applyLoanInterest();
  // ─────────────────────────────────────────────────────

  if (gs.age >= 65 || gs.marks <= 0 || gs.reputation <= 0 || gs.ships <= 0) {
    showDeathScreen(); return;
  }

  document.getElementById('panel-yearend').style.display = 'none';
  updateStatusBar();
  beginPhase();
  window.scrollTo({ top:0, behavior:'smooth' });
}


// ══════════════════════════════════════════════════════════
//  PRE-FETCH CACHE (speeds up Ollama / MLX responses)
// ══════════════════════════════════════════════════════════
let _prefetchStatus = {}; // { choiceText: 'pending' | 'complete' | 'failed' }
let _prefetchOutcomes = {}; // { choiceText: parsedResult }

function _buildChoiceUserMsg(choice, isVenture) {
  const recentHistory = gs.ledger.slice(0, 8)
    .map(l => `[Year ${l.year} · ${l.phase}] ${l.entry}`)
    .join('\n') || 'None yet — this is the founding.';
  const choiceHistory = (gs.history || []).slice(0, 6)
    .map(h => `[Yr ${h.year} · ${h.phase}] "${h.choice}"${h.outcome ? ' → '+h.outcome : ''}`)
    .join('\n') || 'No decisions recorded yet.';
  const pd = gs.decisions || {};
  const pdTotal = (pd.bold||0)+(pd.cautious||0)+(pd.political||0)+(pd.mercantile||0)+(pd.patient||0);
  const playerProfile = pdTotal > 0
    ? `Bold ${pd.bold||0} · Cautious ${pd.cautious||0} · Political ${pd.political||0} · Mercantile ${pd.mercantile||0} · Patient ${pd.patient||0}`
    : 'Pattern not yet established.';
  const ventureNote = isVenture
    ? '\n\nNOTE: This is a GRAND VENTURE. Generational stakes. Oregon Trail mechanics. Marks delta +/- 200 to 600.'
    : '';
  const activeThreads = (gs.threads || []).filter(t => t.year <= gs.turn);
  const threadContext = activeThreads.length > 0
    ? activeThreads.map(t => `— ${t.label} (Year ${t.year})`).join('\n')
    : 'None recorded.';
  const rivalContext = getRivalContext();
  const isDeferral = /\b(wait|nothing|see|later|defer|another|next|hold|observe|find out|watch|say nothing|not yet|another season)\b/i.test(choice);
  const actionType = isDeferral
    ? 'DEFERRAL — player chose to wait/observe/say nothing. Return resolve_thread: null.'
    : 'ENGAGEMENT — player took active action. If this relates to an open thread, you MUST return resolve_thread.';

  return `CURRENT STATE:
House ${gs.dynastyName} · ${gs.founderName} · Gen ${gs.generation||1} · Year ${gs.turn} · Age ${gs.age}
Treasury: ${gs.marks} mk · Reputation: ${gs.reputation}/10 · Ships: ${gs.ships}
Heir: ${gs.heirName} (${gs.heirAge}, ${gs.heirTrait.label}, ${gs.hp.sub}/${gs.hp.pos})
Phase: ${gs.phase === 'house' ? 'The House' : isVenture ? 'The Horizon — Grand Venture' : 'The Routes'}

LEDGER — LAST 8 ENTRIES (your session notes — use these):
${recentHistory}

DECISIONS MADE — LAST 6 (use for continuity; if people or situations recur, connect them):
${choiceHistory}

PLAYER CHARACTER PATTERN:
${playerProfile}

SITUATION: ${gs.currentEvent ? gs.currentEvent.text : ''}
CHOICE MADE: "${choice}"

If any entry in the ledger or decisions above connects to this situation — weave it in. The world remembers.

OPEN THREADS — things the player deferred, refused, or left unresolved (these should return):
${threadContext}

RIVAL FAMILY STANDINGS (persistent memory — CRITICAL: If a rival family appears in this event, you MUST reference your last interaction with them. Example: "Rinaldo approaches you again, still bitter about your refusal last year." or "The Borracchi remember your alliance and offer favourable terms."):
${rivalContext}

PLAYER ACTION TYPE: ${actionType}
${ventureNote}

Respond with JSON only.`;
}

function prefetchOutcomes(choices, isVenture) {
  // Only pre-fetch for local backends (saves cloud API costs)
  if (!CFG || (CFG.backend !== 'ollama' && CFG.backend !== 'mlx')) return;
  
  // Clear previous cache and mark all as pending
  _prefetchCache = {};
  _prefetchStatus = {};
  _prefetchOutcomes = {};
  
  const allChoices = [...choices];
  if (!isVenture && gs.currentEvent && gs.currentEvent.repChoice) {
    allChoices.push(gs.currentEvent.repChoice);
  }
  
  // Mark all as pending
  allChoices.forEach(c => {
    _prefetchStatus[c] = 'pending';
  });
  
  // Expose to window for UI access
  window._prefetchStatus = _prefetchStatus;
  
  // Update UI to show loading state
  if (typeof renderChoiceStatus === 'function') renderChoiceStatus();
  
  // Fetch all outcomes
  allChoices.forEach(c => {
    const userMsg = _buildChoiceUserMsg(c, isVenture);
    callLLM(SYSTEM_PROMPT, userMsg, { json:true, temperature:0.88, maxTokens:900, noThink:true })
      .then(parsed => { 
        _prefetchStatus[c] = 'complete';
        _prefetchOutcomes[c] = parsed;
        window._prefetchStatus = _prefetchStatus;
        if (typeof renderChoiceStatus === 'function') renderChoiceStatus();
      })
      .catch(() => {
        _prefetchStatus[c] = 'failed';
        window._prefetchStatus = _prefetchStatus;
        if (typeof renderChoiceStatus === 'function') renderChoiceStatus();
      }); // silent fail — makeChoice retries normally
  });
}

// ══════════════════════════════════════════════════════════
//  MAKE CHOICE (outcome resolution)
// ══════════════════════════════════════════════════════════
function seed_label_from_type(type) {
  const labels = {
    'borracchi':'Borracchi arrangement', 'spinetta':'Spinetta situation', 'calmari':'Calmari matter',
    'servant':'Servant — source unclear', 'navigator':'Navigator — suspicion unresolved',
    'saltfish':'Cargo discrepancy — uninvestigated', 'unsigned_letter':'Unsigned approach — source unknown',
    'pamphlet':'Pamphlet — author unknown', 'heir_marriage':'Heir marriage — deferred',
  };
  return labels[type] || `Open matter — ${type.replace(/_/g,' ')}`;
}

async function makeChoice(choice, isVenture) {
  document.querySelectorAll('.choice-btn').forEach(b => b.disabled = true);
  document.getElementById('loading-msg').textContent = rand(LOADING_MSGS);
  showPanel('loading-panel');

  // Last 8 ledger entries (DM session notes)
  const recentHistory = gs.ledger.slice(0, 8)
    .map(l => `[Year ${l.year} · ${l.phase}] ${l.entry}`)
    .join('\n') || 'None yet — this is the founding.';

  // Last 6 actual choices made (for continuity callbacks)
  const choiceHistory = (gs.history || []).slice(0, 6)
    .map(h => `[Yr ${h.year} · ${h.phase}] "${h.choice}"${h.outcome ? ' → '+h.outcome : ''}`)
    .join('\n') || 'No decisions recorded yet.';

  // Player character pattern
  const pd = gs.decisions || {};
  const pdTotal = (pd.bold||0)+(pd.cautious||0)+(pd.political||0)+(pd.mercantile||0)+(pd.patient||0);
  const playerProfile = pdTotal > 0
    ? `Bold ${pd.bold||0} · Cautious ${pd.cautious||0} · Political ${pd.political||0} · Mercantile ${pd.mercantile||0} · Patient ${pd.patient||0}`
    : 'Pattern not yet established.';

  const ventureNote = isVenture
    ? '\n\nNOTE: This is a GRAND VENTURE. Generational stakes. Oregon Trail mechanics. Things do not fully go to plan. Marks delta should be significant (+/- 200 to 600). Reputation can swing substantially.'
    : '';

  // Thread context for AI
  const activeThreads = (gs.threads || []).filter(t => t.year <= gs.turn);
  const threadContext = activeThreads.length > 0
    ? activeThreads.map(t => `— ${t.label} (Year ${t.year})`).join('\n')
    : 'None recorded.';

  // Rival context for AI
  const rivalContext = getRivalContext();

  // Classify choice as engagement or deferral (for thread resolution guidance)
  const isDeferral = /\b(wait|nothing|see|later|defer|another|next|hold|observe|find out|watch|say nothing|not yet|another season)\b/i.test(choice);
  const actionType = isDeferral
    ? 'DEFERRAL — player chose to wait/observe/say nothing. Return resolve_thread: null.'
    : 'ENGAGEMENT — player took active action. If this relates to an open thread, you MUST return resolve_thread.';

  const userMsg =
`CURRENT STATE:
House ${gs.dynastyName} · ${gs.founderName} · Gen ${gs.generation||1} · Year ${gs.turn} · Age ${gs.age}
Treasury: ${gs.marks} mk · Reputation: ${gs.reputation}/10 · Ships: ${gs.ships}
Heir: ${gs.heirName} (${gs.heirAge}, ${gs.heirTrait.label}, ${gs.hp.sub}/${gs.hp.pos})
Phase: ${gs.phase === 'house' ? 'The House' : isVenture ? 'The Horizon — Grand Venture' : 'The Routes'}

LEDGER — LAST 8 ENTRIES (your session notes — use these):
${recentHistory}

DECISIONS MADE — LAST 6 (use for continuity; if people or situations recur, connect them):
${choiceHistory}

PLAYER CHARACTER PATTERN:
${playerProfile}

SITUATION: ${gs.currentEvent.text}
CHOICE MADE: "${choice}"

If any entry in the ledger or decisions above connects to this situation — a person mentioned before, a deal that was made, a rival who was provoked — weave it in. The world remembers what happened.

OPEN THREADS — things the player deferred, refused, or left unresolved (these should return):
${threadContext}

RIVAL FAMILY STANDINGS (persistent memory — CRITICAL: If a rival family appears, reference your last interaction. Example: "Rinaldo remembers your refusal" or "The Borracchi honour your alliance"):
${rivalContext}

PLAYER ACTION TYPE: ${actionType}
${ventureNote}

Respond with JSON only.`;

  try {
    // Use pre-fetched result if available (local backends only)
    const _cached = _prefetchOutcomes[choice];
    if (_cached) delete _prefetchOutcomes[choice];
    const parsed = _cached || await callLLM(SYSTEM_PROMPT, userMsg, {
      json: true, temperature: 0.88, maxTokens: 900
    });

    // ── Score decision character ─────────────────────────────
    if (!gs.decisions) gs.decisions = { bold:0, cautious:0, political:0, mercantile:0, patient:0 };
    const cl = choice.toLowerCase();
    if (/\b(commission|dispatch|accept|send|buy|challenge|file|take the contract|commit|immediately|raise)\b/.test(cl)) gs.decisions.bold++;
    if (/\b(wait|decline|nothing|later|find out|observe|before|another season|not yet)\b/.test(cl)) gs.decisions.cautious++;
    if (/\b(negotiate|write|letter|council|alliance|publicly|formally|notary|signal|arrangement)\b/.test(cl)) gs.decisions.political++;
    if (/\b(fee|rate|price|marks|profit|contract|surplus|premium|margin|cost)\b/.test(cl)) gs.decisions.mercantile++;
    // Third option (index 2) tends toward the long-game view
    const choiceIdx = gs.currentEvent ? gs.currentEvent.choices.indexOf(choice) : -1;
    if (choiceIdx === 2) gs.decisions.patient++;
    // ─────────────────────────────────────────────────────────

    // ── Record choice to history for continuity ──────────────
    if (!gs.history) gs.history = [];
    gs.history.unshift({
      year:  gs.turn,
      phase: gs.phase === 'house' ? 'House' : isVenture ? 'Venture' : 'Routes',
      situation: gs.currentEvent ? gs.currentEvent.text.slice(0, 90) + '…' : '',
      choice: choice.slice(0, 120),
      outcome: '', // filled after AI responds, below
    });
    if (gs.history.length > 24) gs.history.length = 24;
    // ─────────────────────────────────────────────────────────

    const md = parseInt(parsed.marks_delta)      || 0;
    const rd = parseInt(parsed.reputation_delta) || 0;
    const sd = parseInt(parsed.ships_delta)      || 0;

    // ── Thread management ────────────────────────────────
    if (!gs.threads) gs.threads = [];
    const evId = gs.currentEvent ? gs.currentEvent.id : '';
    const choiceLower = choice.toLowerCase();

    // Auto-create thread from event's thread_hint (AI-generated events)
    if (gs.currentEvent._generated && gs.currentEvent.thread_hint) {
      const ttype = gs.currentEvent.thread_hint.trim().toLowerCase().replace(/\s+/g,'_');
      const deferWords = /\b(wait|nothing|see|again|let them|another|observe|later|defer|hold|say nothing|find out|watch)\b/i;
      if (deferWords.test(choiceLower) && !gs.threads.find(t => t.type === ttype)) {
        const label = `${seed_label_from_type(ttype)} — deferred`;
        gs.threads.push({ id:'th_hint_'+gs.turn, year:gs.turn, label, type:ttype, expiresYear:gs.turn+12 });
      }
    }

    // Auto-create thread from certain event/choice combinations
    // (fires regardless of whether AI also opens one)
    const autoThreadMap = {
      'h01': { matchWords: /\b(wait|nothing|see|again|let them|another|observe|later)\b/, label:'Borracchi marriage arrangement — deferred', type:'borracchi' },
      'h04': { matchWords: /\b(find out|buyer|information|wait|say nothing|reason)\b/, label:'Unsigned letter — warehouse buyer unidentified', type:'unsigned_letter' },
      'h07': { matchWords: /\b(watch|say nothing|find out|observe|dismiss|keep)\b/, label:'Servant talking — source and recipient uncertain', type:'servant' },
      'h10': { matchWords: /\b(ignore|find|say nothing|author)\b/, label:'Pamphlet — author and sponsor unresolved', type:'pamphlet' },
      'r10': { matchWords: /\b(say nothing|change|watch|observe)\b/, label:'Navigator log — second hand and recipient unknown', type:'navigator' },
      'r22': { matchWords: /\b(write off|say nothing|change|watch)\b/, label:'Missing salt fish cargo — loading discrepancy uninvestigated', type:'saltfish' },
      'h18': { matchWords: /\b(decline|watch|nothing)\b/, label:'Calmari granary investment — declined, outcome unobserved', type:'calmari' },
    };

    if (autoThreadMap[evId]) {
      const atm = autoThreadMap[evId];
      if (atm.matchWords.test(choiceLower)) {
        // Only create if no thread of this type already open
        if (!gs.threads.find(t => t.type === atm.type)) {
          gs.threads.push({ id:'th_'+gs.turn+'_'+evId, year:gs.turn, label:atm.label, type:atm.type, expiresYear: gs.turn+12 });
        }
      }
    }

    // AI-driven thread open
    if (parsed.open_thread && typeof parsed.open_thread === 'string' && parsed.open_thread.length > 3) {
      const newLabel = parsed.open_thread.slice(0, 80);
      // Guess type from keywords
      const ttype = /borracchi/i.test(newLabel) ? 'borracchi'
        : /spinetta/i.test(newLabel) ? 'spinetta'
        : /calmari/i.test(newLabel) ? 'calmari'
        : /salt.?fish|manifest|cargo/i.test(newLabel) ? 'saltfish'
        : /navigator|log|route/i.test(newLabel) ? 'navigator'
        : /servant|talking/i.test(newLabel) ? 'servant'
        : /letter|unsigned/i.test(newLabel) ? 'unsigned_letter'
        : /pamphlet/i.test(newLabel) ? 'pamphlet'
        : /marriage|heir.*arrange|arrange.*heir/i.test(newLabel) ? 'heir_marriage'
        : 'misc_'+gs.turn;
      // Avoid duplicates
      if (!gs.threads.find(t => t.label === newLabel)) {
        gs.threads.push({ id:'th_ai_'+gs.turn, year:gs.turn, label:newLabel, type:ttype, expiresYear: gs.turn+12 });
      }
    }

    // AI-driven thread resolve
    if (parsed.resolve_thread && typeof parsed.resolve_thread === 'string') {
      const frag = parsed.resolve_thread.toLowerCase();
      const before = gs.threads.length;
      // Try label match first, then type match as fallback
      gs.threads = gs.threads.filter(t =>
        !t.label.toLowerCase().includes(frag) && t.type !== frag.replace(/\s+/g,'_')
      );
      if (gs.threads.length < before) {
        const closedLabel = parsed.resolve_thread;
        const closedCount = before - gs.threads.length;
        gs.ledger.unshift({ year:gs.turn, phase:'Ledger', entry:`Thread closed: ${closedLabel}.` });
        showNotification(`⟳ Thread resolved: ${closedLabel}`);
        // Track for year-end summary
        if (!gs._threadsResolvedThisYear) gs._threadsResolvedThisYear = [];
        gs._threadsResolvedThisYear.push({ label: closedLabel, count: closedCount });
        debugLog('Thread resolution', closedLabel, `Removed ${closedCount} thread(s)`, false);
      } else {
        debugLog('Thread resolution', parsed.resolve_thread, 'No matching thread found — check fragment vs labels', true);
      }
    }

    // Expire old threads
    gs.threads = gs.threads.filter(t => {
      if (gs.turn > (t.expiresYear || gs.turn + 1)) {
        gs.ledger.unshift({ year:gs.turn, phase:'Ledger',
          entry: `${t.label.split('—')[0].trim()} — left too long without resolution. Some threads outlive the season that created them.` });
        return false;
      }
      return true;
    });
    // Cap at 8 open threads (oldest drop off first)
    if (gs.threads.length > 8) gs.threads = gs.threads.slice(-8);
    // ─────────────────────────────────────────────────────

    // ── Heir trait hooks ──────────────────────────────────
    // CAUTIOUS: soften one bad reputation event per generation
    let rdApplied = rd;
    if (rd < 0 && gs.heirTrait && gs.heirTrait.key === 'cautious' && !gs._cautiousSaved) {
      rdApplied = rd + 1; // soften by 1
      if (rdApplied < 0) { gs._cautiousSaved = true; } // only fires once per bad event
    }
    // PROUD: reputation floor at 1
    const repFloor = (gs.heirTrait && gs.heirTrait.key === 'proud') ? 1 : 0;
    // ─────────────────────────────────────────────────────

    gs.marks      = Math.max(0,  gs.marks + md);
    gs.reputation = Math.max(repFloor, Math.min(10, gs.reputation + rdApplied));
    gs.ships      = Math.max(0,  gs.ships + sd);

    // ROMANTIC: ship floor at 1, once per generation
    if (gs.ships === 0 && gs.heirTrait && gs.heirTrait.key === 'romantic' && !gs._romanticSaved) {
      gs.ships = 1;
      gs._romanticSaved = true;
      gs.ledger.unshift({ year: gs.turn, phase: 'Salvage',
        entry: 'The ship should have been lost. It was not. The crew are not discussing the reason.' });
    }
    if (isVenture) gs.ventureUsed = true;

    // Fill outcome in most-recent history entry
    if (gs.history && gs.history[0] && gs.history[0].year === gs.turn && !gs.history[0].outcome) {
      const netChange = (md||0) + (rd !== 0 ? ` rep${rd>0?'+':''}${rd}` : '');
      gs.history[0].outcome = `${md>0?'+':''}${md||0} mk${rd!==0?' rep'+(rd>0?'+':'')+rd:''}`;
    }

    gs.ledger.unshift({
      year:  gs.turn,
      phase: gs.phase === 'house' ? 'House' : isVenture ? 'Venture' : 'Routes',
      entry: parsed.ledger_entry || '—'
    });

    // ── Rival relationship tracking ───────────────────────
    detectAndUpdateRivals(choice, parsed.narrative || '');
    updateRivalTooltip();
    // ─────────────────────────────────────────────────────

    updateStatusBar();
    showResult(parsed, isVenture);
    updateLedgerHistory();

  } catch(err) {
    showError(err);
    showPanel(isVenture ? 'panel-venture' : 'panel-event');
    document.querySelectorAll('.choice-btn').forEach(b => b.disabled = false);
  }
}


// ══════════════════════════════════════════════════════════
//  ADVISOR — PELL THE ARCHIVIST
// ══════════════════════════════════════════════════════════
let advisorOpen = false;

function toggleAdvisor() {
  advisorOpen = !advisorOpen;
  const panel  = document.getElementById('advisor-panel');
  const toggle = document.getElementById('advisor-toggle');
  panel.classList.toggle('open', advisorOpen);
  toggle.classList.toggle('active', advisorOpen);
  toggle.textContent = advisorOpen ? '⊟ Close the Archivist' : '⊕ Consult the Archivist';
}

async function askAdvisor() {
  const btn  = document.getElementById('advisor-ask-btn');
  const text = document.getElementById('advisor-text');
  btn.disabled = true;
  text.className = 'advisor-text thinking';
  text.textContent = 'Pell is examining the ledger…';

  const recentLedger = gs.ledger.slice(0, 3)
    .map(l => `[${l.phase} ${l.year}] ${l.entry}`)
    .join('\n') || 'No entries yet — this is the founding.';

  const situationMsg =
`CURRENT STATE:
House ${gs.dynastyName} | ${gs.founderName}, age ${gs.age}, Year ${gs.turn}
Treasury: ${gs.marks} marks | Reputation: ${gs.reputation}/10 (${getRepTier(gs.reputation)})
Ships: ${gs.ships} | Heir: ${gs.heirName}, ${gs.heirAge}, ${gs.heirTrait ? gs.heirTrait.label : 'unknown'} (${gs.hp.sub}/${gs.hp.pos})
Phase: ${gs.phase === 'house' ? 'The House' : gs.phase === 'routes' ? 'The Routes' : 'Year End'}

RECENT LEDGER:
${recentLedger}

${gs.heirTrait && gs.heirTrait.key === 'scholarly' ? '\nNote: the heir ' + gs.heirName + ' has been reading the ledger again. Pell noticed.' : ''}
Pell, what do you see?`;

  try {
    const clean = await callLLM(ADVISOR_SYSTEM, situationMsg, {
      json: false, temperature: 0.82, maxTokens: 300
    });

    text.className = 'advisor-text';
    text.textContent = clean || 'Pell considered the ledger and said nothing. This is either a good sign or a very bad one.';

  } catch(e) {
    text.className = 'advisor-text';
    text.textContent = 'Pell is unavailable: ' + e.message;
  } finally {
    btn.disabled = false;
  }
}

// ── Monkey-patches — MUST stay at the bottom, after target functions are defined ──

// Show advisor toggle when entering game screen
const _origBeginPhase = beginPhase;
beginPhase = function() {
  document.getElementById('advisor-toggle').style.display = 'block';
  _origBeginPhase();
};

// Hook auto-save into showResult (call after state changes)
const _origShowResult = showResult;
showResult = function(parsed, isVenture) {
  _origShowResult(parsed, isVenture);
  autoSave();
};

// ══════════════════════════════════════════════════════════
//  KEYBOARD SHORTCUTS
// ══════════════════════════════════════════════════════════
document.addEventListener('keydown', (e) => {
  // Ignore shortcuts if typing in an input
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  
  // Number keys 1-3: Select choice buttons
  if (e.key >= '1' && e.key <= '3') {
    const choices = document.querySelectorAll('.choice-btn');
    const index = parseInt(e.key) - 1;
    if (choices[index] && !choices[index].disabled) {
      choices[index].click();
      e.preventDefault();
    }
  }
  
  // S: Save game
  if (e.key.toLowerCase() === 's' && !e.ctrlKey && !e.metaKey) {
    const saveBtn = document.querySelector('button[onclick="openSaveOverlay()"]');
    if (saveBtn) {
      saveBtn.click();
      e.preventDefault();
    }
  }
  
  // L: Load game (when save overlay is open)
  if (e.key.toLowerCase() === 'l') {
    const saveOverlay = document.getElementById('save-overlay');
    if (saveOverlay && saveOverlay.classList.contains('open')) {
      // Click first non-empty save slot
      const slots = document.querySelectorAll('.save-slot-content');
      for (const slot of slots) {
        if (slot && !slot.textContent.includes('Empty')) {
          slot.click();
          e.preventDefault();
          break;
        }
      }
    }
  }
  
  // P: Open settings
  if (e.key.toLowerCase() === 'p') {
    const settingsBtn = document.querySelector('button[onclick="openSettings()"]');
    if (settingsBtn) {
      settingsBtn.click();
      e.preventDefault();
    }
  }
  
  // Enter: Continue/advance (when continue button visible)
  if (e.key === 'Enter') {
    const continueBtn = document.querySelector('#continue-btn, #yearend-btn, button:has-text("Continue"), button:has-text("Turn the Page")');
    if (continueBtn && !continueBtn.disabled) {
      continueBtn.click();
      e.preventDefault();
    }
  }
  
  // Escape: Close overlays
  if (e.key === 'Escape') {
    const saveOverlay = document.getElementById('save-overlay');
    const settingsOverlay = document.getElementById('settings-overlay');
    const advisorPanel = document.getElementById('advisor-panel');
    
    if (saveOverlay && saveOverlay.classList.contains('open')) {
      closeSaveOverlay();
      e.preventDefault();
    } else if (settingsOverlay && settingsOverlay.classList.contains('open')) {
      closeSettings();
      e.preventDefault();
    } else if (advisorPanel && advisorPanel.classList.contains('open')) {
      toggleAdvisor();
      e.preventDefault();
    }
  }
});

// ── Init ──────────────────────────────────────────────────
window.addEventListener('DOMContentLoaded', () => {
  loadCFG();
  renderTitleSaves();
  rotateEpigram();
});
