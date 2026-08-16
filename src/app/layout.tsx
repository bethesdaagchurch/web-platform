// This top-level layout intentionally has no <html>/<body> — (payload) and
// [locale] are siblings that each render a complete document themselves (see
// the comment in app/(payload)/layout.tsx), so this just passes children
// through. This is Next.js's documented pattern for route groups that need
// independent root documents.
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children
}
