# V1 → V2 Migration Notes

1. Keep the same GitHub repository to preserve the Pages URL.
2. Create a backup branch/tag from the current V1 before replacing `main`.
3. Upload/merge this V2 source into the same repository.
4. Commit `package-lock.json` after `npm install` if it is not already present.
5. Set Pages source to GitHub Actions.
6. Push to `main` and watch the `Deploy Symphony of Justice V2` workflow.

No external API keys or backend environment variables are required for V2.
