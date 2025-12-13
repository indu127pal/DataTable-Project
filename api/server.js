import { createRequire } from 'module';
import path from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
const jsonServer = require('json-server');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbFile = path.join(__dirname, '..', 'server', 'db.json');

const router = jsonServer.router(dbFile);
const middlewares = jsonServer.defaults();

const app = jsonServer.create();
app.use(middlewares);
app.use(router);

export default function handler(req, res) {
  // Ensure the router receives the path without the /api prefix
  req.url = (req.url || '').replace(/^\/api/, '') || '/';
  app(req, res);
}
