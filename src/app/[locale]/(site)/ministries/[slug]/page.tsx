import Image from 'next/image'
import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { getJoinStatus, buildRequestStatusMap } from '@/lib/join-requests-adapter'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'
import { JoinRequestButton } from '@/components/shared/JoinRequestButton'

// Session-dependent (join status depends on who's logged in) — see the
// Prayer/Events/Groups detail pages for the full explanation of why this
// needs to be dynamic rather than cached.
export const dynamic = 'force-dynamic'

export default async function MinistryDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const payload = await getPayloadClient()
  const t = await getTranslations('ministries')
  const tGate = await getTranslations('membersOnlyGate')

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

  const member = await getCurrentMember()
  // Same source of truth as the listing page (MinistriesExplorer) — a
  // member's request for THIS ministry specifically, so the button here
  // reflects the exact same pending/approved/declined state shown
  // everywhere else, including the dashboard's own pending-requests card.
  const requestsResult = member
    ? await payload.find({ collection: 'join-requests', where: { member: { equals: member.id } }, limit: 200 })
    : null
  const requestStatusMap = buildRequestStatusMap(requestsResult?.docs ?? [])
  const joinStatus = getJoinStatus('ministries', doc.id, member, requestStatusMap)

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

      <div className="mt-6 max-w-xs">
        <MembersOnlyGate member={member} prompt={tGate('joinGroupPrompt')}>
          <JoinRequestButton targetType="ministries" targetId={String(doc.id)} initialStatus={joinStatus} joinLabel={doc.ctaLabel ?? undefined} />
        </MembersOnlyGate>
      </div>
    </div>
  )
}
