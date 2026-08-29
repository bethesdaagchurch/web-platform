import type { Sermon as SermonDoc, SermonsPage as SermonsPageGlobal, Media } from '@/payload-types'
import type { SermonHeroData, SermonEntry, FilterOption, PodcastCtaData } from '@/types/sermons'
import type { Sermon as HomepageSermon } from '@/types/homepage'
import { sermonHero as mockHero } from '@/data/sermons-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

// Turns "Pastor John" into "pastor-john" — used as the <select> option value
// and for matching against it client-side. Free text stays free text for
// editors; only the derived key needs to be URL/attribute-safe.
function slugifyKey(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

function initialsFrom(name: string): string {
  const parts = name.trim().split(/\s+/)
  return parts
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

// Returns null (not a mock fallback) when there's no real, admin-selected
// featured sermon — same reasoning as adaptEventsHero: this hero is built
// around showcasing one specific, real sermon prominently, so an "empty"
// version of that layout would look broken rather than honest. The page
// skips rendering this section entirely in that case.
export function adaptSermonHero(doc: SermonsPageGlobal | null): SermonHeroData | null {
  const featuredSermon = doc?.hero?.featuredSermon
  if (!doc?.hero || !featuredSermon || typeof featuredSermon !== 'object') return null

  return {
    badge: doc.hero.badge || mockHero.badge,
    date: formatDate(featuredSermon.date),
    title: featuredSermon.title,
    description: featuredSermon.description,
    backgroundImage: mediaUrl(featuredSermon.thumbnail, mockHero.backgroundImage),
    slug: featuredSermon.slug,
    youtubeUrl: featuredSermon.youtubeUrl,
  }
}

export function adaptSermonEntries(docs: SermonDoc[]): SermonEntry[] {
  // Deliberately not falling back to mock sermons — same reasoning as
  // Worship Rota/Ministries/Groups/Events: specific, factual claims about
  // real sermons that were actually preached. An empty database means an
  // honest empty list.
  if (!docs || docs.length === 0) return []
  return docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    title: doc.title,
    seriesLabel: doc.seriesLabel,
    series: slugifyKey(doc.seriesLabel),
    description: doc.description,
    scripture: doc.scripture,
    speakerName: doc.speakerName,
    speakerInitials: initialsFrom(doc.speakerName),
    speaker: slugifyKey(doc.speakerName),
    // Unlike series/speaker, SermonEntry has no separate "topicLabel" field
    // — topic itself is both the filter key and what gets displayed. Don't
    // slugify it: that would silently lowercase "Grace" to "grace" with no
    // properly-cased version left anywhere to show in the dropdown.
    topic: doc.topic,
    date: doc.date,
    duration: doc.duration,
    thumbnail: mediaUrl(doc.thumbnail, '/images/sermon-prodigal.jpg'),
    youtubeUrl: doc.youtubeUrl,
  }))
}

// Derives the three filter dropdowns' options from whatever series/speakers/
// topics actually exist across the fetched sermons — guarantees the filters
// always match the real data, with no separate list for an editor to keep
// in sync (and no risk of a filter option that matches zero sermons).
function uniqueOptions(entries: SermonEntry[], field: 'series' | 'speaker' | 'topic', labelField: 'seriesLabel' | 'speakerName' | 'topic', allLabel: string): FilterOption[] {
  const seen = new Map<string, string>()
  for (const entry of entries) {
    const value = entry[field]
    const label = field === 'series' ? entry.seriesLabel : field === 'speaker' ? entry.speakerName : entry.topic
    if (!seen.has(value)) seen.set(value, label)
  }
  return [{ value: 'all', label: allLabel }, ...Array.from(seen, ([value, label]) => ({ value, label }))]
}

export function adaptFilterOptions(
  entries: SermonEntry[],
  allLabels: { series: string; speaker: string; topic: string }
): {
  seriesOptions: FilterOption[]
  speakerOptions: FilterOption[]
  topicOptions: FilterOption[]
} {
  return {
    seriesOptions: uniqueOptions(entries, 'series', 'seriesLabel', allLabels.series),
    speakerOptions: uniqueOptions(entries, 'speaker', 'speakerName', allLabels.speaker),
    topicOptions: uniqueOptions(entries, 'topic', 'topic', allLabels.topic),
  }
}

// Returns null (not a mock fallback) when the admin hasn't added any real
// platform links yet — the mock data pointed at podcasts.apple.com and
// open.spotify.com's generic homepages, not the church's actual show,
// which would send a visitor somewhere real-looking but wrong rather than
// an honest "not set up yet" state. The page skips rendering this section
// entirely in that case, same principle as the sermon/event hero sections.
export function adaptPodcastCta(doc: SermonsPageGlobal | null): PodcastCtaData | null {
  if (!doc?.podcastCta || !doc.podcastCta.links || doc.podcastCta.links.length === 0) return null
  return {
    heading: doc.podcastCta.heading,
    description: doc.podcastCta.description,
    links: doc.podcastCta.links.map((l) => ({ label: l.label, href: l.href, icon: l.icon })),
  }
}

// Feeds the homepage's compact "Latest Word" section: the hero sermon plus
// the 3 most recent archive entries, mapped to the homepage's simpler
// Sermon shape (no series/scripture/description needed there).
//
// No mock fallback for the featured slot — if no sermon is explicitly
// marked "featured" in /admin, the most recently dated real sermon is
// promoted into that slot instead. Still entirely real, honest data, just
// repurposed slightly, rather than fabricating a sermon and speaker name
// that don't exist. Returns [] only when there's truly no real sermon
// data anywhere — LatestSermons skips rendering the whole section in
// that case rather than crashing on an empty array or showing a section
// with nothing real in it.
export function adaptHomepageSermons(heroDoc: SermonsPageGlobal | null, entryDocs: SermonDoc[]): HomepageSermon[] {
  const featuredSermon = heroDoc?.hero?.featuredSermon
  const entries = adaptSermonEntries(entryDocs)
  const sorted = [...entries].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

  if (featuredSermon && typeof featuredSermon === 'object') {
    const featured: HomepageSermon = {
      id: String(featuredSermon.id),
      slug: featuredSermon.slug,
      title: featuredSermon.title,
      speaker: featuredSermon.speakerName,
      date: featuredSermon.date,
      thumbnail: mediaUrl(featuredSermon.thumbnail, mockHero.backgroundImage),
      featured: true,
    }
    return [
      featured,
      ...sorted.filter((s) => s.id !== featured.id).slice(0, 3).map((entry) => ({
        id: entry.id,
        slug: entry.slug,
        title: entry.title,
        speaker: entry.speakerName,
        date: entry.date,
        thumbnail: entry.thumbnail,
      })),
    ]
  }

  // No sermon explicitly marked "featured" — promote the most recent real
  // one instead of fabricating one, or return [] if there are none at all.
  if (sorted.length === 0) return []
  const [mostRecent, ...rest] = sorted
  return [
    { id: mostRecent.id, slug: mostRecent.slug, title: mostRecent.title, speaker: mostRecent.speakerName, date: mostRecent.date, thumbnail: mostRecent.thumbnail, featured: true },
    ...rest.slice(0, 3).map((entry) => ({
      id: entry.id,
      slug: entry.slug,
      title: entry.title,
      speaker: entry.speakerName,
      date: entry.date,
      thumbnail: entry.thumbnail,
    })),
  ]
}
