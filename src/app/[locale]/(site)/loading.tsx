import { PageLoader } from '@/components/ui/PageLoader'

// Next.js's built-in convention: this renders automatically while any
// page nested under (site) is fetching data (every page here is an async
// Server Component hitting Payload), without needing to wire it into each
// page individually. Header/Footer stay visible throughout, since they
// live in (site)/layout.tsx, outside this Suspense boundary.
export default function Loading() {
  return <PageLoader />
}
