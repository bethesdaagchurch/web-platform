'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2 } from 'lucide-react'

export function VolunteerInterestForm({ areaOfInterest }: { areaOfInterest: string }) {
  const t = useTranslations('volunteer')
  const tCommon = useTranslations('common')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/volunteer-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, areaOfInterest }),
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
      <div className="mt-4 flex items-center gap-2 rounded-md bg-white px-3 py-3 text-sm text-brand-navy">
        <CheckCircle2 size={16} /> {t('thanks')}
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 space-y-2">
      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <input
        type="text"
        required
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t('yourName')}
        className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
      />
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder={t('emailAddress')}
        className="w-full rounded-md border border-black/10 bg-white px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
      />
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-brand-gold py-2.5 text-sm font-medium text-white hover:opacity-90 disabled:opacity-60"
      >
        {loading ? tCommon('submitting') : t('interested')}
      </button>
    </form>
  )
}
