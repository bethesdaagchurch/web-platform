'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { ArrowRight, Clock, CheckCircle2 } from 'lucide-react'
import type { JoinStatus, JoinTargetType } from '@/types/join-requests'

export function JoinRequestButton({
  targetType,
  targetId,
  initialStatus,
  joinLabel,
}: {
  targetType: JoinTargetType
  targetId: string
  initialStatus: JoinStatus
  joinLabel?: string
}) {
  const t = useTranslations('joinRequests')
  const [status, setStatus] = useState<JoinStatus>(initialStatus)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleJoin() {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/join-requests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ target: { relationTo: targetType, value: Number(targetId) } }),
      })
      if (!res.ok) {
        setError(t('genericError'))
        return
      }
      setStatus('pending')
    } catch {
      setError(t('genericError'))
    } finally {
      setLoading(false)
    }
  }

  if (status === 'approved') {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-md bg-surface-cream py-2.5 text-sm font-medium text-brand-navy">
        <CheckCircle2 size={14} /> {t('approved')}
      </div>
    )
  }

  if (status === 'pending') {
    return (
      <div className="flex w-full items-center justify-center gap-2 rounded-md border border-black/10 py-2.5 text-sm font-medium text-ink-muted">
        <Clock size={14} /> {t('pending')}
      </div>
    )
  }

  return (
    <div>
      {error && (
        <p className="mb-2 text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
      <button
        type="button"
        onClick={handleJoin}
        disabled={loading}
        className="flex w-full items-center justify-between rounded-md bg-brand-navy px-4 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark disabled:opacity-60"
      >
        {loading ? t('submitting') : joinLabel || t('join')} <ArrowRight size={14} />
      </button>
    </div>
  )
}
