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

// ── Market events ─────────────────────────────────────────
var MARKET_EVENTS = [
  { name: 'Bumper Harvest', icon: '🍇', mods: { wine: 0.5, saltfish: 1.0, alum: 1.0, tin: 1.0 }, desc: 'Abundant harvest floods the wine market', narrative: 'The southern vineyards report record yields. Wine flows like water; prices follow.' },
  { name: 'Pirate Activity', icon: '☠️', mods: { saltfish: 1.6, wine: 1.4, alum: 1.0, tin: 1.0 }, desc: 'Raiders disrupt northern trade routes', narrative: 'Three merchant vessels seized off the Caldera passage. Insurance rates spike; captains demand hazard pay.' },
  { name: 'Guild Embargo', icon: '📜', mods: { alum: 2.0, tin: 0.6, saltfish: 1.0, wine: 1.0 }, desc: 'Factors guild restricts alum exports', narrative: 'The Factors Guild voted to restrict alum shipments. Officially: quality concerns. Unofficially: someone is cornering the market.' },
  { name: 'Festival Demand', icon: '🎉', mods: { wine: 1.7, saltfish: 1.2, alum: 1.0, tin: 1.0 }, desc: 'Grand festival increases luxury demand', narrative: 'The Doge announces a week of celebration. Every house in Verantia will serve wine, regardless of cost.' },
  { name: 'Shipwreck Series', icon: '⛈️', mods: { saltfish: 1.5, tin: 1.4, wine: 1.0, alum: 1.0 }, desc: 'Storm season claims multiple vessels', narrative: 'The northern gales have taken their toll. Four hulls lost in as many days. Salt fish grows scarce.' },
  { name: 'Mining Discovery', icon: '⛏️', mods: { tin: 0.5, alum: 0.6, saltfish: 1.0, wine: 1.0 }, desc: 'New mines flood the metal market', narrative: 'A shepherd in the high passes stumbled onto a tin lode. The metal arrives at market faster than it can be counted.' },
  { name: 'Harbour Fire', icon: '🔥', mods: { saltfish: 1.4, wine: 1.3, alum: 1.2, tin: 1.0 }, desc: 'Warehouse district blaze destroys stock', narrative: 'The eastern warehouses burned through the night. The ledger notes the losses without comment. The smoke smelled of salt fish and despair.' },
  { name: 'Diplomatic Gift', icon: '🎁', mods: { wine: 0.7, alum: 0.8, saltfish: 1.0, tin: 1.0 }, desc: 'Foreign embassy arrives with tribute', narrative: 'An embassy from the southern kingdoms arrived with casks of spiced wine. The gift is generous. The expectations attached are not quantified.' },
];

