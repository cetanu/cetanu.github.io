+++
title = "Links"
+++

<style>
main#main-content > h1:first-of-type {
    display: none;
}
.linkspage-header {
    text-align: center;
    margin-bottom: 2rem;
}
.linkspage-avatar {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    object-fit: cover;
    margin-bottom: 1rem;
    box-shadow: var(--shadow);
}
.linkspage-title {
    margin: 0;
}
.linkspage-subtitle {
    color: var(--fg-muted-4);
    margin-top: 0.5rem;
}
.linkspage-container {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 400px;
    margin: 2rem auto;
}
.linkspage-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none !important;
    background-color: var(--fg-muted-1);
    border: 1px solid var(--fg-muted-2);
    border-radius: var(--rounded-corner);
    padding: 1rem;
    color: var(--fg-color) !important;
    font-weight: 600;
    box-shadow: var(--edge-highlight), var(--shadow);
    transition: transform var(--transition-longer), box-shadow var(--transition-longer), border-color var(--transition-longer);
}
.linkspage-btn:hover {
    transform: translateY(-4px);
    box-shadow: 0 0 0 1px var(--accent-color), var(--shadow-raised);
    border-color: var(--accent-color);
}
.linkspage-icon {
    width: 1.25rem;
    height: 1.25rem;
    margin-right: 0.75rem;
    background-color: var(--fg-color);
    mask-size: contain;
    mask-repeat: no-repeat;
    mask-position: center;
    -webkit-mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-position: center;
    transition: background-color var(--transition-longer);
}
.linkspage-btn:hover .linkspage-icon {
    background-color: var(--accent-color);
}
</style>

<div class="linkspage-header">
    <img src="https://github.com/cetanu.png" alt="Vasilios Syrakis" class="linkspage-avatar">
    <h2 class="linkspage-title">Vasilios Syrakis</h2>
    <p class="linkspage-subtitle">Senior Systems Engineer / SRE</p>
</div>

<links-page>

* [![Twitch](/img/social/twitch.svg) Twitch](/twitch)
* [![Kick](/img/social/kick.svg) Kick](/kick)
* [![YouTube](/img/social/youtube.svg) YouTube](/youtube)
* [![X](/img/social/x.svg) X](/x)
* [![GitHub](/img/social/github.svg) GitHub](/github)
* [![LinkedIn](/img/social/linkedin.svg) LinkedIn](/linkedin)
* [![Discord](/img/social/discord.svg) Discord Community](/discord)
* [![Merch](/img/social/shop.svg) Merch](/merch)
* [![Keyboard](/img/social/keyboard.svg) "What keyboard do you use?"](/keyboard)

</links-page>

<script>
class linkspage extends HTMLElement {
    connectedCallback() {
        const list = this.querySelector('ul');
        if (!list) return;

        const links = Array.from(list.querySelectorAll('a'));
        const container = document.createElement('div');
        container.className = 'linkspage-container';
        
        links.forEach(link => {
            link.className = 'linkspage-btn';
            
            // Look for an image defined in the markdown link (e.g. ![alt](/img/social/icon.svg))
            const img = link.querySelector('img');
            if (img) {
                const iconSrc = img.getAttribute('src');
                const icon = document.createElement('span');
                icon.className = 'linkspage-icon';
                icon.style.maskImage = `url(${iconSrc})`;
                icon.style.webkitMaskImage = `url(${iconSrc})`;
                
                // Replace the raw img with our themed span mask
                link.replaceChild(icon, img);
            }

            if (link.getAttribute('href').startsWith('http')) {
                link.target = '_blank';
                link.rel = 'noopener';
            }

            link.addEventListener('click', () => {
                if (typeof gtag === 'function') {
                    gtag('event', 'social_link_click', {
                        'link_name': link.textContent.trim(),
                        'link_url': link.href
                    });
                }
            });

            container.appendChild(link);
        });

        this.innerHTML = '';
        this.appendChild(container);
    }
}
customElements.define('links-page', linkspage);
</script>
