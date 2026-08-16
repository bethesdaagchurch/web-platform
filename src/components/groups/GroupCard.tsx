import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Calendar, MapPin, User, Users } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'
import { JoinRequestButton } from '@/components/shared/JoinRequestButton'
import type { GroupListing } from '@/types/groups'
import type { Member } from '@/payload-types'
import type { JoinStatus } from '@/types/join-requests'

function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export function GroupCard({ group, member, joinStatus }: { group: GroupListing; member: Member | null; joinStatus: JoinStatus }) {
  const t = useTranslations('membersOnlyGate')
  const tGroups = useTranslations('groupMembers')

  // Gated per-card, not just per-page — a member could be in one of
  // several groups shown on this same listing, and should only see the
  // roster for the ones they're actually part of, never the others.
  const isMemberOfThisGroup = member ? group.members.some((m) => m.id === String(member.id)) : false

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-start justify-between gap-3">
        <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy">
          {group.badgeLabel}
        </span>
        {group.leaderPhoto ? (
          <Image src={group.leaderPhoto} alt="" width={36} height={36} className="h-9 w-9 rounded-full object-cover" />
        ) : (
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-cream text-xs font-semibold text-ink-muted">
            {group.leaderName
              .split(/[\s&]+/)
              .slice(0, 2)
              .map((w) => w[0]?.toUpperCase())
              .join('')}
          </span>
        )}
      </div>

      <Link href={`/groups/${group.slug}`}>
        <h3 className="mt-3 text-lg font-semibold text-ink hover:text-brand-navy">{group.title}</h3>
      </Link>
      <p className="mt-1.5 text-sm text-ink-muted">{group.description}</p>

      <div className="mt-4 space-y-1.5 border-t border-black/5 pt-4 text-sm text-ink-muted">
        <p className="flex items-center gap-2">
          <Calendar size={14} /> {group.schedule}
        </p>
        <p className="flex items-center gap-2">
          <MapPin size={14} /> {group.location}
        </p>
        <p className="flex items-center gap-2">
          <User size={14} /> Led by {group.leaderName}
        </p>
      </div>

      {isMemberOfThisGroup && group.members.length > 0 && (
        <div className="mt-4 border-t border-black/5 pt-4">
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-ink-muted">
            <Users size={13} /> {tGroups('heading')}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {group.members.map((m) => (
              <li
                key={m.id}
                className="flex items-center gap-1.5 rounded-full bg-surface-cream px-2.5 py-1 text-xs font-medium text-ink"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-gold-light text-[10px] font-semibold text-brand-navy-dark">
                  {initialsFrom(m.name)}
                </span>
                {m.name}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="mt-4">
        <MembersOnlyGate member={member} prompt={t('joinGroupPrompt')}>
          <JoinRequestButton targetType="groups" targetId={group.id} initialStatus={joinStatus} />
        </MembersOnlyGate>
      </div>
    </div>
  )
}
