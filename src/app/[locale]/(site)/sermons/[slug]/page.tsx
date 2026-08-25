import { notFound } from 'next/navigation'
import { getPayloadClient } from '@/lib/payload'
import { adaptSermonHero } from '@/lib/sermons-adapter'
import { SermonVideoPlayer } from '@/components/sermons/SermonVideoPlayer'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })
}

export default async function SermonDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  // The featured hero sermon isn't part of the archive collection, so its
  // slug (derived from the featured sermon relationship) is checked
  // separately here.
  const sermonsPage = await payload.findGlobal({ slug: 'sermons-page', locale: typedLocale })
  const hero = adaptSermonHero(sermonsPage)

  if (hero && slug === hero.slug) {
    return (
      <div className="mx-auto max-w-content px-6 py-16">
        <SermonVideoPlayer youtubeUrl={hero.youtubeUrl} title={hero.title} />
        <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-gold">{hero.badge}</p>
        <h1 className="mt-1 text-3xl font-semibold text-brand-navy-dark">{hero.title}</h1>
        <p className="mt-2 text-sm text-ink-muted">{hero.date}</p>
        <p className="mt-6 max-w-2xl text-sm text-ink-muted">{hero.description}</p>
      </div>
    )
  }

  // Deliberately not using the sermons-adapter's array mapper here: it
  // falls back to the full mock list when given an empty array, which
  // would make a genuinely nonexistent slug render the first mock sermon
  // instead of 404ing — same class of bug fixed in the Ministries/About
  // detail pages.
  const result = await payload.find({
    collection: 'sermons',
    locale: typedLocale,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <SermonVideoPlayer youtubeUrl={doc.youtubeUrl} title={doc.title} />
      <p className="mt-6 text-xs font-semibold uppercase tracking-wide text-brand-gold">{doc.seriesLabel}</p>
      <h1 className="mt-1 text-3xl font-semibold text-brand-navy-dark">{doc.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {doc.speakerName} &middot; {formatDate(doc.date)} &middot; {doc.scripture}
      </p>
      <p className="mt-6 max-w-2xl text-sm text-ink-muted">{doc.description}</p>
    </div>
  )
}
