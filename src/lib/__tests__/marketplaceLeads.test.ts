import { describe, it, expect, vi, beforeEach } from 'vitest';

interface MockLeadRecord {
  id: string;
  full_name?: string;
  email?: string | null;
  whatsapp?: string | null;
  status?: string;
  publisher_domain?: string;
  price?: number | null;
  [key: string]: unknown;
}

interface MockQueryBuilder {
  eq: (field: string, val: unknown) => MockQueryBuilder;
  or: () => MockQueryBuilder;
  order: () => MockQueryBuilder;
  range: (start: number, end: number) => Promise<{ data: MockLeadRecord[] | null; count: number | null; error: { message: string } | null }>;
  then: (resolve: (val: { count: number | null; error: { message: string } | null }) => void) => void;
}

// Configurable mock for Supabase operations
let mockDbFail = false;
const mockStore: MockLeadRecord[] = [];

vi.mock('../supabaseClient', () => ({
  getServiceSupabase: () => ({
    from: () => ({
      insert: (records: Record<string, unknown>[]) => ({
        select: () => ({
          single: async () => {
            if (mockDbFail) {
              return { data: null, error: { message: 'Database connection failed' } };
            }
            const record: MockLeadRecord = { id: `lead_${Date.now()}`, ...records[0] };
            mockStore.push(record);
            return { data: record, error: null };
          }
        })
      }),
      select: () => {
        let filtered = [...mockStore];

        const queryObj: MockQueryBuilder = {
          eq: (field: string, val: unknown) => {
            filtered = filtered.filter(r => r[field] === val);
            return queryObj;
          },
          or: () => queryObj,
          order: () => queryObj,
          range: async (start: number, end: number) => {
            if (mockDbFail) {
              return { data: null, count: null, error: { message: 'Database query failed' } };
            }
            return {
              data: filtered.slice(start, end + 1),
              count: filtered.length,
              error: null
            };
          },
          then: (resolve: (val: { count: number | null; error: { message: string } | null }) => void) => {
            if (mockDbFail) {
              resolve({ count: null, error: { message: 'Database query failed' } });
            } else {
              resolve({ count: filtered.length, error: null });
            }
          }
        };

        return queryObj;
      },
      update: (updates: Record<string, unknown>) => ({
        eq: (_field: string, id: string) => ({
          select: () => ({
            single: async () => {
              if (mockDbFail) {
                return { data: null, error: { message: 'Database update failed' } };
              }
              const item = mockStore.find(r => r.id === id);
              if (!item) return { data: null, error: { message: 'Lead not found' } };
              Object.assign(item, updates);
              return { data: item, error: null };
            }
          })
        })
      })
    })
  })
}));

import {
  isValidEmail,
  isValidWhatsApp,
  normalizeWhatsAppNumber,
  validateContactMethods,
  createMarketplaceLead,
  getMarketplaceLeads,
  getMarketplaceLeadMetrics,
  updateMarketplaceLeadStatus
} from '../marketplaceLeads';

