import { Heart } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { OnlineGivingData } from '@/types/live'

export function OnlineGivingCard({ data }: { data: OnlineGivingData }) {
  return (
    <div className="relative overflow-hidden rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 rounded-full bg-brand-gold-light/40 blur-2xl" />
      <span className="relative flex h-10 w-10 items-center justify-center rounded-md bg-brand-navy">
        <Heart size={16} className="text-white" fill="currentColor" />
      </span>
      <h2 className="relative mt-4 text-lg font-semibold text-brand-navy">{data.heading}</h2>
      <p className="relative mt-1.5 text-sm text-ink-muted">{data.description}</p>
      <Link
        href={data.buttonHref}
        className="relative mt-4 inline-flex items-center gap-2 rounded-md bg-brand-gold px-5 py-2.5 text-sm font-medium text-white hover:opacity-90"
      >
        {data.buttonLabel} &rarr;
      </Link>
    </div>
  )
}
