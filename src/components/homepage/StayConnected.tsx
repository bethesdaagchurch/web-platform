'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe'

export function StayConnected() {
  const t = useTranslations('homepage.stayConnected')
  const tNewsletter = useTranslations('newsletter')
  const tCommon = useTranslations('common')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const [sermonNotes, setSermonNotes] = useState(true)
  const [eventReminders, setEventReminders] = useState(true)
  const { status, error, subscribe } = useNewsletterSubscribe()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await subscribe(email, firstName, { sermonNotes, eventReminders })
  }

  return (
    <section className="bg-white py-16">
      <div className="mx-auto max-w-md px-6 text-center">
        <h2 className="text-2xl font-semibold text-brand-navy-dark">{t('heading')}</h2>
        <p className="mt-2 text-sm text-ink-muted">{t('description')}</p>

        {status === 'success' ? (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-md bg-surface-cream px-4 py-3 text-sm text-brand-navy">
            <CheckCircle2 size={16} /> {tNewsletter('checkYourEmail')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-5">
            <div className="flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-first-name" className="sr-only">
                {tNewsletter('firstName')}
              </label>
              <input
                id="newsletter-first-name"
                type="text"
                required
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder={tNewsletter('firstName')}
                className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-navy sm:w-32"
              />
              <label htmlFor="newsletter-email" className="sr-only">
                {t('emailLabel')}
              </label>
              <input
                id="newsletter-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              className="w-full rounded-md border border-black/10 px-4 py-2.5 text-sm outline-none focus:border-brand-navy"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
            >
              {status === 'loading' ? tCommon('submitting') : t('subscribe')}
            </button>
            </div>

            <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5 text-xs text-ink-muted">
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={sermonNotes}
                  onChange={(e) => setSermonNotes(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-black/20"
                />
                {tNewsletter('sermonNotesLabel')}
              </label>
              <label className="flex items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={eventReminders}
                  onChange={(e) => setEventReminders(e.target.checked)}
                  className="h-3.5 w-3.5 rounded border-black/20"
                />
                {tNewsletter('eventRemindersLabel')}
              </label>
            </div>
          </form>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
