const { test, expect } = require('@playwright/test');
const path = require('path');

const FILE_URL = 'file://' + path.join(process.cwd(), 'house-of-tide.html');

test.describe('Unit tests — pure functions', () => {

  test('getSeason returns correct 4-season cycle', async ({ page }) => {
    await page.goto(FILE_URL);

    const results = await page.evaluate(() => [
      getSeason(1),   // Spring
      getSeason(2),   // Summer
      getSeason(3),   // Autumn
      getSeason(4),   // Winter
      getSeason(5),   // Spring again
      getSeason(8),   // Winter (8 % 4 === 0, index 3)
    ]);

    expect(results[0]).toBe('Spring');
    expect(results[1]).toBe('Summer');
    expect(results[2]).toBe('Autumn');
    expect(results[3]).toBe('Winter');
    expect(results[4]).toBe('Spring');
    expect(results[5]).toBe('Winter');
  });

  test('analyzeChoiceRisk detects marks cost from choice text', async ({ page }) => {
    await page.goto(FILE_URL);

    const results = await page.evaluate(() => [
      analyzeChoiceRisk('Commission a vessel from the Masso yards — 600 marks.'),
      analyzeChoiceRisk('Hire a new captain for the northern route.'),
      analyzeChoiceRisk('Observe from a distance.'),
    ]);

    expect(results[0].cost).toBe(600);
    expect(results[1].cost).toBeGreaterThan(0);
    expect(results[2].cost).toBeNull();
  });

  test('analyzeChoiceRisk detects ship requirement', async ({ page }) => {
    await page.goto(FILE_URL);

    const results = await page.evaluate(() => [
      analyzeChoiceRisk('Dispatch two ships to the northern passage.'),
      analyzeChoiceRisk('Send a letter to Tucci.'),
    ]);

    expect(results[0].requirement).toMatch(/ship/);
    expect(results[1].requirement).toBeNull();
  });

  test('analyzeChoiceRisk detects challenge/warning', async ({ page }) => {
    await page.goto(FILE_URL);

    const result = await page.evaluate(() =>
      analyzeChoiceRisk('Challenge Rinaldo publicly at the exchange.')
    );

    expect(result.warning).toBe('Pell advises caution');
  });

  test('serialiseState / deserialiseState round-trip preserves Sets', async ({ page }) => {
    await page.goto(FILE_URL);

    const roundTripped = await page.evaluate(() => {
      // serialiseState reads from the global gs — assign it directly
      gs = {
        dynastyName: 'TestHouse', founderName: 'Tester',
        heirName: 'Alicia', heirFemale: true,
        hp: { sub:'she', obj:'her', pos:'her', cap:'She' },
        heirTrait: { key:'cautious', label:'Cautious' },
        marks: 1200, reputation: 7, ships: 2,
        turn: 5, age: 33, heirAge: 12, generation: 1,
        phase: 'house',
        ventureAvailable: false, ventureUsed: false,
        usedHouse: new Set(['h01','h02']),
        usedRoutes: new Set(['r10']),
        usedVentures: new Set(),
        ledger: [{ year: 5, phase: 'House', entry: 'Test entry.' }],
        currentEvent: null,
        _romanticSaved: false, _cautiousSaved: false,
        decisions: { bold:2, cautious:1, political:0, mercantile:1, patient:1 },
        history: [],
        bankLoan: null, shadowLoan: null, creditScore: 1, shipMarket: null,
        threads: [{ id:'th_1', year:3, label:'Open matter', type:'misc_3', expiresYear:15 }],
      };

      const serialised = serialiseState();
      const restored   = deserialiseState(serialised);

      return {
        marks:       restored.marks,
        reputation:  restored.reputation,
        turn:        restored.turn,
        usedHouseArr: [...restored.usedHouse].sort(),
        usedRoutesArr:[...restored.usedRoutes],
        ledgerEntry: restored.ledger[0].entry,
        threadLabel: restored.threads[0].label,
        decisionsBold: restored.decisions.bold,
      };
    });

    expect(roundTripped.marks).toBe(1200);
    expect(roundTripped.reputation).toBe(7);
    expect(roundTripped.turn).toBe(5);
    expect(roundTripped.usedHouseArr).toEqual(['h01', 'h02']);
    expect(roundTripped.usedRoutesArr).toEqual(['r10']);
    expect(roundTripped.ledgerEntry).toBe('Test entry.');
    expect(roundTripped.threadLabel).toBe('Open matter');
    expect(roundTripped.decisionsBold).toBe(2);
  });

});
