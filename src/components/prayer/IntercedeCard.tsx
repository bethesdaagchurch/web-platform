import { useTranslations } from 'next-intl'
import { Users, ArrowRight, Lock } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { IntercedeCardData } from '@/types/prayer'
import type { Member } from '@/payload-types'

// The card's heading/description stay visible to everyone — they're
// effectively advertising the opportunity, which is useful even for a
// visitor who isn't a member yet. Only the actual "join" action is gated.
// Using a lighter inline treatment here rather than the full
// MembersOnlyGate box, which would look oversized inside this small card.
export function IntercedeCard({ data, member }: { data: IntercedeCardData; member: Member | null }) {
  const t = useTranslations('prayer')
  return (
    <div className="rounded-card bg-surface-cream p-6 ring-1 ring-black/5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold-light">
        <Users size={16} className="text-brand-navy-dark" />
      </span>
      <h3 className="mt-3 text-base font-semibold text-ink">{data.heading}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{data.description}</p>
      {member ? (
        <Link
          href={data.linkHref}
          className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
        >
          {data.linkLabel} <ArrowRight size={14} />
        </Link>
      ) : (
        <Link
          href="/login"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-ink-muted hover:text-brand-navy"
        >
          <Lock size={12} /> {t('signInToJoinGroup')}
        </Link>
      )}
    </div>
  )
}
