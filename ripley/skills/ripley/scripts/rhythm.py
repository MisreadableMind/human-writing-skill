#!/usr/bin/env python3
"""Measure sentence-length spread in a draft and compare it to the bundled corpora.

    python3 scripts/rhythm.py draft.md

Model prose clusters around one mid-length cadence. Human prose doesn't. The
discriminator isn't average sentence length — Graham averages 16 words and Evans 24 —
it's the *spread*: in all three bundled corpora the standard deviation is 60-86% of
the mean, and one sentence in six or so runs under 9 words.

Baselines below were measured over 11,522 sentences (60 Graham essays, 60 Evans
posts, all 4 Karlsson pieces) with this same crude splitter, so the numbers are
comparable to what it reports for a draft.

Each metric on its own false-positives on real essays, so the verdict needs all
three. Graham's 'simply.md' is uniform by design; Evans's 'the-ai-summer' barely
uses a short sentence. Same rule as the prose: the signal is a cluster.

Reads stdin if no file is given. No dependencies.
"""
import re
import statistics
import sys

BASELINE = {
    #                 cv    <9w    12-25w
    "Paul Graham":   (0.61, 21.0, 50.0),
    "Ben Evans":     (0.60, 13.0, 39.2),
    "H. Karlsson":   (0.86, 23.7, 44.9),
}


def strip_md(text):
    text = re.sub(r"^---\n.*?\n---\n", "", text, flags=re.S)   # front matter
    text = re.sub(r"```.*?```", "", text, flags=re.S)          # code blocks
    text = re.sub(r"^\s*#.*$", "", text, flags=re.M)           # headings
    text = re.sub(r"\[([^\]]*)\]\([^)]*\)", r"\1", text)       # links
    text = re.sub(r"^\s*[-*>]\s+", "", text, flags=re.M)       # bullets, quotes
    return re.sub(r"[*_`]", "", text)


def sentences(para):
    parts = re.split(r'(?<=[.!?])["”\)]?\s+(?=[A-Z"“\(])', para.strip())
    return [s.strip() for s in parts if s.strip()]


def main():
    if len(sys.argv) > 1:
        with open(sys.argv[1], encoding="utf-8") as fh:
            raw = fh.read()
        label = sys.argv[1]
    else:
        raw, label = sys.stdin.read(), "stdin"

    body = strip_md(raw)
    paras = [p for p in re.split(r"\n\s*\n", body) if len(p.split()) > 25]
    lens = [len(s.split()) for p in paras for s in sentences(p)]

    if len(lens) < 10:
        print("Not enough prose to measure (need ~10 sentences in full paragraphs).")
        return 1

    n = len(lens)
    mean = statistics.mean(lens)
    cv = statistics.pstdev(lens) / mean
    short = 100 * sum(1 for x in lens if x < 9) / n
    band = 100 * sum(1 for x in lens if 12 <= x <= 25) / n

    print(f"\n{label}  —  {n} sentences in {len(paras)} paragraphs\n")
    print(f"  mean sentence     {mean:5.1f} words")
    print(f"  spread (sd/mean)  {cv:5.2f}")
    print(f"  under 9 words     {short:5.1f}%")
    print(f"  in the 12-25 band {band:5.1f}%")
    print(f"  shortest / longest  {min(lens)} / {max(lens)}\n")

    print("  corpus baselines     spread   <9w   12-25w")
    for name, (b_cv, b_short, b_band) in BASELINE.items():
        print(f"    {name:<15}    {b_cv:.2f}  {b_short:4.1f}%   {b_band:4.1f}%")

    print()
    flags = []
    if cv < 0.45:
        flags.append(f"spread {cv:.2f} — sentences run close to one length")
    if short < 10:
        flags.append(f"{short:.0f}% under 9 words — nothing lands short")
    if band > 65:
        flags.append(f"{band:.0f}% in the 12-25 band — one cadence")

    for f in flags:
        print(f"  · {f}")

    if len(flags) == 3:
        print("\n  All three outside human range. This is the rhythm tell: vary "
              "sentence\n  length hard, and let a short line land the point.")
    elif flags:
        print("\n  Only some flags fired, which real essays do too — Graham's "
              "'simply.md'\n  is uniform by design (0.41), Evans's 'the-ai-summer' "
              "has few short\n  sentences (8.5%). One marker is a style; all three "
              "are a tell.")
    else:
        print("  Spread is in human range.")

    print("\n  Rhythm only. Says nothing about whether the prose is any good.\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
