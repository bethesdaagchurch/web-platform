import type { CollectionConfig } from 'payload'

export const Groups: CollectionConfig = {
  slug: 'groups',
  admin: { useAsTitle: 'title', defaultColumns: ['title', 'category', 'schedule'] },
  access: { read: () => true },
  fields: [
    { name: 'title', type: 'text', localized: true, required: true },
    { name: 'slug', type: 'text', required: true, unique: true },
    { name: 'badgeLabel', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Young Adults", "Families", "Open to All"' } },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Worship', value: 'worship' },
        { label: 'Youth', value: 'youth' },
        { label: 'Care Groups', value: 'care-groups' },
        { label: 'Kids', value: 'kids' },
        { label: 'Care', value: 'care' },
      ],
      admin: { description: 'Drives the sidebar filter — the option set is fixed in code, matching the design.' },
    },
    { name: 'description', type: 'textarea', localized: true, required: true },
    { name: 'schedule', type: 'text', localized: true, required: true, admin: { description: 'e.g. "Tuesdays, 7:00 PM"' } },
    { name: 'location', type: 'text', localized: true, required: true },
    { name: 'leaderName', type: 'text', required: true },
    { name: 'leaderPhoto', type: 'upload', relationTo: 'media' },
    {
      name: 'contactEmail',
      type: 'email',
      required: true,
      admin: { description: 'Powers a real mailto: link on "Join Group" — no request-to-join backend exists, so this is the honest, functional middle ground.' },
    },
  ],
}
