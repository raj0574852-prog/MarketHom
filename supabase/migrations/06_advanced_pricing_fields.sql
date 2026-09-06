-- Add advanced pricing and deal metrics columns to website_listings
ALTER TABLE website_listings
ADD COLUMN IF NOT EXISTS sample_link TEXT,
ADD COLUMN IF NOT EXISTS total_deals INTEGER,
ADD COLUMN IF NOT EXISTS content_placement_price NUMERIC,
ADD COLUMN IF NOT EXISTS link_insert_price NUMERIC,
ADD COLUMN IF NOT EXISTS cbd_content_placement_price NUMERIC,
ADD COLUMN IF NOT EXISTS cbd_content_creation_placement_price NUMERIC,
ADD COLUMN IF NOT EXISTS cbd_link_insert_price NUMERIC,
ADD COLUMN IF NOT EXISTS adult_content_placement_price NUMERIC,
ADD COLUMN IF NOT EXISTS adult_content_creation_placement_price NUMERIC,
ADD COLUMN IF NOT EXISTS adult_link_insert_price NUMERIC;