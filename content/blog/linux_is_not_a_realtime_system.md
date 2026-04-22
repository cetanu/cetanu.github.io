+++
title = "Profit or Poverty: Realtime kernel patch"
date = 2026-04-20
template = "article.html"

[taxonomies]
tags = ["hft", "performance", "low-latency"]

[extra]
go_to_top = true
+++

**Linux is not a realtime operating system.**

This statement confused me at first, but as I looked further, it began to make
sense.

Linux provides an environment where multitasking is possible, facilitated by a
scheduler which has goals such as minimizing wait times and latency, maximizing
throughput, and maximizing fairness.

These goals can sometimes pull in different directions. If you maximize
throughput for one task, you increase latency for others. If you minimize
latency by switching tasks more often, overheads start to pile up. If every
process gets an equal slice of time for fairness, heavy tasks are starved while
light tasks sit idle.

Taking the general approach is the best decision for most usecases like servers
and desktop computing, but it means that Linux is a "soft realtime" system.

## Defining "realtime"

What is evoked when you hear someone talk about something happening in
**realtime?** We often think that it is happening immediately, like we're
describing something in the present.

In computing, realtime refers to something more specific. From Wikipedia:

> A system is said to be realtime if the total correctness of an operation
> depends not only upon its logical correctness, but also upon the time in
> which it is performed.

That is to say that it does not mean "fast" necessarily, it's more to do with
deterministic behavior in relation to time.

Linux is a **soft** realtime system, meaning that if an operation misses its
deadline, it isn't a hard failure. Your process might wait a few hundred
microseconds before the scheduler gives it a time-slice, and for the vast
majority of cases, this is acceptable and nobody notices. If a deadline is
missed frequently, the user experiences a degradation of service. For example,
a web page might load slower, but still eventually load.

A **hard** realtime system would be something like an assembly line, where if a
part isn't processed before its deadline, that part is no longer reachable by
the robot, and the next robot won't be able to process it correctly.

## The Scheduler

I mentioned earlier that Linux provides multitasking. It really provides the
illusion of multitasking, at least on a single core. The task scheduler is what
creates this illusion, by allocating slices of time to each task, interleaving
their execution with one another to create the illusion of simultaneous
progression. This is referred to as concurrency, as opposed to parallelism.

<small>
Concurrency comes from the Latin "con" (together) and "currere" (to run,
literally, to move faster than walking).
</small>

Concurrency is great, especially when tasks have to wait for something to
become available - the scheduler can pause that task until it's ready to be
executed, and give time-slices to other tasks in the meanwhile.

The task itself can communicate to the scheduler that it should be paused to
allow other tasks to progress. Often, a task will do this implicitly by
executing a particular system call, such as `read()` or `sleep()`.

However, the *scheduler* can also pause a task *without any cooperation from the
task.*

{{ image(url="/preemption_meme_1.png", alt="Scheduler standing behind the
application, about to ruin its day", no_hover=true) }}

## Preemption

This particular style of multitasking on Linux is called preemptive
multitasking. Tasks can be "preempted".

Sounds interesting, but what does it mean? *What* is being preempted?

The current task's execution time is being preempted - cut short - so that a
more important task can be run.

During preemption, the process state is saved, and another's is loaded. This
mechanism is what we know to be a context switch.

An example where this is good: you run an application, and that application
chews up all your compute, and you want to cancel it. If it couldn't be
preempted, you wouldn't be able to move your cursor to close or cancel it.

Where preemption becomes undesirable is when you're in a low-latency
environment such as high-frequency trading, and your trading application gets
preempted and has to wait **hundreds of microseconds** to execute.

## Switch it off!!

You can use a tool like `chrt` to change how your running process is treated.
For example, maybe you set its priority very high, in FIFO mode where it runs
until it voluntarily yields, like so:

```
chrt --pid --fifo 99 <PID>
```

<small>You can also check the current scheduling attributes with `chrt -p <PID>`</small>

This will reduce the worst-case kernel latency but **doesn't get rid of all
sources of jitter.**

There are still things that can preempt the task. Here's a few:

### Hard interrupts (IRQs)

These are signals from hardware - network cards, disk controllers, or system
timers. If your application runs on the same core that is handling interrupts,
the CPU will pause your app to run the handler.

You can examine the interrupts on an existing machine by inspecting
`/proc/interrupts`. This will show you devices and their IRQ number.

By default, all cores can service interrupts.

{% alert(tip=true) %}
Non-essential hardware interrupts can be moved to another core or cores with
interrupt affinity (`/proc/irq/<IRQ_NUMBER>/smp_affinity`). See [Interrupts and IRQ
Tuning](https://docs.redhat.com/en/documentation/red_hat_enterprise_linux/6/html/performance_tuning_guide/s-cpu-irq)
in the Red Hat tuning guide
{% end %}

### Non-maskable interrupts (NMI)

An NMI is another hardware interrupt which the CPU cannot ignore or disable.
These come from critical events like fatal hardware problems, memory errors,
power failures, and watchdog timer timeouts.

The watchdog is a daemon that keeps track of /dev/watchdog, which contains a
heartbeat from a hardware timer on the motherboard. This is to detect CPU lockups.

This can be and usually is disabled in HFT environments as far as I'm aware.
This supposedly the most frequent cause of this type of interrupt. The other
NMIs cannot be disabled and usually result in a kernel panic or system restart.

{% alert(tip=true) %}
You can disable the watchdog while the system is running by setting the sysctl
`kernel.nmi_watchdog` to `0`, or you can edit your bootloader such as GRUB with
`nmi_watchdog=0` at the end of the line that starts with
`GRUB_CMDLINE_LINUX_DEFAULT`

Occasionally it can show up in BIOS as "IPMI Watchdog Timer" which can be disabled.
{% end %}

### System Management Interrupts (SMI)

This is also technically a non-maskable hardware interrupt, but it originates
from the BIOS or EFI and pauses the entire OS. They're particularly insidious
because they cannot be detected via any standard linux observability.

These interrupts occur when the motherboard needs to perform some kind of
thermal throttling or power management, and can take in excess of 100
microseconds to complete.

{% alert(tip=true) %}
There is nothing you can configure in the OS to prevent this, but there may be
BIOS options like disabling "Global SMI" or "C-States", and these options may
only be present in server hardware that has been specifically optimized for HFT
by the vendor.
{% end %}

### Software faults

If the trading app tries to access memory and encounters a page fault or a TLB
miss, the kernel needs to take over and fetch the page.

{% alert(tip=true) %}
Use huge-pages and pre-fault all pages. I'll cover this more in a future
article about the TLB specifically.
{% end %}

## Validation

There are some tools out there which can be used to run tasks and measure interference, such as:

* `cyclictest` can be used to measure kernel scheduling latency
* `hwlatdetect` can be used to measure latency caused by NMIs 

## Conclusion

The systems we use daily work seamlessly for us, but under the surface they're
executing sophisticated multitasking routines to give every process a fair
chance at execution, with low-level hardware events stepping in and taking
priority to avoid abrupt system failures.

In a trading environment, without knowledge of these interactions, your
application would be subject to all kinds of jitter, causing you to miss a
"fill" or to get sniped on a fast-moving order book...

... and that can be the difference between profit and poverty.
