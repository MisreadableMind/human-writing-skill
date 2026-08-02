# Registers: what changes when it isn't an essay

Most of this skill was built from essayists, so most of its advice is essay-shaped.
That advice is wrong for a README. A README that opens with a concrete scene is worse
than one that opens with what the thing is.

Each register below gets three lines: what carries over, what doesn't, and the tells
specific to that format.

## What carries everywhere

The floor, in every format including the ones this skill tells you to leave
mechanical:

- The read-aloud test.
- Delete any sentence that loses no information.
- No inflation words, no delve-class vocabulary, no throat-clearing.
- Strong claims over empty hedging.
- **Excitement at zero.** Never tell the reader that something is exciting,
  remarkable, powerful, or surprising. Describe it precisely and let them decide.
  This one bites hardest in marketing copy and hardest of all in READMEs.
- Never invent a specific (`concrete-without-inventing.md`).

## What's essay-only

Don't carry these into short-form or functional writing:

Scene openings · the contrarian "everyone thinks X, actually Y" turn · extended
metaphor · discovery structure (the piece changing its mind) · aphoristic closes ·
first-person meander · deliberate digression · lopsided sections.

---

## README and docs

**Carries:** plain words, present tense, cut ruthlessly, concrete over abstract.
**Doesn't:** every essay move above. Nobody reads a README for pleasure — they
arrived to do one thing and they're scanning for it.

Open with what the thing is and who it's for, in one sentence. Then how to run it.
Philosophy, if any, goes below the fold. Describe the software as it is, never as a
diff from what it was (tell #23). Second person for instructions.

**Tells:** "Welcome to X!" · emoji section headers (🚀 Features) · "Simply run" and
"just add" (nothing is simple to the person reading docs) · a Features list where each
bullet restates its own heading · "seamlessly integrates" · a "Why X?" section that's
actually a pitch · "Contributions are welcome!" boilerplate that describes no process ·
inline-header bullets (`**Fast:** it is fast`) · invented flags and config keys —
read the source or leave a TK.

## Work email

**Carries:** cut ruthlessly, no throat-clearing, exact numbers, plain words.
**Doesn't:** essentially every voice move. Don't be interesting; be findable.

The point goes in the first sentence, the asks go last and go together.
If you have a sample of the sender's own email, build a profile from it with
`voice-from-sample.md`. Work email is short and repetitive enough that one real
sample calibrates it well.

**Tells:** "I hope this email finds you well" · "I wanted to reach out" · "Just
circling back" / "bumping this" · "Please don't hesitate to" · "Looking forward to
hearing your thoughts" · a summary paragraph before the actual content · asks
scattered through the body instead of bundled at the close.

## Landing pages and marketing copy

**Carries:** concrete over abstract, ordinary words, and the excitement rule — which
matters more here than anywhere else in this file.

The entire genre is built on telling people how to feel about a product. Don't. Say
precisely what it does, in the smallest true words, and let the reader get interested
on their own. A number beats an adjective; a described behaviour beats a benefit noun.

- ✗ "Powerful real-time collaboration that supercharges your team."
- ✓ "Two people can edit the same file at once, and neither one has to refresh."

**Tells:** "Built for teams who…" · "The future of X" · "Say goodbye to Y" · "Trusted
by" with no names · three value-prop columns with blurbs of matching length · benefit
noun stacks ("Ship faster. Scale smarter.") · "We believe…" · one-word sentences as
punch ("Simple. Fast. Yours.") · any adjective the product hasn't earned in the
sentence before it.

Marketing copy is also where fabrication is most tempting and most damaging — no
invented customer counts, no invented testimonials, no invented benchmarks. TK them.

## Newsletters

**Carries:** most of the essay guidance. This is the closest register to an essay.
**Doesn't:** the discovery structure, usually — newsletters are shorter and readers
are skimming a subject line.

There's a person behind it, so first person is right. Open mid-thought, as if
continuing a conversation, because you are.

**Tells:** "Welcome back to another edition of…" · "In this issue:" · a fixed segment
structure that runs whether or not there's anything to put in it · "Let's get into
it" · a sign-off paragraph that thanks the reader for reading.

## Threads and long social posts

**Carries:** short sentences, strong claims, one concrete example.
**Doesn't:** paragraph rhythm (there are no paragraphs), digression, the slow open.

The first line is the whole bet. Make it a claim, not a promise of a claim.

**Tells:** "A thread 🧵" · "Here's why that matters:" · "Let that sink in" · numbered
hooks ("7 lessons from…") · every line its own one-sentence paragraph, which is
staccato drama (tell #19) turned into a layout · a final tweet asking for a retweet.

## Talks

**Carries:** write like you talk — more literally here than anywhere else.
**Doesn't:** anything that depends on rereading. A listener cannot scroll back.

Sentences run shorter than in prose. Repetition stops being a tell and becomes a
tool: say the claim, give the example, say the claim again. Signposting, which is
filler on the page, is a genuine service to the ear — "three things, and here's the
first" helps a listener who has no visual structure to hold onto.

**Tells:** "Today I'm going to talk about…" (throat-clearing survives into speech) ·
reading a bullet list aloud · a thank-you-for-having-me opening · "as you can see on
this slide."

## Leave these mechanical

Changelogs, release notes, migration guides, commit messages, API reference tables,
legal text. Apply only the universal floor — plain words, no inflation, no invention.
These are the one place where diff-anchored writing (tell #23) is correct: narrating
the change *is* the job.
