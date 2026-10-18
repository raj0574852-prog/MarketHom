import { type NextRequest } from 'next/server';
import { updateSession } from './lib/supabaseMiddleware';

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: ['/websites/:path*', '/admin/:path*', '/api/admin/:path*'],
};
