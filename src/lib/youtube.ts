// Handles the URL formats someone would realistically copy-paste from
// their browser's address bar or a "Share" button — not just the bare ID,
// since requiring that would mean explaining how to extract it every time.
export function extractYoutubeVideoId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  // Already looks like a bare video ID (11 chars, no slashes/params)
  if (/^[\w-]{11}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    if (url.hostname === 'youtu.be') {
      return url.pathname.slice(1) || null
    }
    if (url.hostname.includes('youtube.com')) {
      if (url.pathname === '/watch') return url.searchParams.get('v')
      const embedMatch = url.pathname.match(/^\/(embed|live|shorts)\/([\w-]{11})/)
      if (embedMatch) return embedMatch[2]
    }
  } catch {
    // Not a valid URL at all — fall through to null below.
  }

  return null
}

// Channel IDs (the "UC..." format YouTube's live-embed URL requires) don't
// appear in an @handle URL — only in /channel/UC... URLs or Studio's
// Advanced Settings page, which is what the admin.description points
// admins to. This just extracts the ID if they pasted a full URL rather
// than the raw ID.
export function extractYoutubeChannelId(input: string): string | null {
  const trimmed = input.trim()
  if (!trimmed) return null

  if (/^UC[\w-]{22}$/.test(trimmed)) return trimmed

  try {
    const url = new URL(trimmed)
    const match = url.pathname.match(/\/channel\/(UC[\w-]{22})/)
    if (match) return match[1]
  } catch {
    // Not a valid URL — fall through to null below.
  }

  return null
}
