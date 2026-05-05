# costaff-ai.github.io

Public landing page for [CoStaff](https://github.com/costaff-ai/costaff), served via GitHub Pages at **https://costaff-ai.github.io/**.

---

## Repository Structure

```
costaff-ai.github.io/
├── index.html          # English landing page (default)
├── index.zh.html       # Traditional Chinese landing page
├── agents.html         # English agents page
├── agents.zh.html      # Traditional Chinese agents page
├── deck.html           # Deck / presentation page
├── images/             # Static image assets
└── scripts/            # Utility scripts (e.g. Google Form setup)
```

The site is a single-page design with full-page scroll-snap sections:

| Section | Anchor | Description |
|---|---|---|
| Hero | — | Tagline and CTAs |
| 01 Why | `#problems` | Pain points vs. CoStaff solutions |
| 02 How | `#how` | Three-step onboarding |
| 03 CLI | `#cli` | `cst` command reference |
| 04 Where | `#channels` | Supported channels (WebChat, Telegram, Discord, LINE, Slack) |
| 05 Plans | `#plans` | Open Source (OSS) + Advanced Plan (Starter / Pro / Max / Enterprise) |
| Partners | `#partners` | Partner community |
| 06 Your data | `#privacy` | Data handling commitments |

---

## Editing

The pages are self-contained single-file HTML — all CSS is inlined in `<style>` and there are no build steps or external asset dependencies.

1. Edit `index.html` for the English landing page; mirror any content changes to `index.zh.html`.
2. Edit `agents.html` for the agents page; mirror to `agents.zh.html`.
3. Push to `main` — GitHub Pages deploys automatically.

---

## Language Switching

The nav bar includes a language toggle:
- English page links to `index.zh.html`
- Chinese page links to `index.html`

---

## Deployment

This repo is configured as a GitHub Pages site. Any push to `main` triggers an automatic deployment — no CI or build pipeline required.
