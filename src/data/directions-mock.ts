import type {
  DirectionsHeroData,
  DirectionsServiceTime,
  NeedHelpData,
  DrivingDirectionSection,
  ParkingItem,
} from '@/types/directions'

export const directionsHero: DirectionsHeroData = {
  heading: 'Find Your Sanctuary',
  subtext: "Join us for worship. We're located in the heart of the city, ready to welcome you home.",
}

export const directionsServiceTimes: DirectionsServiceTime[] = [
  { id: 'sun-en', label: 'Sunday English', time: '9:00 AM & 11:30 AM' },
  { id: 'sun-kn', label: 'Sunday Kannada', time: '7:00 AM' },
  { id: 'wed', label: 'Wednesday Bible Study', time: '7:00 PM' },
]

export const needHelp: NeedHelpData = {
  heading: 'Need Help?',
  description: 'If you need assistance finding us or require special accommodations, please reach out.',
}

export const drivingDirections: DrivingDirectionSection[] = [
  {
    id: 'north',
    heading: 'From the North (City Center)',
    text: 'Take the Main Arterial Road heading South. Pass the Grand Plaza, and take a left onto Sanctuary Way at the 4th traffic signal. The church will be on your right after 500 meters.',
  },
  {
    id: 'airport',
    heading: 'From the Airport',
    text: 'Take the Airport Expressway to Exit 12 (Central District). Merge onto the Ring Road heading East. Take the Sanctuary Way exit and continue for 2 kilometers.',
  },
  {
    id: 'transit',
    heading: 'Public Transit',
    text: "Take the Blue Line Metro to 'Central Station'. Exit towards East Gate and walk 5 minutes straight down Sanctuary Way.",
  },
]

export const parkingItems: ParkingItem[] = [
  {
    id: 'visitor-lot',
    icon: 'car',
    title: 'Main Visitor Lot',
    description: 'Located directly behind the main auditorium. Enter via the North Gate on Sanctuary Way. This lot fills up quickly on Sunday mornings, so arrive early.',
  },
  {
    id: 'accessibility',
    icon: 'accessibility',
    title: 'Accessibility',
    description: 'Designated handicap parking is available near all main entrances. Our entire campus is wheelchair accessible, including ramps and elevators to all floors.',
  },
  {
    id: 'overflow',
    icon: 'bus',
    title: 'Overflow Parking',
    description: 'Available at the Central School lot next door during Sunday services. A complimentary shuttle runs every 10 minutes from the overflow lot to the main entrance.',
  },
]
