import Image from 'next/image'
import { getTranslations } from 'next-intl/server'
import { Link } from '@/i18n/navigation'
import { ArrowRight } from 'lucide-react'
import type { CommunityFocusItem } from '@/types/events'

export async function CommunityFocus({ items }: { items: CommunityFocusItem[] }) {
  const t = await getTranslations('events')

  return (
    <section className="bg-surface-cream px-6 py-16">
      <div className="mx-auto max-w-content">
        <h2 className="text-center text-2xl font-semibold text-brand-navy-dark md:text-3xl">{t('communityFocus')}</h2>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5">
              <div className="relative h-40">
                <Image src={item.image} alt="" fill className="object-cover" />
              </div>
              <div className="p-5">
                <h3 className="text-base font-semibold text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
                <Link
                  href={item.href}
                  className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-brand-navy hover:underline"
                >
                  {item.linkLabel} <ArrowRight size={14} />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
