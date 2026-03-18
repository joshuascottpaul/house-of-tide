// ══════════════════════════════════════════════════════════
//  COMBAT/PIRATE SYSTEM (Taipan! — Direct Conflict)
// ══════════════════════════════════════════════════════════
// Tactical pirate combat with cannons, skills, and choices
// ══════════════════════════════════════════════════════════

/**
 * Combat tactics with bonuses and risks
 */
const COMBAT_TACTICS = {
  aggressive: { name: 'Full Broadside', bonus: 3, risk: 'Take more damage if you lose' },
  defensive: { name: 'Hold Position', bonus: 0, risk: 'Safe but may not win' },
  evasive: { name: 'Evasive Maneuvers', bonus: -2, risk: 'Harder to hit but less damage' }
};

/**
 * Buy cannons for defense
 * @param {number} qty - Number of cannons to buy
 * @returns {boolean} True if purchase successful
 */
function buyCannons(qty) {
  const costPerCannon = 50;
  const totalCost = costPerCannon * qty;

  if (gs.marks < totalCost) return false;

  gs.marks -= totalCost;
  gs.cannons += qty;

  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Defense',
    entry: `Commissioned ${qty} cannons — ${totalCost} marks. The harbourmaster notes the decision without comment.`
  });

  updateStatusBar();
  autoSave();
  return true;
}

/**
 * Check for pirate encounter during Routes phase
 * @returns {object|null} Pirate encounter object or null
 */
function checkPirateEncounter() {
  // Base 10% chance during Routes phase
  let chance = 0.10;

  // Northern route is more dangerous
  if (gs.currentPort === 'Northern') chance += 0.15;
  if (gs.currentPort === 'Caldera') chance += 0.05;

  // Cannons reduce chance
  chance -= gs.cannons * 0.02;

  // Seamanship skill reduces chance
  chance -= gs.skills.seamanship * 0.01;
  
  // Pirate reputation affects encounter chance
  if (gs.pirateReputation === 'feared') {
    chance *= 0.50; // -50% encounters
  } else if (gs.pirateReputation === 'prey') {
    chance *= 1.50; // +50% encounters
  }

  chance = Math.max(0.02, Math.min(0.50, chance));

  if (Math.random() > chance) return null;

  // Generate pirate encounter
  let strength = Math.floor(Math.random() * 10) + 5 + (gs.cannons > 0 ? 2 : 0);
  
  // Pirate reputation affects strength
  if (gs.pirateReputation === 'prey') {
    strength += 2; // Pirates are bolder
  } else if (gs.pirateReputation === 'feared') {
    strength -= 2; // Pirates are cautious
  }
  
  strength = Math.max(1, strength);

  return {
    type: 'pirate',
    strength: strength,
    demand: Math.min(gs.marks * 0.30, 500 + gs.ships * 100),
    narrative: getPirateNarrative(),
    tacticChosen: null
  };
}

/**
 * Get random pirate narrative
 * @returns {string} Pirate encounter narrative
 */
function getPirateNarrative() {
  const narratives = [
    'Three hulls on the horizon. Black flags. They have been waiting.',
    'The fog parts. The first shot is a warning. The second will not be.',
    'Li Yuen\'s toll collectors. They do not ask permission.',
    'The Caldera strait has a new master. He wears a captain\'s hat and a smile that does not reach his eyes.'
  ];
  return narratives[Math.floor(Math.random() * narratives.length)];
}

/**
 * Show pirate combat panel
 * @param {object} encounter - Pirate encounter object
 */
