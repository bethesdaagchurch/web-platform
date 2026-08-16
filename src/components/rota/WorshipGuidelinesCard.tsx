import { Music } from 'lucide-react'
import { Link } from '@/i18n/navigation'
import type { WorshipGuidelinesData } from '@/types/rota'

export function WorshipGuidelinesCard({ data }: { data: WorshipGuidelinesData }) {
  return (
    <div className="rounded-card bg-brand-navy p-6">
      <Music size={20} className="text-white" />
      <h2 className="mt-3 text-xl font-semibold text-white">{data.heading}</h2>
      <p className="mt-2 text-sm text-white/75">{data.description}</p>
      <Link
        href={data.linkHref}
        className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-white hover:underline"
      >
        {data.linkLabel} &rarr;
      </Link>
    </div>
  )
}
