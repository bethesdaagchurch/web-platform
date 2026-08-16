import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { CreateAccountForm } from '@/components/auth/CreateAccountForm'
import { getCurrentMember } from '@/lib/get-member'
import { siteSettings } from '@/data/homepage-mock'

export default async function CreateAccountPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [member, t, tCommon] = await Promise.all([
    getCurrentMember(),
    getTranslations('auth'),
    getTranslations('common'),
  ])
  if (member) redirect({ href: '/', locale })

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-surface-cream px-6 py-16">
      <Image
        src="/images/login-background.jpg"
        alt=""
        fill
        priority
        className="object-cover"
      />
      {/* Same soft white vignette as the Login page — these two share the
          identical visual treatment, kept consistent between both. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(250,250,248,0.35) 0%, rgba(250,250,248,0.75) 55%, rgba(250,250,248,0.94) 100%)',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <h1 className="text-4xl font-semibold text-brand-navy">{siteSettings.churchName}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('createAccountHeading')}</p>

        <div className="mt-8">
          <CreateAccountForm />
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {t('alreadyHaveAccount')}{' '}
          <Link href="/login" className="font-medium text-brand-navy hover:underline">
            {tCommon('signIn')}
          </Link>
        </p>
      </div>
    </div>
  )
}
