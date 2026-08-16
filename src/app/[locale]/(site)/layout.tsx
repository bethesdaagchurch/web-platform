import { Header } from '@/components/homepage/Header'
import { Footer } from '@/components/homepage/Footer'
import { getCurrentMember } from '@/lib/get-member'

// Route group layout: (site) doesn't appear in the URL, but every page.tsx
// nested under app/(site)/ automatically gets this Header + Footer wrapper.
// This is why individual pages (below) don't import Header/Footer themselves.
//
// Now async: fetches the current member session once here and passes it
// into Header (a Client Component — can't call next/headers itself) as a
// prop, rather than each page re-deriving auth state independently.
export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const member = await getCurrentMember()

  return (
    <>
      <Header member={member} />
      <main>{children}</main>
      <Footer />
    </>
  )
}
