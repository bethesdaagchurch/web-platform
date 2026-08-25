// Low-level Brevo transactional email call, shared by:
//  - sendTransactionalEmail (src/lib/send-transactional-email.ts) — swallows
//    failures, used for Prayer Request/Visit Plan confirmations, where a
//    failed email must never make an already-successful form submission
//    look broken.
//  - the Payload email adapter (src/lib/brevo-email-adapter.ts) — lets
//    failures propagate, used for password reset, where staying silent
//    would leave someone waiting forever for an email that never arrives.
//
// This function itself always throws on failure — it's each caller's own
// job to decide whether to catch that or let it propagate further.

const BREVO_TRANSACTIONAL_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email'

export async function callBrevoTransactionalAPI({
  to,
  toName,
  subject,
  htmlContent,
}: {
  to: string
  toName?: string
  subject: string
  htmlContent: string
}): Promise<void> {
  const apiKey = process.env.BREVO_API_KEY
  const senderEmail = process.env.BREVO_SENDER_EMAIL
  const senderName = process.env.BREVO_SENDER_NAME || 'Bethesda AG Church'

  if (!apiKey || !senderEmail) {
    throw new Error('BREVO_API_KEY or BREVO_SENDER_EMAIL is not set.')
  }

  const res = await fetch(BREVO_TRANSACTIONAL_EMAIL_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      'api-key': apiKey,
    },
    body: JSON.stringify({
      sender: { email: senderEmail, name: senderName },
      to: [{ email: to, name: toName }],
      subject,
      htmlContent,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    throw new Error(`Brevo transactional email failed: ${res.status} ${body}`)
  }
}
