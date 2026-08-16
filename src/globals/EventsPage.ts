import type { GlobalConfig } from 'payload'

export const EventsPage: GlobalConfig = {
  slug: 'events-page',
  admin: {
    description: 'Hero, Community Focus, and newsletter CTA for /events. The event list and calendar are driven by the Events collection instead.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'badge', type: 'text', localized: true, required: true },
        {
          name: 'featuredEvent',
          type: 'relationship',
          relationTo: 'events',
          required: true,
          admin: {
            description:
              'The event this hero promotes. Its title, description, image, and registration link are pulled directly from the event itself \u2014 nothing to retype, and nothing that can drift out of sync or point to the wrong place.',
          },
        },
      ],
    },
    {
      name: 'communityFocus',
      type: 'array',
      minRows: 1,
      maxRows: 6,
      fields: [
        { name: 'title', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        { name: 'image', type: 'upload', relationTo: 'media', required: true },
        { name: 'linkLabel', type: 'text', localized: true, required: true },
        { name: 'href', type: 'text', required: true },
      ],
    },
    {
      name: 'newsletterCta',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
        { name: 'placeholder', type: 'text', localized: true, required: true },
        { name: 'buttonLabel', type: 'text', localized: true, required: true },
      ],
    },
  ],
}
