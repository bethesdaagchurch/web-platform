import type { VolunteerPage as VolunteerPageGlobal, Media } from '@/payload-types'
import type { VolunteerHeroData, ServiceArea, VolunteerQuoteData } from '@/types/volunteer'
import { volunteerHero as mockHero, serviceAreas as mockAreas, volunteerQuote as mockQuote } from '@/data/volunteer-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptVolunteerHero(doc: VolunteerPageGlobal | null): VolunteerHeroData {
  if (!doc?.hero) return mockHero
  return {
    badge: doc.hero.badge || mockHero.badge,
    heading: doc.hero.heading || mockHero.heading,
    subtext: doc.hero.subtext || mockHero.subtext,
    buttonLabel: doc.hero.buttonLabel || mockHero.buttonLabel,
    buttonHref: doc.hero.buttonHref || mockHero.buttonHref,
    backgroundImage: mediaUrl(doc.hero.backgroundImage, mockHero.backgroundImage),
  }
}

export function adaptServiceAreas(doc: VolunteerPageGlobal | null): ServiceArea[] {
  if (!doc?.areas || doc.areas.length === 0) return mockAreas
  return doc.areas.map((item, i) => ({
    id: item.id || `area-${i}`,
    variant: item.variant,
    icon: item.icon,
    title: item.title,
    description: item.description,
    image: item.image ? mediaUrl(item.image, '') : undefined,
    signUpLabel: item.signUpLabel ?? undefined,
    signUpHref: item.signUpHref ?? undefined,
    highNeedLabel: item.highNeedLabel ?? undefined,
  }))
}

export function adaptVolunteerQuote(doc: VolunteerPageGlobal | null): VolunteerQuoteData {
  if (!doc?.quote) return mockQuote
  return {
    quote: doc.quote.quote || mockQuote.quote,
    reference: doc.quote.reference || mockQuote.reference,
  }
}
