import type { GlobalConfig } from 'payload'
import { extractYoutubeChannelId, extractYoutubeVideoId } from '@/lib/youtube'

export const LivePage: GlobalConfig = {
  slug: 'live-page',
  admin: {
    description:
      'Content for /live. The "stream" fields (title, speaker, live status, current video, sermon notes) are meant to be updated weekly. Chat uses YouTube\u2019s own embedded live chat (see currentLiveVideoUrl below) rather than a custom backend \u2014 there is no site-hosted chat data to manage here.',
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
        {
          name: 'currentLiveVideoUrl',
          type: 'text',
          validate: (value: string | null | undefined) => {
            if (!value) return true
            return extractYoutubeVideoId(value)
              ? true
              : 'Could not find a valid video \u2014 paste the full URL of your live stream (e.g. from the Share button or address bar while it\u2019s live).'
          },
          admin: {
            description:
              'Optional, and unlike the Channel ID above, this DOES need updating \u2014 paste the URL of this week\u2019s specific live stream here to enable the live chat panel on the page. YouTube\u2019s chat embed needs the exact video, not just the channel, so there\u2019s no way to automate this without a separate YouTube API integration. Leave blank when not live \u2014 the page shows a plain "chat isn\u2019t open right now" message instead of a broken embed.',
          },
        },
        { name: 'liveLabel', type: 'text', localized: true, required: true, defaultValue: 'Live Now' },
        { name: 'title', type: 'text', localized: true, required: true, admin: { description: 'This week\u2019s sermon title' } },
        { name: 'speaker', type: 'text', required: true },
        { name: 'bookReference', type: 'text', localized: true, required: true },
        {
          name: 'sermonNotes',
          type: 'textarea',
          localized: true,
          admin: {
            description:
              'Optional. This week\u2019s sermon notes/outline, shown in the tab next to chat. Leave blank if notes aren\u2019t ready yet \u2014 the page shows an honest "not posted yet" message rather than stale or fake content.',
          },
        },
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
