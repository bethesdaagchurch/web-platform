import { getTranslations } from 'next-intl/server'
import { BookOpen, Heart, Users, Globe } from 'lucide-react'
import type { CoreValue } from '@/types/about'

const iconMap = {
  book: BookOpen,
  heart: Heart,
  community: Users,
  globe: Globe,
} as const

export async function CoreValues({ values }: { values: CoreValue[] }) {
  const t = await getTranslations('about.coreValues')

  return (
    <section className="bg-blue-50 px-6 py-20">
      <div className="mx-auto max-w-content text-center">
        <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{t('description')}</p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 md:grid-cols-4">
          {values.map((value) => {
            const Icon = iconMap[value.icon]
            const iconBg = value.accent === 'blue' ? 'bg-blue-100 text-brand-navy' : 'bg-brand-gold-light text-brand-navy-dark'
            return (
              <div key={value.id} className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
                <span className={`mx-auto flex h-11 w-11 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 text-sm font-semibold text-brand-navy-dark">{value.title}</h3>
                <p className="mt-1.5 text-xs text-ink-muted">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
