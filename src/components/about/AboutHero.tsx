import { Button } from '@/components/ui/Button'
import type { AboutHeroData } from '@/types/about'

export function AboutHero({ data }: { data: AboutHeroData }) {
  return (
    <section className="bg-surface-cream/60 px-6 py-20 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{data.eyebrow}</p>
      <h1 className="mx-auto mt-3 max-w-2xl whitespace-pre-line text-4xl font-semibold leading-tight text-brand-navy-dark md:text-5xl">
        {data.heading}
      </h1>
      <p className="mx-auto mt-4 max-w-xl text-sm text-ink-muted">{data.subtext}</p>
      <div className="mt-6 flex justify-center">
        <Button href={data.ctaHref} variant="primary">
          {data.ctaLabel}
        </Button>
      </div>
    </section>
  )
}
