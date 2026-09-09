-- Create website_faqs table
CREATE TABLE IF NOT EXISTS website_faqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    website_listing_id UUID REFERENCES website_listings(id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
);

-- Add updated_at trigger
CREATE TRIGGER handle_updated_at_website_faqs
    BEFORE UPDATE ON website_faqs
    FOR EACH ROW
    EXECUTE FUNCTION handle_updated_at();

-- Enable RLS
ALTER TABLE website_faqs ENABLE ROW LEVEL SECURITY;

-- Policies for website_faqs
-- 1. Public can view all FAQs
CREATE POLICY "Public can view website FAQs" 
    ON website_faqs
    FOR SELECT
    USING (true);

-- 2. Admins can manage FAQs
CREATE POLICY "Admins can manage website FAQs" 
    ON website_faqs
    FOR ALL
    USING (
        auth.role() = 'authenticated' 
        AND auth.uid() IN (SELECT id FROM admin_users)
    );
