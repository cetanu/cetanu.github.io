+++
title = "Profit or Poverty: TLB"
date = 2026-04-28
template = "article.html"

[taxonomies]
tags = ["hft", "performance", "low-latency"]

[extra]
go_to_top = true
+++

## The Illusion of Memory

Applications do not allocate memory directly to physical addresses on the RAM.
They are presented with virtual memory by the operating system, so that it can
pretend that the application has a contiguous block of memory when in reality
its memory is scattered across the physical RAM in fixed-size chunks of memory
called pages, kept track of in a page table.

When a process starts, the operating system allocates a range of virtual
addresses to it in the form of pages, but leaves the entries in the page table
blank until they're accessed (i.e. they are lazy-loaded)

If the process tries to access memory, the operating system follows the virtual
memory address to the physical memory address and hands back the data. The
actual translation from virtual address to physical address is not performed by
the OS but by a dedicated hardware component on the CPU called a memory
management unit (MMU).

Sometimes, if RAM is running low or hasn't been accessed in a while, data is
taken out of RAM and swapped to disk. If the process then tries to access that
memory again, a **major** page fault occurs, the operating system has to retrieve the
data from disk, load it into RAM, and then update the page table before the
process can proceed.

A minor page fault is when the data is still in RAM, but the page table for the
process has not been mapped to the physical page yet. By default the operating
system is lazy about mapping page table entries, but there are strategies for
ensuring that all pages are mapped.

## The Bottleneck

Every time you're reading variables, or loading instructions, or saving data,
the system is translating virtual memory addresses to physical addresses.

### A hardware page table walk

This translation can be quite involved if we dig really deep into the detail.
The MMU looks at a register to find the physical address of the root page
table. Then it takes some bits from the virtual address, goes to RAM, and reads
the page table entry at that index. Then it takes the result from that lookup,
goes back to RAM again, and finds the entry point to another intermediate
table, and another intermediate table... until it gets the physical page frame
number. It then combines the address with some of the bits from the original
virtual address to find the exact byte in memory.

### Introducing the TLB

The translation look-aside buffer (TLB) is a specialized cache within the MMU
which remembers recent mappings to avoid the CPU having to check the full page
table (in RAM) on every single memory access (billions of times per second)

The consequence of a TLB miss is that the operation takes 100-200x longer. In
reality this equates to about 100 nanoseconds, which is miniscule, but the
volume of these operations causes that time to add up rapidly. Not to mention
that 1 nanosecond would be much preferred.

## How to make 💵 MONEY 💵

Since the consequence of TLB cache misses are so dire, it makes sense to avoid
them. Working around the cache is out of the question, so the way forward is to
enhance the effectiveness of the cache by making it have to cache less things,
thereby improving its hit rate.

The TLB has a limit on the number of page table entries it can hold. A page is
typically 4KB but this may differ based on your hardware. So if your system has
32GB of memory, you need 8 million entries to map all the available memory on
the system, which is not possible.

### Hugepages

This is where "Hugepages" come in.

Hugepages is a feature in the linux kernel that allows a program to use much
larger page sizes, usually either 2MB or 1GB. By using this option, you can
effectively map all of the memory that you need such that it can fit in the
limited number of entries in the TLB easily.

For example, with the 32GB example from before, using 1GB hugepages, you would
only need 32 entries, rather than 8,000,000.

#### Enabling hugepages for your application

You could set a sysctl (`vm.nr_hugepages`), or you could control it from your program, for example...

In C++, when calling `mmap`, you can pass the `MAP_HUGETLB` bitflag or `MAP_HUGE_1GB` for example.

In Rust, there are some crates like `memmap2` or `hugepage-rs`.

### Memory Pinning

I mentioned earlier that when a process starts, the OS allocates virtual
memory, but it lazily maps the page table entries. So you may have hugepages
enabled, but you can still encounter a page fault if you access memory that
hasn't been mapped yet.

There is a linux system call, `mlockall` which can be used to eagerly map all
the virtual memory for your process. It's advised to call this before entering
the critical part of the program, such as any part of the program which needs
to be real-time (requires deterministic timing).

This system call not only "pre-faults" the pages so that they're ready, it also
pins them so that the operating system cannot swap them back to disk.

#### How to pin memory, from within your program

In C++ you would include the `sys/mman.h` header, allowing you to call mlockall directly.

```c
#include <sys/mman.h>
#include <iostream>
#include <cstring>

int main() {
    if (mlockall(MCL_CURRENT | MCL_FUTURE) != 0) {
        std::cerr << "Failed to lock memory: " << std::strerror(errno) << std::endl;
        return 1;
    }
    munlockall(); 
    return 0;
}

```

In Rust, you would use the `libc` crate and call it similarly.

```rust
use libc::{mlockall, MCL_CURRENT, MCL_FUTURE};

fn main() {
    let locked = unsafe {
        mlockall(MCL_CURRENT | MCL_FUTURE)
    };

    if locked != 0 {
        let err = std::io::Error::last_os_error();
        panic!("Failed to lock memory: {}", err);
    }
}
```

## Conclusion

Ultimately, the illusion of memory that modern systems provide is a
double-edged sword. While virtual memory addressing solves major problems
around process isolation for most systems, the introduction of page tables and
the need to perform multi-level page table walks introduces latency that is
unnoticable to humans but harmful to low-latency and real-time applications.

With this small bit of operating systems and linux knowledge you can use
hugepages and memory pinning to reduce memory latency by up to 100 to 200 times
in certain scenarios.
