-- Migration 12: Marketplace Leads Table & Security Hardening
-- Dedicated table for publisher placement inquiries from the marketplace

CREATE TABLE IF NOT EXISTS public.marketplace_leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  email TEXT,
  whatsapp TEXT,
  message TEXT,
  publisher_id TEXT,
  publisher_domain TEXT NOT NULL,
  listing_url TEXT NOT NULL,
  price NUMERIC(10,2),
  currency TEXT DEFAULT 'USD',
  source TEXT DEFAULT 'marketplace',
  status TEXT NOT NULL DEFAULT 'New',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  
  -- Enforce at-least-one-contact-method rule at DB level
  CONSTRAINT at_least_one_contact CHECK (
    (email IS NOT NULL AND trim(email) <> '') OR 
    (whatsapp IS NOT NULL AND trim(whatsapp) <> '')
  ),
  
  -- Enforce valid workflow statuses
  CONSTRAINT valid_marketplace_lead_status CHECK (
    status IN ('New', 'Contacted', 'In Discussion', 'Converted', 'Closed')
  )
);

-- Optimize search and filtering indexes
CREATE INDEX IF NOT EXISTS idx_marketplace_leads_status ON public.marketplace_leads(status);
CREATE INDEX IF NOT EXISTS idx_marketplace_leads_created_at ON public.marketplace_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_marketplace_leads_domain ON public.marketplace_leads(publisher_domain);
CREATE INDEX IF NOT EXISTS idx_marketplace_leads_email ON public.marketplace_leads(email);

-- Enable Row Level Security (RLS)
ALTER TABLE public.marketplace_leads ENABLE ROW LEVEL SECURITY;

-- Note: We intentionally do NOT grant SELECT, UPDATE, or DELETE policies to 'anon' or public users.
-- All operations are performed server-side using the SUPABASE_SERVICE_ROLE_KEY or validated server endpoints.
-- This ensures that public visitors CANNOT read, enumerate, modify, or delete any leads.
