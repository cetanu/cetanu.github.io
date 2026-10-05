+++
title = "Envoy Talk Draft"
render = false
+++

# Intro
addressing the audience, who they are, how much they know about
envoy, who this talk is for?

# My goal

Help you build a mental model of envoy

By the end you'll be able to answer: "when a request hits the proxy,
what envoy-native objects determine how it's processed?"

# Anti-goals

* going deep into internals or extensibility

# What is Envoy
Envoy is more than a load-balancer or api gateway. I like to think of it as
a programmable request processor. Envoy can be placed all throughout your
infrastructure - it can act as an ingress, an egress, or as part of a
service mesh.

Envoy has a modular configuration structure that allows separate pieces to
be reloaded dynamically, including the insertion of lua scripts, WASM code,
switching on and off entire extensions.

When Envoy boots up, it needs only a few core resources, but it can be
extended in whatever direction you need.

# The top 3 primitives
## Listeners
Envoy needs to accept traffic somehow, and that's what listeners are
respomsible for. You can think of a listener roughly as a layer 4 construct.
It binds to a port, it handles buffers and sockets, it performs TLS
handshakes. Clients connecting to a listener are referred to as downstream.

## Clusters


## Routes
