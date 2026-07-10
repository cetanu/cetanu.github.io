+++
title = "Do We Really Need TLS for Cat Pictures?"
description = "An exploration of why all web traffic must be encrypted, the modern compute cost of TLS, and the wild history of ISPs injecting ads and tracking headers into plaintext streams."
date = 2026-07-10
template = "article.html"
render = false

[taxonomies]
tags = ["security", "networking", "privacy"]

[extra]
go_to_top = true
+++

It is a common piece of skepticism: *\"Is encrypting every single corner of the
web actually necessary? If I'm just reading a static blog post or looking at a
cute picture of a cat, there are no passwords or credit cards involved. Why do
we need to wrap all of that in TLS? Aren't we just wasting a massive amount of
CPU cycles globally?\"*

On the surface, it seems like a reasonable complaint. Wrapping every HTTP
response in a layer of cryptography must have a cost. 

But when you dig into the mechanics of modern networks and the history of how
ISPs behave when we leave our traffic in plaintext, the answer becomes obvious.
Ubiquitous TLS isn't paranoia or wasteful bloat—it is the bare minimum required
to keep the web functional.

Let's break down the actual compute cost of TLS and look at what happens to
your data when you don't encrypt it.

---

## The Compute Myth: Is TLS Actually Wasting CPU?

Historically, yes, SSL/TLS was computationally expensive. In the 1990s and
early 2000s, setting up a secure connection and encrypting a stream of data was
a heavy burden for servers. Websites that wanted encryption often had to buy
dedicated, expensive SSL accelerator expansion cards to offload the
cryptographic math from the main CPU. 

Today, that bottleneck is long gone. 

### 1. Hardware-Accelerated Cryptography (AES-NI) Modern CPUs (both client-side
and server-side) have dedicated hardware instructions built directly into the
silicon to handle symmetric encryption. The most famous of these is Intel and
AMD's **AES-NI** (Advanced Encryption Standard New Instructions). 

With AES-NI, the CPU doesn't need to run a software loop to encrypt data
block-by-block. Instead, it offloads it to hardware execution units that run
the operations in a handful of clock cycles. 

Because of this, modern processors can encrypt and decrypt AES-GCM (the primary
cipher suite used in TLS 1.3) at near-memory speeds. A single modern CPU core
can easily encrypt multiple gigabits of data per second. On a typical web
server, the CPU overhead of encrypting the payload is a fraction of a percent.

### 2. TLS 1.3 Handshake Optimizations The most computationally intensive part
of TLS isn't actually encrypting the data stream (symmetric cryptography)—it is
the initial handshake where the client and server negotiate keys (asymmetric
cryptography). 

TLS 1.3, finalized in 2018, radically streamlined this process:
* **One Round-Trip (1-RTT):** The handshake was cut from two round-trips to
  one, reducing latency.
* **Pre-Shared Key (PSK) Session Resumption:** Returning visitors can resume a
  session in zero round-trips (0-RTT), skipping the expensive asymmetric key
  generation entirely.
* **Faster Algorithms:** Modern deployments favor elliptic curve algorithms
  like `X25519` for key exchange and `ECDSA` or `Ed25519` for signatures. These
  are orders of magnitude faster and lighter than the classic, bulky RSA keys
  of the past.

If you profile a modern web application, the resources spent on TLS are a drop
in the bucket. Parsing a JSON payload, running a database query, rendering a
React component, or executing a snippet of JavaScript takes orders of magnitude
more CPU cycles than encrypting a packet.

---

## If the Compute Cost is Low, Why Encrypt Cat Pictures?

If the computational cost is negligible, we still have to ask: what is the
point of encrypting non-sensitive content? If someone intercepts your request
to see a cat picture, they just see a cat picture. Who cares?

