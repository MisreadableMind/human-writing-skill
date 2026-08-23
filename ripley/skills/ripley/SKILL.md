---
name: ripley
description: >-
  Write and edit prose that reads like a thoughtful person wrote it, not a
  language model — essays, blog posts, newsletters, emails, docs, READMEs,
  landing-page and marketing copy, talks, threads. Use when drafting or revising
  any non-code prose meant for human readers, and especially when asked to make
  writing "sound human," "less like AI," "less generic," "less corporate," or
  "more like me," or to write in the voice of Paul Graham, Benedict Evans, or
  Henrik Karlsson, or in a restrained Economist/Bloomberg analyst register. Use
  it also to check, lint, or measure prose someone already has — AI tells,
  adverb and adjective counts, sentence rhythm, paragraph and section shape —
  either with the bundled command-line checker or the browser app for pasted
  text. The checker reads English, Ukrainian and Russian, and says so plainly
  when it has no pack for a language rather than guessing. Built from close
  analysis of 700+ essays.
---

# Ripley

Most machine-written prose fails the same way: it is grammatical, organized, and
dead. It hedges everything, states nothing, decorates instead of arguing, and
signposts a structure it never fills. This skill is the antidote. It distills
how three of the best working essayists actually write, so you can produce prose
a discerning reader would believe a person wrote — and, more importantly, *keep
reading*.

The whole target, in one line from Paul Graham: **don't let a sentence through
unless it's the way you'd say it to a friend.**

Named for Patricia Highsmith's Tom Ripley, who studied people until he could pass
for them. Same job, narrower crime.

## When to use this

Use it for any prose a human will read for its own sake: essays, blog posts,
newsletters, launch announcements, docs and READMEs, marketing and landing-page
copy, cover letters, talks, long social posts, or when the user hands you a draft
and says "make this better / sound human / less AI." Use it also when they name
one of the three writers as a target voice.

Don't force it on things that should stay mechanical: API reference tables,
changelogs, commit messages, structured data, legal boilerplate. And don't
impersonate a real, named living person's *identity* to deceive — writing "in the
style of" a public essayist for your own piece is fine; publishing something
under their name is not.

## How to work

1. **Get the brief straight first.** Who's the reader? What's the one thing they
   should walk away with? What length and register? If the user hasn't said,
   infer the obvious answer and state your assumption in a sentence rather than
   asking — but if the *voice* or *audience* genuinely changes the whole piece,
   ask one sharp question. **If it isn't an essay, check
   `references/registers.md` first** — a README, a work email, and a landing page
   each throw out most of the advice below.
2. **Find the claim, before you draft.** Write in one sentence the thing the piece
   exists to say, then ask: *could a smart, informed person disagree with this?* If
   no, it's a description of a topic, not an essay, and no amount of rhythm work will
   save it. The full test is in `references/structure-tells.md`.
3. **Pick a voice.** Default to the **house blend** — the eleven principles applied
   as one balanced register (Graham's clarity + Karlsson's concreteness + Evans's
   honesty). Its profile and a six-pass transform live in
   `references/voice-house-blend.md`. If the user wants a specific writer's
   register instead, load that profile in `references/`; each carries real
   excerpts, and if you have that writer's essays to hand, read one or two before
   you write. **And if they want their *own* voice** — they say "more like me," or
   hand you a sample of their writing — build a profile on the spot with the
   procedure in `references/voice-from-sample.md`. A real sample overrides every
   default in this skill. Feel beats description.
4. **Draft loose.** Get the ideas down fast, in the wrong order, too long.
   Chase the interesting thought even if it wanders. You cannot edit a blank page.
   **Never invent a fact to satisfy a style rule** — when the sentence wants a
   specific you don't have, use the ladder in
   `references/concrete-without-inventing.md`: the user's own material, then a marked
   hypothetical, then a `[TK]`, then honest generality, then cut the claim.
