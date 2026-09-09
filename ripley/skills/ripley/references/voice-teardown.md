# Voice profile: Teardown

**Essence:** a practitioner who has built the real thing, watching a popular
shortcut get sold as the real thing, and taking it apart in public. The engine is
a **category error** — somebody is calling X a Y — and the piece exists to name
the two categories and show where the confusion breaks. It is adversarial toward a
claim and generous toward the people holding it: the strongest case for the other
side goes *first*, in full, in good faith, and then gets walked to its ceiling with
numbers. Anger is allowed. Sneering is not. Receipts are mandatory.

Where Evans refuses to conclude, this voice concludes hard. Where Graham makes a
counterintuitive point feel obvious, this one makes a *popular* point feel
embarrassing. It is the one register in this skill that is permitted to be
annoyed — and the only one that collapses instantly without first-hand evidence.

Corpus: `examples/teardown-obsidian-memory.md` (the calibration sample, on markdown
files being sold as AI memory). Read it before imitating.

The shape is a procedure as much as a register, so it has its own skill: load
`skills/teardown/SKILL.md` (plugin root) for the evidence ledger, the beat budgets,
and the order of work. This file is the sentences.

## The shape — steelman, autopsy, receipts

The structure is the argument. Ten beats, in this order:

1. **Cold open on the artifact.** Name the trend by quoting its own title, then
   list where you keep seeing it in fragments. Two or three sentences.
2. **The stake.** Say plainly what breaks for the reader if they build on it.
3. **The fairness pledge.** One line promising the steelman before you deliver it —
   *"But I'm going to be fair first."*
4. **The steelman, at full strength.** The longest single section in the first
   half. Four to eight genuine advantages, each led by a bold claim sentence, each
   explained as its own advocate would explain it. Close by conceding the case
   where it actually holds.
5. **The hinge.** One anaphora triplet that names the category error and turns the
   piece: *"The problem starts when people call it memory."*
6. **The archaeology.** Numbered steps tracing how a reasonable thing became an
   unreasonable claim — origin, misreading, amplification — with dates, names, and
   what each party actually said. This section is what separates a teardown from a
   rant.
7. **The mechanism, in three lines.** What the thing literally does, stripped of
   narrative. Then: *"That's it. That's the whole system."*
8. **Ceilings.** Revisit each steelman advantage *in its own quoted words* and take
   it to the scale where it fails, with numbers: at 50, at 500, at 5,000.
9. **Your own system, on the table.** Sizes, counts, code, timings. The demo is the
   argument. Without this section the piece is opinion.
