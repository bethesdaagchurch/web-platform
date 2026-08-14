import { getTranslations } from 'next-intl/server'
import { SitemapSectionCard } from '@/components/sitemap/SitemapSectionCard'
import { sitemapSectionStructure } from '@/data/sitemap-mock'

export default async function SitemapPage() {
  const t = await getTranslations('sitemap')

  const sitemapSections = sitemapSectionStructure.map((section) => ({
    id: section.id,
    icon: section.icon,
    title: t(`sections.${section.id}.title`),
    links: section.links.map((link) => ({
      href: link.href,
      label: t(`sections.${section.id}.links.${link.id}.label`),
      description: t(`sections.${section.id}.links.${link.id}.description`),
    })),
  }))

  return (
    <div className="mx-auto max-w-content px-6 py-16">
      <div className="text-center">
        <h1 className="text-4xl font-semibold text-ink md:text-5xl">{t('pageHeading')}</h1>
        <p className="mx-auto mt-3 max-w-lg text-sm text-ink-muted">{t('pageSubtext')}</p>
      </div>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {sitemapSections.map((section) => (
          <SitemapSectionCard key={section.id} section={section} />
        ))}
      </div>
    </div>
  )
}
