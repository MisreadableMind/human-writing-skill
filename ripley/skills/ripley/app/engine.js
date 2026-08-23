/*  Ripley — prose analyser.
 *
 *  One engine, no dependencies, runs in Node and in a browser tag:
 *      const Ripley = require('./engine.js')                 // node
 *      <script src="languages.js"></script>                  // browser,
 *      <script src="engine.js"></script>                     // in this order
 *
 *  Ripley.analyse(text, {lang}) returns counts, flagged spans with character
 *  offsets, and structure metrics. Offsets index the ORIGINAL string, so a
 *  caller can slice it for highlighting without re-tokenising.
 *
 *  This file knows no language. It masks markup, splits paragraphs and
 *  sentences, counts, and measures shape. Word lists, suffix rules and tell
 *  phrases live in languages.js, one pack per language, and the pack for a
 *  given text is chosen by script and stopword vote. With no pack for the
 *  language, the report drops to the metrics that survive translation —
 *  sentence and paragraph shape, punctuation, layout — and says so, rather
 *  than running English rules over prose that isn't English.
 *
 *  Three honesty notes, because the numbers are only worth what they are:
 *
 *  1. The part-of-speech tagger is suffixes and word lists. It has no training
 *     data and no dictionary. Every report says what share of tokens it
 *     resolved from a list, from a suffix, from position, and from a bare
 *     guess, so you can see how much to trust the class counts.
 *  2. The rhythm baselines are measured, and only for English — 11,522
 *     sentences, same splitter. No other pack ships baselines, so no other
 *     language gets a rhythm verdict.
 *  3. The English tell list came from reading machine prose against 700+ human
 *     essays. The Ukrainian and Russian lists are translations of it: a
 *     hypothesis, not a measurement. Reports label which they used.
 */
