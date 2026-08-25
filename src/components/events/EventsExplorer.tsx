'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { EventCard } from '@/components/events/EventCard'
import { EventsCalendar } from '@/components/events/EventsCalendar'
import type { EventEntry, FilterOption } from '@/types/events'

const PAGE_SIZE = 2

export function EventsExplorer({
  events,
  categories,
  registeredEventIds,
}: {
  events: EventEntry[]
  categories: FilterOption[]
  registeredEventIds: string[]
}) {
  const t = useTranslations('events')
  const [activeCategory, setActiveCategory] = useState('all')
  const [query, setQuery] = useState('')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return events
      .filter((e) => activeCategory === 'all' || e.category === activeCategory)
      .filter((e) => q === '' || e.title.toLowerCase().includes(q) || e.description.toLowerCase().includes(q))
      .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
  }, [events, activeCategory, query])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  function handleCategoryChange(value: string) {
    setActiveCategory(value)
    setVisibleCount(PAGE_SIZE)
  }

  return (
    <section className="mx-auto max-w-content px-6 py-12">
      {/* Filter + search spans the full section width, above both the event
          list and the calendar — the calendar itself is never filtered, it
          always reflects the complete event set. */}
      <div className="flex flex-col gap-3 rounded-card bg-surface-cream p-4 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                activeCategory === cat.value
                  ? 'bg-brand-navy text-white'
                  : 'bg-white text-ink-muted hover:bg-blue-50'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative md:w-64">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setVisibleCount(PAGE_SIZE)
            }}
            placeholder={t('searchPlaceholder')}
            className="w-full rounded-md border border-black/10 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-[1.7fr_1fr] md:items-start">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('upcomingEvents')}</h2>

          {visible.length > 0 ? (
            <div className="mt-5 space-y-4">
              {visible.map((event) => (
                <EventCard key={event.id} event={event} isRegistered={registeredEventIds.includes(event.id)} />
              ))}
            </div>
          ) : (
            <p className="mt-10 text-center text-sm text-ink-muted">
              {events.length === 0 ? t('noEventsAtAll') : t('noResults')}
            </p>
          )}

          {hasMore && (
            <button
              onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
              className="mt-6 w-full rounded-md border border-black/15 py-3 text-sm font-medium text-brand-navy hover:bg-surface-cream"
            >
              {t('loadMore')}
            </button>
          )}
        </div>

        <EventsCalendar events={events} />
      </div>
    </section>
  )
}
