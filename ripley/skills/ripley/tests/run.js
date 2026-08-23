#!/usr/bin/env node
/*  Ripley — deterministic tests.
 *
 *      node tests/run.js            all of it
 *      node tests/run.js --verbose  print every assertion, not just failures
 *
 *  No network, no cost, no model. Three kinds of check:
 *
 *    invariants   things that must hold for any text at all — offsets land
 *                 inside the string, tags sum to the word count, analysing the
 *                 same text twice gives the same answer.
 *    corpus       expectations in expect.json: which language, which tells
 *                 must fire, which must not.
 *    parity       the English rhythm numbers still match rhythm.py, which is
 *                 what makes them comparable to the measured baselines.
 *
 *  The model-graded half lives in oracle.js and costs money. This half is the
 *  one that should run every time you touch a rule.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var Ripley = require(path.join(__dirname, '..', 'app', 'engine.js'));

var ROOT = path.join(__dirname, '..');
var VERBOSE = process.argv.indexOf('--verbose') !== -1;
var ESC = String.fromCharCode(27);
var COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
function paint(c, s) { return COLOR ? ESC + '[' + c + 'm' + s + ESC + '[0m' : String(s); }

var pass = 0, fail = 0, failures = [];

function ok(cond, name, detail) {
  if (cond) {
    pass++;
    if (VERBOSE) console.log('  ' + paint('32', 'ok') + '   ' + name);
  } else {
    fail++;
    failures.push({ name: name, detail: detail });
    console.log('  ' + paint('31', 'FAIL') + ' ' + name + (detail ? '\n         ' + detail : ''));
  }
}

function eq(actual, expected, name) {
  ok(actual === expected, name, 'expected ' + JSON.stringify(expected) + ', got ' + JSON.stringify(actual));
}

function near(actual, expected, tol, name) {
  ok(Math.abs(actual - expected) <= tol, name,
    'expected ' + expected + ' ±' + tol + ', got ' + actual);
}

function group(title) { console.log('\n' + paint('1', title)); }

/* ------------------------------------------------------------- invariants */

var SAMPLES = {
  english: 'In today\'s world, it is important to note that studies show delve is a word.\n\n' +
    'The catch? Nobody agrees. Think of it like a bridge, showcasing the problem.',
  ukrainian: 'У сучасному світі важливо зазначити, що дослідження показують результат.\n\n' +
    'Це не просто інструмент, а спосіб мислення. Підсумовуючи, все зрозуміло.',
  russian: 'В современном мире важно отметить, что исследования показывают результат.',
  german: 'Die meisten Texte sind schlechter als nötig, weil der Autor beeindrucken will.',
  japanese: 'ほとんどの文章は必要以上に悪い。書き手が印象的に聞こえようとしているからだ。',
  empty: '',
  blank: '   \n\n  \n',
  code: '```js\nconst delve = "in today\'s world"; // it is important to note\n```\n',
  markdown: '# Heading\n\n[a link](https://example.com/in-today-s-world) and `delve` inline.\n',
  emoji: '- 🚀 delve\n- ✅ tapestry\n- 💡 testament\n',
  numbers: 'Revenue fell 32% to $1.4bn in 2019, then rose 8.5% the year after that.',
  longWord: 'Supercalifragilisticexpialidocious '.repeat(40)
};

group('invariants');

Object.keys(SAMPLES).forEach(function (name) {
  var text = SAMPLES[name];
  var r;
  try { r = Ripley.analyse(text); }
  catch (e) { ok(false, name + ': analyse does not throw', e.message); return; }
  ok(true, name + ': analyse does not throw');

  /* every flagged span must sit inside the text and quote it faithfully */
  var badSpan = null;
  r.flags.forEach(function (f) {
    if (f.start < 0 || f.end > text.length || f.end <= f.start) { badSpan = badSpan || f; }
    var slice = text.slice(f.start, f.end).replace(/\s+/g, ' ');
    if (slice !== f.text) badSpan = badSpan || f;
  });
  ok(!badSpan, name + ': flag offsets index the original text',
    badSpan ? JSON.stringify(badSpan) : '');

  /* token offsets too */
  var badTok = r.pos.tokens.filter(function (t) {
    return t.end > text.length || t.start < 0 || text.slice(t.start, t.end) !== t.raw;
  })[0];
  ok(!badTok, name + ': token offsets index the original text',
    badTok ? JSON.stringify(badTok) : '');

  /* the tag counts have to add up to the word count */
  var sum = 0;
  Object.keys(r.pos.counts).forEach(function (k) { sum += r.pos.counts[k]; });
  eq(sum, r.meta.words, name + ': word classes sum to the word count');

  /* every token carries a tag and a provenance */
  var untagged = r.pos.tokens.filter(function (t) { return !t.tag || !t.src; }).length;
  eq(untagged, 0, name + ': every token has a tag and a source');

  /* the rules are module-level global regexes. If any of them leaks lastIndex
     between runs, the second analysis silently loses hits. */
  var again = Ripley.analyse(text);
  eq(JSON.stringify(again.flags), JSON.stringify(r.flags), name + ': analysing twice gives the same flags');
  eq(again.meta.words, r.meta.words, name + ': analysing twice gives the same word count');
});

