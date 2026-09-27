# Symphony of Justice V2 — React Website Redesign Specification

Date: 2026-09-27  
Status: Proposed for implementation  
Target: Replace the current public V1 with a React V2 while preserving the existing GitHub repository and GitHub Pages root URL.

## 1. Product intent

Symphony of Justice V2 is the official public-facing website for the game project. It must no longer feel like documentation wrapped in a website. It should feel like a browser-accessible extension of the game itself: cinematic, interactive, mysterious, readable, and useful both to a casual visitor and to a reviewer who wants to inspect the design work in depth.

The public journey should move from discovery to understanding to experimentation to deep investigation. The user should first encounter the world and characters, then learn and interact with systems, and finally be able to enter the detailed Lore Archive and development material.

The current V1 remains valuable as the source of truth for extracted documentation, art indexing, reaction/gacha prototypes, and the archive concept. V2 will preserve those assets and data while replacing the presentation layer and interactive architecture.

## 2. Success criteria

The V2 is successful when:

1. The existing GitHub Pages root URL remains unchanged after deployment.
2. The current 31 project dossiers remain accessible and searchable.
3. Existing official art and concept/reference material remain clearly separated.
4. The public-facing pages match the established dark-fantasy visual direction from the approved mockups.
5. The site is modular, responsive, and maintainable in React rather than a single large script.
6. Character builds, reactions, gacha, combat, exploration, and related demonstrations are interactive rather than static descriptions.
7. Demo-only stats and values can be replaced later without editing UI components.
8. The site can run locally with standard Node tooling and deploy automatically through GitHub Actions.
9. The initial V2 does not require a backend or paid API.
10. The site remains usable with keyboard navigation, reduced motion, and reasonable mobile layouts.

## 3. Technical stack

### Required

- React 19 or current stable React compatible with Vite at implementation time
- TypeScript
- Vite
- React Router using hash-based routing for GitHub Pages reliability and repository-name independence
- Motion for React for page/section transitions and controlled micro-interactions
- Custom CSS design system using CSS custom properties; no UI framework is required
- LocalStorage for user-side demo persistence
- Existing Python content-generation tooling, adapted for V2 data output

### Optional / deferred

- Web Audio API for opt-in ambient/UI sound
- Three.js only for isolated showcase effects if performance remains acceptable
- Supabase for future accounts/cloud saves, not V2 launch
- GitHub API for future release/devlog data, not a runtime dependency

## 4. Deployment and URL preservation

The project remains in the same GitHub repository.

Development workflow:

- Preserve current V1 before replacement through a `legacy-v1` branch or equivalent repository backup.
- Build V2 on a dedicated migration branch such as `react-v2`.
- When accepted, merge V2 to `main`.
- GitHub Pages continues publishing from the same repository, preserving the existing root Pages URL.

Routing uses URL hashes, for example:

- `/#/world`
- `/#/characters`
- `/#/characters/kael`
- `/#/gameplay`
- `/#/systems/reactions`

This avoids direct-route 404 problems on GitHub Pages and does not hard-code the repository name into Vite configuration.

GitHub Actions will:

1. check out the repository;
2. install dependencies with `npm ci`;
3. run tests;
4. run `npm run build`;
5. upload `dist/` as the Pages artifact;
6. deploy through `actions/deploy-pages`.

## 5. Source preservation

The following current V1 material must be preserved:

- `sources/` working DOCX documents, if present in the source repository
- 16 Game Design dossiers
- 9 World & Lore dossiers
- 6 Vertical Slice dossiers
- optimized art under `public/assets/art/`
- official/reference classification
- ART_POLICY.md
- CONTENT_MAP.md
- content generation scripts
- art manifest generation logic
- historical timeline data
- documented reaction rules
- documented gacha/pity rules

The old `src/app.js` and `src/styles.css` are not carried forward as the runtime architecture. They may be archived for comparison during migration.

## 6. Content pipeline

V2 separates project content from presentation.

### Dossier generation

`tools/build_content.py` will be adapted to output:

```text
public/data/dossiers/index.json
public/data/dossiers/<document-id>.json
```

`index.json` contains searchable metadata and brief excerpts. Individual dossier files contain full extracted content. The Archive loads full text on demand so the initial application bundle does not contain the entire 1+ MB documentation corpus.

### Art manifest

`tools/build_art.py` or a small migration helper outputs:

```text
public/data/art-manifest.json
```

Each record must retain:

- id
- display name
- path
- category
- official/reference status
- optional associated nation/character/location

Concept/reference art must always render with a clear `Concept Reference · Not Final Game Art` label.

