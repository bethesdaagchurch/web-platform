import { useTranslations } from 'next-intl'

export function LegalHero({
  eyebrow,
  title,
  subtext,
  lastUpdated,
  align = 'center',
}: {
  eyebrow?: string
  title: string
  subtext?: string
  lastUpdated?: string
  align?: 'left' | 'center'
}) {
  const isLeft = align === 'left'
  const t = useTranslations('common')

  return (
    <section className={isLeft ? 'px-6 pt-16' : 'bg-gradient-to-b from-black/5 to-transparent px-6 py-16 text-center'}>
      <div className={isLeft ? 'mx-auto max-w-3xl' : ''}>
        {eyebrow && <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{eyebrow}</p>}
        <h1
          className={
            isLeft
              ? 'mt-1 text-4xl font-semibold text-ink md:text-5xl'
              : 'mx-auto mt-3 max-w-xl text-4xl font-semibold text-ink md:text-5xl'
          }
        >
          {title}
        </h1>
        {lastUpdated && <p className="mt-2 text-sm text-ink-muted">{t('lastUpdated')}: {lastUpdated}</p>}
        {subtext && (
          <p className={isLeft ? 'mt-4 max-w-lg text-sm text-ink-muted' : 'mx-auto mt-4 max-w-lg text-sm text-ink-muted'}>
            {subtext}
          </p>
        )}
      </div>
    </section>
  )
}
