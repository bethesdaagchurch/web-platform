export interface GroupsHeroData {
  heading: string
  subtext: string
  searchPlaceholder: string
  backgroundImage: string
}

export type GroupCategoryValue = 'worship' | 'youth' | 'care-groups' | 'kids' | 'care'

export interface GroupCategoryOption {
  value: GroupCategoryValue
  label: string
}

export interface GroupListing {
  id: string
  slug: string
  badgeLabel: string
  title: string
  description: string
  schedule: string
  location: string
  leaderName: string
  leaderPhoto?: string
  category: GroupCategoryValue
  contactEmail: string
}

export interface GroupsQuoteData {
  quote: string
  reference: string
}
