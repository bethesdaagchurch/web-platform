'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { getMonthGrid, isSameDate, isWithinRange } from '@/lib/calendar'
import type { EventEntry } from '@/types/events'

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

type MarkerType = 'primary' | 'multiday' | 'sunday'

export function EventsCalendar({ events }: { events: EventEntry[] }) {
  const t = useTranslations('events.calendar')
  const today = useMemo(() => new Date(), [])
  const [cursor, setCursor] = useState(new Date(today.getFullYear(), today.getMonth(), 1))

  const weeks = useMemo(() => getMonthGrid(cursor.getFullYear(), cursor.getMonth()), [cursor])

  function markerFor(date: Date): MarkerType | null {
    // Sundays are detected from the actual calendar, not hardcoded — this
    // will be correct for any month the user navigates to.
    if (date.getDay() === 0) return 'sunday'

    for (const event of events) {
      const start = new Date(event.startDate)
      if (event.endDate) {
        const end = new Date(event.endDate)
        if (isWithinRange(date, start, end)) return 'multiday'
      } else if (isSameDate(date, start)) {
        return 'primary'
      }
    }
    return null
  }

  const markerDot: Record<Exclude<MarkerType, 'sunday'>, string> = {
    primary: 'bg-brand-navy text-white',
    multiday: 'bg-brand-gold text-brand-navy-dark',
  }

  return (
    <div className="rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-brand-navy-dark">
          {cursor.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <div className="flex gap-1">
          <button
            aria-label={t('previousMonth')}
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() - 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-cream"
          >
            <ChevronLeft size={14} />
          </button>
          <button
            aria-label={t('nextMonth')}
            onClick={() => setCursor(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1))}
            className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-surface-cream"
          >
            <ChevronRight size={14} />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-y-1 text-center text-xs">
        {WEEKDAY_LABELS.map((label, i) => (
          <span key={i} className="font-medium text-ink-muted">
            {label}
          </span>
        ))}

        {weeks.flat().map((cell, i) => {
          if (!cell.date) return <span key={i} />

          const marker = markerFor(cell.date)
          const isToday = isSameDate(cell.date, today)

          let classes = 'text-ink'
          if (marker === 'primary' || marker === 'multiday') {
            classes = `mx-auto flex h-7 w-7 items-center justify-center rounded-full font-medium ${markerDot[marker]}`
          } else if (marker === 'sunday') {
            classes = 'mx-auto flex h-7 w-7 items-center justify-center rounded-full text-red-500 ring-1 ring-red-300'
          } else if (isToday) {
            classes = 'mx-auto flex h-7 w-7 items-center justify-center rounded-full ring-1 ring-brand-navy text-brand-navy font-medium'
          } else {
            classes = 'flex h-7 w-7 items-center justify-center text-ink'
          }

          return (
            <span key={i} className="py-0.5">
              <span className={classes}>{cell.date.getDate()}</span>
            </span>
          )
        })}
      </div>

      <ul className="mt-4 space-y-1.5 text-xs text-ink-muted">
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-navy" /> {t('primaryEvent')}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-brand-gold" /> {t('multiDayEvent')}
        </li>
        <li className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full ring-1 ring-red-300" /> {t('sundayService')}
        </li>
      </ul>
    </div>
  )
}
