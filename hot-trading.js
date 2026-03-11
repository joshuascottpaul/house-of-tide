// ══════════════════════════════════════════════════════════
//  TRADING LAYER
// ══════════════════════════════════════════════════════════

// ── Base commodity prices ──────────────────────────────────
var COMMODITY_BASE = {
  saltfish: { buy: 4, sell: 2 },
  wine:     { buy: 7, sell: 4 },
  alum:     { buy: 6, sell: 3 },
  tin:      { buy: 3, sell: 1 },
};

// ── Season price modifiers ────────────────────────────────
var SEASON_MODIFIERS = {
  Winter: { saltfish: 1.4, wine: 0.8, alum: 1.1, tin: 1.2 },
  Spring: { saltfish: 0.9, wine: 1.1, alum: 1.0, tin: 0.9 },
  Summer: { saltfish: 0.7, wine: 1.5, alum: 0.9, tin: 0.8 },
  Autumn: { saltfish: 1.1, wine: 1.2, alum: 1.2, tin: 1.1 },
};

// ── Commodity display names ───────────────────────────────
var COMMODITY_NAMES = {
  saltfish: 'Salt Fish',
  wine:     'Wine',
  alum:     'Alum',
  tin:      'Tin',
};

// ══════════════════════════════════════════════════════════
//  rollMarketPrices
// ══════════════════════════════════════════════════════════
function rollMarketPrices() {
  var season = getSeason(gs.turn);
  var mods = SEASON_MODIFIERS[season];
  var prices = { season: season };

  var commodities = ['saltfish', 'wine', 'alum', 'tin'];
  for (var i = 0; i < commodities.length; i++) {
    var c = commodities[i];
    var base = COMMODITY_BASE[c];
    var mod  = mods[c];
    // ±15% random variance
    var variance = 0.85 + Math.random() * 0.30;
    var buyRaw  = base.buy  * mod * variance;
    var sellRaw = base.sell * mod * variance;
    prices[c] = {
      buy:  Math.max(1, Math.round(buyRaw)),
      sell: Math.max(1, Math.round(sellRaw)),
    };
  }

  gs.marketPrices = prices;
}

// ══════════════════════════════════════════════════════════
//  Cargo helpers
// ══════════════════════════════════════════════════════════
function getCargoCapacity() {
  return gs.ships * 100;
}

function getCargoTotal() {
  var cargo = gs.cargo || {};
  return (cargo.saltfish || 0) + (cargo.wine || 0) + (cargo.alum || 0) + (cargo.tin || 0);
}

// ══════════════════════════════════════════════════════════
//  buyCargo
// ══════════════════════════════════════════════════════════
function buyCargo(commodity, qty) {
  qty = parseInt(qty, 10);
  var msgEl = document.getElementById('trading-msg-' + commodity);

  function showMsg(text) {
    if (msgEl) { msgEl.textContent = text; }
  }

  if (!qty || qty <= 0) {
    showMsg('Enter a valid quantity.');
    return;
  }
  if (!gs.marketPrices) {
    showMsg('No prices available.');
    return;
  }

  var price = gs.marketPrices[commodity];
  if (!price) {
    showMsg('Unknown commodity.');
    return;
  }

  var cost = price.buy * qty;
  if (gs.marks < cost) {
    showMsg('Insufficient marks. Need ' + cost + ' mk.');
    return;
  }

  var capacity  = getCargoCapacity();
  var cargoUsed = getCargoTotal();
  if (cargoUsed + qty > capacity) {
    showMsg('Cargo hold full. Only ' + (capacity - cargoUsed) + ' units free.');
    return;
  }

  gs.marks -= cost;
  gs.cargo[commodity] = (gs.cargo[commodity] || 0) + qty;

  gs.ledger.unshift({
    year:  gs.turn,
    phase: 'Trading',
    entry: 'Purchased ' + qty + ' units of ' + COMMODITY_NAMES[commodity] + ' for ' + cost + ' mk (' + price.buy + ' mk/unit).',
  });

  updateStatusBar();
  renderTradingPanel();
  autoSave();
}

