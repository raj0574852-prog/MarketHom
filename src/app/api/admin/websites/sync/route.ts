import { NextResponse } from 'next/server';
import { runWebsiteSync } from '@/services/websiteSyncService';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';

export const maxDuration = 300; // 5 minutes max duration for Vercel


export async function POST(req: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    
    const result = await runWebsiteSync('manual');
    
    if (result.success) {
      return NextResponse.json(result);
    } else {
      return NextResponse.json(result, { status: 400 });
    }
  } catch (error: unknown) {
    console.error('API Sync Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  if (!await isAdminAuthenticated()) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const supabase = getServiceSupabase();
  
  // Get sync status
  const { data: runningSync } = await supabase
    .from('website_sync_logs')
    .select('id, started_at, status')
    .eq('status', 'running')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: lastSync } = await supabase
    .from('website_sync_logs')
    .select('*')
    .neq('status', 'running')
    .order('started_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return NextResponse.json({
    isRunning: !!runningSync,
    runningSince: runningSync?.started_at,
    lastSync: lastSync
  });
}
