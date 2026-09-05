+++
title = "Frequently Asked Questions"
description = "Frequently asked questions about my desk setup, peripherals, PC specs, Linux environment, editor, and games."
aliases = ["setup"]
+++

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

Answers to questions that I usually receive during my livestreams.

<details>
<summary>What keyboard do you use?</summary>

I use a [Nuphy](/nuphy) keyboard.

Most of the times I stream, I'm probably using a low-profile [Kick75](/nuphy-kick75) with brown switches.

[{{ image(url="/img/nuphy-kick75.webp", alt="kick75", no_hover=true) }}](/nuphy-kick75)

I also own an [Air75 V3](/nuphy-air75-v3) which I use as a portable keyboard, wrapped in a [NuFolio](/nuphy-nufolio-v4).

[{{ image(url="/img/nuphy-airv3.webp", alt="air75 v3", no_hover=true) }}](/nuphy-air75-v3)

</details>

<details>
<summary>What mouse do you use?</summary>

My mouse is a [Steelseries Rival 3 Gen 2](https://steelseries.com/en-au/gaming-mice/rival-3-gen-2).

[{{ image(url="/img/steelseries-rival.webp", alt="rival", no_hover=true) }}](https://steelseries.com/en-au/gaming-mice/rival-3-gen-2)

</details>

<details>
<summary>What are your PC & peripheral specs?</summary>

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

</details>

<details>
<summary>What Operating System / Linux Distribution do you use?</summary>

[Pop! OS](https://system76.com/pop) 24.04 with COSMIC desktop.

{{ youtube(id="IyXzjnd6q3g") }}

</details>

<details>
<summary>What terminal do you use?</summary>

[Ghostty](https://ghostty.org/)

</details>

<details>
<summary>What editor do you use?</summary>

Neovim

</details>

<details>
<summary>What plugins do you use? Where are your dotfiles?</summary>

[My dotfiles are here](/dotfiles).

What I would consider my essential plugins are:

* [telescope](https://github.com/nvim-telescope/telescope.nvim)
* [neogit](https://github.com/TimUntersberger/neogit)
* [gitsigns](https://github.com/lewis6991/gitsigns.nvim)
* [blink.cmp](https://github.com/saghen/blink.cmp)
* [key-menu](https://github.com/cetanu/key-menu.nvim)

</details>

<details>
<summary>What Neovim theme are you using?</summary>

[sainnhe/edge](https://github.com/sainnhe/edge)

[{{ image(url="/img/neovim-theme.png", alt="neovim", no_hover=true) }}](https://github.com/sainnhe/edge)

</details>

<details>
<summary>Do you play games? What are your favorites?</summary>

Yes, I play games, 100% on Linux.

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

</details>

<details>
<summary>What are those glasses you sometimes wear?</summary>

Ra Optics - Sol [Daylight](/raoptics-daylight) & [Sunset](/raoptics-sunset)

</details>
