import { getTranslations } from 'next-intl/server'
import { PagePlaceholder } from '@/components/ui/PagePlaceholder'

export default async function ForgotPasswordPage() {
  const t = await getTranslations('placeholders')
  return (
    <div className="flex min-h-screen items-center justify-center">
      <PagePlaceholder title={t('forgotPassword')} />
    </div>
  )
}
