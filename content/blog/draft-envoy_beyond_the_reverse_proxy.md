+++
title = "Envoy Is More Than a Reverse Proxy"
description = "The less obvious reasons to use Envoy: programmable compute at the edge and a production-grade HTTP client hiding beside your application."
date = 2026-08-18
template = "article.html"
render = false

[taxonomies]
tags = ["envoy", "networking", "architecture", "infrastructure"]

[extra]
go_to_top = true
+++

Ask someone what Envoy does and they will probably tell you that it is a
reverse proxy or a load balancer.

That answer is correct in the same way that calling a smartphone a telephone
is correct. It describes the original shape of the thing, but misses most of
the reasons you might choose one today.

Envoy can accept a request and forward it to one of several servers. So can
NGINX, HAProxy, a cloud load balancer, and about a thousand other pieces of
software. If that was all Envoy did, choosing it would mostly be a matter of
which configuration language you dislike the least.

The more interesting way to think about Envoy is as a **programmable boundary
around your application**.

At the ingress boundary it can execute common request-processing logic close
to users, before traffic reaches your application. At the egress boundary it
can turn an ordinary HTTP call into a carefully managed production dependency.

Those two uses are much less visible than load balancing, but in many systems
they are the real reason to run Envoy.

## Compute at the Edge

People associate the term "edge compute" with things like AWS Lambda, or
Cloudflare workers, and so on. Envoy delivers the same functionality but as a
smaller unit within infrastructure.

Every request passing through Envoy steps through a chain of filters.
A filter can do all sorts of things - inspect the request, change it, reject
it, call another service, or produce a response without involving the upstream
application at all.

Some of those filters are built in. Envoy can verify JWTs, enforce RBAC rules,
apply rate limits, manipulate headers, compress responses, and emit consistent
access logs and metrics. The external authorization filter can ask a dedicated
service whether a request should be allowed. The external processing filter
can send headers or bodies to a gRPC service which inspects or transforms them.

When the built-in filters are not enough, you can extend the request path with
Lua, WebAssembly, or a native extension.

This makes the proxy a place where small pieces of computation can run at the
network boundary:

```text
client -> authentication -> rate limit -> transform -> application
```

Imagine that ten services expose public APIs. Each one needs to verify the
same token, reject requests from suspended accounts, attach a tenant ID, add
security headers, and translate an old API path to a new one.

You could implement all of that in ten codebases. You could also put the
mechanical, protocol-level parts in Envoy's filter chain and leave each
application to deal with its own business logic.

That distinction matters. Envoy should not become the mysterious place where
your pricing model and shopping-cart rules live. Filters sit on the request
path, so expensive or unreliable work there adds latency or breaks every
request. They are best suited to bounded work that belongs to the boundary:
identity verification, admission control, protocol translation, routing,
normalisation, and observability.

This is compute at the edge without pretending that the edge should contain
your entire application.

## Your HTTP Client Is Infrastructure

The other underappreciated use of Envoy is on the opposite side of the
application.

Applications spend a lot of time making outbound HTTP calls. A payment service
calls a bank, an API calls an identity provider, and nearly everything calls an
object store or another internal service.

The code often looks harmless:

```text
response = http.get("https://some-dependency.example/data")
```

But a reliable HTTP request is not a single operation. It is a collection of
policies and state:

- How long should DNS resolution and connection establishment take?
- How many connections should be kept open, and for how long?
- Can requests share an HTTP/2 connection?
- What is the timeout for the entire request?
- Which failures are safe to retry?
- How much backoff should happen between attempts?
- How do we stop retries from multiplying an outage?
- Should an unhealthy endpoint temporarily be removed?
- Where are TLS certificates and authentication credentials managed?
- Which metrics, traces, and logs describe the call?

Most mature HTTP client libraries can answer many of these questions. The
problem is that every application must answer them correctly, in every
language, and keep answering them correctly as the system changes.

A Go service, a Python worker, and a legacy Java application can easily end up
with three different timeout policies and three different interpretations of
a retryable failure. One may reuse connections correctly, another may silently
open a new connection for every request, and the third may retry `POST`
requests until an overloaded dependency becomes a crater.

## Put Envoy on the Other Side

