+++
title = "Envoy Talk Draft"
render = false
+++

# Goal

- Help Kubernetes practitioners build a mental model of Envoy that lets them troubleshoot behavior through the Envoy config their controller creates.
- Audience knows Envoy may be running in their environment, but does not need prior Envoy knowledge.
- Keep this opening segment focused on Envoy; the next segment connects it to Kubernetes resources and controllers.

# Opening

- Ask for a show of hands: who is running Envoy somewhere?
- Ask: who knows how Envoy works generally?
- Set up the question: when Envoy is running, do we know what it is actually doing?

# The Envoy mental model

- Show the detailed, nested architecture diagram (the “matryoshka doll”).
- Keep the spoken explanation to the core path for one HTTP request:
  - **Listener** — accepts the downstream connection and selects a filter chain.
  - **HCM** — handles HTTP and contains the HTTP filter chain; use it to place HTTP extensions in the model.
  - **Routes** — evaluate match criteria in order; a match has an action, such as sending to a cluster.
  - **Cluster** — represents the upstream destination and its hosts/endpoints.
- Use the diagram to make Envoy’s modularity visible; avoid a detour into filter catalogs or internals.

# Troubleshooting: follow the evidence

Opening prompt: “What better way to understand something than to figure out why it’s broken?”

## 1. Unexpected 404s — `NR`

- Symptom: the site returns 404s, though the application should not be doing so.
- Signal: Envoy access logs show `NR` (NoRouteFound).
- Follow the generated route configuration and investigate the request’s match criteria.
- Scope this example to a request that reached HTTP routing and failed to match a route.

## 2. Brief “no healthy upstream” during deployment — `UH`

- Symptom: a short period of plaintext “no healthy upstream” responses during a deploy.
- Signal: Envoy access logs show `UH` (NoHealthyUpstream).
- Working cause: the selected cluster temporarily has no healthy upstream hosts/endpoints.
- Trace the route action to its cluster, then inspect the cluster’s endpoint state.

## 3. Midnight WebSocket reconnects — `DC`

- Symptom: a burst of downstream connection terminations and WebSocket reconnects around midnight.
- Signal: Envoy access logs show `DC` (DownstreamConnectionTermination).
- Investigate the downstream/client side; correlate with the vendor’s packet-loss evidence to establish the cause.
- Treat `DC` as a clue about where the connection ended, not proof of why.

# How configuration reaches Envoy

- A controller translates Kubernetes API resources into Envoy configuration resources.
- xDS resources are typed Protocol Buffer messages; a common delivery path is a bidirectional gRPC stream.
- The control plane pushes configuration updates; Envoy can apply them live while serving traffic.
- Keep this at the architecture level: no xDS variants, ACK/NACK details, or update-ordering deep dive.
- Emphasize efficient, modular, typed configuration and the push model without implying every resource can be updated independently of its dependencies.

# Modern debugging aid: LLMs

- Give an LLM the CRD and the controller’s source code.
- Ask it to trace how the controller turns that resource into Envoy objects/configuration.
- Use the generated Envoy config as the concrete thing to inspect against the mental model.
- Keep this as advice, not a live demo.

# Recap and handoff

- Recap the request path: listener → HCM → routes → cluster.
- Connect the model to the troubleshooting signals and generated config.
- Springboard to the Kubernetes segment: how Gateway API resources and controllers map onto these Envoy objects.

# Leave for later

- Detailed xDS protocol mechanics and update sequencing.
- Deep internals, TLS details, or extension implementation/catalogs.
- Detailed Kubernetes resource semantics or controller behavior.
