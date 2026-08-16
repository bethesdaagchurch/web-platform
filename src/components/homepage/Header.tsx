'use client'

import { useTranslations } from 'next-intl'
import { Link, usePathname } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { MemberMenu } from '@/components/auth/MemberMenu'
import { siteSettings } from '@/data/homepage-mock'
import type { Member } from '@/payload-types'

export function Header({ member }: { member: Member | null }) {
  const pathname = usePathname()
  const t = useTranslations('header')
  const tNav = useTranslations('nav')

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-navy">
          {siteSettings.churchName}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {siteSettings.nav.map((item) => {
            const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`border-b-2 pb-0.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'border-brand-navy text-brand-navy'
                    : 'border-transparent text-ink-muted hover:text-brand-navy'
                }`}
              >
                {tNav(item.key)}
              </Link>
            )
          })}
        </nav>

        <div className="flex items-center gap-4">
          {member ? (
            <MemberMenu member={member} />
          ) : (
            <Link href="/login" className="hidden text-sm font-medium text-brand-navy hover:underline sm:inline">
              {t('login')}
            </Link>
          )}
          <Link
            href="/give"
            className="rounded-full bg-brand-navy px-5 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark"
          >
            {t('give')}
          </Link>
          <LocaleSwitcher />
        </div>
      </div>
    </header>
  )
}
