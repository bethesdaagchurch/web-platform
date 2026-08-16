import type { CollectionConfig } from 'payload'

export const VolunteerInterests: CollectionConfig = {
  slug: 'volunteer-interests',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['name', 'areaOfInterest', 'status', 'createdAt'],
    description: 'Submissions from the featured "high need" area\u2019s interest form on /volunteer. Admin-only.',
  },
  access: {
    create: () => true,
    read: ({ req }) => req.user?.collection === 'users',
    update: ({ req }) => req.user?.collection === 'users',
    delete: ({ req }) => req.user?.collection === 'users',
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'email', type: 'email', required: true },
    { name: 'areaOfInterest', type: 'text', required: true, admin: { description: 'The service area title this came from, e.g. "Bethesda Kids"' } },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Contacted', value: 'contacted' },
        { label: 'Placed', value: 'placed' },
      ],
    },
  ],
}
