# human-writing

A Claude Code skill for prose that reads like a person wrote it — essays, blog posts,
newsletters, emails, docs, READMEs, landing copy, talks, threads. It distills how three
working essayists actually write, from close analysis of 700+ of their essays.

It ships as one plugin in a marketplace named `vitalii-skills`.

## Install

```
/plugin marketplace add MisreadableMind/human-writing-skill
/plugin install human-writing@vitalii-skills
```

Restart Claude Code. To install from a local clone instead:

```
/plugin marketplace add /path/to/human-writing-skill
/plugin install human-writing@vitalii-skills
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

## What's inside

| File | What it does |
|---|---|
| [`SKILL.md`](human-writing/skills/human-writing/SKILL.md) | Eleven principles, the worst AI tells, how to pick a voice. |
| [`references/anti-ai-tells.md`](human-writing/skills/human-writing/references/anti-ai-tells.md) | 30 tells with rewrites — and a section on what is *not* a tell, so you don't over-correct. |
| [`references/structure-tells.md`](human-writing/skills/human-writing/references/structure-tells.md) | Whole-piece shape: the survey, symmetric sections, total coverage. Plus the pre-draft claim test. |
| [`references/concrete-without-inventing.md`](human-writing/skills/human-writing/references/concrete-without-inventing.md) | Where real detail comes from, and what to do when you have none. |
| [`references/registers.md`](human-writing/skills/human-writing/references/registers.md) | READMEs, work email, landing copy, newsletters, threads, talks. |
| [`references/revision-checklist.md`](human-writing/skills/human-writing/references/revision-checklist.md) | Run before delivering. |
| [`references/voice-*.md`](human-writing/skills/human-writing/references) | House blend (default), Paul Graham, Benedict Evans, Henrik Karlsson, the Analyst (*Economist*/Bloomberg register), and a procedure for matching your own writing. |
| [`scripts/rhythm.py`](human-writing/skills/human-writing/scripts/rhythm.py) | Measures sentence-length spread against measured baselines. |
| [`examples/`](human-writing/skills/human-writing/examples) | A worked example, with notes on where it still fails. |

## The rhythm script

The skill tells Claude to reach for this during revision instead of guessing at rhythm.
You can run it yourself on any Markdown or plain text file. Python 3, no dependencies,
reads stdin if you give it no file.

```
python3 human-writing/skills/human-writing/scripts/rhythm.py draft.md
```

Pointed at the worked example bundled with the skill, it prints:

```
human-writing/skills/human-writing/examples/counting-sentences.md  —  44 sentences in 14 paragraphs

  mean sentence      14.1 words
  spread (sd/mean)   0.64
  under 9 words      38.6%
  in the 12-25 band  40.9%
  shortest / longest  2 / 36

  corpus baselines     spread   <9w   12-25w
    Paul Graham        0.61  21.0%   50.0%
    Ben Evans          0.60  13.0%   39.2%
    H. Karlsson        0.86  23.7%   44.9%

  Spread is in human range.
```

Baselines come from 11,522 sentences across the three essayists, measured with the same
crude splitter it runs on your draft, so the numbers compare.

The verdict needs all three metrics to fail at once. Each one alone convicts a real essay
— Graham's *Write Simply* is uniform on purpose, Evans barely uses a short sentence. Same
rule the prose guidance uses: one marker is a style, a cluster is a tell.

## Two things it won't do

It has no bundled essay corpus, so the three single-writer voices work from their profiles
and excerpts rather than from full essays. The house blend and match-my-voice are
unaffected.

It can make text pass its own checks, which is not the same as making it worth reading. A
draft written to satisfy the checklist has its own signature. The checklist can't see it,
because the checklist is the thing being satisfied.

## Layout

```
.claude-plugin/marketplace.json     marketplace manifest
human-writing/
  .claude-plugin/plugin.json        plugin manifest
  skills/human-writing/
    SKILL.md                        entry point
    references/                     loaded on demand
    scripts/rhythm.py
    examples/
```

## License

MIT. See [LICENSE](LICENSE).
