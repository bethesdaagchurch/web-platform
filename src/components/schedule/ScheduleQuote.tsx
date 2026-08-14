import type { ScheduleQuoteData } from '@/types/schedule'

export function ScheduleQuote({ data }: { data: ScheduleQuoteData }) {
  return (
    <section className="mx-auto max-w-content px-6 py-12">
      <div className="rounded-card bg-surface-cream px-8 py-12 text-center">
        <p className="text-4xl font-serif text-black/15">&ldquo;</p>
        <p className="mx-auto -mt-4 max-w-xl text-xl font-medium text-ink">{data.quote}</p>
        <p className="mt-4 text-sm font-semibold text-brand-gold">{data.reference}</p>
      </div>
    </section>
  )
}
