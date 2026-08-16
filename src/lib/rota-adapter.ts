import type { WorshipRota, RotaPage as RotaPageGlobal, Media } from '@/payload-types'
import type { RotaEntry, RotaFilterOption, WorshipGuidelinesData } from '@/types/rota'
import { rotaEyebrow as mockEyebrow, worshipGuidelines as mockGuidelines, rotaEntries as mockEntries } from '@/data/rota-mock'

function mediaUrl(media: number | Media | null | undefined, fallback: string): string {
  if (media && typeof media === 'object' && media.url) return media.url
  return fallback
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
  if (!docs || docs.length === 0) return mockEntries
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
      worshipTeamName: doc.worshipTeam.teamName,
      worshipLeaderName: doc.worshipTeam.leaderName,
      worshipBadge: doc.worshipTeam.badge ?? undefined,
      teamMemberAvatars: members.slice(0, 3).map((m) => mediaUrl(m.photo, '')),
      teamMemberCount: members.length,
      specialItems: (doc.specialItems ?? []).map((item) => ({
        label: item.label,
        personName: item.personName,
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