## 7. Proposed source structure

```text
src/
├── app/
│   ├── App.tsx
│   ├── router.tsx
│   └── providers/
├── components/
│   ├── common/
│   ├── layout/
│   ├── navigation/
│   ├── cards/
│   ├── game-ui/
│   ├── archive/
│   └── feedback/
├── pages/
│   ├── Home/
│   ├── World/
│   ├── Characters/
│   ├── CharacterDetail/
│   ├── Gameplay/
│   ├── Reactions/
│   ├── Exploration/
│   ├── Bestiary/
│   ├── BossDetail/
│   ├── Progression/
│   ├── Story/
│   ├── Archive/
│   ├── Acquisition/
│   ├── VerticalSlice/
│   └── Gallery/
├── systems/
│   ├── builds/
│   ├── combat/
│   ├── reactions/
│   ├── gacha/
│   ├── teams/
│   └── exploration/
├── data/
│   ├── characters.ts
│   ├── weapons.ts
│   ├── artifacts.ts
│   ├── enemies.ts
│   ├── bosses.ts
│   ├── locations.ts
│   ├── nations.ts
│   ├── events.ts
│   ├── banners.ts
│   └── demo/
├── hooks/
├── lib/
├── styles/
│   ├── tokens.css
│   ├── typography.css
│   ├── global.css
│   ├── motion.css
│   └── responsive.css
└── types/
```

Each system module owns its calculations. Pages consume system APIs and do not embed gameplay formulas directly.

## 8. Global visual system

The approved mockups define the V2 direction:

- dark navy / near-black backgrounds;
- silver/ivory type;
- restrained gold ornamentation;
- occasional crimson, blue, violet and faction/element accents;
- editorial serif display typography paired with readable sans-serif UI text;
- thin ornamental dividers, celestial/compass motifs, layered textures;
- cinematic image treatment with gradients that preserve text readability;
- mystery through redacted/restricted/incomplete information rather than horror gimmicks.

The site must not reproduce the mockup images as static page backgrounds. The mockups are layout and art-direction references. V2 should rebuild them as responsive HTML/CSS/React components using project art.

### Global components

- `SiteHeader`
- `SiteFooter`
- `PageHero`
- `SectionHeading`
- `OrnamentDivider`
- `GameButton`
- `Pill`
- `InfoPanel`
- `ArtCard`
- `CharacterCard`
- `StatBar`
- `Tabs`
- `Modal`
- `Tooltip`
- `RestrictedBadge`
- `ConceptReferenceBadge`
- `LoadingState`
- `EmptyState`

## 9. Route map and page requirements

### Home — `/#/`

Purpose: official game gateway.

Sections:

1. cinematic hero;
2. four philosophical ideals;
3. initial character introduction;
4. first reaction preview;
5. Fight / Explore / Decide pillars;
6. interactive world teaser;
7. conflict/story teaser;
8. featured characters;
9. Vertical Slice preview;
10. Archive invitation.

Home remains concise and routes deeper rather than duplicating every system.

### World — `/#/world`

Sections:

- world hero;
- four nations;
- justice in everyday life comparison;
- interactive world map;
- landmarks;
- creatures/ecology teaser;
- factions;
- current conflicts;
- public vs disputed/restricted history;
- cosmology teaser;
- timeline;
- character/story CTA.

### Characters — `/#/characters`

Sections:

- characters hero;
- featured cast;
- filterable/searchable gallery;
- quick profile;
- characters by nation;
- characters by role;
- restricted/unknown characters.

Filters are driven from data rather than hard-coded UI.

### Character Detail — `/#/characters/:characterId`

The most game-like character management screen.

Tabs:

- Overview
- Build
- Weapon
- Artifacts
- Skills
- Synergy
- Relationships
- Lore

Interactive functions:

- level and ascension controls;
- talent levels;
- weapon selection and upgrade/refinement values;
- artifact slot selection and set bonuses;
- final-stat calculation;
- build presets;
- simple damage/output estimate;
- recommended teammates and reaction pairings;
- relationship graph.

Demo statistics are explicitly treated as prototype/sample values until final game balance exists.

### Gameplay + Combat Lab — `/#/gameplay`

Sections:

- gameplay hero;
- core gameplay loop;
- exploration/world map guide;
- real-time combat explanation;
- Combat Lab;
- elements/status preview;
- team building/character switching;
- progression preview;
- activities and dungeons;
- weekly private dungeon;
- events board;
- boss encounters;
- endgame/long-term play;
- gameplay codex.

