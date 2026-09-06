-- Add new columns for Google Sheets sync
ALTER TABLE website_listings
ADD COLUMN IF NOT EXISTS source_hash TEXT,
ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS last_source_change_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS is_in_google_sheet BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_listed BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';

-- Recreate view to include is_listed so we can filter on the public marketplace
DROP VIEW IF EXISTS website_listings_search;
CREATE OR REPLACE VIEW website_listings_search AS
SELECT 
    wl.*,
    MAX(CASE WHEN wm.metric_type = 'DA' THEN wm.value END) as da,
    MAX(CASE WHEN wm.metric_type = 'DR' THEN wm.value END) as dr,
    MAX(CASE WHEN wm.metric_type = 'AHREFS_TRAFFIC' THEN wm.value END) as ahrefs_traffic,
    MAX(CASE WHEN wm.metric_type = 'SEMRUSH_AUTHORITY' THEN wm.value END) as semrush_traffic
FROM website_listings wl
LEFT JOIN website_metrics wm ON wl.id = wm.website_listing_id
GROUP BY wl.id;

-- Ensure domain is unique
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'website_listings_domain_key') THEN
    ALTER TABLE website_listings ADD CONSTRAINT website_listings_domain_key UNIQUE (domain);
  END IF;
END $$;

-- Create website_sync_settings table
CREATE TABLE IF NOT EXISTS website_sync_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    spreadsheet_id TEXT NOT NULL,
    sheet_name TEXT,
    auto_sync_enabled BOOLEAN DEFAULT true,
    auto_publish_new_sites BOOLEAN DEFAULT false,
    archive_missing_sites BOOLEAN DEFAULT true,
    last_successful_sync TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Seed default settings if empty
INSERT INTO website_sync_settings (spreadsheet_id, auto_sync_enabled, auto_publish_new_sites, archive_missing_sites)
SELECT '1ZWBXmVWZyIiBdM7gTU4QORmNp5TsOJWKU0ehBpysKbY', true, false, true
WHERE NOT EXISTS (SELECT 1 FROM website_sync_settings);

-- Create website_sync_logs table
CREATE TABLE IF NOT EXISTS website_sync_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    sync_type TEXT NOT NULL CHECK (sync_type IN ('manual', 'automatic')),
    status TEXT NOT NULL CHECK (status IN ('running', 'completed', 'partial', 'failed')),
    started_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_ms INTEGER,
    total_rows INTEGER DEFAULT 0,
    created_count INTEGER DEFAULT 0,
    updated_count INTEGER DEFAULT 0,
    unchanged_count INTEGER DEFAULT 0,
    archived_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    error_summary TEXT
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_website_sync_settings_updated_at') THEN
    CREATE TRIGGER update_website_sync_settings_updated_at
        BEFORE UPDATE ON website_sync_settings
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  END IF;
END $$;
