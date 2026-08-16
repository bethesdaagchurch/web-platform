import Image from 'next/image'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { EventsHeroData } from '@/types/events'

export function EventsHero({ data }: { data: EventsHeroData }) {
  return (
    <section className="mx-auto max-w-content px-6 pt-8">
      <div className="relative h-[480px] overflow-hidden rounded-2xl">
        <Image src={data.backgroundImage} alt="" fill priority className="object-cover" />

        <div className="absolute inset-y-8 left-8 flex max-w-md flex-col justify-center rounded-2xl bg-white/75 p-8 backdrop-blur-md">
          <span className="w-fit rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy-dark">
            {data.badge}
          </span>
          <h1 className="mt-4 text-3xl font-semibold leading-tight text-brand-navy-dark md:text-4xl">
            {data.heading}
          </h1>
          <p className="mt-3 text-sm text-ink">{data.subtext}</p>

          <div className="mt-6">
            <Link
              href={data.button.href}
              className="inline-flex items-center gap-2 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark"
            >
              {data.button.label} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
