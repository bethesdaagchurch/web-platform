import { useTranslations } from 'next-intl'

export function WelcomeHeader({ firstName }: { firstName: string }) {
  const t = useTranslations('dashboard')
  return (
    <div className="mx-auto max-w-content px-6 pt-10">
      <h1 className="text-4xl font-semibold text-ink md:text-5xl">
        {t('welcomeBack')}, {firstName}
      </h1>
      <p className="mt-2 text-sm text-ink-muted">{t('overview')}</p>
    </div>
  )
}
