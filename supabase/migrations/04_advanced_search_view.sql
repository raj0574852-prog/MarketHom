-- Create view to flatten website metrics into columns for efficient filtering
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

-- Ensure RLS isn't completely bypassed if accessed by authenticated users, 
-- but this is primarily for server-side read operations.
-- For standard Supabase usage, Views can bypass RLS if not created with security invoker.
-- We want this accessible by the service_role key anyway.
