import { getTranslations } from 'next-intl/server'
import { MapPin, Phone, Navigation } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { resolveMapEmbedUrl } from '@/lib/site-settings-adapter'
import type { SiteSettings } from '@/types/homepage'

export async function VisitUs({ settings }: { settings: SiteSettings }) {
  const t = await getTranslations('homepage.visitUs')

  return (
    <section className="mx-auto max-w-content px-6 py-16">
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          <h2 className="text-2xl font-semibold text-brand-navy-dark">{t('heading')}</h2>

          <div className="mt-6 flex gap-3">
            <MapPin size={18} className="mt-0.5 shrink-0 text-brand-gold" />
            <div>
              <p className="text-sm font-semibold text-ink">{settings.churchName}</p>
              {settings.address.map((line) => (
                <p key={line} className="text-sm text-ink-muted">
                  {line}
                </p>
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-3">
            <Phone size={18} className="mt-0.5 shrink-0 text-brand-gold" />
            <div>
              <p className="text-sm font-semibold text-ink">{t('contact')}</p>
              <p className="text-sm text-ink-muted">{settings.phone}</p>
              <p className="text-sm text-ink-muted">{settings.email}</p>
            </div>
          </div>

          <div className="mt-6">
            <Button href="/directions" variant="primary" icon={<Navigation size={14} />}>
              {t('getDirections')}
            </Button>
          </div>
        </div>

        {/* Same fix as DirectionsMap/VisitMap — auto-derives a real, working
            embed from the address rather than depending on a manually-set
            field that had never actually been filled in. */}
        <div className="h-64 overflow-hidden rounded-card bg-surface-cream ring-1 ring-black/5 md:h-full">
          <iframe
            src={resolveMapEmbedUrl(settings)}
            className="h-full w-full border-0"
            loading="lazy"
            title="Map to Bethesda AG Church"
          />
        </div>
      </div>
    </section>
  )
}
