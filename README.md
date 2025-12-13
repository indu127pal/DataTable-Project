# DataTable FE - Final (Vite + MUI + DataGrid + Storybook + Vitest)

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

2. Optional: Create a `.env` from `.env.example` for local overrides
```bash
cp .env.example .env
# optionally edit .env and set VITE_API_URL if you run json-server on a custom port
```

3. Generate sample DB and start json-server (API: http://localhost:4000)
```bash
npm run generate-db
npm run json-server
```

4. Run the dev server (Vite)
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

If you want to use a custom backend:

- Add a `VITE_API_URL` environment variable in Vercel's Project Settings (Environment Variables) and set it to the API base URL (e.g., `https://your-custom-api.com`).
- If using the built-in `json-server` in `api/server.js`, no `VITE_API_URL` is required and the frontend can call `/api/characters` directly.

## Live Demo

A live demo of the project is available at: [Vercel Deployment Link](https://your-vercel-deployment-url.vercel.app)

## Production API (vercel)

After deploying to Vercel using the included `api/server.js` handler, your `json-server` is available at `/api`.

- Example endpoints:
  - List characters (first page): `/api/characters?_page=1&_limit=25`
  - Search by text: `/api/characters?q=naruto`
  - Filter by `health`: `/api/characters?health=Healthy&health=Injured`

The app constructs the characters endpoint from `VITE_API_URL` if set, otherwise it falls back to `/api/characters`.

- To configure your production API base in Vercel, set an Environment Variable `VITE_API_URL` to the API base (not the characters path). Example:

  - `VITE_API_URL=https://data-table-project-six.vercel.app/api`

If you set `VITE_API_URL` to a full endpoint that already ends with `/characters` it will still be used correctly.

You can test the API from your browser or using `curl`:

```bash
curl 'https://data-table-project-six.vercel.app/api/characters?_page=1&_limit=25'
```

## Notes on server-side DataGrid

- The DataTable component builds requests to `${VITE_API_URL}/characters` when `VITE_API_URL` is set, otherwise it defaults to `/api/characters`.
  - For local development, set `VITE_API_URL=http://localhost:4000` (or run `npm run json-server` and leave this unset to use `/api/` proxied to `http://localhost:4000` via Vite config).
  - In production (when deployed on Vercel), the `json-server` is available as a serverless function at `/api` (requests go to `/api/characters`).
- Query params supported:
  - `_page` (1-based), `_limit`
  - `_sort` and `_order`
  - `q` for full-text search
  - repeated `health` params for multi-select filter (e.g. `health=Healthy&health=Injured`)
- `json-server` returns `x-total-count` header which the app uses for pagination.
- The project includes a serverless handler at `api/server.js` and a `vercel.json` rewrite so `/api/*` is served by `json-server` in production.

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