5. **Revise tight.** This is where the writing happens. Read every sentence
   aloud. Cut. Strengthen claims. Replace abstractions with examples. Vary the
   rhythm. Delete the AI tells. Most of editing is deletion.
6. **Fix the shape.** Sentence work is done; now look at the whole piece at once.
   Sections within 20% of each other in length mean you wrote an outline, not an
   essay. Force lopsidedness, delete a whole section, and check the ending isn't
   fully implied by the opening. See `references/structure-tells.md`.
7. **Measure, then run the checklist.** Write the draft to a file and run
   `node scripts/ripley.js draft.md`. It flags every tell below with a line and
   column, counts adverbs, adjectives and nominalisations, and puts the sentence
   rhythm next to the measured corpus baselines. Fix what it finds and re-run.
   Then pass the draft against `references/revision-checklist.md` by hand — the
   checker sees words and shapes, never whether the piece has a claim.

Loose then tight. The first draft is for you; every draft after is for the reader.

---

## The eleven principles

These are the shared DNA of all three writers. They are the core of the skill;
the voice profiles are variations on top of them.

**1. Write like you talk.** The test for every sentence: *would I say this, this
way, to a smart friend?* If not, say the thing you'd actually say and use that.
No one uses "utilize," "leverage," or "pen" (as a verb) out loud. Read the final
draft aloud and fix everything that clanks.

**2. Ordinary words, simple sentences.** Default to short, plain, Anglo-Saxon
words. Fancy language doesn't just hide ideas — it hides the *absence* of ideas.
"If you say nothing simply, it will be obvious to everyone, including you." A rare
precise, technical, or even blunt word earns its place by contrast — never as
decoration. You don't need complex sentences to express complex ideas; the harder
the idea, the more plainly you should state it.

**3. Make claims as strong as they can be without becoming false.** Vague is not
safe, it's empty — "there are many factors to consider" tells the reader nothing.
Say the strongest true thing. *Then* modulate with real qualification: "I think,"
"probably," "roughly," "as far as I can tell" express genuine degrees of
certainty and belong there. Blanket hedging that expresses nothing does not. The
difference between a strong claim and a hedged one should carry information.

**4. Concrete over abstract, always.** Every abstraction has to earn its keep
with a real, specific, often messy example. Argue through *one* homely example or
one extended analogy, not a stack of generalities — a fan being switched on, a
river's meander, a spreadsheet on a blackboard, a garden, a guitarist choosing
his influences. When you catch yourself writing a general claim, put the example
right after it, or replace the claim with the example.

**5. Think on the page.** Writing is thinking — "if you're thinking without
writing, you only think you're thinking." Start from a real question or an itch,
not a thesis you're defending. Follow it. Let the piece discover something and
surprise you; if it surprises you, it will surprise the reader. If you finish and
learned nothing, don't publish it.

**6. Cut relentlessly.** The strongest lever you have. Fast first draft, then
days of cutting. If a sentence is bad, don't fix it — delete it and try again.
Abandon whole paragraphs, whole branches. Brevity reads as confidence; length, as
apology. Elegance and curtness are two names for the same thing.

**7. Earn authority with specifics and honest uncertainty — never throat-
clearing.** First-hand detail, a concrete number, a named example, and a frank
"we don't actually know" all build more trust than any amount of confident-
sounding filler. Never open with preamble. Never announce what you're about to
do; just do it.

**8. Rhythm through variation.** Vary sentence length hard. Chain clauses with
"and… and" and semicolons so even long sentences read fast, then drop a very
short sentence right after to land the point. *I wish. We'll see. It's a toy.*
Monotone kills prose faster than any single bad word.

**9. Talk to the reader as a peer.** Use "I" and "you." Ask a real question, then
answer it in the next sentence. Treat the reader as a co-investigator sitting
across the table, not a student being lectured. Sentences may start with And,
But, So, or The — freely.

**10. Open and close without scaffolding.** Open with a flat thesis, a real
question, or a concrete scene — never a summary of what's coming, never "In
today's world." Close by turning outward to the reader, resolving into a single
earned line, or (when honest) leaving the question genuinely open. Never a "In
conclusion, we have seen that…" recap. The reader was there; don't re-narrate it.

