import { PrayerHero } from '@/components/prayer/PrayerHero'
import { PrayerForm } from '@/components/prayer/PrayerForm'
import { PrayerTeamCard } from '@/components/prayer/PrayerTeamCard'
import { IntercedeCard } from '@/components/prayer/IntercedeCard'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { adaptPrayerHero, adaptPrayerTeam, adaptIntercedeCard } from '@/lib/prayer-adapter'

// Forces per-request dynamic rendering, never a cached/static response.
// This page's content depends on the visitor's session (IntercedeCard's
// sign-in prompt vs. real join link) — a cached response would mean
// whoever's session happened to be baked into the cache gets served to
// everyone after them. headers()-based auth checks are supposed to opt a
// route out of static generation automatically, but this makes it
// unambiguous rather than relying on that inference holding across every
// hosting environment (this project's build output showed this route
// marked static, which needn't mean it's actually cached at the edge in
// production, but there's no way to verify that from this sandbox, so
// removing the ambiguity entirely is the safer fix).
export const dynamic = 'force-dynamic'

export default async function PrayerPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [doc, member] = await Promise.all([
    payload.findGlobal({ slug: 'prayer-page', locale: typedLocale }),
    getCurrentMember(),
  ])

  return (
    <>
      <PrayerHero data={adaptPrayerHero(doc)} />

      <section className="mx-auto max-w-content px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-[1.6fr_1fr]">
          <PrayerForm />
          <div className="flex flex-col gap-6">
            <PrayerTeamCard data={adaptPrayerTeam(doc)} />
            <IntercedeCard data={adaptIntercedeCard(doc)} member={member} />
          </div>
        </div>
      </section>
    </>
  )
}
