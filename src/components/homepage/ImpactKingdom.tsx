import { getTranslations } from 'next-intl/server'
import { Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import type { GivingCategory } from '@/types/homepage'

export async function ImpactKingdom({ breakdown }: { breakdown: GivingCategory[] }) {
  const t = await getTranslations('homepage.impactKingdom')

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2 md:items-center">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
          <p className="mt-2 max-w-md text-sm text-ink-muted">{t('description')}</p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Button href="/give?type=one-time" variant="primary">
              {t('oneTime')}
            </Button>
            <Button href="/give?type=recurring" variant="outline">
              {t('recurring')}
            </Button>
          </div>

          <p className="mt-4 flex items-center gap-1.5 text-xs text-ink-muted">
            <Lock size={12} /> {t('secure')}
          </p>
        </div>

        <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
          <h3 className="text-sm font-semibold text-brand-gold">{t('whereItGoes')}</h3>
          <ul className="mt-4 space-y-4">
            {breakdown.map((item) => (
              <li key={item.id}>
                <div className="flex justify-between text-sm">
                  <span className="text-ink">{item.label}</span>
                  <span className="font-semibold text-ink">{item.percentage}%</span>
                </div>
                <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-cream">
                  <div
                    className="h-full rounded-full bg-brand-navy"
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
