import { Hero } from '@/components/homepage/Hero'
import { QuickLinks } from '@/components/homepage/QuickLinks'
import { JoinUsSunday } from '@/components/homepage/JoinUsSunday'
import { PastorWelcome } from '@/components/homepage/PastorWelcome'
import { LatestSermons } from '@/components/homepage/LatestSermons'
import { UpcomingEvents } from '@/components/homepage/UpcomingEvents'
import { FindYourPlace } from '@/components/homepage/FindYourPlace'
import { ImpactKingdom } from '@/components/homepage/ImpactKingdom'
import { StayConnected } from '@/components/homepage/StayConnected'
import { VisitUs } from '@/components/homepage/VisitUs'

import { getPayloadClient } from '@/lib/payload'
import {
  adaptHero,
  adaptQuickLinks,
  adaptServiceTimes,
  adaptPastorWelcome,
  adaptGivingBreakdown,
} from '@/lib/homepage-adapter'
import { adaptHomepageMinistries } from '@/lib/ministries-adapter'
import { adaptSiteSettings } from '@/lib/site-settings-adapter'
import { adaptHomepageSermons } from '@/lib/sermons-adapter'
import { adaptHomepageEvents } from '@/lib/events-adapter'

// findGlobal on a global that's never been saved still resolves (Payload
// returns the shape with empty/default values) rather than throwing, so
// this doesn't need a try/catch — the per-field fallbacks inside each
// adapter handle an unpopulated or partially-populated CMS document.
export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [homepage, siteSettingsDoc, ministriesResult, sermonsPage, sermonsResult, eventsResult] = await Promise.all([
    payload.findGlobal({ slug: 'homepage', locale: typedLocale }),
    payload.findGlobal({ slug: 'site-settings', locale: typedLocale }),
    payload.find({ collection: 'ministries', locale: typedLocale, limit: 7, sort: 'name' }),
    payload.findGlobal({ slug: 'sermons-page', locale: typedLocale }),
    payload.find({ collection: 'sermons', locale: typedLocale, limit: 10, sort: '-date' }),
    payload.find({ collection: 'events', locale: typedLocale, limit: 3, sort: 'startDate' }),
  ])

  return (
    <>
      <Hero data={adaptHero(homepage)} />
      <QuickLinks links={adaptQuickLinks(homepage)} />
      <JoinUsSunday times={adaptServiceTimes(homepage)} />
      <PastorWelcome data={adaptPastorWelcome(homepage)} />
      <LatestSermons sermons={adaptHomepageSermons(sermonsPage, sermonsResult.docs)} />
      <UpcomingEvents events={adaptHomepageEvents(eventsResult.docs)} />
      <FindYourPlace ministries={adaptHomepageMinistries(ministriesResult.docs)} />
      <ImpactKingdom breakdown={adaptGivingBreakdown(homepage)} />
      <StayConnected />
      <VisitUs settings={adaptSiteSettings(siteSettingsDoc)} />
    </>
  )
}
