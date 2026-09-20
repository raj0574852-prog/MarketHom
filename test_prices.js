const { loadEnvConfig } = require('@next/env');
loadEnvConfig(process.cwd());
const { createClient } = require('@supabase/supabase-js');
const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
async function run() {
  const domains = ['finance.yahoo.com', 'bhaskar.com', 'fightmatrix.com', 'entrepreneur.com', 'reuters.com'];
  const { data } = await supabase.from('website_listings').select('domain, price, content_placement_price, content_placement_selling_price').in('domain', domains);
  console.log(JSON.stringify(data, null, 2));
}
run();
