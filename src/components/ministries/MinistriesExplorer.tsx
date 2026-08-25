'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MinistryCard } from '@/components/ministries/MinistryCard'
import type { MinistryItem, MinistryCategory } from '@/types/ministries'
import type { Member } from '@/payload-types'
import type { JoinStatus } from '@/types/join-requests'
import { getJoinStatus } from '@/lib/join-requests-adapter'

type FilterValue = 'all' | MinistryCategory

// This is a client component (needs useState for the active filter) rendered
// inside the otherwise-static Server Component page below. Keeping the
// interactive slice this small — rather than making the whole page a client
// component — is deliberate: everything else on /ministries stays server-rendered.
export function MinistriesExplorer({
  ministries,
  member,
  requestStatusMap,
}: {
  ministries: MinistryItem[]
  member: Member | null
  requestStatusMap: Record<string, JoinStatus>
}) {
  const [active, setActive] = useState<FilterValue>('all')
  const t = useTranslations('ministries')

  const filters: { value: FilterValue; label: string }[] = [
    { value: 'all', label: t('filters.all') },
    { value: 'adults', label: t('filters.adults') },
    { value: 'kids-youth', label: t('filters.kidsYouth') },
    { value: 'service', label: t('filters.service') },
  ]

  const visible = active === 'all' ? ministries : ministries.filter((m) => m.categories.includes(active))

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="flex justify-center gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setActive(filter.value)}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active === filter.value
                ? 'bg-brand-navy text-white'
                : 'bg-surface-cream text-ink-muted hover:bg-blue-50'
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
        {visible.map((ministry) => (
          <MinistryCard
            key={ministry.id}
            ministry={ministry}
            member={member}
            joinStatus={getJoinStatus('ministries', ministry.id, member, requestStatusMap)}
          />
        ))}
      </div>

      {visible.length === 0 && (
        <p className="mt-10 text-center text-sm text-ink-muted">
          {ministries.length === 0 ? t('noMinistriesAtAll') : t('emptyState')}
        </p>
      )}
    </section>
  )
}
