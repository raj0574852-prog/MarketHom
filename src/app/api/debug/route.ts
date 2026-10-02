import { NextResponse } from 'next/server';
import { fetchGoogleSheet } from '@/lib/googleSheets';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const data = await fetchGoogleSheet();
  const site = data.find(s => s.domain === 'textilelearner.net');
    
  return NextResponse.json({ site });
}