**11. Don't tell the reader what's interesting.** It isn't your call. Cut
"remarkably," "surprisingly," "interestingly," "notably," "the fascinating part is,"
"here's where it gets good." Describe the thing precisely and the reader decides for
themselves whether to care — or decides not to, which is their right. Every
evaluative adverb says the fact couldn't carry itself. An adjective a number earned
right beside it can stay: "the runaway favourite — recommended four times." An
adjective earned by your enthusiasm goes. This is the rule most often broken by prose
that has already passed every other check on this list.

---

## Kill the AI tells

The fastest way to sound human is to stop sounding like a model. These are the
patterns that instantly mark text as generated. The full list, with rewrites, is
in **`references/anti-ai-tells.md`** — read it before revising. The worst
offenders:

- **Throat-clearing openers:** "In today's fast-paced world," "In an era of," "In
  the ever-evolving landscape of," "Let's dive in," "Buckle up."
- **The not-just-X-but-Y tic:** "It's not just a tool, it's a way of life." "This
  isn't about X; it's about Y." Kill on sight.
- **Empty inflation:** crucial, vital, pivotal, essential, powerful, robust,
  seamless, revolutionary, game-changing, cutting-edge, unlock, elevate, harness,
  navigate the complexities of, at its core, when it comes to, the world of.
- **Delve-class vocabulary:** delve, tapestry, testament, underscore, boasts,
  realm, plethora, myriad, foster, showcase.
- **Signpost stacking:** Firstly / Secondly / Moreover / Furthermore /
  Additionally — as connective filler rather than real sequence.
- **Hedge-everything:** "It's important to note that," "It's worth mentioning,"
  "there are many factors to consider," "it ultimately depends." This is the
  vague trap — it feels safe and says nothing.
- **The reflexive dramatic em-dash** on every third sentence, and **rule-of-three
  everything** (innovative, scalable, and robust).
- **Recap conclusions and moralizing coda:** "In summary," "Ultimately," "At the
  end of the day, remember that…"
- **Weasel attribution:** "Studies show," "Experts agree," "It is widely
  believed" — with no specific study, expert, or belief named.
- **Excitement injection:** "remarkably," "surprisingly," "interestingly,"
  "notably," "quietly," "the fascinating part is." Principle 11. Cut every one.
- **Announced everything:** an analogy ("Think of it like…"), directness ("Let me be
  clear"), or suspense ("The catch?") declared instead of performed.
- **First person with no biography:** an "I" that thinks and notices but never has a
  job, a Tuesday, or a specific thing it got wrong.

If you can delete a sentence and lose no information, it was an AI tell. Delete it.

---

## Pick a voice

The **house blend is the default** — reach for a named register only when
the piece genuinely calls for that stamp. All five are built on the eleven principles,
with one exception noted below.
Full profiles — with mechanics, signature devices, DO/DON'T lists, and real
excerpts — are in `references/`. **If you have the writer's essays available, read
one or two before imitating.**

| Voice | Feel | Reach for it when | Profile |
|---|---|---|---|
| **House blend** *(default)* | Graham's clarity + Karlsson's concreteness + Evans's honesty, leaning plain. No single writer's stamp. | The default. Any prose where no specific register is called for, or "make it sound human / less AI / less generic" with no writer named. | `references/voice-house-blend.md` |
| **Paul Graham** | Plain, conversational, contrarian. Short punchy sentences, first person, coined concepts, aphoristic turns. | Essays and arguments that make a counterintuitive point feel obvious in hindsight; advice; opinion. | `references/voice-paul-graham.md` |
| **Benedict Evans** | Dry, British, analyst-not-advocate. Long clause-stacked sentences, stacked rhetorical questions, historical analogy, deep epistemic humility. | Tech/business/strategy analysis; "ways to think about X"; anything where the honest answer is "it's not that simple." | `references/voice-benedict-evans.md` |
| **Henrik Karlsson** | Literary, personal, searching. Narrative and scene openings, extended metaphor, woven quotation, essay-as-inquiry. | Reflective/personal essays; ideas about mind, craft, and life; pieces that move through a story toward an insight. | `references/voice-henrik-karlsson.md` |
| **The Analyst** | Unbylined *Economist* / Bloomberg staff analyst. Thesis first, mechanism shown, exact numbers, impersonal, present tense, paragraphs landing on a short line. | Explaining how something works to someone who has to act on it; market, strategy, and policy pieces; briefs and memos. Also when the user says "analyst voice," "Economist style," or "restrained and precise." | `references/voice-analyst.md` |

**The Analyst overrides five of the eleven, on purpose.** It is the one register here
that isn't a variation on the principles — it contradicts them. Principle 1 (write like
you talk) and 9 (talk to the reader as a peer, use "I" and "you," ask a real question)
are out: the register is impersonal and asks nothing. Principle 3's qualifiers ("I
think," "as far as I can tell") are out; state the claim flat or cut it. Principle 5
(think on the page, let the piece discover something) is out; the thesis is settled
before the first sentence. Principle 10's outward-turning close is out; the ending
resolves. Everything else carries — plain words, concrete over abstract, cut
relentlessly, rhythm through variation, no throat-clearing, excitement at zero. Don't
mix the two halves. A piece that is impersonal for four paragraphs and then asks the
reader a question has neither voice.

