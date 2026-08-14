import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { BookOpen } from 'lucide-react'
import type { SermonEntry } from '@/types/sermons'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export function SermonCard({ sermon }: { sermon: SermonEntry }) {
  return (
    <article className="overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5">
      <Link href={`/sermons/${sermon.slug}`} className="relative block h-48">
        <Image src={sermon.thumbnail} alt={sermon.title} fill className="object-cover" />
        <span className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-0.5 text-xs font-medium text-white">
          {sermon.duration}
        </span>
      </Link>

      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{sermon.seriesLabel}</p>
        <Link href={`/sermons/${sermon.slug}`}>
          <h3 className="mt-1 text-lg font-semibold text-ink hover:text-brand-navy">{sermon.title}</h3>
        </Link>
        <p className="mt-2 text-sm text-ink-muted">{sermon.description}</p>

        <p className="mt-4 flex items-center gap-2 rounded-md bg-surface-cream px-3 py-2 text-sm text-ink">
          <BookOpen size={14} className="text-brand-gold" /> {sermon.scripture}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
              {sermon.speakerInitials}
            </span>
            <span className="text-sm text-ink">{sermon.speakerName}</span>
          </div>
          <span className="text-xs text-ink-muted">{formatDate(sermon.date)}</span>
        </div>
      </div>
    </article>
  )
}
