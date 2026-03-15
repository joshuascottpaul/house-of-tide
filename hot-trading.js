// ══════════════════════════════════════════════════════════
//  TRADING LAYER — AI GENERATED MARKET EVENTS
// ══════════════════════════════════════════════════════════
// The AI is the Dungeon Master. Market events are narrated,
// not hardcoded. Events build on threads, rivals, and history.
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

// ── Market event generation prompt ────────────────────────
var MARKET_EVENT_PROMPT = `CRITICAL: You are the dungeon master of HOUSE OF TIDE. Generate a market event OR return null.

CURRENT STATE:
- Season: {{season}}
- Reputation: {{reputation}}/10 ({{tier}})
- Treasury: {{marks}} mk
- Ships: {{ships}}
- Cargo: {{cargo}}
- Allies: {{allies}}
- Rivals: {{rivals}}
- Open Threads: {{threads}}

YOUR TASK:
Generate a market event that could affect this house's trading this turn. The event should:
1. Reflect the season, house state, rival relationships, or open threads
2. Feel like a natural consequence of the world, not a random mechanic
3. Use the Junior Gothic register: present tense, second person, cold observation
4. Optionally create or resolve a thread (threads are unfinished business)

PRICE MODIFIER RULES:
- Range: 0.5 (cheap) to 2.0 (expensive)
- 1.0 = no effect
- Modifiers should be realistic for the event
- Example: "Bumper harvest" → wine: 0.5-0.7
- Example: "Pirate raid" → saltfish: 1.4-1.8

NARRATIVE RULES:
- 1-3 sentences
- Present tense, second person
- Never use "suddenly" or "you feel"
- End on a fact, not a rhetorical question
- Draw from: accounting, weather, architecture, the sea

OPTIONAL THREAD:
If this event creates unfinished business, include a thread:
{ "thread": { "label": "Short description", "expiresYear": {{turn}}+2 } }

RESPONSE FORMAT (JSON ONLY — NO MARKDOWN, NO EXPLANATION):
{
  "event": null | {
    "name": "2-4 word event name",
    "icon": "One emoji: 🍇☠️📜🎉⛈️⛏️🔥🎁⚓🏛️💀🌾📦🐋",
    "mods": { "saltfish": 1.0, "wine": 0.6, "alum": 1.0, "tin": 1.0 },
    "narrative": "The harbourmaster's report arrives. Three words: 'Wine. Too much wine.' The southern vineyards have flooded the market.",
    "thread": null | { "label": "Thread label", "expiresYear": 3 }
  }
}`;

