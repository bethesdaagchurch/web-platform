import type { GiveHeroData } from '@/types/give'

export function GiveHero({ data }: { data: GiveHeroData }) {
  return (
    <section className="bg-surface-cream/60 px-6 py-16 text-center">
      <h1 className="mx-auto max-w-xl text-4xl font-semibold text-brand-navy-dark md:text-5xl">{data.heading}</h1>
      <p className="mx-auto mt-5 max-w-xl text-base italic text-ink-muted">{data.quote}</p>
      <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-brand-gold">{data.reference}</p>
    </section>
  )
}
