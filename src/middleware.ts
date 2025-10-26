import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow login page
  if (pathname.startsWith('/login')) {
    return NextResponse.next()
  }

  // Check for Supabase auth token in cookies
  // The token is set by Supabase auth and has the format: sb-<project-ref>-auth-token
  const authCookie = request.cookies.getAll().find(cookie =>
    cookie.name.startsWith('sb-') && cookie.name.includes('auth-token')
  )

  // If no auth token, redirect to login
  if (!authCookie || !authCookie.value) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirectedFrom', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // User has auth token, allow request
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api routes (they handle their own auth)
     */
    '/((?!_next/static|_next/image|favicon.ico|api|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
