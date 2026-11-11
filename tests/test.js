'use strict';
const assert = require('assert');
const { splitClaims, scoreClaim, bandFor, analyse, buildBrief, SAMPLES, VIRAL_CLAIM } = require('../app.js');

let n = 0, h = 0;
function check(name, fn) { fn(); n++; console.log('PASS:', name); }
function harden(name, fn) { fn(); n++; h++; console.log('PASS [hardening]:', name); }

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

// ---------------------------------------------------------------------------
// HARDENING — poison tests. Each input is a deliberately corrupted claim
// (fabricated citation, misquoted source, invented statistic, cherry-picked
// excerpt). The validator is a signal-based screen, NOT a fact-checker: it
// cannot verify whether a named journal exists. What it CAN prove, and what
// these tests assert, is that it never stamps a corrupted claim Solid — it
// flags the corruption with a cited signal and its brief refuses to act.
// Paired clean controls prove the same topic scores Solid when properly
// sourced, so the rubric discriminates instead of distrusting everything.
// ---------------------------------------------------------------------------
const POISON = {
  fabricatedCitation: 'A new study proves drinking this tea burns 500 calories a day and it always works, experts confirm.',
  misquotedSource: 'Experts say a WHO survey proves coffee causes cancer — it is guaranteed, stop drinking it now!',
  inventedStatistic: '87.3% of users report complete recovery within 3 days — doctors recommend it, it always works!',
  cherryPicked: 'In one trial, hospital admissions fell 60% — scientists say this proves the treatment is a miracle breakthrough for everyone!'
};
const CLEAN = {
  sourcedStatistic: 'According to a 2023 survey of 12,000 households published in the National Health Journal, 42% reported using telemedicine at least once. The authors suggest uptake may keep rising.',
  sourcedTrial: 'A 2022 randomised trial reported in the Journal of Clinical Medicine found admissions fell 18% among 4,000 patients over six months. The authors note the result may not generalise to other settings.',
  sourcedRecovery: 'According to a 2023 trial published in the Journal of Rehabilitation Medicine, 42% of 1,200 patients reported improvement within 3 days. The authors suggest results may vary by condition.'
};

