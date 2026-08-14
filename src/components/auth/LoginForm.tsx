'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, Lock } from 'lucide-react'
import { useRouter, Link } from '@/i18n/navigation'

// Real login: posts to Payload's auto-generated REST endpoint for the
// Members collection. Payload sets an httpOnly session cookie on success
// (same-origin, since Payload's API is mounted inside this same Next.js
// app) — no manual token handling needed here. router.refresh() re-runs
// Server Component data fetching (Header, gated pages) so they pick up
// the new session immediately, without a full page reload.
export function LoginForm() {
  const t = useTranslations('common')
  const tLogin = useTranslations('loginForm')
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/members/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.errors?.[0]?.message || tLogin('incorrectCredentials'))
        setLoading(false)
        return
      }

      router.push('/')
      router.refresh()
    } catch {
      setError(t('genericError'))
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
        <label htmlFor="login-email" className="text-sm font-medium text-ink">
          {t('emailAddress')}
        </label>
        <div className="relative mt-1.5">
          <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="login-email"
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
        <div className="flex items-center justify-between">
          <label htmlFor="login-password" className="text-sm font-medium text-ink">
            {t('password')}
          </label>
          <Link href="/forgot-password" className="text-sm font-medium text-brand-navy hover:underline">
            {t('forgotPassword')}
          </Link>
        </div>
        <div className="relative mt-1.5">
          <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-muted" />
          <input
            id="login-password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-md border border-black/10 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
        <input type="checkbox" className="h-4 w-4 rounded border-black/20" />
        {t('rememberMe')}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-5 w-full rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('signingIn') : t('signIn')}
      </button>
    </form>
  )
}
