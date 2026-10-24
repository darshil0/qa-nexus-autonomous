# Production Deployment Guide

**Version**: 3.3.0
**Last Updated**: October 24, 2026

This document describes how to deploy QA Nexus Autonomous in a production environment with its secure server-side Gemini API proxy.

## Architecture & Server Runtime

In production, the application consists of two parts:
1. **Frontend Client Bundle**: Compiled static assets built via `npm run build` into `dist/`.
2. **Server API Endpoint**: Serves `/api/gemini/generate` to securely execute Gemini model calls on behalf of the client using server-only environment variables.

### Route Mapping

- `POST /api/gemini/generate`: Gemini API endpoint proxy.
- `GET /*`: Serves static frontend assets (`dist/index.html` fallback).

## Environment Variables

Configure the following environment variables on your production hosting platform (e.g. Vercel, Netlify, Render, AWS ECS, or Node.js server):

| Variable | Type | Required | Description |
|---|---|---|---|
| `GEMINI_API_KEY` | Private (Server-only) | **Yes** | Google Gemini API key used by `/api/gemini/generate`. Never expose to client. |
| `ALLOWED_ORIGIN` | Private (Server-only) | Optional | Allowed CORS origin (defaults to same-origin). |
| `PORT` | Private (Server-only) | Optional | Port for production server (defaults to 3000). |
| `VITE_SUPABASE_URL` | Public (Client-side) | Optional | Supabase URL for state persistence. |
| `VITE_SUPABASE_ANON_KEY` | Public (Client-side) | Optional | Supabase Anonymous Key for state persistence. |

> ⚠️ **Security Policy**: `GEMINI_API_KEY` must **never** be prefixed with `VITE_` or exposed in client environment configuration.

## Deployment Options

### Option A: Node.js / Docker Deployment

1. Build production bundle:
   ```bash
   npm run build
   ```
2. Start production preview/server:
   ```bash
   npm run preview
   ```
   or run standalone Node entrypoint (`src/server/index.ts`).

### Option B: Serverless / Cloud Functions (Vercel / Netlify)

1. Map `/api/gemini/generate` to `src/server/geminiHandler.ts` inside a serverless function handler (e.g. `/api/gemini/generate.ts`).
2. Add `GEMINI_API_KEY` to Serverless Environment Secrets.
