import { useTranslations } from 'next-intl'
import { Clock, XCircle } from 'lucide-react'
import type { PendingRequestItem } from '@/types/dashboard'

export function MyRequestsCard({ requests }: { requests: PendingRequestItem[] }) {
  const t = useTranslations('dashboard')

  if (requests.length === 0) return null

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <h2 className="text-lg font-semibold text-ink">{t('myRequests')}</h2>

      <ul className="mt-3 divide-y divide-black/5">
        {requests.map((request) => (
          <li key={request.id} className="flex items-center gap-3 py-3">
            {request.status === 'pending' ? (
              <Clock size={16} className="shrink-0 text-brand-gold" />
            ) : (
              <XCircle size={16} className="shrink-0 text-red-400" />
            )}
            <p className="flex-1 text-sm font-medium text-ink">{request.targetName}</p>
            <span
              className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                request.status === 'pending' ? 'bg-brand-gold-light text-brand-navy-dark' : 'bg-red-50 text-red-600'
              }`}
            >
              {request.status === 'pending' ? t('requestPending') : t('requestDeclined')}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
