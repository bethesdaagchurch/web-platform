import { useTranslations } from 'next-intl'
import { Church, Users, Globe, Smile, HeartHandshake } from 'lucide-react'
import type { GroupCategoryOption, GroupCategoryValue } from '@/types/groups'

const iconMap = { worship: Church, youth: Users, 'care-groups': Globe, kids: Smile, care: HeartHandshake }

export function GroupsSidebar({
  categories,
  active,
  onSelect,
}: {
  categories: GroupCategoryOption[]
  active: GroupCategoryValue | 'all'
  onSelect: (value: GroupCategoryValue | 'all') => void
}) {
  const t = useTranslations('groups')
  return (
    <div className="rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-semibold text-ink">{t('sidebarHeading')}</h2>
      <p className="text-sm text-ink-muted">{t('sidebarSubtext')}</p>

      <div className="mt-4 space-y-1">
        {categories.map((cat) => {
          const Icon = iconMap[cat.value]
          const isActive = active === cat.value
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => onSelect(isActive ? 'all' : cat.value)}
              className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                isActive ? 'bg-brand-gold text-brand-navy-dark' : 'text-ink hover:bg-surface-cream'
              }`}
            >
              <Icon size={16} /> {cat.label}
            </button>
          )
        })}
      </div>
    </div>
  )
}
