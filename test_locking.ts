// test_locking.js
// This test is intended to be run by the user against their local or staging environment.
// It fires two simultaneous requests to the cron endpoint to verify atomic locking.

async function runTest() {
  console.log('--- Running Atomic Job Claiming Test ---');
  console.log('Dispatching 2 simultaneous requests to /api/cron/logo-discovery...');

  // Assumes local server is running on port 3000
  // Adjust URL or add CRON_SECRET if needed for staging:
  // headers: { 'Authorization': 'Bearer YOUR_CRON_SECRET' }
  const url = 'http://localhost:3000/api/cron/logo-discovery';

  const [res1, res2] = await Promise.all([
    fetch(url).then(r => r.json()).catch(e => ({ error: e.message })),
    fetch(url).then(r => r.json()).catch(e => ({ error: e.message }))
  ]);

  console.log('\nWorker 1 Results:', JSON.stringify(res1, null, 2));
  console.log('\nWorker 2 Results:', JSON.stringify(res2, null, 2));

  // Validation
  let duplicates = 0;
  if (res1.results && res2.results) {
    const ids1 = new Set(res1.results.map((r: any) => r.id));
    const ids2 = new Set(res2.results.map((r: any) => r.id));

    for (const id of ids1) {
      if (ids2.has(id)) duplicates++;
    }
  }

  console.log(`\nDuplicate Jobs Processed: ${duplicates}`);
  if (duplicates === 0) {
    console.log('[PASS] Atomic locking successful. No overlapping jobs.');
  } else {
    console.error('[FAIL] Overlapping jobs detected!');
  }
}

runTest();
