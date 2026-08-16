import type { MinistryHeroData } from '@/types/ministries'

export function MinistriesHero({ data }: { data: MinistryHeroData }) {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-surface-cream via-blue-50/40 to-surface-cream px-6 py-20 text-center">
      <div className="relative mx-auto max-w-2xl">
        <h1 className="text-4xl font-semibold text-brand-navy-dark md:text-5xl">{data.heading}</h1>
        <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">{data.subtext}</p>
      </div>
    </section>
  )
}