10. **Failure modes, alternatives, analogy, concession, incentive, close.** The
    enumerated list of what will break; named tools that don't break that way; one
    extended analogy given its own section; the concession handed back ("use it for
    what it's for"); the zoom-out to *why* the bad idea spreads; and a close of
    three or four imperatives landing on a short line.

Proportions matter. The steelman and the receipts together should outweigh the
attack. If the attack is the longest part, you wrote a complaint.

## Sentence mechanics

- **Anaphora in threes**, used to turn the piece or to close a section: *"The
  problem starts when… The problem starts when… The problem starts when…"* /
  *"What's not valid is… What's not valid is…"* Three, never five.
- **Fragment lists** for texture right after a full sentence: *"Medium articles.
  Substacks. YouTube videos with thumbnails showing a brain made of glowing
  markdown files."*
- **The escalating triad with real numbers:** *"When your memory is 50 notes, this
  is fine. When it's 500 notes… When it's 5,000 notes…"*
- **The two-beat verdict** after a long explanation: *"That's it. That's the whole
  system."* / *"The house goes up faster. The house also falls down."*
- **Parallel category sentences** to land a distinction: *"A notebook is not a
  filing cabinet. A filing cabinet is not a database."*
- **The quoted opposition phrase as a subject:** *"'Human readable' is great when
  you have 50 entries."* You argue against the claim in the words its holders use.
- **Preemption:** state the objection before the reader does — *"Not might hit.
  Will hit."*
- Long clause-stacked sentence, then a four-word one. Same rhythm floor as the rest
  of this skill; it just runs hotter.

## Diction

Plain, spoken, technical where precision demands it and colloquial everywhere else.
Words from the terminal (schema, index, traversal, WAL mode, token) sit next to
words from the kitchen table (*kills me*, *good luck with that*, *here's the
thing*, *real talk*). First person, with a job and a machine and a Tuesday: *"my
actual system,"* *"tools I'm using in production, every day."*

Emotion is named once or twice, flatly, and always attached to a reason: *"'Zero
setup cost' is the one that kills me, because it's the most seductive advantage and
the most dangerous trap."* Never an exclamation mark. Never a hype adjective for
your own stack — the numbers do that work.

## Signature devices

- **The named category error.** The whole piece hangs on one misused word. Say
  which word, and what it should have been called instead.
- **The archaeology.** A dated chain of custody for the bad idea: who did the
  legitimate thing, who misread it, who amplified the misreading, what each step
  actually claimed. Quote primary sources — docs, issues, titles.
- **The buried admission.** Find where the trend's own tooling contradicts its
  story (the SQLite index under the "markdown-first" system) and show it.
- **Code that argues.** SQL, Cypher, shell — with comments written as the human
  question the query answers. Then: *"Try that with a folder of markdown files."*
- **Receipts in units.** 832KB. 955 records. 726 nodes. 636 lines. Sizes, counts,
  and line numbers beat every adjective available.
- **One extended analogy, given its own section.** Built as a scene, played to
  absurdity, then mapped back one-to-one: the executive's sticky note, the house
  with no foundation. One per piece, not one per paragraph.
- **The returned concession.** Near the end, hand the tool back its legitimate use
  in plain words. This is what makes the criticism land as judgment rather than
  hostility.
- **The incentive zoom-out.** The last move before the close: the mistake isn't
  stupidity, it's an incentive — fast demos get clicks, durable architecture
  doesn't.

## Representative excerpts

> Let me give the Obsidian crowd their due, because there are legitimate reasons
> this setup appeals to people, and dismissing them would be intellectually lazy.

> The problem starts when people call it memory. The problem starts when people
> call it a database. The problem starts when the entire AI productivity content
> ecosystem decides that a folder of text files is infrastructure.

> That's it. That's the whole system.

> Skipping it is like skipping the foundation of a house because pouring concrete
> takes too long. The house goes up faster. The house also falls down.

> Use a database. Design a schema. Write queries. It'll take longer to start. But
> it'll work.

## The three gates

This voice fails in ways the others can't. Check all three before delivering.

**The fairness gate.** Would a proponent read your steelman and say *"yes, that's
why I do it"*? If they'd say "you left out the best part," you haven't earned the
teardown. Write the steelman before you write the attack, not after.

**The receipts gate.** Every load-bearing number is one you measured. This voice
runs on first-hand specifics, which makes it the most tempting place in this skill
to invent one. Don't — use the ladder in `concrete-without-inventing.md`: your own
material, then a marked hypothetical, then `[TK]`, then honest generality, then cut
the claim. An invented star count or a paraphrased quote attributed to a real
person is the failure that ends the piece's credibility, and the writer's.

**The target gate.** Attack claims, artifacts, and incentives. Name public work —
posts, repos, docs, companies — and quote it accurately. Don't characterize
anyone's motives, competence, or intelligence, and don't build a piece around a
private individual. "This guide teaches X, and X breaks at 5,000 notes" is the
move. "These people are idiots" is not, and it also reads as weaker.

## DO / DON'T

**DO**
- Hang the piece on one misused word, and name both categories.
- Put the strongest opposing case first, at full length, in its advocates' terms.
- Trace the archaeology with dates, names, and primary quotes.
- Reduce the thing to what it mechanically does, in three lines.
- Break each advantage at a specific scale, with numbers.
- Show your own working system: sizes, counts, code, what it cost.
- Give one extended analogy its own section, then map it back.
- Hand the concession back before you close.
- End on imperatives and a short line, not a summary.

**DON'T**
- Don't write it without having built the alternative. Then you're the influencer.
- Don't strawman, and don't steelman in a tone that mocks the steelman.
- Don't invent numbers, dates, star counts, or quotes to fill the receipts section.
- Don't use more than one extended analogy, or repeat the anaphora device more than
  twice in a piece.
- Don't let the attack outweigh the steelman plus the receipts.
- Don't moralize in the close. The imperatives are the moral.
- Don't reach for this voice when the trend is merely unfashionable rather than
  actually broken — dislike is not a category error.
