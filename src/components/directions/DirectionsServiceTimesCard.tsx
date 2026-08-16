import { useTranslations } from 'next-intl'
import { Clock } from 'lucide-react'
import type { DirectionsServiceTime } from '@/types/directions'

export function DirectionsServiceTimesCard({ times }: { times: DirectionsServiceTime[] }) {
  const t = useTranslations('directions')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <Clock size={18} className="text-brand-gold" />
        <h2 className="text-lg font-semibold text-brand-navy">{t('serviceTimes')}</h2>
      </div>
      <ul className="mt-3 divide-y divide-black/5">
        {times.map((row) => (
          <li key={row.id} className="flex items-center justify-between py-3 text-sm">
            <span className="text-ink-muted">{row.label}</span>
            <span className="font-semibold text-ink">{row.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
