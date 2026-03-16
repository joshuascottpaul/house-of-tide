// ══════════════════════════════════════════════════════════
//  DYNAMIC BACKGROUND SYSTEM
// ══════════════════════════════════════════════════════════
// Handles dynamic background images based on game state
// ══════════════════════════════════════════════════════════

/**
 * Update background image based on current game state
 */
function updateBackground() {
  const el = document.getElementById('bg-image');
  if (!el) return;

  // Check for custom background preference
  const customBg = localStorage.getItem('hot_custom_bg');
  if (customBg && customBg !== 'dynamic') {
    el.style.backgroundImage = `url(${customBg})`;
    return;
  }

  // Build a context-appropriate search keyword based on CURRENT game state
  const rep = gs.reputation || 5;
  const marks = gs.marks || 0;
  const ships = gs.ships || 1;
  const turn = gs.turn || 1;
  const phase = gs.phase || 'house';

  let keyword;
  if (rep >= 9)          keyword = 'venice,palazzo,grand,renaissance';
  else if (rep >= 7)     keyword = 'venice,merchant,harbor,renaissance';
  else if (marks < 400)  keyword = 'harbor,storm,abandoned,medieval';
  else if (ships >= 3)   keyword = 'harbor,fleet,sailing,ships,renaissance';
  else if (phase === 'house') keyword = 'palazzo,courtyard,archway,medieval';
  else if (phase === 'routes') keyword = 'ocean,sea,horizon,sailing,adventure';
  else if (phase === 'trading') keyword = 'market,merchant,warehouse,trade,renaissance';
  else if (phase === 'yearend') keyword = 'candle,ledger,study,medieval,night';
  else                   keyword = 'port,dock,fishing,boats,renaissance';

  // Create a seed that changes with game state (year + turn + phase)
  // This ensures background changes as the game progresses
  const stateSeed = `${turn}-${phase}-${rep}-${marks}`;
  const url = `https://loremflickr.com/1600/900/${encodeURIComponent(keyword)}~cats?lock=${turn}&t=${Date.now()}`;

  // Force reload by setting opacity to 0, then 1 after image loads
  el.style.opacity = '0';
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url(${url})`;
    el.style.opacity = appearance.bgOpacity / 100;
  };
  img.src = url;
}

/**
 * Set custom background image
 * @param {string} url - Image URL or 'dynamic' for dynamic backgrounds
 */
function setCustomBackground(url) {
  if (!url) {
    localStorage.removeItem('hot_custom_bg');
  } else {
    localStorage.setItem('hot_custom_bg', url);
  }
  updateBackground();
}

// ══════════════════════════════════════════════════════════
//  EXPORT FOR GLOBAL ACCESS
// ══════════════════════════════════════════════════════════

window.updateBackground = updateBackground;
window.setCustomBackground = setCustomBackground;

// Log initialization
if (window.Logger) {
  Logger.info(Logger.CATEGORIES.UI, 'Background system initialized');
}
