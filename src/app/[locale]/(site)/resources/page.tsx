import { getTranslations } from 'next-intl/server'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export default async function ResourcesPage() {
  const t = await getTranslations('placeholders')
  return <PagePlaceholder title={t('resources')} />
}
