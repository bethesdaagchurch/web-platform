export interface AboutHeroData {
  eyebrow: string
  heading: string // supports "\n" line break
  subtext: string
  ctaLabel: string
  ctaHref: string
}

export type LeadershipVariant = 'photo-left' | 'photo-top' | 'avatar'

export interface LeadershipMember {
  id: string
  variant: LeadershipVariant
  name: string
  roleLabel: string // small eyebrow, e.g. "LEAD PASTOR"
  photo: string
  bio: string
  bioLink?: { label: string; href: string }
}

export interface CoreValue {
  id: string
  icon: 'book' | 'heart' | 'community' | 'globe'
  accent: 'blue' | 'gold'
  title: string
  description: string
}

export interface JourneyMilestone {
  id: string
  year: string
  title: string
  description: string
  dotAccent: 'blue' | 'gold'
}
