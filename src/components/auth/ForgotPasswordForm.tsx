'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, ArrowLeft, AlertCircle } from 'lucide-react'
import { Link } from '@/i18n/navigation'

// Real forgot-password flow now — posts to Payload's auto-generated
// /api/members/forgot-password. Payload's own operation deliberately
// never reveals whether an email exists in the system (a standard,
// deliberate security practice against account enumeration) — so a
// non-network-error response always shows the same "check your email"
// message regardless of whether that address is actually registered.
// Distinct from that: if the request itself fails (the Brevo email
// adapter genuinely couldn't send — see brevo-email-adapter.ts, which
// deliberately lets that failure propagate rather than staying silent),
// this shows a clearly different, honest "we couldn't send that" message
// with the church's real contact info as a fallback, rather than
// claiming success for something that didn't happen.
export function ForgotPasswordForm({ contactPhone, contactEmail }: { contactPhone: string; contactEmail: string }) {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'sent' | 'failed'>('idle')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/members/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setStatus(res.ok ? 'sent' : 'failed')
    } catch {
      setStatus('failed')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'sent') {
    return (
      <div className="w-[360px] rounded-card bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm sm:w-96">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-light">
          <Mail size={20} className="text-brand-navy-dark" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-brand-navy-dark">{t('checkYourEmailHeading')}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t('checkYourEmailMessage')}</p>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
        >
          <ArrowLeft size={14} /> {t('backToSignIn')}
        </Link>
      </div>
    )
  }

  if (status === 'failed') {
    return (
      <div className="w-[360px] rounded-card bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm sm:w-96">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={20} className="text-red-600" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-brand-navy-dark">{t('sendFailedHeading')}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t('sendFailedMessage')}</p>
        <div className="mt-4 space-y-1 text-sm font-medium text-brand-navy">
          <p>{contactPhone}</p>
          <p>{contactEmail}</p>
        </div>
        <button
          type="button"
          onClick={() => setStatus('idle')}
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
        >
          <ArrowLeft size={14} /> {t('backToSignIn')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-[360px] rounded-card bg-white/95 p-6 shadow-lg backdrop-blur-sm sm:w-96">
      <label htmlFor="forgot-password-email" className="text-sm font-medium text-ink">
        {tCommon('emailAddress')}
      </label>
      <div className="relative mt-1.5">
        <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id="forgot-password-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md bg-brand-navy py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('resetting') : t('sendResetLink')}
      </button>

      <Link
        href="/login"
        className="mt-4 flex items-center justify-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
      >
        <ArrowLeft size={14} /> {t('backToSignIn')}
      </Link>
    </form>
  )
}
