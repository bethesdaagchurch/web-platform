import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm'
import { getPayloadClient } from '@/lib/payload'
import { adaptSiteSettings } from '@/lib/site-settings-adapter'

export default async function ResetPasswordPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>
  searchParams: Promise<{ token?: string }>
}) {
  const { locale } = await params
  const { token } = await searchParams
  const payload = await getPayloadClient()
  const [siteSettingsDoc, t] = await Promise.all([
    payload.findGlobal({ slug: 'site-settings', locale: locale as 'en' | 'ta' | 'kn' }),
    getTranslations('auth'),
  ])
  const siteSettings = adaptSiteSettings(siteSettingsDoc)

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-cream px-6 py-16">
      <Image src="/images/login-background.jpg" alt="" fill priority className="object-cover" />
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(250,250,248,0.35) 0%, rgba(250,250,248,0.75) 55%, rgba(250,250,248,0.94) 100%)',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <h1 className="text-4xl font-semibold text-brand-navy">{siteSettings.churchName}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('resetPasswordHeading')}</p>
        <p className="mt-1 max-w-sm text-center text-sm text-ink-muted">{t('resetPasswordSubtext')}</p>

        <div className="mt-8">
          <ResetPasswordForm token={token} />
        </div>
      </div>
    </div>
  )
}
