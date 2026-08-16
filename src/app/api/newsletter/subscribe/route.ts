import { NextRequest, NextResponse } from 'next/server'

// Brevo's dedicated double opt-in endpoint — distinct from their plain
// "create contact" endpoint. This one requires a templateId (the
// confirmation email, built in Brevo's own dashboard) and a
// redirectionUrl (where the visitor lands after clicking the confirm
// link in that email) — Brevo handles sending the email and the actual
// list addition entirely on their end once confirmed.
const BREVO_DOUBLE_OPTIN_URL = 'https://api.brevo.com/v3/contacts/doubleOptinConfirmation'

export async function POST(request: NextRequest) {
  const apiKey = process.env.BREVO_API_KEY
  if (!apiKey) {
    // A missing key is a deployment/config problem, not a user error —
    // logged server-side for whoever's debugging, not exposed to the
    // visitor beyond a generic message.
    console.error('BREVO_API_KEY is not set — newsletter subscription cannot be processed.')
    return NextResponse.json({ error: 'Newsletter subscription is not currently available.' }, { status: 500 })
  }

  const listId = Number(process.env.BREVO_LIST_ID ?? '3')
  const templateId = Number(process.env.BREVO_TEMPLATE_ID ?? '1')

  let body: { email?: string; firstName?: string; locale?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { email, firstName, locale } = body
  if (!email || typeof email !== 'string') {
    return NextResponse.json({ error: 'A valid email address is required.' }, { status: 400 })
  }

  // Built from the incoming request's own host rather than a hardcoded
  // domain or a new env var — works correctly across local dev, Vercel
  // preview URLs, staging, and production without needing separate
  // configuration for each. Locale-aware so a Tamil or Kannada visitor
  // who confirms lands on the matching version of the thank-you page.
  const origin = request.nextUrl.origin
  const localePrefix = locale && locale !== 'en' ? `/${locale}` : ''
  const redirectionUrl = `${origin}${localePrefix}/newsletter-confirmed`

  try {
    const brevoRes = await fetch(BREVO_DOUBLE_OPTIN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        'api-key': apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: firstName ? { FIRSTNAME: firstName } : undefined,
        includeListIds: [listId],
        templateId,
        redirectionUrl,
      }),
    })

    if (!brevoRes.ok) {
      const errorBody = await brevoRes.json().catch(() => null)
      console.error('Brevo double opt-in request failed:', brevoRes.status, errorBody)
      return NextResponse.json({ error: 'Could not process your subscription. Please try again.' }, { status: 502 })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Brevo double opt-in request threw:', err)
    return NextResponse.json({ error: 'Could not process your subscription. Please try again.' }, { status: 502 })
  }
}
