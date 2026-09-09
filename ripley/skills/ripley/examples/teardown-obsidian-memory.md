# Corpus sample: the teardown voice

**Source:** "Stop Calling It Memory: The Problem with Every 'AI + Obsidian' Tutorial"
(also titled "The Obsidian Memory Delusion: Why Markdown Files Can't Replace
Databases"), by Limited Edition Jonathan, 23 March 2026. Reproduced here verbatim as
the calibration sample for `references/voice-teardown.md`. Not written by this skill,
and not to be republished — it is here to be read before imitating, the way the
Graham, Evans, and Karlsson corpora are.

**Read it for:** the steelman-then-autopsy shape, the archaeology section, the
receipts (file sizes, record counts, line counts), the code blocks that argue, the
sticky-note analogy, and the anaphora triplets.

---

Every week my feed fills with another "I Built an AI Second Brain with Obsidian + Claude Code" post. Medium articles. Substacks. YouTube videos with thumbnails showing a brain made of glowing markdown files. All of them breathlessly explaining how they crammed Claude into an Obsidian vault and achieved "persistent memory" and "Jarvis-level" personal assistant capabilities.

I need to talk about this. Because what's happening right now is one of the clearest examples I've seen of the influencer-to-cargo-cult pipeline in the AI space, and if you're building on top of this advice, you're constructing your entire system on a foundation that will collapse the moment you actually need it to work.

But I'm going to be fair first. Because the Obsidian people aren't all wrong. They're just wrong about the thing that matters most.

*[Subscription pitch block — kept because the "Real talk:" aside is part of the voice.]*

Real talk: Substack weights paid subscribers way heavier than free ones for their "Rising in Technology" list. At the time of this publication I have 1,666 subscribers and only 20 paying for it. I'm not doing this for the money everything stays free, that's not changing. But if you want to help me actually show up where new people can find this, $8/month is how that happens. You're not buying content. You're buying me a better seat at the table.

## The Strongest Case for Obsidian (And I Mean the Actual Strongest)

Let me give the Obsidian crowd their due, because there are legitimate reasons this setup appeals to people, and dismissing them would be intellectually lazy.

You own your data, fully and locally. No cloud dependency, no proprietary format, no vendor lock-in. Your notes are plain text files sitting on your hard drive. If Obsidian disappears tomorrow, you still have every file. This is a real advantage. If you've ever been burned by a SaaS tool shutting down or changing its API, you understand why this matters. Compared to Notion (where your data lives behind their API in their format), this is meaningfully better for data sovereignty.

LLMs read markdown natively. There's no translation layer. When Claude reads a .md file, it's ingesting the same format it was trained on. Headings, bullet points, plain text, it all just works. No API calls, no JSON parsing, no middleware. The friction between your notes and the model is essentially zero.

Everything is human-readable and human-editable. You can open any file in your vault, see exactly what your AI "knows," and change it with a text editor. There's a transparency to this that databases don't offer by default. You don't need special tooling to inspect the contents.

The wikilink system creates lightweight connections. Obsidian's [[wikilink]] syntax gives you bidirectional links between notes, and the graph view makes those connections visible. It's the closest thing to relational data you can get without touching a database.

Zero setup cost. Obsidian is free. You open a terminal in your vault folder, type claude, and Claude Code has access to everything. No schema to design, no database to provision, no SQL to learn. For someone who doesn't know the difference between a table and a query, this is the lowest possible barrier to entry.

Git-friendly versioning. Your entire knowledge base is diffable, branchable, and has full history. You can see exactly what changed, when, and roll back if something breaks.

The Obsidian Skills from Steph Ango are well-designed. Obsidian's CEO released official Agent Skills in January 2026 that teach Claude Code how to handle Obsidian's file formats correctly. Markdown syntax, Bases databases, JSON Canvas, CLI commands. These are legitimate, well-scoped tools that do exactly what they claim.

That's the case. And honestly? For a personal note-taking system, for capturing ideas, for building a knowledge garden that you browse and tend manually, Obsidian is great. I have no beef with Obsidian as a note-taking app.

The problem starts when people call it memory. The problem starts when people call it a database. The problem starts when the entire AI productivity content ecosystem decides that a folder of text files is infrastructure.

## How We Got Here (The Archaeology of a Bad Idea)

This didn't happen by accident. There's a clear trail from legitimate tool design to mass delusion, and tracing it matters because it shows exactly where the thinking broke.

**Step 1: Tiago Forte made "second brain" the default metaphor.**

The "Building a Second Brain" methodology (PARA, CODE) became a massive productivity movement starting around 2017. Obsidian's homepage literally used to say "A Second Brain. For You. Forever." That language baked into the community's identity. The concept was always about note-taking and knowledge management, organizing your thoughts externally so your actual brain could focus on thinking. Reasonable idea. The term "second brain" was a metaphor for a well-organized filing system.

But metaphors have consequences. When you call your notes a "brain," people start expecting brain-like capabilities. And when AI enters the picture, "second brain" stops being a metaphor and starts being a product claim.

**Step 2: Anthropic created CLAUDE.md and Skills.**

Here's where things get technically interesting and where the confusion actually starts. Anthropic introduced CLAUDE.md as a project-scoped instruction file for Claude Code. When you run Claude Code in a directory, it reads CLAUDE.md automatically at startup. It tells Claude things like "This is a Python project. Use pytest. Don't modify the CI config." It's a config file. The equivalent of a .bashrc or a .env.

Then Anthropic introduced Skills, markdown files with YAML frontmatter that act as prompt templates triggered by slash commands. /checkin loads a 241-line prompt that defines behavior. The markdown is the prompt, not stored data.

Both of these are instruction delivery mechanisms. They tell Claude how to behave and where to look. They contain zero facts about your life, zero project details, zero contact information. You could rename every single one of them to .txt and nothing would change. Claude doesn't care if it's reading CLAUDE.md or CLAUDE.txt or CLAUDE.csv. It's parsing text content.

But the format is .md. And it auto-loads. And that combination created a pattern that people could see and misinterpret.

**Step 3: OpenClaw made the critical architectural mistake.**

OpenClaw is a self-hosted multi-channel AI agent gateway (WhatsApp, Telegram, Discord, Slack). It's ambitious and interesting as a project. But it made a decision that would ripple outward in ways I don't think they anticipated: it used MEMORY.md as literal memory storage, plus daily log files in memory/YYYY-MM-DD.md.

Their docs explicitly state that "the files are the source of truth" and that the model only "remembers" what gets written to disk. They branded this "markdown-first memory architecture."

Here's the thing. Even OpenClaw knows this doesn't actually scale. They bolted on SQLite indexing and vector search (BM25 + semantic search with embedding models) to make retrieval work, because they discovered that just reading flat markdown files doesn't cut it. The memsearch library was literally extracted from OpenClaw's codebase as a standalone tool because the community needed the search capabilities without dragging in the entire gateway. There's a GitHub issue from February 2026 that says what everyone building on this should have noticed: "OpenClaw's memory is built with markdown files. It's not scalable long term."

But the content creators didn't see the SQLite underneath. They saw the .md files on top and told the world that markdown was the magic ingredient.

**Step 4: Obsidian's CEO released Agent Skills (January 2026).**

Steph Ango released official Agent Skills for Obsidian, teaching AI agents how to correctly handle Obsidian's proprietary file formats. These skills are well-designed and appropriately scoped. They teach Claude Code the right syntax for wikilinks, frontmatter, Bases databases, and JSON Canvas files.

But the timing was gasoline. The repo hit 13.9k+ GitHub stars. Content creators had their hook: "The CEO of Obsidian just made AI integration official!" The skills themselves don't claim to be a memory system. They're format specifications. The community bolted the memory narrative on top.

**Step 5: The content creator amplification loop (February-March 2026).**

And then the dam broke. Here's a partial list of what happened in the span of about six weeks:

"World of AI" (a YouTube channel) framed Claude Code + Obsidian as a "solution to AI's memory challenges." Geeky Gadgets syndicated it.

Chase AI published a guide comparing CLAUDE.md to "the frontal cortex" and promising "Jarvis-level" personal assistant capabilities within months.

"Learn With Me AI" (six days ago as I write this) ran with "Stop Re-Explaining Yourself to Claude Every Session. I Built a Permanent Memory System." The author openly admits they're not an Obsidian expert, then says "it connects to Claude Code. And that's all that matters."

XDA Developers ran a piece calling CLAUDE.md "Claude's memory," crediting "the Coding with ADHD YouTube channel" as the inspiration.

Then came the GitHub repos. Claudesidian. obsidian-memory-for-ai. claude-note. Each one building increasingly elaborate scaffolding around the same fundamental idea: markdown files are memory.

An entire content ecosystem materialized in weeks, each post citing the previous ones as validation, none of them questioning the foundational assumption. It's a game of telephone where the original message ("CLAUDE.md is a config file") mutated into "markdown files give your AI a brain" and nobody along the chain stopped to check whether that was true.

## What "Memory" Actually Means (And What These Systems Actually Do)

Let's slow down and talk about what these Obsidian setups are actually doing, mechanically, when they claim to give Claude "memory."

Claude reads a .md file into its context window

Claude reads information from that file

Claude writes updated information back to that file

That's it. That's the whole system. The "memory" is whatever text fits in those files, and whatever Claude happens to load into its context window during a given session.

This works. At a certain scale. For a very specific set of use cases. And then it doesn't.

Here's where each advantage I listed in the steelman section hits its ceiling:

"LLMs read markdown natively" is true, but the mechanism for that reading is dumping the entire file into the context window. That's not querying. That's brute force. When your "memory" is 50 notes, this is fine. When it's 500 notes, you're burning tokens on irrelevant context every single session. When it's 5,000 notes, you've built a system that gets slower, more expensive, and less accurate the more you use it. The context window isn't a database. Treating it like one is like trying to run a restaurant kitchen by putting every ingredient on the counter at the same time.

"Human readable" is great when you have 50 entries. At 955 structured records (which is what my actual system has), nobody is reading a markdown file to find what they need. You need a query. "Show me everyone I've worked with on video projects in Philadelphia" is a question that takes one SQL statement and returns an answer in milliseconds. In a markdown-based system, it requires reading every file, hoping the formatting is consistent, and praying Claude catches every relevant mention.

"Wikilinks create relationships" is technically true but practically useless for anything beyond visualization. Obsidian's graph view shows connections between notes. It's pretty. But you can't query it. You can't say "find me all people who are connected to projects that use Supabase" and get a traversal. You can't do multi-hop relationship lookups. You can't ask "what concepts connect these two unrelated projects?" A folder of linked markdown files is not a graph database any more than a web of sticky notes on a wall is a relational schema.

"Zero setup cost" is the one that kills me, because it's the most seductive advantage and the most dangerous trap. Yes, you can start immediately. Yes, there's nothing to configure. But zero setup cost means zero structure, which means zero ability to query, filter, sort, aggregate, or do anything with your data except read it linearly. The "setup cost" that databases require isn't overhead. It's the part that makes the system actually work. Skipping it is like skipping the foundation of a house because pouring concrete takes too long. The house goes up faster. The house also falls down.

## What a Real System Looks Like

I've been building a personal assistant system on a Mac Mini that runs 100% on Anthropic infrastructure (Claude Code) and connects to Telegram for real-time interaction. It has actual memory, actual context management, and it handles both gracefully because I'm using real solutions instead of pretending text files are databases.

Here's what the stack looks like: (yes - I had my personal Ai assistant make this video for me)

SQLite (claude-memory.db, 832KB): 955 structured memories across 22 categories. 67 email interactions. 49 session logs. A task queue. A key-value store. All indexed. All queryable.

Kuzu Graph DB (kuzu-graph/, 81MB): 726 nodes (475 people, 116 projects, 54 concepts, 43 tools). 852 relationships across 12 types (KNOWS, WORKS_ON, PROJECT_USES, and more).

BOTH of these db's are growing daily.

Telegram native channel: Real-time push messaging. No polling.

4 autonomous agents (Lex + data-miner + video-producer + content-scout): Each with their own local SQLite DB for work logs, processing state, render queues, and knowledge bases.

The .md files in this system? 636 lines total across 4 files. CLAUDE.md (123 lines) is boot instructions, a config file. skill.md (241 lines) is a prompt template. The agent CLAUDE.md files are job descriptions. None of them contain a single fact about my life or work. They tell Claude how to behave and where to look. The actual knowledge lives in the databases.

Here's what I can do with SQLite that you literally cannot do with markdown files:

```sql
-- "Who have I worked with on video projects in Philly?"
SELECT DISTINCT content FROM memories
WHERE category='client' AND content LIKE '%Philly%';

-- "What did I charge for similar work last year?"
SELECT topic, content FROM memories
WHERE category='business' AND tags LIKE '%pricing%'
ORDER BY created_at DESC;

-- "Show me everything I know about this person"
SELECT * FROM memories WHERE content LIKE '%John Torres%';
SELECT * FROM email_interactions WHERE contact_name LIKE '%John%';
```

And here's what I can do with a graph database that is impossible with files:

```cypher
-- Traverse relationships: "Who do I know that works on
-- projects I'm also connected to?" (2-hop traversal)
MATCH (j:Person {name: 'Jonathan Edwards'})-[:KNOWS]->(p:Person)
      -[:WORKS_ON]->(proj:Project)
RETURN p.name, proj.name

-- "What concepts connect these two unrelated projects?"
MATCH (p1:Project)-[:PROJECT_EXPLORES]->(c:Concept)
      <-[:PROJECT_EXPLORES]-(p2:Project)
WHERE p1.name <> p2.name
RETURN p1.name, c.name, p2.name
```

Try either of those with a folder of markdown files. You'd need to read every file, parse the text, hope you formatted things consistently across months of entries, and still couldn't do relationship traversal. The graph query finds hidden connections across 726 nodes in milliseconds. A markdown grep finds string matches and calls it a day.

And here are the real numbers for context. The SQLite database holds 955 structured records across clients, projects, personal notes, creative work, business data, and assets, all in 832KB. The Kuzu graph database holds 726 nodes and 852 relationships across 6 node types and 12 relationship types, at 81MB. Email interactions (67 cross-referenced threads with contact info, dates, subjects, and CCs) live inside SQLite. Each autonomous agent has its own local SQLite DB (~200KB each) for work logs, processing state, render queues, knowledge bases, and voice profiles. The total .md instruction files across the entire system? 636 lines.

The databases hold the knowledge. The .md files hold the instructions for how to use that knowledge. Confusing the two is like confusing a filing cabinet with the label on it.

## The Five Problems Nobody Talks About

There are specific, predictable failure modes that every Obsidian-as-memory system will hit. Not might hit. Will hit. Because they're inherent to using flat files as a data store.

**1. No querying.**

You can't ask "show me all contacts tagged 'client' with importance > 7." You can't filter, sort, or aggregate. The only operation available is "read the file and hope Claude finds what you need." As your file grows, the probability of Claude missing relevant information grows with it. The context window isn't a search engine. It's a text buffer.

**2. No relationships.**

You can't traverse connections. "Who does this contact know that also works on projects I'm connected to?" requires structured data and joins. In a graph database, this is a single query. In markdown, it's impossible. You can link notes to each other, but you can't ask questions about the structure of those links programmatically.

**3. Scale ceiling.**

Once your "memory" file hits a few thousand lines, you're dumping massive amounts of text into the context window every session. That's expensive (you're burning tokens on context that might not be relevant). It's slow (more input tokens means longer processing). And it crowds out actual work (the context window is finite, and every token spent on "memory" is a token not available for the task at hand).

**4. No schema enforcement.**

There's no enforced structure. One session, Claude formats a contact as ## John Torres - Bright Pixel Media. Next session, it writes **John Torres** (Bright Pixel). The session after that, it's John T. - video producer, Philly area. Good luck parsing that programmatically. Good luck even finding all three entries when you search for John. SQLite has a schema. Every record follows the same structure. You can rely on it.

**5. No concurrent access.**

Two agents can't safely read and write the same markdown file simultaneously. If you're running multiple autonomous agents (which is where this space is heading fast), you need a data store that handles concurrent access. SQLite handles this natively with WAL mode. A markdown file handles this by silently corrupting your data when two processes write at the same time.

## The Real Alternatives (That Actually Work)

If you've been following the Obsidian-as-memory trend and you're starting to feel the ceilings, here's where to look instead. None of these are theoretical. These are tools I'm using in production, every day.

SQLite for structured memory. SQLite is a single-file database that requires zero server setup. It runs directly on your machine. Claude Code can read from and write to it with simple SQL queries. You get schemas, indexes, querying, sorting, filtering, and concurrent access. The entire database for my 955-memory system is 832KB. One file. No server. No cloud. Still local-first, still on your machine, still yours. But now it's actually queryable.

Kuzu (or any embedded graph database) for relationships. When you need to understand how people, projects, concepts, and tools connect to each other, you need a graph. Not a pretty visualization of linked files, but an actual queryable graph where you can run traversals, find patterns, and discover connections across hundreds of nodes. Kuzu runs locally, embedded in your application, no server required.

Open Brain (OB1) for a complete system. Nate Jones's Open Brain project is a Supabase-backed personal knowledge infrastructure that gives you structured storage, vector search, and real querying capabilities out of the box. It's designed for exactly this use case: giving AI persistent, structured, queryable context. And it uses a real database because that's what this problem requires.

Supabase as your personal backend. If you're comfortable with a little more setup, Supabase gives you PostgreSQL (a proper relational database), vector search, real-time subscriptions, and edge functions. It's open source, self-hostable, and designed for exactly the kind of structured data that "AI memory" actually requires. I've been beating this drum for a while: a real database replaces a dozen SaaS subscriptions and actually lets you query your own life.

The common thread across all of these: they're databases. They have schemas. They handle queries. They scale. They enforce consistency. They do the thing that markdown files categorically cannot do, which is let you ask questions about your data and get reliable answers.

## The Sticky Note Analogy

Here's the simplest way I can frame what happened.

Imagine someone walks into a well-run office. They see a senior executive with a sticky note on their monitor that says "Call David re: Q3 numbers." The sticky note is a reminder, a small instruction, a pointer to an action. The actual data about Q3 lives in spreadsheets, databases, financial systems, and ERP platforms.

Now imagine a productivity influencer walks in, sees the sticky note, and makes a YouTube video called "This Executive Runs Their Entire Company on Sticky Notes." The video goes viral. Within weeks, people are buying industrial quantities of Post-its and writing their entire customer database, financial records, project timelines, and employee information on them. They're sticking them to their walls and calling it "a visual knowledge graph." They're categorizing them with colored tabs and calling it "structured data." When someone points out that this is insane, they say "but sticky notes are human-readable! And the executive uses them! And they're local-first!"

That's what happened with CLAUDE.md and Obsidian. Anthropic put a sticky note on Claude's monitor (project instructions), and an entire content ecosystem decided that sticky notes were infrastructure. The executive never stored data on sticky notes. Anthropic never designed .md files to be databases. But the format was visible and the purpose was misunderstood, and now there are thousands of people building their AI systems on a foundation that was never meant to bear weight.

## What Obsidian Is Actually For (And That's Fine)

I want to be clear about something: Obsidian is a good note-taking app. The Steph Ango Agent Skills are well-designed. Using Claude Code inside an Obsidian vault to organize your notes, generate summaries, create linked documents, and manage your personal knowledge garden is completely valid.

What's not valid is calling it memory. What's not valid is calling it a database. What's not valid is building autonomous agent systems on top of a folder of text files and expecting it to scale.

Use Obsidian for what it's built for: taking and organizing notes. Use databases for what they're built for: storing, structuring, and querying data. The distinction isn't complicated. A notebook is not a filing cabinet. A filing cabinet is not a database. Each tool has a purpose, and using the wrong one doesn't make you clever. It makes your system fragile.

## The Deeper Problem

The Obsidian-as-memory trend isn't just a technical mistake. It's a symptom of a bigger problem in how people approach AI tooling: they optimize for setup speed instead of system capability.

The markdown file loads instantly. The database takes 20 minutes to set up. So people choose the markdown file. And then they spend the next six months working around its limitations, bolting on search tools, adding vector indexes, writing elaborate prompt engineering to compensate for the lack of structure, and eventually rebuilding the entire thing when they realize it can't do what they need.

Twenty minutes of setup would have saved six months of workarounds. But the content ecosystem incentivizes fast demos over durable architecture. "I set up an AI second brain in 10 minutes" gets clicks. "I spent a weekend designing a proper data schema and now my system will scale for years" doesn't. The incentive structure rewards exactly the wrong behavior.

And that's what frustrates me about this whole thing. It's not that markdown files are bad. It's not that Obsidian is bad. It's that the people writing these guides are teaching others to build on sand because it's faster to set up than concrete, and they either don't know or don't care that the thing they're building is going to collapse.

If you're going to build a personal AI assistant with real memory, build it on real infrastructure. Use a database. Design a schema. Write queries. It'll take longer to start (have ai stand it up for you). But it'll work.
