import { useTranslations } from 'next-intl'
import { Navigation } from 'lucide-react'
import { resolveMapEmbedUrl } from '@/lib/site-settings-adapter'
import type { SiteSettings } from '@/types/homepage'

export function DirectionsMap({ settings }: { settings: SiteSettings }) {
  const t = useTranslations('common')
  const query = encodeURIComponent([settings.churchName, ...settings.address].join(' '))
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`

  return (
    <div className="relative h-96 overflow-hidden rounded-card bg-surface-cream ring-1 ring-black/5">
      <iframe
        src={resolveMapEmbedUrl(settings)}
        className="h-full w-full border-0"
        loading="lazy"
        title="Map to Bethesda AG Church"
      />

      <div className="absolute bottom-4 left-4 rounded-card bg-white p-4 shadow-md">
        <p className="text-sm font-semibold text-ink">{settings.churchName}</p>
        {settings.address.map((line) => (
          <p key={line} className="text-xs text-ink-muted">
            {line}
          </p>
        ))}
        <a
          href={directionsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-2 inline-flex items-center gap-1.5 rounded-md bg-brand-navy px-3 py-1.5 text-xs font-medium text-white hover:bg-brand-navy-dark"
        >
          <Navigation size={12} /> {t('getDirections')}
        </a>
      </div>
    </div>
  )
}
