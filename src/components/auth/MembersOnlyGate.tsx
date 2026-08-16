import { Lock } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { Member } from '@/payload-types'

export function MembersOnlyGate({
  member,
  children,
  prompt,
}: {
  member: Member | null
  children: React.ReactNode
  prompt?: string
}) {
  const t = useTranslations('membersOnlyGate')
  const tCommon = useTranslations('common')
  if (member) return <>{children}</>

  return (
    <div className="flex flex-col items-center gap-3 rounded-card bg-surface-cream p-6 text-center ring-1 ring-black/5">
      <span className="flex h-9 w-9 items-center justify-center rounded-full bg-white ring-1 ring-black/5">
        <Lock size={16} className="text-brand-navy" />
      </span>
      <p className="text-sm text-ink-muted">{prompt ?? t('defaultPrompt')}</p>
      <Link
        href="/login"
        className="rounded-md bg-brand-navy px-4 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark"
      >
        {tCommon('signIn')}
      </Link>
    </div>
  )
}
