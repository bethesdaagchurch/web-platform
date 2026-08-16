import { Link } from '@/i18n/navigation'
import { Mail } from 'lucide-react'

export function LegalContactCta({
  heading,
  description,
  buttonLabel,
  buttonHref,
}: {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
}) {
  return (
    <div className="mt-8 flex flex-col items-start gap-5 rounded-card bg-white p-8 shadow-sm ring-1 ring-black/5 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h2 className="text-xl font-semibold text-ink">{heading}</h2>
        <p className="mt-2 max-w-md text-sm text-ink-muted">{description}</p>
      </div>
      <Link
        href={buttonHref}
        className="inline-flex shrink-0 items-center gap-2 rounded-md bg-brand-navy px-5 py-2.5 text-sm font-medium text-white hover:bg-brand-navy-dark"
      >
        {buttonLabel} <Mail size={14} />
      </Link>
    </div>
  )
}
