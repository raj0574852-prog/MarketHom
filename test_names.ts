import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';

loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!supabaseUrl || !supabaseKey) {
  console.error("Missing credentials");
  process.exit(1);
}
const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const domains = [
    'globenewswire.com',
    'finance.yahoo.com',
    'windstream.net',
    'einpresswire.com',
    'barchart.com',
    'apnews.com',
    'newsbreak.com',
    'markets.chroniclejournal.com',
    'investing.com',
    'usatoday.com',
    'theglobeandmail.com',
    'manilatimes.net',
    'markets.businessinsider.com',
    'streetinsider.com',
    'reuters.com',
    'nagpurtoday.in',
    '24-7pressrelease.com',
    'bhaskar.com',
    'entrepreneur.com'
  ];

  const { data, error } = await supabase
    .from('website_listings')
    .select('domain, name, logo_url')
    .in('domain', domains);
    
  if (error) {
    console.error(error);
  } else {
    console.table(data);
  }
}

test();
