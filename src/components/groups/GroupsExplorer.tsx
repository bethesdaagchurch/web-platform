'use client'

import { useMemo, useState, Fragment } from 'react'
import { useTranslations } from 'next-intl'
import { X } from 'lucide-react'
import { GroupsHero } from '@/components/groups/GroupsHero'
import { GroupsSidebar } from '@/components/groups/GroupsSidebar'
import { GroupCard } from '@/components/groups/GroupCard'
import { GroupsQuote } from '@/components/groups/GroupsQuote'
import type { GroupsHeroData, GroupCategoryOption, GroupCategoryValue, GroupListing, GroupsQuoteData } from '@/types/groups'
import type { Member } from '@/payload-types'
import type { JoinStatus } from '@/types/join-requests'
import { getJoinStatus } from '@/lib/join-requests-adapter'

const PAGE_SIZE = 4

export function GroupsExplorer({
  heroData,
  categories,
  groups,
  quote,
  member,
  requestStatusMap,
}: {
  heroData: GroupsHeroData
  categories: GroupCategoryOption[]
  groups: GroupListing[]
  quote: GroupsQuoteData
  member: Member | null
  requestStatusMap: Record<string, JoinStatus>
}) {
  const t = useTranslations('groups')
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<GroupCategoryValue | 'all'>('all')
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE)

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return groups.filter((g) => {
      const matchesCategory = category === 'all' || g.category === category
      const matchesSearch =
        q === '' || g.title.toLowerCase().includes(q) || g.location.toLowerCase().includes(q) || g.leaderName.toLowerCase().includes(q)
      return matchesCategory && matchesSearch
    })
  }, [groups, search, category])

  const visible = filtered.slice(0, visibleCount)
  const categoryLabel = categories.find((c) => c.value === category)?.label

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      <div className="grid gap-6 md:grid-cols-[260px_1fr]">
        {/* order-2/order-1 below: the sidebar is a desktop-left-column
            element by design, but with no reordering it would be the
            first thing a mobile visitor sees — filter buttons above the
            page's own hero and title. Shown after the main content on
            mobile instead, while staying visually first (left) on
            desktop exactly as designed. */}
        <div className="order-2 md:order-1">
          <GroupsSidebar categories={categories} active={category} onSelect={setCategory} />
        </div>

        <div className="order-1 md:order-2">
          <GroupsHero data={heroData} searchValue={search} onSearchChange={setSearch} />

          {(category !== 'all' || search.trim() !== '') && (
            <div className="mt-4 flex flex-wrap items-center gap-2 text-sm">
              <span className="text-ink-muted">{t('activeFilters')}</span>
              {category !== 'all' && (
                <button
                  onClick={() => setCategory('all')}
                  className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-brand-navy"
                >
                  {categoryLabel} <X size={12} />
                </button>
              )}
              {search.trim() !== '' && (
                <button onClick={() => setSearch('')} className="flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-brand-navy">
                  &ldquo;{search}&rdquo; <X size={12} />
                </button>
              )}
              <button
                onClick={() => {
                  setCategory('all')
                  setSearch('')
                }}
                className="font-medium text-brand-navy hover:underline"
              >
                {t('clearAll')}
              </button>
            </div>
          )}

          <div className="mt-6 grid gap-6 sm:grid-cols-2">
            {visible.length === 0 ? (
              <p className="rounded-card bg-surface-cream p-6 text-center text-sm text-ink-muted sm:col-span-2">
                {t('noResults')}
              </p>
            ) : (
              visible.map((group, i) => (
                <Fragment key={group.id}>
                  <GroupCard group={group} member={member} joinStatus={getJoinStatus('groups', group.id, member, requestStatusMap)} />
                  {/* Quote inserted after the 2nd visible card, matching the
                      design — falls back to showing it after the full list
                      when there are too few results for a mid-list break. */}
                  {i === 1 && visible.length > 2 && (
                    <div className="sm:col-span-2">
                      <GroupsQuote data={quote} />
                    </div>
                  )}
                </Fragment>
              ))
            )}
          </div>

          {visible.length <= 2 && visible.length > 0 && (
            <div className="mt-6">
              <GroupsQuote data={quote} />
            </div>
          )}

          {visibleCount < filtered.length && (
            <div className="mt-8 text-center">
              <button
                onClick={() => setVisibleCount((c) => c + PAGE_SIZE)}
                className="rounded-full border border-black/10 px-6 py-2.5 text-sm font-medium text-ink hover:bg-surface-cream"
              >
                {t('loadMore')}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
