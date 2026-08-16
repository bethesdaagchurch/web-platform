'use client'

import { useState } from 'react'
import Script from 'next/script'
import { useTranslations } from 'next-intl'
import { Lock, CheckCircle2 } from 'lucide-react'
import type { FundOption } from '@/types/give'

type GivingType = 'one-time' | 'recurring'

// Razorpay's checkout.js attaches this to window — no official types
// package for it, so this is the minimal shape this component actually
// uses rather than pulling in a full (and unofficial) types dependency.
declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => { open: () => void }
  }
}

export function GivingForm({
  presetAmounts,
  fundOptions,
}: {
  presetAmounts: readonly number[]
  fundOptions: FundOption[]
}) {
  const t = useTranslations('give')
  const [givingType, setGivingType] = useState<GivingType>('one-time')
  const [selectedAmount, setSelectedAmount] = useState<number | null>(presetAmounts[1] ?? presetAmounts[0])
  const [isCustom, setIsCustom] = useState(false)
  const [customAmount, setCustomAmount] = useState('')
  const [fund, setFund] = useState(fundOptions[0]?.value ?? '')

  const [donorName, setDonorName] = useState('')
  const [donorEmail, setDonorEmail] = useState('')
  const [donorPhone, setDonorPhone] = useState('')

  const [status, setStatus] = useState<'idle' | 'processing' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  function selectPreset(amount: number) {
    setSelectedAmount(amount)
    setIsCustom(false)
  }

  function selectCustom() {
    setIsCustom(true)
    setSelectedAmount(null)
  }

  const activeAmount = isCustom ? (customAmount ? Number(customAmount) : null) : selectedAmount
  const fundLabel = fundOptions.find((f) => f.value === fund)?.label ?? ''

  async function handlePayment() {
    if (!activeAmount || !donorName || !donorEmail) return
    setStatus('processing')
    setError(null)

    try {
      const orderRes = await fetch('/api/donations/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ amount: activeAmount, fund }),
      })

      if (!orderRes.ok) {
        setError(t('genericError'))
        setStatus('error')
        return
      }

      const order = await orderRes.json()

      const razorpay = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.orderId,
        name: 'Bethesda AG Church',
        description: `${fundLabel}${givingType === 'recurring' ? ' (Monthly)' : ''}`,
        prefill: { name: donorName, email: donorEmail, contact: donorPhone || undefined },
        theme: { color: '#0D3B66' },
        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
        }) => {
          try {
            const verifyRes = await fetch('/api/donations/verify', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                ...response,
                amount: activeAmount,
                fund: fundLabel,
                donorName,
                donorEmail,
                donorPhone,
              }),
            })

            if (!verifyRes.ok) {
              setError(t('genericError'))
              setStatus('error')
              return
            }

            setStatus('success')
          } catch {
            setError(t('genericError'))
            setStatus('error')
          }
        },
        modal: {
          // Razorpay's checkout is a popup the visitor can simply close
          // without paying (they changed their mind, picked the wrong
          // amount, etc.) — that's not an error, just a return to the
          // form exactly as they left it, not an error message.
          ondismiss: () => setStatus('idle'),
        },
      })

      razorpay.open()
    } catch {
      setError(t('genericError'))
      setStatus('error')
    }
  }

  if (status === 'success') {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <CheckCircle2 size={32} className="text-brand-navy" />
        <h2 className="text-xl font-semibold text-brand-navy-dark">{t('thankYouHeading')}</h2>
        <p className="text-sm text-ink-muted">{t('thankYouMessage')}</p>
        <button
          type="button"
          onClick={() => {
            setStatus('idle')
            setDonorName('')
            setDonorEmail('')
            setDonorPhone('')
          }}
          className="mt-2 rounded-md border border-black/15 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-cream"
        >
          {t('giveAgain')}
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
      <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />

      <h2 className="text-xl font-semibold text-brand-navy-dark">{t('secureGiving')}</h2>

      <div className="mt-5 grid grid-cols-2 gap-2">
        {(['one-time', 'recurring'] as const).map((type) => (
          <button
            key={type}
            type="button"
            onClick={() => setGivingType(type)}
            disabled={type === 'recurring'}
            title={type === 'recurring' ? 'Recurring giving is coming soon' : undefined}
            className={`rounded-md py-3 text-sm font-medium transition-colors ${
              givingType === type
                ? 'bg-brand-navy text-white'
                : 'border border-black/10 text-ink hover:bg-surface-cream disabled:cursor-not-allowed disabled:opacity-40'
            }`}
          >
            {type === 'one-time' ? t('oneTime') : t('recurring')}
          </button>
        ))}
      </div>

      <div className="mt-4 grid grid-cols-3 gap-2">
        {presetAmounts.map((amount) => (
          <button
            key={amount}
            type="button"
            onClick={() => selectPreset(amount)}
            className={`rounded-md py-3 text-sm font-medium transition-colors ${
              !isCustom && selectedAmount === amount
                ? 'bg-brand-navy text-white'
                : 'border border-black/10 text-ink hover:bg-surface-cream'
            }`}
          >
            ₹{amount}
          </button>
        ))}
        <button
          type="button"
          onClick={selectCustom}
          className={`rounded-md py-3 text-sm font-medium transition-colors ${
            isCustom ? 'bg-brand-navy text-white' : 'border border-black/10 text-ink hover:bg-surface-cream'
          }`}
        >
          {t('custom')}
        </button>
      </div>

      {isCustom && (
        <div className="mt-3">
          <label htmlFor="custom-amount" className="sr-only">
            {t('customAmount')}
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-ink-muted">₹</span>
            <input
              id="custom-amount"
              type="number"
              min="1"
              autoFocus
              value={customAmount}
              onChange={(e) => setCustomAmount(e.target.value)}
              placeholder={t('enterAmount')}
              className="w-full rounded-md border border-black/10 py-2.5 pl-7 pr-3 text-sm outline-none focus:border-brand-navy"
            />
          </div>
        </div>
      )}

      <div className="mt-5">
        <label htmlFor="fund" className="text-sm font-medium text-ink">
          {t('designateFund')}
        </label>
        <select
          id="fund"
          value={fund}
          onChange={(e) => setFund(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        >
          {fundOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4 grid gap-3 border-t border-black/5 pt-4">
        <div>
          <label htmlFor="donor-name" className="text-sm font-medium text-ink">
            {t('donorName')}
          </label>
          <input
            id="donor-name"
            type="text"
            required
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="donor-email" className="text-sm font-medium text-ink">
            {t('donorEmail')}
          </label>
          <input
            id="donor-email"
            type="email"
            required
            value={donorEmail}
            onChange={(e) => setDonorEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="donor-phone" className="text-sm font-medium text-ink">
            {t('donorPhone')}
          </label>
          <input
            id="donor-phone"
            type="tel"
            value={donorPhone}
            onChange={(e) => setDonorPhone(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      {activeAmount ? (
        <p className="mt-4 text-xs text-ink-muted">
          {t('givingPrefix')} <span className="font-semibold text-ink">₹{activeAmount}</span>{' '}
          {givingType === 'recurring' ? t('monthly') : t('once')} {t('givingTo')}{' '}
          <span className="font-semibold text-ink">{fundLabel}</span>.
        </p>
      ) : (
        <p className="mt-4 text-xs text-ink-muted">{t('chooseAmount')}</p>
      )}

      {error && (
        <p className="mt-3 rounded-md bg-red-50 px-3 py-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}

      <button
        type="button"
        onClick={handlePayment}
        disabled={!activeAmount || !donorName || !donorEmail || status === 'processing'}
        className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Lock size={14} /> {status === 'processing' ? t('processing') : t('continueToPayment')}
      </button>
    </div>
  )
}
