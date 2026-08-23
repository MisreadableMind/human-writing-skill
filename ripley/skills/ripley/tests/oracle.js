#!/usr/bin/env node
/*  Ripley — the model-graded half of the tests.
 *
 *      node tests/oracle.js                  one batched claude -p call
 *      node tests/oracle.js --model haiku    cheaper, blunter
 *      node tests/oracle.js --dry-run        print the prompt, spend nothing
 *      node tests/oracle.js --json           machine-readable agreement report
 *
 *  Why this exists. The heuristics in app/ can be checked against fixed
 *  expectations (that is tests/run.js) but not against judgement: whether a
 *  word really is an adverb, whether a phrase really reads as machine prose.
 *  This asks Claude the same questions and reports where the two disagree.
 *
 *  What it is NOT. Claude is not ground truth. Two fallible judges agreeing
 *  tells you they share a bias as easily as it tells you they are right. Read
 *  the disagreements, not the percentage.
 *
 *  Why one call. Every `claude -p` invocation carries 15-20k tokens of fixed
 *  scaffolding before it reads a word of yours, and no flag removes it. Six
 *  texts in one call pay that once; six calls pay it six times.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var spawnSync = require('child_process').spawnSync;
var Ripley = require(path.join(__dirname, '..', 'app', 'engine.js'));

var argv = process.argv.slice(2);
var opts = { model: 'sonnet', dry: false, json: false, limit: 0, sample: 14 };
for (var i = 0; i < argv.length; i++) {
  var a = argv[i];
  if (a === '--model') opts.model = argv[++i];
  else if (a === '--dry-run') opts.dry = true;
  else if (a === '--json') opts.json = true;
  else if (a === '--limit') opts.limit = parseInt(argv[++i], 10);
  else if (a === '--sample') opts.sample = parseInt(argv[++i], 10);
  else if (a === '--help' || a === '-h') { usage(); process.exit(0); }
}

function usage() {
  console.log([
    '', 'ripley oracle — ask Claude the questions the heuristics cannot check',
    '',
    '  node tests/oracle.js               one batched call (default model: sonnet)',
    '  --model <alias>    haiku | sonnet | opus',
    '  --dry-run          print the prompt and its size, call nothing',
    '  --limit <n>        only the first n texts',
    '  --sample <n>       tokens per text to have tagged (default 14)',
    '  --json             the agreement report as JSON',
    ''
  ].join('\n'));
}

var ESC = String.fromCharCode(27);
var COLOR = process.stdout.isTTY && !process.env.NO_COLOR;
function paint(c, s) { return COLOR ? ESC + '[' + c + 'm' + s + ESC + '[0m' : String(s); }
function pad(s, n) { s = String(s); return s + new Array(Math.max(1, n - s.length + 1)).join(' '); }
function padL(s, n) { s = String(s); return new Array(Math.max(1, n - s.length + 1)).join(' ') + s; }

/* ------------------------------------------------------------------ corpus */

function corpus() {
  var dir = path.join(__dirname, 'corpus');
  var files = fs.readdirSync(dir)
    .filter(function (f) { return /\.md$/.test(f); }).sort()
    .map(function (f) { return path.join(dir, f); });
  /* the worked example in the skill itself is the one text here that a person
     actually wrote as prose rather than as a fixture */
  files.push(path.join(__dirname, '..', 'examples', 'counting-sentences.md'));
  var out = files.map(function (full) {
    return { id: path.basename(full, '.md'), file: full, text: fs.readFileSync(full, 'utf8') };
  });
  return opts.limit ? out.slice(0, opts.limit) : out;
}

/* Pick tokens spread across the text rather than the first n, so the sample is
   not all opening-paragraph vocabulary. */
function sampleTokens(r, n) {
  var content = r.pos.tokens.filter(function (t) {
    return t.tag === 'NOUN' || t.tag === 'VERB' || t.tag === 'ADJ' || t.tag === 'ADV';
  });
  if (content.length <= n) return content;
  var step = content.length / n, out = [];
  for (var i = 0; i < n; i++) out.push(content[Math.floor(i * step)]);
  return out;
}

function contextOf(text, tok) {
  var from = Math.max(0, tok.start - 60), to = Math.min(text.length, tok.end + 60);
  return text.slice(from, to).replace(/\s+/g, ' ').trim();
}

/* ------------------------------------------------------------------ prompt */

