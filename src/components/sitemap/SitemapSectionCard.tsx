import { Link } from '@/i18n/navigation'
import { Home, Info, Users, PlayCircle, Calendar, ChevronRight } from 'lucide-react'
import type { SitemapSection } from '@/types/sitemap'

const iconMap = {
  home: Home,
  info: Info,
  ministries: Users,
  sermons: PlayCircle,
  events: Calendar,
} as const

export function SitemapSectionCard({ section }: { section: SitemapSection }) {
  const Icon = iconMap[section.icon]

  return (
    <div className="rounded-card bg-white p-6 shadow-sm ring-1 ring-black/5">
      <div className="flex items-center gap-2 border-b border-black/10 pb-3">
        <Icon size={18} className="text-brand-navy" />
        <h2 className="text-lg font-semibold text-ink">{section.title}</h2>
      </div>

      <ul className="mt-4 space-y-4">
        {section.links.map((link) => (
          <li key={link.href + link.label}>
            <Link href={link.href} className="group flex gap-1.5">
              <ChevronRight size={14} className="mt-0.5 shrink-0 text-brand-gold" />
              <span>
                <span className="block text-sm font-medium text-ink group-hover:text-brand-navy">{link.label}</span>
                <span className="text-xs text-ink-muted">{link.description}</span>
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
