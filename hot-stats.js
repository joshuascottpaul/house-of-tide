// ══════════════════════════════════════════════════════════
//  STATISTICS DASHBOARD
// ══════════════════════════════════════════════════════════

const STATS_KEY = 'house_of_tide_stats';

function getStats() {
  try {
    const saved = localStorage.getItem(STATS_KEY);
    if (saved) return JSON.parse(saved);
  } catch (e) {}
  
  return {
    gamesPlayed: 0,
    gamesWon: 0,
    totalYears: 0,
    totalGenerations: 0,
    highestRep: 0,
    highestMarks: 0,
    totalDeaths: 0,
    averageLifespan: 0,
    longestDynasty: 0,
    choicesMade: 0,
    threadsResolved: 0,
    rivalAlliances: 0,
    venturesCompleted: 0,
    lastPlayed: null
  };
}

function saveStats(stats) {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(stats));
  } catch (e) {}
}

function updateStats(event, data) {
  const stats = getStats();
  
  switch(event) {
    case 'game_start':
      stats.gamesPlayed++;
      break;
    case 'year_end':
      stats.totalYears++;
      break;
    case 'generation_end':
      stats.totalGenerations++;
      if (data && data.years) {
        stats.longestDynasty = Math.max(stats.longestDynasty, data.years);
      }
      break;
    case 'death':
      stats.totalDeaths++;
      if (data && data.age) {
        stats.averageLifespan = Math.round(
          ((stats.averageLifespan * (stats.totalDeaths - 1)) + data.age) / stats.totalDeaths
        );
      }
      break;
    case 'reputation_peak':
      if (data && data.rep) {
        stats.highestRep = Math.max(stats.highestRep, data.rep);
      }
      break;
    case 'marks_peak':
      if (data && data.marks) {
        stats.highestMarks = Math.max(stats.highestMarks, data.marks);
      }
      break;
    case 'choice_made':
      stats.choicesMade++;
      break;
    case 'thread_resolved':
      stats.threadsResolved++;
      break;
    case 'rival_alliance':
      stats.rivalAlliances++;
      break;
    case 'venture_completed':
      stats.venturesCompleted++;
      break;
    case 'game_won':
      stats.gamesWon++;
      break;
  }
  
  stats.lastPlayed = new Date().toISOString();
  saveStats(stats);
  return stats;
}

function showStatsDashboard() {
  const stats = getStats();
  
  const html = `
    <div style="padding:2rem; max-width:600px; margin:0 auto;">
      <h2 style="font-family:'IM Fell English SC',serif; color:var(--gold-hi); letter-spacing:.1em;">Dynasty Statistics</h2>
      
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:1rem; margin-top:1.5rem;">
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">GAMES PLAYED</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.gamesPlayed}</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">TOTAL YEARS</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.totalYears}</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">GENERATIONS</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.totalGenerations}</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">AVG LIFESPAN</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.averageLifespan} yrs</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">HIGHEST REP</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.highestRep}/10</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">HIGHEST MARKS</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.highestMarks || 0} mk</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">CHOICES MADE</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.choicesMade}</div>
        </div>
        <div style="border:1px solid #2a1e0e; padding:1rem;">
          <div style="color:#7a6840; font-size:.6rem; letter-spacing:.1em;">THREADS RESOLVED</div>
          <div style="color:var(--gold); font-size:1.5rem;">${stats.threadsResolved}</div>
        </div>
      </div>
      
      <div style="margin-top:1rem; text-align:center;">
        <button onclick="if(window.showDynastyHistory) { this.closest('.stats-overlay').remove(); showDynastyHistory(); }"
          style="background:none; border:1px solid #4a3820; color:#7a6840;
          font-family:'IM Fell English SC',serif; font-size:.65rem; padding:.5rem 1rem;
          cursor:pointer; text-transform:uppercase;">📜 View Dynasty History</button>
      </div>

      <button onclick="this.closest('.stats-overlay').remove()"
        style="margin-top:1.5rem; background:none; border:1px solid #5a4020; color:var(--gold);
        font-family:'IM Fell English SC',serif; font-size:.75rem; padding:.65rem 1.8rem;
        cursor:pointer; text-transform:uppercase;">Close</button>
    </div>
  `;
  
  const overlay = document.createElement('div');
  overlay.className = 'stats-overlay';
  overlay.style.cssText = 'position:fixed; inset:0; background:rgba(0,0,0,.92); z-index:500; overflow-y:auto;';
  overlay.innerHTML = html;
  document.body.appendChild(overlay);
}

// Hook into game events
const _origUpdateStats = window.updateStats;
window.updateStats = updateStats;
window.showStatsDashboard = showStatsDashboard;
window.getStats = getStats;

// Also export after DOM ready (belt and suspenders)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.updateStats = updateStats;
    window.showStatsDashboard = showStatsDashboard;
    window.getStats = getStats;
  });
}