function showPirateCombat(encounter) {
  window._currentPirateEncounter = encounter;

  // Show combat tutorial on first encounter
  if (gs.tutorialsShown && !gs.tutorialsShown.combat) {
    setTimeout(() => showTutorial('combat'), 500);
  }

  // Show combat panel
  document.getElementById('panel-event').style.display = 'none';
  document.getElementById('panel-venture').style.display = 'none';
  document.getElementById('panel-trading').style.display = 'none';
  document.getElementById('panel-result').style.display = 'none';

  const combatPanel = document.getElementById('panel-combat');
  if (!combatPanel) return;

  combatPanel.style.display = 'block';
  combatPanel.className = 'panel fade-in';

  document.getElementById('combat-narrative').textContent = encounter.narrative;
  
  // Show visual combat display with ship icons and health bars
  const combatDisplay = document.getElementById('combat-display');
  if (combatDisplay) {
    const playerHealth = 100;
    const pirateHealth = 100;
    
    combatDisplay.innerHTML = `
      <div class="combat-visual">
        <div class="combat-side player">
          <div class="combat-icon">🚢</div>
          <div class="combat-label">Your Fleet</div>
          <div class="combat-health-bar">
            <div class="combat-health-fill" style="width: ${playerHealth}%;"></div>
          </div>
          <div class="combat-stats">
            <span>🔫 ${gs.cannons}</span>
            <span>⚓ ${gs.skills.seamanship || 0}</span>
          </div>
        </div>
        
        <div class="combat-vs">VS</div>
        
        <div class="combat-side pirate">
          <div class="combat-icon">🏴‍☠️</div>
          <div class="combat-label">Pirates</div>
          <div class="combat-health-bar">
            <div class="combat-health-fill" style="width: ${pirateHealth}%;"></div>
          </div>
          <div class="combat-stats">
            <span>💪 ${encounter.strength}</span>
          </div>
        </div>
      </div>
    `;
  }

  document.getElementById('combat-enemy').textContent = `Pirate Strength: ${encounter.strength}`;
  document.getElementById('combat-player').textContent = `Your Cannons: ${gs.cannons} | Seamanship: ${gs.skills.seamanship || 0}`;

  // Render tactical choices with preview
  const tacticsContainer = document.getElementById('combat-tactics');
  tacticsContainer.innerHTML = Object.keys(COMBAT_TACTICS).map(tactic => {
    const t = COMBAT_TACTICS[tactic];
    const bonusClass = t.bonus > 0 ? 'positive' : t.bonus < 0 ? 'negative' : '';
    const bonusText = t.bonus > 0 ? `+${t.bonus}` : t.bonus;
    
    return `
      <button class="combat-tactic-btn" onclick="selectCombatTactic('${tactic}')" data-testid="tactic-${tactic}">
        <div class="tactic-name">${t.name}</div>
        <div class="tactic-bonus ${bonusClass}">${bonusText} combat bonus</div>
        <div class="tactic-risk">${t.risk}</div>
      </button>
    `;
  }).join('');

  // Show current selection
  document.getElementById('combat-selection').textContent = 'Select your tactic...';
  
  // Log combat encounter
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.COMBAT, 'Pirate combat started', {
      pirateStrength: encounter.strength,
      cannons: gs.cannons,
      seamanship: gs.skills.seamanship
    });
  }
}

/**
 * Select combat tactic
 * @param {string} tactic - Tactic ID (aggressive, defensive, evasive)
 */
function selectCombatTactic(tactic) {
  const encounter = window._currentPirateEncounter;
  if (!encounter) return;

  encounter.tacticChosen = tactic;

  // Highlight selected tactic
  document.querySelectorAll('.combat-tactic-btn').forEach(btn => {
    btn.classList.remove('selected');
  });
  event.target.closest('.combat-tactic-btn').classList.add('selected');

  document.getElementById('combat-selection').textContent = `Tactic: ${COMBAT_TACTICS[tactic].name}`;
  document.getElementById('combat-resolve-btn').disabled = false;
}

/**
 * Resolve pirate encounter
 * @param {string} choice - Player choice (fight, pay, flee)
 * @returns {object} Outcome object with survival, marksLost, shipLost
 */
