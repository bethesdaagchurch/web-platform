import { Cookie, Settings, UserCog } from 'lucide-react'
import { LegalBlockView } from '@/components/legal/LegalBlockView'
import type { LegalSection } from '@/types/legal'

const sectionIcons = { cookie: Cookie, settings: Settings, preferences: UserCog } as const

export function LegalSectionsList({ sections }: { sections: LegalSection[] }) {
  return (
    <div className="rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5 md:p-10">
      {sections.map((section, i) => {
        const Icon = section.icon ? sectionIcons[section.icon] : null
        return (
          <section key={section.id} className={i === 0 ? '' : 'mt-8 border-t border-black/5 pt-8'}>
            {section.heading && (
              <h2 className="flex items-center gap-2 text-2xl font-semibold text-ink">
                {Icon && <Icon size={20} className="text-brand-navy" />}
                {section.heading}
              </h2>
            )}
            {section.blocks.map((block, j) => (
              <LegalBlockView key={j} block={block} />
            ))}
          </section>
        )
      })}
    </div>
  )
}
