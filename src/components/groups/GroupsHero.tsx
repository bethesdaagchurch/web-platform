import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Search, SlidersHorizontal } from 'lucide-react'
import type { GroupsHeroData } from '@/types/groups'

export function GroupsHero({
  data,
  searchValue,
  onSearchChange,
}: {
  data: GroupsHeroData
  searchValue: string
  onSearchChange: (value: string) => void
}) {
  const t = useTranslations('groups')
  return (
    <div className="relative overflow-hidden rounded-card">
      <Image src={data.backgroundImage} alt="" fill className="object-cover opacity-15" />
      <div className="relative z-10 px-8 py-12">
        <h1 className="max-w-lg text-3xl font-semibold text-brand-navy md:text-4xl">{data.heading}</h1>
        <p className="mt-3 max-w-lg text-sm text-ink-muted">{data.subtext}</p>

        <div className="mt-6 flex gap-3">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
            <input
              type="text"
              value={searchValue}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder={data.searchPlaceholder}
              className="w-full rounded-md border border-black/10 bg-white py-3 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
            />
          </div>
          {/* Inert on purpose — no filter-panel design exists yet, so this
              button is visually present but doesn't open anything, rather
              than fabricate a UI nobody designed. */}
          <button
            type="button"
            className="flex shrink-0 items-center gap-1.5 rounded-md bg-brand-navy px-4 py-3 text-sm font-medium text-white"
          >
            <SlidersHorizontal size={14} /> {t('filtersButton')}
          </button>
        </div>
      </div>
    </div>
  )
}
