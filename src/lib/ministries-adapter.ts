import type { Ministry, MinistriesPage as MinistriesPageGlobal, Media } from '@/payload-types'
import type { MinistryItem, MinistryHeroData, SmallGroupsData, AreaOfInterestOption } from '@/types/ministries'
import type { Ministry as HomepageMinistry } from '@/types/homepage'
import {
  ministriesHero as mockHero,
  ministryItems as mockMinistryItems,
  smallGroups as mockSmallGroups,
  areaOfInterestOptions as mockAreaOptions,
} from '@/data/ministries-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptMinistriesHero(doc: MinistriesPageGlobal | null): MinistryHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
  }
}

export function adaptMinistryItems(docs: Ministry[]): MinistryItem[] {
  // Deliberately not falling back to mock ministries — same reasoning as
  // Worship Rota (see rota-adapter.ts): these are specific, factual
  // claims about real ministries that supposedly exist, contactable by
  // real email addresses. An empty database means an honest empty list.
  if (!docs || docs.length === 0) return []
  return docs.map((doc, i) => ({
    id: String(doc.id),
    slug: doc.slug,
    name: doc.name,
    description: doc.description,
    image: mediaUrl(doc.image, mockMinistryItems[i % mockMinistryItems.length]?.image ?? ''),
    categories: doc.categories,
    ctaLabel: doc.ctaLabel || 'Join Ministry',
    contactEmail: doc.contactEmail,
  }))
}

export function adaptSmallGroups(doc: MinistriesPageGlobal | null): SmallGroupsData {
  if (!doc?.smallGroups || !doc.smallGroups.features || doc.smallGroups.features.length === 0) return mockSmallGroups
  return {
    heading: doc.smallGroups.heading,
    description: doc.smallGroups.description,
    features: doc.smallGroups.features.map((f, i) => ({
      id: f.id || `feature-${i}`,
      icon: f.icon,
      title: f.title,
      description: f.description,
    })),
  }
}

export function adaptAreaOfInterestOptions(doc: MinistriesPageGlobal | null): AreaOfInterestOption[] {
  if (!doc?.areaOfInterestOptions || doc.areaOfInterestOptions.length === 0) return mockAreaOptions
  return doc.areaOfInterestOptions.map((o) => ({ value: o.value, label: o.label }))
}

// Feeds the homepage's "Find Your Place" band — a different, simpler shape
// (icon + name + href) than the full MinistryItem used on /ministries.
// Same reasoning as adaptMinistryItems above: no mock fallback, since
// these claim to be real, contactable ministries.
export function adaptHomepageMinistries(docs: Ministry[]): HomepageMinistry[] {
  if (!docs || docs.length === 0) return []
  return docs.map((doc) => ({
    id: String(doc.id),
    name: doc.name,
    icon: doc.icon,
    href: `/ministries/${doc.slug}`,
  }))
}
