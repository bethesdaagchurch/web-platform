'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Mail, CheckCircle2 } from 'lucide-react'
import { useNewsletterSubscribe } from '@/hooks/useNewsletterSubscribe'
import type { NewsletterCtaData } from '@/types/events'

export function NewsletterCta({ data }: { data: NewsletterCtaData }) {
  const t = useTranslations('common')
  const tNewsletter = useTranslations('newsletter')
  const [email, setEmail] = useState('')
  const [firstName, setFirstName] = useState('')
  const { status, error, subscribe } = useNewsletterSubscribe()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    await subscribe(email, firstName)
  }

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="rounded-2xl bg-brand-navy px-8 py-12 text-center">
        <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-white/15">
          <Mail size={20} className="text-white" />
        </span>
        <h2 className="mt-4 text-2xl font-semibold text-white md:text-3xl">{data.heading}</h2>
        <p className="mx-auto mt-3 max-w-lg text-sm text-white/80">{data.subtext}</p>

        {status === 'success' ? (
          <div className="mx-auto mt-6 flex max-w-md items-center justify-center gap-2 rounded-md bg-white/15 px-4 py-3 text-sm text-white">
            <CheckCircle2 size={16} /> {tNewsletter('checkYourEmail')}
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-6 flex max-w-md flex-col gap-2 sm:flex-row">
            <label htmlFor="events-newsletter-first-name" className="sr-only">
              {tNewsletter('firstName')}
            </label>
            <input
              id="events-newsletter-first-name"
              type="text"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder={tNewsletter('firstName')}
              className="w-full rounded-md border-0 px-4 py-2.5 text-sm outline-none sm:w-32"
            />
            <label htmlFor="events-newsletter-email" className="sr-only">
              {t('emailAddress')}
            </label>
            <input
              id="events-newsletter-email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={data.placeholder}
              className="w-full rounded-md border-0 px-4 py-2.5 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="shrink-0 rounded-md bg-white px-5 py-2.5 text-sm font-medium text-brand-navy-dark hover:bg-white/90 disabled:opacity-60"
            >
              {status === 'loading' ? t('submitting') : data.buttonLabel}
            </button>
          </form>
        )}

        {error && (
          <p className="mt-2 text-xs text-red-100" role="alert">
            {error}
          </p>
        )}
      </div>
    </section>
  )
}
