import type { CollectionConfig } from 'payload'
import { sendTransactionalEmail } from '@/lib/send-transactional-email'

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
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Only on the original submission — an admin later changing
        // status (New → Praying → Resolved) shouldn't re-send this.
        if (operation !== 'create') return
        await sendTransactionalEmail({
          to: doc.email,
          toName: doc.firstName,
          subject: 'We received your prayer request',
          htmlContent: `
            <p>Dear ${doc.firstName},</p>
            <p>Thank you for sharing your prayer request with us. It means a lot that you trusted us with it, and we want you to know it's already in the hands of people who care and are praying for you.</p>
            <p>You're not carrying this alone.</p>
            <p>With care,<br>Bethesda AG Church</p>
          `,
        })
      },
    ],
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
