import { notFound } from 'next/navigation'
import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Calendar, MapPin, User, ArrowLeft, Users } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'

// Session-dependent (the member list only shows for a member who's
// actually in this specific group) — see the Prayer/Events pages for the
// full explanation of why this needs to be dynamic rather than cached.
export const dynamic = 'force-dynamic'

function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

export default async function GroupDetailPage({
  params,
}: {
  params: Promise<{ slug: string; locale: string }>
}) {
  const { slug, locale } = await params
  const typedLocale = locale as 'en' | 'ta' | 'kn'
  const payload = await getPayloadClient()

  // Deliberately not using the groups-adapter's array mapper here — it
  // falls back to the full mock list when given an empty array, which
  // would make a genuinely nonexistent slug render the first mock group
  // instead of 404ing, the same class of bug fixed on every other detail
  // route in this project.
  const result = await payload.find({
    collection: 'groups',
    locale: typedLocale,
    where: { slug: { equals: slug } },
    limit: 1,
  })

  const doc = result.docs[0]
  if (!doc) notFound()

  const member = await getCurrentMember()
  const t = await getTranslations('groupMembers')

  const isInThisGroup =
    member?.myGroups?.some((g) => (typeof g === 'object' ? g.id : g) === doc.id) ?? false

  const fellowMembers = isInThisGroup
    ? (
        await payload.find({
          collection: 'members',
          where: { myGroups: { in: [doc.id] } },
          limit: 100,
          depth: 0,
        })
      ).docs
    : []

  const leaderPhoto = doc.leaderPhoto && typeof doc.leaderPhoto === 'object' ? doc.leaderPhoto.url : null

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <Link href="/groups" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline">
        <ArrowLeft size={16} /> {t('backToGroups')}
      </Link>

      <span className="inline-block rounded-full bg-brand-gold-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy-dark">
        {doc.badgeLabel}
      </span>
      <h1 className="mt-3 text-3xl font-semibold text-brand-navy-dark">{doc.title}</h1>
      <p className="mt-3 max-w-2xl text-sm text-ink-muted">{doc.description}</p>

      <div className="mt-6 flex flex-wrap gap-6 text-sm text-ink">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-brand-navy" /> {doc.schedule}
        </div>
        <div className="flex items-center gap-2">
          <MapPin size={16} className="text-brand-navy" /> {doc.location}
        </div>
        <div className="flex items-center gap-2">
          {leaderPhoto ? (
            <Image src={leaderPhoto} alt="" width={20} height={20} className="rounded-full object-cover" />
          ) : (
            <User size={16} className="text-brand-navy" />
          )}
          {doc.leaderName}
        </div>
      </div>

      <div className="mt-10 max-w-xl rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-ink">
          <Users size={18} className="text-brand-navy" /> {t('heading')}
        </h2>

        {isInThisGroup ? (
          fellowMembers.length > 0 ? (
            <ul className="mt-4 space-y-3">
              {fellowMembers.map((m) => (
                <li key={m.id} className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-gold-light text-xs font-semibold text-brand-navy-dark">
                    {initialsFrom(m.name)}
                  </span>
                  <p className="text-sm font-medium text-ink">{m.name}</p>
                </li>
              ))}
            </ul>
          ) : null
        ) : (
          <p className="mt-3 text-sm text-ink-muted">{t('notAMemberYet')}</p>
        )}
      </div>
    </div>
  )
}
