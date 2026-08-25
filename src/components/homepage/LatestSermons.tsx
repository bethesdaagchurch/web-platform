import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import type { Sermon } from '@/types/homepage'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
}

export async function LatestSermons({ sermons }: { sermons: Sermon[] }) {
  const t = await getTranslations('homepage.latestSermons')
  // No real sermon data at all — skip the section entirely rather than
  // crash on an empty array (the previous mock fallback always guaranteed
  // at least one entry) or show a "Latest Word" section with nothing
  // real in it.
  if (sermons.length === 0) return null
  const featured = sermons.find((s) => s.featured) ?? sermons[0]
  const rest = sermons.filter((s) => s.id !== featured.id).slice(0, 3)

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-content px-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
            <p className="mt-1 text-sm text-ink-muted">{t('description')}</p>
          </div>
          <Link
            href="/sermons"
            className="rounded-full border border-black/10 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-cream"
          >
            {t('archive')}
          </Link>
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          <Link
            href={`/sermons/${featured.slug}`}
            className="group relative col-span-2 overflow-hidden rounded-card"
          >
            <Image
              src={featured.thumbnail}
              alt={featured.title}
              width={800}
              height={480}
              className="h-80 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-6">
              <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                {t('featuredMessage')}
              </span>
              <h3 className="mt-3 max-w-md text-xl font-semibold text-white">{featured.title}</h3>
              <p className="mt-1 text-xs text-white/70">
                {featured.speaker} &middot; {formatDate(featured.date)}
              </p>
            </div>
          </Link>

          <div className="flex flex-col gap-4">
            {rest.map((sermon) => (
              <Link
                key={sermon.id}
                href={`/sermons/${sermon.slug}`}
                className="flex items-center gap-3 rounded-card border border-black/5 p-3 hover:bg-surface-cream"
              >
                <Image
                  src={sermon.thumbnail}
                  alt={sermon.title}
                  width={64}
                  height={64}
                  className="h-16 w-16 shrink-0 rounded-md object-cover"
                />
                <div>
                  <p className="text-sm font-medium text-ink">{sermon.title}</p>
                  <p className="text-xs text-ink-muted">{sermon.speaker}</p>
                  <p className="text-xs text-brand-gold">{formatDate(sermon.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
