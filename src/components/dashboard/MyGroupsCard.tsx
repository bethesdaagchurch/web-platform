import { useTranslations } from 'next-intl'
import { Users, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { GroupItem } from '@/types/dashboard'

function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const badgeColors = ['bg-blue-100 text-brand-navy', 'bg-brand-gold-light text-brand-navy-dark']

export function MyGroupsCard({ groups }: { groups: GroupItem[] }) {
  const t = useTranslations('dashboard')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Users size={18} className="text-brand-navy" /> {t('myGroups')}
        </h2>
        <Link href="/groups" className="text-sm font-medium text-brand-navy hover:underline">
          {t('viewAll')}
        </Link>
      </div>

      {groups.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">
          {t('notInGroup')}{' '}
          <Link href="/ministries#small-groups" className="font-medium text-brand-navy hover:underline">
            {t('findOne')}
          </Link>
          .
        </p>
      ) : (
        <ul className="mt-3 divide-y divide-black/5">
          {groups.map((group, i) => (
            <li key={group.id} className="flex items-center gap-3 py-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${badgeColors[i % badgeColors.length]}`}>
                {initialsFrom(group.name)}
              </span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{group.name}</p>
                <p className="text-xs text-ink-muted">
                  {group.schedule} &middot; {group.location}
                </p>
              </div>
              <ChevronRight size={16} className="text-ink-muted" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
