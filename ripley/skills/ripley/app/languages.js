/*  Ripley — language packs.
 *
 *  The engine is language-agnostic: it masks markup, splits paragraphs and
 *  sentences, counts, and measures shape. Everything that knows a language
 *  lives here — the word lists, the suffix rules, the tell phrases.
 *
 *  A pack is data plus one function. To add a language, copy the Ukrainian
 *  pack, replace the lists, and register it in PACKS. Nothing in engine.js
 *  needs to change.
 *
 *  What a pack owes the engine:
 *    code, name, script      identity
 *    tellsFrom               'measured' or 'translated' — see the note below
 *    stopwords               used to guess the language of a text
 *    lex                     ordered [dictionary, tag] pairs, tried in turn
 *    open(t, ctx)            resolve a word no dictionary claimed
 *    be, isParticiple        for passive detection
 *    rules                   the tells
 *    furniture, furniturePhrase, titleCaseSmall, syllables, baseline
 *
 *  Honesty about provenance. The English tell list came from reading a lot of
 *  machine prose against 700+ human essays. The Ukrainian and Russian lists are
 *  translations of it. Translated tells are a hypothesis, not a measurement,
 *  and every report says which kind it is using.
 */
;(function (global, factory) {
  if (typeof module === 'object' && module && module.exports) module.exports = factory();
  else global.RipleyLanguages = factory();
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  function words(s) {
    var o = Object.create(null);
    s.split(/\s+/).forEach(function (w) { if (w) o[w] = true; });
    return o;
  }

  /* Unicode-aware boundaries. JS \b is ASCII-only, so it does not fire between
     a space and a Cyrillic letter — a Latin-only \b would silently match
     nothing in Ukrainian. */
  var LEFT = '(?<![\\p{L}\\p{N}_])';
  var RIGHT = '(?![\\p{L}\\p{N}_])';

  function phrases(list) {
    var src = list.map(function (p) {
      var body = p.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
                  .replace(/'/g, "['’]")
                  .replace(/ +/g, '\\s+');
      /* a trailing boundary only when the phrase ends in a letter, so
         "honestly?" and "bottom line:" still match */
      return LEFT + body + (/[\p{L}]$/u.test(p) ? RIGHT : '');
    }).join('|');
    return new RegExp('(?:' + src + ')', 'giu');
  }

  /* "Anything up to the end of the sentence" has to survive a wrapped line.
     [^.!?\n] cannot cross a line break, so a hard-wrapped draft silently loses
     the match; a bare [^.!?] would run across a paragraph gap instead. This
     allows a newline only when a blank line does not follow. */
  var INLINE = '(?:[^.!?\\n]|\\n(?!\\s*\\n))';
  var INLINE_NC = '(?:[^.,;!?\\n]|\\n(?!\\s*\\n))';

  function wordList(s) {
    return new RegExp(LEFT + '(?:' + s.split(/\s+/).join('|') + ')' + RIGHT, 'giu');
  }

  /* ==================================================================== */
  /*  English                                                             */
  /* ==================================================================== */

  var EN = (function () {

    var DET = words(
      'a an the this that these those my your his her its our their some any no ' +
      'every each all both half either neither another what which whose much many ' +
      'few several such');

    var PRON = words(
      'i me mine myself you yours yourself yourselves he him himself she hers ' +
      'herself it itself we us ours ourselves they them theirs themselves who whom ' +
      'anyone everyone someone nobody everybody somebody anybody nothing something ' +
      'anything everything one ones oneself');

    var PREP = words(
      'of in to for with on at by from about into over under above across against ' +
      'along among amongst around before behind below beside besides between beyond ' +
      'during except inside near off onto outside since through throughout toward ' +
      'towards underneath until upon within without via per despite versus amid atop');

    var CONJ = words(
      'and but or nor yet so because although though while whereas unless if than ' +
      'as when where whether once whenever wherever');

    var AUX = words(
      'am is are was were be been being have has had having do does did doing');

    var MODAL = words('will would shall should can could may might must ought');

    /* adverbs that do not end in -ly */
    var ADV = words(
      'very quite rather just really too also even still already again always never ' +
      'often sometimes usually rarely seldom soon now then here there ever yet almost ' +
      'nearly hardly barely far fast hard late well much more most less least back ' +
      'away together indeed therefore thus hence however moreover furthermore ' +
      'additionally instead otherwise perhaps maybe anyway meanwhile nonetheless ' +
      'nevertheless overall likewise somewhat thereby henceforth forever twice once ' +
      'ahead apart aside abroad downstairs upstairs everywhere anywhere somewhere ' +
      'nowhere else');

    /* the common adjectives a suffix rule will never catch */
    var ADJ = words(
      'good bad big small new old high low long short great little own other same ' +
      'different important right wrong early easy free full sure clear strong weak ' +
      'deep wide real true false best worst better worse main major minor key simple ' +
      'complex common rare cheap expensive slow hot cold warm cool dark light heavy ' +
      'quiet loud dead alive close open whole single double blue red green black ' +
      'white grey gray brown yellow young poor rich smart dumb clean dirty safe ' +
      'dangerous happy sad angry tired busy ready able unable likely unlikely ' +
      'possible impossible hard soft flat sharp round square straight thick thin ' +
      'tall wide narrow broad tight loose fresh stale sweet bitter sour salty plain ' +
      'fancy odd even strange familiar foreign local global public private open ' +
      'closed final first second third last next previous current former latter ' +
      'recent modern ancient huge tiny vast minute enormous massive slight brief ' +
      'quick sudden constant frequent rare usual normal typical standard basic ' +
      'advanced junior senior chief prime pure raw dry wet empty solid liquid ' +
    'honest dishonest worth aware alike alone awake afraid glad keen eager ' +
    'calm rough smooth crisp blunt vague precise exact obvious subtle ' +
    'neat messy tidy risky stable shaky');

    /* words ending in -ly that are not adverbs */
    var LY_ADJ = words(
      'costly friendly likely unlikely lively lonely lovely lowly manly ugly silly ' +
      'deadly elderly orderly disorderly scholarly timely untimely unruly worldly ' +
      'holy unholy jolly saintly stately sprightly homely heavenly godly motherly ' +
      'brotherly sisterly fatherly cowardly leisurely miserly portly surly burly ' +
      'curly oily smelly wobbly prickly sparkly squiggly wrinkly woolly gnarly ' +
      'ghastly measly spindly unsightly sightly motley grisly bristly crumbly ' +
      'wriggly giggly chilly frilly hilly steely');

    var LY_NOUN = words(
      'ally anomaly assembly belly family folly gully holly jelly lily melancholy ' +
      'monopoly panoply rally tally supply bully dolly rally italy july anomaly ' +
      'homily doily');

    var LY_VERB = words('apply comply imply multiply rely reply ply fly supply');

    /* -al, -ic, -ive and friends that are really nouns */
    var NOT_ADJ = words(
      'material animal capital journal hospital signal terminal manual channel ' +
      'general festival arrival approval removal proposal survival denial trial ' +
      'metal medal pedal rival novel model level label panel angel travel gravel ' +
      'music logic magic topic critic clinic panic traffic graphic republic ' +
      'archive motive native relative narrative initiative alternative objective ' +
      'perspective incentive detective executive representative directive ' +
      'business witness illness address process access excess success princess ' +
      'total federal several');

    var ING_NOUN = words(
      'thing things something anything nothing everything king kings ring rings ' +
      'string strings spring springs wing wings sing bring during morning evening ' +
      'ceiling building buildings meeting meetings feeling feelings setting ' +
      'settings finding findings reading readings warning warnings ending endings ' +
      'opening openings beginning beginnings training meaning meanings');

    var ED_NOT_VERB = words(
      'hundred bed red fed led wed shed sled bred sped need needed indeed deed ' +
      'creed breed speed greed seed weed feed steed tweed embed');

    /* suffixes */
    var ADJ_SUFFIX = /(?:able|ible|ical|ic|ous|ious|eous|ful|less|ish|ive|ary|ory|ant|ent|al|ial|proof|worthy|like)$/;
    var NOMINAL_SUFFIX = /(?:tion|sion|ment|ance|ence|ity|ness|ism|ship|hood|ency|ancy)$/;

    var IRREGULAR_PARTICIPLE = words(
      'done made given taken seen known shown written built held kept left lost ' +
      'found told brought bought sold sent put set run come gone driven chosen ' +
      'broken spoken drawn grown thrown understood meant felt dealt spent begun ' +
      'paid said heard led met won cut hit sung sunk stuck struck bound wound ' +
      'worn torn born sworn forgotten hidden ridden risen fallen eaten beaten');

    var COMMON_VERB = words(
      'go goes went come comes came make makes take takes took give gives gave ' +
      'get gets see sees saw know knows knew think thinks thought say says tell ' +
      'tells find finds want wants need needs use uses work works try tries ask ' +
      'asks call calls keep keeps let lets puts mean means seem seems help helps ' +
      'show shows turn turns start starts runs move moves live lives believe ' +
      'believes hold holds bring brings write writes wrote read reads sit sits ' +
      'stand stands lose loses pay pays meet meets sets learn learns change ' +
      'changes lead leads understand watch watches follow follows stop stops ' +
      'create creates speak speaks spend grow grows open opens walk walks win ' +
      'wins teach teaches offer offers remember remembers consider considers ' +
      'appear appears buy buys serve serves send sends build builds stay stays ' +
      'fall falls cuts reach reaches kill raise raises pass passes sell sells ' +
      'decide decides return returns explain hope hopes carry carries break ' +
      'breaks receive receives agree agrees support supports hits produce ' +
      'produces eat eats cover covers catch draw draws choose chooses cause ' +
      'causes point points listen listens realise realize require requires ' +
      'report reports pull pulls prove proves ship ships improve improves ' +
    'reduce reduces increase increases replace replaces remove removes ' +
    'avoid avoids allow allows enable enables measure measures count counts ' +
    'check checks fix fixes solve solves handle handles matter matters ' +
    'depend depends apply applies affect affects mention mentions');
    var BE = words('am is are was were be been being');

    /* spelled-out numbers were falling through to NOUN */
    var NUMWORD = words(
      'two three four five six seven eight nine ten eleven twelve thirteen ' +
      'fourteen fifteen sixteen seventeen eighteen nineteen twenty thirty ' +
      'forty fifty sixty seventy eighty ninety hundred thousand million ' +
      'billion trillion dozen');

    var EST_NOT_ADJ = words(
      'interest protest request suggest invest harvest honest modest forest ' +
      'guest test west quest manifest digest contest arrest conquest ingest ' +
      'infest molest attest divest');

    /* verbs in the lexicon that are ordinary nouns after a determiner:
       "the catch", "the result", "a show" */
    var NOUN_AFTER_DET = words(
      'catch result point use work call change help need start show turn ' +
      'answer cause cover draw hold lead move offer pass pay play reach ' +
      'report return run set support watch cut hit build look feel ' +
      'try win drive break drop rise fall');

    function syllables(w) {
      w = w.toLowerCase().replace(/[^a-z]/g, '');
      if (w.length <= 3) return 1;
      w = w.replace(/(?:[^laeiouy]es|ed|[^laeiouy]e)$/, '').replace(/^y/, '');
      var m = w.match(/[aeiouy]{1,2}/g);
      return m ? m.length : 1;
    }

    var FURNITURE = words(
      'overview introduction intro background context benefits advantages ' +
      'challenges drawbacks limitations conclusion summary takeaways ' +
      'considerations features details notes basics fundamentals essentials ' +
      'implications applications');

    var FURNITURE_PHRASE = [
      'key takeaways', 'final thoughts', 'getting started', 'why it matters',
      'the bottom line', 'use cases', 'best practices', 'how it works',
      'what is', 'why it matters', 'looking ahead', 'wrapping up',
      'frequently asked questions', 'pros and cons', 'next steps'
    ];

    var BASELINE = [
      { name: 'Paul Graham', cv: 0.61, short: 21.0, band: 50.0 },
      { name: 'Ben Evans',   cv: 0.60, short: 13.0, band: 39.2 },
      { name: 'H. Karlsson', cv: 0.86, short: 23.7, band: 44.9 }
    ];

    var RULES = [
      { cat: 'chatbot', sev: 'hard', note: 'Assistant chat pasted into the deliverable.',
        fix: 'Cut the greeting, the praise, the offer to continue.',
        re: phrases(['great question', 'excellent question', "that's a great point",
          "you're absolutely right", 'i hope this helps', 'let me know if you',
          'feel free to ask', 'happy to help', 'i would be happy to', "i'd be happy to",
          'certainly!', 'sure thing!', 'as an ai', 'as a language model']) },

      { cat: 'cutoff', sev: 'hard', note: 'Model disclaimer, or a guess dressed as a fact.',
        fix: 'Say what is not known, in the piece’s own voice, or cut the sentence.',
        re: phrases(['as of my last update', 'as of my knowledge cutoff',
          'my training data', "i don't have access to real-time",
          'i do not have access to real-time', 'as of my last training']) },

      { cat: 'notjust', sev: 'hard', note: 'The most recognisable AI cadence.',
        fix: 'Say the one true thing. If both halves matter, give each a real sentence.',
        re: new RegExp("\\bnot\\s+(?:just|only|merely|simply)\\b" + INLINE +
        "{1,80}?[,;—–-]\\s*(?:but|it['’]s|it is|they['’]re)\\b", 'gi') },
      { cat: 'notjust', sev: 'hard', note: 'The most recognisable AI cadence.',
        fix: 'Say the one true thing.',
        re: /\b(?:isn|aren|wasn)['’]?t\s+(?:just|only|merely|simply|about)\b/gi },
      { cat: 'notjust', sev: 'hard', note: 'The inverted form of not-just-X-but-Y.',
        fix: 'Say the one true thing.',
        re: new RegExp("\\bmore than (?:a|an|just)\\b" + INLINE +
        "{1,60}[,—]\\s*(?:it['’]s|it is)\\b", 'gi') },

      { cat: 'opener', sev: 'hard', note: 'The piece announces itself instead of starting.',
        fix: 'Open on a claim, a question, a scene, or a number.',
        re: /\bin today['’]s\s+(?:[\w-]+[\s-]+){0,3}(?:world|landscape|market|economy|climate|environment|era|age)\b/gi },
      { cat: 'opener', sev: 'hard', note: 'The piece announces itself instead of starting.',
        fix: 'Open on a claim, a question, a scene, or a number.',
        re: phrases(['in an era of', 'in an era defined by', 'in the ever-evolving',
          'in the ever-changing', 'in the rapidly evolving', 'in the evolving landscape of',
          'in a world where', 'in recent years', 'rapidly evolving', 'digital landscape',
          "let's dive in", "let's dive into",
          "let's explore", "let's take a look", 'buckle up', 'it goes without saying',
          'as we navigate', 'now more than ever', 'more than ever before',
          'has become increasingly', 'have become increasingly', 'in the modern era']) },

      { cat: 'recap', sev: 'hard', at: 'sentence', note: 'The reader was just there.',
        fix: 'End by turning outward, landing one earned line, or leaving it open.',
        re: phrases(['in summary', 'in conclusion', 'to sum up', 'to conclude',
          'all in all', 'at the end of the day', 'in closing', 'to wrap up',
          'as we have seen', 'as mentioned earlier', 'as discussed above',
          'ultimately,', 'in essence']) },

      { cat: 'weasel', sev: 'hard', note: 'Authority with nobody behind it.',
        fix: 'Name the study, the person, the number — or drop the appeal.',
        re: phrases(['studies show', 'studies have shown', 'research shows',
          'research suggests', 'research has shown', 'experts agree', 'experts say',
          'according to experts', 'it is widely believed', "it's widely believed",
          'many believe', 'it is often said', "it's often said", 'some argue',
          'critics argue', 'it is generally accepted']) },

      { cat: 'hedge', sev: 'hard', note: 'Feels safe, says nothing.',
        fix: 'Make the strongest true claim, then qualify it precisely.',
        re: phrases(['it is important to note', "it's important to note",
          'it is important to remember', "it's important to remember",
          'it is worth noting', "it's worth noting", 'it is worth mentioning',
          "it's worth mentioning", 'it should be noted', 'it should be mentioned',
          'there are many factors', 'a variety of factors', 'a number of factors',
          'it ultimately depends', 'in many cases', 'to some extent',
          'generally speaking', 'for the most part', 'one could argue',
          'some might say', 'it can be said that', 'results may vary',
          'in certain cases', 'depending on your needs']) },

      { cat: 'excitement', sev: 'hard', note: 'Telling the reader how to feel. Not your call.',
        fix: 'Delete it. The sentence loses nothing.',
        re: wordList('remarkably surprisingly interestingly notably importantly ' +
          'strikingly incredibly astonishingly unbelievably fascinating exciting ' +
          'thrilling mind-blowing breathtaking jaw-dropping remarkable ' +
          'surprising striking astonishing') },
      { cat: 'excitement', sev: 'soft', note: 'Usually heat, not information.',
        fix: 'Cut unless a real contrast or a number is doing the work.',
        re: wordList('truly quietly amazing awesome stunning extraordinary') },
      { cat: 'excitement', sev: 'hard', note: 'The sentence-shaped version of the same thing.',
        fix: 'State the fact and stop.',
        re: phrases(['the interesting part', "here's what's interesting",
          'the best part is', 'the best bit', 'this is where it gets',
          "here's where it gets", 'wait until you see', "what's fascinating",
          "here's the exciting", 'the fun part', 'the cool part',
          'and this is the interesting', 'the really interesting',
          'the remarkable thing is', 'the striking thing is',
          'what is remarkable', "what's remarkable"]) },

      { cat: 'inflation', sev: 'hard', note: 'Sounds important, means nothing.',
        fix: 'Replace with the concrete thing it stands for.',
        re: wordList('crucial vital pivotal seamless seamlessly revolutionary ' +
          'groundbreaking game-changing cutting-edge state-of-the-art world-class ' +
          'transformative unparalleled unprecedented') },
      { cat: 'inflation', sev: 'soft', note: 'Inflation word. Often replaceable by a fact.',
        fix: 'Say what it does instead of how good it is.',
        re: wordList('essential powerful robust comprehensive holistic scalable ' +
          'innovative dynamic versatile') },
      { cat: 'inflation', sev: 'hard', note: 'Verb inflation.',
        fix: 'use, open, build, run — the plain verb.',
        re: wordList('significantly substantially dramatically ' +
          'unlock unlocks unlocking unlocked elevate elevates elevating ' +
          'empower empowers empowering harness harnesses harnessing leverage ' +
          'leverages leveraging supercharge streamline streamlines streamlining ' +
          'revolutionize revolutionise') },
      { cat: 'inflation', sev: 'hard', note: 'Stock inflation phrase.',
        fix: 'Cut it whole; the sentence usually stands.',
        re: phrases(['navigate the complexities', 'at its core', 'when it comes to',
          'in the realm of', 'the world of', 'a testament to', 'plays a crucial role',
          'plays a vital role', 'plays a key role', 'plays a pivotal role',
          'plays an important role', 'the power of', 'full potential',
          'to the next level', 'in the digital age', 'a game changer']) },

      { cat: 'delve', sev: 'hard', note: 'Technically fine, statistically a model.',
        fix: 'Use the plain word.',
        re: wordList('delve delves delved delving tapestry testament underscore ' +
          'underscores underscoring underscored boasts boasting plethora myriad ' +
          'foster fosters fostering showcase showcases showcasing showcased ' +
          'multifaceted embark embarks embarking beacon') },
      { cat: 'delve', sev: 'soft', note: 'Delve-class when used figuratively.',
        fix: 'Check it is doing literal work; if not, cut.',
        re: wordList('realm realms intricate nuanced landscape symphony ' +
          'treasure-trove interplay') },

      { cat: 'signpost', sev: 'hard', at: 'sentence', note: 'Connective filler, not real sequence.',
        fix: 'Let And, But, So carry it — or number a genuine list.',
        re: phrases(['firstly', 'secondly', 'thirdly', 'fourthly', 'lastly',
          'moreover', 'furthermore', 'additionally', 'in addition,']) },

      { cat: 'concession', sev: 'soft', at: 'sentence', note: 'Concession on rhythm rather than on weakness.',
        fix: 'Keep one, where the argument is actually weak. Cut the rest.',
        re: phrases(['to be fair', 'that said', 'that being said', 'having said that',
          'of course,', 'granted,', 'admittedly', 'on the other hand']) },

      { cat: 'candid', sev: 'hard', at: 'sentence', note: 'Manufactured intimacy before an ordinary claim.',
        fix: 'A person being candid just says the thing.',
        re: phrases(['honestly,', 'honestly?', 'look,', "here's the thing",
          'to be honest', "let's be real", 'truth be told', 'frankly,']) },

      { cat: 'announce', sev: 'hard', note: 'Declaring a manner instead of having it.',
        fix: 'Say the thing.',
        re: phrases(['let me be clear', 'to be blunt', 'no fluff', 'make no mistake',
          'the quiet part out loud', "let's be honest", "i'll be direct",
          "here's the truth", 'plain and simple', 'bottom line:']) },

      { cat: 'pivot', sev: 'hard', note: 'Suspense manufactured across two words.',
        fix: 'Write it as a clause: "The catch is that…"',
        re: /\b(?:the|a|one)\s+(?:catch|result|problem|answer|twist|kicker|upshot|reason|verdict|takeaway|difference|payoff|snag)\?/gi },
      { cat: 'pivot', sev: 'hard', note: 'Fragment question used as a hinge.',
        fix: 'Answer it in the same sentence, or cut the question.',
        re: phrases(['why does this matter?', 'why does it matter?', 'the best part?',
          'sound familiar?', 'the good news?', 'the bad news?', 'so what?',
          'what changed?', 'the result?']) },

      { cat: 'analogy', sev: 'hard', note: 'Flagging a comparison instead of making one.',
        fix: 'Just make the comparison. It works without an usher.',
        re: phrases(['think of it like', 'think of it as', 'imagine a', 'imagine if',
          'picture a', 'picture this', "it's basically the", 'kind of like a',
          'sort of like a', 'the uber of', 'the netflix of', 'akin to']) },

      { cat: 'aphorism', sev: 'soft', note: 'An ordinary claim dressed as a maxim.',
        fix: 'State the mechanism instead: what happens, and why.',
        re: /\b(?:is|are|was|were|becomes|remains)\s+the\s+(?:language|currency|architecture|backbone|lifeblood|foundation|engine|heartbeat|bedrock|cornerstone|soul|heart|secret|key)\s+of\b/gi },
      { cat: 'aphorism', sev: 'soft', note: 'The X-is-the-new-Y formula.',
        fix: 'Say what actually changed.',
        re: /\b\w+\s+is\s+the\s+new\s+\w+\b/gi },

      { cat: 'ingtail', sev: 'hard', note: 'Participle bolted on to fake depth.',
        fix: 'If it makes a real claim, give it a sentence. If not, cut it.',
        re: /,\s+(?:highlighting|underscoring|reflecting|symbolizing|symbolising|showcasing|ensuring|fostering|allowing|enabling|providing|creating|making|helping|offering|demonstrating|emphasizing|emphasising|solidifying|cementing|driving|delivering|leveraging|empowering|paving|marking|signaling|signalling|representing|contributing|resulting|leading|adding|bringing|giving|serving|transforming|unlocking)\b/gi },

      { cat: 'range', sev: 'hard', note: 'A range that has no scale under it.',
        fix: 'Write it as a plain list.',
        re: new RegExp("\\bfrom\\b" + INLINE_NC + "{2,40}\\bto\\b" + INLINE_NC +
        "{2,40},\\s*from\\b", 'gi') },
      { cat: 'range', sev: 'soft', note: 'Stock range phrasing.',
        fix: 'Name the actual items.',
        re: phrases(['ranging from', 'and everything in between', 'and beyond']) },

      { cat: 'tailneg', sev: 'soft', note: 'A clipped "no X" instead of a real clause.',
        fix: 'Write the clause: "… so you don’t have to guess."',
        re: /,\s+no\s+[a-z]+(?:\s+[a-z]+)?\s*[.!?]/g },

      { cat: 'copula', sev: 'soft', note: 'Dodging a plain "is".',
        fix: '"is" is not a weak verb. It is an honest one.',
        re: phrases(['serves as', 'serve as', 'serving as', 'stands as', 'stand as',
          'acts as a', 'functions as', 'represents a', 'comes with the ability']) },

      { cat: 'padding', sev: 'hard', note: 'Restating what the reader already has.',
        fix: 'Trust the reader. Cut it.',
        re: phrases(['as we can see', 'as you can see', 'it is clear that',
          "it's clear that", 'needless to say', 'as previously mentioned',
          'as stated above', 'which means that', 'in other words,',
          'simply put,', 'put simply,']) },

      { cat: 'filler', sev: 'soft', note: 'A fancy word where a plain one fits.',
        fix: 'utilize→use, in order to→to, a number of→some.',
        re: phrases(['utilize', 'utilise', 'utilizing', 'utilising', 'utilization',
          'in order to', 'a number of', 'due to the fact that', 'at this point in time',
          'for the purpose of', 'in terms of', 'with regard to', 'prior to',
          'subsequent to', 'in the event that', 'has the ability to', 'make use of',
          'a wide range of', 'a variety of', 'a myriad of', 'commence', 'endeavour',
          'endeavor', 'facilitate', 'ascertain', 'aforementioned']) }
    ];

    /* Runs before the dictionaries. Returns true when it has settled the tag,
       for the handful of words whose class is decided by what precedes them. */
    function pre(t, ctx) {
      if (ctx.prevTag === 'DET' && NOUN_AFTER_DET[t.lower]) {
        t.tag = 'NOUN'; t.src = 'context'; return true;
      }
      if (NUMWORD[t.lower]) { t.tag = 'NUM'; t.src = 'lex'; return true; }
      return false;
    }

    /* Open-class resolution: everything no dictionary claimed. */
    function open(t, ctx) {
      var w = t.lower, prevTag = ctx.prevTag, afterDet = ctx.afterDet;

      if (!t.initial && /^\p{Lu}/u.test(t.raw)) { t.tag = 'PROPN'; t.src = 'suffix'; return; }

      if (/ly$/.test(w) && w.length > 3) {
        if (afterDet && ctx.next) { t.tag = 'ADJ'; t.src = 'context'; }
        else { t.tag = 'ADV'; t.src = 'suffix'; t.ly = true; }
        return;
      }
      /* Nominalisations first: ADJ_SUFFIX ends in -ent, which swallows every
         -ment word. "engagement" came back ADJ until this order was flipped. */
      if (NOMINAL_SUFFIX.test(w) && w.length > 4) {
        t.tag = 'NOUN'; t.src = 'suffix'; t.nominal = true; return;
      }
      /* a comparative right after a copula is an adjective, not a verb:
         "is harder", "was better", "gets faster" */
      if (/er$/.test(w) && w.length > 4 && prevTag === 'AUX') {
        t.tag = 'ADJ'; t.src = 'context'; return;
      }
      if (/est$/.test(w) && w.length > 4 && !EST_NOT_ADJ[w]) {
        t.tag = 'ADJ'; t.src = 'suffix'; return;
      }
      if (ADJ_SUFFIX.test(w) && w.length > 4) { t.tag = 'ADJ'; t.src = 'suffix'; return; }
      if (/ing$/.test(w) && w.length > 4) {
        if (afterDet || prevTag === 'PREP') { t.tag = 'NOUN'; t.src = 'context'; }
        else { t.tag = 'VERB'; t.src = 'suffix'; t.participle = 'ed'; }
        return;
      }
      if (/ed$/.test(w) && w.length > 3 && !ED_NOT_VERB[w]) {
        t.tag = 'VERB'; t.src = 'suffix'; t.participle = 'ed'; return;
      }
      if (/(?:ate|ify|ise|ize)$/.test(w) && w.length > 4) { t.tag = 'VERB'; t.src = 'suffix'; return; }
      if (ctx.prev && (ctx.prev.lower === 'to' || prevTag === 'MODAL' || prevTag === 'AUX')) {
        t.tag = 'VERB'; t.src = 'context'; return;
      }
      if (/s$/.test(w) && afterDet) { t.tag = 'NOUN'; t.src = 'context'; return; }
      t.tag = 'NOUN'; t.src = 'guess';
    }

    return {
      code: 'en',
      name: 'English',
      script: 'latin',
      tellsFrom: 'measured',
      taggerNote: 'suffix and lexicon rules, developed against English prose',
      stopwords: words('the of and to a in that is it for as was with on be at by ' +
        'this from or an but not are they you have his had were their which one all ' +
        'we there been has more would about when what so if no its who will'),
      lex: [
        [DET, 'DET'], [PRON, 'PRON'], [MODAL, 'MODAL'], [AUX, 'AUX'], [PREP, 'PREP'],
        [CONJ, 'CONJ'], [LY_ADJ, 'ADJ'], [LY_NOUN, 'NOUN'], [LY_VERB, 'VERB'],
        [ADV, 'ADV'], [ADJ, 'ADJ'], [NOT_ADJ, 'NOUN'], [ING_NOUN, 'NOUN'],
        [COMMON_VERB, 'VERB'], [IRREGULAR_PARTICIPLE, 'VERB']
      ],
      pre: pre,
      open: open,
      be: BE,
      isParticiple: function (t) { return t.participle === 'ed' || !!IRREGULAR_PARTICIPLE[t.lower]; },
      adverbMark: function (t) { return /ly$/.test(t.lower); },
      adverbMarkLabel: '-ly adverbs',
      adverbMarkNote: 'the -ly count is the one to watch',
      rules: RULES,
      furniture: FURNITURE,
      furniturePhrase: FURNITURE_PHRASE,
      titleCaseSmall: words('a an the and or but of in on at to for with from by as is it'),
      syllables: syllables,
      baseline: BASELINE
    };
  })();

  /* ==================================================================== */
  /*  Ukrainian                                                           */
  /* ==================================================================== */

  var UK = (function () {
    var DET = words(
      'цей ця це ці той та те ті мій моя моє мої твій твоя твоє твої його її ' +
      'наш наша наше наші ваш ваша ваше ваші їхній їхня їхнє їхні свій своя ' +
      'своє свої який яка яке які такий така таке такі весь вся все всі кожен ' +
      'кожна кожне кожні жоден жодна жодне інший інша інше інші сам сама самі ' +
      'багато мало кілька декілька більшість меншість жодного');

    var PRON = words(
      'я мене мені мною ти тебе тобі тобою він його йому ним нього нім вона ' +
      'її їй нею ній воно ми нас нам нами ви вас вам вами вони їх їм ними них ' +
      'хто кого кому ким що чого чому чим себе собі собою хтось щось дехто ' +
      'дещо ніхто ніщо нікого нічого один одна одне одні');

    var PREP = words(
      'в у на з із зі до від од для про за під над при без через між поміж ' +
      'серед після перед біля коло крім окрім замість щодо згідно протягом ' +
      'завдяки всупереч по о об поза напроти навколо близько внаслідок ' +
      'відповідно стосовно упродовж');

    var CONJ = words(
      'і й та а але або чи що щоб як коли якщо бо тому проте однак адже ніж ' +
      'аби хоча хоч мов наче ніби неначе зате причому доки поки якби нібито');

    var AUX = words(
      'є був була було були буде будуть будеш буду будемо будете бути мати ' +
      'має мають мав мала мали немає нема бувши будучи стає стало стали став');

    var MODAL = words(
      'може можуть можна можу можемо можете міг могла могли треба потрібно ' +
      'слід мусить мусять мушу повинен повинна повинні варто доводиться');

    /* particles ride with the adverbs: they behave the same for counting */
    var ADV = words(
      'не ні вже ще тільки лише дуже зовсім майже завжди ніколи часто іноді ' +
      'інколи тут там тепер зараз потім раніше пізніше надто надміру теж ' +
      'також навіть саме просто звичайно звісно мабуть можливо справді дійсно ' +
      'знову разом окремо швидко повільно добре погано краще гірше багато ' +
      'мало більше менше найбільше найменше дедалі досить надзвичайно вкрай ' +
      'геть цілком повністю частково загалом взагалі особливо зокрема нарешті ' +
      'спочатку отже тобто натомість водночас так ось он ледве трохи майже ' +
      'зрештою навряд принаймні щонайменше щонайбільше нібито немов згодом ' +
      'відразу одразу негайно поступово раптом врешті нещодавно донедавна ' +
      'досі поки ще-раз абсолютно точно приблизно орієнтовно фактично реально ' +
      'практично теоретично буквально суто виключно насамперед передусім');

    var ADJ = words(
      'новий нова нове нові старий стара старе старі великий велика велике ' +
      'великі малий мала мале малі маленький добрий гарний поганий високий ' +
      'низький довгий короткий важливий головний основний різний однаковий ' +
      'сучасний майбутній минулий перший другий третій останній наступний ' +
      'попередній єдиний спільний власний окремий загальний конкретний ' +
      'простий складний легкий важкий сильний слабкий швидкий повільний ' +
      'ясний чіткий вільний повний порожній відкритий закритий правильний ' +
      'неправильний можливий неможливий потрібний необхідний корисний ' +
      'шкідливий дешевий дорогий справжній несправжній цілий інший');

    /* Adverbs are the weak spot: a Ukrainian adverb usually ends in -о, and so
       do a great many neuter nouns (вікно, слово, місто). Rather than guess,
       this pack recognises adverbs from the list above plus the derivational
       endings that only adverbs take. It therefore UNDER-counts adverbs. */
    var ADV_SUFFIX = /(?:ично|ально|ельно|ивно|ливо|ерно|ково|івно|ому|ськи|цьки|чому)$/u;

    var NOMINAL_SUFFIX = /(?:ння|ття|ість|ості|остю|ація|яція|изація|ізація|изм|ізм|ство|цтво|ування|ення|ання|іння)$/u;

    /* Nominative adjective endings, plus the case endings only adjectives take.
       -на and -не are left out on purpose: ціна, війна, країна, машина. */
    var ADJ_SUFFIX = new RegExp(
      '(?:ний|ній|ський|цький|ичний|івний|альний|ельний|овий|евий|ивий|ливий|уватий|истий)$' +
      '|(?:н|ов|ев|ськ|цьк|ичн|альн|ельн|ивн|ливн|уват|ист)(?:ого|ому|им|их|ими|ій|ої|ою|ий|і)$', 'u');

    var VERB_SUFFIX = /(?:тися|тись|ти|ється|ються|ють|ять|уть|ать|ить|ємо|имо|єте|ите|єш|иш|ував|увала|ували|вав|вала|вали)$/u;

    /* Impersonal passive: зроблено, прийнято, встановлено. */
    var IMPERSONAL = /(?:ено|ано|яно|уто|ито)$/u;

    function open(t, ctx) {
      var w = t.lower;
      if (!t.initial && /^\p{Lu}/u.test(t.raw)) { t.tag = 'PROPN'; t.src = 'suffix'; return; }
      if (NOMINAL_SUFFIX.test(w) && w.length > 4) {
        t.tag = 'NOUN'; t.src = 'suffix'; t.nominal = true; return;
      }
      if (IMPERSONAL.test(w) && w.length > 5) {
        t.tag = 'VERB'; t.src = 'suffix'; t.participle = 'impersonal'; return;
      }
      if (ADJ_SUFFIX.test(w) && w.length > 4) { t.tag = 'ADJ'; t.src = 'suffix'; return; }
      if (ADV_SUFFIX.test(w) && w.length > 4) {
        t.tag = 'ADV'; t.src = 'suffix'; t.advMark = true; return;
      }
      if (VERB_SUFFIX.test(w) && w.length > 3) { t.tag = 'VERB'; t.src = 'suffix'; return; }
      t.tag = 'NOUN'; t.src = 'guess';
    }

    var RULES = [
      { cat: 'opener', sev: 'hard', note: 'Текст оголошує себе замість того, щоб початися.',
        fix: 'Почніть із твердження, питання, сцени або числа.',
        re: phrases(['у сучасному світі', 'в сучасному світі', 'у сучасному цифровому світі',
          'в сучасному цифровому світі', 'у сучасному бізнес-середовищі', 'в епоху',
          'у світі, де', 'в світі, де', 'сьогодні, коли', 'останнім часом',
          'дедалі частіше', 'нині, коли', 'давайте розглянемо', 'розгляньмо детальніше',
          'зануримося', 'пориньмо', 'у наш час', 'в наш час', 'як ніколи раніше']) },

      { cat: 'notjust', sev: 'hard', note: 'Найвпізнаваніша машинна каденція.',
        fix: 'Скажіть одну правдиву річ. Якщо важливі обидві — дайте кожній окреме речення.',
        re: new RegExp("(?<![\\p{L}\\p{N}_])не\\s+(?:просто|лише|тільки|стільки)(?![\\p{L}\\p{N}_])" +
          INLINE + "{1,80}?[,;—–]\\s*(?:а|але|це)(?![\\p{L}\\p{N}_])", 'giu') },

      { cat: 'inflation', sev: 'hard', note: 'Звучить важливо, не означає нічого.',
        fix: 'Замініть на конкретну річ, яку воно позначає.',
        re: wordList('потужний потужна потужне потужні революційний революційна ' +
          'інноваційний інноваційна унікальний унікальна безшовний комплексний ' +
          'проривний передовий') },
      { cat: 'inflation', sev: 'hard', note: 'Готова фраза-надувка.',
        fix: 'Виріжте цілком; речення зазвичай вистоїть.',
        re: phrases(['відкрити нові можливості', 'вивести на новий рівень',
          'розкрити потенціал', 'розкрити весь потенціал', 'розкриваючи потенціал',
          'значно підвищує', 'значно покращує', 'суттєво підвищує',
          'відіграє важливу роль',
          'відіграє ключову роль', 'відіграє вирішальну роль',
          'у світі технологій', 'сила технологій', 'на новий рівень']) },
      { cat: 'inflation', sev: 'soft', note: 'Слово-надувка. Часто замінюється фактом.',
        fix: 'Скажіть, що воно робить, а не наскільки воно добре.',
        re: wordList('ключовий ключова ключове ключові ефективний ефективна ' +
          'комплексна масштабований гнучкий надійний') },

      { cat: 'hedge', sev: 'hard', note: 'Здається безпечним, не каже нічого.',
        fix: 'Зробіть найсильніше правдиве твердження, потім уточніть його точно.',
        re: phrases(['важливо зазначити', 'варто зазначити', 'слід зазначити',
          'варто відзначити', 'слід відзначити', 'не можна не зазначити',
          'існує багато факторів', 'залежить від багатьох факторів',
          'залежить від багатьох чинників', 'загалом кажучи', 'певною мірою',
          'у певному сенсі', 'результати можуть відрізнятися', 'у багатьох випадках']) },

      { cat: 'recap', sev: 'hard', at: 'sentence', note: 'Читач щойно був тут.',
        fix: 'Завершуйте поворотом назовні або однією заробленою лінією.',
        re: phrases(['підсумовуючи', 'на завершення', 'у підсумку', 'в підсумку',
          'таким чином', 'врешті-решт', 'зрештою', 'отже, можна сказати',
          'підбиваючи підсумки']) },

      { cat: 'weasel', sev: 'hard', note: 'Авторитет, за яким нікого немає.',
        fix: 'Назвіть дослідження, людину, число — або відмовтесь від апеляції.',
        re: phrases(['дослідження показують', 'дослідження свідчать',
          'вчені стверджують', 'науковці стверджують', 'експерти вважають',
          'експерти погоджуються', 'експерти радять', 'вважається, що',
          'загальновідомо, що', 'багато хто вважає']) },

      { cat: 'signpost', sev: 'soft', at: 'sentence', note: 'Сполучник як наповнювач, а не як справжня послідовність.',
        fix: 'Хай "і", "але", "тому" несуть потік — або пронумеруйте справжній список.',
        re: phrases(['по-перше', 'по-друге', 'по-третє', 'крім того', 'більше того',
          'до того ж', 'окрім того', 'варто додати']) },

      { cat: 'excitement', sev: 'hard', note: 'Ви кажете читачеві, що відчувати. Це не ваша справа.',
        fix: 'Видаліть. Речення нічого не втратить.',
        re: wordList('дивовижно вражаюче неймовірно приголомшливо разюче ' +
          'захопливо надзвичайно-цікаво') },
      { cat: 'excitement', sev: 'hard', note: 'Те саме, але у формі речення.',
        fix: 'Назвіть факт і зупиніться.',
        re: phrases(['цікаво, що', 'найцікавіше те, що', 'найцікавіше', 'що цікаво',
          'і ось тут починається найцікавіше', 'найкраще те, що']) },

      { cat: 'analogy', sev: 'hard', note: 'Оголошення порівняння замість самого порівняння.',
        fix: 'Просто зробіть порівняння. Воно працює без розпорядника.',
        re: phrases(['уявіть собі', 'уявіть, що', 'це схоже на', 'думайте про це як',
          'подумайте про це як', 'уявіть це як']) },

      { cat: 'filler', sev: 'soft', note: 'Канцелярит там, де є просте слово.',
        fix: 'здійснювати → робити, з метою → щоб, на сьогоднішній день → сьогодні.',
        re: phrases(['здійснювати', 'здійснення', 'реалізувати', 'реалізація',
          'з метою', 'у зв\'язку з тим, що', 'на сьогоднішній день',
          'в рамках', 'у рамках', 'шляхом', 'задля того, щоб', 'з огляду на те, що',
          'має місце', 'є таким, що']) }
    ];

    return {
      code: 'uk',
      name: 'Ukrainian',
      script: 'cyrillic',
      tellsFrom: 'translated',
      taggerNote: 'closed classes from word lists; adverbs under-counted on purpose — see the pack',
      stopwords: words('і в на з до що не як за від для по та це у є або але ' +
        'який яка які його її їх ми ви вони він вона тому щоб коли якщо'),
      marker: /[іїєґ]/,
      lex: [
        [DET, 'DET'], [PRON, 'PRON'], [MODAL, 'MODAL'], [AUX, 'AUX'], [PREP, 'PREP'],
        [CONJ, 'CONJ'], [ADV, 'ADV'], [ADJ, 'ADJ']
      ],
      open: open,
      be: words('є був була було були буде будуть бути'),
      isParticiple: function (t) {
        return t.participle === 'impersonal' || /(?:ний|на|не|ні|тий|та|те|ті)$/u.test(t.lower);
      },
      adverbMark: function (t) { return !!t.advMark; },
      adverbMarkLabel: 'derived adverbs',
      adverbMarkNote: 'suffix-derived only; adverbs from the word list are not counted here',
      rules: RULES,
      furniture: words('вступ огляд контекст передумови переваги недоліки ' +
        'виклики висновок висновки підсумок résumé особливості деталі основи'),
      furniturePhrase: ['ключові висновки', 'заключні думки', 'з чого почати',
        'чому це важливо', 'як це працює', 'найкращі практики', 'наступні кроки',
        'переваги та недоліки', 'часті запитання'],
      titleCaseSmall: null,
      syllables: null,
      baseline: null
    };
  })();

  /* ==================================================================== */
  /*  Russian                                                             */
  /* ==================================================================== */

  var RU = (function () {
    var DET = words(
      'этот эта это эти тот та то те мой моя моё мои твой твоя твоё твои его ' +
      'её наш наша наше наши ваш ваша ваше ваши их свой своя своё свои какой ' +
      'какая какое какие такой такая такое такие весь вся всё все каждый ' +
      'каждая каждое любой любая другой другая другое другие сам сама сами ' +
      'много мало несколько большинство меньшинство никакой');

    var PRON = words(
      'я меня мне мной ты тебя тебе тобой он него ему им нём она неё ей ней ' +
      'оно мы нас нам нами вы вас вам вами они них ими кто кого кому кем что ' +
      'чего чему чем себя себе собой кто-то что-то некто нечто никто ничто ' +
      'никого ничего один одна одно одни');

    var PREP = words(
      'в во на с со из от до для о об про за под над при без через между ' +
      'среди после перед около кроме вместо согласно благодаря вопреки по у ' +
      'к ко из-за из-под вследствие относительно насчёт вокруг сквозь');

    var CONJ = words(
      'и а но или либо что чтобы как когда если потому оттого зато однако ' +
      'ведь чем хотя пусть будто словно причём пока раз ибо коли');

    var AUX = words(
      'есть был была было были будет будут буду будешь будем будете быть ' +
      'иметь имеет имеют имел имела имели нет стал стала стало стали');

    var MODAL = words(
      'может могут могу можем можете мог могла могли можно нужно надо ' +
      'следует должен должна должны стоит приходится');

    var ADV = words(
      'не ни уже ещё еще только лишь очень совсем почти всегда никогда часто ' +
      'иногда здесь тут там теперь сейчас потом раньше позже слишком тоже ' +
      'также даже именно просто конечно наверное возможно действительно снова ' +
      'вместе отдельно быстро медленно хорошо плохо лучше хуже много мало ' +
      'больше меньше довольно крайне вполне полностью частично вообще особенно ' +
      'наконец сначала итак напротив впрочем так вот едва немного отнюдь ' +
      'наоборот скорее пожалуй разве хотя-бы по-крайней-мере абсолютно точно ' +
      'примерно фактически реально практически теоретически буквально ' +
      'исключительно прежде-всего постепенно внезапно вдруг недавно до-сих-пор');

    var ADJ = words(
      'новый новая новое новые старый старая большой большая маленький ' +
      'хороший плохой высокий низкий длинный короткий важный главный основной ' +
      'разный одинаковый современный будущий прошлый первый второй третий ' +
      'последний следующий предыдущий единственный общий собственный ' +
      'отдельный конкретный простой сложный лёгкий тяжёлый сильный слабый ' +
      'быстрый медленный ясный чёткий свободный полный пустой открытый ' +
      'закрытый правильный неправильный возможный невозможный нужный ' +
      'необходимый полезный вредный дешёвый дорогой настоящий целый');

    /* Same caution as the Ukrainian pack: -о is the adverb ending and also
       half the neuter nouns, so only the unambiguous endings are guessed. */
    var ADV_SUFFIX = /(?:ически|ально|ельно|ивно|ливо|ерно|ково|ому|ически)$/u;

    var NOMINAL_SUFFIX = /(?:ние|ание|ение|тие|ость|ости|остью|ация|изация|изм|ство|тво|ирование)$/u;

    var ADJ_SUFFIX = new RegExp(
      '(?:ный|ний|ский|ческий|ичный|овый|евый|ивый|ливый|анный|енный|атый|истый)$' +
      '|(?:н|ов|ев|ск|ческ|ичн|альн|ельн|ивн|ливн|ист)(?:ого|ому|ым|ых|ыми|ой|ую|ая|ое|ые|ий|ом|ем|ей)$', 'u');

    var VERB_SUFFIX = /(?:ться|тся|ть|ется|ются|ают|яют|уют|ют|ат|ят|ит|ешь|ишь|ует|овал|овала|овали|ировать)$/u;

    var IMPERSONAL = /(?:ено|ано|яно|уто|ито)$/u;

    function open(t, ctx) {
      var w = t.lower;
      if (!t.initial && /^\p{Lu}/u.test(t.raw)) { t.tag = 'PROPN'; t.src = 'suffix'; return; }
      if (NOMINAL_SUFFIX.test(w) && w.length > 4) {
        t.tag = 'NOUN'; t.src = 'suffix'; t.nominal = true; return;
      }
      if (IMPERSONAL.test(w) && w.length > 5) {
        t.tag = 'VERB'; t.src = 'suffix'; t.participle = 'impersonal'; return;
      }
      if (ADJ_SUFFIX.test(w) && w.length > 4) { t.tag = 'ADJ'; t.src = 'suffix'; return; }
      if (ADV_SUFFIX.test(w) && w.length > 4) {
        t.tag = 'ADV'; t.src = 'suffix'; t.advMark = true; return;
      }
      if (VERB_SUFFIX.test(w) && w.length > 3) { t.tag = 'VERB'; t.src = 'suffix'; return; }
      t.tag = 'NOUN'; t.src = 'guess';
    }

    var RULES = [
      { cat: 'opener', sev: 'hard', note: 'Текст объявляет себя вместо того, чтобы начаться.',
        fix: 'Начните с утверждения, вопроса, сцены или числа.',
        re: phrases(['в современном мире', 'в современном цифровом мире',
          'в эпоху', 'в мире, где', 'в последнее время', 'всё чаще', 'все чаще',
          'сегодня, когда', 'давайте разберёмся', 'давайте погрузимся',
          'погрузимся в', 'в наше время', 'как никогда раньше',
          'в стремительно меняющемся мире']) },

      { cat: 'notjust', sev: 'hard', note: 'Самая узнаваемая машинная каденция.',
        fix: 'Скажите одну верную вещь. Если важны обе — дайте каждой своё предложение.',
        re: new RegExp("(?<![\\p{L}\\p{N}_])не\\s+(?:просто|только|столько)(?![\\p{L}\\p{N}_])" +
          INLINE + "{1,80}?[,;—–]\\s*(?:а|но|это)(?![\\p{L}\\p{N}_])", 'giu') },

      { cat: 'inflation', sev: 'hard', note: 'Звучит важно, не значит ничего.',
        fix: 'Замените конкретной вещью, которую оно обозначает.',
        re: wordList('мощный мощная мощное мощные революционный революционная ' +
          'инновационный уникальный бесшовный прорывной передовой ' +
          'непревзойдённый беспрецедентный') },
      { cat: 'inflation', sev: 'hard', note: 'Готовая фраза-надувка.',
        fix: 'Вырежьте целиком; предложение обычно устоит.',
        re: phrases(['открыть новые возможности', 'вывести на новый уровень',
          'раскрыть потенциал', 'раскрыть весь потенциал', 'раскрывая потенциал',
          'значительно повышает', 'значительно улучшает', 'существенно повышает',
          'играет важную роль',
          'играет ключевую роль', 'играет решающую роль', 'сила технологий',
          'в мире технологий', 'на новый уровень']) },
      { cat: 'inflation', sev: 'soft', note: 'Слово-надувка. Часто заменяется фактом.',
        fix: 'Скажите, что оно делает, а не насколько оно хорошо.',
        re: wordList('ключевой ключевая ключевое ключевые эффективный ' +
          'комплексный масштабируемый гибкий надёжный') },

      { cat: 'hedge', sev: 'hard', note: 'Кажется безопасным, не говорит ничего.',
        fix: 'Сделайте самое сильное верное утверждение, затем уточните его точно.',
        re: phrases(['важно отметить', 'стоит отметить', 'следует отметить',
          'нельзя не отметить', 'надо отметить', 'существует множество факторов',
          'зависит от многих факторов', 'вообще говоря', 'в определённой степени',
          'в некотором смысле', 'результаты могут отличаться', 'во многих случаях']) },

      { cat: 'recap', sev: 'hard', at: 'sentence', note: 'Читатель только что здесь был.',
        fix: 'Заканчивайте поворотом наружу или одной заработанной строкой.',
        re: phrases(['подводя итог', 'в заключение', 'в итоге', 'таким образом',
          'в конечном счёте', 'в конечном счете', 'резюмируя',
          'подводя итоги', 'итак, можно сказать']) },

      { cat: 'weasel', sev: 'hard', note: 'Авторитет, за которым никого нет.',
        fix: 'Назовите исследование, человека, число — или откажитесь от апелляции.',
        re: phrases(['исследования показывают', 'исследования свидетельствуют',
          'учёные утверждают', 'ученые утверждают', 'эксперты считают',
          'эксперты сходятся', 'эксперты советуют', 'считается, что',
          'общеизвестно, что', 'многие считают']) },

      { cat: 'signpost', sev: 'soft', at: 'sentence', note: 'Союз как наполнитель, а не как настоящая последовательность.',
        fix: 'Пусть "и", "но", "поэтому" несут поток — или пронумеруйте настоящий список.',
        re: phrases(['во-первых', 'во-вторых', 'в-третьих', 'кроме того',
          'более того', 'к тому же', 'помимо этого', 'стоит добавить']) },

      { cat: 'excitement', sev: 'hard', note: 'Вы говорите читателю, что чувствовать. Это не ваше дело.',
        fix: 'Удалите. Предложение ничего не потеряет.',
        re: wordList('удивительно поразительно невероятно потрясающе ' +
          'ошеломляюще захватывающе') },
      { cat: 'excitement', sev: 'hard', note: 'То же самое, но в форме предложения.',
        fix: 'Назовите факт и остановитесь.',
        re: phrases(['интересно, что', 'самое интересное', 'что интересно',
          'и вот тут начинается самое интересное', 'самое лучшее то, что']) },

      { cat: 'analogy', sev: 'hard', note: 'Объявление сравнения вместо самого сравнения.',
        fix: 'Просто сделайте сравнение. Оно работает без распорядителя.',
        re: phrases(['представьте себе', 'представьте, что', 'это похоже на',
          'думайте об этом как', 'подумайте об этом как']) },

      { cat: 'filler', sev: 'soft', note: 'Канцелярит там, где есть простое слово.',
        fix: 'осуществлять → делать, с целью → чтобы, на сегодняшний день → сегодня.',
        re: phrases(['осуществлять', 'осуществление', 'реализовывать', 'реализация',
          'с целью', 'в связи с тем, что', 'на сегодняшний день', 'в рамках',
          'путём', 'для того, чтобы', 'ввиду того, что', 'имеет место',
          'является тем, что']) }
    ];

    return {
      code: 'ru',
      name: 'Russian',
      script: 'cyrillic',
      tellsFrom: 'translated',
      taggerNote: 'closed classes from word lists; adverbs under-counted on purpose — see the pack',
      stopwords: words('и в на с что не как по для от это за к о но или ' +
        'который которая которые его её их мы вы они он она чтобы когда если'),
      marker: /[ыэъё]/,
      lex: [
        [DET, 'DET'], [PRON, 'PRON'], [MODAL, 'MODAL'], [AUX, 'AUX'], [PREP, 'PREP'],
        [CONJ, 'CONJ'], [ADV, 'ADV'], [ADJ, 'ADJ']
      ],
      open: open,
      be: words('есть был была было были будет будут быть'),
      isParticiple: function (t) {
        return t.participle === 'impersonal' || /(?:нный|тый|ная|ное|ные|тая|тое)$/u.test(t.lower);
      },
      adverbMark: function (t) { return !!t.advMark; },
      adverbMarkLabel: 'derived adverbs',
      adverbMarkNote: 'suffix-derived only; adverbs from the word list are not counted here',
      rules: RULES,
      furniture: words('введение обзор контекст предпосылки преимущества ' +
        'недостатки вызовы заключение выводы итог особенности детали основы'),
      furniturePhrase: ['ключевые выводы', 'заключительные мысли', 'с чего начать',
        'почему это важно', 'как это работает', 'лучшие практики', 'следующие шаги',
        'плюсы и минусы', 'частые вопросы'],
      titleCaseSmall: null,
      syllables: null,
      baseline: null
    };
  })();

  /* ==================================================================== */
  /*  Which language is this?                                             */
  /* ==================================================================== */

  var PACKS = { en: EN, uk: UK, ru: RU };

  var SCRIPT_RE = {
    latin:      /[A-Za-zÀ-ɏ]/g,
    cyrillic:   /[Ѐ-ӿ]/g,
    greek:      /[Ͱ-Ͽ]/g,
    arabic:     /[؀-ۿ]/g,
    hebrew:     /[֐-׿]/g,
    devanagari: /[ऀ-ॿ]/g,
    han:        /[一-鿿぀-ヿ]/g
  };

  /* Scripts that mark sentence starts with a capital. The engine needs to know:
     without case there is nothing for the sentence splitter to look for. */
  var CASED = { latin: true, cyrillic: true, greek: true };

  function scriptOf(text) {
    var best = null, bestN = 0, counts = {};
    Object.keys(SCRIPT_RE).forEach(function (k) {
      var m = text.match(SCRIPT_RE[k]);
      counts[k] = m ? m.length : 0;
      if (counts[k] > bestN) { bestN = counts[k]; best = k; }
    });
    var total = Object.keys(counts).reduce(function (a, k) { return a + counts[k]; }, 0);
    return { script: best, share: total ? bestN / total : 0, counts: counts, letters: total };
  }

  /* Stopword vote among the packs that use this script, plus the marker letters
     that separate Ukrainian from Russian (і ї є ґ against ы э ъ ё). */
  function detect(text, hint) {
    if (hint && PACKS[hint]) {
      return { pack: PACKS[hint], code: hint, name: PACKS[hint].name,
               script: PACKS[hint].script, confidence: 1, method: 'told' };
    }
    var s = scriptOf(text);
    if (!s.script || s.letters < 20) {
      return { pack: null, code: null, name: null, script: s.script,
               cased: true, confidence: 0, method: 'too little text' };
    }

    var sample = text.toLowerCase().match(/[\p{L}]+/gu) || [];
    var candidates = Object.keys(PACKS).filter(function (c) { return PACKS[c].script === s.script; });

    if (!candidates.length) {
      return { pack: null, code: null, name: null, script: s.script,
               cased: !!CASED[s.script], confidence: 0, method: 'no pack for this script' };
    }

    var scores = candidates.map(function (c) {
      var p = PACKS[c], hits = 0;
      sample.forEach(function (w) { if (p.stopwords[w]) hits++; });
      var score = sample.length ? hits / sample.length : 0;
      if (p.marker) {
        var m = text.match(new RegExp(p.marker.source, 'gi'));
        score += (m ? m.length : 0) / Math.max(1, s.letters) * 2;
      }
      return { code: c, score: score };
    }).sort(function (a, b) { return b.score - a.score; });

    /* A real match puts 25-50% of tokens on the stopword list. German against
       the English list scores 0.036, so the floor has to sit well above that
       or every Latin-script language gets called English. */
    var FLOOR = 0.12, FULL = 0.32;
    var top = scores[0], runner = scores[1];
    if (top.score < FLOOR) {
      return { pack: null, code: null, name: null, script: s.script,
               cased: !!CASED[s.script], confidence: 0,
               method: 'script recognised, no pack matched', scores: scores };
    }
    /* confidence needs both: a strong absolute match AND daylight over the
       runner-up. Either one alone is how you mistake German for English. */
    var strength = Math.min(1, (top.score - FLOOR) / (FULL - FLOOR));
    var margin = runner ? (top.score - runner.score) / top.score : 1;
    return {
      pack: PACKS[top.code], code: top.code, name: PACKS[top.code].name,
      script: s.script, cased: !!CASED[s.script],
      confidence: Math.round(Math.min(strength, margin) * 100) / 100,
      method: 'stopword and letter vote', scores: scores
    };
  }

  return {
    PACKS: PACKS,
    CASED: CASED,
    detect: detect,
    scriptOf: scriptOf,
    codes: function () { return Object.keys(PACKS); }
  };
});