function buildPrompt(cases) {
  var lines = [];
  lines.push('You are grading a prose analyser. Answer only with JSON.');
  lines.push('');
  lines.push('For each TEXT below, return:');
  lines.push('  language  - ISO 639-1 code of the language it is written in.');
  lines.push('  tells     - phrases in it that read as machine-written, quoted EXACTLY');
  lines.push('              as they appear (substrings of the text, verbatim). Look for:');
  lines.push('              throat-clearing openers, "not just X but Y", empty inflation');
  lines.push('              words, hedging that says nothing, unattributed appeals to');
  lines.push('              authority, recap conclusions, announced analogies, telling the');
  lines.push('              reader what to find interesting. List EVERY occurrence,');
  lines.push('              including repeats of the same word — this is being compared');
  lines.push('              against an exhaustive list, so a representative sample will');
  lines.push('              read as a miss. Return [] if the prose reads like a person');
  lines.push('              wrote it. Do not invent tells to be helpful.');
  lines.push('  tags      - a part-of-speech tag for each listed token, in order, using');
  lines.push('              exactly one of: NOUN VERB ADJ ADV PROPN NUM DET PRON PREP');
  lines.push('              CONJ AUX MODAL. Tag the token as used in the context shown.');
  lines.push('');
  lines.push('Reply with one JSON object: {"<id>": {"language": "..", "tells": [".."],');
  lines.push('"tags": ["..", ".."]}, ...}. No prose, no code fence.');
  lines.push('');

  cases.forEach(function (c) {
    lines.push('=== TEXT ' + c.id + ' ===');
    lines.push(c.text.trim());
    lines.push('');
    lines.push('--- tokens to tag for ' + c.id + ' (' + c.sample.length + ', in order) ---');
    c.sample.forEach(function (t, i) {
      lines.push((i + 1) + '. "' + t.raw + '"  in: ...' + contextOf(c.text, t) + '...');
    });
    lines.push('');
  });
  return lines.join('\n');
}

/* -------------------------------------------------------------------- call */

function ask(prompt) {
  var args = ['-p', '--model', opts.model, '--output-format', 'json',
              '--allowed-tools', '', '--strict-mcp-config', '--setting-sources', ''];
  var res = spawnSync('claude', args, {
    input: prompt, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024
  });
  if (res.error) throw new Error('could not run `claude`: ' + res.error.message);
  if (res.status !== 0) throw new Error('claude exited ' + res.status + ': ' + (res.stderr || '').slice(0, 400));
  var envelope;
  try { envelope = JSON.parse(res.stdout); }
  catch (e) { throw new Error('claude did not return JSON: ' + res.stdout.slice(0, 300)); }
  return envelope;
}

function parseAnswer(textOut) {
  var s = String(textOut).trim();
  s = s.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/, '');
  var first = s.indexOf('{'), last = s.lastIndexOf('}');
  if (first === -1 || last === -1) throw new Error('no JSON object in the reply');
  return JSON.parse(s.slice(first, last + 1));
}

/* ---------------------------------------------------------------- compare */

function norm(s) { return String(s).toLowerCase().replace(/\s+/g, ' ').trim(); }

