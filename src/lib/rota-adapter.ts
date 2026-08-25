import type { WorshipRota, RotaPage as RotaPageGlobal, Media, Member } from '@/payload-types'
import type { RotaEntry, RotaFilterOption, WorshipGuidelinesData } from '@/types/rota'
import { rotaEyebrow as mockEyebrow, worshipGuidelines as mockGuidelines } from '@/data/rota-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
}

// leaderName/personName/translator/choirTeam are real relationships to
// Members (leaderName/personName previously plain text) — a bare numeric
// ID instead of the populated document would mean insufficient query
// depth, so these fall back defensively rather than crashing on `.name`,
// same reasoning as mediaUrl above.
function memberName(member: number | Member | null | undefined, fallback: string): string {
  if (member && typeof member === 'object' && member.name) return member.name
  return fallback
}

// For hasMany relationships (choirTeam, and personName now that Special
// Items allow more than one person) — same defensive-fallback reasoning,
// just across an array. Filters out anything unpopulated rather than
// showing a placeholder per-person, since a partial "TBD, Grace, TBD"
// list would read worse than just omitting what didn't resolve.
function memberNames(members: (number | Member)[] | null | undefined): string {
  if (!members || members.length === 0) return ''
  return members
    .filter((m): m is Member => typeof m === 'object' && Boolean(m?.name))
    .map((m) => m.name)
    .join(', ')
}

export function adaptRotaEyebrow(doc: RotaPageGlobal | null): string {
  return doc?.eyebrow || mockEyebrow
}

export function adaptWorshipGuidelines(doc: RotaPageGlobal | null): WorshipGuidelinesData {
  if (!doc?.worshipGuidelines) return mockGuidelines
  return {
    heading: doc.worshipGuidelines.heading || mockGuidelines.heading,
    description: doc.worshipGuidelines.description || mockGuidelines.description,
    linkLabel: doc.worshipGuidelines.linkLabel || mockGuidelines.linkLabel,
    linkHref: doc.worshipGuidelines.linkHref || mockGuidelines.linkHref,
  }
}

export function adaptRotaEntries(docs: WorshipRota[]): RotaEntry[] {
  // Deliberately NOT falling back to mock data here, unlike every other
  // adapter in this project — those mock fallbacks stand in for generic
  // page copy (a hero heading, a placeholder image) where showing
  // something reasonable-looking is harmless. This is different: rota
  // entries are specific, factual, time-sensitive claims about who is
  // actually preaching or leading worship on a given date. Showing a
  // fabricated schedule as if it were real could genuinely mislead a
  // visitor into expecting a specific pastor or service that doesn't
  // exist — reported directly after this was noticed. An empty database
  // means an honest empty list, handled by RotaExplorer showing "no
  // service currently assigned" rather than a made-up one.
  if (!docs || docs.length === 0) return []
  return docs.map((doc) => {
    const members = doc.worshipTeam.members ?? []
    return {
      id: String(doc.id),
      date: doc.date,
      ministry: doc.ministry,
      serviceTime: doc.serviceTime,
      sermonSpeakerName: doc.sermon.speakerName,
      sermonSpeakerPhoto: mediaUrl(doc.sermon.speakerPhoto, '/images/rota-pastor-smith.jpg'),
      sermonSpeakerIsGuest: doc.sermon.isGuest ?? false,
      sermonTitle: doc.sermon.title,
      sermonTranslatorName: doc.sermon.translator ? memberName(doc.sermon.translator, '') || undefined : undefined,
      worshipTeamName: doc.worshipTeam.teamName,
      worshipLeaderName: memberName(doc.worshipTeam.leaderName, 'TBD'),
      worshipBadge: doc.worshipTeam.badge ?? undefined,
      choirTeamNames: memberNames(doc.worshipTeam.choirTeam) || undefined,
      teamMemberAvatars: members.slice(0, 3).map((m) => mediaUrl(m.photo, '')),
      teamMemberCount: members.length,
      specialItems: (doc.specialItems ?? []).map((item) => ({
        label: item.label,
        personName: memberNames(item.personName) || 'TBD',
        roleLabel: item.roleLabel ?? undefined,
      })),
    }
  })
}

// Derives both filter dropdowns from whatever entries actually exist —
// same "no separately-maintained list to drift out of sync" reasoning
// used for Sermons' Series/Speaker/Topic filters.
export function adaptRotaFilterOptions(
  entries: RotaEntry[],
  allMinistriesLabel: string
): {
  monthOptions: RotaFilterOption[]
  ministryOptions: RotaFilterOption[]
} {
  const monthSeen = new Map<string, string>()
  const ministrySeen = new Set<string>()

  for (const entry of entries) {
    const d = new Date(entry.date)
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    // Deliberately still 'en-US' here — a separate, known gap from the
    // static-text translation pass: locale-aware date formatting touches a
    // wider set of files (also EventCard, EventsCalendar, SermonCard,
    // RecentSermonsSection, RotaEntryCard) and wasn't in this pass's scope.
    const label = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!monthSeen.has(key)) monthSeen.set(key, label)
    ministrySeen.add(entry.ministry)
  }

  const monthOptions = Array.from(monthSeen, ([value, label]) => ({ value, label })).sort((a, b) =>
    a.value.localeCompare(b.value)
  )
  const ministryOptions = [
    { value: 'all', label: allMinistriesLabel },
    ...Array.from(ministrySeen, (m) => ({ value: m, label: m })),
  ]

  return { monthOptions, ministryOptions }
}
