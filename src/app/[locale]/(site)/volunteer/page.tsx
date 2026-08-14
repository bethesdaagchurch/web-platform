import { VolunteerHero } from '@/components/volunteer/VolunteerHero'
import { ServiceAreasGrid } from '@/components/volunteer/ServiceAreasGrid'
import { VolunteerQuote } from '@/components/volunteer/VolunteerQuote'

import { getPayloadClient } from '@/lib/payload'
import { adaptVolunteerHero, adaptServiceAreas, adaptVolunteerQuote } from '@/lib/volunteer-adapter'

export default async function VolunteerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'volunteer-page', locale: locale as 'en' | 'ta' | 'kn' })

  return (
    <>
      <VolunteerHero data={adaptVolunteerHero(doc)} />
      <ServiceAreasGrid areas={adaptServiceAreas(doc)} />
      <VolunteerQuote data={adaptVolunteerQuote(doc)} />
    </>
  )
}
