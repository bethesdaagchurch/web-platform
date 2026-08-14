import { Link } from '@/i18n/navigation'
import { Headphones, AudioWaveform } from 'lucide-react'
import type { PodcastCtaData } from '@/types/sermons'

const iconMap = {
  headphones: Headphones,
  waveform: AudioWaveform,
} as const

export function PodcastCta({ data }: { data: PodcastCtaData }) {
  return (
    <section className="mx-auto max-w-content px-6 pb-16">
      <div className="flex flex-col items-start gap-6 rounded-2xl bg-brand-navy p-8 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-white">{data.heading}</h2>
          <p className="mt-2 max-w-lg text-sm text-white/80">{data.description}</p>
        </div>

        <div className="flex shrink-0 gap-3">
          {data.links.map((link) => {
            const Icon = iconMap[link.icon]
            return (
              <Link
                key={link.label}
                href={link.href}
                className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-brand-navy-dark hover:bg-white/90"
              >
                <Icon size={16} /> {link.label}
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
