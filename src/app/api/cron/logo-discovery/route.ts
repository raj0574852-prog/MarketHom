import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { discoverLogoUrl } from '@/services/logoDiscoveryService';

const BATCH_SIZE = 25;
const CONCURRENCY = 5;

// Helper to run promises with concurrency limit
async function asyncPool<T>(
  concurrency: number, 
  iterable: any[], 
  iteratorFn: (item: any, iterable: any[]) => Promise<T>
) {
  const ret: Promise<T>[] = [];
  const executing: Promise<any>[] = [];
  
  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));
    ret.push(p);

    if (concurrency <= iterable.length) {
      const e: Promise<any> = p.then(() => executing.splice(executing.indexOf(e), 1));
      executing.push(e);
      if (executing.length >= concurrency) {
        await Promise.race(executing);
      }
    }
  }
  return Promise.all(ret);
}

export async function GET(req: Request) {
  try {
    const authHeader = req.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;
    
    // Only enforce if CRON_SECRET is set
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    
    const supabase = getServiceSupabase();
    
    // Claim Jobs using atomic RPC
    const { data: jobs, error: claimError } = await supabase.rpc('claim_logo_discovery_jobs', {
      batch_limit: BATCH_SIZE
    });

    if (claimError) {
      console.error('Failed to claim logo discovery jobs:', claimError);
      return NextResponse.json({ success: false, error: claimError.message }, { status: 500 });
    }

    if (!jobs || jobs.length === 0) {
      return NextResponse.json({ success: true, processed: 0, message: 'No pending logo discovery jobs' });
    }

    // Process jobs
    const processJob = async (job: any) => {
      try {
        const logoUrl = await discoverLogoUrl(job.domain);

        if (logoUrl) {
          // Success
          await supabase
            .from('website_listings')
            .update({
              logo_url: logoUrl,
              logo_source: 'auto',
              logo_discovery_status: 'success',
              logo_last_checked_at: new Date().toISOString(),
            })
            .eq('id', job.id);
            
          return { id: job.id, domain: job.domain, success: true };
        } else {
          // Failed (trigger backoff)
          await supabase
            .from('website_listings')
            .update({
              logo_discovery_status: 'failed',
              logo_discovery_attempts: (job.logo_discovery_attempts || 0) + 1,
              logo_last_checked_at: new Date().toISOString(),
            })
            .eq('id', job.id);
            
          return { id: job.id, domain: job.domain, success: false, reason: 'Not found or timeout' };
        }
      } catch (error: any) {
        // Hard failure
        await supabase
          .from('website_listings')
          .update({
            logo_discovery_status: 'failed',
            logo_discovery_attempts: (job.logo_discovery_attempts || 0) + 1,
            logo_last_checked_at: new Date().toISOString(),
          })
          .eq('id', job.id);
          
        return { id: job.id, domain: job.domain, success: false, reason: error.message };
      }
    };

    const results = await asyncPool(CONCURRENCY, jobs, processJob);

    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: true,
      processed: jobs.length,
      successCount,
      failedCount: jobs.length - successCount,
      results
    });

  } catch (error: any) {
    console.error('Logo Discovery Cron Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
