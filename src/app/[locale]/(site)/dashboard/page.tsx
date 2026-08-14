import { redirect } from '@/i18n/navigation'
import { WelcomeHeader } from '@/components/dashboard/WelcomeHeader'
import { MyGroupsCard } from '@/components/dashboard/MyGroupsCard'
import { MyMinistriesCard } from '@/components/dashboard/MyMinistriesCard'
import { MyRequestsCard } from '@/components/dashboard/MyRequestsCard'
import { VolunteerShiftCard } from '@/components/dashboard/VolunteerShiftCard'
import { MyEventsCard } from '@/components/dashboard/MyEventsCard'
import { MyRotaCard } from '@/components/dashboard/MyRotaCard'
import { RecentSermonsSection } from '@/components/dashboard/RecentSermonsSection'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import {
  adaptGroups,
  adaptMinistries,
  adaptVolunteerShift,
  adaptRecentSermons,
  adaptRegisteredEvents,
  adaptRotaAssignments,
  adaptPendingRequests,
} from '@/lib/dashboard-adapter'

// Forces per-request dynamic rendering — see the Prayer page for the full
// explanation. Same reasoning applies to every member-gated page: content
// depends on session state, so a cached response would leak one visitor's
// view to everyone after them.
export const dynamic = 'force-dynamic'

export default async function DashboardPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const member = await getCurrentMember()

  // Unlike Ministries/Live/Prayer (public pages with a members-only section
  // alongside public content), the Dashboard IS entirely member content —
  // a hard redirect to /login is the right call here, not a gate prompt
  // sitting on an otherwise-empty page.
  if (!member) {
    redirect({ href: '/login', locale })
    return
  }

  const payload = await getPayloadClient()
  const [sermonsResult, registrationsResult, rotaResult, requestsResult] = await Promise.all([
    payload.find({
      collection: 'sermons',
      locale: locale as 'en' | 'ta' | 'kn',
      limit: 3,
      sort: '-date',
    }),
    payload.find({
      collection: 'event-registrations',
      where: { and: [{ member: { equals: member.id } }, { status: { equals: 'registered' } }] },
      sort: 'event.startDate',
    }),
    payload.find({
      collection: 'worship-rota',
      where: { assignedMembers: { in: [member.id] } },
      sort: 'date',
    }),
    payload.find({
      collection: 'join-requests',
      where: { member: { equals: member.id } },
      limit: 200,
    }),
  ])

  const firstName = member.name.split(' ')[0]
  const shift = adaptVolunteerShift(member)

  return (
    <div className="pb-16">
      <WelcomeHeader firstName={firstName} />

      <div className="mx-auto mt-6 max-w-content px-6">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <MyGroupsCard groups={adaptGroups(member)} />
          {shift && <VolunteerShiftCard shift={shift} />}
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <MyMinistriesCard ministries={adaptMinistries(member)} />
          <MyRequestsCard requests={adaptPendingRequests(requestsResult.docs)} />
        </div>

        <div className="mt-6">
          <MyEventsCard events={adaptRegisteredEvents(registrationsResult.docs)} />
        </div>

        <div className="mt-6">
          <MyRotaCard assignments={adaptRotaAssignments(rotaResult.docs)} />
        </div>

        <div className="mt-6">
          <RecentSermonsSection sermons={adaptRecentSermons(sermonsResult.docs)} />
        </div>
      </div>
    </div>
  )
}
