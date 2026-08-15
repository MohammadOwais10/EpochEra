import { NextResponse } from 'next/server'

export const config = {
  matcher: [
    '/admin/:path*',
    '/user/:path*',
    '/signin',
    '/signup',
    '/',
  ],
}

export function middleware(request) {
  const { pathname } = request.nextUrl
  const role = request.cookies.get('role')?.value?.trim() || ''

  const isAdminPath = pathname.startsWith('/admin')
  const isUserPath = pathname.startsWith('/user')
  const isAuthPage = pathname === '/user/signin' || pathname === '/admin/signin' || pathname === '/signup'

  // Legacy /signin URL -> redirect to /user/signin
  if (pathname === '/signin') {
    return NextResponse.redirect(new URL('/user/signin', request.url))
  }

  // Auth pages are always public
  if (isAuthPage) {
    return NextResponse.next()
  }

  // Admin paths require ADMIN role
  if (isAdminPath && role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/admin/signin', request.url))
  }

  // User paths require USER role
  if (isUserPath && role !== 'USER') {
    return NextResponse.redirect(new URL('/user/signin', request.url))
  }

  return NextResponse.next()
}
