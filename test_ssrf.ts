import { discoverLogoUrl } from './src/services/logoDiscoveryService';

async function runTests() {
  const tests = [
    { url: 'http://127.0.0.1', shouldFail: true, name: 'Localhost IPv4' },
    { url: 'http://[::1]', shouldFail: true, name: 'Localhost IPv6' },
    { url: 'http://169.254.169.254', shouldFail: true, name: 'Cloud Metadata' },
    { url: 'http://192.168.1.1', shouldFail: true, name: 'Private IPv4 (192)' },
    { url: 'http://10.0.0.1', shouldFail: true, name: 'Private IPv4 (10)' },
    { url: 'http://172.16.0.1', shouldFail: true, name: 'Private IPv4 (172)' },
    { url: 'localhost', shouldFail: true, name: 'Localhost Domain' },
    { url: 'google.com', shouldFail: false, name: 'Valid Domain (google.com)' },
  ];

  console.log('--- Running SSRF Security Tests ---');
  let passed = 0;
  for (const t of tests) {
    try {
      const res = await discoverLogoUrl(t.url);
      const failed = res === null;
      if (failed === t.shouldFail) {
        console.log(`[PASS] ${t.name}`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name} - Expected failure: ${t.shouldFail}, Got result: ${res}`);
      }
    } catch (e: any) {
      if (t.shouldFail) {
        console.log(`[PASS] ${t.name}`);
        passed++;
      } else {
        console.error(`[FAIL] ${t.name} - Unexpected error: ${e.message}`);
      }
    }
  }

  console.log(`\nResults: ${passed}/${tests.length} tests passed.`);
}

runTests();
