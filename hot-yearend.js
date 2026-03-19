// ══════════════════════════════════════════════════════════
//  YEAR-END PROCESSING SYSTEM
// ══════════════════════════════════════════════════════════
// Handles year-end settlement, income, and transitions
// ══════════════════════════════════════════════════════════

/**
 * Year-end note rotation
 */
const YEAR_END_NOTES = [
  'The year closes its books. The ledger adds a page.',
  'Another year in Verantia. The sea does not care.',
  'The calendar turns. The house endures.',
  'Winter comes. The harbour grows quiet.',
  'The year ends. What did you build?',
  'Another turn of the wheel. The ledger watches.',
  'The year closes. The heirs wait.',
  'Time passes. The house remains.'
];

/**
 * Calculate passive fleet income
 * @returns {object} Income breakdown
 */
function calculateFleetIncome() {
  const repMod = gs.reputation >= 9 ? 1.65
               : gs.reputation >= 7 ? 1.3
               : gs.reputation >= 5 ? 1.0
               : gs.reputation >= 3 ? 0.65
               : 0.40;
  
  const variance = 0.85 + Math.random() * 0.3;  // ±15%
  const baseRate = 85;   // gross per ship per year
  const upkeep = 20;     // crew, berthing, maintenance per ship

  const greedyBonus = (gs.heirTrait && gs.heirTrait.key === 'greedy') ? 1.2 : 1.0;
  
  // Tax policy modifier
  const taxModifiers = getTaxModifiers();
  const taxMod = taxModifiers.income;
  const repChange = taxModifiers.repChange;

  const easyBonus = (typeof CFG !== 'undefined' && CFG.easyMode) ? 1.25 : 1.0;
  const gross = Math.round(gs.ships * baseRate * repMod * variance * greedyBonus * taxMod * easyBonus);
  const cost = gs.ships * upkeep;
  const net = gross - cost;

  // Apply reputation change from tax policy
  if (repChange !== 0) {
    gs.reputation = Math.max(0, Math.min(10, gs.reputation + repChange));
  }

  return { gross, cost, net, repMod, variance, taxMod, repChange };
}

/**
 * Calculate building maintenance costs
 * @returns {number} Total maintenance cost
 */
function calculateBuildingMaintenance() {
  if (!gs.buildings) return 0;
  return Object.keys(gs.buildings).length * 25; // 25 mk per building
}

/**
 * Calculate lifestyle costs based on reputation
 * @returns {number} Lifestyle cost
 */
function calculateLifestyleCost() {
  return gs.reputation * 15; // 15 mk per reputation point
}

/**
 * Process year-end settlement
 * @returns {object} Settlement breakdown
 */
function processYearEndSettlement() {
  // Fleet income
  const fleetIncome = calculateFleetIncome();
  gs._yearGross = fleetIncome.gross;
  gs._upkeep = fleetIncome.cost;
  gs._yearIncome = fleetIncome.net;

  // Building maintenance
  const buildingMaintenance = calculateBuildingMaintenance();
  
  // Lifestyle costs
  const lifestyleCost = calculateLifestyleCost();

  // Total expenses
  const totalExpenses = buildingMaintenance + lifestyleCost;

  // Apply to marks
  gs.marks = Math.max(0, gs.marks + fleetIncome.net - totalExpenses);

  // Record in ledger
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Settlement',
    entry: `Year ${gs.turn} settlement: ${fleetIncome.net} mk fleet income, ${totalExpenses} mk expenses. Net: ${fleetIncome.net - totalExpenses} mk.`
  });

  // Log settlement
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, 'Year-end settlement processed', {
      gross: fleetIncome.gross,
      upkeep: fleetIncome.cost,
      net: fleetIncome.net,
      buildingMaintenance,
      lifestyleCost,
      totalExpenses,
      finalMarks: gs.marks
    });
  }

  return {
    fleetIncome,
    buildingMaintenance,
    lifestyleCost,
    totalExpenses,
    netChange: fleetIncome.net - totalExpenses
  };
}

/**
 * Get random year-end note
 * @returns {string} Year-end note
 */
function getYearEndNote() {
  return YEAR_END_NOTES[Math.floor(Math.random() * YEAR_END_NOTES.length)];
}

/**
 * Show year-end panel
 */
