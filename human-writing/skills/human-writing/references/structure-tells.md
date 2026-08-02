# Structure: the shape of the whole piece

A draft can pass every check in `anti-ai-tells.md` and still read as machine-written.
The remaining tell isn't in any sentence. It's the architecture.

Model prose is *organized*. Even sections, balanced coverage, every claim supported
exactly once, a conclusion decided before the first word was written. Human essays
are lopsided, incomplete, and sometimes go somewhere they didn't plan to go.

Everything in `anti-ai-tells.md` is subtraction. This pass isn't. Fixing structure
usually means writing much more of one part and deleting the rest.

---

## Part 1: the structural tells

### 1. The survey shape

"Five ways to think about X." The model was asked about a topic, so it *covered* the
topic. A person writing about a topic argues one thing about it.

**Test:** can you reorder the sections without losing anything? Can you delete one
and have the piece still make sense? Then there's no argument in it, just an
inventory. A real piece has sections that depend on each other — section 3 is only
possible because section 2 established something.

Fix: find the one claim, make it the spine, and demote everything that isn't
load-bearing for it to a sentence or to nothing.

### 2. Symmetric sections

Every section three paragraphs. Every bullet one sentence. Every example the same
weight. This is the most reliable structural tell there is, and it survives a full
sentence-level cleanup untouched.

Real writing is lopsided because attention is lopsided. In the bundled Graham corpus
the average paragraph runs 4 sentences and the longest run 17 — a 4× spread inside a
single essay. The part the writer actually cared about gets the room; the rest gets a
clause.

**Test:** count the words in each section. If they're within 20% of each other, you
wrote an outline, not an essay. One section should be two or three times another.

### 3. Total coverage

The model answers everything the topic raises. It has no reason not to — leaving
something out feels like a failure to be helpful.

But omission is the visible trace of judgment. A person skips the boring parts, the
parts they don't know, and the parts everyone already agrees on. If a draft has no
visible gaps, that absence is itself the gap.

**Test:** name one obvious thing the piece deliberately doesn't cover. If you can't
name one, you covered everything, and it reads like it.

### 4. No digression

The model follows the outline exactly. Real essays go down a side road because it was
interesting, and sometimes they don't come all the way back. Graham's whole model for
essay structure is a river's meander — the shape comes from following the ground, not
from a plan.

One genuine digression per piece, that pays off obliquely or not at all, does more
for the human read than any sentence-level fix. It cannot be faked by adding a
parenthetical; you get it by actually following a thought the outline didn't want.

### 5. The piece never changes its mind

Model drafts know the conclusion at sentence one and march to it. The ending was
implied by the opening, so the reader learns nothing by arriving.

**Test:** does the last third contain something the first third didn't predict? If
the thesis could have been written before the draft — it probably was, and it shows.
The fix is upstream: think on the page (principle 5), then keep the discovery instead
of smoothing it out in revision.

### 6. Mechanical evidence distribution

One example per claim, in the same position each time, of roughly equal length.

Real argument allocates evidence by difficulty. The hard, contestable claim gets
three examples and a counterargument. The obvious one gets none, because it's
obvious. If every claim in the draft is equally supported, none of them was hard.

### 7. The scheduled objection

Section three is always "But there are challenges." A structural version of fake
balance — the piece budgets for a counterargument rather than actually having one.

An honest objection shows up where the argument is weakest, at whatever length it
needs, and it may not be answerable. If the counterargument section is the same
length as the others and gets neatly resolved, it was decoration. (See tell #10 for
the paragraph-level version.)

### 8. Headings that partition instead of argue

"Overview / Benefits / Challenges / Conclusion" tells the reader nothing they didn't
know from the title. Compare Graham's section headers — *Recruit. Fragile. Heresy.
Sirens.* — which are content, not furniture.

If a heading would fit on any piece about any topic, it's furniture. Either make it
carry a claim or delete it and let the prose transition.

### 9. Uniform paragraph length

The paragraph-level echo of tell 2. Model prose settles into 3–5 sentence blocks
throughout. Real writing drops a one-sentence paragraph to land something, then runs
a long one when the thought needs it.

The most important claim in the piece should sit on its own line.

---

## Part 2: is there a claim in here at all?

Structure follows from having something to say. Most structurally hollow drafts are
hollow because there was no claim underneath them — the piece is a competent
description of a topic wearing an essay's clothes.

Run this **before drafting**, not after.

### The disagreement test

Write, in one sentence, the thing this piece exists to say. Then ask:

**Could a smart, informed person disagree with this?**

If no, it isn't a claim. It's a description of the topic, and no amount of rhythm
work will make it read like someone needed to write it.

- ✗ "AI is changing how software gets built." — nobody disagrees. Not a claim.
- ✓ "Most teams adopting AI coding tools are measuring the wrong thing, and the right
  thing is embarrassingly simple to measure." — arguable. Someone could be annoyed.

Keep rewriting the sentence until someone could argue with it.

### The cost test

What does it cost to say this? Real claims have a downside: somebody is irritated, or
you're on record and might turn out to be wrong, or you've ruled out a position you'd
rather keep open.

A claim that costs nothing to make is usually a claim nobody needed made.

### The steelman test

Before drafting, write the strongest version of the opposing case in one sentence, in
its own best words — not a straw version you can knock down. If you can't write it,
you don't understand your own claim well enough to argue it yet.

This also tells you where the piece has to spend its length: on the part your
steelman attacks.

### When there is no claim

Sometimes the user wants a survey, a doc, or a summary. That's fine — the
formats in `registers.md` don't all need an argument. But if you're writing something
that's *supposed* to be an essay and you can't find a claim that passes the
disagreement test, say so plainly rather than dressing an inventory in essay
structure. Offer the two or three claims the material could actually support and let
the user pick.

---

## The structural pass, in order

Do this after the sentence work, on the whole draft at once:

1. **State the claim** in one sentence in the margin. Fails the disagreement test?
   Stop; the structure problem is a content problem.
2. **Count words per section.** Force lopsidedness — grow the part that carries the
   claim, cut the rest to a clause.
3. **Delete one section entirely.** Not trim — delete. If nothing broke, it was
   inventory, and you just improved the piece.
4. **Name what you left out.** Nothing? Cut something.
5. **Check the ending against the opening.** If the close was fully implied by the
   open, the piece discovered nothing. Find the surprise in the draft and move it
   later, or admit there isn't one.
6. **Scan the heading list on its own.** Any heading that would fit another topic is
   furniture.
