import { MapPin, ExternalLink } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { InPersonData } from '@/types/live'

export function InPersonCard({ data }: { data: InPersonData }) {
  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-brand-navy" />
        <h2 className="text-lg font-semibold text-brand-navy">{data.heading}</h2>
      </div>

      <ul className="mt-3 divide-y divide-black/5">
        {data.serviceTimes.map((row) => (
          <li key={row.id} className="flex items-center justify-between py-3 text-sm">
            <span className="text-ink-muted">{row.label}</span>
            <span className="font-semibold text-ink">{row.time}</span>
          </li>
        ))}
      </ul>

      <Link
        href={data.directionsHref}
        className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
      >
        {data.directionsLabel} <ExternalLink size={13} />
      </Link>
    </div>
  )
}
