-- Add selling price and markup percentage columns to website_listings
ALTER TABLE website_listings
ADD COLUMN IF NOT EXISTS content_placement_selling_price NUMERIC,
ADD COLUMN IF NOT EXISTS content_placement_markup_percentage NUMERIC;
