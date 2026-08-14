import { Smartphone, Mail } from 'lucide-react'
import type { OtherWayToGive } from '@/types/give'

const iconMap = { text: Smartphone, mail: Mail } as const
const iconBg = { text: 'bg-brand-gold-light text-brand-navy-dark', mail: 'bg-blue-100 text-brand-navy' } as const

export function OtherWaysToGive({ ways }: { ways: OtherWayToGive[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {ways.map((way) => {
        const Icon = iconMap[way.icon]
        return (
          <div key={way.id} className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
            <span className={`flex h-10 w-10 items-center justify-center rounded-full ${iconBg[way.icon]}`}>
              <Icon size={16} />
            </span>
            <p className="mt-3 text-sm font-semibold text-ink">{way.title}</p>
            {way.lines.map((line) => (
              <p key={line} className="mt-1 text-sm text-ink-muted">
                {line}
              </p>
            ))}
          </div>
        )
      })}
    </div>
  )
}
