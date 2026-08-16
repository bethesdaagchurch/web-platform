export interface VisitHeroData {
  heading: string
  subtext: string
}

export interface ExpectationItem {
  id: string
  icon: 'parking' | 'kids' | 'coffee'
  title: string
  description: string
}

export interface NumberInPartyOption {
  value: string
  label: string
}

export interface VisitServiceTime {
  id: string
  label: string
  time: string
}
