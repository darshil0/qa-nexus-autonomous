import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { handleGeminiApiRequest, resetRateLimitMap } from '@/server/geminiHandler';
import { EventEmitter } from 'node:events';
import type { IncomingMessage, ServerResponse } from 'node:http';

function createMockReqRes(options: {
  method?: string;
  url?: string;
  headers?: Record<string, string>;
}) {
  const req = new EventEmitter() as unknown as IncomingMessage;
  req.method = options.method || 'POST';
  req.url = options.url || '/api/gemini/generate';
  req.headers = options.headers || {};
  req.socket = { remoteAddress: '127.0.0.1' } as unknown as IncomingMessage['socket'];

  let statusCode = 200;
  const responseHeaders: Record<string, string> = {};
  let responseData = '';

  const res = {
    get statusCode() {
      return statusCode;
    },
    set statusCode(code: number) {
      statusCode = code;
    },
    setHeader(name: string, value: string) {
      responseHeaders[name.toLowerCase()] = value;
    },
    end(chunk?: string) {
      if (chunk) { responseData += chunk; }
    }
  } as unknown as ServerResponse;

  return { req, res, getStatus: () => statusCode, getHeaders: () => responseHeaders, getData: () => responseData };
}

describe('Gemini Server Handler - Authentication & Abuse Protection', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    vi.resetModules();
    resetRateLimitMap();
    process.env = { ...originalEnv, GEMINI_API_KEY: 'test_server_gemini_key_12345' };
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.restoreAllMocks();
  });

  it('rejects non-POST methods with 405', async () => {
    const { req, res, getStatus } = createMockReqRes({ method: 'GET' });
    await handleGeminiApiRequest(req, res);
    expect(getStatus()).toBe(405);
  });

  it('handles OPTIONS preflight CORS requests with 204', async () => {
    const { req, res, getStatus } = createMockReqRes({ method: 'OPTIONS' });
    await handleGeminiApiRequest(req, res);
    expect(getStatus()).toBe(204);
  });

  it('rejects requests missing session token or authorization header with 401', async () => {
    const { req, res, getStatus, getData } = createMockReqRes({ method: 'POST', headers: {} });
    await handleGeminiApiRequest(req, res);
    expect(getStatus()).toBe(401);
    expect(getData()).toContain('Unauthorized');
  });

  it('returns 500 when GEMINI_API_KEY is missing on server', async () => {
    delete process.env.GEMINI_API_KEY;
    delete process.env.VITE_GEMINI_API_KEY;

    const { req, res, getStatus, getData } = createMockReqRes({
      method: 'POST',
      headers: { 'x-session-token': 'valid-token' }
    });
    await handleGeminiApiRequest(req, res);
    expect(getStatus()).toBe(500);
    expect(getData()).toContain('GEMINI_API_KEY is not set');
  });

  it('rejects disallowed models with 400', async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-session-token': 'valid-token' }
    });

    const promise = handleGeminiApiRequest(req, res);
    req.emit('data', Buffer.from(JSON.stringify({
      model: 'unauthorized-model-v1',
      contents: 'Hello'
    })));
    req.emit('end');

    await promise;
    expect(getStatus()).toBe(400);
    expect(getData()).toContain('Invalid model');
  });

  it('rejects malformed JSON payloads with 400', async () => {
    const { req, res, getStatus, getData } = createMockReqRes({
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-session-token': 'valid-token' }
    });

    const promise = handleGeminiApiRequest(req, res);
    req.emit('data', Buffer.from('not-valid-json{{{'));
    req.emit('end');

    await promise;
    expect(getStatus()).toBe(400);
    expect(getData()).toContain('Invalid JSON payload');
  });

  it('enforces rate limits after 20 requests per minute per IP with 429', async () => {
    for (let i = 0; i < 20; i++) {
      const { req, res } = createMockReqRes({
        method: 'POST',
        headers: { 'x-session-token': 'token' }
      });
      const p = handleGeminiApiRequest(req, res);
      req.emit('data', Buffer.from(JSON.stringify({ model: 'gemini-2.5-pro-preview-05-06', contents: 'test' })));
      req.emit('end');
      await p;
    }

    const { req, res, getStatus, getData } = createMockReqRes({
      method: 'POST',
      headers: { 'x-session-token': 'token' }
    });
    await handleGeminiApiRequest(req, res);
    expect(getStatus()).toBe(429);
    expect(getData()).toContain('Rate limit exceeded');
  });
});
