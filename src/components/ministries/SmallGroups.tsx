'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageSquare, HeartHandshake, CheckCircle2 } from 'lucide-react'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'
import type { SmallGroupsData, AreaOfInterestOption } from '@/types/ministries'
import type { Member } from '@/payload-types'

const iconMap = {
  discussion: MessageSquare,
  support: HeartHandshake,
} as const

function LeadershipInterestForm({ areaOptions }: { areaOptions: AreaOfInterestOption[] }) {
  const t = useTranslations('ministries.leadershipInterest')
  const tCommon = useTranslations('common')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [areaOfInterest, setAreaOfInterest] = useState(areaOptions[0]?.value ?? '')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // credentials: 'include' matters here — this collection's create
      // access requires a real member session, so the auth cookie must
      // actually be sent with the request.
      const res = await fetch('/api/leadership-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ firstName, lastName, email, areaOfInterest }),
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
        <h3 className="text-xl font-semibold text-brand-navy-dark">{t('successHeading')}</h3>
        <p className="text-sm text-ink-muted">{t('successMessage')}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5">
      <h3 className="text-xl font-semibold text-brand-navy-dark">{t('heading')}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{t('description')}</p>

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
          placeholder="jane@example.com"
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        />
      </div>

      <div className="mt-4">
        <label htmlFor="areaOfInterest" className="text-sm font-medium text-ink">
          {t('areaOfInterest')}
        </label>
        <select
          id="areaOfInterest"
          value={areaOfInterest}
          onChange={(e) => setAreaOfInterest(e.target.value)}
          className="mt-1.5 w-full rounded-md border border-black/10 bg-surface-cream px-3 py-2.5 text-sm outline-none focus:border-brand-navy"
        >
          {areaOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="mt-6 w-full rounded-md bg-brand-navy py-3 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('submitting') : t('submit')}
      </button>
    </form>
  )
}

export function SmallGroups({
  data,
  areaOptions,
  member,
}: {
  data: SmallGroupsData
  areaOptions: AreaOfInterestOption[]
  member: Member | null
}) {
  const t = useTranslations('membersOnlyGate')

  return (
    <section id="small-groups" className="bg-surface-cream px-6 py-20 scroll-mt-20">
      <div className="mx-auto grid max-w-content gap-12 md:grid-cols-2 md:items-start">
        <div>
          <h2 className="text-3xl font-semibold text-brand-navy-dark">{data.heading}</h2>
          <p className="mt-4 max-w-md text-sm text-ink-muted">{data.description}</p>

          <ul className="mt-8 space-y-5">
            {data.features.map((feature) => {
              const Icon = iconMap[feature.icon]
              const bg = feature.icon === 'discussion' ? 'bg-brand-gold-light' : 'bg-blue-100'
              return (
                <li key={feature.id} className="flex gap-3">
                  <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${bg}`}>
                    <Icon size={16} className="text-brand-navy-dark" />
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-ink">{feature.title}</p>
                    <p className="text-sm text-ink-muted">{feature.description}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>

        {/* Gated: expressing interest in leading a group is a members-only
            action, matching the collection's own create access control.
            MembersOnlyGate's own prompt is a Server Component default —
            passing an explicit, translated prompt here since this call
            site is a Client Component and needs its own translator. */}
        <MembersOnlyGate member={member} prompt={t('leadershipPrompt')}>
          <LeadershipInterestForm areaOptions={areaOptions} />
        </MembersOnlyGate>
      </div>
    </section>
  )
}
