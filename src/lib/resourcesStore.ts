export interface SiteService {
  id: string;
  name: string;
  category: string;
  status: 'Active' | 'Draft';
  priceRange: string;
  description: string;
}

export interface LeadInquiry {
  id: string;
  name: string;
  email: string;
  website?: string;
  serviceRequested: string;
  date: string;
  status: 'New' | 'Contacted' | 'Closed';
  phone?: string;
  company?: string;
  budget?: string;
  message?: string;
}

export const INITIAL_SERVICES: SiteService[] = [
  { id: '1', name: 'AI Search Optimization (AI SEO)', category: 'SEO', status: 'Active', priceRange: '$1,500 - $4,500/mo', description: 'Optimize for SGE, ChatGPT Search, and Perplexity.' },
  { id: '2', name: 'Performance PPC Campaigns', category: 'PPC', status: 'Active', priceRange: '$2,000 - $6,000/mo', description: 'Data-driven Google & Meta ad management.' },
  { id: '3', name: 'High-Converting Web Development', category: 'Web Dev', status: 'Active', priceRange: '$3,500 - $12,000', description: 'Custom Next.js & React website building.' },
  { id: '4', name: 'Digital PR & Link Acquisition', category: 'Link Building', status: 'Active', priceRange: '$1,200 - $3,500/mo', description: 'Authoritative backlink building & media placement.' },
];

export const INITIAL_LEADS: LeadInquiry[] = [
  { id: 'l1', name: 'Sarah Jenkins', email: 'sarah@techflow.io', website: 'techflow.io', serviceRequested: 'AI SEO Audit', date: 'Jul 25, 2026', status: 'New' },
  { id: 'l2', name: 'David Miller', email: 'david@apexretail.com', website: 'apexretail.com', serviceRequested: 'PPC Management', date: 'Jul 24, 2026', status: 'Contacted' },
  { id: 'l3', name: 'Elena Rostova', email: 'elena@luminar.co', website: 'luminar.co', serviceRequested: 'Full Web Redesign', date: 'Jul 22, 2026', status: 'Closed' }
];

const SERVICES_KEY = 'markethom_services';
const LEADS_KEY = 'markethom_leads';

export function getServices(): SiteService[] {
  if (typeof window === 'undefined') return INITIAL_SERVICES;
  try {
    const data = localStorage.getItem(SERVICES_KEY);
    return data ? JSON.parse(data) : INITIAL_SERVICES;
  } catch {
    return INITIAL_SERVICES;
  }
}

export function saveService(service: Omit<SiteService, 'id'> & { id?: string }): SiteService {
  const services = getServices();
  if (service.id) {
    const updated = services.map(s => s.id === service.id ? { ...s, ...service } : s);
    if (typeof window !== 'undefined') localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    return { ...service, id: service.id } as SiteService;
  } else {
    const newService: SiteService = { ...service, id: Date.now().toString() };
    const updated = [newService, ...services];
    if (typeof window !== 'undefined') localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
    return newService;
  }
}

export function deleteService(id: string): void {
  const services = getServices();
  const updated = services.filter(s => s.id !== id);
  if (typeof window !== 'undefined') localStorage.setItem(SERVICES_KEY, JSON.stringify(updated));
}

export function getLeads(): LeadInquiry[] {
  if (typeof window === 'undefined') return INITIAL_LEADS;
  try {
    const data = localStorage.getItem(LEADS_KEY);
    return data ? JSON.parse(data) : INITIAL_LEADS;
  } catch {
    return INITIAL_LEADS;
  }
}

export function addLead(lead: Omit<LeadInquiry, 'id' | 'date' | 'status'> & { serviceRequested?: string }): LeadInquiry {
  const currentLeads = getLeads();
  const newLead: LeadInquiry = {
    id: 'lead-' + Date.now(),
    name: lead.name,
    email: lead.email,
    website: lead.website || '',
    serviceRequested: lead.serviceRequested || 'SEO Audit',
    phone: lead.phone || '',
    company: lead.company || '',
    budget: lead.budget || '',
    message: lead.message || '',
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    status: 'New'
  };

  const updated = [newLead, ...currentLeads];
  if (typeof window !== 'undefined') {
    localStorage.setItem(LEADS_KEY, JSON.stringify(updated));
  }

  // Also async sync to API server
  if (typeof window !== 'undefined') {
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLead)
    }).catch(() => {});
  }

  return newLead;
}

export function updateLeadStatus(id: string, status: LeadInquiry['status']): void {
  const leads = getLeads();
  const updated = leads.map(l => l.id === id ? { ...l, status } : l);
  if (typeof window !== 'undefined') localStorage.setItem(LEADS_KEY, JSON.stringify(updated));

  if (typeof window !== 'undefined') {
    fetch('/api/leads', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status })
    }).catch(() => {});
  }
}