// ══════════════════════════════════════════════════════════
//  rollMarketPrices
// ══════════════════════════════════════════════════════════
function rollMarketPrices() {
  var season = getSeason(gs.turn);
  var mods = SEASON_MODIFIERS[season];
  var prices = { season: season };

  // Check if we have a prefetched AI event (from prefetch during Routes phase)
  var activeEvent = gs._prefetchedMarketEvent || null;
  
  // If no prefetched event, 30% chance to generate one now
  if (!activeEvent && Math.random() < 0.30) {
    activeEvent = generateMarketEventAI();
  }
  
  // Clear prefetched event (used or not)
  gs._prefetchedMarketEvent = null;

  if (activeEvent && activeEvent.event) {
    prices.event = activeEvent.event.name;
    prices.eventIcon = activeEvent.event.icon;
    prices.eventNarrative = activeEvent.event.narrative;
    
    // Apply event modifiers
    var commodities = ['saltfish', 'wine', 'alum', 'tin'];
    for (var i = 0; i < commodities.length; i++) {
      var c = commodities[i];
      var base = COMMODITY_BASE[c];
      var mod  = mods[c];
      
      // Apply event modifier if present
      if (activeEvent.event.mods && activeEvent.event.mods[c]) {
        mod = mod * activeEvent.event.mods[c];
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
    
    // Create thread if event specifies one
    if (activeEvent.event.thread) {
      gs.threads.push({
        label: activeEvent.event.thread.label,
        expiresYear: gs.turn + 2,
        urgency: 'normal',
        _fromEvent: true
      });
    }
  } else {
    // No event — roll prices normally with just seasonal modifiers
    var commodities = ['saltfish', 'wine', 'alum', 'tin'];
    for (var j = 0; j < commodities.length; j++) {
      var cc = commodities[j];
      var base = COMMODITY_BASE[cc];
      var mm = mods[cc];
      var variance = 0.85 + Math.random() * 0.30;
      var buyRaw  = base.buy  * mm * variance;
      var sellRaw = base.sell * mm * variance;
      prices[cc] = {
        buy:  Math.max(1, Math.round(buyRaw)),
        sell: Math.max(1, Math.round(sellRaw)),
      };
    }
  }

  // Store previous prices for trend calculation
  if (gs.marketPrices && gs.marketPrices._turn === gs.turn - 1) {
    prices._prevTurn = gs.turn;
    for (var k = 0; k < commodities.length; k++) {
      var ccc = commodities[k];
      prices[ccc]._prevBuy = gs.marketPrices[ccc].buy;
      prices[ccc]._prevSell = gs.marketPrices[ccc].sell;
    }
  }

  gs.marketPrices = prices;
}

// ══════════════════════════════════════════════════════════
//  generateMarketEventAI — AI Dungeon Master generates event
// ══════════════════════════════════════════════════════════
function generateMarketEventAI() {
  try {
    // Build prompt with current game state
    var prompt = MARKET_EVENT_PROMPT
      .replace('{{season}}', getSeason(gs.turn))
      .replace('{{reputation}}', gs.reputation)
      .replace('{{tier}}', getRepTier(gs.reputation))
      .replace('{{marks}}', gs.marks)
      .replace('{{ships}}', gs.ships)
      .replace('{{cargo}}', getCargoSummary())
      .replace('{{allies}}', getAllySummary())
      .replace('{{rivals}}', getRivalSummary())
      .replace('{{threads}}', getThreadSummary())
      .replace('{{turn}}', gs.turn);
    
    // Call AI to generate event
    var result = callLLM(MARKET_EVENT_PROMPT, prompt, { json: true, noThink: true });
    return result;
  } catch(e) {
    // AI call failed — no event this turn
    console.log('Market event AI failed:', e);
    return null;
  }
}

// ══════════════════════════════════════════════════════════
//  prefetchMarketEvent — generate during Routes phase
// ══════════════════════════════════════════════════════════
function prefetchMarketEvent() {
  // Only prefetch for local backends (saves cloud API costs)
  if (!CFG || (CFG.backend !== 'ollama' && CFG.backend !== 'mlx')) return;
  
  // 30% chance of event
  if (Math.random() >= 0.30) return;
  
  try {
    var prompt = MARKET_EVENT_PROMPT
      .replace('{{season}}', getSeason(gs.turn))
      .replace('{{reputation}}', gs.reputation)
      .replace('{{tier}}', getRepTier(gs.reputation))
      .replace('{{marks}}', gs.marks)
      .replace('{{ships}}', gs.ships)
      .replace('{{cargo}}', getCargoSummary())
      .replace('{{allies}}', getAllySummary())
      .replace('{{rivals}}', getRivalSummary())
      .replace('{{threads}}', getThreadSummary())
      .replace('{{turn}}', gs.turn);
    
    // Fire and forget — store result when ready
    callLLM(MARKET_EVENT_PROMPT, prompt, { json: true, noThink: true })
      .then(function(result) {
        gs._prefetchedMarketEvent = result;
      })
      .catch(function(e) {
        console.log('Market event prefetch failed:', e);
      });
  } catch(e) {
    // Silent fail — prefetch is optional
  }
}

// ══════════════════════════════════════════════════════════
//  Helper: Get cargo summary for prompt
// ══════════════════════════════════════════════════════════
function getCargoSummary() {
  var total = getCargoTotal();
  if (total === 0) return 'Empty holds';
  var parts = [];
  if (gs.cargo.saltfish > 0) parts.push(gs.cargo.saltfish + ' salt fish');
  if (gs.cargo.wine > 0) parts.push(gs.cargo.wine + ' wine');
  if (gs.cargo.alum > 0) parts.push(gs.cargo.alum + ' alum');
  if (gs.cargo.tin > 0) parts.push(gs.cargo.tin + ' tin');
  return parts.join(', ');
}

// ══════════════════════════════════════════════════════════
//  Helper: Get ally summary for prompt
// ══════════════════════════════════════════════════════════
function getAllySummary() {
  if (!gs.allies || gs.allies.length === 0) return 'No known allies';
  return gs.allies.map(function(a) { 
    return a.name + ' (' + a.role + ', bond ' + a.bond + '/10, ' + a.status + ')'; 
  }).join('; ');
}

// ══════════════════════════════════════════════════════════
//  Helper: Get rival summary for prompt
// ══════════════════════════════════════════════════════════
function getRivalSummary() {
  var parts = [];
  if (gs.rivals.borracchi.relationship < -2) parts.push('Borracchi hostile');
  else if (gs.rivals.borracchi.relationship > 2) parts.push('Borracchi friendly');
  if (gs.rivals.spinetta.relationship < -2) parts.push('Spinetta hostile');
  if (gs.rivals.calmari.relationship < -2) parts.push('Calmari suspicious');
  if (gs.rivals.liyuen.relationship > 2) parts.push('Li Yuen cooperative');
  return parts.length > 0 ? parts.join(', ') : 'No strong rival ties';
}

// ══════════════════════════════════════════════════════════
//  Helper: Get thread summary for prompt
// ══════════════════════════════════════════════════════════
function getThreadSummary() {
  if (!gs.threads || gs.threads.length === 0) return 'No open threads';
  var labels = gs.threads.map(function(t) { return t.label; });
  return labels.join('; ');
}

// ══════════════════════════════════════════════════════════
//  Helper: Get reputation tier name
// ══════════════════════════════════════════════════════════
function getRepTier(rep) {
  if (rep >= 9) return 'Legendary';
  if (rep >= 7) return 'Renowned';
  if (rep >= 5) return 'Established';
  if (rep >= 3) return 'Precarious';
  return 'Disgraced';
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
