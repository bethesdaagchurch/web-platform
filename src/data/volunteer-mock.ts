import type { VolunteerHeroData, ServiceArea, VolunteerQuoteData } from '@/types/volunteer'

export const volunteerHero: VolunteerHeroData = {
  badge: 'Volunteer',
  heading: 'Impact the Kingdom',
  subtext:
    'Discover your purpose and find your community by serving at Bethesda AG. We believe every person has unique gifts to share.',
  buttonLabel: 'Explore Opportunities',
  buttonHref: '#areas-of-service',
  backgroundImage: '/images/volunteer-hero.jpg',
}

export const serviceAreas: ServiceArea[] = [
  {
    id: 'worship-tech',
    variant: 'image',
    icon: 'worship',
    title: 'Worship & Tech',
    description: 'Help create an atmosphere of encounter through music, sound engineering, lighting, and media production.',
    image: '/images/volunteer-worship-tech.jpg',
    signUpLabel: 'Sign Up',
    signUpHref: '/contact',
  },
  {
    id: 'bethesda-kids',
    variant: 'featured',
    icon: 'kids',
    title: 'Bethesda Kids',
    description: 'Shape the next generation by serving in our nursery, preschool, or elementary classrooms as teachers or assistants.',
    highNeedLabel: 'High Need',
  },
  {
    id: 'hospitality',
    variant: 'plain',
    icon: 'hospitality',
    title: 'Hospitality',
    description: 'Be the first welcoming face on Sunday mornings. Serve as a greeter, usher, or at the welcome desk.',
  },
  {
    id: 'local-outreach',
    variant: 'plain',
    icon: 'outreach',
    title: 'Local Outreach',
    description: 'Partner with our community initiatives, food drives, and local missions to serve the city.',
  },
]

export const volunteerQuote: VolunteerQuoteData = {
  quote:
    "Each of you should use whatever gift you have received to serve others, as faithful stewards of God's grace in its various forms.",
  reference: '1 Peter 4:10',
}
