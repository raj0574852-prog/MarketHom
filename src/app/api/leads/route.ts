import { NextResponse } from 'next/server';

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

// Persistent server-side store in global object for Next.js server runtime
const globalForLeads = globalThis as unknown as {
  serverLeads: LeadInquiry[] | undefined;
};

const INITIAL_SERVER_LEADS: LeadInquiry[] = [
  { id: 'l1', name: 'Sarah Jenkins', email: 'sarah@techflow.io', website: 'techflow.io', serviceRequested: 'AI SEO Audit', date: 'Jul 25, 2026', status: 'New' },
  { id: 'l2', name: 'David Miller', email: 'david@apexretail.com', website: 'apexretail.com', serviceRequested: 'PPC Management', date: 'Jul 24, 2026', status: 'Contacted' },
  { id: 'l3', name: 'Elena Rostova', email: 'elena@luminar.co', website: 'luminar.co', serviceRequested: 'Full Web Redesign', date: 'Jul 22, 2026', status: 'Closed' }
];

if (!globalForLeads.serverLeads) {
  globalForLeads.serverLeads = INITIAL_SERVER_LEADS;
}

export async function GET() {
  return NextResponse.json({
    success: true,
    leads: globalForLeads.serverLeads || INITIAL_SERVER_LEADS
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    if (!body.name || !body.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const newLead: LeadInquiry = {
      id: 'lead-' + Date.now(),
      name: body.name,
      email: body.email,
      website: body.website || '',
      serviceRequested: body.serviceRequested || body.service || 'General Inquiry',
      phone: body.phone || '',
      company: body.company || '',
      budget: body.budget || '',
      message: body.message || '',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      status: 'New'
    };

    if (!globalForLeads.serverLeads) {
      globalForLeads.serverLeads = INITIAL_SERVER_LEADS;
    }

    // Add new lead at top
    globalForLeads.serverLeads = [newLead, ...globalForLeads.serverLeads];

    return NextResponse.json({
      success: true,
      message: 'Lead saved successfully',
      lead: newLead
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to process lead' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json({ success: false, error: 'ID and status required' }, { status: 400 });
    }

    if (globalForLeads.serverLeads) {
      globalForLeads.serverLeads = globalForLeads.serverLeads.map(l => 
        l.id === id ? { ...l, status } : l
      );
    }

    return NextResponse.json({
      success: true,
      leads: globalForLeads.serverLeads
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update lead status' }, { status: 500 });
  }
}
