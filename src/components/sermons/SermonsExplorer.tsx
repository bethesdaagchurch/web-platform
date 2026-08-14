'use client'

import { useMemo, useState } from 'react'
import { useTranslations } from 'next-intl'
import { Search } from 'lucide-react'
import { SermonCard } from '@/components/sermons/SermonCard'
import type { SermonEntry, FilterOption } from '@/types/sermons'

const PAGE_SIZE = 3

export function SermonsExplorer({
  sermons,
  seriesOptions,
  speakerOptions,
  topicOptions,
}: {
  sermons: SermonEntry[]
  seriesOptions: FilterOption[]
  speakerOptions: FilterOption[]
  topicOptions: FilterOption[]
}) {
  const t = useTranslations('sermons')
  const [query, setQuery] = useState('')
  const [series, setSeries] = useState('all')
  const [speaker, setSpeaker] = useState('all')
  const [topic, setTopic] = useState('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return sermons.filter((sermon) => {
      const matchesQuery =
        q === '' ||
        sermon.title.toLowerCase().includes(q) ||
        sermon.speakerName.toLowerCase().includes(q) ||
        sermon.seriesLabel.toLowerCase().includes(q)
      const matchesSeries = series === 'all' || sermon.series === series
      const matchesSpeaker = speaker === 'all' || sermon.speaker === speaker
      const matchesTopic = topic === 'all' || sermon.topic === topic
      return matchesQuery && matchesSeries && matchesSpeaker && matchesTopic
    })
  }, [sermons, query, series, speaker, topic])

  const visible = filtered.slice(0, visibleCount)
  const hasMore = visibleCount < filtered.length

  // Any filter change resets pagination — otherwise a narrowed result set
  // could sit below a stale "Load More" state and look broken.
  function updateFilter(setter: (value: string) => void) {
    return (value: string) => {
      setter(value)
      setVisibleCount(PAGE_SIZE)
    }
  }

  return (
    <section className="mx-auto max-w-content px-6 py-12">
      <div className="flex flex-col gap-3 rounded-card bg-surface-cream p-4 md:flex-row">
        <div className="relative flex-1">
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

        <select
          value={series}
          onChange={(e) => updateFilter(setSeries)(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-navy"
        >
          {seriesOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={speaker}
          onChange={(e) => updateFilter(setSpeaker)(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-navy"
        >
          {speakerOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>

        <select
          value={topic}
          onChange={(e) => updateFilter(setTopic)(e.target.value)}
          className="rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm text-ink outline-none focus:border-brand-navy"
        >
          {topicOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {visible.length > 0 ? (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {visible.map((sermon) => (
            <SermonCard key={sermon.id} sermon={sermon} />
          ))}
        </div>
      ) : (
        <p className="mt-10 text-center text-sm text-ink-muted">{t('noResults')}</p>
      )}

      {hasMore && (
        <div className="mt-8 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
            className="rounded-full border border-black/15 px-6 py-2.5 text-sm font-medium text-ink hover:bg-surface-cream"
          >
            {t('loadMore')}
          </button>
        </div>
      )}
    </section>
  )
}
