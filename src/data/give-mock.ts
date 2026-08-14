import type { GiveHeroData, FundOption, ImpactData, OtherWayToGive } from '@/types/give'
import { siteSettings } from '@/data/homepage-mock'

export const giveHero: GiveHeroData = {
  heading: 'Honor the Lord with your wealth',
  quote:
    '"Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver."',
  reference: '2 Corinthians 9:7',
}

export const presetAmounts = [50, 100, 250, 500, 1000] as const

export const fundOptions: FundOption[] = [
  { value: 'general', label: 'General Tithes & Offerings' },
  { value: 'missions', label: 'Global Missions' },
  { value: 'outreach', label: 'Local Outreach' },
  { value: 'building', label: 'Building Fund' },
  { value: 'youth', label: 'Youth Ministry' },
]

export const impactData: ImpactData = {
  heading: 'Impact the Kingdom',
  description:
    'Your generosity directly supports our mission to bring peace and clarity to our community and beyond. Here is how your gifts make a difference:',
  items: [
    {
      id: 'missions',
      icon: 'globe',
      title: 'Global Missions',
      description: 'Supporting 12 missionaries across 5 continents bringing hope to the unreached.',
    },
    {
      id: 'food-bank',
      icon: 'food',
      title: 'Local Food Bank',
      description: 'Feeding over 500 families monthly in our local community.',
    },
    {
      id: 'nextgen',
      icon: 'grad',
      title: 'NextGen Ministry',
      description: 'Equipping youth and children with a strong spiritual foundation.',
    },
  ],
}

export const otherWaysToGive: OtherWayToGive[] = [
  {
    id: 'text',
    icon: 'text',
    title: 'Text to Give',
    lines: ['Text "GIVE" to +91 80 1234 5678 from your mobile device to easily donate.'],
  },
  {
    id: 'mail',
    icon: 'mail',
    title: 'Mail a Check',
    lines: [`Send to: ${siteSettings.churchName}`, ...siteSettings.address],
  },
]
