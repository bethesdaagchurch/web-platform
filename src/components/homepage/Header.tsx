'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Menu, X, LayoutDashboard, LogOut } from 'lucide-react'
import { Link, usePathname, useRouter } from '@/i18n/navigation'
import { LocaleSwitcher } from '@/components/ui/LocaleSwitcher'
import { MemberMenu } from '@/components/auth/MemberMenu'
import { siteSettings } from '@/data/homepage-mock'
import type { Member } from '@/payload-types'

export function Header({ member }: { member: Member | null }) {
  const pathname = usePathname()
  const router = useRouter()
  const t = useTranslations('header')
  const tNav = useTranslations('nav')
  const tMemberMenu = useTranslations('memberMenu')
  const [mobileOpen, setMobileOpen] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)

  async function handleMobileLogout() {
    setLoggingOut(true)
    await fetch('/api/members/logout', { method: 'POST', credentials: 'include' })
    setMobileOpen(false)
    router.push('/')
    router.refresh()
  }

  return (
    <header className="sticky top-0 z-50 border-b border-black/5 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-content items-center justify-between px-6 py-4">
        <Link href="/" className="text-lg font-semibold text-brand-navy" onClick={() => setMobileOpen(false)}>
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
          <div className="hidden items-center gap-4 sm:flex">
            {member ? (
              <MemberMenu member={member} />
            ) : (
              <Link href="/login" className="text-sm font-medium text-brand-navy hover:underline">
                {t('login')}
              </Link>
            )}
          </div>
          <Link
            href="/give"
            className="hidden rounded-full bg-brand-navy px-5 py-2 text-sm font-medium text-white hover:bg-brand-navy-dark sm:inline-block"
          >
            {t('give')}
          </Link>
          <div className="hidden md:block">
            <LocaleSwitcher />
          </div>

          {/* The nav above is completely hidden below md — this is the
              only way to reach any page at all on a phone-sized screen,
              so it needs to cover everything the desktop nav offers:
              page links, login/member menu, Give, and the language
              switcher, not just the page links. */}
          <button
            type="button"
            onClick={() => setMobileOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-md text-ink md:hidden"
            aria-label={mobileOpen ? t('closeMenu') : t('openMenu')}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-black/5 bg-white px-6 py-4 md:hidden">
          <nav className="flex flex-col gap-1">
            {siteSettings.nav.map((item) => {
              const isActive = item.href === '/' ? pathname === '/' : pathname.startsWith(item.href)
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`rounded-md px-3 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-surface-cream text-brand-navy' : 'text-ink-muted hover:bg-surface-cream hover:text-brand-navy'
                  }`}
                >
                  {tNav(item.key)}
                </Link>
              )
            })}
          </nav>

          <div className="mt-3 border-t border-black/5 pt-3">
            {member ? (
              // Not reusing MemberMenu here on purpose — its dropdown
              // pattern makes sense in the compact desktop header, but
              // inside an already-open mobile panel it would mean two
              // taps to reach Dashboard or Log Out. Shown directly and
              // stacked instead, matching the rest of this panel.
              <>
                <p className="px-3 py-1.5 text-sm font-medium text-ink">{member.name}</p>
                <Link
                  href="/dashboard"
                  onClick={() => setMobileOpen(false)}
                  className="flex items-center gap-2 rounded-md px-3 py-2.5 text-sm text-ink-muted hover:bg-surface-cream hover:text-brand-navy"
                >
                  <LayoutDashboard size={16} /> {tMemberMenu('dashboard')}
                </Link>
                <button
                  type="button"
                  onClick={handleMobileLogout}
                  disabled={loggingOut}
                  className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-sm text-ink-muted hover:bg-surface-cream hover:text-brand-navy disabled:opacity-60"
                >
                  <LogOut size={16} /> {loggingOut ? tMemberMenu('signingOut') : tMemberMenu('logOut')}
                </button>
              </>
            ) : (
              <Link href="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2.5 text-sm font-medium text-brand-navy hover:underline">
                {t('login')}
              </Link>
            )}
            <div className="mt-2 flex justify-end px-3">
              <LocaleSwitcher />
            </div>
          </div>

          <Link
            href="/give"
            onClick={() => setMobileOpen(false)}
            className="mt-3 block rounded-full bg-brand-navy px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-brand-navy-dark"
          >
            {t('give')}
          </Link>
        </div>
      )}
    </header>
  )
}
