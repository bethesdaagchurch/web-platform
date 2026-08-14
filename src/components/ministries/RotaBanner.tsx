import { getTranslations } from 'next-intl/server'
import { CalendarClock, ArrowRight } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { Member } from '@/payload-types'

// Visible only to logged-in members — logged-out visitors simply don't see
// this banner at all (not even a "sign in to see this" prompt), since
// advertising an internal scheduling tool to the public isn't useful the
// way advertising the Small Groups opportunity is.
export async function RotaBanner({ member }: { member: Member | null }) {
  if (!member) return null
  const t = await getTranslations('ministries.rotaBanner')

  return (
    <div className="mx-auto max-w-content px-6">
      <Link
        href="/ministries/rota"
        className="flex items-center justify-between gap-4 rounded-card bg-brand-navy px-6 py-4 text-white hover:bg-brand-navy-dark"
      >
        <span className="flex items-center gap-3">
          <CalendarClock size={20} />
          <span>
            <span className="block text-sm font-semibold">{t('heading')}</span>
            <span className="block text-xs text-white/75">{t('description')}</span>
          </span>
        </span>
        <ArrowRight size={16} />
      </Link>
    </div>
  )
}
