# Verification status

The source was assembled in an execution environment without DNS access to `registry.npmjs.org`, so third-party React/Vite packages could not be downloaded in-session.

Verified locally in the build workspace:

- TypeScript/TSX syntax transpilation: 31 files, 0 syntax errors.
- V2 data export: 31 dossier JSON records.
- Art manifest: 526 records total, 122 official and 404 concept/reference records.
- Every art-manifest path resolves to an existing asset under `public/`.
- Curated React demo-data asset paths resolve to existing files.
- GitHub Pages routing uses `HashRouter` and base-relative asset URLs.

Run on a networked development machine before publishing:

```bash
npm install
npm run test:run
npm run build
npm run preview
```

The GitHub Actions workflow performs install, tests and production build before deployment.
