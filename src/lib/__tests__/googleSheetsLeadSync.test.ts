import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import {
  sanitizeSpreadsheetField,
  validateAndNormalizeLeadPayload,
  syncLeadToGoogleSheets,
  GoogleSheetLeadPayload
} from '../googleSheetsLeadSync';

describe('Google Sheets Lead Sync - Sanitization & Validation', () => {
  describe('sanitizeSpreadsheetField', () => {
    it('returns empty string for null and undefined', () => {
      expect(sanitizeSpreadsheetField(null)).toBe('');
      expect(sanitizeSpreadsheetField(undefined)).toBe('');
    });

    it('returns empty string for empty or whitespace-only values', () => {
      expect(sanitizeSpreadsheetField('')).toBe('');
      expect(sanitizeSpreadsheetField('   ')).toBe('');
    });

    it('neutralizes formula injection characters (=, +, -, @) by prepending a single quote', () => {
      expect(sanitizeSpreadsheetField('=SUM(A1:A10)')).toBe("'=SUM(A1:A10)");
      expect(sanitizeSpreadsheetField('+1234567890')).toBe("'+1234567890");
      expect(sanitizeSpreadsheetField('-100')).toBe("'-100");
      expect(sanitizeSpreadsheetField('@SUM(1+1)')).toBe("'@SUM(1+1)");
      expect(sanitizeSpreadsheetField('=cmd|/C calc!A0')).toBe("'=cmd|/C calc!A0");
    });

    it('neutralizes formula characters preceded by whitespace', () => {
      expect(sanitizeSpreadsheetField('  =1+1')).toBe("'=1+1");
      expect(sanitizeSpreadsheetField('  @IMPORTXML(...)')).toBe("'@IMPORTXML(...)");
    });

    it('preserves regular text without modifying it', () => {
      expect(sanitizeSpreadsheetField('John Doe')).toBe('John Doe');
      expect(sanitizeSpreadsheetField('john@example.com')).toBe('john@example.com');
      expect(sanitizeSpreadsheetField('https://www.educationhom.com')).toBe('https://www.educationhom.com');
    });

    it('handles numeric input properly', () => {
      expect(sanitizeSpreadsheetField(250)).toBe('250');
      expect(sanitizeSpreadsheetField(0)).toBe('0');
      expect(sanitizeSpreadsheetField(-50)).toBe("'-50");
    });
  });

  describe('validateAndNormalizeLeadPayload', () => {
    it('fails when name is missing or whitespace', () => {
      const res1 = validateAndNormalizeLeadPayload({ name: '', email: 'test@example.com' });
      expect(res1.isValid).toBe(false);
      expect(res1.error).toContain('Name is required');

      const res2 = validateAndNormalizeLeadPayload({ name: '   ', email: 'test@example.com' });
      expect(res2.isValid).toBe(false);
      expect(res2.error).toContain('Name is required');
    });

    it('fails when name exceeds 150 characters', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'A'.repeat(151),
        email: 'test@example.com'
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('150 characters');
    });

    it('fails when neither email nor whatsapp is provided', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'John Doe',
        email: '',
        whatsapp: ''
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('at least one contact method');
    });

    it('fails when email format is invalid', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'John Doe',
        email: 'not-an-email'
      });
      expect(res.isValid).toBe(false);
      expect(res.error).toContain('Invalid email address format');
    });

    it('succeeds with valid email only', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'Alice Smith',
        email: 'alice@example.com'
      });
      expect(res.isValid).toBe(true);
      expect(res.normalized?.name).toBe('Alice Smith');
      expect(res.normalized?.email).toBe('alice@example.com');
      expect(res.normalized?.whatsapp).toBe('');
    });

    it('succeeds with valid WhatsApp only', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'Bob Johnson',
        whatsapp: '+1 555 123 4567'
      });
      expect(res.isValid).toBe(true);
      expect(res.normalized?.name).toBe('Bob Johnson');
      expect(res.normalized?.email).toBe('');
      expect(res.normalized?.whatsapp).toBe("'+1 555 123 4567");
    });

    it('succeeds with both email and WhatsApp provided', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'Charlie Brown',
        email: 'charlie@example.com',
        whatsapp: '+44 7700 900077'
      });
      expect(res.isValid).toBe(true);
      expect(res.normalized?.email).toBe('charlie@example.com');
      expect(res.normalized?.whatsapp).toBe("'+44 7700 900077");
    });

    it('applies default values for optional metadata fields', () => {
      const res = validateAndNormalizeLeadPayload({
        name: 'David Lee',
        email: 'david@example.com'
      });
      expect(res.isValid).toBe(true);
      expect(res.normalized?.leadType).toBe('General Inquiry');
      expect(res.normalized?.source).toBe('Website');
      expect(res.normalized?.status).toBe('New');
      expect(res.normalized?.publisherDomain).toBe('');
      expect(res.normalized?.listingUrl).toBe('');
      expect(res.normalized?.price).toBe('');
      expect(res.normalized?.message).toBe('');
      expect(res.normalized?.leadId).toBeDefined();
      expect(res.normalized?.createdAt).toBeDefined();
    });

    it('produces the exact 12-column row in correct sequence', () => {
      const payload: GoogleSheetLeadPayload = {
        leadId: 'lead-999',
        createdAt: '2026-10-17T08:00:00.000Z',
        name: 'Emma Watson',
        email: 'emma@hollywood.com',
        whatsapp: '+1 310 555 0199',
        leadType: 'Publisher Placement',
        publisherDomain: 'techcrunch.com',
        listingUrl: 'https://www.educationhom.com/website/techcrunch.com',
        price: '$450',
        message: 'Looking for a sponsored article',
        source: 'Publisher Listing Page',
        status: 'New'
      };

      const res = validateAndNormalizeLeadPayload(payload);
      expect(res.isValid).toBe(true);
      const row = res.normalized?.row as string[];
      expect(row).toBeDefined();
      expect(row.length).toBe(12);

      // Expected Column Order:
      // [0] Lead ID, [1] Created At, [2] Name, [3] Email, [4] WhatsApp, [5] Lead Type,
      // [6] Publisher Domain, [7] Listing URL, [8] Price, [9] Message, [10] Source, [11] Status
      expect(row[0]).toBe('lead-999');
      expect(row[1]).toBe('2026-10-17T08:00:00.000Z');
      expect(row[2]).toBe('Emma Watson');
      expect(row[3]).toBe('emma@hollywood.com');
      expect(row[4]).toBe("'+1 310 555 0199");
      expect(row[5]).toBe('Publisher Placement');
      expect(row[6]).toBe('techcrunch.com');
      expect(row[7]).toBe('https://www.educationhom.com/website/techcrunch.com');
      expect(row[8]).toBe('$450');
      expect(row[9]).toBe('Looking for a sponsored article');
      expect(row[10]).toBe('Publisher Listing Page');
      expect(row[11]).toBe('New');
    });

    it('sanitizes formula injection across all payload fields', () => {
      const payload: GoogleSheetLeadPayload = {
        leadId: '=cmd',
        createdAt: '@TODAY()',
        name: '+Evil User',
        email: 'evil@example.com',
        whatsapp: '+1234567890',
        leadType: '=HYPERLINK("http://evil.com")',
        publisherDomain: '-bad-domain.com',
        listingUrl: '=IMPORTDATA("http://evil.com/csv")',
        price: '=100*2',
        message: '@dangerous',
        source: '+SourceTracker',
        status: '=Status'
      };

      const res = validateAndNormalizeLeadPayload(payload);
      expect(res.isValid).toBe(true);
      const row = res.normalized?.row as string[];

      expect(row[0]).toBe("'=cmd");
      expect(row[1]).toBe("'@TODAY()");
      expect(row[2]).toBe("'+Evil User");
      expect(row[4]).toBe("'+1234567890");
      expect(row[5]).toBe("'=HYPERLINK(\"http://evil.com\")");
      expect(row[6]).toBe("'-bad-domain.com");
      expect(row[7]).toBe("'=IMPORTDATA(\"http://evil.com/csv\")");
      expect(row[8]).toBe("'=100*2");
      expect(row[9]).toBe("'@dangerous");
      expect(row[10]).toBe("'+SourceTracker");
      expect(row[11]).toBe("'=Status");
    });
  });
});

