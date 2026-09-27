# Symphony of Justice V2

Official interactive website prototype for **Symphony of Justice**, rebuilt from the original static archive as a React + TypeScript + Vite experience.

## What changed in V2

The V1 content and art archive are preserved, but the runtime has been redesigned around reusable React pages and interactive game-system prototypes. The visual language follows the approved dark-fantasy website mockups while using the project's actual optimized art assets.

### Included routes

- `/#/` — Home
- `/#/world` — world, nations, map, history
- `/#/characters` — searchable/filterable roster
- `/#/characters/:id` — interactive character build prototype
- `/#/gameplay` — gameplay guide + Combat Lab
- `/#/systems/reactions` — ordered reaction simulator/codex
- `/#/exploration` — interactive exploration prototype
- `/#/bestiary` — enemies and creatures
- `/#/bosses` — boss phases / arena concept
- `/#/progression` — progression and build comparison
- `/#/story` — public narrative presentation
- `/#/archive` — the full 31-dossier V1 archive in a redesigned reader
- `/#/acquisition` — pity / guarantee / carry-over gacha simulator
- `/#/vertical-slice` — 20–30 minute prototype mission overview
- `/#/gallery` — official art and clearly labelled concept references

## Local development

Requirements: Node.js 20+ (Node 22 recommended).

```bash
npm install
npm run dev
```

Production checks:

```bash
npm run test:run
npm run build
npm run preview
```

## GitHub Pages

The repository contains `.github/workflows/pages.yml`. Keep this repository as the existing Pages repository so its public root URL remains unchanged.

In GitHub:

1. Open **Settings → Pages**.
2. Set **Source** to **GitHub Actions**.
3. Push the V2 to `main`.
4. The workflow installs dependencies, runs tests, builds `dist/`, and deploys it.

The app uses `HashRouter`, so deep navigation such as `/#/characters/niels-darkmoon` works on GitHub Pages without server rewrites.

## Content / art policy

- Existing official assets remain under `public/assets/art/**/official/`.
- External visual references remain under `reference/` and are labelled **Concept Reference · Not Final Game Art** in Gallery.
- Demo-only numerical balance values are prototypes for showing the UI and are not final game balance.
- The existing 31 extracted dossiers remain the archive source of truth.

See `ART_POLICY.md`, `CONTENT_MAP.md`, and `docs/superpowers/specs/2026-09-27-symphony-of-justice-v2-design.md`.

## V1 preservation

The previous HTML/CSS/JS runtime is preserved in `legacy/v1/` for comparison and rollback. It is not part of the V2 runtime.
