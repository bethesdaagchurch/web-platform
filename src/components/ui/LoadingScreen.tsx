import Image from 'next/image'
import { CrossSpinner } from '@/components/ui/CrossSpinner'

export function LoadingScreen() {
  return (
    <div className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-surface-cream px-6 py-16">
      <Image src="/images/login-background.jpg" alt="" fill priority className="object-cover opacity-10" />

      <div className="relative z-10 w-full max-w-sm rounded-card bg-white/95 p-10 text-center shadow-lg backdrop-blur">
        <div className="mx-auto flex h-24 w-24 items-center justify-center">
          <CrossSpinner size={96} />
        </div>
        <h1 className="mt-4 text-2xl font-semibold text-brand-navy">Preparing a space for worship&hellip;</h1>
        <p className="mt-2 text-sm text-ink-muted">Entering a moment of prayer and community.</p>
      </div>
    </div>
  )
}
