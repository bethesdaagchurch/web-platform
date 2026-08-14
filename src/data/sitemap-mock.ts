import { sermonHero } from '@/data/sermons-mock'

const latestSermonHref = `/sermons/${sermonHero.slug}`

// Structural only (ids, icons, hrefs) — titles/labels/descriptions live in
// messages/*.json under the `sitemap` namespace and are merged in at the
// page level, same reasoning as Events/Groups' category pills.
export const sitemapSectionStructure = [
  {
    id: 'home-core',
    icon: 'home' as const,
    links: [
      { id: 'homepage', href: '/' },
      { id: 'imNewHere', href: '/visit' },
      { id: 'serviceTimes', href: '/schedule' },
    ],
  },
  {
    id: 'about-us',
    icon: 'info' as const,
    links: [
      { id: 'ourStory', href: '/about' },
      { id: 'leadershipTeam', href: '/about#leadership' },
      // TODO: no dedicated "What We Believe" / statement-of-faith page
      // exists yet — routes to the About page until that content is built.
      { id: 'whatWeBelieve', href: '/about' },
    ],
  },
  {
    id: 'ministries',
    icon: 'ministries' as const,
    links: [
      { id: 'kidsMinistry', href: '/ministries/kids' },
      { id: 'youthYoungAdults', href: '/ministries/youth' },
      { id: 'adultSmallGroups', href: '/ministries#small-groups' },
    ],
  },
  {
    id: 'sermons-media',
    icon: 'sermons' as const,
    links: [
      { id: 'latestSermon', href: latestSermonHref },
      { id: 'sermonArchive', href: '/sermons' },
      { id: 'liveStream', href: '/live' },
    ],
  },
  {
    id: 'events-news',
    icon: 'events' as const,
    links: [
      { id: 'upcomingEvents', href: '/events' },
      // /blog has no design yet — commented out rather than deleted, so
      // re-adding it once a design exists is a one-line uncomment, not a
      // rebuild. The route itself still exists (PagePlaceholder), just
      // isn't linked from anywhere now.
      // { id: 'churchBlog', href: '/blog' },
    ],
  },
]
