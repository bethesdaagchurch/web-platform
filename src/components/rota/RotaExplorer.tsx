'use client'

import { useMemo, useState } from 'react'
import NextLink from 'next/link'
import { useTranslations } from 'next-intl'
import { Pencil } from 'lucide-react'
import { RotaEntryCard } from '@/components/rota/RotaEntryCard'
// WorshipGuidelinesCard commented out below — its only purpose is linking
// to /resources, which has no design yet. Import stays so re-enabling is a
// two-line uncomment once that design exists.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { WorshipGuidelinesCard } from '@/components/rota/WorshipGuidelinesCard'
import type { RotaEntry, RotaFilterOption, WorshipGuidelinesData } from '@/types/rota'

export function RotaExplorer({
  entries,
  monthOptions,
  ministryOptions,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- kept in the type/props so restoring WorshipGuidelinesCard above is a two-line change, not a re-threading of props from the page.
  guidelines,
  isAdmin,
}: {
  entries: RotaEntry[]
  monthOptions: RotaFilterOption[]
  ministryOptions: RotaFilterOption[]
  guidelines: WorshipGuidelinesData
  isAdmin: boolean
}) {
  const t = useTranslations('rota')
  const [month, setMonth] = useState(monthOptions[0]?.value ?? '')
  const [ministry, setMinistry] = useState('all')

  const filtered = useMemo(() => {
    return entries
      .filter((entry) => {
        const d = new Date(entry.date)
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
        const matchesMonth = key === month
        const matchesMinistry = ministry === 'all' || entry.ministry === ministry
        return matchesMonth && matchesMinistry
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
  }, [entries, month, ministry])

  const monthLabel = monthOptions.find((o) => o.value === month)?.label ?? ''

  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      {/* Filters sidebar */}
      <div className="space-y-6">
        <div className="rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5">
          <h2 className="text-lg font-semibold text-ink">{t('filters')}</h2>

          <div className="mt-4">
            <label htmlFor="rota-month" className="text-sm font-medium text-ink">
              {t('month')}
            </label>
            <select
              id="rota-month"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2 text-sm outline-none focus:border-brand-navy"
            >
              {monthOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <label htmlFor="rota-ministry" className="text-sm font-medium text-ink">
              {t('ministry')}
            </label>
            <select
              id="rota-ministry"
              value={ministry}
              onChange={(e) => setMinistry(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2 text-sm outline-none focus:border-brand-navy"
            >
              {ministryOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* WorshipGuidelinesCard commented out — links to /resources,
            which has no design yet. Restore this line (and the guidelines
            prop above) once that design exists. */}
        {/* <WorshipGuidelinesCard data={guidelines} /> */}
      </div>

      {/* Rota list */}
      <div>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{t('ministrySchedule')}</p>
            <h1 className="text-3xl font-semibold text-brand-navy md:text-4xl">
              {t('worshipRota')}{monthLabel ? ` \u2013 ${monthLabel}` : ''}
            </h1>
          </div>
          {/* Admin-only: links straight to the Payload admin panel rather
              than a custom in-app editor. Members never see this button at
              all — not disabled, not hidden-but-inspectable, just absent
              from the render entirely, since they can't log into /admin
              anyway (Members and Users are separate auth collections) and
              showing an action they can't complete would just be
              confusing. Uses plain next/link, not next-intl's locale-aware
              Link: /admin is deliberately excluded from locale routing
              entirely (see middleware.ts), so prefixing it with a locale
              would break it. */}
          {isAdmin && (
            <NextLink
              href="/admin/collections/worship-rota"
              className="inline-flex items-center gap-1.5 rounded-md border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-cream"
            >
              <Pencil size={14} /> {t('editRota')}
            </NextLink>
          )}
        </div>

        <div className="mt-6 space-y-4">
          {filtered.length === 0 ? (
            <p className="rounded-card bg-surface-cream p-6 text-center text-sm text-ink-muted">
              {t('noEntries')}
            </p>
          ) : (
            filtered.map((entry) => <RotaEntryCard key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </div>
  )
}
