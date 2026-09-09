---
name: teardown
description: >-
  Write a technical teardown — the long-form post that takes apart a popular
  practice, tool, or tutorial genre that is being sold as something it isn't:
  steelman first, then archaeology, then receipts from your own working system.
  Use when the user wants to debunk a trend, push back on a hyped workflow, write
  a "stop calling it X" or "why Y can't replace Z" piece, or hands you a draft
  that argues against a popular idea and wants it to land. Companion to the
  ripley prose skill; drafts in the Teardown voice.
---

# Teardown

A teardown is not a rant with headers. It is a piece that names a **category
error** — somebody is calling X a Y — proves the error mechanically, and pays for
the proof with first-hand evidence. The voice is in
`skills/ripley/references/voice-teardown.md`; the calibration sample is
`skills/ripley/examples/teardown-obsidian-memory.md`. Paths here are relative to
the plugin root (`${CLAUDE_PLUGIN_ROOT}`) — the prose skill and its eleven
principles live in `skills/ripley/`.

Read the voice profile before drafting. This file is the procedure.

## Qualify it first — three questions

Ask these before writing a word. Two "no"s and you should write something else.

1. **Is there a misused word?** Name it, and name what it should be called
   instead. *"They call a folder of text files memory; it's a config file."* If the
   complaint is "this is overrated" with no term being misapplied, that's taste,
   not a teardown. Write an essay instead.
2. **Do you have receipts?** Numbers you measured, from a system you ran. Sizes,
   counts, timings, error messages, the version where it broke. Without these the
   piece is one more opinion in a genre already drowning in them.
3. **Have you built the alternative?** If you haven't shipped the thing you're
   telling people to build, you're doing what you're accusing them of. If the user
   hasn't, say so plainly and offer the honest version: a narrower piece about the
   specific failure they *did* hit.

If the trend is genuinely fine and just annoying, say that to the user in one
sentence and offer a different piece. Don't manufacture a category error.

## Build the evidence ledger before the outline

Interview the user, or read their system, and fill this in. Nothing enters the
draft that isn't in the ledger.

| Slot | What goes here | Example from the sample |
|---|---|---|
| **The claim under attack** | The exact sentence the trend makes, quoted from a real post | "markdown files give your AI persistent memory" |
| **The artifacts** | Titles, publications, repos, dates, star counts — real ones | XDA piece calling CLAUDE.md "Claude's memory"; repo at 13.9k stars, Jan 2026 |
| **The legitimate origin** | What the misread thing was actually built for, per its own docs | CLAUDE.md is a project instruction file, read at startup |
| **The buried admission** | Where the trend's own tooling contradicts its story | OpenClaw bolted SQLite + BM25 under its "markdown-first" memory |
| **The mechanism** | What the thing literally does, in three steps | read file → answer → write file |
| **The ceilings** | Each advantage and the scale at which it fails | human-readable: fine at 50 notes, useless at 955 records |
| **Your numbers** | Sizes, counts, code you can paste | 832KB SQLite, 955 records; 726 nodes, 852 edges |
| **The alternatives** | Named tools you actually run, and what each gives you | SQLite, Kuzu, Supabase |

**No slot gets filled from memory or inference.** Quotes are copy-pasted; counts
are looked up; dates are checked. If a slot is empty, mark it `[TK]` in the draft
and tell the user what to go measure — see
`skills/ripley/references/concrete-without-inventing.md`.
A fabricated star count in a piece about other people's sloppiness is fatal.

## The ten beats, with budgets

For a 2,000–2,800 word piece. Adjust proportionally, keep the ratios.

| # | Beat | Words | Job |
|---|---|---|---|
| 1 | Cold open on the artifact | 80 | Quote the genre's own title; list where it keeps appearing, in fragments |
| 2 | The stake | 60 | What breaks for the reader who builds on it |
| 3 | Fairness pledge | 25 | "But I'm going to be fair first." Then deliver on it |
| 4 | **Steelman** | 450–600 | 4–8 real advantages, each led by a bold claim sentence, each in its advocates' terms; concede where the case holds |
| 5 | The hinge | 50 | Anaphora triplet naming the category error |
| 6 | **Archaeology** | 500–700 | Numbered steps: origin → misreading → amplification, with dates, names, primary quotes |
| 7 | Mechanism + ceilings | 400–550 | Three lines of what it does; then each steelman advantage broken at a named scale |
| 8 | **Receipts** | 400–600 | Your stack, in units. Code blocks whose comments are the human question |
| 9 | Failure modes + alternatives | 400–500 | Numbered list of what will break; named tools that don't break that way |
| 10 | Analogy · concession · incentive · close | 350–450 | One extended analogy in its own section; hand the tool back its real use; name the incentive that spreads the error; close on 3–4 imperatives and a short line |

Beats 4, 6, and 8 are the load-bearing ones. **If the attack outweighs steelman
plus receipts, the piece is a complaint** — cut the attack, not the evidence.

## Drafting order

Not the reading order. Write it like this:

1. **The mechanism (beat 7, first half).** Three lines, no rhetoric. If you can't
   write them, you don't understand the thing well enough to attack it.
2. **The steelman (beat 4).** Before any criticism, so the criticism is aimed at
   the real thing. Write it to win.
3. **The receipts (beat 8).** Paste the real output. Trim to what argues.
4. **The archaeology (beat 6).** Chase every claim to a primary source. This is
   research, not writing — it's where the piece earns the right to its tone.
5. **The ceilings (beat 7, second half).** Quote each steelman advantage back in
   its own words and break it with a number.
6. **The frame** — open, hinge, failure modes, alternatives, analogy, close.
7. **The title, last.** Two proven patterns: the imperative correction (*"Stop
   Calling It Memory"*) and the flat mechanism claim (*"Why Markdown Files Can't
   Replace Databases"*). Colon-join them if the publication allows.

## Revise against the gates

Run `skills/ripley/references/revision-checklist.md` as usual, then these four,
which are
specific to this genre:

- [ ] **Fairness.** Would a proponent read the steelman and say "yes, that's why I
      do it"? Read it back as them. If they'd say "you left out the best part,"
      the steelman isn't finished.
- [ ] **Receipts.** Every number, quote, date, and count traces to the ledger, and
      every ledger row traces to something you can open. `[TK]` anything else.
- [ ] **Target.** Criticism lands on claims, artifacts, and incentives — never on
      motives, competence, or a private individual. Public work, quoted accurately,
      is fair game; "these people are idiots" is both unfair and weaker.
- [ ] **Concession.** The tool gets its legitimate use back, in plain words, before
      the close. Without this the piece reads as hostility and gets dismissed as
      one.

Then the two this genre breaks most often from the prose skill:

- [ ] **Excitement at zero** (principle 11) — including about your own stack. No
      "blazing fast," no "powerful." 832KB is the argument.
- [ ] **One analogy**, in one section. Sticky notes *or* the house foundation, not
      both plus a restaurant kitchen.

## Deliver

A single markdown file: the piece, plus a short `## Open TKs` list at the bottom
if any slot stayed empty — what to measure, and where it goes. Tell the user
which claims are still unsourced rather than smoothing over them. Never publish it
anywhere; hand over the file.
