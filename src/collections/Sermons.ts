import type { CollectionConfig } from 'payload'
import { extractYoutubeVideoId } from '@/lib/youtube'

export const Sermons: CollectionConfig = {
  slug: 'sermons',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'speakerName', 'date'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    {
      name: 'seriesLabel',
      type: 'text',
      localized: true,
      required: true,
      admin: { description: 'e.g. "The Parables Series" or "Standalone Message" — shown as the gold eyebrow and used for the Series filter.' },
    },
    { name: 'description', type: 'textarea', localized: true, required: true },
    { name: 'scripture', type: 'text', required: true, admin: { description: 'e.g. "Luke 15:11-32"' } },
    {
      name: 'speakerName',
      type: 'text',
      required: true,
      admin: { description: 'Initials for the avatar badge are generated automatically from this name — no separate field needed.' },
    },
    { name: 'topic', type: 'text', localized: true, required: true, admin: { description: 'Free-text tag, e.g. "Grace", "Faith", "Comfort" — powers the Topic filter.' } },
    { name: 'date', type: 'date', required: true },
    { name: 'duration', type: 'text', required: true, admin: { description: 'e.g. "45:20"' } },
    { name: 'thumbnail', type: 'upload', relationTo: 'media', required: true },
    {
      name: 'youtubeUrl',
      type: 'text',
      required: true,
      validate: (value: string | null | undefined) => {
        if (!value) return 'A YouTube URL is required.'
        return extractYoutubeVideoId(value) ? true : 'Could not find a valid YouTube video in that URL \u2014 double check it was copied correctly.'
      },
      admin: {
        description: 'Paste the full YouTube URL for this sermon (whatever\u2019s in your browser\u2019s address bar or the "Share" button works) \u2014 not just the video ID.',
      },
    },
  ],
}
