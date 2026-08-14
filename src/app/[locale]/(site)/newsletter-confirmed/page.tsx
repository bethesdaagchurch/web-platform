import { getTranslations } from 'next-intl/server'
import { CheckCircle2 } from 'lucide-react'
import { Link } from '@/i18n/navigation'

export default async function NewsletterConfirmedPage() {
  const t = await getTranslations('newsletter')

  return (
    <div className="mx-auto flex min-h-[60vh] max-w-lg flex-col items-center justify-center px-6 py-16 text-center">
      <CheckCircle2 size={48} className="text-brand-navy" />
      <h1 className="mt-4 text-3xl font-semibold text-brand-navy-dark">{t('confirmedHeading')}</h1>
      <p className="mt-3 text-sm text-ink-muted">{t('confirmedMessage')}</p>
      <Link href="/" className="mt-6 rounded-md bg-brand-navy px-6 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark">
        {t('confirmedButton')}
      </Link>
    </div>
  )
}
