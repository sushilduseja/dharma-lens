import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { locales, defaultLocale } from './i18n/config'

// Simple middleware that only adds locale to paths that need it
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Skip if the path starts with _next, api, or is favicon.ico
  if (pathname.startsWith('/_next') || pathname.startsWith('/api') || pathname === '/favicon.ico') {
    return NextResponse.next()
  }

  // If it's the root path, redirect to the default locale
  if (pathname === '/') {
    return NextResponse.redirect(new URL(`/${defaultLocale}`, request.url))
  }

  // If the path already starts with a locale, let it through
  if (locales.some(locale => pathname.startsWith(`/${locale}`))) {
    return NextResponse.next()
  }

  // Otherwise, prefix with the default locale
  return NextResponse.redirect(new URL(`/${defaultLocale}${pathname}`, request.url))
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next|favicon.ico).*)',
  ],
}