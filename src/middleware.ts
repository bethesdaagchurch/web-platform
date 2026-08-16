import createMiddleware from 'next-intl/middleware'
import { routing } from '@/i18n/routing'

export default createMiddleware(routing)

export const config = {
  // Excludes API routes (none yet, but reserved), Payload's future /admin
  // panel (kept locale-agnostic on purpose — see the architecture guide),
  // Next internals, and any request for a file with an extension.
  matcher: ['/((?!api|admin|_next|.*\\..*).*)'],
}
