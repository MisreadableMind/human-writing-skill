# ripley

A Claude Code skill for prose that reads like a person wrote it — essays, blog posts,
newsletters, emails, docs, READMEs, landing copy, talks, threads. It distills how three
working essayists actually write, from close analysis of 700+ of their essays. And it
ships a checker that measures whether a draft got there.

Named for Patricia Highsmith's Tom Ripley, who studied people until he could pass for
them. Same job, narrower crime.

It ships as one plugin in a marketplace named `vitalii-skills`.

## Install

```
/plugin marketplace add MisreadableMind/human-writing-skill
/plugin install ripley@vitalii-skills
```

Restart Claude Code. To install from a local clone instead:

```
/plugin marketplace add /path/to/this/repo
/plugin install ripley@vitalii-skills
```

Run `/plugin` to check it's enabled.

## Use it

There's no command to type. Claude loads the skill on its own when the request is a
writing request:

```
Draft a launch post for the new API. Under 400 words.
Rewrite this intro — it sounds like AI.
Make this email less corporate.
Here are three of my old posts. Write the next one in my voice.
Write this in Benedict Evans's register.
Explain how the tariff actually works. Economist style, no hedging.
```

It stays out of the way for things that should stay mechanical: changelogs, commit
messages, API reference tables, legal boilerplate.

## Check it

The prose guidance is the argument. This is the arithmetic.

```
node ripley/skills/ripley/scripts/ripley.js draft.md
```

Pointed at four paragraphs of the stock model register, it prints:

```
bad.md  -  154 words, 13 sentences, 4 paragraphs

  GENERATED  11 tell categories and 1 structural marker firing at once.
  - 4 headings that would fit any piece on any topic

TELLS
  empty inflation        13  (9 hard, 4 soft)   tell #3
         6:6  "crucial"
       13:12  "innovative"
       13:24  "scalable"
              ... and 10 more
              -> Replace with the concrete thing it stands for.
  delve-class words       3  (3 hard, 0 soft)   tell #4
       12:30  "delve"
       12:50  "tapestry"
              -> Use the plain word.
  throat-clearing         2  (2 hard, 0 soft)   tell #1
         5:1  "In today's rapidly evolving digital landscape"
        12:1  "Let's dive in"
              -> Open on a claim, a question, a scene, or a number.
```

Then word classes, then structure:

```
WORD CLASSES   50% from word lists, 18.8% suffix, 13.6% context, 17.5% guessed
  nouns             48   31.2%  #######.................
  adjectives        20   13.0%  ###.....................
  adverbs            7    4.5%  #.......................

  -ly adverbs         2     1.30/100w
  nominalisations     6     3.90/100w   -tion, -ment, -ity: abstraction
  lexical density 62.3%

STRUCTURE
  rhythm        13 sentences in 4 full paragraphs   (2-29 words)
    spread (sd/mean)      0.59
    under 9 words        30.8%
    measured baselines   spread     <9w   12-25w
      Paul Graham        0.61   21.0%    50.0%
  sections      4
    Overview                             35w  #############.......
    Benefits                             53w  ####################
  layout        1 Title Case heading
                4 furniture headings (Overview, Benefits, Challenges)
```

Reads stdin if you give it no file. `--json` for the whole report, `--quiet` for flags
only, `--html out.html` to write a standalone page you can open, `--lang uk` to override
the language guess. No dependencies.

## Other languages

English, Ukrainian and Russian have packs. The language comes from the script plus a
stopword vote, and you can force it with `--lang` or the picker in the app.

Everything else gets a refusal, which is the point:

```
de.md  -  93 words, 7 sentences, 3 paragraphs  [latin script, no pack]
  Packs available: en, uk, ru. Force one with --lang.

  UNKNOWN  No pack for this language, so no verdict. Shape and punctuation
           below still hold; word classes and tells do not.

TELLS          skipped: no pack for this language
WORD CLASSES   skipped: no language pack
```

German scores 0.036 on the English stopword list against English's 0.47, so the
detector can tell them apart and declines rather than reporting a page of numbers
produced by running English word lists over German. Paragraph shape, sentence spread
and punctuation do not care what language they are in, so those still run.

