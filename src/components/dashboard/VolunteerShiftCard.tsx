import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import type { VolunteerShiftData } from '@/types/dashboard'

export function VolunteerShiftCard({ shift }: { shift: VolunteerShiftData }) {
  const t = useTranslations('dashboard')
  return (
    <div className="rounded-card bg-brand-navy p-6">
      <h2 className="text-lg font-semibold text-white">{t('volunteerShifts')}</h2>

      <div className="mt-4 rounded-card bg-white/10 p-4">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold-light">{shift.dayLabel}</p>
          {shift.time && (
            <span className="rounded-full bg-brand-gold px-2.5 py-1 text-xs font-semibold text-brand-navy-dark">
              {shift.time}
            </span>
          )}
        </div>
        <p className="mt-1 text-base font-semibold text-white">{shift.role}</p>
        {shift.location && <p className="text-sm text-white/75">{shift.location}</p>}
      </div>

      <Link
        href="/volunteer"
        className="mt-4 block rounded-md border border-white/30 py-2.5 text-center text-sm font-medium text-white hover:bg-white/10"
      >
        {t('manageSchedule')}
      </Link>
    </div>
  )
}
