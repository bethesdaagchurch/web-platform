// Separate from types/homepage.ts's `Sermon` (used by the homepage's compact
// "Latest Word" section) — this archive page needs more fields per sermon
// (series, scripture, speaker, duration) than the homepage summary does.

export interface SermonHeroData {
  badge: string
  date: string
  title: string
  description: string
  backgroundImage: string
  slug: string
  youtubeUrl: string
}

export interface FilterOption {
  value: string
  label: string
}

export interface SermonEntry {
  id: string
  slug: string
  title: string
  seriesLabel: string // e.g. "The Parables Series" — shown as the gold eyebrow
  series: string // filter key, e.g. "parables"
  description: string
  scripture: string
  speakerName: string
  speakerInitials: string
  speaker: string // filter key, e.g. "pastor-john"
  topic: string // filter key, e.g. "grace"
  date: string // ISO date
  duration: string // "45:20"
  thumbnail: string
  youtubeUrl: string
}

export interface PodcastCtaData {
  heading: string
  description: string
  links: { label: string; href: string; icon: 'headphones' | 'waveform' }[]
}
