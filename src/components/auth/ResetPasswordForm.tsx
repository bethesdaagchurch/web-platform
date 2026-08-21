'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Lock, CheckCircle2, AlertCircle } from 'lucide-react'
import { useRouter, Link } from '@/i18n/navigation'

// Posts to Payload's auto-generated /api/members/reset-password. Verified
// directly in Payload's own resetPassword operation source
// (node_modules/payload/dist/auth/operations/resetPassword.js): on
// success this both resets the password AND establishes a new session in
// one step (same response shape as login), so there's no separate
// "now go log in" step needed — matching the same "signing up feels like
// one step" pattern already used for account creation. An invalid or
// expired token throws a specific 403 ("Token is either invalid or has
// expired"), surfaced here as a clear, translated message with a link
// back to request a fresh one.
export function ResetPasswordForm({ token }: { token: string | undefined }) {
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirmPassword) {
      setError(t('passwordsDontMatch'))
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/members/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ token, password }),
      })

      if (!res.ok) {
        setError(t('invalidOrExpiredToken'))
        setLoading(false)
        return
      }

      setSuccess(true)
      setTimeout(() => {
        router.push('/dashboard')
        router.refresh()
      }, 1500)
    } catch {
      setError(tCommon('genericError'))
      setLoading(false)
    }
  }

  if (!token) {
    return (
      <div className="w-[360px] rounded-card bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm sm:w-96">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-red-50">
          <AlertCircle size={20} className="text-red-600" />
        </span>
        <h2 className="mt-3 text-lg font-semibold text-brand-navy-dark">{t('invalidOrExpiredToken')}</h2>
        <Link href="/forgot-password" className="mt-5 inline-block text-sm font-medium text-brand-navy hover:underline">
          {t('requestNewLink')}
        </Link>
      </div>
    )
  }

  if (success) {
    return (
      <div className="w-[360px] rounded-card bg-white/95 p-6 text-center shadow-lg backdrop-blur-sm sm:w-96">
        <span className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 size={20} className="text-green-600" />
        </span>
        <p className="mt-3 text-sm font-medium text-ink">{t('passwordResetSuccess')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="w-[360px] rounded-card bg-white/95 p-6 shadow-lg backdrop-blur-sm sm:w-96">
      {error && (
        <p className="mb-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <label htmlFor="reset-password-new" className="text-sm font-medium text-ink">
        {t('newPassword')}
      </label>
      <div className="relative mt-1.5">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id="reset-password-new"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <label htmlFor="reset-password-confirm" className="mt-4 block text-sm font-medium text-ink">
        {t('confirmNewPassword')}
      </label>
      <div className="relative mt-1.5">
        <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
        <input
          id="reset-password-confirm"
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md bg-brand-navy py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('resetting') : t('resetPassword')}
      </button>
    </form>
  )
}
