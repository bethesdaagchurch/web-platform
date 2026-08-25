import { getTranslations } from 'next-intl/server'
import { EventsHero } from '@/components/events/EventsHero'
import { EventsExplorer } from '@/components/events/EventsExplorer'
import { CommunityFocus } from '@/components/events/CommunityFocus'
import { NewsletterCta } from '@/components/events/NewsletterCta'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { adaptEventsHero, adaptEventEntries, adaptCommunityFocus, adaptNewsletterCta } from '@/lib/events-adapter'

// The All/Youth/Missions/Conferences/Worship filter pills are structural
// (tied to the Events collection's fixed category select), not editorial
// content — but the LABELS still need translating, built here from
// messages/*.json rather than imported from a hardcoded English mock.
//
// Forces per-request dynamic rendering — see the Prayer page for the full
// explanation. This page's "Register" vs. "Already Registered" state per
// card depends on the visitor's session, so a cached response would leak
// one visitor's registrations onto everyone else's screen.
export const dynamic = 'force-dynamic'

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [eventsPage, eventsResult, member, t, tHero] = await Promise.all([
    payload.findGlobal({ slug: 'events-page', locale: typedLocale }),
    payload.find({ collection: 'events', locale: typedLocale, limit: 100, sort: 'startDate' }),
    getCurrentMember(),
    getTranslations('events.categories'),
    getTranslations('events.hero'),
  ])

  // A plain string[] rather than a Set — this crosses into EventsExplorer,
  // a client component, as a prop, and only JSON-shaped data survives that
  // boundary (the same reasoning behind the Map -> Record fix on the
  // Ministries/Groups join-request status lookup).
  const registrationsResult = member
    ? await payload.find({
        collection: 'event-registrations',
        where: { and: [{ member: { equals: member.id } }, { status: { equals: 'registered' } }] },
        limit: 200,
        depth: 0,
      })
    : null
  const registeredEventIds = (registrationsResult?.docs ?? []).map((r) => String(r.event))

  const eventCategories = [
    { value: 'all', label: t('all') },
    { value: 'youth', label: t('youth') },
    { value: 'missions', label: t('missions') },
    { value: 'conferences', label: t('conferences') },
    { value: 'worship', label: t('worship') },
  ]

  const heroData = adaptEventsHero(eventsPage, { registerNow: tHero('registerNow'), learnMore: tHero('learnMore') })

  return (
    <>
      {heroData && <EventsHero data={heroData} />}
      <EventsExplorer
        events={adaptEventEntries(eventsResult.docs)}
        categories={eventCategories}
        registeredEventIds={registeredEventIds}
      />
      <CommunityFocus items={adaptCommunityFocus(eventsPage)} />
      <NewsletterCta data={adaptNewsletterCta(eventsPage)} />
    </>
  )
}
