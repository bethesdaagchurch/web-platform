import { getTranslations } from 'next-intl/server'
import { PageLoader } from '@/components/ui/PageLoader'

// Overrides the generic (site)/loading.tsx for this route specifically —
// Next.js uses the nearest loading.tsx to the page that's actually
// loading, so this takes priority over the sitewide default only while
// navigating within /live.
export default async function LiveLoading() {
  const t = await getTranslations('pageLoader')
  return <PageLoader heading={t('worshipHeading')} subtext={t('worshipSubtext')} />
}
