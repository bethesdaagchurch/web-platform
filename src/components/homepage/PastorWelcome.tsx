import Image from 'next/image'
import type { PastorWelcome as PastorWelcomeData } from '@/types/homepage'

export function PastorWelcome({ data }: { data: PastorWelcomeData }) {
  return (
    <section className="mx-auto max-w-content px-6 py-8">
      <div className="grid gap-0 overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5 md:grid-cols-2">
        <div className="relative h-64 md:h-full">
          <Image src={data.photo} alt={data.name} fill className="object-cover" />
        </div>

        <div className="flex flex-col justify-center p-8">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{data.eyebrow}</p>
          <h2 className="mt-2 text-2xl font-semibold text-brand-navy-dark">{data.heading}</h2>
          <blockquote className="mt-4 border-l-2 border-brand-gold/60 pl-4 text-sm italic text-ink-muted">
            &ldquo;{data.quote}&rdquo;
          </blockquote>
          <p className="mt-5 text-sm font-semibold text-ink">{data.name}</p>
          <p className="text-xs text-ink-muted">{data.title}</p>
        </div>
      </div>
    </section>
  )
}
