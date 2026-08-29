import { getTranslations } from 'next-intl/server'
import { SermonHero } from '@/components/sermons/SermonHero'
import { SermonsExplorer } from '@/components/sermons/SermonsExplorer'
import { PodcastCta } from '@/components/sermons/PodcastCta'

import { getPayloadClient } from '@/lib/payload'
import { adaptSermonHero, adaptSermonEntries, adaptFilterOptions, adaptPodcastCta } from '@/lib/sermons-adapter'

export default async function SermonsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [sermonsPage, sermonsResult, t] = await Promise.all([
    payload.findGlobal({ slug: 'sermons-page', locale: typedLocale }),
    payload.find({ collection: 'sermons', locale: typedLocale, limit: 100, sort: '-date' }),
    getTranslations('sermons'),
  ])

  const entries = adaptSermonEntries(sermonsResult.docs)
  const { seriesOptions, speakerOptions, topicOptions } = adaptFilterOptions(entries, {
    series: t('allSeries'),
    speaker: t('allSpeakers'),
    topic: t('allTopics'),
  })

  const heroData = adaptSermonHero(sermonsPage)
  const podcastCtaData = adaptPodcastCta(sermonsPage)

  return (
    <>
      {heroData && <SermonHero data={heroData} />}
      <SermonsExplorer
        sermons={entries}
        seriesOptions={seriesOptions}
        speakerOptions={speakerOptions}
        topicOptions={topicOptions}
      />
      {podcastCtaData && <PodcastCta data={podcastCtaData} />}
    </>
  )
}