// ══════════════════════════════════════════════════════════
//  rollMarketPrices
// ══════════════════════════════════════════════════════════
function rollMarketPrices() {
  var season = getSeason(gs.turn);
  var mods = SEASON_MODIFIERS[season];
  var prices = { season: season };

  // 30% chance of market event (up from 25%)
  var activeEvent = null;
  if (Math.random() < 0.30) {
    activeEvent = MARKET_EVENTS[Math.floor(Math.random() * MARKET_EVENTS.length)];
    prices.event = activeEvent.name;
    prices.eventIcon = activeEvent.icon;
    prices.eventDesc = activeEvent.desc;
    prices.eventNarrative = activeEvent.narrative;
  }

  var commodities = ['saltfish', 'wine', 'alum', 'tin'];
  for (var i = 0; i < commodities.length; i++) {
    var c = commodities[i];
    var base = COMMODITY_BASE[c];
    var mod  = mods[c];
    
    // Apply event modifier if active
    if (activeEvent && activeEvent.mods[c]) {
      mod = mod * activeEvent.mods[c];
    }
    
    // ±15% random variance
    var variance = 0.85 + Math.random() * 0.30;
    var buyRaw  = base.buy  * mod * variance;
    var sellRaw = base.sell * mod * variance;
    prices[c] = {
      buy:  Math.max(1, Math.round(buyRaw)),
      sell: Math.max(1, Math.round(sellRaw)),
    };
  }

  // Store previous prices for trend calculation
  if (gs.marketPrices && gs.marketPrices._turn === gs.turn - 1) {
    prices._prevTurn = gs.turn;
    for (var j = 0; j < commodities.length; j++) {
      var cc = commodities[j];
      prices[cc]._prevBuy = gs.marketPrices[cc].buy;
      prices[cc]._prevSell = gs.marketPrices[cc].sell;
    }
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

// Get average purchase price for a commodity (from cargo basis)
function getAverageCostBasis(commodity) {
  if (!gs.cargoBasis || !gs.cargoBasis[commodity]) return 0;
  var stock = gs.cargo[commodity] || 0;
  if (stock <= 0) return 0;
  return Math.round(gs.cargoBasis[commodity] / stock);
}

// Update cost basis when buying
function updateCostBasis(commodity, qty, pricePerUnit) {
  if (!gs.cargoBasis) gs.cargoBasis = {};
  if (!gs.cargoBasis[commodity]) gs.cargoBasis[commodity] = 0;
  gs.cargoBasis[commodity] += qty * pricePerUnit;
}

// Reduce cost basis when selling
function reduceCostBasis(commodity, qty) {
  if (!gs.cargoBasis || !gs.cargoBasis[commodity]) return;
  var stock = gs.cargo[commodity] || 0;
  if (stock <= 0) {
    gs.cargoBasis[commodity] = 0;
    return;
  }
  var avgCost = gs.cargoBasis[commodity] / (stock + qty);
  gs.cargoBasis[commodity] -= qty * avgCost;
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
  
  // Track cost basis for profit calculation
  updateCostBasis(commodity, qty, price.buy);

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
//  buyMax — buy as much as possible
// ══════════════════════════════════════════════════════════
function buyMax(commodity) {
  if (!gs.marketPrices || !gs.marketPrices[commodity]) return;
  var price = gs.marketPrices[commodity].buy;
  var capacity = getCargoCapacity() - getCargoTotal();
  var canAfford = Math.floor(gs.marks / price);
  var qty = Math.min(capacity, canAfford);
  if (qty > 0) {
    buyCargo(commodity, qty);
  }
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
  
  // Calculate profit/loss based on cost basis
  var avgCost = getAverageCostBasis(commodity);
  var profit = (price.sell - avgCost) * qty;
  
  gs.marks += revenue;
  gs.cargo[commodity] -= qty;
  
  // Reduce cost basis
  reduceCostBasis(commodity, qty);

  var profitNote = profit > 0 ? ' (+'.profit+' mk profit)' : profit < 0 ? ' ('+profit+' mk loss)' : '';
  gs.ledger.unshift({
    year:  gs.turn,
    phase: 'Trading',
    entry: 'Sold ' + qty + ' units of ' + COMMODITY_NAMES[commodity] + ' for ' + revenue + ' mk (' + price.sell + ' mk/unit)' + profitNote + '.',
  });

  updateStatusBar();
  renderTradingPanel();
  autoSave();
}

// ══════════════════════════════════════════════════════════
//  sellAll — sell entire stock
// ══════════════════════════════════════════════════════════
function sellAll(commodity) {
  var stock = gs.cargo[commodity] || 0;
  if (stock > 0) {
    sellCargo(commodity, stock);
  }
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

  // Season note with event
  var snEl = document.getElementById('trading-season-note');
  if (snEl && gs.marketPrices) {
    if (gs.marketPrices.event) {
      // Show event prominently with narrative
      snEl.innerHTML = '<span class="market-event">' + 
        '<span class="event-icon">' + gs.marketPrices.eventIcon + '</span>' +
        '<span class="event-name">' + gs.marketPrices.event + '</span>: ' + 
        gs.marketPrices.eventNarrative + '</span>';
    } else {
      snEl.textContent = 'The market turns in ' + gs.marketPrices.season + '. Buy low; sell when the season favours you.';
    }
  }

  var body = document.getElementById('trading-market-body');
  if (!body) return;

  var commodities = ['saltfish', 'wine', 'alum', 'tin'];
  var html = '';
  
  // Tutorial hint (only show first time)
  var hasTradedBefore = gs.ledger.some(function(e) { return e.phase === 'Trading'; });
  if (!hasTradedBefore) {
    html += '<div class="trading-hint">';
    html += '💡 <strong>Trading Tip:</strong> Buy when prices are low, sell when high. Prices change each season. ';
    html += 'Cargo carries over between years — you can buy cheap and wait for better prices. ';
    html += 'Use <strong>Max Buy</strong> to purchase as much as you can afford, or <strong>Sell All</strong> to clear stock.';
    html += '</div>';
  }

  for (var i = 0; i < commodities.length; i++) {
    var c     = commodities[i];
    var name  = COMMODITY_NAMES[c];
    var stock = gs.cargo[c] || 0;
    var price = gs.marketPrices ? gs.marketPrices[c] : null;
    var buyP  = price ? price.buy  : '—';
    var sellP = price ? price.sell : '—';
    
    // Price trend arrow
    var trendArrow = '→';
    var trendClass = '';
    if (price && price._prevBuy) {
      if (buyP > price._prevBuy) { trendArrow = '↑'; trendClass = 'trend-up'; }
      else if (buyP < price._prevBuy) { trendArrow = '↓'; trendClass = 'trend-down'; }
    }

    // Profit margin (sell - buy)
    var margin = price ? (price.sell - buyP) : 0;
    var marginClass = margin >= 0 ? 'profit' : 'loss';
    var marginText = margin >= 0 ? '+' + margin : margin;
    
    // Player's cost basis (what they paid)
    var avgCost = getAverageCostBasis(c);
    var costBasisText = avgCost > 0 ? ' | Paid: ' + avgCost + ' mk' : '';
    
    // Profit/loss vs what player paid
    var vsBasis = price && avgCost > 0 ? (price.sell - avgCost) : 0;
    var vsBasisClass = vsBasis >= 0 ? 'profit' : 'loss';
    var vsBasisText = avgCost > 0 ? (' | vs You: ' + (vsBasis >= 0 ? '+' : '') + vsBasis) : '';

    html += '<div class="trading-commodity">';
    html += '<div class="trading-info">';
    html += '<span class="trading-name">' + name + '</span>';
    html += '<span class="trading-stock">Stock:\u00a0' + stock + costBasisText + '</span>';
    html += '</div>';
    html += '<div class="trading-prices">';
    html += '<span class="trading-price">Buy:\u00a0' + buyP + '\u00a0mk <span class="price-trend ' + trendClass + '">' + trendArrow + '</span></span>';
    html += '<span class="trading-price">Sell:\u00a0' + sellP + '\u00a0mk</span>';
    html += '<span class="trading-margin ' + marginClass + '">Margin: ' + marginText + ' mk' + vsBasisText + '</span>';
    html += '</div>';
    html += '<div class="trading-controls">';
    html += '<input class="trading-qty" id="trading-qty-' + c + '" type="number" min="1" value="1" aria-label="Quantity of ' + name + '">';
    html += '<button class="trading-btn" onclick="buyCargo(\'' + c + '\', document.getElementById(\'trading-qty-' + c + '\').value)">Buy</button>';
    html += '<button class="trading-btn bulk" onclick="buyMax(\'' + c + '\')">Max Buy</button>';
    html += '<button class="trading-btn sell" onclick="sellCargo(\'' + c + '\', document.getElementById(\'trading-qty-' + c + '\').value)">Sell</button>';
    html += '<button class="trading-btn sell bulk" onclick="sellAll(\'' + c + '\')">Sell All</button>';
    html += '<span id="trading-msg-' + c + '" class="trading-msg"></span>';
    html += '</div>';
    html += '</div>';
  }

  html += '<div class="trading-footer">Treasury: ' + gs.marks + ' mk</div>';

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
