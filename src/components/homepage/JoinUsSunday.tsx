import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { ServiceTime } from '@/types/homepage'

export async function JoinUsSunday({ times }: { times: ServiceTime[] }) {
  const t = await getTranslations('homepage.joinUsSunday')

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div className="relative overflow-hidden rounded-card">
          <Image
            src="/images/joinussunday.jpg"
            alt="Congregation gathered for worship"
            width={640}
            height={420}
            className="h-full w-full object-cover"
          />
          <span className="absolute left-4 top-4 rounded-full bg-brand-navy px-3 py-1 text-xs font-semibold text-white">
            {t('liveSoon')}
          </span>
        </div>

        <div>
          <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
          <p className="mt-2 text-sm text-ink-muted">{t('description')}</p>

          <ul className="mt-6 space-y-3">
            {times.map((service) => (
              <li
                key={service.id}
                className="flex items-center gap-4 rounded-card border border-brand-gold/30 bg-white px-4 py-3"
              >
                <span className="rounded-md bg-brand-gold-light px-3 py-1 text-sm font-semibold text-brand-navy-dark">
                  {service.time}
                </span>
                <span className="text-sm text-ink">{service.label}</span>
              </li>
            ))}
          </ul>

          <Link
            href="/schedule"
            className="mt-5 inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
          >
            {t('viewSchedule')} <ArrowRight size={14} />
          </Link>
        </div>
      </div>
    </section>
  )
}
