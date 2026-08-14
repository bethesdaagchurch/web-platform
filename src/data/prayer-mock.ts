import type { PrayerHeroData, PrayerTeamData, IntercedeCardData } from '@/types/prayer'

export const prayerHero: PrayerHeroData = {
  heading: 'Submit a Prayer Request',
  scriptureQuote: 'Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God.',
  scriptureReference: 'Philippians 4:6',
  description:
    'Our dedicated prayer team considers it a privilege to stand with you in faith. Share your needs below, and we will lift them up in prayer.',
  image: '/images/prayer-hero.jpg',
}

export const prayerTeam: PrayerTeamData = {
  heading: 'Our Prayer Team',
  description:
    'A dedicated group of intercessors who meet daily to lift up the needs of our community. We believe in the power of united prayer to bring healing, guidance, and peace.',
  avatarImages: ['/images/prayer-team-1.jpg', '/images/prayer-team-2.jpg', '/images/prayer-team-3.jpg'],
  additionalCount: 12,
}

export const intercedeCard: IntercedeCardData = {
  heading: 'Called to Intercede?',
  description: 'Join a small group dedicated to continuous prayer for our congregation and city.',
  linkLabel: 'Join a Prayer Group',
  linkHref: '/groups',
}
