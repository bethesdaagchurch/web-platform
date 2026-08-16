import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BookOpen, Play } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { DashboardSermonItem } from '@/types/dashboard'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export function RecentSermonsSection({ sermons }: { sermons: DashboardSermonItem[] }) {
  const t = useTranslations('dashboard')
  if (sermons.length === 0) return null

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
        <BookOpen size={18} className="text-brand-navy" /> {t('recentSermons')}
      </h2>

      <div className="mt-4 grid gap-5 sm:grid-cols-3">
        {sermons.map((sermon) => (
          <Link key={sermon.id} href={`/sermons/${sermon.slug}`} className="group">
            <div className="relative overflow-hidden rounded-card">
              <Image
                src={sermon.thumbnail}
                alt={sermon.title}
                width={400}
                height={260}
                className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-brand-navy">
                  <Play size={16} fill="currentColor" />
                </span>
              </div>
            </div>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-gold">
              {t('series')}: {sermon.seriesLabel}
            </p>
            <p className="mt-1 text-sm font-semibold text-ink group-hover:text-brand-navy">{sermon.title}</p>
            <p className="mt-0.5 text-xs text-ink-muted">
              {sermon.speakerName} &middot; {formatDate(sermon.date)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  )
}
