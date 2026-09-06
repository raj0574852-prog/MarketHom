-- Seed data for Channillo.com

DO $$
DECLARE
  new_listing_id UUID;
BEGIN
  INSERT INTO website_listings (
    name,
    domain,
    slug,
    website_url,
    category_id,
    price,
    currency,
    location,
    language,
    link_validity,
    max_dofollow_links,
    publication_type,
    accepted_niches,
    last_verified_at,
    status
  ) VALUES (
    'Channillo',
    'channillo.com',
    'channillo.com',
    'https://channillo.com',
    'General',
    23,
    'USD',
    'Worldwide',
    'English',
    'Permanent',
    1,
    'Guest Post / Sponsored',
    ARRAY['General Niches', 'Adult / Dating', 'Casino / CBD / Crypto'],
    '2026-09-06 00:00:00+00',
    'published'
  ) RETURNING id INTO new_listing_id;

  INSERT INTO website_metrics (website_listing_id, metric_type, value, unit) VALUES
    (new_listing_id, 'DA', 41, NULL),
    (new_listing_id, 'PA', 41, NULL),
    (new_listing_id, 'DR', 41, NULL),
    (new_listing_id, 'SEMRUSH_AUTHORITY', 14, NULL),
    (new_listing_id, 'SPAM_SCORE', 58, '%'),
    (new_listing_id, 'ORGANIC_TRAFFIC', NULL, NULL),
    (new_listing_id, 'TOTAL_BACKLINKS', NULL, NULL),
    (new_listing_id, 'REFERRING_DOMAINS', NULL, NULL),
    (new_listing_id, 'AHREFS_TRAFFIC', NULL, NULL);
    
END $$;
