'use client'

import { useEffect, useState } from 'react'
import { useTranslations } from 'next-intl'
import type { LegalSection } from '@/types/legal'

const SCROLL_OFFSET = 120 // px from the top of the viewport counted as "current"

export function LegalTableOfContents({ sections }: { sections: LegalSection[] }) {
  const t = useTranslations('legal')
  const [activeId, setActiveId] = useState(sections[0]?.id)

  useEffect(() => {
    // A direct scroll-position check rather than IntersectionObserver +
    // rootMargin tricks: for sections of very different heights (a short
    // "Cookies & Tracking" vs. a long "Information Collection"), a narrow
    // observer band is unreliable — it can skip short sections entirely on
    // a fast scroll. Walking sections top-to-bottom and taking the last one
    // whose heading has crossed the offset line is simpler and correct
    // regardless of section length or scroll speed.
    function updateActive() {
      let current = sections[0]?.id
      for (const section of sections) {
        const el = document.getElementById(section.id)
        if (!el) continue
        if (el.getBoundingClientRect().top - SCROLL_OFFSET <= 0) {
          current = section.id
        }
      }

      // The last section can be short enough that the page runs out of
      // room to scroll it past the offset line (nothing scrollable below
      // it but the footer) — without this, the final TOC item could never
      // activate even once the user has clearly reached the bottom.
      const scrolledToBottom =
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2
      if (scrolledToBottom) {
        current = sections[sections.length - 1]?.id ?? current
      }

      setActiveId(current)
    }

    updateActive()
    window.addEventListener('scroll', updateActive, { passive: true })
    window.addEventListener('resize', updateActive)
    return () => {
      window.removeEventListener('scroll', updateActive)
      window.removeEventListener('resize', updateActive)
    }
  }, [sections])

  return (
    <nav className="sticky top-24 rounded-card bg-white p-5 shadow-sm ring-1 ring-black/5">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-muted">{t('contents')}</p>
      <ul className="mt-3 space-y-2.5">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              className={`text-sm transition-colors ${
                activeId === section.id ? 'font-semibold text-brand-navy' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {section.heading}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  )
}
