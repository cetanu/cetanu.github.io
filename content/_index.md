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

Here, I may share things I am working on or thoughts that I've had in recent
times.
