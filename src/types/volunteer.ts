export interface VolunteerHeroData {
  badge: string
  heading: string
  subtext: string
  buttonLabel: string
  buttonHref: string
  backgroundImage: string
}

export type ServiceAreaVariant = 'image' | 'plain' | 'featured'
export type ServiceAreaIcon = 'worship' | 'hospitality' | 'outreach' | 'kids'

export interface ServiceArea {
  id: string
  variant: ServiceAreaVariant
  icon: ServiceAreaIcon
  title: string
  description: string
  image?: string
  signUpLabel?: string
  signUpHref?: string
  highNeedLabel?: string
}

export interface VolunteerQuoteData {
  quote: string
  reference: string
}
