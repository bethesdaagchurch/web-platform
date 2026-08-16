export interface GiveHeroData {
  heading: string
  quote: string
  reference: string
}

export interface FundOption {
  value: string
  label: string
}

export interface ImpactItem {
  id: string
  icon: 'globe' | 'food' | 'grad'
  title: string
  description: string
}

export interface ImpactData {
  heading: string
  description: string
  items: ImpactItem[]
}

export interface OtherWayToGive {
  id: string
  icon: 'text' | 'mail'
  title: string
  lines: string[] // rendered as separate lines, last item can include a phone/address break
}
