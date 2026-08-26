'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { MessageCircle, ExternalLink } from 'lucide-react'

// YouTube's live chat embed requires the exact hostname the page is
// served from, or it silently refuses to open (see LivePage.stream.
// currentLiveVideoUrl's admin description for the full reasoning on why
// this needs a specific video, not just a channel). Derived from the same
// env var used elsewhere for absolute links rather than a new one.
function siteHostname(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000').hostname
  } catch {
    return 'localhost'
  }
}

// Chat temporarily disabled — reported directly, with a screenshot: even
// with dark_theme=0 (an undocumented, community-discovered parameter, not
// an official one YouTube guarantees), the embedded chat still rendered
// mostly dark — header bar and message text both unreadable against this
// panel's light UI. That's a cross-origin iframe serving youtube.com's own
// content; there's no way to reach into it and override its internal CSS
// from this site. Rather than keep guessing at undocumented parameters,
// the decision was to fall back to showing sermon notes only for now.
// The chat implementation itself is left fully intact below (not deleted)
// specifically so this is a one-line revert if YouTube's behavior improves
// or a different embed approach is found later — just flip this back to
// true.
const CHAT_ENABLED = false

export function LiveChatPanel({ currentLiveVideoId, sermonNotes }: { currentLiveVideoId?: string; sermonNotes?: string }) {
  const [tab, setTab] = useState<'chat' | 'notes'>(CHAT_ENABLED ? 'chat' : 'notes')
  const t = useTranslations('live')

  return (
    <div className="flex h-full flex-col rounded-card bg-white shadow-sm ring-1 ring-black/5">
      {CHAT_ENABLED ? (
        <div className="flex border-b border-black/5">
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium ${
              tab === 'chat' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t('liveChat')}
          </button>
          <button
            onClick={() => setTab('notes')}
            className={`flex-1 border-b-2 px-4 py-3 text-sm font-medium ${
              tab === 'notes' ? 'border-brand-navy text-brand-navy' : 'border-transparent text-ink-muted hover:text-ink'
            }`}
          >
            {t('sermonNotes')}
          </button>
        </div>
      ) : (
        <div className="border-b border-black/5 px-4 py-3">
          <span className="border-b-2 border-brand-navy pb-3 text-sm font-medium text-brand-navy">{t('sermonNotes')}</span>
        </div>
      )}

      {CHAT_ENABLED && tab === 'chat' ? (
        currentLiveVideoId ? (
          <>
            {/* YouTube's live chat embed is desktop-only — confirmed directly
                from YouTube's own help docs, not assumed. Mobile gets a
                link to watch (and chat) on YouTube directly instead of a
                broken or blank embed. */}
            {/* dark_theme=0 forces YouTube's light chat theme regardless of
                the viewer's own device/browser preference — without it, a
                device set to dark mode renders chat text in colors meant
                for a dark background, which is unreadable against this
                panel's white UI (reported directly, with a screenshot
                showing exactly this). This is a long-standing, widely-used
                parameter in the OBS/streaming community for this exact
                purpose, though it isn't in YouTube's own formal embed
                documentation — flagging that distinction here rather than
                presenting it as officially guaranteed. In practice it only
                partially worked (see CHAT_ENABLED above), which is why
                this whole branch is currently unreachable. */}
            <iframe
              src={`https://www.youtube.com/live_chat?v=${currentLiveVideoId}&embed_domain=${siteHostname()}&dark_theme=0`}
              title={t('liveChat')}
              className="hidden min-h-[400px] flex-1 border-0 md:block"
            />
            <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center md:hidden">
              <MessageCircle size={28} className="text-ink-muted" />
              <p className="text-sm text-ink-muted">{t('chatMobileUnavailable')}</p>
              <a
                href={`https://www.youtube.com/watch?v=${currentLiveVideoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-sm font-medium text-brand-navy hover:underline"
              >
                {t('watchOnYoutube')} <ExternalLink size={13} />
              </a>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center p-6 text-center">
            <p className="text-sm text-ink-muted">{t('chatNotOpen')}</p>
          </div>
        )
      ) : (
        <div className="flex-1 space-y-3 p-4">
          {sermonNotes ? (
            sermonNotes.split('\n').map((line, i) => (
              <p key={i} className="text-sm text-ink-muted">
                {line}
              </p>
            ))
          ) : (
            <p className="text-sm text-ink-muted">{t('sermonNotesNotPosted')}</p>
          )}
        </div>
      )}
    </div>
  )
}
