import type { CollectionConfig } from 'payload'
import { sendTransactionalEmail } from '@/lib/send-transactional-email'

export const ContactSubmissions: CollectionConfig = {
  slug: 'contact-submissions',
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['firstName', 'lastName', 'subject', 'status', 'createdAt'],
    description: 'Contact form submissions. Contains PII — readable only by CMS admins via /admin, not exposed on the public API.',
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
        // status (New → In Progress → Resolved) shouldn't re-send this.
        if (operation !== 'create') return
        await sendTransactionalEmail({
          to: doc.email,
          toName: doc.firstName,
          subject: 'We received your message',
          htmlContent: `
            <p>Dear ${doc.firstName},</p>
            <p>Thank you for reaching out to us about "${doc.subject}." We've received your message and someone from our team will get back to you soon.</p>
            <p>If your question is urgent, feel free to reach out to us directly by phone in the meantime.</p>
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
    { name: 'subject', type: 'text', required: true },
    { name: 'message', type: 'textarea', required: true },
    {
      name: 'status',
      type: 'select',
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'In Progress', value: 'in-progress' },
        { label: 'Resolved', value: 'resolved' },
      ],
    },
  ],
}
