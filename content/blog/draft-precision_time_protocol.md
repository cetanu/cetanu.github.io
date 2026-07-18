+++
title = "Profit or Poverty: Time is Money (and why NTP isn't enough)"
description = "Why NTP isn't accurate enough for trading, and how PTP (Precision Time Protocol) achieves sub-microsecond precision."
date = 2026-07-07
template = "article.html"
render = false

[taxonomies]
tags = ["hft", "sre", "infrastructure"]

[extra]
go_to_top = true
+++

In trading, knowing exactly *when* an event occurred is just as critical as
knowing *what* occurred. Whether you're correlating market data to tune a
strategy, or proving to regulators (under frameworks like MiFID II) that your
trades executed fairly, your timestamps need to be flawless.

For most of the tech industry, time synchronization is handled by **[BLANK 1:
The standard internet protocol for clock synchronization]**, which is accurate
to a few milliseconds. In HFT, being off by a millisecond means you missed the
trade completely. We need sub-microsecond, or even nanosecond accuracy.

## Enter [BLANK 2: The IEEE 1588 Standard for time synchronization]

To achieve this extreme level of accuracy across a datacenter, HFT networks
rely on a different protocol entirely. 

Unlike the standard protocol, which largely operates in software, this
specialized protocol is heavily reliant on hardware.

## The Hierarchy of Clocks

A specialized time network operates in a strict hierarchy: At the very top is
the **[BLANK 3: The primary time source, usually receiving time via GPS
antenna]**. This appliance dictates the time for the entire network.

As the time signals travel through network switches, the switches themselves
must account for the time it takes the packet to traverse their internal
circuitry. They do this by acting as a **[BLANK 4: A switch that intercepts
time packets, updates the time, and forwards them]** or a **[BLANK 5: A switch
that simply calculates its own residency time and adds it to a correction field
in the packet]**.

## Hardware Timestamping

The real magic happens at the server level. If we rely on the Linux kernel to
tell us when a packet arrived, we introduce jitter (as discussed in previous
posts).

Instead, SREs configure the Network Interface Cards (NICs) to perform **[BLANK
6: The act of recording the time at the exact moment the packet hits the
physical layer of the NIC]**. 

By stamping the packet exactly as it arrives at the physical port (the PHY or
MAC layer), we eliminate the variable delays caused by PCIe bus transfers,
kernel interrupts, and thread scheduling. 

Building a network capable of distributing this kind of time accuracy is a core
competency for any trading firm, ensuring that when they measure latency, they
are measuring the code, not the clock.
