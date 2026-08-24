#!/usr/bin/env node
/*  Ripley — check a draft against the skill's own rules.
 *
 *      node scripts/ripley.js draft.md
 *      cat draft.md | node scripts/ripley.js
 *      node scripts/ripley.js draft.md --json
 *      node scripts/ripley.js draft.md --html report.html
 *
 *  Counts word classes, flags the tells from references/anti-ai-tells.md with a
 *  line and column each, and measures the shape of the whole piece. The rules
 *  live in app/engine.js, which the browser app loads too, so both halves of
 *  this tool disagree about nothing.
 */
'use strict';

var fs = require('fs');
var path = require('path');
var Ripley = require(path.join(__dirname, '..', 'app', 'engine.js'));

var argv = process.argv.slice(2);
var opts = { file: null, json: false, html: null, color: null, quiet: false, lang: null };

for (var i = 0; i < argv.length; i++) {
  var a = argv[i];
  if (a === '--json') opts.json = true;
  else if (a === '--html') opts.html = argv[++i];
  else if (a === '--no-color') opts.color = false;
  else if (a === '--color') opts.color = true;
  else if (a === '--quiet' || a === '-q') opts.quiet = true;
  else if (a === '--lang') opts.lang = argv[++i];
  else if (a === '--languages') { languages(); process.exit(0); }
  else if (a === '--help' || a === '-h') { usage(); process.exit(0); }
  else if (a.charAt(0) === '-' && a.length > 1) { console.error('unknown option ' + a); process.exit(2); }
  else opts.file = a;
}

function usage() {
  console.log([
    '',
    'ripley — check a draft for the tells this skill is about',
    '',
    '  node scripts/ripley.js <file>            report to the terminal',
    '  cat draft.md | node scripts/ripley.js    read stdin',
    '',
    '  --json                 the whole report as JSON',
    '  --html <out.html>      write a standalone highlighted page',
    '  --lang <code>          force a language instead of detecting it',
    '  --languages            list the language packs it ships with',
    '  --quiet                flags only, no counts',
    '  --no-color             plain text',
    ''
  ].join('\n'));
}

function languages() {
  var L = Ripley.languages;
  console.log('');
  console.log('  code  language     script      tells        baselines');
  L.codes().forEach(function (c) {
    var p = L.PACKS[c];
    console.log('  ' + pad(c, 6) + pad(p.name, 13) + pad(p.script, 12) +
      pad(p.tellsFrom, 13) + (p.baseline ? 'measured' : 'none'));
  });
  console.log('');
  console.log('  Text in a language with no pack still gets paragraph shape,');
  console.log('  punctuation and layout. It gets no word classes and no tells.');
  console.log('');
}

/* ------------------------------------------------------------------ colour */

var ESC = String.fromCharCode(27);
var useColor = opts.color === null ? (process.stdout.isTTY && !process.env.NO_COLOR) : opts.color;
function paint(code, s) { return useColor ? ESC + '[' + code + 'm' + s + ESC + '[0m' : String(s); }
function dim(s) { return paint('2', s); }
function bold(s) { return paint('1', s); }
function red(s) { return paint('31', s); }
function yellow(s) { return paint('33', s); }
function green(s) { return paint('32', s); }
function magenta(s) { return paint('35', s); }

function pad(s, n) { s = String(s); return s + new Array(Math.max(1, n - s.length + 1)).join(' '); }
function padL(s, n) { s = String(s); return new Array(Math.max(1, n - s.length + 1)).join(' ') + s; }
function bar(share, width) {
  var n = Math.max(0, Math.min(width, Math.round((share / 100) * width)));
  return new Array(n + 1).join('#') + new Array(width - n + 1).join('.');
}

/* -------------------------------------------------------------------- read */

function read(cb) {
  if (opts.file) return cb(fs.readFileSync(opts.file, 'utf8'), opts.file);
  if (process.stdin.isTTY) { usage(); process.exit(2); }
  var chunks = [];
  process.stdin.on('data', function (d) { chunks.push(d); });
  process.stdin.on('end', function () { cb(Buffer.concat(chunks).toString('utf8'), 'stdin'); });
}

/* ------------------------------------------------------------------ report */

