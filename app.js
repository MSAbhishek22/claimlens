/* ClaimLens — transparent, rule-based claim screening.
   No network, no model, no storage of text off-device.
   Pure functions are exported for Node tests; browser wiring runs only
   when `document` exists. */
'use strict';

const PATTERNS = {
  number: /\d+(?:\.\d+)?\s?(%|percent|million|billion|thousand)?/i,
  year: /\b(19|20)\d{2}\b/,
  citation: /(according to|reported by|published in|study by|source:|https?:\/\/|journal of|survey of)/i,
  hedge: /\b(may|might|could|likely|probably|suggests|indicates|appears to|seems|estimated|around|approximately)\b/i,
  absolute: /\b(always|never|proves|proven|guaranteed|100%|certainly|definitely|impossible|everyone knows)\b/i,
  weasel: /(experts say|scientists say|studies show|research shows|many people|it is known|doctors recommend)/i,
  hype: /\b(miracle|revolutionary|breakthrough|best ever|game[- ]changer|secret (trick|hack)|detox|cure-all)\b/i
};

const SIGNAL_LABELS = {
  number: ['+15 · Specific number or statistic', 'pos'],
  year: ['+10 · Date or year given', 'pos'],
  citation: ['+10 · Named source / citation', 'pos'],
  hedge: ['+10 · Calibrated hedging', 'pos'],
  absolute: ['−15 · Absolute / overclaiming language', 'neg'],
  weasel: ['−10 · Weasel attribution (unnamed authority)', 'neg'],
  hype: ['−10 · Hype / marketing language', 'neg'],
  short: ['−5 · Too short to check', 'neg']
};

const SIGNAL_POINTS = { number: 15, year: 10, citation: 10, hedge: 10, absolute: -15, weasel: -10, hype: -10, short: -5 };

function splitClaims(text) {
  return String(text || '')
    .replace(/\s+/g, ' ')
    .trim()
    .split(/(?<=[.!?])\s+/)
    .map(s => s.trim())
    .filter(s => s.length >= 3);
}

function scoreClaim(text) {
  const signals = [];
  let score = 50;
  for (const key of ['number', 'year', 'citation', 'hedge', 'absolute', 'weasel', 'hype']) {
    if (PATTERNS[key].test(text)) {
      signals.push(key);
      score += SIGNAL_POINTS[key];
    }
  }
  if (text.split(/\s+/).length < 6) { signals.push('short'); score += SIGNAL_POINTS.short; }
  score = Math.max(0, Math.min(100, score));
  return { text, score, signals, band: bandFor(score) };
}

function bandFor(score) {
  if (score >= 70) return 'Solid';
  if (score >= 40) return 'Shaky';
  return 'Unverifiable';
}

function analyse(text) {
  const claims = splitClaims(text).map(scoreClaim);
  if (!claims.length) return { claims: [], overall: null };
  const overall = Math.round(claims.reduce((a, c) => a + c.score, 0) / claims.length);
  return { claims, overall, band: bandFor(overall) };
}

function changeMyMind(claim) {
  if (claim.band === 'Solid') return 'A named source with the raw data, or a replication that disagrees, would move this down.';
  if (claim.band === 'Shaky') return 'A named source, a specific number and a date would move this up; an absolute claim with no source would move it down.';
  return 'Almost anything checkable — a source, a number, a date — would move this up. Right now there is nothing to verify.';
}

function buildBrief(inputText, result) {
  const lines = [];
  lines.push('# ClaimLens decision brief', '');
  lines.push('**Input:** ' + inputText.trim().replace(/\s+/g, ' '), '');
  lines.push(`**Overall score:** ${result.overall}/100 — ${result.band}`, '');
  lines.push('## Claims');
  result.claims.forEach((c, i) => {
    lines.push(`${i + 1}. "${c.text}" — **${c.score}/100 (${c.band})**`);
    c.signals.forEach(s => lines.push(`   - ${SIGNAL_LABELS[s][0]}`));
    lines.push(`   - What would change my mind: ${changeMyMind(c)}`);
  });
  lines.push('', '## Bottom line');
  if (result.band === 'Solid') lines.push('Act on it, but keep the receipt: note the source and the date before you commit.');
  else if (result.band === 'Shaky') lines.push('Do not act on this yet. Ask for the source, the number and the date first.');
  else lines.push('Do not act on this. There is nothing checkable here — treat it as an opinion, not evidence.');
  lines.push('', '_Scored by ClaimLens, a transparent rule-based screen. It measures how checkable and how overclaimed a statement is; it is not a fact-checker._');
  return lines.join('\n');
}

const SAMPLES = [
  'Drinking hot water with lemon every morning guarantees weight loss and detoxes your liver, according to many experts. It is a miracle cure that always works!',
  'A 2024 study by the Indian Council of Medical Research found that 31% of urban adults surveyed reported skipping breakfast at least three times a week. The authors suggest this may be linked to higher evening snacking.',
  'You should probably diversify your investments because markets fluctuate.'
];

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { splitClaims, scoreClaim, bandFor, analyse, buildBrief, changeMyMind, SAMPLES, SIGNAL_LABELS };
}

