#let accent = rgb("#1f3a5f")
#let muted = rgb("#6b7280")

#set document(title: "Vasilios Syrakis — CV", author: "Vasilios Syrakis")
#set page(paper: "a4", margin: (x: 1.6cm, y: 1.4cm))
#set text(font: ("ERSC Sans", "Inter", "Helvetica Neue", "Helvetica", "Arial", "DejaVu Sans"), size: 9.5pt)
#set par(justify: false, leading: 0.55em)
#set list(marker: [▪], indent: 0.3em, body-indent: 0.5em, spacing: 0.55em)

#show link: set text(fill: accent)

#let section(title) = {
  v(0.6em)
  text(weight: "bold", size: 10pt, fill: accent, tracking: 0.05em)[#upper(title)]
  v(-0.5em)
  line(length: 100%, stroke: 0.6pt + accent)
  v(-0.2em)
}

#let job(company, role, dates) = {
  v(0.3em)
  grid(
    columns: (1fr, auto),
    [*#company* | #role], text(style: "italic")[#dates],
  )
}

#let competency(label, body) = [
  #text(weight: "bold", fill: accent)[#label] \
  #body
]

// ── Header ──────────────────────────────────────────────────────────────
#align(left)[
  #text(size: 18pt, weight: "bold", fill: accent)[VASILIOS SYRAKIS]
  #v(-0.5em)
  #show link: set text(fill: muted)
  #text(fill: muted)[
    Sydney, Australia ·
    #link("mailto:syrakis@pm.me")[syrakis\@pm.me] ·
    #link("tel:+61403898004")[+61 403 898 004] ·
    #link("https://linkedin.com/in/vsyrakis")[linkedin.com/in/vsyrakis] ·
    #link("https://github.com/cetanu")[github.com/cetanu]
  ]
]

#v(0.4em)

Systems engineer specializing in high-throughput traffic control, distributed
platforms, and resilient control planes. I eliminate architectural bottlenecks
where performance, fault tolerance, and developer velocity intersect.

// ── Technical expertise ─────────────────────────────────────────────────
#section("Technical Expertise & Core Competencies")

#grid(
  columns: (1fr, 1fr),
  column-gutter: 1.2em,
  row-gutter: 0.8em,
  competency("Software")[
    Backend systems, network services, distributed systems, internal developer
    platforms, automation, performance optimisation, agentic engineering
  ],
  competency("Operations")[
    High-severity incident response, complex troubleshooting, security
  ],
  competency("Infrastructure")[
    AWS, Infrastructure as Code, Kubernetes, edge compute
  ],
  competency("Languages")[
    Rust, Python, Lua, Bash
  ],
  competency("Leadership")[
    Training, mentoring, architecture & design, RFCs, diagramming, documentation
  ],
  competency("Networking")[
    TCP/IP, DNS, HTTP/HTTPS traffic management, traffic shaping, rate limiting,
    DDoS mitigation
  ],
)

// ── Experience ──────────────────────────────────────────────────────────
#section("Professional Experience")

#job("Atlassian", "Senior Systems Engineer", "Jan 2018 – Mar 2026")

Built Atlassian's global load-balancing edge from the ground up — infrastructure
as code, image pipelines, and supporting services — migrated all internal traffic
onto it, then extended it with authentication, rate-limiting, and policy
enforcement, while mentoring and training the team.

#v(0.2em)

- Architected a global, self-service reverse-proxy platform spanning 13 regions
  on Envoy and AWS, replacing unprotected ALBs and standardising observability
  across all microservices, routing 50+ billion requests per day.
- Built a DynamoDB-backed FastAPI service broker with SQS workers, enabling
  automated, asynchronous resource provisioning.
- Open-sourced a stateless JSON-REST xDS control plane (Python/FastAPI) with
  customisable templating, adopted by multiple engineering teams.
- Defined the team's configuration-management and image-building strategy,
  establishing HashiCorp Packer and masterless SaltStack as the foundation.
- Built a Rust/gRPC sidecar enforcing dynamic authentication and authorization
  policies across 15+ billion daily requests, with minimal latency and CPU
  overhead.
- Rewrote all Rust, Lua, and WASM codebases into Golang within a 6-week window
  as part of the company's FedRAMP compliance push, for deployment inside the
  federal boundary.
- Re-engineered legacy codebases, cutting response times from seconds to
  milliseconds and reducing DynamoDB read units, CPU, and network usage by 10x
  or more.
- Designed a bespoke, event-driven service-discovery mechanism that let proxy
  infrastructure bypass AWS ALBs, cutting network costs by \$1M+ per year.
- Mentored an intern through delivery of a full-stack network-diagnostics
  application, earning them a "Greatly Exceeded" rating.
- Led and supported multiple high-severity operational incidents —
  troubleshooting, mitigation, root-cause analysis, and post-incident review.

#job("Tyro Payments", "Systems Engineer", "Dec 2015 – Jan 2018")

- Delivered operations, DevOps, and configuration management; automated
  end-to-end VMware VM provisioning.

#job("Offis Pty Ltd", "Systems Administrator", "Feb 2012 – Dec 2015")

- Provided systems administration for an MSP operating a private data centre
  with colocated racks.
