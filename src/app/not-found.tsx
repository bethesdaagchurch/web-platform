import Link from 'next/link'

export default function RootNotFound() {
  return (
    <html lang="en">
      <body style={{ fontFamily: 'system-ui, sans-serif', textAlign: 'center', padding: '6rem 1.5rem' }}>
        <p style={{ color: '#C9A227', fontWeight: 600, fontSize: '0.875rem' }}>404</p>
        <h1 style={{ marginTop: '0.5rem', fontSize: '1.875rem', fontWeight: 600, color: '#092A4D' }}>
          Page not found
        </h1>
        <Link href="/" style={{ marginTop: '1rem', display: 'inline-block', color: '#0D3B66', fontSize: '0.875rem' }}>
          Back to home
        </Link>
      </body>
    </html>
  )
}
