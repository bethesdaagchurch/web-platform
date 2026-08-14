import { cache } from 'react'
import { headers as getHeaders } from 'next/headers'
import { getPayloadClient } from '@/lib/payload'
import type { Member } from '@/payload-types'

// Used by every page that needs to know "is a member logged in right now"
// — both for gating member-only content and for showing the member's name
// in the header. Returns null for logged-out visitors AND for CMS admins
// (Users collection) browsing the public site while logged into /admin —
// those are deliberately different sessions, never conflated.
//
// Wrapped in cache() so every call within a single request — the layout's
// call (for the Header) and any individual page's own call (e.g. Prayer's
// IntercedeCard) — resolve to the exact same result, not two independent
// payload.auth() calls (each its own DB lookup) that could theoretically
// disagree. Matches the same reasoning already applied to
// getPayloadClient() itself.
export const getCurrentMember = cache(async (): Promise<Member | null> => {
  const payload = await getPayloadClient()
  const headersList = await getHeaders()
  const { user } = await payload.auth({ headers: headersList })

  if (user && user.collection === 'members') {
    return user
  }
  return null
})
