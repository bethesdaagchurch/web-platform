export interface EventsHeroData {
  badge: string
  heading: string
  subtext: string
  button: { label: string; href: string }
  backgroundImage: string
}

export interface FilterOption {
  value: string
  label: string
}

export type EventBadgeStyle = 'gold' | 'dark' | 'navy' | 'blue'

export interface EventAction {
  label: string
  href: string
  variant: 'solid' | 'outline'
}

export interface EventEntry {
  id: string
  slug: string
  title: string
  category: string // filter key, matches a FilterOption value
  categoryLabel: string // badge text, e.g. "WORSHIP"
  badgeStyle: EventBadgeStyle
  startDate: string // ISO date
  endDate?: string // ISO date — presence means it's a multi-day event on the calendar
  time: string
  location: string
  cost?: string
  description: string
  actions: EventAction[]
  requiresRegistration: boolean
}

export interface CommunityFocusItem {
  id: string
  title: string
  description: string
  image: string
  linkLabel: string
  href: string
}

export interface NewsletterCtaData {
  heading: string
  subtext: string
  placeholder: string
  buttonLabel: string
}
