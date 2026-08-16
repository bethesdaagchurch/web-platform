import { useTranslations } from 'next-intl'
import { ParkingCircle, Car, Accessibility, Bus } from 'lucide-react'
import type { ParkingItem } from '@/types/directions'

const iconMap = { car: Car, accessibility: Accessibility, bus: Bus } as const
const iconBg = {
  car: 'bg-blue-100 text-brand-navy',
  accessibility: 'bg-brand-gold-light text-brand-navy-dark',
  bus: 'bg-surface-cream text-ink',
} as const

export function ParkingAccessibilityBlock({ items }: { items: ParkingItem[] }) {
  const t = useTranslations('directions')
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <ParkingCircle size={18} className="text-brand-gold" />
        <h2 className="text-lg font-semibold text-brand-navy">{t('parkingAccessibility')}</h2>
      </div>

      <div className="mt-4 space-y-5">
        {items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={item.id} className="flex gap-3">
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${iconBg[item.icon]}`}>
                <Icon size={16} />
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
