import type { Event as EventDoc, EventsPage as EventsPageGlobal, Media } from '@/payload-types'
import type {
  EventsHeroData,
  EventEntry,
  EventBadgeStyle,
  CommunityFocusItem,
  NewsletterCtaData,
} from '@/types/events'
import type { EventItem as HomepageEventItem } from '@/types/homepage'
import {
  eventsHero as mockHero,
  eventEntries as mockEntries,
  communityFocus as mockCommunityFocus,
  newsletterCta as mockNewsletterCta,
} from '@/data/events-mock'
import { events as mockHomepageEvents } from '@/data/homepage-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

// The mock data showed a strict 1:1 relationship between category and its
// display label/color (worship is always gold, youth always dark, etc.) —
// deriving this rather than storing categoryLabel/badgeStyle as separate
// CMS fields means there's no way for a badge to show the wrong color for
// its category.
export const categoryMeta: Record<string, { label: string; badgeStyle: EventBadgeStyle }> = {
  worship: { label: 'WORSHIP', badgeStyle: 'gold' },
  youth: { label: 'YOUTH', badgeStyle: 'dark' },
  missions: { label: 'MISSIONS', badgeStyle: 'blue' },
  conferences: { label: 'CONFERENCES', badgeStyle: 'navy' },
}

export function adaptEventsHero(
  doc: EventsPageGlobal | null,
  labels: { registerNow: string; learnMore: string }
): EventsHeroData {
  const featuredEvent = doc?.hero?.featuredEvent
  if (!doc?.hero || !featuredEvent || typeof featuredEvent !== 'object') return mockHero

  return {
    badge: doc.hero.badge || mockHero.badge,
    heading: featuredEvent.title,
    subtext: featuredEvent.description,
    button: {
      // The label reflects what actually happens when you click it — real
      // registration if the event requires it, otherwise a generic "Learn
      // More" rather than falsely implying registration is possible.
      label: featuredEvent.requiresRegistration ? labels.registerNow : labels.learnMore,
      // Always correct by construction — derived from the same event's own
      // slug, not a separately-typed URL that could drift out of sync or
      // point to the wrong (or a nonexistent) event. This is the fix for
      // the exact class of 404 bug reported earlier.
      href: `/events/${featuredEvent.slug}`,
    },
    backgroundImage: mediaUrl(featuredEvent.image, mockHero.backgroundImage),
  }
}

export function adaptEventEntries(docs: EventDoc[]): EventEntry[] {
  if (!docs || docs.length === 0) return mockEntries
  return docs.map((doc) => {
    const meta = categoryMeta[doc.category] ?? { label: doc.category.toUpperCase(), badgeStyle: 'navy' as EventBadgeStyle }
    return {
      id: String(doc.id),
      slug: doc.slug,
      title: doc.title,
      category: doc.category,
      categoryLabel: meta.label,
      badgeStyle: meta.badgeStyle,
      startDate: doc.startDate,
      endDate: doc.endDate ?? undefined,
      time: doc.time,
      location: doc.location,
      cost: doc.cost ?? undefined,
      description: doc.description,
      actions: (doc.actions ?? []).map((a) => ({ label: a.label, href: a.href, variant: a.variant })),
      requiresRegistration: doc.requiresRegistration ?? false,
    }
  })
}

export function adaptCommunityFocus(doc: EventsPageGlobal | null): CommunityFocusItem[] {
  if (!doc?.communityFocus || doc.communityFocus.length === 0) return mockCommunityFocus
  return doc.communityFocus.map((item, i) => ({
    id: item.id || `focus-${i}`,
    title: item.title,
    description: item.description,
    image: mediaUrl(item.image, mockCommunityFocus[i % mockCommunityFocus.length]?.image ?? ''),
    linkLabel: item.linkLabel,
    href: item.href,
  }))
}

export function adaptNewsletterCta(doc: EventsPageGlobal | null): NewsletterCtaData {
  if (!doc?.newsletterCta) return mockNewsletterCta
  return {
    heading: doc.newsletterCta.heading || mockNewsletterCta.heading,
    subtext: doc.newsletterCta.subtext || mockNewsletterCta.subtext,
    placeholder: doc.newsletterCta.placeholder || mockNewsletterCta.placeholder,
    buttonLabel: doc.newsletterCta.buttonLabel || mockNewsletterCta.buttonLabel,
  }
}

// Feeds the homepage's "Upcoming at Bethesda" cards — a simpler shape
// (month/day text instead of a raw ISO date, no description/actions) than
// the full EventEntry used on /events.
export function adaptHomepageEvents(docs: EventDoc[]): HomepageEventItem[] {
  if (!docs || docs.length === 0) return mockHomepageEvents
  return docs.map((doc) => {
    const d = new Date(doc.startDate)
    return {
      id: String(doc.id),
      slug: doc.slug,
      title: doc.title,
      month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
      day: String(d.getDate()),
      timeRange: doc.time,
      image: mediaUrl(doc.image, mockHomepageEvents[0]?.image ?? ''),
      category: doc.category,
    }
  })
}
