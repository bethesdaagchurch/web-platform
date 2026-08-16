import type { GroupsQuoteData } from '@/types/groups'

export function GroupsQuote({ data }: { data: GroupsQuoteData }) {
  return (
    <div className="rounded-card border-l-4 border-brand-gold bg-surface-cream p-6">
      <p className="text-2xl text-black/20">&ldquo;</p>
      <p className="-mt-3 text-lg italic text-ink">&ldquo;{data.quote}&rdquo;</p>
      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-brand-gold">{data.reference}</p>
    </div>
  )
}
