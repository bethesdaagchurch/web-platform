import type { Member, Sermon, EventRegistration, WorshipRota, JoinRequest } from '@/payload-types'
import type {
  GroupItem,
  VolunteerShiftData,
  DashboardSermonItem,
  RegisteredEventItem,
  RotaAssignmentItem,
  MinistryDashboardItem,
  PendingRequestItem,
} from '@/types/dashboard'

function mediaUrl(media: unknown, fallback: string): string {
  if (media && typeof media === 'object' && 'url' in media && typeof media.url === 'string') return media.url
  return fallback
}

export function adaptGroups(member: Member): GroupItem[] {
  if (!member.myGroups || member.myGroups.length === 0) return []
  return member.myGroups
    // A relationship field can come back as a bare numeric ID instead of
    // the populated document if something ever queries with insufficient
    // depth — skip those defensively rather than crash on `.title`.
    .filter((g): g is Exclude<typeof g, number> => typeof g === 'object' && g !== null)
    .map((g) => ({
      id: String(g.id),
      name: g.title,
      schedule: g.schedule,
      location: g.location,
      slug: g.slug,
    }))
}

export function adaptMinistries(member: Member): MinistryDashboardItem[] {
  if (!member.myMinistries || member.myMinistries.length === 0) return []
  return member.myMinistries
    .filter((m): m is Exclude<typeof m, number> => typeof m === 'object' && m !== null)
    .map((m) => ({
      id: String(m.id),
      slug: m.slug,
      name: m.name,
    }))
}

// Returns null (rather than an empty-but-present object) when there's no
// role set, so the Dashboard can decide to hide the whole card — matches
// the collection field's own admin description.
export function adaptVolunteerShift(member: Member): VolunteerShiftData | null {
  const shift = member.volunteerShift
  if (!shift?.role) return null
  return {
    dayLabel: shift.dayLabel || 'Upcoming',
    role: shift.role,
    time: shift.time || '',
    location: shift.location || '',
  }
}

export function adaptRecentSermons(docs: Sermon[]): DashboardSermonItem[] {
  return docs.map((doc) => ({
    id: String(doc.id),
    slug: doc.slug,
    seriesLabel: doc.seriesLabel,
    title: doc.title,
    speakerName: doc.speakerName,
    date: doc.date,
    thumbnail: mediaUrl(doc.thumbnail, '/images/sermon-prodigal.jpg'),
  }))
}

// Depth needs to be sufficient for `event` to come back as the populated
// Event document, not a bare ID — the page fetching this must query with
// depth >= 1 (Payload's default) for `event` below to actually be an
// object.
export function adaptRegisteredEvents(registrations: EventRegistration[]): RegisteredEventItem[] {
  return registrations
    .filter((r): r is EventRegistration & { event: NonNullable<Extract<EventRegistration['event'], object>> } =>
      typeof r.event === 'object' && r.event !== null
    )
    .map((r) => ({
      registrationId: String(r.id),
      eventId: String(r.event.id),
      slug: r.event.slug,
      title: r.event.title,
      startDate: r.event.startDate,
      time: r.event.time,
      location: r.event.location,
    }))
}

export function adaptRotaAssignments(entries: WorshipRota[]): RotaAssignmentItem[] {
  return entries.map((entry) => ({
    id: String(entry.id),
    date: entry.date,
    ministry: entry.ministry,
    serviceTime: entry.serviceTime,
    teamName: entry.worshipTeam.teamName,
  }))
}

// Only pending/declined — an approved request is no longer "pending"
// anything, it's a real membership shown by adaptGroups/adaptMinistries
// instead. Filtering here rather than at the query level keeps the one
// query (all of this member's requests) reusable for both this card and
// the join-status lookup on the listing pages.
export function adaptPendingRequests(requests: JoinRequest[]): PendingRequestItem[] {
  return requests
    .filter((r) => r.status === 'pending' || r.status === 'declined')
    .filter((r): r is typeof r & { target: { value: object } } => typeof r.target.value === 'object' && r.target.value !== null)
    .map((r) => ({
      id: String(r.id),
      targetType: r.target.relationTo,
      targetName: r.target.relationTo === 'groups' ? (r.target.value as { title: string }).title : (r.target.value as { name: string }).name,
      status: r.status as 'pending' | 'declined',
    }))
}
