import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);

async function checkSites() {
  const { data: sites } = await supabase.from('websites').select('*').eq('status', 'published').limit(1000);
  if (!sites) return;
  
  const hasPrice = sites.find(s => s.content_placement_selling_price !== null);
  const noPrice = sites.find(s => s.content_placement_selling_price === null);
  const linkPolicy = sites.find(s => s.link_validity || s.max_dofollow_links);
  const nichePolicy = sites.find(s => (s.accepted_niches && s.accepted_niches.length > 0) || (s.rejected_niches && s.rejected_niches.length > 0));
  const complete = sites.find(s => s.content_placement_selling_price && s.turnaround_time && s.accepted_niches?.length && s.link_validity);
  
  console.log('Has Price:', hasPrice?.domain);
  console.log('No Price:', noPrice?.domain);
  console.log('Link Policy:', linkPolicy?.domain);
  console.log('Niche Policy:', nichePolicy?.domain);
  console.log('Complete:', complete?.domain);
}

checkSites();