describe('Google Sheets Lead Sync - Remote HTTP Execution', () => {
  const originalEnv = process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;
  const mockEndpoint = 'https://script.google.com/macros/s/TEST_DEPLOYMENT/exec';

  beforeEach(() => {
    vi.restoreAllMocks();
    process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL = mockEndpoint;
  });

  afterEach(() => {
    process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL = originalEnv;
  });

  it('fails gracefully when GOOGLE_APPS_SCRIPT_WEB_APP_URL is not set', async () => {
    delete process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL;

    const result = await syncLeadToGoogleSheets({
      name: 'Test User',
      email: 'test@example.com'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('not configured');
  });

  it('fails immediately when payload is invalid without sending HTTP request', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch');

    const result = await syncLeadToGoogleSheets({
      name: '',
      email: 'invalid'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Name is required');
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it('successfully synchronizes lead when Apps Script responds with success', async () => {
    const fetchSpy = vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: true,
          leadId: 'lead-test-123',
          message: 'Lead appended to Sheet1'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    );

    const result = await syncLeadToGoogleSheets({
      leadId: 'lead-test-123',
      name: 'Sarah Connor',
      email: 'sarah@skynet.com',
      whatsapp: '+1 555 987 6543',
      leadType: 'Service Inquiry',
      message: 'Need help with AI SEO'
    });

    expect(result.success).toBe(true);
    expect(result.leadId).toBe('lead-test-123');
    expect(fetchSpy).toHaveBeenCalledTimes(1);

    const [calledUrl, calledOptions] = fetchSpy.mock.calls[0];
    expect(calledUrl).toBe(mockEndpoint);
    expect(calledOptions?.method).toBe('POST');
    expect(calledOptions?.headers).toMatchObject({
      'Content-Type': 'application/json'
    });
  });

  it('handles HTTP error status codes (e.g. 404, 500) gracefully', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('Not Found', { status: 404, statusText: 'Not Found' })
    );

    const result = await syncLeadToGoogleSheets({
      name: 'John Connor',
      email: 'john@resistance.org'
    });

    expect(result.success).toBe(false);
    expect(result.status).toBe(404);
    expect(result.error).toContain('404');
  });

  it('handles non-JSON responses from Apps Script (e.g. Google Drive HTML error pages)', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response('<!DOCTYPE html><html><body>Sorry, file does not exist</body></html>', {
        status: 200,
        headers: { 'Content-Type': 'text/html' }
      })
    );

    const result = await syncLeadToGoogleSheets({
      name: 'Kyle Reese',
      email: 'kyle@resistance.org'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('invalid non-JSON response');
  });

  it('handles Apps Script returning success: false with an error message', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValueOnce(
      new Response(
        JSON.stringify({
          success: false,
          error: 'Spreadsheet Sheet1 tab not found.'
        }),
        {
          status: 200,
          headers: { 'Content-Type': 'application/json' }
        }
      )
    );

    const result = await syncLeadToGoogleSheets({
      name: 'Marcus Wright',
      email: 'marcus@example.com'
    });

    expect(result.success).toBe(false);
    expect(result.error).toBe('Spreadsheet Sheet1 tab not found.');
  });

  it('handles network timeouts or connection aborts', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValueOnce(
      new Error('The operation was aborted due to timeout')
    );

    const result = await syncLeadToGoogleSheets({
      name: 'Grace',
      email: 'grace@example.com'
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain('Network error syncing lead');
  });
});
