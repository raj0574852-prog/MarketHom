import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabaseServer';

export async function POST() {
  try {
    const supabase = await createClient();
    
    // signOut will automatically clear the cookies via the Supabase SSR setAll callback
    await supabase.auth.signOut();
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Server error during logout' }, { status: 500 });
  }
}
