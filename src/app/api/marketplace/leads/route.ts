import { NextResponse } from 'next/server';
import { 
  createMarketplaceLead, 
  getMarketplaceLeads, 
  getMarketplaceLeadMetrics, 
  updateMarketplaceLeadStatus,
  isValidEmail,
  normalizeWhatsAppNumber,
  MarketplaceLeadStatus
} from '@/lib/marketplaceLeads';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';
import { CANONICAL_SITE_URL } from '@/lib/constants';
import { syncLeadToGoogleSheets } from '@/lib/googleSheetsLeadSync';

// In-memory rate limiting map for basic abuse prevention (IP -> last submit timestamp)
const rateLimitMap = new Map<string, number>();

export async function POST(request: Request) {
  try {
    // 1. Basic Rate Limiting: 1 submission per 5 seconds per client
    const clientIp = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
    const now = Date.now();
    const lastSubmit = rateLimitMap.get(clientIp);
    if (lastSubmit && now - lastSubmit < 5000) {
      return NextResponse.json(
        { success: false, error: 'Too many requests. Please wait a moment before submitting again.' },
        { status: 429 }
      );
    }
    rateLimitMap.set(clientIp, now);

    // 2. Parse payload safely
    const body = await request.json();
    const { fullName, email, whatsapp, message, publisherSlug, publisherDomain, listingUrl, price: clientPrice } = body;

    // 3. Validate Full Name
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Please enter your full name.' },
        { status: 400 }
      );
    }

    if (fullName.trim().length > 100) {
      return NextResponse.json(
        { success: false, error: 'Full name exceeds 100 characters.' },
        { status: 400 }
      );
    }

    // 4. Validate At-Least-One-Contact-Method Rule
    const hasEmail = email && typeof email === 'string' && email.trim().length > 0;
    const hasWhatsApp = whatsapp && typeof whatsapp === 'string' && whatsapp.trim().length > 0;

    if (!hasEmail && !hasWhatsApp) {
      return NextResponse.json(
        { success: false, error: 'Please enter at least one contact method: email address or WhatsApp number.' },
        { status: 400 }
      );
    }

    // 5. Validate Email (if provided)
    let validatedEmail: string | null = null;
    if (hasEmail) {
      if (!isValidEmail(email)) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid email address.' },
          { status: 400 }
        );
      }
      validatedEmail = email.trim();
    }

    // 6. Validate & Normalize WhatsApp (if provided)
    let validatedWhatsApp: string | null = null;
    if (hasWhatsApp) {
      validatedWhatsApp = normalizeWhatsAppNumber(whatsapp);
      if (!validatedWhatsApp) {
        return NextResponse.json(
          { success: false, error: 'Please enter a valid WhatsApp number with country code (e.g. +1 555 123 4567).' },
          { status: 400 }
        );
      }
    }

    // 7. Verify Listing Server-Side (DO NOT TRUST CLIENT PRICE/URL)
    const targetSlug = (publisherSlug || publisherDomain || '').trim();
    if (!targetSlug) {
      return NextResponse.json(
        { success: false, error: 'Publisher identification is missing.' },
        { status: 400 }
      );
    }

    const supabase = getServiceSupabase();
    let verifiedPrice: number | null = null;
    let verifiedCurrency = 'USD';
    let verifiedPublisherId: string | null = null;
    let verifiedDomain = targetSlug;
    const verifiedListingUrl = listingUrl && listingUrl.startsWith('http') 
      ? listingUrl 
      : `${CANONICAL_SITE_URL}/website/${targetSlug}`;

    try {
      const { data: siteData } = await supabase
        .from('website_listings')
        .select('id, domain, slug, content_placement_selling_price, price, content_placement_price, currency')
        .or(`slug.eq.${targetSlug},domain.eq.${targetSlug}`)
        .limit(1)
        .maybeSingle();

      if (siteData) {
        verifiedPublisherId = siteData.id;
        verifiedDomain = siteData.domain;
        verifiedPrice = siteData.content_placement_selling_price || siteData.price || siteData.content_placement_price || null;
        verifiedCurrency = siteData.currency || 'USD';
      }
    } catch {
      // If DB is offline or mock slug, fallback to provided domain safely
    }

    // Determine clean display price for Google Sheets
    let finalPriceDisplay = 'Custom Quote';
    if (verifiedPrice !== null && verifiedPrice !== undefined) {
      finalPriceDisplay = `${verifiedCurrency === 'USD' || !verifiedCurrency ? '$' : verifiedCurrency}${verifiedPrice}`;
    } else if (clientPrice && typeof clientPrice === 'string' && clientPrice.trim()) {
      finalPriceDisplay = clientPrice.trim();
    } else if (typeof clientPrice === 'number' && !isNaN(clientPrice)) {
      finalPriceDisplay = `$${clientPrice}`;
    }

    // 8. Create Lead Record in Supabase
    let lead = null;
    try {
      lead = await createMarketplaceLead({
        fullName: fullName.trim(),
        email: validatedEmail,
        whatsapp: validatedWhatsApp,
        message: message ? String(message).trim().slice(0, 3000) : null,
        publisherId: verifiedPublisherId,
        publisherDomain: verifiedDomain,
        listingUrl: verifiedListingUrl,
        price: verifiedPrice,
        currency: verifiedCurrency
      });
    } catch (dbErr) {
      console.warn('[MarketplaceLeadsRoute] Supabase DB write skipped or offline:', dbErr);
    }

    // 9. Synchronize to Google Sheet
    const leadId = lead ? lead.id : `mkt-lead-${Date.now()}`;
    const createdAt = lead ? lead.created_at : new Date().toISOString();

    let sheetSyncResult = null;
    try {
      sheetSyncResult = await syncLeadToGoogleSheets({
        leadId,
        createdAt,
        name: fullName.trim(),
        email: validatedEmail,
        whatsapp: validatedWhatsApp,
        leadType: 'Publisher Placement',
        publisherDomain: verifiedDomain,
        listingUrl: verifiedListingUrl,
        price: finalPriceDisplay,
        message: message ? String(message).trim().slice(0, 3000) : null,
        source: 'Publisher Listing Page',
        status: lead?.status || 'New'
      });
    } catch (syncErr) {
      console.warn('[MarketplaceLeadsRoute] Google Sheets sync error:', syncErr);
    }

    // Ensure lead was successfully persisted to at least one durable destination
    if (!lead && (!sheetSyncResult || !sheetSyncResult.success)) {
      return NextResponse.json(
        { success: false, error: 'Failed to save inquiry. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Inquiry saved successfully.',
      leadId,
      googleSheetsSynced: sheetSyncResult?.success ?? false
    });
  } catch (err: unknown) {
    console.error('Error in POST /api/marketplace/leads:', err);
    return NextResponse.json(
      { success: false, error: 'Failed to save inquiry. Please try again.' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    if (!await isAdminAuthenticated()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const status = searchParams.get('status') || 'All';
    const search = searchParams.get('search') || '';

    const [leadsResult, metrics] = await Promise.all([
      getMarketplaceLeads({ page, limit, status, search }),
      getMarketplaceLeadMetrics()
    ]);

    return NextResponse.json({
      success: true,
      ...leadsResult,
      metrics
    });
  } catch (err) {
    console.error('Error in GET /api/marketplace/leads:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    if (!await isAdminAuthenticated()) {
      return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
    }

    const { id, status } = await request.json();

    const validStatuses: MarketplaceLeadStatus[] = ['New', 'Contacted', 'In Discussion', 'Converted', 'Closed'];
    if (!id || !status || !validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Invalid lead ID or status' },
        { status: 400 }
      );
    }

    const updated = await updateMarketplaceLeadStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully',
      lead: updated
    });
  } catch (err) {
    console.error('Error in PATCH /api/marketplace/leads:', err);
    return NextResponse.json({ success: false, error: 'Server error' }, { status: 500 });
  }
}
