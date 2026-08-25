import { useTranslations } from 'next-intl'
import { CalendarClock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { RotaAssignmentItem } from '@/types/dashboard'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })
}

export function MyRotaCard({ assignments }: { assignments: RotaAssignmentItem[] }) {
  const t = useTranslations('dashboard')

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <CalendarClock size={18} className="text-brand-navy" /> {t('myServingSchedule')}
        </h2>
        <Link href="/ministries/rota" className="text-sm font-medium text-brand-navy hover:underline">
          {t('viewAll')}
        </Link>
      </div>

      {assignments.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{t('notScheduledYet')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {assignments.map((entry) => (
            <li key={entry.id} className="rounded-md border border-black/5 p-3">
              <p className="text-sm font-semibold text-ink">{formatDate(entry.date)}</p>
              <p className="text-xs text-ink-muted">
                {entry.ministry} &middot; {entry.serviceTime} &middot; {entry.teamName}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
