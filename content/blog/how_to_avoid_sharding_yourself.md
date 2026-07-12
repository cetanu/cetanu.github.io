+++
title = "How to Avoid Sharding Yourself"
description = ""
date = 2026-07-11
template = "article.html"
render = false

[taxonomies]
tags = ["system design", "multitenant", "sharding"]

[extra]
go_to_top = true
+++

I watched a video named [The Problem Sharding a Database
Solves](https://www.youtube.com/watch?v=rxR4nIQ0hCk) by [Web Dev
Cody](https://www.youtube.com/@WebDevCody). He has quite a large number of
subscribers, his video popped up on my feed, and I enjoyed the video. Also, the
diagramming tool he's using is cool and if anyone knows what it is - please
tell me!

However, one thing stuck out to me that I wanted to intercept in order to
provide advice on, based on my own real professional experience.

# The part I'm focusing on

It's not the whole video, it's just one minor part. Cody delivers on what I
think the point of his video is - to describe how sharding solves a particular
problem - but there is some detail that comes across as a suggestion for how to
implement routing a tenant to the shards and this is what I'll be discussing.

Cody describes a naive approach where you take some kind of tenant identifier
and hash it, which gives you a deterministic way to determine which shard the
tenant lives on. 

He then rightly points out that if you pick this approach, as the number and
size of tenants grows you've now made it harder to rebalance your shards, or
migrate tenants, because when you insert new shards, the deterministic hashing
essentially breaks.

This leads Cody to describe a possibly more elegant approach called "virtual
buckets" where instead of a hash being a 1:1 mapping between a tenant and a
shard, you take the modulus of the hash which maps a range of tenants to a
shard instead.

# Multi-tenant Routing with an Algorithm is an Anti-Pattern

These methods of routing tenants to shards aren't broken, but let's call them anti-patterns.

First, let's talk about why hashing is an attractive option.

* It's stateless
* It's fast
* It doesn't need a database lookup

But it leaves you open to **operational pain**, even with the use of virtual buckets.

### One tenant within a bucket can dwarf other tenants
If we just assume that the Pareto principle will play out eventually, you're
going to have one tenant which consumes 80% of a single shards capacity.

In order to rebalance them, you need to change their identifier. Now you have
to choose between accepting the noisy-neighbour problem where a huge tenant
fights for dominance with the other small tenants on the shard, or you add a
special-case to your hashing algorithm that lives on forever, and most likely
grows, needing to be maintained by operators.

### No flexibility for isolation
This is semi-related to the above, essentially,  if you wanted to have
different shards, like a "quarantine" shard for misbehaving tenants, or a "free
tier/trial" shard, or an "important enterprise customer" shard with only 1
tenant on it, you again have to special-case the algorithm.

These requirements will predictably appear as you grow and get more customers.  
Maybe they won't, but we can take care of this with very little operational
friction as we'll see later.

### Rebalancing friction doesn't go away
Cody does point out that even when you add new shards, you still might need to
rebalance tenants, but you can maybe do this with some background process or
lazy migration that writes to both shards at the same time.

For some businesses these might be acceptable operational events that someone
has to take care of, perhaps after-hours or during scheduled downtime.

Note: you _can_ mitigate this particular downside with [Consistent
Hashing](https://en.wikipedia.org/wiki/Consistent_hashing) but the others are
still unsolved.

# Your tenants deserve their own directory

I know it's attractive to use clever software to avoid adding infrastructure to
solve a problem, but I think this situation justifies the addition of a
database to act as a lookup table or directory for your tenants.

For the vast majority of businesses, a dedicated Redis or Postgres instance can
serve this purpose and take you very far.

Yes, it is a single point of failure, and if it goes down so does your entire
app probably, but do a little back of the napkin calculation on the probability
of redis (in a cluster, with high-availability), whose only job is to keep key
value pairs, becoming suddenly unavailable for any serious amount of time. It
probably won't go under 3 nines of availability.

Externalising the tenant routing to a lookup table unlocks advantages.

### Surgical Rebalancing
Your rebalancing goes from a stressful situation of changing the algorithm,
propagating it to your gateways and praying, to a 5 step process that an intern
can execute without bringing the company down.

1. Identify: you surface a big noisy tenant via monitoring or regular capacity planning
2. Provision: a new shard is created
3. Sync: background job to copy data, stream new writes in the meantime
4. Switch: single atomic database query to point at the new shard
5. Cleanup: wait a week and delete the old copy

### Better Isolation
Before, changing the way hashing works to satisfy the needs of a particular
tenant or tenants meant that you were changing the algorithm for _everyone_.
This represented a huge blast radius.

With a lookup table, you're changing one record.

# Fives nines of availability? No, I said nine fives...

If you've somehow reached the point where that lookup table is no longer
sufficient (and you're still reading this blog? lol), or you just feel
uncomfortable with having to make a lookup on every request to a single point
of failure, there's a pattern you can employ to scale things further and bring
the probability of an outage to a number approximating zero.

You can actually
[read](https://www.atlassian.com/blog/atlassian-engineering/aws-scaling-multi-region-low-latency-service)
[about](https://www.atlassian.com/blog/atlassian-engineering/atlassian-critical-services-above-six-nines-of-availability)
how Atlassian solved this exact problem using the
[CQRS pattern](https://en.wikipedia.org/wiki/Command_Query_Responsibility_Segregation).
However, I'm going to explain it here even more concisely.

CQRS, or "Command Query Responsibility Segregation", can enable a caching
pattern where distributed nodes are able to keep a local copy of the data that
they can query even while the lookup table is offline.

Distribute caches to each of the gateways that needs the data, and have those caches update  < more detail >