function showYearEnd() {
  // Process settlement
  const settlement = processYearEndSettlement();

  // Update UI
  const noteEl = document.getElementById('ye-note');
  if (noteEl) noteEl.textContent = getYearEndNote();

  // Update heir info
  const nextAge = gs.heirAge + 1;
  const { sub: hs, obj: ho, pos: hp2, cap: hc } = gs.hp;
  const heirEl = document.getElementById('ye-heir');
  if (heirEl) {
    heirEl.innerHTML = gs.heirAge < 10
      ? `${gs.heirName} is ${gs.heirAge}. ${hc} watches, learns, waits. ${cap} will be ready when the time comes. Or ${hs} will not. The ledger notes ${ho} with the detachment of a scribe recording the weather.`
      : gs.heirAge < 16
      ? `${gs.heirName}, ${gs.heirAge}, has been asking questions. ${cap} wants to know about the ${pos} ships, the ${pos} debts, the ${pos} enemies. You tell ${ho} what ${pos} father tells all heirs: soon enough.`
      : `${gs.heirName} is ${nextAge}. Old enough to understand what ${gs.heirTrait.label.toLowerCase()} means. Old enough to make ${pos} own mistakes. You remember being ${nextAge}. The ledger does not care.`;
  }
  
  // Add education UI if heir is of age (10-17)
  if (gs.heirAge >= 10 && gs.heirAge < 18) {
    addEducationUI();
  }
  
  // Add building upgrade UI
  addBuildingUpgradeUI();
  
  // Add tax decision UI
  const financeEl = document.getElementById('ye-finance');
  if (financeEl) {
    financeEl.innerHTML += `
      <div style="margin-top:1.5rem;padding:1rem;border:1px solid #3a2c18;border-radius:3px;">
        <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.1em;color:#a08848;text-transform:uppercase;margin-bottom:.5rem;">Tax Policy</div>
        <p style="font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-bottom:1rem;">Set the tax rate for the coming year. This affects both income and reputation.</p>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
          <button class="finance-btn" onclick="setTaxRate('low')">
            Low Tax<br><span style="font-size:.65rem;color:#6a9838;">+10% income, -1 rep/year</span>
          </button>
          <button class="finance-btn" onclick="setTaxRate('medium')">
            Medium Tax<br><span style="font-size:.65rem;color:#a08848;">No change</span>
          </button>
          <button class="finance-btn" onclick="setTaxRate('high')">
            High Tax<br><span style="font-size:.65rem;color:#c84030;">-10% income, +1 rep/year</span>
          </button>
        </div>
        <div id="tax-current" style="margin-top:.5rem;font-family:'IM Fell English',serif;font-size:.7rem;color:#7a6840;">
          Current: Medium Tax
        </div>
      </div>
    `;
  }

  // Check for tutorials
  if (window.checkYearEndTutorials) {
    checkYearEndTutorials();
  }

  // Check for victory conditions
  if (window.checkVictoryConditions) {
    const victory = checkVictoryConditions();
    if (victory) {
      showVictoryScreen(victory);
      return;
    }
  }

  // Check for death conditions
  if (gs.age >= 65 || gs.marks <= 0 || gs.reputation <= 0 || gs.ships <= 0) {
    showDeathScreen();
    return;
  }

  // Show year-end panel
  document.getElementById('panel-yearend').style.display = 'block';
  window.scrollTo({ top: 0, behavior: 'smooth' });

  // Log year-end
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, 'Year-end panel shown', {
      turn: gs.turn,
      settlement
    });
  }
}

/**
 * Add heir education UI to year-end panel
 */
