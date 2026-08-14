import type { GlobalConfig } from 'payload'

export const PrayerPage: GlobalConfig = {
  slug: 'prayer-page',
  admin: {
    description: 'Content for /prayer. The request form itself stays code-owned (see the caveat in PrayerForm.tsx about real submissions needing their own collection later).',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'scriptureQuote', type: 'textarea', localized: true, required: true },
        { name: 'scriptureReference', type: 'text', required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
      ],
    },
    {
      name: 'prayerTeam',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'avatarImages',
          type: 'array',
          minRows: 1,
          maxRows: 6,
          fields: [{ name: 'image', type: 'upload', relationTo: 'media', required: true }],
        },
        { name: 'additionalCount', type: 'number', required: true, min: 0 },
      ],
    },
    {
      name: 'intercedeCard',
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
