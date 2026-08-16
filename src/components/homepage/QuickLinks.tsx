import { Link } from '@/i18n/navigation'
import { Video, Calendar, HeartHandshake, Mail } from 'lucide-react'
import type { QuickLink } from '@/types/homepage'

const iconMap = {
  watch: Video,
  calendar: Calendar,
  give: HeartHandshake,
  prayer: Mail,
} as const

export function QuickLinks({ links }: { links: QuickLink[] }) {
  return (
    <section className="relative z-20 mx-auto -mt-12 w-full max-w-content px-6">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {links.map((link) => {
          const Icon = iconMap[link.icon]
          return (
            <Link
              key={link.id}
              href={link.href}
              className="rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5 transition-shadow hover:shadow-md"
            >
              <span className="mb-3 inline-flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold-light">
                <Icon size={16} className="text-brand-navy-dark" />
              </span>
              <p className="text-sm font-semibold text-ink">{link.title}</p>
              <p className="mt-0.5 text-xs text-ink-muted">{link.subtext}</p>
            </Link>
          )
        })}
      </div>
    </section>
  )
}
