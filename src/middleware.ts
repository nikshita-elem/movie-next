import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const intlMiddleware = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const authToken = request.cookies.get('token')?.value;
  const url = request.nextUrl.clone();

  const locales = ['en', 'es', 'hi'];

  // Create protected paths
  const protectedPaths = new Set([
    ...locales.map(locale => `/${locale}`),
    ...locales.map(locale => `/${locale}/add`),
    ...locales.map(locale => `/${locale}/edit`)
  ]);

  // Authentication logic
  if (!authToken) {
    if (protectedPaths.has(url.pathname) || url.pathname.startsWith('/en/edit') || url.pathname.startsWith('/es/edit') || url.pathname.startsWith('/hi/edit')) {
      url.pathname = "/sign-in";
      return NextResponse.redirect(url);
    }
  } else {
    if (url.pathname === "/sign-in" || url.pathname === "/sign-up") {
      url.pathname = "/movies";
      return NextResponse.redirect(url);
    }
  }

  const response = intlMiddleware(request);
  if (response) return response;

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/(hi|en|es)/:path*', '/add', '/edit/:path*'],
};