The issue isn't just **confidentiality** (keeping secrets secret). The real
threat is **integrity** (making sure the data isn't tampered with).

Without TLS, your connection is just plain HTTP. That means every router,
switch, and intermediate network node between your browser and the web server
can read your traffic—and more importantly, they can **modify** it. 

This isn't a theoretical threat. Throughout the 2010s, Internet Service
Providers (ISPs), public Wi-Fi operators, and network gateways repeatedly
behaved like active man-in-the-middle attackers to monetize and track plaintext
web traffic.

Here are a few of the most egregious examples of what ISPs did when they were
allowed to read plaintext streams.

---

## When ISPs Act Like Malicious Actors

### 1. Verizon's "Supercookie" (UIDH)
From 2012 to 2016, Verizon Wireless silently injected a unique tracking header
called the **UIDH** (Unique Identifier Header) into every unencrypted HTTP
request sent by its mobile users. 

```http
GET /cat-pictures HTTP/1.1
Host: example.com
X-UIDH: 9f8a3c2e1b0d7f...  <-- Injected by Verizon's network
```

Because HTTP traffic was plaintext, Verizon's network equipment could intercept
the packets in transit, append this custom header, and forward it to the
destination server. 

This header acted as an undeletable tracking cookie. Even if users cleared
their browser cookies, blocked trackers, or used incognito mode, third-party
advertising networks (like Turn) could read this injected `X-UIDH` header and
use it to reconstruct the user's tracking profile across the web.

Because it was done at the network level, users had no way to disable it. It
was only stopped after a security researcher exposed the practice, leading to
public outcry and a **$1.35 million fine** from the FCC in 2016. If the sites
had been using HTTPS, Verizon would not have been able to inject the header
without breaking the cryptographic signature of the packet.

### 2. Comcast's JavaScript Injection In 2017, Comcast users began noticing
strange popups appearing on top of the websites they were browsing. 

Comcast was using deep packet inspection (DPI) to monitor customer traffic.
When they detected a user was browsing an unencrypted HTTP site, they would
modify the HTML on the fly, injecting custom JavaScript code into the webpage
before it reached the user's browser. 

The injected code was used to display "courtesy notices" telling users they
were approaching their monthly data cap, or warning them that their modem was
out of date. 

While Comcast claimed this was a feature to help consumers, injecting arbitrary
JavaScript into third-party websites is incredibly dangerous. It can break the
site's layout, cause conflicts with the site's own scripts, and introduce major
security vulnerabilities. If a hacker managed to compromise Comcast’s injection
system, they could have executed arbitrary code on millions of customer
browsers.

### 3. Hotel and Airport Wi-Fi Ad Injection If you've ever connected to a hotel
or airport Wi-Fi network and seen a strange floating toolbar at the bottom of
every page, or unexpected ads on sites that don't usually host them, you've
experienced ad injection.

Public Wi-Fi gateways frequently intercept HTTP traffic to inject local
advertisements, promotions, or terms-of-service agreements. By rewriting the
HTML of the websites you visit, they degrade your browsing experience and can
expose your browser to malicious ads (malvertising).

### 4. DNS Hijacking and Search Redirection Many ISPs (including Charter, Cox,
and Rogers) historically practiced DNS hijacking on unencrypted traffic. If you
typed in a non-existent URL (like `http://this-does-not-exist.com`), instead of
showing a browser error page, the ISP would intercept the request and redirect
you to a custom search page loaded with ads and sponsored links, monetizing
your typos.

---

## The Three Pillars of TLS

When we encrypt the web, we aren't just hiding passwords. We are establishing
three fundamental guarantees:

| Guarantee | What It Means | What Happens Without It |
| :--- | :--- | :--- |
| **Confidentiality** | Only you and the server can read the data. | ISPs, governments, or hackers on your local Wi-Fi can see exactly which pages, articles, and pictures you are viewing. |
| **Integrity** | The data cannot be modified in transit. | Network middleboxes can inject ads, tracking headers, popups, or malicious scripts into the page. |
| **Authenticity** | You are communicating with the real website. | An attacker can spoof the website's identity (e.g., DNS poisoning) and serve you a fake page without your browser raising any warnings. |

Even if you are only looking at cat pictures, you deserve to know that the cat
pictures you are seeing are the actual ones sent by the server, and not a
modified payload injected with tracking scripts and banner ads.

## Conclusion

The push for a 100% encrypted web—championed by projects like *Let's Encrypt*,
search engines prioritizing HTTPS, and browsers displaying warnings for
insecure sites—was a necessary response to the reality of the internet's
infrastructure. 

The internet is not a direct wire between your computer and a server; it is a
chain of intermediaries. And history has proven that if those intermediaries
are given the power to read and modify your traffic, they will exploit it for
profit. 

Thanks to modern hardware acceleration like AES-NI and the design of TLS 1.3,
we can secure the entire web with virtually zero performance penalty. Encrypted
cat pictures aren't a waste of compute—they are a victory for user privacy and
web integrity.
