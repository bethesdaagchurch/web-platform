import type { LivePage as LivePageGlobal } from '@/payload-types'
import type { LiveStreamData, OnlineGivingData, InPersonData } from '@/types/live'
import { liveStream as mockStream, onlineGiving as mockGiving, inPerson as mockInPerson } from '@/data/live-mock'
import { extractYoutubeVideoId } from '@/lib/youtube'

export function adaptLiveStream(doc: LivePageGlobal | null): LiveStreamData {
  if (!doc?.stream) return mockStream
  return {
    isLive: doc.stream.isLive ?? mockStream.isLive,
    liveLabel: doc.stream.liveLabel || mockStream.liveLabel,
    title: doc.stream.title || mockStream.title,
    speaker: doc.stream.speaker || mockStream.speaker,
    bookReference: doc.stream.bookReference || mockStream.bookReference,
    youtubeChannelId: doc.stream.youtubeChannelId || mockStream.youtubeChannelId,
    // undefined (not a mock fallback) when blank — a fake video ID here
    // would either silently show a stranger's real YouTube chat or a
    // broken embed, neither of which is the honest "chat isn't open
    // right now" state this is meant to produce.
    currentLiveVideoId: doc.stream.currentLiveVideoUrl ? (extractYoutubeVideoId(doc.stream.currentLiveVideoUrl) ?? undefined) : undefined,
    sermonNotes: doc.stream.sermonNotes || undefined,
  }
}

export function adaptOnlineGiving(doc: LivePageGlobal | null): OnlineGivingData {
  if (!doc?.onlineGiving) return mockGiving
  return {
    heading: doc.onlineGiving.heading || mockGiving.heading,
    description: doc.onlineGiving.description || mockGiving.description,
    buttonLabel: doc.onlineGiving.buttonLabel || mockGiving.buttonLabel,
    buttonHref: doc.onlineGiving.buttonHref || mockGiving.buttonHref,
  }
}

export function adaptInPerson(doc: LivePageGlobal | null): InPersonData {
  if (!doc?.inPerson || !doc.inPerson.serviceTimes || doc.inPerson.serviceTimes.length === 0) return mockInPerson
  return {
    heading: doc.inPerson.heading || mockInPerson.heading,
    serviceTimes: doc.inPerson.serviceTimes.map((row, i) => ({
      id: row.id || `service-${i}`,
      label: row.label,
      time: row.time,
    })),
    directionsLabel: doc.inPerson.directionsLabel || mockInPerson.directionsLabel,
    directionsHref: doc.inPerson.directionsHref || mockInPerson.directionsHref,
  }
}
