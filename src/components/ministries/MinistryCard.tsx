import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'
import { JoinRequestButton } from '@/components/shared/JoinRequestButton'
import type { MinistryItem } from '@/types/ministries'
import type { Member } from '@/payload-types'
import type { JoinStatus } from '@/types/join-requests'

// The image/title link to the detail page ("learn more") stays a plain
// Link; the CTA button below is now a real, trackable join request instead
// of a mailto: action nobody could confirm was ever sent or seen.
export function MinistryCard({
  ministry,
  member,
  joinStatus,
}: {
  ministry: MinistryItem
  member: Member | null
  joinStatus: JoinStatus
}) {
  const t = useTranslations('membersOnlyGate')
  return (
    <article className="overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5">
      <Link href={`/ministries/${ministry.slug}`} className="block">
        <div className="relative h-48">
          <Image src={ministry.image} alt={ministry.name} fill className="object-cover" />
        </div>
      </Link>
      <div className="p-5">
        <Link href={`/ministries/${ministry.slug}`}>
          <h3 className="text-lg font-semibold text-ink hover:text-brand-navy">{ministry.name}</h3>
        </Link>
        <p className="mt-2 text-sm text-ink-muted">{ministry.description}</p>
        <div className="mt-4">
          <MembersOnlyGate member={member} prompt={t('joinGroupPrompt')}>
            <JoinRequestButton
              targetType="ministries"
              targetId={ministry.id}
              initialStatus={joinStatus}
              joinLabel={ministry.ctaLabel}
            />
          </MembersOnlyGate>
        </div>
      </div>
    </article>
  )
}
