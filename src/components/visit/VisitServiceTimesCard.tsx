import { useTranslations } from 'next-intl'
import type { VisitServiceTime } from '@/types/visit'

export function VisitServiceTimesCard({ times }: { times: VisitServiceTime[] }) {
  const t = useTranslations('visit')
  return (
    <div className="rounded-card bg-brand-navy p-6">
      <h2 className="text-lg font-semibold text-white">{t('serviceTimes')}</h2>
      <ul className="mt-3 divide-y divide-white/10">
        {times.map((row) => (
          <li key={row.id} className="flex items-center justify-between py-3 text-sm">
            <span className="text-white/85">{row.label}</span>
            <span className="font-semibold text-white">{row.time}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
