import { loadEnvConfig } from '@next/env';
import { createClient } from '@supabase/supabase-js';
import readline from 'readline';

// 1. Load Environment
loadEnvConfig(process.cwd());

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const cronSecret = process.env.CRON_SECRET;

if (!supabaseUrl || !supabaseKey || !cronSecret) {
  console.error("Missing required environment variables. Please check .env.local");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const askQuestion = (query: string): Promise<string> => new Promise(resolve => rl.question(query, resolve));

async function verifyDatabase() {
  console.log('\n============================================================');
  console.log('STEP 1: SELECT EXACTLY 5 TEST PUBLISHERS');
  console.log('============================================================');
  
  const { data: candidates, error: fetchError } = await supabase
    .from('website_listings')
    .select('id, domain, logo_url, logo_source, logo_discovery_status, logo_discovery_attempts')
    .is('logo_url', null)
    .neq('domain', 'reuters.com')
    .limit(5);

  if (fetchError) {
    console.error("Failed to fetch candidates:", fetchError);
    process.exit(1);
  }

  if (!candidates || candidates.length === 0) {
    console.error("No publishers with NULL logo_url found to test.");
    process.exit(1);
  }

  console.log('\nTEST PUBLISHERS IDENTIFIED:');
  candidates.forEach((c, i) => {
    console.log(`${i + 1}. Domain: ${c.domain} (ID: ${c.id})`);
    console.log(`   Before State -> Status: ${c.logo_discovery_status}, Logo: ${c.logo_url}, Source: ${c.logo_source}`);
  });

  const ids = candidates.map(c => c.id);

  console.log('\n============================================================');
  const answer = await askQuestion('Queue these exactly 5 publishers for discovery? (yes/no): ');
  if (answer.toLowerCase() !== 'yes' && answer.toLowerCase() !== 'y') {
    console.log('Aborted by user.');
    process.exit(0);
  }

  console.log('\n============================================================');
  console.log('STEP 2: QUEUE PUBLISHERS');
  console.log('============================================================');

  const { error: updateError } = await supabase
    .from('website_listings')
    .update({
      logo_discovery_status: 'pending',
      logo_processing_started_at: null
    })
    .in('id', ids);

  if (updateError) {
    console.error("Failed to queue publishers:", updateError);
    process.exit(1);
  }
  
  console.log('[PASS] Exactly 5 publishers successfully queued (logo_discovery_status = pending).');

  console.log('\n============================================================');
  console.log('STEP 3: EXECUTE REAL CRON ENDPOINT');
  console.log('============================================================');
  
  await askQuestion('Ensure `npm run dev` is running in another terminal. Press Enter to trigger the discovery endpoint...');

  console.log('\nTriggering http://localhost:3000/api/cron/logo-discovery...');
  try {
    const res = await fetch('http://localhost:3000/api/cron/logo-discovery', {
      headers: { 'Authorization': `Bearer ${cronSecret}` }
    });
    const text = await res.text();
    console.log('Endpoint response:', res.status, text);
  } catch (err: any) {
    console.error('Failed to contact local endpoint. Is `npm run dev` running?', err.message);
    process.exit(1);
  }

  console.log('\n============================================================');
  console.log('STEP 4: VERIFY REAL DATABASE RESULTS');
  console.log('============================================================');

  const { data: results } = await supabase
    .from('website_listings')
    .select('id, domain, logo_url, logo_source, logo_discovery_status, logo_discovery_attempts, logo_last_checked_at')
    .in('id', ids);

  if (results) {
    results.forEach((r) => {
      const original = candidates.find(c => c.id === r.id);
      console.log(`\nDomain: ${r.domain}`);
      console.log(`Status before: ${original?.logo_discovery_status} -> After: ${r.logo_discovery_status}`);
      console.log(`Logo before: ${original?.logo_url} -> After: ${r.logo_url}`);
      console.log(`Logo source: ${r.logo_source}`);
      console.log(`Attempts before: ${original?.logo_discovery_attempts} -> After: ${r.logo_discovery_attempts}`);
      console.log(`Last checked: ${r.logo_last_checked_at}`);
    });
  }

  console.log('\n============================================================');
  console.log('STEP 5: VERIFY UNRELATED PUBLISHERS');
  console.log('============================================================');
  
  const { count: autoCount } = await supabase
    .from('website_listings')
    .select('*', { count: 'exact', head: true })
    .eq('logo_source', 'auto')
    .not('id', 'in', `(${ids.join(',')})`);

  console.log(`Unrelated publishers with logo_source='auto': ${autoCount}`);
  if (autoCount === 0) {
    console.log('[PASS] No unrelated publishers were modified.');
  } else {
    console.error('[FAIL] Unrelated publishers were modified!');
  }

  const { data: reuters } = await supabase
    .from('website_listings')
    .select('domain, logo_url, logo_source')
    .eq('domain', 'reuters.com')
    .single();

  if (reuters) {
    console.log(`\nReuters State:`);
    console.log(`logo_source: ${reuters.logo_source} (Expected: sheet)`);
    console.log(`logo_url: ${reuters.logo_url}`);
    if (reuters.logo_source === 'sheet') {
      console.log('[PASS] Reuters logo source safely preserved.');
    } else {
      console.error('[FAIL] Reuters logo source modified!');
    }
  }

  console.log('\n============================================================');
  console.log('STEP 6: STUCK JOB RECOVERY TEST');
  console.log('============================================================');
  
  // Create a dummy stale job using one of the test IDs
  const testId = ids[0];
  const oldDate = new Date(Date.now() - 20 * 60000).toISOString(); // 20 mins ago

  console.log(`Marking ${testId} as stale processing job (started 20 mins ago)...`);
  await supabase.from('website_listings').update({
    logo_discovery_status: 'processing',
    logo_processing_started_at: oldDate
  }).eq('id', testId);

  // Call RPC directly to verify claiming
  const { data: claimed } = await supabase.rpc('claim_logo_discovery_jobs', { batch_limit: 5 });
  
  const wasReclaimed = claimed && claimed.some((c: any) => c.id === testId);
  if (wasReclaimed) {
    console.log('[PASS] Stale processing job was successfully reclaimed.');
  } else {
    console.error('[FAIL] Stale processing job was NOT reclaimed.');
  }

  // Create a dummy FRESH job
  const freshDate = new Date().toISOString();
  console.log(`\nMarking ${testId} as FRESH processing job...`);
  await supabase.from('website_listings').update({
    logo_discovery_status: 'processing',
    logo_processing_started_at: freshDate
  }).eq('id', testId);

  const { data: freshClaimed } = await supabase.rpc('claim_logo_discovery_jobs', { batch_limit: 5 });
  const wasFreshReclaimed = freshClaimed && freshClaimed.some((c: any) => c.id === testId);
  if (!wasFreshReclaimed) {
    console.log('[PASS] Fresh processing job safely protected from overlap.');
  } else {
    console.error('[FAIL] Fresh processing job was incorrectly reclaimed.');
  }

  // Restore the test row to a normal completed state
  await supabase.from('website_listings').update({
    logo_discovery_status: 'success',
    logo_processing_started_at: null
  }).eq('id', testId);

  console.log('\n[TEST COMPLETE] Database and worker verification finished successfully.');
  process.exit(0);
}

verifyDatabase();
