'use client'

import { useState, useRef, useEffect } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import { Globe } from 'lucide-react'
import { Link, usePathname } from '@/i18n/navigation'
import { routing } from '@/i18n/routing'

const localeLabels: Record<string, string> = {
  en: 'English',
  ta: '\u0ba4\u0bae\u0bbf\u0bb4\u0bcd',
  kn: '\u0c95\u0ca8\u0ccd\u0ca8\u0ca1',
}

export function LocaleSwitcher() {
  const [open, setOpen] = useState(false)
  const locale = useLocale()
  const pathname = usePathname()
  const t = useTranslations('header')
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-label={t('languageLabel')}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="rounded-full border border-black/10 p-2 hover:bg-surface-cream"
      >
        <Globe size={16} className="text-ink-muted" />
      </button>

      {open && (
        <ul className="absolute right-0 top-full z-50 mt-2 w-32 rounded-md border border-black/10 bg-white py-1 shadow-md">
          {routing.locales.map((loc) => (
            <li key={loc}>
              <Link
                href={pathname}
                locale={loc}
                onClick={() => setOpen(false)}
                className={`block px-3 py-1.5 text-sm ${
                  loc === locale ? 'font-semibold text-brand-navy' : 'text-ink hover:bg-surface-cream'
                }`}
              >
                {localeLabels[loc]}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
