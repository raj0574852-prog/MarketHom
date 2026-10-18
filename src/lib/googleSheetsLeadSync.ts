import { isValidEmail } from './marketplaceLeads';

export interface GoogleSheetLeadPayload {
  name: string;
  email?: string | null;
  whatsapp?: string | null;
  leadType?: string;
  publisherDomain?: string | null;
  listingUrl?: string | null;
  price?: string | number | null;
  message?: string | null;
  source?: string | null;
  status?: string;
  leadId?: string | null;
  createdAt?: string | null;
}

export interface GoogleSheetSyncResult {
  success: boolean;
  leadId?: string;
  message?: string;
  error?: string;
  status?: number;
}

/**
 * Prevents CSV / Spreadsheet formula injection.
 * Prepends a single quote if the value starts with '=', '+', '-', or '@'.
 */
export function sanitizeSpreadsheetField(val: string | number | null | undefined): string {
  if (val === null || val === undefined) return '';
  const str = String(val).trim();
  if (!str) return '';
  if (/^[=+\-@]/.test(str)) {
    return `'${str}`;
  }
  return str;
}

/**
 * Validates and normalizes lead payload before sending to Google Sheets.
 * Generates the standard 12-column structure:
 * [Lead ID, Created At, Name, Email, WhatsApp, Lead Type, Publisher Domain, Listing URL, Price, Message, Source, Status]
 */
export function validateAndNormalizeLeadPayload(lead: GoogleSheetLeadPayload): {
  isValid: boolean;
  error?: string;
  normalized?: Record<string, unknown>;
} {
  const name = (lead.name || '').trim();
  if (!name) {
    return { isValid: false, error: 'Name is required.' };
  }
  if (name.length > 150) {
    return { isValid: false, error: 'Name exceeds maximum length of 150 characters.' };
  }

  const rawEmail = (lead.email || '').trim();
  const rawWhatsApp = (lead.whatsapp || '').trim();

  if (!rawEmail && !rawWhatsApp) {
    return {
      isValid: false,
      error: 'Please enter at least one contact method: email address or WhatsApp number.'
    };
  }

  if (rawEmail && !isValidEmail(rawEmail)) {
    return { isValid: false, error: 'Invalid email address format.' };
  }

  const leadId = sanitizeSpreadsheetField(lead.leadId || `lead-${Date.now()}`);
  const createdAt = sanitizeSpreadsheetField(lead.createdAt || new Date().toISOString());
  const sanitizedName = sanitizeSpreadsheetField(name);
  const sanitizedEmail = rawEmail ? sanitizeSpreadsheetField(rawEmail) : '';
  const sanitizedWhatsApp = rawWhatsApp ? sanitizeSpreadsheetField(rawWhatsApp) : '';
  const sanitizedLeadType = sanitizeSpreadsheetField(lead.leadType || 'General Inquiry');
  const sanitizedPublisherDomain = sanitizeSpreadsheetField(lead.publisherDomain || '');
  const sanitizedListingUrl = sanitizeSpreadsheetField(lead.listingUrl || '');
  const sanitizedPrice = sanitizeSpreadsheetField(
    lead.price !== undefined && lead.price !== null ? String(lead.price) : ''
  );
  const sanitizedMessage = sanitizeSpreadsheetField(lead.message ? lead.message.slice(0, 3000) : '');
  const sanitizedSource = sanitizeSpreadsheetField(lead.source || 'Website');
  const sanitizedStatus = sanitizeSpreadsheetField(lead.status || 'New');

  const normalized: Record<string, unknown> = {
    // Standard camelCase keys
    leadId,
    createdAt,
    name: sanitizedName,
    email: sanitizedEmail,
    whatsapp: sanitizedWhatsApp,
    leadType: sanitizedLeadType,
    publisherDomain: sanitizedPublisherDomain,
    listingUrl: sanitizedListingUrl,
    price: sanitizedPrice,
    message: sanitizedMessage,
    source: sanitizedSource,
    status: sanitizedStatus,

    // Snake_case aliases for flexible Apps Script consumption
    lead_id: leadId,
    created_at: createdAt,
    full_name: sanitizedName,
    lead_type: sanitizedLeadType,
    publisher_domain: sanitizedPublisherDomain,
    listing_url: sanitizedListingUrl,

    // 12-column direct array matching the required sheet layout:
    // [Lead ID, Created At, Name, Email, WhatsApp, Lead Type, Publisher Domain, Listing URL, Price, Message, Source, Status]
    row: [
      leadId,
      createdAt,
      sanitizedName,
      sanitizedEmail,
      sanitizedWhatsApp,
      sanitizedLeadType,
      sanitizedPublisherDomain,
      sanitizedListingUrl,
      sanitizedPrice,
      sanitizedMessage,
      sanitizedSource,
      sanitizedStatus
    ]
  };

  return { isValid: true, normalized };
}

export const DEFAULT_GOOGLE_APPS_SCRIPT_WEB_APP_URL =
  'https://script.google.com/macros/s/AKfycbyb5wreOUh_mOIYmJy1p2bL1cEZd2OXxliJ7YomRcafMgVy1YKvZRKvteYTxl9RF50-/exec';

/**
 * Synchronizes a lead to Google Sheets via the deployed Google Apps Script Web App.
 */
export async function syncLeadToGoogleSheets(
  lead: GoogleSheetLeadPayload,
  endpointUrlOverride?: string
): Promise<GoogleSheetSyncResult> {
  const endpointUrl =
    endpointUrlOverride !== undefined
      ? endpointUrlOverride
      : (process.env.GOOGLE_APPS_SCRIPT_WEB_APP_URL || DEFAULT_GOOGLE_APPS_SCRIPT_WEB_APP_URL);

  if (!endpointUrl || !endpointUrl.trim()) {
    console.warn('[GoogleSheetsLeadSync] Configuration error: GOOGLE_APPS_SCRIPT_WEB_APP_URL is not set.');
    return {
      success: false,
      error: 'Google Sheets sync is not configured on the server.'
    };
  }

  // Validate and normalize
  const validation = validateAndNormalizeLeadPayload(lead);
  if (!validation.isValid || !validation.normalized) {
    return {
      success: false,
      error: validation.error || 'Invalid lead payload.'
    };
  }

  try {
    const res = await fetch(endpointUrl.trim(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(validation.normalized),
      redirect: 'follow',
      signal: AbortSignal.timeout(25000)
    });

    if (!res.ok) {
      console.warn(`[GoogleSheetsLeadSync] Apps Script returned HTTP ${res.status}`);
      return {
        success: false,
        status: res.status,
        error: `Google Apps Script returned HTTP ${res.status}`
      };
    }

    const rawText = await res.text();
    let data: { success?: boolean; leadId?: string; id?: string; message?: string; error?: string };

    try {
      data = JSON.parse(rawText);
    } catch {
      console.warn('[GoogleSheetsLeadSync] Received non-JSON response from Google Apps Script.');
      return {
        success: false,
        status: res.status,
        error: 'Google Apps Script returned an invalid non-JSON response.'
      };
    }

    if (data.success === true) {
      return {
        success: true,
        leadId: data.leadId || data.id,
        message: data.message || 'Lead saved successfully to Google Sheet.'
      };
    }

    console.warn('[GoogleSheetsLeadSync] Apps Script reported failure:', data.error || data.message);
    return {
      success: false,
      error: data.error || data.message || 'Google Apps Script failed to save lead.'
    };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error('[GoogleSheetsLeadSync] Connection or timeout error syncing lead:', errorMsg);
    return {
      success: false,
      error: `Network error syncing lead to Google Sheets: ${errorMsg}`
    };
  }
}
