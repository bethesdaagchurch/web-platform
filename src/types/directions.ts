export interface DirectionsHeroData {
  heading: string
  subtext: string
}

export interface DirectionsServiceTime {
  id: string
  label: string
  time: string
}

export interface NeedHelpData {
  heading: string
  description: string
}

export interface DrivingDirectionSection {
  id: string
  heading: string
  text: string
}

export interface ParkingItem {
  id: string
  icon: 'car' | 'accessibility' | 'bus'
  title: string
  description: string
}
