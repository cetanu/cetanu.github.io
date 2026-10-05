+++
title = "Envoy Talk Schedule"
render = false
+++

Envoy has become one of the most important building blocks in the
cloud-native ecosystem. It powers service meshes, API gateways,
ingress controllers and countless bespoke networking platforms
through the combination of it’s rich feature set paired with
runtime reconfiguration through xDS. Yet for many engineers, Envoy
remains a black box hidden behind projects like Istio or Envoy
Gateway.

This session is designed for Kubernetes practitioners who want to
understand Envoy itself. We'll start by building a mental model of
Envoy's architecture, explaining the core configuration
resources—listeners, filter chains, routes and clusters—and how
requests flow through them. From there we'll explore practical
features including HTTP connection management, TLS, extension
points and the xDS APIs that enable dynamic configuration.

Armed with those fundamentals, we'll examine how Kubernetes
projects such as Istio and Envoy Gateway assemble these primitives
into higher-level platforms, before showing how you can build your
own Envoy-powered solutions using native Kubernetes concepts.

We'll finish with two production case studies that demonstrate how
these patterns can be applied to solve real networking problems at
scale.
