import { extractYoutubeVideoId } from '@/lib/youtube'

export function SermonVideoPlayer({ youtubeUrl, title }: { youtubeUrl: string; title: string }) {
  const videoId = extractYoutubeVideoId(youtubeUrl)

  if (!videoId) {
    // Shouldn't happen — the collection's own field validation rejects an
    // unparseable URL before it can ever be saved — but a broken embed is
    // a worse failure mode than a plain, honest message.
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-card bg-black text-sm text-white/60">
        Video unavailable
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-card bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
