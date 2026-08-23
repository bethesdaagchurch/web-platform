// These types mirror the Payload schema described in the architecture guide
// (Phase 5: "Design the content schema"). Keeping the shape identical now
// means swapping mock data for `payload.findGlobal()` / `payload.find()`
// later requires no changes to any component's props.

export interface HeroData {
  badgeText: string
  heading: string // supports a manual line break via "\n"
  subtext: string
  primaryButton: { label: string; href: string }
  secondaryButton: { label: string; href: string }
  backgroundImage: string // URL — also used as the video's poster frame
  backgroundVideo?: string // URL (MP4) — optional; falls back to backgroundImage when absent
  backgroundVideoWebm?: string // URL (WebM) — optional; offered before the MP4 when present
}

export interface QuickLink {
  id: string
  icon: 'watch' | 'calendar' | 'give' | 'prayer'
  title: string
  subtext: string
  href: string
}

export interface ServiceTime {
  id: string
  time: string
  label: string
}

export interface PastorWelcome {
  photo: string
  eyebrow: string
  heading: string
  quote: string
  name: string
  title: string
}

export interface Sermon {
  id: string
  slug: string
  title: string
  speaker: string
  date: string // ISO date
  thumbnail: string
  featured?: boolean
}

export interface EventItem {
  id: string
  slug: string
  title: string
  day: string
  month: string
  timeRange: string
  image: string
  // Not currently rendered by UpcomingEvents.tsx (no badge/color logic
  // there, unlike the full /events archive's EventCard) — kept loose
  // rather than narrowed to a union, since the Events collection's real
  // category set (youth/missions/conferences/worship) doesn't map cleanly
  // onto a 3-value union without losing information.
  category: string
}

export interface Ministry {
  id: string
  name: string
  icon: 'youth' | 'children' | 'women' | 'men' | 'worship' | 'outreach' | 'groups'
  href: string
}

export interface GivingCategory {
  id: string
  label: string
  percentage: number
}

export interface SiteSettings {
  churchName: string
  tagline: string
  address: string[]
  phone: string
  email: string
  mapEmbedUrl: string
  socialLinks: { facebook: string; instagram: string; youtube: string }
  nav: { key: string; label: string; href: string }[]
  footerLinks: { key: string; heading: string; links: { key: string; label: string; href: string }[] }[]
}
