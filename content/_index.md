+++
title = "Home"
aliases = ["faq"]
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

Welcome to my personal site. I am a Senior Systems / Platforms Engineer / SRE
based in Sydney, Australia.

You might know me from my [viral video](https://www.youtube.com/watch?v=55pTFVoclvE) 
on YouTube where I talked about getting laid off by Atlassian after 8 years,
and delved into some of the systems that I built whilst there.

{{ image(url="/img/versailles.png", alt="me", no_hover=true) }}

## Frequently Asked Questions

### What keyboard is that?
I use a [Nuphy](https://nuphy.com?sca_ref=11306305.p2hPK9CKOM&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate) keyboard.

Most of the times I stream, I'm probably using a low-profile [Kick75](https://nuphy.com/products/nuphy-kick75?sca_ref=11306305.p2hPK9CKOM&sca_source=blogindex&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)
with brown switches.

[{{ image(url="/img/nuphy-kick75.webp", alt="kick75", no_hover=true) }}](https://nuphy.com/products/nuphy-kick75?sca_ref=11306305.p2hPK9CKOM&sca_source=blogindex&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

I also own an [Air75 V3](https://nuphy.com/products/nuphy-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=blogindex&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)
which I use as a portable keyboard, wrapped in a [NuFolio](https://nuphy.com/products/extra-nufolio-v4-for-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=blogindex&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

[{{ image(url="/img/nuphy-airv3.webp", alt="air75 v3", no_hover=true) }}](https://nuphy.com/products/nuphy-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=blogindex&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

### What mouse do you use?
My mouse is a [Steelseries Rival 3 Gen 2](https://steelseries.com/en-au/gaming-mice/rival-3-gen-2)

[{{ image(url="/img/steelseries-rival.webp", alt="rival", no_hover=true) }}](https://steelseries.com/en-au/gaming-mice/rival-3-gen-2)

### What are your PC specs?
#### Machine
|               |                              |
| :------------ | :--------------------------- |
| __Mainboard__ | Gigabyte X870 AORUS ELITE    |
| __Processor__ | AMD Ryzen 7 9800X3D          |
| __Graphics__  | Sapphire Radeon RX 9070 XT   |
| __Memory__    | Klevv 32GB DDR5 6000Mhz CL30 |
| __Case__      | NZXT H6 Flow                 |
| __Cooler__    | Cooler Master MasterLiquid   |

#### Peripherals
|                |                              |
| :------------- | :--------------------------- |
| __Display__    | Samsung Odyssey G7 37"       |
| __Microphone__ | Shure MV7+                   |
| __Camera__     | Elgato Facecam 4K            |

{{ image(url="/img/desktop-pc.png", alt="my pc", no_hover=true) }}

### What Operating System / Linux Distribution do you use?
[Pop! OS](https://system76.com/pop) 24.04 with COSMIC desktop

{{ youtube(id="IyXzjnd6q3g") }}

### What terminal do you use?

[Ghostty](https://ghostty.org/)

### What editor do you use?

Neovim

### What plugins do you use? Where are your dotfiles?

[My dotfiles are here](https://github.com/cetanu/dotfiles)

What I would consider my essential plugins are:

* [telescope](https://github.com/nvim-telescope/telescope.nvim)
* [neogit](https://github.com/TimUntersberger/neogit)
* [gitsigns](https://github.com/lewis6991/gitsigns.nvim)
* [blink.cmp](https://github.com/saghen/blink.cmp)
* [key-menu](https://github.com/cetanu/key-menu.nvim)

### What Neovim theme are you using?
[sainnhe/edge](https://github.com/sainnhe/edge)

[{{ image(url="/img/neovim-theme.png", alt="neovim", no_hover=true) }}](https://github.com/sainnhe/edge)

### Do you play games? What are your favorites?
Yes, I play games, 100% on Linux

<style>
.game-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.25rem;
  margin-block: 1.5rem;
}

.game-card {
  background-color: var(--fg-muted-1);
  border-radius: var(--rounded-corner);
  overflow: hidden;
  box-shadow: var(--edge-highlight), var(--shadow);
  transition: transform var(--transition-longer), box-shadow var(--transition-longer), border-color var(--transition-longer);
  border: 1px solid var(--fg-muted-2);
  display: flex;
  flex-direction: column;
  text-decoration: none !important;
  color: inherit !important;
}

.game-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 0 0 1px var(--accent-color), var(--shadow-raised);
  border-color: var(--accent-color);
}

.game-card-image-wrapper {
  overflow: hidden;
  width: 100%;
  height: 110px;
  position: relative;
}

.game-card-image-wrapper img {
  margin: 0 !important;
  box-shadow: none !important;
  border-radius: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: cover !important;
  transition: transform var(--transition-longer) !important;
}

.game-card:hover .game-card-image-wrapper img {
  transform: scale(1.08);
}

.game-card-content {
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
}

.game-card-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin: 0;
  line-height: 1.25;
  color: var(--fg-color);
}

.game-card-subtitle {
  font-size: 0.75rem;
  color: var(--fg-muted-4);
  margin-top: 0.25rem;
  margin-bottom: 0;
}
</style>

#### Currently playing

<div class="game-grid">
  <a href="https://store.steampowered.com/app/548430/Deep_Rock_Galactic/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/deep-rock-galactic.jpg" alt="Deep Rock Galactic">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Deep Rock Galactic</div>
      <div class="game-card-subtitle">+ Survivors, + Rogue Core</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/238960/Path_of_Exile/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/path-of-exile.jpg" alt="Path of Exile">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Path of Exile</div>
      <div class="game-card-subtitle">1 & 2</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/881100/Noita/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/noita.jpg" alt="Noita">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Noita</div>
      <div class="game-card-subtitle">Magical action roguelite</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/393380/Squad/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/squad.jpg" alt="Squad">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Squad</div>
      <div class="game-card-subtitle">Tactical FPS</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/427520/Factorio/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/factorio.jpg" alt="Factorio">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Factorio</div>
      <div class="game-card-subtitle">The factory must grow</div>
    </div>
  </a>
</div>

#### Old favorites

<div class="game-grid">
  <a href="https://store.steampowered.com/app/570/Dota_2/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/dota-2.jpg" alt="Dota 2">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Dota 2</div>
      <div class="game-card-subtitle">MOBA</div>
    </div>
  </a>
  <a href="https://diablo2.blizzard.com/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/diablo-2.jpg" alt="Diablo 2">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Diablo II</div>
      <div class="game-card-subtitle">Action RPG classic</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/2310/QUAKE/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/quake-1.jpg" alt="Quake">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Quake</div>
      <div class="game-card-subtitle">Dark fantasy FPS</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/2200/Quake_III_Arena/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/quake-3.jpg" alt="Quake III Arena">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Quake III Arena</div>
      <div class="game-card-subtitle">Arena shooter classic</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/1127400/Mindustry/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/mindustry.jpg" alt="Mindustry">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Mindustry</div>
      <div class="game-card-subtitle">Factory tower defense</div>
    </div>
  </a>
  <a href="https://store.steampowered.com/app/892970/Valheim/" target="_blank" rel="noopener" class="game-card">
    <div class="game-card-image-wrapper">
      <img src="/img/valheim.jpg" alt="Valheim">
    </div>
    <div class="game-card-content">
      <div class="game-card-title">Valheim</div>
      <div class="game-card-subtitle">Viking survival sandbox</div>
    </div>
  </a>
</div>

### What are those glasses you sometimes wear?
Ra Optics - Sol [Daylight](https://raoptics.com/products/sol-x-ra-daylight) & [Sunset](https://raoptics.com/products/sol-x-ra-sunset)

