// ══════════════════════════════════════════════════════════
//  MARKS HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════

function addMarks(amount, reason) {
  gs.marks += amount;
  if (reason) {
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Income',
      entry: `${reason}: +${amount} mk`
    });
  }
}

function spendMarks(amount, reason) {
  if (gs.marks < amount) return false;
  gs.marks -= amount;
  if (reason) {
    gs.ledger.unshift({
      year: gs.turn,
      phase: 'Expense',
      entry: `${reason}: -${amount} mk`
    });
  }
  return true;
}

// ══════════════════════════════════════════════════════════
//  SHIP MARKET
// ══════════════════════════════════════════════════════════

function rollShipMarket() {
  const roll = Math.random();
  const repBonus = gs.reputation >= REP_THRESHOLDS.RENOWNED ? 0.06 : 0;
  const legSellBonus = gs.reputation >= REP_THRESHOLDS.LEGENDARY ? 1.18 : 1.0;
  let demand, buyPrice, sellPrice, demandLabel;
  if (roll < 0.20) {
    demand = 'boom';
    buyPrice  = Math.round((800 + Math.random()*160) * (1+repBonus));
    sellPrice = Math.round((580 + Math.random()*140) * legSellBonus);
    demandLabel = 'The Masso yards are booked three months ahead. Buyers are visible and in competition with each other.';
  } else if (roll < 0.80) {
    demand = 'standard';
    buyPrice  = Math.round((600 + Math.random()*120) * (1+repBonus));
    sellPrice = Math.round((400 + Math.random()*110) * legSellBonus);
    demandLabel = 'The yards are at standard capacity. Prices are where they have been for the past two seasons.';
  } else {
    demand = 'slump';
    buyPrice  = Math.round((470 + Math.random()*100) * (1+repBonus));
    sellPrice = Math.round((250 + Math.random()*120) * legSellBonus);
    demandLabel = 'The yards have availability. The harbour has more hulls than buyers. Both will negotiate, which is the polite word for it.';
  }
  gs.shipMarket = { demand, buyPrice, sellPrice, demandLabel };
}

function buyShip() {
  if (!gs.shipMarket) return;
  const price = gs.shipMarket.buyPrice;
  if (gs.marks < price) return;
  gs.marks -= price;
  gs.ships++;
  gs.ledger.unshift({ year: gs.turn, phase: 'Shipyard',
    entry: `${gs.ships === 2 ? 'Second vessel' : 'New vessel'} commissioned at Masso — ${price} marks. The yards accepted without comment. Fleet: ${gs.ships} ships.`
  });
  updateStatusBar(); updateLedgerHistory(); showYearEndFinance(); autoSave();
}

function sellShip(confirmed) {
  if (gs.ships <= 0 || !gs.shipMarket) return;
  if (gs.ships === 1 && !confirmed) {
    const el = document.getElementById('sell-confirm-box');
    if (el) el.style.display = el.style.display === 'block' ? 'none' : 'block';
    return;
  }
  const price = gs.shipMarket.sellPrice;
  gs.ships--;
  gs.marks += price;
  gs.ledger.unshift({ year: gs.turn, phase: 'Shipyard',
    entry: `Vessel sold at Masso — ${price} marks. Fleet: ${gs.ships === 0 ? 'none remaining' : gs.ships + ' ship'+(gs.ships>1?'s':'')}.`
  });
  if (gs.ships === 0) {
    gs.ledger.unshift({ year: gs.turn, phase: 'Shipyard',
      entry: 'The last vessel is sold. The house has marks and no hull. The sea has nothing to say about this yet.'
    });
  }
  updateStatusBar(); updateLedgerHistory(); showYearEndFinance(); autoSave();
}

// ══════════════════════════════════════════════════════════
//  LOAN SYSTEM
// ══════════════════════════════════════════════════════════

function getBankRate() {
  const legBonus = gs.reputation >= REP_THRESHOLDS.LEGENDARY ? 0.03 : 0;
  return Math.max(0.07, 0.15 - Math.min(gs.creditScore||0, 3)*0.02 - legBonus);
}

