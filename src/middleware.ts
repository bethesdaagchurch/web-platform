import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'
import { NextRequest, NextResponse } from 'next/server'

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  // Payload's public "create first admin" bootstrap screen is only safe
  // for the instant between a fresh deploy and someone claiming it —
  // anyone else who finds this URL first (a bot scanning for exposed
  // /admin panels, for instance) claims the admin account instead, and
  // that door locks permanently the moment it's used. Blocked here
  // entirely rather than relying on winning that race: the only
  // supported way to create the first admin is now
  // scripts/seed-first-admin.ts, run server-side before the site is
  // ever shared with anyone. See that script and the README for why.
  //
  // Both the page AND its underlying API endpoint are blocked —
  // blocking only the page route was confirmed insufficient by testing
  // directly: /api/users/first-register (what the page itself calls to
  // actually create the account) genuinely succeeded even with the page
  // blocked, since nothing was stopping a direct POST to that endpoint
  // bypassing the UI entirely. Redirects to the homepage specifically,
  // not another /admin/* path — redirecting within /admin caused a
  // genuine infinite loop, confirmed directly (60+ rapid navigations to
  // the same URL): Payload's own client-side admin UI sees the Users
  // collection is still empty and keeps trying to route back to
  // create-first-user itself, fighting this same redirect forever.
  // Leaving the admin app's own route tree entirely avoids that fight.
  if (request.nextUrl.pathname === '/admin/create-first-user') {
    return NextResponse.redirect(new URL('/', request.url))
  }
  if (request.nextUrl.pathname === '/api/users/first-register') {
    return NextResponse.json({ error: 'Not available.' }, { status: 404 })
  }
  return intlMiddleware(request)
}

export const config = {
  // Excludes API routes, Payload's /admin panel (kept locale-agnostic on
  // purpose — see the architecture guide), Next internals, and any
  // request for a file with an extension. The second and third matcher
  // entries are deliberate, narrow exceptions so this middleware
  // function still runs for the two specific paths being blocked above
  // (the admin bootstrap page and its underlying API endpoint), without
  // affecting how next-intl treats the rest of /admin or /api.
  matcher: ['/((?!api|admin|_next|.*\\..*).*)', '/admin/create-first-user', '/api/users/first-register'],
}
