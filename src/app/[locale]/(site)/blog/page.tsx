import { getTranslations } from 'next-intl/server'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export default async function BlogPage() {
  const t = await getTranslations('placeholders')
  return <PagePlaceholder title={t('blog')} />
}
