-- Phase 23: Security Hardening

-- Enable Row Level Security (RLS) on sensitive sync tables
-- This ensures that only authorized clients (or the server via service_role) can access these tables.
-- Since the server uses the service_role key, it naturally bypasses RLS.
ALTER TABLE public.website_sync_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.website_sync_logs ENABLE ROW LEVEL SECURITY;

-- Note: We are explicitly NOT adding any policies for 'anon' or 'authenticated' users.
-- This creates a default-deny situation for all public clients.
-- Only the backend Node.js environment with the SUPABASE_SERVICE_ROLE_KEY can read/write to these tables.
