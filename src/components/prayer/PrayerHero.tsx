import Image from 'next/image'
import type { PrayerHeroData } from '@/types/prayer'

export function PrayerHero({ data }: { data: PrayerHeroData }) {
  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h1 className="text-4xl font-semibold text-brand-navy md:text-5xl">{data.heading}</h1>
          <blockquote className="mt-5 text-base italic text-ink-muted">
            &ldquo;{data.scriptureQuote}&rdquo; &mdash; {data.scriptureReference}
          </blockquote>
          <p className="mt-4 text-sm text-ink-muted">{data.description}</p>
        </div>
        <div className="overflow-hidden rounded-card">
          <Image
            src={data.image}
            alt="A person in prayer"
            width={800}
            height={520}
            className="h-80 w-full object-cover md:h-96"
          />
        </div>
      </div>
    </section>
  )
}
