import type { CollectionConfig } from 'payload'
import { sendTransactionalEmail } from '@/lib/send-transactional-email'

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
  hooks: {
    afterChange: [
      async ({ doc, operation }) => {
        // Only on the original submission — an admin later changing
        // status (New → Confirmed → Completed) shouldn't re-send this.
        if (operation !== 'create') return
        const visitDate = new Date(doc.dateOfVisit).toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
          year: 'numeric',
        })
        await sendTransactionalEmail({
          to: doc.email,
          toName: doc.firstName,
          subject: "We can't wait to meet you!",
          htmlContent: `
            <p>Dear ${doc.firstName},</p>
            <p>Thank you for letting us know you're planning to visit on <strong>${visitDate}</strong>. We're genuinely looking forward to it.</p>
            ${doc.wantsHost ? "<p>We'll have someone ready to greet you and help you feel at home from the moment you arrive.</p>" : ''}
            <p>If your plans change or you have any questions before then, just reach out — we're happy to help.</p>
            <p>See you soon,<br>Bethesda AG Church</p>
          `,
        })
      },
    ],
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
