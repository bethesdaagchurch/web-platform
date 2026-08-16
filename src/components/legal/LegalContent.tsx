import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { LegalBlockView } from '@/components/legal/LegalBlockView'
import type { LegalPageData } from '@/types/legal'

export async function LegalContent({ data }: { data: LegalPageData }) {
  const t = await getTranslations('common')

  return (
    <div className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
      <Link href="/" className="text-sm font-medium text-brand-navy hover:underline">
        &larr; {t('backToHome')}
      </Link>

      <h1 className="mt-4 text-4xl font-semibold text-ink">{data.title}</h1>
      <p className="mt-2 text-sm text-ink-muted">
        {t('lastUpdated')}: {data.lastUpdated}
      </p>

      <hr className="mt-6 border-black/10" />

      {data.sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24 pt-8">
          <h2 className="text-2xl font-semibold text-ink">{section.heading}</h2>
          {section.blocks.map((block, i) => (
            <LegalBlockView key={i} block={block} />
          ))}
        </section>
      ))}
    </div>
  )
}
