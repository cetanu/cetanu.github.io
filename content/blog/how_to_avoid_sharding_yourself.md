+++
title = "How to Avoid Sharding Yourself"
description = "A deep dive into database sharding, tenant routing strategies, and why deterministic hashing might cause headaches when scaling multitenant architectures."
date = 2026-07-11
template = "article.html"

[taxonomies]
tags = ["system design", "multitenant", "sharding"]

[extra]
go_to_top = true
+++

I watched a video named [The Problem Sharding a Database
Solves](https://www.youtube.com/watch?v=rxR4nIQ0hCk) by [Web Dev
Cody](https://www.youtube.com/@WebDevCody).  
He has quite a large number of subscribers, his video popped up on my feed, and
I enjoyed the video.

It's about splitting up your database and the advantage of doing so, but it
introduces a small problem and that is the question of how to ensure that each
user accesses the correct database shard.

{{ image(url="/img/cody.png", alt="screenshot of cody's video", no_hover=true) }}

<small>
Also, the diagramming tool he's using is cool and if anyone knows what it is -
please tell me!
</small>

However, one thing stuck out to me that I wanted to intercept in order to
provide advice on, based on my own real professional experience.


## What caught my attention
Cody delivers on what I think is the point of his video - to outline the advantage of sharding.
But there is an example for how to implement routing a tenant to the shards and
this is what I'll be providing advice on, based on my professional experience.

Cody describes a naive approach where you take some kind of tenant identifier
and hash it, which gives you a deterministic key which maps to the shard that
the tenant lives on. 

He then rightly points out that if you pick this approach, as the number and
size of tenants grows you've now made it harder to rebalance your shards, or
migrate tenants, because when you insert new shards, the deterministic hashing
essentially breaks.

This leads Cody to describe a possibly more elegant approach called "virtual
buckets" where instead of a hash being a 1:1 mapping between a tenant and a
shard, you take the modulus of the hash which maps a range of tenants to a
shard instead.


## Algorithmic Routing can be an Anti-Pattern
These methods of routing tenants to shards aren't broken, but let's call them anti-patterns.

First, let's talk about why hashing is an attractive option.

* It's stateless
* It's fast
* It doesn't need a database lookup

But it leaves you open to **operational pain**, even with the use of virtual buckets.

#### One tenant within a bucket can dwarf other tenants
If we just assume that the Pareto principle will play out eventually, you're
going to have one tenant which consumes 80% of a single shards capacity.

In order to rebalance them, you need to change their identifier. Now you have
to choose between accepting the noisy-neighbour problem where a huge tenant
fights for dominance with the other small tenants on the shard, or you add a
special-case to your hashing algorithm that lives on forever, and most likely
grows, needing to be maintained by operators.

#### No flexibility for isolation
This is semi-related to the above, essentially,  if you wanted to have
different shards, like a "quarantine" shard for misbehaving tenants, or a "free
tier/trial" shard, or an "important enterprise customer" shard with only 1
tenant on it, you again have to special-case the algorithm.

These requirements will predictably appear as you grow and get more customers.  
Maybe they won't, but we can take care of this with very little operational
friction as we'll see later.

#### Rebalancing friction doesn't go away
Cody does point out that even when you add new shards, you still might need to
rebalance tenants, but you can maybe do this with some background process or
lazy migration that writes to both shards at the same time.

For some businesses these might be acceptable operational events that someone
has to take care of, perhaps after-hours or during scheduled downtime.

Note: you _can_ mitigate this particular downside with [Consistent
Hashing](https://en.wikipedia.org/wiki/Consistent_hashing) but the others are
still unsolved.


## Use a Lookup Table for Tenant Routing
{{ image(url="/img/lookup-table.png", alt="diagram of architecture that uses a lookup table", no_hover=true) }}

I know it's appealing to avoid adding infrastructure to solve a problem, but I
think this situation justifies the addition of a database to act as a lookup
table or directory for your tenants.

For the vast majority of businesses, a dedicated Redis or Postgres instance can
serve this purpose and take you very far.

Yes, it can be a single point of failure, and when it goes down so does your
entire app probably, but do a little back of the napkin calculation on the
probability of redis (in a cluster, with high-availability), becoming suddenly
unavailable for any serious amount of time. It probably won't go under 3 nines
of availability.

#### Surgical Rebalancing
Your rebalancing goes from a stressful situation of changing the algorithm,
propagating it to your gateways and praying, to a 5 step process that an intern
can execute without bringing the company down.

1. Identify a big noisy tenant
2. Provision a new shard
3. Run a background job to copy data, stream new writes in the meantime
4. Switch to the new shard atomically
5. Wait a week and delete the old copy

#### Better Isolation
Before, changing the way hashing works meant that you were changing the
algorithm for _everyone_.

One mistake and everyone is cooked.

With a lookup table, you're changing a single record.

You also unlock the scenario discussed above where you can move your enterprise
customers to their own shard, or throw the naughty tenants into quarantine so
they don't annoy everyone else.


## Fives nines of availability? No, I said nine fives...
If you've somehow reached the point where that lookup table is no longer
sufficient (and you're still reading this blog? lol), or you just feel
uncomfortable with having to make a lookup on every request to a single point
of failure, there's a pattern you can employ to scale things further and bring
the probability of an outage to a number approximating zero.

You can actually read about
<sup>
[1](https://www.atlassian.com/blog/atlassian-engineering/aws-scaling-multi-region-low-latency-service)
[2](https://www.atlassian.com/blog/atlassian-engineering/atlassian-critical-services-above-six-nines-of-availability)
</sup>
how Atlassian solved this exact problem using the
[CQRS pattern](https://en.wikipedia.org/wiki/Command_Query_Responsibility_Segregation).
However, I'm going to explain it here even more concisely.

CQRS, or "Command Query Responsibility Segregation", can enable a caching
pattern where distributed nodes are able to keep a local copy of the data that
they can query, cutting the latency of tenant lookups to practically zero, and
allowing them to continue to operate while the central lookup table is offline.

Put even more simply:

1. Something writes to the central lookup table (the Command)
2. The central lookup table publishes an event to a broker
3. The nodes pick up the event (the Query)

{{ image(url="/img/cqrs-example.png", alt="diagram of an architecture that demonstrates cqrs", no_hover=true) }}

An example of a broker could be an SNS topic, or a version number on an API, or
whatever else you want to use, as long as it's cheap for nodes to access and
backed by something highly available.

### A Contrived example

Imagine an isolated scenario on a single machine where there's a database, an
application with its own sqlite cache, and a file containing a number to
indicate what version the data is at currently.

When a row is added or changed in the database, it increments the number in the
file. The application has a background thread checking the number in the file,
and notices that it's been incremented, so it replaces the sqlite cache
atomically.

This entire time, the application has been able to read from its local sqlite
database uninterrupted.

The same concept applies to your distributed tenant routing. The central lookup
table acts as the source of truth, but your application nodes or API gateways
can maintain their own fast, resilient local caches of the routing rules.

## Conclusion

While clever routing to shards might seem appealing at first, saving you an
extra database lookup and avoiding a new piece of infrastructure, it introduces
operational complexity as your application scales and your tenants grow.

A lookup table is dead simple, painless, and gives you flexibility for later
on. If you need the scale, you can add it later with zero downtime.

Often, the "boring" infrastructure choice is exactly what you need to avoid
sharding yourself.
