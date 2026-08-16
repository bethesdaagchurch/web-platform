'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { User, Mail, Lock } from 'lucide-react'
import { useRouter, Link } from '@/i18n/navigation'

export function CreateAccountForm() {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [agreed, setAgreed] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('passwordsDontMatch'))
      return
    }
    if (!agreed) {
      setError(t('agreeToTerms'))
      return
    }

    setLoading(true)

    try {
      // Step 1: create the Member record via Payload's standard REST create
      // endpoint. Members.access.create is already public (`() => true`).
      const createRes = await fetch('/api/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ name, email, password }),
      })

      if (!createRes.ok) {
        const data = await createRes.json().catch(() => null)
        // Payload nests the field-specific message a level deeper than the
        // generic top-level one — "A user with the given email is already
        // registered." lives at errors[0].data.errors[0].message, not
        // errors[0].message (which is just "The following field is
        // invalid: email"). Prefer the specific one when present.
        const specificMessage = data?.errors?.[0]?.data?.errors?.[0]?.message
        const genericMessage = data?.errors?.[0]?.message
        setError(specificMessage || genericMessage || t('genericError'))
        setLoading(false)
        return
      }

      // Step 2: log in immediately with the same credentials, so signing up
      // feels like one step rather than "create an account, then separately
      // go sign in with what you just typed."
      const loginRes = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!loginRes.ok) {
        // Account was created but the automatic login failed for some
        // reason — send them to sign in manually rather than strand them.
        router.push('/login')
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError(tCommon('genericError'))
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm rounded-card bg-white/95 p-8 shadow-lg backdrop-blur">
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div>
        <label htmlFor="create-name" className="text-sm font-medium text-ink">
          {tCommon('fullName')}
        </label>
        <div className="relative mt-1.5">
          <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="create-name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
            className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="create-email" className="text-sm font-medium text-ink">
          {tCommon('emailAddress')}
        </label>
        <div className="relative mt-1.5">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="create-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="create-password" className="text-sm font-medium text-ink">
          {tCommon('password')}
        </label>
        <div className="relative mt-1.5">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="create-password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="create-confirm-password" className="text-sm font-medium text-ink">
          {tCommon('confirmPassword')}
        </label>
        <div className="relative mt-1.5">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="create-confirm-password"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <label className="mt-4 flex items-start gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={agreed}
          onChange={(e) => setAgreed(e.target.checked)}
          className="mt-0.5 h-4 w-4 rounded border-black/20"
        />
        <span>
          {t('agreeToTermsPrefix')}{' '}
          <Link href="/terms" className="font-medium text-brand-navy hover:underline">
            {tCommon('termsOfService')}
          </Link>{' '}
          {t('and')}{' '}
          <Link href="/privacy" className="font-medium text-brand-navy hover:underline">
            {tCommon('privacyPolicy')}
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('creatingAccount') : t('createAccount')}
      </button>
    </form>
  )
}
