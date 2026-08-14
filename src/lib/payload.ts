import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'

// React's cache() de-dupes this across every call within a single request,
// so multiple sections fetching from Payload in the same page render don't
// each pay the cost of initializing a client.
export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})
