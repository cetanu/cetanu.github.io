+++
title = "Profit or Poverty: False Sharing"
date = 2026-07-07
template = "article.html"

[taxonomies]
tags = ["hft", "performance", "hardware"]

[extra]
go_to_top = true
+++

In previous blogs I talked a little bit about
[NUMA](@/blog/why_numa_is_important_in_trading.md) and the
[TLB](@/blog/translation_lookaside_buffer.md), if you haven't read those, I
recommend starting there before reading this.

You should already understand that accessing main memory is relatively slow for
the CPU, especially in a low-latency environment, and you may be familiar with
the fact that the CPU has small caches of varying sizes on the chip, known as
the L1, L2, and L3 caches.

As their name implies, there are levels, or a hierarchy, from fastest (and
smallest) to slowest (and largest). The L1 cache is also typically split into
two caches, one being an instruction cache and the other being a data cache.

Fun fact: these caches are usually made of SRAM and usually they are the
largest part on the chip.

{{ image(url="/img/relative-hw-speed.png", alt="relative speed of hardware", no_hover=true) }}

## Requesting data from the cache

You may have heard of "cache lines" before (also called cache blocks), maybe on
some article about performance on hackernews.

A cache line can be thought of a single unit of data which is transferred from
RAM to the cache. Usually one cache line is 64 bytes, but this can differ
depending on your CPU architecture.

This introduces the concept of cache locality. When the CPU needs to access the
same memory several times in a row, after it's already been pulled into the L1
cache, this is referred to as **temporal locality**. When the CPU pulls in a
cache line and all the data it needs is within that block, it's referred to as
spatial locality. A good example of **spatial locality** is when you have an
array that fits into one cache line, resulting in traversal being extremely
fast. An example of potentially terrible cache performance might be something
like a linked-list.

On systems with multiple CPU cores, they might share the same chunk of memory
in their local caches. Most processors use what is known as the MESI protocol
to prevent overwriting each others data. Jon Gjengset has a [great
talk](www.youtube.com/watch?v=tND-wBBZ8RY) about Mutexes which also covers the
MESI protocol.

## Where it can go wrong

CPUs can enter what is called a coherence livelock or cache-line pingponging,
where multiple cores fight over the same memory, or the same cache line.

The first way this can happen is called **False Sharing**, where your data may
reside in a cache line, but it may not be occupying that entire cache line by
itself. If your data sits in the first half but some other data sits in the
latter half, it's possible that two CPUs may continuously write to the same
cache line, requiring them to communicate with each other to gain ownership in
order to modify the cache line. If you watched Jon's video above you would know
that this can eat up dozens of precious nanoseconds, just for the comms between
CPUs. As you increase the number of cores on a system this problem can be
exacerbated.

{{ image(url="/img/false-sharing.png", alt="diagram of false sharing", no_hover=true) }}

The second way is **True Sharing**, where cores may write to the same variable or
data structure in memory. This could happen during atomic operations or when
using synchronization primitives such as mutexes, semaphores, barriers,
spinlocks, and so on.

## How to protect against it

At least for false sharing, the solution seems simple: just pad your data
structure or variable so that it occupies an entire cache line. Obviously it
would be silly to do this with every variable in your program, so you have to
pick the time-critical parts of your application here.

```rust
use std::sync::atomic::AtomicU64;

#[repr(align(64))]
pub struct PaddedAtomic {
    pub value: AtomicU64,
}
```

For true sharing, it seems quite a bit more complicated to get right. Sometimes
you really do need atomic operations on global memory.

You could pull data into thread local storage, only merging back at the end of
expensive or time critical execution.

You could reorganize your program to do batching to reduce how often it needs
to write back to the shared memory. 

Maybe a lock-free data structure could be used.

The solution most likely depends on exactly what you are willing to accept in
terms of trade-offs.

## Conclusion

Like I usually say, for the most part things like this are unnoticeable and
work just fine for the majority of situations. If you're running a flask webapp
you probably don't and should not care about this.

When you require low-latency, then you need to understand how to write your
programs such that they exploit cache-lines for your architecture because it
makes the difference between a 1ns L1 cache hit, or falling off a cliff with a
100x slower execution.