function compare(cases, answer) {
  var lang = { hit: 0, total: 0, misses: [] };
  var tells = { modelSaid: 0, engineAlsoFound: 0, engineSaid: 0, modelAlsoFound: 0,
                onlyModel: [], onlyEngine: [] };
  var tags = { total: 0, agree: 0, skipped: 0, byLang: {}, confusion: {}, examples: [] };

  cases.forEach(function (c) {
    var a = answer[c.id];
    if (!a) return;
    var tagged = c.report.language.tagged;

    /* language */
    lang.total++;
    var got = c.report.language.code;
    var want = a.language ? String(a.language).toLowerCase().slice(0, 2) : null;
    var packed = Ripley.languages.codes().indexOf(want) !== -1;
    /* the engine is right to say null for a language it has no pack for */
    if (got === want || (got === null && !packed)) lang.hit++;
    else lang.misses.push({ id: c.id, engine: got, model: want });

    /* Tells. The model quotes verbatim, so locate each quote in the text and
       overlap the spans. String containment fails on the common case where the
       two sides took the same tell with different edges — "it's not just about
       X" against "not just about X — it's" contains neither. */
    if (!tagged) { return; }
    var flat = norm(c.text);
    function spanOf(quote) {
      var at = flat.indexOf(norm(quote));
      return at === -1 ? null : { start: at, end: at + norm(quote).length };
    }
    var engineSpans = c.report.flags.map(function (f) {
      return { flag: f, span: spanOf(f.text) };
    });
    var modelSpans = (a.tells || []).filter(Boolean).map(function (t) {
      return { text: norm(t), span: spanOf(t) };
    });
    function overlaps(x, y) {
      if (x && y) return x.start < y.end && y.start < x.end;
      return false;
    }

    modelSpans.forEach(function (m) {
      tells.modelSaid++;
      var found = engineSpans.some(function (e) {
        return overlaps(m.span, e.span) ||
               (!m.span && norm(e.flag.text).indexOf(m.text) !== -1);
      });
      if (found) tells.engineAlsoFound++;
      else tells.onlyModel.push({ id: c.id, text: m.text, located: !!m.span });
    });
    engineSpans.forEach(function (e) {
      tells.engineSaid++;
      var found = modelSpans.some(function (m) {
        return overlaps(m.span, e.span) || m.text.indexOf(norm(e.flag.text)) !== -1;
      });
      if (found) tells.modelAlsoFound++;
      else tells.onlyEngine.push({ id: c.id, cat: e.flag.cat, text: e.flag.text });
    });

    /* Tags. A text with no pack was never tagged — every token came back NOUN
       by default. Scoring that would just measure how often the default is
       right, and would drag the real packs' number down with it. */
    if (!tagged) { tags.skipped += c.sample.length; return; }
    var code = c.report.language.code;
    tags.byLang[code] = tags.byLang[code] || { total: 0, agree: 0 };

    var got2 = c.sample, want2 = a.tags || [];
    for (var i = 0; i < Math.min(got2.length, want2.length); i++) {
      var mine = got2[i].tag, theirs = String(want2[i]).toUpperCase().trim();
      tags.total++; tags.byLang[code].total++;
      if (mine === theirs) { tags.agree++; tags.byLang[code].agree++; }
      else {
        var key = mine + '→' + theirs;
        tags.confusion[key] = (tags.confusion[key] || 0) + 1;
        if (tags.examples.length < 24) {
          tags.examples.push({ id: c.id, word: got2[i].raw, engine: mine,
            model: theirs, src: got2[i].src, lang: code });
        }
      }
    }
  });
  return { lang: lang, tells: tells, tags: tags };
}

/* ------------------------------------------------------------------ report */

function pctOf(a, b) { return b ? Math.round((1000 * a) / b) / 10 : 0; }