function addEducationUI() {
  const financeEl = document.getElementById('ye-finance');
  if (!financeEl) return;
  
  const focus = gs.heirEducation.focus || 'none';
  const progress = gs.heirEducation.progress || 0;
  const progressPercent = (progress / 8) * 100;  // 8 years of education (10-17)
  
  const focusNames = {
    commerce: 'Commerce (+Negotiation, +Seamanship)',
    politics: 'Politics (+Politics, +Intrigue)',
    balance: 'Balance (+1 to all skills)'
  };
  
  financeEl.innerHTML = `
    <div style="margin-top:1.5rem;padding:1rem;border:1px solid #3a2c18;border-radius:3px;">
      <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.1em;color:#a08848;text-transform:uppercase;margin-bottom:.5rem;">Heir Education</div>
      <p style="font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-bottom:1rem;">${gs.heirName} is ${gs.heirAge}. Choose their focus for the coming year.</p>
      
      ${focus !== 'none' ? `
        <div style="margin-bottom:1rem;">
          <div style="font-family:'IM Fell English SC',serif;font-size:.6rem;color:#7a6840;text-transform:uppercase;margin-bottom:.3rem;">Current Focus: ${focusNames[focus]}</div>
          <div style="width:100%;height:8px;background:rgba(58,44,24,0.5);border-radius:4px;overflow:hidden;">
            <div style="width:${progressPercent}%;height:100%;background:linear-gradient(90deg, #6a9838, #a0c858);"></div>
          </div>
          <div style="font-family:'IM Fell English',serif;font-size:.65rem;color:#7a6840;margin-top:.3rem;">Progress: ${progress}/8 years</div>
        </div>
      ` : ''}
      
      <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
        <button class="finance-btn" onclick="setEducationFocus('commerce')" ${focus === 'commerce' ? 'disabled style="opacity:0.5;"' : ''}>
          Commerce<br><span style="font-size:.65rem;color:#6a9838;">+1 Negotiation, +1 Seamanship</span>
        </button>
        <button class="finance-btn" onclick="setEducationFocus('politics')" ${focus === 'politics' ? 'disabled style="opacity:0.5;"' : ''}>
          Politics<br><span style="font-size:.65rem;color:#6080a0;">+1 Politics, +1 Intrigue</span>
        </button>
        <button class="finance-btn" onclick="setEducationFocus('balance')" ${focus === 'balance' ? 'disabled style="opacity:0.5;"' : ''}>
          Balance<br><span style="font-size:.65rem;color:#a08848;">+1 to all skills</span>
        </button>
      </div>
    </div>
  ` + financeEl.innerHTML;
}

/**
 * Add building upgrade UI to year-end panel
 */
function addBuildingUpgradeUI() {
  const financeEl = document.getElementById('ye-finance');
  if (!financeEl || !gs.buildings || Object.keys(gs.buildings).length === 0) return;
  
  const upgradeCosts = {
    warehouse: { cost: 800, name: 'Grand Warehouse' },
    guild_seat: { cost: 1500, name: 'Council Seat' },
    shipyard: { cost: 2000, name: 'Master Shipyard' },
    palazzo_wing: { cost: 1200, name: 'Grand Palazzo' },
    counting_house: { cost: 1000, name: 'Bank' },
    safehouse: { cost: 700, name: 'Fortress' }
  };
  
  const upgradeButtons = Object.keys(gs.buildings)
    .filter(id => gs.buildings[id].level < 2)
    .map(id => {
      const upgrade = upgradeCosts[id];
      const canAfford = gs.marks >= upgrade.cost;
      return `
        <button class="finance-btn" onclick="upgradeBuilding('${id}')" ${!canAfford ? 'disabled style="opacity:0.5;"' : ''}>
          Upgrade ${BUILDINGS[id].name}<br>
          <span style="font-size:.65rem;color:${canAfford ? '#6a9838' : '#c84030'};">${upgrade.cost} mk → ${upgrade.name}</span>
        </button>
      `;
    }).join('');
  
  if (upgradeButtons) {
    financeEl.innerHTML = `
      <div style="margin-top:1.5rem;padding:1rem;border:1px solid #3a2c18;border-radius:3px;">
        <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.1em;color:#a08848;text-transform:uppercase;margin-bottom:.5rem;">Building Upgrades</div>
        <p style="font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-bottom:1rem;">Upgrade your buildings for enhanced effects.</p>
        <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
          ${upgradeButtons}
        </div>
      </div>
    ` + financeEl.innerHTML;
  }
}

/**
 * Set heir education focus
 * @param {string} focus - Education focus (commerce, politics, balance)
 */
