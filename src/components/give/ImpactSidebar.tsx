import { Globe, UtensilsCrossed, GraduationCap } from 'lucide-react'
import type { ImpactData } from '@/types/give'

const iconMap = {
  globe: Globe,
  food: UtensilsCrossed,
  grad: GraduationCap,
} as const

export function ImpactSidebar({ data }: { data: ImpactData }) {
  return (
    <div className="rounded-card bg-brand-navy p-8">
      <h2 className="text-2xl font-semibold text-white">{data.heading}</h2>
      <p className="mt-3 text-sm text-white/80">{data.description}</p>

      <div className="mt-6 space-y-5">
        {data.items.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <div key={item.id} className="flex gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-white/15">
                <Icon size={16} className="text-white" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-0.5 text-sm text-white/75">{item.description}</p>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
