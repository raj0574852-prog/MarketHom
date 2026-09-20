import { discoverLogoUrl } from './src/services/logoDiscoveryService';

async function testGoogle() {
  const url = 'google.com';
  console.log('Testing', url);
  try {
    const res = await discoverLogoUrl(url);
    console.log('Result:', res);
  } catch (e) {
    console.error('Error:', e);
  }
}

testGoogle();
