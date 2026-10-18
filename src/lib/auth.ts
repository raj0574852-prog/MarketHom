import { createClient } from './supabaseServer';

export async function isAdminAuthenticated(): Promise<boolean> {
  try {
    const supabase = await createClient();
    
    // 1. Obtain the authenticated Supabase user from the server-side session
    const { data: { user }, error } = await supabase.auth.getUser();
    
    // 2. Verify that the session is valid
    if (error || !user) {
      return false;
    }

    // 3. Retrieve the authenticated user's email & 4. Normalize
    const userEmail = user.email?.toLowerCase().trim();
    if (!userEmail) return false;

    const configuredAdminEmails = process.env.ADMIN_EMAILS || 'raj057485251@gmail.com,raj0574852@gmail.com';
    const allowedEmails = configuredAdminEmails
      .toLowerCase()
      .split(',')
      .map(e => e.trim());

    // 5. Compare it against ADMIN_EMAILS & 6. Grant access if it matches
    if (allowedEmails.includes(userEmail)) {
      return true;
    }

    return false;
  } catch (err) {
    console.error('Error verifying admin auth:', err);
    return false;
  }
}
