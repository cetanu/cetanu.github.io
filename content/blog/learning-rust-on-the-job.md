+++
title = "The moment that made Rust click for me"
description = ""
date = 2026-07-31
template = "article.html"
render = false

[taxonomies]
tags = ["rust", "learning"]

[extra]
go_to_top = true
+++


If you’ve ever tried to learn Rust, you probably know the standard playbook. I
even made a [video](https://youtu.be/d9ahpl1gHVA?si=qFipk8o2CBqR3L6z) on it.

You read "The Book" (the official Rust Programming Language book). You work
through a bunch of code katas. You fight the borrow checker on toy problems,
eventually forcing your code to compile, and you think, *"Okay, I get it now."*

That was my story, too. I knew the syntax. I understood the theoretical
difference between `String` and `&str`. But if I’m being completely honest,
Rust hadn't actually *clicked*. It felt like I was solving academic puzzles
rather than wielding a tool. 

It wasn't until I had to maintain a professional, production-facing Rust
project that the language truly made sense to me.

## The Crossroads: Python vs. Rust

The turning point came thanks to a well-scoped problem we encountered at work.
A colleague of mine, who was also exploring Rust, decided to do a little
experiment. They built a solution to this problem in Python—our team's usual
workhorse—and built an identical version in Rust. 

When the time came to hand the project over, they presented me with a choice:
*"Here are the two versions. You get to choose which one you want to
maintain."*

The benchmarks made the decision almost obvious. The Rust version was blazing
fast and consumed a fraction of the memory. Combine those performance metrics
with my lingering, unresolved curiosity about the language, and my mind was
made up. I chose to inherit the Rust codebase.

## Trial by Maintenance

Taking ownership of that project changed everything. I wasn't just writing
greenfield code from scratch or solving isolated katas anymore. I was suddenly
responsible for *maintaining* it. 

When you maintain a project, your priorities shift. My day-to-day involved:
1. **Performance Tuning:** Trying to squeeze even more speed out of the
   application, which forced me to deeply understand memory allocation and
   profiling in Rust.
2. **Readability:** This was the big one. I had to make the code readable not
   just for me, but for the rest of my team. Refactoring complex, nested logic
   into clean, idiomatic Rust forced me to stop just trying to "make it
   compile" and start writing code that communicated its intent clearly.

Through this process, the borrow checker stopped being an adversary and started
feeling like a very pedantic pair programmer. The rigid compiler rules, which
previously felt restrictive in katas, suddenly revealed their value when I was
trying to confidently refactor a critical piece of infrastructure without
breaking it.

## The Blueprint Effect

Months later, a requirement came up for a similar project. Rather than starting
from zero, I used the first Rust project as a blueprint. 

Because I had spent so much time refining and maintaining that original
codebase, I had a solid foundation. But this new project eventually grew larger
and more complex than the first. As the scope expanded, I had to reach for more
advanced Rust features. I was forced to design architectures that scaled, deal
with more complex trait bounds, and manage concurrency in ways the first
project didn't require.

Because I had that initial, well-scoped professional project under my belt,
these new concepts weren't overwhelming. They felt like natural extensions of
what I already knew.

## Why the Professional Context Matters

Looking back, books and katas are fantastic for syntax and foundational
concepts. But they lack the friction of the real world. 

In a professional project, you can't just slap a `.clone()` on everything to
make the compiler shut up—eventually, a performance review or a team member
will call you out on it. You have to write code that other people can read. You
have to maintain it when requirements change. 

That constraint—the necessity of building something robust, performant, and
legible for a team—was the crucible that finally made Rust click for me. It’s
why I'm comfortable with the language today. If you're stuck in the "kata
phase" of learning Rust, my advice is to find a real, well-scoped problem at
work and just build it. You might be surprised by how quickly the pieces fall
into place.
