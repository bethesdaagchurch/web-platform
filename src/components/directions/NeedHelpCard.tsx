import { Headphones, Phone, Mail } from 'lucide-react'
import type { NeedHelpData } from '@/types/directions'
import type { SiteSettings } from '@/types/homepage'

export function NeedHelpCard({ data, settings }: { data: NeedHelpData; settings: SiteSettings }) {
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <Headphones size={18} className="text-brand-gold" />
        <h2 className="text-lg font-semibold text-brand-navy">{data.heading}</h2>
      </div>
      <p className="mt-2 text-sm text-ink-muted">{data.description}</p>

      <div className="mt-4 space-y-3">
        <a href={`tel:${settings.phone}`} className="flex items-center gap-3 text-sm text-ink hover:text-brand-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-cream">
            <Phone size={14} />
          </span>
          {settings.phone}
        </a>
        <a href={`mailto:${settings.email}`} className="flex items-center gap-3 text-sm text-ink hover:text-brand-navy">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-surface-cream">
            <Mail size={14} />
          </span>
          {settings.email}
        </a>
      </div>
    </div>
  )
}