describe('Marketplace Leads Validation & Business Rules', () => {
  beforeEach(() => {
    mockDbFail = false;
    mockStore.length = 0;
  });

  describe('normalizeWhatsAppNumber', () => {
    it('normalizes international formats with spaces, hyphens, and brackets', () => {
      expect(normalizeWhatsAppNumber('+1 (555) 019-2834')).toBe('+15550192834');
      expect(normalizeWhatsAppNumber('+44 20 7946 0912')).toBe('+442079460912');
    });

    it('adds leading + if omitted for international numbers', () => {
      expect(normalizeWhatsAppNumber('919876543210')).toBe('+919876543210');
      expect(normalizeWhatsAppNumber('14155552671')).toBe('+14155552671');
    });

    it('handles empty or whitespace strings safely', () => {
      expect(normalizeWhatsAppNumber('')).toBeNull();
      expect(normalizeWhatsAppNumber('   ')).toBeNull();
    });
  });

  describe('isValidEmail', () => {
    it('validates legitimate email addresses', () => {
      expect(isValidEmail('buyer@educationhom.com')).toBe(true);
      expect(isValidEmail('marketing.lead+test@agency.co.uk')).toBe(true);
    });

    it('rejects invalid email formats', () => {
      expect(isValidEmail('plainaddress')).toBe(false);
      expect(isValidEmail('@missingusername.com')).toBe(false);
      expect(isValidEmail('username@.com')).toBe(false);
      expect(isValidEmail('username@domain')).toBe(false);
    });
  });

  describe('isValidWhatsApp', () => {
    it('accepts valid phone numbers within 7 to 15 digits', () => {
      expect(isValidWhatsApp('+15550192834')).toBe(true);
      expect(isValidWhatsApp('+919876543210')).toBe(true);
    });

    it('rejects numbers that are too short, too long, or non-numeric', () => {
      expect(isValidWhatsApp('12345')).toBe(false);
      expect(isValidWhatsApp('abcdefghijk')).toBe(false);
      expect(isValidWhatsApp('+12345678901234567')).toBe(false); // 17 digits
    });
  });

  describe('validateContactMethods', () => {
    it('succeeds when only a valid email is provided', () => {
      const result = validateContactMethods('client@example.com', undefined);
      expect(result.isValid).toBe(true);
      expect(result.email).toBe('client@example.com');
      expect(result.whatsapp).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('succeeds when only a valid WhatsApp number is provided', () => {
      const result = validateContactMethods(undefined, '+1 (555) 019-2834');
      expect(result.isValid).toBe(true);
      expect(result.whatsapp).toBe('+15550192834');
      expect(result.email).toBeNull();
      expect(result.error).toBeUndefined();
    });

    it('succeeds when both email and WhatsApp are provided and valid', () => {
      const result = validateContactMethods('client@example.com', '+91 98765 43210');
      expect(result.isValid).toBe(true);
      expect(result.email).toBe('client@example.com');
      expect(result.whatsapp).toBe('+919876543210');
      expect(result.error).toBeUndefined();
    });

    it('rejects with the exact business error if neither contact method is provided', () => {
      const result = validateContactMethods('', '');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter at least one contact method: email address or WhatsApp number.');
    });

    it('rejects if an invalid email format is supplied', () => {
      const result = validateContactMethods('invalid-email', '+15550192834');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid email address.');
    });

    it('rejects if an invalid WhatsApp number is supplied', () => {
      const result = validateContactMethods('valid@example.com', '1234');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Please enter a valid WhatsApp phone number with country code.');
    });
  });

  describe('Strict Database Durability & Lifecycle Contract', () => {
    const testDomain = 'tech-journal-review.com';

    it('creates and persists lead durably when database is available', async () => {
      const newLead = await createMarketplaceLead({
        fullName: 'Jane Doe',
        email: 'jane@tech-journal-review.com',
        whatsapp: '+15550192834',
        message: 'Interested in a guest post slot for next month.',
        publisherId: 'pub_test_123',
        publisherDomain: testDomain,
        listingUrl: `https://www.educationhom.com/website/${testDomain}`,
        price: 250,
        currency: 'USD'
      });

      expect(newLead).toBeDefined();
      expect(newLead.id).toBeDefined();
      expect(newLead.full_name).toBe('Jane Doe');
      expect(newLead.email).toBe('jane@tech-journal-review.com');
      expect(newLead.whatsapp).toBe('+15550192834');
      expect(newLead.publisher_domain).toBe(testDomain);
      expect(newLead.price).toBe(250);
      expect(newLead.status).toBe('New');
    });

    it('NEVER reports success when database is offline or insert fails (prevents silent loss)', async () => {
      mockDbFail = true;

      await expect(createMarketplaceLead({
        fullName: 'Jane Doe',
        email: 'jane@tech-journal-review.com',
        publisherDomain: testDomain,
        listingUrl: `https://www.educationhom.com/website/${testDomain}`
      })).rejects.toThrow('Database connection failed');
    });

    it('queries leads from database with search and status filtering', async () => {
      await createMarketplaceLead({
        fullName: 'Jane Doe',
        email: 'jane@tech-journal-review.com',
        publisherDomain: testDomain,
        listingUrl: `https://www.educationhom.com/website/${testDomain}`
      });

      const { leads, total } = await getMarketplaceLeads({
        search: 'Jane',
        status: 'New',
        page: 1,
        limit: 10
      });

      expect(total).toBe(1);
      expect(leads.length).toBe(1);
      expect(leads[0].full_name).toBe('Jane Doe');
    });

    it('updates lead status with transition audit', async () => {
      const created = await createMarketplaceLead({
        fullName: 'Alice Smith',
        email: 'alice@example.com',
        publisherDomain: testDomain,
        listingUrl: `https://www.educationhom.com/website/${testDomain}`
      });

      const updated = await updateMarketplaceLeadStatus(created.id, 'In Discussion');
      expect(updated).toBeDefined();
      expect(updated?.status).toBe('In Discussion');

      const converted = await updateMarketplaceLeadStatus(created.id, 'Converted');
      expect(converted?.status).toBe('Converted');
    });

    it('calculates metrics correctly for dashboard badge rendering', async () => {
      const created = await createMarketplaceLead({
        fullName: 'Bob Johnson',
        email: 'bob@example.com',
        publisherDomain: testDomain,
        listingUrl: `https://www.educationhom.com/website/${testDomain}`
      });

      await updateMarketplaceLeadStatus(created.id, 'Converted');

      const metrics = await getMarketplaceLeadMetrics();
      expect(metrics.total).toBe(1);
    });
  });
});
