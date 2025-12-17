import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use a deterministic path so the bundler on Vercel includes api/db.json
const dbFile = path.join(process.cwd(), 'api', 'db.json');

import fs from 'fs';

let app;

function createApp() {
  if (app) return app;
  try {
    console.log('Creating json-server app. cwd=%s, dbFile=%s', process.cwd(), dbFile);
    if (!fs.existsSync(dbFile)) {
      throw new Error(`db.json not found at ${dbFile}`);
    }
    const router = jsonServer.router(dbFile);
    const middlewares = jsonServer.defaults();

    app = jsonServer.create();
    app.use(middlewares);
    app.use(router);
    console.log('json-server app created successfully');
    return app;
  } catch (err) {
    console.error('Error creating json-server app', err);
    throw err;
  }
}

export default function handler(req, res) {
  // Ensure the router receives the path without the /api prefix
  try {
    const a = createApp();
    console.log('Handling request', req.method, req.url);
    // For Vercel, strip the /api prefix so json-server routes match
    req.url = (req.url || '').replace(/^\/api/, '') || '/';
    a(req, res);
  } catch (err) {
    // Log error for Vercel logs and return 500
    console.error('json-server handler error', err);
    res.statusCode = 500;
    res.end('Internal Server Error: ' + (err && err.message ? err.message : 'unknown'));
  }
}
