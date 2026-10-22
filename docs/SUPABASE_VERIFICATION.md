# Supabase Database Access & RLS Verification Guide

This guide details the database access controls, Row Level Security (RLS) policies, and deployment verification steps for the QA Nexus Autonomous repository.

## Inventory of Database Objects

- **Table**: `public.qa_nexus_sessions`
  - `id` (UUID, Primary Key)
  - `user_id` (UUID, Foreign Key to `auth.users(id)`)
  - `session_key` (TEXT, Unique)
  - `state` (JSONB, Application state)
  - `created_at` (TIMESTAMPTZ)
  - `updated_at` (TIMESTAMPTZ)

## Repository Migration Evidence

The versioned SQL migration file is stored in:
`supabase/migrations/20260401000000_create_qa_nexus_sessions.sql`

It enforces:
1. Row Level Security via `ALTER TABLE public.qa_nexus_sessions ENABLE ROW LEVEL SECURITY;`
2. Explicit `SELECT`, `INSERT`, `UPDATE`, and `DELETE` policies tied to `auth.uid() = user_id`.

## Deployment Verification Checklist (Administrator Actions)

When deploying to a live Supabase project, administrators must perform the following checks:

1. **Apply Migration**:
   ```bash
   supabase db push
   ```
2. **Verify RLS Status in Supabase Dashboard**:
   - Go to **Table Editor** -> `qa_nexus_sessions`.
   - Confirm RLS badge shows **"RLS Enabled"**.
3. **Verify Policies**:
   - Confirm policies `"Users can select own session data"`, `"Users can insert own session data"`, `"Users can update own session data"`, and `"Users can delete own session data"` are active.
4. **Service Role Key Safety**:
   - Confirm `SUPABASE_SERVICE_ROLE_KEY` is NOT set in client environment variables.
   - Client applications must only use `VITE_SUPABASE_ANON_KEY`.
