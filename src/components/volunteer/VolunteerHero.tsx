import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import type { VolunteerHeroData } from '@/types/volunteer'

export function VolunteerHero({ data }: { data: VolunteerHeroData }) {
  return (
    <section className="relative overflow-hidden px-6 py-20 text-center">
      <Image src={data.backgroundImage} alt="" fill className="object-cover opacity-10" />
      <div className="relative z-10">
        <span className="inline-block rounded-full bg-brand-gold-light px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy-dark">
          {data.badge}
        </span>
        <h1 className="mx-auto mt-4 max-w-2xl text-4xl font-semibold text-brand-navy md:text-5xl">{data.heading}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">{data.subtext}</p>
        <Link
          href={data.buttonHref}
          className="mt-6 inline-block rounded-full bg-brand-navy px-6 py-3 text-sm font-medium text-white hover:bg-brand-navy-dark"
        >
          {data.buttonLabel}
        </Link>
      </div>
    </section>
  )
}
