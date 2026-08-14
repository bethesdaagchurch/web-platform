export interface ScheduleHeroData {
  heading: string
  subtext: string
}

export type ServiceBadge = 'In-Person' | 'Hybrid'

export interface WeeklyServiceItem {
  id: string
  name: string
  time: string
  badgeLabel: ServiceBadge
  serviceTitle: string
  description: string
  location: string
}

export interface ScheduleQuoteData {
  quote: string
  reference: string
}

export interface SpecialServiceItem {
  id: string
  title: string
  schedule: string
  description: string
  image: string
}
