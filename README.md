# TECH MONK — Retro Motion Portfolio

A bold, animated single-page portfolio for **Tech Monk** — Social Media Manager &
Community Manager / Moderator for Web3 projects.

## Aesthetic
Retro-arcade / CRT terminal. Core palette of **yellow + black** (pulled from the ronin
avatar) with neon accents from the brand logos. Pixel + monospace type, scanlines,
glitch text, and a boot-sequence preloader.

## Motion
- Terminal **boot preloader** with progress bar
- **Custom cursor** (dot + easing ring, hover states)
- **Glitch** hero title + scramble on hover
- **Typed** role rotator
- **Marquee** skills ticker
- Scroll **reveals** with stagger (IntersectionObserver)
- Count-up **stat counters**
- **Magnetic** buttons + **3D tilt** cards
- Hero **parallax**, orbiting badges, avatar scan-line
- Full CRT / scanline / vignette overlay
- Respects `prefers-reduced-motion`

## Sections
Hero · About + stats · Services (Social Media / Community) · Bot Arsenal ·
Selected Work (Spinova, Vynex, Chunk Coin, Oink) · Roles & Partners
(Slidefunbot, BlockchainFUL, Oiioii.ai) · Contact.

## Tech
Plain **HTML / CSS / JS** — zero build step, no framework. Fonts via Google Fonts.
Fully responsive.

## Run locally
```bash
python3 -m http.server 8000
# open http://localhost:8000
```

## Deploy
Static — host anywhere (GitHub Pages, Netlify, Vercel). For GitHub Pages, enable Pages
on this branch/root and the site serves from `index.html`.

## Structure
```
index.html
assets/
  css/style.css
  js/main.js
  img/            # avatar, project & partner logos
```
