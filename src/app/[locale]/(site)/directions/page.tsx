import { DirectionsHero } from '@/components/directions/DirectionsHero'
import { DirectionsMap } from '@/components/directions/DirectionsMap'
import { DirectionsServiceTimesCard } from '@/components/directions/DirectionsServiceTimesCard'
import { NeedHelpCard } from '@/components/directions/NeedHelpCard'
import { DrivingDirectionsBlock } from '@/components/directions/DrivingDirectionsBlock'
import { ParkingAccessibilityBlock } from '@/components/directions/ParkingAccessibilityBlock'

import { getPayloadClient } from '@/lib/payload'
import {
  adaptDirectionsHero,
  adaptDirectionsServiceTimes,
  adaptNeedHelp,
  adaptDrivingDirections,
  adaptParkingItems,
} from '@/lib/directions-adapter'
import { adaptSiteSettings } from '@/lib/site-settings-adapter'

export default async function DirectionsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [doc, siteSettingsDoc] = await Promise.all([
    payload.findGlobal({ slug: 'directions-page', locale: typedLocale }),
    payload.findGlobal({ slug: 'site-settings', locale: typedLocale }),
  ])

  const settings = adaptSiteSettings(siteSettingsDoc)

  return (
    <>
      <DirectionsHero data={adaptDirectionsHero(doc)} />

      <section className="mx-auto max-w-content px-6 pb-8">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <DirectionsMap settings={settings} />
          <div className="flex flex-col gap-6">
            <DirectionsServiceTimesCard times={adaptDirectionsServiceTimes(doc)} />
            <NeedHelpCard data={adaptNeedHelp(doc)} settings={settings} />
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-content px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-2">
          <DrivingDirectionsBlock sections={adaptDrivingDirections(doc)} />
          <ParkingAccessibilityBlock items={adaptParkingItems(doc)} />
        </div>
      </section>
    </>
  )
}
