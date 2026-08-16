import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'
import { getPayloadClient } from '@/lib/payload'

// Individual leadership bio pages (e.g. /about/david-mitchell) aren't
// designed yet — this confirms the link resolves to a real route instead
// of 404ing, for any leader with hasFullBio checked in the CMS.
export default async function LeaderBioPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayloadClient()
  const t = await getTranslations('placeholders')

  const result = await payload.find({
    collection: 'leadership',
    locale: locale as 'en' | 'ta' | 'kn',
    where: { slug: { equals: slug }, hasFullBio: { equals: true } },
    limit: 1,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  return <PagePlaceholder title={`${doc.name} \u2014 ${t('fullBio')}`} />
}
