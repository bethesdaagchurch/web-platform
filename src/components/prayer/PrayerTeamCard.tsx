import Image from 'next/image'
import { HeartHandshake } from 'lucide-react'
import type { PrayerTeamData } from '@/types/prayer'

export function PrayerTeamCard({ data }: { data: PrayerTeamData }) {
  return (
    <div className="rounded-card bg-brand-navy p-6">
      <div className="flex items-center gap-2">
        <HeartHandshake size={18} className="text-white" />
        <h2 className="text-lg font-semibold text-white">{data.heading}</h2>
      </div>
      <p className="mt-3 text-sm text-white/80">{data.description}</p>

      <div className="mt-4 flex -space-x-2">
        {data.avatarImages.map((src, i) => (
          <div key={src} className="h-9 w-9 overflow-hidden rounded-full ring-2 ring-brand-navy" style={{ zIndex: data.avatarImages.length - i }}>
            <Image src={src} alt="" width={36} height={36} className="h-full w-full object-cover" />
          </div>
        ))}
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold text-xs font-semibold text-brand-navy-dark ring-2 ring-brand-navy">
          +{data.additionalCount}
        </div>
      </div>
    </div>
  )
}
