+++
title = "Links"
+++

<style>
  main#main-content > h1:first-of-type {
    display: none;
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
  links-page {
    display: block;
    max-width: 400px;
    margin: 2rem auto;
  }
  links-page > ul {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    list-style: none;
    padding-inline-start: 0;
  }
  .linkspage-btn {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-decoration: none !important;
    background-color: var(--fg-muted-1);
    border: 1px solid var(--fg-muted-2);
    border-radius: var(--rounded-corner);
    padding: 1rem;
    color: var(--fg-color) !important;
    font-weight: 600;
    text-align: center;
    box-shadow: var(--edge-highlight), var(--shadow);
    transition:
      transform var(--transition-longer),
      box-shadow var(--transition-longer),
      border-color var(--transition-longer);
  }
  .linkspage-btn:hover {
    transform: translateY(-4px);
    box-shadow:
      0 0 0 1px var(--accent-color),
      var(--shadow-raised);
    border-color: var(--accent-color);
  }
  .linkspage-heading {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }
  .linkspage-caption {
    display: block;
    margin-top: 0.25rem;
    color: var(--fg-muted-4);
    font-size: 0.875rem;
    font-weight: 400;
  }
  .linkspage-icon {
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
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

<links-page>

- {% link_button(title="YouTube", url="/youtube", icon="youtube") %}
  Videos and stream VODs
  {% end %}

- {% link_button(title="X", url="/x", icon="x") %}
  Where I mostly talk trash on the internet
  {% end %}

- {% link_button(title="Twitch", url="/twitch", icon="twitch") %}
  If you prefer watching my stream on Twitch
  {% end %}

- {% link_button(title="Kick", url="/kick", icon="kick") %}
  If you prefer watching my stream on Kick
  {% end %}

---

- {% link_button(title="Content Schedule", url="/schedule", icon="kanban") %}
  See what I’m working on and what’s coming up
  {% end %}

- {% link_button(title="Discord Community", url="/discord", icon="discord") %}
  Get notified when I go live, join the conversation
  {% end %}

---

- {% link_button(title="GitHub", url="/github", icon="github") %}
  Browse my code and open-source projects
  {% end %}

- {% link_button(title="LinkedIn", url="/linkedin", icon="linkedin") %}
  My work experience
  {% end %}

---

- {% link_button(title="CodeCrafters (40% off)", url="/codecrafters") %}
  Use my partner link for a huge discount
  {% end %}

- {% link_button(title="Nuphy Keyboard", url="/keyboard", icon="keyboard") %}
  The mechanical keyboard I use
  {% end %}

- {% link_button(title="My Merchandise", url="/merch", icon="shop") %}
  Good quality meme t-shirts
  {% end %}

</links-page>

<script>
  class linkspage extends HTMLElement {
    connectedCallback() {
      this.querySelectorAll("ul a").forEach((link) => {
        if (link.getAttribute("href").startsWith("http")) {
          link.target = "_blank";
          link.rel = "noopener";
        }

        link.addEventListener("click", () => {
          if (typeof gtag === "function") {
            gtag("event", "social_link_click", {
              link_name: link.querySelector(".linkspage-label").textContent.trim(),
              link_url: link.href,
            });
          }
        });
      });
    }
  }
  customElements.define("links-page", linkspage);
</script>