function plural(n, one, many) { return n + ' ' + (n === 1 ? one : many); }

function printReport(r, label) {
  var m = r.meta;
  console.log('');
  var lg = r.language;
  console.log(bold(label) + dim('  -  ') + plural(m.words, 'word', 'words') + ', ' +
    plural(m.sentences, 'sentence', 'sentences') + ', ' +
    plural(m.paragraphs, 'paragraph', 'paragraphs') +
    dim('  [' + (lg.name || (lg.script ? lg.script + ' script, no pack' : 'language unknown')) +
      (lg.tagged && lg.method !== 'told' ? ', ' + Math.round(lg.confidence * 100) + '% sure' : '') +
      (lg.method === 'told' ? ', forced' : '') + ']'));
  if (lg.tagged && lg.confidence < 0.5) {
    console.log(dim('  Low confidence on the language. Force it with --lang ' + lg.available.join('|') + '.'));
  }
  if (!lg.tagged) {
    console.log(dim('  Packs available: ' + lg.available.join(', ') + '. Force one with --lang.'));
  }

  var v = r.verdict;
  var colour = v.level === 'generated' ? red : v.level === 'cluster' ? yellow :
               v.level === 'clean' ? green : dim;
  console.log('');
  console.log('  ' + colour(bold(v.level.toUpperCase())) + '  ' + v.line);
  v.structural.forEach(function (s) { console.log('  ' + dim('-') + ' ' + s); });

  if (!lg.tagged) {
    console.log('');
    console.log(bold('TELLS') + dim('   skipped: no pack for this language'));
  } else if (r.categories.length) {
    console.log('');
    console.log(bold('TELLS') + (lg.tellsFrom === 'translated'
      ? dim('   list translated from English, not measured') : ''));
    r.categories.forEach(function (cat) {
      var head = '  ' + pad(cat.label, 22) + padL(cat.n, 3) +
        dim('  (' + cat.hard + ' hard, ' + cat.soft + ' soft)');
      if (cat.tell) head += dim('   tell #' + cat.tell);
      console.log(head);
      if (opts.quiet) return;
      cat.hits.slice(0, 6).forEach(function (f) {
        var loc = dim(padL(f.line + ':' + f.col, 8));
        var q = '"' + f.text + '"';
        console.log('    ' + loc + '  ' + (f.sev === 'hard' ? red(q) : yellow(q)));
      });
      if (cat.hits.length > 6) {
        console.log('    ' + dim(padL('', 8) + '  ... and ' + (cat.hits.length - 6) + ' more'));
      }
      var first = cat.hits[0];
      if (first && first.fix) console.log('    ' + dim(padL('', 8) + '  -> ' + first.fix));
    });
  } else {
    console.log('');
    console.log(bold('TELLS') + dim('   none of the listed patterns fired'));
  }

  if (opts.quiet) { tail(r); return; }

  var p = r.pos, counts = p.counts;
  if (!lg.tagged) {
    console.log('');
    console.log(bold('WORD CLASSES') + dim('   skipped: ' + lg.taggerNote));
  } else {
  console.log('');
  console.log(bold('WORD CLASSES') + dim('   ' + p.resolved.lex + '% from word lists, ' +
    p.resolved.suffix + '% suffix, ' + p.resolved.context + '% context, ' +
    p.resolved.guess + '% guessed'));
  var order = ['NOUN', 'VERB', 'ADJ', 'ADV', 'PROPN', 'NUM', 'DET', 'PRON', 'PREP', 'CONJ', 'AUX', 'MODAL'];
  var names = { NOUN: 'nouns', VERB: 'verbs', ADJ: 'adjectives', ADV: 'adverbs',
    PROPN: 'proper nouns', NUM: 'numbers', DET: 'determiners', PRON: 'pronouns',
    PREP: 'prepositions', CONJ: 'conjunctions', AUX: 'be / have / do', MODAL: 'modals' };
  order.forEach(function (t) {
    var n = counts[t] || 0, share = m.words ? (100 * n) / m.words : 0;
    var line = '  ' + pad(names[t], 15) + padL(n, 5) + '  ' + padL(share.toFixed(1) + '%', 6) +
      '  ' + dim(bar(share, 24));
    console.log(t === 'ADJ' || t === 'ADV' ? magenta(line) : line);
  });
  console.log('');
  console.log('  ' + pad(lg.adverbLabel, 16) + padL(p.lyAdverbs, 5) + '  ' +
    padL(p.lyPer100.toFixed(2) + '/100w', 12) + dim('  ' + lg.adverbNote));
  console.log('  ' + pad('nominalisations', 16) + padL(p.nominalisations, 5) + '  ' +
    padL(p.nominalPer100.toFixed(2) + '/100w', 12) + dim('  -tion, -ment, -ity: abstraction'));
  console.log('  ' + pad('numbers', 16) + padL(counts.NUM || 0, 5) + '  ' +
    padL(p.numberPer100.toFixed(2) + '/100w', 12) + dim('  concreteness, crudely'));
  console.log('  ' + pad('lexical density', 16) + padL(p.lexicalDensity + '%', 5) +
    dim('              content words as a share of all words'));
  console.log('  ' + dim(lg.taggerNote));
  }

  var s = r.structure, rh = s.rhythm;
  console.log('');
  console.log(bold('STRUCTURE'));
  if (rh.enough) {
    console.log('  rhythm        ' + rh.sentences + ' sentences in ' + rh.paragraphs +
      ' full paragraphs' + dim('   (' + rh.min + '-' + rh.max + ' words)'));
    console.log('    ' + pad('mean', 20) + padL(rh.mean, 6) + ' words');
    console.log('    ' + pad('spread (sd/mean)', 20) + padL(rh.spread.toFixed(2), 6));
    console.log('    ' + pad('under 9 words', 20) + padL(rh.shortShare.toFixed(1) + '%', 6));
    console.log('    ' + pad('in the 12-25 band', 20) + padL(rh.bandShare.toFixed(1) + '%', 6));
    if (rh.baseline) {
      console.log('    ' + dim('measured baselines   spread     <9w   12-25w'));
      rh.baseline.forEach(function (b) {
        console.log('    ' + dim('  ' + pad(b.name, 17) + padL(b.cv.toFixed(2), 6) +
          padL(b.short.toFixed(1) + '%', 8) + padL(b.band.toFixed(1) + '%', 9)));
      });
      rh.flags.forEach(function (f) { console.log('    ' + yellow('-') + ' ' + f); });
      if (!rh.flags.length) console.log('    ' + green('-') + ' spread is in human range');
      else if (rh.flags.length < 3) console.log('    ' + dim('one marker is a style; all three is the tell'));
    } else {
      console.log('    ' + dim('no measured baseline for this language, so no verdict on these'));
      console.log('    ' + dim('numbers. They still compare between two of your own drafts.'));
    }
  } else {
    console.log('  rhythm        ' + dim('not enough prose to measure (needs ~10 sentences in full paragraphs)'));
  }

  var pp = s.paragraphs;
  console.log('');
  console.log('  paragraphs    ' + pp.count + dim('   mean ') + pp.mean + dim(' words, spread ') +
    pp.spread.toFixed(2) + dim(', ') + pp.shortest + '-' + pp.longest + dim(' words, ') +
    pp.singleSentence + dim(' one-sentence'));

  if (s.sections.length) {
    console.log('');
    console.log('  sections      ' + s.sections.length);
    var maxw = Math.max.apply(null, s.sections.map(function (x) { return x.words; }));
    s.sections.forEach(function (sec) {
      var t = sec.title.length > 32 ? sec.title.slice(0, 31) + '~' : sec.title;
      console.log('    ' + pad(t, 34) + padL(sec.words, 5) + 'w  ' +
        dim(bar((100 * sec.words) / maxw, 20)));
    });
    if (s.sectionsSymmetric === true) {
      console.log('    ' + yellow('-') + ' all within 20% of each other: that is an outline, not an essay');
    } else if (s.sectionsSymmetric === false) {
      console.log('    ' + green('-') + ' lopsided, which is what attention actually looks like');
    }
  }

  var op = s.openers;
  console.log('');
  console.log('  openers       ' + dim('This/It/There ') + op.thisItThere + '/' + op.total +
    dim('   And/But/So ') + op.andButSo + '/' + op.total +
    dim('   most repeated: ') + op.top.slice(0, 3).map(function (x) { return x.word + ' x' + x.n; }).join(', '));

  var pu = s.punctuation;
  console.log('  punctuation   ' + dim('em-dash ') + pu.emDash + dim(' (' + pu.emDashPer100 + '/100w)') +
    dim('   semicolon ') + pu.semicolon + dim('   question ') + pu.question +
    dim('   exclamation ') + pu.exclamation);
  console.log('  passive       ' + s.passive.count + dim('   ' + s.passive.perSentence + ' per sentence'));
  if (s.readability) {
    console.log('  readability   ' + dim('Flesch ') + s.readability.fleschEase +
      dim('   grade ') + s.readability.grade + dim('   (crude syllable count)'));
  }

  var la = s.layout, layoutBits = [];
  if (la.titleCaseHeadings.length) layoutBits.push(plural(la.titleCaseHeadings.length, 'Title Case heading', 'Title Case headings'));
  if (la.furnitureHeadings.length) layoutBits.push(plural(la.furnitureHeadings.length, 'furniture heading', 'furniture headings') + ' (' + la.furnitureHeadings.slice(0, 3).join(', ') + ')');
  if (la.emojiBullets) layoutBits.push(plural(la.emojiBullets, 'emoji bullet', 'emoji bullets'));
  if (la.boldHeaderLists) layoutBits.push(plural(la.boldHeaderLists, 'inline-header list item', 'inline-header list items'));
  layoutBits.forEach(function (b, i) {
    console.log((i ? '                ' : '  layout        ') + yellow(b));
  });

  tail(r);
}

