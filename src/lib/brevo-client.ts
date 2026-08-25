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

// Fetches every contact on a given Brevo list — used by the daily digest
// cron (src/app/api/cron/send-digest/route.ts) to find who's subscribed
// to sermon notes or event reminders. Brevo paginates this endpoint at
// up to 500 per page; loops until a page comes back with fewer than the
// requested limit, rather than assuming a small church's subscriber
// count will always fit in one page.
export async function fetchBrevoListContacts(listId: string): Promise<{ email: string; firstName?: string }[]> {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) throw new Error('BREVO_API_KEY is not set.')

  const contacts: { email: string; firstName?: string }[] = []
  const limit = 500
  let offset = 0

  for (;;) {
    const res = await fetch(`https://api.brevo.com/v3/contacts/lists/${listId}/contacts?limit=${limit}&offset=${offset}`, {
      headers: { Accept: 'application/json', 'api-key': apiKey },
    })
    if (!res.ok) {
      const body = await res.text()
      throw new Error(`Brevo get list contacts failed: ${res.status} ${body}`)
    }
    const data = await res.json()
    const page: { email: string; attributes?: { FIRSTNAME?: string } }[] = data.contacts ?? []
    contacts.push(...page.map((c) => ({ email: c.email, firstName: c.attributes?.FIRSTNAME })))
    if (page.length < limit) break
    offset += limit
  }

  return contacts
}
