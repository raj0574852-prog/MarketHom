import crypto from 'crypto';
import { cookies } from 'next/headers';

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies();
  const providedToken = cookieStore.get('admin_session')?.value || '';
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';
  
  if (!sessionToken) {
    return false;
  }

  let isValid = false;
  if (providedToken && providedToken.length === sessionToken.length) {
    isValid = crypto.timingSafeEqual(
      Buffer.from(providedToken),
      Buffer.from(sessionToken)
    );
  }
  
  return isValid;
}
