'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'
import type { NumberInPartyOption } from '@/types/visit'

export function PlanVisitForm({ partyOptions }: { partyOptions: NumberInPartyOption[] }) {
  const t = useTranslations('visit')
  const tCommon = useTranslations('common')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfVisit, setDateOfVisit] = useState('')
  const [numberInParty, setNumberInParty] = useState(partyOptions[0]?.value ?? '')
  const [wantsHost, setWantsHost] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/visit-plans', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, dateOfVisit, numberInParty, wantsHost }),
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
        <h2 className="text-xl font-semibold text-brand-navy-dark">{t('seeYouSoon')}</h2>
        <p className="text-sm text-ink-muted">{t('seeYouSoonMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-brand-navy-dark">{t('planYourVisit')}</h2>
      <p className="mt-2 text-sm text-ink-muted">{t('planIntro')}</p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="visit-first-name" className="text-sm font-medium text-ink">
            {tCommon('firstName')}
          </label>
          <input
            id="visit-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="visit-last-name" className="text-sm font-medium text-ink">
            {tCommon('lastName')}
          </label>
          <input
            id="visit-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="visit-email" className="text-sm font-medium text-ink">
          {tCommon('emailAddress')}
        </label>
        <input
          id="visit-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="visit-date" className="text-sm font-medium text-ink">
            {t('dateOfVisit')}
          </label>
          <input
            id="visit-date"
            type="date"
            required
            value={dateOfVisit}
            onChange={(e) => setDateOfVisit(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="visit-party" className="text-sm font-medium text-ink">
            {t('numberInParty')}
          </label>
          <select
            id="visit-party"
            value={numberInParty}
            onChange={(e) => setNumberInParty(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            {partyOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label className="flex items-start gap-2 text-sm text-ink">
          <input
            type="checkbox"
            checked={wantsHost}
            onChange={(e) => setWantsHost(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-black/20"
          />
          <span>
            {t('wantsHost')}
            <span className="block text-xs text-ink-muted">{t('wantsHostSubtext')}</span>
          </span>
        </label>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('scheduling') : t('scheduleMyVisit')}
      </button>
    </form>
  )
}
