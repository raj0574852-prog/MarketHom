const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function run() {
  const domains = ['reuters.com', 'bhaskar.com', 'nagpurtoday.in', '24-7pressrelease.com', 'entrepreneur.com'];
  const { data, error } = await supabase
    .from('website_listings')
    .select('domain, logo_url')
    .in('domain', domains);
    
  if (error) console.error(error);
  else console.log(JSON.stringify(data, null, 2));
}

run();