Two things differ outside English. There are no measured rhythm baselines, so the
spread numbers come with no verdict attached — they still compare two of your own
drafts. And the Ukrainian and Russian tell lists are translations of the English one:
a hypothesis about what generated Ukrainian sounds like, not a measurement. Every
report says which kind it is using.

Adding a language means editing one file. `app/languages.js` holds a pack per
language — word lists, suffix rules, tell phrases, and one function to resolve the
words no list claimed. `app/engine.js` knows no language at all.

## The browser app

For text you want to paste and poke at, open
[`ripley/skills/ripley/app/index.html`](ripley/skills/ripley/app/index.html) in a
browser. Same engine, live as you type.

Every tell is highlighted in place and coloured by category. Adverbs, adjectives,
nominalisations and passives switch on as separate layers, so you can see the adverb
density rather than read it off a table. Clicking a flag in the sidebar jumps the
cursor to it. Two buttons load a before and after — the stock model register, and the
same point written by a person — so you can watch the counts move.

It fetches nothing from the network — not a font, not a library, not an analytics
call. Your text never leaves the page.

## Tests

```
node ripley/skills/ripley/tests/run.js      248 checks, no network, no cost
node ripley/skills/ripley/tests/oracle.js   one batched claude -p call
```

`run.js` is the one to run after touching a rule. It holds the English rhythm numbers
to `rhythm.py`, proves every flag offset indexes the original string, and catches the
bug that module-level global regexes invite: analysing the same text twice and getting
different answers.

`oracle.js` is the half that costs money. It batches the whole corpus into a single
`claude -p` call — on your Claude subscription, no API key — and reports where the
heuristics and the model disagree about language, tells, and word class.

Batching is not an optimisation, it is the design. Every `claude -p` invocation carries
15–20k tokens of fixed scaffolding before it reads a word of yours, and no flag removes
it: replacing the system prompt made it worse, because it only broke the cache. Seven
texts in one call pay that once. Seven calls pay it seven times.

The last run, on seven texts:

```
LANGUAGE       7/7 agree  (100%)

TELLS
  the model flagged     52   of which the engine also caught 51  (98.1%)
  the engine flagged    78   of which the model also named   56  (71.8%)

WORD CLASSES   61/81 agree  (75.3%)
    en       33/42   78.6%
    ru       10/14   71.4%
    uk       18/25     72%
```

The percentages are the least useful part. What earns the cost is the disagreement
list, which found six real defects the fixed expectations could not: `-ment` words
tagged adjective because `ADJ_SUFFIX` ends in `-ent` and ran first, spelled-out numbers
falling through to noun, comparatives after a copula tagged verb, Russian adjectives in
the prepositional case missed, and two tell phrases nobody had thought of. Fixing them
moved tell agreement from 88.2% to 98.1% and word classes from 69.0% to 75.3%.

Read it as agreement, not accuracy. Claude is a second opinion, not ground truth —
where both are wrong in the same direction this reports 100%.

## What's inside

