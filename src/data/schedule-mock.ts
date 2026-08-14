import type { ScheduleHeroData, WeeklyServiceItem, ScheduleQuoteData, SpecialServiceItem } from '@/types/schedule'

export const scheduleHero: ScheduleHeroData = {
  heading: 'Worship Schedule',
  subtext:
    'Join us in a sacred space of worship, reflection, and community. We offer various services throughout the week to meet you where you are.',
}

export const weeklyServices: WeeklyServiceItem[] = [
  {
    id: 'sunday-9am',
    name: 'Sunday Morning',
    time: '9:00 AM',
    badgeLabel: 'In-Person',
    serviceTitle: 'Traditional Liturgy',
    description: 'A reflective service honoring classical hymns and structured worship, providing a peaceful start to your Sunday.',
    location: 'Main Sanctuary',
  },
  {
    id: 'sunday-11am',
    name: 'Sunday Morning',
    time: '11:00 AM',
    badgeLabel: 'Hybrid',
    serviceTitle: 'Contemporary Worship',
    description: 'A vibrant, energetic service featuring modern worship music and a message relevant to today\u2019s challenges.',
    location: 'Main Sanctuary & Online',
  },
  {
    id: 'wednesday',
    name: 'Wednesday Midweek',
    time: '7:00 PM',
    badgeLabel: 'In-Person',
    serviceTitle: 'Bible Study & Prayer',
    description: 'An intimate gathering focused on deep scriptural study and collective prayer for our community.',
    location: 'Fellowship Hall',
  },
]

export const scheduleQuote: ScheduleQuoteData = {
  quote: 'I rejoiced with those who said to me, \u2018Let us go to the house of the Lord.\u2019',
  reference: 'Psalm 122:1',
}

export const specialServices: SpecialServiceItem[] = [
  {
    id: 'first-fridays',
    title: 'First Fridays',
    schedule: '1st Friday of every month, 8:00 PM',
    description: 'An extended evening of unhurried worship, soaking prayer, and seeking the presence of God in a quiet, contemplative atmosphere.',
    image: '/images/schedule-first-fridays.jpg',
  },
  {
    id: 'youth-nights',
    title: 'Youth Nights',
    schedule: 'Every other Saturday, 6:30 PM',
    description: 'A dedicated space for teens and young adults to connect, worship loudly, and discuss faith in a relatable context.',
    image: '/images/schedule-youth-nights.jpg',
  },
]