/* masking: nothing inside code or a URL should ever be flagged */
group('masking');
var codeR = Ripley.analyse(SAMPLES.code);
eq(codeR.flags.length, 0, 'fenced code produces no flags');
eq(codeR.meta.words, 0, 'fenced code contributes no words');
var mdR = Ripley.analyse(SAMPLES.markdown);
eq(mdR.flags.filter(function (f) { return f.cat === 'opener'; }).length, 0,
  'a tell inside a link URL is not flagged');
eq(mdR.flags.filter(function (f) { return f.cat === 'delve'; }).length, 0,
  'a tell inside inline code is not flagged');
ok(Ripley.analyse(SAMPLES.emoji).structure.layout.emojiBullets === 3,
  'emoji bullets are counted from the raw text, not the masked stream');
ok(Ripley.analyse(SAMPLES.numbers).pos.counts.NUM >= 4,
  'numbers are tokenised and tagged NUM');

/* detection */
group('language detection');
[['english', 'en'], ['ukrainian', 'uk'], ['russian', 'ru']].forEach(function (pair) {
  eq(Ripley.analyse(SAMPLES[pair[0]]).language.code, pair[1], 'detects ' + pair[1]);
});
eq(Ripley.analyse(SAMPLES.german).language.code, null, 'German is refused, not called English');
eq(Ripley.analyse(SAMPLES.german).language.script, 'latin', 'German is still recognised as Latin script');
eq(Ripley.analyse(SAMPLES.japanese).language.code, null, 'Japanese is refused');
eq(Ripley.analyse(SAMPLES.english, { lang: 'uk' }).language.method, 'told', 'an explicit --lang overrides detection');
eq(Ripley.analyse(SAMPLES.german).verdict.level, 'unknown', 'no pack means no verdict');
ok(Ripley.analyse(SAMPLES.german).structure.paragraphs.count > 0,
  'structure is still measured without a pack');

/* the packs themselves */
group('language packs');
var L = Ripley.languages;
L.codes().forEach(function (c) {
  var p = L.PACKS[c];
  ok(!!p.open && !!p.lex && !!p.rules, c + ': pack has lex, open and rules');
  ok(p.tellsFrom === 'measured' || p.tellsFrom === 'translated', c + ': pack declares tell provenance');
  ok(!p.baseline || p.tellsFrom === 'measured', c + ': only a measured pack ships baselines');
  var dupes = {}, dup = null;
  p.rules.forEach(function (rule) {
    ok(rule.re.flags.indexOf('g') !== -1, c + ': rule regexes are global (' + rule.cat + ')');
    if (rule.re.flags.indexOf('u') === -1 && p.script !== 'latin') {
      dup = dup || rule.cat;
    }
  });
  ok(!dup, c + ': non-Latin rules use the unicode flag', dup || '');
});

/* ------------------------------------------------------------------ corpus */

group('corpus');
var spec = JSON.parse(fs.readFileSync(path.join(__dirname, 'expect.json'), 'utf8'));

