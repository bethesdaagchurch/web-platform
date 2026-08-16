'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'

export function useNewsletterSubscribe() {
  const t = useTranslations('newsletter')
  const locale = useLocale()
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)

  async function subscribe(email: string, firstName: string) {
    setStatus('loading')
    setError(null)

    try {
      const res = await fetch('/api/newsletter/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, firstName, locale }),
      })

      if (!res.ok) {
        // Deliberately not using the server's raw error text here — the
        // API route can't know the visitor's locale without significantly
        // more plumbing (passing locale through, loading the right
        // translation file server-side) for what's fundamentally just a
        // generic "something went wrong" message. Always showing the
        // client's own translated fallback keeps this correctly localized
        // with much less complexity.
        setError(t('genericError'))
        setStatus('error')
        return
      }

      setStatus('success')
    } catch {
      setError(t('genericError'))
      setStatus('error')
    }
  }

  return { status, error, subscribe }
}
