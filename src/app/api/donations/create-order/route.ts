import { NextRequest, NextResponse } from 'next/server'

const RAZORPAY_ORDERS_URL = 'https://api.razorpay.com/v1/orders'

export async function POST(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keyId || !keySecret) {
    console.error('RAZORPAY_KEY_ID / RAZORPAY_KEY_SECRET are not set — cannot create an order.')
    return NextResponse.json({ error: 'Giving is not currently available.' }, { status: 500 })
  }

  let body: { amount?: number; fund?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 })
  }

  const { amount, fund } = body
  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return NextResponse.json({ error: 'A valid amount is required.' }, { status: 400 })
  }

  // Razorpay's API takes amounts in paise (the smallest currency unit),
  // not rupees — ₹500 is 50000. Rounded and floored defensively so a
  // fractional-rupee amount (shouldn't happen given the form's inputs,
  // but worth guarding) can't produce an invalid paise value.
  const amountInPaise = Math.round(amount * 100)

  try {
    const authHeader = 'Basic ' + Buffer.from(`${keyId}:${keySecret}`).toString('base64')
    const res = await fetch(RAZORPAY_ORDERS_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify({
        amount: amountInPaise,
        currency: 'INR',
        // Razorpay requires a receipt under 40 characters — this is just
        // an internal reference visible in their dashboard, not shown to
        // the donor.
        receipt: `don_${Date.now()}`,
        notes: fund ? { fund } : undefined,
      }),
    })

    if (!res.ok) {
      const errorBody = await res.json().catch(() => null)
      console.error('Razorpay order creation failed:', res.status, errorBody)
      return NextResponse.json({ error: 'Could not start your donation. Please try again.' }, { status: 502 })
    }

    const order = await res.json()
    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId, // Safe to return — this is the public identifier, never the secret.
    })
  } catch (err) {
    console.error('Razorpay order creation threw:', err)
    return NextResponse.json({ error: 'Could not start your donation. Please try again.' }, { status: 502 })
  }
}
