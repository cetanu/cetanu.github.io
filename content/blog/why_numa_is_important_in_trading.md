+++
title = "Profit or Poverty: NUMA"
date = 2026-04-17
template = "article.html"

[taxonomies]
tags = ["hft", "performance", "low-latency"]

[extra]
go_to_top = true
+++

While modern software tries to hide hardware complexity behind abstractions,
staff working in HFT must dig down to ensure that every nanosecond is spent
executing trading logic, not chewed up by operating system overheads or noisy
neighbouring processes.

Learning the ins and outs of NUMA is not a micro-optimization, it is a requirement.

### Short history of NUMA

Back in the day, CPUs were slower than memory. In the 1960s, processors began
to overtake memory in speed and as a result found themselves stuck waiting for
data to arrive from a memory access.

This was solved by either avoiding memory access, or by adding cache memory
some of which you may have heard of like L1 and L2 cache.

However, as operating systems and applications have grown, these caches are no
longer as effective. Additionally, on modern servers with multiple CPU sockets, only
one processor can access the memory at one time, causing the other to wait.

Non-uniform memory access (NUMA) was created to solve this problem by providing
separate memory to each socket.

### Why NUMA must be considered in a high-frequency trading (HFT) environment

In HFT, nanoseconds matter. If your application has to wait an extra amount of
nanoseconds every time it needs to access some memory, it quickly adds up into
microseconds and perhaps even milliseconds.

On hardware with NUMA, data could reside in non-local memory aka the memory of
the other socket on the server board. For the local core to access this memory
it has to traverse an interconnect which can take 100-200 nanoseconds.

### How to protect your application from the downsides of NUMA

Firstly, on Linux, NUMA is modelled as nodes. For example, Node 0 is Socket 0
plus its attached memory, for however many sockets your system has.

You can configure different policies per-thread or per-allocation.

* `local` (default) - allocate on the node where the thread is running.
* `bind` - allocate _only_ on specified nodes.
* `preferred` - try a particular node first but fallback to others.
* `interleave` - round-robin across nodes.

In HFT you probably want to use `bind`.

#### Discover your topology
Even on your laptop or desktop linux computer, you should be able to install
`numactl`, `lscpu`, or `lstopo` and look at the nodes.

This is my desktop for example, which has one socket with eight cores, and 32
GB of memory:

{{ image(url="/lstopo.png", alt="CPU topography", no_hover=true) }}

On a server system with multiple cores you should see additional separate NUMA nodes.

#### Disable automatic NUMA balancing

Automatic balancing is done by `autonuma` which scans processes' memory and
migrates pages to try to optimise locality, which is fine for most cases but
can cause latency spikes that are unacceptable in a trading environment.

There are two things that must be done to disable balancing.

Adjust the following sysctl:

```bash
echo 0 > /proc/sys/kernel/numa_balancing
```

and then add `numa=off` to the boot-loader configuration, or similar, depending
on your boot-loader.

#### Pin your application

Use `numactl --cpunodebind=<node> --membind=<node> <the_program>`

It should be noted that the scheduler can still move threads between cores on
that node, so in addition to this you'll want to pin your application to the
same cores using `taskset` or similar, like `taskset -acp <cores> <pid>`

#### Validate the setup

Check that your process is actually bound correctly with `numastat -p <pid>`.
This will print out a table detailing its memory usage for each node, where the
node should only be the one you've bound the process to.

### What if my systems engineers misconfigure NUMA?

If you're a developer in a trading firm and you've deployed your application,
you can still check NUMA at runtime and ensure your allocations land on the
correct node. The library `libnuma` has an API that allows you to check if NUMA
is available, how many nodes there are, which node a given core belongs to, and
the ability to allocate on a particular node.

In reality, any competent linux/production/systems/sre team in a HFT should
already be working with their developers to ensure everything it set up
correctly.


### Conclusion

In the overwhelming majority of environments NUMA goes by unnoticed, with the
defaults being suitable for most workloads. However in trading, if you ignore
NUMA, the results can be catastrophic. Microseconds of latency across millions
of memory accesses can be the difference between profit and poverty.
