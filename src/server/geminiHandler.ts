import type { IncomingMessage, ServerResponse } from 'node:http';
import { GoogleGenAI } from "@google/genai";

/**
 * Authoritative Server-Side Gemini Model Allowlist
 * - gemini-2.5-pro-preview-05-06: High-reasoning model for requirements analysis and test design.
 * - gemini-2.5-flash-preview-04-17: High-speed model for test execution simulation.
 */
export const ALLOWED_MODELS = new Set([
  "gemini-2.5-pro-preview-05-06",
  "gemini-2.5-flash-preview-04-17"
]);

const MAX_PAYLOAD_BYTES = 1024 * 1024; // 1MB limit

// In-memory rate limiter per client IP: 20 requests per minute
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 20;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  if (!record || now > record.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  record.count++;
  if (record.count > MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  return false;
}

export function resetRateLimitMap(): void {
  rateLimitMap.clear();
}

export interface GeminiApiRequestBody {
  model: string;
  contents: string;
  config?: {
    systemInstruction?: string;
    thinkingConfig?: { thinkingBudget?: number };
    responseMimeType?: string;
    temperature?: number;
    responseSchema?: Record<string, unknown>;
  };
}

export async function handleGeminiApiRequest(
  req: IncomingMessage,
  res: ServerResponse
): Promise<void> {
  // CORS check & headers
  const origin = req.headers.origin;
  const allowedOrigin = process.env.ALLOWED_ORIGIN || origin || '*';

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Session-Token');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.end(JSON.stringify({ error: 'Method not allowed' }));
    return;
  }

  // Authentication / Authorization header enforcement
  const sessionToken = req.headers['x-session-token'] || req.headers['authorization'];
  if (!sessionToken) {
    res.statusCode = 401;
    res.end(JSON.stringify({ error: 'Unauthorized: Missing X-Session-Token or Authorization header.' }));
    return;
  }

  // Rate limiting check
  const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || 'unknown';
  if (isRateLimited(clientIp)) {
    res.statusCode = 429;
    res.setHeader('Retry-After', '60');
    res.end(JSON.stringify({ error: 'Rate limit exceeded. Please wait a minute before retrying.' }));
    return;
  }

  // API Key check (server-side environment variable)
  const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    res.statusCode = 500;
    res.end(JSON.stringify({ error: 'Server configuration error: GEMINI_API_KEY is not set.' }));
    return;
  }

  // Read request body with payload limit
  try {
    const bodyText = await new Promise<string>((resolve, reject) => {
      let data = '';
      let bytes = 0;

      req.on('data', (chunk: Buffer) => {
        bytes += chunk.length;
        if (bytes > MAX_PAYLOAD_BYTES) {
          req.destroy();
          reject(new Error('Payload too large'));
          return;
        }
        data += chunk.toString('utf-8');
      });

      req.on('end', () => resolve(data));
      req.on('error', (err) => reject(err));
    });

    let body: GeminiApiRequestBody;
    try {
      body = JSON.parse(bodyText) as GeminiApiRequestBody;
    } catch {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid JSON payload.' }));
      return;
    }

    if (!body || !body.model || !body.contents) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: 'Invalid request: model and contents are required.' }));
      return;
    }

    if (!ALLOWED_MODELS.has(body.model)) {
      res.statusCode = 400;
      res.end(JSON.stringify({ error: `Invalid model: '${body.model}'. Allowed models are: ${Array.from(ALLOWED_MODELS).join(', ')}` }));
      return;
    }

    const ai = new GoogleGenAI({ apiKey });

    // Upstream call with 30s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 30000);

    try {
      const aiResponse = await Promise.race([
        ai.models.generateContent({
          model: body.model,
          contents: body.contents,
          config: body.config
        }),
        new Promise<never>((_, reject) => {
          controller.signal.addEventListener('abort', () => reject(new Error('AbortError')));
        })
      ]);

      clearTimeout(timeoutId);

      let responseText = '';
      const resObj = aiResponse as unknown as { text?: string | (() => string) };
      if (typeof resObj.text === 'function') {
        responseText = resObj.text();
      } else if (typeof resObj.text === 'string') {
        responseText = resObj.text;
      } else if (aiResponse.candidates?.[0]?.content?.parts?.[0]?.text) {
        responseText = aiResponse.candidates[0].content.parts[0].text;
      }

      res.statusCode = 200;
      res.end(JSON.stringify({
        text: responseText,
        rawResponse: aiResponse
      }));
    } catch (upstreamErr: unknown) {
      clearTimeout(timeoutId);
      const isAbort = upstreamErr instanceof Error && (upstreamErr.name === 'AbortError' || upstreamErr.message === 'AbortError');
      res.statusCode = isAbort ? 504 : 502;
      const message = isAbort ? 'Upstream request timed out.' : 'Error calling Gemini API upstream.';
      res.end(JSON.stringify({ error: message }));
    }

  } catch (err) {
    res.statusCode = 400;
    const msg = err instanceof Error ? err.message : 'Invalid request payload.';
    res.end(JSON.stringify({ error: msg }));
  }
}