**How to blend, concretely.** The house blend isn't an average of the three and
isn't the three taking turns — it gives each writer a different *layer* of the same
sentence (Graham the shape, Karlsson the ground, Evans the stance) so they stack
instead of fight, and it comes with a six-pass transform for turning any draft into
that voice. When two impulses conflict, lean plain — Graham breaks the tie. The
full method, a keep/drop table per writer, and a worked before/after are in
`references/voice-house-blend.md`; read it before blending.

**Your own reader's voice beats all of these.** When the user gives a sample of
their writing, or asks for "more like me," calibrating to that sample takes
priority over the house blend and the three writer profiles. Match a real person
over an archetype whenever you can.

Build that profile with **`references/voice-from-sample.md`**: read their sample
twice — once for feel, once for mechanics — and note sentence rhythm, word level,
punctuation habits, how paragraphs open, and their pet phrases, before writing a
line. Then match it, tics included. The tic you'd instinctively correct is often the
most *them* thing in the piece. Where a real person's profile and the eleven
principles disagree, the profile wins. It's their voice, not the skill's.

---

## Check the draft

Two ways in, one set of rules.

**From the terminal**, on a file or on stdin:

```
node scripts/ripley.js draft.md
node scripts/ripley.js draft.md --html /tmp/draft.html   # a page you can open
node scripts/ripley.js draft.md --lang uk                # override the guess
cat draft.md | node scripts/ripley.js --quiet
```

It prints four blocks. **Tells** — every match from `anti-ai-tells.md` with a line
and column, split into hard (cut it) and soft (depends). **Word classes** —
adverbs, adjectives, nominalisations and the rest, with the share of words the
tagger knew against the share it guessed. **Structure** — sentence rhythm beside
the measured baselines, paragraph spread, words per section, sentence openers,
em-dash rate, passives. Then a **verdict**, which counts categories rather than
hits, because one marker is a style and a cluster is a confession.

**In a browser**, for text you want to paste and poke at: open `app/index.html`.
Same engine, live. It highlights every tell in place, switches adverbs,
adjectives, nominalisations and passives on as separate layers, and jumps the
cursor to a hit when you click it. It loads nothing and sends nothing anywhere.

### Languages

English, Ukrainian and Russian have packs. The language is detected from the
script and a stopword vote; `--lang` overrides it, and the browser app has a
picker. Run `node scripts/ripley.js --languages` for the list.

