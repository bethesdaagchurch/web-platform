import type { SchedulePage as SchedulePageGlobal, Media, Event } from '@/payload-types'
import type { ScheduleHeroData, WeeklyServiceItem, ScheduleQuoteData, SpecialServiceItem } from '@/types/schedule'
import { scheduleHero as mockHero, weeklyServices as mockWeekly, scheduleQuote as mockQuote, specialServices as mockSpecial } from '@/data/schedule-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptScheduleHero(doc: SchedulePageGlobal | null): ScheduleHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
  }
}

export function adaptWeeklyServices(doc: SchedulePageGlobal | null): WeeklyServiceItem[] {
  if (!doc?.weeklyServices || doc.weeklyServices.length === 0) return mockWeekly
  return doc.weeklyServices.map((item, i) => ({
    id: item.id || `weekly-${i}`,
    name: item.name,
    time: item.time,
    badgeLabel: item.badgeLabel,
    serviceTitle: item.serviceTitle,
    description: item.description,
    location: item.location,
  }))
}

export function adaptScheduleQuote(doc: SchedulePageGlobal | null): ScheduleQuoteData {
  if (!doc?.quote) return mockQuote
  return {
    quote: doc.quote.quote || mockQuote.quote,
    reference: doc.quote.reference || mockQuote.reference,
  }
}

export function adaptSpecialServices(doc: SchedulePageGlobal | null): SpecialServiceItem[] {
  if (!doc?.specialServices || doc.specialServices.length === 0) return mockSpecial
  return doc.specialServices.map((item, i) => ({
    id: item.id || `special-${i}`,
    title: item.title,
    schedule: item.schedule,
    description: item.description,
    image: mediaUrl(item.image, mockSpecial[i % mockSpecial.length]?.image ?? ''),
  }))
}

// Converts real, upcoming Events collection documents into the same shape
// as the manually-typed specialServices array above, so an event created
// once in /admin shows up on both /events and /schedule automatically —
// no more re-typing the same announcement in two places. Preferred over
// adaptSpecialServices() whenever real upcoming events exist; that
// function remains the fallback for when there simply aren't any (a
// church with nothing special coming up shouldn't show an empty section).
export function adaptSpecialServicesFromEvents(events: Event[]): SpecialServiceItem[] {
  return events.map((event) => ({
    id: String(event.id),
    title: event.title,
    schedule: `${new Date(event.startDate).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })} \u00b7 ${event.time}`,
    description: event.description,
    image: mediaUrl(event.image, mockSpecial[0]?.image ?? ''),
  }))
}
