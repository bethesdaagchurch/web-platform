import type { GlobalConfig } from 'payload'

export const SermonsPage: GlobalConfig = {
  slug: 'sermons-page',
  admin: {
    description: 'Featured hero and podcast CTA for /sermons. The archive list itself lives in the Sermons collection.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true, defaultValue: 'Latest Message' },
        {
          name: 'featuredSermon',
          type: 'relationship',
          relationTo: 'sermons',
          required: true,
          admin: {
            description:
              'The sermon featured here and on the Homepage\u2019s "Latest Word" section. Its title, description, image, date, speaker, and video all come directly from the sermon itself \u2014 nothing to retype.',
          },
        },
      ],
    },
    {
      name: 'podcastCta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'links',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            { name: 'label', type: 'text', localized: true, required: true },
            { name: 'href', type: 'text', required: true },
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Headphones', value: 'headphones' },
                { label: 'Waveform', value: 'waveform' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
