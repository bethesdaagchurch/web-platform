'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'
import type { SubjectOption } from '@/types/contact'

export function ContactForm({ subjectOptions }: { subjectOptions: SubjectOption[] }) {
  const t = useTranslations('contact')
  const tCommon = useTranslations('common')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState(subjectOptions[0]?.value ?? '')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/contact-submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, email, subject, message }),
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
        <h2 className="text-xl font-semibold text-brand-navy-dark">{t('sent')}</h2>
        <p className="text-sm text-ink-muted">{t('sentMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h2 className="text-xl font-semibold text-brand-navy-dark">{t('sendAMessage')}</h2>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="firstName" className="text-sm font-medium text-ink">
            {tCommon('firstName')}
          </label>
          <input
            id="firstName"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Jane"
            className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="lastName" className="text-sm font-medium text-ink">
            {tCommon('lastName')}
          </label>
          <input
            id="lastName"
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
        <label htmlFor="email" className="text-sm font-medium text-ink">
          {tCommon('emailAddress')}
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="jane.doe@example.com"
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="subject" className="text-sm font-medium text-ink">
          {tCommon('subject')}
        </label>
        <select
          id="subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        >
          {subjectOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label htmlFor="message" className="text-sm font-medium text-ink">
          {tCommon('message')}
        </label>
        <textarea
          id="message"
          rows={5}
          required
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={t('messagePlaceholder')}
          className="mt-1.5 w-full resize-none rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 rounded-md bg-brand-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('sending') : t('send')}
      </button>
    </form>
  )
}
