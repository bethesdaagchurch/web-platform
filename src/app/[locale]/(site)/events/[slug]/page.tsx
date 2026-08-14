import { notFound } from 'next/navigation'
import { getTranslations } from 'next-intl/server'
import { CalendarDays, MapPin, Wallet } from 'lucide-react'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { categoryMeta } from '@/lib/events-adapter'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'
import { EventRegistrationSection } from '@/components/events/EventRegistrationSection'

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

export default async function EventDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const typedLocale = locale as 'en' | 'ta' | 'kn'
  const payload = await getPayloadClient()

  // Deliberately not using the events-adapter's array mapper here: it
  // falls back to the full mock list when given an empty array, which
  // would make a genuinely nonexistent slug render the first mock event
  // instead of 404ing — same class of bug fixed in every other detail
  // route in this project.
  const result = await payload.find({
    collection: 'events',
    locale: typedLocale,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  const member = await getCurrentMember()
  const t = await getTranslations('events.registration')
  const tDetail = await getTranslations('events.detail')

  let existingRegistrationId: string | null = null
  if (doc.requiresRegistration && member) {
    const existing = await payload.find({
      collection: 'event-registrations',
      where: {
        and: [{ member: { equals: member.id } }, { event: { equals: doc.id } }, { status: { equals: 'registered' } }],
      },
      limit: 1,
    })
    existingRegistrationId = existing.docs[0] ? String(existing.docs[0].id) : null
  }

  const dateRange = doc.endDate
    ? `${new Date(doc.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} \u2013 ${formatDate(doc.endDate)}`
    : formatDate(doc.startDate)

  return (
    <div className="px-6 py-16 text-center">
      <span className="inline-block rounded-full bg-brand-gold-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy-dark">
        {categoryMeta[doc.category]?.label ?? doc.category.toUpperCase()}
      </span>
      <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold text-brand-navy-dark md:text-5xl">{doc.title}</h1>
      <p className="mx-auto mt-4 max-w-2xl text-sm text-ink-muted">{doc.description}</p>

      <div className="mx-auto mt-8 flex max-w-xl flex-wrap items-center justify-center gap-6 rounded-card bg-white px-8 py-5 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-2 text-left">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <CalendarDays size={16} className="text-brand-navy" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{tDetail('date')}</p>
            <p className="text-sm font-semibold text-ink">{dateRange}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-left">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
            <MapPin size={16} className="text-brand-navy" />
          </span>
          <div>
            <p className="text-xs text-ink-muted">{tDetail('location')}</p>
            <p className="text-sm font-semibold text-ink">{doc.location}</p>
          </div>
        </div>
        {doc.cost && (
          <div className="flex items-center gap-2 text-left">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-50">
              <Wallet size={16} className="text-brand-navy" />
            </span>
            <div>
              <p className="text-xs text-ink-muted">{tDetail('cost')}</p>
              <p className="text-sm font-semibold text-ink">{doc.cost}</p>
            </div>
          </div>
        )}
      </div>

      {doc.requiresRegistration ? (
        <div className="text-left">
          <MembersOnlyGate member={member} prompt={t('signInPrompt')}>
            {member && (
              <EventRegistrationSection member={member} eventId={String(doc.id)} existingRegistrationId={existingRegistrationId} />
            )}
          </MembersOnlyGate>
        </div>
      ) : (
        doc.actions &&
        doc.actions.length > 0 && (
          <div className="mt-8 flex justify-center gap-3">
            {doc.actions.map((action) => (
              <a
                key={action.label}
                href={action.href}
                className={
                  action.variant === 'solid'
                    ? 'rounded-md bg-brand-navy px-6 py-3 text-sm font-medium text-white hover:bg-brand-navy-dark'
                    : 'rounded-md border border-black/15 px-6 py-3 text-sm font-medium text-ink hover:bg-surface-cream'
                }
              >
                {action.label}
              </a>
            ))}
          </div>
        )
      )}
    </div>
  )
}
