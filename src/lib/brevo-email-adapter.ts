// A custom Payload EmailAdapter, wrapping Brevo's transactional API
// directly rather than SMTP — Payload's EmailAdapter interface is generic
// (see node_modules/payload/dist/email/types.d.ts: just defaultFromAddress,
// defaultFromName, name, and a sendEmail function), not tied to any
// particular transport. @payloadcms/email-nodemailer is just one
// implementation of this same shape; this is another.
//
// Deliberately lets failures throw, unlike sendTransactionalEmail — traced
// directly in Payload's own forgotPassword operation source
// (node_modules/payload/dist/auth/operations/forgotPassword.js): sendEmail
// is awaited with no inner try/catch, so a thrown error correctly fails
// the whole operation rather than silently reporting success while no
// email actually went out. For a password reset specifically, staying
// silent would leave someone waiting indefinitely for an email that never
// arrives, with no signal anything went wrong.

import type { EmailAdapter } from 'payload'
import { callBrevoTransactionalAPI } from './brevo-client'

function extractRecipientEmail(to: unknown): string {
  if (typeof to === 'string') return to
  if (Array.isArray(to)) return extractRecipientEmail(to[0])
  if (to && typeof to === 'object' && 'address' in to) return String((to as { address: string }).address)
  throw new Error('Could not determine a recipient email address from Payload\u2019s sendEmail call.')
}

export const brevoEmailAdapter: EmailAdapter = () => ({
  name: 'brevo-transactional',
  defaultFromAddress: process.env.BREVO_SENDER_EMAIL || 'noreply@example.com',
  defaultFromName: process.env.BREVO_SENDER_NAME || 'Bethesda AG Church',
  sendEmail: async (message) => {
    await callBrevoTransactionalAPI({
      to: extractRecipientEmail(message.to),
      subject: typeof message.subject === 'string' ? message.subject : '',
      htmlContent: typeof message.html === 'string' ? message.html : String(message.text ?? ''),
    })
  },
})