spec.cases.forEach(function (c) {
  var file = path.join(__dirname, c.file);
  var label = path.basename(c.file);
  if (!fs.existsSync(file)) { ok(false, label + ': file exists', file); return; }
  var r = Ripley.analyse(fs.readFileSync(file, 'utf8'));

  eq(r.language.code, c.lang === undefined ? null : c.lang, label + ': language is ' + c.lang);
  if (c.verdict) eq(r.verdict.level, c.verdict, label + ': verdict is ' + c.verdict);
  if (c.noPack) eq(r.language.tagged, false, label + ': runs without a pack');

  var hardCats = r.categories.filter(function (x) { return x.hard > 0; }).length;
  if (c.minHardCategories !== undefined) {
    ok(hardCats >= c.minHardCategories, label + ': at least ' + c.minHardCategories + ' hard categories',
      'got ' + hardCats);
  }
  if (c.maxHardCategories !== undefined) {
    ok(hardCats <= c.maxHardCategories, label + ': at most ' + c.maxHardCategories + ' hard categories',
      'got ' + hardCats + ' — ' + r.categories.filter(function (x) { return x.hard > 0; })
        .map(function (x) { return x.id; }).join(', '));
  }
  Object.keys(c.must || {}).forEach(function (cat) {
    var want = c.must[cat];
    var hit = r.flags.filter(function (f) {
      return f.cat === cat && f.text.toLowerCase().indexOf(want.toLowerCase()) !== -1;
    })[0];
    ok(!!hit, label + ': ' + cat + ' flags ' + JSON.stringify(want),
      'flags in that category: ' + JSON.stringify(r.flags.filter(function (f) { return f.cat === cat; })
        .map(function (f) { return f.text; })));
  });
  (c.mustNot || []).forEach(function (cat) {
    var hits = r.flags.filter(function (f) { return f.cat === cat && f.sev === 'hard'; });
    eq(hits.length, 0, label + ': no hard ' + cat + ' flags');
  });
  if (c.layout) {
    if (c.layout.minFurnitureHeadings !== undefined) {
      ok(r.structure.layout.furnitureHeadings.length >= c.layout.minFurnitureHeadings,
        label + ': furniture headings found',
        'got ' + r.structure.layout.furnitureHeadings.length);
    }
    if (c.layout.minTitleCaseHeadings !== undefined) {
      ok(r.structure.layout.titleCaseHeadings.length >= c.layout.minTitleCaseHeadings,
        label + ': Title Case headings found',
        'got ' + r.structure.layout.titleCaseHeadings.length);
    }
  }
  if (c.rhythm) {
    var rh = r.structure.rhythm;
    eq(rh.sentences, c.rhythm.sentences, label + ': rhythm sentence count');
    eq(rh.paragraphs, c.rhythm.paragraphs, label + ': rhythm paragraph count');
    near(rh.spread, c.rhythm.spread, 0.01, label + ': rhythm spread');
    near(rh.shortShare, c.rhythm.short, 0.1, label + ': share under 9 words');
    near(rh.bandShare, c.rhythm.band, 0.1, label + ': share in the 12-25 band');
    eq(rh.min, c.rhythm.min, label + ': shortest sentence');
    eq(rh.max, c.rhythm.max, label + ': longest sentence');
  }
});

/* --------------------------------------------------------------- parity */

group('parity with rhythm.py');
var py = require('child_process').spawnSync('python3',
  [path.join(ROOT, 'scripts', 'rhythm.py'), path.join(ROOT, 'examples', 'counting-sentences.md')],
  { encoding: 'utf8' });

if (py.status !== 0) {
  console.log('  ' + paint('2', 'skipped — python3 not available'));
} else {
  var out = py.stdout;
  var js = Ripley.analyse(fs.readFileSync(path.join(ROOT, 'examples', 'counting-sentences.md'), 'utf8')).structure.rhythm;
  function grab(re) { var m = out.match(re); return m ? parseFloat(m[1]) : NaN; }
  eq(grab(/—\s+(\d+) sentences/), js.sentences, 'same sentence count as rhythm.py');
  eq(grab(/(\d+) paragraphs/), js.paragraphs, 'same paragraph count as rhythm.py');
  near(grab(/spread \(sd\/mean\)\s+([\d.]+)/), js.spread, 0.02, 'same spread as rhythm.py');
  near(grab(/under 9 words\s+([\d.]+)%/), js.shortShare, 0.2, 'same short share as rhythm.py');
  near(grab(/in the 12-25 band\s+([\d.]+)%/), js.bandShare, 0.2, 'same 12-25 band as rhythm.py');
  var mm = out.match(/shortest \/ longest\s+(\d+) \/ (\d+)/);
  eq(parseInt(mm[1], 10), js.min, 'same shortest sentence as rhythm.py');
  eq(parseInt(mm[2], 10), js.max, 'same longest sentence as rhythm.py');
}

/* ----------------------------------------------------------------- done */

console.log('');
if (fail === 0) {
  console.log(paint('32', '  ' + pass + ' checks passed.'));
} else {
  console.log(paint('31', '  ' + fail + ' failed') + ', ' + pass + ' passed.');
}
console.log('');
process.exit(fail === 0 ? 0 : 1);
