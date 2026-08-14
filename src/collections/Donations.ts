import type { CollectionConfig } from 'payload'

export const Donations: CollectionConfig = {
  slug: 'donations',
  defaultSort: '-createdAt',
  admin: {
    useAsTitle: 'donorEmail',
    defaultColumns: ['donorName', 'amount', 'fund', 'createdAt'],
    description:
      'Real, verified donation records — only created after Razorpay\u2019s payment signature has been cryptographically checked server-side, so a record here means a payment genuinely succeeded, not just that a checkout was opened.',
  },
  access: {
    // Created only by the server-side verify route using the Local API
    // (which bypasses access control entirely) — this is deliberately
    // unreachable via the public REST/GraphQL API in both directions.
    create: () => false,
    read: ({ req }) => req.user?.collection === 'users',
    update: () => false,
    delete: () => false,
  },
  fields: [
    { name: 'amount', type: 'number', required: true, admin: { description: 'In rupees (\u20b9), not paise.' } },
    { name: 'fund', type: 'text', required: true },
    { name: 'donorName', type: 'text', required: true },
    { name: 'donorEmail', type: 'email', required: true },
    { name: 'donorPhone', type: 'text' },
    {
      name: 'member',
      type: 'relationship',
      relationTo: 'members',
      admin: { description: 'Set automatically when the donor happens to be logged in at the time of giving \u2014 giving itself is never member-gated.' },
    },
    { name: 'razorpayOrderId', type: 'text', required: true, unique: true },
    { name: 'razorpayPaymentId', type: 'text', required: true, unique: true },
  ],
}
