import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth.config'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig)

const protectedRoutes = ['/newsletters', '/account']
const authRoutes = ['/sign-in', '/sign-up']

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  const isProtected = protectedRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  )
  const isAuthRoute = authRoutes.some(route =>
    nextUrl.pathname.startsWith(route)
  )

  // Redirect logged in users away from auth pages
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/newsletters', nextUrl))
  }

  // Redirect unauthenticated users to sign in
  if (isProtected && !isLoggedIn) {
    const signInUrl = new URL('/sign-in', nextUrl)
    signInUrl.searchParams.set('callbackUrl', nextUrl.pathname)
    return NextResponse.redirect(signInUrl)
  }

  return NextResponse.next()
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
  ],
}
