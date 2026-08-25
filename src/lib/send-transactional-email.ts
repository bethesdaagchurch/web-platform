// Sends a single transactional email via Brevo's general transactional
// endpoint, with inline subject/HTML rather than a Brevo template — see
// the newsletter's double opt-in flow (src/app/api/newsletter/subscribe)
// for the template-based alternative used there.
//
// Failures here are swallowed by design, not thrown — a failed
// confirmation email should never make a form submission that actually
// succeeded look like it failed to the person filling it out. Errors are
// still logged server-side so they're visible in Vercel's logs. Contrast
// with the Payload email adapter (brevo-email-adapter.ts), which uses the
// same underlying call but deliberately lets failures propagate instead.

import { callBrevoTransactionalAPI } from './brevo-client'

export async function sendTransactionalEmail(args: {
  to: string
  toName?: string
  subject: string
  htmlContent: string
}): Promise<void> {
  try {
    await callBrevoTransactionalAPI(args)
  } catch (err) {
    console.error('Confirmation email not sent:', err)
  }
}

