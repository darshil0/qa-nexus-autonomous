import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { handleGeminiApiRequest } from './geminiHandler';
import { logger } from '../utils/logger';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
const DIST_DIR = path.resolve(__dirname, '../../dist');

const mimeTypes: Record<string, string> = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2'
};

export const server = http.createServer((req, res) => {
  const urlPath = req.url?.split('?')[0] || '/';

  // Handle Gemini Server API Proxy
  if (urlPath === '/api/gemini/generate') {
    void handleGeminiApiRequest(req, res);
    return;
  }

  // Serve static dist bundle in production
  if (fs.existsSync(DIST_DIR)) {
    let filePath = path.join(DIST_DIR, urlPath === '/' ? 'index.html' : urlPath);
    if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
      filePath = path.join(DIST_DIR, 'index.html');
    }

    const ext = path.extname(filePath);
    const contentType = mimeTypes[ext] || 'application/octet-stream';

    try {
      const content = fs.readFileSync(filePath);
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content);
      return;
    } catch (err) {
      logger.error('Error serving production file:', err);
    }
  }

  // Fallback
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not found' }));
});

if (process.argv[1] && process.argv[1].endsWith('index.ts')) {
  server.listen(PORT, () => {
    logger.info(`QA Nexus Production Server running at http://localhost:${PORT}`);
    logger.info(`Gemini API Endpoint active at /api/gemini/generate`);
  });
}
