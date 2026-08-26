+++
title = "Why Scrolling Cat Pictures Requires TLS"
description = "A little history behind why the internet adopted TLS for all web traffic"
date = 2026-07-22
slug = "do_we_really_need_tls_for_cat_pictures"
aliases = ["blog/2026-07-18-do_we_really_need_tls_for_cat_pictures"]
template = "article.html"
render = true

[taxonomies]
tags = ["security", "networking", "privacy"]

[extra]
go_to_top = true
+++

It's a Sunday afternoon, you're at a cafe, you connect to the free wifi and
browse the internet for funny cat pictures.

The silly cat picture makes you smile.

{{ image(url="/img/cat-minecraft.jpg", alt="cat in minecraft", no_hover=true) }}

---

## The Ghost in the stream

But not everything is as peaceful and innocent as it seems. Someone is watching
you scroll cat pictures, and it's not the barista.

That same person can tell your browser to execute random javascript, or replace
elements on the site with ads. And it's not some hacker on the cafe wifi...

... It's your own ISP.

At some point in time, myself and others would express *"Why encrypt everything?
Imagine all the compute being wasted encrypting a bunch of static pages with no
private information."*

But I missed the biggest security gap of sending plain-text HTTP back and forth over the public internet.  

To understand what, and why, we have to look back through a bit of history.

---

## Indestructible Tracking Headers

In 2012, security researchers noticed something weird. Even after users deleted
their cookies, enabled incognito, or used tracker blocking browser extensions,
advertising companies could still identify them with 100% accuracy.

How was this possible? 

Because the users were visiting unencrypted sites, Verizon was able to
intercept the traffic. Right before sending the packets to the website, they
added an extra header into the HTTP request:

```http
GET /api/v2/cat HTTP/1.1
Host: example.tld
X-UIDH: 9f8a3c2e1b0d7f...  <--
```

The **UIDH** (Unique Identifier Header) allowed advertisers to track an
individual across the internet. Since it was added after packets had already
left the users machine, there was no way to remove it. It was only until
Verizon copped a $1.35 million fine (absolute peanuts to them) that they
stopped.

If the site had enforced TLS, Verizon would have seen a bunch of encrypted
data, making it impossible to inject the header.

---

## Mysterious Popups

But tracking headers were just the beginning. In 2017, Comcast users started seeing
strange, official-looking Comcast popups on top of normal pages. 

They were inspecting customer traffic, finding plaintext HTML streams, and
adding their own custom javasacript code into the response.

It wasn't just a little bit of javascript by the way, we're talking **hundreds of lines of code**.

When confronted on their support forum, the Vice President of Policy and
Standards responded by telling the user that the popups only come up if the
user ignores several email notices about their data cap. How comforting.

As egregious as that was, at least it was just a pop-up telling users that they
were nearly out of quota. Can you imagine if it was more nefarious than that,
or if someone was able to compromise Comcast and put whatever script they
wanted in its place?

---

## Muh Performance

Given these oversteps by ISPs and wifi operators like hotels and airports, why
did it take until 2018 for everyone to start encrypting all web traffic?

In the past, setting up an encrypted connection was compute heavy. In fact,
until the late 2000s, you used to need a separate PCI card just for SSL handshakes.

I think this probably contributed to the impression that TLS wastes CPU cycles.
But that's actually not the case anymore, due to innovations in hardware and software.

Modern chips have dedicated cryptographic instructions built in called AES-NI
which are capable of encrypting multiple gigabits of data per second, about as
fast as it would be to access data directly from memory.

In 2018 TLS 1.3 was released, cutting handshake times in half. It requires a
single round-trip to establish a key and users can resume sessions without
having to handshake again.

With these, the impact of TLS encryption on performance is now a fraction of a percent.

---

## The Three Guarantees

The industry was essentially forced to adopt TLS everywhere, but luckily the
performance impact was made negligible by advancements in technology.
However, what we got in return are three key benefits across the entire internet.

**Confidentiality**  
This is what we're all most familiar with. My bytes are encrypted, nobody can
read the messages that I send to my AI waifu.

**Integrity**  
Obviously (maybe?) because of the fact that the bytes are encrypted and
essentially just look like random scrambled binary, it is impossible for
someone to change that message before it arrives on your machine, without
completely breaking or corrupting it.

**Authenticity**  
Possibly the least thought about of these three, when you connect to a site
over TLS, you're virtually guaranteed (unless they're deeply compromised) that
the response that came back is from the site you know and trust, and not some
node in the middle somewhere.

---

## Conclusion

The push for encrypting the entire web wasn't because people were afraid that
someone would spy on them while they scroll through cat pictures, it was a
direct response to a history of companies that broke ethical boundaries and the
trust of consumers by tampering with their data.

This is why we can't have nice things.