;(function (global, factory) {
  if (typeof module === 'object' && module && module.exports) {
    module.exports = factory(require('./languages.js'));
  } else {
    global.Ripley = factory(global.RipleyLanguages);
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function (Languages) {
  'use strict';

  var VERSION = '2.0.0';

  /* -------------------------------------------------------------- masking */

  /* Replace regions we do not want matched with spaces, so every offset in the
     masked string still points at the same character in the original. */
  function blank(len) { return new Array(len + 1).join(' '); }

  function maskRegions(text) {
    var m = text;
    var headings = [];

    /* YAML front matter */
    m = m.replace(/^---\n[\s\S]*?\n---\n/, function (s) { return blank(s.length); });
    /* fenced code */
    m = m.replace(/```[\s\S]*?```/g, function (s) { return blank(s.length); });
    m = m.replace(/~~~[\s\S]*?~~~/g, function (s) { return blank(s.length); });
    /* inline code */
    m = m.replace(/`[^`\n]*`/g, function (s) { return blank(s.length); });
    /* link and image targets, keep the label */
    m = m.replace(/(!?\[)([^\]\n]*)(\]\()([^)\n]*)(\))/g, function (s, a, label, b, url, c) {
      return blank(a.length) + label + blank(b.length + url.length + c.length);
    });
    /* bare URLs */
    m = m.replace(/https?:\/\/\S+/g, function (s) { return blank(s.length); });
    /* html comments and tags */
    m = m.replace(/<!--[\s\S]*?-->/g, function (s) { return blank(s.length); });
    /* tables: any line with two or more pipes */
    m = m.replace(/^\|.*$/gm, function (s) { return blank(s.length); });
    /* headings: record, then blank out of the prose stream */
    m = m.replace(/^(#{1,6})[ \t]+([^\n]*)$/gm, function (s, hashes, title, offset) {
      headings.push({ level: hashes.length, text: title.trim(), start: offset, end: offset + s.length });
      return blank(s.length);
    });
    /* list markers, blockquote markers, emphasis punctuation: keep the words */
    m = m.replace(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]+/gm, function (s) { return blank(s.length); });
    m = m.replace(/^[ \t]*>[ \t]?/gm, function (s) { return blank(s.length); });
    m = m.replace(/^[ \t]*(?:---+|\*\*\*+|___+)[ \t]*$/gm, function (s) { return blank(s.length); });
    m = m.replace(/[*_~]/g, ' ');

    return { masked: m, headings: headings };
  }

  /* ------------------------------------------------- splitting and tokens */

  function trimSpan(text, start, end) {
    while (start < end && /\s/.test(text.charAt(start))) start++;
    while (end > start && /\s/.test(text.charAt(end - 1))) end--;
    return { start: start, end: end };
  }

  function splitParagraphs(masked) {
    var out = [], re = /\n[ \t]*\n/g, last = 0, m, raw = [];
    while ((m = re.exec(masked)) !== null) { raw.push([last, m.index]); last = re.lastIndex; }
    raw.push([last, masked.length]);
    raw.forEach(function (p) {
      var t = trimSpan(masked, p[0], p[1]);
      if (t.end > t.start) { t.text = masked.slice(t.start, t.end); out.push(t); }
    });
    return out;
  }

  /* Same crude rule the bundled rhythm.py uses, so the English numbers stay
     comparable to the measured baselines: a sentence ends at .!? plus a closing
     quote, followed by space and a capital. \p{Lu} generalises "a capital" to
     every cased script, so Cyrillic and Greek split the same way.

     Scripts without case — Han, Arabic, Devanagari — have no capital to look
     for, so they fall back to splitting on terminal punctuation alone. */
  var SENT_CASED = /([.!?…]+)(["”'’)\]»]*)(\s+)(?=[\p{Lu}"“(\[«])/gu;
  var SENT_UNCASED = /([.!?…。！？]+)(["”'’)\]』」]*)(\s*)/gu;

  function splitSentences(masked, para, cased) {
    var text = masked.slice(para.start, para.end);
    var re = cased === false ? SENT_UNCASED : SENT_CASED;
    re.lastIndex = 0;
    var out = [], last = 0, m;
    while ((m = re.exec(text)) !== null) {
      var cut = m.index + m[1].length + m[2].length;
      out.push([last, cut]);
      last = re.lastIndex;
    }
    if (last < text.length) out.push([last, text.length]);
    return out.map(function (s) {
      var t = trimSpan(text, s[0], s[1]);
      return { start: para.start + t.start, end: para.start + t.end };
    }).filter(function (s) { return s.end > s.start; });
  }

  /* \p{L} rather than A-Za-z: an ASCII word regex finds no words at all in
     Cyrillic, and reports a 0-word document instead of failing. */
  var WORD_RE = /\d[\d,]*(?:\.\d+)?%?|[\p{L}][\p{L}\p{M}'’-]*/gu;

  /* Han, Thai and Khmer do not put spaces between words. Intl.Segmenter knows
     where the breaks are; where it is missing, the count is left null rather
     than guessed from character runs. */
  var SEGMENTER = null, SEGMENTER_TRIED = false;
  function segmenter() {
    if (!SEGMENTER_TRIED) {
      SEGMENTER_TRIED = true;
      try { SEGMENTER = new Intl.Segmenter(undefined, { granularity: 'word' }); }
      catch (e) { SEGMENTER = null; }
    }
    return SEGMENTER;
  }

  function tokenise(masked, sentences, spaced) {
    if (spaced === false) return tokeniseSegmented(masked, sentences);
    var tokens = [];
    sentences.forEach(function (sent, si) {
      var text = masked.slice(sent.start, sent.end);
      WORD_RE.lastIndex = 0;
      var m, first = true;
      while ((m = WORD_RE.exec(text)) !== null) {
        var raw = m[0].replace(/[-'’]+$/, '');
        if (!raw) continue;
        tokens.push({
          raw: raw,
          lower: raw.toLowerCase(),
          start: sent.start + m.index,
          end: sent.start + m.index + raw.length,
          sentence: si,
          initial: first
        });
        first = false;
      }
    });
    return tokens;
  }

  function tokeniseSegmented(masked, sentences) {
    var seg = segmenter();
    if (!seg) return [];
    var tokens = [];
    sentences.forEach(function (sent, si) {
      var text = masked.slice(sent.start, sent.end), first = true;
      var it = seg.segment(text);
      Array.prototype.forEach.call(Array.from(it), function (part) {
        if (!part.isWordLike) return;
        tokens.push({
          raw: part.segment, lower: part.segment.toLowerCase(),
          start: sent.start + part.index, end: sent.start + part.index + part.segment.length,
          sentence: si, initial: first
        });
        first = false;
      });
    });
    return tokens;
  }

  /* ---------------------------------------------------------------- tagger */

  var TAGS = ['NOUN', 'VERB', 'ADJ', 'ADV', 'PROPN', 'NUM', 'DET', 'PRON', 'PREP', 'CONJ', 'AUX', 'MODAL'];
  var CONTENT = { NOUN: 1, VERB: 1, ADJ: 1, ADV: 1, PROPN: 1, NUM: 1 };

  /* Closed classes come from the pack's ordered dictionary list — first match
     wins, which is how 'that' lands on DET rather than CONJ. Everything left
     over goes to the pack's own open-class resolver. */
  function tagTokens(tokens, pack) {
    var lex = pack.lex;
    for (var i = 0; i < tokens.length; i++) {
      var t = tokens[i], w = t.lower, prev = tokens[i - 1];
      var prevTag = prev ? prev.tag : null;

      if (/^\d/.test(t.raw)) { t.tag = 'NUM'; t.src = 'lex'; continue; }

      var ctx = {
        prev: prev,
        next: tokens[i + 1],
        prevTag: prevTag,
        afterDet: prevTag === 'DET' || prevTag === 'ADJ'
      };
      if (pack.pre && pack.pre(t, ctx)) continue;

      var hit = false;
      for (var k = 0; k < lex.length; k++) {
        if (lex[k][0][w]) { t.tag = lex[k][1]; t.src = 'lex'; hit = true; break; }
      }
      if (hit) continue;

      pack.open(t, ctx);
    }
    return tokens;
  }

  function findPassives(tokens, pack) {
    var spans = [];
    if (!pack.be || !pack.isParticiple) return spans;
    for (var i = 0; i < tokens.length; i++) {
      if (!pack.be[tokens[i].lower]) continue;
      for (var j = i + 1; j < Math.min(i + 3, tokens.length); j++) {
        var t = tokens[j];
        if (t.tag === 'ADV') continue;
        if (pack.isParticiple(t)) spans.push({ start: tokens[i].start, end: t.end });
        break;
      }
    }
    /* languages that mark the passive on the verb itself, with no auxiliary */
    tokens.forEach(function (t) {
      if (t.participle === 'impersonal') spans.push({ start: t.start, end: t.end });
    });
    return spans;
  }

  /* ----------------------------------------------------------- the tells */

  var CATEGORIES = [
    { id: 'opener',     label: 'throat-clearing',   tell: 1,  hue: 0   },
    { id: 'notjust',    label: 'not just X but Y',  tell: 2,  hue: 18  },
    { id: 'inflation',  label: 'empty inflation',   tell: 3,  hue: 32  },
    { id: 'delve',      label: 'delve-class words', tell: 4,  hue: 45  },
    { id: 'signpost',   label: 'signpost stacking', tell: 5,  hue: 58  },
    { id: 'hedge',      label: 'empty hedging',     tell: 6,  hue: 92  },
    { id: 'recap',      label: 'recap conclusion',  tell: 8,  hue: 120 },
    { id: 'weasel',     label: 'weasel attribution',tell: 9,  hue: 150 },
    { id: 'padding',    label: 'padding',           tell: 11, hue: 170 },
    { id: 'copula',     label: 'copula avoidance',  tell: 13, hue: 186 },
    { id: 'ingtail',    label: '-ing tail',         tell: 14, hue: 198 },
    { id: 'range',      label: 'false range',       tell: 16, hue: 210 },
    { id: 'tailneg',    label: 'tailing negation',  tell: 17, hue: 222 },
    { id: 'aphorism',   label: 'formula aphorism',  tell: 18, hue: 236 },
    { id: 'candid',     label: 'fake-candid opener',tell: 20, hue: 250 },
    { id: 'chatbot',    label: 'chatbot residue',   tell: 21, hue: 264 },
    { id: 'cutoff',     label: 'cutoff disclaimer', tell: 22, hue: 276 },
    { id: 'excitement', label: 'excitement injection', tell: 25, hue: 300 },
    { id: 'pivot',      label: 'one-word question', tell: 26, hue: 315 },
    { id: 'analogy',    label: 'announced analogy', tell: 27, hue: 330 },
    { id: 'concession', label: 'scheduled concession', tell: 29, hue: 342 },
    { id: 'announce',   label: 'announced directness', tell: 30, hue: 352 },
    { id: 'filler',     label: 'fancy for plain',   tell: 0,  hue: 75  },
    { id: 'ruleofthree',label: 'rule of three',     tell: 7,  hue: 265 },
    { id: 'staccato',   label: 'staccato drama',    tell: 19, hue: 288 }
  ];

  var CATEGORY_BY_ID = {};
  CATEGORIES.forEach(function (c) { CATEGORY_BY_ID[c.id] = c; });

  /* sev 'hard' — cut it, near enough always.
     sev 'soft' — depends on context; a person may have meant it. */

  function runRules(masked, sentences, pack) {
    var sentStart = Object.create(null);
    sentences.forEach(function (s) { sentStart[s.start] = true; });

    var hits = [];
    (pack.rules || []).forEach(function (rule, order) {
      rule.re.lastIndex = 0;
      var m;
      while ((m = rule.re.exec(masked)) !== null) {
        if (m[0].length === 0) { rule.re.lastIndex++; continue; }
        if (rule.at === 'sentence' && !sentStart[m.index]) continue;
        hits.push({
          cat: rule.cat, sev: rule.sev, note: rule.note, fix: rule.fix,
          start: m.index, end: m.index + m[0].length,
          text: m[0].replace(/\s+/g, ' '),
          order: order
        });
      }
    });

    /* One span, one flag: keep the earlier rule when two overlap. */
    hits.sort(function (a, b) {
      return a.start - b.start || a.order - b.order || (b.end - b.start) - (a.end - a.start);
    });
    var kept = [], lastEnd = -1;
    hits.forEach(function (h) {
      if (h.start < lastEnd) return;
      kept.push(h); lastEnd = h.end;
    });
    return kept;
  }

  /* ------------------------------------------------------------ structure */

  function mean(a) { return a.length ? a.reduce(function (x, y) { return x + y; }, 0) / a.length : 0; }
  function sd(a) {
    if (a.length < 2) return 0;
    var m = mean(a);
    return Math.sqrt(mean(a.map(function (x) { return (x - m) * (x - m); })));
  }
  function pct(n, d) { return d ? (100 * n) / d : 0; }
  function round(x, p) { var f = Math.pow(10, p || 1); return Math.round(x * f) / f; }

  function sectionsFrom(headings, masked, paragraphs) {
    if (!headings.length) return [];
    var level = Math.min.apply(null, headings.map(function (h) { return h.level; }));
    var tops = headings.filter(function (h) { return h.level <= level + 0; });
    if (tops.length < 2) {
      tops = headings.filter(function (h) { return h.level <= level + 1; });
    }
    if (tops.length < 2) return [];
    return tops.map(function (h, i) {
      var from = h.end;
      var to = i + 1 < tops.length ? tops[i + 1].start : masked.length;
      var body = masked.slice(from, to);
      var w = body.match(WORD_RE);
      return { title: h.text, level: h.level, start: from, end: to, words: w ? w.length : 0 };
    }).filter(function (s) { return s.words > 0; });
  }

  function isTitleCase(s, small) {
    if (!small) return false;
    var w = s.split(/\s+/).filter(function (x) { return /\p{L}/u.test(x); });
    if (w.length < 3) return false;
    var capped = 0, eligible = 0;
    w.forEach(function (x, i) {
      if (i > 0 && small[x.toLowerCase()]) return;
      eligible++;
      if (/^\p{Lu}/u.test(x)) capped++;
    });
    return eligible >= 3 && capped === eligible;
  }

  function ruleOfThree(tokens) {
    var out = [];
    for (var i = 0; i + 4 < tokens.length; i++) {
      var a = tokens[i], b = tokens[i + 1], c = tokens[i + 2], d = tokens[i + 3];
      if (a.tag !== 'ADJ' || b.tag !== 'ADJ') continue;
      if (c.lower === 'and' || c.lower === 'or') {
        if (d.tag === 'ADJ') out.push({ start: a.start, end: d.end });
      }
    }
    return out;
  }

  function staccatoRuns(sentLens, sentences) {
    var runs = [], run = [];
    for (var i = 0; i < sentLens.length; i++) {
      if (sentLens[i] > 0 && sentLens[i] < 6) run.push(i);
      else { if (run.length >= 3) runs.push(run.slice()); run = []; }
    }
    if (run.length >= 3) runs.push(run);
    return runs.map(function (r) {
      return { start: sentences[r[0]].start, end: sentences[r[r.length - 1]].end, n: r.length };
    });
  }

  /* ------------------------------------------------------------- analyse */

  /* The pack used when no language was recognised. It claims nothing: no word
     lists, no tells, no baselines. Structure still measures, because paragraph
     shape and punctuation do not care what language they are in. */
  var NO_PACK = {
    code: null, name: null, script: null, tellsFrom: 'none',
    taggerNote: 'no language pack — word classes and tells are not reported',
    lex: [], rules: [],
    open: function (t) { t.tag = 'NOUN'; t.src = 'guess'; },
    be: null, isParticiple: null,
    adverbMark: function () { return false; },
    adverbMarkLabel: 'derived adverbs',
    adverbMarkNote: '',
    furniture: Object.create(null), furniturePhrase: [],
    titleCaseSmall: null, syllables: null, baseline: null
  };

  function analyse(text, opts) {
    opts = opts || {};
    text = String(text == null ? '' : text).replace(/\r\n?/g, '\n');
    var m = maskRegions(text);
    var masked = m.masked, headings = m.headings;

    var found = Languages.detect(masked, opts.lang);
    var pack = found.pack || NO_PACK;
    var cased = found.cased !== false;
    var spaced = found.script !== 'han' && found.script !== 'thai';

    var paragraphs = splitParagraphs(masked);
    var sentences = [];
    paragraphs.forEach(function (p) {
      p.sentences = splitSentences(masked, p, cased);
      p.sentences.forEach(function (s) { s.para = p; sentences.push(s); });
    });
    var tokens = tagTokens(tokenise(masked, sentences, spaced), pack);
    var tagged = !!found.pack;

    var nWords = tokens.length;
    var per100 = function (n) { return nWords ? round((100 * n) / nWords, 2) : 0; };

    /* word classes */
    var counts = {}, srcCount = { lex: 0, suffix: 0, context: 0, guess: 0 };
    TAGS.forEach(function (t) { counts[t] = 0; });
    var lyCount = 0, nominalCount = 0, contentCount = 0, syl = 0;
    var vocab = Object.create(null), uniques = 0;
    tokens.forEach(function (t) {
      counts[t.tag] = (counts[t.tag] || 0) + 1;
      srcCount[t.src] = (srcCount[t.src] || 0) + 1;
      if (t.tag === 'ADV' && pack.adverbMark(t)) lyCount++;
      if (t.nominal) nominalCount++;
      if (CONTENT[t.tag]) contentCount++;
      if (pack.syllables) syl += pack.syllables(t.lower);
      if (!vocab[t.lower]) { vocab[t.lower] = 1; uniques++; }
    });

    /* sentence and paragraph shape */
    var sentLens = sentences.map(function (s) {
      var w = masked.slice(s.start, s.end).match(WORD_RE);
      s.words = w ? w.length : 0;
      return s.words;
    });
    var paraWords = paragraphs.map(function (p) {
      var w = masked.slice(p.start, p.end).match(WORD_RE);
      p.words = w ? w.length : 0;
      return p.words;
    });

    /* rhythm: same filter rhythm.py uses, so the baselines compare */
    var rhythmLens = [];
    paragraphs.forEach(function (p) {
      if (p.words > 25) p.sentences.forEach(function (s) { rhythmLens.push(s.words); });
    });
    var rMean = mean(rhythmLens);
    var rhythm = {
      sentences: rhythmLens.length,
      paragraphs: paragraphs.filter(function (p) { return p.words > 25; }).length,
      mean: round(rMean, 1),
      spread: rMean ? round(sd(rhythmLens) / rMean, 2) : 0,
      shortShare: round(pct(rhythmLens.filter(function (x) { return x < 9; }).length, rhythmLens.length), 1),
      bandShare: round(pct(rhythmLens.filter(function (x) { return x >= 12 && x <= 25; }).length, rhythmLens.length), 1),
      min: rhythmLens.length ? Math.min.apply(null, rhythmLens) : 0,
      max: rhythmLens.length ? Math.max.apply(null, rhythmLens) : 0,
      enough: rhythmLens.length >= 10,
      baseline: pack.baseline
    };
    /* The three thresholds below were drawn from English essays. Firing them on
       a language with no measured baseline would be inventing a standard. */
    rhythm.flags = [];
    if (rhythm.enough && pack.baseline) {
      if (rhythm.spread < 0.45) rhythm.flags.push('spread ' + rhythm.spread + ' — sentences run close to one length');
      if (rhythm.shortShare < 10) rhythm.flags.push(round(rhythm.shortShare, 0) + '% under 9 words — nothing lands short');
      if (rhythm.bandShare > 65) rhythm.flags.push(round(rhythm.bandShare, 0) + '% in the 12-25 band — one cadence');
    }

    /* openers */
    var openerWord = {}, thisIt = 0, andBut = 0;
    sentences.forEach(function (s) {
      var w = masked.slice(s.start, s.end).match(WORD_RE);
      if (!w) return;
      var first = w[0].toLowerCase();
      openerWord[first] = (openerWord[first] || 0) + 1;
      if (first === 'this' || first === 'it' || first === 'there' || first === 'these') thisIt++;
      if (first === 'and' || first === 'but' || first === 'so' || first === 'yet') andBut++;
    });
    var topOpeners = Object.keys(openerWord).map(function (k) {
      return { word: k, n: openerWord[k] };
    }).sort(function (a, b) { return b.n - a.n; }).slice(0, 5);

    /* punctuation, on the masked stream so code and links do not count */
    function countOf(re) { var x = masked.match(re); return x ? x.length : 0; }
    var punctuation = {
      emDash: countOf(/—|--/g),
      semicolon: countOf(/;/g),
      colon: countOf(/:/g),
      question: countOf(/\?/g),
      exclamation: countOf(/!/g),
      parenthetical: countOf(/\([^)]{3,}\)/g)
    };
    Object.keys(punctuation).forEach(function (k) {
      punctuation[k + 'Per100'] = per100(punctuation[k]);
    });

    /* layout tells live in the raw text, not the masked stream */
    function rawCount(re) { var x = text.match(re); return x ? x.length : 0; }
    var layout = {
      emojiBullets: rawCount(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]*\p{Extended_Pictographic}/gmu),
      boldHeaderLists: rawCount(/^[ \t]*(?:[-*+]|\d+[.)])[ \t]*\*\*[^*\n]+:?\*\*:?/gm),
      boldRuns: rawCount(/\*\*[^*\n]+\*\*/g),
      titleCaseHeadings: headings.filter(function (h) {
        return isTitleCase(h.text, pack.titleCaseSmall);
      }).map(function (h) { return h.text; }),
      furnitureHeadings: headings.filter(function (h) {
        var t = h.text.toLowerCase().replace(/[^\p{L} ]/gu, '').trim();
        if (!t) return false;
        if (pack.furniture[t.split(/\s+/)[0]] && t.split(/\s+/).length <= 2) return true;
        return pack.furniturePhrase.indexOf(t) !== -1;
      }).map(function (h) { return h.text; })
    };

    /* computed patterns the regexes cannot see */
    var passive = findPassives(tokens, pack);
    var triples = ruleOfThree(tokens);
    var staccato = staccatoRuns(sentLens, sentences);

    var flags = runRules(masked, sentences, pack);
    flags.forEach(function (f) { f.text = text.slice(f.start, f.end).replace(/\s+/g, ' '); });
    triples.forEach(function (s) {
      flags.push({ cat: 'ruleofthree', sev: 'soft', start: s.start, end: s.end,
        text: text.slice(s.start, s.end).replace(/\s+/g, ' '),
        note: 'Rule-of-three adjectives.', fix: 'One vivid word beats three vague ones.' });
    });
    staccato.forEach(function (s) {
      flags.push({ cat: 'staccato', sev: 'soft', start: s.start, end: s.end,
        text: text.slice(s.start, s.end).replace(/\s+/g, ' ').slice(0, 90),
        note: s.n + ' sentences under six words in a row.',
        fix: 'One short sentence lands a point. Four in a row manufacture one.' });
    });
    flags.sort(function (a, b) { return a.start - b.start; });

    /* line and column, for the CLI */
    var lineStarts = [0];
    for (var i = 0; i < text.length; i++) if (text.charAt(i) === '\n') lineStarts.push(i + 1);
    function locate(offset) {
      var lo = 0, hi = lineStarts.length - 1;
      while (lo < hi) { var mid = (lo + hi + 1) >> 1; if (lineStarts[mid] <= offset) lo = mid; else hi = mid - 1; }
      return { line: lo + 1, col: offset - lineStarts[lo] + 1 };
    }
    flags.forEach(function (f) { var l = locate(f.start); f.line = l.line; f.col = l.col; });

    /* per-category rollup */
    var byCat = {};
    flags.forEach(function (f) {
      if (!byCat[f.cat]) byCat[f.cat] = { id: f.cat, n: 0, hard: 0, soft: 0, hits: [] };
      byCat[f.cat].n++;
      byCat[f.cat][f.sev]++;
      byCat[f.cat].hits.push(f);
    });
    var categories = Object.keys(byCat).map(function (k) {
      var c = byCat[k], meta = CATEGORY_BY_ID[k];
      c.label = meta ? meta.label : k;
      c.tell = meta ? meta.tell : 0;
      c.hue = meta ? meta.hue : 265;
      c.per1000 = nWords ? round((1000 * c.n) / nWords, 1) : 0;
      return c;
    }).sort(function (a, b) { return b.hard - a.hard || b.n - a.n; });

    var sections = sectionsFrom(headings, masked, paragraphs);
    var secWords = sections.map(function (s) { return s.words; });
    var symmetric = null;
    if (secWords.length >= 3) {
      var mx = Math.max.apply(null, secWords), mn = Math.min.apply(null, secWords);
      symmetric = mx > 0 && (mx - mn) / mx <= 0.2;
    }

    var wps = sentences.length ? nWords / sentences.length : 0;
    var spw = nWords ? syl / nWords : 0;

    var report = {
      version: VERSION,
      text: text,
      language: {
        code: found.code,
        name: found.name,
        script: found.script,
        confidence: found.confidence,
        method: found.method,
        cased: cased,
        tagged: tagged,
        tellsFrom: pack.tellsFrom,
        taggerNote: pack.taggerNote,
        hasBaseline: !!pack.baseline,
        adverbLabel: pack.adverbMarkLabel,
        adverbNote: pack.adverbMarkNote || '',
        available: Languages.codes()
      },
      meta: {
        characters: text.length,
        words: nWords,
        sentences: sentences.length,
        paragraphs: paragraphs.length,
        headings: headings.length,
        uniqueWords: uniques
      },
      pos: {
        counts: counts,
        tokens: tokens,
        lyAdverbs: lyCount,
        nominalisations: nominalCount,
        adverbPer100: per100(counts.ADV),
        adjectivePer100: per100(counts.ADJ),
        lyPer100: per100(lyCount),
        nominalPer100: per100(nominalCount),
        numberPer100: per100(counts.NUM),
        properNounPer100: per100(counts.PROPN),
        lexicalDensity: round(pct(contentCount, nWords), 1),
        typeTokenRatio: nWords ? round(uniques / nWords, 3) : 0,
        resolved: {
          lex: round(pct(srcCount.lex, nWords), 1),
          suffix: round(pct(srcCount.suffix, nWords), 1),
          context: round(pct(srcCount.context, nWords), 1),
          guess: round(pct(srcCount.guess, nWords), 1)
        }
      },
      structure: {
        rhythm: rhythm,
        paragraphs: {
          count: paragraphs.length,
          mean: round(mean(paraWords), 1),
          spread: mean(paraWords) ? round(sd(paraWords) / mean(paraWords), 2) : 0,
          longest: paraWords.length ? Math.max.apply(null, paraWords) : 0,
          shortest: paraWords.length ? Math.min.apply(null, paraWords) : 0,
          singleSentence: paragraphs.filter(function (p) { return p.sentences.length === 1; }).length
        },
        sections: sections.map(function (s) { return { title: s.title, level: s.level, words: s.words }; }),
        sectionsSymmetric: symmetric,
        openers: { top: topOpeners, thisItThere: thisIt, andButSo: andBut, total: sentences.length },
        punctuation: punctuation,
        layout: layout,
        passive: { count: passive.length, perSentence: sentences.length ? round(passive.length / sentences.length, 2) : 0, spans: passive },
        readability: pack.syllables ? {
          wordsPerSentence: round(wps, 1),
          syllablesPerWord: round(spw, 2),
          fleschEase: round(206.835 - 1.015 * wps - 84.6 * spw, 1),
          grade: round(0.39 * wps + 11.8 * spw - 15.59, 1)
        } : null
      },
      flags: flags,
      categories: categories
    };

    report.verdict = verdictFor(report);
    return report;
  }

  function verdictFor(r) {
    var hardCats = r.categories.filter(function (c) { return c.hard > 0; }).length;
    var structural = [];
    if (r.structure.rhythm.enough && r.structure.rhythm.flags.length === 3) {
      structural.push('all three rhythm metrics outside the measured human range');
    }
    if (r.structure.sectionsSymmetric === true) {
      structural.push('sections within 20% of each other — that is an outline, not an essay');
    }
    if (r.structure.layout.furnitureHeadings.length >= 2) {
      structural.push(r.structure.layout.furnitureHeadings.length + ' headings that would fit any piece on any topic');
    }
    if (r.structure.layout.emojiBullets >= 3) {
      structural.push(r.structure.layout.emojiBullets + ' emoji bullets');
    }
    var score = hardCats + structural.length;
    var level, line;
    if (!r.language.tagged) {
      level = 'unknown';
      line = r.language.script
        ? 'No pack for this language, so no verdict. Shape and punctuation below still hold; word classes and tells do not.'
        : 'Not enough text to tell what language this is.';
      return { level: level, score: 0, hardCategories: 0, structural: structural, line: line };
    }
    if (r.meta.words < 40 && score === 0) { level = 'thin'; line = 'Too short to say much. Feed it a few paragraphs.'; }
    else if (score === 0) { level = 'clean'; line = 'Nothing on this list fired. That is not the same as being worth reading.'; }
    else if (score <= 2) { level = 'style'; line = 'One or two markers. A single marker is a style, not a tell — leave it alone unless it bothers you.'; }
    else if (score <= 4) { level = 'cluster'; line = 'A cluster is forming. Fix the hard ones and re-run.'; }
    else {
      level = 'generated';
      line = hardCats + (hardCats === 1 ? ' tell category' : ' tell categories') +
        (structural.length ? ' and ' + structural.length +
          (structural.length === 1 ? ' structural marker' : ' structural markers') : '') +
        ' firing at once. This is the confession, not a lone dash.';
    }
    return { level: level, score: score, hardCategories: hardCats, structural: structural, line: line };
  }

  /* ---------------------------------------------------------- highlighting */

  function escapeHtml(s) {
    return s.replace(/[&<>"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c];
    });
  }

  return {
    VERSION: VERSION,
    analyse: analyse,
    analyze: analyse,
    CATEGORIES: CATEGORIES,
    TAGS: TAGS,
    languages: Languages,
    escapeHtml: escapeHtml
  };
});
