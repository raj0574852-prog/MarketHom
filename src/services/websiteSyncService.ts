import { getServiceSupabase } from '../lib/supabaseClient';
import { fetchGoogleSheet, WebsiteRow } from '../lib/googleSheets';
import { revalidatePath } from 'next/cache';
import { calculateContentPlacementSellingPrice } from '../lib/pricing/contentPlacement';
import crypto from 'crypto';

export interface SyncResult {
  success: boolean;
  message: string;
  logId?: string;
  stats?: {
    total: number;
    created: number;
    updated: number;
    unchanged: number;
    archived: number;
    errors: number;
  };
}

export async function runWebsiteSync(syncType: 'manual' | 'automatic'): Promise<SyncResult> {
  const supabase = getServiceSupabase();

  try {
    // 1. Check for running sync (Concurrency lock)
    const { data: runningSync } = await supabase
      .from('website_sync_logs')
      .select('id, started_at')
      .eq('status', 'running')
      .order('started_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (runningSync) {
      // If it's been running for over 1 hour, assume it failed and ignore lock
      const started = new Date(runningSync.started_at).getTime();
      const now = Date.now();
      if (now - started < 3600000) {
        return { success: false, message: 'A synchronization is already running.' };
      }
    }

    // 2. Fetch Settings
    const { data: settings } = await supabase
      .from('website_sync_settings')
      .select('*')
      .limit(1)
      .maybeSingle();

    if (!settings || !settings.spreadsheet_id) {
      return { success: false, message: 'Google Sheets synchronization is not configured.' };
    }

    // 3. Create Log Record
    const { data: logRecord, error: logError } = await supabase
      .from('website_sync_logs')
      .insert({
        sync_type: syncType,
        status: 'running',
      })
      .select()
      .single();

    if (logError || !logRecord) {
      return { success: false, message: 'Failed to create sync log.' };
    }

    const logId = logRecord.id;

    let stats = {
      total: 0,
      created: 0,
      updated: 0,
      unchanged: 0,
      archived: 0,
      errors: 0,
    };
    
    let errorSummary = '';

    try {
      // 4. Fetch Google Sheet Data (PHASE 1)
      const { rows, isComplete } = await fetchGoogleSheet(settings.spreadsheet_id, settings.sheet_name);
      stats.total = rows.length;

      if (rows.length === 0) {
        throw new Error('Google Sheet returned no data. Aborting to prevent accidental mass archival.');
      }

      // Check for duplicate normalized domains in the incoming sheet
      const uniqueIncomingDomains = new Set<string>();
      let hasDuplicates = false;
      for (const r of rows) {
          if (uniqueIncomingDomains.has(r.domain)) {
              hasDuplicates = true;
              break;
          }
          uniqueIncomingDomains.add(r.domain);
      }
      
      const isDatasetConfirmedComplete = isComplete && !hasDuplicates;

      // 5. Fetch all existing websites to compare
      const { data: existingSites, error: fetchError } = await supabase
        .from('website_listings')
        .select('id, domain, source_hash, is_in_google_sheet, is_listed, status, slug, name, website_url, content_placement_selling_price, logo_url');

      if (fetchError) throw fetchError;

      const existingMap = new Map(existingSites?.map((s) => [s.domain, s]) || []);
      const processedDomains = new Set<string>();
      
      const newSitesToInsert: any[] = [];
      const sitesToUpdate: any[] = [];
      const metricsToUpsert: any[] = []; // Collect metrics for separate insertion

      // 6. Process Rows
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        
        // Skip duplicate rows if they exist, keeping the first one we processed
        if (processedDomains.has(row.domain)) continue;
        processedDomains.add(row.domain);

        const existing = existingMap.get(row.domain);

        if (existing) {
          const newIsListed = row.is_listed !== false; // Default to true unless explicitly marked false

          const newSellingPrice = calculateContentPlacementSellingPrice(row.content_placement_price)?.sellingPrice || null;
          const newMarkupPercentage = calculateContentPlacementSellingPrice(row.content_placement_price)?.markupPercentage || null;

          if (existing.source_hash === row.source_hash && 
              existing.is_in_google_sheet === true && 
              existing.is_listed === newIsListed &&
              existing.content_placement_selling_price === newSellingPrice) {
            stats.unchanged++;
            continue; // No changes
          } else {
            // Update (only specifying fields we want to overwrite)
            sitesToUpdate.push({
              id: existing.id,
              domain: row.domain,
              slug: existing.slug || row.domain,
              name: existing.name || row.domain,
              website_url: existing.website_url || `https://${row.domain}`,
              category_id: row.category_id,
              price: row.price,
              country: row.country,
              language: row.language,
              link_validity: row.link_validity,
              content_placement_price: row.content_placement_price,
              content_placement_selling_price: newSellingPrice,
              content_placement_markup_percentage: newMarkupPercentage,
              link_insert_price: row.link_insert_price,
              cbd_content_placement_price: row.cbd_content_placement_price,
              cbd_content_creation_placement_price: row.cbd_content_creation_placement_price,
              cbd_link_insert_price: row.cbd_link_insert_price,
              adult_content_placement_price: row.adult_content_placement_price,
              adult_content_creation_placement_price: row.adult_content_creation_placement_price,
              adult_link_insert_price: row.adult_link_insert_price,
              total_deals: row.total_deals,
              sample_link: row.sample_link,
              source_hash: row.source_hash,
              last_synced_at: new Date().toISOString(),
              last_source_change_at: existing.source_hash !== row.source_hash ? new Date().toISOString() : undefined,
              is_in_google_sheet: true,
              is_listed: newIsListed,
              ...(row.featured !== undefined ? { featured: row.featured } : {}),
              ...(row.logo_url && row.logo_url.trim() !== '' 
                ? { 
                    logo_url: row.logo_url.trim(),
                    logo_source: 'sheet',
                    logo_discovery_status: 'success'
                  } 
                : (!existing.logo_url 
                    ? { logo_discovery_status: 'pending' } 
                    : {})
              )
              // NOTE: We absolutely do NOT overwrite `status` or `name` here, protecting admin fields and keeping pages live!
            });
            
            // Queue metrics
            metricsToUpsert.push(
              { website_listing_id: existing.id, metric_type: 'DA', value: row.da },
              { website_listing_id: existing.id, metric_type: 'PA', value: row.pa },
              { website_listing_id: existing.id, metric_type: 'DR', value: row.dr },
              { website_listing_id: existing.id, metric_type: 'SEMRUSH_AUTHORITY', value: row.semrush_traffic },
              { website_listing_id: existing.id, metric_type: 'AHREFS_TRAFFIC', value: row.ahrefs_traffic },
              { website_listing_id: existing.id, metric_type: 'SPAM_SCORE', value: row.spam_score }
            );
            
            stats.updated++;
          }
        } else {
          // Create
          const newId = crypto.randomUUID();
          newSitesToInsert.push({
            id: newId,
            domain: row.domain,
            slug: row.domain, // Using domain as slug ensures uniqueness
            name: row.domain, // Best effort for name if no dedicated column
            website_url: `https://${row.domain}`,
            category_id: row.category_id,
            price: row.price,
            country: row.country,
            language: row.language,
            link_validity: row.link_validity,
            content_placement_price: row.content_placement_price,
            content_placement_selling_price: calculateContentPlacementSellingPrice(row.content_placement_price)?.sellingPrice || null,
            content_placement_markup_percentage: calculateContentPlacementSellingPrice(row.content_placement_price)?.markupPercentage || null,
            link_insert_price: row.link_insert_price,
            cbd_content_placement_price: row.cbd_content_placement_price,
            cbd_content_creation_placement_price: row.cbd_content_creation_placement_price,
            cbd_link_insert_price: row.cbd_link_insert_price,
            adult_content_placement_price: row.adult_content_placement_price,
            adult_content_creation_placement_price: row.adult_content_creation_placement_price,
            adult_link_insert_price: row.adult_link_insert_price,
            total_deals: row.total_deals,
            sample_link: row.sample_link,
            source_hash: row.source_hash,
            last_synced_at: new Date().toISOString(),
            last_source_change_at: new Date().toISOString(),
            source: 'google_sheets',
            is_in_google_sheet: true,
            is_listed: row.is_listed !== false,
            status: settings.auto_publish_new_sites ? 'published' : 'draft',
            featured: row.featured || false,
            ...(row.logo_url && row.logo_url.trim() !== '' 
              ? { 
                  logo_url: row.logo_url.trim(),
                  logo_source: 'sheet',
                  logo_discovery_status: 'success'
                } 
              : { logo_discovery_status: 'pending' }
            )
          });

          metricsToUpsert.push(
            { website_listing_id: newId, metric_type: 'DA', value: row.da },
            { website_listing_id: newId, metric_type: 'PA', value: row.pa },
            { website_listing_id: newId, metric_type: 'DR', value: row.dr },
            { website_listing_id: newId, metric_type: 'SEMRUSH_AUTHORITY', value: row.semrush_traffic },
            { website_listing_id: newId, metric_type: 'AHREFS_TRAFFIC', value: row.ahrefs_traffic },
            { website_listing_id: newId, metric_type: 'SPAM_SCORE', value: row.spam_score }
          );
          
          stats.created++;
        }
      }

      // 7. Perform Bulk Upserts
      if (newSitesToInsert.length > 0) {
        const { error: insertError } = await supabase.from('website_listings').insert(newSitesToInsert);
        if (insertError) throw new Error(`Insert failed: ${insertError.message}`);
      }

      if (sitesToUpdate.length > 0) {
        const { error: updateError } = await supabase.from('website_listings').upsert(sitesToUpdate, { onConflict: 'id' });
        if (updateError) throw new Error(`Update failed: ${updateError.message}`);
      }
      
      // Upsert metrics
      if (metricsToUpsert.length > 0) {
        const listingIds = [...newSitesToInsert.map(s => s.id), ...sitesToUpdate.map(s => s.id)];
        
        const chunkSize = 100;
        for (let i = 0; i < listingIds.length; i += chunkSize) {
          const chunk = listingIds.slice(i, i + chunkSize);
          await supabase.from('website_metrics').delete().in('website_listing_id', chunk);
        }
        
        const validMetrics = metricsToUpsert.filter(m => m.value !== undefined && m.value !== null && !Number.isNaN(m.value));
        
        if (validMetrics.length > 0) {
          for (let i = 0; i < validMetrics.length; i += chunkSize) {
             const chunk = validMetrics.slice(i, i + chunkSize);
             await supabase.from('website_metrics').insert(chunk);
          }
        }
      }

      // 8. Handle Removals (PHASE 2 - ONLY IF COMPLETENESS IS VERIFIED)
      if (settings.archive_missing_sites) {
        if (!isDatasetConfirmedComplete) {
            console.warn('Dataset completeness could not be verified (parser warnings or duplicates detected). Safe updates applied. Removals SKIPPED.');
            errorSummary += ' (Warning: Removals skipped due to incomplete/unverified dataset confidence.)';
        } else {
            const domainsToRemoveFromSheet = [];
            for (const [domain, site] of Array.from(existingMap.entries())) {
              if (!processedDomains.has(domain) && site.is_in_google_sheet) {
                domainsToRemoveFromSheet.push(site.id);
              }
            }

            if (domainsToRemoveFromSheet.length > 0) {
               const { error: archiveError } = await supabase
                .from('website_listings')
                .update({ is_in_google_sheet: false, is_listed: false }) // IMPORTANT: Do NOT touch status. Page remains live!
                .in('id', domainsToRemoveFromSheet);
                
               if (archiveError) throw new Error(`Removal failed: ${archiveError.message}`);
               stats.archived = domainsToRemoveFromSheet.length;
            }
        }
      }

      // 9. Update Settings Timestamp
      await supabase
        .from('website_sync_settings')
        .update({ last_successful_sync: new Date().toISOString() })
        .eq('id', settings.id);

      // 10. Complete Log
      await supabase
        .from('website_sync_logs')
        .update({
          status: 'completed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - new Date(logRecord.started_at).getTime(),
          total_rows: stats.total,
          created_count: stats.created,
          updated_count: stats.updated,
          unchanged_count: stats.unchanged,
          archived_count: stats.archived,
          error_count: stats.errors
        })
        .eq('id', logId);

      // 11. Revalidate Next.js Cache
      try {
        revalidatePath('/websites');
        revalidatePath('/websites/[slug]', 'page');
        revalidatePath('/'); // Revalidate home in case featured sites changed
      } catch (cacheErr) {
        console.warn('Cache revalidation skipped/failed (expected if run outside Next context):', cacheErr);
      }

      return { success: true, message: 'Synchronization completed successfully.', logId, stats };

    } catch (processError: any) {
      errorSummary = processError.message;
      stats.errors = 1;
      
      // Fail Log
      await supabase
        .from('website_sync_logs')
        .update({
          status: 'failed',
          completed_at: new Date().toISOString(),
          duration_ms: Date.now() - new Date(logRecord.started_at).getTime(),
          total_rows: stats.total,
          error_count: stats.errors,
          error_summary: errorSummary
        })
        .eq('id', logId);

      return { success: false, message: `Sync failed: ${errorSummary}`, logId, stats };
    }

  } catch (error: any) {
    console.error('Fatal sync error:', error);
    return { success: false, message: `Fatal error: ${error.message}` };
  }
}
