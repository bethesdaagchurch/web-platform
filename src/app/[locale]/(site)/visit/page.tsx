import { VisitHero } from '@/components/visit/VisitHero'
import { PlanVisitForm } from '@/components/visit/PlanVisitForm'
import { WhatToExpectCard } from '@/components/visit/WhatToExpectCard'
import { VisitServiceTimesCard } from '@/components/visit/VisitServiceTimesCard'

import { getPayloadClient } from '@/lib/payload'
import { adaptVisitHero, adaptExpectations, adaptVisitServiceTimes } from '@/lib/visit-adapter'

// The dropdown's option list is structural form config, not editorial
// content — stays code-owned rather than moving into Payload.
import { numberInPartyOptions } from '@/data/visit-mock'

export default async function VisitPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const doc = await payload.findGlobal({ slug: 'visit-page', locale: locale as 'en' | 'ta' | 'kn' })

  return (
    <>
      <VisitHero data={adaptVisitHero(doc)} />
      <section className="mx-auto max-w-content px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <PlanVisitForm partyOptions={numberInPartyOptions} />
          <div className="flex flex-col gap-6">
            <WhatToExpectCard items={adaptExpectations(doc)} />
            <VisitServiceTimesCard times={adaptVisitServiceTimes(doc)} />
          </div>
        </div>
      </section>
    </>
  )
}
