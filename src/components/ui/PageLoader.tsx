import { getTranslations } from 'next-intl/server'
import { CrossSpinner } from '@/components/ui/CrossSpinner'

export async function PageLoader({
  heading,
  subtext,
}: {
  heading?: string
  subtext?: string
}) {
  const t = await getTranslations('pageLoader')

  return (
    <div
      className="relative flex min-h-[70vh] items-center justify-center bg-cover bg-center px-6"
      style={{ backgroundImage: "url('/images/hero-sanctuary.jpg')" }}
    >
      {/* Same faded-photo treatment as the Login page background — a
          plain CSS background-image rather than next/image, since this
          needs to appear instantly during a route transition, not wait on
          image optimization. */}
      <div className="absolute inset-0 bg-surface-cream/85" />

      <div className="relative z-10 w-full max-w-sm rounded-card bg-white/95 p-8 text-center shadow-lg backdrop-blur">
        <div className="flex justify-center">
          <CrossSpinner />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-brand-navy">{heading ?? t('defaultHeading')}</h1>
        <p className="mt-2 text-sm text-ink-muted">{subtext ?? t('defaultSubtext')}</p>
      </div>
    </div>
  )
}
