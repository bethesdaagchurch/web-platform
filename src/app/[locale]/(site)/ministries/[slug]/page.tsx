import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { Mail, ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayloadClient()
  const t = await getTranslations('ministries')

  // Deliberately not using the ministries-adapter's array mapper here: it
  // falls back to the full mock list when given an empty array, which
  // would make a genuinely nonexistent slug render the first mock ministry
  // instead of 404ing. A single-document lookup needs its own not-found
  // check before any mapping happens.
  const result = await payload.find({
    collection: 'ministries',
    locale: locale as 'en' | 'ta' | 'kn',
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  const image = doc.image && typeof doc.image === 'object' ? doc.image.url : null

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <Link href="/ministries" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline">
        <ArrowLeft size={16} /> {t('backToMinistries')}
      </Link>

      <Image
        src={image || '/images/ministry-youth.jpg'}
        alt={doc.name}
        width={1000}
        height={500}
        className="h-80 w-full rounded-card object-cover"
      />
      <h1 className="mt-6 text-3xl font-semibold text-brand-navy-dark">{doc.name}</h1>
      <p className="mt-4 max-w-2xl text-sm text-ink-muted">{doc.description}</p>

      <a
        href={`mailto:${doc.contactEmail}?subject=${encodeURIComponent(`Joining ${doc.name}`)}`}
        className="mt-6 inline-flex items-center gap-2 rounded-md bg-brand-navy px-6 py-3 text-sm font-medium text-white hover:bg-brand-navy-dark"
      >
        <Mail size={16} /> {doc.ctaLabel || 'Join Ministry'}
      </a>

      <p className="mt-6 max-w-2xl text-sm text-ink-muted">
        Full ministry detail layout (meeting times, photos, upcoming events specific to this ministry)
        hasn&apos;t been designed yet — reaching out above works today, though.
      </p>
    </div>
  )
}
