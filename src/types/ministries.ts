export type MinistryCategory = 'adults' | 'kids-youth' | 'service'

export interface MinistryHeroData {
  heading: string
  subtext: string
}

export interface MinistryItem {
  id: string
  slug: string
  name: string
  description: string
  image: string
  categories: MinistryCategory[] // a ministry can belong to more than one filter
  ctaLabel: string
  contactEmail: string
}

export interface SmallGroupFeature {
  id: string
  icon: 'discussion' | 'support'
  title: string
  description: string
}

export interface SmallGroupsData {
  heading: string
  description: string
  features: SmallGroupFeature[]
}

export interface AreaOfInterestOption {
  value: string
  label: string
}
