import { defineRouting } from 'next-intl/routing'

// Adding Tamil/Kannada translation content is a later phase (see the
// project README). This phase only makes the route structure and language
// switching mechanism correct — 'ta' and 'kn' currently render the same
// English mock content as 'en' until real translations are wired in.
//
// localePrefix: 'as-needed' — English (the default) serves at clean URLs
// like /about with no prefix; Tamil and Kannada are explicit: /ta/about,
// /kn/about. Reconsider this if analytics later show most traffic prefers
// an explicit /en/ prefix too, but for a primarily-English-default site
// there's no reason to prefix the default locale.
export const routing = defineRouting({
  locales: ['en', 'ta', 'kn'],
  defaultLocale: 'en',
  localePrefix: 'as-needed',
})

export type AppLocale = (typeof routing.locales)[number]
