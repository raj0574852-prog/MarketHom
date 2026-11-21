import { NextResponse, type NextRequest } from 'next/server';
import { updateSession } from './lib/supabaseMiddleware';

function createGoneResponse(): NextResponse {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>410 Gone - Resource Permanently Removed | EducationHom</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background: #020617;
      color: #94a3b8;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      max-width: 580px;
      width: 100%;
      background: rgba(15, 23, 42, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 24px;
      padding: 48px 36px;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.6);
      backdrop-filter: blur(16px);
    }
    .badge {
      display: inline-block;
      padding: 6px 14px;
      border-radius: 9999px;
      background: rgba(239, 68, 68, 0.15);
      color: #f87171;
      border: 1px solid rgba(239, 68, 68, 0.3);
      font-size: 11px;
      font-weight: 800;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      margin-bottom: 24px;
    }
    h1 {
      color: #ffffff;
      font-size: 30px;
      font-weight: 900;
      letter-spacing: -0.02em;
      margin-bottom: 14px;
    }
    p {
      font-size: 15px;
      line-height: 1.65;
      color: #94a3b8;
      margin-bottom: 32px;
    }
    .actions {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }
    @media (min-width: 480px) {
      .actions {
        flex-direction: row;
        justify-content: center;
      }
    }
    a.btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      padding: 13px 26px;
      border-radius: 9999px;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      transition: all 0.2s ease;
    }
    a.btn-primary {
      background: #2563eb;
      color: #ffffff;
      box-shadow: 0 10px 25px -5px rgba(37, 99, 235, 0.4);
    }
    a.btn-primary:hover {
      background: #1d4ed8;
      transform: translateY(-1px);
    }
    a.btn-secondary {
      background: rgba(255, 255, 255, 0.05);
      color: #e2e8f0;
      border: 1px solid rgba(255, 255, 255, 0.1);
    }
    a.btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">HTTP 410 &bull; Gone</div>
    <h1>Resource Permanently Removed</h1>
    <p>
      This publisher catalog and marketplace directory have been permanently decommissioned and removed from our servers.
      For premium guest posting, editorial link building, and digital marketing agency services, please explore our agency solutions.
    </p>
    <div class="actions">
      <a href="/" class="btn btn-primary">Return to Homepage &rarr;</a>
      <a href="/services/guest-posting" class="btn btn-secondary">Guest Posting Services</a>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    status: 410,
    statusText: 'Gone',
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
      'X-Robots-Tag': 'noindex, nofollow, noarchive',
      'Cache-Control': 'public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400',
    },
  });
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Intercept all marketplace URLs and return 410 Gone with noindex, nofollow, noarchive
  if (
    pathname === '/websites' ||
    pathname.startsWith('/websites/') ||
    pathname === '/website' ||
    pathname.startsWith('/website/')
  ) {
    return createGoneResponse();
  }

  return await updateSession(request);
}

export const config = {
  matcher: [
    '/websites',
    '/websites/:path*',
    '/website',
    '/website/:path*',
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
