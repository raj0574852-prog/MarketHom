const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('', '');
async function check() {
  const { data } = await supabase.from('website_listings').select('domain, price, content_placement_price, content_placement_selling_price').eq('domain', 'streetinsider.com');
  console.log(JSON.stringify(data, null, 2));
}
check();
