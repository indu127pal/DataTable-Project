import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Use a deterministic path so the bundler on Vercel includes api/db.json
const dbFile = path.join(process.cwd(), 'api', 'db.json');

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

const app = jsonServer.create();
app.use(middlewares);
app.use(router);

export default function handler(req, res) {
  // Ensure the router receives the path without the /api prefix
  try {
    req.url = (req.url || '').replace(/^\/api/, '') || '/';
    app(req, res);
  } catch (err) {
    // Log error for Vercel logs and return 500
    console.error('json-server handler error', err);
    res.statusCode = 500;
    res.end('Internal Server Error');
  }
}
