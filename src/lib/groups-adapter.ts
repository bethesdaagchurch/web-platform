import type { GroupsPage as GroupsPageGlobal, Group, Media } from '@/payload-types'
import type { GroupsHeroData, GroupListing, GroupsQuoteData } from '@/types/groups'
import { groupsHero as mockHero, groupListings as mockListings, groupsQuote as mockQuote } from '@/data/groups-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptGroupsHero(doc: GroupsPageGlobal | null): GroupsHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
    searchPlaceholder: doc.hero.searchPlaceholder || mockHero.searchPlaceholder,
    backgroundImage: mediaUrl(doc.hero.backgroundImage, mockHero.backgroundImage),
  }
}

export function adaptGroupListings(docs: Group[]): GroupListing[] {
  if (!docs || docs.length === 0) return mockListings
  return docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    badgeLabel: doc.badgeLabel,
    title: doc.title,
    description: doc.description,
    schedule: doc.schedule,
    location: doc.location,
    leaderName: doc.leaderName,
    leaderPhoto: doc.leaderPhoto ? mediaUrl(doc.leaderPhoto, '') : undefined,
    category: doc.category,
    contactEmail: doc.contactEmail,
  }))
}

export function adaptGroupsQuote(doc: GroupsPageGlobal | null): GroupsQuoteData {
  if (!doc?.quote) return mockQuote
  return {
    quote: doc.quote.quote || mockQuote.quote,
    reference: doc.quote.reference || mockQuote.reference,
  }
}
