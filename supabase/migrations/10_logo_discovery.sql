-- Add tracking columns for logo discovery
ALTER TABLE website_listings
ADD COLUMN IF NOT EXISTS logo_source VARCHAR DEFAULT NULL,
ADD COLUMN IF NOT EXISTS logo_discovery_status VARCHAR DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS logo_last_checked_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS logo_processing_started_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS logo_discovery_attempts INTEGER DEFAULT 0;

-- Partial index for fast queue selection (avoids full table scan)
CREATE INDEX IF NOT EXISTS idx_logo_discovery_queue 
ON website_listings (logo_discovery_status, logo_last_checked_at)
WHERE logo_discovery_status IN ('pending', 'failed', 'processing');

-- RPC for atomic job claiming using SKIP LOCKED
CREATE OR REPLACE FUNCTION claim_logo_discovery_jobs(batch_limit INTEGER)
RETURNS SETOF website_listings
LANGUAGE sql
VOLATILE
AS $$
  UPDATE website_listings
  SET logo_discovery_status = 'processing',
      logo_processing_started_at = NOW()
  WHERE id IN (
    SELECT id 
    FROM website_listings
    WHERE logo_discovery_status = 'pending'
       OR (logo_discovery_status = 'processing' AND logo_processing_started_at < NOW() - INTERVAL '15 minutes')
       OR (logo_discovery_status = 'failed' AND logo_last_checked_at < NOW() - (POWER(2, LEAST(logo_discovery_attempts, 8)) * INTERVAL '1 hour'))
    ORDER BY logo_last_checked_at ASC NULLS FIRST
    LIMIT batch_limit
    FOR UPDATE SKIP LOCKED
  )
  RETURNING *;
$$;
