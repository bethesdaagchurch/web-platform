import type { MinistryHeroData, MinistryItem, SmallGroupsData, AreaOfInterestOption } from '@/types/ministries'

export const ministriesHero: MinistryHeroData = {
  heading: 'Discover Your Community',
  subtext:
    'Explore the various ministries at Bethesda AG Church and find where you can connect, serve, and grow in your faith journey.',
}

export const ministryItems: MinistryItem[] = [
  {
    id: 'youth',
    slug: 'youth',
    name: 'Youth Ministry',
    description:
      'Empowering the next generation to build a strong foundation of faith through engaging community, worship, and impactful teaching.',
    image: '/images/ministry-youth.jpg',
    categories: ['kids-youth'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'youth@bethesdaag.church',
  },
  {
    id: 'kids',
    slug: 'kids',
    name: 'Kids Ministry',
    description:
      "Creating a safe, fun, and nurturing environment where children can learn about God's love through interactive lessons and activities.",
    image: '/images/ministry-kids.jpg',
    categories: ['kids-youth'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'kids@bethesdaag.church',
  },
  {
    id: 'men',
    slug: 'men',
    name: "Men's Ministry",
    description:
      'Fostering authentic brotherhood, accountability, and spiritual growth to equip men to lead in their families, workplaces, and communities.',
    image: '/images/ministry-men.jpg',
    categories: ['adults'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'men@bethesdaag.church',
  },
  {
    id: 'women',
    slug: 'women',
    name: "Women's Ministry",
    description:
      'A community designed to connect women across generations, encouraging spiritual depth, mutual support, and purposeful living.',
    image: '/images/ministry-women.jpg',
    categories: ['adults'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'women@bethesdaag.church',
  },
  {
    id: 'worship',
    slug: 'worship',
    name: 'Worship Ministry',
    description:
      'Leading the congregation in transformative worship experiences through music, creative arts, and technical production.',
    image: '/images/ministry-worship.jpg',
    categories: ['service'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'worship@bethesdaag.church',
  },
  {
    id: 'outreach',
    slug: 'outreach',
    name: 'Outreach Ministry',
    description:
      "Extending God's love beyond our walls through local community service, global missions, and practical acts of compassion.",
    image: '/images/ministry-outreach.jpg',
    categories: ['service'],
    ctaLabel: 'Join Ministry',
    contactEmail: 'outreach@bethesdaag.church',
  },
]

export const smallGroups: SmallGroupsData = {
  heading: 'Small Groups',
  description:
    'Life is better connected. Small groups are the heartbeat of our church\u2014a place to share life, study the Word, and pray together in a smaller, more intimate setting.',
  features: [
    {
      id: 'discussion',
      icon: 'discussion',
      title: 'Meaningful Discussion',
      description: 'Dive deeper into weekend teachings in a supportive environment.',
    },
    {
      id: 'support',
      icon: 'support',
      title: 'Shared Support',
      description: "Care for one another through life's highs and lows.",
    },
  ],
}

export const areaOfInterestOptions: AreaOfInterestOption[] = [
  { value: 'general', label: 'General Small Group' },
  { value: 'youth', label: 'Youth Ministry' },
  { value: 'kids', label: 'Kids Ministry' },
  { value: 'men', label: "Men's Ministry" },
  { value: 'women', label: "Women's Ministry" },
  { value: 'worship', label: 'Worship Ministry' },
  { value: 'outreach', label: 'Outreach Ministry' },
]
