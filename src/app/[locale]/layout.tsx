import type { Metadata } from 'next'
import { Inter, Noto_Sans_Tamil, Noto_Sans_Kannada } from 'next/font/google'
import { NextIntlClientProvider, hasLocale } from 'next-intl'
import { notFound } from 'next/navigation'
import { routing } from '@/i18n/routing'
import { NavigationProgress } from '@/components/ui/NavigationProgress'
import '../globals.css'

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' })

// Inter has no Tamil or Kannada glyphs at all — those are separate scripts.
// Without an explicit font, browsers fall back to whatever generic font the
// visitor's OS substitutes, which looks visually inconsistent on a site
// that otherwise has a deliberate typeface. Both load unconditionally (like
// Inter) and are applied via a :lang() CSS rule in globals.css keyed off
// the <html lang> attribute below — no per-component logic needed.
const notoSansTamil = Noto_Sans_Tamil({ subsets: ['tamil'], variable: '--font-noto-tamil' })
const notoSansKannada = Noto_Sans_Kannada({ subsets: ['kannada'], variable: '--font-noto-kannada' })

export const metadata: Metadata = {
  title: 'Bethesda AG Church',
  description: 'A place to belong, a place to grow.',
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  return (
    <html lang={locale}>
      <body className={`${inter.variable} ${notoSansTamil.variable} ${notoSansKannada.variable} font-sans`}>
        <NavigationProgress />
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  )
}
