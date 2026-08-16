import type { GlobalConfig } from 'payload'

export const Homepage: GlobalConfig = {
  slug: 'homepage',
  admin: {
    description: 'Content for the public homepage. Sections that pull from other collections (Latest Sermons, Upcoming Events, Find Your Place / Ministries) live in those collections instead, once built.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badgeText', type: 'text', localized: true, required: true },
        {
          name: 'heading',
          type: 'textarea',
          localized: true,
          required: true,
          admin: {
            description: 'A line break here becomes a visual line break on the homepage (e.g. "A Place to Belong," on one line, "A Place to Grow" on the next).',
          },
        },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
        { name: 'primaryButtonLabel', type: 'text', localized: true, required: true },
        { name: 'primaryButtonHref', type: 'text', required: true },
        { name: 'secondaryButtonLabel', type: 'text', localized: true, required: true },
        { name: 'secondaryButtonHref', type: 'text', required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
        {
          name: 'backgroundVideo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional. A short (5\u201315s), muted, looping clip to play instead of the still image above. The image is still required \u2014 it\u2019s used as the video\u2019s poster frame while it loads, and shown instead of the video entirely for visitors with a reduced-motion preference set on their device. Upload as MP4 (H.264) \u2014 the safest, most broadly compatible format.',
          },
        },
        {
          name: 'backgroundVideoWebm',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description:
              'Optional. The same clip as above, encoded as WebM (VP9) \u2014 typically a smaller file at equivalent quality. When present, browsers that support WebM use this instead of the MP4; every browser still falls back to the MP4 automatically if this is left blank or if WebM isn\u2019t supported.',
          },
        },
      ],
    },
    {
      name: 'quickLinks',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Watch (video)', value: 'watch' },
            { label: 'Calendar', value: 'calendar' },
            { label: 'Give (heart/hands)', value: 'give' },
            { label: 'Prayer (mail)', value: 'prayer' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'serviceTimes',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'time', type: 'text', required: true, admin: { description: 'e.g. "8:00 AM"' } },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'pastorWelcome',
      type: 'group',
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true },
        { name: 'eyebrow', type: 'text', localized: true, required: true },
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'quote', type: 'textarea', localized: true, required: true },
        { name: 'name', type: 'text', required: true },
        { name: 'title', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'givingBreakdown',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'label', type: 'text', localized: true, required: true },
        { name: 'percentage', type: 'number', required: true, min: 0, max: 100 },
      ],
    },
  ],
}
