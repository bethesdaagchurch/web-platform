'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'
import { Send } from 'lucide-react'
import type { ChatMessage, SermonNote } from '@/types/live'

const avatarBg = { gold: 'bg-brand-gold-light text-brand-navy-dark', blue: 'bg-blue-100 text-brand-navy' } as const

export function LiveChatPanel({ messages, notes }: { messages: ChatMessage[]; notes: SermonNote[] }) {
  const [tab, setTab] = useState<'chat' | 'notes'>('chat')
  const t = useTranslations('live')

  return (
    <div className="flex h-full flex-col rounded-card bg-white shadow-sm ring-1 ring-black/5">
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

      {tab === 'chat' ? (
        <>
          <div className="flex-1 space-y-4 overflow-y-auto p-4">
            {messages.map((m) => (
              <div key={m.id} className="flex gap-2.5">
                <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${avatarBg[m.avatarColor]}`}>
                  {m.initials}
                </span>
                <div>
                  <p className="text-sm">
                    <span className="font-semibold text-ink">{m.name}</span>{' '}
                    <span className="text-xs text-ink-muted">{m.time}</span>
                  </p>
                  <p className="text-sm text-ink-muted">{m.message}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Static input — no chat backend exists yet, so this doesn't send anything. */}
          <div className="flex gap-2 border-t border-black/5 p-3">
            <input
              type="text"
              placeholder={t('sayHello')}
              className="flex-1 rounded-md border border-black/10 bg-surface-cream px-3 py-2 text-sm outline-none focus:border-brand-navy"
            />
            <button
              type="button"
              aria-label={t('sendMessage')}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-brand-navy text-white hover:bg-brand-navy-dark"
            >
              <Send size={14} />
            </button>
          </div>
        </>
      ) : (
        <div className="flex-1 space-y-3 p-4">
          {notes.map((note) => (
            <p key={note.id} className="text-sm text-ink-muted">
              {note.text}
            </p>
          ))}
        </div>
      )}
    </div>
  )
}
