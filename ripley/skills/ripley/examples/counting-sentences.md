# What three essayists have in common, and it isn't sentence length

I spent an afternoon counting words in other people's sentences.

The question was narrow. Every guide to writing tells you to vary your sentence
length, and then stops, as if *vary* were a measurement. I wanted a number. So I took
60 Paul Graham essays, 60 Benedict Evans posts, and the four Henrik Karlsson pieces I
had on disk, cut them into sentences with a regex crude enough to be embarrassed
about, and counted.

Their averages have nothing in common. Graham runs 16.2 words per sentence, Karlsson
18.4, Evans 23.8. Evans writes sentences half again as long as Graham's, and you can
feel it — the stacked clauses, the commas asked to hold more than commas should.
Three writers, three different machines.

Then divide each writer's standard deviation by his mean.

Graham 0.61. Evans 0.60. Karlsson 0.86.

What they share isn't length. It's *spread*. In all three, the typical sentence sits
about 60% of its own length away from the average — and roughly one sentence in five
comes in under nine words. The advice was right and nobody bothered to say what it
meant.

For contrast I wrote four paragraphs of the blandest consulting prose I could manage,
the kind about how organisations must navigate the complexities of data governance.
Spread: 0.12. Not one sentence under nine words. Every sentence between 12 and 25.

So I had a test. I thought.

## Where it fell apart

The first essay it convicted was `simply.md`. Spread 0.41, well under the line I'd
drawn.

That's Graham's essay called *Write Simply*. The piece arguing for short sentences is
written in uniformly short sentences — mean 13.7 words, nowhere to fall from. Of
course it is. The essay is a demonstration of itself, and my test called it machine
work.

Then Evans's *The AI summer*: 8.5% of sentences under nine words, under the line
again. Evans doesn't do the short punchy landing. He builds and builds and lets the
qualification do the landing instead. Different writer, different method, flagged all
the same.

Every single metric I had convicted a real essay. Only the consulting sludge failed
all three at once — spread, short sentences, and the middle band together.

Which is the same rule the skill I was building already stated about words: one
marker is nothing, a cluster is a confession. I'd written that sentence a week
earlier and hadn't believed it enough to expect it back as arithmetic.

## What the number is actually measuring

Here's the part I didn't expect.

The metric doesn't find machine prose. It finds the absence of a decision.

Graham's short sentences in *Write Simply* are uniform because he chose uniformity;
the essay is an argument delivered in its own shape. Evans's long ones are long
because he refuses to simplify a question that isn't simple. Both look like failures
on a spread test, and both are the writer pressing down on the page.

The consulting paragraphs are uniform because nothing pressed at all. Every sentence
came out at 15 words for the same reason water finds a level — no force acted on it.

You cannot measure a decision. You can only measure departure from the middle, and
then guess at whether something was behind it. Which means the number is real and
mostly useless: it catches prose nobody wrote, and it slanders prose written hard in
one direction.

I still ship the script, with a caveat I can't argue my way out of: the only text it
has ever flagged in full is the sludge I wrote on purpose to be flagged. Everything
real I've pointed it at came back clean or came back with one marker, which is
nothing. So it has caught, to date, exactly zero things I didn't already know.

That's the honest state of it. Not a detector — at best a smoke alarm, and one that
hasn't yet gone off in a kitchen I wasn't already standing in.

Count your own sentences sometime. Not to pass, and not to hit 0.60. Just to find out
whether the last thing you wrote had anything pushing on it, because your ear will
lie to you about that and the arithmetic won't.
