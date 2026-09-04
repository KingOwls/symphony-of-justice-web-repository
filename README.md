# Symphony of Justice · Interactive Project Archive

A public-facing, data-driven web archive for **Symphony of Justice** (internal codename: **Symphonia Iustitiae**). The site turns the project documentation into a navigable experience instead of a static pitch deck.

## What is inside

- 16 Game Design dossiers
- 9 World & Lore dossiers
- 6 Vertical Slice dossiers
- Search across the complete extracted documentation
- Interactive elemental reaction matrix
- Gacha pity / guarantee state model
- Combat synergy walkthrough
- Historical timeline
- Nation and faction-oriented world presentation
- Art archive separating named project art from concept/reference material
- GitHub Pages deployment workflow

## Run locally

No build step is required.

```bash
python -m http.server 8000
```

Open `http://localhost:8000`.

## Content regeneration

The generated site data comes from the DOCX files stored under `sources/`.

```bash
python tools/build_content.py
```

The script requires `python-docx`.

The optimized web art and its manifest are generated with:

```bash
python tools/build_art.py
```

That script requires Pillow and expects the original art source directory used during production. The already-generated web assets are committed, so normal site use does not require rebuilding the art.

## Repository structure

```text
index.html                  Main shell
src/app.js                  Router, search, pages and interactive models
src/styles.css               Visual system and responsive layout
src/data/project-data.js     Generated documentation data
src/data/art-data.js         Generated visual-asset manifest
public/assets/art/           Optimized WebP assets
sources/                     Working DOCX source documents
tools/                       Content/art generation scripts
.github/workflows/pages.yml  GitHub Pages deployment
```

## Visual-reference policy

Images marked **Concept · reference only** are not treated as production-ready owned assets. They exist to communicate visual intention and should be replaced by original or properly licensed production material before commercial publication.

The GitHub Pages workflow deploys the web experience but **does not deploy the DOCX source files or build tools**.

## GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Set **Source** to **GitHub Actions**.
4. Push to `main` or manually run the Pages workflow.

The workflow copies only the runtime web files into the deployment artifact.
