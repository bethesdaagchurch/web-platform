'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft } from 'lucide-react'
import { Link } from '@/i18n/navigation'

// Detail pages here are always reached via a list page (ministries list,
// dashboard, etc.), so router.back() returns the visitor to wherever they
// actually came from — correct regardless of entry point. The fallback
// link only kicks in for a direct visit (shared URL, new tab) where there
// is no in-app history to go back to.
export function BackButton({ fallbackHref, label }: { fallbackHref: string; label: string }) {
  const router = useRouter()
  const [hasHistory, setHasHistory] = useState(false)

  useEffect(() => {
    setHasHistory(window.history.length > 1 && document.referrer.startsWith(window.location.origin))
  }, [])

  const className =
    'inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline'

  if (!hasHistory) {
    return (
      <Link href={fallbackHref} className={className}>
        <ArrowLeft size={16} />
        {label}
      </Link>
    )
  }

  return (
    <button type="button" onClick={() => router.back()} className={className}>
      <ArrowLeft size={16} />
      {label}
    </button>
  )
}
