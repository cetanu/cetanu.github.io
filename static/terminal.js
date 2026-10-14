(() => {
    const terminal = document.getElementById('crt-terminal');
    const time = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit', second: '2-digit'
    });
    const pick = (items) => items[Math.floor(Math.random() * items.length)];
    const integer = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const clusters = ['api-primary', 'edge-cache', 'auth-service', 'origin-pool'];
    const routes = ['/api/v1/events', '/assets/app.css', '/healthz', '/api/v1/session', '/media/preview.webp', '/v1/config'];
    let version = 1042;

    const generators = [
        () => `${pick(['GET', 'GET', 'GET', 'POST', 'HEAD'])} ${pick(routes)} → ${pick([200, 200, 200, 204, 304, 404])} · ${integer(2, 85)}ms · h2`,
        () => `upstream=${pick(clusters)} 10.24.${integer(1, 8)}.${integer(2, 254)}:8080 · connection reused`,
        () => `${pick(clusters)} · probe 200 OK · ${integer(1, 9)}ms`,
        () => `${pick(['LDS', 'RDS', 'CDS', 'EDS'])} update v${++version} · ACK · config applied`,
        () => `${pick(['TLSv1.3 / AES_128_GCM', 'TLSv1.3 / CHACHA20_POLY1305'])} · ALPN h2 · session resumed`,
        () => `${pick(['HIT', 'HIT', 'MISS', 'REVALIDATED'])} ${pick(['/assets/app.css', '/media/preview.webp', '/assets/vendor.js'])} · ttl=${integer(60, 3600)}s`,
        () => `edge-0${integer(1, 4)} → ${pick(clusters)} · weighted round-robin`,
        () => `${pick(clusters)}.svc.internal · answer 10.24.${integer(1, 8)}.${integer(2, 254)} · ttl=30s`,
        () => `GET ${pick(routes)} → 200 · ${integer(1, 64)}KiB · upstream=${pick(clusters)}`,
        () => `control-plane:18000 · stream heartbeat · subscription active`,
        () => `listener :443 · accepted 192.0.2.${integer(1, 254)}:${integer(32768, 60999)}`,
        () => `${pick(clusters)} · upstream reset · attempt 2/3 · backoff ${integer(10, 40)}ms`
    ];

    const append = (message) => {
        const row = document.createElement('div');
        row.className = 'terminal-line';
        for (const [className, text] of [
            ['terminal-time', time.format(new Date())],
            ['terminal-message', message]
        ]) {
            const cell = document.createElement('span');
            cell.className = className;
            cell.textContent = text;
            row.appendChild(cell);
        }
        terminal.appendChild(row);
        if (terminal.children.length > 30) terminal.firstElementChild.remove();
        terminal.scrollTop = terminal.scrollHeight;
    };
    terminal.replaceChildren();
    append('listener :443 ready · HTTP/2 enabled');
    append('control-plane:18000 · xDS stream established');
    append(`snapshot v${version} · 4 clusters / 18 endpoints · ACK`);
    append(pick(generators)());

    let timer;
    const tick = () => {
        append(pick(generators)());
        timer = setTimeout(tick, integer(450, 1800));
    };
    timer = setTimeout(tick, 800);
    document.addEventListener('visibilitychange', () => {
        clearTimeout(timer);
        if (!document.hidden) tick();
    });
})();
