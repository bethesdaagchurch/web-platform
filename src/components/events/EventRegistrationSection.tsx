'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { CheckCircle2, ClipboardCheck } from 'lucide-react'
import type { Member } from '@/payload-types'

const ATTENDEE_OPTIONS = [
  { value: '1', label: '1' },
  { value: '2', label: '2' },
  { value: '3', label: '3' },
  { value: '4', label: '4' },
  { value: '5+', label: '5+' },
]

export function EventRegistrationSection({
  member,
  eventId,
  existingRegistrationId,
}: {
  member: Member
  eventId: string
  existingRegistrationId: string | null
}) {
  const t = useTranslations('events.registration')
  const tCommon = useTranslations('common')

  const [firstName, setFirstName] = useState(member.name.split(' ')[0] ?? '')
  const [lastName, setLastName] = useState(member.name.split(' ').slice(1).join(' ') ?? '')
  const [email, setEmail] = useState(member.email)
  const [phone, setPhone] = useState('')
  const [numberOfAttendees, setNumberOfAttendees] = useState('1')
  const [specialRequests, setSpecialRequests] = useState('')

  const [registrationId, setRegistrationId] = useState(existingRegistrationId)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/event-registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          event: Number(eventId),
          firstName,
          lastName,
          email,
          phone,
          numberOfAttendees,
          specialRequests: specialRequests || undefined,
          status: 'registered',
        }),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => null)
        setError(data?.errors?.[0]?.data?.errors?.[0]?.message || data?.errors?.[0]?.message || t('genericError'))
        return
      }

      const data = await res.json()
      setRegistrationId(String(data.doc.id))
    } catch {
      setError(t('genericError'))
    } finally {
      setLoading(false)
    }
  }

  async function handleCancel() {
    if (!registrationId) return
    setError(null)
    setLoading(true)

    try {
      const res = await fetch(`/api/event-registrations/${registrationId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: 'cancelled' }),
      })

      if (!res.ok) {
        setError(t('cancelError'))
        return
      }

      setRegistrationId(null)
    } catch {
      setError(t('cancelError'))
    } finally {
      setLoading(false)
    }
  }

  if (registrationId) {
    return (
      <div className="mx-auto mt-10 flex max-w-xl flex-col items-center gap-3 rounded-card bg-white p-10 text-center shadow-sm ring-1 ring-black/5">
        <CheckCircle2 size={32} className="text-brand-navy" />
        <h2 className="text-xl font-semibold text-brand-navy-dark">{t('alreadyRegisteredHeading')}</h2>
        <p className="text-sm text-ink-muted">{t('alreadyRegisteredMessage')}</p>

        {error && (
          <p className="w-full rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        <button
          type="button"
          onClick={handleCancel}
          disabled={loading}
          className="mt-2 rounded-md border border-black/15 px-4 py-2 text-sm font-medium text-ink hover:bg-surface-cream disabled:opacity-60"
        >
          {loading ? t('cancelling') : t('cancel')}
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleRegister} className="mx-auto mt-10 max-w-xl rounded-card bg-white p-10 shadow-sm ring-1 ring-black/5">
      <h2 className="text-center text-2xl font-semibold text-ink">{t('heading')}</h2>
      <p className="mx-auto mt-2 max-w-sm text-center text-sm text-ink-muted">{t('formIntro')}</p>

      {error && (
        <p className="mt-4 rounded-md bg-red-50 px-3 py-2 text-sm text-red-600" role="alert">
          {error}
        </p>
      )}

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-first-name" className="text-sm font-medium text-ink">
            {tCommon('firstName')}
          </label>
          <input
            id="reg-first-name"
            type="text"
            required
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="John"
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="reg-last-name" className="text-sm font-medium text-ink">
            {tCommon('lastName')}
          </label>
          <input
            id="reg-last-name"
            type="text"
            required
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Doe"
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="reg-email" className="text-sm font-medium text-ink">
          {tCommon('emailAddress')}
        </label>
        <input
          id="reg-email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="john.doe@example.com"
          className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="reg-phone" className="text-sm font-medium text-ink">
            {t('phone')}
          </label>
          <input
            id="reg-phone"
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="(555) 123-4567"
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          />
        </div>
        <div>
          <label htmlFor="reg-attendees" className="text-sm font-medium text-ink">
            {t('numberOfAttendees')}
          </label>
          <select
            id="reg-attendees"
            value={numberOfAttendees}
            onChange={(e) => setNumberOfAttendees(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
          >
            {ATTENDEE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-4">
        <label htmlFor="reg-special-requests" className="text-sm font-medium text-ink">
          {t('specialRequests')}
        </label>
        <textarea
          id="reg-special-requests"
          rows={3}
          value={specialRequests}
          onChange={(e) => setSpecialRequests(e.target.value)}
          placeholder={t('specialRequestsPlaceholder')}
          className="mt-1.5 w-full resize-none rounded-md border border-black/10 px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-6 border-t border-black/5 pt-6">
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
        >
          <ClipboardCheck size={16} /> {loading ? t('submitting') : t('completeRegistration')}
        </button>
      </div>
    </form>
  )
}