| File | What it does |
|---|---|
| [`SKILL.md`](ripley/skills/ripley/SKILL.md) | Eleven principles, the worst AI tells, how to pick a voice. |
| [`references/anti-ai-tells.md`](ripley/skills/ripley/references/anti-ai-tells.md) | 30 tells with rewrites — and a section on what is *not* a tell, so you don't over-correct. |
| [`references/structure-tells.md`](ripley/skills/ripley/references/structure-tells.md) | Whole-piece shape: the survey, symmetric sections, total coverage. Plus the pre-draft claim test. |
| [`references/concrete-without-inventing.md`](ripley/skills/ripley/references/concrete-without-inventing.md) | Where real detail comes from, and what to do when you have none. |
| [`references/registers.md`](ripley/skills/ripley/references/registers.md) | READMEs, work email, landing copy, newsletters, threads, talks. |
| [`references/revision-checklist.md`](ripley/skills/ripley/references/revision-checklist.md) | Run before delivering. |
| [`references/voice-*.md`](ripley/skills/ripley/references) | House blend (default), Paul Graham, Benedict Evans, Henrik Karlsson, the Analyst (*Economist*/Bloomberg register), and a procedure for matching your own writing. |
| [`app/engine.js`](ripley/skills/ripley/app/engine.js) | The analyser core. Knows no language: masking, splitting, counting, shape. |
| [`app/languages.js`](ripley/skills/ripley/app/languages.js) | One pack per language. Word lists, suffix rules, tell phrases, detection. |
| [`app/index.html`](ripley/skills/ripley/app/index.html) | The browser app. |
| [`scripts/ripley.js`](ripley/skills/ripley/scripts/ripley.js) | The command-line checker. |
| [`scripts/rhythm.py`](ripley/skills/ripley/scripts/rhythm.py) | Rhythm alone, in Python, for when Node isn't around. |
| [`tests/run.js`](ripley/skills/ripley/tests/run.js) | 248 deterministic checks. Free. |
| [`tests/oracle.js`](ripley/skills/ripley/tests/oracle.js) | The model-graded half, one batched `claude -p` call. |
| [`examples/`](ripley/skills/ripley/examples) | A worked example, with notes on where it still fails. |

## What the numbers are worth

Not all the same amount, so the reports say which is which.

**The tell lists are exact.** They are word and phrase lists taken from
`anti-ai-tells.md`. A hit is a hit; the only judgement is whether you meant it, which
is why each one is marked hard (cut it) or soft (depends).

**The word classes are a guess, and now a measured one.** The tagger is suffixes and
lexicons with no dictionary and no training data behind it. On the bundled corpus it
agrees with a Claude reference on 75.3% of sampled content words — 78.6% English, 71.4%
Russian, 72% Ukrainian, n=81. That is agreement, not accuracy. Every report also prints
the share of words it resolved from a list against the share it guessed. Compare two
drafts with it; don't quote it.

**Only the rhythm baselines were measured** — 11,522 sentences across 60 Graham essays,
60 Evans posts and 4 Karlsson pieces. The checker applies the same crude sentence rule
`rhythm.py` used to build them, so the numbers sit on one scale: on the bundled example
the two agree on sentence count, shortest, longest, and both percentages, and differ by
0.1 words in the mean. Everything else in the report is a convention.

**The verdict counts categories, not hits.** One marker is a style — Graham's *Write
Simply* is uniform on purpose, Evans barely uses a short sentence. A cluster is a
confession. Same rule the prose guidance uses.

## Four things it won't do

It has no bundled essay corpus, so the three single-writer voices work from their
profiles and excerpts rather than from full essays. The house blend and match-my-voice
are unaffected.

It can make text pass its own checks, which is not the same as making it worth reading.
A draft written to satisfy the checklist has its own signature. The checklist can't see
it, because the checklist is the thing being satisfied.

And the checker can't see a claim. It counts words and measures shapes. Whether the
piece argues something a smart person could disagree with, whether the ending was
implied by the opening, whether anyone needed to read it — none of that is countable,
and those are the questions that decide whether the draft is any good.

Outside English it is weaker and says so. The Ukrainian and Russian packs under-count
adverbs on purpose, because the adverb ending in both languages is also the ending of
half the neuter nouns, and a guess in an unknown direction is worse than a gap you can
see. Their tell lists are translated rather than derived. The honest summary is that
English is a tool and the other two are a good first pass.

## Layout

```
.claude-plugin/marketplace.json     marketplace manifest
ripley/
  .claude-plugin/plugin.json        plugin manifest
  skills/ripley/
    SKILL.md                        entry point
    references/                     loaded on demand
    app/engine.js                   the core, language-agnostic
    app/languages.js                one pack per language
    app/index.html                  paste-and-check, in a browser
    scripts/ripley.js               paste-and-check, in a terminal
    scripts/rhythm.py
    tests/run.js                    deterministic, free
    tests/oracle.js                 model-graded, costs money
    tests/corpus/                   six texts in four languages
    examples/
```

## License

MIT. See [LICENSE](LICENSE).