// ══════════════════════════════════════════════════════════
//  sellCargo
// ══════════════════════════════════════════════════════════
function sellCargo(commodity, qty) {
  qty = parseInt(qty, 10);
  var msgEl = document.getElementById('trading-msg-' + commodity);

  function showMsg(text) {
    if (msgEl) { msgEl.textContent = text; }
  }

  if (!qty || qty <= 0) {
    showMsg('Enter a valid quantity.');
    return;
  }

  var stock = gs.cargo[commodity] || 0;
  if (stock < qty) {
    showMsg('Not enough stock. You have ' + stock + ' units.');
    return;
  }

  if (!gs.marketPrices) {
    showMsg('No prices available.');
    return;
  }

  var price = gs.marketPrices[commodity];
  if (!price) {
    showMsg('Unknown commodity.');
    return;
  }

  var revenue = price.sell * qty;
  gs.marks += revenue;
  gs.cargo[commodity] -= qty;

  gs.ledger.unshift({
    year:  gs.turn,
    phase: 'Trading',
    entry: 'Sold ' + qty + ' units of ' + COMMODITY_NAMES[commodity] + ' for ' + revenue + ' mk (' + price.sell + ' mk/unit).',
  });

  updateStatusBar();
  renderTradingPanel();
  autoSave();
}

// ══════════════════════════════════════════════════════════
//  renderTradingPanel
// ══════════════════════════════════════════════════════════
function renderTradingPanel() {
  var capacity  = getCargoCapacity();
  var cargoUsed = getCargoTotal();

  // Capacity bar
  var capEl = document.getElementById('trading-capacity');
  if (capEl) {
    capEl.textContent = 'Cargo hold: ' + cargoUsed + '\u202f/\u202f' + capacity + ' units (' + gs.ships + (gs.ships === 1 ? ' ship' : ' ships') + ')';
  }

  // Season note
  var snEl = document.getElementById('trading-season-note');
  if (snEl && gs.marketPrices) {
    snEl.textContent = 'The market turns in ' + gs.marketPrices.season + '. Buy low; sell when the season favours you.';
  }

  var body = document.getElementById('trading-market-body');
  if (!body) return;

  var commodities = ['saltfish', 'wine', 'alum', 'tin'];
  var html = '';

  for (var i = 0; i < commodities.length; i++) {
    var c     = commodities[i];
    var name  = COMMODITY_NAMES[c];
    var stock = gs.cargo[c] || 0;
    var price = gs.marketPrices ? gs.marketPrices[c] : null;
    var buyP  = price ? price.buy  : '—';
    var sellP = price ? price.sell : '—';

    html += '<div class="trading-commodity">';
    html += '<span class="trading-name">' + name + '</span>';
    html += '<span class="trading-price">Buy\u00a0' + buyP + '\u00a0mk &nbsp; Sell\u00a0' + sellP + '\u00a0mk</span>';
    html += '<span class="trading-stock">Stock:\u00a0' + stock + '</span>';
    html += '</div>';
    html += '<div style="display:flex;align-items:center;gap:.5rem;margin-bottom:.5rem;flex-wrap:wrap;">';
    html += '<input class="trading-qty" id="trading-qty-' + c + '" type="number" min="1" value="1" aria-label="Quantity of ' + name + '">';
    html += '<button class="trading-btn" onclick="buyCargo(\'' + c + '\', document.getElementById(\'trading-qty-' + c + '\').value)">Buy</button>';
    html += '<button class="trading-btn sell" onclick="sellCargo(\'' + c + '\', document.getElementById(\'trading-qty-' + c + '\').value)">Sell</button>';
    html += '<span id="trading-msg-' + c + '" class="trading-msg"></span>';
    html += '</div>';
  }

  html += '<div style="margin-top:1rem;font-family:\'IM Fell English SC\',serif;font-size:.65rem;letter-spacing:.1em;color:#7a6040;text-transform:uppercase;">Treasury: ' + gs.marks + ' mk</div>';

  body.innerHTML = html;
}

// ══════════════════════════════════════════════════════════
//  showTradingPanel
// ══════════════════════════════════════════════════════════
function showTradingPanel() {
  // Roll prices if none, or if stale (from a different turn)
  if (!gs.marketPrices || gs.marketPrices._turn !== gs.turn) {
    rollMarketPrices();
    gs.marketPrices._turn = gs.turn;
  }

  renderTradingPanel();

  // Hide other panels
  var otherPanels = ['panel-event', 'panel-venture', 'loading-panel', 'panel-result', 'panel-yearend'];
  for (var i = 0; i < otherPanels.length; i++) {
    var el = document.getElementById(otherPanels[i]);
    if (el) el.style.display = 'none';
  }

  var tp = document.getElementById('panel-trading');
  if (tp) {
    tp.style.display = 'block';
    tp.className = 'panel fade-in';
  }

  autoSave();
}
