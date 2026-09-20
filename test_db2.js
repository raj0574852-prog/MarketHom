const fs = require('fs');
const { createClient } = require('@supabase/supabase-js');

const envFile = fs.readFileSync('.env.local', 'utf8');
const lines = envFile.split('\n');
let supabaseUrl = '';
let supabaseKey = '';

lines.forEach(line => {
  if (line.startsWith('NEXT_PUBLIC_SUPABASE_URL=')) supabaseUrl = line.split('=')[1].trim();
  if (line.startsWith('SUPABASE_SERVICE_ROLE_KEY=')) supabaseKey = line.split('=')[1].trim();
});

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
