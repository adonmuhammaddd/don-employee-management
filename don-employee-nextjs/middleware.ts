import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const loggedUser = request.cookies.get('loggedUser') || null;

  const isProtected = request.nextUrl.pathname.startsWith('/dashboard') || request.nextUrl.pathname.startsWith('/user') || request.nextUrl.pathname.startsWith('/employee') || request.nextUrl.pathname.startsWith('/profile') || request.nextUrl.pathname.startsWith('/leave');

  if (isProtected && !loggedUser) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/user/:path*', '/employee/:path*', '/profile/:path*', '/leave/:path*'],
};