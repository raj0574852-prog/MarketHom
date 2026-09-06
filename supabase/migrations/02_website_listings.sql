-- Create website_listings table
CREATE TABLE website_listings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    domain TEXT NOT NULL,
    website_url TEXT NOT NULL,
    logo_url TEXT,
    featured_image_url TEXT,
    
    short_description TEXT,
    long_description TEXT,
    editorial_description TEXT,
    audience_description TEXT,
    
    category_id TEXT NOT NULL,
    country TEXT,
    location TEXT,
    language TEXT,
    
    content_type TEXT,
    platform_type TEXT,
    
    price NUMERIC,
    discount_price NUMERIC,
    currency TEXT DEFAULT 'USD',
    
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    featured BOOLEAN DEFAULT false,
    
    last_verified_at TIMESTAMP WITH TIME ZONE,
    verification_status TEXT CHECK (verification_status IN ('verified', 'needs_review', 'outdated')),
    
    accepted_niches TEXT[],
    rejected_niches TEXT[],
    
    turnaround_time TEXT,
    article_length TEXT,
    link_validity TEXT,
    publication_type TEXT,
    
    max_dofollow_links INTEGER,
    max_nofollow_links INTEGER,
    
    content_review TEXT,
    image_requirements TEXT,
    
    editorial_review TEXT,
    ai_content_policy TEXT,
    link_policy TEXT,
    anchor_text_policy TEXT,
    destination_url_policy TEXT,
    
    original_content_required BOOLEAN DEFAULT false,
    sponsored_label BOOLEAN DEFAULT false,
    disclosure_required BOOLEAN DEFAULT false,
    
    seo_title TEXT,
    seo_description TEXT,
    canonical_url TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create website_metrics table
CREATE TABLE website_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    website_listing_id UUID REFERENCES website_listings(id) ON DELETE CASCADE,
    metric_type TEXT NOT NULL CHECK (metric_type IN (
        'DA', 
        'PA', 
        'DR', 
        'ORGANIC_TRAFFIC', 
        'SEMRUSH_AUTHORITY', 
        'SPAM_SCORE', 
        'TOTAL_BACKLINKS', 
        'REFERRING_DOMAINS', 
        'AHREFS_TRAFFIC'
    )),
    value NUMERIC,
    unit TEXT,
    provider TEXT,
    source_url TEXT,
    checked_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create indexes
CREATE INDEX idx_website_listings_slug ON website_listings(slug);
CREATE INDEX idx_website_listings_status ON website_listings(status);
CREATE INDEX idx_website_listings_category_id ON website_listings(category_id);
CREATE INDEX idx_website_listings_featured ON website_listings(featured);
CREATE INDEX idx_website_listings_last_verified_at ON website_listings(last_verified_at);

CREATE INDEX idx_website_metrics_listing_id ON website_metrics(website_listing_id);
CREATE INDEX idx_website_metrics_metric_type ON website_metrics(metric_type);

-- Create trigger for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_website_listings_updated_at
    BEFORE UPDATE ON website_listings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security (RLS)
ALTER TABLE website_listings ENABLE ROW LEVEL SECURITY;
ALTER TABLE website_metrics ENABLE ROW LEVEL SECURITY;

-- Public can read published listings
CREATE POLICY "Public can read published website listings"
ON website_listings
FOR SELECT
TO public
USING (status = 'published');

-- Public can read metrics for published listings
CREATE POLICY "Public can read metrics of published listings"
ON website_metrics
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 
        FROM website_listings 
        WHERE website_listings.id = website_metrics.website_listing_id 
        AND website_listings.status = 'published'
    )
);

-- Note: Admin mutations (INSERT/UPDATE/DELETE) will bypass RLS by using the SERVICE_ROLE_KEY.
