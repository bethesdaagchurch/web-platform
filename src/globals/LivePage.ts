import type { GlobalConfig } from 'payload'
import { extractYoutubeChannelId } from '@/lib/youtube'

export const LivePage: GlobalConfig = {
  slug: 'live-page',
  admin: {
    description: 'Content for /live. The "stream" fields (title, speaker, live status) are meant to be updated weekly. Sample chat messages and sermon notes are NOT here on purpose — that\u2019s decorative placeholder UI for a chat feature with no real backend yet; putting fake messages in the CMS would only confuse editors about what\u2019s real.',
  },
  fields: [
    {
      name: 'stream',
      type: 'group',
      fields: [
        {
          name: 'isLive',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Purely decorative now — controls only the "Live Now" badge/label text below. The video itself always shows whatever\u2019s actually live on your channel automatically (or your most recent stream when nothing\u2019s live), so this can\u2019t drift out of sync with reality the way it used to.',
          },
        },
        {
          name: 'youtubeChannelId',
          type: 'text',
          required: true,
          validate: (value: string | null | undefined) => {
            if (!value) return 'A YouTube Channel ID is required.'
            return extractYoutubeChannelId(value)
              ? true
              : 'Could not find a valid Channel ID \u2014 it should start with "UC". Find yours in YouTube Studio under Settings > Channel > Advanced settings, or paste the full /channel/UC... URL.'
          },
          admin: {
            description:
              'Your YouTube Channel ID (starts with "UC") \u2014 not your @handle. The player automatically shows whatever\u2019s currently live on this channel, with zero need to update this per stream.',
          },
        },
        { name: 'liveLabel', type: 'text', localized: true, required: true, defaultValue: 'Live Now' },
        { name: 'title', type: 'text', localized: true, required: true, admin: { description: 'This week\u2019s sermon title' } },
        { name: 'speaker', type: 'text', required: true },
        { name: 'bookReference', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'onlineGiving',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'buttonLabel', type: 'text', localized: true, required: true },
        { name: 'buttonHref', type: 'text', required: true },
      ],
    },
    {
      name: 'inPerson',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        {
          name: 'serviceTimes',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'time', type: 'text', required: true },
          ],
        },
        { name: 'directionsLabel', type: 'text', localized: true, required: true },
        { name: 'directionsHref', type: 'text', required: true },
      ],
    },
  ],
}
