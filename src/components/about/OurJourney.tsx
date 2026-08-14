import { getTranslations } from 'next-intl/server'
import type { JourneyMilestone } from '@/types/about'

export async function OurJourney({ milestones }: { milestones: JourneyMilestone[] }) {
  const t = await getTranslations('about.journey')

  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-content text-center">
        <h2 className="text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('heading')}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-muted">{t('description')}</p>
      </div>

      {/* Center line only shown from sm up — on mobile this collapses to a
          single-column stack (see the sm: prefixes below), which is a
          judgment call since the design was only provided at desktop width. */}
      <div className="relative mx-auto mt-12 max-w-2xl">
        <div className="absolute left-1/2 top-0 hidden h-full w-px -translate-x-1/2 bg-black/10 sm:block" />

        <div className="space-y-10">
          {milestones.map((milestone, i) => {
            const isRight = i % 2 === 0
            const dotColor = milestone.dotAccent === 'gold' ? 'bg-brand-gold' : 'bg-brand-navy'

            return (
              <div key={milestone.id} className="relative grid gap-4 sm:grid-cols-2 sm:items-center">
                <span
                  className={`absolute left-1/2 top-1/2 hidden h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full sm:block ${dotColor}`}
                />

                {isRight ? (
                  <>
                    <div />
                    <MilestoneCard milestone={milestone} />
                  </>
                ) : (
                  <>
                    <MilestoneCard milestone={milestone} align="right" />
                    <div />
                  </>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function MilestoneCard({ milestone, align }: { milestone: JourneyMilestone; align?: 'right' }) {
  return (
    <div className={`rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5 ${align === 'right' ? 'sm:ml-auto sm:max-w-sm' : 'sm:max-w-sm'}`}>
      <p className="text-lg font-semibold text-brand-gold">{milestone.year}</p>
      <h3 className="mt-1 text-base font-semibold text-brand-navy-dark">{milestone.title}</h3>
      <p className="mt-1.5 text-sm text-ink-muted">{milestone.description}</p>
    </div>
  )
}
