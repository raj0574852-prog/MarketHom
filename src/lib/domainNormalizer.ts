export function normalizeDomain(input: string): string | null {
  if (!input || typeof input !== 'string') return null;

  let domain = input.trim().toLowerCase();

  // Remove protocol
  if (domain.startsWith('http://')) {
    domain = domain.substring(7);
  } else if (domain.startsWith('https://')) {
    domain = domain.substring(8);
  }

  // Remove www.
  if (domain.startsWith('www.')) {
    domain = domain.substring(4);
  }

  // Remove trailing slashes and paths
  domain = domain.split('/')[0];

  // Basic validation for hostname
  const domainRegex = /^[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?(\.[a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?)+$/;
  if (!domainRegex.test(domain)) {
    return null;
  }

  return domain;
}
