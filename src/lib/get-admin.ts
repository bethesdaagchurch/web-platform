import { cache } from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { User } from '@/payload-types'

// Payload uses a single, project-wide session cookie (not one scoped per
// collection — confirmed by reading the actual extractJWT source), so a
// browser only ever holds one active session at a time: either a Members
// session or a Users (CMS admin) session, never both simultaneously. This
// and getCurrentMember() are two views of that same single session.
//
// Wrapped in cache() for the same reason as getCurrentMember() — dedupe
// every call within a single request to one payload.auth() lookup.
export const getCurrentAdminUser = cache(async (): Promise<User | null> => {
  const payload = await getPayloadClient()
  const headersList = await getHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (user && user.collection === 'users') {
    return user
  }
  return null
})