function applyLoanInterest() {
  // Bank loan: interest compounds yearly
  if (gs.bankLoan) {
    gs.bankLoan.balance += Math.round(gs.bankLoan.balance * gs.bankLoan.rate);
    gs.bankLoan.yearsHeld = (gs.bankLoan.yearsHeld||0) + 1;
    if (gs.bankLoan.yearsHeld > gs.bankLoan.term) {
      gs.bankLoan.overdue = (gs.bankLoan.overdue||0) + 1;
      if (gs.bankLoan.overdue === 1) {
        gs.reputation = Math.max(0, gs.reputation - 1);
        gs.ledger.unshift({ year: gs.turn, phase: 'Exchange',
          entry: 'The Merchant Exchange recorded the overdue account. The notation was formal. The representative made clear it was preliminary.'
        });
      }
    }
  }
  // Shadow loan: 40% compounds brutally
  if (gs.shadowLoan) {
    gs.shadowLoan.balance += Math.round(gs.shadowLoan.balance * gs.shadowLoan.rate);
    gs.shadowLoan.yearsHeld = (gs.shadowLoan.yearsHeld||0) + 1;
    if (gs.shadowLoan.yearsHeld > gs.shadowLoan.term) {
      gs.shadowLoan.overdue = (gs.shadowLoan.overdue||0) + 1;
    }
    if ((gs.shadowLoan.overdue||0) >= 2) {
      // Collection visit — they take a portion by force
      const seized = Math.min(gs.marks, Math.round(gs.shadowLoan.balance * 0.35));
      gs.marks = Math.max(0, gs.marks - seized);
      gs.reputation = Math.max(0, gs.reputation - 1);
      gs.shadowLoan.balance = Math.max(0, gs.shadowLoan.balance - seized);
      gs.ledger.unshift({ year: gs.turn, phase: 'Masso',
        entry: `The representative from Masso arrived before dawn with two colleagues. He was professional. He left with ${seized} marks. He said the arrangement remained open.`
      });
    }
    if ((gs.shadowLoan.overdue||0) >= 3 && gs.marks < 500) {
      // They took everything
      gs.marks = 0;
      gs.ledger.unshift({ year: gs.turn, phase: 'Masso',
        entry: 'The Masso arrangement closed in the manner such arrangements close when patience has expired. The ledger notes the transaction. The ledger does not describe it further.'
      });
    }
  }
}

function takeBankLoan(amount) {
  if (gs.bankLoan || gs.reputation < 5) return;
  const rate = getBankRate();
  gs.bankLoan = { principal:amount, balance:amount, rate, taken:gs.turn, term:4, yearsHeld:0, overdue:0 };
  gs.marks += amount;
  gs.ledger.unshift({ year: gs.turn, phase: 'Exchange',
    entry: `Merchant Exchange advanced ${amount} marks at ${Math.round(rate*100)}% per annum. Four years to term. The arrangement is documented.`
  });
  updateStatusBar(); updateLedgerHistory(); showYearEndFinance(); autoSave();
}

function takeShadowLoan(amount) {
  if (gs.shadowLoan) return;
  gs.shadowLoan = { principal:amount, balance:amount, rate:0.40, taken:gs.turn, term:2, yearsHeld:0, overdue:0 };
  gs.marks += amount;
  gs.ledger.unshift({ year: gs.turn, phase: 'Masso',
    entry: `Private arrangement: ${amount} marks at forty percent per annum. No documentation. The representative did not give his name.`
  });
  updateStatusBar(); updateLedgerHistory(); showYearEndFinance(); autoSave();
}

function repayLoan(type, full) {
  const loan = type === 'bank' ? gs.bankLoan : gs.shadowLoan;
  if (!loan) return;
  const payment = full ? loan.balance : Math.min(Math.round(loan.balance*0.30), gs.marks);
  if (payment <= 0 || gs.marks < payment) return;
  gs.marks -= payment;
  loan.balance -= payment;
  if (loan.balance <= 0) {
    if (type === 'bank') {
      gs.bankLoan = null;
      gs.creditScore = Math.min(3, (gs.creditScore||0)+1);
      gs.ledger.unshift({ year: gs.turn, phase: 'Exchange',
        entry: 'Merchant Exchange account settled in full. Credit standing improved.'
      });
    } else {
      gs.shadowLoan = null;
      gs.ledger.unshift({ year: gs.turn, phase: 'Masso',
        entry: 'The Masso arrangement settled. The representative left without ceremony, which is the arrangement\'s version of a compliment.'
      });
    }
  } else {
    const label = type === 'bank' ? 'Merchant Exchange' : 'Masso arrangement';
    gs.ledger.unshift({ year: gs.turn, phase: type === 'bank' ? 'Exchange' : 'Masso',
      entry: `Partial payment of ${payment} marks on ${label}. Balance: ${loan.balance} marks remaining.`
    });
  }
  updateStatusBar(); updateLedgerHistory(); showYearEndFinance(); autoSave();
}

