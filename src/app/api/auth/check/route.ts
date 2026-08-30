import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function GET(request: Request) {
  const cookieHeader = request.headers.get('cookie') || '';
  const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';
  
  if (!sessionToken) {
    return NextResponse.json({ authenticated: false }, { status: 500 });
  }

  const match = cookieHeader.match(/admin_session=([^;]+)/);
  const providedToken = match ? match[1] : '';

  let isValid = false;
  if (providedToken && providedToken.length === sessionToken.length) {
    isValid = crypto.timingSafeEqual(
      Buffer.from(providedToken),
      Buffer.from(sessionToken)
    );
  }
  
  if (isValid) {
    return NextResponse.json({ authenticated: true });
  }
  
  return NextResponse.json({ authenticated: false }, { status: 401 });
}
