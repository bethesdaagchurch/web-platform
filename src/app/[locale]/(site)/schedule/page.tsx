import { ScheduleHero } from '@/components/schedule/ScheduleHero'
import { WeeklyServices } from '@/components/schedule/WeeklyServices'
import { ScheduleQuote } from '@/components/schedule/ScheduleQuote'
import { SpecialServices } from '@/components/schedule/SpecialServices'

import { getPayloadClient } from '@/lib/payload'
import {
  adaptScheduleHero,
  adaptWeeklyServices,
  adaptScheduleQuote,
  adaptSpecialServices,
  adaptSpecialServicesFromEvents,
} from '@/lib/schedule-adapter'

export default async function SchedulePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'ta' | 'kn'
  const payload = await getPayloadClient()

  const [doc, upcomingEvents] = await Promise.all([
    payload.findGlobal({ slug: 'schedule-page', locale: typedLocale }),
    // Real, upcoming events show here automatically — an event created
    // once in /admin no longer needs re-typing into this page separately.
    // Falls back to the manually-typed specialServices array (below) only
    // when there are genuinely no upcoming events.
    payload.find({
      collection: 'events',
      locale: typedLocale,
      where: { startDate: { greater_than_equal: new Date().toISOString() } },
      sort: 'startDate',
      limit: 6,
    }),
  ])

  const specialServices =
    upcomingEvents.docs.length > 0 ? adaptSpecialServicesFromEvents(upcomingEvents.docs) : adaptSpecialServices(doc)

  return (
    <>
      <ScheduleHero data={adaptScheduleHero(doc)} />
      <WeeklyServices services={adaptWeeklyServices(doc)} />
      <ScheduleQuote data={adaptScheduleQuote(doc)} />
      <SpecialServices items={specialServices} />
    </>
  )
}
