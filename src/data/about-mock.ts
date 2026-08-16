import type { AboutHeroData, LeadershipMember, CoreValue, JourneyMilestone } from '@/types/about'

export const aboutHero: AboutHeroData = {
  eyebrow: 'Our Story & Vision',
  heading: 'A Sanctuary of Grace,\nA Community of Hope',
  subtext:
    'For over three decades, we have cultivated a space where faith meets everyday life. We believe in building a strong foundation of love, clarity, and invitation for all generations.',
  ctaLabel: 'Join Us This Sunday',
  ctaHref: '/schedule',
}

export const leadershipTeam: LeadershipMember[] = [
  {
    id: 'david',
    variant: 'photo-left',
    name: 'Rev. David Mitchell',
    roleLabel: 'Lead Pastor',
    photo: '/images/pastor-david.jpg',
    bio: 'Pastor David has guided our congregation for 15 years with a vision centered on authentic community and biblical truth. His teachings emphasize practical\u2026',
    bioLink: { label: 'Read Full Bio', href: '/about/david-mitchell' },
  },
  {
    id: 'sarah',
    variant: 'photo-top',
    name: 'Sarah Jenkins',
    roleLabel: 'Associate Pastor',
    photo: '/images/pastor-sarah.jpg',
    bio: 'Leading our family ministries, Sarah brings vibrant energy and a deep passion for generational spiritual growth.',
  },
  {
    id: 'marcus',
    variant: 'photo-top',
    name: 'Marcus Cole',
    roleLabel: 'Worship Pastor',
    photo: '/images/pastor-marcus.jpg',
    bio: 'Marcus crafts our weekly worship experiences, blending traditional hymns with contemporary expressions of faith.',
  },
  {
    id: 'elena',
    variant: 'avatar',
    name: 'Elena Rodriguez',
    roleLabel: 'Outreach Director',
    photo: '/images/pastor-elena.jpg',
    bio: 'Elena spearheads our local and global mission initiatives, connecting our congregation\u2019s resources with tangible needs in our city and beyond.',
  },
]

export const coreValues: CoreValue[] = [
  { id: 'truth', icon: 'book', accent: 'blue', title: 'Biblical Truth', description: 'Anchoring our lives in the timeless wisdom and teaching of Scripture.' },
  { id: 'love', icon: 'heart', accent: 'gold', title: 'Authentic Love', description: 'Fostering a genuine, welcoming environment where everyone is valued.' },
  { id: 'community', icon: 'community', accent: 'blue', title: 'Deep Community', description: 'Growing together through shared lives, burdens, and celebrations.' },
  { id: 'mission', icon: 'globe', accent: 'gold', title: 'Missional Living', description: 'Taking the hope we\u2019ve found into our neighborhoods and the world.' },
]

export const journey: JourneyMilestone[] = [
  {
    id: '1992',
    year: '1992',
    title: 'Humble Beginnings',
    description: 'Gathering in a small rented school hall, 30 families came together to form the initial core of our congregation.',
    dotAccent: 'gold',
  },
  {
    id: '2005',
    year: '2005',
    title: 'Our First Sanctuary',
    description: 'After years of prayer and fundraising, we broke ground and moved into our permanent home on Oak Street.',
    dotAccent: 'blue',
  },
  {
    id: '2018',
    year: '2018',
    title: 'Community Center Launch',
    description: 'Expanding our vision, we opened the adjacent community center to serve local youth and families with daily programs.',
    dotAccent: 'gold',
  },
]
