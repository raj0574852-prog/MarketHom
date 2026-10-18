import { NextResponse } from 'next/server';
import { getServiceSupabase } from '@/lib/supabaseClient';
import { isAdminAuthenticated } from '@/lib/auth';

export async function GET(req: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const supabase = getServiceSupabase();
  const { data: settings } = await supabase
    .from('website_sync_settings')
    .select('*')
    .limit(1)
    .maybeSingle();

  return NextResponse.json(settings || {});
}

export async function POST(req: Request) {
  try {
    if (!(await isAdminAuthenticated())) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const supabase = getServiceSupabase();
    const body = await req.json();
    
    // Find existing
    const { data: existing } = await supabase
      .from('website_sync_settings')
      .select('id')
      .limit(1)
      .maybeSingle();

    if (existing) {
      const { data, error } = await supabase
        .from('website_sync_settings')
        .update({
          spreadsheet_id: body.spreadsheet_id,
          sheet_name: body.sheet_name,
          auto_sync_enabled: body.auto_sync_enabled,
          auto_publish_new_sites: body.auto_publish_new_sites,
          archive_missing_sites: body.archive_missing_sites
        })
        .eq('id', existing.id)
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json(data);
    } else {
      const { data, error } = await supabase
        .from('website_sync_settings')
        .insert({
          spreadsheet_id: body.spreadsheet_id,
          sheet_name: body.sheet_name,
          auto_sync_enabled: body.auto_sync_enabled,
          auto_publish_new_sites: body.auto_publish_new_sites,
          archive_missing_sites: body.archive_missing_sites
        })
        .select()
        .single();
        
      if (error) throw error;
      return NextResponse.json(data);
    }
  } catch (error: unknown) {
    console.error('Settings Update Error:', error);
    return NextResponse.json({ success: false, message: 'Internal Server Error' }, { status: 500 });
  }
}
