import { VolunteerHero } from '@/components/volunteer/VolunteerHero'
import { ServiceAreasGrid } from '@/components/volunteer/ServiceAreasGrid'
import { VolunteerQuote } from '@/components/volunteer/VolunteerQuote'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { adaptVolunteerHero, adaptServiceAreas, adaptVolunteerQuote } from '@/lib/volunteer-adapter'

// Forces per-request dynamic rendering — see the Prayer/Events pages for
// the full explanation. This page's Sign Up vs. Join the Volunteer Team
// label now depends on the visitor's session, so a cached response would
// leak one visitor's login state onto everyone else's screen.
export const dynamic = 'force-dynamic'

export default async function VolunteerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const [doc, member] = await Promise.all([
    payload.findGlobal({ slug: 'volunteer-page', locale: locale as 'en' | 'ta' | 'kn' }),
    getCurrentMember(),
  ])

  return (
    <>
      <VolunteerHero data={adaptVolunteerHero(doc)} />
      <ServiceAreasGrid areas={adaptServiceAreas(doc)} isMember={Boolean(member)} />
      <VolunteerQuote data={adaptVolunteerQuote(doc)} />
    </>
  )
}
