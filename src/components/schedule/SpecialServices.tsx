import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Star } from 'lucide-react'
import type { SpecialServiceItem } from '@/types/schedule'

export function SpecialServices({ items }: { items: SpecialServiceItem[] }) {
  const t = useTranslations('schedule')
  return (
    <section className="mx-auto max-w-content px-6 pb-16">
      <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
        <Star size={18} className="text-brand-gold" /> {t('specialServices')}
      </h2>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 overflow-hidden rounded-card bg-white shadow-sm ring-1 ring-black/5">
            <Image src={item.image} alt={item.title} width={220} height={220} className="h-auto w-40 shrink-0 object-cover" />
            <div className="py-5 pr-5">
              <h3 className="text-lg font-semibold text-brand-navy">{item.title}</h3>
              <p className="mt-1 text-xs font-medium text-brand-gold">{item.schedule}</p>
              <p className="mt-2 text-sm text-ink-muted">{item.description}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
