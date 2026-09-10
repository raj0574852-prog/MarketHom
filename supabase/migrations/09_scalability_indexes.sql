-- Migration 09_scalability_indexes.sql
-- Additive indexes for marketplace scalability

-- 1. Enable pg_trgm extension for scalable ILIKE searches
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Create GIN Trigram indexes on domain and name for fast search
CREATE INDEX IF NOT EXISTS idx_website_listings_domain_trgm 
ON website_listings USING gin (domain gin_trgm_ops);

CREATE INDEX IF NOT EXISTS idx_website_listings_name_trgm 
ON website_listings USING gin (name gin_trgm_ops);

-- 3. Create a composite B-Tree index for the public marketplace default filter + order
-- This allows Postgres to avoid a separate sort phase for the default query.
CREATE INDEX IF NOT EXISTS idx_marketplace_main 
ON website_listings (status, is_listed, featured DESC);

-- 4. Create an index on created_at for the Admin API sorting
CREATE INDEX IF NOT EXISTS idx_website_listings_created_at 
ON website_listings (created_at DESC);

-- Note: 'is_listed' is implicitly covered in idx_marketplace_main for the standard marketplace queries.