function resolvePirateEncounter(choice) {
  const encounter = window._currentPirateEncounter;
  if (!encounter) return;

  let survival = 0;
  let marksLost = 0;
  let shipLost = false;

  if (choice === 'fight') {
    // Tactical combat with chosen tactic
    const tacticBonus = encounter.tacticChosen ? COMBAT_TACTICS[encounter.tacticChosen].bonus : 0;
    const defenseRoll = Math.floor(Math.random() * 10) + gs.cannons + gs.skills.seamanship + tacticBonus;
    const attackRoll = Math.floor(Math.random() * 10) + encounter.strength;

    if (defenseRoll >= attackRoll) {
      // Won - pirates flee
      survival = 1;
      const tacticName = encounter.tacticChosen ? COMBAT_TACTICS[encounter.tacticChosen].name : 'standard engagement';
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Combat',
        entry: `Pirates engaged using ${tacticName}. ${gs.cannons} cannons fired. The black hulls retreat. The ledger notes: no cargo lost.`
      });
      // Show skill feedback for seamanship
      if (gs.skills.seamanship > 0) {
        showSkillFeedback('seamanship', `+${gs.skills.seamanship} combat bonus`);
      }
    } else {
      // Lost - lose cargo/marks
      marksLost = Math.min(gs.marks, encounter.demand * 1.5);
      gs.marks -= marksLost;
      survival = 0.7;
      
      // Cargo damage (20-50% of cargo lost)
      let cargoLost = 0;
      if (gs.cargo && Object.values(gs.cargo).some(v => v > 0)) {
        const cargoLossPercent = 0.20 + Math.random() * 0.30; // 20-50%
        const cargoTypes = Object.keys(gs.cargo);
        
        cargoTypes.forEach(type => {
          if (gs.cargo[type] > 0) {
            const lost = Math.floor(gs.cargo[type] * cargoLossPercent);
            gs.cargo[type] -= lost;
            cargoLost += lost;
          }
        });
      }
      
      const cargoMsg = cargoLost > 0 ? ` Pirates destroyed ${cargoLost} units of cargo.` : '';
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Combat',
        entry: `Pirates boarded. ${marksLost} marks taken.${cargoMsg} The ledger records the loss without comment.`
      });
    }
  } else if (choice === 'pay') {
    // Pay tribute
    marksLost = encounter.demand;
    gs.marks -= marksLost;
    survival = 1;
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Tribute',
      entry: `Tribute paid: ${marksLost} marks. The pirates depart. The ledger notes: the arrangement may not hold.`
    });
  } else if (choice === 'flee') {
    // Flee: seamanship check
    const fleeRoll = Math.floor(Math.random() * 10) + gs.skills.seamanship * 2;
    if (fleeRoll >= 12) {
      survival = 1;
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Evasion',
        entry: 'The ship outran the pirates. The ledger notes: seamanship over firepower.'
      });
      showSkillFeedback('seamanship', 'Successful escape!');
    } else {
      marksLost = Math.min(gs.marks, encounter.demand);
      gs.marks -= marksLost;
      survival = 0.8;
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Evasion Failed',
        entry: `The pirates caught you. ${marksLost} marks taken. The ledger records: speed was not enough.`
      });
    }
  }

  window._currentPirateEncounter = null;

  // Update pirate reputation based on outcome
  if (choice === 'fight' && survival === 1) {
    // Won combat - become more feared
    if (gs.pirateReputation === 'known') {
      gs.pirateReputation = 'feared';
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Pirate Reputation',
        entry: 'The pirates whisper your name. You are feared.'
      });
    }
  } else if (choice === 'pay') {
    // Paid tribute - become prey
    if (gs.pirateReputation === 'known' || gs.pirateReputation === 'feared') {
      gs.pirateReputation = 'prey';
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Pirate Reputation',
        entry: 'You paid tribute. The pirates see you as prey.'
      });
    }
  } else if (choice === 'flee' && survival < 1) {
    // Failed to flee - become prey
    if (gs.pirateReputation === 'known') {
      gs.pirateReputation = 'prey';
      gs.ledger.unshift({
        year: gs.turn,
        phase: 'Pirate Reputation',
        entry: 'You fled in terror. The pirates mark you as prey.'
      });
    }
  }

  // Return to game flow
  document.getElementById('panel-combat').style.display = 'none';
  if (survival > 0) {
    advancePhase();
  } else {
    // Check if any allies died in combat
    if (gs.allies && gs.allies.length > 0) {
      const fallenAlly = gs.allies[Math.floor(Math.random() * gs.allies.length)];
      if (fallenAlly && fallenAlly.canDie) {
        gs.ledger.unshift({
          year: gs.turn,
          phase: 'Memorial',
          entry: `In Memoriam: ${fallenAlly.name}, ${fallenAlly.role}. Served Gen ${gs.generation}. ${fallenAlly.bond >= 7 ? 'Faithful to the end.' : 'The ledger notes their service.'}`
        });
      }
    }
    showDeathScreen();
  }

  return { survival, marksLost, shipLost };
}

/**
 * Show skill feedback popup
 * @param {string} skillName - Skill ID
 * @param {string} effectText - Effect description
 */
function showSkillFeedback(skillName, effectText) {
  const skillIcons = {
    negotiation: '🤝',
    seamanship: '⚓',
    politics: '🏛️',
    intrigue: '🗡️'
  };

  const feedback = document.createElement('div');
  feedback.className = 'skill-feedback';
  feedback.innerHTML = `
    <span class="skill-feedback-icon">${skillIcons[skillName]}</span>
    <div class="skill-feedback-text">${skillName.toUpperCase()}</div>
    <div class="skill-feedback-value">${effectText}</div>
  `;

  document.body.appendChild(feedback);

  // Remove after animation completes (2 seconds)
  setTimeout(() => {
    feedback.remove();
  }, 2000);
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.COMBAT_TACTICS = COMBAT_TACTICS;
window.buyCannons = buyCannons;
window.checkPirateEncounter = checkPirateEncounter;
window.showPirateCombat = showPirateCombat;
window.selectCombatTactic = selectCombatTactic;
window.resolvePirateEncounter = resolvePirateEncounter;
window.showSkillFeedback = showSkillFeedback;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.COMBAT, 'Combat system initialized');
}