// ── Year-end finance panel renderer ──────────────────────
function showYearEndFinance() {
  const finEl = document.getElementById('ye-finance');
  if (!finEl) return;
  if (!gs.shipMarket) rollShipMarket();
  const m = gs.shipMarket;

  // ── SHIP MARKET ────────────────────────────────
  const demandLabel = m.demand === 'boom' ? 'High Demand' : m.demand === 'slump' ? 'Low Demand' : 'Standard Rates';
  let canBuy = gs.marks >= m.buyPrice;

  let html = `<div class="finance-section-title">⚓ The Ship Market — ${demandLabel}</div>
    <p class="finance-note">${m.demandLabel}</p>
    <div class="finance-prices">Commission: ${m.buyPrice} mk &nbsp;·&nbsp; Sell value: ${m.sellPrice} mk</div>
    <div class="finance-actions">`;

  if (canBuy) {
    html += `<button class="finance-btn" onclick="buyShip()">Commission a vessel — ${m.buyPrice} mk</button>`;
  } else {
    html += `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:.73rem;color:#4a3820;">Commission requires ${m.buyPrice} mk — treasury short.</span>`;
  }

  if (gs.ships >= 1) {
    html += `<button class="finance-btn sell" onclick="sellShip(${gs.ships > 1})">Sell a vessel — ${m.sellPrice} mk</button>`;
  }
  html += `</div>`;

  if (gs.ships === 1) {
    html += `<div id="sell-confirm-box" style="display:none;margin-top:.6rem;padding:.5rem .7rem;border-left:2px solid #8a3018;">
      <p class="finance-debt-warn" style="color:#c04020;margin-bottom:.5rem;">Selling your last vessel leaves the house without a fleet. The death condition fires next year start.</p>
      <div class="finance-actions">
        <button class="finance-btn sell" onclick="sellShip(true)">Confirm — sell last vessel</button>
        <button class="finance-btn" onclick="document.getElementById('sell-confirm-box').style.display='none'">Cancel</button>
      </div>
    </div>`;
  }

  // ── THE EXCHANGE ───────────────────────────────
  html += `<div class="finance-divider"></div>
    <div class="finance-section-title">✦ The Exchange</div>`;

  // Bank section
  if (!gs.bankLoan) {
    if (gs.reputation >= REP_THRESHOLDS.ESTABLISHED) {
      const rate = getBankRate();
      const rateStr = Math.round(rate*100)+'%';
      const maxAmt  = gs.reputation >= REP_THRESHOLDS.LEGENDARY ? 2000 : (gs.creditScore||0) >= 2 ? 1400 : 1000;
      const creditLabel = gs.reputation >= REP_THRESHOLDS.LEGENDARY ? `Legendary standing — ${rateStr} per annum (Exchange extended terms)`
        : (gs.creditScore||0) >= 2 ? `Good standing — ${rateStr} per annum` : `Standard — ${rateStr} per annum`;
      html += `<p class="finance-note">The Merchant Exchange extends credit at ${rateStr} per annum. Clean, documented, recoverable — provided the schedule is honoured within four years.</p>
        <div class="finance-prices">${creditLabel}</div>
        <div class="finance-actions">
          <button class="finance-btn" onclick="takeBankLoan(400)">Borrow 400 mk</button>
          <button class="finance-btn" onclick="takeBankLoan(700)">Borrow 700 mk</button>
          <button class="finance-btn" onclick="takeBankLoan(${maxAmt})">Borrow ${maxAmt} mk</button>
        </div>`;
    } else {
      html += `<p class="finance-note" style="color:#5a4028;">The Merchant Exchange does not extend credit at this standing. Reputation of five or above is required. The Exchange notes it has nothing personal to say about this.</p>`;
    }
  } else {
    const bl = gs.bankLoan;
    const overdue = (bl.overdue||0) > 0;
    const partial = Math.min(Math.round(bl.balance*0.30), gs.marks);
    const odClass = overdue ? 'color:#c03020' : 'color:#9a8848';
    html += `<div class="finance-warn" style="${odClass};margin-bottom:.4rem;">${overdue ? '⚠ OVERDUE — ' : ''}Merchant Exchange: ${bl.balance} mk outstanding · taken Year ${bl.taken} · ${Math.round(bl.rate*100)}% p.a.</div>`;
    if (overdue) html += `<p class="finance-debt-warn" style="color:#c03020;">The account is past its scheduled term. The Exchange has noted this formally. Further delay will be noted with a different instrument.</p>`;
    html += `<div class="finance-actions">`;
    if (gs.marks >= partial && partial > 0) html += `<button class="finance-btn" onclick="repayLoan('bank',false)">Pay ${partial} mk (30%)</button>`;
    if (gs.marks >= bl.balance) {
      html += `<button class="finance-btn" onclick="repayLoan('bank',true)">Repay in full — ${bl.balance} mk</button>`;
    } else {
      html += `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:.73rem;color:#4a3820;">Full repayment needs ${bl.balance} mk.</span>`;
    }
    html += `</div>`;
  }

  // Divider between bank and shadow
  html += `<div class="finance-divider"></div>`;

  // Shadow loan section
  if (!gs.shadowLoan) {
    html += `<p class="finance-note">A private arrangement is available — forty percent per annum, no documentation, no schedule as such. There is only the annual visit from a representative who is professional and prefers not to be kept waiting.</p>
      <div class="finance-actions">
        <button class="finance-btn shadow" onclick="takeShadowLoan(300)">Borrow 300 mk (Masso)</button>
        <button class="finance-btn shadow" onclick="takeShadowLoan(600)">Borrow 600 mk (Masso)</button>
        <button class="finance-btn shadow" onclick="takeShadowLoan(1000)">Borrow 1000 mk (Masso)</button>
      </div>`;
  } else {
    const sl   = gs.shadowLoan;
    const ov   = sl.overdue||0;
    const warnClass = ov >= 2 ? 'color:#c03020' : ov >= 1 ? 'color:#c07028' : 'color:#9a8848';
    const partial   = Math.min(Math.round(sl.balance*0.30), gs.marks);
    html += `<div class="finance-warn" style="${warnClass};margin-bottom:.4rem;">${ov>=2?'⚠ PAST DUE — ':ov>=1?'⚠ Overdue — ':''}Masso arrangement: ${sl.balance} mk outstanding · 40% p.a.</div>`;
    if (ov >= 2) {
      html += `<p class="finance-debt-warn" style="color:#c03020;">The arrangement is more than one year past its term. The annual visits will not continue to be visits much longer. The ledger has a word for what comes next.</p>`;
    } else if (ov >= 1) {
      html += `<p class="finance-debt-warn" style="color:#c07028;">The arrangement is past its term. The representative has noted this the way men note things they would prefer not to have to act on.</p>`;
    }
    html += `<div class="finance-actions">`;
    if (gs.marks >= partial && partial > 0) html += `<button class="finance-btn shadow" onclick="repayLoan('shadow',false)">Pay ${partial} mk (30%)</button>`;
    if (gs.marks >= sl.balance) {
      html += `<button class="finance-btn shadow" onclick="repayLoan('shadow',true)">Repay in full — ${sl.balance} mk</button>`;
    } else {
      html += `<span style="font-family:'IM Fell English',serif;font-style:italic;font-size:.73rem;color:#5a3820;">Full repayment requires ${sl.balance} mk.</span>`;
    }
    html += `</div>`;
  }

  finEl.innerHTML = html;
  finEl.style.display = 'block';
  
  // Show building purchase options
  showBuildingPurchase();
}

