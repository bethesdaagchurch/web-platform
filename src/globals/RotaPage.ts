import type { GlobalConfig } from 'payload'

export const RotaPage: GlobalConfig = {
  slug: 'rota-page',
  admin: {
    description: 'Content for the members-only /ministries/rota page. The "Worship Rota – [Month]" heading is generated from the selected month filter, not stored here.',
  },
  fields: [
    { name: 'eyebrow', type: 'text', localized: true, required: true, defaultValue: 'Ministry Schedule' },
    {
      name: 'worshipGuidelines',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'linkLabel', type: 'text', localized: true, required: true },
        { name: 'linkHref', type: 'text', required: true },
      ],
    },
  ],
}
