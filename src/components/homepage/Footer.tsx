import { getTranslations, getLocale } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { getPayloadClient } from '@/lib/payload'
import { adaptSiteSettings } from '@/lib/site-settings-adapter'

// lucide-react dropped brand/logo icons (Facebook, Instagram, YouTube) to
// avoid trademark issues, so social icons are small inline SVGs instead.
const socialIcons = [
  {
    label: 'Facebook',
    path: 'M13 10h3V6h-3c-1.7 0-3 1.3-3 3v2H8v4h2v6h4v-6h3l1-4h-4v-2c0-.6.4-1 1-1Z',
  },
  {
    label: 'Instagram',
    path: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm0 2a2 2 0 1 1 0 4 2 2 0 0 1 0-4Zm4.5-3.5h.01M7 3h10a4 4 0 0 1 4 4v10a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4V7a4 4 0 0 1 4-4Z',
  },
  {
    label: 'YouTube',
    path: 'M21 8.5s-.2-1.5-.8-2.1c-.8-.8-1.7-.8-2.1-.9C15.6 5.3 12 5.3 12 5.3s-3.6 0-6.1.2c-.4 0-1.3.1-2.1.9C3.2 7 3 8.5 3 8.5S2.8 10.2 2.8 12v1.9c0 1.8.2 3.5.2 3.5s.2 1.5.8 2.1c.8.8 1.8.8 2.3.9 1.7.2 7 .2 7 .2s3.6 0 6.1-.2c.4-.1 1.3-.1 2.1-.9.6-.6.8-2.1.8-2.1s.2-1.7.2-3.5V12c0-1.8-.2-3.5-.2-3.5ZM10 15V9l5.2 3-5.2 3Z',
  },
]

// Self-fetching rather than accepting props: Footer renders on every page
// via (site)/layout.tsx, and threading site-settings through every single
// page.tsx just to hand it down would be needless plumbing. getPayloadClient
// is request-cached (see src/lib/payload.ts), so if a page has already
// fetched site-settings this request, this doesn't trigger a second query.
export async function Footer() {
  const t = await getTranslations('footer')
  const locale = await getLocale()
  const payload = await getPayloadClient()
  const siteSettingsDoc = await payload.findGlobal({
    slug: 'site-settings',
    locale: locale as 'en' | 'ta' | 'kn',
  })
  const siteSettings = adaptSiteSettings(siteSettingsDoc)

  return (
    <footer className="border-t border-black/5 bg-white">
      <div className="mx-auto max-w-content px-6 py-12">
        <div className="grid gap-10 md:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-lg font-semibold text-brand-navy">{siteSettings.churchName}</p>
            <p className="mt-2 max-w-sm text-sm text-ink-muted">{siteSettings.tagline}</p>
            <div className="mt-4 flex gap-3">
              {socialIcons.map((social) => (
                <span
                  key={social.label}
                  aria-label={social.label}
                  className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-ink-muted"
                >
                  <svg viewBox="0 0 24 24" width={14} height={14} fill="currentColor" aria-hidden="true">
                    <path d={social.path} />
                  </svg>
                </span>
              ))}
            </div>
          </div>

          {siteSettings.footerLinks.map((group) => (
            <div key={group.key}>
              <p className="text-xs font-semibold uppercase tracking-wide text-brand-gold">{t(group.key)}</p>
              <ul className="mt-3 space-y-2">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-sm text-ink-muted hover:text-brand-navy">
                      {t(link.key)}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mt-10 border-t border-black/5 pt-6 text-center text-xs text-ink-muted">
          &copy; {new Date().getFullYear()} {siteSettings.churchName}. {t('rights')}
        </p>
      </div>
    </footer>
  )
}
