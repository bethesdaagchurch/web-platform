import type { VisitHeroData, ExpectationItem, NumberInPartyOption, VisitServiceTime } from '@/types/visit'

export const visitHero: VisitHeroData = {
  heading: 'Welcome Home',
  subtext:
    "We're so glad you're considering visiting Bethesda AG Church. Whether you're exploring faith or looking for a church community, you are welcome here.",
}

export const numberInPartyOptions: NumberInPartyOption[] = [
  { value: '1', label: 'Just me' },
  { value: '2', label: '2 people' },
  { value: '3', label: '3 people' },
  { value: '4', label: '4 people' },
  { value: '5+', label: '5 or more' },
]

export const expectations: ExpectationItem[] = [
  {
    id: 'parking',
    icon: 'parking',
    title: 'Reserved Parking',
    description: 'Turn on your flashers when you enter, and our team will direct you to a VIP spot just for guests.',
  },
  {
    id: 'kids',
    icon: 'kids',
    title: 'Bethesda Kids',
    description: 'Safe, fun, and engaging environments for infants through 5th grade during all services.',
  },
  {
    id: 'coffee',
    icon: 'coffee',
    title: 'Free Coffee',
    description: 'Stop by our caf\u00e9 in the lobby before service for a complimentary cup of coffee or tea.',
  },
]

export const visitServiceTimes: VisitServiceTime[] = [
  { id: 'sun-1', label: 'Sunday Service', time: '9:00 AM' },
  { id: 'sun-2', label: 'Sunday Service', time: '11:00 AM' },
  { id: 'wed', label: 'Wednesday Bible Study', time: '7:00 PM' },
]
