// ══════════════════════════════════════════════════════════
//  TUTORIAL SYSTEM (Progressive Discovery)
// ══════════════════════════════════════════════════════════
// Shows contextual tutorials at appropriate game milestones
// ══════════════════════════════════════════════════════════

/**
 * Tutorial content for each type
 */
const TUTORIALS = {
  buildings: {
    icon: '🏛️',
    title: 'The Masso Shipwrights',
    content: `<p>The Masso shipwrights have sent word. They offer their services — for a price.</p>
    <p style="margin-top:1rem;"><strong style="color:var(--gold-hi)">Buildings persist across generations.</strong> The warehouse you commission today will still stand when your heir takes the ledger. Each provides a permanent benefit:</p>
    <ul style="margin:1rem 0 1rem 1.5rem;line-height:1.7;">
      <li><strong>Warehouse</strong> — More cargo space (400 mk)</li>
      <li><strong>Guild Seat</strong> — Reputation grows faster (800 mk)</li>
      <li><strong>Shipyard</strong> — Ships cost less (1,200 mk)</li>
      <li><strong>Palazzo Wing</strong> — Heir educated longer (600 mk)</li>
      <li><strong>Counting House</strong> — Passive income increases (500 mk)</li>
      <li><strong>Safehouse</strong> — You are harder to kill (350 mk)</li>
    </ul>
    <p>The ledger records what you build. The sea does not care. Your heir will.</p>`
  },
  skills: {
    icon: '📚',
    title: 'The Mind Sharpens',
    content: `<p>You have survived long enough to learn. This is rare in Verantia.</p>
    <p style="margin-top:1rem;"><strong style="color:var(--gold-hi)">Skills improve your founder's capabilities.</strong> Train at year-end (200 mk per level, max 5):</p>
    <ul style="margin:1rem 0 1rem 1.5rem;line-height:1.7;">
      <li><strong>Negotiation</strong> — Better trade prices 🤝</li>
      <li><strong>Seamanship</strong> — Escape pirates, reduce encounters ⚓</li>
      <li><strong>Politics</strong> — Reputation gains increase 🏛️</li>
      <li><strong>Intrigue</strong> — Manipulate rivals more effectively 🗡️</li>
    </ul>
    <p>The body declines. The mind can sharpen. For now.</p>`
  },
  marriage: {
    icon: '💍',
    title: 'Your Heir Is of Age',
    content: `<p>Your heir is of marriageable age. This is not a request.</p>
    <p style="margin-top:1rem;"><strong style="color:var(--gold-hi)">Political marriages create alliances.</strong> Candidates:</p>
    <ul style="margin:1rem 0 1rem 1.5rem;line-height:1.7;">
      <li><strong>Borracchi</strong> — Requires neutral relations (+2 rep, 500 mk dowry)</li>
      <li><strong>Spinetta</strong> — Requires no hostility (+1 rep, 300 mk)</li>
      <li><strong>Calmari</strong> — Requires positive relations (+3 rep, 800 mk)</li>
      <li><strong>Merchant</strong> — No requirements (+0 rep, 200 mk)</li>
    </ul>
    <p>Your heir may refuse. They are not wrong to do so. The ledger records the choice either way.</p>`
  },
  venture: {
    icon: '🌊',
    title: 'The Horizon Opens',
    content: `<p>The horizon opens. This is not ordinary.</p>
    <p style="margin-top:1rem;"><strong style="color:var(--gold-hi)">Grand Ventures are high-stakes opportunities.</strong> They appear every 7 years (years 5, 12, 19...). The rewards are substantial. The risks are commensurate.</p>
    <p style="margin-top:1rem;">This is the Oregon Trail mechanic. Things do not fully go to plan. The ledger notes who survived.</p>
    <p>You have been preparing for this. Whether you were preparing well enough remains to be seen.</p>`
  },
  combat: {
    icon: '⚔️',
    title: 'Black Sails',
    content: `<p>Black sails on the horizon. They have been waiting.</p>
    <p style="margin-top:1rem;"><strong style="color:var(--gold-hi)">Combat is tactical.</strong> Choose your approach:</p>
    <ul style="margin:1rem 0 1rem 1.5rem;line-height:1.7;">
      <li><strong>Full Broadside</strong> — +3 bonus, but take more damage if you lose</li>
      <li><strong>Hold Position</strong> — Safe, but may not win</li>
      <li><strong>Evasive Maneuvers</strong> — Harder to hit, but less damage dealt</li>
    </ul>
    <p style="margin-top:1rem;">You can also <strong>pay tribute</strong> or <strong>attempt escape</strong>.</p>
    <p>The sea does not negotiate. The pirates do. Briefly.</p>`
  }
};

/**
 * Show tutorial modal
 * @param {string} type - Tutorial type (buildings, skills, marriage, venture, combat)
 */
function showTutorial(type) {
  const tutorial = TUTORIALS[type];
  if (!tutorial) return;

  document.getElementById('tutorial-icon').textContent = tutorial.icon;
  document.getElementById('tutorial-title').textContent = tutorial.title;
  document.getElementById('tutorial-content').innerHTML = tutorial.content;

  const overlay = document.getElementById('tutorial-overlay');
  overlay.style.display = 'block';

  // Mark tutorial as shown
  if (gs.tutorialsShown) {
    gs.tutorialsShown[type] = true;
  }

  // Log tutorial shown
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.TUTORIAL, `Tutorial shown: ${type}`);
  }
}

/**
 * Close tutorial modal
 */
function closeTutorial() {
  document.getElementById('tutorial-overlay').style.display = 'none';
}

/**
 * Check and show tutorials at year-end
 */
function checkYearEndTutorials() {
  if (!gs.tutorialsShown) return;

  // Year 2: Buildings tutorial
  if (gs.turn >= 2 && !gs.tutorialsShown.buildings) {
    setTimeout(() => showTutorial('buildings'), 1000);
    return;
  }

  // Year 3: Skills tutorial
  if (gs.turn >= 3 && !gs.tutorialsShown.skills) {
    setTimeout(() => showTutorial('skills'), 1000);
    return;
  }

  // Year 4: Marriage tutorial
  if (gs.turn >= 4 && gs.heirAge >= 14 && !gs.tutorialsShown.marriage) {
    setTimeout(() => showTutorial('marriage'), 1000);
    return;
  }

  // Year 5: Venture tutorial
  if (gs.turn >= 5 && !gs.tutorialsShown.venture) {
    setTimeout(() => showTutorial('venture'), 1000);
    return;
  }
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.TUTORIALS = TUTORIALS;
window.showTutorial = showTutorial;
window.closeTutorial = closeTutorial;
window.checkYearEndTutorials = checkYearEndTutorials;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.TUTORIAL, 'Tutorial system initialized');
}
