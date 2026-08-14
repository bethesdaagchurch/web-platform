import type { LiveStreamData } from '@/types/live'

export function LiveHero({ data }: { data: LiveStreamData }) {
  return (
    <div className="mx-auto max-w-content px-6 pt-10">
      {data.isLive && (
        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600">
          <span className="h-1.5 w-1.5 rounded-full bg-red-500" /> {data.liveLabel}
        </span>
      )}
      <h1 className="mt-3 text-4xl font-semibold text-brand-navy md:text-5xl">{data.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {data.speaker} &middot; {data.bookReference}
      </p>
    </div>
  )
}
