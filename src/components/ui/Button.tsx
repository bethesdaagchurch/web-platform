import { Link } from '@/i18n/navigation'
import type { ReactNode } from 'react'

type ButtonVariant = 'primary' | 'secondary' | 'outline'

interface ButtonProps {
  href: string
  variant?: ButtonVariant
  icon?: ReactNode
  children: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand-navy text-white hover:bg-brand-navy-dark',
  secondary: 'bg-white/10 text-white border border-white/40 hover:bg-white/20',
  outline: 'border border-brand-navy text-brand-navy hover:bg-brand-navy hover:text-white',
}

export function Button({ href, variant = 'primary', icon, children }: ButtonProps) {
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-md px-5 py-3 text-sm font-medium transition-colors ${variantClasses[variant]}`}
    >
      {icon}
      {children}
    </Link>
  )
}
