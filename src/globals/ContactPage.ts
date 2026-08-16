import type { GlobalConfig } from 'payload'

export const ContactPage: GlobalConfig = {
  slug: 'contact-page',
  admin: {
    description: 'Hero and form options for /contact. Address, phone, office hours, and map come from Site Settings instead — not duplicated here.',
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
      name: 'subjectOptions',
      type: 'array',
      label: 'Subject dropdown options',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
    {
      name: 'visit',
      type: 'group',
      fields: [
        { name: 'campusName', type: 'text', localized: true, required: true },
        { name: 'directionsHref', type: 'text', required: true },
      ],
    },
  ],
}
