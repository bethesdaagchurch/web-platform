import type { GlobalConfig } from 'payload'

export const MinistriesPage: GlobalConfig = {
  slug: 'ministries-page',
  admin: {
    description: 'Hero and Small Groups section for /ministries. Individual ministries live in the Ministries collection instead.',
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
      name: 'smallGroups',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'description', type: 'textarea', localized: true, required: true },
        {
          name: 'features',
          type: 'array',
          minRows: 1,
          maxRows: 4,
          fields: [
            {
              name: 'icon',
              type: 'select',
              required: true,
              options: [
                { label: 'Discussion', value: 'discussion' },
                { label: 'Support', value: 'support' },
              ],
            },
            { name: 'title', type: 'text', localized: true, required: true },
            { name: 'description', type: 'text', localized: true, required: true },
          ],
        },
      ],
    },
    {
      name: 'areaOfInterestOptions',
      type: 'array',
      label: 'Area of Interest dropdown options (Interested in Leading? form)',
      minRows: 1,
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'label', type: 'text', localized: true, required: true },
      ],
    },
  ],
}
