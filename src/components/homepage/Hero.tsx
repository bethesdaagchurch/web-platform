import { PlayCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { HeroBackground } from '@/components/homepage/HeroBackground'
import type { HeroData } from '@/types/homepage'

export function Hero({ data }: { data: HeroData }) {
  return (
    <section className="relative isolate flex min-h-[520px] items-end overflow-hidden">
      <HeroBackground
        backgroundImage={data.backgroundImage}
        backgroundVideo={data.backgroundVideo}
        backgroundVideoWebm={data.backgroundVideoWebm}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-navy-dark/90 via-brand-navy-dark/50 to-brand-navy-dark/20" />

      <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-14">
        <span className="mb-4 inline-block rounded-full bg-brand-gold-light px-3 py-1 text-xs font-semibold text-brand-navy-dark">
          {data.badgeText}
        </span>

        <h1 className="max-w-xl whitespace-pre-line text-4xl font-semibold leading-tight text-white md:text-5xl">
          {data.heading}
        </h1>

        <p className="mt-4 max-w-lg text-sm text-white/85 md:text-base">{data.subtext}</p>

        <div className="mt-6 flex flex-wrap gap-3">
          <Button href={data.primaryButton.href} variant="primary">
            {data.primaryButton.label}
          </Button>
          <Button href={data.secondaryButton.href} variant="secondary" icon={<PlayCircle size={16} />}>
            {data.secondaryButton.label}
          </Button>
        </div>
      </div>
    </section>
  )
}
