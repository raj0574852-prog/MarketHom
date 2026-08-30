export interface GuestPostListing {
  id: string;
  title: string;
  domainName: string;
  niche: string;
  da: number;
  dr: number;
  traffic: string;
  turnaround: string;
  price: number;
  sampleUrl?: string;
  description: string;
  featured?: boolean;
}

export const INITIAL_GUEST_POSTS: GuestPostListing[] = [
  {
    id: 'gp-1',
    title: 'High-Tech & AI Innovation Journal',
    domainName: 'techinsider-trends.com',
    niche: 'AI & Tech',
    da: 82,
    dr: 85,
    traffic: '450,000/mo',
    turnaround: '3 - 5 Days',
    price: 299,
    sampleUrl: 'https://techinsider-trends.com/sample-article',
    description: 'Permanent dofollow backlink in a contextual 1,200+ word AI SEO article. Indexed in Google within 24 hours.',
    featured: true
  },
  {
    id: 'gp-2',
    title: 'SaaS Growth & Digital Marketing Hub',
    domainName: 'saasgrowth-daily.io',
    niche: 'SaaS & Marketing',
    da: 74,
    dr: 78,
    traffic: '180,000/mo',
    turnaround: '2 - 4 Days',
    price: 199,
    sampleUrl: 'https://saasgrowth-daily.io/sample-article',
    description: 'High-authority placement for B2B SaaS, startups, and marketing tools. Fast PageRank juice transfer.',
    featured: true
  },
  {
    id: 'gp-3',
    title: 'Global Fintech & Economy Monitor',
    domainName: 'fintech-monitor.org',
    niche: 'Finance & Crypto',
    da: 68,
    dr: 71,
    traffic: '95,000/mo',
    turnaround: '3 Days',
    price: 149,
    sampleUrl: 'https://fintech-monitor.org/sample-article',
    description: 'Trusted finance portal with high Google EEAT signals. Ideal for financial apps, trading, and business services.',
    featured: false
  },
  {
    id: 'gp-4',
    title: 'E-Commerce & Retail Strategy Review',
    domainName: 'ecom-digest.net',
    niche: 'E-Commerce',
    da: 62,
    dr: 65,
    traffic: '60,000/mo',
    turnaround: '2 Days',
    price: 120,
    sampleUrl: 'https://ecom-digest.net/sample-article',
    description: 'Niche retail publication driving targeted shopping referral traffic to Shopify and WooCommerce stores.',
    featured: false
  }
];

const GUEST_POSTS_KEY = 'markethom_guest_posts';

export function getGuestPosts(): GuestPostListing[] {
  if (typeof window === 'undefined') return INITIAL_GUEST_POSTS;
  try {
    const data = localStorage.getItem(GUEST_POSTS_KEY);
    return data ? JSON.parse(data) : INITIAL_GUEST_POSTS;
  } catch {
    return INITIAL_GUEST_POSTS;
  }
}

export function saveGuestPost(listing: Omit<GuestPostListing, 'id'> & { id?: string }): GuestPostListing {
  const current = getGuestPosts();
  let saved: GuestPostListing;

  if (listing.id) {
    saved = { ...listing, id: listing.id } as GuestPostListing;
    const updated = current.map(item => item.id === listing.id ? saved : item);
    if (typeof window !== 'undefined') localStorage.setItem(GUEST_POSTS_KEY, JSON.stringify(updated));
  } else {
    saved = {
      ...listing,
      id: 'gp-' + Date.now()
    };
    const updated = [saved, ...current];
    if (typeof window !== 'undefined') localStorage.setItem(GUEST_POSTS_KEY, JSON.stringify(updated));
  }

  if (typeof window !== 'undefined') {
    fetch('/api/guest-posts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(saved)
    }).catch(() => {});
  }

  return saved;
}

export function deleteGuestPost(id: string): void {
  const current = getGuestPosts();
  const updated = current.filter(item => item.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem(GUEST_POSTS_KEY, JSON.stringify(updated));

  if (typeof window !== 'undefined') {
    fetch(`/api/guest-posts?id=${encodeURIComponent(id)}`, {
      method: 'DELETE'
    }).catch(() => {});
  }
}