Combat Lab is a deterministic browser simulation, not a reproduction of the future game engine. It demonstrates action order, status application, swapping, reactions and execution with interactive controls and combat log feedback.

### Elements & Reactions — `/#/systems/reactions`

Sections:

- hero;
- reaction fundamentals;
- interactive reaction simulator;
- order comparison;
- reaction codex;
- elements and status effects;
- tactical categories;
- character synergy examples;
- combo flow guide;
- advanced reaction data.

The reaction engine receives ordered effects and returns documented outcomes. When a rule is not defined in project documentation, sample/demo results must be isolated in demo data rather than presented as canon.

### Exploration — `/#/exploration`

A clickable scenario/world discovery experience.

Includes:

- selected region/scene;
- points of interest;
- cities;
- ruins;
- dungeons;
- creatures;
- resources;
- quests;
- secrets;
- unknown/restricted locations;
- discovery progress.

No full 3D navigation is required for V2 launch. High-quality layered art, hotspots, panels, parallax and transitions are sufficient.

### Bestiary — `/#/bestiary`

Categories:

- wildlife;
- neutral creatures;
- hostile creatures;
- corrupted creatures;
- human enemies;
- elites;
- bosses.

Each entry can expose habitat, behavior, threat, element, abilities, ecosystem relationship and known locations.

### Boss Detail — `/#/bosses/:bossId`

Bosses receive larger cinematic pages with:

- artwork/context;
- encounter information;
- phases;
- mechanics;
- arena preview;
- vulnerability windows;
- recommended tactical approach;
- possible rewards;
- links to team/reaction systems.

### Progression & Equipment — `/#/progression`

Sections:

- progression loop;
- character level and ascension;
- materials;
- weapons;
- artifacts/equipment;
- skills/passives;
- build presets;
- build comparison;
- link to Character Builder.

### Story — `/#/story`

A cinematic public narrative presentation.

Sections:

- premise;
- world in tension;
- spark of conflict;
- characters in the storm;
- multiple perspectives;
- questions without answers;
- Archive CTA.

Story must intentionally avoid revealing deep restricted lore.

### Lore Archive — `/#/archive`

The V1 archive concept becomes the deep research layer.

Modules:

- global dossier search;
- timeline explorer;
- document viewer;
- nations;
- factions;
- cosmology;
- historical events;
- characters;
- restricted files;
- document classifications: Public, Recorded, Disputed, Restricted, Unknown/Lost where appropriate.

A route `/#/archive/:documentId` opens an individual dossier.

### Acquisition / Gacha — `/#/acquisition`

An immersive but clearly simulated acquisition interface.

Includes:

- featured banner;
- Wish x1 / Wish x10 interaction;
- reveal sequence;
- pull history;
- pity counter;
- soft pity indication;
- 50/50 state;
- guarantee state;
- carry-over explanation;
- probability/system transparency panel;
- reset/demo controls.

Persist simulator state in LocalStorage so the experience can survive reloads. The page must identify itself as a demonstration of the proposed system rather than real-money functionality.

### Vertical Slice — `/#/vertical-slice`

A mission-dossier-style presentation.

Sections:

- what the slice represents;
- 20–30 minute target;
- mission route;
- experience beats;
- included systems;
- characters/region used;
- development status;
- future play/download CTA placeholder.

### Gallery — `/#/gallery`

- official art filter;
- concept/reference filter;
- characters;
- enemies;
- environments;
- lightbox;
- explicit reference-only labeling.

## 10. Interactive system boundaries

### Build engine

Input:

- character base data;
- level;
- ascension;
- weapon;
- weapon level/refinement;
- artifacts;
- talent levels;
- selected passive toggles.

Output:

- calculated final stats;
- active set bonuses;
- build summary;
- estimated output values.

### Reaction engine

Input:

- ordered effect A;
- ordered effect B;
- optional target status/context.

Output:

- reaction id;
- name;
- category;
- effect summary;
- whether state is consumed;
- display animation metadata.

### Gacha engine

State:

- pity count;
- guarantee flag;
- banner family;
- pull history.

Rules must implement the documented pity/soft-pity/50-50/guarantee/carry-over behavior from existing project materials. A deterministic demo mode may exist for presentations.

### Combat Lab

The lab uses a finite-state demonstration rather than physics/game-engine simulation.

Example states:

`idle → status-applied → swapped → reaction-ready → reaction-triggered → finisher → recover`

It exposes combat feedback, damage demonstration values and event logs.

### Exploration state

Tracks only browser-demo discovery state:

- visited hotspots;
- discovered secrets;
- selected filters;
- region completion percentage.

