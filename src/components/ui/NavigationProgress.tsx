'use client'

import { useEffect, useState } from 'react'
import { usePathname } from 'next/navigation'

// A top-of-page progress bar that appears the instant a user clicks any
// internal link, rather than waiting for the RSC round-trip that would
// otherwise be the first visible feedback (loading.tsx can't render until
// the server responds, which is exactly the delay users were noticing).
// We listen for clicks globally so this works for every <Link> in the app
// without touching each one individually, and clear it once the URL
// (and therefore the page) has actually changed.
export function NavigationProgress() {
  const pathname = usePathname()
  const [active, setActive] = useState(false)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return

      const anchor = (e.target as HTMLElement)?.closest('a')
      if (!anchor) return
      if (anchor.target && anchor.target !== '_self') return
      if (anchor.hasAttribute('download')) return

      const href = anchor.getAttribute('href')
      if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:')) return

      const url = new URL(anchor.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname && url.search === window.location.search) return

      setActive(true)
    }

    document.addEventListener('click', handleClick)
    return () => document.removeEventListener('click', handleClick)
  }, [])

  useEffect(() => {
    setActive(false)
  }, [pathname])

  if (!active) return null

  return (
    <div className="fixed inset-x-0 top-0 z-[100] h-1 overflow-hidden bg-transparent">
      <div className="h-full w-1/3 animate-nav-progress bg-brand-navy" />
    </div>
  )
}
