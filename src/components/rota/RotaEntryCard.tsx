import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { BookOpen, Users, Star } from 'lucide-react'
import type { RotaEntry } from '@/types/rota'

function dateParts(iso: string) {
  const d = new Date(iso)
  return {
    day: String(d.getDate()).padStart(2, '0'),
    weekday: d.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase(),
  }
}

export function RotaEntryCard({ entry }: { entry: RotaEntry }) {
  const t = useTranslations('rota')
  const { day, weekday } = dateParts(entry.date)
  const overflowCount = entry.teamMemberCount - entry.teamMemberAvatars.length

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="grid gap-6 sm:grid-cols-[80px_1fr_1fr_1fr]">
        {/* Date badge */}
        <div className="flex flex-col items-center justify-center rounded-card bg-brand-navy py-4 text-center text-white sm:items-start sm:px-4">
          <span className="text-2xl font-bold">{day}</span>
          <span className="mt-1 text-xs font-medium">{weekday}</span>
          <span className="mt-1 text-xs text-white/70">{entry.serviceTime}</span>
        </div>

        {/* Sermon & Word */}
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold">
            <BookOpen size={13} /> {t('sermonWord')}
          </p>
          <div className="mt-2 flex items-center gap-2.5">
            <Image
              src={entry.sermonSpeakerPhoto}
              alt={entry.sermonSpeakerName}
              width={36}
              height={36}
              className="h-9 w-9 rounded-full object-cover"
            />
            <div>
              <p className="text-sm font-semibold text-ink">
                {entry.sermonSpeakerName}
                {entry.sermonSpeakerIsGuest && <span className="font-normal text-ink-muted"> ({t('guest')})</span>}
              </p>
              <p className="text-xs italic text-ink-muted">&ldquo;{entry.sermonTitle}&rdquo;</p>
              {entry.sermonTranslatorName && (
                <p className="mt-1 text-xs text-ink-muted">
                  {t('translatedBy')}: {entry.sermonTranslatorName}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Worship Team */}
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold">
            <Users size={13} /> {t('worshipTeam')}
          </p>
          <p className="mt-2 text-sm font-semibold text-ink">{entry.worshipTeamName}</p>
          <p className="text-xs text-ink-muted">
            {t('ledBy')}: {entry.worshipLeaderName}
          </p>
          {entry.choirTeamNames && (
            <p className="text-xs text-ink-muted">
              {t('choir')}: {entry.choirTeamNames}
            </p>
          )}
          {entry.teamMemberAvatars.length > 0 && (
            <div className="mt-2 flex -space-x-2">
              {entry.teamMemberAvatars.map((src, i) => (
                <Image
                  key={i}
                  src={src}
                  alt=""
                  width={24}
                  height={24}
                  className="h-6 w-6 rounded-full object-cover ring-2 ring-white"
                />
              ))}
              {overflowCount > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-surface-cream text-[10px] font-semibold text-ink ring-2 ring-white">
                  +{overflowCount}
                </span>
              )}
            </div>
          )}
          {entry.worshipBadge && (
            <span className="mt-2 inline-block rounded-full bg-brand-gold-light px-2.5 py-0.5 text-xs font-medium text-brand-navy-dark">
              {entry.worshipBadge}
            </span>
          )}
        </div>

        {/* Special Items */}
        <div>
          <p className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-brand-gold">
            <Star size={13} /> {t('specialItems')}
          </p>
          <div className="mt-2 space-y-2 rounded-card bg-surface-cream p-3">
            {entry.specialItems.map((item, i) => (
              <div key={i}>
                <p className="text-xs text-ink-muted">{item.label}</p>
                <p className="text-sm font-medium text-ink">
                  {item.personName}
                  {item.roleLabel && <span className="text-ink-muted"> ({item.roleLabel})</span>}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
