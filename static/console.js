(() => {
    document.querySelectorAll('.instrument-rail nav a').forEach((link) => {
        const path = new URL(link.href).pathname.replace(/\/$/, '') || '/';
        const current = location.pathname.replace(/\/$/, '') || '/';
        const active = current === path || (path !== '/' && current.startsWith(path + '/'));
        if (active) link.setAttribute('aria-current', 'page');
        else link.removeAttribute('aria-current');
    });

    const clock = document.getElementById('console-clock');
    const format = new Intl.DateTimeFormat('en-AU', {
        timeZone: 'Australia/Sydney', hour: '2-digit', minute: '2-digit',
        second: '2-digit', hourCycle: 'h23'
    });
    const updateClock = () => {
        const now = new Date();
        clock.textContent = format.format(now);
        clock.dateTime = now.toISOString();
    };
    updateClock();
    setInterval(updateClock, 1000);

    const progress = document.getElementById('reading-progress');
    const updateProgress = () => {
        const distance = document.documentElement.scrollHeight - innerHeight;
        progress.value = distance > 0 ? Math.min(100, Math.max(0, scrollY / distance * 100)) : 100;
        progress.textContent = `${Math.round(progress.value)}%`;
    };
    addEventListener('scroll', updateProgress, { passive: true });
    addEventListener('resize', updateProgress);
    new ResizeObserver(updateProgress).observe(document.body);
    updateProgress();

    document.getElementById('screen-texture').addEventListener('change', (event) => {
        document.querySelector('.machine').classList.toggle('clean-display', !event.target.checked);
    });
})();