It does not represent final save-game architecture.

## 11. Demo data policy

The user has explicitly allowed prototype statistics and undefined values to be invented for demonstration.

To prevent prototype values from being confused with final balance:

- all invented statistics live under `src/data/demo/` or are marked `demo: true`;
- final UI does not need to show an intrusive warning on every number, but the site includes a concise project-development note where appropriate;
- documented canon/lore content remains sourced from project files;
- invented names or mechanics should not contradict documented project rules;
- official artwork remains distinct from conceptual reference material.

## 12. State and persistence

LocalStorage keys are namespaced under `soj.v2.*`.

Examples:

- `soj.v2.preferences`
- `soj.v2.gacha`
- `soj.v2.builds`
- `soj.v2.exploration`

Persistence must be defensive: invalid or outdated stored data falls back to defaults without breaking the page.

## 13. Accessibility and UX

Minimum requirements:

- keyboard-accessible navigation and dialogs;
- semantic headings and landmarks;
- visible focus states;
- sufficient text contrast;
- `prefers-reduced-motion` support;
- no autoplay audio;
- images with meaningful alt text or empty alt when purely decorative;
- controls are understandable without relying solely on color;
- mobile layouts collapse dense desktop panels into tabs, horizontal scroll regions or stacked cards instead of shrinking unreadably.

## 14. Performance strategy

- route-level lazy loading;
- dossier text loaded on demand;
- lazy image loading outside initial viewport;
- use existing optimized WebP art;
- avoid full-page canvas/Three.js scenes;
- use CSS and Motion for most effects;
- no background video dependency;
- limit parallax and particles on low-power/mobile contexts;
- preload only the hero images required for the current route.

## 15. Error handling

- unknown route → branded Not Found page with navigation home;
- unknown character/boss/document id → contextual Not Found state;
- dossier fetch failure → retry option and Archive link;
- image failure → graceful placeholder with item name;
- corrupt LocalStorage → reset only affected simulator state;
- empty search → helpful Archive prompt rather than blank output.

## 16. Testing strategy

Use Vitest and React Testing Library.

Minimum automated coverage:

- reaction engine order sensitivity;
- gacha pity reset/guarantee/carry-over logic;
- build calculation arithmetic;
- LocalStorage parsing/fallback;
- core route rendering;
- filters for characters/gallery/archive.

Before final delivery:

- `npm test`
- `npm run build`
- local preview test
- representative desktop and mobile viewport checks
- keyboard navigation smoke test
- verify GitHub Pages workflow configuration
- verify no DOCX/private tools are included in deployed `dist/` unless intentionally public.

## 17. Migration phases

### Phase 1 — Foundation

- scaffold Vite React TypeScript project;
- preserve V1 backup;
- define global design tokens/layout;
- migrate asset manifest and content pipeline;
- create routing and site shell.

### Phase 2 — Public identity

- Home;
- World;
- Characters;
- Character Detail.

### Phase 3 — Interactive systems

- Gameplay + Combat Lab;
- Elements & Reactions;
- Team/build calculations.

### Phase 4 — Exploration loop

- Exploration;
- Bestiary;
- Boss Detail;
- Progression & Equipment.

### Phase 5 — Deep experience

- Story;
- Lore Archive;
- Acquisition/Gacha;
- Vertical Slice;
- Gallery.

### Phase 6 — Finish

- responsive refinement;
- motion pass;
- accessibility;
- performance;
- test suite;
- README/update documentation;
- GitHub Pages workflow;
- final distributable ZIP.

## 18. Explicit non-goals for the first React V2

- no real payments;
- no production gacha backend;
- no login/accounts;
- no cloud saves;
- no multiplayer backend;
- no real game executable embedded in the site;
- no requirement for gameplay videos;
- no need to implement every conceptual feature as final game logic;
- no dependency on third-party content APIs for original game data.

## 19. Final deliverables

The completed migration will provide:

1. full React/TypeScript source project;
2. all required npm configuration;
3. migrated project data and assets;
4. interactive prototype systems;
5. adapted data-generation scripts;
6. GitHub Pages workflow;
7. README with Windows/Linux setup and deployment instructions;
8. legacy preservation notes;
9. production build validation;
10. downloadable ZIP ready to replace/update the repository.

## 20. Architecture decision summary

Proceed with a React + TypeScript + Vite single-page application using hash routing, local structured data, lazy-loaded dossier content, existing optimized project art, custom CSS, Motion, browser-side simulator state, and GitHub Pages deployment from the existing repository. Preserve the V1 before publication and treat the approved visual mockups as implementation references rather than static page images.
