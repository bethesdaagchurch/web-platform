import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { Link } from '@/i18n/navigation'
import { Play } from 'lucide-react'
import type { SermonHeroData } from '@/types/sermons'

export function SermonHero({ data }: { data: SermonHeroData }) {
  const t = useTranslations('sermons.hero')
  return (
    <section className="mx-auto max-w-content px-6 pt-8">
      <div className="relative isolate h-[440px] overflow-hidden rounded-2xl">
        <Image src={data.backgroundImage} alt={data.title} fill priority className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

        <div className="relative z-10 flex h-full max-w-xl flex-col justify-end p-8">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-brand-gold px-3 py-1 text-xs font-semibold uppercase tracking-wide text-brand-navy-dark">
              {data.badge}
            </span>
            <span className="text-xs text-white/80">{data.date}</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold text-white md:text-4xl">{data.title}</h1>
          <p className="mt-3 text-sm text-white/85">{data.description}</p>

          <div className="mt-5">
            <Link
              href={`/sermons/${data.slug}`}
              className="inline-flex items-center gap-2 rounded-full bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark"
            >
              <Play size={14} fill="currentColor" /> {t('watchNow')}
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
