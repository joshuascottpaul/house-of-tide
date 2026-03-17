// ══════════════════════════════════════════════════════════
//  ACHIEVEMENT NOTIFICATIONS
// ══════════════════════════════════════════════════════════

/**
 * Show achievement unlock notification
 * @param {object} achievement - Achievement object
 */
function showAchievementNotification(achievement) {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = 'achievement-notification';
  notification.innerHTML = `
    <div class="achievement-notification-icon">🏆</div>
    <div class="achievement-notification-content">
      <div class="achievement-notification-title">Achievement Unlocked!</div>
      <div class="achievement-notification-name">${achievement.name}</div>
      <div class="achievement-notification-desc">${achievement.description}</div>
    </div>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 100);
  
  // Remove after 5 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 500);
  }, 5000);
  
  // Log achievement
  if (window.Logger) {
    Logger.info(Logger.CATEGORIES.ACHIEVEMENTS, `Achievement unlocked: ${achievement.id}`, achievement);
  }
}

/**
 * Unlock an achievement and show notification
 * @param {string} achievementId - Achievement ID
 */
function unlockAchievement(achievementId) {
  if (!gs.achievements) gs.achievements = [];
  
  // Check if already unlocked
  if (gs.achievements.includes(achievementId)) return false;
  
  // Find achievement
  const achievement = ACHIEVEMENTS.find(a => a.id === achievementId);
  if (!achievement) return false;
  
  // Unlock it
  gs.achievements.push(achievementId);
  
  // Show notification
  showAchievementNotification(achievement);
  
  // Log to ledger
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Achievement',
    entry: `Achievement unlocked: ${achievement.name}`
  });
  
  return true;
}

// ══════════════════════════════════════════════════════════
//  ACHIEVEMENT SYSTEM
// ══════════════════════════════════════════════════════════

function showAchievementsPanel() {
  try {
    const unlockedAchievements = gs.achievements.map(id => 
      ACHIEVEMENTS.find(a => a.id === id)
    ).filter(a => a);
    
    const lockedAchievements = ACHIEVEMENTS.filter(a => 
      !gs.achievements.includes(a.id)
    );

    let html = `
      <div style="padding:2rem; max-width:700px; margin:0 auto;">
        <h2 style="font-family:'IM Fell English SC',serif; color:var(--gold-hi); letter-spacing:.1em;">🏆 Achievements</h2>
        <div style="margin-top:1rem; color:#9a8858; font-style:italic;">
          Unlocked: ${unlockedAchievements.length} / ${ACHIEVEMENTS.length}
        </div>

        <div style="margin-top:1.5rem;">
          <h3 style="color:#7a6840; font-size:.8rem; letter-spacing:.1em; margin-bottom:.5rem;">UNLOCKED</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:.5rem;">
            ${unlockedAchievements.map(a => `
              <div style="border:1px solid #4a3820; padding:.7rem; background:rgba(74,56,32,.1);">
                <div style="font-size:1.2rem; margin-bottom:.3rem;">${a.icon} ${a.name}</div>
                <div style="color:#7a6840; font-size:.75rem;">${a.desc}</div>
              </div>
            `).join('')}
          </div>
        </div>

        <div style="margin-top:1.5rem;">
          <h3 style="color:#5a4828; font-size:.8rem; letter-spacing:.1em; margin-bottom:.5rem;">LOCKED</h3>
          <div style="display:grid; grid-template-columns:repeat(auto-fill, minmax(280px, 1fr)); gap:.5rem;">
            ${lockedAchievements.map(a => `
              <div style="border:1px solid #2a1e0e; padding:.7rem; opacity:.5;">
                <div style="font-size:1.2rem; margin-bottom:.3rem;">🔒 ${a.name}</div>
                <div style="color:#5a4828; font-size:.75rem;">${a.desc}</div>
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

// Export for global access
window.showAchievementsPanel = showAchievementsPanel;
window.unlockAchievement = unlockAchievement;
