import createNextIntlPlugin from 'next-intl/plugin'
import { withPayload } from '@payloadcms/next/withPayload'

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // TODO: once Supabase Storage is wired up (Phase 2 of the architecture guide),
    // add your Supabase project's storage hostname here, e.g.:
    // remotePatterns: [{ protocol: 'https', hostname: '<project-ref>.supabase.co' }],
  },
}

export default withPayload(withNextIntl(nextConfig))
