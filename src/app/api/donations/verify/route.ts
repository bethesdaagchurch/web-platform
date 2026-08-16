import crypto from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    console.error('RAZORPAY_KEY_SECRET is not set — cannot verify payment.')
    return NextResponse.json({ error: 'Giving is not currently available.' }, { status: 500 })
  }

  let body: {
    razorpay_order_id?: string
    razorpay_payment_id?: string
    razorpay_signature?: string
    amount?: number
    fund?: string
    donorName?: string
    donorEmail?: string
    donorPhone?: string
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, amount, fund, donorName, donorEmail, donorPhone } = body

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !amount || !fund || !donorName || !donorEmail) {
    return NextResponse.json({ error: 'Missing required payment details.' }, { status: 400 })
  }

  // The actual proof of payment: Razorpay signs order_id + "|" + payment_id
  // with the account's secret key. Recomputing that signature here and
  // comparing it against what the client sent is what genuinely confirms
  // this payment happened — the client-side "success" callback alone
  // proves nothing, since it's just JavaScript a visitor's browser ran.
  const expectedSignature = crypto
    .createHmac('sha256', keySecret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest('hex')

  const expectedBuffer = Buffer.from(expectedSignature)
  const actualBuffer = Buffer.from(razorpay_signature)

  // Timing-safe comparison rather than === — standard practice for
  // comparing security-sensitive values, even though a practical timing
  // attack against this specific HMAC check is a stretch. Buffers must be
  // equal length for timingSafeEqual, so a length mismatch (which would
  // throw) is treated as an immediate, unambiguous failure.
  const isValid =
    expectedBuffer.length === actualBuffer.length && crypto.timingSafeEqual(expectedBuffer, actualBuffer)

  if (!isValid) {
    console.error('Razorpay signature verification failed for order', razorpay_order_id)
    return NextResponse.json({ error: 'Payment verification failed.' }, { status: 400 })
  }

  try {
    const payload = await getPayloadClient()
    const member = await getCurrentMember()

    // Checked explicitly rather than just attempting the create and
    // catching a unique-constraint failure: if the client-side handler
    // ever fires twice for the same payment (a network retry, etc.),
    // this is the same payment being recorded again, not a genuine
    // failure — and the donor shouldn't see "we had trouble recording
    // it" for something that actually succeeded the first time.
    const existing = await payload.find({
      collection: 'donations',
      where: { razorpayPaymentId: { equals: razorpay_payment_id } },
      limit: 1,
    })

    if (existing.docs.length === 0) {
      await payload.create({
        collection: 'donations',
        data: {
          amount,
          fund,
          donorName,
          donorEmail,
          donorPhone: donorPhone || undefined,
          member: member?.id,
          razorpayOrderId: razorpay_order_id,
          razorpayPaymentId: razorpay_payment_id,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    // The payment itself already succeeded and is verified at this point
    // — a failure here is a record-keeping problem, not a payment
    // problem, so it's logged clearly for follow-up rather than shown to
    // the donor as if their payment failed.
    console.error('Payment verified but failed to record donation:', err)
    return NextResponse.json({ error: 'Your payment succeeded, but we had trouble recording it. Please contact us.' }, { status: 500 })
  }
}
