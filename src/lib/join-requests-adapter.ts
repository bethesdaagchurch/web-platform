import type { Member, JoinRequest } from '@/payload-types'
import type { JoinStatus, JoinTargetType } from '@/types/join-requests'

function key(type: JoinTargetType, id: number | string): string {
  return `${type}-${id}`
}

// A plain Record rather than a Map — this crosses the Server-to-Client
// component boundary as a prop (e.g. into GroupsExplorer), and React
// Server Components can only serialize plain, JSON-shaped data across
// that boundary, not Map instances.
export function buildRequestStatusMap(requests: JoinRequest[]): Record<string, JoinStatus> {
  const map: Record<string, JoinStatus> = {}
  // One request per member is expected, but a member could in principle
  // have multiple historical requests for the same target (e.g. declined,
  // then requested again) — process oldest-first so the most recent one
  // (whose status actually matters right now) wins.
  const sorted = [...requests].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
  for (const req of sorted) {
    const targetId = typeof req.target.value === 'object' ? req.target.value.id : req.target.value
    map[key(req.target.relationTo, targetId)] = (req.status ?? 'pending') as JoinStatus
  }
  return map
}

export function getJoinStatus(
  type: JoinTargetType,
  targetId: number | string,
  member: Member | null,
  requestStatusMap: Record<string, JoinStatus>
): JoinStatus {
  if (!member) return 'none'

  // myGroups is a `join` field, so it comes back as {docs, hasNextPage,
  // totalDocs} rather than a plain array — myMinistries is a regular
  // relationship field and stays a plain array. Normalized to a plain
  // array here so both branches compare the same shape below.
  const approvedList = type === 'groups' ? (member.myGroups?.docs ?? []) : (member.myMinistries ?? [])
  const isApproved = approvedList.some((item) => (typeof item === 'object' ? item.id : item) === Number(targetId))
  if (isApproved) return 'approved'

  return requestStatusMap[key(type, targetId)] ?? 'none'
}
