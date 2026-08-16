import { redirect } from '@/i18n/navigation'
import { getTranslations } from 'next-intl/server'
import { RotaExplorer } from '@/components/rota/RotaExplorer'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { getCurrentAdminUser } from '@/lib/get-admin'
import { adaptRotaEntries, adaptRotaFilterOptions, adaptWorshipGuidelines } from '@/lib/rota-adapter'

// Entirely member content, same reasoning as /dashboard — a hard redirect
// to /login for anyone with neither session. CMS admins (Users) can also
// view this page — without this check they'd be redirected too, since
// getCurrentMember() only recognizes Members sessions, and a Users session
// browsing the public site would otherwise have no way to see or manage
// the rota. Only admins see the "Edit Rota" action, though — see isAdmin
// below and RotaExplorer.
// See the Prayer page for the full explanation — this page already
// redirects non-members, but forcing dynamic explicitly removes any
// ambiguity about whether that redirect logic itself could be cached.
export const dynamic = 'force-dynamic'

export default async function RotaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [member, adminUser] = await Promise.all([getCurrentMember(), getCurrentAdminUser()])

  if (!member && !adminUser) {
    redirect({ href: '/login', locale })
    return
  }

  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'
  const [rotaResult, rotaPageDoc, t] = await Promise.all([
    payload.find({ collection: 'worship-rota', locale: typedLocale, limit: 100, sort: 'date' }),
    payload.findGlobal({ slug: 'rota-page', locale: typedLocale }),
    getTranslations('rota'),
  ])

  const entries = adaptRotaEntries(rotaResult.docs)
  const { monthOptions, ministryOptions } = adaptRotaFilterOptions(entries, t('allMinistries'))

  return (
    <div className="mx-auto max-w-content px-6 py-10">
      <RotaExplorer
        entries={entries}
        monthOptions={monthOptions}
        ministryOptions={ministryOptions}
        guidelines={adaptWorshipGuidelines(rotaPageDoc)}
        isAdmin={Boolean(adminUser)}
      />
    </div>
  )
}
