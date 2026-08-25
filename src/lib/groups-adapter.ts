import type { GroupsPage as GroupsPageGlobal, Group, Media } from '@/payload-types'
import type { GroupsHeroData, GroupListing, GroupsQuoteData } from '@/types/groups'
import { groupsHero as mockHero, groupsQuote as mockQuote } from '@/data/groups-mock'

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
  // Deliberately not falling back to mock groups — same reasoning as
  // Worship Rota and Ministries: specific, factual claims about real
  // groups that supposedly meet, at a real time and place, with a real
  // leader. An empty database means an honest empty list.
  if (!docs || docs.length === 0) return []
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
    // A bare numeric ID instead of the populated document would mean
    // insufficient query depth — skipped defensively rather than
    // crashing on `.name`, same reasoning as adaptGroups on the Dashboard.
    members: (doc.members ?? [])
      .filter((m): m is Exclude<typeof m, number> => typeof m === 'object' && m !== null)
      .map((m) => ({ id: String(m.id), name: m.name })),
  }))
}

export function adaptGroupsQuote(doc: GroupsPageGlobal | null): GroupsQuoteData {
  if (!doc?.quote) return mockQuote
  return {
    quote: doc.quote.quote || mockQuote.quote,
    reference: doc.quote.reference || mockQuote.reference,
  }
}