function setEducationFocus(focus) {
  if (!gs.heirEducation) gs.heirEducation = { focus: null, progress: 0, events: [] };
  
  // If changing focus, reset progress
  if (gs.heirEducation.focus !== focus) {
    gs.heirEducation.focus = focus;
    gs.heirEducation.progress = 1;
    
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Education',
      entry: `${gs.heirName} begins studying ${focus}. The ${focus === 'commerce' ? 'ledgers and ships' : focus === 'politics' ? 'council chambers and shadows' : 'arts of all trades'} await.`
    });
  } else {
    // Continue same focus
    gs.heirEducation.progress = Math.min(8, gs.heirEducation.progress + 1);
    
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Education',
      entry: `${gs.heirName} continues ${focus} studies. Year ${gs.heirEducation.progress} of 8.`
    });
  }
  
  // Apply skill bonuses
  applyEducationBonuses(focus);
  
  // Log education
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Education focus set: ${focus}`, {
      focus,
      progress: gs.heirEducation.progress
    });
  }
  
  // Refresh UI
  showYearEnd();
}

/**
 * Apply education bonuses to skills
 * @param {string} focus - Education focus
 */
function applyEducationBonuses(focus) {
  if (!gs.skills) gs.skills = { negotiation: 0, seamanship: 0, politics: 0, intrigue: 0 };
  
  switch(focus) {
    case 'commerce':
      gs.skills.negotiation = Math.min(5, (gs.skills.negotiation || 0) + 1);
      gs.skills.seamanship = Math.min(5, (gs.skills.seamanship || 0) + 1);
      break;
    case 'politics':
      gs.skills.politics = Math.min(5, (gs.skills.politics || 0) + 1);
      gs.skills.intrigue = Math.min(5, (gs.skills.intrigue || 0) + 1);
      break;
    case 'balance':
      gs.skills.negotiation = Math.min(5, (gs.skills.negotiation || 0) + 1);
      gs.skills.seamanship = Math.min(5, (gs.skills.seamanship || 0) + 1);
      gs.skills.politics = Math.min(5, (gs.skills.politics || 0) + 1);
      gs.skills.intrigue = Math.min(5, (gs.skills.intrigue || 0) + 1);
      break;
  }
}

/**
 * Set tax rate
 * @param {string} rate - Tax rate (low, medium, high)
 */
function setTaxRate(rate) {
  if (!gs.taxRate) gs.taxRate = 'medium';
  gs.taxRate = rate;
  
  // Update UI
  const currentEl = document.getElementById('tax-current');
  if (currentEl) {
    const rateNames = { low: 'Low', medium: 'Medium', high: 'High' };
    currentEl.textContent = `Current: ${rateNames[rate]} Tax`;
  }
  
  // Log tax decision
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Tax Policy',
    entry: `Tax rate set to ${rate}. ${rate === 'low' ? 'The merchants rejoice.' : rate === 'high' ? 'The people grumble, but the coffers swell.' : 'The status quo maintained.'}`
  });
  
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Tax rate set: ${rate}`);
  }
}

/**
 * Get tax rate modifier
 * @returns {object} Income and reputation modifiers
 */
function getTaxModifiers() {
  if (!gs.taxRate) gs.taxRate = 'medium';
  
  switch(gs.taxRate) {
    case 'low':
      return { income: 1.10, repChange: -1 };
    case 'high':
      return { income: 0.90, repChange: 1 };
    default: // medium
      return { income: 1.0, repChange: 0 };
  }
}

/**
 * Begin new year
 */
function beginYear() {
  gs.turn++;
  gs.age++;
  gs.heirAge++;
  gs.ventureAvailable = false;
  gs.phase = 'house';

  // Update UI
  updateStatusBar();
  if (window.renderThreadTracker) renderThreadTracker();

  // Hide year-end panel
  document.getElementById('panel-yearend').style.display = 'none';

  // Begin house phase
  if (window.beginPhase) {
    beginPhase();
  }

  // Log new year
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.STATE, `Year ${gs.turn} begun`, {
      age: gs.age,
      heirAge: gs.heirAge,
      marks: gs.marks,
      reputation: gs.reputation
    });
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.YEAR_END_NOTES = YEAR_END_NOTES;
window.calculateFleetIncome = calculateFleetIncome;
window.calculateBuildingMaintenance = calculateBuildingMaintenance;
window.calculateLifestyleCost = calculateLifestyleCost;
window.processYearEndSettlement = processYearEndSettlement;
window.getYearEndNote = getYearEndNote;
window.showYearEnd = showYearEnd;
window.beginYear = beginYear;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.STATE, 'Year-end system initialized');
}
