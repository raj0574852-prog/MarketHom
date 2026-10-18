import { createClient } from '@supabase/supabase-js';

const hasEnv = Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
if (!hasEnv) {
  console.warn(
    '[supabaseClient] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
    'Database operations will fail until environment variables are set in .env.local.'
  );
}

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key';

// Client for public reads (using Anon Key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Server-only client for privileged admin operations (using Service Role Key)
export const getServiceSupabase = () => {
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'mock-service-key';
  return createClient(supabaseUrl, serviceKey);
};
