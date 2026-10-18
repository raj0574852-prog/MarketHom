import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn(
      '[supabaseMiddleware] NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY is not set. ' +
      'Authentication will not work. Set these variables in .env.local.'
    );
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? 'placeholder-key',
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // This will refresh session if expired - required for Server Components
  // https://supabase.com/docs/guides/auth/server-side/nextjs
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl
  const isAdminPath = pathname.startsWith('/admin') && pathname !== '/admin/login'
  const isAdminApi = pathname.startsWith('/api/admin')

  if (isAdminPath || isAdminApi) {
    const adminEmails = (process.env.ADMIN_EMAILS || 'raj057485251@gmail.com').split(',').map((e: string) => e.trim());
    const isAuthorized = user && user.email && adminEmails.includes(user.email);

    if (!isAuthorized) {
      // Unauthenticated or Unauthorized
      if (isAdminApi) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  // 2. Intercept URLs targeting individual publishers under the old /websites/ prefix
  if (pathname.startsWith('/websites/')) {
    if (pathname.startsWith('/websites/category')) {
      return supabaseResponse;
    }
    
    let slugPart = pathname.substring('/websites/'.length);
    if (slugPart.endsWith('/')) {
      slugPart = slugPart.slice(0, -1);
    }
    
    if (slugPart && !slugPart.includes('/')) {
      const destinationUrl = request.nextUrl.clone();
      destinationUrl.pathname = `/website/${slugPart}`;
      return NextResponse.redirect(destinationUrl, 301);
    }
  }

  return supabaseResponse
}