if (typeof document !== 'undefined') {
  const $ = id => document.getElementById(id);
  const input = $('claim-input'), hint = $('input-hint'), results = $('results');
  const plane = $('plane'), scene = $('scene'), listEl = $('claim-list');
  let current = null, currentInput = '';

  function render(result) {
    results.hidden = false;
    $('score-num').textContent = result.overall;
    $('verdict-label').textContent = result.band === 'Solid' ? 'Solid — worth acting on' : result.band === 'Shaky' ? 'Shaky — check before acting' : 'Unverifiable — do not act on this';
    $('verdict-text').textContent = result.claims.length === 1
      ? 'One checkable claim found.'
      : `${result.claims.length} checkable claims found. Average score ${result.overall}/100.`;
    plane.innerHTML = '';
    listEl.innerHTML = '';
    result.claims.forEach((c, i) => {
      const node = document.createElement('button');
      node.type = 'button';
      node.className = 'node ' + (c.score < 40 ? 'low' : c.score < 70 ? 'mid' : '');
      node.style.left = (12 + (result.claims.length === 1 ? 38 : i * (76 / Math.max(1, result.claims.length - 1)))) + '%';
      node.style.top = (62 - c.score * 0.45) + '%';
      node.style.transform = `translateZ(${c.score * 0.9}px)`;
      node.innerHTML = `<strong>${c.score}</strong><small>claim ${i + 1}</small>`;
      node.setAttribute('aria-label', `Claim ${i + 1}, score ${c.score} out of 100, ${c.band}`);
      node.addEventListener('click', () => selectClaim(i));
      plane.appendChild(node);

      const li = document.createElement('li');
      li.dataset.index = i;
      li.tabIndex = 0;
      const cls = c.score >= 70 ? 'good' : c.score >= 40 ? 'mid' : 'bad';
      li.innerHTML = `<div class="claim-head"><span>“${escapeHtml(c.text)}”</span><span class="score ${cls}">${c.score}/100 · ${c.band}</span></div>` +
        `<ul class="signals">${c.signals.map(s => `<li class="${SIGNAL_LABELS[s][1]}">${escapeHtml(SIGNAL_LABELS[s][0])}</li>`).join('') || '<li>No strong signals either way</li>'}</ul>` +
        `<p class="section-note">What would change my mind: ${escapeHtml(changeMyMind(c))}</p>`;
      li.addEventListener('click', () => selectClaim(i));
      li.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); selectClaim(i); } });
      listEl.appendChild(li);
    });
    $('brief-box').textContent = buildBrief(currentInput, result);
    results.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  function selectClaim(i) {
    plane.querySelectorAll('.node').forEach((n, j) => n.classList.toggle('selected', j === i));
    listEl.querySelectorAll('li').forEach((li, j) => li.classList.toggle('selected', j === i));
    const li = listEl.querySelectorAll('li')[i];
    if (li) li.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function escapeHtml(s) {
    return s.replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
  }

  function saveHistory(entry) {
    try {
      const h = JSON.parse(localStorage.getItem('claimlens-history') || '[]');
      h.unshift(entry);
      localStorage.setItem('claimlens-history', JSON.stringify(h.slice(0, 10)));
      renderHistory();
    } catch (e) { /* storage unavailable — analysis still works */ }
  }

  function renderHistory() {
    let h = [];
    try { h = JSON.parse(localStorage.getItem('claimlens-history') || '[]'); } catch (e) {}
    $('history-count').textContent = h.length ? `(${h.length})` : '';
    $('history-list').innerHTML = h.map((e, i) =>
      `<li><span>${escapeHtml(e.text.slice(0, 90))}${e.text.length > 90 ? '…' : ''}</span><span><strong>${e.overall}/100</strong> · ${escapeHtml(e.band)} · ${escapeHtml(e.when)}</span></li>`).join('') ||
      '<li>No past analyses yet — they stay on this device only.</li>';
  }

  $('analyse-btn').addEventListener('click', () => {
    const text = input.value.trim();
    if (!text) { hint.textContent = 'Paste a claim first — even one sentence works.'; input.focus(); return; }
    hint.textContent = '';
    currentInput = text;
    current = analyse(text);
    if (!current.claims.length) { hint.textContent = 'Could not split that into a checkable claim — try a full sentence.'; return; }
    render(current);
    saveHistory({ text, overall: current.overall, band: current.band, when: new Date().toLocaleString('en-IN') });
  });

  $('clear-btn').addEventListener('click', () => {
    input.value = ''; hint.textContent = ''; results.hidden = true; input.focus();
  });

  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = SAMPLES[Number(chip.dataset.sample)];
      $('analyse-btn').click();
    });
  });

  $('export-btn').addEventListener('click', () => {
    if (!current) return;
    const blob = new Blob([buildBrief(currentInput, current)], { type: 'text/markdown' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'claimlens-brief.md';
    a.click();
    URL.revokeObjectURL(a.href);
  });

  $('copy-btn').addEventListener('click', async () => {
    if (!current) return;
    try { await navigator.clipboard.writeText(buildBrief(currentInput, current)); $('copy-btn').textContent = 'Copied ✓'; setTimeout(() => { $('copy-btn').textContent = 'Copy brief'; }, 1500); }
    catch (e) { $('copy-btn').textContent = 'Copy failed — use Download'; }
  });

  $('history-clear').addEventListener('click', () => {
    try { localStorage.removeItem('claimlens-history'); } catch (e) {}
    renderHistory();
  });

  // Drag to tilt the 3D evidence plane (pointer events, transform-only).
  let dragging = false, startX = 0, startZ = -8, tilt = -8;
  scene.addEventListener('pointerdown', e => { dragging = true; startX = e.clientX; scene.setPointerCapture(e.pointerId); });
  scene.addEventListener('pointermove', e => {
    if (!dragging) return;
    tilt = Math.max(-40, Math.min(30, startZ + (e.clientX - startX) * 0.15));
    plane.style.transform = `rotateX(58deg) rotateZ(${tilt}deg)`;
  });
  const endDrag = () => { dragging = false; startZ = tilt; };
  scene.addEventListener('pointerup', endDrag);
  scene.addEventListener('pointercancel', endDrag);

  renderHistory();
}
