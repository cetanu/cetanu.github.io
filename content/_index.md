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
    let buffer = Array(5).fill(""); 
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

    const generateLog = () => {
        const ts = new Date().toISOString().replace('T', ' ').slice(0, 19);
        const method = methods[Math.floor(Math.random() * methods.length)];
        const routeList = router[method];
        const path = routeList[Math.floor(Math.random() * routeList.length)];
        const status = statuses[Math.floor(Math.random() * statuses.length)];
        const bytes = Math.floor(Math.random() * 8000) + 124;
        const latency = (Math.random() * 45 + 2).toFixed(2); // 2ms to 47ms
        return `[${ts}] ${method} ${path} ${status} ${bytes}b ${latency}ms`;
    };

    const updateTerminal = () => {
        buffer.shift();
        buffer.push(generateLog());
        terminal.innerText = buffer.join('\n');
    };

    for(let i=0; i<5; i++) buffer[i] = generateLog();
    terminal.innerText = buffer.join('\n');

    const loop = () => {
        updateTerminal();
        const isBurst = Math.random() > 0.05;
        const delay = isBurst ? Math.random() * 200 : Math.random() * 4000 + 1500;
        setTimeout(loop, delay);
    };

    loop();
})();
</script>
{% end %}

# Vasilios Syrakis

Welcome to my personal site.

{{ image(url="/img/checkem.jpg", alt="me", no_hover=true) }}

## Frequently Asked Questions

### What keyboard is that?
I use a [Nuphy](https://nuphy.com?sca_ref=11306305.p2hPK9CKOM&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate) keyboard.

Most of the times I stream, I'm probably using a low-profile [Kick75](https://nuphy.com/products/nuphy-kick75?sca_ref=11306305.p2hPK9CKOM&sca_source=twitch&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)
with brown switches.

[{{ image(url="/img/nuphy-kick75.webp", alt="kick75", no_hover=true) }}](https://nuphy.com/products/nuphy-kick75?sca_ref=11306305.p2hPK9CKOM&sca_source=twitch&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

I also own an [Air75 V3](https://nuphy.com/products/nuphy-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=twitch&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)
which I use as a portable keyboard, wrapped in a [NuFolio](https://nuphy.com/products/extra-nufolio-v4-for-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=blog&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

[{{ image(url="/img/nuphy-airv3.webp", alt="air75 v3", no_hover=true) }}](https://nuphy.com/products/nuphy-air75-v3?sca_ref=11306305.p2hPK9CKOM&sca_source=twitch&utm_source=affiliate&utm_medium=kol&utm_campaign=nuphy_affiliate)

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

### What Neovim theme are you using?
[sainnhe/edge](https://github.com/sainnhe/edge)

[{{ image(url="/img/neovim-theme.png", alt="neovim", no_hover=true) }}](https://github.com/sainnhe/edge)

### Do you play games? What are your favorites?
Yes, I play games, 100% on Linux

#### Currently playing

* Deep Rock Galactic (+ Survivors, + Rogue Core)
* Path of Exile (1 & 2)
* Noita
* Squad
* Factorio

#### Old favorites

* Dota 2
* Diablo 2
* Quake 1 & 3
* Mindustry
* Valheim

### What glasses are you wearing?
Ra Optics - Sol [Daylight](https://raoptics.com/products/sol-x-ra-daylight) & [Sunset](https://raoptics.com/products/sol-x-ra-sunset)
