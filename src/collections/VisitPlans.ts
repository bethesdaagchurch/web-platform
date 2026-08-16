import type { CollectionConfig } from 'payload'

export const VisitPlans: CollectionConfig = {
  slug: 'visit-plans',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'dateOfVisit', 'status', 'createdAt'],
    description: 'Plan Your Visit submissions. Contains PII — admin-only, same as Contact and Prayer Requests.',
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
    { name: 'dateOfVisit', type: 'date', required: true },
    { name: 'numberInParty', type: 'text', required: true },
    { name: 'wantsHost', type: 'checkbox', defaultValue: false },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Confirmed', value: 'confirmed' },
        { label: 'Completed', value: 'completed' },
      ],
    },
  ],
}
