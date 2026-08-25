'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CalendarCheck, X } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { RegisteredEventItem } from '@/types/dashboard'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export function MyEventsCard({ events: initialEvents }: { events: RegisteredEventItem[] }) {
  const t = useTranslations('dashboard')
  const tReg = useTranslations('events.registration')
  const [events, setEvents] = useState(initialEvents)
  const [cancellingId, setCancellingId] = useState<string | null>(null)

  async function handleCancel(registrationId: string) {
    setCancellingId(registrationId)
    try {
      const res = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }),
      })
      if (res.ok) {
        setEvents((prev) => prev.filter((e) => e.registrationId !== registrationId))
      }
    } finally {
      setCancellingId(null)
    }
  }

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex flex-wrap items-center justify-between gap-x-3 gap-y-1">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <CalendarCheck size={18} className="text-brand-navy" /> {t('myEvents')}
        </h2>
        <Link href="/events" className="text-sm font-medium text-brand-navy hover:underline">
          {t('browseEvents')}
        </Link>
      </div>

      {events.length === 0 ? (
        <p className="mt-4 text-sm text-ink-muted">{t('notRegisteredAnyEvents')}</p>
      ) : (
        <ul className="mt-4 space-y-3">
          {events.map((event) => (
            <li
              key={event.registrationId}
              className="flex items-center justify-between gap-3 rounded-md border border-black/5 p-3"
            >
              <div>
                <Link href={`/events/${event.slug}`} className="text-sm font-semibold text-ink hover:text-brand-navy">
                  {event.title}
                </Link>
                <p className="text-xs text-ink-muted">
                  {formatDate(event.startDate)} &middot; {event.time} &middot; {event.location}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleCancel(event.registrationId)}
                disabled={cancellingId === event.registrationId}
                className="flex shrink-0 items-center gap-1 rounded-md border border-black/10 px-3 py-1.5 text-xs font-medium text-ink-muted hover:bg-surface-cream disabled:opacity-60"
              >
                <X size={12} /> {cancellingId === event.registrationId ? tReg('cancelling') : tReg('cancel')}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
