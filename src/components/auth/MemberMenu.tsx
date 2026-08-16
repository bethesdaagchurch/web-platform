'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import { useTranslations } from 'next-intl'
import { ChevronDown, LayoutDashboard, LogOut } from 'lucide-react'
import { useRouter, Link } from '@/i18n/navigation'
import type { Member } from '@/payload-types'

function initialsFrom(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? '')
    .join('')
}

export function MemberMenu({ member }: { member: Member }) {
  const t = useTranslations('memberMenu')
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  async function handleLogout() {
    setLoading(true)
    await fetch('/api/members/logout', { method: 'POST', credentials: 'include' })
    router.push('/')
    router.refresh()
  }

  const avatarUrl = member.avatar && typeof member.avatar === 'object' ? member.avatar.url : null

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-full py-1 pl-1 pr-2 hover:bg-surface-cream"
      >
        {avatarUrl ? (
          <Image src={avatarUrl} alt="" width={32} height={32} className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-navy text-xs font-semibold text-white">
            {initialsFrom(member.name)}
          </span>
        )}
        <span className="hidden text-sm font-medium text-ink sm:inline">{member.name}</span>
        <ChevronDown size={14} className="text-ink-muted" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-44 rounded-md border border-black/10 bg-white py-1 shadow-md">
          <Link
            href="/dashboard"
            onClick={() => setOpen(false)}
            className="flex items-center gap-2 px-3 py-2 text-sm text-ink hover:bg-surface-cream"
          >
            <LayoutDashboard size={14} /> {t('dashboard')}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            disabled={loading}
            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-ink hover:bg-surface-cream disabled:opacity-60"
          >
            <LogOut size={14} /> {loading ? t('signingOut') : t('logOut')}
          </button>
        </div>
      )}
    </div>
  )
}
