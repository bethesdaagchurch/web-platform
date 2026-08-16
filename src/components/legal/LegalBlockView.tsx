import { Handshake, Shield, TrendingUp, SlidersHorizontal, Info } from 'lucide-react'
import type { LegalBlock } from '@/types/legal'

const calloutIcons = { handshake: Handshake } as const
const itemIcons = { shield: Shield, analytics: TrendingUp, sliders: SlidersHorizontal } as const

export function LegalBlockView({ block }: { block: LegalBlock }) {
  switch (block.type) {
    case 'paragraph':
      return <p className="mt-4 text-sm leading-relaxed text-ink-muted">{block.text}</p>

    case 'bullets':
      return (
        <ul className="mt-4 space-y-2">
          {block.items.map((item) => (
            <li key={item} className="flex gap-2 text-sm text-ink-muted">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-ink-muted" />
              {item}
            </li>
          ))}
        </ul>
      )

    case 'bold-items':
      return (
        <div className="mt-4 space-y-3">
          {block.items.map((item) => (
            <p key={item.label} className="text-sm leading-relaxed text-ink-muted">
              <span className="font-semibold text-ink">{item.label}</span> {item.text}
            </p>
          ))}
        </div>
      )

    case 'contact-box':
      return (
        <div className="mt-4 rounded-card bg-surface-cream p-6">
          <h3 className="text-lg font-semibold text-ink">{block.heading}</h3>
          <p className="mt-2 text-sm text-ink-muted">{block.paragraph}</p>
          <div className="mt-3 text-sm text-ink-muted">
            {block.orgLines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </div>
      )

    case 'callout': {
      const Icon = calloutIcons[block.icon]
      return (
        <div className="mt-4 rounded-card border-l-4 border-brand-navy bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex items-center gap-2">
            <Icon size={18} className="text-brand-navy" />
            <h3 className="text-base font-semibold text-ink">{block.heading}</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-ink-muted">{block.text}</p>
        </div>
      )
    }

    case 'icon-items':
      return (
        <div className="mt-4 space-y-4 rounded-card bg-surface-cream p-6">
          {block.items.map((item) => {
            const Icon = itemIcons[item.icon]
            return (
              <div key={item.title} className="flex gap-3">
                <Icon size={16} className="mt-0.5 shrink-0 text-brand-navy" />
                <div>
                  <p className="text-sm font-semibold text-ink">{item.title}</p>
                  <p className="mt-0.5 text-sm text-ink-muted">{item.text}</p>
                </div>
              </div>
            )
          })}
        </div>
      )

    case 'info-note':
      return (
        <div className="mt-4 flex gap-3 rounded-card bg-blue-50 p-4">
          <Info size={16} className="mt-0.5 shrink-0 text-brand-navy" />
          <p className="text-sm text-ink-muted">{block.text}</p>
        </div>
      )
  }
}
