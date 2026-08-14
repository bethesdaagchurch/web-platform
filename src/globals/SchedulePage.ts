import type { GlobalConfig } from 'payload'

export const SchedulePage: GlobalConfig = {
  slug: 'schedule-page',
  admin: {
    description: 'Content for /schedule — the Weekly Services list and Special Services (e.g. "First Fridays") are the parts most worth keeping current.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
      ],
    },
    {
      name: 'weeklyServices',
      type: 'array',
      minRows: 1,
      maxRows: 8,
      fields: [
        { name: 'name', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Sunday Morning"' } },
        { name: 'time', type: 'text', required: true, admin: { description: 'e.g. "9:00 AM"' } },
        {
          name: 'badgeLabel',
          type: 'select',
          required: true,
          options: [
            { label: 'In-Person', value: 'In-Person' },
            { label: 'Hybrid', value: 'Hybrid' },
          ],
        },
        { name: 'serviceTitle', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Traditional Liturgy"' } },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'location', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'quote',
      type: 'group',
      fields: [
        { name: 'quote', type: 'textarea', localized: true, required: true },
        { name: 'reference', type: 'text', required: true },
      ],
    },
    {
      name: 'specialServices',
      type: 'array',
      label: 'Special Services',
      minRows: 1,
      maxRows: 6,
      admin: { description: 'The part of this page most likely to need regular updates — e.g. "First Fridays," seasonal events.' },
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'schedule', type: 'text', localized: true, required: true, admin: { description: 'e.g. "1st Friday of every month, 8:00 PM"' } },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
  ],
}
