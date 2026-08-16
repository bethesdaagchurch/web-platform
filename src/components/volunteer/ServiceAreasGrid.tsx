import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Church, HandHeart, Globe, Smile, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import { VolunteerInterestForm } from '@/components/volunteer/VolunteerInterestForm'
import type { ServiceArea } from '@/types/volunteer'

const iconMap = { worship: Church, hospitality: HandHeart, outreach: Globe, kids: Smile }

export async function ServiceAreasGrid({ areas, isMember }: { areas: ServiceArea[]; isMember: boolean }) {
  const t = await getTranslations('volunteer')

  return (
    <section id="areas-of-service" className="mx-auto max-w-content px-6 py-16">
      <div className="text-center">
        <h2 className="text-3xl font-semibold text-ink">{t('areasHeading')}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t('areasSubtext')}</p>
      </div>

      <div className="mt-10 grid gap-6 md:grid-cols-3 md:grid-rows-2">
        {areas.map((area) => {
          const Icon = iconMap[area.icon]

          if (area.variant === 'image') {
            return (
              <div
                key={area.id}
                className="relative flex min-h-[220px] flex-col justify-end overflow-hidden rounded-card md:col-span-2"
              >
                {area.image && <Image src={area.image} alt="" fill className="object-cover" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="relative z-10 p-6">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white/90">
                    <Icon size={16} className="text-brand-navy" />
                  </span>
                  <h3 className="mt-3 text-xl font-semibold text-white">{area.title}</h3>
                  <p className="mt-1 max-w-md text-sm text-white/85">{area.description}</p>
                  {/* Hidden entirely for a logged-in member, not just
                      relabeled — there's no good destination for this
                      button yet (it currently just points wherever the
                      admin has set signUpHref, e.g. a generic contact
                      form), so showing nothing is more honest than
                      showing a CTA that doesn't lead anywhere meaningful
                      for someone who's already a known member. */}
                  {area.signUpHref && !isMember && (
                    <Link
                      href={area.signUpHref}
                      className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-white hover:underline"
                    >
                      {area.signUpLabel || t('signUpDefault')} <ArrowRight size={14} />
                    </Link>
                  )}
                </div>
              </div>
            )
          }

          if (area.variant === 'featured') {
            return (
              <div key={area.id} className="rounded-card bg-brand-gold-light/40 p-6 ring-1 ring-brand-gold-light md:row-span-2">
                <div className="flex items-center justify-between">
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                    <Icon size={16} className="text-brand-navy" />
                  </span>
                  {area.highNeedLabel && (
                    <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-ink">{area.highNeedLabel}</span>
                  )}
                </div>
                <h3 className="mt-4 text-xl font-semibold text-ink">{area.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{area.description}</p>
                <VolunteerInterestForm areaOfInterest={area.title} />
              </div>
            )
          }

          return (
            <div key={area.id} className="rounded-card bg-surface-cream p-6">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white">
                <Icon size={16} className="text-brand-navy" />
              </span>
              <h3 className="mt-3 text-xl font-semibold text-ink">{area.title}</h3>
              <p className="mt-2 text-sm text-ink-muted">{area.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
