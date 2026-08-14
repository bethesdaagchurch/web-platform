import type { CollectionConfig } from 'payload'

export const PrayerRequests: CollectionConfig = {
  slug: 'prayer-requests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'isPrivate', 'status', 'createdAt'],
    description: 'Prayer request submissions. Readable only by CMS admins — there\u2019s no separate "prayer team" role modeled yet, so isPrivate is informational for triage rather than a second access tier.',
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    { name: 'firstName', type: 'text', required: true },
    { name: 'lastName', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'request', type: 'textarea', required: true },
    { name: 'isPrivate', type: 'checkbox', defaultValue: false, admin: { description: 'From the "Keep this request private" checkbox' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Praying', value: 'praying' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
  ],
}
