export interface LiveStreamData {
  isLive: boolean
  liveLabel: string
  title: string
  speaker: string
  bookReference: string
  youtubeChannelId: string
  // Extracted video ID (not the raw URL) — undefined whenever the admin
  // hasn't pasted this week's live video URL, which is the normal state
  // outside of an actual live stream.
  currentLiveVideoId?: string
  sermonNotes?: string
}

export interface OnlineGivingData {
  heading: string
  description: string
  buttonLabel: string
  buttonHref: string
}

export interface ServiceTimeRow {
  id: string
  label: string
  time: string
}

export interface InPersonData {
  heading: string
  serviceTimes: ServiceTimeRow[]
  directionsLabel: string
  directionsHref: string
}
