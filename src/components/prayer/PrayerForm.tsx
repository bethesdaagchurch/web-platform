'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'

export function PrayerForm() {
  const t = useTranslations('prayer')
  const tCommon = useTranslations('common')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [request, setRequest] = useState('')
  const [isPrivate, setIsPrivate] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, request, isPrivate }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || t('genericError'))
        setLoading(false)
        return
      }

      setSubmitted(true)
    } catch {
      setError(tCommon('genericError'))
      setLoading(false)
    }
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-card bg-white p-8 text-center shadow-sm ring-1 ring-black/5">
        <CheckCircle2 size={32} className="text-brand-navy" />
        <h2 className="text-xl font-semibold text-brand-navy-dark">{t('requestReceived')}</h2>
        <p className="text-sm text-ink-muted">{t('requestReceivedMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-brand-navy-dark">{t('howCanWePray')}</h2>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="prayer-first-name" className="text-sm font-medium text-ink">
            {tCommon('firstName')}
          </label>
          <input
            id="prayer-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="prayer-last-name" className="text-sm font-medium text-ink">
            {tCommon('lastName')}
          </label>
          <input
            id="prayer-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="prayer-email" className="text-sm font-medium text-ink">
          {tCommon('emailAddress')}
        </label>
        <input
          id="prayer-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="prayer-request" className="text-sm font-medium text-ink">
          {t('yourRequest')}
        </label>
        <textarea
          id="prayer-request"
          rows={5}
          required
          value={request}
          onChange={(e) => setRequest(e.target.value)}
          className="mt-1.5 w-full resize-none rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <label className="mt-4 flex items-center gap-2 text-sm text-ink-muted">
        <input
          type="checkbox"
          checked={isPrivate}
          onChange={(e) => setIsPrivate(e.target.checked)}
          className="h-4 w-4 rounded border-black/20"
        />
        {t('keepPrivate')}
      </label>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? tCommon('submitting') : t('submit')}
      </button>
    </form>
  )
}
