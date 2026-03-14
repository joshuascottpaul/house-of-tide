// ══════════════════════════════════════════════════════════
//  ACHIEVEMENT SYSTEM (Skeleton)
// ══════════════════════════════════════════════════════════

const ACHIEVEMENTS = {
  // First steps
  'first_blood': {
    id: 'first_blood',
    name: 'The Ledger Opens',
    description: 'Complete your first year',
    icon: '📖',
    unlocked: false
  },
  // Wealth milestones
  'rich': {
    id: 'rich',
    name: 'Merchant Prince',
    description: 'Accumulate 2000 marks',
    icon: '💰',
    unlocked: false
  },
  'wealthy': {
    id: 'wealthy',
    name: 'Wealthy House',
    description: 'Accumulate 1000 marks',
    icon: '💵',
    unlocked: false
  },
  // Reputation milestones
  'legendary': {
    id: 'legendary',
    name: 'Legendary',
    description: 'Reach reputation 10',
    icon: '👑',
    unlocked: false
  },
  'renowned': {
    id: 'renowned',
    name: 'Renowned',
    description: 'Reach reputation 7',
    icon: '⭐',
    unlocked: false
  },
  // Survival
  'generation_2': {
    id: 'generation_2',
    name: 'The House Endures',
    description: 'Survive to the second generation',
    icon: '🏰',
    unlocked: false
  },
  'generation_5': {
    id: 'generation_5',
    name: 'Dynasty',
    description: 'Survive to the fifth generation',
    icon: '🏆',
    unlocked: false
  },
  // Rival relationships
  'ally': {
    id: 'ally',
    name: 'Unlikely Allies',
    description: 'Form an alliance with a rival house',
    icon: '🤝',
    unlocked: false
  },
  // Trading
  'trader': {
    id: 'trader',
    name: 'Master Trader',
    description: 'Complete 50 trades',
    icon: '⚓',
    unlocked: false
  },
  // Threads
  'resolver': {
    id: 'resolver',
    name: 'Problem Solver',
    description: 'Resolve 25 threads',
    icon: '🧵',
    unlocked: false
  }
};

function getAchievements() {
  try {
    const saved = localStorage.getItem('hot_achievements');
    if (saved) {
      const unlocked = JSON.parse(saved);
      // Merge with definitions
      return Object.keys(ACHIEVEMENTS).reduce((acc, key) => {
        acc[key] = {
          ...ACHIEVEMENTS[key],
          unlocked: unlocked.includes(key)
        };
        return acc;
      }, {});
    }
  } catch (e) {}
  return ACHIEVEMENTS;
}

function unlockAchievement(id) {
  if (!ACHIEVEMENTS[id]) return false;
  
  const achievements = getAchievements();
  if (achievements[id].unlocked) return false; // Already unlocked
  
  achievements[id].unlocked = true;
  
  // Save unlocked IDs
  const unlocked = Object.keys(achievements).filter(key => achievements[key].unlocked);
  localStorage.setItem('hot_achievements', JSON.stringify(unlocked));
  
  // Show notification
  if (typeof showNotification === 'function') {
    showNotification(`🏆 Achievement: ${achievements[id].name}`);
  }
  
  return true;
}

function checkAchievements() {
  if (!gs) return;
  
  // Wealth achievements
  if (gs.marks >= 2000) unlockAchievement('rich');
  else if (gs.marks >= 1000) unlockAchievement('wealthy');
  
  // Reputation achievements
  if (gs.reputation >= 10) unlockAchievement('legendary');
  else if (gs.reputation >= 7) unlockAchievement('renowned');
  
  // Generation achievements
  if (gs.generation >= 5) unlockAchievement('generation_5');
  else if (gs.generation >= 2) unlockAchievement('generation_2');
}

function showAchievementsPanel() {
  try {
    const achievements = getAchievements();
    const unlocked = Object.values(achievements).filter(a => a.unlocked);
    const locked = Object.values(achievements).filter(a => !a.unlocked);

    let html = `
      <div style="padding:2rem; max-width:700px; margin:0 auto;">
        <h2 style="font-family:'IM Fell English SC',serif; color:var(--gold-hi); letter-spacing:.1em;">Achievements</h2>
        <div style="margin-top:1rem; color:#9a8858; font-style:italic;">
          Unlocked: ${unlocked.length} / ${Object.keys(achievements).length}
        </div>

        <div style="margin-top:1.5rem;">
          <h3 style="color:#7a6840; font-size:.8rem; letter-spacing:.1em; margin-bottom:.5rem;">UNLOCKED</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:.5rem;">
            ${unlocked.map(a => `
              <div style="border:1px solid #4a3820; padding:.7rem; background:rgba(74,56,32,.1);">
                <div style="font-size:1.2rem; margin-bottom:.3rem;">${a.icon} ${a.name}</div>
                <div style="color:#7a6840; font-size:.75rem;">${a.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:1.5rem;">
          <h3 style="color:#5a4828; font-size:.8rem; letter-spacing:.1em; margin-bottom:.5rem;">LOCKED</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:.5rem;">
            ${locked.map(a => `
              <div style="border:1px solid #2a1e0e; padding:.7rem; opacity:.5;">
                <div style="font-size:1.2rem; margin-bottom:.3rem;">🔒 ${a.name}</div>
                <div style="color:#5a4828; font-size:.75rem;">${a.description}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <button onclick="this.closest('.achievements-overlay').remove()"
          style="margin-top:1.5rem; background:none; border:1px solid #5a4020; color:var(--gold);
          font-family:'IM Fell English SC',serif; font-size:.75rem; padding:.65rem 1.8rem;
          cursor:pointer; text-transform:uppercase;">Close</button>
      </div>
    `;

    const overlay = document.createElement('div');
    overlay.className = 'achievements-overlay';
    overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:500; overflow-y:auto;';
    overlay.innerHTML = html;
    document.body.appendChild(overlay);
  } catch (e) {
    console.error('Error showing achievements panel:', e);
    alert('Achievements: ' + e.message);
  }
}

// Check achievements on game events - wrap updateStats to trigger achievement checks
const _origUpdateStatsAchievements = window.updateStats;
if (_origUpdateStatsAchievements) {
  window.updateStats = function(event, data) {
    _origUpdateStatsAchievements(event, data);
    checkAchievements();
  };
}

// Export for global access - immediate
window.getAchievements = getAchievements;
window.unlockAchievement = unlockAchievement;
window.showAchievementsPanel = showAchievementsPanel;

// Also export after DOM ready (belt and suspenders)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.getAchievements = getAchievements;
    window.unlockAchievement = unlockAchievement;
    window.showAchievementsPanel = showAchievementsPanel;
  });
}
