import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Clock, MapPin, CalendarCheck, CheckCircle2 } from 'lucide-react'
import type { EventEntry, EventBadgeStyle } from '@/types/events'

const badgeClasses: Record<EventBadgeStyle, string> = {
  gold: 'bg-brand-gold-light text-brand-navy-dark',
  dark: 'bg-ink text-white',
  navy: 'bg-brand-navy text-white',
  blue: 'bg-blue-100 text-brand-navy',
}

const dateBarClasses: Record<EventBadgeStyle, string> = {
  gold: 'bg-brand-gold',
  dark: 'bg-ink',
  navy: 'bg-brand-navy',
  blue: 'bg-blue-400',
}

function formatDateParts(iso: string) {
  const d = new Date(iso)
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }).toUpperCase(),
    day: d.getDate(),
  }
}

export function EventCard({ event, isRegistered }: { event: EventEntry; isRegistered: boolean }) {
  const t = useTranslations('events.registration')
  const { month, day } = formatDateParts(event.startDate)

  return (
    <article className="flex gap-4 rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="w-16 shrink-0 overflow-hidden rounded-md ring-1 ring-black/5">
        <div className={`h-1.5 ${dateBarClasses[event.badgeStyle]}`} />
        <div className="flex flex-col items-center bg-surface-cream py-3">
          <span className="text-xs font-semibold text-brand-navy">{month}</span>
          <span className="text-xl font-bold text-ink">{day}</span>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between gap-3">
          <Link href={`/events/${event.slug}`}>
            <h3 className="text-lg font-semibold text-ink hover:text-brand-navy">{event.title}</h3>
          </Link>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClasses[event.badgeStyle]}`}>
            {event.categoryLabel}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-ink-muted">
          <span className="flex items-center gap-1">
            <Clock size={12} /> {event.time}
          </span>
          <span className="flex items-center gap-1">
            <MapPin size={12} /> {event.location}
          </span>
        </div>

        <p className="mt-3 text-sm text-ink-muted">{event.description}</p>

        <div className="mt-4 flex gap-2">
          {event.requiresRegistration ? (
            isRegistered ? (
              <div className="flex items-center gap-1.5 rounded-md bg-surface-cream px-4 py-2 text-sm font-medium text-brand-navy">
                <CheckCircle2 size={14} /> {t('alreadyRegistered')}
              </div>
            ) : (
              <Link
                href={`/events/${event.slug}`}
                className="flex items-center gap-1.5 rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark"
              >
                <CalendarCheck size={14} /> {t('registerButton')}
              </Link>
            )
          ) : (
            event.actions.map((action) => (
              <Link
                key={action.label}
                href={action.href}
                className={
                  action.variant === 'solid'
                    ? 'rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark'
                    : 'rounded-md border border-black/15 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-cream'
                }
              >
                {action.label}
              </Link>
            ))
          )}
        </div>
      </div>
    </article>
  )
}
