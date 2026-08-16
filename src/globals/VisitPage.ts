import type { GlobalConfig } from 'payload'

export const VisitPage: GlobalConfig = {
  slug: 'visit-page',
  admin: {
    description: 'Content for /visit. The form itself (fields, dropdown options) stays code-owned — only the surrounding editorial content lives here.',
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
      name: 'whatToExpect',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        {
          name: 'icon',
          type: 'select',
          required: true,
          options: [
            { label: 'Parking', value: 'parking' },
            { label: 'Kids', value: 'kids' },
            { label: 'Coffee', value: 'coffee' },
          ],
        },
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
      ],
    },
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
  ],
}
