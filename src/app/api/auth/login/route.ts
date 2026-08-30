import { NextResponse } from 'next/server';
import crypto from 'crypto';

export async function POST(request: Request) {
  try {
    const { passcode } = await request.json();
    const serverPass = process.env.ADMIN_PASSWORD || '';
    const sessionToken = process.env.ADMIN_SESSION_TOKEN || '';

    if (!serverPass || !sessionToken) {
      console.error('Missing ADMIN_PASSWORD or ADMIN_SESSION_TOKEN environment variables');
      return NextResponse.json({ success: false, error: 'Server auth misconfigured' }, { status: 500 });
    }

    // Timing-safe comparison to prevent timing attacks
    let isMatch = false;
    if (passcode && passcode.length === serverPass.length) {
      const a = Buffer.from(passcode);
      const b = Buffer.from(serverPass);
      isMatch = crypto.timingSafeEqual(a, b);
    }

    if (!isMatch) {
      return NextResponse.json({ success: false, error: 'Invalid password' }, { status: 401 });
    }

    // Set secure HttpOnly cookie
    const response = NextResponse.json({ success: true });
    
    // 8 hours = 8 * 60 * 60 = 28800 seconds
    response.cookies.set({
      name: 'admin_session',
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 28800
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ success: false, error: 'Server error during login' }, { status: 500 });
  }
}