harden('poison 1/4 fabricated citation: claims a study, names nothing checkable — flagged, never Solid', () => {
  const r = scoreClaim(POISON.fabricatedCitation);
  assert.strictEqual(r.score, 40, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Shaky');
  assert.ok(r.signals.includes('absolute'), 'missing absolute signal: ' + r.signals);
  assert.ok(r.signals.includes('unsourced'), 'missing unsourced-statistic signal: ' + r.signals);
  const b = buildBrief(POISON.fabricatedCitation, analyse(POISON.fabricatedCitation));
  assert.ok(b.includes('Do not act on this yet'));
  assert.ok(!b.includes('Act on it'), 'brief must not endorse a poisoned claim');
});
harden('poison 2/4 misquoted source: real institution invoked, no checkable source, absolute distortion — Unverifiable', () => {
  const r = scoreClaim(POISON.misquotedSource);
  assert.strictEqual(r.score, 25, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Unverifiable');
  assert.ok(r.signals.includes('weasel') && r.signals.includes('absolute'));
  const b = buildBrief(POISON.misquotedSource, analyse(POISON.misquotedSource));
  assert.ok(b.includes('Do not act on this.'));
});
harden('poison 3/4 invented statistic: precise figure, no source, no date — Unverifiable with cited reasons', () => {
  const r = scoreClaim(POISON.inventedStatistic);
  assert.strictEqual(r.score, 30, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Unverifiable');
  assert.ok(r.signals.includes('unsourced') && r.signals.includes('weasel') && r.signals.includes('absolute'));
  const b = buildBrief(POISON.inventedStatistic, analyse(POISON.inventedStatistic));
  assert.ok(b.includes('Do not act on this.'));
});
harden('poison 4/4 cherry-picked excerpt: one dramatic partial result, no context — Unverifiable, all five corruption signals', () => {
  const r = scoreClaim(POISON.cherryPicked);
  assert.strictEqual(r.score, 20, 'score was ' + r.score);
  assert.strictEqual(r.band, 'Unverifiable');
  for (const s of ['number', 'unsourced', 'weasel', 'absolute', 'hype']) {
    assert.ok(r.signals.includes(s), 'missing signal ' + s + ': ' + r.signals);
  }
  const b = buildBrief(POISON.cherryPicked, analyse(POISON.cherryPicked));
  assert.ok(b.includes('Do not act on this.'));
});
harden('clean control: same statistic style, properly sourced — the sourced claim scores Solid', () => {
  const a = analyse(CLEAN.sourcedStatistic);
  assert.strictEqual(a.claims[0].band, 'Solid');
  assert.strictEqual(a.claims[0].score, 85, 'score was ' + a.claims[0].score);
});
harden('clean control: same trial style, properly sourced — the sourced claim scores Solid', () => {
  const a = analyse(CLEAN.sourcedTrial);
  assert.strictEqual(a.claims[0].band, 'Solid');
  assert.strictEqual(a.claims[0].score, 85, 'score was ' + a.claims[0].score);
});
harden('pair discrimination: same recovery topic, clean 73 Solid vs poison 30 Unverifiable — gap >= 40', () => {
  const clean = analyse(CLEAN.sourcedRecovery);
  const poison = analyse(POISON.inventedStatistic);
  assert.strictEqual(clean.band, 'Solid');
  assert.strictEqual(poison.band, 'Unverifiable');
  assert.ok(clean.overall - poison.overall >= 40, `gap was ${clean.overall - poison.overall}`);
});
harden('sweep: no poisoned input is ever stamped Solid', () => {
  for (const [name, text] of Object.entries(POISON)) {
    const a = analyse(text);
    assert.notStrictEqual(a.band, 'Solid', name + ' overall was Solid');
    a.claims.forEach(c => assert.notStrictEqual(c.band, 'Solid', name + ' claim was Solid'));
  }
});
harden('unsourced-statistic signal: bare figure flagged, sourced figure not flagged', () => {
  const bare = scoreClaim('Sales rose 40% last quarter.');
  assert.ok(bare.signals.includes('unsourced'), 'bare figure missing unsourced signal: ' + bare.signals);
  const sourced = scoreClaim('According to the 2024 report, sales rose 40% last quarter.');
  assert.ok(!sourced.signals.includes('unsourced'), 'sourced figure wrongly flagged: ' + sourced.signals);
  assert.strictEqual(sourced.band, 'Solid');
});
harden('brief honesty: poison brief carries the not-a-fact-checker disclaimer and a refusal', () => {
  const b = buildBrief(POISON.inventedStatistic, analyse(POISON.inventedStatistic));
  assert.ok(b.includes('not a fact-checker'));
  assert.ok(b.includes('Do not act on this.'));
});
harden('viral demo: one post, three claims the rubric tells apart — 85 Solid / 25 Unverifiable / 45 Shaky', () => {
  const a = analyse(VIRAL_CLAIM);
  assert.strictEqual(a.claims.length, 3);
  assert.deepStrictEqual(a.claims.map(c => c.score), [85, 25, 45]);
  assert.deepStrictEqual(a.claims.map(c => c.band), ['Solid', 'Unverifiable', 'Shaky']);
  assert.strictEqual(a.overall, 52, 'overall was ' + a.overall);
  assert.strictEqual(a.band, 'Shaky');
  const b = buildBrief(VIRAL_CLAIM, a);
  assert.ok(b.includes('38%') && b.includes('miracle'));
});

console.log(`\n${n}/${n} ClaimLens tests passed (${n - h} unit + ${h} hardening: 10 poison + 1 viral demo).`);
