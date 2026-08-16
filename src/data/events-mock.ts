import type { EventsHeroData, FilterOption, EventEntry, CommunityFocusItem, NewsletterCtaData } from '@/types/events'

export const eventsHero: EventsHeroData = {
  badge: 'Major Conference',
  heading: 'Awaken 2026: Renew Your Spirit',
  subtext:
    'Join us for three days of powerful worship, transformative teaching, and deep community connection. Secure your spot for the most anticipated gathering of the year.',
  button: { label: 'Register Now', href: '/events/awaken-2026' },
  backgroundImage: '/images/events-hero.jpg',
}

export const eventCategories: FilterOption[] = [
  { value: 'all', label: 'All' },
  { value: 'youth', label: 'Youth' },
  { value: 'missions', label: 'Missions' },
  { value: 'conferences', label: 'Conferences' },
  { value: 'worship', label: 'Worship' },
]

// Dates below are real (computed, not guessed) so that e.g. "Friday Night
// Worship" genuinely falls on a Friday and the calendar widget's automatic
// Sunday-detection lines up correctly with these events.
export const eventEntries: EventEntry[] = [
  {
    id: 'friday-worship',
    slug: 'friday-night-worship-oct16',
    title: 'Friday Night Worship',
    category: 'worship',
    categoryLabel: 'WORSHIP',
    badgeStyle: 'gold',
    startDate: '2026-10-16',
    time: '7:00 PM - 9:00 PM',
    location: 'Main Sanctuary',
    description: "An evening of extended worship, prayer, and seeking God's presence together. Open to everyone.",
    actions: [
      { label: 'Join Live', href: '/live', variant: 'solid' },
      { label: 'Details', href: '/events/friday-night-worship-oct16', variant: 'outline' },
    ],
    requiresRegistration: false,
  },
  {
    id: 'youth-retreat',
    slug: 'youth-ministry-retreat-oct19',
    title: 'Youth Ministry Retreat',
    category: 'youth',
    categoryLabel: 'YOUTH',
    badgeStyle: 'dark',
    startDate: '2026-10-19',
    endDate: '2026-10-21',
    time: 'All Day',
    location: 'Camp Hope',
    cost: '$85 per student',
    description: 'A weekend away for middle and high school students to connect, worship, and grow in their faith.',
    actions: [{ label: 'Register', href: '/events/youth-ministry-retreat-oct19', variant: 'solid' }],
    requiresRegistration: true,
  },
  {
    id: 'city-missions',
    slug: 'city-missions-outreach-oct24',
    title: 'City Missions Outreach',
    category: 'missions',
    categoryLabel: 'MISSIONS',
    badgeStyle: 'blue',
    startDate: '2026-10-24',
    time: '8:00 AM - 12:00 PM',
    location: 'Community Center, Domlur',
    cost: 'Free',
    description: 'Serve alongside our missions team distributing meals and supplies to families across the city.',
    actions: [{ label: 'Sign Up', href: '/events/city-missions-outreach-oct24', variant: 'solid' }],
    requiresRegistration: true,
  },
  {
    id: 'womens-conference',
    slug: 'rooted-womens-conference-nov07',
    title: "Rooted: Women's Conference",
    category: 'conferences',
    categoryLabel: 'CONFERENCES',
    badgeStyle: 'navy',
    startDate: '2026-11-07',
    endDate: '2026-11-08',
    time: '9:00 AM - 4:00 PM',
    location: 'Main Sanctuary',
    cost: '$40 per person',
    description: 'A two-day gathering for women of all ages centered on Scripture, worship, and community.',
    actions: [{ label: 'Register', href: '/events/rooted-womens-conference-nov07', variant: 'solid' }],
    requiresRegistration: true,
  },
  {
    id: 'acoustic-night',
    slug: 'acoustic-worship-night-nov13',
    title: 'Acoustic Worship Night',
    category: 'worship',
    categoryLabel: 'WORSHIP',
    badgeStyle: 'gold',
    startDate: '2026-11-13',
    time: '7:00 PM - 8:30 PM',
    location: 'Chapel',
    description: 'A stripped-down, intimate evening of acoustic worship and reflection.',
    actions: [{ label: 'Details', href: '/events/acoustic-worship-night-nov13', variant: 'outline' }],
    requiresRegistration: false,
  },
  {
    id: 'youth-game-night',
    slug: 'youth-game-night-nov20',
    title: 'Youth Game Night',
    category: 'youth',
    categoryLabel: 'YOUTH',
    badgeStyle: 'dark',
    startDate: '2026-11-20',
    time: '6:00 PM - 8:30 PM',
    location: 'Youth Hall',
    description: 'Games, snacks, and community for middle and high schoolers. Friends are always welcome.',
    actions: [{ label: 'Details', href: '/events/youth-game-night-nov20', variant: 'outline' }],
    requiresRegistration: false,
  },
]

export const communityFocus: CommunityFocusItem[] = [
  {
    id: 'care-groups',
    title: 'Weekly Care Groups',
    description:
      'Connect with others in a small group setting for Bible study and fellowship. Various locations across the city.',
    image: '/images/focus-care-groups.jpg',
    linkLabel: 'Find a Group',
    href: '/groups',
  },
  {
    id: 'city-missions-focus',
    title: 'City Missions',
    description:
      'Join our monthly outreach programs serving the local community. Opportunities for all ages to volunteer.',
    image: '/images/focus-city-missions.jpg',
    linkLabel: 'Get Involved',
    href: '/volunteer',
  },
  {
    id: 'womens-ministry-focus',
    title: "Women's Ministry",
    description:
      'Monthly breakfasts and quarterly retreats designed to encourage and equip women in their spiritual journey.',
    image: '/images/focus-womens-ministry.jpg',
    linkLabel: 'Learn More',
    href: '/ministries/women',
  },
]

export const newsletterCta: NewsletterCtaData = {
  heading: 'Stay in the Loop',
  subtext:
    'Subscribe to our weekly newsletter to get updates on upcoming events, service times, and church news delivered straight to your inbox.',
  placeholder: 'Enter your email address',
  buttonLabel: 'Subscribe',
}
