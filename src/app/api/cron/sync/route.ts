import { NextResponse } from 'next/server';
import { runWebsiteSync } from '@/services/websiteSyncService';

// To protect cron routes, a secret is usually passed in headers
// For example, Vercel uses CRON_SECRET
export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Only enforce if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const result = await runWebsiteSync('automatic');
    
    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Cron Sync Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
