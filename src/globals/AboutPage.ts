import type { GlobalConfig } from 'payload'

export const AboutPage: GlobalConfig = {
  slug: 'about-page',
  admin: {
    description: 'Hero, Core Values, and Journey timeline for /about. Leadership team lives in the Leadership collection instead.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'eyebrow', type: 'text', localized: true, required: true },
        {
          name: 'heading',
          type: 'textarea',
          localized: true,
          required: true,
          admin: { description: 'A line break here becomes a visual line break on the page.' },
        },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
        { name: 'ctaLabel', type: 'text', localized: true, required: true },
        { name: 'ctaHref', type: 'text', required: true },
      ],
    },
    {
      name: 'coreValues',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Book (Biblical Truth)', value: 'book' },
            { label: 'Heart (Love)', value: 'heart' },
            { label: 'Community', value: 'community' },
            { label: 'Globe (Mission)', value: 'globe' },
          ],
        },
        {
          name: 'accent',
          type: 'select',
          required: true,
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Gold', value: 'gold' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'journey',
      type: 'array',
      label: 'Journey timeline',
      minRows: 1,
      fields: [
        { name: 'year', type: 'text', required: true },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'dotAccent',
          type: 'select',
          required: true,
          options: [
            { label: 'Blue', value: 'blue' },
            { label: 'Gold', value: 'gold' },
          ],
        },
      ],
    },
  ],
}
