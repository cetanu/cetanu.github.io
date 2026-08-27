+++
title = "Envoy Is More Than a Reverse Proxy"
description = "Envoy is a programmable traffic boundary where platform policy becomes consistent request behaviour, on ingress and egress."
date = 2026-08-18
slug = "envoy_beyond_the_reverse_proxy"
aliases = ["blog/draft-envoy_beyond_the_reverse_proxy"]
template = "article.html"
render = false

[taxonomies]
tags = ["envoy", "networking", "architecture", "infrastructure"]

[extra]
go_to_top = true
+++

Kubernetes can put every service on the same network. It cannot make every
service agree on what a timeout means.

One team writes a Go service. Another writes a Python worker. A third keeps a
legacy Java application alive. They all make HTTP calls, but each one ends up
with a slightly different collection of timeouts, retries, TLS settings,
connection pools, and telemetry.

That is where Envoy becomes more interesting than its usual description.

Envoy is a programmable traffic boundary: a place where platform policy can
become consistent request behaviour.

```text
client       -> Envoy -> application
application  -> Envoy -> dependency
```

At the ingress boundary, Envoy can authenticate, authorize, route, transform,
and observe requests before they reach an application. At the egress boundary,
it can give ordinary application HTTP calls production-grade network
behaviour.

The point is not that Envoy has a long list of features. The point is that the
same kind of policy can be applied at the boundary where traffic already has
to pass.

## The request is already a program

Consider a request arriving at a public API. Before the application runs its
business logic, someone may need to answer several questions:

- Is the caller authenticated?
- Is this identity allowed to access this route?
- Which version of the API should receive the request?
- Is this tenant over its rate limit?
- Should a header be added, removed, or normalised?
- What should be recorded for debugging and operations?

These are not all application questions. Many are properties of the traffic
boundary.

Envoy processes requests through a chain of filters. A filter can inspect a
request, change it, reject it, call an external service, or produce a response
without involving the upstream application.

```text
request -> identity -> authorization -> rate limit -> routing -> application
```

Some of this behaviour comes from built-in filters. Envoy can validate JWTs,
enforce RBAC rules, apply rate limits, manipulate headers, compress responses,
and emit consistent access logs and metrics. External authorization and
processing filters allow a dedicated service to participate in the request
path. Lua, WebAssembly, and native extensions cover cases that need custom
logic.

That gives platform engineers a useful seam. Common protocol-level policy can
be changed in the traffic layer instead of being copied into ten application
codebases.

The seam also needs discipline. A filter runs on the request path, so slow,
fragile, or overly clever logic there affects every request. Envoy is a good
place for identity verification, admission control, routing, normalisation,
protocol translation, and observability. It is a poor place for shopping-cart
rules or a pricing algorithm.

This is bounded computation at the boundary, not an invitation to move the
whole application into the proxy.

## The outbound call is also a policy boundary

The same problem appears on the other side of an application.

The code may look like this:

```text
response = http.get("https://some-dependency.example/data")
```

But a reliable HTTP request is not one operation. It is a bundle of decisions:

- How long may DNS resolution and connection establishment take?
- How long may the complete request take?
- Which connections can be reused?
- Can requests share an HTTP/2 connection?
- Which failures are safe to retry?
- How much backoff should happen between attempts?
- How do we prevent retries from amplifying an outage?
- Should an unhealthy endpoint be removed temporarily?
- Where are TLS credentials and certificates managed?
- Which metrics, logs, and traces describe the call?

Most mature client libraries can answer many of these questions. The problem
is that every application must answer them correctly, in every language, and
keep answering them correctly as the system changes.

In a Kubernetes environment, that inconsistency becomes an operational
problem. A Go service, a Python worker, and a legacy Java application can have
three different timeout policies and three different interpretations of a
retryable failure. One may reuse connections correctly. Another may open a new
connection for every request. A third may retry a non-idempotent operation
until an already overloaded dependency becomes a crater.

