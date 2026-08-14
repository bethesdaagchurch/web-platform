import { useTranslations } from 'next-intl'
import { Calendar, MapPin } from 'lucide-react'
import type { WeeklyServiceItem } from '@/types/schedule'

export function WeeklyServices({ services }: { services: WeeklyServiceItem[] }) {
  const t = useTranslations('schedule')
  return (
    <section className="mx-auto max-w-content px-6">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
        <Calendar size={20} className="text-brand-gold" /> {t('weeklyServices')}
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-3">
        {services.map((service) => (
          <div key={service.id} className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="flex items-start justify-between gap-2">
              <div>
                <h3 className="text-lg font-semibold text-brand-navy">{service.name}</h3>
                <p className="text-sm font-medium text-brand-gold">{service.time}</p>
              </div>
              <span className="shrink-0 rounded-full bg-brand-navy px-3 py-1 text-xs font-medium text-white">
                {service.badgeLabel}
              </span>
            </div>

            <p className="mt-4 text-sm font-semibold text-ink">{service.serviceTitle}</p>
            <p className="mt-1 text-sm text-ink-muted">{service.description}</p>

            <div className="mt-4 flex items-center gap-1.5 border-t border-black/5 pt-4 text-sm text-ink-muted">
              <MapPin size={14} /> {service.location}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
