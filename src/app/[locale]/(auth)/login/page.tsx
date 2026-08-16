import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { redirect } from '@/i18n/navigation'
import { Link } from '@/i18n/navigation'
import { LoginForm } from '@/components/auth/LoginForm'
import { getCurrentMember } from '@/lib/get-member'
import { siteSettings } from '@/data/homepage-mock'

export default async function LoginPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const [member, t] = await Promise.all([getCurrentMember(), getTranslations('auth')])
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
      {/* Soft white vignette over the photo — keeps the corners/edges
          legible against the card and heading without flattening the
          whole image to near-invisibility the way a flat low opacity did. */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 40%, rgba(250,250,248,0.35) 0%, rgba(250,250,248,0.75) 55%, rgba(250,250,248,0.94) 100%)',
        }}
      />

      <div className="relative z-10 flex w-full flex-col items-center">
        <h1 className="text-4xl font-semibold text-brand-navy">{siteSettings.churchName}</h1>
        <p className="mt-1 text-sm text-ink-muted">{t('signInHeading')}</p>

        <div className="mt-8">
          <LoginForm />
        </div>

        <p className="mt-6 text-sm text-ink-muted">
          {t('newHere')}{' '}
          <Link href="/create-account" className="font-medium text-brand-navy hover:underline">
            {t('createAnAccount')}
          </Link>
        </p>
      </div>
    </div>
  )
}