Instead of sending outbound traffic directly to its destination, the
application can send it through a local or shared Envoy egress proxy:

```text
application -> Envoy -> external API or internal service
```

The application still makes an ordinary HTTP call. Envoy takes responsibility
for the network behaviour around it.

Envoy maintains connection pools for upstream hosts and understands the
different models of HTTP/1.1, HTTP/2, and HTTP/3. It can enforce connection and
request timeouts, retry selected failures with backoff, cap retries with a
retry budget, and apply circuit-breaking limits. Active health checks can
probe known endpoints, while passive health checking, called outlier
detection, can temporarily eject an endpoint that is failing real traffic.

It can also originate TLS, present client certificates for mTLS, verify server
certificates, attach or validate identity, and apply authorization policy. The
same layer produces uniform metrics and access logs regardless of which
language initiated the request.

The result is a surprisingly useful separation of concerns:

```text
application:  what request should I make?
Envoy:         how should that request behave on the network?
```

This does not mean the application is absolved of responsibility. It still
needs a deadline, and that deadline needs to include any time Envoy spends on
retries. It still needs to know whether an operation is safe to repeat. It
still needs to handle failure instead of assuming that a proxy can turn an
unreliable dependency into a reliable one.

Envoy centralises the mechanism and the default policy. The application keeps
the business meaning.

## Retries Are Not Magic

Retries are a good example of why this split needs care.

If a `GET` request fails before receiving a response, trying another healthy
endpoint may be sensible. If a request to charge a credit card times out, the
absence of a response does not prove that the charge failed. Blindly repeating
it may charge the customer twice.

Envoy cannot infer that distinction from HTTP alone. The application must use
idempotent operations or idempotency keys, and the platform must define narrow
retry conditions. Every retry should fit inside one overall timeout and a
bounded retry budget, otherwise the mechanism intended to survive an outage
will amplify it.

The same warning applies to health checks and circuit breakers. They improve
how a system responds to failure; they do not remove failure. A bad policy,
consistently deployed everywhere, is still a bad policy.

## Why Not Just Use a Library?

Sometimes a library is exactly the right choice.

If you have one application written in one language, its HTTP client already
does connection pooling properly, and the team owns a small number of stable
dependencies, adding another process may create more operational work than it
removes.

Envoy becomes more compelling when the same networking concerns repeat across
many services or runtimes. It is particularly useful when:

- services are written in several languages;
- security policy must be applied consistently;
- upstream endpoints change dynamically;
- operators need one set of metrics for outbound traffic;
- mTLS and certificate rotation should not live in application code;
- retry, timeout, and circuit-breaking policy needs central ownership;
- request processing must be changed without rebuilding every application.

There is a cost. Envoy consumes memory and CPU, configuration can become
complicated, and the proxy itself becomes part of the failure path. A sidecar
per workload also increases the number of processes you need to operate.

The case for Envoy is not that every application deserves a sidecar. It is
that networking behaviour is often shared infrastructure, even when we have
accidentally implemented it as application code.

## This Is Bigger Than a Service Mesh

Many people first encounter Envoy hidden underneath a service mesh. That can
make its useful features look inseparable from Kubernetes, sidecar injection,
and a large control plane.

They are not.

You can run Envoy at the edge in front of many services, beside a single
application, as a shared egress gateway, or as part of a larger mesh. Static
configuration is enough for small deployments; dynamic configuration becomes
valuable when endpoints and policies change frequently.

A service mesh is one product assembled around a programmable data plane.
Envoy is the data plane. You can use the part that solves your problem without
adopting the entire product category.

## Conclusion

Calling Envoy a reverse proxy focuses on the least interesting thing it does:
moving a request from one socket to another.

Its real value is in everything it can do while that request crosses a
boundary.

On ingress, Envoy gives you a programmable filter chain where common,
protocol-level computation can happen close to the edge. On egress, it can
wrap ordinary application HTTP calls in connection pooling, timeouts, bounded
retries, health checking, circuit breaking, authentication, encryption, and
consistent observability.

You should not use Envoy merely because you need to forward some traffic. Use
it when you want the network around your application to behave like a coherent
platform instead of a pile of unrelated client libraries and middleware.

That is a much more interesting job than load balancing.
