import { useTranslations } from 'next-intl'
import { Navigation } from 'lucide-react'
import type { VisitData } from '@/types/contact'

export function VisitMap({ data }: { data: VisitData }) {
  const t = useTranslations()
  return (
    <section className="mx-auto max-w-content px-6 pb-16">
      <div className="relative h-96 overflow-hidden rounded-2xl bg-surface-cream ring-1 ring-black/5">
        <iframe
          src={data.mapEmbedUrl}
          className="h-full w-full border-0"
          loading="lazy"
          title="Map to Bethesda AG Church"
        />

        <div className="absolute bottom-4 left-4 rounded-card bg-white p-4 shadow-md">
          <p className="text-xs text-ink-muted">{t('contact.visitInPerson')}</p>
          <p className="text-sm font-semibold text-ink">{data.campusName}</p>
          <a
            href={data.directionsHref}
            className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-surface-cream px-3 py-1.5 text-xs font-medium text-brand-navy hover:bg-blue-50"
          >
            <Navigation size={12} /> {t('common.getDirections')}
          </a>
        </div>
      </div>
    </section>
  )
}
