'use strict';
const assert = require('assert');
const { splitClaims, scoreClaim, bandFor, analyse, buildBrief, SAMPLES } = require('../app.js');

let n = 0;
function check(name, fn) { fn(); n++; console.log('PASS:', name); }

// Sentence splitting
check('splits three sentences into three claims', () => {
  assert.deepStrictEqual(splitClaims('One claim here. Second claim here! Third claim?'), ['One claim here.', 'Second claim here!', 'Third claim?']);
});
check('empty / whitespace input yields no claims', () => {
  assert.deepStrictEqual(splitClaims('   '), []);
});
check('single sentence survives', () => {
  assert.strictEqual(splitClaims('Just one claim.').length, 1);
});

// Scoring — signals move the score the documented way
check('absolute + hype + weasel claim scores below 40 (Unverifiable)', () => {
  const r = scoreClaim('This miracle cure guarantees weight loss, experts say it always works!');
  assert.ok(r.score < 40, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Unverifiable');
  assert.ok(r.signals.includes('absolute') && r.signals.includes('hype') && r.signals.includes('weasel'));
});
check('sourced, numbered, hedged claim scores 70+ (Solid)', () => {
  const r = scoreClaim('A 2024 study by the Indian Council of Medical Research found that 31% of adults surveyed may skip breakfast.');
  assert.ok(r.score >= 70, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Solid');
});
check('plain neutral claim stays near base 50 (Shaky)', () => {
  const r = scoreClaim('You should probably diversify your investments because markets fluctuate over time.');
  assert.ok(r.score >= 40 && r.score < 70, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Shaky');
});
check('score clamps to 0..100', () => {
  const r = scoreClaim('Always never proves guaranteed 100% miracle revolutionary best ever cure-all!');
  assert.ok(r.score >= 0 && r.score <= 100);
});
check('band boundaries', () => {
  assert.strictEqual(bandFor(70), 'Solid');
  assert.strictEqual(bandFor(69), 'Shaky');
  assert.strictEqual(bandFor(40), 'Shaky');
  assert.strictEqual(bandFor(39), 'Unverifiable');
});

// Full analysis + brief
check('analyse averages claim scores and returns a band', () => {
  const a = analyse(SAMPLES[1] + ' ' + SAMPLES[2]);
  assert.strictEqual(a.claims.length, 3); // sample 1 is two sentences, sample 2 is one
  assert.ok(a.overall >= 0 && a.overall <= 100);
  assert.ok(['Solid', 'Shaky', 'Unverifiable'].includes(a.band));
});
check('analyse of empty input returns null overall', () => {
  assert.strictEqual(analyse('').overall, null);
});
check('brief contains score, each claim and a bottom line', () => {
  const a = analyse(SAMPLES[0]);
  const b = buildBrief(SAMPLES[0], a);
  assert.ok(b.includes(String(a.overall)));
  assert.ok(b.includes('Bottom line'));
  assert.ok(b.includes('What would change my mind'));
});
check('all three samples analyse without error', () => {
  SAMPLES.forEach(s => { const a = analyse(s); assert.ok(a.claims.length >= 1); });
});

console.log(`\n${n}/${n} ClaimLens tests passed.`);
