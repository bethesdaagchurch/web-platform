import type { GroupsHeroData, GroupCategoryOption, GroupListing, GroupsQuoteData } from '@/types/groups'

export const groupsHero: GroupsHeroData = {
  heading: 'Find and Join Your Community',
  subtext: "Life is better together. Discover a care group near you to connect, grow, and share life's journey in a supportive community.",
  searchPlaceholder: 'Search by location, topic, or leader...',
  backgroundImage: '/images/groups-hero.jpg',
}

// Structural, code-owned — mirrors the Groups collection's fixed category
// select options, same reasoning as Events/Ministries' category filters.
export const groupCategories: GroupCategoryOption[] = [
  { value: 'worship', label: 'Worship' },
  { value: 'youth', label: 'Youth' },
  { value: 'care-groups', label: 'Care Groups' },
  { value: 'kids', label: 'Kids' },
  { value: 'care', label: 'Care' },
]

export const groupListings: GroupListing[] = [
  {
    id: 'downtown-collective',
    slug: 'the-downtown-collective',
    badgeLabel: 'Young Adults',
    title: 'The Downtown Collective',
    description: 'A community for young professionals navigating faith and career in the heart of the city.',
    schedule: 'Tuesdays, 7:00 PM',
    location: 'Downtown Core (Near Station)',
    leaderName: 'David Chen',
    leaderPhoto: '/images/group-leader-david.jpg',
    category: 'care-groups',
    contactEmail: 'downtown@bethesdaag.church',
  },
  {
    id: 'growing-together',
    slug: 'growing-together',
    badgeLabel: 'Families',
    title: 'Growing Together',
    description: 'Focusing on marriage, parenting, and building strong family foundations. Childcare provided.',
    schedule: 'Sundays, 4:00 PM',
    location: 'Westside Suburbs',
    leaderName: 'Mark & Sarah',
    leaderPhoto: '/images/group-leader-mark-sarah.jpg',
    category: 'care-groups',
    contactEmail: 'families@bethesdaag.church',
  },
  {
    id: 'morning-manna',
    slug: 'morning-manna',
    badgeLabel: 'Open to All',
    title: 'Morning Manna',
    description: 'Early risers gathering for deep Bible study and intercessory prayer before the workday begins.',
    schedule: 'Wednesdays, 6:00 AM',
    location: 'Church Cafe / Online',
    leaderName: 'Elder James',
    category: 'care-groups',
    contactEmail: 'morningmanna@bethesdaag.church',
  },
]

export const groupsQuote: GroupsQuoteData = {
  quote: 'For where two or three gather in my name, there am I with them.',
  reference: 'Matthew 18:20',
}
