import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { discoverLogoUrl } from '@/services/logoDiscoveryService';

const BATCH_SIZE = 25;
const CONCURRENCY = 5;

// Helper to run promises with concurrency limit
async function asyncPool<T, Item>(
  concurrency: number, 
  iterable: Item[], 
  iteratorFn: (item: Item, iterable: Item[]) => Promise<T>
) {
  const ret: Promise<T>[] = [];
  const executing: Promise<unknown>[] = [];
  
  for (const item of iterable) {
    const p = Promise.resolve().then(() => iteratorFn(item, iterable));
    ret.push(p);

    if (concurrency <= iterable.length) {
      const e: Promise<unknown> = p.then(() => executing.splice(executing.indexOf(e), 1));
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
    
    // Fail closed: reject if secret is missing or mismatched
    if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
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

    interface LogoDiscoveryJob {
      id: string;
      domain: string;
      logo_discovery_attempts?: number;
    }

    // Process jobs
    const processJob = async (job: LogoDiscoveryJob) => {
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
      } catch (error: unknown) {
        // Hard failure
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        await supabase
          .from('website_listings')
          .update({
            logo_discovery_status: 'failed',
            logo_discovery_attempts: (job.logo_discovery_attempts || 0) + 1,
            logo_last_checked_at: new Date().toISOString(),
          })
          .eq('id', job.id);
          
        return { id: job.id, domain: job.domain, success: false, reason: errorMessage };
      }
    };

    const results = await asyncPool(CONCURRENCY, jobs as LogoDiscoveryJob[], processJob);

    const successCount = results.filter(r => r.success).length;
    
    return NextResponse.json({
      success: true,
      processed: jobs.length,
      successCount,
      failedCount: jobs.length - successCount,
      results
    });

  } catch (error: unknown) {
    console.error('Logo Discovery Cron Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
