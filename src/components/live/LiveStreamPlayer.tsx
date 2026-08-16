import type { LiveStreamData } from '@/types/live'

// Real embed: always shows whatever's currently live on the configured
// channel, falling back to the channel's most recent video automatically
// when nothing's live — no per-stream URL to update, ever. See
// LivePage.stream.youtubeChannelId for where the ID comes from.
export function LiveStreamPlayer({ data }: { data: LiveStreamData }) {
  return (
    <div className="overflow-hidden rounded-card bg-black">
      <div className="relative aspect-video w-full">
        <iframe
          src={`https://www.youtube.com/embed/live_stream?channel=${data.youtubeChannelId}&autoplay=0`}
          title={data.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      </div>
    </div>
  )
}
