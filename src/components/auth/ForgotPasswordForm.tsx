'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, ArrowLeft, Info } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export function ForgotPasswordForm({ contactPhone, contactEmail }: { contactPhone: string; contactEmail: string }) {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Deliberately not calling Payload's real forgot-password endpoint —
    // it would "succeed" today (Payload generates a token regardless),
    // but with no email adapter configured, the reset email would never
    // actually arrive, silently and confusingly for whoever submitted
    // this. Honest here beats a fake "check your email" message.
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="w-[360px] rounded-card bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm sm:w-96">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-brand-gold-light">
          <Info size={20} className="text-brand-navy-dark" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-brand-navy-dark">{t('notYetAvailableHeading')}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t('notYetAvailableMessage')}</p>
        <div className="mt-4 space-y-1 text-sm font-medium text-brand-navy">
          <p>{contactPhone}</p>
          <p>{contactEmail}</p>
        </div>
        <Link
          href="/login"
          className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
        >
          <ArrowLeft size={14} /> {t('backToSignIn')}
        </Link>
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
          placeholder="you@example.com"
          className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <button
        type="submit"
        className="mt-5 w-full rounded-md bg-brand-navy py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark"
      >
        {t('sendResetLink')}
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
