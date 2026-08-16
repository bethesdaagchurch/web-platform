import { useTranslations } from 'next-intl'
import { CircleHelp, MapPin, Phone, Mail, Clock } from 'lucide-react'
import type { OfficeHoursRow } from '@/types/contact'

interface ContactSidebarProps {
  hours: OfficeHoursRow[]
  address: string[]
  phone: string
  email: string
}

export function ContactSidebar({ hours, address, phone, email }: ContactSidebarProps) {
  const t = useTranslations('contact')
  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold-light">
            <CircleHelp size={14} className="text-brand-navy-dark" />
          </span>
          <h2 className="text-lg font-semibold text-brand-navy-dark">{t('connectDirectly')}</h2>
        </div>

        <div className="mt-4 space-y-3">
          <div className="flex items-start gap-3 rounded-md bg-surface-cream p-3">
            <MapPin size={16} className="mt-0.5 shrink-0 text-ink-muted" />
            <div>
              <p className="text-xs font-medium text-ink-muted">{t('address')}</p>
              {address.map((line) => (
                <p key={line} className="text-sm text-ink">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md bg-surface-cream p-3">
            <Phone size={16} className="mt-0.5 shrink-0 text-ink-muted" />
            <div>
              <p className="text-xs font-medium text-ink-muted">{t('phone')}</p>
              <p className="text-sm text-brand-navy">{phone}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 rounded-md bg-surface-cream p-3">
            <Mail size={16} className="mt-0.5 shrink-0 text-ink-muted" />
            <div>
              <p className="text-xs font-medium text-ink-muted">{t('email')}</p>
              <p className="text-sm text-brand-navy">{email}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-card bg-brand-navy p-6">
        <div className="flex items-center gap-2">
          <span className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-gold-light">
            <Clock size={14} className="text-brand-navy-dark" />
          </span>
          <h2 className="text-lg font-semibold text-white">{t('officeHours')}</h2>
        </div>

        <ul className="mt-4 divide-y divide-white/10">
          {hours.map((row) => (
            <li key={row.id} className="flex items-center justify-between py-3 text-sm">
              <span className={row.highlight ? 'font-medium text-brand-gold-light' : 'text-white/85'}>
                {row.label}
              </span>
              <span className={row.highlight ? 'font-medium text-brand-gold-light' : 'text-white'}>
                {row.hours}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
