# Revision checklist

Run this on the tight-editing pass, after the loose first draft is down. Most of
these are subtractive. Work top to bottom; the read-aloud pass at the end is the
one you never skip.

## Claims and substance

- [ ] Does the piece say one thing, clearly? Could the reader state its point in a
      sentence?
- [ ] Is every claim as strong as it can be **without becoming false**? (No vague
      "there are many factors." No timid "it can sometimes be the case that.")
- [ ] Did I *learn* something writing this? If it only restates what I already
      knew, it isn't worth sending.
- [ ] Is each abstraction backed by a concrete, specific, real example — right
      next to it?
- [ ] Are the qualifications doing real work ("I think," "for small teams") rather
      than blanket hedging? Cut the empty ones.
- [ ] If I'm rewriting someone else's draft, does my version cover everything
      theirs did? Rewrite the AI-isms in place; don't quietly drop the content
      around them. Five paragraphs in, roughly five paragraphs out.

## Sentences

- [ ] **Read every sentence aloud.** Would I say it, this way, to a smart friend?
      If it clanks, rewrite it as what I'd actually say.
- [ ] Are there ordinary words where I reached for fancy ones? (utilize→use,
      leverage→use, in order to→to, a number of→some.)
- [ ] Does the rhythm vary — long sentences next to short ones? Is there at least
      one place a short sentence lands a point?
- [ ] Did I cut every sentence that loses no information when deleted?

## Excitement (see `anti-ai-tells.md` #25)

- [ ] Did I tell the reader what to find interesting, remarkable, surprising, or
      exciting? Cut every instance. **It isn't my call.**
- [ ] Search the draft for: *remarkably, surprisingly, interestingly, notably,
      importantly, truly, quietly, fascinating, exciting, powerful, striking.*
      Delete each one and check the sentence lost nothing. It didn't.
- [ ] "Actually" and "genuinely" stay only where a contrast is in play (Graham's
      "everyone thinks X; actually Y"), not as emphasis.
- [ ] No "the interesting part is," "here's what's fascinating," "the best bit."
      State the fact; the reader can react on their own.
- [ ] Exceptions kept: surprise I actually had and stated as fact about me ("I
      expected the opposite"), and an adjective a number right beside it earned.

## Structure (see `structure-tells.md`)

- [ ] Can I state the piece's claim in one sentence, and **could a smart person
      disagree with it**? If not, it's a description, not an essay.
- [ ] Count the words per section. Are they within 20% of each other? Then it's an
      outline. Grow the load-bearing part; cut the rest to a clause.
- [ ] Can I delete a whole section and lose nothing? Delete it.
- [ ] Can I name one obvious thing the piece deliberately leaves out?
- [ ] Does the last third contain anything the first third didn't predict?
- [ ] Would any heading fit a piece on a different topic? Then it's furniture.

## Invented specifics (see `concrete-without-inventing.md`)

- [ ] Does every number, name, quote, study, and URL trace to the user's material or
      to something I'd stake a name on? **No fact was generated to satisfy a style
      rule.**
- [ ] Is every hypothetical marked (*suppose, imagine, say*) and free of proper nouns?
- [ ] Is every `[TK]` still a TK, and did I tell the user which ones I left?
- [ ] Does any first person claim an experience I don't have?

## Countable rhythm check (`scripts/rhythm.py`)

- [ ] Run `python3 scripts/rhythm.py draft.md`, or count by hand: write the word
      count of every sentence in the longest paragraph. Corpus figures — spread
      (sd÷mean) 0.60–0.86, one sentence in six under 9 words, under half in the
      12–25 word band.
- [ ] All three outside range? That's the rhythm tell — fix it. One alone is a
      style, not a fault; don't over-correct.

## AI tells (see `anti-ai-tells.md`)

- [ ] No throat-clearing opener ("In today's world," "Let's dive in").
- [ ] No "it's not just X, it's Y" construction.
- [ ] No inflation words (crucial, vital, seamless, robust, unlock, elevate,
      harness, leverage, revolutionary, game-changing).
- [ ] No delve-class vocabulary (delve, tapestry, testament, underscore, realm,
      plethora, myriad, foster, showcase).
- [ ] No signpost stacking (Firstly/Moreover/Furthermore/Additionally as filler).
- [ ] No recap conclusion ("In summary," "Ultimately," "At the end of the day").
- [ ] No weasel attribution ("Studies show," "Experts agree") without a name.
- [ ] No reflexive dramatic em-dash on every third sentence; no rule-of-three
      padding.
- [ ] No emoji-bulleted listicle standing in for an argument.
- [ ] No one-word question pivots ("The catch?" "The result?").
- [ ] No announced analogy ("Think of it like…") — just make the comparison.
- [ ] No first person that claims experience without a particular in it.
- [ ] No scheduled concession ("To be fair," on rhythm rather than on weakness).
- [ ] No announced directness ("Let me be clear," "No fluff"). Just be direct.

## Structure

- [ ] Does it open on the actual thing — a claim, question, or scene — not a
      summary of what's coming?
- [ ] Are paragraphs doing one thing each? Is the most important claim given room
      (its own line if it deserves it)?
- [ ] Does it end by turning outward, landing one earned line, or leaving the
      question honestly open — not by re-narrating what the reader just read?

## Voice (if imitating one of the three)

- [ ] Did I read at least one real essay by that writer before drafting, where one
      was available?
- [ ] Does the draft hit that voice's signature moves (PG's contrarian frame +
      landing sentences; Evans's stacked questions + both-hands + humility;
      Henrik's scene-first + extended metaphor + woven quotation)?
- [ ] Did I avoid caricature — the tics without the substance?

## The AI self-audit

- [ ] Re-read the whole draft and ask flatly: **"What still makes this sound
      AI-written?"** Name the remaining tells in a line or two — don't assume there
      are none.
- [ ] Fix those specifically, then read again. Repeat until the honest answer is
      "nothing I can still find."
- [ ] Did I over-correct? Check I haven't flattened real human signal — specific
      detail, mixed feelings, a genuine aside, varied rhythm (see `anti-ai-tells.md`,
      "Signs of a human"). If a cut removed the most human line in the piece, put
      it back.

## The final filter

- [ ] One more read-aloud, start to finish. Fix everything that doesn't sound like
      a person talking. Ship only when nothing catches.
