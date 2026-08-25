import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { Rocket, Smile, PersonStanding, Music, HeartHandshake, Users, User } from 'lucide-react'
import type { Ministry } from '@/types/homepage'

const iconMap = {
  youth: Rocket,
  children: Smile,
  women: PersonStanding,
  men: User,
  worship: Music,
  outreach: HeartHandshake,
  groups: Users,
} as const

export async function FindYourPlace({ ministries }: { ministries: Ministry[] }) {
  const t = await getTranslations('homepage.findYourPlace')
  // No real ministries at all — skip the section entirely rather than
  // show a heading over an empty grid.
  if (ministries.length === 0) return null

  return (
    <section className="bg-brand-navy py-16">
      <div className="mx-auto max-w-content px-6 text-center">
        <h2 className="text-2xl font-semibold text-white md:text-3xl">{t('heading')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-white/70">{t('description')}</p>

        <div className="mt-8 grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-7">
          {ministries.map((ministry) => {
            const Icon = iconMap[ministry.icon]
            return (
              <Link
                key={ministry.id}
                href={ministry.href}
                className="flex flex-col items-center gap-2 rounded-card bg-white/10 px-3 py-5 transition-colors hover:bg-white/20"
              >
                <Icon size={20} className="text-white" />
                <span className="text-xs font-medium text-white">{ministry.name}</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
