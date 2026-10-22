-- Migration: Create qa_nexus_sessions table with Row Level Security (RLS)
-- Version: 20260401000000

-- Create table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.qa_nexus_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    session_key TEXT UNIQUE NOT NULL DEFAULT 'default_session',
    state JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.qa_nexus_sessions ENABLE ROW LEVEL SECURITY;

-- Create policy for reading session data (User can read own sessions or matching session key)
CREATE POLICY "Users can select own session data"
    ON public.qa_nexus_sessions
    FOR SELECT
    USING (
        auth.uid() = user_id
        OR user_id IS NULL
    );

-- Create policy for inserting session data
CREATE POLICY "Users can insert own session data"
    ON public.qa_nexus_sessions
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id
        OR user_id IS NULL
    );

-- Create policy for updating session data
CREATE POLICY "Users can update own session data"
    ON public.qa_nexus_sessions
    FOR UPDATE
    USING (
        auth.uid() = user_id
        OR user_id IS NULL
    )
    WITH CHECK (
        auth.uid() = user_id
        OR user_id IS NULL
    );

-- Create policy for deleting session data
CREATE POLICY "Users can delete own session data"
    ON public.qa_nexus_sessions
    FOR DELETE
    USING (
        auth.uid() = user_id
        OR user_id IS NULL
    );

-- Index for performance
CREATE INDEX IF NOT EXISTS idx_qa_nexus_sessions_user_id ON public.qa_nexus_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_qa_nexus_sessions_updated_at ON public.qa_nexus_sessions(updated_at DESC);
