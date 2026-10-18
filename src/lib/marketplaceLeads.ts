import { getServiceSupabase } from './supabaseClient';

export type MarketplaceLeadStatus = 'New' | 'Contacted' | 'In Discussion' | 'Converted' | 'Closed';

export interface MarketplaceLead {
  id: string;
  full_name: string;
  email: string | null;
  whatsapp: string | null;
  message: string | null;
  publisher_id: string | null;
  publisher_domain: string;
  listing_url: string;
  price: number | null;
  currency: string;
  source: string;
  status: MarketplaceLeadStatus;
  created_at: string;
  updated_at: string;
}

/**
 * Normalizes a phone/WhatsApp number:
 * - Keeps leading '+' if present
 * - Strips whitespace, dashes, dots, and parentheses
 * - Ensures only valid international digits remain
 */
export function normalizeWhatsAppNumber(raw: string | null | undefined): string | null {
  if (!raw || typeof raw !== 'string') return null;
  const trimmed = raw.trim();
  if (!trimmed) return null;

  // Extract digits
  const digitsOnly = trimmed.replace(/\D/g, '');

  if (digitsOnly.length < 7 || digitsOnly.length > 15) {
    return null; // Invalid international phone length
  }

  return `+${digitsOnly}`;
}

/**
 * Validates international phone/WhatsApp format
 */
export function isValidWhatsApp(raw: string | null | undefined): boolean {
  if (!raw || typeof raw !== 'string') return false;
  const trimmed = raw.trim();
  if (!trimmed) return false;
  const digitsOnly = trimmed.replace(/\D/g, '');
  return digitsOnly.length >= 7 && digitsOnly.length <= 15;
}

/**
 * Basic email validator
 */
export function isValidEmail(email: string | null | undefined): boolean {
  if (!email || typeof email !== 'string') return false;
  const trimmed = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(trimmed) && trimmed.length <= 150;
}

export interface ContactValidationResult {
  isValid: boolean;
  email: string | null;
  whatsapp: string | null;
  error?: string;
}

/**
 * Enforces business rule: at least one valid contact method must be provided.
 */
export function validateContactMethods(email?: string | null, whatsapp?: string | null): ContactValidationResult {
  const hasEmail = Boolean(email && typeof email === 'string' && email.trim().length > 0);
  const hasWhatsApp = Boolean(whatsapp && typeof whatsapp === 'string' && whatsapp.trim().length > 0);

  if (!hasEmail && !hasWhatsApp) {
    return {
      isValid: false,
      email: null,
      whatsapp: null,
      error: 'Please enter at least one contact method: email address or WhatsApp number.'
    };
  }

  let validatedEmail: string | null = null;
  if (hasEmail) {
    if (!isValidEmail(email)) {
      return {
        isValid: false,
        email: null,
        whatsapp: null,
        error: 'Please enter a valid email address.'
      };
    }
    validatedEmail = email!.trim();
  }

  let validatedWhatsApp: string | null = null;
  if (hasWhatsApp) {
    if (!isValidWhatsApp(whatsapp)) {
      return {
        isValid: false,
        email: null,
        whatsapp: null,
        error: 'Please enter a valid WhatsApp phone number with country code.'
      };
    }
    validatedWhatsApp = normalizeWhatsAppNumber(whatsapp);
  }

  return {
    isValid: true,
    email: validatedEmail,
    whatsapp: validatedWhatsApp
  };
}

export interface CreateMarketplaceLeadInput {
  fullName: string;
  email?: string | null;
  whatsapp?: string | null;
  message?: string | null;
  publisherId?: string | null;
  publisherDomain: string;
  listingUrl: string;
  price?: number | null;
  currency?: string;
}

