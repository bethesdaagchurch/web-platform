import { MinistriesHero } from '@/components/ministries/MinistriesHero'
import { MinistriesExplorer } from '@/components/ministries/MinistriesExplorer'
import { SmallGroups } from '@/components/ministries/SmallGroups'
import { RotaBanner } from '@/components/ministries/RotaBanner'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import {
  adaptMinistriesHero,
  adaptMinistryItems,
  adaptSmallGroups,
  adaptAreaOfInterestOptions,
} from '@/lib/ministries-adapter'
import { buildRequestStatusMap } from '@/lib/join-requests-adapter'

// See the Prayer page for the full explanation — forces dynamic rendering
// since SmallGroups' leadership-interest form and the Rota banner both
// depend on session state.
export const dynamic = 'force-dynamic'

export default async function MinistriesPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [ministriesPage, ministriesResult, member] = await Promise.all([
    payload.findGlobal({ slug: 'ministries-page', locale: typedLocale }),
    payload.find({ collection: 'ministries', locale: typedLocale, limit: 50, sort: 'name' }),
    getCurrentMember(),
  ])

  const requestsResult = member
    ? await payload.find({ collection: 'join-requests', where: { member: { equals: member.id } }, limit: 200 })
    : null
  const requestStatusMap = buildRequestStatusMap(requestsResult?.docs ?? [])

  return (
    <>
      <MinistriesHero data={adaptMinistriesHero(ministriesPage)} />
      <MinistriesExplorer
        ministries={adaptMinistryItems(ministriesResult.docs)}
        member={member}
        requestStatusMap={requestStatusMap}
      />
      <div className="py-6">
        <RotaBanner member={member} />
      </div>
      <SmallGroups
        data={adaptSmallGroups(ministriesPage)}
        areaOptions={adaptAreaOfInterestOptions(ministriesPage)}
        member={member}
      />
    </>
  )
}
