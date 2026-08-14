import type { Homepage as HomepageGlobal, Media } from '@/payload-types'
import type { HeroData, QuickLink, ServiceTime, PastorWelcome, GivingCategory } from '@/types/homepage'
import {
  heroData as mockHero,
  quickLinks as mockQuickLinks,
  serviceTimes as mockServiceTimes,
  pastorWelcome as mockPastorWelcome,
  givingBreakdown as mockGivingBreakdown,
} from '@/data/homepage-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptHero(doc: HomepageGlobal | null): HeroData {
  if (!doc?.hero) return mockHero
  return {
    badgeText: doc.hero.badgeText || mockHero.badgeText,
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
    primaryButton: {
      label: doc.hero.primaryButtonLabel || mockHero.primaryButton.label,
      href: doc.hero.primaryButtonHref || mockHero.primaryButton.href,
    },
    secondaryButton: {
      label: doc.hero.secondaryButtonLabel || mockHero.secondaryButton.label,
      href: doc.hero.secondaryButtonHref || mockHero.secondaryButton.href,
    },
    backgroundImage: mediaUrl(doc.hero.backgroundImage, mockHero.backgroundImage),
    backgroundVideo:
      doc.hero.backgroundVideo && typeof doc.hero.backgroundVideo === 'object' ? doc.hero.backgroundVideo.url ?? undefined : undefined,
    backgroundVideoWebm:
      doc.hero.backgroundVideoWebm && typeof doc.hero.backgroundVideoWebm === 'object'
        ? doc.hero.backgroundVideoWebm.url ?? undefined
        : undefined,
  }
}

export function adaptQuickLinks(doc: HomepageGlobal | null): QuickLink[] {
  if (!doc?.quickLinks || doc.quickLinks.length === 0) return mockQuickLinks
  return doc.quickLinks.map((item, i) => ({
    id: item.id || `quick-link-${i}`,
    icon: item.icon,
    title: item.title,
    subtext: item.subtext,
    href: item.href,
  }))
}

export function adaptServiceTimes(doc: HomepageGlobal | null): ServiceTime[] {
  if (!doc?.serviceTimes || doc.serviceTimes.length === 0) return mockServiceTimes
  return doc.serviceTimes.map((item, i) => ({
    id: item.id || `service-time-${i}`,
    time: item.time,
    label: item.label,
  }))
}

export function adaptPastorWelcome(doc: HomepageGlobal | null): PastorWelcome {
  if (!doc?.pastorWelcome) return mockPastorWelcome
  return {
    photo: mediaUrl(doc.pastorWelcome.photo, mockPastorWelcome.photo),
    eyebrow: doc.pastorWelcome.eyebrow || mockPastorWelcome.eyebrow,
    heading: doc.pastorWelcome.heading || mockPastorWelcome.heading,
    quote: doc.pastorWelcome.quote || mockPastorWelcome.quote,
    name: doc.pastorWelcome.name || mockPastorWelcome.name,
    title: doc.pastorWelcome.title || mockPastorWelcome.title,
  }
}

export function adaptGivingBreakdown(doc: HomepageGlobal | null): GivingCategory[] {
  if (!doc?.givingBreakdown || doc.givingBreakdown.length === 0) return mockGivingBreakdown
  return doc.givingBreakdown.map((item, i) => ({
    id: item.id || `giving-${i}`,
    label: item.label,
    percentage: item.percentage,
  }))
}
