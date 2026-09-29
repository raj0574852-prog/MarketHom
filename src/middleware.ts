import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // 1. Intercept URLs targeting individual publishers under the old /websites/ prefix
  if (pathname.startsWith('/websites/')) {
    
    // 2. Explicitly bypass /websites/category and any of its subpaths
    if (pathname.startsWith('/websites/category')) {
      return NextResponse.next();
    }
    
    // 3. Extract the portion after /websites/
    let slugPart = pathname.substring('/websites/'.length);
    
    // 4. Handle trailing slashes directly in middleware to avoid a 308 -> 301 redirect chain
    if (slugPart.endsWith('/')) {
      slugPart = slugPart.slice(0, -1);
    }
    
    // 5. Ensure it's exactly a single slug (no further subdirectories)
    if (slugPart && !slugPart.includes('/')) {
      // request.nextUrl.clone() inherently preserves the search/query parameters (e.g. ?ref=123)
      const destinationUrl = request.nextUrl.clone();
      destinationUrl.pathname = `/website/${slugPart}`;
      
      // 301 Permanent Redirect to the new canonical URL structure
      return NextResponse.redirect(destinationUrl, 301);
    }
  }
  
  return NextResponse.next();
}

// Only invoke the middleware for the /websites path and its descendants
export const config = {
  matcher: '/websites/:path*',
};