Anything else gets the metrics that survive translation — paragraph shape,
sentence spread, punctuation, layout — and an explicit refusal on the rest. A
German draft comes back saying it has no pack, not scored against English word
lists. That refusal is the feature: silently running English rules over
Ukrainian would produce a full report of meaningless numbers.

Two things differ outside English. There are no measured rhythm baselines, so
the spread numbers are reported without a verdict; they still compare two of
your own drafts. And the tell lists are translations of the English one — a
hypothesis about what generated Ukrainian sounds like, not a measurement — which
every report says out loud.

### What the numbers are worth

The tell lists are exact, because they are word and phrase lists and a hit is a
hit. Only the rhythm baselines were measured, over 11,522 sentences of English.

The word classes are a suffix-and-lexicon guess with no dictionary behind them.
On the bundled corpus they agree with a Claude reference on 75% of sampled
content words — 79% in English, 71% in Russian, 72% in Ukrainian, n=81. That is
agreement, not accuracy: where both are wrong the same way it reads as success.
Good enough to compare two drafts. Not good enough to quote.

Everything else is a convention, and a draft may break one on purpose.

### Tests

`node tests/run.js` is the one to run after changing a rule: 248 deterministic
checks, no network, no cost. It holds the English rhythm numbers to `rhythm.py`,
proves flag offsets index the original string, and catches the failure mode that
global regexes invite — analysing the same text twice and getting different
answers.

`node tests/oracle.js` is the other half, and it costs money. It batches the
whole corpus into one `claude -p` call and reports where the heuristics and the
model disagree, on language, on tells, on word class. Read the disagreements,
not the percentage: two fallible judges agreeing may only mean they share a
bias. It found six real defects the fixed expectations could not.

The limit is the obvious one. A draft edited until the checker goes quiet is a
draft that satisfies the checker. It still cannot tell you whether the piece has
a claim, whether the ending was implied by the opening, or whether anyone needed
to read it. Those are steps 2 and 6.

---

## What's in this skill

| File | Read it when |
|---|---|
| `references/anti-ai-tells.md` | Always, before revising. 30 tells with rewrites, plus what is *not* a tell. |
| `references/structure-tells.md` | The draft is clean sentence by sentence and still reads generated. Also the pre-draft claim test. |
| `references/concrete-without-inventing.md` | Any time the prose wants a specific you don't have. |
| `references/registers.md` | It isn't an essay — README, work email, landing copy, newsletter, thread, talk. |
| `references/revision-checklist.md` | Before delivering. Every time. |
| `references/voice-house-blend.md` | The default voice, with a six-pass transform. |
| `references/voice-paul-graham.md`, `-benedict-evans.md`, `-henrik-karlsson.md` | The user named a writer. |
| `references/voice-analyst.md` | Restrained, impersonal, thesis-first explanation. *Economist* / Bloomberg register. |
| `references/voice-from-sample.md` | The user wants their own voice. |
| `scripts/ripley.js` | Check a draft from the terminal: tells with line numbers, word classes, structure. Needs Node. |
| `app/index.html` | The same check in a browser, for text you paste. Open the file; nothing to install. |
| `app/engine.js` | The language-agnostic core. Masking, splitting, counting, shape. |
| `app/languages.js` | One pack per language: word lists, suffix rules, tell phrases. Add a language here and nothing else changes. |
| `tests/run.js` | 248 deterministic checks. Run after touching a rule. |
| `tests/oracle.js` | The model-graded half. One batched `claude -p` call; costs money. |
| `scripts/rhythm.py` | The rhythm slice alone, in Python, for when Node isn't around. |

---

## Three closing rules of thumb

- **The read-aloud test is non-negotiable.** If you would not say a sentence to a
  friend, it does not ship. This single filter puts you ahead of most writing.
- **Excitement stays at zero.** Never tell the reader something is interesting,
  remarkable, surprising, or exciting. You don't get to decide that. Describe the
  thing accurately and let them react however they react.
- **Practice what this file preaches.** These instructions are written in the
  style they describe — plain words, short sentences, concrete examples, claims
  stated straight. Your output should be too.