Putting Envoy on the egress path gives the platform a place to own the network
mechanism and its defaults:

```text
application -> Envoy -> external API or internal service
```

The application still decides what it wants to call. Envoy handles the
behaviour around that call: connection pools, timeouts, selected retries,
retry budgets, circuit-breaking limits, health checks, outlier detection, TLS,
authentication, and consistent telemetry.

```text
application: what request should I make?
Envoy:       how should that request behave on the network?
```

This is a separation of concerns, not a transfer of responsibility. The
application still needs an overall deadline. It still needs to know whether an
operation is safe to repeat. It still needs to handle failure. Envoy can
centralise the mechanism and the policy defaults; it cannot infer the business
meaning of a timeout.

## Retries expose the boundary

Retries show both the value and the limit of this approach.

If a `GET` fails before receiving a response, trying another healthy endpoint
may be sensible. If a request to charge a credit card times out, no response
does not prove that the charge failed. Repeating it may charge the customer
twice.

HTTP alone cannot resolve that ambiguity. The application must use idempotent
operations or idempotency keys, and the platform must define narrow retry
conditions. Every retry must fit inside one overall deadline and a bounded
retry budget.

Otherwise the policy intended to survive an outage amplifies it.

This is why Envoy should be understood as a policy boundary, not a reliability
machine. Health checks, circuit breakers, and retries improve how a system
responds to failure. They do not remove failure, and a bad policy consistently
deployed is still a bad policy.

## What Kubernetes gives you—and what it does not

Kubernetes provides powerful primitives for scheduling workloads, discovering
services, and controlling rollout. Those primitives do not automatically
standardise the network behaviour implemented inside each workload.

Envoy complements Kubernetes by giving platform teams a programmable data
plane. It can run at an ingress gateway, beside a workload, as an egress
gateway, or as part of a service mesh. The deployment shape can change without
changing the basic idea: traffic crosses a boundary, and policy is applied
there.

That also means Envoy does not require adopting an entire service-mesh product.
A small deployment may use static configuration in front of a few services. A
larger platform may use dynamic configuration, sidecars, gateways, and a
control plane to manage changing endpoints and policies.

A service mesh is one system built around Envoy's data plane. Envoy remains
useful when the mesh is not the problem you are trying to solve.

## When Envoy earns its place

Envoy is not automatically the right answer for every application. A single
service in one language, with a small number of stable dependencies and a
well-behaved HTTP client, may not benefit from another process in its failure
path.

Envoy becomes more compelling when networking concerns repeat across teams or
runtimes:

- security policy must be applied consistently;
- services use several languages or client libraries;
- upstream endpoints change dynamically;
- operators need one view of inbound or outbound traffic;
- mTLS and certificate rotation should not live in application code;
- timeout, retry, and overload policy needs platform ownership;
- request processing must change without rebuilding every application.

There is a real cost. Envoy consumes memory and CPU, configuration can become
complicated, and every proxy becomes part of the traffic path. A sidecar per
workload increases the number of processes a team must operate.

The case for Envoy is therefore not that every application deserves a sidecar.
It is that network behaviour is shared infrastructure, even when we have
accidentally implemented it as application code.

## Envoy is where policy becomes behaviour

Calling Envoy a reverse proxy focuses on the simplest thing it does: moving a
request from one socket to another.

Its more valuable role is to make the traffic around an application coherent.

On ingress, Envoy provides a programmable filter chain where common,
protocol-level computation can happen before the request reaches the service.
On egress, it wraps ordinary HTTP calls in connection management, deadlines,
bounded retries, health checking, circuit breaking, identity, encryption, and
consistent observability.

Kubernetes gives workloads a common operating environment. Envoy gives the
traffic around those workloads a place for shared policy.

That is the less obvious reason to use it: not because it forwards traffic,
but because it turns platform decisions into repeatable request behaviour.
