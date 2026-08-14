import { getTranslations } from 'next-intl/server'

interface PagePlaceholderProps {
  title: string
  note?: string
}

// Used by every route that has navigation wired up but no real design yet.
// Once you share a screenshot/Figma for a given page, this gets replaced
// with real components — same pattern as the homepage build.
export async function PagePlaceholder({ title, note }: PagePlaceholderProps) {
  const t = await getTranslations('pagePlaceholder')

  return (
    <div className="mx-auto max-w-content px-6 py-24 text-center">
      <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{t('badge')}</p>
      <h1 className="mt-2 text-3xl font-semibold text-brand-navy-dark">{title}</h1>
      <p className="mx-auto mt-3 max-w-md text-sm text-ink-muted">{note ?? t('defaultNote')}</p>
    </div>
  )
}
