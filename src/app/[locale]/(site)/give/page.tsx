import { GiveHero } from '@/components/give/GiveHero'
import { GivingForm } from '@/components/give/GivingForm'
import { ImpactSidebar } from '@/components/give/ImpactSidebar'
import { OtherWaysToGive } from '@/components/give/OtherWaysToGive'

import { giveHero, presetAmounts, fundOptions, impactData, otherWaysToGive } from '@/data/give-mock'

export default function GivePage() {
  return (
    <>
      <GiveHero data={giveHero} />

      <section className="mx-auto max-w-content px-6 py-12">
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr] md:items-start">
          <div className="space-y-6">
            <GivingForm presetAmounts={presetAmounts} fundOptions={fundOptions} />
            <OtherWaysToGive ways={otherWaysToGive} />
          </div>
          <ImpactSidebar data={impactData} />
        </div>
      </section>
    </>
  )
}
