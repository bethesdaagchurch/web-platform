import { getTranslations } from 'next-intl/server'
import { GroupsExplorer } from '@/components/groups/GroupsExplorer'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { adaptGroupsHero, adaptGroupListings, adaptGroupsQuote } from '@/lib/groups-adapter'
import { buildRequestStatusMap } from '@/lib/join-requests-adapter'

// The Worship/Youth/Care Groups/Kids/Care sidebar categories are structural
// (tied to the Groups collection's fixed category select), not editorial
// content — same reasoning as Events' category pills — but the labels
// still need translating, built here rather than imported from a
// hardcoded English mock.
// See the Prayer page for the full explanation — forces dynamic rendering
// since "Join Group"'s gated/unlocked state depends on session.
export const dynamic = 'force-dynamic'

export default async function GroupsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const typedLocale = locale as 'en' | 'ta' | 'kn'
  const payload = await getPayloadClient()

  const [doc, groupsResult, member, t] = await Promise.all([
    payload.findGlobal({ slug: 'groups-page', locale: typedLocale }),
    payload.find({ collection: 'groups', locale: typedLocale, limit: 100, sort: 'title' }),
    getCurrentMember(),
    getTranslations('groups.categories'),
  ])

  const requestsResult = member
    ? await payload.find({ collection: 'join-requests', where: { member: { equals: member.id } }, limit: 200 })
    : null
  const requestStatusMap = buildRequestStatusMap(requestsResult?.docs ?? [])

  const groupCategories = [
    { value: 'worship' as const, label: t('worship') },
    { value: 'youth' as const, label: t('youth') },
    { value: 'care-groups' as const, label: t('careGroups') },
    { value: 'kids' as const, label: t('kids') },
    { value: 'care' as const, label: t('care') },
  ]

  return (
    <GroupsExplorer
      heroData={adaptGroupsHero(doc)}
      categories={groupCategories}
      groups={adaptGroupListings(groupsResult.docs)}
      quote={adaptGroupsQuote(doc)}
      member={member}
      requestStatusMap={requestStatusMap}
    />
  )
}
