+++
title = "A Philosophy of Software Design"
date = 2026-03-25
+++

Today I finished reading the book, "A Philosophy of Software Design", by John
Outsterhout, a professor at Stanford University.

I wanted to write a little about what I learnt from the book, plus how I see it
mapping to my experience in my work where I've dealt with software and choices
around design.

### Complexity is incremental

This is probably obvious to anyone who has worked on software in any serious
capacity, but (unless you're vibe-coding) complexity doesn't just show up in a
single pull-request.

It's the "Boiling Frog" problem.  
If we increase the temperature by just one degree, surely it's not that bad,
right?

The incremental quality of complexity is what makes it so insidious, because
it's so easy to trade a small bit of complexity to get something shipped. You
can even continue to make that trade-off, again and again, for years. Who cares
if an abstraction leaks a little bit, as long as it deals with this edge case
right now?

It's hard to pinpoint the exact moment when things become sluggish, hard to
change, prone to errors, and difficult for new engineers to understand. That's
because there's no exact moment.  
Just like how a frog doesn't suddenly start boiling when the water goes from
99°C to 100°C.

I might be totally wrong on this, but I get a general sense that when people
think about complexity, the focus is on technical decisions that get made over
time.  
I believe it's more pragmatic to shift this perception so that the focus is
on person-to-person interactions - the root of the problem.  
When a reviewer fails to stand their ground, complexity is welcomed in. This is
where it gets tricky, because often you're standing against a peer who you
trust, who means well, but who might be too busy to spend the extra time to
come up with a design that doesn't attach one more tiny anchor to the codebase.

I comfort myself by thinking that nobody intentionally adds complexity. They
can't see a better way, or maybe they didn't ask themselves if there could be a
better design. Thinking takes energy and I don't blame anyone for taking the
path of least resistance to get their work done. Perhaps what we need is better
ways to measure complexity, so that we can reward its reduction.

### Abstractions are about hiding unnecessary details

This one probably sounds like common sense. Duh! That's what an abstraction is.

However, for me, I think it's valuable to consider that you and I sometimes
make abstractions that accidentally hide *necessary* details.

This is one of those things where, if you zoom out a little bit, makes software
engineering seem like such a challenging field. The subjectivity of this -
where to draw the boundaries of an abstraction - highlights a constant
cognitive requirement towards making a balanced decision.

You can't open a book and have it tell you how to make the right abstraction.
You just have to fail, walk into a mess, learn from the mess, and make the next
project better, only to fall into another mess.

I suppose in some way, this is the essence of "design". It's the thing that
makes software seem more like art than science at times.

### Deep modules are simpler than shallow modules

First, what does this even mean? What is a deep module?  
A module is deep when its implementation is large compared to its interface.

That means that you could have a module that is long (in terms of lines of
code), but if every function in that module is exported, the interface is
large.

Instead, a deep module would be something with perhaps a few key functions or
classes exported, which encapsulate the implementation behind a concise
interface.

This was something that surprised me at first but makes total sense.
If make a library, I don't want the caller to have to know about 20 different
functions or methods that they need to call, especially if most of the time all
of the arguments passed in are very similar.

### General-purpose code is simpler than special-cased code

First, what exactly is the difference between the two?  
General purpose code solve a class of problems. Special case code solves one problem.

Example:
* Special case: A function that adds the `Authorization` request header with a particular value
* General purpose: A function that adds a request header, with a given key and value.

## Philosophy, not Science

I alluded to a particular theme that seems to be common across the above concepts.

* What makes a good abstraction?
* How deep should a module be?
* How general should my code be?

There's no formula. A book can't teach it to you. A committee can't develop a standard for it.

The fundamental question being wrestled with is "Where do I draw the boundary?"
and the answer is different from wherever you are standing.

It's the human factors that help answer this question. How much cognitive load
can the reader bear? How often will I have to change the codebase? A compiler
or linter can't answer these questions. It requires a person to draw a
subjective line in the sand and then defend it.

### The element of "Taste"

I hear about how the future of software will be influenced by having good
"taste" now that LLMs are writing all the code (I don't actually believe this).  
If that's true then I sincerely hope that all the people that intend to map
their taste into software learn good software design first.

Ironically, the way to learn good software design is through experience. You
have to ship something and collect the feedback. Sometimes that feedback is
customers telling you what causes friction. Other times it shows up in the
volume of questions directed at a particular feature... at 3AM after your site
blows up.

While reading the book you get a sense that it's never going to answer this
question, "What's a good abstraction?" because it can't. The professor
encourages people to find the right balance for themselves, and it introduces
distinctions that might enable them to do so.

You might be creating a good design if the abstraction aligns with a
business domain, or when you provide a neat general-purpose interface across an
entire system. You might be creating a bad design when you add logic that
purely addresses an immediate need and nothing else.

## Closing thought

As painful as it may be for an engineer's mind to hear, there is a part of
software that will probably always be somewhat of an art. I guess what matters
at the end of the day is whether you can lower the volume of the inner critic
just enough to be proud of the way you solved problems, even if they weren't
perfect.
