import { AboutHero } from '@/components/about/AboutHero'
import { LeadershipSection } from '@/components/about/LeadershipSection'
import { CoreValues } from '@/components/about/CoreValues'
import { OurJourney } from '@/components/about/OurJourney'

import { getPayloadClient } from '@/lib/payload'
import { adaptAboutHero, adaptLeadershipTeam, adaptCoreValues, adaptJourney } from '@/lib/about-adapter'

export default async function AboutPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [aboutPage, leadershipResult] = await Promise.all([
    payload.findGlobal({ slug: 'about-page', locale: typedLocale }),
    payload.find({ collection: 'leadership', locale: typedLocale, limit: 50 }),
  ])

  return (
    <>
      <AboutHero data={adaptAboutHero(aboutPage)} />
      <LeadershipSection members={adaptLeadershipTeam(leadershipResult.docs)} />
      <CoreValues values={adaptCoreValues(aboutPage)} />
      <OurJourney milestones={adaptJourney(aboutPage)} />
    </>
  )
}
