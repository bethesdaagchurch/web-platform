import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'

export default function NotFound() {
  const t = useTranslations('notFound')

  return (
    <div className="mx-auto max-w-content px-6 py-24 text-center">
      <p className="text-sm font-semibold text-brand-gold">404</p>
      <h1 className="mt-2 text-3xl font-semibold text-brand-navy-dark">{t('heading')}</h1>
      <Link href="/" className="mt-4 inline-block text-sm font-medium text-brand-navy hover:underline">
        {t('backHome')}
      </Link>
    </div>
  )
}
