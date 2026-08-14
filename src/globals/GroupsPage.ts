import type { GlobalConfig } from 'payload'

export const GroupsPage: GlobalConfig = {
  slug: 'groups-page',
  admin: {
    description: 'Content for /groups. The category sidebar and "Filters" button are structural/code-owned, matching the Groups collection\u2019s fixed category options.',
  },
  fields: [
    {
      name: 'hero',
      type: 'group',
      fields: [
        { name: 'heading', type: 'text', localized: true, required: true },
        { name: 'subtext', type: 'textarea', localized: true, required: true },
        { name: 'searchPlaceholder', type: 'text', localized: true, required: true },
        { name: 'backgroundImage', type: 'upload', relationTo: 'media', required: true },
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
  ],
}
