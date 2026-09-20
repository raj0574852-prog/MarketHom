import { discoverLogoUrl } from './src/services/logoDiscoveryService';

async function run() {
  const domains = ['github.com', 'microsoft.com', 'ycombinator.com', 'tailwindcss.com', 'supabase.com'];
  for (const d of domains) {
    console.log(`\nDomain: ${d}`);
    const logo = await discoverLogoUrl(d);
    console.log(`Logo: ${logo}`);
  }
}
run();
