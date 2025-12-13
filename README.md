# DopeSecurity FE - Final (Vite + MUI + DataGrid + Storybook + Vitest)

This project includes:
- Vite + React + TypeScript
- MUI 5 with an improved theme
- @mui/x-data-grid with **server-side** pagination & sorting
- Storybook (Vite builder) with MSW mocking
- Vitest tests (mocking axios) for server-side behaviors
- json-server for local fake API and a `generate-db` script

## Quickstart

1. Install dependencies
```bash
npm install
```

2. Generate sample DB and start json-server (API: http://localhost:4000)
```bash
npm run generate-db
npm run json-server
```

3. Run the dev server (Vite)
```bash
npm run dev
# open http://localhost:3000
```

4. Run Storybook
```bash
npm run storybook
# open http://localhost:6006
```

4.1 Build Storybook (static)
```bash
npm run build-storybook
# The static output is in the storybook-static directory.
```

To preview the static build locally:
```bash
npx serve storybook-static
# open http://localhost:5000 (or the port serve chooses)
```

5. Run tests
```bash
npm test
```

## Deployment

This project is configured for deployment on **Vercel**. To deploy:

1. Push the repository to GitHub.
2. Connect the GitHub repository to your Vercel account.
3. Vercel will automatically build and deploy the project.

## Live Demo

A live demo of the project is available at: [Vercel Deployment Link](https://your-vercel-deployment-url.vercel.app)

## Notes on server-side DataGrid

- The DataTable component builds requests to `http://localhost:4000/characters` with query params:
  - `_page` (1-based), `_limit`
  - `_sort` and `_order`
  - `q` for full-text search
  - repeated `health` params for multi-select filter (e.g. `health=Healthy&health=Injured`)
- json-server returns `x-total-count` header which the app uses for pagination.

## Files changed / important files

- `src/components/DataTable.tsx` — server-side example + UI controls for sorting/pagination
- `scripts/generate-db.ts` — creates `server/db.json` with 600 rows
- `server/db.json` — included so app runs without generation
- `src/components/DataTable.test.tsx` — Vitest tests that mock axios

## Troubleshooting

- If `npm run generate-db` complains about ts-node/tsx:
  - Ensure dev dependency `tsx` is installed: `npm install -D tsx`
  - Or run `node scripts/generate-db.js` after converting the script to JS.

If you want CI, Docker, or a deployed demo, tell me and I'll add it.

