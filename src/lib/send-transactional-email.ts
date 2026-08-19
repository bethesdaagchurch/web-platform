// Sends a single transactional email via Brevo's general transactional
// endpoint, with inline subject/HTML rather than a Brevo template — see
// the newsletter's double opt-in flow (src/app/api/newsletter/subscribe)
// for the template-based alternative used there.
//
// Failures here are swallowed by design, not thrown — a failed
// confirmation email should never make a form submission that actually
// succeeded look like it failed to the person filling it out. Errors are
// still logged server-side so they're visible in Vercel's logs.

const BREVO_TRANSACTIONAL_EMAIL_URL = 'https://api.brevo.com/v3/smtp/email'

export async function sendTransactionalEmail({
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
    console.error('BREVO_API_KEY or BREVO_SENDER_EMAIL is not set — confirmation email not sent.')
    return
  }

  try {
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
      console.error('Brevo transactional email failed:', res.status, body)
    }
  } catch (err) {
    console.error('Brevo transactional email request failed:', err)
  }
}