function print(cmp, envelope, cases) {
  console.log('');
  console.log(paint('1', 'ORACLE') + '  ' + cases.length + ' texts, one call, model ' + opts.model);
  if (envelope) {
    var u = envelope.usage || {};
    console.log('  ' + paint('2', 'in ' + (u.input_tokens || 0) + ' + cache ' +
      ((u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0)) +
      ', out ' + (u.output_tokens || 0) + ', ' + envelope.duration_api_ms + 'ms, $' +
      (Math.round((envelope.total_cost_usd || 0) * 1000) / 1000)));
  }

  console.log('');
  console.log(paint('1', 'LANGUAGE') + '   ' + cmp.lang.hit + '/' + cmp.lang.total +
    ' agree  (' + pctOf(cmp.lang.hit, cmp.lang.total) + '%)');
  cmp.lang.misses.forEach(function (m) {
    console.log('  ' + paint('33', '-') + ' ' + pad(m.id, 22) + 'engine ' + m.engine + ', model ' + m.model);
  });

  console.log('');
  console.log(paint('1', 'TELLS'));
  console.log('  ' + pad('the model flagged', 24) + padL(cmp.tells.modelSaid, 4) +
    '   of which the engine also caught ' + cmp.tells.engineAlsoFound +
    '  (' + pctOf(cmp.tells.engineAlsoFound, cmp.tells.modelSaid) + '%)');
  console.log('  ' + pad('the engine flagged', 24) + padL(cmp.tells.engineSaid, 4) +
    '   of which the model also named  ' + cmp.tells.modelAlsoFound +
    '  (' + pctOf(cmp.tells.modelAlsoFound, cmp.tells.engineSaid) + '%)');
  if (cmp.tells.onlyModel.length) {
    console.log('');
    console.log('  ' + paint('33', 'the model saw, the rules missed') + paint('2', '  — candidates for new rules'));
    cmp.tells.onlyModel.slice(0, 14).forEach(function (m) {
      console.log('    ' + pad(m.id, 16) + JSON.stringify(m.text.slice(0, 62)));
    });
    if (cmp.tells.onlyModel.length > 14) console.log('    ' + paint('2', '... and ' + (cmp.tells.onlyModel.length - 14) + ' more'));
  }
  if (cmp.tells.onlyEngine.length) {
    console.log('');
    console.log('  ' + paint('33', 'the rules fired, the model did not') +
      paint('2', '  — some are false positives, some are'));
    console.log('  ' + paint('2', '  the model declining to enumerate a word it already listed once'));
    cmp.tells.onlyEngine.slice(0, 14).forEach(function (m) {
      console.log('    ' + pad(m.id, 16) + pad(m.cat, 13) + JSON.stringify(m.text.slice(0, 48)));
    });
    if (cmp.tells.onlyEngine.length > 14) console.log('    ' + paint('2', '... and ' + (cmp.tells.onlyEngine.length - 14) + ' more'));
  }

  console.log('');
  console.log(paint('1', 'WORD CLASSES') + '   ' + cmp.tags.agree + '/' + cmp.tags.total +
    ' agree  (' + pctOf(cmp.tags.agree, cmp.tags.total) + '%)' +
    (cmp.tags.skipped ? paint('2', '   ' + cmp.tags.skipped + ' tokens skipped: no pack') : ''));
  Object.keys(cmp.tags.byLang).forEach(function (code) {
    var b = cmp.tags.byLang[code];
    console.log('    ' + pad(code, 6) + padL(b.agree + '/' + b.total, 8) +
      padL(pctOf(b.agree, b.total) + '%', 8));
  });
  var pairs = Object.keys(cmp.tags.confusion).sort(function (a, b) {
    return cmp.tags.confusion[b] - cmp.tags.confusion[a];
  }).slice(0, 8);
  pairs.forEach(function (k) {
    console.log('    ' + pad(k, 16) + padL(cmp.tags.confusion[k], 3) + paint('2', '   engine → model'));
  });
  if (cmp.tags.examples.length) {
    console.log('');
    cmp.tags.examples.slice(0, 10).forEach(function (e) {
      console.log('    ' + pad(e.id, 16) + pad(JSON.stringify(e.word), 18) +
        pad(e.engine + ' vs ' + e.model, 16) + paint('2', 'engine source: ' + e.src));
    });
  }

  console.log('');
  console.log(paint('2', '  Agreement, not accuracy. Claude is a second opinion, not ground'));
  console.log(paint('2', '  truth: where both are wrong in the same direction this reports'));
  console.log(paint('2', '  100%. The rows worth reading are the disagreements.'));
  console.log(paint('2', '  The two tell percentages are not precision and recall. The'));
  console.log(paint('2', '  engine enumerates exhaustively and the model does what it likes,'));
  console.log(paint('2', '  so the second number runs low even when both are right.'));
  console.log('');
}

/* ---------------------------------------------------------------------- go */

var cases = corpus().map(function (c) {
  c.report = Ripley.analyse(c.text);
  c.sample = sampleTokens(c.report, opts.sample);
  return c;
});

var prompt = buildPrompt(cases);

if (opts.dry) {
  console.log(prompt);
  console.error('');
  console.error('  ' + cases.length + ' texts, ' + prompt.length + ' chars, roughly ' +
    Math.round(prompt.length / 3.6) + ' tokens of content.');
  console.error('  Add 15-20k for the fixed claude -p scaffolding, which no flag removes.');
  console.error('');
  process.exit(0);
}

var envelope, answer;
try {
  envelope = ask(prompt);
  answer = parseAnswer(envelope.result);
} catch (e) {
  console.error('\n  ' + paint('31', 'oracle failed: ') + e.message);
  console.error('  Run with --dry-run to see the prompt without spending anything.\n');
  process.exit(1);
}

var cmp = compare(cases, answer);
var out = {
  model: opts.model,
  texts: cases.length,
  cost_usd: envelope.total_cost_usd,
  usage: envelope.usage,
  language: cmp.lang,
  tells: cmp.tells,
  tags: { total: cmp.tags.total, agree: cmp.tags.agree, confusion: cmp.tags.confusion, examples: cmp.tags.examples }
};
fs.writeFileSync(path.join(__dirname, 'oracle-report.json'), JSON.stringify(out, null, 2));

if (opts.json) console.log(JSON.stringify(out, null, 2));
else print(cmp, envelope, cases);