// ── Building purchase at year-end ────────────────────────
function showBuildingPurchase() {
  const container = document.getElementById('ye-buildings');
  const list = document.getElementById('building-purchase-list');
  if (!container || !list) return;
  
  // Check if any buildings can be afforded
  const affordableBuildings = Object.values(BUILDINGS).filter(b => 
    !gs.buildings[b.id] && gs.marks >= b.cost
  );
  
  if (affordableBuildings.length === 0) {
    container.style.display = 'none';
    return;
  }
  
  container.style.display = 'block';
  
  let html = '';
  affordableBuildings.forEach(building => {
    html += `
      <div class="building-purchase-option" style="display:flex;align-items:center;justify-content:space-between;padding:.6rem .8rem;margin-bottom:.5rem;border:1px solid #3a2c18;border-radius:3px;background:rgba(26,20,8,.4);">
        <div style="flex:1;">
          <span style="font-size:1.2rem;margin-right:.5rem;">${building.icon}</span>
          <span style="font-family:'IM Fell English SC',serif;font-size:.7rem;letter-spacing:.1em;color:#a08848;text-transform:uppercase;">${building.name}</span>
          <span style="display:block;font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-top:.2rem;">${building.description}</span>
        </div>
        <div>
          <button class="finance-btn" onclick="purchaseBuilding('${building.id}')" ${gs.marks < building.cost ? 'disabled' : ''}>
            Commission — ${building.cost} mk
          </button>
        </div>
      </div>
    `;
  });

  list.innerHTML = html;
  
  // Add cannon purchase section (Taipan!)
  const cannonContainer = document.createElement('div');
  cannonContainer.style.cssText = 'margin-top:1.5rem;padding:1rem;border:1px solid #5a3030;border-radius:3px;background:rgba(42,10,10,.3);';
  cannonContainer.innerHTML = `
    <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.15em;color:#a04040;text-transform:uppercase;margin-bottom:.5rem;">🔫 Harbor Defense</div>
    <p style="font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-bottom:.5rem;">Cannons protect your fleet from pirates. Current: ${gs.cannons || 0} cannons.</p>
    <div style="display:flex;gap:.5rem;flex-wrap:wrap;">
      <button class="finance-btn" onclick="buyCannons(1)" ${gs.marks < 50 ? 'disabled' : ''}>Buy 1 Cannon — 50 mk</button>
      <button class="finance-btn" onclick="buyCannons(3)" ${gs.marks < 150 ? 'disabled' : ''}>Buy 3 Cannons — 150 mk</button>
      <button class="finance-btn" onclick="buyCannons(5)" ${gs.marks < 250 ? 'disabled' : ''}>Buy 5 Cannons — 250 mk</button>
    </div>
  `;
  container.appendChild(cannonContainer);
  
  // Add skill training section (Oregon Trail)
  const skillContainer = document.createElement('div');
  skillContainer.style.cssText = 'margin-top:1.5rem;padding:1rem;border:1px solid #30505a;border-radius:3px;background:rgba(10,30,42,.3);';
  skillContainer.innerHTML = `
    <div style="font-family:'IM Fell English SC',serif;font-size:.65rem;letter-spacing:.15em;color:#4080a0;text-transform:uppercase;margin-bottom:.5rem;">📚 Skill Development</div>
    <p style="font-family:'IM Fell English',serif;font-size:.75rem;color:#c8a870;margin-bottom:.5rem;">Train your founder's skills. Each level costs 200 mk.</p>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:.5rem;">
      <button class="finance-btn" onclick="trainSkill('negotiation')" ${gs.marks < 200 || gs.skills.negotiation >= 5 ? 'disabled' : ''}>
        🤝 Negotiation ${gs.skills.negotiation || 0}/5
      </button>
      <button class="finance-btn" onclick="trainSkill('seamanship')" ${gs.marks < 200 || gs.skills.seamanship >= 5 ? 'disabled' : ''}>
        ⚓ Seamanship ${gs.skills.seamanship || 0}/5
      </button>
      <button class="finance-btn" onclick="trainSkill('politics')" ${gs.marks < 200 || gs.skills.politics >= 5 ? 'disabled' : ''}>
        🏛️ Politics ${gs.skills.politics || 0}/5
      </button>
      <button class="finance-btn" onclick="trainSkill('intrigue')" ${gs.marks < 200 || gs.skills.intrigue >= 5 ? 'disabled' : ''}>
        🗡️ Intrigue ${gs.skills.intrigue || 0}/5
      </button>
    </div>
  `;
  container.appendChild(skillContainer);
}

// ══════════════════════════════════════════════════════════
//  SKILL TRAINING
// ══════════════════════════════════════════════════════════

function trainSkill(skillName) {
  const cost = 200;
  if (gs.marks < cost) return false;
  if (gs.skills[skillName] >= 5) return false; // Max level
  
  gs.marks -= cost;
  gs.skills[skillName]++;
  
  const skillLabels = {
    negotiation: 'Better trade prices',
    seamanship: 'Escape pirates more easily',
    politics: 'Faster reputation gains',
    intrigue: 'Manipulate rivals'
  };
  
  gs.ledger.unshift({
    year: gs.turn,
    phase: 'Training',
    entry: `Trained ${skillName} to level ${gs.skills[skillName]}. ${skillLabels[skillName]}.`
  });
  
  updateStatusBar();
  showYearEndFinance();
  autoSave();
  return true;
}
