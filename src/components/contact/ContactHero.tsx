import type { ContactHeroData } from '@/types/contact'

export function ContactHero({ data }: { data: ContactHeroData }) {
  return (
    <section className="bg-surface-cream/60 px-6 py-16 text-center">
      <h1 className="mx-auto max-w-xl text-4xl font-semibold text-brand-navy-dark md:text-5xl">{data.heading}</h1>
      <p className="mx-auto mt-4 max-w-lg text-sm text-ink-muted">{data.subtext}</p>
    </section>
  )
}
