+++
title = "Home"
+++

{% crt() %}
<pre id="crt-terminal"
    style="height: 7.5rem; line-height: 1.1rem; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-start;"
>
</pre>
<script>
(function() {
    const terminal = document.getElementById('crt-terminal');
    if (!terminal) return;

    let buffer = Array(5).fill("");

    const getTimestamp = () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const ms = String(now.getMilliseconds()).padStart(3, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${ms}`;
    };

    const bootSequence = [
        { cat: "main", file: "server.cc:352", msg: "envoy version: v1.31.0/d3bb2586b/CLEAN/RELEASE", delay: 50 },
        { cat: "main", file: "server.cc:421", msg: "initializing epoch 0 (trusted_ca: true)", delay: 80 },
        { cat: "config", file: "configuration_impl.cc:127", msg: "loading bootstrap config", delay: 120 },
        { cat: "upstream", file: "grpc_mux_impl.cc:120", msg: "establishing xDS gRPC channel to control-plane.internal:18000", delay: 250 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:101", msg: "gRPC config subscription active: envoy.config.listener.v3.Listener", delay: 180 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "LDS: update received (version 1a8c9b), 2 active listeners", delay: 150 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:101", msg: "gRPC config subscription active: envoy.config.cluster.v3.Cluster", delay: 120 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "CDS: update received (version 1a8c9b), 4 active clusters", delay: 140 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:101", msg: "gRPC config subscription active: envoy.config.route.v3.RouteConfiguration", delay: 100 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "RDS: update received (version 9d2f1c), routes updated", delay: 110 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:101", msg: "gRPC config subscription active: envoy.config.endpoint.v3.ClusterLoadAssignment", delay: 130 },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "EDS: update received (version 4f2c0a), 18 endpoints healthy", delay: 120 },
        { cat: "main", file: "server.cc:662", msg: "all control plane configs applied. starting main control loop", delay: 200 },
        { cat: "main", file: "server.cc:680", msg: "protocol engine started, ready for traffic", delay: 100 }
    ];

    const router = {
        "GET": [
            "/", "/metrics", "/healthz",
            "/static/css/main.css", "/favicon.ico", "/api/v1/portfolio/summary"
        ],
        "POST": [
            "/api/v1/auth/login", "/api/v1/portfolio/rebalance", 
            "/v1/wasm/deploy/component", "/api/v1/sigil/generate"
        ],
        "PUT": [
            "/api/v1/user/settings", "/v1/wasm/registry/update"
        ],
        "DELETE": [
            "/api/v1/portfolio/asset/BTC", "/v1/wasm/instance/terminate"
        ]
    };
    const statuses = [200, 200, 200, 200, 201, 304, 404, 500, 403];
    const methods = Object.keys(router);

    const xdsUpdates = [
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "EDS: update received (version {ver}), 18 endpoints healthy" },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "CDS: update received (version {ver}), 4 active clusters" },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "RDS: update received (version {ver}), routes updated" },
        { cat: "upstream", file: "grpc_subscription_impl.cc:118", msg: "LDS: update received (version {ver}), 2 active listeners" }
    ];

    const updateTerminal = (line) => {
        buffer.shift();
        buffer.push(line);
        terminal.innerText = buffer.join('\n');
    };

    const makeBootLog = (entry) => {
        const ts = getTimestamp();
        return `[${ts}][1][info][${entry.cat}] [${entry.file}] ${entry.msg}`;
    };

    const generateLog = () => {
        const now = new Date();
        const ts = now.toISOString();
        const method = methods[Math.floor(Math.random() * methods.length)];
        const routeList = router[method];
        const path = routeList[Math.floor(Math.random() * routeList.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const bytesRx = (method === "POST" || method === "PUT") ? Math.floor(Math.random() * 800) + 45 : 0;
        const bytesTx = status === 304 ? 0 : Math.floor(Math.random() * 8000) + 124;
        const latency = (Math.random() * 45 + 2).toFixed(1);
        return `[${ts}] "${method} ${path} HTTP/1.1" ${status} - ${bytesRx} ${bytesTx} ${latency}ms`;
    };

    const generateXdsUpdate = () => {
        const update = xdsUpdates[Math.floor(Math.random() * xdsUpdates.length)];
        const ver = Math.random().toString(16).substring(2, 8);
        const msg = update.msg.replace("{ver}", ver);
        const now = new Date();
        const ts = now.toISOString();
        return `[${ts}][1][info][${update.cat}] [${update.file}] ${msg}`;
    };

    // Initialize
    terminal.innerText = buffer.join('\n');

    let bootIndex = 0;
    const runBootstep = () => {
        if (bootIndex < bootSequence.length) {
            const step = bootSequence[bootIndex];
            updateTerminal(makeBootLog(step));
            bootIndex++;
            const nextDelay = bootIndex < bootSequence.length ? bootSequence[bootIndex].delay : 3000;
            setTimeout(runBootstep, nextDelay);
        } else {
            loop();
        }
    };

    const loop = () => {
        const isXds = Math.random() < 0.20;
        const logLine = isXds ? generateXdsUpdate() : generateLog();
        updateTerminal(logLine);
        const isBurst = Math.random() > 0.05;
        const delay = isBurst ? Math.random() * 200 : Math.random() * 4000 + 1500;
        setTimeout(loop, delay);
    };

    setTimeout(runBootstep, 400);
})();
</script>
{% end %}

# Vasilios Syrakis

I'm a site reliability, systems, and platform engineer based in Sydney,
Australia.

You might know me from a [YouTube
video](https://www.youtube.com/watch?v=55pTFVoclvE) about being laid off after
eight years at Atlassian. In it, I talked through some of the systems I helped
build there.

{{ image(url="/img/versailles.png", alt="me", no_hover=true) }}

## What you'll find here

I publish technical articles and short essays here, and usually record a video
to go with them. You can follow new posts through the [RSS feed](/atom.xml).

You can see what content I plan to produce in [this kanban board](/schedule).

## My career history

My path hasn't been exactly linear. I never finished high school, let alone
university. If you're interested in how I ended up where I am, here's the
story.

At 16, two weeks of work experience led to my first job, doing graphic design.
I did that for two years before deciding it wasn't for me, then took an IT
helpdesk traineeship at ANSTO. After a year, they offered to promote me from
trainee to a regular employee, doubling my pay, but I turned it down to go look
for work on my own.

In hindsight, turning down the offer from ANSTO was a mistake. I worked in some
roles I didn't enjoy before ending up at Fujitsu doing helpdesk again. About
half a year later, I joined a managed service provider as an associate sysadmin,
managing Windows fleets on VMware and the company's own hardware.

That MSP job was where I taught myself how to code properly. I started with
PowerShell since I was working with Windows Server. I later moved on to Python,
taking a free Codecademy course, and then trying to rewrite some of my
PowerShell scripts. I bought a copy of [Flask Web
Development](/flask-web-development) and started building internal tools to
make my job easier. For example, I wrote a little app to manage a multi-tenant
BIND DNS server. I also picked up NGINX and MySQL (setting up a marketing site
for Optus at one point), and eventually went deep into Puppet, Chef, and
SaltStack. Around this time, AWS was starting to look like an existential
threat to the company (Cloud was new, our service was managing racks in the
datacenter).

From there, I moved to Tyro Payments as a member of the operations team. I
showed a particular interest in scripting and automation, so they moved me to
a new DevOps team. I spent my time there using salt-cloud (which had great
VMware support at the time) to fully automate machine provisioning, booting VMs
and then applying Puppet manifests based on their role.

In 2018, I was poached by Atlassian to join their network edge team. Over the
next eight years, I used that Flask and SaltStack background, picked up Envoy
and AWS, and helped build the next iteration of Atlassian's Global Edge,
eventually migrating all company traffic behind it. It handled over 50 billion
requests a day. Along the way I learned Rust, eventually deploying a couple of
Rust gRPC services to production at that same scale.

In March 2026, I was laid off by Atlassian and started working at Uptick, a SaaS
company in the fire-safety industry.

## Work with me

I'm open to occasional advisory and contract work. If you're dealing with a
problem around Envoy, network edge, internal platforms, Python, or Rust, email
me at **[syrakis@pm.me](mailto:syrakis@pm.me)** with some context. If I'm not
the right person, I'll tell you.

For sensitive matters that require encryption, [I have PGP tools which use my
public key](/pgp). You can also request that I sign messages to verify they
came from me and not an imposter.