export async function createMarketplaceLead(input: CreateMarketplaceLeadInput): Promise<MarketplaceLead> {
  const email = input.email ? input.email.trim() : null;
  const whatsapp = normalizeWhatsAppNumber(input.whatsapp);
  const message = input.message ? input.message.trim().slice(0, 3000) : null;
  const currency = input.currency || 'USD';
  const now = new Date().toISOString();

  const record: Omit<MarketplaceLead, 'id'> = {
    full_name: input.fullName.trim(),
    email: email || null,
    whatsapp: whatsapp || null,
    message: message || null,
    publisher_id: input.publisherId || null,
    publisher_domain: input.publisherDomain.trim().toLowerCase(),
    listing_url: input.listingUrl.trim(),
    price: input.price !== undefined && input.price !== null ? Number(input.price) : null,
    currency,
    source: 'marketplace',
    status: 'New',
    created_at: now,
    updated_at: now,
  };

  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('marketplace_leads')
    .insert([record])
    .select()
    .single();

  if (error || !data) {
    console.error('[MarketplaceLeads] Durable persistence failed:', error?.message);
    throw new Error(error?.message || 'Failed to durably store marketplace inquiry.');
  }

  return data as MarketplaceLead;
}

export interface GetMarketplaceLeadsOptions {
  page?: number;
  limit?: number;
  status?: string;
  search?: string;
}

export async function getMarketplaceLeads(options: GetMarketplaceLeadsOptions = {}): Promise<{
  leads: MarketplaceLead[];
  total: number;
  page: number;
  totalPages: number;
}> {
  const page = Math.max(1, options.page || 1);
  const limit = Math.min(100, Math.max(1, options.limit || 20));
  const offset = (page - 1) * limit;

  const supabase = getServiceSupabase();

  let query = supabase
    .from('marketplace_leads')
    .select('*', { count: 'exact' });

  if (options.status && options.status !== 'All') {
    query = query.eq('status', options.status);
  }

  if (options.search && options.search.trim()) {
    const term = `%${options.search.trim().toLowerCase()}%`;
    query = query.or(`full_name.ilike.${term},email.ilike.${term},publisher_domain.ilike.${term}`);
  }

  const { data, count, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    console.warn('[MarketplaceLeads] Notice querying leads (table might not exist yet):', error.message);
    return {
      leads: [],
      total: 0,
      page,
      totalPages: 1
    };
  }

  const total = count || 0;
  return {
    leads: (data as MarketplaceLead[]) || [],
    total,
    page,
    totalPages: Math.ceil(total / limit) || 1
  };
}

export async function getMarketplaceLeadMetrics(): Promise<{
  total: number;
  newLeads: number;
  contacted: number;
  converted: number;
}> {
  const supabase = getServiceSupabase();

  try {
    const [totalRes, newRes, contactedRes, convertedRes] = await Promise.all([
      supabase.from('marketplace_leads').select('id', { count: 'exact', head: true }),
      supabase.from('marketplace_leads').select('id', { count: 'exact', head: true }).eq('status', 'New'),
      supabase.from('marketplace_leads').select('id', { count: 'exact', head: true }).eq('status', 'Contacted'),
      supabase.from('marketplace_leads').select('id', { count: 'exact', head: true }).eq('status', 'Converted')
    ]);

    if (!totalRes.error && totalRes.count !== null && totalRes.count !== undefined) {
      return {
        total: totalRes.count || 0,
        newLeads: newRes.count || 0,
        contacted: contactedRes.count || 0,
        converted: convertedRes.count || 0
      };
    }
  } catch (err) {
    console.error('[MarketplaceLeads] Error fetching metrics:', err);
  }

  return {
    total: 0,
    newLeads: 0,
    contacted: 0,
    converted: 0
  };
}

export async function updateMarketplaceLeadStatus(
  id: string, 
  status: MarketplaceLeadStatus
): Promise<MarketplaceLead | null> {
  const now = new Date().toISOString();
  const supabase = getServiceSupabase();

  const { data, error } = await supabase
    .from('marketplace_leads')
    .update({ status, updated_at: now })
    .eq('id', id)
    .select()
    .single();

  if (error || !data) {
    console.error('[MarketplaceLeads] Failed to update lead status in Supabase:', error?.message);
    throw new Error(error?.message || 'Failed to update lead status in database.');
  }

  return data as MarketplaceLead;
}
