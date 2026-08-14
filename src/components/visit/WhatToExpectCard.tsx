import { useTranslations } from 'next-intl'
import { Car, Smile, Coffee } from 'lucide-react'
import type { ExpectationItem } from '@/types/visit'

const iconMap = { parking: Car, kids: Smile, coffee: Coffee } as const

export function WhatToExpectCard({ items }: { items: ExpectationItem[] }) {
  const t = useTranslations('visit')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-semibold text-brand-navy-dark">{t('whatToExpect')}</h2>
      <div className="mt-4 space-y-5">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={item.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-light">
                <Icon size={16} className="text-brand-navy-dark" />
              </span>
              <div>
                <p className="text-sm font-semibold text-ink">{item.title}</p>
                <p className="mt-0.5 text-sm text-ink-muted">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
