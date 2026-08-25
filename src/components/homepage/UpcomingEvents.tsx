import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Clock } from 'lucide-react'
import type { EventItem } from '@/types/homepage'

export async function UpcomingEvents({ events }: { events: EventItem[] }) {
  const t = await getTranslations('homepage.upcomingEvents')
  // No real events at all — skip the section entirely rather than show a
  // heading over an empty grid.
  if (events.length === 0) return null

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <h2 className="text-center text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>

      <div className="mt-8 grid gap-6 md:grid-cols-3">
        {events.map((event) => (
          <article key={event.id} className="overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5">
            <div className="relative h-48">
              <Image src={event.image} alt={event.title} fill className="object-cover" />
              <div className="absolute left-3 top-3 rounded-md bg-white px-2 py-1 text-center leading-none shadow">
                <p className="text-xs font-semibold text-brand-navy">{event.month}</p>
                <p className="text-sm font-bold text-brand-navy-dark">{event.day}</p>
              </div>
            </div>
            <div className="p-4">
              <h3 className="text-base font-semibold text-ink">{event.title}</h3>
              <p className="mt-1 flex items-center gap-1 text-xs text-ink-muted">
                <Clock size={12} /> {event.timeRange}
              </p>
              <Link
                href={`/events/${event.slug}`}
                className="mt-3 inline-block text-sm font-medium text-brand-navy hover:underline"
              >
                {t('details')} &rsaquo;
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
