import type { PrayerPage as PrayerPageGlobal, Media } from '@/payload-types'
import type { PrayerHeroData, PrayerTeamData, IntercedeCardData } from '@/types/prayer'
import { prayerHero as mockHero, prayerTeam as mockTeam, intercedeCard as mockIntercede } from '@/data/prayer-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

export function adaptPrayerHero(doc: PrayerPageGlobal | null): PrayerHeroData {
  if (!doc?.hero) return mockHero
  return {
    heading: doc.hero.heading || mockHero.heading,
    scriptureQuote: doc.hero.scriptureQuote || mockHero.scriptureQuote,
    scriptureReference: doc.hero.scriptureReference || mockHero.scriptureReference,
    description: doc.hero.description || mockHero.description,
    image: mediaUrl(doc.hero.image, mockHero.image),
  }
}

export function adaptPrayerTeam(doc: PrayerPageGlobal | null): PrayerTeamData {
  if (!doc?.prayerTeam || !doc.prayerTeam.avatarImages || doc.prayerTeam.avatarImages.length === 0) return mockTeam
  return {
    heading: doc.prayerTeam.heading || mockTeam.heading,
    description: doc.prayerTeam.description || mockTeam.description,
    avatarImages: doc.prayerTeam.avatarImages.map((a, i) => mediaUrl(a.image, mockTeam.avatarImages[i % mockTeam.avatarImages.length] ?? '')),
    additionalCount: doc.prayerTeam.additionalCount ?? mockTeam.additionalCount,
  }
}

export function adaptIntercedeCard(doc: PrayerPageGlobal | null): IntercedeCardData {
  if (!doc?.intercedeCard) return mockIntercede
  return {
    heading: doc.intercedeCard.heading || mockIntercede.heading,
    description: doc.intercedeCard.description || mockIntercede.description,
    linkLabel: doc.intercedeCard.linkLabel || mockIntercede.linkLabel,
    linkHref: doc.intercedeCard.linkHref || mockIntercede.linkHref,
  }
}
