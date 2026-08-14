import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { LeadershipMember } from '@/types/about'

function LeadershipCard({ member, spanClass }: { member: LeadershipMember; spanClass: string }) {
  if (member.variant === 'photo-left') {
    return (
      <article className={`grid overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5 sm:grid-cols-2 ${spanClass}`}>
        <div className="relative h-56 sm:h-full">
          <Image src={member.photo} alt={member.name} fill className="object-cover" />
        </div>
        <div className="flex flex-col justify-center p-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{member.roleLabel}</p>
          <h3 className="mt-1 text-lg font-semibold text-brand-navy-dark">{member.name}</h3>
          <p className="mt-2 text-sm text-ink-muted">{member.bio}</p>
          {member.bioLink && (
            <Link
              href={member.bioLink.href}
              className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
            >
              {member.bioLink.label} <ArrowRight size={14} />
            </Link>
          )}
        </div>
      </article>
    )
  }

  if (member.variant === 'avatar') {
    return (
      <article className={`rounded-card bg-surface-cream p-6 ring-1 ring-black/5 ${spanClass}`}>
        <div className="flex items-center gap-3">
          <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full">
            <Image src={member.photo} alt={member.name} fill className="object-cover" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-brand-navy-dark">{member.name}</h3>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{member.roleLabel}</p>
          </div>
        </div>
        <p className="mt-4 text-sm text-ink-muted">{member.bio}</p>
      </article>
    )
  }

  // photo-top
  return (
    <article className={`overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5 ${spanClass}`}>
      <div className="relative h-48">
        <Image src={member.photo} alt={member.name} fill className="object-cover" />
      </div>
      <div className="p-5">
        <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{member.roleLabel}</p>
        <h3 className="mt-1 text-base font-semibold text-brand-navy-dark">{member.name}</h3>
        <p className="mt-2 text-sm text-ink-muted">{member.bio}</p>
      </div>
    </article>
  )
}

export async function LeadershipSection({ members }: { members: LeadershipMember[] }) {
  const t = await getTranslations('about.leadership')
  // Matches the screenshot's bento layout: row 1 is wide-narrow, row 2 is
  // narrow-wide, on a 3-column grid. Assumes exactly 4 members in this order;
  // if the team grows, this layout should be revisited rather than stretched.
  const spans = ['sm:col-span-2', 'sm:col-span-1', 'sm:col-span-1', 'sm:col-span-2']

  return (
    <section id="leadership" className="bg-surface-cream px-6 py-20 scroll-mt-20">
      <div className="mx-auto max-w-content text-center">
        <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{t('description')}</p>

        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {members.map((member, i) => (
            <LeadershipCard key={member.id} member={member} spanClass={spans[i] ?? 'sm:col-span-1'} />
          ))}
        </div>
      </div>
    </section>
  )
}
