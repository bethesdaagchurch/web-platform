import { useTranslations } from 'next-intl'
import { Milestone } from 'lucide-react'
import type { DrivingDirectionSection } from '@/types/directions'

export function DrivingDirectionsBlock({ sections }: { sections: DrivingDirectionSection[] }) {
  const t = useTranslations('directions')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <Milestone size={18} className="text-brand-gold" />
        <h2 className="text-lg font-semibold text-brand-navy">{t('drivingDirections')}</h2>
      </div>

      <div className="mt-4 space-y-5">
        {sections.map((section) => (
          <div key={section.id}>
            <p className="text-xs font-semibold uppercase tracking-wide text-ink">{section.heading}</p>
            <p className="mt-1 text-sm text-ink-muted">{section.text}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
