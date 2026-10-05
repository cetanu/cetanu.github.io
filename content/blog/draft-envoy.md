+++
title = "Envoy Draft Notes"
render = false
+++

creating some slides to educate my colleagues on envoy and kgateway.

Here's the story.

I recently migrated an ingress controller in kubernetes from nginx, which was
deprecated, to envoy.

just doing a straight swap, you won't really notice much because they're both
still acting as http reverse proxies.

but there are some quite fundamental differences when you zoom in. For
starters, instead of the ingress controller acting as both a controller and a
proxy in the one pod, it is now separated into a controller which watches the
relevant resources inside kubernetes, and performs a translation into envoy
objects before pushing them out to all the proxies it manages.

what this means is that the proxies receive configuration updates where they
only need to reload a tiny part of the config, not the entire thing. If one new
pod comes up, envoy doesn't need to pause the main thread to reload the world,
it just adds that new pod.

The way envoy does this is by having a modular configuration structure, where
each resource can be dynamically updated independently of the others.

The core resources that envoy has are listeners and clusters.

A listener is where requests are accepted. A listener binds to an address,
and contains a set of filters that run in order, which process the request.

A cluster is where requests are forwarded. A cluster contains a collection of
hosts or endpoints, which are discovered, health-checked, and load-balanced.

At this point there isn't much of a difference to NGINX.

Where envoy starts to differ is in its extensibility, especially in the fact
that extensions can themselves be dynamically updated at any time without
affecting traffic.

I mentioned earlier that the listener contains a set of network filters and
these filters run in order on the way in, and then in reverse order on the way
out. A prime example of a network filter would be the HTTP Connection Manager,
or HCM.

An envoy listener by default has no idea what HTTP is, that's the HCMs job;
it's where all the HTTP codecs live.

Within the HCM, you have HTTP filters, distinct from network filters. These
filters are designed to work with the HTTP protocol and usually expect to be
able to handle headers, the body, and trailers both of the request and
response.

The most basic and fundamental HTTP filter is the Router filter. It has almost
no configuration, and it tells Envoy that it should match the request against a
virtual-host within the route configuration attached to the HCM.

You can think of routing as the decision step in envoy.

* Listener = accept
* Route = decide
* Cluster = forward

A HCM requires a route configuration, otherwise it wouldn't know how to forward
or respond to HTTP requests. Your route config could be a single virtual-host
which matches * for the host header, and sends everything from the prefix / to
a single cluster. Or it could be hundreds of virtual-hosts, each with dozens of
routes, half of which send traffic to one cluster, and half that send to
another.

Each virtual host can match against any domain, typically extracted from the
host or authority header. Inside a virtual host you have a collection of
routes. Each individual route is evaluated against the request, and if all the
criteria match, the defined action within that route is used to forward,
redirect, or directly respond to the request.
