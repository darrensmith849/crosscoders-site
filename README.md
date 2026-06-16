# CrossCoders

Marketing site for **CrossCoders** — a Christian software studio, and the **CrossCoders Foundation** which gives free, high-quality software to under-resourced churches and Christian organisations. Built with Astro (static output), deployed to Cloudflare Pages.

**Live:** https://crosscoders.pages.dev

## Stack

- **Astro 5** — static output, no SSR adapter (yet)
- Plain **CSS design system** (no Tailwind) in `src/styles/global.css`
- Content lives in `src/lib/content.ts` + `src/lib/pages.ts`
- Deployed to **Cloudflare Pages** via Wrangler

## Develop

```bash
npm install
npm run dev        # → http://localhost:4330
```

## Build & deploy

```bash
npm run build      # → dist/
npx wrangler pages deploy dist --project-name crosscoders --branch main
```

Deploying needs a Cloudflare API token (scope: **Account → Cloudflare Pages → Edit**) passed as `CLOUDFLARE_API_TOKEN`. Never commit it.

## Structure

| Path | What |
|---|---|
| `src/pages/` | Routes — home, `services/` (hub + 6 products), `for/` (4 audiences), `foundation/` (hub + apply + support), about, work, ai, process, contact, faq, legal |
| `src/components/` | `Header`, `Footer`, `Mark` (logo), `ImpactMeter`, `PageHero`, `FinalCta`, `Faq` |
| `src/components/demos/` | Interactive pieces — `LiveBuild`, `PhoneDuo`, `Dashboard`, `AgentChat`, `PhotoBand`, `PhotoFigure`, `PhotoCluster` |
| `src/styles/global.css` | The entire design system + component CSS |
| `src/scripts/demos.js` | Client-side interactions (on-view, reduced-motion aware) |
| `public/img/` | Licensed workspace photos (`ws-01`..`ws-10`) |

## Design

Warm "coffee-shop" aesthetic — bone/paper surfaces, **forest green** accent, **brass** detail, wood tones. Fonts: **Fraunces** (display), **Inter** (body), **JetBrains Mono** (status). Logo is a terminal-tile cross with a blinking cursor (`src/components/Mark.astro`).

## Status

The marketing site is live. The **Foundation funnel** (community giving + a gated build-intake queue) is mid-design — ask the team for the current spec before working on `/foundation/*`.
