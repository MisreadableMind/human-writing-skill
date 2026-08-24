# Concrete detail without inventing it

This skill gives one instruction more forcefully than any other: be specific. Name
real people, real texts, real objects. Replace the abstraction with the messy
particular. Principle 4 says it, and the house blend's pass 3 makes it a whole pass.

Follow that instruction while having no facts, and you fabricate. The output looks
like this: a Berlin fintech that cut onboarding by 40%, a study from Stanford, a
friend who quit consulting to make furniture. All plausible. All invented.

This is the worst failure mode in the skill, because it's invisible from the inside.
Fabricated detail reads *better* than honest generality — it's more concrete, more
vivid, and it scores higher on every other check in these files. The prose improves
as the truth degrades.

**The rule: specificity is a sourcing problem, not a writing problem.** Never
generate a fact to satisfy a style instruction.

---

## Where real detail comes from, in priority order

**1. The user's own material.** Almost every request arrives with more real detail
than it looks like. The repo you're in, the file they pasted, the draft they handed
you, the numbers in an earlier message, the product you've been discussing for twenty
turns. Mine that first, every time. The user's Wednesday call, their actual page
numbers, their real customer. A voice profile built from a real sample is made of
exactly this.

**2. Public fact you actually know and can name.** A company, a product, a date, a
book, a documented event. The test is whether you'd be willing to write the name next
to it. "A well-known cloud provider" means you don't know; drop it or find one you do.
If you're unsure, treat it as unknown — a wrong specific is worse than a right general.

**3. Ask.** One question costs less than a fabricated number that ships. "What was
the actual churn figure?" is a fine thing to ask mid-draft. Ask once, in a batch, at
the point you need it — don't interview the user paragraph by paragraph.

**4. A marked hypothetical.** Legitimate, and underused. *"Suppose a team of six
ships every Thursday…"* The reader knows it's constructed, and it still does the full
work of an example — it grounds the abstraction, it just doesn't claim to be evidence.
Signal it with *suppose, imagine, say, take a team that…*, and never with a proper
noun. The moment you name the company, you've claimed it happened.

**5. A `[TK]` placeholder.** The journalism convention: leave the hole visible for
whoever has the fact.

> Churn dropped to `[TK: your actual figure]` in the quarter after we shipped it.

Never fill your own TK. The point is that it's conspicuous — the user fills it, or
they cut the sentence. A draft with three TKs in it is honest work; the same draft
with three invented numbers is a liability.

**6. Honest generality.** Last resort, not first. "Teams that measure this usually
find it's worse than they thought" is weak, but it's true. Weak and true beats vivid
and invented.

**7. Cut the claim.** If it needs evidence you don't have, and the piece survives
without it, delete it.

---

## Never invent

Not as a hypothetical, not "for illustration," not because the sentence needs a noun:

- **Numbers.** Percentages, revenue, headcount, benchmarks, dates, durations, prices.
- **Named people**, and quotes attributed to them.
- **Named companies inside an anecdote.** Naming a public company to describe
  something documented is fine. Naming one as the subject of an event you made up is
  not, and it's the most common version of this failure.
- **Studies, papers, reports, statistics.** Tell #9 already bans "studies show";
  inventing the citation to fix it is worse than the weasel it replaced.
- **Quotes.** If you can't reproduce it exactly, paraphrase openly or drop it.
  (Quotes are evidence; paraphrasing throws the evidence away.)
- **URLs, filenames, API names, config keys, CLI flags.** In docs and READMEs this
  fails loudly the moment someone tries it. Read the code or leave a TK.
- **First-hand experience.** "A client we worked with," "I've seen teams," "when I
  was running my own startup." You didn't. This one is worth stating separately.

## The first-person problem

The skill tells you to use "I" (principle 9). Two different things wear that pronoun:

- **The user's "I", carrying the user's real experience.** Legitimate. You're drafting
  in their voice about their life — their team, their mistake, their Wednesday.
- **An "I" with an invented biography.** Fabrication with a friendly face. It's also a
  style tell in its own right (see tell #28): model first-person is *personal-sounding
  without being personal* — an "I" that thinks and notices but never has a job, a
  Tuesday, or a specific thing it got wrong.

If you're writing as the user and need an experience you don't have, that's a TK or a
question — not an invention. "I remember when `[TK: the incident you mentioned —
which release was it?]`" is a perfectly good line to hand back.

---

## The catch-yourself moment

You'll feel it as fluency. The sentence starts, wants a concrete noun, and one
arrives — a company name, a round number, a plausible year. It arrives *because* it's
plausible. That's the whole mechanism: the same process that makes the prose good
makes the fact up.

When you notice it, run the ladder above from the top. Real detail, then marked
hypothetical, then TK, then generality, then cut.

- ✗ "For example, a fintech startup in Berlin found that onboarding got 40% faster."
- ✓ "For example, suppose onboarding takes a new hire two weeks." *(marked)*
- ✓ "For example, `[TK: the onboarding number from the Q2 deck]`." *(sourced later)*
- ✓ Or name the real one, if you actually know it.

## Before you ship

- [ ] Every number in the draft traces to the user's material or to something I'd
      stake a name on. No exceptions for "roughly."
- [ ] Every named person, company, study, and quote is real, or the sentence is
      marked as hypothetical.
- [ ] Every hypothetical is signalled (*suppose / imagine / say*) and has no proper
      noun in it.
- [ ] Every TK is still a TK. I didn't fill one in myself.
- [ ] I told the user, in one line, which specifics I left for them. A TK the user
      doesn't notice is the same as an invented fact.
