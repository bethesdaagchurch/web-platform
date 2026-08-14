import type { VolunteerQuoteData } from '@/types/volunteer'

export function VolunteerQuote({ data }: { data: VolunteerQuoteData }) {
  return (
    <section className="bg-surface-cream px-6 py-16 text-center">
      <p className="text-4xl font-serif text-black/15">&ldquo;</p>
      <p className="mx-auto -mt-4 max-w-2xl text-2xl font-medium text-ink">{data.quote}</p>
      <p className="mt-4 text-sm font-semibold uppercase tracking-wide text-brand-gold">{data.reference}</p>
    </section>
  )
}
