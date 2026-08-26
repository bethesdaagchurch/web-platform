import { getTranslations } from 'next-intl/server'
import { LiveHero } from '@/components/live/LiveHero'
import { LiveStreamPlayer } from '@/components/live/LiveStreamPlayer'
import { LiveChatPanel } from '@/components/live/LiveChatPanel'
import { OnlineGivingCard } from '@/components/live/OnlineGivingCard'
import { InPersonCard } from '@/components/live/InPersonCard'
import { MembersOnlyGate } from '@/components/auth/MembersOnlyGate'

import { getPayloadClient } from '@/lib/payload'
import { getCurrentMember } from '@/lib/get-member'
import { adaptLiveStream, adaptOnlineGiving, adaptInPerson } from '@/lib/live-adapter'

// See the Prayer page for the full explanation — forces dynamic rendering
// since the chat panel's gated/unlocked state depends on session.
export const dynamic = 'force-dynamic'

export default async function LivePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const payload = await getPayloadClient()
  const typedLocale = locale as 'en' | 'ta' | 'kn'

  const [doc, member, tGate] = await Promise.all([
    payload.findGlobal({ slug: 'live-page', locale: typedLocale }),
    getCurrentMember(),
    getTranslations('membersOnlyGate'),
  ])

  const stream = adaptLiveStream(doc)

  return (
    <div className="pb-16">
      <LiveHero data={stream} />

      <div className="mx-auto mt-6 max-w-content px-6">
        <div className="grid gap-6 md:grid-cols-[1.8fr_1fr]">
          <LiveStreamPlayer data={stream} />
          <MembersOnlyGate member={member} prompt={tGate('liveChatPrompt')}>
            <LiveChatPanel currentLiveVideoId={stream.currentLiveVideoId} sermonNotes={stream.sermonNotes} />
          </MembersOnlyGate>
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-2">
          <OnlineGivingCard data={adaptOnlineGiving(doc)} />
          <InPersonCard data={adaptInPerson(doc)} />
        </div>
      </div>
    </div>
  )
}
