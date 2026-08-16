import { useTranslations } from 'next-intl'
import { Sparkles, Clock, PhoneCall, CheckCircle2 } from 'lucide-react'
import type { LeadershipInterestItem } from '@/types/dashboard'

const statusConfig = {
  new: { icon: Clock, colorClass: 'bg-brand-gold-light text-brand-navy-dark' },
  contacted: { icon: PhoneCall, colorClass: 'bg-blue-100 text-brand-navy' },
  placed: { icon: CheckCircle2, colorClass: 'bg-green-100 text-green-700' },
} as const

export function MyLeadershipInterestCard({ interests }: { interests: LeadershipInterestItem[] }) {
  const t = useTranslations('dashboard')

  if (interests.length === 0) return null

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <Sparkles size={18} className="text-brand-navy" /> {t('myLeadershipInterest')}
      </h2>

      <ul className="mt-3 divide-y divide-black/5">
        {interests.map((interest) => {
          const config = statusConfig[interest.status]
          const StatusIcon = config.icon
          return (
            <li key={interest.id} className="flex items-center gap-3 py-3">
              <p className="flex-1 text-sm font-medium text-ink">{interest.areaOfInterest}</p>
              <span className={`flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold ${config.colorClass}`}>
                <StatusIcon size={12} /> {t(`leadershipStatus.${interest.status}`)}
              </span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
