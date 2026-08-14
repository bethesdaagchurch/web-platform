import type { Leadership as LeadershipDoc, AboutPage as AboutPageGlobal, Media } from '@/payload-types'
import type { AboutHeroData, LeadershipMember, CoreValue, JourneyMilestone } from '@/types/about'
import { aboutHero as mockHero, leadershipTeam as mockLeadership, coreValues as mockCoreValues, journey as mockJourney } from '@/data/about-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptAboutHero(doc: AboutPageGlobal | null): AboutHeroData {
  if (!doc?.hero) return mockHero
  return {
    eyebrow: doc.hero.eyebrow || mockHero.eyebrow,
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
    ctaLabel: doc.hero.ctaLabel || mockHero.ctaLabel,
    ctaHref: doc.hero.ctaHref || mockHero.ctaHref,
  }
}

export function adaptLeadershipTeam(docs: LeadershipDoc[]): LeadershipMember[] {
  if (!docs || docs.length === 0) return mockLeadership
  // Sorted by the `order` field so editors control bento-grid position
  // explicitly, rather than relying on document creation order.
  const sorted = [...docs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  return sorted.map((doc, i) => ({
    id: String(doc.id),
    variant: doc.variant,
    name: doc.name,
    roleLabel: doc.roleLabel,
    photo: mediaUrl(doc.photo, mockLeadership[i % mockLeadership.length]?.photo ?? ''),
    bio: doc.bio,
    bioLink: doc.hasFullBio ? { label: 'Read Full Bio', href: `/about/${doc.slug}` } : undefined,
  }))
}

export function adaptCoreValues(doc: AboutPageGlobal | null): CoreValue[] {
  if (!doc?.coreValues || doc.coreValues.length === 0) return mockCoreValues
  return doc.coreValues.map((v, i) => ({
    id: v.id || `value-${i}`,
    icon: v.icon,
    accent: v.accent,
    title: v.title,
    description: v.description,
  }))
}

export function adaptJourney(doc: AboutPageGlobal | null): JourneyMilestone[] {
  if (!doc?.journey || doc.journey.length === 0) return mockJourney
  return doc.journey.map((m, i) => ({
    id: m.id || `milestone-${i}`,
    year: m.year,
    title: m.title,
    description: m.description,
    dotAccent: m.dotAccent,
  }))
}
