import { useTranslations } from 'next-intl'
import { HeartHandshake, ChevronRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { MinistryDashboardItem } from '@/types/dashboard'

function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

const badgeColors = ['bg-brand-gold-light text-brand-navy-dark', 'bg-blue-100 text-brand-navy']

export function MyMinistriesCard({ ministries }: { ministries: MinistryDashboardItem[] }) {
  const t = useTranslations('dashboard')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <HeartHandshake size={18} className="text-brand-navy" /> {t('myMinistries')}
        </h2>
        <Link href="/ministries" className="text-sm font-medium text-brand-navy hover:underline">
          {t('viewAll')}
        </Link>
      </div>

      {ministries.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{t('notInMinistry')}</p>
      ) : (
        <ul className="mt-3 divide-y divide-black/5">
          {ministries.map((ministry, i) => (
            <li key={ministry.id} className="flex items-center gap-3 py-3">
              <span
                className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${badgeColors[i % badgeColors.length]}`}
              >
                {initialsFrom(ministry.name)}
              </span>
              <p className="flex-1 text-sm font-semibold text-ink">{ministry.name}</p>
              <ChevronRight size={16} className="text-ink-muted" />
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
