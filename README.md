<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="images/logo/lockup-vertical-dark.png" />
    <img src="images/logo/lockup-vertical.png" alt="CoStaff" width="300" />
  </picture>
</p>

# costaff-ai.github.io

Public landing page for [CoStaff](https://github.com/costaff-ai/costaff), served via GitHub Pages at **https://costaffs.app**.

---

## Repository Structure

```
costaff-ai.github.io/
├── index.html                  # English homepage
├── zhtw/                       # Traditional Chinese mirror of the whole tree
│   └── …                       #   same paths, prefixed with /zhtw
├── agents/                     # Product — AI agent roster
├── manager/                    # Product — Manager Agent
├── channels/                   # Product — channels
│   ├── webchat/
│   └── webchat-enterprise/
├── platforms/                  # Product — business platforms
├── identity/                   # Product — identity / SSO
├── architecture/               # Resources — technical architecture diagram
├── user-flow/                  # Resources — user flow sequence diagram
├── docs/                       # Docs — install, start, cli, tutorial, verify, …
├── pricing/                    # Plans
├── blog/
├── partners/
│   ├── community/
│   └── enterprise/
├── deck.html                   # Standalone presentation deck
├── 404.html                    # Redirect stub
├── assets/
│   ├── site.js                 # Shared nav + footer injector
│   └── site.css                # Shared chrome styles
├── images/
│   ├── logo/                   # Brand assets — favicon, OG card, lockups
│   └── architecture/           # Architecture diagrams (SVG)
└── scripts/                    # Utility scripts (e.g. Google Form setup)
```

Every page exists in both languages: English at `/<path>/`, Traditional Chinese at
`/zhtw/<path>/`.

---

## Shared Chrome

`assets/site.js` is the single source of truth for the banner, nav and footer — it
injects them into every page at runtime. A page only needs the two placeholder divs
plus the stylesheet and script:

```html
<link rel="stylesheet" href="/assets/site.css" />
<div id="cs-header"></div>
<!-- page content -->
<div id="cs-footer"></div>
<script src="/assets/site.js"></script>
```

Language (`en` / `zhtw`) and the active nav section are auto-detected from
`location.pathname`, so pages need no configuration.

> `index.html` and `zhtw/index.html` render their own inline footer instead of the
> injected one — footer changes must be applied in both places.

---

## Homepage Sections

`index.html` is a scroll-snap single-page layout:

| Section | Anchor | Description |
|---|---|---|
| Hero | — | Tagline and CTAs |
| Watch | `#demo` | 30-second intro video |
| 01 Sound familiar? | `#problems` | Pain points CoStaff solves |
| 02 How it works | `#flow` | Hand-off flow across the agent team |
| 03 System architecture | `#architecture` | Six independently replaceable layers |
| 04 Getting started | `#how` | Docker-only setup |
| 05 One command for everything | `#cli` | `costaff` CLI reference |
| 06 Where it lives | `#channels` | Supported chat channels |
| 07 Plans | `#plans` | Open source + paid tiers |
| 08 Partners | `#partners` | Partner community |
| 09 Your data | `#privacy` | Data handling commitments |
| Ready when you are | `#start` | Closing CTA |

---

## Brand Assets

All brand files live in `images/logo/`:

| File | Use |
|---|---|
| `mark.svg` | Icon only, true vector — nav and footer lockups |
| `favicon.svg` | Icon with thickened strokes for legibility at small sizes |
| `favicon.ico` | Multi-resolution (16–256px); 16/32px use the thickened mark |
| `apple-touch-icon.png` | 180×180, iOS home screen |
| `icon-192.png` / `icon-512.png` | PWA / Android icon sizes |
| `og.png` | 1200×630 social sharing card |
| `lockup-vertical.png` | Vertical lockup, dark text — light backgrounds |
| `lockup-vertical-dark.png` | Vertical lockup, white text — dark backgrounds |

Source artwork lives outside this repo in `costaff-logo/`.

---

## Editing

The pages carry their own inlined `<style>`; there is no build step and no bundler.

1. Edit the English page, then mirror the change to its `/zhtw/` counterpart.
2. Nav and footer changes go in `assets/site.js` only — never per page.
3. Push to `main`; GitHub Pages deploys automatically.

---

## Deployment

GitHub Pages with a custom domain (`CNAME` → `costaffs.app`). Any push to `main`
triggers an automatic deployment — no CI or build pipeline required.
