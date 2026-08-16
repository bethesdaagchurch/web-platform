import type {
  HeroData,
  QuickLink,
  ServiceTime,
  PastorWelcome,
  Sermon,
  EventItem,
  Ministry,
  GivingCategory,
  SiteSettings,
} from '@/types/homepage'
import { sermonEntries, sermonHero } from '@/data/sermons-mock'

export const heroData: HeroData = {
  badgeText: 'Bethesda AG Church',
  heading: 'A Place to Belong,\nA Place to Grow',
  subtext:
    'Experience the warmth of community and the power of faith in a space dedicated to worship, growth, and selfless service.',
  primaryButton: { label: 'Plan Your Visit', href: '/visit' },
  secondaryButton: { label: 'Watch Live', href: '/live' },
  backgroundImage: '/images/hero-sanctuary.jpg',
}

export const quickLinks: QuickLink[] = [
  { id: 'watch-live', icon: 'watch', title: 'Watch Live', subtext: 'Join our virtual sanctuary', href: '/live' },
  { id: 'events', icon: 'calendar', title: 'Upcoming Events', subtext: 'Stay connected with us', href: '/events' },
  { id: 'give', icon: 'give', title: 'Give Online', subtext: 'Support our local mission', href: '/give' },
  { id: 'prayer', icon: 'prayer', title: 'Prayer Request', subtext: 'How can we pray for you?', href: '/prayer' },
]

export const serviceTimes: ServiceTime[] = [
  { id: 'early', time: '08:00 AM', label: 'Early Morning Service' },
  { id: 'main', time: '10:30 AM', label: 'Main Worship Service' },
  { id: 'evening', time: '06:00 PM', label: 'Evening Praise & Prayer' },
]

export const pastorWelcome: PastorWelcome = {
  photo: '/images/pastor-abraham.jpg',
  eyebrow: 'A message from our senior pastor',
  heading: 'Welcome to our Family',
  quote:
    'Bethesda is more than just a building; it\u2019s a home where hearts find peace and lives find purpose. We are thrilled to have you walk alongside us in this journey of faith.',
  name: 'Rev. Dr. Abraham Thomas',
  title: 'Senior Pastor, Bethesda AG Church',
}

// Derived from the sermons archive's data (src/data/sermons-mock.ts) rather
// than hand-duplicated, so the homepage's featured sermon and its 3 sidebar
// links always point at slugs that actually exist on /sermons/[slug].
export const sermons: Sermon[] = [
  {
    id: 'featured',
    slug: sermonHero.slug,
    title: sermonHero.title,
    speaker: 'Rev. Dr. Abraham Thomas',
    date: '2023-10-29',
    thumbnail: sermonHero.backgroundImage,
    featured: true,
  },
  ...sermonEntries.slice(0, 3).map((entry) => ({
    id: entry.id,
    slug: entry.slug,
    title: entry.title,
    speaker: entry.speakerName,
    date: entry.date,
    thumbnail: entry.thumbnail,
  })),
]

export const events: EventItem[] = [
  { id: 'e1', slug: 'night-of-worship', title: 'Night of Worship', day: '15', month: 'NOV', timeRange: '7:00 PM \u2013 9:30 PM', image: '/images/event-worship-night.jpg', category: 'worship' },
  { id: 'e2', slug: 'ignite-youth-conference', title: 'Ignite Youth Conference', day: '22', month: 'NOV', timeRange: '10:00 AM \u2013 5:00 PM', image: '/images/event-youth-conf.jpg', category: 'youth' },
  { id: 'e3', slug: 'city-hope-outreach', title: 'City Hope Outreach', day: '30', month: 'NOV', timeRange: '8:00 AM \u2013 12:00 PM', image: '/images/event-outreach.jpg', category: 'outreach' },
]

export const ministries: Ministry[] = [
  { id: 'youth', name: 'Youth', icon: 'youth', href: '/ministries/youth' },
  { id: 'children', name: 'Children', icon: 'children', href: '/ministries/children' },
  { id: 'women', name: 'Women', icon: 'women', href: '/ministries/women' },
  { id: 'men', name: 'Men', icon: 'men', href: '/ministries/men' },
  { id: 'worship', name: 'Worship', icon: 'worship', href: '/ministries/worship' },
  { id: 'outreach', name: 'Outreach', icon: 'outreach', href: '/ministries/outreach' },
  { id: 'groups', name: 'Groups', icon: 'groups', href: '/ministries/groups' },
]

export const givingBreakdown: GivingCategory[] = [
  { id: 'local', label: 'Local Outreach', percentage: 40 },
  { id: 'global', label: 'Global Missions', percentage: 30 },
  { id: 'ops', label: 'Ministry Operations', percentage: 20 },
  { id: 'community', label: 'Community Care', percentage: 10 },
]

export const siteSettings: SiteSettings = {
  churchName: 'Bethesda AG Church',
  tagline: 'A Bible-believing, Spirit-filled community committed to spreading the Gospel of Jesus Christ across Bangalore and beyond.',
  address: ['Inner Ring Road, Domlur,', 'Bangalore, Karnataka 560071, India'],
  phone: '+91 80 1234 5678',
  email: 'info@bethesdaag.church',
  mapEmbedUrl: '', // Optional override — left blank on purpose. resolveMapEmbedUrl() derives a real, working embed automatically from churchName + address when this is empty.
  nav: [
    { key: 'home', label: 'Home', href: '/' },
    { key: 'about', label: 'About', href: '/about' },
    { key: 'ministries', label: 'Ministries', href: '/ministries' },
    { key: 'sermons', label: 'Sermons', href: '/sermons' },
    { key: 'events', label: 'Events', href: '/events' },
    { key: 'contact', label: 'Contact', href: '/contact' },
  ],
  footerLinks: [
    {
      key: 'connectHeading',
      heading: 'Connect',
      links: [
        { key: 'joinGroup', label: 'Join a Group', href: '/groups' },
        { key: 'volunteer', label: 'Volunteer', href: '/volunteer' },
        { key: 'newHere', label: 'New Here?', href: '/visit' },
        { key: 'prayer', label: 'Prayer', href: '/prayer' },
      ],
    },
    {
      key: 'legalHeading',
      heading: 'Legal',
      links: [
        { key: 'privacyPolicy', label: 'Privacy Policy', href: '/privacy' },
        { key: 'termsOfService', label: 'Terms of Service', href: '/terms' },
        { key: 'cookiePolicy', label: 'Cookie Policy', href: '/cookies' },
        { key: 'sitemap', label: 'Sitemap', href: '/sitemap' },
      ],
    },
  ],
}