function tail(r) {
  console.log('');
  if (r && !r.language.tagged) {
    console.log(dim('  Everything above is script-agnostic: paragraph shape, punctuation,'));
    console.log(dim('  layout. Word classes and tells need a language pack, and this text'));
    console.log(dim('  is not in a language Ripley has one for.'));
    console.log('');
    return;
  }
  console.log(dim('  The tell lists are exact. The word classes are a suffix-and-lexicon'));
  console.log(dim('  guess with no dictionary behind them. Only the rhythm baselines were'));
  console.log(dim('  measured, over 11,522 sentences of English. The rest are conventions.'));
  if (r && r.language.tellsFrom === 'translated') {
    console.log(dim('  This pack\'s tell list is translated from the English one. It has not'));
    console.log(dim('  been checked against a corpus of real prose in this language.'));
  }
  console.log(dim('  Passing these checks is not the same as being worth reading.'));
  console.log('');
}

/* -------------------------------------------------------- standalone page */

function writeHtml(r, out, label) {
  var appDir = path.join(__dirname, '..', 'app');
  var tpl = fs.readFileSync(path.join(appDir, 'index.html'), 'utf8');
  var engine = fs.readFileSync(path.join(appDir, 'engine.js'), 'utf8');
  var langs = fs.readFileSync(path.join(appDir, 'languages.js'), 'utf8');
  var seed = '<script>window.RIPLEY_SEED = ' +
    JSON.stringify({ label: label, text: r.text }).replace(/</g, '\\u003c') + ';</script>';
  /* function replacement, not a string: a string one would expand the $& and $'
     sequences that live inside the engine's own regexes. */
  function block(src) {
    return '<script>\n' + src.replace(/<\/script>/gi, '<\\/script>') + '\n</script>';
  }
  var page = tpl
    .replace('<script src="languages.js"></script>', function () { return block(langs); })
    .replace('<script src="engine.js"></script>', function () { return block(engine) + '\n' + seed; });
  fs.writeFileSync(out, page, 'utf8');
  console.error('wrote ' + out + '  (' + Math.round(page.length / 1024) + ' KB, opens offline)');
}

/* --------------------------------------------------------------------- go */

read(function (text, label) {
  var r = Ripley.analyse(text, { lang: opts.lang });
  if (opts.html) writeHtml(r, opts.html, label);
  if (opts.json) {
    console.log(JSON.stringify(r, function (k, v) {
      return (k === 'tokens' || k === 'text' || k === 'para' || k === 'hits' || k === 'spans') ? undefined : v;
    }, 2));
    return;
  }
  printReport(r, label);
});
